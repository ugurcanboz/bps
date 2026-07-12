import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizeMetrics, metricsSnapshot, recordMetric, MONITORING_VERSION} from '../src/monitoring.js';

class KV { constructor(){this.map=new Map();} async get(k){return this.map.get(k)||null;} async put(k,v){this.map.set(k,v);} }

test('records aggregate metrics without content',async()=>{
  const kv=new KV(); const env={SECURITY_KV:kv};
  await recordMetric(env,{ok:true,status:200,route:'/api/coach',model:'test-model',usage:{prompt_tokens:10,completion_tokens:5,total_tokens:15},attempts:2,latencyMs:120});
  const out=await metricsSnapshot(env,1);
  assert.equal(out.ok,true); assert.equal(out.version,MONITORING_VERSION);
  assert.equal(out.summary.requests,1); assert.equal(out.summary.successes,1); assert.equal(out.summary.retries,1);
  assert.equal(out.summary.totalTokens,15); assert.equal(out.summary.averageLatencyMs,120);
  assert.equal(JSON.stringify(out).includes('userText'),false);
});

test('aggregates failures and rates',async()=>{
  const kv=new KV(); const env={SECURITY_KV:kv};
  await recordMetric(env,{ok:false,status:429,route:'/api/speaking',model:'m',attempts:1,latencyMs:20});
  await recordMetric(env,{ok:true,status:200,route:'/api/speaking',model:'m',attempts:1,latencyMs:40});
  const out=await metricsSnapshot(env,1);
  assert.equal(out.summary.requests,2); assert.equal(out.summary.errors,1); assert.equal(out.summary.rateLimited,1); assert.equal(out.summary.successRate,50);
});

test('protects metrics endpoint with configured token',()=>{
  const env={MONITORING_TOKEN:'secret'};
  assert.equal(authorizeMetrics(new Request('https://x/api/metrics',{headers:{Authorization:'Bearer secret'}}),env),true);
  assert.equal(authorizeMetrics(new Request('https://x/api/metrics',{headers:{Authorization:'Bearer wrong'}}),env),false);
  assert.equal(authorizeMetrics(new Request('https://x/api/metrics'),{}),false);
});

test('reports missing storage cleanly',async()=>{
  assert.deepEqual(await recordMetric({},{}),{stored:false,reason:'SECURITY_KV_NOT_CONFIGURED'});
  assert.equal((await metricsSnapshot({},24)).error,'MONITORING_STORAGE_NOT_CONFIGURED');
});
