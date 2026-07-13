#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {cert, initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {FieldValue, getFirestore} from 'firebase-admin/firestore';

function required(name) {
  const value=String(process.env[name]||'').trim();
  if(!value) throw new Error(`Pflichtwert fehlt: ${name}`);
  return value;
}
function fail(message,code=1){ console.error(`\nABBRUCH: ${message}\n`); process.exit(code); }

const keyPath=path.resolve(required('NOVURA_SERVICE_ACCOUNT_PATH'));
const email=required('NOVURA_ADMIN_EMAIL').toLowerCase();
const nickname=required('NOVURA_ADMIN_NICKNAME').slice(0,40);
const password=required('NOVURA_ADMIN_PASSWORD');
const courseId=String(process.env.NOVURA_COURSE_ID||'course_2026_gk').trim();
const expectedProject=String(process.env.NOVURA_EXPECTED_PROJECT_ID||'bbq-userdatabase').trim();
if(password.length<8) fail('Das Passwort muss mindestens 8 Zeichen lang sein.',2);
if(!fs.existsSync(keyPath)) fail(`Service-Account-Datei nicht gefunden: ${keyPath}`,3);

let serviceAccount;
try { serviceAccount=JSON.parse(fs.readFileSync(keyPath,'utf8')); }
catch { fail('Die Service-Account-Datei ist kein gültiges JSON.',4); }
if(serviceAccount.type!=='service_account'||!serviceAccount.client_email||!serviceAccount.private_key) fail('Die JSON-Datei ist kein Firebase-Service-Account-Schlüssel.',5);
if(expectedProject && serviceAccount.project_id!==expectedProject) fail(`Falsches Firebase-Projekt. Erwartet: ${expectedProject}, Datei: ${serviceAccount.project_id||'unbekannt'}`,6);

initializeApp({credential:cert(serviceAccount),projectId:serviceAccount.project_id});
const auth=getAuth();
const db=getFirestore();
const lockRef=db.doc('system/bootstrapAdmin');

console.log(`\nNovura lokaler Admin-Bootstrap`);
console.log(`Projekt: ${serviceAccount.project_id}`);
console.log(`Konto:   ${email}`);
console.log(`Kurs:    ${courseId}\n`);

const lockSnap=await lockRef.get();
const lock=lockSnap.exists?lockSnap.data()||{}:{};
if(lock.status==='completed'){
  const completedEmail=String(lock.completedByEmail||'').toLowerCase();
  if(completedEmail && completedEmail!==email){
    fail(`Der Bootstrap wurde bereits für ${lock.completedByEmail||'ein anderes Konto'} abgeschlossen.`,7);
  }
}

let user;
let created=false;
try { user=await auth.getUserByEmail(email); }
catch(error){
  if(error&&error.code==='auth/user-not-found'){
    user=await auth.createUser({email,password,displayName:nickname,emailVerified:true,disabled:false});
    created=true;
  }else throw error;
}
if(!created){
  user=await auth.updateUser(user.uid,{password,displayName:nickname,emailVerified:true,disabled:false});
}

const existingAdminSnap=await db.collection(`courses/${courseId}/learners`).where('role','==','admin').limit(1).get();
if(!existingAdminSnap.empty && existingAdminSnap.docs[0].id!==user.uid){
  fail('In diesem Kurs existiert bereits ein anderes Admin-Konto.',8);
}

const currentClaims=user.customClaims||{};
const courseIds=Array.from(new Set([...(Array.isArray(currentClaims.courseIds)?currentClaims.courseIds:[]),courseId]));
await auth.setCustomUserClaims(user.uid,{...currentClaims,role:'admin',admin:true,teacher:false,courseIds,assignedGroups:[],profileId:user.uid,bootstrapAdmin:true});

const learnerRef=db.doc(`courses/${courseId}/learners/${user.uid}`);
await db.runTransaction(async tx=>{
  const currentLockSnap=await tx.get(lockRef);
  const currentLock=currentLockSnap.exists?currentLockSnap.data()||{}:{};
  if(currentLock.status==='completed'){
    const sameUid=String(currentLock.completedByUid||'')===user.uid;
    const sameEmail=String(currentLock.completedByEmail||'').toLowerCase()===email;
    if(!sameUid&&!sameEmail) throw new Error('Der globale Bootstrap-Lock gehört bereits zu einem anderen Konto.');
  }
  const learnerSnap=await tx.get(learnerRef);
  const profile={
    profileId:user.uid,id:user.uid,firebaseUid:user.uid,email,nickname,displayName:nickname,alias:nickname,
    role:'admin',accessRole:'admin',participantRole:'admin',groupId:'ADMIN',courseId,status:'active',blocked:false,
    createdVia:'local-admin-bootstrap',emailVerified:true,updatedAt:FieldValue.serverTimestamp()
  };
  if(!learnerSnap.exists) profile.createdAt=FieldValue.serverTimestamp();
  tx.set(learnerRef,profile,{merge:true});
  tx.set(lockRef,{
    schema:'novura-local-admin-bootstrap-v1',status:'completed',completed:true,
    completedByUid:user.uid,completedByEmail:email,courseId,mode:'local-service-account',
    completedAt:currentLock.completedAt||FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()
  },{merge:true});
});

console.log('ERFOLG: Der erste Systemadministrator ist eingerichtet.');
console.log('Der globale Bootstrap-Lock ist jetzt dauerhaft abgeschlossen.');
console.log('Melde dich in Novura über den normalen Login an.');
console.log('Falls Novura noch geöffnet ist: ausloggen, App vollständig schließen und neu anmelden.\n');
console.log(JSON.stringify({ok:true,uid:user.uid,email,role:'admin',courseId,created},null,2));
