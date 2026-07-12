const fs=require('node:fs');
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
const {doc,getDoc,setDoc,updateDoc,addDoc,collection,query,where,getDocs}=require('firebase/firestore');

const projectId='egt-g54-46-3-security';
const course='course_2026_gk';
const A='2026-GK-A';
const B='2026-GK-B';
let env;
const passwordProvider={firebase:{sign_in_provider:'password'}};
const participantClaims={role:'participant',courseIds:[course],...passwordProvider};
const teacherClaims={role:'teacher',teacher:true,courseIds:[course],assignedGroups:[A],email_verified:true,...passwordProvider};
const adminClaims={role:'admin',admin:true,email_verified:true,...passwordProvider};

function dbFor(uid,claims){return env.authenticatedContext(uid,claims).firestore();}

async function seed(){
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'courses',course),{title:'Testkurs'});
    await setDoc(doc(db,'courses',course,'learners','user-a'),{firebaseUid:'user-a',userId:'TN-A',role:'participant',groupId:A,status:'active',blocked:false,modules:{},global:{},updatedAt:'seed'});
    await setDoc(doc(db,'courses',course,'learners','user-b'),{firebaseUid:'user-b',userId:'TN-B',role:'participant',groupId:B,status:'active',blocked:false,modules:{},global:{},updatedAt:'seed'});
    await setDoc(doc(db,'courses',course,'accessCodes','assessments-tn-a-code'),{code:'Novura Assessments-TN-A-CODE',role:'participant',groupId:A,status:'active'});
    await setDoc(doc(db,'courses',course,'securityAudit','audit-1'),{actorUid:'admin-1',action:'seed'});
  });
}

test.before(async()=>{
  env=await initializeTestEnvironment({projectId,firestore:{rules:fs.readFileSync(path.resolve(__dirname,'firestore.rules'),'utf8'),host:'127.0.0.1',port:Number(process.env.FIRESTORE_EMULATOR_PORT||8085)}});
  await seed();
});
test.after(async()=>{await env.cleanup();});
test.beforeEach(async()=>{await env.clearFirestore();await seed();});

test('unauthenticated and anonymous users cannot read learner profiles',async()=>{
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(),'courses',course,'learners','user-a')));
  const anon=dbFor('anon-1',{role:'participant',courseIds:[course],firebase:{sign_in_provider:'anonymous'}});
  await assertFails(getDoc(doc(anon,'courses',course,'learners','user-a')));
});

test('participant can read own profile but not another profile',async()=>{
  const db=dbFor('user-a',participantClaims);
  await assertSucceeds(getDoc(doc(db,'courses',course,'learners','user-a')));
  await assertFails(getDoc(doc(db,'courses',course,'learners','user-b')));
});

test('participant can update personal preferences but not performance aggregates',async()=>{
  const db=dbFor('user-a',participantClaims); const ref=doc(db,'courses',course,'learners','user-a');
  await assertSucceeds(updateDoc(ref,{preferences:{theme:'dark'},updatedAt:'now'}));
  await assertFails(updateDoc(ref,{modules:{mathe:{answered:1}},lastActiveAt:'now',updatedAt:'now'}));
  await assertFails(updateDoc(ref,{activitySummary:{totalSessions:999},updatedAt:'now'}));
  await assertFails(updateDoc(ref,{role:'admin'}));
  await assertFails(updateDoc(ref,{groupId:B}));
  await assertFails(updateDoc(ref,{status:'blocked'}));
  await assertFails(updateDoc(ref,{pendingWarning:{text:'fake'}}));
  await assertSucceeds(updateDoc(ref,{pendingWarning:null,updatedAt:'now'}));
});

test('participant cannot write sessions events attempts or progress directly',async()=>{
  const db=dbFor('user-a',participantClaims);
  await assertFails(addDoc(collection(db,'courses',course,'learners','user-a','attempts'),{ownerUid:'user-a',score:80}));
  await assertFails(addDoc(collection(db,'courses',course,'learners','user-a','sessions'),{ownerUid:'user-a',score:80}));
  await assertFails(addDoc(collection(db,'courses',course,'learners','user-a','events'),{ownerUid:'user-a',eventType:'answer-recorded'}));
  await assertFails(addDoc(collection(db,'courses',course,'learners','user-a','progress'),{ownerUid:'user-a',done:1}));
});

test('teacher sees only assigned-group learners and cannot write them directly',async()=>{
  const db=dbFor('teacher-a',teacherClaims);
  const ownQ=query(collection(db,'courses',course,'learners'),where('groupId','==',A));
  const own=await assertSucceeds(getDocs(ownQ)); assert.equal(own.size,1);
  await assertFails(getDocs(collection(db,'courses',course,'learners')));
  await assertFails(getDoc(doc(db,'courses',course,'learners','user-b')));
  await assertFails(updateDoc(doc(db,'courses',course,'learners','user-a'),{adminNote:'browser write'}));
});

test('admin can read all learners and audit, but direct privileged writes are denied',async()=>{
  const db=dbFor('admin-1',adminClaims);
  const all=await assertSucceeds(getDocs(collection(db,'courses',course,'learners'))); assert.equal(all.size,2);
  await assertSucceeds(getDoc(doc(db,'courses',course,'securityAudit','audit-1')));
  await assertFails(updateDoc(doc(db,'courses',course,'learners','user-a'),{role:'admin'}));
  await assertFails(setDoc(doc(db,'courses',course,'accessCodes','new-code'),{role:'admin'}));
});

test('access codes are hidden from participants and scoped for teachers',async()=>{
  const p=dbFor('user-a',participantClaims); const t=dbFor('teacher-a',teacherClaims); const a=dbFor('admin-1',adminClaims);
  const refP=doc(p,'courses',course,'accessCodes','assessments-tn-a-code');
  await assertFails(getDoc(refP));
  await assertSucceeds(getDoc(doc(t,'courses',course,'accessCodes','assessments-tn-a-code')));
  await assertSucceeds(getDoc(doc(a,'courses',course,'accessCodes','assessments-tn-a-code')));
});

test('ticket reporter UID cannot be spoofed',async()=>{
  const db=dbFor('user-a',participantClaims);
  await assertSucceeds(setDoc(doc(db,'courses',course,'tickets','ticket-own'),{reporterUid:'user-a',groupId:A,title:'Hilfe'}));
  await assertFails(setDoc(doc(db,'courses',course,'tickets','ticket-spoof'),{reporterUid:'user-b',groupId:A,title:'Fake'}));
});


test('subcollection ownership follows firebaseUid and not learner document id',async()=>{
  await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore();await setDoc(doc(db,'courses',course,'learners','profile-alias'),{firebaseUid:'user-a',groupId:A,role:'participant',status:'active',blocked:false});await setDoc(doc(db,'courses',course,'learners','profile-alias','progress','p1'),{done:1});});
  const db=dbFor('user-a',participantClaims);
  await assertSucceeds(getDoc(doc(db,'courses',course,'learners','profile-alias','progress','p1')));
});

test('ticket schema blocks oversized and privileged fields',async()=>{
  const db=dbFor('user-a',participantClaims);
  await assertFails(setDoc(doc(db,'courses',course,'tickets','ticket-admin-field'),{reporterUid:'user-a',groupId:A,title:'Hilfe',role:'admin'}));
  await assertFails(setDoc(doc(db,'courses',course,'tickets','ticket-long'),{reporterUid:'user-a',groupId:A,title:'x'.repeat(161)}));
});

test('duel creation cannot preselect guest or inject results',async()=>{
  const db=dbFor('user-a',participantClaims);
  await assertSucceeds(setDoc(doc(db,'courses',course,'duels','duel-ok'),{hostUid:'user-a',status:'waiting',guestUid:null,results:null}));
  await assertFails(setDoc(doc(db,'courses',course,'duels','duel-guest'),{hostUid:'user-a',status:'waiting',guestUid:'user-b'}));
  await assertFails(setDoc(doc(db,'courses',course,'duels','duel-result'),{hostUid:'user-a',status:'waiting',results:{winner:'user-a'}}));
});
