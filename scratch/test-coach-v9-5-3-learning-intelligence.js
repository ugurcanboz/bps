const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const store = {};
const context = {
  console,
  window: {},
  localStorage: {
    getItem:k => Object.prototype.hasOwnProperty.call(store,k) ? store[k] : null,
    setItem:(k,v) => { store[k] = String(v); },
    removeItem:k => { delete store[k]; }
  },
  document: undefined,
  Math,
  Date,
  setTimeout,
  clearTimeout
};
context.window = context;
context.BPS_COACH_KNOWLEDGE_BASE = [{ id:'dns', topic:'DNS', subject:'IT', keywords:['dns'], shortAnswer:'DNS löst Namen auf.' }];
context.QUESTION_BANK = [
  { id:'zr_dna_1', dna:{category:'logik', subtype:'wechselmuster', difficulty:4, skill:'musterwechsel_erkennen', expectedTimeMs:12000, trap:'nur Addition vermutet', examTarget:'ctc'}, q:'3, 6, 8, 16, 18, ?', a:['20','26','34','36'], correct:3, verified:true, explanation:'Wechsel: mal 2, plus 2.' },
  { id:'it_dna_1', dna:{category:'it', subtype:'netzwerk', difficulty:3, skill:'dns_dhcp_unterscheiden', expectedTimeMs:15000, trap:'DNS und DHCP verwechselt', examTarget:'bps'}, q:'Name wird nicht aufgelöst, IP pingbar. Was prüfen?', a:['DNS','DHCP','Monitor','RAM'], correct:0, verified:true },
  { id:'math_infer_1', cat:'Mathe', group:'Prozent', difficulty:3, q:'20% von 150?', a:['20','25','30','35'], correct:2, verified:true, trap:'Grundwert verwechselt' }
];
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'), context);
const eng = context.BPSLearningCoachEngine;
if(!eng) throw new Error('Engine missing');
if(!String(eng.version).includes('9.5.3')) throw new Error('Wrong version: '+eng.version);
const dna = eng.normalizeTaskDNA(context.QUESTION_BANK[0]);
if(dna.category !== 'logik' || dna.skill !== 'musterwechsel_erkennen' || dna.expectedTimeMs !== 12000) throw new Error('DNA normalization failed');
const inferred = eng.normalizeTaskDNA(context.QUESTION_BANK[2]);
if(!inferred.inferred || inferred.category !== 'mathe') throw new Error('DNA inference failed');
const session = eng.startSession({ mode:'revenge', skill:'logic', difficulty:4, count:4 });
if(!session.learningIntelligence || session.tasks.length !== 4) throw new Error('Learning intelligence session failed');
const first = session.tasks[0];
let wrong = (Number(first.correct) + 1) % first.a.length;
eng.answerSessionTask(wrong);
let report = eng.learningIntelligenceReport();
if(!report || !report.queuedReviews && !report.weakSkill) throw new Error('Learning intelligence report weak');
let log = eng.lastDecisionLog();
if(!Array.isArray(log) || !log.length) throw new Error('Decision log missing');
let cc = eng.commandCenter();
if(!cc.learningIntelligence || !cc.database || cc.database.total < 3) throw new Error('Command center LI missing');
console.log('V9.5.3 learning intelligence smoke OK', {version:eng.version, db:cc.database.total, due:cc.learningIntelligence.dueReviews, decisions:log.length});
