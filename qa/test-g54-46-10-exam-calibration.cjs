'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

function load(){
  const store={};
  const document={addEventListener(){},dispatchEvent(){},querySelectorAll(){return[];},querySelector(){return null;},getElementById(){return null;},body:{appendChild(){}}};
  const context={window:{},document,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},CustomEvent:function(){},console,setTimeout,clearTimeout,setInterval,clearInterval,Date,Math,JSON,Promise,SpeechSynthesisUtterance:function(){}};
  Object.assign(context.window,{document,localStorage:context.localStorage,AppConfig:{version:'G54.46.10'},addEventListener(){},speechSynthesis:null});
  vm.createContext(context);
  ['data/language-exam-blueprints.js','data/language-english-exam-variants.js','data/language-german-exam-supplement.js','data/language-level-difficulty-rules.js','data/language-b1-exam-pilot.js','data/language-b2-exam-pilot.js','js/core/language-exam-calibration-engine.js','js/modules/language-exam-engine.js','js/modules/language-exam-shell.js'].forEach(file=>vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file}));
  return context.window;
}

const w=load();
const cal=w.LanguageExamCalibrationEngine;
const shell=w.LanguageExamShell;
const engine=w.LanguageExamEngine;
const bp=w.LanguageExamBlueprints;
const checks=[];
function check(name,fn){try{fn();checks.push({name,ok:true});}catch(error){checks.push({name,ok:false,error:error.message});}}

check('calibration-engine-loaded',()=>assert.equal(cal.__version,'G54.46.10'));
check('all-36-variants-calibrated',()=>{
  let count=0;
  for(const language of ['de','en']) for(const level of cal.levels){
    const audit=cal.auditLevel(level,language,shell.fullExamVariantPool(level,language),bp.get(level));
    assert.equal(audit.ok,true,JSON.stringify(audit.findings));
    assert.equal(audit.variants.length,3);
    count+=audit.variants.length;
  }
  assert.equal(count,36);
});
check('objective-load-increases-by-level',()=>{
  const expected={A1:4,A2:4,B1:5,B2:6,C1:6,C2:7};
  for(const level of cal.levels){const v=shell.fullExamVariantPool(level,'de')[0];assert.equal(v.readingQuestions.length,expected[level]);assert.equal(v.listeningQuestions.length,expected[level]);assert.equal(v.grammarQuestions.length,expected[level]);}
});
check('text-load-progresses',()=>{
  const means=[];
  for(const level of cal.levels){const p=shell.fullExamVariantPool(level,'de');means.push(p.reduce((s,v)=>s+cal.wordCount(v.readingText),0)/p.length);}
  assert(means[0]<means[2]&&means[2]<means[4]&&means[4]<means[5],means.join(','));
});
check('time-model-monotonic',()=>{
  const totals=cal.levels.map(level=>cal.timeModel(level,bp.get(level)).totalMinutes);
  for(let i=1;i<totals.length;i++)assert(totals[i]>totals[i-1],totals.join(','));
});
check('weights-sum-100',()=>{for(const level of cal.levels){const wgt=cal.getWeights(level);assert.equal(Object.values(wgt).reduce((a,b)=>a+b,0),100);}});
check('weighted-final-score',()=>{
  const session={level:'B2',partOrder:['reading','listening','grammar','writing','speaking'],stabilityEvidence:{distinctPassedVariants:0},parts:{
    reading:{overallScore:100,passed:true},listening:{overallScore:100,passed:true},grammar:{overallScore:100,passed:true},writing:{overallScore:60,passed:true,ai:{overallScore:60}},speaking:{overallScore:100,passed:true,ai:{overallScore:100}}
  }};
  const final=engine.computeFinal(session);
  assert.equal(final.overallScore,90);
  assert.equal(final.scoreMethod,'weighted-parts');
  assert.equal(final.passed,true);
  assert.equal(final.readinessEvidence,'single-variant');
  assert(final.readinessProbability<=78);
});
check('part-minimum-cannot-be-compensated',()=>{
  const session={level:'B2',partOrder:['reading','listening','grammar','writing','speaking'],parts:{reading:{overallScore:100,passed:true},listening:{overallScore:100,passed:true},grammar:{overallScore:100,passed:true},writing:{overallScore:100,passed:true,ai:{overallScore:100}},speaking:{overallScore:40,passed:false,ai:{overallScore:40}}}};
  const final=engine.computeFinal(session);assert.equal(final.passed,false);assert(final.weakParts.includes('speaking'));
});
check('helper-mode-caps-prognosis',()=>{
  const session={level:'B1',partOrder:['reading','listening','grammar','writing','speaking'],stabilityEvidence:{distinctPassedVariants:2},parts:{reading:{overallScore:85,passed:true},listening:{overallScore:85,passed:true,helperMode:true},grammar:{overallScore:85,passed:true},writing:{overallScore:85,passed:true,ai:{overallScore:85}},speaking:{overallScore:85,passed:true,ai:{overallScore:85}}}};
  const final=engine.computeFinal(session);assert.equal(final.passed,true);assert(final.readinessProbability<=62);assert.equal(final.calibration.helperMode,true);
});
check('two-variant-evidence-raises-cap',()=>{
  const one=cal.confidence({overall:90,passScore:70,minPartMargin:20,completedParts:5,totalParts:5,passed:true,distinctPassedVariants:0});
  const two=cal.confidence({overall:90,passScore:70,minPartMargin:20,completedParts:5,totalParts:5,passed:true,distinctPassedVariants:1});
  assert(two.cap>one.cap);assert(two.probability>=one.probability);
});
check('english-b2-local-writing-can-pass',()=>{
  const task={id:'en-b2-test',language:'en',title:'B2 Writing',prompt:'Write a structured response. Weigh advantages and risks, state your position, give a specific example and conclude.',requiredPoints:['clear introduction/thesis','at least two arguments','limitation or counterpoint','specific example','own conclusion','appropriate register'],minWords:180,maxWords:280};
  const text=`This response considers whether digital learning should become a permanent part of education. On the one hand, it offers important advantages because learners can repeat materials, study at flexible times and access specialist resources from different places. A second argument is that teachers can use digital exercises to identify common difficulties more quickly. For example, in my previous course, recorded explanations helped working students review a difficult topic after work and prepare better questions for the next lesson. On the other hand, there are clear risks and limitations. Not every learner has reliable equipment, and online work can reduce social contact or make concentration more difficult. This counterpoint is important because technology can widen inequality when schools do not provide devices and support. In my opinion, digital learning should therefore complement rather than replace classroom teaching. I would recommend a balanced model with guided online tasks, regular face-to-face discussion and clear data-protection rules. In conclusion, the benefits are convincing only when access, teacher support and personal interaction are protected. This approach would preserve flexibility while reducing the most serious disadvantages.`;
  const result=engine.localAssessResponse({level:'B2',part:'writing',task,userText:text,language:'en'});
  assert(result.wordCount>=180);assert.equal(result.passedLocal,true,JSON.stringify(result.capReasons));assert(result.score>=70,result.score);
});
check('simulation-snapshot-green',()=>assert.equal(shell.simulationCalibrationQaSnapshot().ok,true));

const result={phase:'G54.46.10',ok:checks.every(x=>x.ok),passed:checks.filter(x=>x.ok).length,total:checks.length,checks};
console.log(JSON.stringify(result,null,2));
process.exit(result.ok?0:1);
