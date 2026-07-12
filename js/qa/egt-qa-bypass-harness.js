/* G54.43.10S · QA-Bypass + Unified Review Routes
   Zweck: Login-Blockaden fuer echte QA umgehen, Direkt-Routen bereitstellen,
   100 virtuelle Nutzerlaeufe lokal simulieren und einen auswertbaren Bericht erzeugen.
   Aktiv nur ueber ?qa=1, ?qa=route:<name>, ?qaStress=100, #qa oder window.EGT_QA.
*/
(function(){
  'use strict';
  // G54.47.15I production guard
  if(window.EGTDOMSecurity && !EGTDOMSecurity.debugAllowed()) return;
  if(!(window.EGTSecurityContext && EGTSecurityContext.qaBypassAllowed && EGTSecurityContext.qaBypassAllowed())){
    try{ localStorage.removeItem('egt_qa_bypass_v1'); }catch(e){}
    return;
  }

  var VERSION = 'G54.43.10S-QA-BYPASS-UNIFIED-REVIEW-ROUTES-2026-06-26';
  var SESSION_KEY = 'egt_auth_profile_session_v1';
  var QA_BYPASS_KEY = 'egt_qa_bypass_v1';
  var REPORT_KEY = 'egt_qa_10l_last_report';
  var ROUTE_DELAY = 36;

  function now(){ return new Date().toISOString(); }
  function wait(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms || ROUTE_DELAY); }); }
  function safeString(v){ try { return String(v == null ? '' : v); } catch(e){ return ''; } }
  function clone(v){ try { return JSON.parse(JSON.stringify(v)); } catch(e){ return v; } }
  function qs(){ try { return new URLSearchParams(window.location.search || ''); } catch(e){ return { get:function(){return '';}, has:function(){return false;} }; } }
  function qaValue(){ var p=qs(); return safeString(p.get('qa') || p.get('qaMode') || '').trim(); }
  function isQa(){
    var p=qs(), q=qaValue().toLowerCase(), h=safeString(window.location.hash).toLowerCase();
    return q === '1' || q === 'true' || q === 'capture' || q === 'visual' || q.indexOf('route:') === 0 || p.has('autologin') || p.has('qaRoute') || p.has('qaStress') || h.indexOf('qa') >= 0;
  }
  function log(msg, detail){ try { console.info('[EGT_QA 10L]', msg, detail || ''); } catch(e){} }
  function warn(msg, detail){ try { console.warn('[EGT_QA 10L]', msg, detail || ''); } catch(e){} }
  function emit(name, detail){ try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch(e){} }
  var MEMORY_STORE = {};
  function storage(){ try { if (window.localStorage) return window.localStorage; } catch(e){} return null; }
  function localSetRaw(k,v){
    try { var st=storage(); if(st){ st.setItem(k, v); return true; } } catch(e){}
    try { MEMORY_STORE[k] = String(v); return true; } catch(e2){ return false; }
  }
  function localGetRaw(k){
    try { var st=storage(); if(st) return st.getItem(k); } catch(e){}
    return Object.prototype.hasOwnProperty.call(MEMORY_STORE, k) ? MEMORY_STORE[k] : null;
  }
  function localRemove(k){ try { var st=storage(); if(st) st.removeItem(k); } catch(e){} try { delete MEMORY_STORE[k]; } catch(e2){} }
  function localSet(k,v){ return localSetRaw(k, JSON.stringify(v)); }
  function localGet(k){ try { return JSON.parse(localGetRaw(k) || 'null'); } catch(e){ return null; } }

  function buildQaSession(extra){
    return Object.assign({
      source: 'G54.43.10S-qa-autologin',
      role: 'admin',
      nickname: 'QA Tester',
      displayName: 'QA Tester',
      email: 'qa@test.local',
      code: 'QA-10L-BYPASS',
      groupId: 'qa-10l',
      profileId: 'qa-10l-admin',
      qaBypass: true,
      qaHarnessVersion: VERSION,
      updatedAt: now()
    }, extra || {});
  }

  function autologin(extra){
    var session = buildQaSession(extra || {});
    localSetRaw(QA_BYPASS_KEY, '1');
    localSet(SESSION_KEY, session);
    localSet('egt_qa_mode_v1', { enabled:true, version:VERSION, route: routeFromUrl(), updatedAt:now() });
    localSetRaw('egtUserRole', 'admin');
    localSetRaw('egtUserName', session.nickname);
    localSetRaw('egtQaMode', 'true');
    try { document.documentElement.classList.add('egt-qa-10l-active'); document.body.classList.add('egt-qa-10l-active'); } catch(e){}
    emit('egt:auth-profile-updated', { session:session, gateOpen:true, source:'qa-10l' });
    emit('egt:gate-status-changed', { session:session, gateOpen:true, source:'qa-10l' });
    try { if (window.EGTAuthProfileShell && typeof EGTAuthProfileShell.refresh === 'function') EGTAuthProfileShell.refresh(); } catch(e){}
    try { if (window.updateLoginBtnState) window.updateLoginBtnState(); } catch(e){}
    log('QA-Autologin aktiv', session);
    return session;
  }

  function activeSheetInfo(){
    var sheet = null;
    try { sheet = document.querySelector('.ui-sheet.show,.ui-sheet.is-visible,.ui-deep-sheet.show,.ui-deep-sheet.is-visible,[role="dialog"].show,[role="dialog"].is-visible'); } catch(e){}
    if (!sheet) return null;
    var r = { width:0, height:0, top:0, left:0 };
    try { var rect = sheet.getBoundingClientRect(); r = { width:Math.round(rect.width), height:Math.round(rect.height), top:Math.round(rect.top), left:Math.round(rect.left) }; } catch(e){}
    return { text:safeString(sheet.textContent).trim().slice(0,180), className:sheet.className || '', rect:r };
  }
  function visibleTextSample(){
    var nodes=[];
    try { nodes = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,p,button,[data-ui-action]')).slice(0,80); } catch(e){}
    return nodes.filter(function(el){
      try { var r=el.getBoundingClientRect(), cs=getComputedStyle(el); return r.width>8 && r.height>8 && cs.display!=='none' && cs.visibility!=='hidden' && r.bottom>0 && r.top < (innerHeight||900); } catch(e){ return false; }
    }).map(function(el){ return safeString(el.textContent).replace(/\s+/g,' ').trim().slice(0,120); }).filter(Boolean).slice(0,15);
  }
  function screenHealth(routeName){
    var bodyText = '';
    try { bodyText = safeString(document.body && document.body.textContent).replace(/\s+/g,' ').trim(); } catch(e){}
    var important = visibleTextSample();
    var smallTargets = [];
    try {
      Array.prototype.slice.call(document.querySelectorAll('button,a,[role="button"],[data-ui-action]')).forEach(function(el){
        var r=el.getBoundingClientRect(), cs=getComputedStyle(el);
        if (r.width>0 && r.height>0 && cs.display!=='none' && cs.visibility!=='hidden' && r.bottom>0 && r.right>0 && r.top<(innerHeight||900) && r.left<(innerWidth||1200)) {
          if (r.width < 44 || r.height < 44) smallTargets.push({ text:safeString(el.textContent).replace(/\s+/g,' ').trim().slice(0,80), width:Math.round(r.width), height:Math.round(r.height) });
        }
      });
    } catch(e){}
    var pageOverflow = false;
    try { pageOverflow = (document.documentElement.scrollWidth || 0) > ((window.innerWidth || 0) + 2); } catch(e){}
    var warnings=[];
    if (!bodyText || bodyText.length < 50) warnings.push('Screen wirkt leer oder zu kurz.');
    if (!important.length) warnings.push('Keine sichtbaren Haupttexte/Buttons erkannt.');
    if (pageOverflow) warnings.push('Horizontaler Seiten-Overflow erkannt.');
    if (smallTargets.length) warnings.push(smallTargets.length + ' kleine Touch-Ziele sichtbar.');
    return { route:routeName || '', bodyTextLength:bodyText.length, visibleText:important, activeSheet:activeSheetInfo(), pageHorizontalOverflow:pageOverflow, smallTouchTargets:smallTargets.slice(0,12), warnings:warnings };
  }

  function clickFirst(selectors){
    selectors = Array.isArray(selectors) ? selectors : [selectors];
    for (var i=0;i<selectors.length;i++) {
      try {
        var el = document.querySelector(selectors[i]);
        if (el && typeof el.click === 'function') { el.click(); return true; }
      } catch(e){}
    }
    return false;
  }
  function startModule(id, payload){
    try { if (window.AppModuleHost && typeof AppModuleHost.startModule === 'function') return !!AppModuleHost.startModule(id, Object.assign({ source:'qa-10l-route' }, payload || {})); } catch(e){ warn('startModule failed: '+id, e); return false; }
    return false;
  }
  function openSheetModule(moduleId){
    try {
      if (window.EGTUILayer && typeof EGTUILayer.openSheet === 'function' && Array.isArray(EGTUILayer.modules)) {
        var mod = EGTUILayer.modules.filter(function(m){ return m && m.id === moduleId; })[0];
        if (mod) { EGTUILayer.openSheet(mod); return true; }
      }
    } catch(e){}
    return false;
  }
  function switchTab(tab){ try { if(window.EGTUILayer && typeof EGTUILayer.switchTab === 'function'){ EGTUILayer.switchTab(tab); return true; } } catch(e){} return false; }
  function openAction(kind){ try { if(window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function'){ return !!EGTUILayer.openActionMenu(kind); } } catch(e){} return false; }

  function closeTransientLayers(){
    try { if (window.EGTUILayer && typeof EGTUILayer.closeSheet === 'function') EGTUILayer.closeSheet(); } catch(e){}
    try { if (window.NovuraCoachSheet && typeof NovuraCoachSheet.close === 'function') NovuraCoachSheet.close(); } catch(e2){}
    try {
      Array.prototype.slice.call(document.querySelectorAll('.ui-sheet.show,.ui-sheet.is-visible,.ui-sheet-backdrop.show,.ui-sheet-backdrop.is-visible,.novura-coach-sheet.show,.novura-coach-sheet.is-visible,[role="dialog"].show,[role="dialog"].is-visible')).forEach(function(el){
        el.classList.remove('show','is-visible','active','open');
        if (el.className && String(el.className).indexOf('novura-coach-sheet') >= 0) el.style.transform = '';
      });
      document.documentElement.classList.remove('ui-overlay-open','novura-coach-open');
      document.body.classList.remove('ui-overlay-open','novura-coach-open');
    } catch(e3){}
  }

  var routeHandlers = {
    home: function(){ return startModule('home-entry') || switchTab('home') || clickFirst('[data-route="home"],.egt-dock-btn'); },
    training: function(){ return startModule('practice-entry', { mode:'practice' }) || openAction('practice') || switchTab('training') || clickFirst('[data-route="training"],[data-ui-action="practice"]'); },
    practice: function(){ return routeHandlers.training(); },
    simulation: function(){ return startModule('simulation-entry', { branch:'it', mode:'novuraExams' }) || startModule('simulation', { branch:'it' }) || openSheetModule('simulation') || openAction('simulation') || switchTab('simulation'); },
    analysis: function(){ return startModule('analysis-entry') || openAction('analysis') || switchTab('analysis'); },
    coach: function(){ return startModule('coach-entry') || openAction('coach') || clickFirst('#uiCoachCard,[data-module="coach_card"]'); },
    admin: function(){ return startModule('admin-entry') || clickFirst('#uiLoginBtn,[data-ui-action="login"],[data-route="login"]'); },
    profile: function(){ return startModule('profile-entry') || clickFirst('#uiLoginBtn,[data-ui-action="profile"]'); },
    highscore: function(){ return startModule('highscore-entry') || openAction('highscore'); },
    'language': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.open) { LanguageAcademyCourseEntry.open(); return true; } } catch(e){} return startModule('language-course-entry') || clickFirst('[data-ui-action="language-course-open"]'); },
    'language-de': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openGerman) { LanguageAcademyCourseEntry.openGerman(); return true; } } catch(e){} return routeHandlers.language(); },
    'language-en': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglish) { LanguageAcademyCourseEntry.openEnglish(); return true; } } catch(e){} return routeHandlers.language(); },
    'language-en-a1': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglishLevel) { LanguageAcademyCourseEntry.openEnglishLevel('en-a1'); return true; } } catch(e){} return routeHandlers['language-en'](); },
    'language-en-a2': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglishLevel) { LanguageAcademyCourseEntry.openEnglishLevel('en-a2'); return true; } } catch(e){} return routeHandlers['language-en'](); },
    'language-en-b1': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglishLevel) { LanguageAcademyCourseEntry.openEnglishLevel('en-b1'); return true; } } catch(e){} return routeHandlers['language-en'](); },
    'language-en-b2': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglishLevel) { LanguageAcademyCourseEntry.openEnglishLevel('en-b2'); return true; } } catch(e){} return routeHandlers['language-en'](); },
    'language-en-c1': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglishLevel) { LanguageAcademyCourseEntry.openEnglishLevel('en-c1'); return true; } } catch(e){} return routeHandlers['language-en'](); },
    'language-en-c2': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openEnglishLevel) { LanguageAcademyCourseEntry.openEnglishLevel('en-c2'); return true; } } catch(e){} return routeHandlers['language-en'](); },
    'language-de-a1': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openLevel) { LanguageAcademyCourseEntry.openLevel('a1'); return true; } } catch(e){} return routeHandlers['language-de'](); },
    'language-de-b2': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openLevel) { LanguageAcademyCourseEntry.openLevel('b2'); return true; } } catch(e){} return routeHandlers['language-de'](); },
    'language-placement': function(){ try { if(window.LanguageAcademyCourseEntry && LanguageAcademyCourseEntry.openPlacementTest) { LanguageAcademyCourseEntry.openPlacementTest(true); return true; } } catch(e){} return routeHandlers.language(); }
  };

  function normalizeRouteName(name){
    name = safeString(name || '').trim().toLowerCase();
    if (!name) return 'home';
    name = name.replace(/^route:/,'').replace(/_/g,'-');
    var aliases = { deutsch:'language-de', german:'language-de', englisch:'language-en', english:'language-en', en:'language-en', de:'language-de', a1:'language-de-a1', a2:'language-en-a2', b1:'language-en-b1', b2:'language-en-b2', c1:'language-en-c1', c2:'language-en-c2', sim:'simulation', analyse:'analysis', coach:'coach', admin:'admin' };
    return aliases[name] || name;
  }
  function routeFromUrl(){
    var p=qs(), q=qaValue();
    if (q.indexOf('route:') === 0) return normalizeRouteName(q);
    return normalizeRouteName(p.get('qaRoute') || p.get('route') || '');
  }

  async function openRoute(name, options){
    var route = normalizeRouteName(name);
    var handler = routeHandlers[route];
    var entry = { route:route, ok:false, warnings:[], startedAt:now(), finishedAt:null, health:null };
    if (!handler) { entry.warnings.push('Route unbekannt: '+route); entry.finishedAt=now(); return entry; }
    try { closeTransientLayers(); } catch(closeErr){}
    await wait(10);
    try { entry.ok = !!handler(options || {}); } catch(e){ entry.error = e && e.message ? e.message : String(e); entry.ok=false; }
    await wait((options && options.delay) || (route==='admin' || route==='coach' ? 96 : ROUTE_DELAY));
    entry.health = screenHealth(route);
    entry.warnings = entry.warnings.concat(entry.health.warnings || []);
    entry.finishedAt = now();
    return entry;
  }

  function apiStatus(){
    var mods=[];
    try { mods = window.AppModuleHost && AppModuleHost.listModules ? AppModuleHost.listModules() : []; } catch(e){}
    return {
      version:VERSION,
      href:window.location.href,
      build:(window.AppConfig && (AppConfig.fullVersion || AppConfig.build)) || window.TRAINER_BUILD_VERSION || '',
      appReady:!!window.App,
      moduleHost:!!window.AppModuleHost,
      uiLayer:!!window.EGTUILayer,
      authEngine:!!window.EGTAuthEngine,
      languageCourse:!!window.LanguageAcademyCourseEntry,
      languageExam:!!window.LanguageExamShell,
      simulation:!!window.EGTSimulation,
      modules:mods.map(function(m){ return { id:m.id, label:m.label, enabled:m.enabled !== false }; }).slice(0,80),
      localStorageUsable:(function(){ try { localSetRaw('__qa_probe','1'); localRemove('__qa_probe'); return true; } catch(e){ return false; } })()
    };
  }

  function contentReport(){
    var out = { ok:true, warnings:[], diagnostics:null, diversity:null };
    try { if (window.LanguageAcademyCourseEntry && typeof LanguageAcademyCourseEntry.diagnostics === 'function') out.diagnostics = LanguageAcademyCourseEntry.diagnostics(); } catch(e){ out.ok=false; out.warnings.push('Language diagnostics failed: '+(e.message||e)); }
    try { if (window.LanguageAcademyCourseEntry && typeof LanguageAcademyCourseEntry.taskDiversityReport === 'function') out.diversity = LanguageAcademyCourseEntry.taskDiversityReport(); } catch(e2){ out.ok=false; out.warnings.push('Language diversity failed: '+(e2.message||e2)); }
    try {
      var rep = out.diversity || {};
      if (rep.findings && rep.findings.length) { out.ok=false; out.warnings.push(rep.findings.length + ' Diversity-Findings im Sprachkurs.'); }
      if (rep.levels) {
        Object.keys(rep.levels).forEach(function(k){
          var l=rep.levels[k] || {};
          if (l.findings && l.findings.length) { out.ok=false; out.warnings.push(k+': '+l.findings.length+' Findings'); }
        });
      }
    } catch(e3){}
    return out;
  }

  function simulateUserStorage(userNo){
    var uid = 'qa10l-user-' + String(userNo).padStart(3,'0');
    try {
      localSetRaw('egt_qa_virtual_user_active', uid);
      localSetRaw('egt_qa_virtual_user_'+uid, JSON.stringify({ id:uid, startedAt:now(), role:userNo%10===0?'teacher':'participant', groupId:'qa-100', score:(userNo*7)%100, routeSeed:userNo%7 }));
      var results = localGet('egt_qa_virtual_results_v1') || [];
      results.push({ uid:uid, at:now(), module:userNo%3===0?'language-en':(userNo%3===1?'simulation':'training'), score:(userNo*11)%100, durationMs:60000+(userNo*137) });
      if (results.length > 140) results = results.slice(results.length-140);
      localSet('egt_qa_virtual_results_v1', results);
    } catch(e){ return { ok:false, error:e.message||String(e) }; }
    return { ok:true, uid:uid };
  }

  async function runRouteSmoke(options){
    options = options || {};
    var routes = options.routes || ['home','training','simulation','language-de','language-de-a1','language-en','language-en-a1','language-en-a2','language-en-b1','language-en-b2','language-en-c1','language-en-c2','analysis','coach','admin'];
    var entries=[];
    for (var i=0;i<routes.length;i++) entries.push(await openRoute(routes[i], { delay: options.delay || ROUTE_DELAY }));
    return { ok:entries.every(function(x){ return x.ok && !(x.warnings||[]).length; }), routes:entries };
  }

  async function runStressTest(options){
    options = options || {};
    var users = Math.max(1, Math.min(500, Number(options.users || qs().get('qaStress') || 100) || 100));
    autologin({ stressUsers:users });
    var started = performance && performance.now ? performance.now() : Date.now();
    var errors=[], warnings=[], routeSamples=[];
    var routeCycle = ['home','training','simulation','language-de','language-en-a1','language-en-a2','language-en-b1','language-en-b2','language-en-c1','language-en-c2','analysis','coach'];
    for (var i=1;i<=users;i++) {
      var st = simulateUserStorage(i);
      if (!st.ok) errors.push({ user:i, error:st.error });
      // Nicht jede virtuelle Person oeffnet jeden Screen sichtbar, sonst blockiert UI/Browser. Stichproben laufen echt durch, Rest belastet Storage/Generatoren.
      if (i <= 12 || i % 10 === 0 || i === users) {
        var route = routeCycle[i % routeCycle.length];
        var result = await openRoute(route, { delay: 18 });
        routeSamples.push(Object.assign({ user:i }, result));
        if (!result.ok) errors.push({ user:i, route:route, error:result.error || 'route failed' });
        (result.warnings || []).forEach(function(w){ warnings.push({ user:i, route:route, warning:w }); });
      }
    }
    var routeSmoke = await runRouteSmoke({ delay:24 });
    routeSmoke.routes.forEach(function(r){ (r.warnings||[]).forEach(function(w){ warnings.push({ route:r.route, warning:w, source:'routeSmoke' }); }); if(!r.ok) errors.push({ route:r.route, error:r.error || 'routeSmoke route failed' }); });
    var content = contentReport();
    (content.warnings || []).forEach(function(w){ warnings.push({ source:'content', warning:w }); });
    if (!content.ok) errors.push({ source:'content', error:'content report has findings' });
    var ended = performance && performance.now ? performance.now() : Date.now();
    var report = {
      version:VERSION,
      type:'G54.43.10S-qa-bypass-100-user-harness',
      status: errors.length ? 'warn' : (warnings.length ? 'pass-with-warnings' : 'pass'),
      users:users,
      startedAt:new Date(Date.now() - Math.max(0, ended-started)).toISOString(),
      finishedAt:now(),
      durationMs:Math.round(ended-started),
      api:apiStatus(),
      autologinActive:localGetRaw(QA_BYPASS_KEY)==='1',
      routeSamples:routeSamples,
      routeSmoke:routeSmoke,
      content:content,
      errors:errors.slice(0,80),
      warnings:warnings.slice(0,160),
      finalScreen:screenHealth('final')
    };
    localSet(REPORT_KEY, report);
    window.EGT_QA_LAST_REPORT = report;
    updatePanel(report);
    log('100-User-Stresstest fertig', report);
    return report;
  }

  function panelHtml(report){
    var status = report ? report.status : 'bereit';
    var users = report ? report.users : 100;
    var warns = report && report.warnings ? report.warnings.length : 0;
    var errs = report && report.errors ? report.errors.length : 0;
    return '<div class="egt-qa10l-head"><b>QA 10L</b><span>'+VERSION.replace('G54.43.10S-','')+'</span><button type="button" data-qa10l="close">×</button></div>'+
      '<div class="egt-qa10l-body"><p><b>Status:</b> '+status+'</p><p><b>User:</b> '+users+' · <b>Warn:</b> '+warns+' · <b>Err:</b> '+errs+'</p>'+
      '<div class="egt-qa10l-actions"><button type="button" data-qa10l="autologin">Autologin</button><button type="button" data-qa10l="stress">100-Test</button><button type="button" data-qa10l="routes">Routen</button><button type="button" data-qa10l="copy">Report kopieren</button></div>'+
      '<small>?qa=1&autologin=1&qaRoute=language-en-c2 oder ?qa=1&qaStress=100</small></div>';
  }
  function ensureStyle(){
    if (document.getElementById('egt-qa10l-style')) return;
    var style=document.createElement('style'); style.id='egt-qa10l-style';
    style.textContent='.egt-qa10l-panel{position:fixed;right:14px;bottom:14px;z-index:2147483200;width:min(360px,calc(100vw - 28px));background:rgba(2,6,23,.96);color:#e5eefc;border:1px solid rgba(125,211,252,.35);border-radius:18px;box-shadow:0 22px 70px rgba(0,0,0,.45);font:13px/1.35 system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}.egt-qa10l-head{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(14,165,233,.14)}.egt-qa10l-head b{font-size:14px}.egt-qa10l-head span{opacity:.72;flex:1;font-size:11px}.egt-qa10l-head button,.egt-qa10l-actions button{border:1px solid rgba(148,163,184,.35);background:rgba(15,23,42,.9);color:#fff;border-radius:10px;padding:7px 9px;min-height:36px}.egt-qa10l-body{padding:10px 12px}.egt-qa10l-body p{margin:.25rem 0}.egt-qa10l-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:9px 0}.egt-qa-10l-active .egt-gate-screen{display:none!important}';
    document.head.appendChild(style);
  }
  function ensurePanel(){
    if (!isQa()) return null;
    ensureStyle();
    var el=document.getElementById('egt-qa10l-panel');
    if (!el) { el=document.createElement('div'); el.id='egt-qa10l-panel'; el.className='egt-qa10l-panel'; document.body.appendChild(el); }
    el.innerHTML = panelHtml(window.EGT_QA_LAST_REPORT || localGet(REPORT_KEY));
    if (!el.__qa10lBound) {
      el.__qa10lBound=true;
      el.addEventListener('click', async function(ev){
        var a=ev.target && ev.target.getAttribute && ev.target.getAttribute('data-qa10l'); if(!a) return;
        ev.preventDefault();
        if (a==='close') { el.remove(); return; }
        if (a==='autologin') { autologin(); updatePanel(); return; }
        if (a==='stress') { el.querySelector('.egt-qa10l-body').insertAdjacentHTML('afterbegin','<p>Test läuft...</p>'); await runStressTest({ users:100 }); return; }
        if (a==='routes') { var r=await runRouteSmoke({ delay:28 }); var rep=Object.assign(localGet(REPORT_KEY)||{}, { status:r.ok?'routes-pass':'routes-warn', routeSmoke:r, finishedAt:now() }); localSet(REPORT_KEY, rep); window.EGT_QA_LAST_REPORT=rep; updatePanel(rep); return; }
        if (a==='copy') { copyReport(); return; }
      });
    }
    return el;
  }
  function updatePanel(report){ var el=document.getElementById('egt-qa10l-panel'); if(el) el.innerHTML=panelHtml(report || window.EGT_QA_LAST_REPORT || localGet(REPORT_KEY)); }
  function copyReport(){
    var report = window.EGT_QA_LAST_REPORT || localGet(REPORT_KEY) || { status:'no-report', api:apiStatus(), at:now() };
    var txt = JSON.stringify(report, null, 2);
    try { if(navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt); return true; } } catch(e){}
    try { window.prompt('QA-Report kopieren', txt); return true; } catch(e2){ return false; }
  }

  async function boot(){
    if (!isQa()) return;
    autologin();
    ensurePanel();
    await wait(80);
    var route = routeFromUrl();
    if (route) await openRoute(route, { delay:64 });
    var p=qs();
    if (p.has('qaStress')) await runStressTest({ users:Number(p.get('qaStress')||100) || 100 });
  }

  window.EGT_QA = Object.freeze({
    __version: VERSION,
    isQa: isQa,
    autologin: autologin,
    openRoute: openRoute,
    runRouteSmoke: runRouteSmoke,
    runStressTest: runStressTest,
    contentReport: contentReport,
    apiStatus: apiStatus,
    screenHealth: screenHealth,
    copyReport: copyReport,
    lastReport: function(){ return window.EGT_QA_LAST_REPORT || localGet(REPORT_KEY); },
    routes: Object.keys(routeHandlers)
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true }); else boot();
})();
