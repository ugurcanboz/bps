#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k,...v] = a.replace(/^--/,'').split('='); return [k, v.join('=') || true];
}));
const appConfig = fs.readFileSync(path.join(root, 'js/core/app-config.js'), 'utf8');
const versionMatch = appConfig.match(/var VERSION = '([^']+)'/);
if (!versionMatch) throw new Error('Projektversion konnte aus js/core/app-config.js nicht gelesen werden.');
const version = versionMatch[1];
const rollbackGuide = `ROLLBACK-${version}.md`;
const rollbackGuidePath = path.join('docs', rollbackGuide);
const stamp = new Date().toISOString().replace(/[:.]/g,'-');
const outRoot = path.resolve(root, String(args.out || 'backup-output'));
const outDir = path.join(outRoot, `${version}-${stamp}`);
const sourceZip = path.join(outDir, `${version}-SOURCE.zip`);
const runtimeZip = path.join(outDir, `${version}-RUNTIME.zip`);
const rollbackZip = path.join(outDir, `${version}-ROLLBACK.zip`);
fs.mkdirSync(outDir, {recursive:true});

const excludes = [
  '.git/*','node_modules/*','worker/node_modules/*','functions/node_modules/*',
  'backup-output/*','*.zip','.DS_Store','Thumbs.db'
];
function zip(output, includes, extraExcludes=[]) {
  const cmd = ['-q','-r',output,...includes];
  for (const x of [...excludes,...extraExcludes]) cmd.push('-x',x);
  execFileSync('zip', cmd, {cwd:root, stdio:'inherit'});
}
function sha256(file) {
  const h=crypto.createHash('sha256'); h.update(fs.readFileSync(file)); return h.digest('hex');
}
function exists(rel){return fs.existsSync(path.join(root,rel));}

const runtimeIncludes = ['index.html','404.html','admin-portal.html','manifest.json','service-worker.js','update-check.json','module-manifest.json','firebase.json','firestore.rules','firestore.indexes.json','assets','css','data','js','modules'];
const missingRuntime = runtimeIncludes.filter(x=>!exists(x));
if (missingRuntime.length) throw new Error(`Runtime-Dateien fehlen: ${missingRuntime.join(', ')}`);

zip(sourceZip, ['.'], ['release/*.json']);
zip(runtimeZip, runtimeIncludes);

const rollbackIncludes = [...runtimeIncludes,'worker','functions','.firebaserc.example',rollbackGuidePath];
zip(rollbackZip, rollbackIncludes.filter(exists));

const firebaseExport = args['firebase-export'] ? path.resolve(String(args['firebase-export'])) : null;
let firebase = {included:false, path:null, note:'Kein echter Firestore-Export angegeben.'};
if (firebaseExport) {
  if (!fs.existsSync(firebaseExport)) throw new Error(`Firebase-Export nicht gefunden: ${firebaseExport}`);
  const stat=fs.statSync(firebaseExport);
  if ((stat.isFile() && stat.size===0) || (stat.isDirectory() && fs.readdirSync(firebaseExport).length===0)) throw new Error('Firebase-Export ist leer und wird nicht als Backup akzeptiert.');
  const target=path.join(outDir,'firebase-export');
  fs.cpSync(firebaseExport,target,{recursive:true});
  firebase={included:true,path:'firebase-export',note:'Vom Nutzer angegebener echter Export wurde kopiert.'};
}

const files=[sourceZip,runtimeZip,rollbackZip];
const manifest={
  schemaVersion:1, version, createdAt:new Date().toISOString(),
  sourceDirectory:path.basename(root),
  artifacts:files.map(f=>({file:path.basename(f),bytes:fs.statSync(f).size,sha256:sha256(f)})),
  firebase,
  restoreGuide:rollbackGuide,
  warnings: firebase.included ? [] : ['Firestore-Daten sind nicht enthalten. Vor Produktiv-Releases einen echten Firebase-Export übergeben.']
};
fs.writeFileSync(path.join(outDir,'BACKUP-MANIFEST.json'),JSON.stringify(manifest,null,2));
fs.copyFileSync(path.join(root,rollbackGuidePath),path.join(outDir,rollbackGuide));
console.log(JSON.stringify({ok:true,outDir,artifacts:manifest.artifacts,firebase:manifest.firebase},null,2));
