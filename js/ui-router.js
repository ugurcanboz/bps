/* Eignungstest-Trainer · UI-G20 Professional Content Registry
   Ein zentrales Tür-System: jede Tür öffnet über das Deep-Sheet-Fundament.
   Prinzip: UI ist das Haus, data-ui-action sind die Türen, Deep Sheet ist der zentrale Raum. */
(function(){
  'use strict';

  var ACTION_SELECTOR = '[data-ui-action], #egtBottomDock .egt-dock-btn[data-tab]';
  var CLOSE_SELECTOR = [
    '[data-close]', '[data-modal-close]', '[data-sheet-close]', '[data-overlay-close]',
    '.training-sheet-close', '.ui-sheet-close', '.bps-sheet-close', '.clean-sheet-close',
    '.global-diagnostics-close', '.python-quest-close', '.bps-coach-close',
    '#fbCloseBtn', '#fbCancelBtn', '#bpsSheetClose', '#bpsCoachClose', '#uiSheetClose', '#uiScanClose',
    '[aria-label*="Schließen"]', '[aria-label*="schließen"]', '[aria-label*="Close"]', '[aria-label*="close"]'
  ].join(',');
  var OVERLAY_SELECTOR = [
    '.bps-sheet-backdrop.show', '.bps-deep-sheet.show', '.ui-sheet-backdrop.show', '.ui-sheet.show',
    '.egt-admin-modal.show', '#egtPasswordChangeModal.show', '.update-modal-backdrop.is-visible', '.update-modal-card.is-visible',
    '.python-quest-backdrop.show', '.python-quest-shell.show', '.training-sheet-backdrop.show', '.training-sheet.show',
    '.clean-sheet-backdrop.show', '.clean-training-sheet.show', '.bps-coach-backdrop.show', '.bps-coach-sheet.show',
    '[data-overlay].show', '[data-overlay].is-visible', '[data-sheet].show', '[data-sheet].is-visible',
    '[data-modal].show', '[data-modal].is-visible', '[role="dialog"].show', '[role="dialog"].is-visible'
  ].join(',');
  var DIALOG_SELECTOR = [
    '.bps-deep-sheet.show', '.ui-sheet.show', '.egt-admin-panel', '.egt-admin-modal.show', '#egtPasswordChangeModal.show',
    '.update-modal-card.is-visible', '.python-quest-shell.show', '.training-sheet.show', '.clean-training-sheet.show',
    '.bps-coach-sheet.show', '[data-sheet].show', '[data-sheet].is-visible', '[data-modal].show', '[data-modal].is-visible',
    '[role="dialog"].show', '[role="dialog"].is-visible'
  ].join(',');
  var BACKDROP_SELECTOR = '.bps-sheet-backdrop,.ui-sheet-backdrop,.update-modal-backdrop,.python-quest-backdrop,.training-sheet-backdrop,.clean-sheet-backdrop,.bps-coach-backdrop,[data-overlay-backdrop]';
  var SCROLLABLE_SELECTOR = [
    '.bps-sheet-body', '.ui-sheet-body', '.egt-admin-body', '.egt-admin-list', '.update-modal-card',
    '.python-quest-body', '.python-quest-shell', '.training-sheet-content', '.training-sheet-router', '.training-mode-panel',
    '.clean-sheet-router', '.clean-mode-panel', '.clean-category-list', '.training-mode-list', '.bps-coach-body', '.bps-coach-sheet',
    '.bps-command-rewards', '.bps-path-steps', '[data-sheet-scroll]', '[data-modal-scroll]',
    'textarea', 'input', 'select', '[contenteditable="true"]'
  ].join(',');

  var lastKey = '';
  var lastAt = 0;
  var pointerStart = null;
  var handledPointerAt = 0;
  var lock = null;
  var touchY = 0;
  var syncTimer = 0;

  function now(){ return Date.now ? Date.now() : new Date().getTime(); }
  function qa(sel, root){ try { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); } catch(e){ return []; } }
  function q(sel, root){ try { return (root || document).querySelector(sel); } catch(e){ return null; } }
  function closest(el, sel){ try { return el && el.closest ? el.closest(sel) : null; } catch(e){ return null; } }
  function point(ev){ var t=(ev.changedTouches&&ev.changedTouches[0])||(ev.touches&&ev.touches[0])||ev; return {x:Number(t.clientX||0), y:Number(t.clientY||0)}; }
  function visible(el){
    if(!el || !el.getBoundingClientRect) return false;
    var cs=null; try{ cs=getComputedStyle(el); }catch(e){}
    if(cs && (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0)) return false;
    var r=el.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  }
  function lastVisible(sel){ var list=qa(sel).filter(visible); return list.length ? list[list.length-1] : null; }
  function activeDialog(){ return lastVisible(DIALOG_SELECTOR); }
  function activeOverlay(){ return lastVisible(OVERLAY_SELECTOR); }
  function layerOpen(){ return !!activeOverlay(); }
  function insideActiveDialog(el){ var d=activeDialog(); return !!(d && el && (d === el || d.contains(el))); }
  function inShell(el){ var s=document.getElementById('uiShell'); return !!(s && el && s.contains(el)); }

  function normalizeUI(){
    qa('#uiShell button').forEach(function(btn){ try{ if(!btn.hasAttribute('type')) btn.setAttribute('type','button'); }catch(e){} });
    qa(ACTION_SELECTOR).forEach(function(el){
      try{ if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0'); }catch(e){}
      try{ if(!el.hasAttribute('role') && el.tagName !== 'BUTTON') el.setAttribute('role','button'); }catch(e){}
    });
  }
  function notice(msg){ try{ if(window.EGTUILayer && typeof window.EGTUILayer.notice === 'function') { window.EGTUILayer.notice(msg); return; } }catch(e){} try{ console.info('[Eignungstest-Trainer]', msg); }catch(e){} }
  function modules(){ try{ return (window.EGTUILayer && Array.isArray(window.EGTUILayer.modules)) ? window.EGTUILayer.modules : []; }catch(e){ return []; } }
  function moduleById(id){ var list=modules(); for(var i=0;i<list.length;i++){ if(list[i] && list[i].id === id) return list[i]; } return null; }
  function modeForModule(id){
    var map={netzwerk:'it',hardware_os:'it',wirtschaft:'bueroWissen',din5008:'bueroWissen',kommunikation:'deutsch',entwicklung_bindung:'paedagogik',kommunikation_sozial:'situationen',recht_sozial:'paedagogik',doku_beobachtung:'paedagogik',simulation:'ctcLohr',logik:'logic',matrizen:'matrixOnlySprint',mathe:'math',deutsch:'sentenceSprint',wissen:'general',englisch:'english',it:'it',konzentration:'concentrationPro',kaufmRechnen:'kaufmRechnen',bueroWissen:'bueroWissen',paedagogik:'paedagogik',situationen:'situationen',python_quest:'python_quest'};
    return map[id] || id || 'jogging';
  }
  function syncSoon(delay){ clearTimeout(syncTimer); syncTimer=setTimeout(syncLayerState, delay || 32); }

  function openSheetByModule(id){
    var mod=moduleById(id);
    try{ if(mod && window.EGTUILayer && typeof window.EGTUILayer.openSheet === 'function'){ window.EGTUILayer.openSheet(mod); syncSoon(); return true; } }catch(e){ notice('Sheet-Fehler: '+(e.message||e)); }
    return false;
  }
  function switchTab(tab){
    tab=Number(tab)||0;
    try{ if(window.EGTUILayer && typeof window.EGTUILayer.switchTab === 'function'){ window.EGTUILayer.switchTab(tab); syncSoon(); return true; } }catch(e){ notice('Tab-Fehler: '+(e.message||e)); }
    return false;
  }

  function openActionMenu(kind){
    try{ if(window.EGTUILayer && typeof window.EGTUILayer.openActionMenu === 'function'){ var ok=window.EGTUILayer.openActionMenu(kind); syncSoon(); return !!ok; } }catch(e){ notice('Menü-Fehler: '+(e.message||e)); }
    return false;
  }

  function closeUiLayerBeforePortal(){
    try{ if(window.EGTUILayer && typeof window.EGTUILayer.closeSheet === 'function') window.EGTUILayer.closeSheet(); }catch(e){}
    try{ qa('.ui-sheet.show,.ui-sheet.is-visible,.ui-sheet-backdrop.show,.ui-sheet-backdrop.is-visible').forEach(function(el){ el.classList.remove('show','is-visible'); }); }catch(e){}
    try{ document.documentElement.classList.remove('ui-overlay-open'); document.body.classList.remove('ui-overlay-open'); }catch(e){}
  }
  function tryOpenAdminPortal(){
    try{ if(window.EGTAdminPortal && typeof window.EGTAdminPortal.open === 'function'){ window.EGTAdminPortal.open(); syncSoon(); return true; } }catch(e){ notice('Login-Fehler: '+(e.message||e)); return true; }
    return false;
  }
  function openCoreLogin(){
    closeUiLayerBeforePortal();
    if(tryOpenAdminPortal()) return true;
    setTimeout(function(){ if(!tryOpenAdminPortal()) notice('Login konnte nicht geöffnet werden. Bitte Seite neu laden.'); }, 60);
    return true;
  }
  function openCoreCoach(){ try{ if(window.EGTLearningCoach && typeof window.EGTLearningCoach.openHub === 'function'){ window.EGTLearningCoach.openHub(); syncSoon(); return true; } }catch(e){} return switchTab(3); }
  function openCoreAnalysis(){ try{ if(window.App && typeof window.App.showAnalysis === 'function'){ window.App.showAnalysis(); syncSoon(); return true; } }catch(e){} return openActionMenu('progress') || switchTab(2); }
  function openCoreFeedback(){ try{ if(window.AppFeedback && typeof window.AppFeedback.openGeneralFeedbackSheet === 'function'){ window.AppFeedback.openGeneralFeedbackSheet(); syncSoon(); return true; } }catch(e){} return openActionMenu('settings'); }

  function openPracticeFoundation(mode){
    var targetMode = mode === 'learn' ? 'learn' : 'practice';
    return openActionMenu(targetMode);
  }
  function trainingMenu(tab){
    try{ if(window.App && typeof window.App.openTrainingSheet === 'function'){ window.App.openTrainingSheet(tab); syncSoon(); return true; } }catch(e){}
    try{ if(tab && window.App && typeof window.App.setModeTab === 'function'){ window.App.setModeTab(tab); syncSoon(); return true; } }catch(e){}
    try{ if(window.App && typeof window.App.setAppSection === 'function'){ window.App.setAppSection('practice'); syncSoon(); return true; } }catch(e){}
    return false;
  }
  function selectMode(mode,start){
    try{ if(window.App && typeof window.App.selectMode === 'function'){ window.App.selectMode(mode, !!start); syncSoon(); return true; } }catch(e){}
    try{ if(window.App && typeof window.App.chooseTrainingMode === 'function'){ window.App.chooseTrainingMode(mode); syncSoon(); return true; } }catch(e){}
    return false;
  }
  function setBranch(branch){ if(!branch) return; try{ localStorage.setItem('bps_branch', branch); }catch(e){} try{ if(window.EGTUILayer && typeof window.EGTUILayer.refresh === 'function') window.EGTUILayer.refresh(); }catch(e){} }
  function openCoach(){ return openActionMenu('coach'); }
  function openAnalysis(){ return openActionMenu('analysis'); }

  function openModuleTarget(id){
    if(!id) return false;
    if(id === 'coach_card') return openCoach();
    if(id === 'analyse_card') return openAnalysis();
    if(id === 'scan_card') return openScan();
    if(id === 'python_quest') return openPythonQuest();
    return openSheetByModule(id) || selectMode(modeForModule(id), false);
  }
  function openScan(){ return openActionMenu('scan'); }
  function openCoreScan(){
    try{ if(window.EGTUILayer && typeof window.EGTUILayer.scan === 'function'){ window.EGTUILayer.scan(); syncSoon(); return true; } }catch(e){ notice('Scanner-Fehler: '+(e.message||e)); }
    return false;
  }
  function openPythonQuest(){ return openActionMenu('python'); }
  function openCorePythonQuest(){
    try{ if(window.PythonQuest && typeof window.PythonQuest.open === 'function'){ window.PythonQuest.open('dashboard'); syncSoon(); return true; } }catch(e){}
    notice('Python Quest nicht bereit.'); return false;
  }
  function setBranchFoundation(branch){
    if(!branch) return false;
    try{ if(window.EGTUILayer && typeof window.EGTUILayer.setBranch === 'function'){ window.EGTUILayer.setBranch(branch); syncSoon(); return true; } }catch(e){}
    setBranch(branch); return true;
  }
  function clearCachesFoundation(){
    try{ if(window.EGTUILayer && typeof window.EGTUILayer.clearCaches === 'function'){ window.EGTUILayer.clearCaches().then(function(){ notice('Cache gelöscht.'); }); return true; } }catch(e){}
    try{ if(window.PWAEngine && typeof window.PWAEngine.clearCaches === 'function'){ window.PWAEngine.clearCaches().then(function(){ notice('Cache gelöscht.'); }); return true; } }catch(e){}
    return false;
  }
  function backupFoundation(){ try{ if(window.App && typeof window.App.exportBackup === 'function'){ window.App.exportBackup(); notice('Backup wird exportiert…'); return true; } }catch(e){} return false; }
  function clearProgressFoundation(){ try{ if(!confirm('Gesamten Fortschritt löschen?')) return true; if(window.App && typeof window.App.clearProgress === 'function'){ window.App.clearProgress(); notice('Fortschritt gelöscht.'); syncSoon(); return true; } }catch(e){} return false; }

  function handleAction(action, el){
    if(!action || !el) return false;
    var moduleId=el.getAttribute('data-module') || '';
    var branch=el.getAttribute('data-branch') || '';
    /* Foundation rule: every door may carry a branch. The router applies it first,
       then opens the target. This makes training-area cards and future cards use
       the same house-door mechanism. */
    if(action && (/^(auth|profile)-/.test(action))) {
      try { if(window.EGTAuthProfileShell && typeof window.EGTAuthProfileShell.handleAction === 'function') { var handled = window.EGTAuthProfileShell.handleAction(action, el); if(handled) { syncSoon(); return true; } } } catch(e) { notice('Profil-Fehler: '+(e.message||e)); return true; }
      return false;
    }
    if(action === 'login') return openActionMenu('login');
    if(action === 'login-open-core') return openCoreLogin();
    if(action === 'branch-sheet') { try{ if(window.EGTUILayer && typeof window.EGTUILayer.openBranchSelection === 'function'){ window.EGTUILayer.openBranchSelection(true); syncSoon(); return true; } }catch(e){} return false; }
    if(action === 'set-branch') { var changed=setBranchFoundation(branch); try{ if(changed && window.EGTUILayer && typeof window.EGTUILayer.closeSheet === 'function') window.EGTUILayer.closeSheet(); }catch(e){} return changed; }
    if(action === 'branch-menu') { try{ if(window.EGTUILayer && typeof window.EGTUILayer.openBranchMenu === 'function'){ var opened = window.EGTUILayer.openBranchMenu(branch, moduleId); syncSoon(); return !!opened; } }catch(e){ notice('Menü-Fehler: '+(e.message||e)); } return false; }
    if(action === 'start-training') return openModuleTarget('simulation');
    if(action === 'duel-mode') { try{ if(window.App && typeof window.App.openDuellSetup === 'function'){ window.App.openDuellSetup(); return true; } }catch(e){ notice('Duell-Fehler: '+(e.message||e)); } return false; }
    if(action === 'highscore-sheet') { try{ if(window.EGTUILayer && typeof window.EGTUILayer.openHighscoreSheet === 'function'){ window.EGTUILayer.openHighscoreSheet(); return true; } }catch(e){ notice('Highscore-Fehler: '+(e.message||e)); } return false; }
    if(action === 'area' || action === 'open-module') {
      if(branch) setBranchFoundation(branch);
      if(moduleId) return openModuleTarget(moduleId);
      return !!branch;
    }
    if(action === 'python-quest') return openPythonQuest();
    if(action === 'python-quest-open-core') return openCorePythonQuest();
    if(action === 'scan') return openScan();
    if(action === 'scan-open-core') return openCoreScan();
    if(action === 'practice') return openPracticeFoundation('practice');
    if(action === 'learn') return openPracticeFoundation('learn');
    if(action === 'coach') return openCoach();
    if(action === 'coach-open-core') return openCoreCoach();
    if(action === 'analysis') return openAnalysis();
    if(action === 'analysis-open-core') return openCoreAnalysis();
    if(action === 'progress') return openActionMenu('progress');
    if(action === 'settings') return openActionMenu('settings');
    if(action === 'backup') return backupFoundation();
    if(action === 'clear-cache') return clearCachesFoundation();
    if(action === 'clear-progress') return clearProgressFoundation();
    if(action === 'feedback') return openActionMenu('feedback');
    if(action === 'feedback-open-core') return openCoreFeedback();
    return false;
  }

  function keyFor(el){ return [el.getAttribute('data-ui-action')||'',el.getAttribute('data-tab')||'',el.getAttribute('data-module')||'',el.getAttribute('data-branch')||'',el.id||''].join('|'); }
  function isDuplicate(el, windowMs){ var k=keyFor(el), t=now(); if(k===lastKey && (t-lastAt)<(windowMs||180)) return true; lastKey=k; lastAt=t; return false; }
  function movedTooFar(ev){ if(!pointerStart) return false; var p=point(ev); return Math.abs(p.x-pointerStart.x)>14 || Math.abs(p.y-pointerStart.y)>14; }
  function stop(ev){ try{ if(ev && ev.cancelable) ev.preventDefault(); }catch(e){} try{ if(ev) ev.stopPropagation(); }catch(e){} }
  function targetAction(ev){
    if(!ev || closest(ev.target, CLOSE_SELECTOR)) return null;
    var el=closest(ev.target, ACTION_SELECTOR);
    if(!el) return null;
    if(layerOpen()) { if(!insideActiveDialog(el)) return null; }
    else if(!inShell(el)) return null;
    return el;
  }
  function run(el, ev){
    if(!el || isDuplicate(el, 160)) return true;
    if(ev) stop(ev);
    try {
      if(window.EGTAuthProfileShell && typeof window.EGTAuthProfileShell.guardAction === 'function'){
        var gateAction = el.matches && el.matches('.egt-dock-btn[data-tab]') ? '' : (el.getAttribute('data-ui-action') || '');
        if(!window.EGTAuthProfileShell.guardAction(gateAction, el)) { syncSoon(); return true; }
      }
    } catch(gateError) { notice('Zugangsprüfung: '+(gateError.message||gateError)); return true; }
    var ok=false;
    if(el.matches && el.matches('.egt-dock-btn[data-tab]')) {
      var tab = String(el.getAttribute('data-tab') || '0');
      if(tab === '0') ok=switchTab(0);
      else if(tab === '1') ok=openActionMenu('practice');
      else if(tab === '2') ok=openActionMenu('progress');
      else if(tab === '3') ok=openActionMenu('coach');
      else if(tab === '4') ok=openActionMenu('settings');
      else ok=switchTab(tab);
    }
    else ok=handleAction(el.getAttribute('data-ui-action'), el);
    if(!ok) notice('Aktion nicht verfügbar: '+(el.getAttribute('data-ui-action') || el.getAttribute('data-tab') || 'unbekannt'));
    return true;
  }

  function onPointerDown(ev){ var el=targetAction(ev); if(!el) return; pointerStart=point(ev); }
  function onPointerUp(ev){ var el=targetAction(ev); if(!el) return; if(movedTooFar(ev)){ pointerStart=null; return; } handledPointerAt=now(); run(el, ev); pointerStart=null; }
  function onClick(ev){ var el=targetAction(ev); if(!el) return; if(now()-handledPointerAt < 380){ stop(ev); return; } run(el, ev); }
  function onKey(ev){ if(ev.key !== 'Enter' && ev.key !== ' ') return; var el=targetAction(ev); if(el) run(el, ev); }

  function callKnownClose(target){
    var handled=false;
    if(closest(target,'.bps-coach-sheet,.bps-coach-backdrop')){ try{ if(window.EGTLearningCoach && typeof window.EGTLearningCoach.close === 'function'){ window.EGTLearningCoach.close(); handled=true; } }catch(e){} qa('.bps-coach-backdrop.show,.bps-coach-sheet.show').forEach(function(el){ el.classList.remove('show'); handled=true; }); }
    if(closest(target,'.bps-deep-sheet,.bps-sheet-backdrop,.training-sheet,.training-sheet-backdrop,.clean-training-sheet,.clean-sheet-backdrop')){ try{ if(window.EGTTrainerDeepSheet && typeof window.EGTTrainerDeepSheet.close === 'function'){ window.EGTTrainerDeepSheet.close(); handled=true; } }catch(e){} try{ if(window.App && typeof window.App.closeTrainingSheet === 'function'){ window.App.closeTrainingSheet(); handled=true; } }catch(e){} qa('.bps-deep-sheet.show,.bps-sheet-backdrop.show,.training-sheet.show,.training-sheet-backdrop.show,.clean-training-sheet.show,.clean-sheet-backdrop.show').forEach(function(el){ el.classList.remove('show'); handled=true; }); }
    if(closest(target,'.ui-sheet,.ui-sheet-backdrop')){ try{ if(window.EGTUILayer && typeof window.EGTUILayer.closeSheet === 'function'){ window.EGTUILayer.closeSheet(); handled=true; } }catch(e){} qa('.ui-sheet.show,.ui-sheet-backdrop.show').forEach(function(el){ el.classList.remove('show'); handled=true; }); }
    if(closest(target,'.egt-admin-modal,.egt-admin-panel')){ qa('.egt-admin-modal.show,#egtPasswordChangeModal.show').forEach(function(el){ el.classList.remove('show'); handled=true; }); }
    if(closest(target,'.python-quest-backdrop,.python-quest-shell')){ qa('.python-quest-backdrop.show,.python-quest-shell.show').forEach(function(el){ el.classList.remove('show'); handled=true; }); }
    if(closest(target,'.update-modal-backdrop,.update-modal-card')){ qa('.update-modal-backdrop.is-visible,.update-modal-card.is-visible').forEach(function(el){ el.classList.remove('is-visible'); handled=true; }); }
    return handled;
  }
  function genericClose(target){
    var handled=callKnownClose(target);
    var layer=closest(target, DIALOG_SELECTOR) || activeDialog();
    if(layer){ try{ layer.classList.remove('show','is-visible','open'); handled=true; }catch(e){} }
    qa(BACKDROP_SELECTOR).forEach(function(el){ if(visible(el)){ try{ el.classList.remove('show','is-visible','open'); handled=true; }catch(e){} } });
    syncSoon(); return handled;
  }
  function closeHandler(ev){ var closeBtn=closest(ev.target, CLOSE_SELECTOR); var backdrop=closest(ev.target, BACKDROP_SELECTOR); if(!closeBtn && !(backdrop && ev.target===backdrop)) return; if(genericClose(ev.target)) stop(ev); }
  function escHandler(ev){ if(ev.key === 'Escape' && layerOpen()){ genericClose(activeDialog() || activeOverlay() || document.body); stop(ev); } }

  function saveLock(){
    var y=window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    lock={y:y, bodyPosition:document.body.style.position, bodyTop:document.body.style.top, bodyLeft:document.body.style.left, bodyRight:document.body.style.right, bodyWidth:document.body.style.width, htmlOverflow:document.documentElement.style.overflow, bodyOverflow:document.body.style.overflow, bodyTouch:document.body.style.touchAction};
    document.documentElement.classList.add('egt-layer-open'); document.body.classList.add('egt-layer-open','egt-ui-layer-active');
    document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden'; document.body.style.position='fixed'; document.body.style.top=(-y)+'px'; document.body.style.left='0'; document.body.style.right='0'; document.body.style.width='100%'; document.body.style.touchAction='none';
  }
  function releaseLock(){
    if(!lock) return;
    document.documentElement.classList.remove('egt-layer-open'); document.body.classList.remove('egt-layer-open','egt-ui-layer-active');
    document.documentElement.style.overflow=lock.htmlOverflow||''; document.body.style.overflow=lock.bodyOverflow||''; document.body.style.position=lock.bodyPosition||''; document.body.style.top=lock.bodyTop||''; document.body.style.left=lock.bodyLeft||''; document.body.style.right=lock.bodyRight||''; document.body.style.width=lock.bodyWidth||''; document.body.style.touchAction=lock.bodyTouch||'';
    var y=lock.y||0; lock=null; try{ window.scrollTo(0,y); }catch(e){}
  }
  function syncLayerState(){ normalizeUI(); if(layerOpen()){ if(!lock) saveLock(); } else releaseLock(); }

  function scrollableInLayer(target){
    var dialog=activeDialog(); if(!dialog) return null;
    var node=target;
    while(node && node!==document.body && node!==document.documentElement){
      if(node.nodeType===1 && dialog.contains(node)){
        if(node.matches && node.matches(SCROLLABLE_SELECTOR)) return node;
        var cs=null; try{ cs=getComputedStyle(node); }catch(e){}
        if(cs && /(auto|scroll)/.test(cs.overflowY) && node.scrollHeight > node.clientHeight + 2) return node;
      }
      node=node.parentElement;
    }
    return dialog.scrollHeight > dialog.clientHeight + 2 ? dialog : null;
  }
  function canScroll(scroller, dy){
    if(!scroller) return false;
    if(/INPUT|TEXTAREA|SELECT/.test(scroller.tagName||'')) return true;
    var top=scroller.scrollTop||0, max=Math.max(0, scroller.scrollHeight-scroller.clientHeight);
    if(max<=1) return false; if(dy<0 && top<=0) return false; if(dy>0 && top>=max-1) return false; return true;
  }
  function touchStart(ev){ touchY=point(ev).y; }
  function touchMove(ev){ if(!layerOpen()) return; var p=point(ev), dy=touchY-p.y; touchY=p.y; var sc=scrollableInLayer(ev.target); if(!sc || !canScroll(sc, dy)){ try{ if(ev.cancelable) ev.preventDefault(); }catch(e){} } }
  function wheelGuard(ev){ if(!layerOpen()) return; var sc=scrollableInLayer(ev.target); if(!sc || !canScroll(sc, ev.deltaY||0)){ try{ if(ev.cancelable) ev.preventDefault(); }catch(e){} } }

  function boot(){
    normalizeUI();
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('click', closeHandler, true);
    document.addEventListener('touchend', closeHandler, {capture:true, passive:false});
    document.addEventListener('keydown', escHandler, true);
    document.addEventListener('touchstart', touchStart, {capture:true, passive:true});
    document.addEventListener('touchmove', touchMove, {capture:true, passive:false});
    document.addEventListener('wheel', wheelGuard, {capture:true, passive:false});
    try{ var mo=new MutationObserver(function(){ syncSoon(80); }); mo.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class','hidden','aria-hidden']}); }catch(e){}
    syncSoon(10);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
  window.EGTUIRouter = { handleAction:handleAction, switchTab:switchTab, sync:syncSoon, close:function(){ return genericClose(activeDialog() || activeOverlay() || document.body); } };
})();
