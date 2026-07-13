const fs=require('fs'),assert=require('assert');
const index=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('service-worker.js','utf8'),client=fs.readFileSync('js/modules/language-speaking-ai-client.js','utf8'),engine=fs.readFileSync('js/modules/language-exam-engine.js','utf8'),shell=fs.readFileSync('js/modules/language-exam-shell.js','utf8'),course=fs.readFileSync('js/modules/language-course-entry-module.js','utf8'),ledger=fs.readFileSync('js/core/activity-ledger-engine.js','utf8');
const checks=[];function check(name,fn){try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}}
check('index-exact-once',()=>assert.equal(index.split('language-speaking-evidence-engine.js').length-1,1));
check('sw-exact-once',()=>assert.equal(sw.split('language-speaking-evidence-engine.js').length-1,1));
check('load-before-course',()=>assert(index.indexOf('language-speaking-evidence-engine.js')<index.indexOf('language-course-entry-module.js')));
check('load-before-exam-engine',()=>assert(index.indexOf('language-speaking-evidence-engine.js')<index.indexOf('language-exam-engine.js')));
check('ai-null-audio-scores',()=>{for(const t of ['result.fluencyScore=null','result.pronunciationScore=null','result.intonationScore=null','result.audioFluencyScore=null'])assert(client.includes(t),t);});
check('ai-text-flow',()=>assert(client.includes('textFlowScore')));
check('exam-passes-evidence',()=>assert(shell.includes('evidence:normalizedSpeakingEvidence(session,text)')));
check('exam-transparent-disclosure',()=>{for(const t of ['Transparente Sprechbewertung','Aussprache, Intonation','Bewertungsumfang'])assert(shell.includes(t),t);});
check('exam-engine-attaches-assessment',()=>{for(const t of ['hybrid.speakingAssessment','hybrid.audioMeasured','Textbasierte Sprechaufgabe'])assert(engine.includes(t),t);});
check('course-recognition-evidence',()=>assert(course.includes("source:'speech-recognition-transcript'")));
check('course-text-similarity-label',()=>assert(course.includes('Textähnlichkeit:')));
check('course-not-pronunciation-label',()=>assert(course.includes('keine Aussprachemessung')));
check('ledger-persists-scope',()=>{assert(ledger.includes('speakingAssessmentScope'));assert(ledger.includes("eventType:p.part==='speaking'?'speech-evaluated'"));});
check('current-version',()=>{const app=fs.readFileSync('js/core/app-config.js','utf8');const v=(app.match(/var VERSION = '([^']+)'/)||[])[1];assert(/^G54\.(?:4[7-9]|[5-9]\d)\./.test(v||''));assert(sw.includes(v));});
const out={phase:'G54.46.12',ok:checks.every(x=>x.ok),checks};console.log(JSON.stringify(out,null,2));if(!out.ok)process.exit(1);
