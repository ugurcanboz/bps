/* FlowLogic Standalone Loader · Phase 12
   Optionaler Helfer zum Laden des eigenstaendigen Moduls in beliebigen Host-Apps. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var SCRIPT_ORDER = [
    'flowlogic.selftest.js',
    'flowlogic.schema.js',
    'flowlogic.scenarios.js',
    'flowlogic.mutations.js',
    'flowlogic.validator.js',
    'flowlogic.renderer.js',
    'flowlogic.input.js',
    'flowlogic.scorer.js',
    'flowlogic.generator.js',
    'flowlogic.module.js'
  ];

  function trimSlash(value){ return String(value || '').replace(/\/+$/, ''); }
  function loadScript(src){
    return new Promise(function(resolve, reject){
      if([].slice.call(document.scripts || []).some(function(s){ return s.src && s.src.indexOf(src) !== -1; })) return resolve({ src:src, skipped:true });
      var script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = function(){ resolve({ src:src, loaded:true }); };
      script.onerror = function(){ reject(new Error('FlowLogic Script konnte nicht geladen werden: '+src)); };
      document.head.appendChild(script);
    });
  }
  function loadStyle(href){
    return new Promise(function(resolve, reject){
      if([].slice.call(document.styleSheets || []).some(function(s){ return s.href && s.href.indexOf(href) !== -1; })) return resolve({ href:href, skipped:true });
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = function(){ resolve({ href:href, loaded:true }); };
      link.onerror = function(){ reject(new Error('FlowLogic CSS konnte nicht geladen werden: '+href)); };
      document.head.appendChild(link);
    });
  }

  async function load(options){
    options = options || {};
    var baseUrl = trimSlash(options.baseUrl || './src');
    var loadCss = options.css !== false;
    var loaded = [];
    if(loadCss) loaded.push(await loadStyle(baseUrl + '/flowlogic.css'));
    for(var i=0; i<SCRIPT_ORDER.length; i++) loaded.push(await loadScript(baseUrl + '/' + SCRIPT_ORDER[i]));
    if(!window.FlowLogicModule) throw new Error('FlowLogicModule wurde nach dem Laden nicht gefunden.');
    if(options.init !== false && typeof window.FlowLogicModule.init === 'function') window.FlowLogicModule.init(options.context || {});
    return { ok:true, version:VERSION, baseUrl:baseUrl, loaded:loaded, module:window.FlowLogicModule };
  }

  window.FlowLogicLoader = Object.freeze({
    __version: VERSION,
    scriptOrder: SCRIPT_ORDER.slice(),
    load: load
  });
})();
