/* Eignungstest-Trainer · G54.46.4 Admin Analytics Engine
   Reine, testbare KPI- und Diagrammaggregation auf Basis verifizierbarer Ledger-Summaries.
   Legacy-Daten werden nie als echte Sessions oder Simulationen umgedeutet. */
(function(root,factory){
  'use strict';
  var api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.EGTAdminAnalyticsEngine=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  var VERSION='G54.46.4-admin-analytics-v1';
  var SUMMARY_SCHEMA='egt-activity-summary-v1';
  var ROLE_ORDER=['participant','teacher','demo','admin'];

  function obj(v){ return v&&typeof v==='object'&&!Array.isArray(v)?v:{}; }
  function arr(v){ return Array.isArray(v)?v:[]; }
  function num(v){ v=Number(v); return isFinite(v)?v:0; }
  function clampInt(v){ return Math.max(0,Math.round(num(v))); }
  function text(v){ return String(v==null?'':v).trim(); }
  function isoDay(d){ d=d instanceof Date?d:new Date(d); return isNaN(d.getTime())?'':d.toISOString().slice(0,10); }
  function normalizeRole(v){
    v=text(v).toLowerCase();
    if(v==='dozent'||v==='trainer'||v==='instructor') return 'teacher';
    if(v==='guest'||v==='trial') return 'demo';
    return ROLE_ORDER.indexOf(v)>=0?v:'participant';
  }
  function identityKey(x,source,index){
    x=obj(x);
    var raw=x.firebaseUid||x.uid||x.userId||x.dozentId||x.adminId||x.code||x.loginName||x.email||x.id;
    return text(raw).toLowerCase() || String(source||'unknown')+':'+String(index||0);
  }
  function ledgerSummary(profile){
    var summary=obj(profile&&profile.activitySummary);
    return summary.schema===SUMMARY_SCHEMA?summary:null;
  }
  function kindStats(summary,kind){
    var k=obj(obj(summary).byKind)[kind]||{};
    var total=clampInt(k.sessions);
    var completed=clampInt(k.completed);
    var aborted=clampInt(k.aborted);
    var started=k.started==null?Math.max(0,total-completed-aborted):clampInt(k.started);
    var classified=completed+aborted+started;
    var unclassified=Math.max(0,total-classified);
    return {total:total,started:started,completed:completed,aborted:aborted,unclassified:unclassified};
  }
  function addStatus(a,b){
    return {
      total:a.total+b.total,
      started:a.started+b.started,
      completed:a.completed+b.completed,
      aborted:a.aborted+b.aborted,
      unclassified:a.unclassified+b.unclassified
    };
  }
  function simulationStatus(summary){
    summary=obj(summary);
    var status=addStatus(kindStats(summary,'simulation'),kindStats(summary,'language-exam'));
    var reported=clampInt(summary.simulationSessions);
    if(reported>status.total){ status.unclassified+=reported-status.total; status.total=reported; }
    return status;
  }
  function sessionStatus(summary){
    summary=obj(summary);
    var total=clampInt(summary.totalSessions);
    var completed=clampInt(summary.completedSessions);
    var aborted=clampInt(summary.abortedSessions);
    var started=summary.startedSessions==null?Math.max(0,total-completed-aborted):clampInt(summary.startedSessions);
    return {total:total,started:started,completed:completed,aborted:aborted,unclassified:Math.max(0,total-started-completed-aborted)};
  }
  function recentLedgerActivity(profile,nowMs,windowMs){
    var summary=ledgerSummary(profile);
    if(!summary) return false;
    var raw=summary.lastEventAt||summary.lastSessionAt;
    var t=Date.parse(raw||'');
    return isFinite(t) && (nowMs-t)>=0 && (nowMs-t)<=windowMs;
  }
  function roleRoster(learners,teachers,admins){
    var map={};
    function put(x,source,index,forcedRole){
      x=obj(x);
      var role=forcedRole||normalizeRole(x.role);
      if(x.isDemo===true||x.createdBy==='demo-admin-portal') role='demo';
      var key=identityKey(x,source,index);
      var priority={participant:1,demo:2,teacher:3,admin:4};
      var existing=map[key];
      if(!existing||priority[role]>=priority[existing.role]) map[key]={key:key,role:role,source:source,status:text(x.status||'active')||'active'};
    }
    arr(learners).forEach(function(x,i){put(x,'learner',i);});
    arr(teachers).forEach(function(x,i){put(x,'teacher-registry',i,'teacher');});
    arr(admins).forEach(function(x,i){put(x,'admin-registry',i,'admin');});
    var counts={participant:0,teacher:0,admin:0,demo:0,total:0};
    Object.keys(map).forEach(function(k){ var r=map[k].role; if(counts[r]==null)r='participant'; counts[r]++; counts.total++; });
    return {counts:counts,accounts:Object.keys(map).map(function(k){return map[k];}),sources:{learners:arr(learners).length,teachers:arr(teachers).length,admins:arr(admins).length}};
  }
  function emptyHeat(){ return [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]; }
  function aggregate(input){
    input=obj(input);
    var learners=arr(input.learners), now=input.now?new Date(input.now):new Date();
    if(isNaN(now.getTime())) now=new Date();
    var dayBuckets={}, heat=emptyHeat(), ledgerProfiles=0, verifiedProfiles=0, legacyOnlyProfiles=0, noLedgerProfiles=0, taskAnswers=0, correctAnswers=0;
    var sessions={total:0,started:0,completed:0,aborted:0,unclassified:0};
    var simulations={total:0,started:0,completed:0,aborted:0,unclassified:0};
    var modules={};
    learners.forEach(function(profile){
      var summary=ledgerSummary(profile);
      if(!summary){ noLedgerProfiles++; return; }
      ledgerProfiles++;
      if(clampInt(summary.totalSessions)>0||clampInt(summary.taskAnswers)>0) verifiedProfiles++;
      else if(summary.legacyMetrics) legacyOnlyProfiles++;
      var ss=sessionStatus(summary), sm=simulationStatus(summary);
      sessions=addStatus(sessions,ss); simulations=addStatus(simulations,sm);
      taskAnswers+=clampInt(summary.taskAnswers); correctAnswers+=clampInt(summary.correctAnswers);
      Object.keys(obj(summary.daily)).forEach(function(key){
        var d=obj(summary.daily[key]);
        dayBuckets[key]=(dayBuckets[key]||0)+clampInt(d.sessions!=null?d.sessions:d.completedSessions);
      });
      Object.keys(obj(summary.heat)).forEach(function(key){
        var parts=String(key).split(/[-:]/), dow=Number(parts[0]), slot=Number(parts[1]);
        if(heat[dow]&&heat[dow][slot]!=null) heat[dow][slot]+=clampInt(summary.heat[key]);
      });
      Object.keys(obj(summary.byModule)).forEach(function(key){
        var m=obj(summary.byModule[key]), target=modules[key]||(modules[key]={answers:0,correct:0,sessions:0});
        target.answers+=clampInt(m.answers); target.correct+=clampInt(m.correct); target.sessions+=clampInt(m.sessions);
      });
    });
    var dn=['So','Mo','Di','Mi','Do','Fr','Sa'], dayBars=[];
    for(var i=6;i>=0;i--){
      var d=new Date(now.getTime()-i*86400000), key=isoDay(d);
      dayBars.push({l:dn[d.getUTCDay()],date:key,v:clampInt(dayBuckets[key])});
    }
    var moduleLabels={mathe:'Mathe',logik:'Logik',edv:'IT/EDV',it:'IT/EDV',python:'Python',konzentration:'Konzentration',simulation:'Simulation',language:'Sprache'};
    var weakAreas=Object.keys(modules).filter(function(k){return modules[k].answers>0;}).map(function(k){
      var m=modules[k]; return {key:k,l:moduleLabels[k]||k,v:Math.round(m.correct/Math.max(1,m.answers)*100),answers:m.answers,sessions:m.sessions};
    }).sort(function(a,b){ return a.v-b.v || b.answers-a.answers; });
    var roles=roleRoster(learners,input.teachers,input.admins);
    var heatTotal=heat.reduce(function(sum,row){return sum+row.reduce(function(a,b){return a+b;},0);},0);
    var recent15=learners.filter(function(p){return recentLedgerActivity(p,now.getTime(),15*60*1000);}).length;
    return {
      version:VERSION,
      period:{from:dayBars[0]&&dayBars[0].date||'',to:dayBars[6]&&dayBars[6].date||'',days:7},
      coverage:{learners:learners.length,ledgerProfiles:ledgerProfiles,verifiedProfiles:verifiedProfiles,legacyOnlyProfiles:legacyOnlyProfiles,noLedgerProfiles:noLedgerProfiles,verifiedPercent:learners.length?Math.round(verifiedProfiles/learners.length*100):0},
      sessions:sessions,simulations:simulations,taskAnswers:taskAnswers,correctAnswers:correctAnswers,
      accuracy:taskAnswers?Math.round(correctAnswers/taskAnswers*100):0,
      recent15:recent15,dayBars:dayBars,heatGrid:heat,heatTotal:heatTotal,weakAreas:weakAreas,roles:roles,
      empty:{activity:sessions.total===0,heat:heatTotal===0,weakAreas:weakAreas.length===0,roles:roles.counts.total===0}
    };
  }

  return Object.freeze({
    version:VERSION,summarySchema:SUMMARY_SCHEMA,
    normalizeRole:normalizeRole,ledgerSummary:ledgerSummary,kindStats:kindStats,
    simulationStatus:simulationStatus,sessionStatus:sessionStatus,recentLedgerActivity:recentLedgerActivity,
    roleRoster:roleRoster,aggregate:aggregate
  });
});
