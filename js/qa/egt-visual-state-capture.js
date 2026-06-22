/* Eignungstest-Trainer · G54.43.7 · Screenshot-Recorder / Visual-State-Capture
   Interner QA-Capture-Modus: ?qa=capture, ?qa=visual-capture oder #qa-capture
   Hinweis: Echte Pixel-Screenshots sind im Browser aus Sicherheitsgründen nur nach Nutzerklick
   über die Screen-Capture-API möglich. Der Visual-State-Capture läuft zusätzlich voll lokal
   und exportiert DOM-/Layout-/Viewport-Zustände ohne externe Dienste. */
(function () {
  'use strict';

  var VERSION = 'G54.43.8H';
  var state = {
    overlay: null,
    captures: [],
    lastCapture: null,
    busy: false,
    screenshotDataUrl: null,
    topTimer: null
  };

  function nowIso() { try { return new Date().toISOString(); } catch (e) { return String(Date.now()); } }
  function qs(sel, root) { try { return (root || document).querySelector(sel); } catch (e) { return null; } }
  function qsa(sel, root) { try { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); } catch (e) { return []; } }
  function textOf(el) { return el && (el.innerText || el.textContent || '') || ''; }
  function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function escapeHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]; }); }
  function clampText(str, max) { str = String(str || '').replace(/\s+/g, ' ').trim(); return str.length > max ? str.slice(0, max - 1) + '…' : str; }

  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var cs = window.getComputedStyle ? getComputedStyle(el) : null;
    if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0)) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom >= 0 && r.right >= 0 && r.top <= window.innerHeight && r.left <= window.innerWidth;
  }

  function rectOf(el) {
    if (!el || !el.getBoundingClientRect) return null;
    var r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x), y: Math.round(r.y), left: Math.round(r.left), top: Math.round(r.top),
      right: Math.round(r.right), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height)
    };
  }

  function cssOf(el) {
    if (!el || !window.getComputedStyle) return null;
    var cs = getComputedStyle(el);
    return {
      display: cs.display,
      position: cs.position,
      overflow: cs.overflow,
      overflowX: cs.overflowX,
      overflowY: cs.overflowY,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      zIndex: cs.zIndex
    };
  }

  function selectorFor(el) {
    if (!el || !el.tagName) return '';
    if (el.id) return '#' + el.id;
    var out = el.tagName.toLowerCase();
    var data = ['data-route', 'data-action', 'data-module', 'data-analysis-dashboard-v2', 'data-capture-target'];
    for (var i = 0; i < data.length; i++) {
      var value = el.getAttribute && el.getAttribute(data[i]);
      if (value) return out + '[' + data[i] + '="' + String(value).replace(/"/g, '') + '"]';
    }
    if (el.className && typeof el.className === 'string') {
      var cls = el.className.trim().split(/\s+/).slice(0, 3).join('.');
      if (cls) out += '.' + cls;
    }
    return out;
  }

  function ensureStyles() {
    if (document.getElementById('egt-visual-state-capture-style')) return;
    var style = document.createElement('style');
    style.id = 'egt-visual-state-capture-style';
    style.textContent = [
      '.egt-vsc{position:fixed;z-index:2147483647;left:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));width:min(460px,calc(100vw - 24px));max-height:min(58vh,560px);overflow:hidden;border:1px solid rgba(59,130,246,.45);border-radius:18px;background:rgba(2,6,23,.96);color:#f8fafc;box-shadow:0 22px 70px rgba(0,0,0,.45);font:13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;touch-action:auto;overscroll-behavior:contain}',
      '.egt-vsc *{box-sizing:border-box}.egt-vsc__head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(148,163,184,.24);cursor:default}.egt-vsc__head-actions{display:flex;gap:8px;align-items:center;flex:0 0 auto}',
      '.egt-vsc__title{font-weight:850;font-size:14px}.egt-vsc__meta{font-size:11px;color:#cbd5e1}.egt-vsc__body{padding:12px 14px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(min(58vh,560px) - 144px);overscroll-behavior:contain}',
      '.egt-vsc__actions{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid rgba(148,163,184,.24);background:rgba(2,6,23,.98)}.egt-vsc button{min-width:44px;min-height:44px;border:0;border-radius:999px;padding:10px 14px;background:#e2e8f0;color:#0f172a;font-weight:800;cursor:pointer;touch-action:manipulation}.egt-vsc button[data-primary="true"]{background:#93c5fd;color:#07111f}.egt-vsc[data-minimized="true"]{width:min(250px,calc(100vw - 24px));max-height:none}.egt-vsc[data-minimized="true"] .egt-vsc__body,.egt-vsc[data-minimized="true"] .egt-vsc__actions{display:none}',
      '.egt-vsc__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.egt-vsc__pill{border-radius:14px;padding:9px;background:rgba(148,163,184,.14);text-align:center}.egt-vsc__pill b{display:block;font-size:18px}',
      '.egt-vsc__card{border-top:1px solid rgba(148,163,184,.18);padding:9px 0}.egt-vsc__card:first-child{border-top:0}.egt-vsc__ok b{color:#86efac}.egt-vsc__warn b{color:#fde68a}.egt-vsc__bad b{color:#fca5a5}.egt-vsc__detail{color:#cbd5e1;font-size:11px;white-space:pre-wrap;word-break:break-word;margin-top:4px}',
      '.egt-vsc__shot{max-width:100%;border-radius:12px;border:1px solid rgba(148,163,184,.3);margin-top:8px}',
      '@media(max-width:520px){.egt-vsc{left:8px;right:8px;bottom:calc(92px + env(safe-area-inset-bottom,0px));width:auto;max-height:min(54vh,520px);border-radius:16px}.egt-vsc__body{max-height:calc(min(54vh,520px) - 144px)}.egt-vsc__grid{grid-template-columns:repeat(3,1fr)}}'
    ].join('\n');
    document.head.appendChild(style);
  }


  function keepQaOnTop(el) {
    function lift() {
      if (!el || !document.body || !document.body.contains(el)) return;
      try {
        el.style.zIndex = '2147483647';
        el.style.position = 'fixed';
        document.documentElement.classList.add('egt-qa-capture-active');
        document.body.classList.add('egt-qa-capture-active');
        if (document.body.lastElementChild !== el) document.body.appendChild(el);
      } catch (e) {}
    }
    lift();
    try { if (state.topTimer) clearInterval(state.topTimer); } catch (e) {}
    try { state.topTimer = setInterval(lift, 700); } catch (e2) {}
    try {
      window.addEventListener('egt:deep-sheet-opened', lift, true);
      window.addEventListener('click', function(){ setTimeout(lift, 120); }, true);
      window.addEventListener('touchend', function(){ setTimeout(lift, 120); }, true);
    } catch (e3) {}
  }

  function openOverlay() {
    ensureStyles();
    try { document.documentElement.classList.add('egt-qa-capture-active'); } catch (e) {}
    try { document.body.classList.add('egt-qa-capture-active'); } catch (e) {}
    var old = document.getElementById('egt-visual-state-capture');
    if (old) old.remove();
    var el = document.createElement('section');
    el.id = 'egt-visual-state-capture';
    el.className = 'egt-vsc';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Visual State Capture QA');
    el.innerHTML = '<div class="egt-vsc__head" data-action="open"><div><div class="egt-vsc__title">Visual-State-Capture</div><div class="egt-vsc__meta">' + VERSION + ' · QA Diagnose</div></div><div class="egt-vsc__head-actions"><button type="button" data-action="minimize" aria-label="QA minimieren">−</button><button type="button" data-action="close" aria-label="QA schließen">×</button></div></div><div class="egt-vsc__body" data-role="body"><div class="egt-vsc__card egt-vsc__ok"><b>Bereit</b><div class="egt-vsc__detail">1. App normal bedienen.\n2. Auf QA tippen.\n3. „State aufnehmen“ tippen.\n4. „Text anzeigen“ oder „JSON kopieren“ nutzen und den Bericht hier einfügen.</div></div></div><div class="egt-vsc__actions"><button type="button" data-primary="true" data-action="capture">State aufnehmen</button><button type="button" data-action="copy">JSON kopieren</button><button type="button" data-action="show">Text anzeigen</button><button type="button" data-action="download">JSON sichern</button><button type="button" data-action="png">PNG optional</button></div>';
    el.setAttribute('data-minimized', 'true');
    document.body.appendChild(el);
    state.overlay = el;
    keepQaOnTop(el);

    var lastTap = { t: 0, action: '' };
    function stopHard(ev) {
      if (!ev) return;
      try { ev.stopPropagation(); } catch (e) {}
      try { ev.stopImmediatePropagation(); } catch (e2) {}
    }
    function actionFromEvent(ev) {
      var target = ev && ev.target;
      if (!target) return '';
      var btn = target.closest ? target.closest('[data-action]') : null;
      if (!btn || !el.contains(btn)) return '';
      var action = btn.getAttribute('data-action') || '';
      if (action === 'open' && el.getAttribute('data-minimized') !== 'true') return '';
      return action;
    }
    function runAction(action, ev) {
      if (!action) return false;
      if (ev) {
        if (action !== 'open') { try { ev.preventDefault(); } catch (e) {} }
        stopHard(ev);
      }
      var now = Date.now();
      if (lastTap.action === action && now - lastTap.t < 420) return true;
      lastTap = { action: action, t: now };
      if (action === 'open') {
        el.setAttribute('data-minimized', 'false');
        var minBtn = qs('button[data-action="minimize"]', el);
        if (minBtn) minBtn.textContent = '−';
        return true;
      }
      if (action === 'close') { try { if (state.topTimer) { clearInterval(state.topTimer); state.topTimer = null; } } catch (e) {} el.remove(); state.overlay = null; try { document.documentElement.classList.remove('egt-qa-capture-active'); document.body.classList.remove('egt-qa-capture-active'); } catch (e) {} return true; }
      if (action === 'minimize') {
        var m = el.getAttribute('data-minimized') === 'true';
        el.setAttribute('data-minimized', m ? 'false' : 'true');
        var b = qs('button[data-action="minimize"]', el);
        if (b) b.textContent = m ? '−' : '+';
        return true;
      }
      if (action === 'capture') { captureCurrentState({ reason: 'manual' }); return true; }
      if (action === 'png') { capturePngFromScreen(); return true; }
      if (action === 'copy') { copyLastCapture(); return true; }
      if (action === 'download') { downloadLastCapture(); return true; }
      if (action === 'show') { showLastCaptureText(); return true; }
      return false;
    }
    function onActivation(ev) {
      var action = actionFromEvent(ev);
      if (!action) return;
      var type = ev.type;
      if (type === 'pointerdown' || type === 'mousedown' || type === 'touchstart') {
        stopHard(ev);
        return;
      }
      runAction(action, ev);
    }
    ['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'].forEach(function (type) {
      try { el.addEventListener(type, onActivation, true); } catch (e) { el.addEventListener(type, onActivation); }
    });
    qsa('button[data-action]', el).forEach(function (btn) {
      btn.onclick = function (ev) { runAction(btn.getAttribute('data-action'), ev); return false; };
      btn.onpointerup = function (ev) { runAction(btn.getAttribute('data-action'), ev); return false; };
      btn.ontouchend = function (ev) { runAction(btn.getAttribute('data-action'), ev); return false; };
    });
    var head = qs('.egt-vsc__head', el);
    if (head) {
      head.onclick = function (ev) {
        if (el.getAttribute('data-minimized') === 'true') { runAction('open', ev); return false; }
      };
      head.ontouchend = function (ev) {
        if (el.getAttribute('data-minimized') === 'true') { runAction('open', ev); return false; }
      };
    }
    return el;
  }

  function setBody(html) {
    var body = state.overlay && qs('[data-role="body"]', state.overlay);
    if (body) body.innerHTML = html;
  }


  function visibleRatio(rect) {
    if (!rect) return 0;
    var vw = window.innerWidth || 0, vh = window.innerHeight || 0;
    var left = Math.max(0, rect.left), right = Math.min(vw, rect.right);
    var top = Math.max(0, rect.top), bottom = Math.min(vh, rect.bottom);
    var area = Math.max(0, right - left) * Math.max(0, bottom - top);
    var total = Math.max(1, (rect.width || 0) * (rect.height || 0));
    return Math.round((area / total) * 1000) / 1000;
  }

  function isProbablyScrollable(el, axis) {
    if (!el) return false;
    var cs = cssOf(el) || {};
    if (axis === 'x') return (el.scrollWidth || 0) > (el.clientWidth || 0) + 2 && /auto|scroll|overlay/i.test(cs.overflowX || cs.overflow || '');
    return (el.scrollHeight || 0) > (el.clientHeight || 0) + 2 && /auto|scroll|overlay/i.test(cs.overflowY || cs.overflow || '');
  }

  function scrollSnapshot(el) {
    if (!el) return null;
    var r = rectOf(el);
    var maxY = Math.max(0, (el.scrollHeight || 0) - (el.clientHeight || 0));
    var maxX = Math.max(0, (el.scrollWidth || 0) - (el.clientWidth || 0));
    var top = Math.round(el.scrollTop || 0);
    var left = Math.round(el.scrollLeft || 0);
    var bottomGap = Math.max(0, maxY - top);
    var rightGap = Math.max(0, maxX - left);
    return {
      selector: selectorFor(el),
      text: clampText(textOf(el), 120),
      rect: r,
      visible: visible(el),
      visibleRatio: visibleRatio(r),
      scrollWidth: el.scrollWidth || 0,
      scrollHeight: el.scrollHeight || 0,
      clientWidth: el.clientWidth || 0,
      clientHeight: el.clientHeight || 0,
      scrollTop: top,
      scrollLeft: left,
      maxScrollY: maxY,
      maxScrollX: maxX,
      bottomGap: bottomGap,
      rightGap: rightGap,
      canScrollY: isProbablyScrollable(el, 'y'),
      canScrollX: isProbablyScrollable(el, 'x'),
      atTop: top <= 2,
      atBottom: bottomGap <= 4,
      atLeft: left <= 2,
      atRight: rightGap <= 4,
      css: cssOf(el)
    };
  }

  function detectActiveContext() {
    var sheet = qsa('.ui-sheet.show,.ui-sheet.is-visible,.ui-deep-sheet.show,.ui-deep-sheet.is-visible,[data-ui-deep-sheet].show,[data-ui-deep-sheet].is-visible').filter(visible)[0] || null;
    var title = sheet ? (qs('.ui-deep-title,h2,h1', sheet) || null) : null;
    var sheetType = sheet && sheet.getAttribute ? (sheet.getAttribute('data-ui-deep-sheet') || sheet.getAttribute('data-sheet') || '') : '';
    var titleText = clampText(textOf(title), 80);
    var inferred = (window.EGTModuleHost && window.EGTModuleHost.currentModule) || (window.EGTState && window.EGTState.currentModule) || null;
    if (!inferred && sheet) {
      if (/analyse|fortschritt/i.test((sheetType + ' ' + titleText))) inferred = 'analysis_deep_sheet';
      else if (/training/i.test((sheetType + ' ' + titleText))) inferred = 'training_deep_sheet';
      else inferred = sheetType || 'deep_sheet';
    }
    return {
      activeModule: inferred,
      hasActiveDeepSheet: !!sheet,
      sheetSelector: sheet ? selectorFor(sheet) : null,
      sheetType: sheetType || null,
      sheetTitle: titleText || null,
      sheetRect: sheet ? rectOf(sheet) : null
    };
  }

  function findDeepSheetScrollCandidates(sheet) {
    if (!sheet) return [];
    var selectors = ['[data-sheet-scroll]', '.ui-deep-body', '.ui-sheet-body', '.sheet-body', '.deep-sheet-body', '.analysis-v2-shell'];
    var out = [];
    selectors.forEach(function (sel) { qsa(sel, sheet).forEach(function (el) { if (out.indexOf(el) === -1) out.push(el); }); });
    // Fallback: any visible descendant with overflow/scroll height
    qsa('*', sheet).forEach(function (el) {
      if (out.indexOf(el) !== -1 || !visible(el)) return;
      var cs = cssOf(el) || {};
      var may = /auto|scroll|overlay/i.test(cs.overflowY || cs.overflow || '');
      if (may || (el.scrollHeight || 0) > (el.clientHeight || 0) + 8) out.push(el);
    });
    return out.slice(0, 24);
  }

  function collectDockOverlap(container) {
    var dock = qs('#egtBottomDock') || qs('.bottom-dock') || qs('.app-bottom-dock') || qs('.egt-bottom-dock');
    var dockRect = dock && visible(dock) ? rectOf(dock) : null;
    var containerRect = container ? rectOf(container) : null;
    var overlap = false;
    if (dockRect && containerRect) overlap = containerRect.bottom > dockRect.top && containerRect.top < dockRect.bottom;
    return { dockSelector: dock ? selectorFor(dock) : null, dockRect: dockRect, containerRect: containerRect, overlapsDock: overlap };
  }

  function collectDeepSheetIntelligence() {
    var ctx = detectActiveContext();
    var sheet = ctx.sheetSelector ? qs(ctx.sheetSelector) : null;
    // selectorFor may return non-queryable class strings in rare cases; fallback to visible sheet
    if (!sheet) sheet = qsa('.ui-sheet.show,.ui-sheet.is-visible,.ui-deep-sheet.show,.ui-deep-sheet.is-visible,[data-ui-deep-sheet].show,[data-ui-deep-sheet].is-visible').filter(visible)[0] || null;
    var scrollCandidates = findDeepSheetScrollCandidates(sheet).map(scrollSnapshot).filter(Boolean);
    var primary = scrollCandidates.filter(function (x) { return x && x.canScrollY; }).sort(function(a,b){ return (b.scrollHeight-b.clientHeight) - (a.scrollHeight-a.clientHeight); })[0] || scrollCandidates[0] || null;
    var qa = state.overlay ? rectOf(state.overlay) : null;
    var sheetRect = sheet ? rectOf(sheet) : null;
    var qaOverlapsSheet = false;
    if (qa && sheetRect) qaOverlapsSheet = !(qa.right < sheetRect.left || qa.left > sheetRect.right || qa.bottom < sheetRect.top || qa.top > sheetRect.bottom);
    return {
      active: !!sheet,
      context: ctx,
      primaryScrollContainer: primary,
      scrollCandidates: scrollCandidates,
      scrollSummary: primary ? {
        canScrollY: primary.canScrollY,
        scrollTop: primary.scrollTop,
        maxScrollY: primary.maxScrollY,
        bottomGap: primary.bottomGap,
        atTop: primary.atTop,
        atBottom: primary.atBottom,
        visibleRatio: primary.visibleRatio
      } : null,
      dockOverlap: collectDockOverlap(primary && qs(primary.selector) || sheet),
      qaOverlay: { rect: qa, overlapsActiveSheet: qaOverlapsSheet, minimized: state.overlay ? state.overlay.getAttribute('data-minimized') : null }
    };
  }

  function routeInfo() {
    return {
      href: location.href,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      title: document.title || '',
      activeModule: detectActiveContext().activeModule
    };
  }

  function environmentInfo() {
    return {
      timestamp: nowIso(),
      version: VERSION,
      appVersion: window.AppConfig && window.AppConfig.fullVersion || window.APP_VERSION || null,
      viewport: { width: window.innerWidth || 0, height: window.innerHeight || 0, dpr: window.devicePixelRatio || 1 },
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, scrollX: window.scrollX || 0, scrollY: window.scrollY || 0 },
      screen: window.screen ? { width: screen.width, height: screen.height, availWidth: screen.availWidth, availHeight: screen.availHeight } : null,
      userAgent: navigator.userAgent || '',
      language: navigator.language || '',
      online: navigator.onLine,
      route: routeInfo()
    };
  }

  function importantSelectors() {
    return [
      'main', '#app', '.app-shell', '.home-shell', '.bottom-dock', '.app-bottom-dock', '.deep-sheet', '.deep-sheet-panel', '.sheet', '.ui-sheet', '.ui-deep-sheet', '.ui-deep-body', '[data-sheet-scroll]',
      '[data-analysis-dashboard-v2]', '.analysis-v2-shell', '.analysis-v2-kpi', '.analysis-v2-chart-card', '.analysis-v2-bars', '.analysis-v2-coach',
      '[data-capture-target]', '[data-module]', '[data-route]'
    ];
  }

  function collectImportantElements() {
    var seen = [];
    var elements = [];
    importantSelectors().forEach(function (sel) {
      qsa(sel).forEach(function (el) {
        if (seen.indexOf(el) !== -1) return;
        seen.push(el);
        elements.push({
          selector: selectorFor(el),
          tag: el.tagName,
          id: el.id || null,
          className: typeof el.className === 'string' ? el.className : '',
          text: clampText(textOf(el), 140),
          visible: visible(el),
          rect: rectOf(el),
          scroll: { scrollWidth: el.scrollWidth || 0, scrollHeight: el.scrollHeight || 0, clientWidth: el.clientWidth || 0, clientHeight: el.clientHeight || 0 },
          css: cssOf(el)
        });
      });
    });
    return elements.slice(0, 160);
  }

  function collectTouchTargets() {
    return qsa('button,a,select,input,textarea,[role="button"],.dock-item,.qa-clickable').filter(function (el) { return visible(el) && !(state.overlay && state.overlay.contains(el)); }).slice(0, 220).map(function (el) {
      var r = rectOf(el);
      return {
        selector: selectorFor(el),
        label: clampText(textOf(el) || el.getAttribute('aria-label') || el.getAttribute('title') || '', 80),
        rect: r,
        ok44: !!(r && r.width >= 44 && r.height >= 44)
      };
    });
  }

  function collectOverflowFindings() {
    var out = {
      pageHorizontalOverflow: document.documentElement.scrollWidth > (window.innerWidth + 2),
      offscreen: [],
      clipped: []
    };
    qsa('body *').forEach(function (el) {
      if (!visible(el) || (state.overlay && state.overlay.contains(el))) return;
      var r = rectOf(el);
      if (r && (r.right > window.innerWidth + 2 || r.left < -2) && out.offscreen.length < 30) {
        if (!isAllowedHorizontalScroller(el)) out.offscreen.push({ selector: selectorFor(el), text: clampText(textOf(el), 80), rect: r });
      }
      if (el.scrollWidth > el.clientWidth + 2 && out.clipped.length < 30) {
        var cs = getComputedStyle(el);
        if (/hidden|clip/i.test(cs.overflowX || cs.overflow || '')) out.clipped.push({ selector: selectorFor(el), text: clampText(textOf(el), 80), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
      }
    });
    return out;
  }

  function collectVisibleTextBlocks() {
    var blocks = qsa('h1,h2,h3,h4,p,li,button,a,label,.card,.analysis-v2-kpi,.analysis-v2-coach').filter(function(el){ return visible(el) && !(state.overlay && state.overlay.contains(el)); }).map(function (el) {
      return { selector: selectorFor(el), text: clampText(textOf(el), 180), rect: rectOf(el) };
    }).filter(function (x) { return x.text; });
    return blocks.slice(0, 180);
  }

  function collectSvgAndCanvas() {
    var svgs = qsa('svg').filter(visible).slice(0, 30).map(function (el) {
      return { selector: selectorFor(el), rect: rectOf(el), childCount: el.children ? el.children.length : 0, text: clampText(textOf(el), 80) };
    });
    var canvases = qsa('canvas').filter(visible).slice(0, 30).map(function (el) {
      var dataUrl = null;
      try { dataUrl = el.toDataURL('image/png').slice(0, 140); } catch (e) { dataUrl = 'blocked:' + e.message; }
      return { selector: selectorFor(el), rect: rectOf(el), width: el.width, height: el.height, dataUrlPreview: dataUrl };
    });
    return { svgs: svgs, canvases: canvases };
  }



  /* G54.43.8H · Admin Portal Mobile Containment Fix
     Ziel: Nicht nur technische Scroll-/Overflow-Checks, sondern echte sichtbare Kollisionen erkennen.
     Schwerpunkt: Mobile iPhone Deep-Sheets, Analyse-Dashboard, Stärken-/Schwächen-Bars,
     Text-/Badge-/Bar-Kollisionen, gequetschte Karten, Dock/QA-Overlay-Kollisionen. */
  function rectArea(r) { return !r ? 0 : Math.max(0, (r.right || 0) - (r.left || 0)) * Math.max(0, (r.bottom || 0) - (r.top || 0)); }
  function rectIntersect(a, b) {
    if (!a || !b) return null;
    var left = Math.max(a.left, b.left), top = Math.max(a.top, b.top), right = Math.min(a.right, b.right), bottom = Math.min(a.bottom, b.bottom);
    if (right <= left || bottom <= top) return null;
    return { left: Math.round(left), top: Math.round(top), right: Math.round(right), bottom: Math.round(bottom), width: Math.round(right-left), height: Math.round(bottom-top), area: Math.round((right-left)*(bottom-top)) };
  }
  function rectGapX(a, b) {
    if (!a || !b) return 0;
    if (a.right <= b.left) return Math.round(b.left - a.right);
    if (b.right <= a.left) return Math.round(a.left - b.right);
    return -Math.round((rectIntersect(a,b)||{width:0}).width || 0);
  }
  function rectGapY(a, b) {
    if (!a || !b) return 0;
    if (a.bottom <= b.top) return Math.round(b.top - a.bottom);
    if (b.bottom <= a.top) return Math.round(a.top - b.bottom);
    return -Math.round((rectIntersect(a,b)||{height:0}).height || 0);
  }
  function isDescendant(a, b) { try { return !!(a && b && a !== b && a.contains && a.contains(b)); } catch(e){ return false; } }
  function elementLabel(el) {
    var t = clampText(textOf(el), 70);
    if (t) return t;
    if (el && el.getAttribute) return el.getAttribute('aria-label') || el.getAttribute('title') || selectorFor(el);
    return selectorFor(el);
  }
  function finding(severity, type, message, nodes, extra) {
    return Object.assign({ severity: severity || 'warn', type: type || 'visual', message: message || '', nodes: nodes || [] }, extra || {});
  }
  function nodeInfo(el) { return el ? { selector: selectorFor(el), label: elementLabel(el), rect: rectOf(el), css: cssOf(el) } : null; }

  function isInDock(el, dock) {
    try { return !!(dock && el && (el === dock || dock.contains(el))); } catch (e) { return false; }
  }
  function isAllowedHorizontalScroller(el) {
    try {
      var scroller = el && el.closest && el.closest('.egt-portal-tab-group,.egt-admin-tabs,.egt-portal-tabs,.egt-portal-tabbar');
      if (!scroller) return false;
      var cs = getComputedStyle(scroller);
      return /auto|scroll|overlay/i.test(cs.overflowX || cs.overflow || '') && scroller.scrollWidth > scroller.clientWidth + 2;
    } catch (e) { return false; }
  }

  function detectStrengthWeaknessCollisions() {
    var out = [];
    qsa('.analysis-v2-bar-row').forEach(function (row) {
      if (!visible(row) && visibleRatio(rectOf(row)) <= 0) return;
      var labelWrap = qs('span', row);
      var badge = qs('span em', row);
      var track = qs('.analysis-v2-bar-track', row);
      var percent = qs('b', row);
      var rr = rectOf(row), lr = rectOf(labelWrap), br = rectOf(badge), tr = rectOf(track), pr = rectOf(percent);
      var rowName = clampText(textOf(labelWrap).replace(/\s+/g, ' '), 80) || selectorFor(row);
      if (badge && track) {
        var interBT = rectIntersect(br, tr);
        var gapBT = rectGapX(br, tr);
        if (interBT && interBT.area >= 8) {
          out.push(finding('warn', 'strength_weakness_badge_bar_collision', 'Badge überlappt den Balken in Stärken/Schwächen: ' + rowName, [nodeInfo(row), nodeInfo(badge), nodeInfo(track)], { intersection: interBT, gapX: gapBT }));
        } else if (gapBT < 6) {
          out.push(finding('warn', 'strength_weakness_badge_bar_too_close', 'Badge und Balken haben zu wenig Abstand in Stärken/Schwächen: ' + rowName, [nodeInfo(row), nodeInfo(badge), nodeInfo(track)], { gapX: gapBT, minGap: 6 }));
        }
      }
      if (labelWrap && track) {
        var interLT = rectIntersect(lr, tr);
        if (interLT && interLT.area >= 10) {
          out.push(finding('warn', 'strength_weakness_label_bar_collision', 'Label-Bereich ragt in den Balken hinein: ' + rowName, [nodeInfo(row), nodeInfo(labelWrap), nodeInfo(track)], { intersection: interLT }));
        }
      }
      if (track && percent) {
        var interTP = rectIntersect(tr, pr);
        var gapTP = rectGapX(tr, pr);
        if (interTP && interTP.area >= 8) {
          out.push(finding('warn', 'strength_weakness_bar_percent_collision', 'Balken überlappt Prozentwert: ' + rowName, [nodeInfo(row), nodeInfo(track), nodeInfo(percent)], { intersection: interTP, gapX: gapTP }));
        } else if (gapTP < 6) {
          out.push(finding('warn', 'strength_weakness_bar_percent_too_close', 'Balken und Prozentwert stehen zu eng: ' + rowName, [nodeInfo(row), nodeInfo(track), nodeInfo(percent)], { gapX: gapTP, minGap: 6 }));
        }
      }
      if (rr && rr.height < 34 && window.innerWidth <= 520) {
        out.push(finding('info', 'strength_weakness_row_compressed', 'Stärken/Schwächen-Zeile wirkt auf Mobile sehr niedrig/gequetscht: ' + rowName, [nodeInfo(row)], { rowHeight: rr.height, recommendedMinHeight: 44 }));
      }
      if (window.innerWidth <= 520 && labelWrap && badge && track) {
        // Mobile Layout sollte Label/Badge und Track sauber getrennt halten. Wenn die Label-Spalte zu knapp ist, warnen.
        var recommendedTrackTop = Math.max((lr && lr.bottom) || 0, (br && br.bottom) || 0) + 6;
        if (tr && tr.top < recommendedTrackTop && rectGapX(br, tr) < 10) {
          out.push(finding('warn', 'strength_weakness_mobile_needs_two_line_layout', 'Mobile Layout sollte Badge/Text oben und Balken darunter trennen: ' + rowName, [nodeInfo(row), nodeInfo(badge), nodeInfo(track)], { currentTrackTop: tr.top, recommendedTrackTop: Math.round(recommendedTrackTop) }));
        }
      }
    });
    return out.slice(0, 30);
  }

  function detectTextCollisions() {
    var candidates = qsa('h1,h2,h3,h4,p,li,button,a,label,span,em,b,strong,small,.analysis-v2-kpi,.analysis-v2-chart-head,.analysis-v2-legend span,.analysis-v2-data-chip')
      .filter(function (el) {
        if (!visible(el) || (state.overlay && state.overlay.contains(el))) return false;
        if (el.closest && el.closest('svg')) return false;
        var r = rectOf(el); if (!r || r.width < 8 || r.height < 8 || rectArea(r) < 48) return false;
        var txt = clampText(textOf(el), 80);
        return !!txt;
      })
      .slice(0, 220);
    var out = [];
    for (var i=0;i<candidates.length;i++) {
      for (var j=i+1;j<candidates.length;j++) {
        var a = candidates[i], b = candidates[j];
        if (isDescendant(a,b) || isDescendant(b,a)) continue;
        if (a.parentElement !== b.parentElement && !(a.closest && b.closest && a.closest('.analysis-v2-bar-row') && a.closest('.analysis-v2-bar-row') === b.closest('.analysis-v2-bar-row'))) continue;
        var ar = rectOf(a), br = rectOf(b), inter = rectIntersect(ar, br);
        if (!inter || inter.area < 18) continue;
        var minArea = Math.min(rectArea(ar), rectArea(br));
        var ratio = minArea ? inter.area / minArea : 0;
        if (ratio < 0.12 && inter.height < 8) continue;
        out.push(finding('warn', 'text_element_collision', 'Text-/UI-Elemente überlappen sichtbar: „' + clampText(elementLabel(a), 28) + '“ / „' + clampText(elementLabel(b), 28) + '“', [nodeInfo(a), nodeInfo(b)], { intersection: inter, overlapRatio: Math.round(ratio*100)/100 }));
        if (out.length >= 25) return out;
      }
    }
    return out;
  }

  function detectCardPressure() {
    var out = [];
    qsa('.analysis-v2-chart-card,.analysis-v2-coach,.analysis-v2-kpi,.ui-deep-card,.ui-sheet-card,.ui-training-area-card,.ui-sim-hero-card').forEach(function (card) {
      if (!visible(card) || (state.overlay && state.overlay.contains(card))) return;
      var cr = rectOf(card); if (!cr) return;
      var children = Array.prototype.slice.call(card.children || []).filter(function (el) { return visible(el); });
      if (!children.length) return;
      var minLeft = 999999, maxRight = -999999, minTop = 999999, maxBottom = -999999;
      children.forEach(function (el) { var r = rectOf(el); if (!r) return; minLeft=Math.min(minLeft,r.left); maxRight=Math.max(maxRight,r.right); minTop=Math.min(minTop,r.top); maxBottom=Math.max(maxBottom,r.bottom); });
      var leftPad = minLeft - cr.left, rightPad = cr.right - maxRight, topPad = minTop - cr.top, bottomPad = cr.bottom - maxBottom;
      if (leftPad < 4 || rightPad < 4) out.push(finding('warn', 'card_horizontal_pressure', 'Karteninhalt klebt zu nah am Rand oder ist gequetscht: ' + selectorFor(card), [nodeInfo(card)], { leftPad: Math.round(leftPad), rightPad: Math.round(rightPad) }));
      if (bottomPad < 2 && cr.bottom < window.innerHeight - 4) out.push(finding('info', 'card_bottom_pressure', 'Karteninhalt hat unten kaum Luft: ' + selectorFor(card), [nodeInfo(card)], { bottomPad: Math.round(bottomPad) }));
    });
    return out.slice(0, 30);
  }

  function detectViewportRiskZones() {
    var out = [];
    var dock = qs('#egtBottomDock') || qs('.bottom-dock') || qs('.app-bottom-dock') || qs('.egt-bottom-dock');
    var dockRect = dock && visible(dock) ? rectOf(dock) : null;
    var qaRect = state.overlay ? rectOf(state.overlay) : null;
    qsa('button,a,input,select,textarea,[role="button"],.analysis-v2-chart-card,.analysis-v2-coach,.analysis-v2-bar-row').forEach(function (el) {
      if (!visible(el) || (state.overlay && state.overlay.contains(el))) return;
      var r = rectOf(el); if (!r) return;
      if (dockRect && !isInDock(el, dock)) {
        var interDock = rectIntersect(r, dockRect);
        if (interDock && interDock.area > 30) out.push(finding('warn', 'dock_visual_overlap', 'Sichtbares Element liegt im Bereich des Bottom-Docks: ' + elementLabel(el), [nodeInfo(el), nodeInfo(dock)], { intersection: interDock }));
      }
      if (qaRect && state.overlay && state.overlay.getAttribute('data-minimized') !== 'true') {
        var interQa = rectIntersect(r, qaRect);
        if (interQa && interQa.area > 80) out.push(finding('info', 'qa_overlay_covers_content', 'QA-Panel verdeckt aktuell App-Inhalt: ' + elementLabel(el), [nodeInfo(el)], { intersection: interQa }));
      }
    });
    return out.slice(0, 30);
  }

  function collectVisualMonsterFindings() {
    var strength = detectStrengthWeaknessCollisions();
    var textCollisions = detectTextCollisions();
    var pressure = detectCardPressure();
    var riskZones = detectViewportRiskZones();
    var all = strength.concat(textCollisions).concat(pressure).concat(riskZones);
    var warnCount = all.filter(function(f){ return f.severity === 'warn'; }).length;
    var failCount = all.filter(function(f){ return f.severity === 'fail'; }).length;
    var infoCount = all.filter(function(f){ return f.severity === 'info'; }).length;
    return {
      version: 'G54.43.8H-monster-detector',
      summary: {
        total: all.length,
        fails: failCount,
        warnings: warnCount,
        info: infoCount,
        status: failCount ? 'fail' : warnCount ? 'warn' : 'pass'
      },
      detectors: {
        strengthWeaknessCollisions: strength,
        textCollisions: textCollisions,
        cardPressure: pressure,
        viewportRiskZones: riskZones
      },
      findings: all.slice(0, 80)
    };
  }


  function scoreCapture(capture) {
    var warnings = [];
    var fails = [];
    if (capture.environment.viewport.width < 320 || capture.environment.viewport.height < 480) warnings.push('Sehr kleiner Viewport.');
    if (capture.overflow.pageHorizontalOverflow) warnings.push('Dokument hat horizontalen Overflow.');
    if (capture.overflow.offscreen.length) warnings.push(capture.overflow.offscreen.length + ' Offscreen-Elemente erkannt.');
    if (capture.overflow.clipped.length) warnings.push(capture.overflow.clipped.length + ' potenziell abgeschnittene Elemente erkannt.');
    var smallTargets = capture.touchTargets.filter(function (t) { return !t.ok44; });
    if (smallTargets.length) warnings.push(smallTargets.length + ' Touch-Ziele unter 44px.');
    var visibleImportant = capture.importantElements.filter(function (x) { return x.visible; }).length;
    if (!visibleImportant) fails.push('Keine wichtigen sichtbaren App-Elemente erkannt.');
    if (capture.deepSheet && capture.deepSheet.active) {
      if (!capture.deepSheet.primaryScrollContainer) warnings.push('Deep-Sheet aktiv, aber kein Scrollcontainer erkannt.');
      else if (!capture.deepSheet.primaryScrollContainer.canScrollY && capture.deepSheet.primaryScrollContainer.scrollHeight > capture.deepSheet.primaryScrollContainer.clientHeight + 8) warnings.push('Deep-Sheet-Inhalt wirkt länger als der Container, aber overflowY ist nicht scrollbar.');
      if (capture.deepSheet.dockOverlap && capture.deepSheet.dockOverlap.overlapsDock) warnings.push('Deep-Sheet-/Scrollbereich überschneidet sich mit Bottom-Dock.');
    }
    if (capture.visualMonster && capture.visualMonster.summary) {
      if (capture.visualMonster.summary.fails) fails.push('Monster Visual QA: ' + capture.visualMonster.summary.fails + ' kritische visuelle Kollision(en).');
      if (capture.visualMonster.summary.warnings) warnings.push('Monster Visual QA: ' + capture.visualMonster.summary.warnings + ' visuelle Warnung(en), z. B. Überlappung/Gequetscht/Verdeckung.');
    }
    return { status: fails.length ? 'fail' : warnings.length ? 'warn' : 'pass', warnings: warnings, fails: fails, smallTouchTargets: smallTargets.slice(0, 20), visualFindings: capture.visualMonster && capture.visualMonster.findings ? capture.visualMonster.findings.slice(0, 20) : [] };
  }

  async function captureCurrentState(options) {
    if (state.busy) return state.lastCapture;
    state.busy = true;
    if (!state.overlay) openOverlay();
    try {
      setBody('Visual-State wird aufgenommen …');
      await sleep(80);
      var capture = {
        kind: 'visual-state-capture',
        reason: options && options.reason || 'manual',
        environment: environmentInfo(),
        importantElements: collectImportantElements(),
        touchTargets: collectTouchTargets(),
        overflow: collectOverflowFindings(),
        visibleTextBlocks: collectVisibleTextBlocks(),
        media: collectSvgAndCanvas(),
        deepSheet: collectDeepSheetIntelligence(),
        visualMonster: collectVisualMonsterFindings(),
        screenshot: state.screenshotDataUrl ? { type: 'image/png', dataUrl: state.screenshotDataUrl.slice(0, 240), note: 'Preview gekürzt; vollständiges PNG nur über separate Download-/Browserfunktion.' } : null
      };
      capture.score = scoreCapture(capture);
      state.lastCapture = capture;
      state.captures.push(capture);
      renderCapture(capture);
      try { window.dispatchEvent(new CustomEvent('egt:visual-state-captured', { detail: capture })); } catch (e) {}
      return capture;
    } catch (e) {
      setBody('<div class="egt-vsc__card egt-vsc__bad"><b>FAIL</b> Capture fehlgeschlagen.<div class="egt-vsc__detail">' + escapeHtml(e && e.message ? e.message : e) + '</div></div>');
      return null;
    } finally {
      state.busy = false;
    }
  }

  function renderCapture(capture) {
    var score = capture.score || { status: 'pass', warnings: [], fails: [] };
    var statusClass = score.status === 'fail' ? 'bad' : score.status === 'warn' ? 'warn' : 'ok';
    var html = '<div class="egt-vsc__grid"><div class="egt-vsc__pill"><b>' + capture.importantElements.filter(function (x) { return x.visible; }).length + '</b>sichtbar</div><div class="egt-vsc__pill"><b>' + capture.touchTargets.length + '</b>Targets</div><div class="egt-vsc__pill"><b>' + (score.warnings.length + score.fails.length) + '</b>Hinweise</div></div>';
    html += '<div class="egt-vsc__card egt-vsc__' + statusClass + '"><b>' + score.status.toUpperCase() + '</b> Visual-State aufgenommen.<div class="egt-vsc__detail">' + escapeHtml(capture.environment.timestamp + '\n' + capture.environment.viewport.width + '×' + capture.environment.viewport.height + ' @' + capture.environment.viewport.dpr + '\n' + capture.environment.route.hash + ' ' + capture.environment.route.search) + '</div></div>';
    if (score.fails.length || score.warnings.length) html += '<div class="egt-vsc__card egt-vsc__warn"><b>WARN</b> Befunde<div class="egt-vsc__detail">' + escapeHtml(score.fails.concat(score.warnings).join('\n')) + '</div></div>';
    if (score.smallTouchTargets && score.smallTouchTargets.length) html += '<div class="egt-vsc__card egt-vsc__warn"><b>TOUCH</b> Kleine Ziele<div class="egt-vsc__detail">' + escapeHtml(JSON.stringify(score.smallTouchTargets.slice(0, 8), null, 2)) + '</div></div>';
    if (capture.deepSheet && capture.deepSheet.active) {
      var ds = capture.deepSheet;
      var lines = [];
      lines.push('Sheet: ' + ((ds.context && ds.context.sheetTitle) || (ds.context && ds.context.sheetType) || 'aktiv'));
      lines.push('Context: ' + ((ds.context && ds.context.activeModule) || 'nicht erkannt'));
      if (ds.primaryScrollContainer) {
        lines.push('Scroller: ' + ds.primaryScrollContainer.selector);
        lines.push('ScrollY: ' + ds.primaryScrollContainer.scrollTop + '/' + ds.primaryScrollContainer.maxScrollY + ' · unten offen: ' + ds.primaryScrollContainer.bottomGap);
        lines.push('Kann scrollen: ' + (ds.primaryScrollContainer.canScrollY ? 'ja' : 'nein') + ' · unten erreicht: ' + (ds.primaryScrollContainer.atBottom ? 'ja' : 'nein'));
      } else lines.push('Scroller: nicht erkannt');
      if (ds.dockOverlap) lines.push('Dock-Overlap: ' + (ds.dockOverlap.overlapsDock ? 'ja' : 'nein'));
      html += '<div class="egt-vsc__card egt-vsc__' + (ds.primaryScrollContainer ? 'ok' : 'warn') + '"><b>DEEP-SHEET</b> Scroll-Analyse<div class="egt-vsc__detail">' + escapeHtml(lines.join('\n')) + '</div></div>';
    }
    if (capture.visualMonster && capture.visualMonster.summary) {
      var vm = capture.visualMonster;
      var vmClass = vm.summary.status === 'fail' ? 'bad' : vm.summary.status === 'warn' ? 'warn' : 'ok';
      var vmLines = [];
      vmLines.push('Status: ' + vm.summary.status.toUpperCase());
      vmLines.push('Findings: ' + vm.summary.total + ' · Warnungen: ' + vm.summary.warnings + ' · Kritisch: ' + vm.summary.fails);
      (vm.findings || []).slice(0, 8).forEach(function(f, idx){ vmLines.push((idx+1) + '. [' + f.type + '] ' + f.message); });
      html += '<div class="egt-vsc__card egt-vsc__' + vmClass + '"><b>MONSTER VISUAL QA</b> Kollisionen & echte Optik<div class="egt-vsc__detail">' + escapeHtml(vmLines.join('\n')) + '</div></div>';
    }
    if (score.visualFindings && score.visualFindings.length) html += '<div class="egt-vsc__card egt-vsc__warn"><b>VISUAL</b> Detail-Findings<div class="egt-vsc__detail">' + escapeHtml(JSON.stringify(score.visualFindings.slice(0, 5), null, 2)) + '</div></div>';
    if (state.screenshotDataUrl) html += '<div class="egt-vsc__card egt-vsc__ok"><b>PNG</b> Pixel-Screenshot vorhanden<img class="egt-vsc__shot" src="' + state.screenshotDataUrl + '" alt="Screenshot Preview"></div>';
    html += '<div class="egt-vsc__card"><b>JSON</b> Export bereit<div class="egt-vsc__detail">Nutze „JSON kopieren“ oder „JSON laden“ für die nächste Analyse-/Übergabeschicht.</div></div>';
    setBody(html);
  }

  async function capturePngFromScreen() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setBody('<div class="egt-vsc__card egt-vsc__warn"><b>WARN</b> Screen-Capture-API ist in diesem Browser nicht verfügbar. Der DOM-/Layout-State funktioniert trotzdem.</div>');
      return null;
    }
    try {
      var stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      var video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      await sleep(250);
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || window.innerWidth;
      canvas.height = video.videoHeight || window.innerHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      state.screenshotDataUrl = canvas.toDataURL('image/png');
      stream.getTracks().forEach(function (track) { track.stop(); });
      await captureCurrentState({ reason: 'manual-png' });
      return state.screenshotDataUrl;
    } catch (e) {
      setBody('<div class="egt-vsc__card egt-vsc__warn"><b>WARN</b> PNG-Aufnahme abgebrochen oder blockiert.<div class="egt-vsc__detail">' + escapeHtml(e.message || e) + '</div></div>');
      return null;
    }
  }

  function lastOrCreate() {
    return state.lastCapture || {
      kind: 'visual-state-capture',
      reason: 'empty-export',
      environment: environmentInfo(),
      importantElements: [], touchTargets: [], overflow: {}, visibleTextBlocks: [], media: {}, score: { status: 'warn', warnings: ['Noch kein Capture ausgeführt.'], fails: [] }
    };
  }

  async function copyLastCapture() {
    var capture = lastOrCreate();
    var text = JSON.stringify(capture, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      setBody((state.overlay && qs('[data-role="body"]', state.overlay) ? qs('[data-role="body"]', state.overlay).innerHTML : '') + '<div class="egt-vsc__card egt-vsc__ok"><b>PASS</b> Capture-JSON wurde kopiert.</div>');
      return true;
    } catch (e) {
      window.prompt('Capture-JSON manuell kopieren:', text);
      return false;
    }
  }

  function downloadLastCapture() {
    var capture = lastOrCreate();
    var blob = new Blob([JSON.stringify(capture, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    var safeTime = (capture.environment && capture.environment.timestamp || nowIso()).replace(/[:.]/g, '-');
    a.href = URL.createObjectURL(blob);
    a.download = 'egt-visual-state-capture-' + safeTime + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }


  function showLastCaptureText() {
    var capture = lastOrCreate();
    var text = JSON.stringify(capture, null, 2);
    var html = '<div class="egt-vsc__card egt-vsc__ok"><b>JSON-Text</b><div class="egt-vsc__detail">Diesen Text kannst du markieren/kopieren und mir schicken. Falls „JSON kopieren“ auf iPhone blockiert wird, ist das der sichere Ersatz.</div></div>';
    html += '<textarea class="egt-vsc__textarea" readonly data-role="json-text">' + escapeHtml(text) + '</textarea>';
    setBody(html);
    setTimeout(function () {
      var ta = state.overlay && qs('textarea[data-role="json-text"]', state.overlay);
      if (ta) { try { ta.focus(); ta.select(); } catch (e) {} }
    }, 60);
    return text;
  }

  function shouldAutoStart() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var qa = params.get('qa');
      return qa === 'capture' || qa === 'visual-capture' || window.location.hash === '#qa-capture';
    } catch (e) { return window.location.hash === '#qa-capture'; }
  }

  function init(options) {
    openOverlay();
    if (options && options.autoCapture) captureCurrentState({ reason: 'auto' });
    return window.EGTVisualStateCapture;
  }

  window.EGTVisualStateCapture = {
    version: VERSION,
    init: init,
    openOverlay: openOverlay,
    captureCurrentState: captureCurrentState,
    capturePngFromScreen: capturePngFromScreen,
    copyLastCapture: copyLastCapture,
    downloadLastCapture: downloadLastCapture,
    showLastCaptureText: showLastCaptureText,
    getLastCapture: function () { return state.lastCapture; },
    getCaptures: function () { return state.captures.slice(); }
  };

  function boot() { if (shouldAutoStart()) init({ autoCapture: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
