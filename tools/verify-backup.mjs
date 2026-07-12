#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const dir=path.resolve(process.argv[2]||'');
if(!dir||!fs.existsSync(dir)) throw new Error('Backup-Ordner angeben.');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'BACKUP-MANIFEST.json'),'utf8'));
for(const a of manifest.artifacts){const f=path.join(dir,a.file);if(!fs.existsSync(f))throw new Error(`Fehlt: ${a.file}`);const h=crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');if(h!==a.sha256)throw new Error(`Prüfsumme falsch: ${a.file}`);}
console.log(JSON.stringify({ok:true,version:manifest.version,checked:manifest.artifacts.length,firebaseIncluded:manifest.firebase.included},null,2));
