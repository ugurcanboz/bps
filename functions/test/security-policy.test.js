'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const p=require('../security-policy');

test('client supplied email never creates admin actor',()=>{
  const actor=p.actorFromAuth({uid:'u1',token:{email:'owner@example.com',role:'participant'}});
  assert.equal(actor.role,'participant');
});
test('only signed admin/role claims determine admin',()=>{
  assert.equal(p.actorFromAuth({uid:'u1',token:{admin:true}}).role,'admin');
  assert.equal(p.actorFromAuth({uid:'u1',token:{role:'admin'}}).role,'admin');
});
test('teacher cannot patch role group block or status',()=>{
  const teacher={role:'teacher',groups:['2026-GK-A']}; const target={groupId:'2026-GK-A'};
  assert.equal(p.allowedPatch(teacher,{adminNote:'ok'},target),true);
  for(const key of ['role','groupId','blocked','status']) assert.equal(p.allowedPatch(teacher,{[key]:'x'},target),false);
});
test('teacher cannot touch foreign group',()=>{
  assert.equal(p.allowedPatch({role:'teacher',groups:['A']},{adminNote:'x'},{groupId:'B'}),false);
});
test('admin role cannot be assigned through normal UI role action',()=>{
  assert.equal(p.roleAssignable('admin'),false);
  assert.equal(p.roleAssignable('teacher'),true);
  assert.equal(p.roleAssignable('participant'),true);
});
test('access code ids are normalized and traversal safe',()=>{
  assert.equal(p.safeId('../../Novura Assessments TN A 123'),'novura_assessments_tn_a_123');
});

test('anonymous provider is marked untrusted even with forged participant claim',()=>{
  const actor=p.actorFromAuth({uid:'anon',token:{role:'participant',firebase:{sign_in_provider:'anonymous'}}});
  assert.equal(actor.isAnonymous,true);
  assert.equal(actor.signInProvider,'anonymous');
});
test('course and group access are claim scoped',()=>{
  const teacher={role:'teacher',groups:['2026-GK-A'],courseIds:['course_2026_gk']};
  assert.equal(p.canAccessCourse(teacher,'course_2026_gk'),true);
  assert.equal(p.canAccessCourse(teacher,'course_other'),false);
  assert.equal(p.canAccessGroup(teacher,'2026-GK-A'),true);
  assert.equal(p.canAccessGroup(teacher,'2026-GK-B'),false);
});
