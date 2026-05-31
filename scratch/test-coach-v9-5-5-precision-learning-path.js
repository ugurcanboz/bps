const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const store = {};
const context = {
  console,
  window: {},
  document: undefined,
  localStorage: {
    getItem:k => Object.prototype.hasOwnProperty.call(store,k) ? store[k] : null,
    setItem:(k,v) => { store[k] = String(v); },
    removeItem:k => { delete store[k]; }
  },
  Date,
  Math,
  setTimeout,
  clearTimeout
};
context.window = context;
context.BPS_COACH_KNOWLEDGE_BASE = [{ id:'dns', topic:'DNS', subject:'IT', keywords:['dns'], shortAnswer:'DNS löst Namen auf.' }];
context.QUESTION_BANK = [
  { id:'zr_wechsel_1', dna:{category:'logik', subtype:'wechselmuster', difficulty:4, skill:'musterwechsel_erkennen', expectedTimeMs:12000, trap:'nur lineare Addition vermutet', examTarget:'ctc'}, q:'3, 6, 8, 16, 18, ?', a:['20','26','34','36'], correct:3, verified:true, explanation:'Wechsel: mal 2, plus 2.' },
  { id:'zr_diff_2', dna:{category:'logik', subtype:'zahlenreihe', difficulty:3, skill:'differenz_pruefen', expectedTimeMs:11000, trap:'Differenz zu früh festgelegt', examTarget:'bps'}, q:'5, 9, 14, 20, ?', a:['25','26','27','28'], correct:2, verified:true },
  { id:'it_dns_1', dna:{category:'it', subtype:'netzwerk_dns_ip', difficulty:3, skill:'dns_ip_unterscheiden', expectedTimeMs:15000, trap:'DNS und IP verwechselt', examTarget:'bps'}, q:'Eine Webseite ist per IP erreichbar, aber nicht über den Namen. Was prüfst du zuerst?', a:['DNS','DHCP','RAM','Monitor'], correct:0, verified:true },
  { id:'math_1', dna:{category:'mathe', subtype:'prozent', difficulty:3, skill:'grundwert_prozentwert', expectedTimeMs:14000, trap:'Grundwert und Prozentwert verwechselt', examTarget:'bps'}, q:'20% von 150?', a:['20','25','30','35'], correct:2, verified:true }
];
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'), context, {filename:'engine'});
const E = context.BPSLearningCoachEngine;
if(!E) throw new Error('Engine missing');
if(!String(E.version).includes('9.5.5')) throw new Error('Wrong version: '+E.version);
let d = E.categoryErrorPath({correct:false, givenIndex:0, selectedText:'20', correctText:'36', task:context.QUESTION_BANK[0]}, E.normalizeTaskDNA(context.QUESTION_BANK[0]));
if(!d || !['difference_only_checked','secondary_pattern_missed','rule_fixed_too_early'].includes(d.subtype)) throw new Error('Series error path weak: '+JSON.stringify(d));
let diag = E.diagnoseMistakeDetailed({correct:false, givenIndex:1, selectedText:'DHCP', correctText:'DNS', task:context.QUESTION_BANK[2]}, E.normalizeTaskDNA(context.QUESTION_BANK[2]));
if(!diag || !diag.revengeTarget || !diag.revengeTarget.revengeSignature) throw new Error('diagnosis revenge target missing');
let sess = E.startSession({mode:'revenge', skill:'logic', difficulty:4, count:5});
if(!sess.learningPath || !Array.isArray(sess.learningPath.phases) || sess.learningPath.phases.length !== 5) throw new Error('learning path missing');
let wrong = (Number(sess.tasks[0].correct) + 1) % sess.tasks[0].a.length;
E.answerSessionTask(wrong);
let cc = E.commandCenter();
if(!cc.learningPathPlan || !cc.errorPath || !cc.learningIntelligence.errorPath) throw new Error('command center precision fields missing');
let report = E.errorPathReport();
if(!report || report.total < 1) throw new Error('error path report empty');
let plan = E.learningPathPlan({mode:'focus-5', skill:'logic', count:5});
if(!plan.phases.some(p => p.key === 'revenge' || p.key === 'diagnosis')) throw new Error('learning path does not react to error history');
console.log('V9.5.6 precision learning path smoke OK', {version:E.version, errorPath:report.dominant && report.dominant.key, phases:plan.phases.map(p=>p.key).join('>')});
