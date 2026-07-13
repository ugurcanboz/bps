'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'..');let n=0;function ok(name,fn){fn();n++;console.log('✓',name)}
ok('no nested release backups',()=>assert(!fs.existsSync(path.join(root,'backup-output'))));
ok('functions package renamed',()=>{const p=require(path.join(root,'functions/package.json'));assert.equal(p.name,'novura-security-functions');assert(/^54\.50\.[1-9]\d*$/.test(p.version))});
ok('runtime versions synchronized',()=>['manifest.json','service-worker.js','update-check.json','js/core/app-config.js','worker/src/index.js'].forEach(f=>assert(/G54\.50\.[1-9]\d*/.test(fs.readFileSync(path.join(root,f),'utf8')),f)));
ok('code-health audit clean',()=>cp.execFileSync(process.execPath,[path.join(root,'tools/code-health-audit.cjs')],{cwd:root,stdio:'pipe'}));
ok('critical entry files exist',()=>['index.html','admin-portal.html','js/app.js','service-worker.js','manifest.json'].forEach(f=>assert(fs.existsSync(path.join(root,f)),f)));
console.log(`G54.50.1 Code Health: ${n}/5 bestanden`);
