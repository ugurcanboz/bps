const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const store = {};
const ctx = {
  console,
  Math,
  Date,
  JSON,
  setTimeout,
  clearTimeout,
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
const stats = e.databaseStats();
if(!stats.total || stats.total < 100) throw new Error('bank not connected: '+JSON.stringify(stats));
const session = e.startSession({skill:'math', difficulty:4, count:6});
if(!session.tasks.length) throw new Error('no tasks');
const bankCount = session.tasks.filter(t => t.bankDriven).length;
if(bankCount < 3) throw new Error('too few bank tasks: '+bankCount);
if(!session.tasks.every(t => Array.isArray(t.a) && t.a.length >= 2 && typeof t.q === 'string')) throw new Error('bad task shape');
const ans = e.answerSessionTask(session.tasks[0].correct);
if(!ans.ok || !ans.correct) throw new Error('answer feedback broken');
const rec = e.answer('Starte 5 schwere Logikaufgaben', {});
if(rec.mode !== 'start-training') throw new Error('training intent broken');
console.log(JSON.stringify({ok:true, stats, bankCount, first:session.tasks[0].id, version:e.version}, null, 2));
