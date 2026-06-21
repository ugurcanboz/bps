const fs=require('fs'), path=require('path'), vm=require('vm');
global.window=global; global.document={querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},createElement(){return {style:{},classList:{add(){},remove(){},toggle(){}},dataset:{},setAttribute(){},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},innerHTML:''}},body:{appendChild(){}}};
global.navigator={userAgent:'Node Duplicate QA'}; global.localStorage={_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}}; global.AppModuleHost={register(){},listModules(){return [{id:'language-course-entry'}]}}; global.EGTUILayer={openDeepSheet(){return true}}; global.speechSynthesis={speak(){},cancel(){},getVoices(){return[]}};
vm.runInThisContext(fs.readFileSync(path.join(__dirname,'js/modules/language-course-entry-module.js'),'utf8'));
const snap=LanguageAcademyCourseEntry.c1ContentSnapshot();
const result={pass:snap.ok, c1:snap};
fs.writeFileSync('phase34b_duplicate_check_result.json',JSON.stringify(result,null,2));
if(!snap.ok) process.exit(1); console.log('PASS phase34B detailed c1 snapshot');
