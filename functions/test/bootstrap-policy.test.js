'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const policy=require('../bootstrap-policy');

test('bootstrap code normalization and digest are deterministic',()=>{
  const a=policy.digestBootstrapCode(' novura-abcd ');
  const b=policy.digestBootstrapCode('NOVURA-ABCD');
  assert.equal(a,b);
  assert.equal(a.length,64);
});

test('bootstrap code validation uses digest',()=>{
  const digest=policy.digestBootstrapCode('NOVURA-ONE-TIME');
  assert.equal(policy.codeMatches('novura-one-time',digest),true);
  assert.equal(policy.codeMatches('wrong',digest),false);
});

test('completed lock permanently blocks another claim',()=>{
  assert.deepEqual(policy.lockAllowsClaim({status:'completed'},'u1',Date.now()),{ok:false,reason:'completed'});
});

test('active claim blocks other user but allows same user retry',()=>{
  const now=1000;
  assert.equal(policy.lockAllowsClaim({status:'claiming',claimedByUid:'u1',claimExpiresAt:5000},'u2',now).ok,false);
  assert.equal(policy.lockAllowsClaim({status:'claiming',claimedByUid:'u1',claimExpiresAt:5000},'u1',now).ok,true);
  assert.equal(policy.lockAllowsClaim({status:'claiming',claimedByUid:'u1',claimExpiresAt:500},'u2',now).ok,true);
});
