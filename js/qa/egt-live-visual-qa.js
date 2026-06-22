/* Eignungstest-Trainer · G54.43.6 · Live Visual QA Cockpit
   Interner Browser-QA-Modus für echte Geräte: ?qa=visual oder #qa-visual
   Keine Produktivdaten-Übertragung, kein externes Tracking. */
(function () {
  'use strict';

  var VERSION = 'G54.43.8M';
  var state = {
    overlay: null,
    report: null,
    running: false,
    openedOnce: false
  };

  function nowIso() { try { return new Date().toISOString(); } catch (e) { return String(Date.now()); } }
  function qs(sel, root) { try { return (root || document).querySelector(sel); } catch (e) { return null; } }
  function qsa(sel, root) { try { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); } catch (e) { return []; } }
  function textOf(el) { return el && (el.innerText || el.textContent || '') || ''; }
  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var cs = window.getComputedStyle ? getComputedStyle(el) : null;
    if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0)) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom >= 0 && r.right >= 0 && r.top <= window.innerHeight && r.left <= window.innerWidth;
  }
  function visibleAll(sel) { return qsa(sel).filter(visible); }
  function statusRank(status) { return status === 'fail' ? 3 : status === 'warn' ? 2 : 1; }
  function add(checks, id, status, message, details) {
    checks.push({ id: id, status: status, message: message, details: details || null });
  }
  function hasText(words) {
    var body = textOf(document.body).toLowerCase();
    return words.some(function (w) { return body.indexOf(String(w).toLowerCase()) !== -1; });
  }
  function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

  function ensureStyles() {
    if (document.getElementById('egt-live-visual-qa-style')) return;
    var style = document.createElement('style');
    style.id = 'egt-live-visual-qa-style';
    style.textContent = [
      '.egt-live-visual-qa{position:fixed;z-index:2147483600;right:12px;bottom:calc(96px + env(safe-area-inset-bottom,0px));width:min(420px,calc(100vw - 24px));max-height:min(58vh,560px);overflow:hidden;border:1px solid rgba(148,163,184,.45);border-radius:18px;background:rgba(15,23,42,.96);color:#f8fafc;box-shadow:0 20px 60px rgba(0,0,0,.42);font:13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;touch-action:auto;overscroll-behavior:contain}',
      '.egt-live-visual-qa *{box-sizing:border-box}',
      '.egt-live-visual-qa__head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(148,163,184,.25)}.egt-live-visual-qa__head-actions{display:flex;gap:8px;align-items:center;flex:0 0 auto}',
      '.egt-live-visual-qa__title{font-weight:800;font-size:14px}.egt-live-visual-qa__meta{font-size:11px;color:#cbd5e1}',
      '.egt-live-visual-qa__body{padding:12px 14px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(min(58vh,560px) - 132px);overscroll-behavior:contain}',
      '.egt-live-visual-qa__actions{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid rgba(148,163,184,.25);background:rgba(15,23,42,.98)}',
      '.egt-live-visual-qa button{min-width:44px;min-height:44px;border:0;border-radius:999px;padding:10px 14px;background:#e2e8f0;color:#0f172a;font-weight:700;cursor:pointer;touch-action:manipulation}.egt-live-visual-qa[data-minimized="true"]{width:min(230px,calc(100vw - 24px));max-height:none}.egt-live-visual-qa[data-minimized="true"] .egt-live-visual-qa__body,.egt-live-visual-qa[data-minimized="true"] .egt-live-visual-qa__actions{display:none}',
      '.egt-live-visual-qa button[data-primary="true"]{background:#60a5fa;color:#07111f}',
      '.egt-live-visual-qa__summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 12px}',
      '.egt-live-visual-qa__pill{border-radius:14px;padding:9px;background:rgba(148,163,184,.14);text-align:center}.egt-live-visual-qa__pill b{display:block;font-size:18px}',
      '.egt-live-visual-qa__check{border-top:1px solid rgba(148,163,184,.18);padding:8px 0}.egt-live-visual-qa__check:first-child{border-top:0}',
      '.egt-live-visual-qa__check b{font-size:12px;text-transform:uppercase;margin-right:6px}.egt-live-visual-qa__pass b{color:#86efac}.egt-live-visual-qa__warn b{color:#fde68a}.egt-live-visual-qa__fail b{color:#fca5a5}',
      '.egt-live-visual-qa__msg{color:#e5e7eb}.egt-live-visual-qa__detail{color:#cbd5e1;font-size:11px;margin-top:3px;white-space:pre-wrap;word-break:break-word}',
      '@media(max-width:520px){.egt-live-visual-qa{left:8px;right:8px;bottom:calc(92px + env(safe-area-inset-bottom,0px));width:auto;max-height:min(54vh,520px);border-radius:16px}.egt-live-visual-qa__body{max-height:calc(min(54vh,520px) - 132px)}.egt-live-visual-qa__summary{grid-template-columns:repeat(3,1fr)}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function openOverlay() {
    ensureStyles();
    var old = document.getElementById('egt-live-visual-qa');
    if (old) old.remove();
    var el = document.createElement('section');
    el.id = 'egt-live-visual-qa';
    el.className = 'egt-live-visual-qa';
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="egt-live-visual-qa__head"><div><div class="egt-live-visual-qa__title">Live Visual QA</div><div class="egt-live-visual-qa__meta">' + VERSION + ' · echter Browser-Check</div></div><div class="egt-live-visual-qa__head-actions"><button type="button" data-action="minimize" aria-label="Overlay minimieren">−</button><button type="button" data-action="close" aria-label="Overlay schließen">×</button></div></div><div class="egt-live-visual-qa__body" data-role="body">Bereit. Starte „Analyse prüfen“, um DOM, Layout, Touch-Ziele und sichtbare Analysebereiche zu prüfen.</div><div class="egt-live-visual-qa__actions"><button type="button" data-primary="true" data-action="run">Analyse prüfen</button><button type="button" data-action="copy">Report kopieren</button></div>';
    document.body.appendChild(el);
    state.overlay = el;
    el.addEventListener('click', function (ev) {
      var action = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-action');
      if (action === 'close') el.remove();
      if (action === 'minimize') { var m = el.getAttribute('data-minimized') === 'true'; el.setAttribute('data-minimized', m ? 'false' : 'true'); ev.target.textContent = m ? '−' : '+'; return; }
      if (action === 'run') runAnalysisCheck();
      if (action === 'copy') copyReport();
    });
    return el;
  }

  function setBody(html) {
    var body = state.overlay && qs('[data-role="body"]', state.overlay);
    if (body) body.innerHTML = html;
  }

  function openAnalysis() {
    try {
      if (window.EGTAnalysisEntryModule && typeof window.EGTAnalysisEntryModule.open === 'function') {
        if (window.EGTAnalysisEntryModule.open({ source: 'live-visual-qa' })) return { ok: true, provider: 'EGTAnalysisEntryModule.open' };
      }
    } catch (e1) {}
    try {
      if (window.EGTUILayer && typeof window.EGTUILayer.openActionMenu === 'function') {
        if (window.EGTUILayer.openActionMenu('analysis')) return { ok: true, provider: 'EGTUILayer.openActionMenu(analysis)' };
        if (window.EGTUILayer.openActionMenu('progress')) return { ok: true, provider: 'EGTUILayer.openActionMenu(progress)' };
      }
    } catch (e2) {}
    var candidates = qsa('button,a,[role="button"]').concat(qsa('[data-action],[data-nav],[data-route]'));
    for (var i = 0; i < candidates.length; i++) {
      var label = (textOf(candidates[i]) + ' ' + (candidates[i].getAttribute('aria-label') || '') + ' ' + (candidates[i].getAttribute('data-action') || '')).toLowerCase();
      if (label.indexOf('analyse') !== -1 || label.indexOf('fortschritt') !== -1) {
        try { candidates[i].click(); return { ok: true, provider: 'DOM-click:' + label.slice(0, 48) }; } catch (e3) {}
      }
    }
    return { ok: false, provider: 'none' };
  }

  function findDeepSheet() {
    var selectors = ['.deep-sheet', '.deep-sheet-panel', '.action-sheet', '.sheet', '[data-deep-sheet]', '[data-analysis-dashboard-v2]'];
    for (var i = 0; i < selectors.length; i++) {
      var found = visibleAll(selectors[i]);
      if (found.length) return found[found.length - 1];
    }
    return null;
  }

  function collectChecks(openResult) {
    var checks = [];
    var viewport = { width: window.innerWidth || 0, height: window.innerHeight || 0, dpr: window.devicePixelRatio || 1 };
    add(checks, 'qa-boot', 'pass', 'Live Visual QA Cockpit geladen.', { version: VERSION });
    add(checks, 'viewport-fit', viewport.width >= 320 && viewport.height >= 480 ? 'pass' : 'warn', 'Viewport: ' + viewport.width + '×' + viewport.height + ' @' + viewport.dpr, viewport);
    add(checks, 'analysis-open-path', openResult && openResult.ok ? 'pass' : 'fail', openResult && openResult.ok ? 'Analyse-Öffnung erfolgreich über ' + openResult.provider + '.' : 'Analyse konnte über bekannte Pfade nicht geöffnet werden.', openResult);

    var deep = findDeepSheet();
    add(checks, 'analysis-opens', deep ? 'pass' : 'warn', deep ? 'Sichtbarer Sheet-/Analysebereich gefunden.' : 'Kein eindeutiger Deep-Sheet gefunden. Prüfe trotzdem sichtbaren DOM.', deep ? { className: deep.className || '', tag: deep.tagName } : null);

    var dashboard = qs('[data-analysis-dashboard-v2]') || qs('.analysis-v2-shell');
    add(checks, 'dashboard-v2-visible', visible(dashboard) ? 'pass' : 'fail', visible(dashboard) ? 'Analyse Dashboard V2 sichtbar.' : 'Analyse Dashboard V2 nicht sichtbar.', dashboard ? { marker: dashboard.getAttribute('data-analysis-dashboard-v2') || null } : null);
    add(checks, 'filter-visible', visibleAll('.analysis-v2-filter, [data-analysis-filter], select').length ? 'pass' : 'warn', 'Filter/Select-Elemente sichtbar: ' + visibleAll('.analysis-v2-filter, [data-analysis-filter], select').length + '.', null);
    add(checks, 'kpi-visible', visibleAll('.analysis-v2-kpi, [data-analysis-kpi]').length ? 'pass' : 'fail', 'KPI-Karten sichtbar: ' + visibleAll('.analysis-v2-kpi, [data-analysis-kpi]').length + '.', null);
    add(checks, 'main-chart-visible', visibleAll('.analysis-v2-chart-card, [data-analysis-main-chart], svg, canvas').length ? 'pass' : 'fail', 'Diagramm-Kandidaten sichtbar: ' + visibleAll('.analysis-v2-chart-card, [data-analysis-main-chart], svg, canvas').length + '.', null);
    add(checks, 'bars-visible', visibleAll('.analysis-v2-bars, [data-analysis-bars]').length || hasText(['stärken', 'schwächen']) ? 'pass' : 'warn', 'Stärken-/Schwächen-Bereich geprüft.', null);
    add(checks, 'forecast-visible', hasText(['prognose', 'zielmarke']) || visibleAll('[data-analysis-forecast]').length ? 'pass' : 'warn', 'Prognose/Zielmarke im sichtbaren Dokument gesucht.', null);
    add(checks, 'forecast-chart-visible', hasText(['zielmarke']) || visibleAll('[data-analysis-forecast-chart], .analysis-v2-forecast-chart').length ? 'pass' : 'warn', 'Prognose-Diagramm bzw. Zielmarke geprüft.', null);
    add(checks, 'error-groups-visible', hasText(['fehleranalyse', 'fehlergruppe', 'trainingshinweis']) || visibleAll('[data-analysis-error-groups]').length ? 'pass' : 'warn', 'Fehleranalyse-Bereich geprüft.', null);
    add(checks, 'coach-visible', hasText(['coach']) || visibleAll('.analysis-v2-coach, [data-analysis-coach-insight]').length ? 'pass' : 'warn', 'Coach-Auswertung geprüft.', null);

    var root = deep || document.documentElement;
    var scrollable = root && root.scrollHeight > root.clientHeight + 8;
    var overflowY = root && window.getComputedStyle ? getComputedStyle(root).overflowY : '';
    add(checks, 'deepsheet-scrollable', !deep || !scrollable || /auto|scroll|overlay/i.test(overflowY) ? 'pass' : 'warn', deep ? 'Deep-Sheet Scroll: scrollHeight=' + root.scrollHeight + ', clientHeight=' + root.clientHeight + ', overflowY=' + overflowY : 'Kein Deep-Sheet: Scrollcheck auf Dokument reduziert.', null);

    var pageOverflow = document.documentElement.scrollWidth > (window.innerWidth + 2);
    var offenders = qsa('body *').filter(function (el) {
      if (!visible(el) || el.id === 'egt-live-visual-qa' || (state.overlay && state.overlay.contains(el))) return false;
      var r = el.getBoundingClientRect();
      return r.right > window.innerWidth + 2 || r.left < -2;
    }).slice(0, 8).map(function (el) { return (el.tagName || '') + (el.className ? '.' + String(el.className).trim().replace(/\s+/g, '.') : ''); });
    add(checks, 'horizontal-overflow', pageOverflow || offenders.length ? 'warn' : 'pass', pageOverflow || offenders.length ? 'Möglicher horizontaler Overflow erkannt.' : 'Kein horizontaler Overflow erkannt.', { documentWidth: document.documentElement.scrollWidth, viewportWidth: window.innerWidth, offenders: offenders });

    var small = qsa('button,a,select,[role="button"],.dock-item,.qa-clickable').filter(function (el) {
      if (!visible(el) || (state.overlay && state.overlay.contains(el))) return false;
      var r = el.getBoundingClientRect();
      return r.width < 44 || r.height < 44;
    }).slice(0, 12).map(function (el) { var r = el.getBoundingClientRect(); return { label: textOf(el).trim().slice(0, 50) || el.getAttribute('aria-label') || el.className || el.tagName, width: Math.round(r.width), height: Math.round(r.height) }; });
    add(checks, 'touch-targets', small.length ? 'warn' : 'pass', small.length ? small.length + ' sichtbare Touch-Ziele unter 44px gefunden.' : 'Alle geprüften Touch-Ziele erfüllen grob 44px.', { smallTargets: small });

    var dock = qs('.bottom-dock, .app-bottom-dock, nav[aria-label*="Bottom"], [data-bottom-dock]');
    if (dock && visible(dock) && deep && visible(deep)) {
      var dr = dock.getBoundingClientRect(); var rr = deep.getBoundingClientRect();
      var overlap = rr.bottom > dr.top && rr.top < dr.bottom;
      add(checks, 'bottom-dock-overlap', overlap ? 'warn' : 'pass', overlap ? 'Bottom-Dock kann Deep-Sheet/Inhalt überdecken.' : 'Keine direkte Bottom-Dock-Überdeckung erkannt.', { dockTop: Math.round(dr.top), sheetBottom: Math.round(rr.bottom) });
    } else {
      add(checks, 'bottom-dock-overlap', 'pass', 'Kein kritischer Dock-Overlap messbar.', null);
    }

    var clipped = qsa('body *').filter(function (el) {
      if (!visible(el) || (state.overlay && state.overlay.contains(el))) return false;
      var cs = getComputedStyle(el);
      return el.scrollWidth > el.clientWidth + 2 && /hidden|clip/i.test(cs.overflowX || cs.overflow || '');
    }).slice(0, 10).map(function (el) { return { label: textOf(el).trim().slice(0, 48), className: String(el.className || '').slice(0, 80), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }; });
    add(checks, 'text-clipping', clipped.length ? 'warn' : 'pass', clipped.length ? 'Möglicherweise abgeschnittene Texte/Elemente gefunden.' : 'Keine offensichtliche Textabschneidung gefunden.', { clipped: clipped });

    return checks;
  }

  function buildReport(checks) {
    var summary = checks.reduce(function (acc, c) { acc[c.status === 'pass' ? 'passed' : c.status === 'warn' ? 'warnings' : 'failed']++; return acc; }, { passed: 0, warnings: 0, failed: 0 });
    return { version: VERSION, timestamp: nowIso(), viewport: { width: window.innerWidth || 0, height: window.innerHeight || 0, dpr: window.devicePixelRatio || 1 }, userAgent: navigator.userAgent || '', summary: summary, checks: checks };
  }

  function renderReport(report) {
    state.report = report;
    var checksHtml = report.checks.sort(function (a, b) { return statusRank(b.status) - statusRank(a.status); }).map(function (c) {
      var detail = c.details ? '<div class="egt-live-visual-qa__detail">' + escapeHtml(JSON.stringify(c.details, null, 2)).slice(0, 1000) + '</div>' : '';
      return '<div class="egt-live-visual-qa__check egt-live-visual-qa__' + c.status + '"><b>' + c.status.toUpperCase() + '</b><span class="egt-live-visual-qa__msg">' + escapeHtml(c.message) + '</span><div class="egt-live-visual-qa__detail">' + escapeHtml(c.id) + '</div>' + detail + '</div>';
    }).join('');
    setBody('<div class="egt-live-visual-qa__summary"><div class="egt-live-visual-qa__pill"><b>' + report.summary.passed + '</b>PASS</div><div class="egt-live-visual-qa__pill"><b>' + report.summary.warnings + '</b>WARN</div><div class="egt-live-visual-qa__pill"><b>' + report.summary.failed + '</b>FAIL</div></div>' + checksHtml);
  }

  function escapeHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]; }); }

  async function runAnalysisCheck() {
    if (state.running) return;
    state.running = true;
    if (!state.overlay) openOverlay();
    setBody('Analyse wird geöffnet und live geprüft …');
    var openResult = openAnalysis();
    state.openedOnce = !!(openResult && openResult.ok);
    await sleep(650);
    var checks = collectChecks(openResult);
    var report = buildReport(checks);
    renderReport(report);
    state.running = false;
    return report;
  }

  async function copyReport() {
    var report = state.report || buildReport(collectChecks({ ok: state.openedOnce, provider: state.openedOnce ? 'previous-run' : 'not-run' }));
    var text = 'G54.43.6 Live Visual QA Report\n' + JSON.stringify(report, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      setBody((state.overlay && qs('[data-role="body"]', state.overlay) ? qs('[data-role="body"]', state.overlay).innerHTML : '') + '<div class="egt-live-visual-qa__check egt-live-visual-qa__pass"><b>PASS</b><span class="egt-live-visual-qa__msg">Report wurde kopiert.</span></div>');
      return true;
    } catch (e) {
      window.prompt('Report manuell kopieren:', text);
      return false;
    }
  }

  function shouldAutoStart() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('qa') === 'visual' || window.location.hash === '#qa-visual';
    } catch (e) { return window.location.hash === '#qa-visual'; }
  }

  function init(options) {
    openOverlay();
    if (options && options.autoRun) runAnalysisCheck();
    return window.EGTLiveVisualQA;
  }

  window.EGTLiveVisualQA = { version: VERSION, init: init, openOverlay: openOverlay, openAnalysis: openAnalysis, runAnalysisCheck: runAnalysisCheck, collectChecks: collectChecks, renderReport: renderReport, copyReport: copyReport };

  function boot() { if (shouldAutoStart()) init({ autoRun: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
