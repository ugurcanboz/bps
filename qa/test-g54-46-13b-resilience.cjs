const fs=require('fs'); const assert=require('assert');
const checks=[]; function check(name,fn){try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}}
const worker=fs.readFileSync('worker/src/index.js','utf8');
const client=fs.readFileSync('js/modules/language-ai-client.js','utf8');
const config=fs.readFileSync('data/language-ai-config.js','utf8');
check('worker-version',()=>assert(/G54\.(?:4[7-9]|[5-9]\d)\./.test(worker)));
check('worker-max-attempts',()=>assert(worker.includes('UPSTREAM_MAX_ATTEMPTS')));
check('worker-exponential-backoff',()=>assert(worker.includes('2 **')));
check('worker-retry-after',()=>assert(worker.includes("Retry-After")));
check('worker-retryable-statuses',()=>{assert(worker.includes('status === 429'));assert(worker.includes('status >= 500'));});
check('client-retry-config',()=>{assert(config.includes('maxAttempts: 3'));assert(config.includes('retryBaseMs'));});
check('client-timeout',()=>assert(client.includes('AI_TIMEOUT')));
check('client-stable-request-id',()=>assert(client.includes('var id = requestId()')));
check('client-no-retry-explicit-4xx',()=>assert(client.includes("data.retryable === 'boolean'")));
check('fallback-remains-enabled',()=>assert(config.includes('allowLocalFallback: true')));
const out={phase:'G54.46.13B',ok:checks.every(x=>x.ok),passed:checks.filter(x=>x.ok).length,total:checks.length,checks};
console.log(JSON.stringify(out,null,2)); if(!out.ok)process.exit(1);
