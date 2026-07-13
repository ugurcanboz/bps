const fs=require('fs'); const assert=require('assert');
const checks=[]; function check(name,fn){try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}}
const worker=fs.readFileSync('worker/src/index.js','utf8');
const security=fs.readFileSync('worker/src/security.js','utf8');
const client=fs.readFileSync('js/modules/language-ai-client.js','utf8');
const config=fs.readFileSync('data/language-ai-config.js','utf8');
check('worker-source-present',()=>assert(worker.includes('/api/exam-speaking')));
check('secret-server-side',()=>{assert(worker.includes('env.GROQ_API_KEY'));assert(!client.includes('gsk_'));assert(!config.includes('gsk_'));});
check('cors-allowlist',()=>assert(security.includes('allowed.includes(origin)')));
check('kv-rate-limit',()=>assert(security.includes('RATE_LIMIT_KV')));
check('payload-validation',()=>assert(security.includes('validatePayload')));
check('request-limits',()=>{assert(worker.includes('MAX_BODY_BYTES'));assert(security.includes('MAX_INPUT_CHARS'));});
check('request-id',()=>{assert(worker.includes('X-Request-ID'));assert(client.includes('X-Request-ID'));});
check('prompt-injection-guard',()=>assert(security.includes('suspiciousInput')));
check('structured-logging',()=>assert(worker.includes("event:'groq_success'")));
check('client-compatible-endpoints',()=>['health','coach','speaking','examSpeaking'].forEach(x=>assert(config.includes(x))));
const out={phase:'G54.46.13A',ok:checks.every(x=>x.ok),passed:checks.filter(x=>x.ok).length,total:checks.length,checks};
console.log(JSON.stringify(out,null,2)); if(!out.ok)process.exit(1);
