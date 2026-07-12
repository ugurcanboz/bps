export const API_SECURITY_VERSION = 'G54.50.2F-api-security-v1';

const SAFE_QUERY = new Map([
  ['/api/coach', new Set(['stream'])],
  ['/api/speaking', new Set()],
  ['/api/exam-speaking', new Set()],
  ['/api/client-events', new Set()],
  ['/api/health', new Set()],
  ['/api/metrics', new Set(['hours'])]
]);

export function validateRequestSurface(request, url) {
  const allowed = SAFE_QUERY.get(url.pathname);
  if (!allowed) return {ok:true};
  for (const key of url.searchParams.keys()) {
    if (!allowed.has(key)) return {ok:false,error:'INVALID_QUERY_PARAMETER'};
  }
  if (url.pathname === '/api/coach' && url.searchParams.has('stream')) {
    const value = url.searchParams.get('stream');
    if (value !== '0' && value !== '1') return {ok:false,error:'INVALID_QUERY_PARAMETER'};
  }
  if (url.pathname === '/api/metrics' && url.searchParams.has('hours')) {
    const hours = Number(url.searchParams.get('hours'));
    if (!Number.isInteger(hours) || hours < 1 || hours > 336) return {ok:false,error:'INVALID_QUERY_PARAMETER'};
  }
  return {ok:true};
}

export function validIdempotencyKey(value='') {
  return /^[A-Za-z0-9._:-]{16,128}$/.test(String(value));
}

export async function enforceReplayProtection(request, env, route) {
  const raw = String(request.headers.get('X-Idempotency-Key') || '').trim();
  if (!raw) return {ok:true,used:false,degraded:false};
  if (!validIdempotencyKey(raw)) return {ok:false,error:'INVALID_IDEMPOTENCY_KEY',status:400};
  if (!env.SECURITY_KV) {
    const production = String(env.APP_ENV || '') === 'production';
    return production ? {ok:false,error:'REPLAY_PROTECTION_UNAVAILABLE',status:503} : {ok:true,used:true,degraded:true};
  }
  const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${route}:${raw}`));
  const hash = [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');
  const key = `idem:${hash}`;
  const existing = await env.SECURITY_KV.get(key);
  if (existing) return {ok:false,error:'REPLAY_DETECTED',status:409};
  await env.SECURITY_KV.put(key,'1',{expirationTtl:Math.max(60,Number(env.IDEMPOTENCY_TTL_SECONDS || 900))});
  return {ok:true,used:true,degraded:false};
}

export function rejectDangerousHeaders(request) {
  const transferEncoding = String(request.headers.get('transfer-encoding') || '').toLowerCase();
  const contentLength = request.headers.get('content-length');
  if (transferEncoding && contentLength) return {ok:false,error:'AMBIGUOUS_MESSAGE_LENGTH'};
  const override = request.headers.get('x-http-method-override');
  if (override) return {ok:false,error:'METHOD_OVERRIDE_NOT_ALLOWED'};
  return {ok:true};
}
