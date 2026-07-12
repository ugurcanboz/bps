import test from 'node:test';
import assert from 'node:assert/strict';
import {buildContextBlock, normalizeLearningContext, optimizeHistory, tokenBudget} from '../src/context.js';

test('normalizes and deduplicates learner history',()=>{
  const c=normalizeLearningContext({errors:['Artikel','artikel','Kasus'],vocabulary:['Termin','Termin']});
  assert.deepEqual(c.errors,['Artikel','Kasus']); assert.deepEqual(c.vocabulary,['Termin']);
});
test('keeps only recent history within budget',()=>{
  const h=Array.from({length:20},(_,i)=>({role:i%2?'assistant':'user',content:'x'.repeat(500)}));
  const out=optimizeHistory(h,{maxMessages:6,maxChars:2100}); assert.ok(out.length<=6); assert.ok(out.reduce((n,x)=>n+x.content.length,0)<=2500);
});
test('builds compact context block',()=>{
  const text=buildContextBlock({summary:'Hotel booking',errors:['Artikel'],vocabulary:['reservieren']});
  assert.match(text,/Hotel booking/); assert.match(text,/Artikel/); assert.match(text,/reservieren/);
});
test('reports token budget metadata',()=>{
  const b=tokenBudget('coach',[{role:'user',content:'Hallo'}],{summary:'Test'}); assert.equal(b.maxOutputTokens,700); assert.ok(b.estimatedInputTokens>0);
});
