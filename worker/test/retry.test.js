import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

function env(extra={}) {
  return {
    GROQ_API_KEY:'test-key',
    GROQ_MODEL:'test-model',
    ALLOWED_ORIGINS:'https://app.example.com',
    UPSTREAM_MAX_ATTEMPTS:'3',
    UPSTREAM_RETRY_BASE_MS:'1',
    UPSTREAM_RETRY_MAX_DELAY_MS:'2',
    UPSTREAM_TIMEOUT_MS:'5000',
    ...extra
  };
}
function request() {
  return new Request('https://worker.example/api/coach',{
    method:'POST',
    headers:{Origin:'https://app.example.com','Content-Type':'application/json','X-Request-ID':'retry-test'},
    body:JSON.stringify({message:'Hallo',level:'B1',language:'Deutsch'})
  });
}
function groqOk() {
  return new Response(JSON.stringify({choices:[{message:{content:'{"reply":"Hallo!"}'}}],model:'test-model',usage:{total_tokens:10}}),{status:200,headers:{'Content-Type':'application/json'}});
}

test('retries 429 then succeeds', async()=>{
  const original=globalThis.fetch; let calls=0;
  globalThis.fetch=async()=>{ calls++; return calls===1 ? new Response(JSON.stringify({error:{message:'rate'}}),{status:429,headers:{'Retry-After':'0'}}) : groqOk(); };
  try {
    const response=await worker.fetch(request(),env());
    const body=await response.json();
    assert.equal(response.status,200); assert.equal(calls,2); assert.equal(body.meta.attempts,2);
  } finally { globalThis.fetch=original; }
});

test('retries 5xx up to configured maximum', async()=>{
  const original=globalThis.fetch; let calls=0;
  globalThis.fetch=async()=>{ calls++; return new Response(JSON.stringify({error:{message:'down'}}),{status:503}); };
  try {
    const response=await worker.fetch(request(),env());
    const body=await response.json();
    assert.equal(response.status,502); assert.equal(calls,3); assert.equal(body.retryable,true);
  } finally { globalThis.fetch=original; }
});

test('does not retry non-retryable 400', async()=>{
  const original=globalThis.fetch; let calls=0;
  globalThis.fetch=async()=>{ calls++; return new Response(JSON.stringify({error:{message:'bad request'}}),{status:400}); };
  try {
    const response=await worker.fetch(request(),env());
    const body=await response.json();
    assert.equal(response.status,400); assert.equal(calls,1); assert.equal(body.retryable,false);
  } finally { globalThis.fetch=original; }
});
