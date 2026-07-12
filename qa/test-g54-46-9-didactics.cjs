'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
fs.mkdirSync(path.join(ROOT || process.cwd(), 'release'), { recursive: true });
function fakeEl(){return {classList:{add(){},remove(){},contains(){return false}},style:{},dataset:{},innerHTML:'',innerText:'',textContent:'',value:'',checked:false,scrollHeight:1000,clientHeight:500,scrollWidth:500,clientWidth:500,scrollTop:0,scrollLeft:0,setAttribute(){},getAttribute(){return ''},appendChild(){},remove(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},addEventListener(){},removeEventListener(){},focus(){},scrollIntoView(){}};}
function context(){
 const store={};
 const doc={readyState:'complete',documentElement:fakeEl(),body:fakeEl(),getElementById(){return fakeEl();},querySelector(){return null;},querySelectorAll(){return [];},addEventListener(){},removeEventListener(){},createElement(){return fakeEl();},dispatchEvent(){}};
 const ctx={console,setTimeout,clearTimeout,setInterval(){return 1;},clearInterval(){},Date,Math,JSON,Promise,Array,Object,String,Number,Boolean,RegExp,Map,Set,Intl,CustomEvent:function(){},window:null,document:doc,navigator:{userAgent:'VM',language:'de',onLine:true,clipboard:{writeText:async()=>{}}},location:{href:'http://vm/',origin:'http://vm',search:'',hash:'',protocol:'http:',hostname:'vm'},localStorage:{getItem:k=>Object.prototype.hasOwnProperty.call(store,k)?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},sessionStorage:{getItem(){return null;},setItem(){},removeItem(){}},SpeechSynthesisUtterance:function(){},speechSynthesis:{speak(){},cancel(){}},fetch:()=>Promise.reject(new Error('no fetch in VM')),alert(){},confirm(){return true;},prompt(){return '';},AppModuleHost:{register(){},listModules(){return [{id:'language-course-entry'}];}},ModuleHost:{register(){}},LanguageAcademyTranslationEngine:{},LanguageAcademyLanguageStore:{},LanguageAcademyHelpSystem:{},LanguageExamShell:{diagnostics(){return {ok:true};}},LanguageReviewEngine:{classify(){return {status:'new',due:false};},buildEntry(){return {};},normalizeStatus(s){return s||'new';},isReviewable(){return false;},nextDueAt(){return '';}}};
 ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);return ctx;
}
function load(){
 const ctx=context();
 vm.runInContext(fs.readFileSync(path.join(ROOT,'js/core/language-didactic-engine.js'),'utf8'),ctx,{filename:'language-didactic-engine.js'});
 let code=fs.readFileSync(path.join(ROOT,'js/modules/language-course-entry-module.js'),'utf8');
 const injection='\nwindow.__G54469_EXPORT={english:ENGLISH_COURSE_TREE,germanTree:COURSE_TREE,germanTasks:LESSON_TASKS,didacticSnapshot:languageDidacticQaSnapshot};\n';
 const idx=code.lastIndexOf('})();');code=code.slice(0,idx)+injection+code.slice(idx);
 vm.runInContext(code,ctx,{filename:'language-course-entry-module.js',timeout:30000});return ctx;
}
const ctx=load();
const engine=ctx.LanguageDidacticEngine;
const snapshot=ctx.LanguageAcademyDidacticQaSnapshot();
const exp=ctx.__G54469_EXPORT;
const checks=[];
function check(name,ok,details){checks.push({name,ok:!!ok,details:details||null});}
check('engine-present',!!engine&&engine.version==='G54.46.9'&&engine.schema==='egt-language-didactic-v1',{version:engine&&engine.version,schema:engine&&engine.schema});
check('catalog-audit-green',snapshot&&snapshot.ok,snapshot);
check('all-lessons-covered',snapshot.total===124&&snapshot.german===60&&snapshot.english===64,snapshot);
const plans=[];
for(const [level,tree] of Object.entries(exp.germanTree||{}))for(const lesson of tree.lessons||[])plans.push(engine.buildPlan({language:'de',level,lesson,tasks:exp.germanTasks[lesson.id]||[]}));
for(const [level,tree] of Object.entries(exp.english||{}))for(const lesson of tree.lessons||[])plans.push(engine.buildPlan({language:'en',level,lesson,tasks:lesson.questions||[]}));
const malformed=plans.filter(p=>!p.goal||!p.explanation||!p.modelExample||!p.guidedPractice||!p.freeApplication||!p.freeApplication.prompt||!Array.isArray(p.criteria)||p.criteria.length!==3||!Array.isArray(p.stages)||p.stages.length!==5||!p.feedback||!p.feedback.correct||!p.feedback.retry);
check('plans-complete',malformed.length===0,malformed.slice(0,10));
const mins={};for(const p of plans){mins[p.level]=p.freeApplication.minWords;}
check('cefr-transfer-demand-rises',mins.a1<mins.a2&&mins.a2<mins.b1&&mins.b1<mins.b2&&mins.b2<mins.c1&&mins.c1<mins.c2,mins);
const a1=engine.buildPlan({language:'de',level:'a1',lesson:{id:'x',title:'Begrüßung',goal:'Begrüßen.',vocab:['Hallo = Merhaba']},tasks:[{prompt:{de:'Begrüße eine Person.'},answer:'Hallo'}]});
const a1Eval=engine.evaluateTransfer({plan:a1,response:'Hallo, ich bin Liya.',checkedCriteria:['0','1']});
check('a1-transfer-ready',a1Eval.ready,a1Eval);
const b2=engine.buildPlan({language:'en',level:'b2',lesson:{id:'y',title:'Work meeting',goal:'Discuss options.',vocab:[['recommendation','Empfehlung']],speaking:['I recommend a pilot phase because it reduces risk.']},tasks:[]});
const b2Short=engine.evaluateTransfer({plan:b2,response:'I recommend a pilot.',checkedCriteria:['0','1','2']});
check('b2-short-not-ready',!b2Short.ready,b2Short);
const words=Array(48).fill('evidence').join(' ')+'. Another perspective matters. Therefore we should review the result.';
const b2Ready=engine.evaluateTransfer({plan:b2,response:words,checkedCriteria:['0','1','2']});
check('b2-transfer-ready-with-demand',b2Ready.ready,b2Ready);
check('recommendation-start-guided',engine.recommendation({done:0,total:20,accuracy:0,due:0,transferReady:false}).code==='start-guided');
check('recommendation-repeat-low-accuracy',engine.recommendation({done:4,total:20,accuracy:45,due:0,transferReady:false}).code==='repeat-guided');
check('recommendation-review-due',engine.recommendation({done:10,total:20,accuracy:80,due:2,transferReady:true}).code==='review-due');
check('recommendation-transfer-before-next',engine.recommendation({done:20,total:20,accuracy:90,due:0,transferReady:false}).code==='complete-transfer');
check('recommendation-next-lesson',engine.recommendation({done:20,total:20,accuracy:90,due:0,transferReady:true,nextLessonTitle:'Lesson 2'}).code==='next-lesson');
const saved=engine.saveRecord({language:'de',level:'a1',lessonId:'x',plan:a1,response:'Hallo, ich bin Liya.',checkedCriteria:['0','1']});
const loaded=engine.getRecord('de','a1','x');
check('transfer-persistence',saved.evaluation.ready&&loaded.response==='Hallo, ich bin Liya.'&&loaded.checkedCriteria.length===2,loaded);
const result={phase:'G54.46.9',ok:checks.every(x=>x.ok),checks,summary:{plans:plans.length,german:snapshot.german,english:snapshot.english,minimumWords:mins},checkedAt:new Date().toISOString()};
fs.writeFileSync(path.join(ROOT,'release','G54.46.9_DIDACTIC_TEST_RESULT.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({ok:result.ok,passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok).map(x=>x.name),summary:result.summary},null,2));
process.exitCode=result.ok?0:1;
