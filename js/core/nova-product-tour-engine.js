/* Novura · Product Tour Domain Engine · G54.50.1 */
(function(root){'use strict';
var VERSION='G54.50.1-2026-07-12';
var STORAGE='novura.novaProductTour.v1';
var STATES=Object.freeze({IDLE:'IDLE',OFFER:'OFFER',RUNNING:'RUNNING',LATER:'LATER',SKIPPED:'SKIPPED',COMPLETED:'COMPLETED'});
var STATIONS=Object.freeze([
 {id:'dashboard',title:'Dein Startpunkt',text:'Hier findest du deine wichtigsten Bereiche und kannst direkt dort weitermachen, wo du aufgehört hast.',selector:'#start'},
 {id:'training',title:'Gezielt trainieren',text:'Im Training übst du einzelne Fähigkeiten mit Hilfe und Coach-Unterstützung.',selector:'[data-ui-action="training-center"], [data-ui-action="branch-training"]'},
 {id:'simulation',title:'Realistisch simulieren',text:'Simulationen bilden Prüfungsbedingungen ab – ohne Hilfe und mit klarer Auswertung.',selector:'[data-ui-action="simulation-center"]'},
 {id:'language',title:'Sprachen verbessern',text:'Im Sprachtraining übst du Lesen, Hören, Schreiben und Sprechen passend zu deinem Niveau.',selector:'[data-ui-action="language-course-open"]'},
 {id:'profile',title:'Dein Profil',text:'Im Profil findest du Zugang, Fortschritt und persönliche Einstellungen.',selector:'#uiLoginBtn, [data-ui-action="profile-open"]'}
]);
function safeParse(v){try{return JSON.parse(v)}catch(e){return null}}
function load(){var d=null;try{d=safeParse(localStorage.getItem(STORAGE))}catch(e){};return Object.assign({version:1,state:STATES.IDLE,index:0,seen:false,skipped:false,completed:false,updatedAt:null},d||{})}
function save(p){var d=Object.assign(load(),p||{},{updatedAt:new Date().toISOString()});try{localStorage.setItem(STORAGE,JSON.stringify(d))}catch(e){}return d}
function create(seed){var ctx=Object.assign(load(),seed||{});
 function snap(){return JSON.parse(JSON.stringify(ctx))}
 function persist(p){ctx=Object.assign(ctx,p||{});save(ctx);return snap()}
 return Object.freeze({version:VERSION,states:STATES,stations:STATIONS,snapshot:snap,offer:function(){return persist({state:STATES.OFFER})},start:function(){return persist({state:STATES.RUNNING,index:0,seen:true})},next:function(){var i=Math.min(STATIONS.length-1,Number(ctx.index||0)+1);return i===STATIONS.length-1&&Number(ctx.index||0)===STATIONS.length-1?this.complete():persist({state:STATES.RUNNING,index:i})},back:function(){return persist({state:STATES.RUNNING,index:Math.max(0,Number(ctx.index||0)-1)})},later:function(){return persist({state:STATES.LATER})},skip:function(){return persist({state:STATES.SKIPPED,seen:true,skipped:true})},complete:function(){return persist({state:STATES.COMPLETED,seen:true,completed:true,index:STATIONS.length-1})},reset:function(){ctx={version:1,state:STATES.IDLE,index:0,seen:false,skipped:false,completed:false,updatedAt:null};try{localStorage.removeItem(STORAGE)}catch(e){}return snap()}})}
root.NovuraProductTourEngine=Object.freeze({version:VERSION,states:STATES,stations:STATIONS,storageKey:STORAGE,load:load,create:create});
})(typeof window!=='undefined'?window:globalThis);
