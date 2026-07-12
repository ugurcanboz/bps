(function(){
  'use strict';
  var VERSION='G54.47.12E';
  var CATEGORY_RULES={
    learning:function(k){return /^language[_-]|^languageCourse|^egt_activity_|^egt\.languageAI\.|^egt_userdatabase_coach_context/.test(k);},
    ai:function(k){return /^egt\.languageAI\.|^egt_userdatabase_coach_context/.test(k);},
    app:function(k){return /^egt_|^assessments_|^language[_-]|^languageCourse/.test(k);}
  };
  var PRESERVE_KEYS=['egt_auth_profile_session_v1','egt_auth_demo_state_v1','egt_auth_demo_reservation_v1'];
  function keys(){var out=[];try{for(var i=0;i<localStorage.length;i++)out.push(localStorage.key(i));}catch(e){}return out.filter(Boolean).sort();}
  function estimate(){var list=keys(),bytes=0;list.forEach(function(k){try{bytes+=String(k).length+String(localStorage.getItem(k)||'').length;}catch(e){}});return {keys:list.length,bytes:bytes};}
  function snapshot(){var data={schema:'egt-privacy-export-v1',version:VERSION,exportedAt:new Date().toISOString(),origin:location.origin,localStorage:{},sessionStorage:{}};keys().forEach(function(k){try{data.localStorage[k]=localStorage.getItem(k);}catch(e){}});try{for(var i=0;i<sessionStorage.length;i++){var k=sessionStorage.key(i);data.sessionStorage[k]=sessionStorage.getItem(k);}}catch(e){}return data;}
  function download(){var data=snapshot(),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='assessments-trainer-datenexport-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);return {ok:true,keys:Object.keys(data.localStorage).length};}
  function removeMatching(rule,preserve){var removed=[];keys().forEach(function(k){if(preserve&&PRESERVE_KEYS.indexOf(k)>=0)return;if(rule(k)){try{localStorage.removeItem(k);removed.push(k);}catch(e){}}});return removed;}
  function clearLearning(){return removeMatching(CATEGORY_RULES.learning,true);}
  function clearAI(){return removeMatching(CATEGORY_RULES.ai,true);}
  function clearAllLocal(){return removeMatching(CATEGORY_RULES.app,true);}
  function clearCaches(){if(!('caches' in window))return Promise.resolve({ok:false,count:0});return caches.keys().then(function(names){return Promise.all(names.map(function(n){return caches.delete(n);})).then(function(r){return {ok:true,count:r.filter(Boolean).length};});});}
  function clearIndexedDb(){if(!indexedDB||!indexedDB.databases)return Promise.resolve({ok:false,count:0});return indexedDB.databases().then(function(dbs){var names=dbs.map(function(d){return d.name;}).filter(Boolean);return Promise.all(names.map(function(n){return new Promise(function(resolve){var req=indexedDB.deleteDatabase(n);req.onsuccess=function(){resolve(true);};req.onerror=req.onblocked=function(){resolve(false);};});})).then(function(r){return {ok:true,count:r.filter(Boolean).length};});});}
  function accountRequest(){var c=window.EGTOperatorConfig||{},to=c.supportEmail||c.businessEmail;if(!to)return false;var subject=encodeURIComponent('Antrag auf Kontolöschung');var body=encodeURIComponent('Hallo,\n\nich möchte die Löschung meines Benutzerkontos und der zugehörigen personenbezogenen Daten beantragen.\n\nBitte teilen Sie mir mit, welche Angaben Sie zur Identifikation benötigen.\n');location.href='mailto:'+encodeURIComponent(to)+'?subject='+subject+'&body='+body;return true;}
  window.EGTPrivacyDataCenter=Object.freeze({version:VERSION,estimate:estimate,snapshot:snapshot,download:download,clearLearning:clearLearning,clearAI:clearAI,clearAllLocal:clearAllLocal,clearCaches:clearCaches,clearIndexedDb:clearIndexedDb,accountRequest:accountRequest,preserveKeys:PRESERVE_KEYS.slice()});
})();
