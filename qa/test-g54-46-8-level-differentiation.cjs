'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
fs.mkdirSync(path.join(ROOT || process.cwd(), 'release'), { recursive: true });
const ctx={console,Date,Math,JSON,Promise,Array,Object,String,Number,Boolean,RegExp,Map,Set,Intl,setTimeout,clearTimeout,window:null,document:{dispatchEvent(){}},CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;},navigator:{}};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
for(const f of ['data/language-exam-blueprints.js','data/language-level-difficulty-rules.js','js/modules/language-exam-engine.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f,timeout:20000});
const result=ctx.LanguageExamEngine.validateLevelDifferentiation();
const checks=[
 {name:'validator-green',ok:!!result.ok},
 {name:'a1-positive-fixture-passes',ok:result.samples.validA1.score>=50&&result.samples.validA1.passedLocal,details:{score:result.samples.validA1.score,words:result.samples.validA1.wordCount}},
 {name:'simple-answer-fails-b2',ok:result.samples.simpleB2.score<=65&&!result.samples.simpleB2.passedLocal,details:{score:result.samples.simpleB2.score}},
 {name:'structured-b2-passes',ok:result.samples.b2Full.score>=70&&result.samples.b2Full.passedLocal,details:{score:result.samples.b2Full.score,words:result.samples.b2Full.wordCount}},
 {name:'b2-harder-than-a1',ok:result.checks.some(x=>x.name==='b2-profile-harder-than-a1'&&x.ok)}
];
const output={phase:'G54.46.8',ok:checks.every(x=>x.ok),checks,engineResult:result,checkedAt:new Date().toISOString()};
fs.writeFileSync(path.join(ROOT,'release','G54.46.8_LEVEL_DIFFERENTIATION_TEST_RESULT.json'),JSON.stringify(output,null,2));
console.log(JSON.stringify({ok:output.ok,checks},null,2));process.exitCode=output.ok?0:1;
