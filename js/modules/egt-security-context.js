/* Eignungstest-Trainer · G54.46.2 Security Context
   Vertrauensgrenze für Firebase Auth, Custom Claims, App Check und Callable Functions.
   Rollen aus localStorage, Session-Objekten, E-Mail-Adressen oder URL-Parametern sind
   niemals autoritativ. Privilegierte Rollen stammen ausschließlich aus signierten ID-Token-Claims. */
(function(){
  'use strict';

  var VERSION='G54.46.2-SECURITY-CONTEXT';
  var state={
    ready:false, initializing:false, app:null, auth:null, db:null, functions:null,
    appCheck:null, appCheckReady:false, user:null, claims:{}, trustedRole:'guest',
    claimsTrusted:false, lastClaimsAt:'', error:'', modules:null
  };
  var initPromise=null;

  function cfg(){ return window.EGT_SYNC_CONFIG || {}; }
  function appCfg(){ return window.AppConfig || {}; }
  function securityCfg(){ return appCfg().security || {}; }
  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';} }
  function emit(){
    try{ window.dispatchEvent(new CustomEvent('egt:security-context-changed',{detail:snapshot()})); }catch(e){}
  }
  function isDevelopment(){ return appCfg().environment==='development' || appCfg().isDevelopment===true; }
  function qaBypassAllowed(){ return isDevelopment() && securityCfg().allowQaBypass===true; }
  function localRolePinsAllowed(){ return isDevelopment() && securityCfg().allowLocalRolePins===true; }
  function legacyCodeLoginAllowed(){ return isDevelopment() && securityCfg().allowLegacyCodeLogin===true; }
  function sdkBase(){ return 'https://www.gstatic.com/firebasejs/'+(cfg().sdkVersion||'12.14.0')+'/'; }
  function fbCfg(){ var c=cfg(); return c.firebaseConfig||c.syncConfig||null; }
  function fbReady(){ var c=fbCfg(); return !!(c&&c.apiKey&&c.authDomain&&c.projectId&&c.appId); }
  function normalizeRole(claims){
    claims=claims||{};
    if(claims.admin===true || String(claims.role||'').toLowerCase()==='admin') return 'admin';
    var role=String(claims.role||'').toLowerCase();
    if(claims.teacher===true || role==='teacher' || role==='dozent') return 'teacher';
    if(role==='participant' || role==='learner') return 'participant';
    if(role==='demo') return 'demo';
    return 'guest';
  }
  function trustedPrivilegedRole(){ return state.claimsTrusted && (state.trustedRole==='admin'||state.trustedRole==='teacher') ? state.trustedRole : 'guest'; }
  function assignedGroups(){
    var c=state.claims||{};
    var raw=c.assignedGroups||c.groupIds||c.groups||[];
    if(!Array.isArray(raw)) raw=raw?[raw]:[];
    return raw.map(function(x){return String(x||'').trim();}).filter(Boolean).slice(0,20);
  }
  function courseIds(){
    var c=state.claims||{};
    var raw=c.courseIds||c.courses||[];
    if(!Array.isArray(raw)) raw=raw?[raw]:[];
    return raw.map(function(x){return String(x||'').trim();}).filter(Boolean).slice(0,20);
  }
  function hasCourse(courseId){
    if(state.trustedRole==='admin') return true;
    return courseIds().indexOf(String(courseId||''))>=0;
  }
  function appCheckSiteKeyReady(){
    var key=String(cfg().appCheckSiteKey||'');
    return !!key && key.indexOf('REPLACE_WITH_')!==0;
  }
  async function initializeAppCheck(app, appCheckMod){
    if(!cfg().requireAppCheck){ state.appCheckReady=true; return null; }
    if(!appCheckSiteKeyReady()){
      state.appCheckReady=false;
      state.error='Firebase App Check ist für Produktion erforderlich. appCheckSiteKey ist noch nicht konfiguriert.';
      return null;
    }
    try{
      var provider=new appCheckMod.ReCaptchaEnterpriseProvider(cfg().appCheckSiteKey);
      var ac=appCheckMod.initializeAppCheck(app,{provider:provider,isTokenAutoRefreshEnabled:true});
      state.appCheckReady=true;
      return ac;
    }catch(e){
      try{
        var providerV3=new appCheckMod.ReCaptchaV3Provider(cfg().appCheckSiteKey);
        var acV3=appCheckMod.initializeAppCheck(app,{provider:providerV3,isTokenAutoRefreshEnabled:true});
        state.appCheckReady=true;
        return acV3;
      }catch(e2){
        state.appCheckReady=false;
        state.error=e2.message||String(e2);
        return null;
      }
    }
  }
  async function initialize(){
    if(state.ready && state.modules) return state;
    if(initPromise) return initPromise;
    initPromise=(async function(){
      if(!fbReady()) throw new Error('Firebase-Konfiguration fehlt.');
      state.initializing=true; state.error='';
      var base=sdkBase();
      var mods=await Promise.all([
        import(base+'firebase-app.js'),
        import(base+'firebase-auth.js'),
        import(base+'firebase-firestore.js'),
        import(base+'firebase-functions.js'),
        import(base+'firebase-app-check.js')
      ]);
      var appMod=mods[0], authMod=mods[1], fsMod=mods[2], fnMod=mods[3], appCheckMod=mods[4];
      var appName=cfg().firebaseAppName||'egt-main';
      var app;
      try{ app=appMod.getApp(appName); }catch(e){ app=appMod.initializeApp(fbCfg(),appName); }
      var auth=authMod.getAuth(app);
      var db=fsMod.getFirestore(app);
      var functions=fnMod.getFunctions(app,cfg().functionsRegion||'europe-west1');
      var appCheck=null;
      try{ appCheck=await initializeAppCheck(app,appCheckMod); }catch(appCheckError){
        state.error=appCheckError.message||String(appCheckError);
      }
      state.app=app; state.auth=auth; state.db=db; state.functions=functions; state.appCheck=appCheck;
      state.modules={appMod:appMod,authMod:authMod,fsMod:fsMod,fnMod:fnMod,appCheckMod:appCheckMod};
      authMod.onAuthStateChanged(auth,function(user){
        state.user=user||null;
        if(!user){ state.claims={}; state.trustedRole='guest'; state.claimsTrusted=false; state.lastClaimsAt=nowIso(); emit(); return; }
        readClaims(false).catch(function(e){ state.error=e.message||String(e); emit(); });
      });
      state.user=auth.currentUser||null;
      if(state.user) await readClaims(false);
      state.ready=true; state.initializing=false; emit();
      return state;
    })().catch(function(e){ state.error=e.message||String(e); state.ready=false; state.initializing=false; emit(); throw e; }).finally(function(){ initPromise=null; });
    return initPromise;
  }
  async function readClaims(force){
    var user=state.auth&&state.auth.currentUser;
    state.user=user||null;
    if(!user){ state.claims={}; state.trustedRole='guest'; state.claimsTrusted=false; state.lastClaimsAt=nowIso(); emit(); return {}; }
    var result=await state.modules.authMod.getIdTokenResult(user,force===true);
    state.claims=result&&result.claims||{};
    state.trustedRole=normalizeRole(state.claims);
    state.claimsTrusted=!user.isAnonymous;
    state.lastClaimsAt=nowIso(); state.error=''; emit();
    return state.claims;
  }
  async function refreshClaims(force){
    if(!state.modules || !state.auth) await initialize();
    return readClaims(force);
  }
  async function signInAnonymouslyIfNeeded(){
    await initialize();
    if(state.auth.currentUser) return state.auth.currentUser;
    var cred=await state.modules.authMod.signInAnonymously(state.auth);
    state.user=cred&&cred.user||state.auth.currentUser||null;
    await refreshClaims(false);
    return state.user;
  }
  function assertAuthenticated(){
    if(!state.user || state.user.isAnonymous) throw new Error('Für diese Aktion ist eine bestätigte Firebase-Anmeldung erforderlich.');
  }
  function assertTrustedRole(roles){
    assertAuthenticated();
    roles=Array.isArray(roles)?roles:[roles];
    if(!state.claimsTrusted || roles.indexOf(state.trustedRole)<0) throw new Error('Diese Aktion ist durch serverseitige Rollenrechte gesperrt.');
  }
  async function call(functionName,payload,options){
    options=options||{};
    await initialize();
    assertAuthenticated();
    if(options.roles) assertTrustedRole(options.roles);
    if(cfg().requireAppCheck && !state.appCheckReady && !isDevelopment()) throw new Error('App Check ist nicht bereit. Privilegierte Cloudaktion wurde sicher blockiert.');
    var callable=state.modules.fnMod.httpsCallable(state.functions,functionName);
    var result=await callable(payload||{});
    return result&&result.data!==undefined?result.data:result;
  }
  async function updateOwnPassword(newPassword){
    await initialize();
    assertAuthenticated();
    if(String(newPassword||'').length<8) throw new Error('Das neue Passwort braucht mindestens 8 Zeichen.');
    await state.modules.authMod.updatePassword(state.auth.currentUser,String(newPassword));
    return true;
  }
  async function signOut(){
    await initialize();
    await state.modules.authMod.signOut(state.auth);
    state.user=null; state.claims={}; state.trustedRole='guest'; state.claimsTrusted=false; emit();
    return true;
  }
  function snapshot(){
    return {
      version:VERSION, ready:state.ready, initializing:state.initializing,
      environment:appCfg().environment||'production', user:state.user?{uid:state.user.uid,isAnonymous:!!state.user.isAnonymous,email:state.user.email||'',emailVerified:!!state.user.emailVerified}:null,
      trustedRole:state.trustedRole, privilegedRole:trustedPrivilegedRole(), claimsTrusted:state.claimsTrusted,
      assignedGroups:assignedGroups(), courseIds:courseIds(), appCheckReady:state.appCheckReady,
      qaBypassAllowed:qaBypassAllowed(), localRolePinsAllowed:localRolePinsAllowed(), legacyCodeLoginAllowed:legacyCodeLoginAllowed(),
      lastClaimsAt:state.lastClaimsAt, error:state.error||''
    };
  }

  window.EGTSecurityContext=Object.freeze({
    version:VERSION, initialize:initialize, refreshClaims:refreshClaims,
    signInAnonymouslyIfNeeded:signInAnonymouslyIfNeeded, call:call, updateOwnPassword:updateOwnPassword, signOut:signOut,
    assertAuthenticated:assertAuthenticated, assertTrustedRole:assertTrustedRole,
    snapshot:snapshot, hasCourse:hasCourse, assignedGroups:assignedGroups, courseIds:courseIds,
    qaBypassAllowed:qaBypassAllowed, localRolePinsAllowed:localRolePinsAllowed,
    legacyCodeLoginAllowed:legacyCodeLoginAllowed,
    get auth(){return state.auth;}, get db(){return state.db;}, get app(){return state.app;},
    get functions(){return state.functions;}, get modules(){return state.modules;},
    get user(){return state.user;}, get claims(){return Object.assign({},state.claims);},
    get trustedRole(){return state.trustedRole;}, get claimsTrusted(){return state.claimsTrusted;},
    get appCheckReady(){return state.appCheckReady;}
  });
})();
