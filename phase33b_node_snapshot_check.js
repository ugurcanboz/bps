const fs=require('fs');
const path=require('path');
global.window=global;
global.document={querySelector(){return null;},querySelectorAll(){return[];},addEventListener(){},createElement(){return {style:{},classList:{add(){},remove(){},toggle(){}},dataset:{},setAttribute(){},appendChild(){},querySelector(){return null;},querySelectorAll(){return[];},innerHTML:''};},body:{appendChild(){}}};
global.navigator={userAgent:'Node QA Phase33B'};
global.localStorage={_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}};
global.AppModuleHost={register(){},listModules(){return [{id:'language-course-entry'}]}};
global.EGTUILayer={openDeepSheet(){return true}};
global.speechSynthesis={speak(){},cancel(){},getVoices(){return[]}};
const vm=require('vm');
const code=fs.readFileSync(path.join(__dirname,'js/modules/language-course-entry-module.js'),'utf8');
vm.runInThisContext(code,{filename:'language-course-entry-module.js'});
const api=global.LanguageAcademyCourseEntry;
const b2=api.b2ContentSnapshot();
const b1=api.b1ContentSnapshot();
const a2=api.a2ContentSnapshot();
const diag=api.diagnostics();
const errors=[];
if(!b2.ok) errors.push('B2 content not ok');
if(b2.phase!=='33B') errors.push('phase not 33B');
if(b2.lessons!==10) errors.push('B2 lessons invalid');
if(b2.expandedLessons!==5 || b2.starterLessons!==5) errors.push('B2 expansion split invalid');
if(b2.totalTasks!==275 || b2.normalTasks!==215 || b2.speakingTasks!==60) errors.push('B2 totals invalid');
Object.entries(b2.perLesson||{}).forEach(([id,row])=>{
  if(row.expandedContent){ if(!row.ok || row.tasks!==43 || row.speakingTasks!==8) errors.push(id+': expanded invalid '+JSON.stringify(row)); }
  else { if(!row.ok || row.tasks!==12 || row.speakingTasks!==4) errors.push(id+': starter invalid '+JSON.stringify(row)); }
});
if(!b1.ok || b1.totalTasks!==430 || b1.speakingTasks!==80) errors.push('B1 regression invalid');
if(!a2.ok || a2.totalTasks!==430 || a2.speakingTasks!==80) errors.push('A2 regression invalid');
if(!diag.b2Content || !diag.b2Content.ok) errors.push('diagnostics missing b2Content');
if(diag.phase!=='33B') errors.push('diagnostics phase not 33B');
const result={pass:errors.length===0,errors,b2:{ok:b2.ok,phase:b2.phase,lessons:b2.lessons,expandedLessons:b2.expandedLessons,starterLessons:b2.starterLessons,totalTasks:b2.totalTasks,normalTasks:b2.normalTasks,speakingTasks:b2.speakingTasks},b1:{ok:b1.ok,totalTasks:b1.totalTasks,speakingTasks:b1.speakingTasks},a2:{ok:a2.ok,totalTasks:a2.totalTasks,speakingTasks:a2.speakingTasks},diagnostics:{phase:diag.phase,version:diag.version,hasB2Content:!!diag.b2Content}};
fs.writeFileSync(path.join(__dirname,'phase33b_node_snapshot_result.json'), JSON.stringify(result,null,2));
if(errors.length){ console.error(JSON.stringify(result,null,2)); process.exit(1); }
console.log('PASS phase33B snapshot', JSON.stringify(result.b2,null,2));
