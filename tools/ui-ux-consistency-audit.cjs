'use strict';
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');const findings=[];
const css='css/ui-ux-consistency.css';if(!fs.existsSync(path.join(root,css)))findings.push('consistency stylesheet missing');
for(const page of ['index.html','admin-portal.html']){const s=read(page);if(!s.includes('./'+css))findings.push(page+' does not load consistency stylesheet');}
const sheet=read(css);
for(const token of ['--nv-space-4','--nv-radius-md','--nv-touch','focus-visible','prefers-reduced-motion','forced-colors'])if(!sheet.includes(token))findings.push('missing token/rule '+token);
const sw=read('service-worker.js');if(!sw.includes('./'+css))findings.push('service worker does not cache consistency stylesheet');
const result={version:'G54.50.2B',checks:8-findings.length,expected:8,findings};console.log(JSON.stringify(result,null,2));process.exitCode=findings.length?1:0;
