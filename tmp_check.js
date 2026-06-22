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
const b1=api.b1ContentSnapshot(); const b1Struct=api.b1StructureSnapshot(); const diag=api.diagnostics(); const a2=api.a2ContentSnapshot();
assert(api.__version.includes('G54.18'),'Version is not G54.18');
console.log(JSON.stringify(b1,null,2)); assert(b1.ok===true,'B1 content snapshot not ok'); assert(b1.phase==='32B','B1 content phase not 32B');
assert(b1.lessons===10,'B1 lessons != 10'); assert(b1.expandedLessons===5,'B1 expanded lessons != 5'); assert(b1.starterLessons===5,'B1 starter lessons != 5');
assert(b1.totalTasks===275,'B1 total != 275'); assert(b1.normalTasks===215,'B1 normal != 215'); assert(b1.speakingTasks===60,'B1 speaking != 60');
Object.entries(b1.perLesson).forEach(([id,l])=>{assert(l.ok, id+' not ok'); if(l.expandedContent){assert(l.tasks===43, id+' expanded tasks '+l.tasks); assert(l.speakingTasks===8, id+' expanded speaking '+l.speakingTasks);} else {assert(l.tasks===12, id+' starter tasks '+l.tasks); assert(l.speakingTasks===4, id+' starter speaking '+l.speakingTasks);}});
assert(b1Struct.ok===false || b1Struct.totalTasks!==120, 'Structure snapshot should be superseded by content expansion');
assert(diag.phase==='32B','Diagnostics phase not 32B'); assert(diag.b1Content && diag.b1Content.ok===true,'Diagnostics missing B1 content ok');
assert(a2.ok===true && a2.totalTasks===430 && a2.speakingTasks===80, 'A2 regression detected');
const result={apiVersion:api.__version,b1Content:b1,b1StructureAfterExpansion:b1Struct,a2RegressionCheck:{ok:a2.ok,totalTasks:a2.totalTasks,speakingTasks:a2.speakingTasks},diagnosticsPhase:diag.phase,errors};
fs.writeFileSync(path.join(__dirname,'phase32b_node_snapshot_result.json'), JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
