/* Ablaufplan-Detektiv · FlowLogic Standalone Module · Phase 12
   Separater Modul-Ast fuer Ablaufplan-/Routenlogik-Aufgaben. Phase 12 trennt den Aufgabenmotor vollstaendig von der Haupt-App und macht ihn als eigenstaendiges Modul integrierbar. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';
  var active = null;
  var initialized = false;
  var initContext = null;

  function $(id){ return document.getElementById(id); }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  function emit(name, detail){
    try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch(e){}
  }

  function status(){
    return {
      id: MODULE_ID,
      name: 'Ablaufplan-Detektiv',
      subtitle: 'Programmieren verstehen ohne Code',
      version: VERSION,
      initialized: initialized,
      mounted: !!active,
      phase: '0+1+2+3+4+5+6+7+8+9+10+11+12-standalone',
      features: {
        isolatedModule:true,
        selfTest:true,
        scenarioEngine:true,
        schemaModel:!!window.FlowLogicSchema,
        scenarioLibrary:!!window.FlowLogicScenarios,
        mutationLibrary:!!window.FlowLogicMutations,
        distributionValidator:!!window.FlowLogicValidator,
        svgRenderer:!!window.FlowLogicRenderer,
        structuredInput:!!window.FlowLogicInput,
        scoringEngine:!!window.FlowLogicScorer,
        generatorEngine:!!window.FlowLogicGenerator,
        generatorV2: !!(window.FlowLogicGenerator && window.FlowLogicGenerator.antiMemorizationReport),
        mutationCandidates: window.FlowLogicMutations && typeof window.FlowLogicMutations.listAllCandidates === 'function' ? window.FlowLogicMutations.listAllCandidates().length : 0,
        masterScenarios: window.FlowLogicScenarios && typeof window.FlowLogicScenarios.getAll === 'function' ? window.FlowLogicScenarios.getAll().length : 0,
        scorer:!!window.FlowLogicScorer,
        validator:!!window.FlowLogicValidator,
        generator:!!window.FlowLogicGenerator
      }
    };
  }

  function renderMarkup(options){
    options = options || {};
    var mode = options.mode || 'foundation';
    return ''+
      '<section class="flowlogic-root" data-flowlogic-version="'+esc(VERSION)+'" data-flowlogic-mode="'+esc(mode)+'">'+
        '<header class="flowlogic-hero">'+
          '<div class="flowlogic-eyebrow">Standalone-Modulpaket · Phase 12</div>'+ 
          '<h2>Ablaufplan-Detektiv</h2>'+ 
          '<p>Eigenstaendiges Steuergeraet fuer Ablaufplan-, Routen- und Programmierlogik-Aufgaben ohne Code. Dieses Paket ist von der Haupt-App getrennt und kann ueber eine definierte Host-Schnittstelle integriert werden.</p>'+ 
        '</header>'+ 
        '<div class="flowlogic-phase-grid" aria-label="FlowLogic Phasenstatus">'+
          '<article class="flowlogic-card is-ready"><strong>Phase 0</strong><span>Sicherheitsbasis + SelfTest aktiv</span></article>'+ 
          '<article class="flowlogic-card is-ready"><strong>Phase 1</strong><span>Separates Modulgeruest aktiv</span></article>'+ 
          '<article class="flowlogic-card is-ready"><strong>Phase 2</strong><span>Universeller Szenario-Datenvertrag aktiv</span></article>'+ 
          '<article class="flowlogic-card is-ready"><strong>Phase 3</strong><span>Master-Szenarien aktiv</span></article>'+ 
          '<article class="flowlogic-card is-ready"><strong>Phase 4</strong><span>Fehlerbibliothek / Mutationen aktiv</span></article>'+ 
          '<article class="flowlogic-card is-ready"><strong>Phase 5</strong><span>Verteilungs-Validator aktiv</span></article>'+  
          '<article class="flowlogic-card is-ready"><strong>Phase 6</strong><span>SVG-Renderer aktiv</span></article>'+  
          '<article class="flowlogic-card is-ready"><strong>Phase 7</strong><span>Strukturierte Fehlereingabe aktiv</span></article>'+  
          '<article class="flowlogic-card is-ready"><strong>Phase 8</strong><span>Scoring-Engine aktiv</span></article>'+  
          '<article class="flowlogic-card is-ready"><strong>Phase 10</strong><span>10 Szenarien aktiv</span></article>'+  
          '<article class="flowlogic-card is-ready"><strong>Phase 11</strong><span>Generator V2 aktiv</span></article>'+  
        '</div>'+ 
        '<div class="flowlogic-actions">'+
          '<button type="button" class="flowlogic-btn" data-flowlogic-action="selftest">SelfTest ausfuehren</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="status">Status anzeigen</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="preview">SVG-Vorschau rendern</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="input-preview">Fehlereingabe testen</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="score-preview">Scoring testen</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="generator-preview">Generator testen</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="v2-preview">Generator V2 prüfen</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-action="pool-preview">Szenario-Pool pruefen</button>'+ 
        '</div>'+ 
        '<pre class="flowlogic-output" data-flowlogic-output hidden></pre>'+ 
        '<div class="flowlogic-render-slot" data-flowlogic-render-slot hidden></div>'+ 
      '</section>';
  }

  function mount(target, options){
    if(!target || !target.appendChild) throw new Error('FlowLogic mount braucht ein gueltiges Ziel-Element.');
    var root = document.createElement('div');
    root.className = 'flowlogic-mount';
    root.innerHTML = renderMarkup(options || {});
    var output = root.querySelector('[data-flowlogic-output]');
    var renderSlot = root.querySelector('[data-flowlogic-render-slot]');

    function print(data){
      if(!output) return;
      output.hidden = false;
      output.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }
    async function onClick(event){
      var btn = event.target && event.target.closest ? event.target.closest('[data-flowlogic-action]') : null;
      if(!btn) return;
      var action = btn.getAttribute('data-flowlogic-action');
      if(action === 'selftest'){
        if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.runAll === 'function'){
          print('SelfTest laeuft...');
          var report = await window.FlowLogicSelfTest.runAll({ silent:true });
          print(report);
        } else {
          print({ ok:false, error:'FlowLogicSelfTest nicht geladen.' });
        }
      }
      if(action === 'status') print(status());
      if(action === 'preview'){
        if(window.FlowLogicRenderer && typeof window.FlowLogicRenderer.renderPreviewTo === 'function'){
          if(renderSlot){
            renderSlot.hidden = false;
            renderSlot.innerHTML = '';
            var handle = window.FlowLogicRenderer.renderPreviewTo(renderSlot, 'flow_master_postbote_nachnahme');
            print({ ok:handle.ok, renderer:'preview-rendered', report:handle.report.summary, warnings:handle.report.warnings.length });
          }
        } else {
          print({ ok:false, error:'FlowLogicRenderer nicht geladen.' });
        }
      }
      if(action === 'input-preview'){
        if(window.FlowLogicInput && typeof window.FlowLogicInput.renderTo === 'function'){
          if(renderSlot){
            renderSlot.hidden = false;
            renderSlot.innerHTML = '';
            var inputHandle = window.FlowLogicInput.renderTo(renderSlot, 'flow_master_postbote_nachnahme', { mode:'training' });
            print({ ok:true, input:'structured-input-rendered', session:window.FlowLogicInput.serializeSession(inputHandle.session) });
          }
        } else {
          print({ ok:false, error:'FlowLogicInput nicht geladen.' });
        }
      }
      if(action === 'score-preview'){
        if(window.FlowLogicScorer && typeof window.FlowLogicScorer.scoreModelSolution === 'function'){
          var built = window.FlowLogicValidator.createValidatedTask('flow_master_postbote_nachnahme');
          var modelScore = window.FlowLogicScorer.scoreModelSolution(built.task);
          var emptyScore = window.FlowLogicScorer.makeEmptyResult(built.task);
          var partialScore = window.FlowLogicScorer.scorePartialProbe(built.task);
          print({ ok:true, scorer:'phase8-ready', model:modelScore.summary, empty:emptyScore.summary, partial:partialScore.summary, categoryStats:modelScore.categoryStats });
        } else {
          print({ ok:false, error:'FlowLogicScorer nicht geladen.' });
        }
      }
      if(action === 'pool-preview'){
        if(window.FlowLogicScenarios && window.FlowLogicGenerator){
          var scenarioList = window.FlowLogicScenarios.list();
          var validation = window.FlowLogicScenarios.validateAll();
          var poolBatch = window.FlowLogicGenerator.generateBatch({ amount:30, seed:'UI:POOL:PHASE11', difficulty:'novuraExams' });
          print({ ok:validation.ok && poolBatch.ok, phase:11, scenarios:scenarioList, validation:{ total:validation.total, ok:validation.ok }, generator:{ amount:poolBatch.amount, scenarios:poolBatch.scenarios, layouts:poolBatch.layouts, terminology:poolBatch.terminology, uniqueSignatures:poolBatch.uniqueSignatures, uniqueGridPatterns:poolBatch.uniqueGridPatterns } });
        } else {
          print({ ok:false, error:'FlowLogicScenarios/Generator nicht geladen.' });
        }
      }

      if(action === 'v2-preview'){
        if(window.FlowLogicGenerator && typeof window.FlowLogicGenerator.generateBatch === 'function'){
          var v2 = window.FlowLogicGenerator.generateBatch({ amount:40, seed:'UI:GENERATOR:V2:PHASE11', difficulty:'novuraExams', minScenarioCoverage:10, minLayoutCoverage:5, minTerminologyCoverage:3 });
          print({ ok:v2.ok, generator:'phase11-v2-anti-memorization', amount:v2.amount, scenarios:v2.scenarios, families:v2.families, layouts:v2.layouts, terminology:v2.terminology, uniqueSignatures:v2.uniqueSignatures, uniqueGridPatterns:v2.uniqueGridPatterns, warnings:v2.warnings });
        } else {
          print({ ok:false, error:'FlowLogicGenerator nicht geladen.' });
        }
      }
      if(action === 'generator-preview'){
        if(window.FlowLogicGenerator && typeof window.FlowLogicGenerator.createTask === 'function'){
          var generated = window.FlowLogicGenerator.createTask({ scenarioId:'flow_master_postbote_nachnahme', seed:'UI:GENERATOR:POSTBOTE', difficulty:'novuraExams' });
          if(renderSlot && window.FlowLogicRenderer && typeof window.FlowLogicRenderer.renderTo === 'function'){
            renderSlot.hidden = false;
            renderSlot.innerHTML = '';
            window.FlowLogicRenderer.renderTo(renderSlot, generated.task, { interactive:false });
          }
          var batch = window.FlowLogicGenerator.generateBatch({ amount:12, seed:'UI:GENERATOR:BATCH', difficulty:'novuraExams' });
          print({ ok:true, generator:'phase11-v2-ready', seed:generated.seed, scenarioId:generated.task.id, layoutVariant:generated.layoutVariant, terminologyVariant:generated.terminologyVariant, gridPattern:generated.gridPattern, signature:generated.signature, answerKey:generated.task.answerKey.length, distribution:generated.report.summary, modelScore:generated.scoreReport, batch:{ amount:batch.amount, scenarios:batch.scenarios, layouts:batch.layouts, terminology:batch.terminology, uniqueSignatures:batch.uniqueSignatures, uniqueGridPatterns:batch.uniqueGridPatterns } });
        } else {
          print({ ok:false, error:'FlowLogicGenerator nicht geladen.' });
        }
      }
    }

    root.addEventListener('click', onClick);
    target.appendChild(root);
    var handle = {
      root: root,
      destroy: function(){
        root.removeEventListener('click', onClick);
        if(root.parentNode) root.parentNode.removeChild(root);
      }
    };
    emit('flowlogic:mounted', status());
    return handle;
  }

  function start(options){
    options = options || {};
    if(active && active.root && document.body.contains(active.root)) return active;
    var overlay = document.createElement('div');
    overlay.className = 'flowlogic-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Ablaufplan-Detektiv');
    overlay.innerHTML = '<div class="flowlogic-panel"><button type="button" class="flowlogic-close" data-flowlogic-close aria-label="Schliessen">×</button><div data-flowlogic-panel-body></div></div>';
    document.body.appendChild(overlay);
    var body = overlay.querySelector('[data-flowlogic-panel-body]');
    var mounted = mount(body, options);
    function closeClick(event){
      if(event.target && event.target.matches('[data-flowlogic-close]')) destroy();
    }
    overlay.addEventListener('click', closeClick);
    active = {
      root: overlay,
      mounted: mounted,
      destroy: function(){
        overlay.removeEventListener('click', closeClick);
        try { mounted.destroy(); } catch(e){}
        if(overlay.parentNode) overlay.parentNode.removeChild(overlay);
        active = null;
        emit('flowlogic:destroyed', status());
      }
    };
    emit('flowlogic:started', status());
    return active;
  }

  function destroy(){
    if(active && typeof active.destroy === 'function') active.destroy();
    active = null;
    return true;
  }

  function init(context){
    if(initialized) return status();
    initContext = context || {};
    initialized = true;
    emit('flowlogic:initialized', status());
    return status();
  }

  function selfCheck(){
    var s = status();
    if(s.id !== MODULE_ID) throw new Error('FlowLogic Status-ID fehlerhaft.');
    if(typeof start !== 'function' || typeof destroy !== 'function' || typeof mount !== 'function') throw new Error('FlowLogic API unvollstaendig.');
    if(!window.FlowLogicSchema || typeof window.FlowLogicSchema.validateScenario !== 'function') throw new Error('FlowLogic Schema-API fehlt.');
    if(!window.FlowLogicScenarios || typeof window.FlowLogicScenarios.validateAll !== 'function') throw new Error('FlowLogic Master-Szenarien fehlen.');
    if(!window.FlowLogicRenderer || typeof window.FlowLogicRenderer.renderSvgString !== 'function') throw new Error('FlowLogic SVG-Renderer fehlt.');
    if(!window.FlowLogicInput || typeof window.FlowLogicInput.createSession !== 'function') throw new Error('FlowLogic strukturierte Eingabe fehlt.');
    if(!window.FlowLogicScorer || typeof window.FlowLogicScorer.scoreSession !== 'function') throw new Error('FlowLogic Scoring-Engine fehlt.');
    if(!window.FlowLogicGenerator || typeof window.FlowLogicGenerator.createTask !== 'function') throw new Error('FlowLogic Generator fehlt.');
    return s;
  }


  function getManifest(){
    return {
      id: MODULE_ID,
      title: 'Ablaufplan-Detektiv',
      subtitle: 'Programmieren verstehen ohne Code',
      version: VERSION,
      packageType: 'standalone-module',
      category: 'it-fisi',
      entryOrder: [
        'flowlogic.selftest.js','flowlogic.schema.js','flowlogic.scenarios.js','flowlogic.mutations.js','flowlogic.validator.js',
        'flowlogic.renderer.js','flowlogic.input.js','flowlogic.scorer.js','flowlogic.generator.js','flowlogic.module.js'
      ],
      api: ['init(context)','mount(container, options)','start(options)','destroy()','status()','selfCheck()'],
      requires: ['DOM','SVG','CustomEvent'],
      optional: ['localStorage','Host storage adapter','Host auth adapter','Host analytics adapter']
    };
  }

  var api = {
    __version: VERSION,
    id: MODULE_ID,
    init: init,
    start: start,
    destroy: destroy,
    mount: mount,
    status: status,
    selfCheck: selfCheck,
    getManifest: getManifest
  };

  window.FlowLogicModule = Object.freeze(api);

  /* Phase 12: bewusst keine harte Kopplung an TrainerModules/AppModuleLoader.
     Host-Apps koennen FlowLogicModule ueber init/mount/start selbst integrieren. */

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase1.global-api', 'Phase 1: FlowLogic globale API vorhanden', function(t){
      t.assert(window.FlowLogicModule && window.FlowLogicModule.id === MODULE_ID, 'FlowLogicModule globale API fehlt.');
      t.assert(typeof window.FlowLogicModule.start === 'function', 'FlowLogicModule.start fehlt.');
      t.assert(typeof window.FlowLogicModule.destroy === 'function', 'FlowLogicModule.destroy fehlt.');
      t.assert(typeof window.FlowLogicModule.mount === 'function', 'FlowLogicModule.mount fehlt.');
      return window.FlowLogicModule.status();
    }, { phase:'1', critical:true });

    window.FlowLogicSelfTest.register('phase1.mount-destroy', 'Phase 1: Mount/Destroy ohne DOM-Leak', function(t){
      var host = document.createElement('div');
      host.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(host);
      var before = document.querySelectorAll('.flowlogic-mount').length;
      var handle = window.FlowLogicModule.mount(host, { mode:'selftest' });
      t.assert(handle && handle.root, 'mount() hat kein Handle geliefert.');
      t.assert(host.querySelector('.flowlogic-root'), 'FlowLogic Root wurde nicht gerendert.');
      handle.destroy();
      var after = document.querySelectorAll('.flowlogic-mount').length;
      if(host.parentNode) host.parentNode.removeChild(host);
      t.assert(after === before, 'FlowLogic Mount hat DOM-Reste hinterlassen.', { before:before, after:after });
      return { before:before, after:after };
    }, { phase:'1', critical:true });

    window.FlowLogicSelfTest.register('phase1.standalone-contract', 'Phase 1: Standalone-Modulvertrag vorhanden', function(t){
      t.assert(window.FlowLogicModule && window.FlowLogicModule.id === MODULE_ID, 'FlowLogicModule fehlt.');
      t.assert(typeof window.FlowLogicModule.init === 'function', 'init() fehlt.');
      t.assert(typeof window.FlowLogicModule.mount === 'function', 'mount() fehlt.');
      t.assert(typeof window.FlowLogicModule.start === 'function', 'start() fehlt.');
      t.assert(typeof window.FlowLogicModule.destroy === 'function', 'destroy() fehlt.');
      return { standalone:true, appRegistryRequired:false };
    }, { phase:'1', critical:true });

    window.FlowLogicSelfTest.register('phase1.idempotent-start', 'Phase 1: Start ist idempotent und zerstoert sauber', function(t){
      var a = window.FlowLogicModule.start({ mode:'selftest' });
      var b = window.FlowLogicModule.start({ mode:'selftest' });
      t.assert(a === b, 'start() erzeugt bei zweitem Aufruf ein zweites aktives Overlay.');
      t.assert(document.querySelectorAll('.flowlogic-overlay').length === 1, 'Mehr als ein FlowLogic Overlay aktiv.');
      window.FlowLogicModule.destroy();
      t.assert(document.querySelectorAll('.flowlogic-overlay').length === 0, 'destroy() entfernt Overlay nicht vollstaendig.');
      return { idempotent:true };
    }, { phase:'1', critical:true });
  }
})();
