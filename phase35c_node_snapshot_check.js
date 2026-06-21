
global.window=global;
global.document={querySelector:function(){return null;},addEventListener:function(){},createElement:function(){return {style:{},classList:{add:function(){},remove:function(){}},appendChild:function(){},setAttribute:function(){},innerHTML:''};},body:{appendChild:function(){}}};
global.navigator={userAgent:'Node QA Phase35C'};
global.localStorage={getItem:function(){return null;},setItem:function(){},removeItem:function(){}};
global.AppModuleHost={register:function(){},listModules:function(){return [{id:'language-course-entry'}];}};
require('./js/modules/language-course-entry-module.js');
var snap=window.LanguageAcademyCourseEntry.c2ContentSnapshot();
var diag=window.LanguageAcademyCourseEntry.diagnostics();
var errors=[];
if(!snap.ok) errors.push('c2 content snapshot ok=false');
if(snap.phase!=='35C') errors.push('phase not 35C');
if(snap.expandedLessons!==10) errors.push('expanded not 10');
if(snap.starterLessons!==0) errors.push('starter not 0');
if(snap.totalTasks!==430) errors.push('total not 430');
if(snap.normalTasks!==350) errors.push('normal not 350');
if(snap.speakingTasks!==80) errors.push('speaking not 80');
if(!diag || diag.phase!=='35C') errors.push('diagnostics phase not 35C');
var result={ok:errors.length===0,errors:errors,c2:snap,diagnostics:{phase:diag.phase,version:diag.version}};
require('fs').writeFileSync('phase35c_node_snapshot_result.json', JSON.stringify(result,null,2));
if(errors.length){console.error(errors.join('\n')); process.exit(1);}
console.log('PASS phase35C snapshot', JSON.stringify({total:snap.totalTasks,normal:snap.normalTasks,speaking:snap.speakingTasks,expanded:snap.expandedLessons},null,2));
