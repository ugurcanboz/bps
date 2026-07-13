/* Novura · Controlled Groq Micro Personalization · G54.50.1 */
(function(root){'use strict';
var VERSION='G54.50.1-2026-07-12';
var MAX_WORDS=32,MIN_WORDS=4,MAX_CHARS=220,TIMEOUT_MS=4500,SESSION_LIMIT=1;
var used=0;
var BLOCKED=[/ignore\s+(all|previous|earlier)/i,/system\s*prompt/i,/developer\s*message/i,/password|api[-_ ]?key|secret/i,/diagnos/i,/therap/i,/garantier/i,/heilen|heilung/i,/ich bin ein mensch/i,/klick(e|en)?\s+auf\s+einen\s+externen/i,/https?:\/\//i];
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean).length}
function plain(s){return String(s||'').replace(/[\r\n\t]+/g,' ').replace(/\s{2,}/g,' ').trim()}
function safe(text){text=plain(text);if(!text||text.length>MAX_CHARS||words(text)<MIN_WORDS||words(text)>MAX_WORDS)return false;if(BLOCKED.some(function(rx){return rx.test(text)}))return false;if(/[{}<>`]/.test(text))return false;return true}
function extract(result){var value=result&&(result.reply||result.text||result.message);return safe(value)?plain(value):''}
function contextSummary(ctx){ctx=ctx||{};var out=['Tageszeit: '+(ctx.timeOfDay||'unbekannt'),'Begleitung: '+(ctx.companionStyle||'balanced')];if(ctx.weather&&ctx.weather.label)out.push('Wetter grob: '+ctx.weather.label);out.push('Erstbesuch: '+(ctx.firstVisit?'ja':'nein'));return out.join('; ')}
function prompt(base,kind,ctx){return [
 'Formuliere den folgenden Nova-Satz minimal natürlicher auf Deutsch um.',
 'Bedeutung, Du-Ansprache und Handlungsziel müssen exakt erhalten bleiben.',
 'Keine neue Frage, keine neuen Funktionen, keine Versprechen, keine Emojis, keine Links.',
 'Maximal 24 Wörter. Gib ausschließlich den fertigen Satz zurück.',
 'Kontext: '+contextSummary(ctx),
 'Art: '+String(kind||'welcome'),
 'Ausgangssatz: '+String(base||'').slice(0,220)
 ].join('\n')}
function withTimeout(promise,ms){return new Promise(function(resolve,reject){var done=false,t=setTimeout(function(){if(!done){done=true;reject(new Error('nova_ai_timeout'))}},ms);Promise.resolve(promise).then(function(v){if(!done){done=true;clearTimeout(t);resolve(v)}},function(e){if(!done){done=true;clearTimeout(t);reject(e)}})})}
async function personalize(base,options){options=options||{};base=plain(base);if(!safe(base))return{ok:false,text:base,source:'local',reason:'unsafe_base'};if(used>=SESSION_LIMIT)return{ok:false,text:base,source:'local',reason:'session_limit'};if(!root.navigator||root.navigator.onLine===false)return{ok:false,text:base,source:'local',reason:'offline'};var client=root.EGTLanguageAIClient;if(!client||typeof client.coach!=='function'||(client.isEnabled&&client.isEnabled()===false))return{ok:false,text:base,source:'local',reason:'client_unavailable'};used++;
 try{var ctx=root.NovuraContextEngine?root.NovuraContextEngine.build():{};var result=await withTimeout(client.coach({message:prompt(base,options.kind,ctx),level:'B1',language:'Deutsch',role:'coach',topic:'Novura Welcome Microcopy',history:[],context:{summary:'Nur kontrollierte Umformulierung einer kurzen Welcome-Nachricht. Keine Lernberatung.',goals:['kurz','persönlich','transparent'],preferences:{explanationLanguage:'Deutsch'}}}),TIMEOUT_MS);var text=extract(result);if(!text)return{ok:false,text:base,source:'local',reason:'invalid_ai_output'};return{ok:true,text:text,source:'groq',reason:''}}
 catch(e){return{ok:false,text:base,source:'local',reason:e&&e.message||'request_failed'}}}
function resetSession(){used=0}
root.NovuraMicroPersonalization=Object.freeze({version:VERSION,personalize:personalize,isSafe:safe,extract:extract,resetSession:resetSession,limits:Object.freeze({maxWords:MAX_WORDS,maxChars:MAX_CHARS,timeoutMs:TIMEOUT_MS,sessionRequests:SESSION_LIMIT})});
})(typeof window!=='undefined'?window:globalThis);
