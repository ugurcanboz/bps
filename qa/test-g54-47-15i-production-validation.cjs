const fs=require('fs');
const files=['tools/production-validation.mjs','docs/ROLLBACK-G54.47.15I.md'];
const script=fs.readFileSync('tools/production-validation.mjs','utf8');
const cfg=fs.readFileSync('js/core/app-config.js','utf8');
const checks=[
 ...files.map(f=>[f,fs.existsSync(f)]),
 ['version',/var VERSION = 'G54\.\d+\.\d+(?:[A-Z]|\.\d+)?'/.test(cfg)],
 ['release gate included',script.includes("tools/release-gate.mjs")],
 ['functions tests included',script.includes("Cloud Functions Tests")],
 ['firestore tests included',script.includes("Firestore Security Tests")],
 ['workflow validation included',script.includes("Workflow eingebunden")],
 ['limitations explicit',script.includes("Reale physische Geräte")]
];
const failed=checks.filter(x=>!x[1]);console.log(JSON.stringify({phase:'G54.47.15I',passed:checks.length-failed.length,total:checks.length,checks},null,2));process.exit(failed.length?1:0);
