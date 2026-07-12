'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const ignored=new Set(['.git','node_modules']);
function walk(dir,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(ignored.has(e.name))continue;const p=path.join(dir,e.name);e.isDirectory()?walk(p,out):out.push(p)}return out}
const files=walk(root);const rel=p=>path.relative(root,p).replaceAll('\\','/');
const findings=[];
if(fs.existsSync(path.join(root,'backup-output')))findings.push({severity:'error',code:'NESTED_BACKUPS',path:'backup-output'});
const runtime=['manifest.json','service-worker.js','update-check.json','js/core/app-config.js','worker/src/index.js'];
for(const f of runtime){const s=fs.readFileSync(path.join(root,f),'utf8');if(!s.includes('G54.50.2'))findings.push({severity:'error',code:'VERSION_DRIFT',path:f});}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'functions/package.json'),'utf8'));
if(pkg.name!=='novura-security-functions')findings.push({severity:'error',code:'STALE_PACKAGE_NAME',path:'functions/package.json'});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')+'\n'+fs.readFileSync(path.join(root,'admin-portal.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="\.\/([^"?#]+)"/g)){const target=path.join(root,m[1]);if(!fs.existsSync(target))findings.push({severity:'error',code:'MISSING_REFERENCE',path:m[1]});}
const result={version:'G54.50.2',scannedFiles:files.length,errors:findings.filter(x=>x.severity==='error').length,findings};
console.log(JSON.stringify(result,null,2));process.exitCode=result.errors?1:0;
