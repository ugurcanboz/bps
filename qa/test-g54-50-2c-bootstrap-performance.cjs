'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
let n=0;function ok(name,fn){fn();n++;console.log('✓',name);}
ok('version is G54.50.2C or newer hotfix',()=>assert(/var VERSION = 'G54\.50\.2[C-Z]';/.test(read('js/core/app-config.js'))));
ok('bootstrap callable exists',()=>{const s=read('functions/index.js');assert(s.includes('exports.bootstrapAdmin=onCall'));assert(s.includes("db.doc('system/bootstrapAdmin')"));});
ok('bootstrap completes permanently',()=>{const s=read('functions/index.js');assert(s.includes("status:'completed'"));assert(s.includes("bootstrapPolicy.lockAllowsClaim"));});
ok('normal codes still reject admin',()=>assert(read('functions/index.js').includes("issuedRole==='admin'")));
ok('bootstrap secret is represented only by a SHA-256 digest',()=>{const server=read('functions/index.js');const client=read('js/modules/egt-auth-engine.js');assert(server.includes('DEFAULT_BOOTSTRAP_CODE_SHA256'));assert(/\b[0-9a-f]{64}\b/i.test(server));assert(!/BOOTSTRAP_(?:CODE|PASSWORD)\s*=\s*['"][^'"]+['"]/i.test(server));assert(!/bootstrap(?:Code|Password)\s*[:=]\s*['"][^'"]+['"]/i.test(client));});
ok('bootstrap UI and client bridge exist',()=>{assert(read('js/modules/novura-auth-access.js').includes('data-submit="bootstrap"'));assert(read('js/modules/egt-auth-engine.js').includes('registerBootstrapAdmin'));});
ok('performance stylesheet loaded last',()=>{const h=read('index.html');assert(h.includes('./css/performance-stability.css'));assert(h.indexOf('performance-stability.css')>h.indexOf('ui-ux-consistency.css'));});
ok('expensive hover motion disabled',()=>{const s=read('css/performance-stability.css');assert(s.includes('transform:none!important'));assert(s.includes('backdrop-filter:none!important'));});
ok('legacy cinematic runtime removed',()=>{assert(!fs.existsSync(path.join(root,'css/cinematic.css')));assert(!read('index.html').includes('cinematic.css'));assert(!read('service-worker.js').includes('cinematic.css'));});
ok('performance stylesheet precached',()=>assert(read('service-worker.js').includes('./css/performance-stability.css')));
console.log(`G54.50.2C Bootstrap & Performance: ${n}/10 bestanden`);
