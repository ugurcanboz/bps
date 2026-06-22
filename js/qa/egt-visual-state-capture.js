/* Eignungstest-Trainer · G54.43.7 · Screenshot-Recorder / Visual-State-Capture
   Interner QA-Capture-Modus: ?qa=capture, ?qa=visual-capture oder #qa-capture
   Hinweis: Echte Pixel-Screenshots sind im Browser aus Sicherheitsgründen nur nach Nutzerklick
   über die Screen-Capture-API möglich. Der Visual-State-Capture läuft zusätzlich voll lokal
   und exportiert DOM-/Layout-/Viewport-Zustände ohne externe Dienste. */
(function () {
  'use strict';

  var VERSION = 'G54.43.8C';
  var state = {
    overlay: null,
    captures: [],
    lastCapture: null,
    busy: false,
    screenshotDataUrl: null
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
      '.egt-vsc{position:fixed;z-index:2147483599;left:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));width:min(460px,calc(100vw - 24px));max-height:min(58vh,560px);overflow:hidden;border:1px solid rgba(59,130,246,.45);border-radius:18px;background:rgba(2,6,23,.96);color:#f8fafc;box-shadow:0 22px 70px rgba(0,0,0,.45);font:13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;touch-action:auto;overscroll-behavior:contain}',
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

  function openOverlay() {
    ensureStyles();
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
      if (action === 'close') { el.remove(); state.overlay = null; return true; }
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

  function routeInfo() {
    return {
      href: location.href,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      title: document.title || '',
      activeModule: (window.EGTModuleHost && window.EGTModuleHost.currentModule) || (window.EGTState && window.EGTState.currentModule) || null
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
      'main', '#app', '.app-shell', '.home-shell', '.bottom-dock', '.app-bottom-dock', '.deep-sheet', '.deep-sheet-panel', '.sheet',
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
        out.offscreen.push({ selector: selectorFor(el), text: clampText(textOf(el), 80), rect: r });
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
    return { status: fails.length ? 'fail' : warnings.length ? 'warn' : 'pass', warnings: warnings, fails: fails, smallTouchTargets: smallTargets.slice(0, 20) };
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
