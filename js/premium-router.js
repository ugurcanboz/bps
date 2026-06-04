/* Eignungstest-Trainer · UI-F2.4 Premium Router
   Ein zentraler, iPad-sicherer Interaction-Layer.
   Fix: Hitbox-Scan über echte Element-Rects + Close-Buttons werden nicht blockiert. */
(function(){
  'use strict';

  var ACTION_SELECTOR = '[data-wh-action]';
  var TAB_SELECTOR = '.wh-tab[data-tab]';
  var INTERACTIVE_SELECTOR = ACTION_SELECTOR + ', ' + TAB_SELECTOR;
  var CLOSE_SELECTOR = '[data-fb-close], .egt-admin-close, .training-sheet-close, .wh-sheet-close, .bps-sheet-close, .clean-sheet-close, .global-diagnostics-close, [aria-label*="Schließen"], [aria-label*="schließen"], [aria-label*="Close"], [aria-label*="close"]';
  var lastKey = '';
  var lastAt = 0;
  var downPoint = null;
  var MOVE_LIMIT = 22;

  function now(){ return Date.now ? Date.now() : new Date().getTime(); }
  function byId(id){ return document.getElementById(id); }
  function shell(){ return byId('whShell'); }
  function inShell(el){ var s=shell(); return !!(s && el && s.contains(el)); }
  function point(ev){
    var t = (ev.changedTouches && ev.changedTouches[0]) || (ev.touches && ev.touches[0]) || ev;
    return { x:Number(t.clientX || 0), y:Number(t.clientY || 0) };
  }
  function moved(ev){
    if (!downPoint) return false;
    var p = point(ev);
    return Math.abs(p.x - downPoint.x) > MOVE_LIMIT || Math.abs(p.y - downPoint.y) > MOVE_LIMIT;
  }
  function isVisible(el){
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect();
    return r.width > 8 && r.height > 8 && r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
  }
  function closeTarget(target){
    try { return target && target.closest ? target.closest(CLOSE_SELECTOR) : null; } catch(e){ return null; }
  }
  function closestInteractive(target){
    if (!target || !target.closest) return null;
    var el = target.closest(INTERACTIVE_SELECTOR);
    return (el && inShell(el)) ? el : null;
  }
  function rectInteractive(ev){
    var p = point(ev);
    var list = [];
    try { list = Array.prototype.slice.call(document.querySelectorAll('#whShell ' + INTERACTIVE_SELECTOR)); } catch(e) { return null; }
    var best = null;
    var bestArea = Infinity;
    for (var i=0; i<list.length; i++) {
      var el = list[i];
      if (!isVisible(el)) continue;
      var r = el.getBoundingClientRect();
      var pad = 6;
      if (p.x >= r.left - pad && p.x <= r.right + pad && p.y >= r.top - pad && p.y <= r.bottom + pad) {
        var area = Math.max(1, r.width * r.height);
        if (area < bestArea) { best = el; bestArea = area; }
      }
    }
    return best;
  }
  function interactiveFromEvent(ev){
    if (closeTarget(ev.target)) return null;
    return closestInteractive(ev.target) || rectInteractive(ev);
  }
  function actionKey(el){
    if (!el) return '';
    return [
      el.getAttribute('data-wh-action') || '',
      el.getAttribute('data-tab') || '',
      el.getAttribute('data-module') || '',
      el.getAttribute('data-branch') || '',
      el.id || ''
    ].join('|');
  }
  function dedupe(el){
    var key = actionKey(el);
    var t = now();
    var wait = 360;
    if (key === lastKey && (t - lastAt) < wait) return false;
    lastKey = key;
    lastAt = t;
    return true;
  }
  function stop(ev){
    try { if (ev.cancelable) ev.preventDefault(); } catch(e) {}
    try { ev.stopPropagation(); } catch(e) {}
  }
  function notice(msg){
    try { if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.notice === 'function') { window.EGTWordHubLayer.notice(msg); return; } } catch(e) {}
    try { console.info('[Eignungstest-Trainer]', msg); } catch(e) {}
  }
  function modules(){
    try { return (window.EGTWordHubLayer && Array.isArray(window.EGTWordHubLayer.modules)) ? window.EGTWordHubLayer.modules : []; }
    catch(e){ return []; }
  }
  function moduleById(id){
    var list = modules();
    for (var i=0; i<list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }
  function modeForModule(id){
    var map = {
      simulation:'ctcLohr', logik:'logic', matrizen:'matrixOnlySprint', mathe:'math', deutsch:'sentenceSprint',
      wissen:'general', englisch:'english', it:'it', konzentration:'concentrationPro', kaufmRechnen:'kaufmRechnen',
      bueroWissen:'bueroWissen', paedagogik:'paedagogik', situationen:'situationen', python_quest:'python_quest'
    };
    return map[id] || id || 'jogging';
  }
  function openSheetByModule(id){
    var mod = moduleById(id);
    try { if (mod && window.EGTWordHubLayer && typeof window.EGTWordHubLayer.openSheet === 'function') { window.EGTWordHubLayer.openSheet(mod); return true; } } catch(e) {}
    return false;
  }
  function switchTab(tab){
    tab = Number(tab) || 0;
    try { if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.switchTab === 'function') { window.EGTWordHubLayer.switchTab(tab); return true; } } catch(e) {}
    return false;
  }
  function trainingMenu(tab){
    try { if (tab && window.App && typeof window.App.setModeTab === 'function') { window.App.setModeTab(tab); return true; } } catch(e) {}
    try { if (window.App && typeof window.App.openTrainingSheet === 'function') { window.App.openTrainingSheet(tab); return true; } } catch(e) {}
    try { if (window.App && typeof window.App.setAppSection === 'function') { window.App.setAppSection('practice'); return true; } } catch(e) {}
    return false;
  }
  function selectMode(mode, autostart){
    try { if (window.App && typeof window.App.chooseTrainingMode === 'function') window.App.chooseTrainingMode(mode); } catch(e) {}
    try { if (window.App && typeof window.App.selectMode === 'function') window.App.selectMode(mode); } catch(e) {}
    try { if (autostart && window.App && typeof window.App.prepareTest === 'function') { window.App.prepareTest(); return true; } } catch(e) {}
    return trainingMenu();
  }
  function setBranch(branch){
    if (!branch) return;
    try { localStorage.setItem('bps_branch', branch); } catch(e) {}
    try { if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.refresh === 'function') window.EGTWordHubLayer.refresh(); } catch(e) {}
  }
  function openCoach(){
    try { if (window.EGTLearningCoach && typeof window.EGTLearningCoach.openHub === 'function') { window.EGTLearningCoach.openHub(); return true; } } catch(e) {}
    return switchTab(3);
  }
  function openAnalysis(){
    try { if (window.App && typeof window.App.showAnalysis === 'function') { window.App.showAnalysis(); return true; } } catch(e) {}
    return switchTab(2);
  }
  function pulse(el){
    try {
      el.classList.add('egt-action-pulse');
      setTimeout(function(){ try { el.classList.remove('egt-action-pulse'); } catch(e){} }, 220);
    } catch(e) {}
  }
  function handleAction(action, el){
    if (!action || !el) return false;
    var moduleId = el.getAttribute('data-module') || '';
    var branch = el.getAttribute('data-branch') || '';
    pulse(el);

    if (action === 'login') {
      try { if (window.EGTAdminPortal && typeof window.EGTAdminPortal.open === 'function') { window.EGTAdminPortal.open(); return true; } } catch(e) {}
      notice('Login wird vorbereitet.');
      return true;
    }
    if (action === 'start-training') {
      try { if (window.App && typeof window.App.quickStartRecommended === 'function') { window.App.quickStartRecommended('jogging'); return true; } } catch(e) {}
      return trainingMenu('simulation') || selectMode('jogging', false) || true;
    }
    if (action === 'area') {
      if (branch) setBranch(branch);
      if (moduleId && openSheetByModule(moduleId)) return true;
      return moduleId ? selectMode(modeForModule(moduleId), false) : true;
    }
    if (action === 'open-module') {
      if (moduleId && openSheetByModule(moduleId)) return true;
      return selectMode(modeForModule(moduleId), false);
    }
    if (action === 'practice') { switchTab(1); setTimeout(function(){ trainingMenu(); }, 90); return true; }
    if (action === 'learn') return trainingMenu('basic') || true;
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
  function run(el, ev){
    if (!el || !inShell(el)) return false;
    if (moved(ev)) return false;
    if (!dedupe(el)) return true;
    stop(ev);
    if (el.matches && el.matches(TAB_SELECTOR)) return switchTab(el.getAttribute('data-tab'));
    var action = el.getAttribute('data-wh-action');
    var ok = handleAction(action, el);
    if (!ok) notice('Diese Funktion ist gleich bereit.');
    return true;
  }
  function bindDirect(){
    var list;
    try { list = document.querySelectorAll('#whShell ' + INTERACTIVE_SELECTOR); } catch(e) { return; }
    for (var i=0; i<list.length; i++) {
      var el = list[i];
      if (el.__egtPremiumRouterBound) continue;
      el.__egtPremiumRouterBound = true;
      try { if (!el.hasAttribute('type') && el.tagName === 'BUTTON') el.setAttribute('type','button'); } catch(e) {}
      try { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0'); } catch(e) {}
      el.addEventListener('touchstart', function(ev){ downPoint = point(ev); }, { passive:true });
      el.addEventListener('pointerdown', function(ev){ downPoint = point(ev); }, { passive:true });
      el.addEventListener('touchend', function(ev){ if (closeTarget(ev.target)) return; run(this, ev); downPoint = null; }, { passive:false });
      el.addEventListener('pointerup', function(ev){ if (closeTarget(ev.target)) return; run(this, ev); downPoint = null; }, { passive:false });
      el.addEventListener('click', function(ev){ if (closeTarget(ev.target)) return; run(this, ev); }, false);
      el.addEventListener('keydown', function(ev){ if (ev.key === 'Enter' || ev.key === ' ') run(this, ev); }, false);
    }
  }
  function boot(){
    document.addEventListener('touchstart', function(ev){ if (closeTarget(ev.target)) return; if (interactiveFromEvent(ev)) downPoint = point(ev); }, { capture:true, passive:true });
    document.addEventListener('pointerdown', function(ev){ if (closeTarget(ev.target)) return; if (interactiveFromEvent(ev)) downPoint = point(ev); }, { capture:true, passive:true });
    document.addEventListener('touchend', function(ev){ if (closeTarget(ev.target)) return; var el = interactiveFromEvent(ev); if (el) run(el, ev); downPoint = null; }, { capture:true, passive:false });
    document.addEventListener('pointerup', function(ev){ if (closeTarget(ev.target)) return; var el = interactiveFromEvent(ev); if (el) run(el, ev); downPoint = null; }, { capture:true, passive:false });
    document.addEventListener('click', function(ev){ if (closeTarget(ev.target)) return; var el = interactiveFromEvent(ev); if (el) run(el, ev); }, { capture:true });
    document.addEventListener('keydown', function(ev){ if (ev.key !== 'Enter' && ev.key !== ' ') return; if (closeTarget(ev.target)) return; var el = interactiveFromEvent(ev); if (el) run(el, ev); }, { capture:true });

    bindDirect();
    setTimeout(bindDirect, 120);
    setTimeout(bindDirect, 600);
    setTimeout(bindDirect, 1500);
    try {
      var mo = new MutationObserver(function(){ bindDirect(); });
      mo.observe(document.documentElement || document.body, { childList:true, subtree:true });
    } catch(e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();

  window.EGTPremiumRouter = { handleAction: handleAction, switchTab: switchTab, bind: bindDirect };
})();
