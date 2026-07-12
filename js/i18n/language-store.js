/* Language Academy · Phase 24A
   Persistente Lernsprache/Hilfssprache ohne Einfluss auf XP, Highscore oder Fortschritt. */
(function(){
  'use strict';

  var VERSION = 'G54.43.9K-language-store';
  var KEY = 'language_academy_language_settings_v1';
  var ALLOWED = ['de', 'tr', 'en'];
  var DEFAULTS = Object.freeze({ learningLanguage:'de', helpLanguage:'tr' });
  var listeners = [];

  function safeJson(raw, fallback){ try { return JSON.parse(raw || ''); } catch(e){ return fallback; } }
  function cleanLang(v, fallback){ v = String(v || '').trim().toLowerCase(); return ALLOWED.indexOf(v) >= 0 ? v : fallback; }
  function emit(detail){
    var payload = Object.assign({ version:VERSION }, detail || {});
    listeners.slice().forEach(function(fn){ try { fn(payload); } catch(e){} });
    try { window.dispatchEvent(new CustomEvent('language-academy:language-changed', { detail: payload })); } catch(e){}
  }
  function readRaw(){ try { return safeJson(localStorage.getItem(KEY), null); } catch(e){ return null; } }
  function normalize(settings){
    settings = settings && typeof settings === 'object' ? settings : {};
    return {
      learningLanguage: cleanLang(settings.learningLanguage || settings.learnLanguage || settings.language, DEFAULTS.learningLanguage),
      helpLanguage: cleanLang(settings.helpLanguage || settings.assistLanguage, DEFAULTS.helpLanguage),
      updatedAt: settings.updatedAt || new Date().toISOString()
    };
  }
  function get(){
    var settings = normalize(readRaw() || DEFAULTS);
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch(e){}
    return settings;
  }
  function set(next){
    var current = get();
    var merged = normalize(Object.assign({}, current, next || {}, { updatedAt:new Date().toISOString() }));
    try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch(e){}
    emit({ settings:merged });
    return merged;
  }
  function setLearningLanguage(lang){ return set({ learningLanguage:lang }); }
  function setHelpLanguage(lang){ return set({ helpLanguage:lang }); }
  function onChange(fn){ if(typeof fn !== 'function') return function(){}; listeners.push(fn); return function(){ listeners = listeners.filter(function(item){ return item !== fn; }); }; }
  function diagnostics(){ return { ok:true, version:VERSION, key:KEY, allowed:ALLOWED.slice(), settings:get() }; }

  window.LanguageAcademyLanguageStore = Object.freeze({
    __version:VERSION,
    allowedLanguages:ALLOWED.slice(),
    defaults:Object.assign({}, DEFAULTS),
    get:get,
    set:set,
    setLearningLanguage:setLearningLanguage,
    setHelpLanguage:setHelpLanguage,
    onChange:onChange,
    diagnostics:diagnostics
  });
})();
