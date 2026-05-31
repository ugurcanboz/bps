const fs = require('fs');
const vm = require('vm');
const store = {};
const context = {
  console,
  Date,
  Math,
  setTimeout,
  clearTimeout,
  localStorage: { getItem:k=>store[k]||null, setItem:(k,v)=>{store[k]=String(v)}, removeItem:k=>{delete store[k]} },
  document: { createElement: () => ({ innerHTML:'', textContent:'', innerText:'' }) },
  window: {}
};
context.window = context;
context.QUESTION_BANK = [
  {id:'zr_test', q:'Setze fort: 2 4 8 16 ?', a:['21','24','32','20'], correct:2, category:'logik', subtype:'zahlenreihe_wechselmuster', difficulty:4, skill:'musterwechsel_erkennen', expectedTimeMs:12000, trap:'lineare Addition statt Wechselmuster', examTarget:'ctc', distractors:[{value:'21', errorPath:'pattern/difference_only_checked', hint:'nur Differenz geprüft', remediation:'Wechsel A-B prüfen', revengeSignature:'series_difference_only'}]},
  {id:'it_test', q:'IP geht, Name geht nicht. Was prüfen?', a:['DNS','Monitor','RAM','Maus'], correct:0, category:'it', subtype:'netzwerk_dns', difficulty:3, skill:'dns_ip_grundlagen', expectedTimeMs:15000, trap:'DNS/IP verwechselt', examTarget:'bps'}
];
vm.createContext(context);
vm.runInContext(fs.readFileSync('/mnt/data/work_v956/js/learning-coach-engine.js','utf8'), context);
const E = context.BPSLearningCoachEngine;
if(!E || E.version.indexOf('9.5.6') < 0) throw new Error('engine version missing');
const rec = E.recordMemory({task: context.QUESTION_BANK[0], taskId:'zr_test', cat:'logik', group:'logik', subtype:'zahlenreihe_wechselmuster', correct:false, givenIndex:0, correctIndex:2, selectedText:'21', correctText:'32', duration:9000, mode:'test'});
if(!rec.diagnosis || rec.diagnosis.subtype !== 'difference_only_checked' || !rec.diagnosis.distractorMapped) throw new Error('distractor diagnosis failed');
const li = E.learningIntelligenceReport();
if(!li.mastery || !li.mastery.length) throw new Error('mastery missing');
const tl = E.examTrafficLight();
if(!Array.isArray(tl.sections) || !tl.sections.length) throw new Error('section traffic missing');
const session = E.startSession({mode:'revenge', count:3});
if(!session.tasks || session.tasks.length < 3) throw new Error('session failed');
console.log('V9.5.6 smoke ok', rec.diagnosis.subtype, li.mastery[0].score, tl.sections[0].state);
