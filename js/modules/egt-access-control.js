/* Novura · zentrale Rollen- und Zugriffskontrolle · G54.47.15C */
(function(){
  'use strict';
  var VERSION='G54.47.15C-access-v1';
  var ROLE_ORDER={guest:0,demo:1,participant:2,teacher:3,admin:4};
  var MATRIX=Object.freeze({
    training:['guest','demo','participant','teacher','admin'],
    simulation:['demo','participant','teacher','admin'],
    profile:['participant','teacher','admin'],
    teacherArea:['teacher','admin'],
    adminArea:['admin'],
    participantManagement:['teacher','admin'],
    roleManagement:['admin'],
    courseReset:['admin'],
    privacyExport:['admin']
  });
  function normalizeRole(value){
    value=String(value||'guest').toLowerCase();
    if(value==='dozent') return 'teacher';
    if(value==='teilnehmer'||value==='learner') return 'participant';
    if(value==='administrator') return 'admin';
    return Object.prototype.hasOwnProperty.call(ROLE_ORDER,value)?value:'guest';
  }
  function snapshot(){
    var sec=window.EGTSecurityContext;
    if(!sec||typeof sec.snapshot!=='function') return {role:'guest',trusted:false,user:null};
    var snap=sec.snapshot()||{};
    return {role:normalizeRole(snap.trustedRole),trusted:snap.claimsTrusted===true,user:snap.user||null,claims:snap.claims||{}};
  }
  function isDevelopmentBypass(){
    try{return !!(window.EGTSecurityContext&&EGTSecurityContext.qaBypassAllowed&&EGTSecurityContext.qaBypassAllowed());}catch(e){return false;}
  }
  function can(capability){
    var allowed=MATRIX[capability]||[];
    var s=snapshot();
    if(!s.trusted||!s.user||s.user.isAnonymous) return false;
    return allowed.indexOf(s.role)!==-1;
  }
  async function requireCapability(capability,options){
    options=options||{};
    try{
      var sec=window.EGTSecurityContext;
      if(!sec) throw new Error('Sicherheitskontext fehlt.');
      await sec.initialize();
      await sec.refreshClaims(options.forceRefresh!==false);
      var s=snapshot();
      if(can(capability)) return {ok:true,role:s.role,user:s.user,claims:s.claims};
      if(options.allowDevelopmentBypass===true&&isDevelopmentBypass()) return {ok:true,role:'admin',developmentBypass:true};
      var err=new Error('Keine Berechtigung für '+capability+'.'); err.code='permission-denied'; throw err;
    }catch(err){
      try{window.dispatchEvent(new CustomEvent('egt:security:denied',{detail:{capability:capability,code:err.code||'permission-denied'}}));}catch(e){}
      if(options.silent===true) return {ok:false,error:err};
      throw err;
    }
  }
  function roleAtLeast(required){var s=snapshot();return s.trusted&&ROLE_ORDER[s.role]>=ROLE_ORDER[normalizeRole(required)];}
  window.EGTAccessControl=Object.freeze({__version:VERSION,matrix:MATRIX,normalizeRole:normalizeRole,snapshot:snapshot,can:can,require:requireCapability,roleAtLeast:roleAtLeast});
})();
