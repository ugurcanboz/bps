/* Novura · Guided Welcome Domain Engine · G54.50.1 */
(function(root){'use strict';
var VERSION='G54.50.1-2026-07-12';
var STATES=Object.freeze({INIT:'INIT',FIRST_VISIT:'FIRST_VISIT',INTRO_CHOICE:'INTRO_CHOICE',NOVURA:'NOVURA',NOVA:'NOVA',MISSION:'MISSION',PERMISSIONS:'PERMISSIONS',COMPANION_STYLE:'COMPANION_STYLE',AUTH_CHOICE:'AUTH_CHOICE',AUTH_FLOW:'AUTH_FLOW',APP_UNLOCKED:'APP_UNLOCKED'});
var EVENTS=Object.freeze({BOOT:'BOOT',FIRST_VISIT_ANSWER:'FIRST_VISIT_ANSWER',INTRO_START:'INTRO_START',INTRO_SKIP:'INTRO_SKIP',NEXT:'NEXT',PERMISSIONS_DONE:'PERMISSIONS_DONE',COMPANION_SELECTED:'COMPANION_SELECTED',AUTH_SELECTED:'AUTH_SELECTED',AUTH_SUCCESS:'AUTH_SUCCESS',AUTH_CANCELLED:'AUTH_CANCELLED',RESET:'RESET'});
var AUTH_ACTIONS=Object.freeze({LOGIN:'login',REGISTER:'register',DEMO:'demo'});
var COMPANION_STYLES=Object.freeze({QUIET:'quiet',BALANCED:'balanced',ACTIVE:'active'});
var transitions={};
transitions[STATES.INIT]={BOOT:STATES.FIRST_VISIT};
transitions[STATES.FIRST_VISIT]={FIRST_VISIT_ANSWER:STATES.INTRO_CHOICE,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.INTRO_CHOICE]={INTRO_START:STATES.NOVURA,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.NOVURA]={NEXT:STATES.NOVA,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.NOVA]={NEXT:STATES.MISSION,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.MISSION]={NEXT:STATES.PERMISSIONS,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.PERMISSIONS]={PERMISSIONS_DONE:STATES.COMPANION_STYLE,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.COMPANION_STYLE]={COMPANION_SELECTED:STATES.AUTH_CHOICE,INTRO_SKIP:STATES.AUTH_CHOICE};
transitions[STATES.AUTH_CHOICE]={AUTH_SELECTED:STATES.AUTH_FLOW};
transitions[STATES.AUTH_FLOW]={AUTH_SUCCESS:STATES.APP_UNLOCKED,AUTH_CANCELLED:STATES.AUTH_CHOICE};
transitions[STATES.APP_UNLOCKED]={RESET:STATES.INIT};
function copy(v){return JSON.parse(JSON.stringify(v));} function now(){return new Date().toISOString();}
function create(seed){var ctx=Object.assign({state:STATES.INIT,firstVisit:null,introStarted:false,authAction:'',companionStyle:'balanced',sessionOnly:true,permissions:{location:'unknown',microphone:'unknown',notifications:'unknown'},history:[],createdAt:now(),updatedAt:now()},seed||{});
function snapshot(){return copy(ctx)} function can(e){return !!(transitions[ctx.state]&&transitions[ctx.state][e])}
function dispatch(e,p){p=p||{};if(!can(e))return{ok:false,reason:'invalid-transition',context:snapshot()};var from=ctx.state,to=transitions[from][e];
if(e===EVENTS.FIRST_VISIT_ANSWER)ctx.firstVisit=!!p.firstVisit;
if(e===EVENTS.INTRO_START)ctx.introStarted=true;
if(e===EVENTS.COMPANION_SELECTED){if(!['quiet','balanced','active'].includes(p.companionStyle))return{ok:false,reason:'invalid-companion-style',context:snapshot()};ctx.companionStyle=p.companionStyle;}
if(e===EVENTS.AUTH_SELECTED){if(!['login','register','demo'].includes(p.authAction))return{ok:false,reason:'invalid-auth-action',context:snapshot()};ctx.authAction=p.authAction;}
if(e===EVENTS.AUTH_CANCELLED)ctx.authAction='';
if(e===EVENTS.RESET)ctx=create().snapshot();else{ctx.state=to;ctx.updatedAt=now();ctx.history.push({from:from,event:e,to:to,at:ctx.updatedAt});}
return{ok:true,context:snapshot()}}
function setPermission(name,status){if(Object.prototype.hasOwnProperty.call(ctx.permissions,name))ctx.permissions[name]=String(status||'unknown');ctx.updatedAt=now();return snapshot()}
return{version:VERSION,states:STATES,events:EVENTS,authActions:AUTH_ACTIONS,companionStyles:COMPANION_STYLES,snapshot:snapshot,can:can,dispatch:dispatch,setPermission:setPermission,clearSensitiveContext:function(){ctx.authAction='';return snapshot()}}}
root.NovuraGuidedWelcomeEngine=Object.freeze({version:VERSION,states:STATES,events:EVENTS,authActions:AUTH_ACTIONS,companionStyles:COMPANION_STYLES,transitions:copy(transitions),create:create});
})(typeof window!=='undefined'?window:globalThis);
