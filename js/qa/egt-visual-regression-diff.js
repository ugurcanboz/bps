/* Eignungstest-Trainer · G54.43.8 · Visual Regression / Capture-Diff
   Interner QA-Diff-Modus: ?qa=diff, ?qa=visual-diff oder #qa-diff
   Vergleicht zwei Visual-State-Capture-JSONs lokal im Browser. Kein Upload, kein Backend. */
(function () {
  'use strict';

  var VERSION = 'G54.43.8M';
  var STORAGE_KEY = 'egt.visualRegression.baseline.v1';
  var DEFAULTS = { rectTolerance: 8, sizeTolerance: 8, textTolerance: 18 };
  var state = { overlay: null, baseline: null, current: null, diff: null, busy: false };

  function nowIso() { try { return new Date().toISOString(); } catch (e) { return String(Date.now()); } }
  function qs(sel, root) { try { return (root || document).querySelector(sel); } catch (e) { return null; } }
  function qsa(sel, root) { try { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); } catch (e) { return []; } }
  function escapeHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]; }); }
  function clamp(str, max) { str = String(str || '').replace(/\s+/g, ' ').trim(); return str.length > max ? str.slice(0, max - 1) + '…' : str; }
  function abs(n) { return Math.abs(Number(n) || 0); }
  function num(n) { return Number(n) || 0; }
  function delta(a, b) { return Math.round(num(b) - num(a)); }
  function safeJsonParse(str) { try { return JSON.parse(str); } catch (e) { return null; } }
  function isCapture(obj) { return !!(obj && obj.kind === 'visual-state-capture' && obj.environment); }

  function ensureStyles() {
    if (document.getElementById('egt-visual-diff-style')) return;
    var style = document.createElement('style');
    style.id = 'egt-visual-diff-style';
    style.textContent = [
      '.egt-vdiff{position:fixed;z-index:2147483598;right:12px;top:calc(12px + env(safe-area-inset-top,0px));bottom:calc(96px + env(safe-area-inset-bottom,0px));width:min(520px,calc(100vw - 24px));max-height:none;overflow:hidden;border:1px solid rgba(168,85,247,.48);border-radius:18px;background:rgba(15,23,42,.97);color:#f8fafc;box-shadow:0 22px 72px rgba(0,0,0,.48);font:13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;touch-action:auto;overscroll-behavior:contain}',
      '.egt-vdiff *{box-sizing:border-box}.egt-vdiff__head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(148,163,184,.25)}.egt-vdiff__head-actions{display:flex;gap:8px;align-items:center;flex:0 0 auto}',
      '.egt-vdiff__title{font-weight:850;font-size:14px}.egt-vdiff__meta{font-size:11px;color:#cbd5e1}.egt-vdiff__body{padding:12px 14px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100% - 150px);overscroll-behavior:contain}',
      '.egt-vdiff__actions{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid rgba(148,163,184,.25);background:rgba(15,23,42,.98)}.egt-vdiff button{min-width:44px;min-height:44px;border:0;border-radius:999px;padding:10px 14px;background:#e2e8f0;color:#0f172a;font-weight:800;cursor:pointer;touch-action:manipulation}.egt-vdiff[data-minimized="true"]{width:min(270px,calc(100vw - 24px));bottom:auto}.egt-vdiff[data-minimized="true"] .egt-vdiff__body,.egt-vdiff[data-minimized="true"] .egt-vdiff__actions{display:none}.egt-vdiff button[data-primary="true"]{background:#c4b5fd;color:#111827}',
      '.egt-vdiff textarea{width:100%;min-height:120px;border-radius:14px;border:1px solid rgba(148,163,184,.35);background:rgba(2,6,23,.92);color:#e5e7eb;padding:10px;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;resize:vertical}.egt-vdiff input[type="file"]{width:100%;margin:8px 0;color:#e5e7eb}',
      '.egt-vdiff__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 10px}.egt-vdiff__pill{border-radius:14px;padding:9px;background:rgba(148,163,184,.14);text-align:center}.egt-vdiff__pill b{display:block;font-size:18px}',
      '.egt-vdiff__card{border-top:1px solid rgba(148,163,184,.18);padding:9px 0}.egt-vdiff__card:first-child{border-top:0}.egt-vdiff__pass b{color:#86efac}.egt-vdiff__warn b{color:#fde68a}.egt-vdiff__fail b{color:#fca5a5}.egt-vdiff__info b{color:#93c5fd}.egt-vdiff__detail{color:#cbd5e1;font-size:11px;white-space:pre-wrap;word-break:break-word;margin-top:4px}',
      '.egt-vdiff__small{font-size:11px;color:#cbd5e1}.egt-vdiff code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#ddd6fe}',
      '@media(max-width:560px){.egt-vdiff{left:8px;right:8px;top:calc(8px + env(safe-area-inset-top,0px));bottom:calc(92px + env(safe-area-inset-bottom,0px));width:auto;border-radius:16px}.egt-vdiff__grid{grid-template-columns:repeat(2,1fr)}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function openOverlay() {
    ensureStyles();
    var old = document.getElementById('egt-visual-diff');
    if (old) old.remove();
    var el = document.createElement('section');
    el.id = 'egt-visual-diff';
    el.className = 'egt-vdiff';
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="egt-vdiff__head"><div><div class="egt-vdiff__title">Visual Regression / Capture-Diff</div><div class="egt-vdiff__meta">' + VERSION + ' · Baseline gegen aktuellen Visual-State</div></div><div class="egt-vdiff__head-actions"><button type="button" data-action="minimize" aria-label="Overlay minimieren">−</button><button type="button" data-action="close" aria-label="Overlay schließen">×</button></div></div><div class="egt-vdiff__body" data-role="body"></div><div class="egt-vdiff__actions"><button type="button" data-primary="true" data-action="capture-current">Aktuell aufnehmen</button><button type="button" data-action="set-baseline">Als Baseline</button><button type="button" data-action="compare">Vergleichen</button><button type="button" data-action="import">Import</button><button type="button" data-action="copy">Diff kopieren</button></div>';
    document.body.appendChild(el);
    state.overlay = el;
    el.addEventListener('click', onAction);
    renderHome();
    return el;
  }

  function body() { return state.overlay && qs('[data-role="body"]', state.overlay); }
  function setBody(html) { var b = body(); if (b) b.innerHTML = html; }

  function onAction(ev) {
    var action = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-action');
    if (!action) return;
    if (action === 'close') { state.overlay.remove(); state.overlay = null; return; }
    if (action === 'minimize') { var m = state.overlay.getAttribute('data-minimized') === 'true'; state.overlay.setAttribute('data-minimized', m ? 'false' : 'true'); ev.target.textContent = m ? '−' : '+'; return; }
    if (action === 'capture-current') captureCurrent();
    if (action === 'set-baseline') setCurrentAsBaseline();
    if (action === 'compare') compareNow();
    if (action === 'import') renderImport();
    if (action === 'copy') copyDiff();
    if (action === 'save-import') importFromTextarea();
    if (action === 'load-stored') loadStoredBaseline();
    if (action === 'clear-stored') clearStoredBaseline();
    if (action === 'home') renderHome();
  }

  function renderHome() {
    var stored = readStoredBaseline();
    var html = '<div class="egt-vdiff__grid"><div class="egt-vdiff__pill"><b>' + (state.baseline ? '1' : stored ? 'S' : '0') + '</b>Baseline</div><div class="egt-vdiff__pill"><b>' + (state.current ? '1' : '0') + '</b>Aktuell</div><div class="egt-vdiff__pill"><b>' + (state.diff ? state.diff.summary.changed : '0') + '</b>Änderungen</div><div class="egt-vdiff__pill"><b>' + (state.diff ? state.diff.summary.failed : '0') + '</b>Fail</div></div>';
    html += '<div class="egt-vdiff__card egt-vdiff__info"><b>INFO</b> Workflow<div class="egt-vdiff__detail">1. Mit G54.43.7 einen sauberen Visual-State aufnehmen und hier als Baseline importieren oder speichern.\n2. Aktuellen Zustand aufnehmen.\n3. Diff erzeugen: Viewport, Elemente, Rechtecke, Touch-Ziele, Overflow, Text und Chart-/SVG-Präsenz werden verglichen.</div></div>';
    if (stored && !state.baseline) html += '<div class="egt-vdiff__card egt-vdiff__warn"><b>BASELINE</b> Gespeicherte Baseline vorhanden.<div class="egt-vdiff__detail"><button type="button" data-action="load-stored">Gespeicherte Baseline laden</button> <button type="button" data-action="clear-stored">Löschen</button></div></div>';
    if (state.baseline) html += '<div class="egt-vdiff__card egt-vdiff__pass"><b>BASELINE</b> ' + escapeHtml(describeCapture(state.baseline)) + '</div>';
    if (state.current) html += '<div class="egt-vdiff__card egt-vdiff__pass"><b>AKTUELL</b> ' + escapeHtml(describeCapture(state.current)) + '</div>';
    if (state.diff) html += renderDiffSummary(state.diff);
    setBody(html);
  }

  function describeCapture(c) {
    var env = c && c.environment || {};
    var vp = env.viewport || {};
    return (env.timestamp || 'ohne Zeit') + ' · ' + (vp.width || 0) + '×' + (vp.height || 0) + ' · ' + ((env.route && (env.route.hash || env.route.search || env.route.pathname)) || 'Route unbekannt');
  }

  function readStoredBaseline() {
    try { return safeJsonParse(localStorage.getItem(STORAGE_KEY) || ''); } catch (e) { return null; }
  }
  function saveStoredBaseline(c) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (e) {} }
  function loadStoredBaseline() { var c = readStoredBaseline(); if (isCapture(c)) state.baseline = c; renderHome(); }
  function clearStoredBaseline() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} state.baseline = null; renderHome(); }

  async function captureCurrent() {
    if (state.busy) return;
    state.busy = true;
    setBody('<div class="egt-vdiff__card egt-vdiff__info"><b>WAIT</b> Aktueller Visual-State wird aufgenommen …</div>');
    try {
      if (window.EGTVisualStateCapture && typeof window.EGTVisualStateCapture.captureCurrentState === 'function') {
        state.current = await window.EGTVisualStateCapture.captureCurrentState({ reason: 'visual-regression-current' });
      } else {
        state.current = minimalCapture();
      }
      state.diff = null;
    } finally {
      state.busy = false;
      renderHome();
    }
    return state.current;
  }

  function minimalCapture() {
    var els = qsa('main,#app,.app-shell,[data-analysis-dashboard-v2],.analysis-v2-shell,.analysis-v2-kpi,.analysis-v2-chart-card,.analysis-v2-bars,.analysis-v2-coach,button,a').slice(0, 160).map(function (el) {
      var r = el.getBoundingClientRect ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
      return { selector: selectorFor(el), text: clamp(el.innerText || el.textContent || '', 140), visible: r.width > 0 && r.height > 0, rect: { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) } };
    });
    return { kind: 'visual-state-capture', reason: 'minimal-visual-regression-capture', environment: { timestamp: nowIso(), version: VERSION, viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio || 1 }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, route: { href: location.href, pathname: location.pathname, search: location.search, hash: location.hash }, userAgent: navigator.userAgent || '' }, importantElements: els, touchTargets: [], overflow: { pageHorizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2, offscreen: [], clipped: [] }, visibleTextBlocks: [], media: { svgs: [], canvases: [] }, score: { status: 'warn', warnings: ['Minimaler Fallback-Capture; G54.43.7 Modul nicht gefunden.'], fails: [] } };
  }

  function selectorFor(el) {
    if (!el || !el.tagName) return '';
    if (el.id) return '#' + el.id;
    var out = el.tagName.toLowerCase();
    if (el.getAttribute) {
      var keys = ['data-route', 'data-action', 'data-module', 'data-analysis-dashboard-v2', 'data-capture-target'];
      for (var i = 0; i < keys.length; i++) { var v = el.getAttribute(keys[i]); if (v) return out + '[' + keys[i] + '="' + String(v).replace(/"/g, '') + '"]'; }
    }
    if (typeof el.className === 'string' && el.className.trim()) out += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.');
    return out;
  }

  function setCurrentAsBaseline() {
    if (!state.current) { renderMessage('warn', 'Keine aktuelle Aufnahme vorhanden.', 'Erst „Aktuell aufnehmen“ ausführen.'); return; }
    state.baseline = state.current;
    saveStoredBaseline(state.baseline);
    state.diff = null;
    renderHome();
  }

  function renderImport() {
    var html = '<div class="egt-vdiff__card egt-vdiff__info"><b>IMPORT</b> Baseline-Capture einfügen<div class="egt-vdiff__detail">Füge hier den JSON-Export aus G54.43.7 ein oder wähle eine JSON-Datei.</div></div>';
    html += '<textarea data-role="import-text" placeholder="Visual-State-Capture JSON hier einfügen …"></textarea><input type="file" accept="application/json,.json" data-role="import-file"><div class="egt-vdiff__actions" style="padding-left:0;border-top:0"><button type="button" data-primary="true" data-action="save-import">Baseline importieren</button><button type="button" data-action="home">Zurück</button></div>';
    setBody(html);
    var file = qs('[data-role="import-file"]', state.overlay);
    if (file) file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () { var ta = qs('[data-role="import-text"]', state.overlay); if (ta) ta.value = String(reader.result || ''); };
      reader.readAsText(f);
    });
  }

  function importFromTextarea() {
    var ta = qs('[data-role="import-text"]', state.overlay);
    var parsed = safeJsonParse(ta && ta.value || '');
    if (!isCapture(parsed)) { renderMessage('fail', 'Import fehlgeschlagen.', 'JSON ist kein gültiger Visual-State-Capture.'); return; }
    state.baseline = parsed;
    saveStoredBaseline(parsed);
    state.diff = null;
    renderHome();
  }

  function keyForElement(el, idx) { return (el && (el.selector || el.id || el.className || el.tag || 'el')) + '#' + idx; }
  function indexElements(list) {
    var counts = {}, map = {};
    (list || []).forEach(function (el) {
      var base = el.selector || el.id || el.className || el.tag || 'unknown';
      counts[base] = (counts[base] || 0) + 1;
      map[base + '#' + counts[base]] = el;
    });
    return map;
  }

  function compareNow() {
    if (!state.baseline) { var stored = readStoredBaseline(); if (isCapture(stored)) state.baseline = stored; }
    if (!state.baseline || !state.current) { renderMessage('warn', 'Vergleich nicht möglich.', 'Baseline und aktueller Capture müssen vorhanden sein.'); return null; }
    state.diff = compareCaptures(state.baseline, state.current, DEFAULTS);
    renderHome();
    return state.diff;
  }

  function compareCaptures(base, cur, options) {
    options = options || DEFAULTS;
    var findings = [];
    function add(id, status, message, details) { findings.push({ id: id, status: status, message: message, details: details || null }); }

    var bEnv = base.environment || {}, cEnv = cur.environment || {};
    var bVp = bEnv.viewport || {}, cVp = cEnv.viewport || {};
    var vpDelta = { width: delta(bVp.width, cVp.width), height: delta(bVp.height, cVp.height), dpr: Number((num(cVp.dpr) - num(bVp.dpr)).toFixed(2)) };
    add('viewport', abs(vpDelta.width) > 2 || abs(vpDelta.height) > 2 || abs(vpDelta.dpr) > 0.01 ? 'warn' : 'pass', abs(vpDelta.width) > 2 || abs(vpDelta.height) > 2 ? 'Viewport unterscheidet sich; Layout-Diff nur bedingt vergleichbar.' : 'Viewport stabil.', { baseline: bVp, current: cVp, delta: vpDelta });

    var bScore = base.score || {}, cScore = cur.score || {};
    if (bScore.status !== cScore.status) add(cScore.status === 'fail' ? 'score-regression-fail' : 'score-change', cScore.status === 'fail' ? 'fail' : 'warn', 'Visual-State-Score hat sich geändert.', { baseline: bScore.status, current: cScore.status, baselineWarnings: bScore.warnings || [], currentWarnings: cScore.warnings || [] });
    else add('score-stable', 'pass', 'Visual-State-Score stabil: ' + (cScore.status || 'unknown'), null);

    compareOverflow(add, base.overflow || {}, cur.overflow || {});
    compareTouch(add, base.touchTargets || [], cur.touchTargets || []);
    compareMedia(add, base.media || {}, cur.media || {});
    compareTexts(add, base.visibleTextBlocks || [], cur.visibleTextBlocks || [], options);
    compareElements(add, base.importantElements || [], cur.importantElements || [], options);

    var summary = findings.reduce(function (acc, f) { acc.total++; if (f.status === 'pass') acc.passed++; else if (f.status === 'warn') { acc.warnings++; acc.changed++; } else { acc.failed++; acc.changed++; } return acc; }, { total: 0, passed: 0, warnings: 0, failed: 0, changed: 0 });
    return { kind: 'visual-regression-diff', version: VERSION, timestamp: nowIso(), thresholds: options, baseline: describeCapture(base), current: describeCapture(cur), summary: summary, findings: findings };
  }

  function compareOverflow(add, b, c) {
    if (!!b.pageHorizontalOverflow !== !!c.pageHorizontalOverflow) add(c.pageHorizontalOverflow ? 'overflow-regression' : 'overflow-fixed', c.pageHorizontalOverflow ? 'fail' : 'warn', c.pageHorizontalOverflow ? 'Neuer horizontaler Seitenoverflow.' : 'Horizontaler Overflow wurde entfernt.', { baseline: b, current: c });
    else add('overflow-state', c.pageHorizontalOverflow ? 'warn' : 'pass', c.pageHorizontalOverflow ? 'Horizontaler Overflow bleibt vorhanden.' : 'Kein horizontaler Overflow.', { baselineOffscreen: (b.offscreen || []).length, currentOffscreen: (c.offscreen || []).length, baselineClipped: (b.clipped || []).length, currentClipped: (c.clipped || []).length });
    if ((c.offscreen || []).length > (b.offscreen || []).length) add('offscreen-increase', 'warn', 'Offscreen-Elemente haben zugenommen.', { baseline: (b.offscreen || []).length, current: (c.offscreen || []).length, examples: (c.offscreen || []).slice(0, 8) });
    if ((c.clipped || []).length > (b.clipped || []).length) add('clipping-increase', 'warn', 'Potenzielle Text-/Elementabschneidung hat zugenommen.', { baseline: (b.clipped || []).length, current: (c.clipped || []).length, examples: (c.clipped || []).slice(0, 8) });
  }

  function compareTouch(add, bTargets, cTargets) {
    var bSmall = (bTargets || []).filter(function (t) { return !t.ok44; }).length;
    var cSmall = (cTargets || []).filter(function (t) { return !t.ok44; }).length;
    if (cSmall > bSmall) add('touch-target-regression', 'warn', 'Mehr Touch-Ziele unter 44px als in der Baseline.', { baselineSmall: bSmall, currentSmall: cSmall, examples: (cTargets || []).filter(function (t) { return !t.ok44; }).slice(0, 10) });
    else add('touch-target-state', cSmall ? 'warn' : 'pass', cSmall ? 'Kleine Touch-Ziele weiterhin vorhanden, aber nicht mehr als Baseline.' : 'Keine kleinen Touch-Ziele im aktuellen Capture.', { baselineSmall: bSmall, currentSmall: cSmall });
  }

  function compareMedia(add, bMedia, cMedia) {
    var bSvg = (bMedia.svgs || []).length, cSvg = (cMedia.svgs || []).length;
    var bCan = (bMedia.canvases || []).length, cCan = (cMedia.canvases || []).length;
    if (cSvg < bSvg || cCan < bCan) add('media-missing', 'warn', 'Weniger sichtbare SVG/Canvas-Elemente als in der Baseline.', { baseline: { svgs: bSvg, canvases: bCan }, current: { svgs: cSvg, canvases: cCan } });
    else add('media-count', 'pass', 'SVG/Canvas-Präsenz stabil oder erweitert.', { baseline: { svgs: bSvg, canvases: bCan }, current: { svgs: cSvg, canvases: cCan } });
  }

  function compareTexts(add, bTexts, cTexts, options) {
    var bJoined = (bTexts || []).map(function (x) { return x.text; }).filter(Boolean).join(' | ');
    var cJoined = (cTexts || []).map(function (x) { return x.text; }).filter(Boolean).join(' | ');
    var countDelta = (cTexts || []).length - (bTexts || []).length;
    if (abs(countDelta) > options.textTolerance) add('text-block-count-change', 'warn', 'Anzahl sichtbarer Textblöcke hat sich deutlich geändert.', { baseline: (bTexts || []).length, current: (cTexts || []).length, delta: countDelta });
    else add('text-block-count', 'pass', 'Textblock-Anzahl grob stabil.', { baseline: (bTexts || []).length, current: (cTexts || []).length });
    if (bJoined && cJoined && bJoined.slice(0, 300) !== cJoined.slice(0, 300)) add('leading-text-change', 'warn', 'Frühe sichtbare Texte unterscheiden sich.', { baselinePreview: clamp(bJoined, 320), currentPreview: clamp(cJoined, 320) });
  }

  function compareElements(add, bList, cList, options) {
    var bMap = indexElements(bList), cMap = indexElements(cList);
    var bKeys = Object.keys(bMap), cKeys = Object.keys(cMap);
    var missing = bKeys.filter(function (k) { return !cMap[k]; }).slice(0, 20).map(function (k) { return { key: k, element: slimElement(bMap[k]) }; });
    var added = cKeys.filter(function (k) { return !bMap[k]; }).slice(0, 20).map(function (k) { return { key: k, element: slimElement(cMap[k]) }; });
    if (missing.length) add('important-elements-missing', 'fail', 'Wichtige Baseline-Elemente fehlen aktuell.', { missing: missing });
    else add('important-elements-present', 'pass', 'Alle wichtigen Baseline-Elemente sind weiterhin auffindbar.', { baselineCount: bKeys.length, currentCount: cKeys.length, addedCount: added.length });
    if (added.length) add('important-elements-added', 'warn', 'Neue wichtige Elemente im aktuellen Capture erkannt.', { added: added });

    var moved = [];
    bKeys.forEach(function (k) {
      var b = bMap[k], c = cMap[k];
      if (!b || !c || !b.rect || !c.rect) return;
      var d = { left: delta(b.rect.left, c.rect.left), top: delta(b.rect.top, c.rect.top), width: delta(b.rect.width, c.rect.width), height: delta(b.rect.height, c.rect.height) };
      if (abs(d.left) > options.rectTolerance || abs(d.top) > options.rectTolerance || abs(d.width) > options.sizeTolerance || abs(d.height) > options.sizeTolerance) {
        moved.push({ key: k, selector: c.selector || b.selector, delta: d, baseline: b.rect, current: c.rect, text: clamp(c.text || b.text, 80) });
      }
    });
    if (moved.length) add('layout-shifts', moved.length > 8 ? 'warn' : 'warn', moved.length + ' relevante Elementverschiebungen/Größenänderungen erkannt.', { thresholdPx: options.rectTolerance, examples: moved.slice(0, 18) });
    else add('layout-shifts', 'pass', 'Keine relevanten Elementverschiebungen über Schwellwert.', { thresholdPx: options.rectTolerance });
  }

  function slimElement(el) { return { selector: el.selector, text: clamp(el.text, 100), visible: el.visible, rect: el.rect }; }

  function renderDiffSummary(diff) {
    var html = '<div class="egt-vdiff__grid"><div class="egt-vdiff__pill"><b>' + diff.summary.passed + '</b>PASS</div><div class="egt-vdiff__pill"><b>' + diff.summary.warnings + '</b>WARN</div><div class="egt-vdiff__pill"><b>' + diff.summary.failed + '</b>FAIL</div><div class="egt-vdiff__pill"><b>' + diff.summary.total + '</b>Checks</div></div>';
    var sorted = diff.findings.slice().sort(function (a, b) { var r = { fail: 3, warn: 2, pass: 1 }; return (r[b.status] || 0) - (r[a.status] || 0); });
    sorted.forEach(function (f) {
      html += '<div class="egt-vdiff__card egt-vdiff__' + f.status + '"><b>' + f.status.toUpperCase() + '</b> ' + escapeHtml(f.message) + '<div class="egt-vdiff__detail"><code>' + escapeHtml(f.id) + '</code>' + (f.details ? '\n' + escapeHtml(JSON.stringify(f.details, null, 2)).slice(0, 1800) : '') + '</div></div>';
    });
    return html;
  }

  function renderMessage(status, title, detail) { setBody('<div class="egt-vdiff__card egt-vdiff__' + status + '"><b>' + status.toUpperCase() + '</b> ' + escapeHtml(title) + '<div class="egt-vdiff__detail">' + escapeHtml(detail || '') + '</div></div><div class="egt-vdiff__actions" style="padding-left:0;border-top:0"><button type="button" data-action="home">Zurück</button></div>'); }

  async function copyDiff() {
    var obj = state.diff || { kind: 'visual-regression-diff-empty', version: VERSION, timestamp: nowIso(), note: 'Noch kein Diff erzeugt.' };
    var text = JSON.stringify(obj, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      renderMessage('pass', 'Diff-JSON wurde kopiert.', 'Kann direkt in eine Schichtübergabe oder Bugliste übernommen werden.');
      return true;
    } catch (e) {
      window.prompt('Diff-JSON manuell kopieren:', text);
      return false;
    }
  }

  function shouldAutoStart() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var qa = params.get('qa');
      return qa === 'diff' || qa === 'visual-diff' || window.location.hash === '#qa-diff';
    } catch (e) { return window.location.hash === '#qa-diff'; }
  }

  async function init(options) {
    openOverlay();
    if (options && options.autoCapture) await captureCurrent();
    return window.EGTVisualRegressionDiff;
  }

  window.EGTVisualRegressionDiff = {
    version: VERSION,
    init: init,
    openOverlay: openOverlay,
    captureCurrent: captureCurrent,
    compareNow: compareNow,
    compareCaptures: compareCaptures,
    setBaseline: function (capture, persist) { if (!isCapture(capture)) return false; state.baseline = capture; if (persist !== false) saveStoredBaseline(capture); return true; },
    setCurrent: function (capture) { if (!isCapture(capture)) return false; state.current = capture; return true; },
    getState: function () { return { baseline: state.baseline, current: state.current, diff: state.diff }; }
  };

  function boot() { if (shouldAutoStart()) init({ autoCapture: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
