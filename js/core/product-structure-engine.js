/* Eignungstest-Trainer · Product Structure Engine
   Phase 26: zentrale Produktlogik für Simulation Center, Training Center und spätere Novura Exams-Pool-Erweiterungen. */
(function(){
  'use strict';

  var VERSION = 'G54.3-phase27-product-structure';

  var SIMULATION_PROFILES = Object.freeze({
    'it:assessments': Object.freeze({ branch:'it', simType:'assessments', mode:'assessments', label:'IT / FISI · Novura Assessments', timePerQuestion:50, helpAllowed:false, coachDuring:false, coachAfter:true, pool:'it-assessments' }),
    'it:novuraExams': Object.freeze({ branch:'it', simType:'novuraExams', mode:'novuraExams', label:'IT / FISI · Novura Exams-Lohr', durationLabel:'ca. 33–35 Min.', timePerQuestion:null, helpAllowed:false, coachDuring:false, coachAfter:true, pool:'it-novura-exams', examStructure:'novura-exams-real' }),
    'sozial:assessments': Object.freeze({ branch:'sozial', simType:'assessments', mode:'assessments', label:'Sozialpädagogik · Novura Assessments', timePerQuestion:50, helpAllowed:false, coachDuring:false, coachAfter:true, pool:'sozial-assessments' }),
    'kaufm:assessments': Object.freeze({ branch:'kaufm', simType:'assessments', mode:'assessments', label:'Kaufmännisch · Novura Assessments', timePerQuestion:50, helpAllowed:false, coachDuring:false, coachAfter:true, pool:'kaufm-assessments' })
  });

  var TRAINING_TRACKS = Object.freeze({
    it: Object.freeze({ label:'IT / FISI Training', allowed:['math','logic','general','english','it','itSprint','matrixOnlySprint','techniqueSprint','python_quest'] }),
    sozial: Object.freeze({ label:'Sozialpädagogik Training', allowed:['math','sentenceSprint','english','general','paedagogik','situationen','textComprehensionSprint','logic'] }),
    kaufm: Object.freeze({ label:'Kaufmännisches Training', allowed:['math','kaufmRechnen','bueroWissen','sentenceSprint','english','general','logic'] })
  });

  function clone(v){ try{return JSON.parse(JSON.stringify(v));}catch(e){return v;} }
  function key(branch, simType){ return String(branch||'it') + ':' + String(simType||'assessments'); }
  function profile(branch, simType){ return SIMULATION_PROFILES[key(branch, simType)] || SIMULATION_PROFILES['it:assessments']; }
  function setBranch(branch){ try{ localStorage.setItem('assessments_branch', branch); }catch(e){} try{ if(window.AppModuleHost && typeof AppModuleHost.setBranch === 'function') AppModuleHost.setBranch(branch); }catch(e2){} }

  function closeUi(){
    try{ if(window.EGTUILayer && typeof EGTUILayer.closeSheet === 'function') EGTUILayer.closeSheet(); }catch(e){}
    try{ if(window.App && typeof App.closeTrainingSheet === 'function') App.closeTrainingSheet(); }catch(e2){}
  }

  function startSimulation(branch, simType, opts){
    var p = profile(branch, simType);
    opts = opts || {};
    setBranch(p.branch);
    closeUi();
    try{ localStorage.setItem('egt_last_simulation_profile', JSON.stringify(p)); }catch(e){}
    try{ window.EGT_ACTIVE_SIMULATION_PROFILE = clone(p); }catch(e0){}

    if(window.AppModuleHost && typeof AppModuleHost.startSimulation === 'function'){
      return !!AppModuleHost.startSimulation({
        branch: p.branch,
        mode: p.mode,
        testType: p.simType,
        timePerQuestion: p.timePerQuestion,
        helpAllowed: p.helpAllowed,
        coachDuring: p.coachDuring,
        poolKey: p.pool,
        title: p.label,
        source: opts.source || 'product-structure-engine'
      });
    }
    try{ if(window.App && typeof App.selectMode === 'function') App.selectMode(p.mode); }catch(e1){}
    try{ if(window.App && typeof App.prepareTest === 'function'){ App.prepareTest(); return true; } }catch(e2){}
    return false;
  }

  function startTrainingMode(mode, opts){
    opts = opts || {};
    closeUi();
    try{ window.EGT_ACTIVE_TRAINING_PROFILE = { mode: mode, helpAllowed:true, coachDuring:true, source:opts.source || 'product-structure-engine' }; }catch(e){}
    try{ if(window.App && typeof App.selectMode === 'function') App.selectMode(mode); }catch(e1){}
    try{ if(window.App && typeof App.prepareTest === 'function'){ App.prepareTest(); return true; } }catch(e2){}
    return false;
  }

  function startTrainingMix(branch, modes, opts){
    opts = opts || {};
    branch = branch || 'it';
    modes = Array.isArray(modes) ? modes.filter(Boolean) : [];
    var allowed = TRAINING_TRACKS[branch] ? TRAINING_TRACKS[branch].allowed : TRAINING_TRACKS.it.allowed;
    modes = modes.filter(function(m){ return allowed.indexOf(m) >= 0 || m === 'python_quest'; });
    if(!modes.length) modes = allowed.slice(0, 1);
    var profile = { branch: branch, modes: modes.slice(), helpAllowed:true, coachDuring:true, timeProfile:'training-normal', source:opts.source || 'product-structure-engine' };
    setBranch(branch);
    closeUi();
    try{ window.EGT_ACTIVE_TRAINING_MIX = clone(profile); }catch(e0){}
    try{ window.EGT_ACTIVE_TRAINING_PROFILE = clone(profile); }catch(e1){}
    try{ localStorage.setItem('EGT_ACTIVE_TRAINING_MIX', JSON.stringify(profile)); }catch(e2){}
    var first = modes[0];
    if(first === 'python_quest'){
      try{ if(window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function'){ EGTUILayer.openActionMenu('python'); return true; } }catch(e3){}
      try{ if(window.App && typeof App.openPythonQuest === 'function'){ App.openPythonQuest(); return true; } }catch(e4){}
      return true;
    }
    try{ if(window.App && typeof App.selectMode === 'function') App.selectMode(first); }catch(e5){}
    try{ if(window.App && typeof App.prepareTest === 'function'){ App.prepareTest(); return true; } }catch(e6){}
    return false;
  }

  function diagnostics(){
    return {
      version: VERSION,
      simulationProfiles: clone(SIMULATION_PROFILES),
      trainingTracks: clone(TRAINING_TRACKS),
      activeSimulationProfile: clone(window.EGT_ACTIVE_SIMULATION_PROFILE || null),
      activeTrainingProfile: clone(window.EGT_ACTIVE_TRAINING_PROFILE || null),
      activeTrainingMix: clone(window.EGT_ACTIVE_TRAINING_MIX || null)
    };
  }

  var api = Object.freeze({
    __version: VERSION,
    simulationProfiles: SIMULATION_PROFILES,
    trainingTracks: TRAINING_TRACKS,
    profile: profile,
    startSimulation: startSimulation,
    startTrainingMode: startTrainingMode,
    startTrainingMix: startTrainingMix,
    diagnostics: diagnostics
  });

  window.EGTProductStructureEngine = api;
  window.ProductStructureEngine = api;
})();
