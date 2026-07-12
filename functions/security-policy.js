'use strict';

const ADMIN_PATCH_FIELDS = new Set([
  'displayName','nickname','alias','groupId','adminNote','note','status','blocked',
  'blockedReason','blockedAt','pendingWarning','role','roleLabel','participantRole'
]);
const TEACHER_PATCH_FIELDS = new Set(['adminNote','note','pendingWarning','displayName','nickname','alias']);
const ALLOWED_ASSIGNABLE_ROLES = new Set(['participant','teacher']);

function normalizeRole(role) {
  role=String(role||'').toLowerCase();
  if(role==='dozent') return 'teacher';
  if(role==='teilnehmer'||role==='learner') return 'participant';
  if(role==='administrator') return 'admin';
  return ['admin','teacher','participant','demo'].includes(role)?role:'guest';
}
function normalizeCode(code) {
  return String(code||'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function safeId(value) {
  return normalizeCode(value).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function actorFromAuth(auth) {
  const token=auth&&auth.token||{};
  const role=token.admin===true?'admin':normalizeRole(token.role);
  const groups=Array.isArray(token.assignedGroups)?token.assignedGroups.filter(Boolean).map(String):[];
  const courseIds=Array.isArray(token.courseIds)?token.courseIds.filter(Boolean).map(String):[];
  const provider=token.firebase&&token.firebase.sign_in_provider||''; return {uid:auth&&auth.uid||'',role,groups,courseIds,email:token.email||'',emailVerified:token.email_verified===true,signInProvider:provider,isAnonymous:provider==='anonymous'};
}
function canAccessCourse(actor,courseId){
  return actor.role==='admin'||actor.courseIds.includes(String(courseId||''));
}
function canAccessGroup(actor,groupId){
  return actor.role==='admin'||(actor.role==='teacher'&&actor.groups.includes(String(groupId||'')));
}
function allowedPatch(actor,patch,target){
  const keys=Object.keys(patch||{});
  const allowed=actor.role==='admin'?ADMIN_PATCH_FIELDS:TEACHER_PATCH_FIELDS;
  if(!keys.length||keys.some(k=>!allowed.has(k))) return false;
  if(actor.role==='teacher'){
    if(!target||!canAccessGroup(actor,target.groupId)) return false;
    if(Object.prototype.hasOwnProperty.call(patch,'groupId')||Object.prototype.hasOwnProperty.call(patch,'role')||Object.prototype.hasOwnProperty.call(patch,'status')||Object.prototype.hasOwnProperty.call(patch,'blocked')) return false;
  }
  return actor.role==='admin'||actor.role==='teacher';
}
function roleAssignable(role){return ALLOWED_ASSIGNABLE_ROLES.has(normalizeRole(role));}
function sanitizeText(value,max){return String(value||'').trim().slice(0,max||500);}
function sanitizePatch(patch){
  const out={};
  Object.keys(patch||{}).forEach(k=>{
    let v=patch[k];
    if(['displayName','nickname','alias'].includes(k)) v=sanitizeText(v,60);
    if(['adminNote','note','blockedReason'].includes(k)) v=sanitizeText(v,1500);
    if(k==='groupId') v=normalizeCode(v);
    if(k==='role') v=normalizeRole(v);
    out[k]=v;
  });
  return out;
}
function randomAccessCode(role,groupId,randomBytes){
  const prefix=normalizeRole(role)==='teacher'?'DZ':'TN';
  const group=normalizeCode(groupId||'Novura Assessments').replace(/-/g,'').slice(0,10)||'Novura Assessments';
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes=randomBytes(7); let token='';
  for(const b of bytes) token+=chars[b%chars.length];
  return normalizeCode(`Novura Assessments-${prefix}-${group}-${token.slice(0,4)}-${token.slice(4)}`);
}
module.exports={normalizeRole,normalizeCode,safeId,actorFromAuth,canAccessCourse,canAccessGroup,allowedPatch,roleAssignable,sanitizePatch,sanitizeText,randomAccessCode};
