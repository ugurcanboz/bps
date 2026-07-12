#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const outDir=path.join(root,'rebranding');
const exts=new Set(['.html','.js','.mjs','.cjs','.css','.json','.md','.txt','.xml','.yml','.yaml','.toml','.rules','.example']);
const ignored=new Set(['.git','node_modules','dist','build','release-backups','rebranding']);
const patterns=[['BPS',/\bBPS(?:[- _]?Trainer)?\b|\bbps(?:[_-][A-Za-z0-9]+|[A-Z][A-Za-z0-9]*)?\b/g],['CTC',/\bCTC[A-Za-z0-9_-]*\b|\bctc(?:[_-][A-Za-z0-9]+|[A-Z][A-Za-z0-9]*)?\b/g]];
function walk(dir,files=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(ignored.has(e.name))continue;const f=path.join(dir,e.name);e.isDirectory()?walk(f,files):files.push(f)}return files}
function historical(rel){return /^(docs|security|release|qa|tools)\//.test(rel)||/working-plan|readme|changelog|uebergabe|übergabe/i.test(rel)}
const hits=[], filenameHits=[];let filesScanned=0;
for(const file of walk(root)){const rel=path.relative(root,file).replaceAll(path.sep,'/');const ext=path.extname(file).toLowerCase();if(/(?:^|[-_.])(bps|ctc)(?:[-_.]|$)/i.test(path.basename(file)))filenameHits.push({path:rel,historical:historical(rel)});if(!exts.has(ext)&&!['firestore.rules','.firebaserc.example'].includes(path.basename(file)))continue;let text;try{text=fs.readFileSync(file,'utf8')}catch{continue}filesScanned++;text.split(/\r?\n/).forEach((line,i)=>{for(const [term,re] of patterns){re.lastIndex=0;for(const m of line.matchAll(re))hits.push({term,match:m[0],file:rel,line:i+1,historical:historical(rel),context:line.trim().slice(0,240)})}})}
const activeHits=hits.filter(x=>!x.historical), historicalHits=hits.filter(x=>x.historical), activeFilenameHits=filenameHits.filter(x=>!x.historical);
const result={generatedAt:new Date().toISOString(),phase:'G54.48.4',targetBrand:'Novura',targetAssessmentBrand:'Novura Assessments',targetExamBrand:'Novura Exams',slogan:"One day, you'll thank today.",summary:{filesScanned,activeContentHits:activeHits.length,historicalContentHits:historicalHits.length,activeFilenameHits:activeFilenameHits.length,historicalFilenameHits:filenameHits.length-activeFilenameHits.length},activeHits,historicalHits,filenameHits};
fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(path.join(outDir,'G54.48.4-final-scan.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result.summary,null,2));
