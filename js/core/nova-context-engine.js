/* Novura · Adaptive Nova Context & Memory Lite · G54.50.1 */
(function(root){'use strict';
var VERSION='G54.50.1-2026-07-12';
var KEY='novura.novaMemory.v2';
var SCHEMA=2;
var MAX_RECENT=6;
var DEFAULTS={schema:SCHEMA,lastGreeting:'',lastMotivation:'',recentMessageIds:[],companionStyle:'balanced',introductionSeen:false,permissions:{location:'unknown',microphone:'unknown',notifications:'unknown'},weather:null,updatedAt:''};
function clone(v){return JSON.parse(JSON.stringify(v));}
function storage(){try{return root.localStorage||null}catch(e){return null}}
function safeParse(raw){try{return raw?JSON.parse(raw):null}catch(e){return null}}
function normalize(v){var x=Object.assign({},DEFAULTS,v||{});x.schema=SCHEMA;x.permissions=Object.assign({},DEFAULTS.permissions,x.permissions||{});x.recentMessageIds=Array.isArray(x.recentMessageIds)?x.recentMessageIds.slice(-MAX_RECENT):[];if(!['quiet','balanced','active'].includes(x.companionStyle))x.companionStyle='balanced';return x}
function load(){var s=storage(),v=s?safeParse(s.getItem(KEY)):null;return normalize(v)}
function save(v){var x=normalize(v);x.updatedAt=new Date().toISOString();var s=storage();if(s)try{s.setItem(KEY,JSON.stringify(x))}catch(e){}return clone(x)}
function reset(){var s=storage();if(s)try{s.removeItem(KEY)}catch(e){}return clone(DEFAULTS)}
function timeContext(d){d=d||new Date();var h=d.getHours(),m=d.getMonth()+1;return{hour:h,weekday:d.getDay(),timeOfDay:h<6?'night':h<12?'morning':h<18?'afternoon':'evening',season:[12,1,2].includes(m)?'winter':[3,4,5].includes(m)?'spring':[6,7,8].includes(m)?'summer':'autumn'} }
function build(extra){var mem=load(),t=timeContext();return Object.assign({version:VERSION,online:root.navigator?root.navigator.onLine!==false:true,language:(root.navigator&&root.navigator.language)||'de-DE',firstVisit:!mem.introductionSeen,companionStyle:mem.companionStyle,permissions:clone(mem.permissions),weather:mem.weather},t,extra||{})}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function select(pool,group,context){if(!Array.isArray(pool)||!pool.length)return null;var mem=load(),blocked=new Set(mem.recentMessageIds||[]),eligible=pool.filter(function(x){return x&&x.id&&!blocked.has(x.id)});if(!eligible.length)eligible=pool.slice();var seed=[group,context&&context.timeOfDay,context&&context.weekday,new Date().toISOString().slice(0,10),mem.updatedAt].join('|');var item=eligible[hash(seed)%eligible.length];mem.recentMessageIds=(mem.recentMessageIds||[]).filter(function(id){return id!==item.id});mem.recentMessageIds.push(item.id);if(group==='greeting')mem.lastGreeting=item.id;if(group==='motivation')mem.lastMotivation=item.id;save(mem);return clone(item)}
function patch(p){var mem=load();if(p&&p.permissions)mem.permissions=Object.assign({},mem.permissions,p.permissions);if(p&&p.companionStyle)mem.companionStyle=p.companionStyle;if(p&&typeof p.introductionSeen==='boolean')mem.introductionSeen=p.introductionSeen;if(p&&Object.prototype.hasOwnProperty.call(p,'weather'))mem.weather=p.weather;return save(mem)}
root.NovuraContextEngine=Object.freeze({version:VERSION,key:KEY,schema:SCHEMA,load:load,save:save,reset:reset,build:build,select:select,patch:patch,timeContext:timeContext});
})(typeof window!=='undefined'?window:globalThis);
