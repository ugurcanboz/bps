/* Phase 39E · Full App Smoke Test Runner
   Browserinterner QA-Runner. Keine Produktfunktion, nur Testhilfe.
*/
(function(){
  'use strict';
  if(!(window.EGTSecurityContext && EGTSecurityContext.qaBypassAllowed && EGTSecurityContext.qaBypassAllowed())){
    try{ localStorage.removeItem('egt_qa_bypass_v1'); }catch(e){}
    return;
  }

  var ACTIONS = [
    'simulation-center',
    'training-center',
    'analysis',
    'coach',
    'python-quest',
    'language-course-open',
    'more-menu',
    'admin-open',
    'settings',
    'feedback'
  ];

  var TAB_TARGETS = ['home','training','progress','coach','more'];

  function visible(el){
    if(!el) return false;
    var r=el.getBoundingClientRect();
    var cs=getComputedStyle(el);
    return r.width>0 && r.height>0 && cs.display!=='none' && cs.visibility!=='hidden';
  }

  function qaSession(){
    return {
      source:'phase39e-smoke-test',
      role:'admin',
      nickname:'QA Smoke Tester',
      email:'qa@local.test',
      code:'QA-BYPASS-39E',
      groupId:'qa',
      qaBypass:true,
      updatedAt:new Date().toISOString()
    };
  }

  function enableBypass(){
    try {
      localStorage.setItem('egt_qa_bypass_v1','1');
      localStorage.setItem('egt_auth_profile_session_v1', JSON.stringify(qaSession()));
      localStorage.setItem('egt_portal_role','admin');
      localStorage.setItem('egt_admin_open','1');
    } catch(e){}
    try {
      if(window.EGTAuthEngine && typeof window.EGTAuthEngine.enableQaBypass === 'function'){
        window.EGTAuthEngine.enableQaBypass();
      }
    } catch(e){}
    try {
      window.dispatchEvent(new CustomEvent('egt:gate-status-changed', { detail:{ gateOpen:true, session:qaSession(), source:'phase39e-smoke-test' }}));
    } catch(e){}
  }

  function clearOverlays(){
    try { document.dispatchEvent(new KeyboardEvent('keydown', { key:'Escape', bubbles:true })); } catch(e){}
    ['#uiSheet','#assessmentsSheet','.ui-sheet','.assessments-deep-sheet','.python-quest-backdrop','.python-quest-modal'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        el.classList.remove('show','is-visible','open','active');
      });
    });
    document.body.classList.remove('ui-overlay-open','egt-layer-open','egt-ui-layer-active','modal-open');
    document.documentElement.classList.remove('ui-overlay-open','egt-layer-open','modal-open');
  }

  function clickElement(el){
    if(!el) return false;
    try {
      el.dispatchEvent(new MouseEvent('pointerdown', { bubbles:true, cancelable:true, view:window }));
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles:true, cancelable:true, view:window }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles:true, cancelable:true, view:window }));
      el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
      return true;
    } catch(e) {
      try { el.click(); return true; } catch(err) { return false; }
    }
  }

  function collectTouchIssues(){
    var selector = [
      'button',
      '[role="button"]',
      '.ui-deep-card',
      '.ui-training-area-card',
      '.ui-quick-card',
      '.ui-foundation-menu-card',
      'summary'
    ].join(',');
    return Array.from(document.querySelectorAll(selector)).filter(visible).map(function(el){
      var r=el.getBoundingClientRect();
      return {
        label:(el.innerText || el.getAttribute('aria-label') || el.dataset.uiAction || el.tagName || '').trim().replace(/\s+/g,' ').slice(0,90),
        tag:el.tagName,
        action:el.dataset.uiAction || '',
        cls:String(el.className || '').slice(0,120),
        w:Math.round(r.width),
        h:Math.round(r.height)
      };
    }).filter(function(x){ return x.w < 44 || x.h < 44; }).slice(0,60);
  }

  async function wait(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms); }); }

  async function runSmoke(){
    enableBypass();
    await wait(250);
    var errors = [];
    var result = {
      phase:'39E',
      time:new Date().toISOString(),
      href:location.href,
      qaBypassEnabled:false,
      actions:[],
      tabs:[],
      touchIssues:[],
      overflowX:0,
      gateVisible:false,
      consoleNote:'Console errors are collected by the test page when available.'
    };

    result.qaBypassEnabled = !!(window.EGTAuthEngine && (window.EGTAuthEngine.qaBypass || (window.EGTAuthEngine.gateStatus && window.EGTAuthEngine.gateStatus().reason === 'qa-bypass')));
    result.gateVisible = Array.from(document.querySelectorAll('.egt-gate-screen,.egt-gate-root,[data-egt-gate]')).some(visible);

    for (var i=0;i<ACTIONS.length;i++){
      clearOverlays();
      await wait(100);
      var action = ACTIONS[i];
      var el = document.querySelector('[data-ui-action="'+action+'"]');
      var entry = { action:action, exists:!!el, visible:visible(el), clicked:false, ok:false, after:{} };
      if(el){
        entry.clicked = clickElement(el);
        await wait(550);
        entry.after = {
          sheetVisible:Array.from(document.querySelectorAll('#uiSheet,.ui-sheet,.assessments-deep-sheet')).some(visible),
          adminVisible:Array.from(document.querySelectorAll('.egt-admin-modal,.egt-admin-panel,.egt-admin-shell,[data-admin-portal]')).some(visible),
          pythonVisible:Array.from(document.querySelectorAll('.python-quest-modal,.python-quest-backdrop')).some(visible),
          gateVisible:Array.from(document.querySelectorAll('.egt-gate-screen,.egt-gate-root,[data-egt-gate]')).some(visible),
          bodyClass:document.body.className
        };
        entry.ok = entry.clicked && !entry.after.gateVisible && (entry.after.sheetVisible || entry.after.adminVisible || entry.after.pythonVisible || action === 'settings' || action === 'feedback');
      }
      result.actions.push(entry);
    }

    for (var t=0;t<TAB_TARGETS.length;t++){
      clearOverlays();
      await wait(100);
      var tab=TAB_TARGETS[t];
      var tabEl=document.querySelector('[data-ui-nav="tab"][data-tab="'+tab+'"], #egtBottomDock [data-tab="'+tab+'"]');
      var tabEntry={tab:tab, exists:!!tabEl, visible:visible(tabEl), clicked:false, ok:false};
      if(tabEl){
        tabEntry.clicked=clickElement(tabEl);
        await wait(250);
        tabEntry.ok = tabEntry.clicked && !Array.from(document.querySelectorAll('.egt-gate-screen,.egt-gate-root,[data-egt-gate]')).some(visible);
      }
      result.tabs.push(tabEntry);
    }

    result.touchIssues = collectTouchIssues();
    result.overflowX = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
    result.gateVisible = Array.from(document.querySelectorAll('.egt-gate-screen,.egt-gate-root,[data-egt-gate]')).some(visible);
    result.passed = result.qaBypassEnabled && !result.gateVisible && result.actions.every(function(a){ return a.exists && a.clicked && !a.after.gateVisible; }) && result.touchIssues.length === 0 && result.overflowX <= 1;
    window.__PHASE39E_SMOKE_RESULT__ = result;
    return result;
  }

  window.Phase39ESmokeRunner = {
    version:'G54.39E',
    enableBypass:enableBypass,
    runSmoke:runSmoke,
    collectTouchIssues:collectTouchIssues
  };
})();
