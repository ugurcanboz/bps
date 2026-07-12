'use strict';

const ALLOWED_STATUS=new Set(['started','completed','aborted']);
const ALLOWED_KIND=new Set(['training','simulation','language-training','language-exam','placement','review','duel','unknown']);
const EVENT_TYPES=new Set(['session-started','session-completed','session-aborted','answer-recorded','part-completed','task-opened','review-scheduled','review-completed','speech-evaluated','writing-evaluated']);
const SUMMARY_SCHEMA='egt-activity-summary-v1';
const SESSION_SCHEMA='egt-activity-ledger-v1';

function text(v,max=240){return String(v==null?'':v).trim().slice(0,max);}
function num(v,min=0,max=Number.MAX_SAFE_INTEGER){v=Number(v);if(!Number.isFinite(v))v=0;return Math.max(min,Math.min(max,v));}
function bool(v){return v===true;}
function safeObject(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}
function safeArray(v){return Array.isArray(v)?v:[];}
function slug(v){return text(v,100).toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_').replace(/^_+|_+$/g,'')||'global';}
function validIso(v,fallback){const d=new Date(v||'');return Number.isNaN(d.getTime())?(fallback||new Date().toISOString()):d.toISOString();}
function cleanMetadata(value,depth=0){
  if(depth>2)return null;
  if(Array.isArray(value))return value.slice(0,30).map(v=>cleanMetadata(v,depth+1));
  if(value&&typeof value==='object'){
    const out={}; for(const [k,v] of Object.entries(value).slice(0,40)) out[text(k,60)]=cleanMetadata(v,depth+1); return out;
  }
  if(typeof value==='string')return text(value,500);
  if(typeof value==='number')return Number.isFinite(value)?value:0;
  if(typeof value==='boolean'||value==null)return value;
  return text(value,200);
}
function normalizeEvent(raw,session,index){
  raw=safeObject(raw); const occurredAt=validIso(raw.occurredAt||raw.createdAt||session.completedAt||session.startedAt);
  let eventType=text(raw.eventType||raw.type||'answer-recorded',80).toLowerCase(); if(!EVENT_TYPES.has(eventType))eventType='answer-recorded';
  return {
    schema:SESSION_SCHEMA,eventId:text(raw.eventId||`${session.sessionId}_${index}`,180),sessionId:session.sessionId,
    ownerUid:session.ownerUid,courseId:session.courseId,groupId:session.groupId,eventType,sequence:index,occurredAt,
    module:text(raw.module||session.module||'global',80),mode:text(raw.mode||session.mode||'',120),category:text(raw.category||raw.group||raw.cat||'',120),
    taskId:text(raw.taskId||raw.questionId||raw.qid||'',180),taskType:text(raw.taskType||raw.visualType||'',80),
    correct:bool(raw.correct),skipped:bool(raw.skipped),timeout:bool(raw.timeout),durationMs:Math.round(num(raw.durationMs!=null?raw.durationMs:raw.duration,0,86400000)),
    score:raw.score==null?null:num(raw.score,0,100),trustLevel:'client-reported-validated',metadata:cleanMetadata(raw.metadata)
  };
}
function normalizeSession(raw,actor,courseId,profile){
  raw=safeObject(raw); profile=safeObject(profile);
  const sessionId=text(raw.sessionId||raw.id,180).replace(/[^a-zA-Z0-9_-]/g,'_'); if(!sessionId) throw new Error('sessionId fehlt.');
  let status=text(raw.status||'completed',30).toLowerCase(); if(!ALLOWED_STATUS.has(status))status='completed';
  let kind=text(raw.kind||raw.sessionType||'unknown',50).toLowerCase(); if(!ALLOWED_KIND.has(kind))kind='unknown';
  const startedAt=validIso(raw.startedAt||raw.createdAt); const completedAt=status==='started'?'':validIso(raw.completedAt||raw.finishedAt,startedAt);
  const base={schema:SESSION_SCHEMA,schemaVersion:1,sessionId,ownerUid:actor.uid,userId:actor.uid,profileId:actor.uid,courseId,
    groupId:text(profile.groupId||raw.groupId||'',128),role:actor.role,kind,status,module:text(raw.module||raw.mode||'global',80),mode:text(raw.mode||'',120),title:text(raw.title||'',180),
    language:text(raw.language||raw.examLanguage||'',20).toLowerCase(),level:text(raw.level||raw.levelId||'',20).toUpperCase(),variant:text(raw.variant||raw.examVariant||'',80),
    startedAt,completedAt,durationMs:Math.round(num(raw.durationMs,0,86400000)),rawScore:num(raw.rawScore!=null?raw.rawScore:raw.score,0,1000000),
    score:num(raw.percent!=null?raw.percent:(raw.scorePercent!=null?raw.scorePercent:raw.score),0,100),passed:bool(raw.passed),trustLevel:'client-reported-validated',
    source:text(raw.source||'egt-client',80),sourceRunId:text(raw.sourceRunId||'',180),appVersion:text(raw.appVersion||'',80),metadata:cleanMetadata(raw.metadata),events:[]};
  base.events=safeArray(raw.events).slice(0,450).map((e,i)=>normalizeEvent(e,base,i));
  const answers=base.events.filter(e=>e.eventType==='answer-recorded'||e.eventType==='part-completed'||e.eventType==='speech-evaluated'||e.eventType==='writing-evaluated');
  base.eventCount=base.events.length;base.answerCount=answers.length;base.correctCount=answers.filter(e=>e.correct).length;
  base.skippedCount=answers.filter(e=>e.skipped).length;base.timeoutCount=answers.filter(e=>e.timeout).length;
  if(!base.durationMs)base.durationMs=base.events.reduce((sum,e)=>sum+e.durationMs,0);
  if(!raw.passed&&status==='completed')base.passed=base.score>=70;
  return base;
}
function emptySummary(){return {schema:SUMMARY_SCHEMA,schemaVersion:1,trustLevel:'client-reported-validated',totalSessions:0,startedSessions:0,completedSessions:0,abortedSessions:0,simulationSessions:0,trainingSessions:0,languageExamSessions:0,taskAnswers:0,correctAnswers:0,totalDurationMs:0,lastSessionAt:'',lastEventAt:'',byKind:{},byModule:{},daily:{},heat:{},processedSessionIds:[],legacyMetrics:null,updatedAt:null};}
function mergeSummary(previous,session,nowIso=new Date().toISOString()){
  const out=Object.assign(emptySummary(),safeObject(previous)); out.byKind=Object.assign({},safeObject(out.byKind));out.byModule=Object.assign({},safeObject(out.byModule));out.daily=Object.assign({},safeObject(out.daily));out.heat=Object.assign({},safeObject(out.heat));out.processedSessionIds=safeArray(out.processedSessionIds).slice(-159);
  if(out.processedSessionIds.includes(session.sessionId))return {summary:out,duplicate:true};
  out.totalSessions+=1;if(session.status==='started')out.startedSessions+=1;if(session.status==='completed')out.completedSessions+=1;if(session.status==='aborted')out.abortedSessions+=1;
  if(session.kind==='simulation')out.simulationSessions+=1;if(session.kind==='language-exam'){out.simulationSessions+=1;out.languageExamSessions+=1;}
  if(['training','language-training','review','placement'].includes(session.kind))out.trainingSessions+=1;
  out.taskAnswers+=session.answerCount;out.correctAnswers+=session.correctCount;out.totalDurationMs+=session.durationMs;
  out.lastSessionAt=[out.lastSessionAt,session.completedAt||session.startedAt].filter(Boolean).sort().pop()||'';out.lastEventAt=out.lastSessionAt;
  const kind=Object.assign({sessions:0,started:0,completed:0,aborted:0,answers:0,correct:0,durationMs:0},safeObject(out.byKind[session.kind]));kind.sessions++;if(session.status==='started')kind.started++;if(session.status==='completed')kind.completed++;if(session.status==='aborted')kind.aborted++;kind.answers+=session.answerCount;kind.correct+=session.correctCount;kind.durationMs+=session.durationMs;out.byKind[session.kind]=kind;
  const mk=slug(session.module);const mod=Object.assign({sessions:0,simulations:0,answers:0,correct:0,scoreSum:0,averageScore:0,durationMs:0,lastAt:''},safeObject(out.byModule[mk]));mod.sessions++;if(session.kind==='simulation'||session.kind==='language-exam')mod.simulations++;mod.answers+=session.answerCount;mod.correct+=session.correctCount;mod.scoreSum+=session.score;mod.averageScore=Math.round(mod.scoreSum/Math.max(1,mod.sessions));mod.durationMs+=session.durationMs;mod.lastAt=session.completedAt||session.startedAt;out.byModule[mk]=mod;
  const d=new Date(session.completedAt||session.startedAt);const day=Number.isNaN(d.getTime())?'unknown':d.toISOString().slice(0,10);const daily=Object.assign({sessions:0,simulations:0,answers:0,correct:0,durationMs:0},safeObject(out.daily[day]));daily.sessions++;if(session.kind==='simulation'||session.kind==='language-exam')daily.simulations++;daily.answers+=session.answerCount;daily.correct+=session.correctCount;daily.durationMs+=session.durationMs;out.daily[day]=daily;
  if(!Number.isNaN(d.getTime())){const dow=(d.getDay()+6)%7,slot=Math.floor(d.getHours()/4),key=`${dow}-${slot}`;out.heat[key]=Number(out.heat[key]||0)+1;}
  out.processedSessionIds.push(session.sessionId);out.updatedAt=nowIso;return {summary:out,duplicate:false};
}
function moduleCompatibility(summary,module){const mk=slug(module),m=safeObject(summary.byModule&&summary.byModule[mk]);return {key:mk,value:{answered:Number(m.answers||0),correct:Number(m.correct||0),averageScore:Number(m.averageScore||0),sessionCount:Number(m.sessions||0),simulationCount:Number(m.simulations||0),durationMs:Number(m.durationMs||0),lastActiveAt:m.lastAt||''}};}

module.exports={SESSION_SCHEMA,SUMMARY_SCHEMA,normalizeEvent,normalizeSession,emptySummary,mergeSummary,moduleCompatibility,slug};
