import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';
const env={GROQ_API_KEY:'x',ALLOWED_ORIGINS:'https://app.example',RATE_LIMIT_KV:{get:async()=>null,put:async()=>{}},GROQ_MODEL:'test'};
test('coach streaming returns SSE and tokens',async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=async()=>new Response('data: {"choices":[{"delta":{"content":"Hal"}}]}\n\ndata: {"choices":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\n',{status:200,headers:{'Content-Type':'text/event-stream'}});
 try{const req=new Request('https://worker/api/coach?stream=1',{method:'POST',headers:{Origin:'https://app.example','Content-Type':'application/json',Accept:'text/event-stream'},body:JSON.stringify({message:'Hi',level:'B1',language:'Deutsch',history:[]})}); const res=await worker.fetch(req,env); const body=await res.text(); assert.equal(res.status,200); assert.match(res.headers.get('content-type'),/text\/event-stream/); assert.match(body,/event: token/); assert.match(body,/Hal/); assert.match(body,/lo/); assert.match(body,/event: done/);}finally{globalThis.fetch=old;}
});
