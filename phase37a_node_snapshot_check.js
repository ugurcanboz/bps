global.window=global;
global.document={querySelector:function(){return null;},addEventListener:function(){},body:{}};
global.localStorage={_:{},getItem:function(k){return this._[k]||null;},setItem:function(k,v){this._[k]=String(v);},removeItem:function(k){delete this._[k];}};
global.navigator={userAgent:'node'};
require('./js/modules/language-course-entry-module.js');
const snap=window.LanguageAcademyCourseEntry.placementTestSnapshot();
const qa=window.LanguageAcademyCourseEntry.phase37aQaSnapshot();
if(!snap.ok||!qa.ok){console.error(JSON.stringify({snap,qa},null,2));process.exit(1)}
console.log('PASS phase37A placement test', JSON.stringify({questions:snap.totalQuestions,normal:snap.normalQuestions,speaking:snap.speakingQuestions,levels:snap.levels},null,2));
require('fs').writeFileSync('phase37a_node_snapshot_result.json', JSON.stringify({ok:true,snap,qa},null,2));
