/* Language Academy · Phase 38B complete
   Browser-Client für Cloudflare Worker → Groq.
   Keine Secrets, keine API-Keys, GitHub-Pages-kompatibel. */
(function(){
  'use strict';

  var VERSION = 'G54.38B-complete-language-ai-client';
  var STATUS_EVENT = 'language-academy-ai:status';
  var lastStatus = { ok:null, checkedAt:null, latencyMs:null, error:null };

  function cfg(){ return window.LanguageAcademyAIConfig || {}; }
  function endpoint(name){
    var c = cfg();
    var base = String(c.workerBaseUrl || '').replace(/\/+$/, '');
    var ep = c.endpoints && c.endpoints[name] ? c.endpoints[name] : ('/api/' + name);
    if(!base) return '';
    return base + String(ep).replace(/^([^\/])/, '/$1');
  }
  function timeoutMs(){ return Number(cfg().timeoutMs || 18000); }
  function isEnabled(){ return cfg().enabled !== false && !!String(cfg().workerBaseUrl || '').trim(); }
  function emit(status){
    lastStatus = Object.assign({}, lastStatus, status || {}, { checkedAt: new Date().toISOString() });
    try{ document.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: Object.assign({}, lastStatus) })); }catch(e){}
    return Object.assign({}, lastStatus);
  }
  function sanitizeHistory(history){
    var limit = Number(cfg().historyLimit || 8);
    return (Array.isArray(history) ? history : []).filter(function(item){
      return item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string' && item.content.trim();
    }).slice(-limit).map(function(item){
      return { role:item.role, content:item.content.slice(0, 1600) };
    });
  }
  function withTimeout(ms){
    if(typeof AbortController === 'undefined') return { signal: undefined, cancel:function(){} };
    var controller = new AbortController();
    var timer = setTimeout(function(){ try{ controller.abort(); }catch(e){} }, ms);
    return { signal: controller.signal, cancel:function(){ clearTimeout(timer); } };
  }
  async function requestJson(url, options){
    var started = Date.now();
    var t = withTimeout(timeoutMs());
    try{
      var res = await fetch(url, Object.assign({ mode: cfg().corsMode || 'cors', cache:'no-store', signal:t.signal }, options || {}));
      var text = await res.text();
      var data = null;
      try{ data = text ? JSON.parse(text) : {}; }catch(e){ data = { ok:false, raw:text, parseError:e.message }; }
      if(!res.ok){
        var err = new Error((data && (data.error || data.message)) || ('HTTP ' + res.status));
        err.status = res.status;
        err.data = data;
        throw err;
      }
      emit({ ok:true, latencyMs:Date.now()-started, error:null });
      return data;
    }catch(error){
      emit({ ok:false, latencyMs:Date.now()-started, error:error && error.message ? error.message : String(error) });
      throw error;
    }finally{
      t.cancel();
    }
  }
  async function health(){
    if(!isEnabled()) throw new Error('LanguageAcademyAIConfig.workerBaseUrl fehlt oder AI ist deaktiviert.');
    return requestJson(endpoint('health'), { method:'GET', headers:{ 'Accept':'application/json' } });
  }
  async function coach(payload){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload = payload || {};
    return requestJson(endpoint('coach'), {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
      body: JSON.stringify({
        message: String(payload.message || payload.userText || '').slice(0, 4000),
        level: payload.level || cfg().defaultLevel || 'B1',
        language: payload.language || cfg().defaultLanguage || 'Deutsch',
        history: sanitizeHistory(payload.history),
        context: payload.context || null
      })
    });
  }
  async function speaking(payload){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload = payload || {};
    return requestJson(endpoint('speaking'), {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
      body: JSON.stringify({
        userText: String(payload.userText || payload.message || '').slice(0, 4000),
        level: payload.level || cfg().defaultLevel || 'B1',
        topic: payload.topic || 'Alltag',
        history: sanitizeHistory(payload.history)
      })
    });
  }
  async function examSpeaking(payload){
    if(!isEnabled()) throw new Error('AI-Client ist deaktiviert.');
    payload = payload || {};
    return requestJson(endpoint('examSpeaking'), {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
      body: JSON.stringify({
        userText: String(payload.userText || payload.message || '').slice(0, 4000),
        level: payload.level || cfg().defaultLevel || 'B1',
        topic: payload.topic || 'Prüfungsgespräch',
        requiredPoints: Array.isArray(payload.requiredPoints) ? payload.requiredPoints.slice(0, 12) : []
      })
    });
  }

  window.EGTLanguageAIClient = Object.freeze({
    __version: VERSION,
    isEnabled: isEnabled,
    endpoint: endpoint,
    health: health,
    coach: coach,
    speaking: speaking,
    examSpeaking: examSpeaking,
    lastStatus: function(){ return Object.assign({}, lastStatus); },
    statusEvent: STATUS_EVENT
  });
})();
