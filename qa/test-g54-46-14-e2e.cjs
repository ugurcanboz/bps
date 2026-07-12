'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const cfgText = fs.readFileSync(path.join(ROOT,'js/core/app-config.js'),'utf8');
const VERSION = (cfgText.match(/var VERSION\s*=\s*'([^']+)'/)||[])[1] || 'UNKNOWN';
const VERSION_DATE = (cfgText.match(/var VERSION_DATE\s*=\s*'([^']+)'/)||[])[1] || 'UNKNOWN';
const FULL = VERSION + '-' + VERSION_DATE;
const checks = [];
function check(name, fn) { try { fn(); checks.push({name, ok:true}); } catch (e) { checks.push({name, ok:false, error:String(e.message||e)}); } }
function assert(cond, msg){ if(!cond) throw new Error(msg); }
function read(rel){ return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function allFiles(dir){ const out=[]; for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,ent.name); ent.isDirectory()?out.push(...allFiles(p)):out.push(p); } return out; }

check('required-entry-files', () => {
  ['index.html','admin-portal.html','manifest.json','service-worker.js','firebase.json','firestore.rules','module-manifest.json','worker/src/index.js'].forEach(f=>assert(fs.existsSync(path.join(ROOT,f)), 'missing '+f));
});
check('version-single-source', () => {
  const cfg=cfgText;
  assert(cfg.includes("var VERSION = '"+VERSION+"'"),'app-config version mismatch');
  assert(read('index.html').includes(FULL),'index version mismatch');
  assert(read('service-worker.js').includes(VERSION),'service worker version mismatch');
  const manifest=JSON.parse(read('manifest.json')); assert(manifest.version===VERSION,'manifest version mismatch');
  const update=JSON.parse(read('update-check.json')); assert(update.version===FULL && update.build===FULL,'update-check mismatch');
  const ai=read('data/language-ai-config.js'); assert(ai.includes("appVersion: '"+VERSION+"'"),'AI config version mismatch');
  assert(read('worker/src/index.js').includes("const VERSION = '"+VERSION+"'"),'worker version mismatch');
});
check('json-validity', () => {
  for(const f of allFiles(ROOT).filter(f=>f.endsWith('.json') && !f.includes(`${path.sep}node_modules${path.sep}`))){ JSON.parse(fs.readFileSync(f,'utf8')); }
});
check('javascript-syntax', () => {
  const files=allFiles(ROOT).filter(f=>/\.(?:js|cjs|mjs)$/.test(f) && !f.includes(`${path.sep}node_modules${path.sep}`));
  for(const f of files){ const r=spawnSync(process.execPath,['--check',f],{encoding:'utf8'}); assert(r.status===0, path.relative(ROOT,f)+': '+(r.stderr||r.stdout)); }
});
check('html-local-references', () => {
  for(const rel of ['index.html','admin-portal.html','404.html']){
    const html=read(rel); const base=path.dirname(path.join(ROOT,rel));
    const rx=/(?:src|href)=["']([^"'#?]+)["']/g; let m;
    while((m=rx.exec(html))){ const u=m[1]; if(/^(?:https?:|data:|mailto:|tel:|javascript:|\/\/)/.test(u)) continue; const target=path.resolve(base,u); assert(fs.existsSync(target), `${rel} -> missing ${u}`); }
  }
});
check('service-worker-assets', () => {
  const sw=read('service-worker.js'); const rx=/['"]((?:\.\/)?(?:css|js|data|icons|locales|modules)\/[^'"?]+)['"]/g; let m;
  while((m=rx.exec(sw))){ const rel=m[1].replace(/^\.\//,''); assert(fs.existsSync(path.join(ROOT,rel)), 'SW missing '+rel); }
});
check('language-exam-coverage', () => {
  const files=['data/language-exam-blueprints.js','data/language-english-exam-variants.js','data/language-german-exam-supplement.js'];
  const joined=files.map(read).join('\n');
  ['A1','A2','B1','B2','C1','C2'].forEach(level=>assert(joined.includes(level),'missing CEFR '+level));
  ['reading','listening','writing','speaking'].forEach(skill=>assert(joined.toLowerCase().includes(skill),'missing skill '+skill));
});
check('ai-endpoints-and-fallback', () => {
  const cfg=read('data/language-ai-config.js'); const client=read('js/modules/language-ai-client.js');
  ['/api/health','/api/coach','/api/speaking','/api/exam-speaking'].forEach(e=>assert(cfg.includes(e),'missing endpoint '+e));
  assert(cfg.includes('allowLocalFallback: true'),'local fallback disabled');
  assert(client.includes('coachStream'),'streaming client missing');
  assert(client.includes('AbortController'),'abort support missing');
});
check('admin-security-boundaries', () => {
  const cfg=cfgText;
  assert(cfg.includes('requireTrustedClaims: !IS_DEVELOPMENT'),'trusted claims not required in production');
  assert(cfg.includes('allowQaBypass: IS_DEVELOPMENT'),'QA bypass boundary missing');
  assert(cfg.includes('denyUnverifiedPrivilegedSession: true'),'unverified privileged sessions not denied');
  assert(read('firestore.rules').includes('rules_version'),'firestore rules missing');
});
check('pwa-minimum', () => {
  const manifest=JSON.parse(read('manifest.json'));
  assert(Array.isArray(manifest.icons) && manifest.icons.length>=2,'insufficient PWA icons');
  assert(manifest.start_url,'start_url missing'); assert(manifest.display,'display missing');
  assert(read('index.html').includes('pwa-update-manager.js') && read('js/core/pwa-update-manager.js').includes('serviceWorker.register'),'service worker registration missing');
});

const result={phase:VERSION, ok:checks.every(c=>c.ok), passed:checks.filter(c=>c.ok).length, total:checks.length, checks, generatedAt:new Date().toISOString()};
fs.mkdirSync(path.join(ROOT,'release'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'release',VERSION.replace(/[^A-Za-z0-9.-]/g,'_')+'_E2E_QA_RESULT.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
process.exit(result.ok?0:1);
