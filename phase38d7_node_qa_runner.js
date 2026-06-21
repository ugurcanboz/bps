const fs = require('fs');
const vm = require('vm');
const path = __dirname;
const ctx = {
  window: {},
  document: { dispatchEvent(){}, addEventListener(){}, querySelectorAll(){ return []; } },
  CustomEvent: function(){},
  console,
  Date,
  setInterval(){},
  localStorage: { getItem(){ return null; }, setItem(){}, removeItem(){} },
  navigator: {}
};
ctx.window = ctx;
vm.createContext(ctx);
[
  'data/language-exam-blueprints.js',
  'data/language-level-difficulty-rules.js',
  'data/language-b1-exam-pilot.js',
  'data/language-b2-exam-pilot.js',
  'js/modules/language-exam-engine.js',
  'js/modules/language-exam-shell.js'
].forEach(file => vm.runInContext(fs.readFileSync(path + '/' + file, 'utf8'), ctx, { filename:file }));
const result = ctx.LanguageExamEngine.validateB2HardmodeTotalQa();
console.log(JSON.stringify({
  ok: result.ok,
  phase: result.phase,
  pool: ctx.LanguageB2ExamPilot.poolInfo(),
  shell: ctx.LanguageExamShell.diagnostics(),
  checks: result.checks,
  scenarios: result.validation.scenarios
}, null, 2));
if(!result.ok) process.exit(2);
