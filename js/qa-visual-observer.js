/* Phase 39F · Visual Observer QA Cockpit
   Ziel: Browserinterne „Augen“ für ChatGPT/Entwicklungs-QA.
   Kein Nutzerfeature. Läuft nur in QA-Testseiten / ?qa=1 Kontext.
*/
(function(){
  'use strict';

  var VERSION = 'G54.39F-visual-observer';

  var DEFAULT_ACTIONS = [
    'simulation-center',
    'training-center',
    'analysis',
    'coach',
    'python-quest',
    'language-course-open',
    'more-menu',
    'admin-open',
    'settings',
    'feedback',
    'highscore-sheet',
    'duel-hub'
  ];

  var DEFAULT_TABS = ['home','training','progress','coach','more'];

  function now(){ return new Date().toISOString(); }
  function wait(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms); }); }

  function visible(el){
    if(!el) return false;
    var r=el.getBoundingClientRect();
    var cs=getComputedStyle(el);
    return r.width>0 && r.height>0 && cs.display!=='none' && cs.visibility!=='hidden' && cs.opacity !== '0';
  }

  function label(el){
    if(!el) return '';
    return (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.dataset.uiAction || el.dataset.tab || el.id || el.className || el.tagName || '')
      .trim().replace(/\s+/g,' ').slice(0,140);
  }

  function cssPath(el){
    if(!el || !el.tagName) return '';
    var parts=[];
    while(el && el.nodeType===1 && parts.length<5){
      var part=el.tagName.toLowerCase();
      if(el.id){ part += '#'+el.id; parts.unshift(part); break; }
      var cls=String(el.className||'').trim().split(/\s+/).filter(Boolean).slice(0,3);
      if(cls.length) part += '.'+cls.join('.');
      parts.unshift(part);
      el=el.parentElement;
    }
    return parts.join(' > ');
  }

  function rect(el){
    var r=el.getBoundingClientRect();
    return { x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height), top:Math.round(r.top), bottom:Math.round(r.bottom) };
  }

  function emitNotice(text, type){
    try {
      window.dispatchEvent(new CustomEvent('egt:notice', { detail:{ text:text, type:type||'info' }}));
    } catch(e){}
  }

  function qaSession(){
    return {
      source:'phase39f-visual-observer',
      role:'admin',
      nickname:'QA Visual Observer',
      email:'qa-visual@local.test',
      code:'QA-BYPASS-39F',
      groupId:'qa',
      qaBypass:true,
      updatedAt:now()
    };
  }

  function enableBypass(){
    try {
      localStorage.setItem('egt_qa_bypass_v1','1');
      localStorage.setItem('egt_auth_profile_session_v1', JSON.stringify(qaSession()));
      localStorage.setItem('egt_portal_role','admin');
      localStorage.setItem('egt_admin_open','1');
      localStorage.setItem('bps_branch','it');
    } catch(e){}
    try {
      if(window.EGTAuthEngine && typeof window.EGTAuthEngine.enableQaBypass === 'function'){
        window.EGTAuthEngine.enableQaBypass();
      }
    } catch(e){}
    try { window.dispatchEvent(new CustomEvent('egt:gate-status-changed', { detail:{ gateOpen:true, session:qaSession(), source:'phase39f-visual-observer' }})); } catch(e){}
  }

  function clearOverlays(){
    try { document.dispatchEvent(new KeyboardEvent('keydown', { key:'Escape', bubbles:true })); } catch(e){}
    [
      '#uiSheet','#bpsSheet','.ui-sheet','.bps-deep-sheet','.ui-sheet-backdrop','.bps-sheet-backdrop',
      '.python-quest-backdrop','.python-quest-modal','.egt-admin-modal','.clean-sheet-backdrop','.clean-sheet'
    ].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        el.classList.remove('show','is-visible','open','active');
        if(sel.indexOf('admin')>=0 && el.classList.contains('egt-admin-modal')) return;
      });
    });
    document.body.classList.remove('ui-overlay-open','egt-layer-open','egt-ui-layer-active','modal-open');
    document.documentElement.classList.remove('ui-overlay-open','egt-layer-open','modal-open');
  }

  function clickElement(el){
    if(!el) return false;
    try {
      el.scrollIntoView({ block:'center', inline:'center', behavior:'instant' });
    } catch(e){}
    try {
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true, cancelable:true, pointerType:'mouse' }));
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles:true, cancelable:true, view:window }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles:true, cancelable:true, view:window }));
      el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
      return true;
    } catch(e) {
      try { el.click(); return true; } catch(err) { return false; }
    }
  }

  function visibleElements(selector, limit){
    return Array.from(document.querySelectorAll(selector)).filter(visible).slice(0, limit || 300);
  }

  function collectButtons(){
    var selector=[
      'button',
      '[role="button"]',
      '[data-ui-action]',
      '[data-ui-nav="tab"]',
      '.ui-deep-card',
      '.ui-training-area-card',
      '.ui-quick-card',
      '.ui-foundation-menu-card',
      'summary'
    ].join(',');
    var seen=new Set();
    return visibleElements(selector, 900).filter(function(el){
      var key=cssPath(el)+'|'+label(el);
      if(seen.has(key)) return false;
      seen.add(key); return true;
    }).map(function(el){
      var r=rect(el);
      return {
        label:label(el),
        tag:el.tagName,
        action:el.dataset.uiAction||'',
        tab:el.dataset.tab||'',
        path:cssPath(el),
        rect:r,
        tooSmall:r.w<44 || r.h<44
      };
    });
  }

  function collectIcons(){
    var selector=[
      '.ui-area-icon','.ui-quick-icon','.ui-deep-card-icon','.ui-sim-hero-icon','.ui-mod-icon',
      '.egt-dock-icon','.ui-inline-icon','.ui-menu-card-icon','.la-part-icon','.la-level-icon'
    ].join(',');
    var emojiRe=/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u;
    return visibleElements(selector, 500).map(function(el){
      var r=rect(el);
      var text=(el.textContent||'').trim();
      return {
        label:label(el.parentElement||el),
        path:cssPath(el),
        rect:r,
        hasSvg:!!el.querySelector('svg'),
        hasImg:!!el.querySelector('img'),
        hasEmoji:emojiRe.test(text),
        text:text.slice(0,40),
        inconsistent:r.w>0 && r.h>0 && (r.w<16 || r.h<16 || r.w>96 || r.h>96)
      };
    });
  }

  function collectScrollContainers(){
    var all=Array.from(document.querySelectorAll('body, main, section, div, nav, aside, article, dialog'));
    return all.filter(function(el){
      if(!visible(el) && el !== document.body) return false;
      var cs=getComputedStyle(el);
      var oy=cs.overflowY;
      var ox=cs.overflowX;
      var scrollY=el.scrollHeight - el.clientHeight;
      var scrollX=el.scrollWidth - el.clientWidth;
      return scrollY>8 || scrollX>8 || /(auto|scroll|hidden)/.test(oy+ox);
    }).slice(0,250).map(function(el){
      var cs=getComputedStyle(el);
      var r=rect(el);
      return {
        label:label(el),
        path:cssPath(el),
        rect:r,
        overflowX:cs.overflowX,
        overflowY:cs.overflowY,
        scrollHeight:el.scrollHeight,
        clientHeight:el.clientHeight,
        scrollWidth:el.scrollWidth,
        clientWidth:el.clientWidth,
        scrollDeltaY:el.scrollHeight-el.clientHeight,
        scrollDeltaX:el.scrollWidth-el.clientWidth,
        position:cs.position,
        backdropFilter:cs.backdropFilter || cs.webkitBackdropFilter || ''
      };
    });
  }

  function collectLayoutIssues(){
    var issues=[];
    var doc=document.documentElement;
    var overflowX=Math.max(0, doc.scrollWidth-window.innerWidth);
    if(overflowX>1) issues.push({severity:'high', type:'horizontal-overflow', value:overflowX, message:'Dokument ist breiter als Viewport.'});

    collectButtons().forEach(function(b){
      if(b.tooSmall) issues.push({severity:'medium', type:'small-touch-target', element:b, message:'Interaktive Fläche unter 44px.'});
    });

    collectIcons().forEach(function(i){
      if(i.hasEmoji) issues.push({severity:'medium', type:'emoji-icon-visible', element:i, message:'Sichtbarer Emoji/Icon-Rest statt SVG.'});
      if(!i.hasSvg && !i.hasImg && i.text) issues.push({severity:'low', type:'text-icon-visible', element:i, message:'Icon-Container ohne SVG/IMG.'});
      if(i.inconsistent) issues.push({severity:'low', type:'icon-size-outlier', element:i, message:'Icon-Größe wirkt außerhalb des Normalbereichs.'});
    });

    var nestedScrolls=collectScrollContainers().filter(function(s){ return s.scrollDeltaY>80 && s.rect.h>80 && s.path !== 'body'; });
    if(nestedScrolls.length>8) issues.push({severity:'medium', type:'many-scroll-containers', count:nestedScrolls.length, sample:nestedScrolls.slice(0,10), message:'Viele vertikale Scrollcontainer sichtbar. Auf iOS kann das zäh wirken.'});

    var heavyEffects=collectScrollContainers().filter(function(s){ return s.backdropFilter && s.backdropFilter !== 'none'; });
    if(heavyEffects.length>4) issues.push({severity:'low', type:'many-backdrop-filters', count:heavyEffects.length, sample:heavyEffects.slice(0,8), message:'Viele Blur-/Backdrop-Flächen sichtbar. Performance-Risiko auf iOS.'});

    return issues;
  }

  function visualMapSvg(){
    var w=Math.max(320, window.innerWidth);
    var h=Math.min(Math.max(document.documentElement.scrollHeight, window.innerHeight), 2600);
    var colors={
      button:'#38bdf8',
      icon:'#a78bfa',
      scroll:'#f59e0b',
      issue:'#ef4444',
      sheet:'#22c55e'
    };
    function esc(s){ return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];}); }
    var out=['<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'];
    out.push('<rect width="100%" height="100%" fill="#020617"/>');
    out.push('<text x="12" y="24" fill="#e5e7eb" font-family="Arial" font-size="16" font-weight="700">Phase 39F Visual Map · '+esc(location.pathname+location.search)+' · '+w+'px</text>');

    collectScrollContainers().slice(0,70).forEach(function(s){
      var r=s.rect; if(r.y>h || r.w<20 || r.h<20) return;
      out.push('<rect x="'+r.x+'" y="'+Math.max(36,r.y)+'" width="'+r.w+'" height="'+r.h+'" fill="none" stroke="'+colors.scroll+'" stroke-width="1" stroke-dasharray="5 4" opacity=".45"/>');
    });

    collectIcons().slice(0,100).forEach(function(i){
      var r=i.rect; if(r.y>h || r.w<8 || r.h<8) return;
      out.push('<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" fill="none" stroke="'+(i.hasEmoji?colors.issue:colors.icon)+'" stroke-width="2" opacity=".85"/>');
    });

    collectButtons().slice(0,180).forEach(function(b){
      var r=b.rect; if(r.y>h || r.w<8 || r.h<8) return;
      out.push('<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" rx="8" fill="none" stroke="'+(b.tooSmall?colors.issue:colors.button)+'" stroke-width="'+(b.tooSmall?3:1.4)+'" opacity=".88"/>');
      if(b.tooSmall) out.push('<text x="'+(r.x+2)+'" y="'+(r.y+12)+'" fill="'+colors.issue+'" font-family="Arial" font-size="10">small</text>');
    });

    out.push('<text x="12" y="'+(h-16)+'" fill="#94a3b8" font-family="Arial" font-size="12">cyan=buttons · violet=icons · orange=scroll containers · red=issue</text>');
    out.push('</svg>');
    return out.join('');
  }

  function captureScreenState(name){
    var actions=Array.from(new Set(Array.from(document.querySelectorAll('[data-ui-action]')).map(function(x){return x.dataset.uiAction;}).filter(Boolean))).sort();
    var tabs=Array.from(new Set(Array.from(document.querySelectorAll('[data-ui-nav="tab"], #egtBottomDock [data-tab]')).map(function(x){return x.dataset.tab;}).filter(Boolean))).sort();
    var buttons=collectButtons();
    var icons=collectIcons();
    var scrolls=collectScrollContainers();
    var issues=collectLayoutIssues();
    return {
      name:name||'screen',
      url:location.href,
      title:document.title,
      time:now(),
      viewport:{ w:window.innerWidth, h:window.innerHeight, dpr:window.devicePixelRatio||1 },
      document:{ scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight, overflowX:Math.max(0, document.documentElement.scrollWidth-window.innerWidth) },
      bodyClass:document.body.className,
      actions:actions,
      tabs:tabs,
      counts:{
        visibleButtons:buttons.length,
        icons:icons.length,
        scrollContainers:scrolls.length,
        layoutIssues:issues.length,
        svg:document.querySelectorAll('svg').length,
        images:document.querySelectorAll('img').length
      },
      buttons:buttons.slice(0,260),
      icons:icons.slice(0,220),
      scrollContainers:scrolls.slice(0,180),
      issues:issues.slice(0,120),
      visualMapSvg:visualMapSvg()
    };
  }

  async function runAction(action){
    clearOverlays();
    await wait(120);
    var el=document.querySelector('[data-ui-action="'+action+'"]');
    var entry={action:action, exists:!!el, visible:visible(el), clicked:false, before:null, after:null, errors:[]};
    entry.before=captureScreenState('before:'+action);
    if(!el){
      entry.errors.push('Action nicht im DOM gefunden.');
      return entry;
    }
    entry.clicked=clickElement(el);
    await wait(700);
    entry.after=captureScreenState('after:'+action);
    entry.gateBlocked=Array.from(document.querySelectorAll('.egt-gate-screen,.egt-gate-root,[data-egt-gate]')).some(visible);
    entry.openedSomething=entry.after.bodyClass !== entry.before.bodyClass ||
      entry.after.counts.visibleButtons !== entry.before.counts.visibleButtons ||
      Array.from(document.querySelectorAll('#uiSheet,.ui-sheet,.bps-deep-sheet,.egt-admin-modal,.python-quest-modal')).some(visible);
    entry.ok=entry.exists && entry.clicked && !entry.gateBlocked;
    return entry;
  }

  async function runTab(tab){
    clearOverlays();
    await wait(120);
    var el=document.querySelector('[data-ui-nav="tab"][data-tab="'+tab+'"], #egtBottomDock [data-tab="'+tab+'"]');
    var entry={tab:tab, exists:!!el, visible:visible(el), clicked:false, after:null};
    if(el){
      entry.clicked=clickElement(el);
      await wait(350);
      entry.after=captureScreenState('tab:'+tab);
      entry.gateBlocked=Array.from(document.querySelectorAll('.egt-gate-screen,.egt-gate-root,[data-egt-gate]')).some(visible);
      entry.ok=entry.clicked && !entry.gateBlocked;
    } else {
      entry.ok=false;
    }
    return entry;
  }

  function discoverActions(){
    var actions=Array.from(new Set(Array.from(document.querySelectorAll('[data-ui-action]')).map(function(x){return x.dataset.uiAction;}).filter(Boolean)));
    DEFAULT_ACTIONS.forEach(function(a){ if(actions.indexOf(a)<0) actions.push(a); });
    return actions.filter(function(a){ return !/^(auth|egt-gate|profile-logout|clear-cache)$/.test(a); }).slice(0,80);
  }

  async function runFullObservation(options){
    options=options||{};
    enableBypass();
    emitNotice('Visual Observer QA läuft…', 'info');
    await wait(options.initialWait || 900);

    var result={
      version:VERSION,
      phase:'39F',
      time:now(),
      href:location.href,
      qaBypass:true,
      start:captureScreenState('start'),
      actions:[],
      tabs:[],
      final:null,
      summary:{ ok:true, high:0, medium:0, low:0, recommendations:[] }
    };

    var actions=(options.actions && options.actions.length ? options.actions : discoverActions());
    // Prioritize DEFAULT_ACTIONS first.
    actions=DEFAULT_ACTIONS.concat(actions.filter(function(a){ return DEFAULT_ACTIONS.indexOf(a)<0; }));

    for(var i=0;i<actions.length;i++){
      result.actions.push(await runAction(actions[i]));
    }

    var tabs=options.tabs || DEFAULT_TABS;
    for(var t=0;t<tabs.length;t++){
      result.tabs.push(await runTab(tabs[t]));
    }

    clearOverlays();
    await wait(200);
    result.final=captureScreenState('final');

    var allIssues=[];
    [result.start, result.final].forEach(function(s){ if(s && s.issues) allIssues=allIssues.concat(s.issues); });
    result.actions.forEach(function(a){ if(a.after && a.after.issues) allIssues=allIssues.concat(a.after.issues); });
    allIssues.forEach(function(issue){
      if(issue.severity==='high') result.summary.high++;
      else if(issue.severity==='medium') result.summary.medium++;
      else result.summary.low++;
    });

    var failedActions=result.actions.filter(function(a){ return !a.ok; });
    if(failedActions.length) result.summary.recommendations.push('Fehlerhafte/ungeöffnete Aktionen prüfen: '+failedActions.map(function(a){return a.action;}).slice(0,12).join(', '));
    if(result.summary.high>0) result.summary.recommendations.push('High-Severity Layoutprobleme zuerst beheben, vor allem horizontalen Overflow.');
    if(result.summary.medium>0) result.summary.recommendations.push('Medium-Severity Probleme prüfen: kleine Touchflächen, sichtbare Emoji-Reste, viele Scrollcontainer.');
    if(!result.summary.recommendations.length) result.summary.recommendations.push('Keine kritischen Auffälligkeiten im automatischen Observer-Lauf.');
    result.summary.ok = failedActions.length===0 && result.summary.high===0;
    window.__PHASE39F_VISUAL_OBSERVER_RESULT__=result;
    return result;
  }

  window.Phase39FVisualObserver = {
    version:VERSION,
    enableBypass:enableBypass,
    captureScreenState:captureScreenState,
    runAction:runAction,
    runTab:runTab,
    runFullObservation:runFullObservation,
    collectButtons:collectButtons,
    collectIcons:collectIcons,
    collectScrollContainers:collectScrollContainers,
    collectLayoutIssues:collectLayoutIssues,
    visualMapSvg:visualMapSvg
  };
})();
