/* Language Academy · Phase 24A ModuleHost Adapter */
(function(){
  'use strict';
  var VERSION = 'G54.7-phase24a-language-adapter';

  function host(){ return window.AppModuleHost || null; }
  function translation(){ return window.LanguageAcademyTranslationEngine || null; }
  function store(){ return window.LanguageAcademyLanguageStore || null; }
  function help(){ return window.LanguageAcademyHelpSystem || null; }
  function context(){ return { translation:translation(), languageStore:store(), helpSystem:help() }; }
  function register(){
    var h = host();
    if(!h || typeof h.register !== 'function') return false;
    return h.register({
      id:'language-foundation',
      label:'Language Foundation',
      version:VERSION,
      branchAware:false,
      start:function(){ try { document.dispatchEvent(new CustomEvent('language-academy:foundation-started', { detail:{ version:VERSION, context:diagnostics() } })); } catch(e){} },
      stop:function(){ return true; }
    });
  }
  function diagnostics(){ return { ok:!!(translation() && store() && help()), version:VERSION, moduleHostReady:!!host(), registered:!!(host() && host().listModules && host().listModules().some(function(m){ return m.id === 'language-foundation'; })), translation:translation() && translation().diagnostics(), store:store() && store().diagnostics(), help:help() && help().diagnostics() }; }

  window.LanguageAcademyLanguageAdapter = Object.freeze({ __version:VERSION, register:register, context:context, diagnostics:diagnostics });
  register();
})();
