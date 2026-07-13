#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cfg=fs.readFileSync(path.join(root,'js/core/app-config.js'),'utf8');
const version=(cfg.match(/var VERSION = '([^']+)'/)||[])[1];
const qa=fs.readdirSync(path.join(root,'qa')).filter(f=>/^test-.*\.(cjs|mjs|js)$/.test(f)).sort();
const results=[];
function run(name,cmd,args,cwd=root){
 const r=spawnSync(cmd,args,{cwd,encoding:'utf8',env:{...process.env,CI:'1'}});
 results.push({name,ok:r.status===0,status:r.status,stdout:(r.stdout||'').slice(-4000),stderr:(r.stderr||'').slice(-2000)});
}
for(const file of qa) run(`qa/${file}`,'node',[path.join('qa',file)]);
if(fs.existsSync(path.join(root,'worker','package.json'))) run('worker tests','npm',['test'],path.join(root,'worker'));
run('secret scan','node',[path.join('tools','secret-scan.mjs')]);
const failed=results.filter(x=>!x.ok);
const report={schemaVersion:1,phase:'G54.47.15I',version,createdAt:new Date().toISOString(),passed:results.length-failed.length,total:results.length,releaseDecision:failed.length?'BLOCKED':'LOCALLY_APPROVED',limitations:['Keine Aussage über produktive Firebase-Custom-Claims','Keine Aussage über Live-App-Check oder Worker-ID-Token-Verifikation','Keine reale Geräte-, Browser- oder Screenreader-Prüfung','Kein echter Firestore-Datenexport ohne explizite Übergabe'],results};
const out=path.join(root,'release','G54.47.15I_RELEASE_GATE.json');
fs.writeFileSync(out,JSON.stringify(report,null,2));
console.log(JSON.stringify({version,passed:report.passed,total:report.total,releaseDecision:report.releaseDecision,report:path.relative(root,out)},null,2));
process.exit(failed.length?1:0);
