const fs=require('fs'); const vm=require('vm'); const path=require('path');
const errors=[];
function fakeEl(){ return {className:'',innerHTML:'',textContent:'',style:{},dataset:{},appendChild(){},remove(){},addEventListener(){},setAttribute(){},getAttribute(){return null;},querySelector(){return null;},querySelectorAll(){return []},classList:{add(){},remove(){},toggle(){},contains(){return false}}}; }
const doc={body:fakeEl(), head:fakeEl(), documentElement:fakeEl(), createElement:()=>fakeEl(), getElementById:()=>fakeEl(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}};
const context={console:{log(){},warn(){},error(...a){errors.push(a.join(' '));}}, window:{}, document:doc, navigator:{userAgent:'Mozilla/5.0 QA Chrome', standalone:false}, location:{protocol:'https:',hostname:'example.github.io',href:'https://example.github.io/index.html'}, localStorage:{_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}}, sessionStorage:{_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}}, setTimeout, clearTimeout, setInterval, clearInterval, SpeechSynthesisUtterance:function(text){this.text=text;}};
Object.assign(context.window, context); context.self=context.window; context.global=context;
context.window.AppModuleHost={register(){}, listModules(){return [{id:'language-course-entry'}]}}; context.AppModuleHost=context.window.AppModuleHost;
context.window.LanguageAcademyTranslationEngine={}; context.window.LanguageAcademyLanguageStore={}; context.window.LanguageAcademyHelpSystem={}; context.window.speechSynthesis={speak(){},cancel(){},getVoices(){return []}}; context.speechSynthesis=context.window.speechSynthesis;
vm.createContext(context);
const files=['js/i18n/language-store.js','js/i18n/language-adapter.js','js/modules/language-adaptive-engine.js','js/modules/language-course-cloud-sync.js','js/modules/language-course-entry-module.js'];
for (const f of files){ vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'), context, {filename:f}); }
const api=context.window.LanguageAcademyCourseEntry;
const a2=api.a2ContentSnapshot(); const qa=api.phase31dQaSnapshot(); const diag=api.diagnostics(); const speech=api.speechQaSnapshot();
function assert(c,m){ if(!c) throw new Error(m); }
assert(a2.ok===true,'A2 snapshot not ok'); assert(qa.ok===true,'Phase31D QA not ok'); assert(qa.phase==='31D','QA phase not 31D');
assert(a2.lessons===10&&a2.expandedLessons===10&&a2.starterLessons===0,'A2 lesson expansion mismatch');
assert(a2.totalTasks===430&&a2.speakingTasks===80&&a2.normalTasks===350,'A2 counts mismatch');
assert(qa.uniqueTaskIds===430,'Unique task IDs != 430'); assert(qa.duplicateIds.length===0,'Duplicate IDs'); assert(qa.missingFields.length===0,'Missing fields');
Object.entries(qa.perLesson).forEach(([id,l])=>{assert(l.ok, id+' not ok'); assert(l.tasks===43, id+' tasks '+l.tasks); assert(l.types.speaking_practice===8, id+' speaking '+l.types.speaking_practice);});
const result={apiVersion:api.__version,a2,phase31d:qa,diagnosticsPhase:diag.phase,diagnosticsOk:diag.ok,speechSnapshot:speech,errors};
console.log(JSON.stringify(result,null,2));
