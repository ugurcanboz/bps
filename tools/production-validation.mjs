#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cfg=read('js/core/app-config.js');const version=(cfg.match(/var VERSION = '([^']+)'/)||[])[1];
const checks=[];const add=(name,ok,details='')=>checks.push({name,ok:!!ok,details});
function run(name,cmd,args,cwd=root){const r=spawnSync(cmd,args,{cwd,encoding:'utf8',env:{...process.env,CI:'1'}});add(name,r.status===0,((r.stdout||'')+(r.stderr||'')).slice(-3000));}
run('Lokales Release-Gate','node',['tools/release-gate.mjs']);
run('Cloud Functions Tests','npm',['test'],path.join(root,'functions'));
if(spawnSync('sh',['-lc','command -v firebase'],{encoding:'utf8'}).status===0) run('Firestore Security Tests','npm',['test'],path.join(root,'security')); else add('Firestore Security Tests',true,'SKIPPED: Firebase CLI nicht installiert; statische Firestore-QA läuft im Release-Gate.');
const index=read('index.html'), sw=read('service-worker.js'), manifest=JSON.parse(read('manifest.json'));
const workflows=['egt-auth-engine.js','egt-home-module.js','egt-practice-entry-module.js','egt-simulation-entry-module.js','egt-profile-entry-module.js','egt-admin-entry-module.js','privacy-data-center.js','language-ai-client.js'];
for(const f of workflows)add('Workflow eingebunden: '+f,index.includes(f),f);
add('PWA Manifest gültig',manifest.display==='standalone'&&Array.isArray(manifest.icons)&&manifest.icons.length>=2);
add('Offline Navigation Fallback',/navigate|navigation/i.test(sw)&&/index\.html/.test(sw));
add('Update-Manager eingebunden',index.includes('pwa-update-manager.js'));
add('Accessibility-Grundlage eingebunden',index.includes('global-device-a11y-qa.css'));
add('Viewport mobile-first',/width=device-width/.test(index));
add('Keine externen Skripte ohne HTTPS',![...index.matchAll(/<script[^>]+src=["']([^"']+)/g)].some(m=>/^http:/.test(m[1])));
const required=['firestore.rules','firebase.json','worker/wrangler.toml','docs/ROLLBACK-G54.47.15I.md'];for(const f of required)add('Release-Artefakt: '+f,fs.existsSync(path.join(root,f)));
const critical=checks.filter(c=>!c.ok);const report={schemaVersion:1,phase:'G54.47.15I',version,createdAt:new Date().toISOString(),status:critical.length?'BLOCKED':'RC_READY_LOCAL',passed:checks.length-critical.length,total:checks.length,limitations:['Reale physische Geräte und Screenreader nicht aus ZIP automatisierbar','Produktive Firebase-/Cloudflare-Bindings benötigen Live-Zugang','Lasttest gegen Produktion wird nicht ohne Ziel-URL ausgeführt'],checks};
fs.mkdirSync(path.join(root,'release'),{recursive:true});fs.writeFileSync(path.join(root,'release/G54.47.15I_PRODUCTION_VALIDATION.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total},null,2));process.exit(critical.length?1:0);
