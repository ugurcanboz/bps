'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
let n=0;function ok(name,fn){fn();n++;console.log('✓',name);}
ok('version is G54.50.2C or newer hotfix',()=>assert(/var VERSION = 'G54\.50\.2[C-Z]';/.test(read('js/core/app-config.js'))));
ok('bootstrap path is no longer exposed in production UI',()=>assert(!read('js/modules/novura-auth-access.js').includes('data-submit="bootstrap"')));
ok('local bootstrap keeps permanent Firestore lock',()=>assert(read('functions/tools/bootstrap-admin.mjs').includes("status:'completed'")));
ok('normal codes still reject admin',()=>assert(read('functions/index.js').includes("issuedRole==='admin'")));
ok('no bootstrap secret or digest is shipped to the browser',()=>{assert(!read('js/modules/egt-auth-engine.js').includes('bootstrapCode'));assert(!read('functions/index.js').includes('BOOTSTRAP_CODE_SHA256'));});
ok('local bootstrap launcher exists',()=>{assert(fs.existsSync(path.join(root,'START-ADMIN-BOOTSTRAP.cmd')));assert(fs.existsSync(path.join(root,'tools/local-admin-bootstrap.ps1')));});
ok('performance stylesheet loaded last',()=>{const h=read('index.html');assert(h.includes('./css/performance-stability.css'));assert(h.indexOf('performance-stability.css')>h.indexOf('ui-ux-consistency.css'));});
ok('expensive hover motion disabled',()=>{const s=read('css/performance-stability.css');assert(s.includes('transform:none!important'));assert(s.includes('backdrop-filter:none!important'));});
ok('legacy cinematic runtime removed',()=>{assert(!fs.existsSync(path.join(root,'css/cinematic.css')));assert(!read('index.html').includes('cinematic.css'));assert(!read('service-worker.js').includes('cinematic.css'));});
ok('performance stylesheet precached',()=>assert(read('service-worker.js').includes('./css/performance-stability.css')));
console.log(`G54.50.2C Bootstrap & Performance: ${n}/10 bestanden`);
