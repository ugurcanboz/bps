const fs=require('fs'); const path=require('path'); const root=path.resolve(__dirname,'..');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
const checks=[]; function ok(name,cond){checks.push({name,ok:!!cond}); if(!cond) process.exitCode=1;}
const runtime=read('js/core/runtime-environment.js'); const html=read('index.html'); const sw=read('service-worker.js'); const wrangler=read('worker/wrangler.toml'); const app=read('js/core/app-config.js');
const versionMatch=app.match(/var VERSION = '([^']+)'/); const currentVersion=versionMatch&&versionMatch[1];
ok('exactly three runtime channels', ['development','beta','production'].every(x=>runtime.includes(x)) && !runtime.includes("'test'"));
ok('public override blocked', runtime.includes("var canOverride=detected==='development'"));
ok('runtime loads before app config', html.indexOf('runtime-environment.js') < html.indexOf('app-config.js'));
ok('release guard loaded', html.includes('release-channel.js') && html.includes('release-channel.css'));
ok('non-production badge implemented', read('js/core/release-channel.js').includes("if(env.name==='production') return"));
ok('deployment mismatch guard implemented', read('js/core/release-channel.js').includes('Deployment blockiert'));
ok('worker only beta and production envs', wrangler.includes('[env.beta]') && wrangler.includes('[env.production]') && !wrangler.includes('[env.test]'));
ok('version consistent', !!currentVersion && sw.includes(currentVersion) && JSON.parse(read('manifest.json')).version===currentVersion);
ok('new assets cached', sw.includes('./js/core/release-channel.js') && sw.includes('./css/release-channel.css'));
ok('accessible status semantics', read('js/core/release-channel.js').includes("setAttribute('role','status')") && read('js/core/release-channel.js').includes('aria-label'));
console.log(JSON.stringify({phase:'G54.47.14B',passed:checks.filter(x=>x.ok).length,total:checks.length,checks},null,2));
