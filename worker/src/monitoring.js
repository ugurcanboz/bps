export const MONITORING_VERSION = 'G54.47.12E-monitoring-v1';

function n(value){ const x=Number(value); return Number.isFinite(x)?x:0; }
function bucket(ts=Date.now()){ return new Date(ts).toISOString().slice(0,13).replace(/[-T:]/g,''); }
function safeKey(value){ return String(value||'unknown').toLowerCase().replace(/[^a-z0-9._-]+/g,'_').slice(0,60) || 'unknown'; }
function empty(){ return {requests:0,successes:0,errors:0,retries:0,rateLimited:0,timeouts:0,latencyTotalMs:0,latencyMaxMs:0,inputTokens:0,outputTokens:0,totalTokens:0,models:{},statuses:{},routes:{},updatedAt:null}; }
function merge(target,event){
  target.requests += 1;
  if(event.ok) target.successes += 1; else target.errors += 1;
  target.retries += Math.max(0,n(event.attempts)-1);
  if(n(event.status)===429) target.rateLimited += 1;
  if(n(event.status)===504 || event.error==='UPSTREAM_TIMEOUT') target.timeouts += 1;
  const latency=Math.max(0,n(event.latencyMs)); target.latencyTotalMs += latency; target.latencyMaxMs=Math.max(target.latencyMaxMs,latency);
  const usage=event.usage||{}; target.inputTokens += n(usage.prompt_tokens); target.outputTokens += n(usage.completion_tokens); target.totalTokens += n(usage.total_tokens);
  const model=safeKey(event.model); target.models[model]=(target.models[model]||0)+1;
  const status=String(n(event.status)||0); target.statuses[status]=(target.statuses[status]||0)+1;
  const route=safeKey(event.route); target.routes[route]=(target.routes[route]||0)+1;
  target.updatedAt=new Date().toISOString(); return target;
}

async function readJson(kv,key){ try { const raw=await kv.get(key); return raw?JSON.parse(raw):null; } catch { return null; } }
export async function recordMetric(env,event){
  const kv=env.SECURITY_KV; if(!kv) return {stored:false,reason:'SECURITY_KV_NOT_CONFIGURED'};
  const key=`metrics:hour:${bucket()}`;
  const current=(await readJson(kv,key))||empty();
  const next=merge(current,event);
  await kv.put(key,JSON.stringify(next),{expirationTtl:60*60*24*14});
  await kv.put('metrics:latest',key,{expirationTtl:60*60*24*14});
  return {stored:true,key};
}
export function authorizeMetrics(request,env){
  const configured=String(env.MONITORING_TOKEN||'');
  if(!configured) return false;
  const provided=String(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'') || String(request.headers.get('X-Monitoring-Token')||'');
  return provided.length===configured.length && provided===configured;
}
export async function metricsSnapshot(env,hours=24){
  const kv=env.SECURITY_KV; if(!kv) return {ok:false,error:'MONITORING_STORAGE_NOT_CONFIGURED'};
  const count=Math.min(168,Math.max(1,Number(hours)||24)); const periods=[]; const total=empty();
  const now=new Date();
  for(let i=count-1;i>=0;i--){ const d=new Date(now.getTime()-i*3600000); const key=`metrics:hour:${bucket(d.getTime())}`; const item=await readJson(kv,key); if(item){ periods.push({hour:key.slice(-10),...item});
      total.requests+=n(item.requests); total.successes+=n(item.successes); total.errors+=n(item.errors); total.retries+=n(item.retries); total.rateLimited+=n(item.rateLimited); total.timeouts+=n(item.timeouts); total.latencyTotalMs+=n(item.latencyTotalMs); total.latencyMaxMs=Math.max(total.latencyMaxMs,n(item.latencyMaxMs)); total.inputTokens+=n(item.inputTokens); total.outputTokens+=n(item.outputTokens); total.totalTokens+=n(item.totalTokens);
      for(const field of ['models','statuses','routes']) for(const [k,v] of Object.entries(item[field]||{})) total[field][k]=(total[field][k]||0)+n(v);
  }}
  total.updatedAt=new Date().toISOString();
  return {ok:true,version:MONITORING_VERSION,hours:count,summary:{...total,successRate:total.requests?Number((total.successes/total.requests*100).toFixed(2)):100,averageLatencyMs:total.requests?Math.round(total.latencyTotalMs/total.requests):0},periods};
}

const CLIENT_EVENT_TYPES=new Set(['javascript_error','promise_rejection','resource_error','api_error','api_failure','offline','online','audio_error','exam_start','exam_complete','exam_abort']);
export function validateClientEvents(input){
  if(!input||typeof input!=='object'||!Array.isArray(input.events)||input.events.length<1||input.events.length>25) return {ok:false,error:'INVALID_CLIENT_EVENTS'};
  const clean=[];
  for(const raw of input.events){
    if(!raw||!CLIENT_EVENT_TYPES.has(String(raw.type||''))) return {ok:false,error:'INVALID_CLIENT_EVENT_TYPE'};
    clean.push({type:safeKey(raw.type),area:safeKey(raw.area),code:safeKey(raw.code).slice(0,70),severity:['info','warning','error'].includes(raw.severity)?raw.severity:'warning',durationMs:Math.min(300000,Math.max(0,n(raw.durationMs))),route:safeKey(raw.route).slice(0,80),online:raw.online!==false,channel:safeKey(raw.channel).slice(0,20),appVersion:safeKey(raw.appVersion).slice(0,40)});
  }
  return {ok:true,events:clean};
}
export async function recordClientEvents(env,events){
  const kv=env.SECURITY_KV;if(!kv)return {stored:false,reason:'SECURITY_KV_NOT_CONFIGURED'};
  const key=`client-metrics:hour:${bucket()}`;const current=(await readJson(kv,key))||{events:0,types:{},areas:{},severities:{},durationsTotalMs:0,updatedAt:null};
  for(const e of events){current.events++;current.types[e.type]=(current.types[e.type]||0)+1;current.areas[e.area]=(current.areas[e.area]||0)+1;current.severities[e.severity]=(current.severities[e.severity]||0)+1;current.durationsTotalMs+=n(e.durationMs);}
  current.updatedAt=new Date().toISOString();await kv.put(key,JSON.stringify(current),{expirationTtl:60*60*24*14});return {stored:true,count:events.length};
}
