
global.window=global;
global.document={querySelector:function(){return null;},addEventListener:function(){},createElement:function(){return {style:{},classList:{add:function(){},remove:function(){}},appendChild:function(){},setAttribute:function(){},innerHTML:''};},body:{appendChild:function(){}}};
global.navigator={userAgent:'Node QA Phase35B'};
global.localStorage={getItem:function(){return null;},setItem:function(){},removeItem:function(){}};
global.AppModuleHost={register:function(){},listModules:function(){return [{id:'language-course-entry'}];}};
require('./js/modules/language-course-entry-module.js');
var snap=window.LanguageAcademyCourseEntry.c2ContentSnapshot();
var diag=window.LanguageAcademyCourseEntry.diagnostics();
var errors=[];
if(!snap.ok) errors.push('c2 content snapshot ok=false');
if(snap.phase!=='35B') errors.push('phase not 35B');
if(snap.expandedLessons!==5) errors.push('expanded not 5');
if(snap.starterLessons!==5) errors.push('starter not 5');
if(snap.totalTasks!==275) errors.push('total not 275');
if(snap.normalTasks!==215) errors.push('normal not 215');
if(snap.speakingTasks!==60) errors.push('speaking not 60');
if(!diag || diag.phase!=='35B') errors.push('diagnostics phase not 35B');
var result={ok:errors.length===0,errors:errors,c2:snap,diagnostics:{phase:diag.phase,version:diag.version}};
require('fs').writeFileSync('phase35b_node_snapshot_result.json', JSON.stringify(result,null,2));
if(errors.length){console.error(errors.join('\n')); process.exit(1);}
console.log('PASS phase35B snapshot', JSON.stringify({total:snap.totalTasks,speaking:snap.speakingTasks,expanded:snap.expandedLessons},null,2));
