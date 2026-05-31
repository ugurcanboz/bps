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
  Date, Math, setTimeout, clearTimeout
};
context.window = context;
context.BPS_COACH_KNOWLEDGE_BASE = [{ id:'dns', topic:'DNS', subject:'IT', keywords:['dns'], shortAnswer:'DNS löst Namen auf.' }];
context.QUESTION_BANK = [
  { id:'zr_qa_1', q:'3, 6, 8, 16, 18, ?', a:['20','26','34','36'], correct:3, verified:true,
    dna:{ category:'logik', subtype:'wechselmuster', difficulty:4, skill:'musterwechsel_erkennen', expectedTimeMs:12000, trap:'lineare_addition', examTarget:'ctc', distractors:[{value:'20', errorPath:'difference_only_checked', hint:'Nur Differenz betrachtet.'},{value:'36', errorPath:'correct'}] } },
  { id:'it_qa_1', q:'Per IP erreichbar, per Name nicht. Was prüfen?', a:['DNS','DHCP','RAM'], correct:0, verified:true,
    dna:{ category:'it', subtype:'netzwerk_dns_ip', difficulty:3, skill:'dns_ip_unterscheiden', expectedTimeMs:15000, trap:'dns_ip_confused', examTarget:'bps', distractors:[{value:'DHCP', errorPath:'dns_ip_confused', hint:'DNS und DHCP/IP verwechselt.'}] } }
];
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/learning-coach-engine.js'),'utf8'), context, {filename:'engine'});
const E = context.BPSLearningCoachEngine;
if(!E) throw new Error('Engine missing');
if(!String(E.version).includes('9.5.8')) throw new Error('Wrong version: '+E.version);
let contract = E.validateTaskDNAContract(context.QUESTION_BANK[0]);
if(!contract.ok || contract.quality < 80) throw new Error('DNA contract weak: '+JSON.stringify(contract));
let payload = E.validateRecordAnswerPayload({taskId:'zr_qa_1', correct:false, selectedAnswer:'20', timeMs:11000}, context.QUESTION_BANK[0]);
if(!payload.ok || payload.dnaQuality < 80) throw new Error('Payload validation weak: '+JSON.stringify(payload));
let audit = E.databaseDNAAudit();
if(!audit || audit.total < 2 || audit.avgQuality < 80) throw new Error('DNA audit weak on fixture: '+JSON.stringify(audit));
let qa = E.qaSelfCheck();
if(!qa.ok || qa.score < 85) throw new Error('QA self check failed: '+JSON.stringify(qa));
// corrupt storage must not kill engine
context.localStorage.setItem('bps_learning_coach_v2_memory', '{broken json');
let repair = E.repairMemory();
if(!repair.ok || !repair.hadBrokenJson) throw new Error('Repair did not detect broken JSON: '+JSON.stringify(repair));
let health = E.memoryHealthReport();
if(!health.ok) throw new Error('Memory health failed after repair: '+JSON.stringify(health));
let session = E.startSession({mode:'qa', count:3, difficulty:3});
if(!session || !session.tasks || !session.tasks.length) throw new Error('Session missing after QA');
let cc = E.commandCenter();
if(!cc || !cc.readiness || !cc.recommendation || !cc.examTrafficLight) throw new Error('Command center weak after UX polish');
let rec = E.nextRecommendation();
if(!rec || !rec.title || !rec.text || !rec.mode) throw new Error('Recommendation missing premium fields: '+JSON.stringify(rec));
console.log('V9.5.8 phase C premium UX polish OK', {version:E.version, qaScore:qa.score, dnaQuality:contract.quality, auditStatus:audit.status, health:health.ok});
