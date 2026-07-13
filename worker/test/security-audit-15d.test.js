import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import {isOriginAllowed, productionReadiness, requireJsonContentType, safeErrorCode, validatePayload, validRequestId} from '../src/security.js';

const prodEnv={APP_ENV:'production',ALLOWED_ORIGINS:'https://app.example',GROQ_API_KEY:'secret',API_RATE_LIMITER:{limit:async()=>({success:true})},SECURITY_KV:{get:async()=>null,put:async()=>{}},MONITORING_TOKEN:'metrics'};
const ctx={waitUntil(){}};
function req(path, options={}) { return new Request(`https://worker.example${path}`,options); }

test('production rejects missing browser origin for AI routes', async()=>{
  const r=await worker.fetch(req('/api/coach',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'Hallo',level:'A1',language:'Deutsch'})}),prodEnv,ctx);
  assert.equal(r.status,403);
});

test('health remains available to originless probes', async()=>{
  const r=await worker.fetch(req('/api/health'),prodEnv,ctx);
  assert.equal(r.status,200); const body=await r.json(); assert.equal(body.ready,true);
});

test('JSON endpoints reject wrong content type', async()=>{
  const r=await worker.fetch(req('/api/coach',{method:'POST',headers:{origin:'https://app.example','content-type':'text/plain'},body:'{}'}),prodEnv,ctx);
  assert.equal(r.status,415); assert.equal((await r.json()).error,'INVALID_CONTENT_TYPE');
});

test('unknown and prototype-like payload fields are rejected',()=>{
  assert.equal(validatePayload('coach',{message:'Hallo',level:'A1',language:'Deutsch',admin:true}).ok,false);
  assert.equal(validatePayload('coach',JSON.parse('{"message":"Hallo","level":"A1","language":"Deutsch","constructor":"x"}')).ok,false);
});

test('request IDs are restricted to safe characters',()=>{
  assert.equal(validRequestId('abc-123_X:y.z'),true);
  assert.equal(validRequestId('<script>alert(1)</script>'),false);
  assert.equal(validRequestId('a'.repeat(81)),false);
});

test('production readiness requires critical bindings',()=>{
  const r=productionReadiness({APP_ENV:'production',ALLOWED_ORIGINS:'https://app.example',GROQ_API_KEY:'x'});
  assert.equal(r.ok,false); assert.deepEqual(r.missing.sort(),['API_RATE_LIMITER','MONITORING_TOKEN','SECURITY_KV'].sort());
});

test('development can use controlled originless requests',()=>{
  assert.equal(isOriginAllowed('',{APP_ENV:'development',ALLOW_ORIGINLESS_REQUESTS:'true'}),true);
  assert.equal(isOriginAllowed('',{APP_ENV:'production'}),false);
});

test('content type check only accepts application/json',()=>{
  assert.equal(requireJsonContentType(req('/x',{method:'POST',headers:{'content-type':'application/json; charset=utf-8'},body:'{}'})),true);
  assert.equal(requireJsonContentType(req('/x',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:'a=b'})),false);
});

test('upstream details are redacted',()=>{
  assert.equal(safeErrorCode(new Error('GROQ_HTTP_500_database password secret')),'UPSTREAM_UNAVAILABLE');
  assert.equal(safeErrorCode(new Error('weird internal stack details')),'INTERNAL_ERROR');
});

test('production blocks AI when security configuration is incomplete', async()=>{
  const env={APP_ENV:'production',ALLOWED_ORIGINS:'https://app.example',GROQ_API_KEY:'x'};
  const r=await worker.fetch(req('/api/coach',{method:'POST',headers:{origin:'https://app.example','content-type':'application/json'},body:JSON.stringify({message:'Hallo',level:'A1',language:'Deutsch'})}),env,ctx);
  assert.equal(r.status,503); assert.equal((await r.json()).error,'SERVER_NOT_CONFIGURED');
});
