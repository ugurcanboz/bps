import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
import {validateRequestSurface, validIdempotencyKey} from '../src/api-security.js';

const origin='https://app.example';
function env(extra={}) { return {APP_ENV:'development',ALLOWED_ORIGINS:origin,GROQ_API_KEY:'x',RATE_LIMIT_MAX_REQUESTS:'1000',...extra}; }
function req(path, init={}) { const {headers={},...rest}=init; return new Request(`https://worker.example${path}`,{...rest,headers:{Origin:origin,'Content-Type':'application/json',...headers}}); }
const payload={message:'Hallo',level:'A1',language:'Deutsch'};

test('unknown query parameter is rejected',()=>{
  const r=validateRequestSurface(req('/api/coach?admin=true'),new URL('https://worker.example/api/coach?admin=true'));
  assert.equal(r.ok,false);
});
test('metrics hours is bounded',()=>{
  const r=validateRequestSurface(req('/api/metrics?hours=9999'),new URL('https://worker.example/api/metrics?hours=9999'));
  assert.equal(r.ok,false);
});
test('idempotency key format is strict',()=>{
  assert.equal(validIdempotencyKey('short'),false);
  assert.equal(validIdempotencyKey('0123456789abcdef'),true);
});
test('method override header is rejected',async()=>{
  const res=await worker.fetch(req('/api/coach',{method:'POST',headers:{'X-HTTP-Method-Override':'GET'},body:JSON.stringify(payload)}),env(),{});
  assert.equal(res.status,400); assert.equal((await res.json()).error,'METHOD_OVERRIDE_NOT_ALLOWED');
});
test('ambiguous request framing is rejected',async()=>{
  const fake={method:'POST',url:'https://worker.example/api/coach',headers:new Headers({Origin:origin,'Content-Type':'application/json','Transfer-Encoding':'chunked','Content-Length':'12'}),text:async()=>JSON.stringify(payload)};
  const res=await worker.fetch(fake,env(),{});
  assert.equal(res.status,400); assert.equal((await res.json()).error,'AMBIGUOUS_MESSAGE_LENGTH');
});
test('invalid idempotency key is rejected',async()=>{
  const res=await worker.fetch(req('/api/coach',{method:'POST',headers:{'X-Idempotency-Key':'bad'},body:JSON.stringify(payload)}),env(),{});
  assert.equal(res.status,400); assert.equal((await res.json()).error,'INVALID_IDEMPOTENCY_KEY');
});
test('duplicate idempotency key is rejected',async()=>{
  const store=new Map();
  const kv={get:async k=>store.get(k)||null,put:async(k,v)=>{store.set(k,v)}};
  const original=globalThis.fetch;
  globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({reply:'Hallo',corrections:[],nextQuestion:'Wie geht es dir?'})}}],usage:{total_tokens:1},model:'test'}),{status:200,headers:{'Content-Type':'application/json'}});
  try {
    const key='0123456789abcdef0123456789abcdef';
    const first=await worker.fetch(req('/api/coach',{method:'POST',headers:{'X-Idempotency-Key':key},body:JSON.stringify(payload)}),env({SECURITY_KV:kv}),{});
    assert.equal(first.status,200);
    const second=await worker.fetch(req('/api/coach',{method:'POST',headers:{'X-Idempotency-Key':key},body:JSON.stringify(payload)}),env({SECURITY_KV:kv}),{});
    assert.equal(second.status,409); assert.equal((await second.json()).error,'REPLAY_DETECTED');
  } finally { globalThis.fetch=original; }
});
test('unknown endpoint remains 404',async()=>{
  const res=await worker.fetch(req('/api/not-real',{method:'POST',body:'{}'}),env(),{});
  assert.equal(res.status,404);
});
test('GET on POST endpoint remains 405',async()=>{
  const res=await worker.fetch(req('/api/coach',{method:'GET'}),env(),{});
  assert.equal(res.status,405);
});
test('oversized content-length is rejected before JSON parsing',async()=>{
  const res=await worker.fetch(req('/api/coach',{method:'POST',headers:{'Content-Length':'999999'},body:JSON.stringify(payload)}),env(),{});
  assert.equal(res.status,413);
});
