'use strict';

const {setGlobalOptions}=require('firebase-functions/v2');
const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {initializeApp}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
const logger=require('firebase-functions/logger');
const crypto=require('node:crypto');
const policy=require('./security-policy');
const activityPolicy=require('./activity-ledger-policy');

initializeApp();
setGlobalOptions({region:'europe-west1',maxInstances:20,timeoutSeconds:60,memory:'256MiB'});

// Produktionsdomains werden ausschließlich per EGT_ALLOWED_ORIGINS gesetzt
// (kommasepariert, z. B. https://app.example.de). Ohne Konfiguration bleiben
// nur lokale Emulator-Ursprünge erlaubt: sicherer Fail-Closed-Standard.
const CONFIGURED_ORIGINS=String(process.env.EGT_ALLOWED_ORIGINS||'')
  .split(',').map(v=>v.trim()).filter(v=>/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(v));
const DEFAULT_PRODUCTION_ORIGINS=['https://ugurcan-boz.github.io','https://assessments-trainer.de','https://www.assessments-trainer.de'];
const ALLOWED_ORIGINS=[...new Set([...DEFAULT_PRODUCTION_ORIGINS,...CONFIGURED_ORIGINS]),/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];
const CALL_OPTIONS={enforceAppCheck:true,cors:ALLOWED_ORIGINS};
const db=getFirestore();
const auth=getAuth();


function fail(code,message,details){throw new HttpsError(code,message,details);}
function requireAuth(request){if(!request.auth) fail('unauthenticated','Firebase-Anmeldung erforderlich.'); return policy.actorFromAuth(request.auth);}
function requireVerifiedActor(request,roles){
  const actor=requireAuth(request);
  if(!roles.includes(actor.role)) fail('permission-denied','Serverseitige Rolle nicht ausreichend.');
  if((actor.role==='admin'||actor.role==='teacher')&&!actor.emailVerified) fail('failed-precondition','Privilegierte Konten müssen eine bestätigte E-Mail besitzen.');
  return actor;
}
function courseIdFrom(data,actor){
  const courseId=String(data&&data.courseId||'course_2026_gk').trim();
  if(!courseId) fail('invalid-argument','courseId fehlt.');
  if(actor.role!=='admin'&&!policy.canAccessCourse(actor,courseId)) fail('permission-denied','Kein Zugriff auf diesen Kurs.');
  return courseId;
}
async function rateLimit(actor,action,limit=40,windowSeconds=60){
  const slot=Math.floor(Date.now()/(windowSeconds*1000));
  const ref=db.doc(`securityRateLimits/${actor.uid}_${policy.safeId(action)}_${slot}`);
  await db.runTransaction(async tx=>{
    const snap=await tx.get(ref); const count=snap.exists?Number(snap.data().count||0):0;
    if(count>=limit) fail('resource-exhausted','Zu viele Sicherheitsaktionen. Bitte kurz warten.');
    tx.set(ref,{uid:actor.uid,action,count:count+1,slot,expiresAt:Date.now()+windowSeconds*2000,updatedAt:FieldValue.serverTimestamp()},{merge:true});
  });
}
function redactAuditValue(value,depth=0){
  if(depth>4) return '[depth-limit]';
  if(value===null||value===undefined) return null;
  if(value instanceof Date) return value.toISOString();
  if(value&&typeof value.toDate==='function'){try{return value.toDate().toISOString();}catch(_e){}}
  if(Array.isArray(value)) return value.slice(0,80).map(v=>redactAuditValue(v,depth+1));
  if(typeof value!=='object') return typeof value==='string'?value.slice(0,2000):value;
  const out={};
  const secret=/password|token|secret|hash|salt|api.?key|authorization/i;
  Object.keys(value).sort().slice(0,120).forEach(key=>{out[key]=secret.test(key)?'[redacted]':redactAuditValue(value[key],depth+1);});
  return out;
}
function canonicalAudit(value){
  if(value===null||typeof value!=='object') return JSON.stringify(value);
  if(Array.isArray(value)) return `[${value.map(canonicalAudit).join(',')}]`;
  return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${canonicalAudit(value[k])}`).join(',')}}`;
}
async function audit(courseId,actor,action,target,before,after,status='success'){
  const metaRef=db.doc(`courses/${courseId}/auditMeta/security`);
  const auditCol=db.collection(`courses/${courseId}/securityAudit`);
  return db.runTransaction(async tx=>{
    const metaSnap=await tx.get(metaRef); const meta=metaSnap.exists?metaSnap.data()||{}:{};
    const sequence=Math.max(0,Number(meta.sequence||0))+1; const prevHash=String(meta.lastHash||'');
    const createdAtIso=new Date().toISOString();
    const payload={schema:'egt-security-audit-v2',sequence,prevHash,actorUid:actor.uid,actorRole:actor.role,actorEmail:actor.email||'',action:String(action||''),target:String(target||''),before:redactAuditValue(before),after:redactAuditValue(after),status:String(status||'success'),createdAtIso};
    const hash=crypto.createHash('sha256').update(`${prevHash}|${canonicalAudit(payload)}`).digest('hex');
    const id=`${String(sequence).padStart(10,'0')}_${crypto.randomBytes(5).toString('hex')}`;
    tx.create(auditCol.doc(id),Object.assign({},payload,{hash,createdAt:FieldValue.serverTimestamp()}));
    tx.set(metaRef,{schema:'egt-security-audit-chain-v2',sequence,lastHash:hash,lastEntryId:id,updatedAt:FieldValue.serverTimestamp()},{merge:true});
    return {id,sequence,hash,prevHash};
  });
}
async function resolveLearner(courseId,target){
  target=String(target||'').trim(); if(!target) fail('invalid-argument','targetUid fehlt.');
  let ref=db.doc(`courses/${courseId}/learners/${target}`); let snap=await ref.get();
  if(snap.exists) return {ref,snap,data:snap.data(),uid:snap.data().firebaseUid||target};
  const qs=await db.collection(`courses/${courseId}/learners`).where('firebaseUid','==',target).limit(1).get();
  if(!qs.empty){snap=qs.docs[0]; return {ref:snap.ref,snap,data:snap.data(),uid:snap.data().firebaseUid||target};}
  const byCode=await db.collection(`courses/${courseId}/learners`).where('userId','==',policy.normalizeCode(target)).limit(1).get();
  if(!byCode.empty){snap=byCode.docs[0]; return {ref:snap.ref,snap,data:snap.data(),uid:snap.data().firebaseUid||snap.id};}
  fail('not-found','Teilnehmer nicht gefunden.');
}
async function recursiveDelete(ref){
  const children=await ref.listCollections();
  for(const col of children){
    while(true){
      const qs=await col.limit(200).get(); if(qs.empty) break;
      const batch=db.batch(); qs.docs.forEach(d=>batch.delete(d.ref)); await batch.commit();
    }
  }
  await ref.delete();
}
function mergeClaims(existing,patch){return Object.assign({},existing||{},patch||{});}

function cleanTicketPatch(input){
  const allowed=new Set(['title','description','status','priority','category','assignedTo','screenshot','device','route','groupId','reporterUid','reporterName','reporterRole','closedAt']);
  const out={};
  for(const [key,value] of Object.entries(input||{})){
    if(!allowed.has(key)) continue;
    if(['title','reporterName','assignedTo'].includes(key)) out[key]=policy.sanitizeText(value,120);
    else if(['description','screenshot','device','route'].includes(key)) out[key]=policy.sanitizeText(value,4000);
    else if(key==='groupId') out[key]=policy.normalizeCode(value);
    else if(key==='reporterUid') out[key]=policy.sanitizeText(value,128);
    else out[key]=value;
  }
  return out;
}
function resetModuleStats(modules){
  const out={};
  for(const [key,value] of Object.entries(modules||{})){
    out[key]=Object.assign({},value||{},{answered:0,correct:0,averageScore:0,recurringErrors:{},repairQueue:[],examHistory:[]});
    if(key==='python') Object.assign(out[key],{xp:0,currentLevel:1,unlockedLevels:[1]});
  }
  return out;
}
async function clearCollection(path){
  const col=db.collection(path);
  while(true){
    const qs=await col.limit(200).get(); if(qs.empty) break;
    const batch=db.batch(); qs.docs.forEach(d=>batch.delete(d.ref)); await batch.commit();
  }
}

async function learnerPrivacyExport(courseId,target){
  const profile=redactAuditValue(target.data||{});
  const collections={};
  for(const name of ['sessions','events','attempts','progress']){
    const qs=await target.ref.collection(name).limit(1000).get();
    collections[name]=qs.docs.map(doc=>Object.assign({id:doc.id},redactAuditValue(doc.data()||{})));
  }
  return {schema:'egt-privacy-export-v1',exportedAt:new Date().toISOString(),courseId,learnerId:target.ref.id,profile,collections,truncated:Object.fromEntries(Object.entries(collections).map(([k,v])=>[k,v.length>=1000]))};
}
async function applyBulkLearnerAction(courseId,actor,data){
  if(actor.role!=='admin') fail('permission-denied','Massenaktionen sind nur für Admins erlaubt.');
  const ids=Array.from(new Set((Array.isArray(data.learnerIds)?data.learnerIds:[]).map(policy.normalizeCode).filter(Boolean))).slice(0,100);
  if(!ids.length) fail('invalid-argument','Keine Teilnehmer ausgewählt.');
  const operation=String(data.operation||''); const reason=policy.sanitizeText(data.reason,500); const groupId=policy.normalizeCode(data.groupId||'');
  if(!['block','unblock','archive','activate','setGroup'].includes(operation)) fail('invalid-argument','Unbekannte Massenaktion.');
  if(operation==='setGroup'&&!groupId) fail('invalid-argument','Zielgruppe fehlt.');
  const results=[];
  for(const id of ids){
    try{
      const target=await resolveLearner(courseId,id); if(policy.normalizeRole(target.data.role||'participant')!=='participant') throw new Error('Massenaktionen sind auf Teilnehmerkonten begrenzt.'); const before={status:target.data.status,blocked:target.data.blocked,groupId:target.data.groupId};
      const patch={updatedAt:FieldValue.serverTimestamp(),updatedByUid:actor.uid};
      if(operation==='block') Object.assign(patch,{blocked:true,status:'blocked',blockedReason:reason||'Per Massenaktion gesperrt.',blockedAt:FieldValue.serverTimestamp()});
      if(operation==='unblock'||operation==='activate') Object.assign(patch,{blocked:false,status:'active',blockedReason:'',blockedAt:null});
      if(operation==='archive') Object.assign(patch,{blocked:false,status:'archived',archivedAt:FieldValue.serverTimestamp(),archivedByUid:actor.uid});
      if(operation==='setGroup') patch.groupId=groupId;
      await target.ref.set(patch,{merge:true});
      await audit(courseId,actor,`bulk:${operation}`,target.ref.id,before,{status:patch.status,blocked:patch.blocked,groupId:patch.groupId,reason});
      results.push({learnerId:target.ref.id,ok:true});
    }catch(error){results.push({learnerId:id,ok:false,error:String(error&&error.message||error)});}
  }
  return {ok:results.every(x=>x.ok),operation,count:ids.length,success:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length,results};
}


exports.redeemAccessCode=onCall(CALL_OPTIONS,async request=>{
  const actor=requireAuth(request);
  if(!actor.uid || actor.isAnonymous) fail('unauthenticated','Bestätigte Firebase-Anmeldung erforderlich.');
  const data=request.data||{}; const courseId=String(data.courseId||'course_2026_gk');
  const code=policy.normalizeCode(data.code); const nickname=policy.sanitizeText(data.nickname,40);
  if(!code||nickname.length<3) fail('invalid-argument','Gültiger Zugangscode und Nickname erforderlich.');
  await rateLimit(actor,'redeemAccessCode',8,300);
  const codeRef=db.doc(`courses/${courseId}/accessCodes/${policy.safeId(code)}`);
  const learnerRef=db.doc(`courses/${courseId}/learners/${actor.uid}`);
  let issuedRole='participant',groupId='',profile=null;
  await db.runTransaction(async tx=>{
    const [codeSnap,learnerSnap]=await Promise.all([tx.get(codeRef),tx.get(learnerRef)]);
    if(!codeSnap.exists) fail('not-found','Zugangscode nicht gefunden.');
    const acc=codeSnap.data()||{}; const status=String(acc.status||'active').toLowerCase();
    if(status!=='active') fail('failed-precondition','Zugangscode ist nicht aktiv.');
    const expiry=acc.expiresAt&&new Date(acc.expiresAt).getTime();
    if(expiry&&expiry<Date.now()) fail('failed-precondition','Zugangscode ist abgelaufen.');
    const used=Number(acc.usedCount??acc.used_count??0); const max=Number(acc.maxUses??acc.max_uses??1);
    if(max>0&&used>=max) fail('failed-precondition','Zugangscode wurde bereits vollständig eingelöst.');
    issuedRole=policy.normalizeRole(acc.role||'participant');
    if(issuedRole==='admin'||issuedRole==='guest'||issuedRole==='demo') fail('permission-denied','Dieser Rollentyp darf nicht per Zugangscode vergeben werden.');
    if(issuedRole==='teacher'&&!actor.emailVerified) fail('failed-precondition','Dozentenkonten benötigen vor Freischaltung eine bestätigte E-Mail.');
    groupId=policy.normalizeCode(acc.groupId||acc.group_id||'');
    profile=Object.assign({},learnerSnap.exists?learnerSnap.data():{}, {
      profileId:actor.uid,id:actor.uid,firebaseUid:actor.uid,email:actor.email||'',nickname,displayName:nickname,alias:nickname,
      role:issuedRole,accessRole:issuedRole,participantRole:issuedRole==='participant'?'teilnehmer':issuedRole,
      groupId,courseId,status:'active',blocked:false,accessCodeId:codeRef.id,createdVia:'secure-access-code',
      updatedAt:FieldValue.serverTimestamp()
    });
    if(!learnerSnap.exists) profile.createdAt=FieldValue.serverTimestamp();
    tx.set(learnerRef,profile,{merge:true});
    tx.set(codeRef,{status:max>0&&used+1>=max?'used':'active',usedCount:used+1,used_count:used+1,lastRedeemedAt:FieldValue.serverTimestamp(),lastRedeemedBy:actor.uid,learnerId:actor.uid,updatedAt:FieldValue.serverTimestamp()},{merge:true});
  });
  const user=await auth.getUser(actor.uid); const existing=user.customClaims||{};
  const courseIds=Array.from(new Set([...(existing.courseIds||[]),courseId]));
  const assignedGroups=issuedRole==='teacher'?Array.from(new Set([...(existing.assignedGroups||[]),groupId].filter(Boolean))):[];
  await auth.setCustomUserClaims(actor.uid,mergeClaims(existing,{role:issuedRole,admin:false,teacher:issuedRole==='teacher',courseIds,assignedGroups,profileId:actor.uid}));
  await audit(courseId,actor,'redeemAccessCode',actor.uid,null,{role:issuedRole,groupId});
  const clean=Object.assign({},profile,{createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  delete clean.passwordHash; delete clean.passwordSalt;
  return {ok:true,role:issuedRole,groupId,profile:clean,refreshToken:true};
});


exports.recordLearningSession=onCall(CALL_OPTIONS,async request=>{
  const actor=requireAuth(request);
  if(actor.isAnonymous) fail('unauthenticated','Bestätigte Firebase-Anmeldung erforderlich.');
  if(actor.role!=='participant') fail('permission-denied','Lernsessions werden nur dem eigenen Teilnehmerprofil zugeordnet.');
  const data=request.data||{}; const courseId=courseIdFrom(data,actor);
  await rateLimit(actor,'recordLearningSession',120,60);
  const learnerRef=db.doc(`courses/${courseId}/learners/${actor.uid}`);
  let result=null;
  await db.runTransaction(async tx=>{
    const learnerSnap=await tx.get(learnerRef);
    if(!learnerSnap.exists) fail('failed-precondition','Teilnehmerprofil fehlt. Zugangscode zuerst einlösen.');
    const profile=learnerSnap.data()||{};
    if(profile.blocked===true||String(profile.status||'active')==='blocked') fail('permission-denied','Teilnehmerkonto ist gesperrt.');
    let session;
    try{session=activityPolicy.normalizeSession(data.session,actor,courseId,profile);}catch(error){fail('invalid-argument',String(error&&error.message||error));}
    const sessionRef=learnerRef.collection('sessions').doc(policy.safeId(session.sessionId)||session.sessionId);
    const sessionSnap=await tx.get(sessionRef);
    if(sessionSnap.exists){
      result={ok:true,duplicate:true,sessionId:session.sessionId,activitySummary:profile.activitySummary||activityPolicy.emptySummary(),activityRecent:Array.isArray(profile.activityRecent)?profile.activityRecent:[]};
      return;
    }
    const merged=activityPolicy.mergeSummary(profile.activitySummary,session);
    const summary=merged.summary;
    const dailyKeys=Object.keys(summary.daily||{}).sort();
    if(dailyKeys.length>400) dailyKeys.slice(0,dailyKeys.length-400).forEach(k=>delete summary.daily[k]);
    const recent=Array.isArray(profile.activityRecent)?profile.activityRecent.slice():[];
    recent.unshift({sessionId:session.sessionId,kind:session.kind,status:session.status,module:session.module,mode:session.mode,score:session.score,passed:session.passed,answerCount:session.answerCount,correctCount:session.correctCount,durationMs:session.durationMs,startedAt:session.startedAt,completedAt:session.completedAt,language:session.language,level:session.level,variant:session.variant,trustLevel:session.trustLevel});
    const dedupedRecent=[]; const seen=new Set(); for(const item of recent){if(!item||seen.has(item.sessionId))continue;seen.add(item.sessionId);dedupedRecent.push(item);if(dedupedRecent.length>=80)break;}
    const compatibility=activityPolicy.moduleCompatibility(summary,session.module);
    const modules=Object.assign({},profile.modules||{}); modules[compatibility.key]=Object.assign({},modules[compatibility.key]||{},compatibility.value);
    const global=Object.assign({},profile.global||{},{totalSessions:Number(summary.completedSessions||summary.totalSessions||0),totalSimulations:Number(summary.simulationSessions||0),totalAnswers:Number(summary.taskAnswers||0),lastModule:compatibility.key});
    const storedSession=Object.assign({},session); delete storedSession.events;
    storedSession.createdAt=FieldValue.serverTimestamp(); storedSession.updatedAt=FieldValue.serverTimestamp(); storedSession.integrity='server-validated-client-report';
    tx.set(sessionRef,storedSession);
    session.events.forEach((event,index)=>{
      const eventId=policy.safeId(event.eventId)||`${policy.safeId(session.sessionId)}_${index}`;
      tx.set(learnerRef.collection('events').doc(eventId),Object.assign({},event,{createdAt:FieldValue.serverTimestamp(),integrity:'server-validated-client-report'}));
    });
    tx.set(learnerRef,{activitySummary:summary,activityRecent:dedupedRecent,modules,global,dataSchemaVersion:activityPolicy.SESSION_SCHEMA,lastActiveAt:session.completedAt||session.startedAt,updatedAt:FieldValue.serverTimestamp()},{merge:true});
    result={ok:true,duplicate:false,sessionId:session.sessionId,eventCount:session.events.length,activitySummary:summary,activityRecent:dedupedRecent};
  });
  return result;
});

exports.adminAction=onCall(CALL_OPTIONS,async request=>{
  const actor=requireVerifiedActor(request,['admin','teacher']);
  const data=request.data||{}; const action=String(data.action||''); const courseId=courseIdFrom(data,actor);
  await rateLimit(actor,`adminAction_${action}`,60,60);

  if(action==='createAccessCode'){
    let role=policy.normalizeRole(data.role||'participant'); let groupId=policy.normalizeCode(data.groupId||'');
    if(!policy.roleAssignable(role)) fail('invalid-argument','Nur Teilnehmer- oder Dozenten-Codes sind erlaubt.');
    if(actor.role==='teacher'){role='participant'; if(!policy.canAccessGroup(actor,groupId)) fail('permission-denied','Dozent darf nur Codes für eigene Gruppen anlegen.');}
    const code=policy.normalizeCode(data.code)||policy.randomAccessCode(role,groupId,n=>crypto.randomBytes(n));
    if(code.length<12) fail('invalid-argument','Zugangscode ist zu kurz.');
    const ref=db.doc(`courses/${courseId}/accessCodes/${policy.safeId(code)}`);
    const payload={code,role,groupId,status:'active',maxUses:Math.max(1,Math.min(500,Number(data.maxUses||1))),usedCount:0,expiresAt:data.expiresAt||null,note:policy.sanitizeText(data.note,200),createdByUid:actor.uid,createdByRole:actor.role,createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()};
    await ref.create(payload).catch(e=>{if(e.code===6||String(e.message).includes('ALREADY_EXISTS')) fail('already-exists','Zugangscode existiert bereits.'); throw e;});
    await audit(courseId,actor,action,ref.id,null,{role,groupId}); return {ok:true,accessCode:Object.assign({},payload,{id:ref.id,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()})};
  }
  if(action==='revokeAccessCode'){
    const code=policy.normalizeCode(data.code); const ref=db.doc(`courses/${courseId}/accessCodes/${policy.safeId(code)}`); const snap=await ref.get();
    if(!snap.exists) fail('not-found','Zugangscode nicht gefunden.'); const acc=snap.data();
    if(actor.role==='teacher'&&(!policy.canAccessGroup(actor,acc.groupId)||policy.normalizeRole(acc.role)!=='participant')) fail('permission-denied','Kein Zugriff auf diesen Code.');
    await ref.set({status:'revoked',revokedAt:FieldValue.serverTimestamp(),revokedByUid:actor.uid,updatedAt:FieldValue.serverTimestamp()},{merge:true});
    await audit(courseId,actor,action,ref.id,acc,{status:'revoked'}); return {ok:true,status:'revoked',code};
  }
  if(action==='extendAccessCode'){
    const code=policy.normalizeCode(data.code); const ref=db.doc(`courses/${courseId}/accessCodes/${policy.safeId(code)}`); const snap=await ref.get();
    if(!snap.exists) fail('not-found','Zugangscode nicht gefunden.'); const acc=snap.data()||{};
    if(actor.role==='teacher'&&(!policy.canAccessGroup(actor,acc.groupId)||policy.normalizeRole(acc.role)!=='participant')) fail('permission-denied','Kein Zugriff auf diesen Code.');
    const days=Math.max(1,Math.min(365,Number(data.extraDays||30))); let base=acc.expiresAt?new Date(acc.expiresAt):new Date();
    if(!Number.isFinite(base.getTime())||base<Date.now()) base=new Date(); const expiresAt=new Date(base.getTime()+days*86400000).toISOString();
    await ref.set({expiresAt,status:acc.status==='expired'?'active':acc.status,updatedAt:FieldValue.serverTimestamp(),updatedByUid:actor.uid},{merge:true});
    await audit(courseId,actor,action,ref.id,{expiresAt:acc.expiresAt},{expiresAt}); return {ok:true,newExpiresAt:expiresAt};
  }
  if(action==='ticketPatch'||action==='ticketComment'){
    const ticketId=policy.safeId(data.ticketId); if(!ticketId) fail('invalid-argument','ticketId fehlt.');
    const ref=db.doc(`courses/${courseId}/tickets/${ticketId}`); const snap=await ref.get(); const before=snap.exists?snap.data():null;
    if(!snap.exists&&actor.role!=='admin') fail('not-found','Ticket nicht gefunden.');
    if(before&&actor.role==='teacher'&&!policy.canAccessGroup(actor,before.groupId)) fail('permission-denied','Dozent darf dieses Ticket nicht bearbeiten.');
    if(action==='ticketComment'){
      const text=policy.sanitizeText(data.text,1500); if(!text) fail('invalid-argument','Notiz fehlt.');
      await ref.set({history:FieldValue.arrayUnion({at:new Date().toISOString(),byUid:actor.uid,byRole:actor.role,type:'comment',text}),updatedAt:FieldValue.serverTimestamp()},{merge:true});
      await audit(courseId,actor,action,ticketId,null,{comment:true}); return {ok:true};
    }
    const patch=cleanTicketPatch(data.patch||{});
    if(actor.role==='teacher'){delete patch.groupId;delete patch.reporterUid;delete patch.reporterRole;}
    patch.updatedAt=FieldValue.serverTimestamp(); patch.updatedByUid=actor.uid;
    if(data.historyText) patch.history=FieldValue.arrayUnion({at:new Date().toISOString(),byUid:actor.uid,byRole:actor.role,type:'update',text:policy.sanitizeText(data.historyText,400)});
    await ref.set(patch,{merge:true}); await audit(courseId,actor,action,ticketId,before,patch); return {ok:true};
  }
  if(action==='deleteDemoLearners'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    const qs=await db.collection(`courses/${courseId}/learners`).where('isDemo','==',true).limit(200).get(); const removed=[];
    for(const doc of qs.docs){const profile=doc.data()||{};removed.push(profile.userId||doc.id);await recursiveDelete(doc.ref);if(profile.firebaseUid)await auth.deleteUser(profile.firebaseUid).catch(()=>{});}
    await audit(courseId,actor,action,'demo-profiles',{count:qs.size},{removed});return {ok:true,removed};
  }
  if(action==='bulkLearnerAction') return applyBulkLearnerAction(courseId,actor,data);
  if(action==='savePrivacyPolicy'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    const raw=data.policy||{}; const retentionDays=Math.max(30,Math.min(3650,Number(raw.retentionDays||730)));
    const clean={retentionDays,aiDataRetentionDays:Math.max(0,Math.min(365,Number(raw.aiDataRetentionDays||30))),autoDeleteInactive:raw.autoDeleteInactive===true,updatedAt:FieldValue.serverTimestamp(),updatedByUid:actor.uid};
    const ref=db.doc(`courses/${courseId}/settings/privacy`); const before=(await ref.get()).data()||null; await ref.set(clean,{merge:true}); await audit(courseId,actor,action,'settings/privacy',before,clean); return {ok:true,policy:Object.assign({},clean,{updatedAt:new Date().toISOString()})};
  }
  if(action==='saveCourseSettings'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    const settings=data.settings||{}; const clean={title:policy.sanitizeText(settings.title||settings.courseTitle,120),updatedAt:FieldValue.serverTimestamp(),updatedByUid:actor.uid};
    await db.doc(`courses/${courseId}`).set(clean,{merge:true}); await audit(courseId,actor,action,courseId,null,clean); return {ok:true};
  }
  if(action==='resetCourse'){
    if(actor.role!=='admin'||String(data.confirm||'')!==courseId) fail('failed-precondition','Kursreset erfordert exakte courseId als Bestätigung.');
    const learners=await db.collection(`courses/${courseId}/learners`).get();
    for(const doc of learners.docs){await recursiveDelete(doc.ref); if(doc.data().firebaseUid) await auth.deleteUser(doc.data().firebaseUid).catch(()=>{});}
    await audit(courseId,actor,action,courseId,{learnerCount:learners.size},{learnerCount:0}); return {ok:true,deleted:learners.size};
  }

  const target=await resolveLearner(courseId,data.targetUid||data.learnerId);
  if(actor.role==='teacher'&&!policy.canAccessGroup(actor,target.data.groupId)) fail('permission-denied','Dozent darf diesen Teilnehmer nicht verwalten.');

  if(action==='privacyExportLearner'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    const exported=await learnerPrivacyExport(courseId,target); await audit(courseId,actor,action,target.ref.id,null,{collectionCounts:Object.fromEntries(Object.entries(exported.collections).map(([k,v])=>[k,v.length]))}); return {ok:true,export:exported};
  }
  if(action==='privacyDeleteLearner'){
    if(actor.role!=='admin'||String(data.confirm||'')!==target.ref.id) fail('failed-precondition','Datenschutzlöschung benötigt die exakte Teilnehmer-ID als Bestätigung.');
    const before=redactAuditValue(target.data||{}); await audit(courseId,actor,action,target.ref.id,before,{deletionRequested:true}); await recursiveDelete(target.ref); await auth.deleteUser(target.uid).catch(()=>{}); return {ok:true,deleted:target.ref.id};
  }

  if(action==='patchLearner'){
    const patch=policy.sanitizePatch(data.patch||{});
    if(!policy.allowedPatch(actor,patch,target.data)) fail('permission-denied','Patch enthält nicht erlaubte Felder.');
    if(Object.prototype.hasOwnProperty.call(patch,'role')) fail('permission-denied','Rollenänderung benötigt setRole.');
    if(Object.prototype.hasOwnProperty.call(patch,'adminNote')||Object.prototype.hasOwnProperty.call(patch,'note')) patch.lastAdminNoteAt=FieldValue.serverTimestamp();
    patch.updatedAt=FieldValue.serverTimestamp(); patch.updatedByUid=actor.uid;
    await target.ref.set(patch,{merge:true}); await audit(courseId,actor,action,target.ref.id,target.data,patch); return {ok:true,profile:Object.assign({},target.data,patch)};
  }
  if(action==='setRole'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    const newRole=policy.normalizeRole(data.role); if(!policy.roleAssignable(newRole)) fail('invalid-argument','Adminrollen werden ausschließlich per Bootstrap vergeben.');
    const groupId=policy.normalizeCode(data.groupId||target.data.groupId||'');
    const user=await auth.getUser(target.uid); const existing=user.customClaims||{};
    await auth.setCustomUserClaims(target.uid,mergeClaims(existing,{role:newRole,admin:false,teacher:newRole==='teacher',courseIds:Array.from(new Set([...(existing.courseIds||[]),courseId])),assignedGroups:newRole==='teacher'?(data.assignedGroups||[groupId]).map(policy.normalizeCode).filter(Boolean):[]}));
    const patch={role:newRole,roleLabel:newRole==='teacher'?'Dozent':'Teilnehmer',participantRole:newRole==='participant'?'teilnehmer':newRole,groupId,updatedAt:FieldValue.serverTimestamp(),updatedByUid:actor.uid};
    await target.ref.set(patch,{merge:true}); await audit(courseId,actor,action,target.ref.id,{role:target.data.role},{role:newRole,groupId}); return {ok:true,refreshTargetToken:true};
  }
  if(action==='resetPassword'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    const temp=`Nvr!${crypto.randomBytes(9).toString('base64url')}7`;
    await auth.updateUser(target.uid,{password:temp}); await target.ref.set({mustChangePassword:true,passwordResetAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()},{merge:true});
    await audit(courseId,actor,action,target.ref.id,null,{mustChangePassword:true}); return {ok:true,userId:target.ref.id,temporaryPassword:temp};
  }
  if(action==='resetLearnerAttempts'){
    const modules=resetModuleStats(target.data.modules||{});
    const global=Object.assign({},target.data.global||{},{totalSessions:0,totalXp:0,riskLevel:'unbekannt',recurringErrors:{}});
    await Promise.all([
      clearCollection(`courses/${courseId}/learners/${target.ref.id}/attempts`),
      clearCollection(`courses/${courseId}/learners/${target.ref.id}/events`),
      clearCollection(`courses/${courseId}/learners/${target.ref.id}/sessions`),
      clearCollection(`courses/${courseId}/learners/${target.ref.id}/progress`)
    ]);
    const patch={attempts:[],recentEvents:[],activityRecent:[],activitySummary:activityPolicy.emptySummary(),modules,global,attemptsResetAt:FieldValue.serverTimestamp(),attemptsResetByUid:actor.uid,updatedAt:FieldValue.serverTimestamp()};
    await target.ref.set(patch,{merge:true}); await audit(courseId,actor,action,target.ref.id,{attempts:'existing'},{attempts:0});
    return {ok:true,profile:Object.assign({},target.data,patch)};
  }
  if(action==='deleteLearner'){
    if(actor.role!=='admin') fail('permission-denied','Nur Admin.');
    await recursiveDelete(target.ref); await auth.deleteUser(target.uid).catch(()=>{}); await audit(courseId,actor,action,target.ref.id,target.data,{deleted:true}); return {ok:true,deleted:target.ref.id};
  }
  fail('invalid-argument','Unbekannte Adminaktion.');
});
