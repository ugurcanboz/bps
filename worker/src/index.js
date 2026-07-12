import {corsHeaders, enforceRateLimit, isOriginAllowed, jsonResponse, productionReadiness, requireJsonContentType, safeErrorCode, suspiciousInput, validRequestId, validatePayload} from './security.js';
import {PROMPT_ENGINE_VERSION, promptDescriptor, systemPrompt} from './prompts.js';
import {CONTEXT_ENGINE_VERSION, buildContextBlock, tokenBudget} from './context.js';
import {AI_SECURITY_VERSION, inspectUntrustedPayload, validateModelOutput, wrapUntrusted} from './ai-security.js';
import {MONITORING_VERSION, authorizeMetrics, metricsSnapshot, recordMetric, validateClientEvents, recordClientEvents} from './monitoring.js';
import {API_SECURITY_VERSION, enforceReplayProtection, rejectDangerousHeaders, validateRequestSurface} from './api-security.js';

const VERSION = 'G54.50.2D';
const ROUTES = new Map([
  ['/api/coach','coach'],
  ['/api/speaking','speaking'],
  ['/api/exam-speaking','exam-speaking']
]);

function requestId(request) {
  const supplied=request.headers.get('X-Request-ID') || '';
  return validRequestId(supplied) ? supplied : crypto.randomUUID();
}

function routeAllowsMissingOrigin(url, request) {
  return request.method === 'GET' && (url.pathname === '/api/health' || url.pathname === '/api/metrics');
}

function parseModelJson(content) {
  const text = String(content || '').trim().replace(/^```json\s*/i,'').replace(/```$/,'').trim();
  try { return JSON.parse(text); } catch { throw Object.assign(new Error('INVALID_MODEL_OUTPUT'),{status:502,retryable:false}); }
}

function sleep(ms) { return new Promise(resolve=>setTimeout(resolve,ms)); }
function numberEnv(env,name,fallback,min,max) {
  const value = Number(env[name] ?? fallback);
  return Math.min(max,Math.max(min,Number.isFinite(value)?value:fallback));
}
function parseRetryAfter(value) {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0,seconds*1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0,date-Date.now()) : 0;
}
function retryDelay(attempt, response, env) {
  const base = numberEnv(env,'UPSTREAM_RETRY_BASE_MS',450,100,5000);
  const cap = numberEnv(env,'UPSTREAM_RETRY_MAX_DELAY_MS',5000,250,30000);
  const server = parseRetryAfter(response?.headers?.get('Retry-After'));
  const exponential = Math.min(cap,base * (2 ** Math.max(0,attempt-1)));
  const jitter = Math.floor(Math.random() * Math.max(25,exponential * 0.25));
  return Math.min(cap,Math.max(server,exponential+jitter));
}
function isRetryableStatus(status) { return status === 408 || status === 425 || status === 429 || status >= 500; }


function wantsStream(request, url, kind) {
  if (kind !== 'coach') return false;
  return url.searchParams.get('stream') === '1' || String(request.headers.get('Accept') || '').includes('text/event-stream');
}
function sseEvent(type, data) {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}
async function streamGroq(kind, data, env, reqId, origin, started, route) {
  if (!env.GROQ_API_KEY) throw Object.assign(new Error('SERVER_NOT_CONFIGURED'),{status:503,retryable:false});
  const messages = [{role:'system',content:systemPrompt(kind,data)}];
  for (const item of data.history) messages.push(item);
  let user = `${wrapUntrusted('TOPIC',data.topic,240)}\n${wrapUntrusted('USER_TEXT',data.userText,4000)}`;
  const contextBlock = buildContextBlock(data.context);
  if (contextBlock) user += `\n${wrapUntrusted('LEARNER_CONTEXT',contextBlock,2600)}`;
  messages.push({role:'user',content:user});
  const payload = {model:env.GROQ_MODEL || 'llama-3.3-70b-versatile',messages,temperature:0.45,max_tokens:700,stream:true,stream_options:{include_usage:true}};
  const controller = new AbortController();
  const timeout = numberEnv(env,'UPSTREAM_STREAM_TIMEOUT_MS',45000,10000,120000);
  const timer = setTimeout(()=>controller.abort(),timeout);
  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json','X-Request-ID':reqId},body:JSON.stringify(payload),signal:controller.signal});
  if (!upstream.ok || !upstream.body) {
    clearTimeout(timer);
    const raw = await upstream.text().catch(()=> '');
    throw Object.assign(new Error(upstream.status===429?'RATE_LIMITED':'UPSTREAM_UNAVAILABLE'),{status:upstream.status===429?429:502,retryable:isRetryableStatus(upstream.status)});
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';
  let usage = null;
  const stream = new ReadableStream({
    async start(ctrl) {
      const reader = upstream.body.getReader();
      const descriptor = promptDescriptor(kind,data);
      ctrl.enqueue(encoder.encode(sseEvent('meta',{ok:true,requestId:reqId,version:VERSION,promptEngineVersion:PROMPT_ENGINE_VERSION,contextEngineVersion:CONTEXT_ENGINE_VERSION,role:descriptor.role,level:descriptor.level,language:descriptor.language,model:env.GROQ_MODEL || 'llama-3.3-70b-versatile'})));
      try {
        while (true) {
          const {done,value} = await reader.read();
          if (done) break;
          buffer += decoder.decode(value,{stream:true});
          const lines = buffer.split('\n'); buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payloadText = trimmed.slice(5).trim();
            if (payloadText === '[DONE]') continue;
            let item; try { item = JSON.parse(payloadText); } catch { continue; }
            if (item?.usage) usage = item.usage;
            const token = item?.choices?.[0]?.delta?.content || '';
            if (token) ctrl.enqueue(encoder.encode(sseEvent('token',{text:token}))); 
          }
        }
        ctrl.enqueue(encoder.encode(sseEvent('done',{ok:true,requestId:reqId,usage})));
        await recordMetric(env,{ok:true,status:200,route,model:env.GROQ_MODEL || 'llama-3.3-70b-versatile',usage,attempts:1,latencyMs:Date.now()-started});
        ctrl.close();
      } catch (error) {
        await recordMetric(env,{ok:false,status:error?.name==='AbortError'?504:502,route,model:env.GROQ_MODEL || 'llama-3.3-70b-versatile',error:error?.name==='AbortError'?'UPSTREAM_TIMEOUT':(error?.message||'STREAM_FAILED'),attempts:1,latencyMs:Date.now()-started});
        if (error?.name !== 'AbortError') ctrl.enqueue(encoder.encode(sseEvent('error',{ok:false,error:safeErrorCode(error,'UPSTREAM_UNAVAILABLE'),requestId:reqId})));
        ctrl.close();
      } finally { clearTimeout(timer); try{reader.releaseLock();}catch{} }
    },
    cancel() { clearTimeout(timer); controller.abort(); }
  });
  return new Response(stream,{status:200,headers:{...corsHeaders(origin,env),'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no','X-Request-ID':reqId}});
}

async function readJsonLimited(request, env) {
  const max = Math.max(4096, Number(env.MAX_BODY_BYTES || 24576));
  const length = Number(request.headers.get('content-length') || 0);
  if (length > max) throw Object.assign(new Error('PAYLOAD_TOO_LARGE'),{status:413});
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > max) throw Object.assign(new Error('PAYLOAD_TOO_LARGE'),{status:413});
  try { return JSON.parse(text); } catch { throw Object.assign(new Error('INVALID_JSON'),{status:400}); }
}

async function fetchGroqOnce(payload, env, reqId) {
  const controller = new AbortController();
  const timeout = numberEnv(env,'UPSTREAM_TIMEOUT_MS',16000,5000,60000);
  const timer = setTimeout(()=>controller.abort(),timeout);
  try {
    return await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json','X-Request-ID':reqId},
      body:JSON.stringify(payload),
      signal:controller.signal
    });
  } finally { clearTimeout(timer); }
}

async function callGroq(kind, data, env, reqId) {
  if (!env.GROQ_API_KEY) throw Object.assign(new Error('SERVER_NOT_CONFIGURED'),{status:503,retryable:false});
  const messages = [{role:'system',content:systemPrompt(kind,data)}];
  for (const item of data.history) messages.push(item);
  let user = `${wrapUntrusted('TOPIC',data.topic,240)}\n${wrapUntrusted('USER_TEXT',data.userText,4000)}`;
  if (data.requiredPoints.length) user += `\n${wrapUntrusted('REQUIRED_POINTS',data.requiredPoints.join(' | '),3000)}`;
  const contextBlock = buildContextBlock(data.context);
  if (contextBlock) user += `\n${wrapUntrusted('LEARNER_CONTEXT',contextBlock,2600)}`;
  messages.push({role:'user',content:user});
  const budget = tokenBudget(kind,data.history,data.context);
  const payload = {model:env.GROQ_MODEL || 'llama-3.3-70b-versatile',messages,temperature:kind==='coach'?0.45:0.15,max_tokens:budget.maxOutputTokens,response_format:{type:'json_object'}};
  const maxAttempts = numberEnv(env,'UPSTREAM_MAX_ATTEMPTS',3,1,5);
  let lastError = null;
  for (let attempt=1; attempt<=maxAttempts; attempt++) {
    let response;
    try {
      response = await fetchGroqOnce(payload,env,reqId);
      const raw = await response.text();
      let body; try { body=JSON.parse(raw); } catch { body={}; }
      if (response.ok) {
        const parsed = parseModelJson(body?.choices?.[0]?.message?.content || '');
        const checkedOutput = validateModelOutput(kind,promptDescriptor(kind,data).role,parsed);
        if (!checkedOutput.ok) throw Object.assign(new Error(checkedOutput.error),{status:502,retryable:false});
        const result = checkedOutput.value;
        return {result,usage:body.usage || null,model:body.model || env.GROQ_MODEL || null,attempts:attempt,prompt:promptDescriptor(kind,data),context:{version:CONTEXT_ENGINE_VERSION,budget}};
      }
      const retryable = isRetryableStatus(response.status);
      const error = new Error(body?.error?.message || `GROQ_HTTP_${response.status}`);
      error.status = response.status === 429 ? 429 : (response.status >= 500 ? 502 : response.status);
      error.upstreamStatus = response.status;
      error.retryable = retryable;
      error.retryAfter = Math.ceil(parseRetryAfter(response.headers.get('Retry-After'))/1000);
      lastError = error;
      if (!retryable || attempt >= maxAttempts) throw error;
      const delayMs = retryDelay(attempt,response,env);
      console.warn(JSON.stringify({event:'groq_retry',requestId:reqId,attempt,nextAttempt:attempt+1,upstreamStatus:response.status,delayMs}));
      await sleep(delayMs);
    } catch (error) {
      if (error?.name === 'AbortError') {
        lastError = Object.assign(new Error('UPSTREAM_TIMEOUT'),{status:504,retryable:true});
      } else if (!lastError || error !== lastError) {
        lastError = Object.assign(error instanceof Error ? error : new Error(String(error)),{status:error?.status || 502,retryable:error?.retryable !== false});
      }
      if (lastError.retryable === false || attempt >= maxAttempts) throw lastError;
      const delayMs = retryDelay(attempt,null,env);
      console.warn(JSON.stringify({event:'groq_retry',requestId:reqId,attempt,nextAttempt:attempt+1,error:lastError.message,delayMs}));
      await sleep(delayMs);
    }
  }
  throw lastError || Object.assign(new Error('UPSTREAM_UNAVAILABLE'),{status:502,retryable:true});
}

export default {
  async fetch(request, env, ctx) {
    const started = Date.now();
    const origin = request.headers.get('Origin') || '';
    const reqId = requestId(request);
    const url = new URL(request.url);
    const surface = validateRequestSurface(request,url);
    if (!surface.ok) return jsonResponse({ok:false,error:surface.error,requestId:reqId,retryable:false},400,origin,env,{'X-Request-ID':reqId});
    const headerCheck = rejectDangerousHeaders(request);
    if (!headerCheck.ok) return jsonResponse({ok:false,error:headerCheck.error,requestId:reqId,retryable:false},400,origin,env,{'X-Request-ID':reqId});
    if (!isOriginAllowed(origin,env,{allowMissing:routeAllowsMissingOrigin(url,request)})) return jsonResponse({ok:false,error:'ORIGIN_NOT_ALLOWED',requestId:reqId,retryable:false},403,origin,env,{'X-Request-ID':reqId});
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{...corsHeaders(origin,env),'X-Request-ID':reqId}});
    if (url.pathname === '/api/health' && request.method === 'GET') { const readiness=productionReadiness(env); return jsonResponse({ok:true,ready:readiness.ok,missing:readiness.missing,service:'assessments-groq-worker',version:VERSION,environment:env.APP_ENV || 'unknown',rateLimitStorage:!!(env.API_RATE_LIMITER || env.RATE_LIMIT_KV),rateLimitMode:env.API_RATE_LIMITER?'native':(env.RATE_LIMIT_KV?'kv':'none'),monitoringStorage:!!env.SECURITY_KV,monitoringProtected:!!env.MONITORING_TOKEN,monitoringVersion:MONITORING_VERSION,apiSecurityVersion:API_SECURITY_VERSION,promptEngineVersion:PROMPT_ENGINE_VERSION,aiSecurityVersion:AI_SECURITY_VERSION,retryPolicy:{maxAttempts:numberEnv(env,'UPSTREAM_MAX_ATTEMPTS',3,1,5),baseDelayMs:numberEnv(env,'UPSTREAM_RETRY_BASE_MS',450,100,5000)}},200,origin,env,{'X-Request-ID':reqId}); }
    if (url.pathname === '/api/client-events' && request.method === 'POST') {
      if (!requireJsonContentType(request)) return jsonResponse({ok:false,error:'INVALID_CONTENT_TYPE',requestId:reqId},415,origin,env,{'X-Request-ID':reqId});
      try {
        const rate=await enforceRateLimit(request,env);
        if(!rate.allowed) return jsonResponse({ok:false,error:'RATE_LIMITED',requestId:reqId},429,origin,env,{'Retry-After':String(rate.retryAfter),'X-Request-ID':reqId});
        const input=await readJsonLimited(request,env);
        const checked=validateClientEvents(input);
        if(!checked.ok) return jsonResponse({ok:false,error:checked.error,requestId:reqId},400,origin,env,{'X-Request-ID':reqId});
        const stored=await recordClientEvents(env,checked.events);
        return jsonResponse({ok:true,accepted:checked.events.length,stored:stored.stored,requestId:reqId},202,origin,env,{'X-Request-ID':reqId,'Cache-Control':'no-store'});
      } catch(error) { return jsonResponse({ok:false,error:error?.message||'CLIENT_EVENT_FAILED',requestId:reqId},Number(error?.status||500),origin,env,{'X-Request-ID':reqId}); }
    }
    if (url.pathname === '/api/metrics' && request.method === 'GET') {
      if (!authorizeMetrics(request,env)) return jsonResponse({ok:false,error:'UNAUTHORIZED',requestId:reqId},401,origin,env,{'X-Request-ID':reqId});
      const snapshot=await metricsSnapshot(env,url.searchParams.get('hours')||24);
      return jsonResponse({...snapshot,requestId:reqId},snapshot.ok?200:503,origin,env,{'X-Request-ID':reqId,'Cache-Control':'no-store'});
    }
    const kind = ROUTES.get(url.pathname);
    if (!kind) return jsonResponse({ok:false,error:'NOT_FOUND',requestId:reqId,retryable:false},404,origin,env,{'X-Request-ID':reqId});
    if (request.method !== 'POST') return jsonResponse({ok:false,error:'METHOD_NOT_ALLOWED',requestId:reqId,retryable:false},405,origin,env,{'Allow':'POST,OPTIONS','X-Request-ID':reqId});
    try {
      if (!requireJsonContentType(request)) return jsonResponse({ok:false,error:'INVALID_CONTENT_TYPE',requestId:reqId,retryable:false},415,origin,env,{'X-Request-ID':reqId});
      const readiness=productionReadiness(env);
      if (readiness.production && !readiness.ok) return jsonResponse({ok:false,error:'SERVER_NOT_CONFIGURED',requestId:reqId,retryable:false},503,origin,env,{'X-Request-ID':reqId});
      const rate = await enforceRateLimit(request,env);
      if (!rate.allowed) return jsonResponse({ok:false,error:'RATE_LIMITED',retryAfter:rate.retryAfter,requestId:reqId,retryable:true},429,origin,env,{'Retry-After':String(rate.retryAfter),'X-Request-ID':reqId});
      const replay = await enforceReplayProtection(request,env,url.pathname);
      if (!replay.ok) return jsonResponse({ok:false,error:replay.error,requestId:reqId,retryable:false},replay.status,origin,env,{'X-Request-ID':reqId});
      const input = await readJsonLimited(request,env);
      const checked = validatePayload(kind,input,env);
      if (!checked.ok) return jsonResponse({ok:false,error:checked.error,requestId:reqId,retryable:false},400,origin,env,{'X-Request-ID':reqId});
      const aiInspection=inspectUntrustedPayload(checked.value);
      if (aiInspection.suspicious || suspiciousInput(checked.value.userText)) return jsonResponse({ok:false,error:'UNSAFE_INSTRUCTION_PATTERN',message:'Die Eingabe enthält eine nicht erlaubte Anweisung.',requestId:reqId,retryable:false},400,origin,env,{'X-Request-ID':reqId});
      if (wantsStream(request,url,kind)) return await streamGroq(kind,checked.value,env,reqId,origin,started,url.pathname);
      const upstream = await callGroq(kind,checked.value,env,reqId);
      const metric={ok:true,status:200,route:url.pathname,model:upstream.model,usage:upstream.usage,attempts:upstream.attempts,latencyMs:Date.now()-started};
      if (ctx?.waitUntil) ctx.waitUntil(recordMetric(env,metric)); else await recordMetric(env,metric);
      console.log(JSON.stringify({event:'groq_success',requestId:reqId,path:url.pathname,level:checked.value.level,latencyMs:Date.now()-started,model:upstream.model,totalTokens:upstream.usage?.total_tokens || null,attempts:upstream.attempts}));
      return jsonResponse({ok:true,...upstream.result,meta:{requestId:reqId,version:VERSION,model:upstream.model,latencyMs:Date.now()-started,attempts:upstream.attempts,promptEngineVersion:PROMPT_ENGINE_VERSION,contextEngineVersion:CONTEXT_ENGINE_VERSION,role:upstream.prompt.role,level:upstream.prompt.level,language:upstream.prompt.language,assessmentScope:kind==='coach'?undefined:'text-transcript-only'}},200,origin,env,{'X-Request-ID':reqId,'X-RateLimit-Remaining':rate.remaining==null?'unknown':String(rate.remaining),'X-Replay-Protection':replay.used?(replay.degraded?'degraded':'active'):'not-requested'});
    } catch (error) {
      const status = Number(error?.status || 500);
      const code = safeErrorCode(error,'INTERNAL_ERROR');
      const retryable = error?.retryable !== false && (status === 429 || status === 502 || status === 503 || status === 504);
      const metric={ok:false,status,route:url.pathname,model:env.GROQ_MODEL || null,attempts:1,error:code,latencyMs:Date.now()-started};
      if (ctx?.waitUntil) ctx.waitUntil(recordMetric(env,metric)); else await recordMetric(env,metric);
      console.error(JSON.stringify({event:'groq_error',requestId:reqId,path:url.pathname,status,error:code,retryable,latencyMs:Date.now()-started}));
      const headers = {'X-Request-ID':reqId};
      if (error?.retryAfter) headers['Retry-After'] = String(error.retryAfter);
      return jsonResponse({ok:false,error:code,requestId:reqId,retryable,retryAfter:error?.retryAfter || null},status,origin,env,headers);
    }
  }
};
