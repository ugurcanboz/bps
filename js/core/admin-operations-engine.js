/* Eignungstest-Trainer · G54.46.6 Admin Operations Engine
   Reine Betriebslogik für kombinierbare Filter, Sync-Gesundheit,
   Audit-Kettenprüfung, Datenschutzinventar und Bulk-Planung. */
(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.EGTAdminOperationsEngine=Object.freeze(api);
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  var VERSION='G54.46.6-ADMIN-OPERATIONS';
  function text(v){return String(v==null?'':v).trim();}
  function num(v){v=Number(v);return isFinite(v)?v:0;}
  function clone(v){try{return JSON.parse(JSON.stringify(v));}catch(e){return v;}}
  function normalizeCode(v){return text(v).toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
  function profileId(p){return normalizeCode(p&&(p.userId||p.code||p.loginName||p.id||p.firebaseUid));}
  function dataClass(p){
    p=p||{};
    if(p.isDemo===true||text(p.role).toLowerCase()==='demo'||/demo/i.test(text(p.createdBy||p.source))) return 'demo';
    if(p.legacyMetrics||p.dataSource==='legacy'||(p.activitySummary&&p.activitySummary.legacyOnly===true)) return 'legacy';
    return 'production';
  }
  function lastActivity(p){var raw=p&&(p.lastActiveAt||p.lastSessionAt||p.updatedAt||p.lastLoginAt);var t=Date.parse(raw||'');return isFinite(t)?t:0;}
  function activityClass(p,now){
    now=num(now)||Date.now(); var t=lastActivity(p); if(!t)return 'never'; var days=(now-t)/86400000;
    if(days<=7)return 'active7'; if(days<=30)return 'active30'; return 'inactive30';
  }
  function normalizedRole(p){var r=text(p&&(p.role||p.participantRole||p.accessRole)).toLowerCase();if(r==='dozent')r='teacher';if(r==='teilnehmer'||r==='learner')r='participant';return r||'participant';}
  function groupId(p){return normalizeCode(p&&(p.groupId||p.group_id||p.courseGroup||''));}
  function levelId(p){
    p=p||{}; var direct=text(p.level||p.currentLevel||p.cefrLevel).toUpperCase(); if(/^[ABC][12]$/.test(direct))return direct;
    var lp=p.languageProgress||{}; var candidates=[lp.currentLevel,lp.level,lp.recommendedLevel,lp.de&&lp.de.level,lp.en&&lp.en.level];
    for(var i=0;i<candidates.length;i++){var v=text(candidates[i]).toUpperCase();if(/^[ABC][12]$/.test(v))return v;}
    return '';
  }
  function riskId(p){var r=text(p&&(p.riskLevel||(p.global&&p.global.riskLevel)||p.statusRisk)).toLowerCase();return r||'unbekannt';}
  function matches(p,filters,now){
    filters=filters||{}; var q=text(filters.query).toLowerCase();
    if(q){var hay=[p&&p.displayName,p&&p.nickname,p&&p.alias,profileId(p),groupId(p),normalizedRole(p),levelId(p),riskId(p)].join(' ').toLowerCase();if(hay.indexOf(q)<0)return false;}
    if(filters.status&&filters.status!=='all'&&filters.status!=='alle'&&riskId(p)!==filters.status&&text(p&&p.status).toLowerCase()!==filters.status)return false;
    if(filters.group&&filters.group!=='all'&&groupId(p)!==normalizeCode(filters.group))return false;
    if(filters.role&&filters.role!=='all'&&normalizedRole(p)!==filters.role)return false;
    if(filters.source&&filters.source!=='all'&&dataClass(p)!==filters.source)return false;
    if(filters.activity&&filters.activity!=='all'&&activityClass(p,now)!==filters.activity)return false;
    if(filters.level&&filters.level!=='all'&&levelId(p)!==text(filters.level).toUpperCase())return false;
    return true;
  }
  function filterLearners(list,filters,now){return (Array.isArray(list)?list:[]).filter(function(p){return matches(p,filters,now);});}
  function filterOptions(list){
    var groups={},levels={},roles={},sources={production:0,demo:0,legacy:0};
    (list||[]).forEach(function(p){var g=groupId(p),l=levelId(p),r=normalizedRole(p),s=dataClass(p);if(g)groups[g]=(groups[g]||0)+1;if(l)levels[l]=(levels[l]||0)+1;roles[r]=(roles[r]||0)+1;sources[s]=(sources[s]||0)+1;});
    return {groups:groups,levels:levels,roles:roles,sources:sources};
  }
  function syncHealth(status,queue,now){
    status=status||{}; queue=Array.isArray(queue)?queue:[]; now=num(now)||Date.now();
    var failed=queue.filter(function(x){return num(x&&x.attempts)>0||!!(x&&x.error);}).length;
    var oldest=queue.reduce(function(min,x){var t=Date.parse(x&&x.createdAt||'');return isFinite(t)&&(!min||t<min)?t:min;},0);
    var ageMs=oldest?Math.max(0,now-oldest):0; var grade='healthy',label='Synchron';
    if(!status.online){grade='offline';label='Lokaler Modus';}
    if(queue.length){grade=failed?'error':'pending';label=failed?'Fehler in Warteschlange':'Synchronisierung ausstehend';}
    if(ageMs>86400000){grade='critical';label='Warteschlange älter als 24 Stunden';}
    if(status.error){grade='error';label='Cloudfehler';}
    return {grade:grade,label:label,online:!!status.online,pending:queue.length,failed:failed,oldestAt:oldest?new Date(oldest).toISOString():'',oldestAgeMs:ageMs,lastSuccessAt:status.lastFlushAt||status.lastConnectedAt||'',provider:status.provider||'local-cache',message:status.error||status.connectionMessage||''};
  }
  function stable(value){
    if(value===null||typeof value!=='object')return JSON.stringify(value);
    if(Array.isArray(value))return '['+value.map(stable).join(',')+']';
    return '{'+Object.keys(value).sort().map(function(k){return JSON.stringify(k)+':'+stable(value[k]);}).join(',')+'}';
  }
  function hashString(input){var h1=2166136261,h2=2246822519,s=String(input||'');for(var i=0;i<s.length;i++){h1^=s.charCodeAt(i);h1=Math.imul(h1,16777619);h2^=s.charCodeAt(i);h2=Math.imul(h2,3266489917);}return ('00000000'+(h1>>>0).toString(16)).slice(-8)+('00000000'+(h2>>>0).toString(16)).slice(-8);}
  function auditHash(entry,prevHash){var copy=clone(entry||{});delete copy.hash;return hashString(text(prevHash)+'|'+stable(copy));}
  function verifyAuditChain(entries){
    var list=(Array.isArray(entries)?entries:[]).slice().sort(function(a,b){return num(a.sequence)-num(b.sequence);}); var prev='',errors=[];
    list.forEach(function(e,index){var expected=auditHash(e,prev);if(num(e.sequence)!==index+1&&index===0&&num(e.sequence)!==1)errors.push('Startsequenz ist nicht 1.');if(index&&num(e.sequence)!==num(list[index-1].sequence)+1)errors.push('Sequenzlücke vor '+e.sequence+'.');if(text(e.prevHash)!==prev)errors.push('prevHash stimmt bei '+e.sequence+' nicht.');if(text(e.hash)!==expected)errors.push('Hash stimmt bei '+e.sequence+' nicht.');prev=text(e.hash);});
    return {ok:errors.length===0,count:list.length,lastHash:prev,errors:errors};
  }
  function appendLocalAudit(entries,event){
    var list=(Array.isArray(entries)?entries:[]).slice();var prev=list.length?text(list[list.length-1].hash):'';var entry=clone(event||{});entry.sequence=list.length+1;entry.prevHash=prev;entry.hash=auditHash(entry,prev);list.push(entry);return {entries:list,entry:entry,verification:verifyAuditChain(list)};
  }
  function privacyInventory(profile){
    profile=profile||{}; var summary=profile.activitySummary||{};
    return {identity:['userId','firebaseUid','displayName','email','groupId'].filter(function(k){return !!profile[k];}),learning:{sessions:num(summary.totalSessions),answers:num(summary.taskAnswers),recent:Array.isArray(profile.activityRecent)?profile.activityRecent.length:0,attempts:Array.isArray(profile.attempts)?profile.attempts.length:0},administration:{warning:!!profile.pendingWarning,blocked:!!profile.blocked,notes:!!(profile.adminNote||profile.note)},source:dataClass(profile),schema:profile.dataSchemaVersion||'legacy'};
  }
  function sanitizePrivacyExport(profile){
    var out=clone(profile||{});['passwordHash','passwordSalt','firstPassword','temporaryPassword','accessToken','refreshToken'].forEach(function(k){delete out[k];});return out;
  }
  function bulkPlan(ids,action,options){
    var unique=[];var seen={};(ids||[]).forEach(function(id){id=normalizeCode(id);if(id&&!seen[id]){seen[id]=true;unique.push(id);}});if(unique.length>100)unique=unique.slice(0,100);
    return {action:text(action),ids:unique,options:clone(options||{}),count:unique.length,createdAt:new Date().toISOString()};
  }
  return {version:VERSION,normalizeCode:normalizeCode,profileId:profileId,dataClass:dataClass,activityClass:activityClass,normalizedRole:normalizedRole,groupId:groupId,levelId:levelId,riskId:riskId,matches:matches,filterLearners:filterLearners,filterOptions:filterOptions,syncHealth:syncHealth,stable:stable,hashString:hashString,auditHash:auditHash,verifyAuditChain:verifyAuditChain,appendLocalAudit:appendLocalAudit,privacyInventory:privacyInventory,sanitizePrivacyExport:sanitizePrivacyExport,bulkPlan:bulkPlan};
});
