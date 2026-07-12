/* Novura · datensparsames App-Monitoring · G54.50.2F */
(function(){
  'use strict';
  var VERSION='G54.50.2F-monitoring-v1';
  var STORAGE_KEY='egt_app_monitoring_queue_v1';
  var STATE_KEY='egt_app_monitoring_state_v1';
  var MAX_QUEUE=80, MAX_BATCH=20;
  var runtime=window.EGT_RUNTIME_ENV||{};
  var profile=runtime.profile||{};
  var enabled=runtime.name==='beta'||runtime.name==='production';
  var sessionId='s_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
  var activeExam=null;

  function safeText(v,max){return String(v==null?'':v).replace(/[\r\n\t]+/g,' ').replace(/https?:\/\/\S+/g,'[url]').slice(0,max||80);}
  function safePath(v){try{var u=new URL(String(v||''),location.href);return u.origin===location.origin?u.pathname.slice(0,120):u.hostname.slice(0,80);}catch(e){return 'unknown';}}
  function readQueue(){try{var x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(x)?x.slice(-MAX_QUEUE):[];}catch(e){return [];}}
  function writeQueue(q){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(q.slice(-MAX_QUEUE)));}catch(e){}}
  function event(type,detail){
    var d=detail||{};
    var item={
      type:safeText(type,40), area:safeText(d.area||'app',40), code:safeText(d.code||'',70), severity:safeText(d.severity||'warning',12),
      durationMs:Math.max(0,Math.min(300000,Number(d.durationMs)||0)), route:safePath(d.route||location.href), online:navigator.onLine!==false,
      channel:safeText(runtime.channel||'DEV',12), appVersion:safeText(window.AppConfig?.version||window.APP_VERSION||'',40), ts:new Date().toISOString()
    };
    var q=readQueue(); q.push(item); writeQueue(q);
    try{window.dispatchEvent(new CustomEvent('egt:monitoring-event',{detail:item}));}catch(e){}
    if(enabled && navigator.onLine!==false && q.length>=5) flush();
    return item;
  }
  async function flush(){
    if(!enabled||navigator.onLine===false||!profile.workerBaseUrl) return {sent:false,reason:'disabled_or_offline'};
    var q=readQueue(); if(!q.length) return {sent:true,count:0};
    var batch=q.slice(0,MAX_BATCH);
    try{
      var response=await fetch(String(profile.workerBaseUrl).replace(/\/$/,'')+'/api/client-events',{method:'POST',headers:{'Content-Type':'application/json','X-App-Monitoring-Version':VERSION},body:JSON.stringify({version:VERSION,sessionId:sessionId,events:batch}),keepalive:true});
      if(!response.ok) return {sent:false,status:response.status};
      writeQueue(q.slice(batch.length)); return {sent:true,count:batch.length};
    }catch(e){return {sent:false,error:'network'};}
  }
  function exportDiagnostics(){return {version:VERSION,generatedAt:new Date().toISOString(),appVersion:window.AppConfig?.version||'',environment:runtime.name||'unknown',online:navigator.onLine!==false,queuedEvents:readQueue(),state:(function(){try{return JSON.parse(sessionStorage.getItem(STATE_KEY)||'{}');}catch(e){return {};}})()};}
  function markExamStart(meta){activeExam={id:safeText(meta?.id||'exam',60),startedAt:Date.now(),area:safeText(meta?.area||'exam',40)};try{sessionStorage.setItem(STATE_KEY,JSON.stringify({activeExam:activeExam}));}catch(e){} event('exam_start',{area:activeExam.area,severity:'info'});}
  function markExamComplete(meta){if(activeExam) event('exam_complete',{area:activeExam.area,severity:'info',durationMs:Date.now()-activeExam.startedAt});activeExam=null;try{sessionStorage.removeItem(STATE_KEY);}catch(e){}}
  function markExamAbort(reason){if(activeExam) event('exam_abort',{area:activeExam.area,code:reason||'user_abort',severity:'error',durationMs:Date.now()-activeExam.startedAt});activeExam=null;try{sessionStorage.removeItem(STATE_KEY);}catch(e){}}

  window.addEventListener('error',function(e){
    var target=e.target;
    if(target&&target!==window){var tag=String(target.tagName||'').toLowerCase();var src=target.currentSrc||target.src||target.href||'';event(tag==='audio'?'audio_error':'resource_error',{area:tag||'resource',code:safePath(src),severity:'error',route:src});return;}
    event('javascript_error',{area:'runtime',code:safeText(e.error?.name||e.message||'Error',70),severity:'error'});
  },true);
  window.addEventListener('unhandledrejection',function(e){event('promise_rejection',{area:'runtime',code:safeText(e.reason?.name||e.reason?.message||'UnhandledPromise',70),severity:'error'});});
  window.addEventListener('offline',function(){event('offline',{area:'network',severity:'warning'});});
  window.addEventListener('online',function(){event('online',{area:'network',severity:'info'});flush();});
  window.addEventListener('pagehide',function(){if(activeExam) markExamAbort('pagehide');if(enabled&&navigator.sendBeacon&&readQueue().length){flush();}});
  document.addEventListener('play',function(e){if(e.target&&e.target.tagName==='AUDIO') e.target.__egtPlayStarted=Date.now();},true);
  document.addEventListener('error',function(e){if(e.target&&e.target.tagName==='AUDIO') event('audio_error',{area:'audio',code:safeText(e.target.error?.code||'media_error',30),severity:'error',route:e.target.currentSrc});},true);

  var nativeFetch=window.fetch;
  if(nativeFetch){window.fetch=async function(input,init){var started=Date.now(), url=typeof input==='string'?input:input?.url;try{var r=await nativeFetch.apply(this,arguments);if(!r.ok&&r.status>=400) event('api_error',{area:'network',code:'HTTP_'+r.status,severity:r.status>=500?'error':'warning',durationMs:Date.now()-started,route:url});return r;}catch(err){event('api_failure',{area:'network',code:safeText(err?.name||'fetch_failed',50),severity:'error',durationMs:Date.now()-started,route:url});throw err;}};}

  window.EGTAppMonitoring=Object.freeze({version:VERSION,event:event,flush:flush,exportDiagnostics:exportDiagnostics,clear:function(){writeQueue([]);},markExamStart:markExamStart,markExamComplete:markExamComplete,markExamAbort:markExamAbort,isEnabled:function(){return enabled;}});
  setTimeout(flush,2500); setInterval(flush,60000);
})();
