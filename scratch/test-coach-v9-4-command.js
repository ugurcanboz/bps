const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const store = {};
const ctx = {
  console, Math, Date, JSON, setTimeout, clearTimeout,
  window: {},
  localStorage: {
    getItem: k => store[k] || null,
    setItem: (k,v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  },
  document: undefined
};
ctx.window = ctx;
vm.createContext(ctx);
['data/question-bank.js','data/question-bank-kaufm.js','data/question-bank-sozial.js','data/question-bank-it-extra.js','data/question-bank-mathe.js','data/coach-knowledge-base.js','js/learning-coach-engine.js'].forEach(file => {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), ctx, { filename:file });
});
const e = ctx.window.BPSLearningCoachEngine;
if(!e) throw new Error('engine missing');
if(typeof e.commandCenter !== 'function') throw new Error('commandCenter missing');
if(typeof e.readinessScore !== 'function') throw new Error('readinessScore missing');
let cc = e.commandCenter();
if(!cc.readiness || typeof cc.readiness.bps !== 'number' || typeof cc.readiness.ctc !== 'number') throw new Error('readiness shape broken');
if(!Array.isArray(cc.modes) || cc.modes.length < 5) throw new Error('modes missing');
const session = e.startSession({ mode:'ctc-hard', skill:'mixed', difficulty:5, count:8 });
if(session.mode !== 'ctc-hard') throw new Error('mode not preserved');
if(session.count < 8) throw new Error('ctc-hard count broken');
if(!session.tasks.some(t => t.stage === 'Challenge')) throw new Error('dramaturgy missing challenge');
for(const t of session.tasks.slice(0,3)) e.answerSessionTask(t.correct);
cc = e.commandCenter();
if(cc.today.answered < 3) throw new Error('daily tracking broken');
if(!cc.recentRewards.length) throw new Error('dopamine rewards missing');
console.log(JSON.stringify({ok:true, version:e.version, readiness:cc.readiness, today:cc.today, modes:cc.modes.map(m=>m.id)}, null, 2));
