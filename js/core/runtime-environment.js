/* Novura · Laufzeit- und Release-Kanäle · G54.50.2E */
(function(){
  'use strict';
  var host='', protocol='';
  try { host=String(location.hostname||'').toLowerCase(); protocol=String(location.protocol||''); } catch(e){}
  var allowed=['development','beta','production'];
  var explicit='';
  try { explicit=String(localStorage.getItem('egt_environment_override')||'').toLowerCase(); } catch(e){}
  var detected=(protocol==='file:'||host==='localhost'||host==='127.0.0.1'||host==='::1')?'development':
    (/(^|[.-])(beta|staging|preview)([.-]|$)/.test(host)?'beta':'production');
  // Overrides are only allowed locally. A public host can never be downgraded by localStorage.
  var canOverride=detected==='development';
  var environment=(canOverride&&allowed.indexOf(explicit)>=0)?explicit:detected;
  var profiles={
    development:{channel:'DEV',workerBaseUrl:'http://127.0.0.1:8787',firebaseProjectId:'bbq-userdatabase-dev',appCheckRequired:false,debug:true,cloudWrites:false},
    beta:{channel:'BETA',workerBaseUrl:'https://assessments-beta.ugurcan-boz.workers.dev',firebaseProjectId:'bbq-userdatabase-beta',appCheckRequired:true,debug:false,cloudWrites:true},
    production:{channel:'PRODUCTION',workerBaseUrl:'https://assessments.ugurcan-boz.workers.dev',firebaseProjectId:'bbq-userdatabase',appCheckRequired:true,debug:false,cloudWrites:true}
  };
  window.EGT_RUNTIME_ENV=Object.freeze({
    name:environment,
    channel:profiles[environment].channel,
    detected:detected,
    profile:Object.freeze(profiles[environment]),
    profiles:Object.freeze(profiles),
    overrideActive:canOverride&&!!explicit,
    overrideAllowed:canOverride
  });
})();
