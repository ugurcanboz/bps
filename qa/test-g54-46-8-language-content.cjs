'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
fs.mkdirSync(path.join(ROOT || process.cwd(), 'release'), { recursive: true });
function fakeEl(){return {classList:{add(){},remove(){},contains(){return false}},style:{},dataset:{},innerHTML:'',innerText:'',textContent:'',value:'',checked:false,scrollHeight:1000,clientHeight:500,scrollWidth:500,clientWidth:500,scrollTop:0,scrollLeft:0,setAttribute(){},getAttribute(){return ''},appendChild(){},remove(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},addEventListener(){},removeEventListener(){},focus(){},scrollIntoView(){}};}
function load(){
 let code=fs.readFileSync(path.join(ROOT,'js/modules/language-course-entry-module.js'),'utf8');
 const injection='\nwindow.__G54468_EXPORT={english:ENGLISH_COURSE_TREE,germanTree:COURSE_TREE,germanTasks:LESSON_TASKS};\n';
 const idx=code.lastIndexOf('})();');
 code=code.slice(0,idx)+injection+code.slice(idx);
 const doc={readyState:'complete',documentElement:fakeEl(),body:fakeEl(),getElementById(){return fakeEl();},querySelector(){return null;},querySelectorAll(){return [];},addEventListener(){},removeEventListener(){},createElement(){return fakeEl();},dispatchEvent(){}};
 const store={};
 const ctx={console,setTimeout,clearTimeout,setInterval(){return 1;},clearInterval(){},Date,Math,JSON,Promise,Array,Object,String,Number,Boolean,RegExp,Map,Set,Intl,CustomEvent:function(){},window:null,document:doc,navigator:{userAgent:'VM',language:'de',onLine:true,clipboard:{writeText:async()=>{}}},location:{href:'http://vm/',origin:'http://vm',search:'',hash:''},localStorage:{getItem:k=>Object.prototype.hasOwnProperty.call(store,k)?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},sessionStorage:{getItem(){return null;},setItem(){},removeItem(){}},SpeechSynthesisUtterance:function(){},speechSynthesis:{speak(){},cancel(){}},fetch:()=>Promise.reject(new Error('no fetch in VM')),alert(){},confirm(){return true;},prompt(){return '';},AppModuleHost:{register(){},listModules(){return [{id:'language-course-entry'}];}},ModuleHost:{register(){}},LanguageAcademyTranslationEngine:{},LanguageAcademyLanguageStore:{},LanguageAcademyHelpSystem:{},LanguageExamShell:{diagnostics(){return {ok:true};}},LanguageReviewEngine:{classify(){return {status:'new',due:false};},buildEntry(){return {};},normalizeStatus(s){return s||'new';},isReviewable(){return false;},nextDueAt(){return '';}}};
 ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(code,ctx,{filename:'language-course-entry-module.js',timeout:25000});return ctx;
}
function text(v){if(v==null)return '';if(typeof v==='string'||typeof v==='number'||typeof v==='boolean')return String(v);if(Array.isArray(v))return v.map(text).join(' | ');if(typeof v==='object')return Object.values(v).map(text).join(' | ');return '';}
const ctx=load();
const report=ctx.LanguageAcademyCourseEntry.contentQualityG54468();
const exp=ctx.__G54468_EXPORT;
const checks=[];
function check(name,ok,details){checks.push({name,ok:!!ok,details:details||null});}
check('internal-content-gate',report&&report.ok,report);
const forbidden=[/Symptom\s*\/\s*deutsche Bedeutung/i,/about in my opinion/i,/problem with I disagree/i,/headache is useful/i,/\b(?:todo|tbd|lorem ipsum|dummy|replace me)\b/i,/I can say "[^"]+" in a short sentence/i,/I can use "[^"]+" in a short everyday answer/i];
const activeTexts=[];
for(const [level,tree] of Object.entries(exp.english||{})) for(const lesson of tree.lessons||[]){for(const q of lesson.questions||[])activeTexts.push({language:'en',level,lesson:lesson.id,id:q.id,text:text(q)});for(const q of lesson.speaking||[])activeTexts.push({language:'en',level,lesson:lesson.id,id:q&&q.id||'',text:text(q)});}
for(const [level,tree] of Object.entries(exp.germanTree||{})) for(const lesson of tree.lessons||[]) for(const q of exp.germanTasks[lesson.id]||[])activeTexts.push({language:'de',level,lesson:lesson.id,id:q.id,text:text(q)});
const forbiddenHits=[];for(const row of activeTexts)for(const rx of forbidden)if(rx.test(row.text))forbiddenHits.push({language:row.language,level:row.level,lesson:row.lesson,id:row.id,pattern:rx.source});
check('no-active-placeholders-or-broken-templates',forbiddenHits.length===0,forbiddenHits.slice(0,20));
const englishChoiceErrors=[];
for(const [level,tree] of Object.entries(exp.english||{})) for(const lesson of tree.lessons||[]) for(const q of lesson.questions||[]){const choices=Array.isArray(q.choices)?q.choices:[];const norm=choices.map(x=>String(x).trim().toLowerCase());if(choices.length!==4||new Set(norm).size!==4||!norm.includes(String(q.correct||'').trim().toLowerCase()))englishChoiceErrors.push({level,lesson:lesson.id,id:q.id,choices:choices.length});}
check('english-options-valid',englishChoiceErrors.length===0,englishChoiceErrors.slice(0,20));
for(const level of ['b1','b2','c1','c2']){const tree=exp.germanTree[level],stats=(tree.lessons||[]).map(lesson=>{const list=exp.germanTasks[lesson.id]||[];return {lesson:lesson.id,count:list.length,speaking:list.filter(q=>(q.type||q.kind)==='speaking_practice').length,types:new Set(list.map(q=>q.type||q.kind)).size};});check('german-'+level+'-rich-content',stats.length===10&&stats.every(x=>x.count>=43&&x.speaking>=8&&x.types>=7),stats);if(level==='c1'||level==='c2'){const firstTypes=(tree.lessons||[]).map(lesson=>{const first=(exp.germanTasks[lesson.id]||[])[0]||{};return first.type||first.kind||'';});check('german-'+level+'-advanced-entry-not-vocabulary-only',firstTypes.every(x=>x!=='multiple_choice'),firstTypes);}}
for(const level of ['en-c1','en-c2']){const r=report.english.levels[level];check(level+'-advanced-balance',r&&r.ok&&r.lexicalRatio<=0.35,r);}
const result={phase:'G54.46.8',ok:checks.every(x=>x.ok),checks,contentReport:report,activeTextEntries:activeTexts.length,checkedAt:new Date().toISOString()};
fs.writeFileSync(path.join(ROOT,'release','G54.46.8_LANGUAGE_CONTENT_TEST_RESULT.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({ok:result.ok,checks:checks.map(x=>({name:x.name,ok:x.ok}))},null,2));
process.exitCode=result.ok?0:1;
