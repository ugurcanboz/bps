import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

function baseEnv(extra={}) { return {GROQ_API_KEY:'test-key',GROQ_MODEL:'test-model',ALLOWED_ORIGINS:'https://app.example.com',UPSTREAM_MAX_ATTEMPTS:'3',UPSTREAM_RETRY_BASE_MS:'1',UPSTREAM_RETRY_MAX_DELAY_MS:'2',UPSTREAM_TIMEOUT_MS:'5000',...extra}; }
function req(body={message:'Hallo',level:'B1',language:'Deutsch'}, path='/api/coach', headers={}) { return new Request(`https://worker.example${path}`,{method:'POST',headers:{Origin:'https://app.example.com','Content-Type':'application/json','CF-Connecting-IP':'203.0.113.10',...headers},body:JSON.stringify(body)}); }
function ok(i=0){return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({reply:`ok-${i}`})}}],model:'test-model',usage:{prompt_tokens:10,completion_tokens:3,total_tokens:13}}),{status:200,headers:{'Content-Type':'application/json'}});}

class MemoryKV { constructor(){this.map=new Map();} async get(k){return this.map.get(k)??null;} async put(k,v){this.map.set(k,v);} }

test('50 concurrent coach requests complete without shared-state corruption', async()=>{
  const original=globalThis.fetch; let calls=0;
  globalThis.fetch=async()=>ok(++calls);
  try { const responses=await Promise.all(Array.from({length:50},(_,i)=>worker.fetch(req({message:`Hallo ${i}`,level:'B1',language:'Deutsch'},'/api/coach',{'X-Request-ID':`load-${i}`}),baseEnv())));
    assert.equal(responses.filter(r=>r.status===200).length,50); assert.equal(calls,50);
    const ids=new Set(await Promise.all(responses.map(async r=>(await r.json()).meta.requestId))); assert.equal(ids.size,50);
  } finally {globalThis.fetch=original;}
});

test('long histories are bounded before reaching Groq', async()=>{
  const original=globalThis.fetch; let upstream;
  globalThis.fetch=async(_url,init)=>{upstream=JSON.parse(init.body); return ok();};
  const history=Array.from({length:30},(_,i)=>({role:i%2?'assistant':'user',content:'x'.repeat(500)}));
  try { const response=await worker.fetch(req({message:'Prüfe Kontext',level:'C1',language:'Deutsch',history,context:{summary:'y'.repeat(2500),errors:Array(40).fill('Kasusfehler')}}),baseEnv());
    assert.equal(response.status,200); assert.ok(upstream.messages.length<=10); assert.ok(JSON.stringify(upstream).length<15000);
  } finally {globalThis.fetch=original;}
});

test('native rate limiter blocks excess requests before Groq', async()=>{
  const original=globalThis.fetch; let upstreamCalls=0, limiterCalls=0;
  globalThis.fetch=async()=>{upstreamCalls++; return ok();};
  const limiter={async limit(){limiterCalls++; return {success:limiterCalls<=3};}};
  try { const statuses=[]; for(let i=0;i<5;i++) statuses.push((await worker.fetch(req(),baseEnv({API_RATE_LIMITER:limiter}))).status);
    assert.deepEqual(statuses,[200,200,200,429,429]); assert.equal(upstreamCalls,3);
  } finally {globalThis.fetch=original;}
});

test('KV fallback rate limiter rejects sequential overflow', async()=>{
  const original=globalThis.fetch; let calls=0; globalThis.fetch=async()=>{calls++; return ok();};
  const env=baseEnv({RATE_LIMIT_KV:new MemoryKV(),RATE_LIMIT_MAX_REQUESTS:'2',RATE_LIMIT_WINDOW_SECONDS:'60'});
  try { const a=await worker.fetch(req(),env), b=await worker.fetch(req(),env), c=await worker.fetch(req(),env); assert.deepEqual([a.status,b.status,c.status],[200,200,429]); assert.equal(calls,2); }
  finally {globalThis.fetch=original;}
});

test('complete Groq outage is contained after configured retries', async()=>{
  const original=globalThis.fetch; let calls=0; globalThis.fetch=async()=>{calls++; throw new TypeError('network down');};
  try { const response=await worker.fetch(req(),baseEnv({UPSTREAM_MAX_ATTEMPTS:'3'})); const body=await response.json(); assert.equal(response.status,502); assert.equal(body.retryable,true); assert.equal(calls,3); }
  finally {globalThis.fetch=original;}
});

test('invalid request flood never reaches Groq', async()=>{
  const original=globalThis.fetch; let calls=0; globalThis.fetch=async()=>{calls++; return ok();};
  try { const responses=await Promise.all(Array.from({length:100},()=>worker.fetch(req({message:'',level:'Z9',language:'Deutsch'}),baseEnv()))); assert.equal(responses.every(r=>r.status===400),true); assert.equal(calls,0); }
  finally {globalThis.fetch=original;}
});
