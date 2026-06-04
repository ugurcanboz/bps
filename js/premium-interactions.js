/* Eignungstest-Trainer · UI-F2.1 iOS Touch Interaction Wiring
   Robuster Interaction-Layer für Desktop, iPhone und iPad.
   Verbindet Premium-Kacheln/Buttons/Bottom-Tabs per Event-Delegation.
   Keine Änderung an Aufgabenbank, Coach-DNA, Admin- oder Passwortkern. */
(function(){
  'use strict';

  var ACTION_SELECTOR = '[data-wh-action]';
  var TAB_SELECTOR = '.wh-tab[data-tab]';
  var lastTapKey = '';
  var lastTapTime = 0;
  var touchStart = null;
  var MOVE_TOLERANCE = 14;

  function now(){ return Date.now ? Date.now() : new Date().getTime(); }
  function $(id){ return document.getElementById(id); }
  function shell(){ return $('whShell'); }

  function insideShell(el){
    var s = shell();
    return !!(s && el && s.contains(el));
  }

  function eventPoint(ev){
    var t = ev.changedTouches && ev.changedTouches[0] || ev.touches && ev.touches[0] || ev;
    return { x: Number(t.clientX || 0), y: Number(t.clientY || 0) };
  }

  function movedTooFar(ev){
    if (!touchStart) return false;
    var p = eventPoint(ev);
    return Math.abs(p.x - touchStart.x) > MOVE_TOLERANCE || Math.abs(p.y - touchStart.y) > MOVE_TOLERANCE;
  }

  function closestFromEvent(ev){
    var target = ev.target;
    if (target && target.closest) {
      var a = target.closest(ACTION_SELECTOR);
      if (a && insideShell(a)) return { type:'action', el:a };
      var tab = target.closest(TAB_SELECTOR);
      if (tab && insideShell(tab)) return { type:'tab', el:tab };
    }

    // iOS fallback: sometimes touchend target is child/SVG or stale.
    var p = eventPoint(ev);
    var hit = null;
    try { hit = document.elementFromPoint(p.x, p.y); } catch(e) {}
    if (hit && hit.closest) {
      var a2 = hit.closest(ACTION_SELECTOR);
      if (a2 && insideShell(a2)) return { type:'action', el:a2 };
      var tab2 = hit.closest(TAB_SELECTOR);
      if (tab2 && insideShell(tab2)) return { type:'tab', el:tab2 };
    }
    return null;
  }

  function shouldHandle(kind, el, eventType){
    if (!el) return false;
    var key = kind + ':' + (el.getAttribute('data-wh-action') || el.getAttribute('data-tab') || el.id || el.className || '') + ':' + eventType;
    var t = now();
    // Prevent double-fire from touchend -> click, but allow separate taps.
    var coarse = false;
    try { coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches; } catch(e) {}
    var windowMs = coarse ? 520 : 180;
    var baseKey = kind + ':' + (el.getAttribute('data-wh-action') || el.getAttribute('data-tab') || el.id || el.className || '');
    if (lastTapKey === baseKey && (t - lastTapTime) < windowMs) return false;
    lastTapKey = baseKey;
    lastTapTime = t;
    return true;
  }

  function suppress(ev){
    try { ev.preventDefault(); } catch(e) {}
    try { ev.stopPropagation(); } catch(e) {}
    try { if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation(); } catch(e) {}
  }

  function notice(msg){
    try {
      if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.notice === 'function') {
        window.EGTWordHubLayer.notice(msg);
        return;
      }
    } catch(e) {}
    try { console.info('[Eignungstest-Trainer]', msg); } catch(e) {}
  }

  function modules(){
    try { return (window.EGTWordHubLayer && Array.isArray(window.EGTWordHubLayer.modules)) ? window.EGTWordHubLayer.modules : []; }
    catch(e) { return []; }
  }

  function moduleById(id){
    var list = modules();
    for (var i=0;i<list.length;i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }

  function modeForModule(moduleId){
    var map = {
      simulation: 'ctcLohr',
      logik: 'logic',
      matrizen: 'matrixOnlySprint',
      mathe: 'math',
      deutsch: 'sentenceSprint',
      wissen: 'general',
      englisch: 'english',
      it: 'it',
      konzentration: 'concentrationPro',
      kaufmRechnen: 'kaufmRechnen',
      bueroWissen: 'bueroWissen',
      paedagogik: 'paedagogik',
      situationen: 'situationen',
      python_quest: 'python_quest'
    };
    return map[moduleId] || moduleId || 'jogging';
  }

  function openModuleSheet(moduleId){
    var mod = moduleById(moduleId);
    if (mod && window.EGTWordHubLayer && typeof window.EGTWordHubLayer.openSheet === 'function') {
      window.EGTWordHubLayer.openSheet(mod);
      return true;
    }
    return false;
  }

  function openTrainingMenu(tab){
    try {
      if (tab && window.App && typeof window.App.setModeTab === 'function') { window.App.setModeTab(tab); return true; }
      if (window.App && typeof window.App.openTrainingSheet === 'function') { window.App.openTrainingSheet(tab); return true; }
      if (window.App && typeof window.App.setAppSection === 'function') { window.App.setAppSection('practice'); return true; }
    } catch(e) {}
    return false;
  }

  function selectTrainingMode(mode, autostart){
    try {
      if (window.App && typeof window.App.chooseTrainingMode === 'function') window.App.chooseTrainingMode(mode);
      else if (window.App && typeof window.App.selectMode === 'function') window.App.selectMode(mode);

      if (autostart && window.App && typeof window.App.prepareTest === 'function') window.App.prepareTest();
      else if (window.App && typeof window.App.openTrainingSheet === 'function') window.App.openTrainingSheet();
      return true;
    } catch(e) { return false; }
  }

  function openCoach(){
    try { if (window.EGTLearningCoach && typeof window.EGTLearningCoach.openHub === 'function') { window.EGTLearningCoach.openHub(); return true; } } catch(e) {}
    return switchTab(3);
  }

  function openAnalysis(){
    try { if (window.App && typeof window.App.showAnalysis === 'function') { window.App.showAnalysis(); return true; } } catch(e) {}
    return switchTab(2);
  }

  function switchTab(tab){
    try { if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.switchTab === 'function') { window.EGTWordHubLayer.switchTab(Number(tab)); return true; } } catch(e) {}
    // fallback: click original tab if available
    try {
      var btn = document.querySelector('.wh-tab[data-tab="' + Number(tab) + '"]');
      if (btn && typeof btn.click === 'function') { btn.click(); return true; }
    } catch(e) {}
    return false;
  }

  function openLogin(){
    try { if (window.EGTAdminPortal && typeof window.EGTAdminPortal.open === 'function') { window.EGTAdminPortal.open(); return true; } } catch(e) {}
    notice('Login wird vorbereitet.');
    return false;
  }

  function setBranch(branch){
    if (!branch) return;
    try { localStorage.setItem('bps_branch', branch); } catch(e) {}
    try { if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.refresh === 'function') window.EGTWordHubLayer.refresh(); } catch(e) {}
  }

  function pulse(btn){
    if (!btn || !btn.classList) return;
    btn.classList.add('egt-action-pulse');
    setTimeout(function(){ try { btn.classList.remove('egt-action-pulse'); } catch(e){} }, 260);
  }

  function handleAction(action, target){
    var moduleId = target.getAttribute('data-module') || '';
    var branch = target.getAttribute('data-branch') || '';
    pulse(target);

    if (action === 'login') return openLogin();

    if (action === 'start-training') {
      try { if (window.App && typeof window.App.quickStartRecommended === 'function') { window.App.quickStartRecommended('jogging'); return true; } } catch(e) {}
      return openTrainingMenu('simulation') || selectTrainingMode('jogging', false);
    }

    if (action === 'area') {
      if (branch) setBranch(branch);
      if (moduleId && openModuleSheet(moduleId)) return true;
      return selectTrainingMode(modeForModule(moduleId), false) || true;
    }

    if (action === 'open-module') {
      if (moduleId && openModuleSheet(moduleId)) return true;
      return selectTrainingMode(modeForModule(moduleId), false);
    }

    if (action === 'practice') { switchTab(1); setTimeout(function(){ openTrainingMenu(); }, 80); return true; }
    if (action === 'learn') return openTrainingMenu('basic');
    if (action === 'coach') return openCoach();
    if (action === 'analysis') return openAnalysis();
    if (action === 'progress') return switchTab(2);
    if (action === 'settings') return switchTab(4);

    if (action === 'feedback') {
      try { if (window.AppFeedback && typeof window.AppFeedback.openGeneralFeedbackSheet === 'function') { window.AppFeedback.openGeneralFeedbackSheet(); return true; } } catch(e) {}
      return switchTab(4);
    }
    return false;
  }

  function activate(match, ev){
    if (!match || !insideShell(match.el)) return false;
    if (movedTooFar(ev)) return false;
    if (!shouldHandle(match.type, match.el, ev.type)) return true;

    suppress(ev);

    var ok = false;
    try {
      if (match.type === 'tab') ok = switchTab(match.el.getAttribute('data-tab'));
      else ok = handleAction(match.el.getAttribute('data-wh-action'), match.el);
    } catch(err) { ok = false; }
    if (!ok) notice('Diese Funktion ist gleich bereit.');
    return true;
  }

  function bind(){
    document.addEventListener('touchstart', function(ev){
      var match = closestFromEvent(ev);
      if (!match) return;
      touchStart = eventPoint(ev);
    }, { capture:true, passive:true });

    document.addEventListener('touchend', function(ev){
      var match = closestFromEvent(ev);
      if (!match) return;
      activate(match, ev);
      touchStart = null;
    }, { capture:true, passive:false });

    document.addEventListener('pointerup', function(ev){
      var match = closestFromEvent(ev);
      if (!match) return;
      activate(match, ev);
    }, true);

    document.addEventListener('click', function(ev){
      var match = closestFromEvent(ev);
      if (!match) return;
      activate(match, ev);
    }, true);

    document.addEventListener('keydown', function(ev){
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var match = closestFromEvent(ev);
      if (!match) return;
      suppress(ev);
      activate(match, ev);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  window.EGTPremiumInteractions = {
    openModuleSheet: openModuleSheet,
    selectTrainingMode: selectTrainingMode,
    openTrainingMenu: openTrainingMenu,
    handleAction: handleAction,
    switchTab: switchTab
  };
})();
