#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
globalThis.AppConfig={courseId:'course_2026_gk',build:'G54.46.3-migration'};
const ledger=require('../js/core/activity-ledger-engine.js');

const [, , inputArg, outputArg]=process.argv;
if(!inputArg){
  console.error('Aufruf: node tools/migrate-activity-ledger.mjs <export.json> [ausgabe.json]');
  process.exit(2);
}
const input=path.resolve(process.cwd(),inputArg);
const output=path.resolve(process.cwd(),outputArg||input.replace(/\.json$/i,'')+'-g54.46.3.json');
const parsed=JSON.parse(fs.readFileSync(input,'utf8'));
let changed=0, untouched=0;
function migrate(profile){
  if(!profile||typeof profile!=='object'||Array.isArray(profile))return profile;
  const already=profile.activitySummary&&profile.activitySummary.schema===ledger.summarySchema;
  const next=ledger.migrateLegacyProfile(profile);
  if(already)untouched++; else changed++;
  return next;
}
let result;
if(Array.isArray(parsed)) result=parsed.map(migrate);
else if(Array.isArray(parsed.learners)) result={...parsed,learners:parsed.learners.map(migrate)};
else if(parsed.learners&&typeof parsed.learners==='object') result={...parsed,learners:Object.fromEntries(Object.entries(parsed.learners).map(([k,v])=>[k,migrate(v)]))};
else result=Object.fromEntries(Object.entries(parsed).map(([k,v])=>[k,migrate(v)]));
const migrationReport={phase:'G54.46.3',schema:ledger.schema,summarySchema:ledger.summarySchema,migratedAt:new Date().toISOString(),changed,untouched,policy:'Legacy-Zähler werden getrennt gespeichert und nicht in echte Sessions umgewandelt.'};
// Objekt-Exporte behalten einen eingebetteten Bericht. Array-Exporte können keine
// benannten Eigenschaften zuverlässig in JSON serialisieren; deshalb wird für
// jede Eingabe zusätzlich ein separates, reproduzierbares Report-JSON erzeugt.
if(result && !Array.isArray(result) && typeof result==='object') result.migrationReport=migrationReport;
const reportOutput=output.replace(/\.json$/i,'')+'.migration-report.json';
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(reportOutput,JSON.stringify(migrationReport,null,2)+'\n');
console.log(JSON.stringify({ok:true,input,output,reportOutput,changed,untouched},null,2));
