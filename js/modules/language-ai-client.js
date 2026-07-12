/* Language Academy · G54.47.12E
   Robuster Browser-Client für Cloudflare Worker → Groq.
   Retry/Backoff nur bei Netzwerk, Timeout, 429 und 5xx. Keine Secrets im Client. */
(function(){
  'use strict';

  var VERSION = 'G54.47.12E-context-client';
  var STATUS_EVENT = 'language-academy-ai:status';
  var lastStatus = { ok:null, checkedAt:null, latencyMs:null, error:null, attempts:0, retryable:null, status:null };

  function cfg(){ return window.LanguageAcademyAIConfig || {}; }
  function endpoint(name){
    var c = cfg();
    var base = String(c.workerBaseUrl || '').replace(/\/+$/, '');
    var ep = c.endpoints && c.endpoints[name] ? c.endpoints[name] : ('/api/' + name);
    if(!base) return '';
    return base + String(ep).replace(/^([^\/])/, '/$1');
  }
  function timeoutMs(){ return Math.max(3000, Number(cfg().timeoutMs || 18000)); }
  function maxAttempts(){ return Math.max(1, Math.min(5, Number(cfg().maxAttempts || 3))); }
  function retryBaseMs(){ return Math.max(100, Number(cfg().retryBaseMs || 500)); }
  function retryMaxDelayMs(){ return Math.max(500, Number(cfg().retryMaxDelayMs || 5000)); }
  function requestId(){ try{return (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('req-'+Date.now()+'-'+Math.random().toString(16).slice(2));}catch(e){return 'req-'+Date.now();} }
  function commonHeaders(id){ return { 'Accept':'application/json', 'X-Request-ID':id || requestId(), 'X-App-Version':String(cfg().appVersion || 'G54.47.12E') }; }
  function isEnabled(){ return cfg().enabled !== false && !!String(cfg().workerBaseUrl || '').trim(); }
  function emit(status){
    lastStatus = Object.assign({}, lastStatus, status || {}, { checkedAt: new Date().toISOString() });
    try{ document.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: Object.assign({}, lastStatus) })); }catch(e){}
    return Object.assign({}, lastStatus);
  }
  var CONTEXT_KEY = 'egt.languageAI.context.v1';
  function cleanList(items,max){
    var seen={},out=[]; (Array.isArray(items)?items:[]).forEach(function(raw){var v=String(raw||'').replace(/\s+/g,' ').trim().slice(0,240),k=v.toLowerCase();if(v&&!seen[k]&&out.length<max){seen[k]=true;out.push(v);}}); return out;
  }
  function normalizeContext(input){
    var c=input&&typeof input==='object'?input:{};
    return {summary:String(c.summary||'').replace(/\s+/g,' ').trim().slice(0,1200),errors:cleanList(c.errors||c.errorHistory,8),vocabulary:cleanList(c.vocabulary||c.vocabularyHistory,12),grammar:cleanList(c.grammar||c.grammarHistory,8),goals:cleanList(c.goals,5),preferences:{correctionStyle:String(c.preferences&&c.preferences.correctionStyle||'').slice(0,80),explanationLanguage:String(c.preferences&&c.preferences.explanationLanguage||'').slice(0,40)},updatedAt:new Date().toISOString()};
  }
  function loadContext(){try{return normalizeContext(JSON.parse(localStorage.getItem(CONTEXT_KEY)||'{}'));}catch(e){return normalizeContext({});}}
  function saveContext(value){var c=normalizeContext(value);try{localStorage.setItem(CONTEXT_KEY,JSON.stringify(c));}catch(e){}return c;}
  function mergeContext(base,extra){base=normalizeContext(base);extra=normalizeContext(extra);return saveContext({summary:extra.summary||base.summary,errors:base.errors.concat(extra.errors),vocabulary:base.vocabulary.concat(extra.vocabulary),grammar:base.grammar.concat(extra.grammar),goals:base.goals.concat(extra.goals),preferences:{correctionStyle:extra.preferences.correctionStyle||base.preferences.correctionStyle,explanationLanguage:extra.preferences.explanationLanguage||base.preferences.explanationLanguage}});}
  function clearContext(){try{localStorage.removeItem(CONTEXT_KEY);}catch(e){}return normalizeContext({});}
  function resolvedContext(payload){return mergeContext(loadContext(),payload&&payload.context||{});}
  function sanitizeHistory(history){
    var limit = Number(cfg().historyLimit || 8);
    return (Array.isArray(history) ? history : []).filter(function(item){
      return item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string' && item.content.trim();
    }).slice(-limit).map(function(item){ return { role:item.role, content:item.content.slice(0,1600) }; });
  }
  function sleep(ms){ return new Promise(function(resolve){ setTimeout(resolve,ms); }); }
  function withTimeout(ms){
    if(typeof AbortController === 'undefined') return { signal:undefined, cancel:function(){}, timedOut:function(){return false;} };
    var controller = new AbortController();
    var timeout = false;
    var timer = setTimeout(function(){ timeout=true; try{ controller.abort(); }catch(e){} },ms);
    return { signal:controller.signal, cancel:function(){clearTimeout(timer);}, timedOut:function(){return timeout;} };
  }
  function retryAfterMs(res,data){
    var value = res && res.headers ? res.headers.get('Retry-After') : null;
    if(!value && data && data.retryAfter) value = data.retryAfter;
    if(!value) return 0;
    var seconds = Number(value);
    if(Number.isFinite(seconds)) return Math.max(0,seconds*1000);
    var date = Date.parse(value);
    return Number.isFinite(date) ? Math.max(0,date-Date.now()) : 0;
  }
  function retryableStatus(status){ return status === 408 || status === 425 || status === 429 || status >= 500; }
  function retryDelay(attempt,serverDelay){
    var exp = Math.min(retryMaxDelayMs(), retryBaseMs() * Math.pow(2,Math.max(0,attempt-1)));
    var jitter = Math.floor(Math.random() * Math.max(25,exp*0.25));
    return Math.min(retryMaxDelayMs(), Math.max(serverDelay || 0,exp+jitter));
  }
  function buildError(message, details){
    var err = new Error(message || 'AI_REQUEST_FAILED');
    Object.keys(details || {}).forEach(function(key){ err[key]=details[key]; });
    return err;
  }
  async function requestJson(url, options){
    var started = Date.now();
    var attempts = maxAttempts();
    var id = requestId();
    var lastError = null;
    for(var attempt=1; attempt<=attempts; attempt++){
      var t = withTimeout(timeoutMs());
      try{
        var headers = Object.assign({}, options && options.headers || {}, commonHeaders(id));
        var res = await fetch(url,Object.assign({mode:cfg().corsMode || 'cors',cache:'no-store'},options || {},{headers:headers,signal:t.signal}));
        var text = await res.text();
        var data;
        try{ data = text ? JSON.parse(text) : {}; }catch(e){ data={ok:false,raw:text,parseError:e.message}; }
        if(res.ok){
          emit({ok:true,latencyMs:Date.now()-started,error:null,attempts:attempt,retryable:false,status:res.status,requestId:id});
          return data;
        }
        var canRetry = data && typeof data.retryable === 'boolean' ? data.retryable : retryableStatus(res.status);
        lastError = buildError((data && (data.error || data.message)) || ('HTTP '+res.status),{status:res.status,data:data,retryable:canRetry,requestId:(data&&data.requestId)||id});
        if(!canRetry || attempt>=attempts) throw lastError;
        await sleep(retryDelay(attempt,retryAfterMs(res,data)));
      }catch(error){
        var timedOut = t.timedOut();
        var isAbort = error && error.name === 'AbortError';
        var networkError = !error || error.status == null;
        lastError = error instanceof Error ? error : buildError(String(error));
        if(timedOut || isAbort){ lastError=buildError('AI_TIMEOUT',{status:0,retryable:true,requestId:id,cause:error}); }
        else if(networkError){ lastError.retryable=true; lastError.status=0; lastError.requestId=id; }
        if(lastError.retryable === false || attempt>=attempts){
          emit({ok:false,latencyMs:Date.now()-started,error:lastError.message,attempts:attempt,retryable:!!lastError.retryable,status:lastError.status||0,requestId:lastError.requestId||id});
          throw lastError;
        }
        await sleep(retryDelay(attempt,0));
      }finally{ t.cancel(); }
    }
    emit({ok:false,latencyMs:Date.now()-started,error:lastError&&lastError.message||'AI_REQUEST_FAILED',attempts:attempts,retryable:true,status:lastError&&lastError.status||0,requestId:id});
    throw lastError || buildError('AI_REQUEST_FAILED',{retryable:true,requestId:id});
  }
  async function health(){
    if(!isEnabled()) throw new Error('LanguageAcademyAIConfig.workerBaseUrl fehlt oder AI ist deaktiviert.');
    return requestJson(endpoint('health'),{method:'GET',headers:{}});
  }
  async function coach(payload){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload=payload||{};
    return requestJson(endpoint('coach'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:String(payload.message||payload.userText||'').slice(0,4000),level:payload.level||cfg().defaultLevel||'B1',language:payload.language||cfg().defaultLanguage||'Deutsch',role:payload.role||payload.mode||'coach',topic:payload.topic||'Sprachtraining',history:sanitizeHistory(payload.history),context:resolvedContext(payload)})});
  }
  function createLinkedController(externalSignal){
    if(typeof AbortController === 'undefined') return {controller:null,cleanup:function(){}};
    var controller=new AbortController();
    function abort(){ try{controller.abort();}catch(e){} }
    if(externalSignal){ if(externalSignal.aborted) abort(); else externalSignal.addEventListener('abort',abort,{once:true}); }
    return {controller:controller,cleanup:function(){try{externalSignal&&externalSignal.removeEventListener('abort',abort);}catch(e){}}};
  }
  async function coachStream(payload, handlers){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload=payload||{}; handlers=handlers||{};
    var linked=createLinkedController(handlers.signal); var id=requestId(); var text='';
    var url=endpoint('coach')+(endpoint('coach').indexOf('?')>=0?'&':'?')+'stream=1';
    try{
      var res=await fetch(url,{method:'POST',mode:cfg().corsMode||'cors',cache:'no-store',headers:Object.assign({'Content-Type':'application/json','Accept':'text/event-stream'},commonHeaders(id)),body:JSON.stringify({message:String(payload.message||payload.userText||'').slice(0,4000),level:payload.level||cfg().defaultLevel||'B1',language:payload.language||cfg().defaultLanguage||'Deutsch',role:payload.role||payload.mode||'coach',topic:payload.topic||'Sprachtraining',history:sanitizeHistory(payload.history),context:resolvedContext(payload)}),signal:linked.controller&&linked.controller.signal});
      if(!res.ok||!res.body) throw buildError('STREAM_HTTP_'+res.status,{status:res.status,retryable:retryableStatus(res.status)});
      var reader=res.body.getReader(), decoder=new TextDecoder(), buffer='';
      while(true){ var chunk=await reader.read(); if(chunk.done) break; buffer+=decoder.decode(chunk.value,{stream:true}); var events=buffer.split('\n\n'); buffer=events.pop()||'';
        events.forEach(function(block){ var type='message',data=''; block.split('\n').forEach(function(line){if(line.indexOf('event:')===0)type=line.slice(6).trim();if(line.indexOf('data:')===0)data+=line.slice(5).trim();}); if(!data)return; var obj;try{obj=JSON.parse(data);}catch(e){return;} if(type==='token'&&obj.text){text+=obj.text;if(handlers.onToken)handlers.onToken(obj.text,text);} else if(type==='meta'&&handlers.onMeta)handlers.onMeta(obj); else if(type==='error')throw buildError(obj.error||'STREAM_FAILED',{retryable:true}); });
      }
      if(handlers.onDone) handlers.onDone(text); emit({ok:true,error:null,attempts:1,retryable:false,status:200,requestId:id}); return {ok:true,reply:text,streamed:true,meta:{requestId:id}};
    }catch(error){ if(error&&error.name==='AbortError'){var aborted=buildError('AI_STREAM_ABORTED',{aborted:true,retryable:false,requestId:id});emit({ok:false,error:aborted.message,status:0,retryable:false,requestId:id});throw aborted;} if(handlers.fallbackToJson===false) throw error; if(handlers.onFallback)handlers.onFallback(error); return coach(payload);
    }finally{linked.cleanup();}
  }
  async function speaking(payload){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload=payload||{};
    return requestJson(endpoint('speaking'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userText:String(payload.userText||payload.message||'').slice(0,4000),level:payload.level||cfg().defaultLevel||'B1',language:payload.language||cfg().defaultLanguage||'Deutsch',topic:payload.topic||'Alltag',history:sanitizeHistory(payload.history),context:resolvedContext(payload)})});
  }
  async function examSpeaking(payload){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload=payload||{};
    return requestJson(endpoint('examSpeaking'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userText:String(payload.userText||payload.message||'').slice(0,4000),level:payload.level||cfg().defaultLevel||'B1',language:payload.language||cfg().defaultLanguage||'Deutsch',topic:payload.topic||'Prüfungsgespräch',requiredPoints:Array.isArray(payload.requiredPoints)?payload.requiredPoints.slice(0,12):[],context:resolvedContext(payload)})});
  }

  window.EGTLanguageAIClient=Object.freeze({__version:VERSION,isEnabled:isEnabled,endpoint:endpoint,health:health,coach:coach,coachStream:coachStream,speaking:speaking,examSpeaking:examSpeaking,context:Object.freeze({load:loadContext,save:saveContext,merge:mergeContext,clear:clearContext}),lastStatus:function(){return Object.assign({},lastStatus);},statusEvent:STATUS_EVENT});
})();
