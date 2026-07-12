#!/usr/bin/env node
import {applicationDefault,initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';

const email=String(process.argv[2]||process.env.BOOTSTRAP_ADMIN_EMAIL||'').trim().toLowerCase();
const courseId=String(process.argv[3]||process.env.BOOTSTRAP_COURSE_ID||'course_2026_gk').trim();
if(!email){console.error('Nutzung: node tools/bootstrap-admin.mjs admin@example.com [courseId]'); process.exit(2);}
initializeApp({credential:applicationDefault()});
const auth=getAuth();
const user=await auth.getUserByEmail(email);
if(!user.emailVerified){console.error('Abbruch: Admin-E-Mail ist noch nicht bestätigt.'); process.exit(3);}
const existing=user.customClaims||{};
await auth.setCustomUserClaims(user.uid,{...existing,role:'admin',admin:true,teacher:false,courseIds:Array.from(new Set([...(existing.courseIds||[]),courseId])),assignedGroups:[]});
console.log(JSON.stringify({ok:true,uid:user.uid,email,role:'admin',courseId},null,2));
