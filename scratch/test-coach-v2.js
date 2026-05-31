const fs = require('fs');
const vm = require('vm');
const store = {};
const context = {
  console,
  window: {},
  localStorage: { getItem:k=>store[k]||null, setItem:(k,v)=>{store[k]=String(v)}, removeItem:k=>{delete store[k]} },
  document: { createElement: () => ({ innerHTML:'', get textContent(){ return this.innerHTML.replace(/<[^>]+>/g,' '); }, get innerText(){ return this.textContent; } }) },
  Date,
  Math,
  setTimeout,
  clearTimeout
};
context.window = context;
context.window.BPS_COACH_KNOWLEDGE_BASE = [{topic:'DNS', subject:'IT', keywords:['Namensauflösung'], shortAnswer:'DNS übersetzt Namen in IP-Adressen.'}];
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/learning-coach-engine.js','utf8'), context);
const E = context.window.BPSLearningCoachEngine;
if(!E || !E.version.includes('9.3.0')) throw new Error('Engine missing');
let hit = E.answer('DNS');
if(!hit.found) throw new Error('Knowledge hit failed');
let s = E.startSession({skill:'logic', difficulty:4, count:5});
if(!s.tasks || s.tasks.length !== 5) throw new Error('Session task generation failed');
let fb = E.answerSessionTask(s.tasks[0].correct);
if(!fb.ok || !fb.correct) throw new Error('Training answer failed');
let mem = E.memorySummary();
if(mem.memory.totals.generatedAnswered < 1) throw new Error('Memory not updated');
console.log('Coach V2 smoke test OK', E.version, s.tasks[0].cat, mem.totalQuote + '%');
