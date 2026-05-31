const fs = require('fs');
const vm = require('vm');
const store = new Map();
const context = {
  console,
  window: {},
  document: undefined,
  localStorage: {
    getItem: k => store.has(k) ? store.get(k) : null,
    setItem: (k,v) => store.set(k,String(v)),
    removeItem: k => store.delete(k)
  },
  Date,
  Math,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
['data/question-bank.js','data/question-bank-kaufm.js','data/question-bank-sozial.js','data/question-bank-it-extra.js','data/question-bank-mathe.js','data/coach-knowledge-base.js','js/learning-coach-engine.js'].forEach(file => {
  vm.runInContext(fs.readFileSync(file,'utf8'), context, { filename:file });
});
const E = context.window.BPSLearningCoachEngine;
if(!E) throw new Error('Engine missing');
if(!/9\.5/.test(E.version)) throw new Error('wrong version '+E.version);
const stats = E.databaseStats();
if(stats.total < 400) throw new Error('DB too small '+stats.total);
E.setPersonality('strict');
if(E.personality().id !== 'strict') throw new Error('personality failed');
const dc = E.dailyChallenge();
if(!dc || !dc.mode) throw new Error('daily challenge missing');
const sess = E.startSession({mode:'daily'});
if(!sess.tasks || sess.tasks.length < 5) throw new Error('daily session invalid');
let first = sess.tasks[0];
E.answerSessionTask(first.correct);
const sess2 = E.startSession({mode:'revenge'});
if(!sess2.tasks || !sess2.tasks.length) throw new Error('revenge session invalid');
const cc = E.commandCenter();
if(!cc.weekly || !cc.dailyChallenge || !cc.personality || !Array.isArray(cc.mistakeInsights)) throw new Error('command center v9.5 fields missing');
console.log(JSON.stringify({version:E.version, db:stats.total, daily:dc.title, personality:E.personality().title, weekly:cc.weekly.week, modes:cc.modes.length}, null, 2));
