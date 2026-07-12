'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const p=require('../activity-ledger-policy');
const actor={uid:'u1',role:'participant'};
const profile={groupId:'2026-GK-A'};
function sample(id='s1',kind='simulation'){
 return p.normalizeSession({sessionId:id,kind,status:'completed',module:'simulation',score:80,durationMs:120000,events:[{eventType:'answer-recorded',taskId:'q1',correct:true},{eventType:'answer-recorded',taskId:'q2',correct:false}]},actor,'course_2026_gk',profile);
}
test('server overwrites identity and trust fields',()=>{const s=p.normalizeSession({sessionId:'s1',userId:'evil',ownerUid:'evil',trustLevel:'verified'},actor,'course_2026_gk',profile);assert.equal(s.ownerUid,'u1');assert.equal(s.userId,'u1');assert.equal(s.trustLevel,'client-reported-validated');});
test('answer totals are recomputed from sanitized events',()=>{const s=p.normalizeSession({sessionId:'s2',answerCount:999,correctCount:999,events:[{eventType:'answer-recorded',correct:true},{eventType:'answer-recorded',correct:false}]},actor,'course_2026_gk',profile);assert.equal(s.answerCount,2);assert.equal(s.correctCount,1);});
test('summary counts real simulation sessions once',()=>{let r=p.mergeSummary(null,sample());assert.equal(r.summary.simulationSessions,1);assert.equal(r.summary.taskAnswers,2);let again=p.mergeSummary(r.summary,sample());assert.equal(again.duplicate,true);assert.equal(again.summary.simulationSessions,1);});
test('language exams count as simulation and language exam',()=>{let r=p.mergeSummary(null,sample('lang1','language-exam'));assert.equal(r.summary.simulationSessions,1);assert.equal(r.summary.languageExamSessions,1);});
test('invalid session identifiers are normalized and bounded',()=>{const s=p.normalizeSession({sessionId:'../../evil id',events:new Array(600).fill({eventType:'answer-recorded'})},actor,'course',profile);assert.equal(s.sessionId,'______evil_id');assert.equal(s.events.length,450);});
