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
function assert(c,m){ if(!c) throw new Error(m); }
const b1=api.b1StructureSnapshot(); const diag=api.diagnostics(); const a2=api.a2ContentSnapshot();
assert(api.__version.includes('G54.17'),'Version is not G54.17');
assert(b1.ok===true,'B1 snapshot not ok'); assert(b1.phase==='32A','B1 phase not 32A');
assert(b1.lessons===10,'B1 lessons != 10'); assert(b1.totalTasks===120,'B1 total != 120'); assert(b1.normalTasks===80,'B1 normal != 80'); assert(b1.speakingTasks===40,'B1 speaking != 40');
Object.entries(b1.perLesson).forEach(([id,l])=>{assert(l.ok, id+' not ok'); assert(l.tasks===12, id+' tasks '+l.tasks); assert(l.speakingTasks===4, id+' speaking '+l.speakingTasks); assert(l.parallelSpeaking===true, id+' parallelSpeaking false');});
assert(diag.phase==='32A','Diagnostics phase not 32A'); assert(diag.b1Structure && diag.b1Structure.ok===true,'Diagnostics missing B1 ok');
assert(a2.ok===true && a2.totalTasks===430 && a2.speakingTasks===80, 'A2 regression detected');
const result={apiVersion:api.__version,b1Structure:b1,a2RegressionCheck:{ok:a2.ok,totalTasks:a2.totalTasks,speakingTasks:a2.speakingTasks},diagnosticsPhase:diag.phase,errors};
fs.writeFileSync(path.join(__dirname,'phase32a_node_snapshot_result.json'), JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
