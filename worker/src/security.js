import {normalizeLearningContext, optimizeHistory} from './context.js';
const LEVELS = new Set(['A1','A2','B1','B2','C1','C2']);
const LANGUAGES = new Set(['Deutsch','Englisch','German','English','de','en']);
const ROLES = new Set(['coach','conversation']);

export function parseOrigins(value='') {
  return String(value).split(',').map(v=>v.trim()).filter(Boolean);
}

export function isOriginAllowed(origin, env, options={}) {
  if (!origin) {
    if (options.allowMissing === true) return true;
    return String(env.APP_ENV || 'development') === 'development' && String(env.ALLOW_ORIGINLESS_REQUESTS || 'true') === 'true';
  }
  const allowed = parseOrigins(env.ALLOWED_ORIGINS || '');
  return allowed.includes(origin);
}

export function validRequestId(value='') {
  return /^[A-Za-z0-9._:-]{1,80}$/.test(String(value));
}

export function requireJsonContentType(request) {
  const type = String(request.headers.get('content-type') || '').toLowerCase();
  return type.startsWith('application/json');
}

export function safeErrorCode(error, fallback='INTERNAL_ERROR') {
  const allowed = new Set([
    'PAYLOAD_TOO_LARGE','INVALID_JSON','INVALID_JSON_OBJECT','EMPTY_INPUT','INVALID_LEVEL','INVALID_LANGUAGE',
    'INVALID_CONTENT_TYPE','UNSAFE_INSTRUCTION_PATTERN','RATE_LIMITED','UPSTREAM_TIMEOUT','UPSTREAM_UNAVAILABLE',
    'SERVER_NOT_CONFIGURED','ORIGIN_NOT_ALLOWED','METHOD_NOT_ALLOWED','NOT_FOUND','UNAUTHORIZED','CLIENT_EVENT_FAILED','INVALID_MODEL_OUTPUT','UNSAFE_MODEL_OUTPUT','INVALID_QUERY_PARAMETER','INVALID_IDEMPOTENCY_KEY','REPLAY_PROTECTION_UNAVAILABLE','REPLAY_DETECTED','AMBIGUOUS_MESSAGE_LENGTH','METHOD_OVERRIDE_NOT_ALLOWED'
  ]);
  const code = String(error?.message || fallback).toUpperCase().replace(/[^A-Z0-9_]/g,'_').slice(0,64);
  if (allowed.has(code)) return code;
  if (code.startsWith('GROQ_HTTP_') || code.startsWith('GROQ_STREAM_HTTP_')) return 'UPSTREAM_UNAVAILABLE';
  return fallback;
}

export function productionReadiness(env) {
  const production = String(env.APP_ENV || '') === 'production';
  const missing = [];
  if (!env.GROQ_API_KEY) missing.push('GROQ_API_KEY');
  if (!parseOrigins(env.ALLOWED_ORIGINS || '').length) missing.push('ALLOWED_ORIGINS');
  if (production && !env.API_RATE_LIMITER) missing.push('API_RATE_LIMITER');
  if (production && !env.SECURITY_KV) missing.push('SECURITY_KV');
  if (production && !env.MONITORING_TOKEN) missing.push('MONITORING_TOKEN');
  return {ok:missing.length===0,production,missing};
}


export function corsHeaders(origin, env) {
  const allowed = isOriginAllowed(origin, env, {allowMissing:true});
  const headers = {
    'Vary':'Origin',
    'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type,Accept,X-Request-ID,X-App-Version',
    'Access-Control-Max-Age':'86400'
  };
  if (allowed && origin) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

export function securityHeaders() {
  return {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store, max-age=0',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'no-referrer',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    'Cross-Origin-Opener-Policy':'same-origin',
    'X-Permitted-Cross-Domain-Policies':'none'
  };
}

export function jsonResponse(body, status, origin, env, extra={}) {
  return new Response(JSON.stringify(body), {
    status,
    headers:{...securityHeaders(), ...corsHeaders(origin, env), ...extra}
  });
}

export function normalizeLevel(value) {
  const level = String(value || 'B1').toUpperCase();
  return LEVELS.has(level) ? level : null;
}

export function normalizeLanguage(value) {
  const raw = String(value || 'Deutsch').trim();
  if (!LANGUAGES.has(raw)) return null;
  if (raw === 'German' || raw === 'de') return 'Deutsch';
  if (raw === 'English' || raw === 'en') return 'Englisch';
  return raw;
}

export function cleanText(value, maxChars=4000) {
  return String(value || '').replace(/\u0000/g,'').trim().slice(0,maxChars);
}

export function validatePayload(kind, input, env={}) {
  const allowedKeys = new Set(['message','userText','level','language','history','requiredPoints','topic','role','mode','context']);
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false,error:'INVALID_JSON_OBJECT'};
  if (Object.keys(input).some(key => key === '__proto__' || key === 'prototype' || key === 'constructor' || !allowedKeys.has(key))) return {ok:false,error:'INVALID_JSON_OBJECT'};
  const maxChars = Math.max(500, Number(env.MAX_INPUT_CHARS || 4000));
  const userText = cleanText(input.message || input.userText, maxChars);
  if (!userText) return {ok:false,error:'EMPTY_INPUT'};
  const level = normalizeLevel(input.level);
  if (!level) return {ok:false,error:'INVALID_LEVEL'};
  const language = normalizeLanguage(input.language || 'Deutsch');
  if (!language) return {ok:false,error:'INVALID_LANGUAGE'};
  const history = optimizeHistory(input.history,{maxMessages:Math.max(2,Number(env.MAX_HISTORY_MESSAGES || 8)),maxChars:Math.max(1600,Number(env.MAX_HISTORY_CHARS || 6400))});
  const requiredPoints = Array.isArray(input.requiredPoints) ? input.requiredPoints.slice(0,12).map(x=>cleanText(x,240)).filter(Boolean) : [];
  const topic = cleanText(input.topic || (kind === 'coach' ? 'Sprachtraining' : 'Alltag'), 240);
  const requestedRole = String(input.role || input.mode || 'coach').trim();
  const role = kind === 'coach' && ROLES.has(requestedRole) ? requestedRole : 'coach';
  return {ok:true,value:{userText,level,language,role,history,requiredPoints,topic,context:normalizeLearningContext(input.context)}};
}

export function suspiciousInput(text) {
  const value = String(text || '').toLowerCase();
  const patterns = [
    /ignore (all|previous|prior) instructions/,
    /system prompt/,
    /developer message/,
    /reveal.*(secret|api key|token)/,
    /zeige.*(systemprompt|api.?key|geheimnis)/,
    /ignoriere.*anweisungen/
  ];
  return patterns.some(p=>p.test(value));
}

function clientKey(request, env={}) {
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp.slice(0,64);
  if (String(env.APP_ENV || 'development') === 'development') return String(request.headers.get('X-Forwarded-For') || 'local').split(',')[0].trim().slice(0,64);
  return 'unidentified';
}


export async function enforceRateLimit(request, env) {
  const nativeLimiter = env.API_RATE_LIMITER;
  if (nativeLimiter && typeof nativeLimiter.limit === 'function') {
    const actor = clientKey(request,env);
    const route = new URL(request.url).pathname;
    const result = await nativeLimiter.limit({key:`${actor}:${route}`});
    return {allowed:!!result.success,remaining:null,retryAfter:Number(env.RATE_LIMIT_WINDOW_SECONDS || 60),degraded:false,storage:'native'};
  }
  const windowSec = Math.max(10, Number(env.RATE_LIMIT_WINDOW_SECONDS || 60));
  const max = Math.max(1, Number(env.RATE_LIMIT_MAX_REQUESTS || 30));
  if (!env.RATE_LIMIT_KV) return {allowed:true,remaining:null,degraded:true,storage:'none'};
  const bucket = Math.floor(Date.now() / (windowSec * 1000));
  const key = `rl:${clientKey(request,env)}:${bucket}`;
  const current = Number(await env.RATE_LIMIT_KV.get(key) || 0);
  if (current >= max) return {allowed:false,remaining:0,retryAfter:windowSec,storage:'kv'};
  await env.RATE_LIMIT_KV.put(key, String(current + 1), {expirationTtl:windowSec + 5});
  return {allowed:true,remaining:Math.max(0,max-current-1),degraded:false,storage:'kv'};
}
