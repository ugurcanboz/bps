import test from 'node:test';
import assert from 'node:assert/strict';
import {PROMPT_ENGINE_VERSION,promptDescriptor,systemPrompt} from '../src/prompts.js';

test('all CEFR levels produce explicit contracts',()=>{
  for (const level of ['A1','A2','B1','B2','C1','C2']) {
    const prompt=systemPrompt('coach',{level,language:'Deutsch',role:'coach'});
    assert.match(prompt,new RegExp(`Target CEFR level: ${level}`));
    assert.match(prompt,/Required JSON shape:/);
    assert.match(prompt,new RegExp(PROMPT_ENGINE_VERSION.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  }
});

test('German and English output contracts are distinct',()=>{
  const de=systemPrompt('coach',{level:'B1',language:'Deutsch',role:'coach'});
  const en=systemPrompt('coach',{level:'B1',language:'Englisch',role:'coach'});
  assert.match(de,/Respond in German/);
  assert.match(en,/Respond in English/);
});

test('coach and conversation roles are separated',()=>{
  const coach=promptDescriptor('coach',{level:'A2',language:'Deutsch',role:'coach'});
  const conversation=promptDescriptor('coach',{level:'A2',language:'Deutsch',role:'conversation'});
  assert.equal(coach.role,'coach');
  assert.equal(conversation.role,'conversation');
  assert.notEqual(systemPrompt('coach',{level:'A2',language:'Deutsch',role:'coach'}),systemPrompt('coach',{level:'A2',language:'Deutsch',role:'conversation'}));
});

test('examiner and transcript evaluator roles are forced by endpoint',()=>{
  assert.equal(promptDescriptor('exam-speaking',{level:'B2',language:'Englisch',role:'coach'}).role,'examiner');
  assert.equal(promptDescriptor('speaking',{level:'B2',language:'Englisch',role:'conversation'}).role,'speakingEvaluator');
  assert.match(systemPrompt('exam-speaking',{level:'B2',language:'Englisch'}),/strict, neutral CEFR examiner/);
  assert.match(systemPrompt('speaking',{level:'B2',language:'Englisch'}),/transcript only/);
});
