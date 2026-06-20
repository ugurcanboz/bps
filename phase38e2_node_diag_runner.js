
const fs=require('fs'), vm=require('vm'), path=require('path');
const root=__dirname;
global.window=global;
global.document={querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({}),body:{appendChild:()=>{}},addEventListener:()=>{}};
global.localStorage={_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=String(v)},removeItem(k){delete this._[k]}};
function load(p){ vm.runInThisContext(fs.readFileSync(path.join(root,p),'utf8'),{filename:p}); }
['data/language-exam-blueprints.js','data/language-level-difficulty-rules.js','data/language-b1-exam-pilot.js','data/language-b2-exam-pilot.js','js/modules/language-exam-engine.js','js/modules/language-exam-shell.js'].forEach(load);
const diag=window.LanguageExamShell.diagnostics();
const profile=window.LanguageExamShell.buildWeaknessProfile('B2',{level:'B2',completedParts:5,partScores:{reading:82,listening:44,grammar:61,writing:74,speaking:88}});
console.log(JSON.stringify({diag,first:profile.priority[0].part,count:profile.entries.length,action:profile.action}));
process.exit(0);
