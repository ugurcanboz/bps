/* Ablaufplan-Detektiv · FlowLogic Standalone SelfTest · Phase 12
   Eigenes Kontrollzentrum fuer den getrennten Aufgabenmotor. Keine Abhaengigkeit zur Haupt-App. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var tests = [];
  var lastReport = null;

  function nowIso(){ return new Date().toISOString(); }
  function safeConsole(method){
    try { return (window.console && typeof window.console[method] === 'function') ? window.console[method].bind(window.console) : function(){}; }
    catch(e){ return function(){}; }
  }
  var log = safeConsole('log');
  var warn = safeConsole('warn');
  var errorLog = safeConsole('error');

  function assert(condition, message, details){
    if(!condition){
      var err = new Error(message || 'FlowLogic SelfTest assertion failed');
      if(details !== undefined) err.details = details;
      throw err;
    }
    return true;
  }

  function register(id, title, fn, meta){
    if(!id || typeof id !== 'string') throw new Error('SelfTest braucht eine stabile Test-ID.');
    if(typeof fn !== 'function') throw new Error('SelfTest '+id+' braucht eine Funktion.');
    if(tests.some(function(t){ return t.id === id; })) throw new Error('SelfTest doppelt registriert: '+id);
    tests.push({ id:id, title:title || id, fn:fn, meta:meta || {} });
    return true;
  }

  function list(){
    return tests.map(function(t){
      return { id:t.id, title:t.title, phase:t.meta.phase || '', critical:t.meta.critical !== false };
    });
  }

  function serializeError(err){
    return {
      message: err && err.message ? String(err.message) : String(err || 'Unbekannter Fehler'),
      details: err && err.details !== undefined ? err.details : null,
      stack: err && err.stack ? String(err.stack).split('\n').slice(0,6).join('\n') : ''
    };
  }

  async function runAll(options){
    options = options || {};
    var started = Date.now();
    var results = [];
    for(var i=0; i<tests.length; i++){
      var test = tests[i];
      var itemStart = Date.now();
      try {
        var value = test.fn({ assert:assert, options:options, version:VERSION });
        if(value && typeof value.then === 'function') value = await value;
        results.push({ id:test.id, title:test.title, phase:test.meta.phase || '', ok:true, ms:Date.now()-itemStart, details:value || null });
      } catch(err){
        results.push({ id:test.id, title:test.title, phase:test.meta.phase || '', ok:false, ms:Date.now()-itemStart, error:serializeError(err) });
      }
    }
    var failed = results.filter(function(r){ return !r.ok; });
    lastReport = {
      module:'flowlogic',
      package:'standalone',
      version:VERSION,
      ok:failed.length === 0,
      total:results.length,
      passed:results.length - failed.length,
      failed:failed.length,
      generatedAt:nowIso(),
      durationMs:Date.now()-started,
      results:results
    };
    try { localStorage.setItem('flowlogic_selftest_last_report_v1', JSON.stringify(lastReport)); } catch(e){}
    try { window.dispatchEvent(new CustomEvent('flowlogic:selftest-complete', { detail:lastReport })); } catch(e){}
    if(options.silent !== true){
      var method = lastReport.ok ? log : warn;
      method('[FlowLogic Standalone SelfTest]', lastReport.ok ? 'OK' : 'FEHLER', lastReport);
      if(!lastReport.ok) errorLog('[FlowLogic Standalone SelfTest] Fehlerliste:', failed);
    }
    return lastReport;
  }

  function last(){ return lastReport; }

  function testDom(){
    assert(typeof window !== 'undefined', 'window ist nicht vorhanden.');
    assert(document && document.documentElement && document.body, 'DOM ist nicht bereit.');
    return { window:true, body:true, standalone:true };
  }

  function testStorage(){
    var key = '__flowlogic_selftest_storage__';
    try {
      localStorage.setItem(key, 'ok');
      assert(localStorage.getItem(key) === 'ok', 'localStorage Schreib-/Lesetest fehlgeschlagen.');
      localStorage.removeItem(key);
      return { storage:'ok' };
    } catch(e){
      return { storage:'not-available', warning:String(e && e.message || e) };
    }
  }

  function testNoAppDependency(){
    return {
      trainerModulesPresent: !!window.TrainerModules,
      appModuleLoaderPresent: !!window.AppModuleLoader,
      note:'Standalone-Paket benoetigt keine Haupt-App-Registry. Optionale Registry-Adapter duerfen vorhanden sein, sind aber keine Pflicht.'
    };
  }

  function testNamespaceClean(){
    var required = ['FlowLogicSelfTest'];
    var present = required.filter(function(name){ return !!window[name]; });
    assert(present.length === required.length, 'FlowLogic Basis-Namespace fehlt.', { required:required, present:present });
    return { present:present };
  }

  register('phase0.standalone-dom', 'Phase 0: Standalone-DOM vorhanden', testDom, { phase:'0', critical:true });
  register('phase0.storage-optional', 'Phase 0: Storage optional pruefen', testStorage, { phase:'0', critical:false });
  register('phase0.no-app-dependency', 'Phase 0: Keine Pflicht-Abhaengigkeit zur Haupt-App', testNoAppDependency, { phase:'0', critical:true });
  register('phase0.namespace', 'Phase 0: FlowLogic Namespace sauber', testNamespaceClean, { phase:'0', critical:true });

  window.FlowLogicSelfTest = Object.freeze({
    __version: VERSION,
    register: register,
    runAll: runAll,
    list: list,
    last: last,
    assert: assert
  });

  try {
    document.addEventListener('DOMContentLoaded', function(){
      var shouldRun = false;
      try { shouldRun = /[?&]flowlogicTest=1(?:&|$)/.test(location.search) || localStorage.getItem('flowlogic_selftest_autorun') === '1'; } catch(e){}
      if(shouldRun) setTimeout(function(){ runAll({ silent:false }); }, 250);
    });
  } catch(e){}
})();
