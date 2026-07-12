/* Eignungstest-Trainer · G54.46.4 Activity Ledger Engine
   Einheitliches, append-only Ereignis- und Sessionmodell für Training, Simulation und Sprachprüfung.
   Alte Profilzähler werden nur als Legacy-Metrik übernommen und niemals als echte Sessions erfunden. */
(function(root,factory){
  'use strict';
  var api=factory(root||{});
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.EGTActivityLedgerEngine=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';

  var VERSION='G54.46.4-activity-ledger-v1';
  var SCHEMA='egt-activity-ledger-v1';
  var SUMMARY_SCHEMA='egt-activity-summary-v1';
  var STORAGE_KEY='egt_activity_ledger_v1';
  var MAX_SESSIONS=500;
  var MAX_EVENTS=6000;
  var ALLOWED_STATUS={started:true,completed:true,aborted:true};
  var ALLOWED_KIND={training:true,simulation:true,'language-training':true,'language-exam':true,placement:true,review:true,duel:true,unknown:true};

  function nowIso(){ return new Date().toISOString(); }
  function safeObject(v){ return v&&typeof v==='object'&&!Array.isArray(v)?v:{}; }
  function safeArray(v){ return Array.isArray(v)?v:[]; }
  function clone(v){ try{return JSON.parse(JSON.stringify(v));}catch(e){return v;} }
  function num(v,min,max){ v=Number(v); if(!isFinite(v)) v=0; if(min!=null&&v<min)v=min; if(max!=null&&v>max)v=max; return v; }
  function text(v,max){ return String(v==null?'':v).trim().slice(0,max||240); }
  function slug(v){ return text(v,180).toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_').replace(/^_+|_+$/g,'')||'unknown'; }
  function hash(input){
    var s=String(input||''), h=2166136261;
    for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
    return (h>>>0).toString(36);
  }
  function id(prefix,seed){
    if(seed) return prefix+'_'+hash(seed)+'_'+slug(String(seed).slice(-24));
    try{ if(root.crypto&&typeof root.crypto.randomUUID==='function') return prefix+'_'+root.crypto.randomUUID(); }catch(e){}
    return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
  }
  function validIso(v,fallback){ var d=new Date(v||''); return isNaN(d.getTime())?(fallback||nowIso()):d.toISOString(); }
  function durationFromHistory(history){ return safeArray(history).reduce(function(sum,item){return sum+num(item&&item.duration,0,86400000);},0); }
  function normalizeStatus(v){ v=text(v,30).toLowerCase(); return ALLOWED_STATUS[v]?v:'completed'; }
  function normalizeKind(v){ v=text(v,50).toLowerCase(); return ALLOWED_KIND[v]?v:'unknown'; }
  function isSimulationMode(mode,exam){
    var s=text(mode,160).toLowerCase();
    if(exam&&typeof exam==='object'&&Object.keys(exam).length) return true;
    return /(^|[-_\s])(simulation|sim|assessments|novuraExams|bosch|vollpruefung|vollprüfung|full[-_\s]?exam|exam)([-_\s]|$)/i.test(s);
  }
  function inferKind(input){
    input=safeObject(input);
    if(input.kind||input.sessionType) return normalizeKind(input.kind||input.sessionType);
    var mode=text(input.mode||input.module||input.title,160).toLowerCase();
    if(input.languageExam||/language[-_\s]?exam|sprachtest|vollprüfung.*sprache|full[-_\s]?exam/.test(mode)) return 'language-exam';
    if(input.languageTraining||/language[-_\s]?training|sprachtraining|sprachkurs/.test(mode)) return 'language-training';
    if(/placement|einstuf/.test(mode)) return 'placement';
    if(/review|wiederhol/.test(mode)) return 'review';
    if(/duell|duel/.test(mode)) return 'duel';
    if(isSimulationMode(mode,input.exam)) return 'simulation';
    return 'training';
  }
  function identity(input){
    input=safeObject(input);
    var profile=safeObject(input.profile), auth=safeObject(input.authIdentity);
    return {
      userId:text(input.userId||input.learnerId||auth.userId||profile.userId||profile.code||'GUEST',128),
      profileId:text(input.profileId||auth.profileId||profile.profileId||'',128),
      courseId:text(input.courseId||(root.AppConfig&&root.AppConfig.courseId)||profile.courseId||'course_2026_gk',128),
      groupId:text(input.groupId||auth.groupId||profile.groupId||'',128),
      role:text(input.role||auth.role||profile.role||'participant',40)
    };
  }
  function normalizeEvent(raw,session,index){
    raw=safeObject(raw); session=safeObject(session); index=num(index,0,100000);
    var occurred=validIso(raw.occurredAt||raw.createdAt||raw.answeredAt||session.completedAt||session.startedAt);
    var eventType=text(raw.eventType||raw.type||'answer-recorded',80).toLowerCase();
    var eventId=text(raw.eventId||'',160)||id('evt',[session.sessionId,index,eventType,raw.taskId||raw.q||'',occurred].join('|'));
    return {
      schema:SCHEMA,
      eventId:eventId,
      sessionId:text(raw.sessionId||session.sessionId,180),
      userId:text(raw.userId||session.userId,128),
      courseId:text(raw.courseId||session.courseId,128),
      groupId:text(raw.groupId||session.groupId,128),
      eventType:eventType,
      sequence:index,
      occurredAt:occurred,
      module:text(raw.module||session.module||'global',80),
      mode:text(raw.mode||session.mode||'',120),
      category:text(raw.category||raw.group||raw.cat||'',120),
      taskId:text(raw.taskId||raw.questionId||raw.qid||'',180),
      taskType:text(raw.taskType||raw.visualType||'',80),
      correct:raw.correct===true,
      skipped:raw.skipped===true,
      timeout:raw.timeout===true,
      durationMs:Math.round(num(raw.durationMs!=null?raw.durationMs:raw.duration,0,86400000)),
      score:raw.score==null?null:num(raw.score,0,100),
      trustLevel:text(raw.trustLevel||session.trustLevel||'client-reported',50),
      metadata:clone(safeObject(raw.metadata))
    };
  }
  function summarizeEvents(events){
    events=safeArray(events);
    var answers=events.filter(function(e){return e&&(/answer|part-completed|speech-evaluated|writing-evaluated/.test(e.eventType||''));});
    return {
      eventCount:events.length,
      answerCount:answers.length,
      correctCount:answers.filter(function(e){return e.correct===true;}).length,
      skippedCount:answers.filter(function(e){return e.skipped===true;}).length,
      timeoutCount:answers.filter(function(e){return e.timeout===true;}).length,
      durationMs:events.reduce(function(sum,e){return sum+num(e&&e.durationMs,0,86400000);},0)
    };
  }
  function normalizeSession(raw){
    raw=safeObject(raw);
    var who=identity(raw);
    var started=validIso(raw.startedAt||raw.createdAt||raw.date);
    var completed=normalizeStatus(raw.status)==='started'?'':validIso(raw.completedAt||raw.finishedAt||raw.updatedAt||raw.date,started);
    var sessionId=text(raw.sessionId||raw.id,180)||id('ses',[who.userId,raw.mode||raw.module||'',started,raw.sourceRunId||''].join('|'));
    var base={
      schema:SCHEMA,
      schemaVersion:1,
      sessionId:sessionId,
      userId:who.userId,
      profileId:who.profileId,
      courseId:who.courseId,
      groupId:who.groupId,
      role:who.role,
      kind:inferKind(raw),
      status:normalizeStatus(raw.status),
      module:text(raw.module||raw.mode||'global',80),
      mode:text(raw.mode||'',120),
      title:text(raw.title||'',180),
      language:text(raw.language||raw.examLanguage||'',20).toLowerCase(),
      level:text(raw.level||raw.levelId||'',20).toUpperCase(),
      variant:text(raw.variant||raw.examVariant||'',80),
      startedAt:started,
      completedAt:completed,
      durationMs:Math.round(num(raw.durationMs,0,86400000)),
      rawScore:num(raw.rawScore!=null?raw.rawScore:raw.score,0,1000000),
      score:num(raw.percent!=null?raw.percent:(raw.scorePercent!=null?raw.scorePercent:raw.score),0,100),
      passed:raw.passed===true,
      trustLevel:text(raw.trustLevel||'client-reported',50),
      source:text(raw.source||'egt-client',80),
      sourceRunId:text(raw.sourceRunId||'',180),
      appVersion:text(raw.appVersion||(root.AppConfig&&root.AppConfig.build)||'unknown',80),
      metadata:clone(safeObject(raw.metadata)),
      events:[]
    };
    base.events=safeArray(raw.events).map(function(e,i){return normalizeEvent(e,base,i);});
    var stats=summarizeEvents(base.events);
    base.eventCount=raw.eventCount==null?stats.eventCount:Math.round(num(raw.eventCount,0,10000));
    base.answerCount=raw.answerCount==null?stats.answerCount:Math.round(num(raw.answerCount,0,10000));
    base.correctCount=raw.correctCount==null?stats.correctCount:Math.round(num(raw.correctCount,0,10000));
    base.skippedCount=raw.skippedCount==null?stats.skippedCount:Math.round(num(raw.skippedCount,0,10000));
    base.timeoutCount=raw.timeoutCount==null?stats.timeoutCount:Math.round(num(raw.timeoutCount,0,10000));
    if(!base.durationMs) base.durationMs=stats.durationMs;
    if(base.correctCount>base.answerCount) base.correctCount=base.answerCount;
    if(!raw.passed && base.status==='completed') base.passed=base.score>=70;
    return base;
  }
  function sessionFromResult(input){
    input=safeObject(input);
    var record=safeObject(input.record), state=safeObject(input.state), history=safeArray(input.history||state.history);
    var who=identity(Object.assign({},input,record));
    var finished=validIso(record.date||input.completedAt||nowIso());
    var startedRaw=state.testStart||input.startedAt||record.startedAt;
    var started=startedRaw instanceof Date?startedRaw.toISOString():validIso(startedRaw,finished);
    var mode=text(record.mode||state.selectedMode||input.mode||'unknown',120);
    var seed=[who.userId,mode,started,record.date||'',input.sourceRunId||''].join('|');
    var session={
      sessionId:text(record.sessionId||'',180)||id('ses',seed),
      userId:who.userId,profileId:who.profileId,courseId:who.courseId,groupId:who.groupId,role:who.role,
      kind:inferKind({kind:input.kind||record.sessionType,mode:mode,exam:record.exam||state.exam}),
      status:'completed',module:text(input.module||mode,80),mode:mode,title:record.title||input.title||mode,
      startedAt:started,completedAt:finished,durationMs:durationFromHistory(history),
      rawScore:num(record.score,0,1000000),percent:num(record.percent,0,100),passed:record.passed===true||num(record.percent,0,100)>=70,
      source:'result-persistence',sourceRunId:text(input.sourceRunId||record.sourceRunId||(state.testStart&&state.testStart.getTime&&state.testStart.getTime())||'',180),
      appVersion:record.appVersion,
      metadata:{exam:clone(safeObject(record.exam)),categories:clone(safeObject(record.cats))},
      events:history.filter(Boolean).map(function(h,i){
        return {eventType:'answer-recorded',taskId:h.taskId||h.questionId||'',taskType:h.visualType||'',category:h.group||h.cat||'',correct:h.correct===true,skipped:h.skipped===true,timeout:h.timeout===true,durationMs:h.duration||0,metadata:{question:text(h.q,300),block:text(h.block,80),givenIndex:h.givenIndex,correctIndex:h.correctIndex}};
      })
    };
    return normalizeSession(session);
  }
  function sessionFromLanguageExam(examSession,input){
    examSession=safeObject(examSession); input=safeObject(input);
    var final=safeObject(examSession.final), parts=safeArray(final.partBreakdown);
    if(!parts.length){ Object.keys(safeObject(examSession.parts)).forEach(function(p){var r=examSession.parts[p]; if(r) parts.push({part:p,score:r.overallScore!=null?r.overallScore:r.score,passed:r.passed===true||r.passedLocal===true});}); }
    var context=safeObject(examSession.context);
    var sim=examSession.simulationMode&&/full-exam/.test(examSession.simulationMode)||context.mode==='simulation'||context.source==='simulation-center';
    var who=identity(Object.assign({},input,{courseId:input.courseId,userId:input.userId,groupId:input.groupId}));
    return normalizeSession({
      sessionId:examSession.id||id('ses',[who.userId,examSession.level,examSession.startedAt].join('|')),
      userId:who.userId,profileId:who.profileId,courseId:who.courseId,groupId:who.groupId,role:who.role,
      kind:sim?'language-exam':'language-training',status:'completed',module:'language',mode:examSession.simulationMode||'language-exam',title:'Sprachtest '+text(examSession.examLanguage||'de',10).toUpperCase()+' '+text(examSession.level,10),
      language:examSession.examLanguage||'de',level:examSession.level,variant:examSession.examVariant,
      startedAt:examSession.startedAt,completedAt:examSession.finishedAt||final.generatedAt||nowIso(),
      durationMs:Math.max(0,new Date(examSession.finishedAt||final.generatedAt||nowIso()).getTime()-new Date(examSession.startedAt||nowIso()).getTime()),
      rawScore:final.overallScore||0,percent:final.overallScore||0,passed:final.passed===true,
      source:'language-exam-shell',sourceRunId:examSession.id,appVersion:(root.AppConfig&&root.AppConfig.build)||'unknown',
      metadata:{completedParts:final.completedParts||parts.length,totalParts:final.totalParts||5,readiness:final.readiness||'',examDecision:final.examDecision||'',speakingEvidence:examSession.parts&&examSession.parts.speaking&&examSession.parts.speaking.evidence||null,speakingAssessmentScope:examSession.parts&&examSession.parts.speaking&&examSession.parts.speaking.assessmentScope||null},
      events:parts.map(function(p){var partResult=examSession.parts&&examSession.parts[p.part]||{};return {eventType:p.part==='speaking'?'speech-evaluated':'part-completed',taskId:p.part||'',taskType:'exam-part',category:p.label||p.part||'',correct:p.passed===true,score:p.score,durationMs:0,metadata:{minScore:p.minScore,status:p.status,risk:p.risk,assessmentScope:partResult.assessmentScope||null,audioMeasured:!!partResult.audioMeasured}};})
    });
  }
  function emptyLedger(){ return {schema:SCHEMA,schemaVersion:1,updatedAt:null,sessions:{},sessionOrder:[],events:{},eventOrder:[],standaloneEvents:{},standaloneEventOrder:[],migration:{}}; }
  function read(){
    try{ var raw=root.localStorage&&root.localStorage.getItem(STORAGE_KEY); var parsed=raw?JSON.parse(raw):null; return parsed&&parsed.schema===SCHEMA?Object.assign(emptyLedger(),parsed):emptyLedger(); }
    catch(e){ return emptyLedger(); }
  }
  function trimMap(map,order,max){ while(order.length>max){ var old=order.shift(); delete map[old]; } }
  function write(ledger){
    ledger=ledger||emptyLedger(); ledger.updatedAt=nowIso();
    trimMap(ledger.sessions,ledger.sessionOrder,MAX_SESSIONS);
    trimMap(ledger.events,ledger.eventOrder,MAX_EVENTS);
    trimMap(ledger.standaloneEvents,ledger.standaloneEventOrder,MAX_EVENTS);
    try{ if(root.localStorage) root.localStorage.setItem(STORAGE_KEY,JSON.stringify(ledger)); return {ok:true}; }
    catch(e){ return {ok:false,error:String(e&&e.message||e)}; }
  }
  function storeSession(raw){
    var session=normalizeSession(raw), ledger=read(), existed=!!ledger.sessions[session.sessionId];
    ledger.sessions[session.sessionId]=session;
    if(!existed) ledger.sessionOrder.push(session.sessionId);
    session.events.forEach(function(event){ var exists=!!ledger.events[event.eventId]; ledger.events[event.eventId]=event; if(!exists) ledger.eventOrder.push(event.eventId); });
    var result=write(ledger); return {ok:result.ok,created:!existed,session:clone(session),error:result.error||''};
  }
  function storeEvent(raw){
    var ledger=read(); var event=normalizeEvent(raw,raw&&raw.sessionId?{sessionId:raw.sessionId,userId:raw.userId,courseId:raw.courseId,groupId:raw.groupId,module:raw.module,mode:raw.mode}: {},ledger.standaloneEventOrder.length);
    var existed=!!ledger.standaloneEvents[event.eventId]; ledger.standaloneEvents[event.eventId]=event; if(!existed) ledger.standaloneEventOrder.push(event.eventId);
    var result=write(ledger); return {ok:result.ok,created:!existed,event:clone(event),error:result.error||''};
  }
  function listSessions(filter){
    filter=safeObject(filter); var ledger=read();
    return ledger.sessionOrder.map(function(k){return ledger.sessions[k];}).filter(Boolean).filter(function(s){
      if(filter.userId&&s.userId!==filter.userId)return false;
      if(filter.courseId&&s.courseId!==filter.courseId)return false;
      if(filter.kind&&s.kind!==filter.kind)return false;
      if(filter.since&&new Date(s.completedAt||s.startedAt).getTime()<new Date(filter.since).getTime())return false;
      return true;
    }).map(clone);
  }
  function emptySummary(){ return {schema:SUMMARY_SCHEMA,schemaVersion:1,trustLevel:'client-reported',totalSessions:0,startedSessions:0,completedSessions:0,abortedSessions:0,simulationSessions:0,trainingSessions:0,languageExamSessions:0,taskAnswers:0,correctAnswers:0,totalDurationMs:0,lastSessionAt:'',lastEventAt:'',byKind:{},byModule:{},daily:{},heat:{},processedSessionIds:[],legacyMetrics:null,updatedAt:null}; }
  function mergeSummary(previous,rawSession){
    var s=normalizeSession(rawSession), out=Object.assign(emptySummary(),clone(safeObject(previous)));
    out.byKind=clone(safeObject(out.byKind)); out.byModule=clone(safeObject(out.byModule)); out.daily=clone(safeObject(out.daily)); out.heat=clone(safeObject(out.heat)); out.processedSessionIds=safeArray(out.processedSessionIds);
    if(out.processedSessionIds.indexOf(s.sessionId)>=0) return out;
    out.totalSessions+=1;
    if(s.status==='started') out.startedSessions+=1;
    if(s.status==='completed') out.completedSessions+=1;
    if(s.status==='aborted') out.abortedSessions+=1;
    if(s.kind==='simulation') out.simulationSessions+=1;
    if(s.kind==='language-exam'){ out.simulationSessions+=1; out.languageExamSessions+=1; }
    if(s.kind==='training'||s.kind==='language-training'||s.kind==='review'||s.kind==='placement') out.trainingSessions+=1;
    out.taskAnswers+=s.answerCount;
    out.correctAnswers+=s.correctCount;
    out.totalDurationMs+=s.durationMs;
    out.lastSessionAt=[out.lastSessionAt,s.completedAt||s.startedAt].sort().pop(); out.lastEventAt=out.lastSessionAt;
    var kind=out.byKind[s.kind]||{sessions:0,started:0,completed:0,aborted:0,answers:0,correct:0,durationMs:0}; kind.sessions++; if(s.status==='started')kind.started++; if(s.status==='completed')kind.completed++; if(s.status==='aborted')kind.aborted++; kind.answers+=s.answerCount; kind.correct+=s.correctCount; kind.durationMs+=s.durationMs; out.byKind[s.kind]=kind;
    var mk=slug(s.module||'global'), mod=out.byModule[mk]||{sessions:0,simulations:0,answers:0,correct:0,scoreSum:0,averageScore:0,durationMs:0,lastAt:''}; mod.sessions++; if(s.kind==='simulation'||s.kind==='language-exam')mod.simulations++; mod.answers+=s.answerCount; mod.correct+=s.correctCount; mod.scoreSum+=s.score; mod.averageScore=Math.round(mod.scoreSum/Math.max(1,mod.sessions)); mod.durationMs+=s.durationMs; mod.lastAt=s.completedAt||s.startedAt; out.byModule[mk]=mod;
    var d=new Date(s.completedAt||s.startedAt), day=isNaN(d.getTime())?'unknown':d.toISOString().slice(0,10); var daily=out.daily[day]||{sessions:0,simulations:0,answers:0,correct:0,durationMs:0}; daily.sessions++; if(s.kind==='simulation'||s.kind==='language-exam')daily.simulations++; daily.answers+=s.answerCount; daily.correct+=s.correctCount; daily.durationMs+=s.durationMs; out.daily[day]=daily;
    if(!isNaN(d.getTime())){ var dow=(d.getDay()+6)%7, slot=Math.floor(d.getHours()/4), hk=dow+'-'+slot; out.heat[hk]=(out.heat[hk]||0)+1; }
    out.processedSessionIds.push(s.sessionId); out.processedSessionIds=out.processedSessionIds.slice(-160); out.updatedAt=nowIso(); return out;
  }
  function migrateLegacyProfile(profile){
    profile=clone(safeObject(profile));
    if(profile.activitySummary&&profile.activitySummary.schema===SUMMARY_SCHEMA) return profile;
    var mods=safeObject(profile.modules), answers=0,correct=0;
    Object.keys(mods).forEach(function(k){answers+=num(mods[k]&&mods[k].answered,0,10000000);correct+=num(mods[k]&&mods[k].correct,0,10000000);});
    var legacySessions=num(profile.global&&profile.global.totalSessions,0,10000000);
    profile.activitySummary=emptySummary();
    profile.activitySummary.legacyMetrics={source:'pre-g54.46.3-profile',taskAnswers:Math.round(answers),correctAnswers:Math.round(Math.min(correct,answers)),reportedSessions:Math.round(legacySessions),notCountedAsVerifiedSessions:true};
    profile.activitySummary.updatedAt=nowIso(); profile.dataSchemaVersion=SCHEMA; profile.activityMigration={version:VERSION,status:'legacy-separated',migratedAt:nowIso()};
    return profile;
  }
  function aggregate(sessions){
    var summary=emptySummary(); safeArray(sessions).forEach(function(s){summary=mergeSummary(summary,s);}); return summary;
  }
  function snapshot(){ var ledger=read(); return {version:VERSION,schema:SCHEMA,sessions:ledger.sessionOrder.length,events:ledger.eventOrder.length,standaloneEvents:ledger.standaloneEventOrder.length,summary:aggregate(ledger.sessionOrder.map(function(k){return ledger.sessions[k];}).filter(Boolean)),updatedAt:ledger.updatedAt}; }
  function clear(){ try{ if(root.localStorage)root.localStorage.removeItem(STORAGE_KEY); }catch(e){} return true; }

  return Object.freeze({
    __ready:true,version:VERSION,schema:SCHEMA,summarySchema:SUMMARY_SCHEMA,storageKey:STORAGE_KEY,
    inferKind:inferKind,normalizeEvent:normalizeEvent,normalizeSession:normalizeSession,
    sessionFromResult:sessionFromResult,sessionFromLanguageExam:sessionFromLanguageExam,
    storeSession:storeSession,storeEvent:storeEvent,listSessions:listSessions,read:read,clear:clear,snapshot:snapshot,
    emptySummary:emptySummary,mergeSummary:mergeSummary,aggregate:aggregate,migrateLegacyProfile:migrateLegacyProfile
  });
});
