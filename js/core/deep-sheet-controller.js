(function(){
  'use strict';

  const VERSION = '8.3.0';
  const SHEET_ID = 'bpsDeepSheet';
  const BACKDROP_ID = 'bpsDeepSheetBackdrop';
  const BODY_ID = 'bpsDeepSheetBody';
  const STYLE_CLASS = 'bps-sheet-open';

  const CATEGORIES = [
    {key:'simulation', label:'Simulationen', icon:'🎯', note:'BPS, CTC, Elite und kurze Testläufe.', modes:['ctcLohr','bps','ctc','jogging']},
    {key:'math', label:'Mathe', icon:'➗', note:'Kopfrechnen, Textaufgaben, Algebra, Prozent, Brüche und Dreisatz.', modes:['math','mathSprint','textMathSprint','algebraSprint','numberSeriesBookSprint']},
    {key:'logic', label:'Logik', icon:'🧩', note:'Zahlenreihen, Muster, Symbolarithmetik, Aussagen- und Verhältnislogik.', modes:['logic','logicSprint','symbolLogicSprint','statementLogicSprint','ratioLogicSprint']},
    {key:'matrix', label:'Matrizen', icon:'▦', note:'PDF-Matrizen und visuelle Matrixmuster.', modes:['matrixOnlySprint']},
    {key:'visual', label:'Visual IQ', icon:'👁️', note:'Route Memory, räumliches Denken und visuelle Buchlogik.', modes:['visualIQ','visualIQSprint','visualLogicBookSprint','routeMemoryMode']},
    {key:'language', label:'Sprache', icon:'✍️', note:'Englisch, Textverständnis, Grammatik und Satzergänzung.', modes:['english','sentenceSprint','textComprehensionSprint']},
    {key:'knowledge', label:'Wissen', icon:'📚', note:'Allgemeinwissen und schnelle Fakten aus Buch und Generator.', modes:['general','knowledgeSprint','generalKnowledgeBookSprint']},
    {key:'focus', label:'Konzentration', icon:'⚡', note:'Tempo, Aufmerksamkeit und Fehlertraining.', modes:['concentrationPro','concentrationSprint','errorTrainingPrep']},
    {key:'it', label:'IT/FISI', icon:'🖥️', note:'Netzwerk, Hardware, Security und FISI-Basis.', modes:['it','itSprint']},
    {key:'technique', label:'Technik', icon:'⚙️', note:'Mechanik, Strom, Hebel, Rollen und Zahnräder.', modes:['techniqueSprint']}
  ];

  let patched = false;
  let original = {};
  let activeCategory = 0;
  let startY = 0;
  let dragY = 0;
  let dragging = false;
  let scrollYBeforeOpen = 0;
  let bodyLockActive = false;

  const $ = (id)=>document.getElementById(id);
  const esc = (value)=>String(value == null ? '' : value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const appReady = ()=>!!(window.App && App._test && App._test.MODES && App._test.state);
  const modeTitle = (mode, key)=>String((mode && mode.title) || key || 'Training').replace(/^\d+\.\s*/, '');

  function validModes(){ return appReady() ? App._test.MODES : {}; }
  function state(){ return App._test.state; }

  function allCategorizedModes(){
    const MODES = validModes();
    const seen = new Set();
    CATEGORIES.forEach(cat => cat.modes.forEach(key => { if(MODES[key]) seen.add(key); }));
    Object.keys(MODES).forEach(key => { if(!seen.has(key)) seen.add(key); });
    return Array.from(seen);
  }

  function modesForCategory(cat){
    const MODES = validModes();
    return (cat && cat.modes ? cat.modes : []).filter(key => !!MODES[key]);
  }

  function categoryIndexForMode(modeKey){
    const idx = CATEGORIES.findIndex(cat => cat.modes.includes(modeKey));
    return idx >= 0 ? idx : 0;
  }

  function selectedMode(){
    if(!appReady()) return 'ctcLohr';
    const MODES = validModes();
    return MODES[state().selectedMode] ? state().selectedMode : (MODES.ctcLohr ? 'ctcLohr' : Object.keys(MODES)[0]);
  }

  function selectMode(modeKey){
    const MODES = validModes();
    if(!MODES[modeKey]) return false;
    state().selectedMode = modeKey;
    state().activeAppSection = 'practice';
    state().activeSheetCategory = categoryIndexForMode(modeKey);
    activeCategory = state().activeSheetCategory;
    document.body.dataset.appSection = 'practice';
    return true;
  }

  function setViewportVars(){
    const vv = window.visualViewport;
    const width = vv ? vv.width : window.innerWidth;
    const height = vv ? vv.height : window.innerHeight;
    const isTouch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isLandscape = width > height;
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);
    // Universal classification: not model based. iPhone/Android landscape often has width > 760,
    // therefore we classify by touch + short side as well as raw width.
    const isMobile = width <= 760 || (isTouch && shortSide <= 540 && longSide <= 980);
    const isTablet = !isMobile && (width <= 1180 || (isTouch && shortSide <= 900));
    const isShort = height <= 640;
    const isTinyHeight = height <= 480;
    const topPx = isMobile ? (isLandscape || isShort ? 6 : 10) : (isTablet ? 14 : 22);
    document.documentElement.style.setProperty('--bps-vw', `${Math.round(width)}px`);
    document.documentElement.style.setProperty('--bps-vh', `${Math.round(height)}px`);
    document.documentElement.style.setProperty('--bps-sheet-top', `${topPx}px`);
    document.documentElement.dataset.bpsSheetDevice = isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop');
    document.documentElement.dataset.bpsSheetOrientation = isLandscape ? 'landscape' : 'portrait';
    document.documentElement.dataset.bpsSheetTouch = isTouch ? 'touch' : 'pointer';
    document.documentElement.dataset.bpsSheetCompact = (isShort || isTinyHeight) ? 'true' : 'false';
  }

  function lockBackgroundScroll(){
    if(bodyLockActive) return;
    scrollYBeforeOpen = window.scrollY || document.documentElement.scrollTop || 0;
    bodyLockActive = true;
    document.documentElement.classList.add('bps-root-locked');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYBeforeOpen}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockBackgroundScroll(){
    if(!bodyLockActive) return;
    bodyLockActive = false;
    document.documentElement.classList.remove('bps-root-locked');
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollYBeforeOpen || 0);
  }

  function ensureShell(){
    let backdrop = $(BACKDROP_ID);
    let sheet = $(SHEET_ID);
    if(!backdrop){
      backdrop = document.createElement('div');
      backdrop.id = BACKDROP_ID;
      backdrop.className = 'bps-sheet-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.addEventListener('click', close);
      document.body.appendChild(backdrop);
    }
    if(!sheet){
      sheet = document.createElement('aside');
      sheet.id = SHEET_ID;
      sheet.className = 'bps-deep-sheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.setAttribute('aria-label', 'Trainingsmenü');
      sheet.innerHTML = `
        <div class="bps-sheet-grabber" aria-hidden="true"></div>
        <header class="bps-sheet-header">
          <div class="bps-sheet-title">
            <b>Trainingsmenü</b>
            <span id="bpsSheetMeta">Kategorien · Module · Start erst nach Auswahl</span>
          </div>
          <button type="button" class="bps-sheet-close" id="bpsSheetClose" aria-label="Trainingsmenü schließen">×</button>
        </header>
        <main class="bps-sheet-body" id="${BODY_ID}" tabindex="0"></main>
        <footer class="bps-sheet-footer" id="bpsSheetFooter"></footer>`;
      document.body.appendChild(sheet);
      $('bpsSheetClose').addEventListener('click', close);
      setupDrag(sheet);
    }
    return {backdrop, sheet, body: $(BODY_ID), footer: $('bpsSheetFooter')};
  }

  function setupDrag(sheet){
    const grabber = sheet.querySelector('.bps-sheet-grabber');
    if(!grabber) return;
    grabber.addEventListener('pointerdown', (ev)=>{
      if(!window.matchMedia || !window.matchMedia('(max-width: 760px)').matches) return;
      dragging = true; startY = ev.clientY; dragY = 0;
      grabber.setPointerCapture(ev.pointerId);
      sheet.classList.add('is-dragging');
    });
    grabber.addEventListener('pointermove', (ev)=>{
      if(!dragging) return;
      dragY = Math.max(0, ev.clientY - startY);
      sheet.style.setProperty('--sheet-drag-y', `${dragY}px`);
    });
    const end = ()=>{
      if(!dragging) return;
      dragging = false;
      sheet.classList.remove('is-dragging');
      sheet.style.removeProperty('--sheet-drag-y');
      if(dragY > 120) close();
    };
    grabber.addEventListener('pointerup', end);
    grabber.addEventListener('pointercancel', end);
  }

  function cleanupLegacyPractice(){
    // V8.2.4: old sheet classes can block iPhone scrolling via touch-action:none. Remove them at the source.
    document.body.classList.remove('training-sheet-open','training-sheet-compact','training-sheet-desktop');
    // V8.1.6: old training sheet/accordion DOM is removed, not just visually hidden.
    ['trainingSheet','trainingSheetBackdrop'].forEach(id=>{
      const el = $(id);
      if(el && el.parentNode) el.parentNode.removeChild(el);
    });
    ['trainingSheetContent','modeTabs','modeSectionTitle','sectionActions','focusControls'].forEach(id=>{
      const el = $(id);
      if(el){ el.innerHTML = ''; el.style.display = 'none'; el.setAttribute('aria-hidden','true'); }
    });
    document.querySelectorAll('.training-hub-sheet,.training-category-card,.training-category-modes,.training-sheet-launch-card,.training-inline-preview,.training-native-menu,.training-sheet-router,.clean-sheet-router,.clean-training-sheet,.clean-sheet-backdrop,.warn.small,.exam-options,.db-actions').forEach(el=>{
      el.innerHTML = '';
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-retired-by', 'bps-deep-sheet-v8.2.4');
    });
  }

  function renderLauncher(){
    if(!appReady()) return;
    document.body.dataset.appSection = state().activeAppSection || document.body.dataset.appSection || 'home';
    cleanupLegacyPractice();
    const grid = $('modeGrid');
    if(!grid || (state().activeAppSection || 'home') !== 'practice') return;
    const MODES = validModes();
    const key = selectedMode();
    const mode = MODES[key];
    grid.innerHTML = `
      <div class="bps-practice-launch">
        <button type="button" class="bps-open-sheet" id="bpsOpenTrainingSheet">
          <span class="bps-launch-icon">▣</span>
          <b>Trainingsmenü öffnen</b>
          <small>${CATEGORIES.length} Kategorien · ${allCategorizedModes().length} Module · keine Aufgaben vor dem Start</small>
        </button>
        <div class="bps-current-choice">
          <span>Aktuell ausgewählt</span>
          <b>${esc(modeTitle(mode, key))}</b>
          <small>Tippe auf Trainingsmenü, um Kategorie oder Modus zu wechseln.</small>
        </div>
      </div>`;
    const btn = $('bpsOpenTrainingSheet');
    if(btn) btn.addEventListener('click', ()=>open());
  }

  function renderCategoryButton(cat, index){
    const count = modesForCategory(cat).length;
    return `<button type="button" class="bps-category ${index === activeCategory ? 'active' : ''}" data-cat="${index}">
      <span class="bps-category-icon">${cat.icon}</span>
      <span class="bps-category-label">${esc(cat.label)}</span>
      <em>${count}</em>
    </button>`;
  }

  function renderModeRow(modeKey){
    const MODES = validModes();
    const mode = MODES[modeKey];
    if(!mode) return '';
    const selected = modeKey === selectedMode();
    const tags = (Array.isArray(mode.tags) ? mode.tags : []).slice(0, 3).map(tag => `<em>${esc(tag)}</em>`).join('');
    const amount = Number(mode.amount || 0) ? `${mode.amount} Aufgaben` : 'Training';
    return `<button type="button" class="bps-mode ${selected ? 'selected' : ''}" data-mode="${esc(modeKey)}">
      <span class="bps-mode-check">${selected ? '✓' : '+'}</span>
      <span class="bps-mode-copy"><b>${esc(modeTitle(mode, modeKey))}</b><small>${esc(amount)} · ${esc(mode.desc || 'Gezieltes Training.')}</small></span>
      <span class="bps-mode-tags">${tags}</span>
    </button>`;
  }

  function installScrollGuard(){
    const {body} = ensureShell();
    if(body.dataset.scrollGuard === '1') return;
    body.dataset.scrollGuard = '1';
    let lastY = 0;
    body.addEventListener('touchstart', ev => { if(ev.touches && ev.touches[0]){ lastY = ev.touches[0].clientY; body._bpsLastX = ev.touches[0].clientX; } }, {passive:true});
    body.addEventListener('touchmove', ev => {
      // V8.2.6: do not block the horizontal category rail. The rail must own pan-x.
      if(ev.target && ev.target.closest && ev.target.closest('.bps-category-nav')) return;
      if(!ev.touches || !ev.touches[0]) return;
      const currentY = ev.touches[0].clientY;
      const currentX = ev.touches[0].clientX;
      const dy = currentY - lastY;
      const dx = (typeof body._bpsLastX === 'number') ? currentX - body._bpsLastX : 0;
      body._bpsLastX = currentX;
      lastY = currentY;
      // If the gesture is more horizontal than vertical, never prevent it.
      if(Math.abs(dx) > Math.abs(dy) * 1.15) return;
      const atTop = body.scrollTop <= 0;
      const atBottom = Math.ceil(body.scrollTop + body.clientHeight) >= body.scrollHeight;
      if((atTop && dy > 0) || (atBottom && dy < 0)) ev.preventDefault();
    }, {passive:false});
  }

  function renderFooter(){
    const {footer} = ensureShell();
    const MODES = validModes();
    const key = selectedMode();
    const mode = MODES[key];
    footer.innerHTML = `<div class="bps-footer-copy"><span>Ausgewählt</span><b>${esc(modeTitle(mode, key))}</b><small>Aufgaben werden erst nach Start geladen.</small></div><button type="button" id="bpsSheetStart">Starten</button>`;
    $('bpsSheetStart').addEventListener('click', ()=>{
      close();
      setTimeout(()=>{ try{ App.prepareTest(); }catch(err){ console.error('BPS Sheet start failed', err); } }, 80);
    });
  }


  function debugEnabled(){
    try{
      return /(?:\?|&)sheetdebug=1(?:&|$)/.test(location.search) || localStorage.getItem('bpsSheetDebug') === '1';
    }catch(_){ return false; }
  }

  function updateDebugOverlay(){
    if(!debugEnabled()) return;
    const shell = ensureShell();
    let box = document.getElementById('bpsSheetDebug');
    if(!box){
      box = document.createElement('div');
      box.id = 'bpsSheetDebug';
      box.setAttribute('aria-hidden','true');
      document.body.appendChild(box);
    }
    const vv = window.visualViewport;
    const body = shell.body;
    const sheet = shell.sheet;
    const appNav = document.getElementById('appNav');
    const topNav = document.getElementById('mobileTopNav');
    const data = {
      v: VERSION,
      vw: Math.round(vv ? vv.width : innerWidth),
      vh: Math.round(vv ? vv.height : innerHeight),
      sheetH: sheet ? Math.round(sheet.getBoundingClientRect().height) : 0,
      bodyH: body ? Math.round(body.clientHeight) : 0,
      scrollH: body ? Math.round(body.scrollHeight) : 0,
      canScroll: body ? (body.scrollHeight > body.clientHeight + 2) : false,
      bodyClasses: document.body.className,
      appNavHidden: appNav ? getComputedStyle(appNav).display : 'none',
      topNavHidden: topNav ? getComputedStyle(topNav).display : 'none',
      rail: (()=>{ const r=shell.body ? shell.body.querySelector('.bps-category-nav') : null; return r ? `${Math.round(r.clientWidth)}/${Math.round(r.scrollWidth)}@${Math.round(r.scrollLeft)}` : 'none'; })()
    };
    box.textContent = `Sheet Debug ${data.v} · ${data.vw}×${data.vh} · sheet ${data.sheetH} · body ${data.bodyH}/${data.scrollH} · scroll:${data.canScroll} · rail:${data.rail} · nav:${data.appNavHidden}/${data.topNavHidden}`;
  }

  function setCategory(index){
    activeCategory = Math.max(0, Math.min(Number(index) || 0, CATEGORIES.length - 1));
    if(appReady()) state().activeSheetCategory = activeCategory;
    render();
  }

  function scrollActiveCategoryIntoView(){
    const body = $(BODY_ID);
    if(!body) return;
    const active = body.querySelector('.bps-category.active');
    const nav = body.querySelector('.bps-category-nav');
    if(active && nav){
      try{ active.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'}); }catch(_){ try{ nav.scrollLeft = Math.max(0, active.offsetLeft - nav.clientWidth/2 + active.clientWidth/2); }catch(__){} }
    }
  }

  function bindCategorySwipe(panel){
    if(!panel || panel.dataset.swipeBound === '1') return;
    panel.dataset.swipeBound = '1';
    let sx=0, sy=0, moved=false;
    panel.addEventListener('touchstart', ev=>{
      const t = ev.touches && ev.touches[0];
      if(!t) return;
      sx=t.clientX; sy=t.clientY; moved=false;
    }, {passive:true});
    panel.addEventListener('touchmove', ev=>{
      const t = ev.touches && ev.touches[0];
      if(!t) return;
      const dx=t.clientX-sx, dy=t.clientY-sy;
      if(Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(dy)*1.25) moved=true;
    }, {passive:true});
    panel.addEventListener('touchend', ev=>{
      if(!moved) return;
      const changed = (ev.changedTouches && ev.changedTouches[0]) || null;
      if(!changed) return;
      const dx = changed.clientX - sx;
      if(dx < -34) setCategory(activeCategory + 1);
      else if(dx > 34) setCategory(activeCategory - 1);
    }, {passive:true});
  }

  function bindCategoryRail(nav){
    if(!nav || nav.dataset.railBound === '1') return;
    nav.dataset.railBound = '1';
    const isMobileRail = (document.documentElement.dataset.bpsSheetDevice || '') === 'mobile';

    function resetDesktopRail(){
      nav.classList.remove('bps-touch-rail','is-dragging');
      nav.style.overflowX = 'hidden';
      nav.style.overflowY = 'auto';
      nav.style.webkitOverflowScrolling = 'touch';
      nav.style.touchAction = 'pan-y';
      nav.style.display = 'grid';
      nav.style.flexWrap = '';
      nav.style.maxWidth = '';
      nav.style.width = '';
      nav.style.scrollSnapType = 'none';
      Array.from(nav.children).forEach(child => {
        child.style.flex = '';
        child.style.minWidth = '';
        child.style.width = '';
        child.style.touchAction = 'manipulation';
        child.style.scrollSnapAlign = '';
        child.style.pointerEvents = 'auto';
      });
    }

    if(!isMobileRail){
      resetDesktopRail();
      return;
    }

    nav.classList.add('bps-touch-rail');

    function enforceRail(){
      // Mobile only: real horizontal touch rail. Desktop/tablet must stay a normal clickable sidebar.
      nav.style.overflowX = 'auto';
      nav.style.overflowY = 'hidden';
      nav.style.webkitOverflowScrolling = 'touch';
      nav.style.touchAction = 'pan-x';
      nav.style.display = 'flex';
      nav.style.flexWrap = 'nowrap';
      nav.style.maxWidth = '100%';
      nav.style.width = '100%';
      nav.style.scrollSnapType = 'x mandatory';
      Array.from(nav.children).forEach(child => {
        child.style.flex = '0 0 auto';
        child.style.minWidth = '92px';
        child.style.width = 'auto';
        child.style.touchAction = 'pan-x';
        child.style.scrollSnapAlign = 'center';
      });
    }
    enforceRail();
    requestAnimationFrame(enforceRail);

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let moved = false;
    let touchId = null;
    let tapTarget = null;

    const suppressClick = ()=>{
      if(moved){
        nav.dataset.suppressClick = '1';
        setTimeout(()=>{ delete nav.dataset.suppressClick; }, 90);
      }
    };
    const end = ()=>{
      if(!isDown) return;
      isDown = false;
      touchId = null;
      nav.classList.remove('is-dragging');
      suppressClick();
    };

    // Native pointer path: desktop, Android Chrome, trackpads.
    nav.addEventListener('pointerdown', ev=>{
      if(ev.button != null && ev.button !== 0) return;
      enforceRail();
      isDown = true;
      moved = false;
      startX = ev.clientX;
      startY = ev.clientY;
      startScroll = nav.scrollLeft;
      nav.classList.add('is-dragging');
      try{ nav.setPointerCapture(ev.pointerId); }catch(_){ }
    }, {passive:true});

    nav.addEventListener('pointermove', ev=>{
      if(!isDown) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if(Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy) * 0.65) moved = true;
      if(moved){
        nav.scrollLeft = startScroll - dx;
        ev.preventDefault();
      }
    }, {passive:false});
    nav.addEventListener('pointerup', end, {passive:true});
    nav.addEventListener('pointercancel', end, {passive:true});
    nav.addEventListener('lostpointercapture', end, {passive:true});

    // Hard iOS fallback: some Safari/WebView cases ignore native horizontal scroll inside a fixed modal.
    nav.addEventListener('touchstart', ev=>{
      const t = ev.changedTouches && ev.changedTouches[0];
      if(!t) return;
      enforceRail();
      touchId = t.identifier;
      isDown = true;
      moved = false;
      startX = t.clientX;
      startY = t.clientY;
      startScroll = nav.scrollLeft;
      nav.classList.add('is-dragging');
      tapTarget = t.target && t.target.closest ? t.target.closest('[data-cat]') : null;
    }, {passive:true});

    nav.addEventListener('touchmove', ev=>{
      if(!isDown) return;
      const touches = Array.from(ev.changedTouches || []);
      const t = touches.find(x => x.identifier === touchId) || touches[0];
      if(!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const horizontal = Math.abs(dx) > 3 && Math.abs(dx) > Math.abs(dy) * 0.55;
      if(horizontal){
        moved = true;
        nav.scrollLeft = startScroll - dx;
        ev.preventDefault();
        ev.stopPropagation();
      }
    }, {passive:false});
    nav.addEventListener('touchend', ev=>{
      const target = tapTarget;
      const wasMoved = moved;
      end();
      // V8.2.9: iOS fast tap. A simple tap must select immediately; drag still suppresses click.
      if(!wasMoved && target && target.dataset && target.dataset.cat != null){
        ev.preventDefault();
        ev.stopPropagation();
        setCategory(Number(target.dataset.cat) || 0);
      }
      tapTarget = null;
    }, {passive:false});
    nav.addEventListener('touchcancel', ()=>{ tapTarget = null; end(); }, {passive:true});

    // Trackpad/mouse wheel: vertical wheel inside rail maps to horizontal scroll.
    nav.addEventListener('wheel', ev=>{
      enforceRail();
      if(Math.abs(ev.deltaY) > Math.abs(ev.deltaX)){
        nav.scrollLeft += ev.deltaY;
        ev.preventDefault();
      }
    }, {passive:false});

    nav.addEventListener('scroll', ()=>{
      if(debugEnabled()) updateDebugOverlay();
    }, {passive:true});
  }

  function render(){
    if(!appReady()) return;
    setViewportVars();
    const {body} = ensureShell();
    activeCategory = Math.max(0, Math.min(activeCategory, CATEGORIES.length - 1));
    const cat = CATEGORIES[activeCategory];
    const modes = modesForCategory(cat);
    body.innerHTML = `
      <div class="bps-sheet-layout" data-active-category="${esc(cat.key)}">
        <nav class="bps-category-nav bps-touch-rail" role="tablist" aria-label="Trainingskategorien">${CATEGORIES.map(renderCategoryButton).join('')}</nav>
        <section class="bps-mode-panel" role="tabpanel" aria-label="${esc(cat.label)}">
          <div class="bps-panel-head">
            <div class="bps-panel-icon">${cat.icon}</div>
            <div><b>${esc(cat.label)}</b><span>${esc(cat.note)}</span></div>
            <strong>${modes.length} Modi</strong>
          </div>
          <div class="bps-mode-list">${modes.map(renderModeRow).join('') || '<div class="bps-empty">Keine Module in dieser Kategorie.</div>'}</div>
        </section>
      </div>`;
    const categoryNav = body.querySelector('.bps-category-nav');
    bindCategoryRail(categoryNav);
    body.querySelectorAll('[data-cat]').forEach(btn => {
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-selected', Number(btn.dataset.cat) === activeCategory ? 'true' : 'false');
      btn.addEventListener('click', (ev)=>{
        const nav = ev.currentTarget.closest('.bps-category-nav');
        if(nav && nav.dataset.suppressClick === '1') return;
        setCategory(Number(btn.dataset.cat) || 0);
      });
    });
    body.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', ()=>{ selectMode(btn.dataset.mode); renderLauncher(); render(); }));
    bindCategorySwipe(body.querySelector('.bps-mode-panel'));
    renderFooter();
    setTimeout(scrollActiveCategoryIntoView, 20);
  }

  function open(input){
    if(!appReady()) return;
    cleanupLegacyPractice();
    if(typeof input === 'string'){
      const catIndex = CATEGORIES.findIndex(cat => cat.key === input);
      if(catIndex >= 0) activeCategory = catIndex;
      else if(validModes()[input]) activeCategory = categoryIndexForMode(input);
    } else {
      activeCategory = Number.isInteger(state().activeSheetCategory) ? state().activeSheetCategory : categoryIndexForMode(selectedMode());
    }
    const {backdrop, sheet, body} = ensureShell();
    installScrollGuard();
    render();
    cleanupLegacyPractice();
    document.body.classList.remove('training-sheet-open','training-sheet-compact','training-sheet-desktop');
    lockBackgroundScroll();
    document.body.classList.add(STYLE_CLASS);
    backdrop.classList.add('show');
    sheet.classList.add('show');
    requestAnimationFrame(()=>{ updateDebugOverlay(); });
    setTimeout(()=>{ try{ body.focus({preventScroll:true}); }catch(_){} updateDebugOverlay(); }, 40);
  }

  function close(){
    const backdrop = $(BACKDROP_ID);
    const sheet = $(SHEET_ID);
    document.body.classList.remove(STYLE_CLASS,'training-sheet-open','training-sheet-compact','training-sheet-desktop');
    if(backdrop) backdrop.classList.remove('show');
    if(sheet) sheet.classList.remove('show');
    setTimeout(unlockBackgroundScroll, 220);
  }

  function patchApp(){
    if(patched || !appReady()) return false;
    patched = true;
    original = {
      setAppSection: App.setAppSection,
      setTopTab: App.setTopTab,
      openTrainingSheet: App.openTrainingSheet,
      closeTrainingSheet: App.closeTrainingSheet,
      chooseTrainingMode: App.chooseTrainingMode,
      setTrainingSheetCategory: App.setTrainingSheetCategory,
      selectMode: App.selectMode
    };
    App.openTrainingSheet = open;
    App.closeTrainingSheet = close;
    App.setTrainingSheetCategory = function(index){ setCategory(index); };
    App.chooseTrainingMode = function(modeKey){ selectMode(modeKey); renderLauncher(); render(); };
    App.selectMode = function(modeKey){
      if(!selectMode(modeKey)) return;
      close();
      try{ if(typeof App.renderModes === 'function') App.renderModes(); }catch(_){}
      setTimeout(()=>{ cleanupLegacyPractice(); renderLauncher(); }, 20);
    };
    App.setAppSection = function(section){
      if(original.setAppSection) original.setAppSection.call(App, section);
      if(appReady()) state().activeAppSection = section;
      document.body.dataset.appSection = section;
      if(section === 'practice'){
        setTimeout(()=>{ renderLauncher(); open(); }, 40);
      } else {
        close();
      }
    };
    App.setTopTab = function(tab){
      if(original.setTopTab) original.setTopTab.call(App, tab);
      if(tab === 'practice' || tab === 'simulation' || tab === 'block'){
        if(appReady()) state().activeAppSection = 'practice';
        document.body.dataset.appSection = 'practice';
        setTimeout(()=>{ renderLauncher(); open(tab === 'block' ? 'matrix' : tab); }, 40);
      }
    };
    window.BPSTrainerDeepSheet = {version: VERSION, open, close, render, renderLauncher, categories: CATEGORIES, audit};
    setViewportVars();
    renderLauncher();
    return true;
  }

  function audit(){
    if(!appReady()) return {version: VERSION, ready: false, reason: 'App not ready'};
    const MODES = validModes();
    const missing = [];
    CATEGORIES.forEach(cat => cat.modes.forEach(key => { if(!MODES[key]) missing.push(`${cat.key}:${key}`); }));
    return {
      version: VERSION,
      ready: true,
      categories: CATEGORIES.length,
      listedModes: CATEGORIES.reduce((sum, cat)=>sum + modesForCategory(cat).length, 0),
      totalModes: Object.keys(MODES).length,
      missing,
      selectedMode: selectedMode(),
      modeKeys: Object.keys(MODES),
      categorizedKeys: allCategorizedModes(),
      device: document.documentElement.dataset.bpsSheetDevice || 'unknown',
      orientation: document.documentElement.dataset.bpsSheetOrientation || 'unknown',
      scroll: (()=>{ const b=$(BODY_ID), sh=$(SHEET_ID); return {bodyClient:b?b.clientHeight:0, bodyScroll:b?b.scrollHeight:0, sheetHeight:sh?Math.round(sh.getBoundingClientRect().height):0, canScroll:b?b.scrollHeight>b.clientHeight+2:false}; })()
    };
  }

  function boot(){
    if(patchApp()) return;
    setTimeout(boot, 80);
  }

  window.addEventListener('resize', ()=>{ setViewportVars(); if(document.body.classList.contains(STYLE_CLASS)){ render(); updateDebugOverlay(); } }, {passive:true});
  window.addEventListener('orientationchange', ()=>{ setTimeout(()=>{ setViewportVars(); if(document.body.classList.contains(STYLE_CLASS)){ render(); updateDebugOverlay(); } }, 180); }, {passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', ()=>{ setViewportVars(); updateDebugOverlay(); }, {passive:true});
    window.visualViewport.addEventListener('scroll', ()=>{ setViewportVars(); updateDebugOverlay(); }, {passive:true});
  }
  document.addEventListener('keydown', ev => { if(ev.key === 'Escape') close(); });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
