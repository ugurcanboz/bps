/* BPS-Trainer V9.2.0 · Cloud Highscore Live Renderer
   Einziger Cloud-Renderer. Kein Konflikt mit app.js mehr.
   Übernimmt cloudHighscoreCard sobald sie im DOM erscheint.
   Race-Condition-sicher durch runId-Guard. */
(function () {
  'use strict';

  var VERSION = '9.2.0';
  var CARD_ID = 'cloudHighscoreCard';
  var inFlight = false;
  var currentRunId = null;

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function cfg() {
    return window.CLOUD_HIGHSCORE_CONFIG || {};
  }

  function isConfigured() {
    var c = cfg();
    return !!(c && c.enabled !== false && c.supabaseUrl && c.anonKey);
  }

  function getCard() {
    return document.getElementById(CARD_ID);
  }

  function buildHeaders() {
    var c = cfg();
    var key = String(c.anonKey || '').trim();
    var h = {
      'apikey': key,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    };
    // sb_publishable keys need Authorization as well
    if (/^(sb_publishable_|eyJ)/i.test(key)) {
      h['Authorization'] = 'Bearer ' + key;
    }
    return h;
  }

  function normalize(rows) {
    return (Array.isArray(rows) ? rows : [])
      .map(function (r) {
        return {
          player_name: r.player_name || r.name || 'Gast',
          percent: Math.max(0, Math.min(100, Number(r.percent) || 0)),
          score: Number(r.score) || 0,
          total: Number(r.total) || 0,
          title: r.title || r.mode || 'Training',
          class_code: r.class_code || '',
          created_at: r.created_at || ''
        };
      })
      .sort(function (a, b) {
        return (b.percent - a.percent) || (b.score - a.score) ||
          String(b.created_at).localeCompare(String(a.created_at));
      });
  }

  function rankLabel(p) {
    p = Number(p) || 0;
    if (p >= 85) return 'Diamond';
    if (p >= 70) return 'Platin';
    if (p >= 55) return 'Gold';
    if (p >= 40) return 'Silber';
    return 'Bronze';
  }

  function renderRows(rows) {
    var list = normalize(rows).slice(0, 20);
    if (!list.length) {
      return '<div class="hs-empty">Noch keine Einträge. Absolviere einen Test!</div>';
    }
    return '<ol class="hs-list">' + list.map(function (r, i) {
      var dateStr = r.created_at
        ? new Date(r.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
        : '';
      var sub = [r.title, dateStr].filter(Boolean).join(' · ');
      return '<li class="hs-row">' +
        '<span class="hs-pos">' + (i + 1) + '</span>' +
        '<span class="hs-main"><b>' + esc(r.player_name) + '</b><small>' + esc(sub) + '</small></span>' +
        '<span class="hs-score">' + esc(r.percent) + '%<small>' + esc(rankLabel(r.percent)) + '</small></span>' +
        '</li>';
    }).join('') + '</ol>';
  }

  async function fetchScores() {
    if (!isConfigured()) {
      throw new Error('Cloud nicht konfiguriert. data/cloud-config.js prüfen.');
    }
    var c = cfg();
    var base = String(c.supabaseUrl).replace(/\/$/, '');
    var table = String(c.table || 'highscores');
    var select = 'player_name,class_code,mode,title,percent,score,total,created_at,rank';
    var qs = '?select=' + encodeURIComponent(select) +
      '&order=percent.desc,score.desc,created_at.desc' +
      '&limit=' + Math.min(50, Number(c.limit) || 20);
    var url = base + '/rest/v1/' + table + qs;

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () {
      try { controller.abort(); } catch (e) { }
    }, 9000) : null;

    try {
      var res = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(),
        cache: 'no-store',
        mode: 'cors',
        signal: controller ? controller.signal : undefined
      });
      var text = await res.text().catch(function () { return ''; });
      if (!res.ok) {
        throw new Error('Supabase HTTP ' + res.status + (text ? ': ' + text.slice(0, 200) : ''));
      }
      var data = [];
      try { data = JSON.parse(text || '[]'); } catch (e) {
        throw new Error('JSON-Fehler: ' + (e.message || e));
      }
      return { rows: normalize(data), count: data.length, status: res.status };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function renderLoading(card, runId) {
    card.dataset.hsRunId = runId;
    card.dataset.hsRenderer = VERSION;
    card.innerHTML =
      '<span class="coach-badge hs-badge-online">Cloud Highscore</span>' +
      '<div class="hs-loading"><div class="hs-spinner"></div><span>Ranking wird geladen…</span></div>';
  }

  function renderSuccess(card, rows, count, status) {
    card.dataset.hsRenderer = VERSION;
    card.innerHTML =
      '<div class="hs-header">' +
        '<span class="coach-badge hs-badge-online">Cloud Highscore · Online</span>' +
        '<button class="hs-refresh-btn" type="button" aria-label="Neu laden" title="Ranking neu laden">↺</button>' +
      '</div>' +
      '<div class="hs-meta">Live aus Supabase · ' + esc(count) + ' Einträge</div>' +
      renderRows(rows) +
      '<button class="hs-test-btn ghost" type="button">Testeintrag senden</button>';

    var refreshBtn = card.querySelector('.hs-refresh-btn');
    if (refreshBtn) refreshBtn.onclick = function () { refresh(true); };

    var testBtn = card.querySelector('.hs-test-btn');
    if (testBtn) testBtn.onclick = function () { sendTestEntry(); };
  }

  function renderError(card, error) {
    var isLocal = location.protocol === 'file:';
    card.dataset.hsRenderer = VERSION;
    card.innerHTML =
      '<div class="hs-header">' +
        '<span class="coach-badge hs-badge-offline">Cloud Highscore · Offline</span>' +
        '<button class="hs-refresh-btn" type="button" aria-label="Neu laden" title="Erneut versuchen">↺</button>' +
      '</div>' +
      '<div class="hs-error">' +
        '<div class="hs-error-msg">' + esc(error && error.message ? error.message : String(error)) + '</div>' +
        (isLocal ? '<div class="hs-error-hint">Tipp: Über GitHub Pages oder localhost testen, nicht file://</div>' : '') +
      '</div>' +
      renderLocalFallback() +
      '<button class="hs-test-btn ghost" type="button" style="margin-top:10px">Erneut versuchen</button>';

    var refreshBtn = card.querySelector('.hs-refresh-btn');
    if (refreshBtn) refreshBtn.onclick = function () { refresh(true); };
    var retryBtn = card.querySelector('.hs-test-btn');
    if (retryBtn) retryBtn.onclick = function () { refresh(true); };
  }

  function renderLocalFallback() {
    try {
      if (!window.App || !App._test || !App._test.HighscoreEngine) return '';
      var results = App._test.StorageEngine ? (App._test.StorageEngine.read([]) || []) : [];
      var hs = App._test.HighscoreEngine.build(results);
      if (!hs.top || !hs.top.length) return '';
      var localRows = hs.top.slice(0, 5).map(function (r) {
        return { player_name: r.player_name || 'Du', percent: r.percent || 0, score: r.score || 0, title: r.title || r.mode || 'Training', created_at: r.date || '' };
      });
      return '<div class="hs-local-fallback"><div class="hs-local-label">Lokaler Highscore</div>' + renderRows(localRows) + '</div>';
    } catch (e) { return ''; }
  }

  async function sendTestEntry() {
    var card = getCard();
    if (!card) return;
    if (!isConfigured()) { if (card) renderError(card, new Error('Cloud nicht konfiguriert')); return; }
    try {
      if (window.App && typeof App.addCloudTestScore === 'function') {
        await App.addCloudTestScore();
        setTimeout(function () { refresh(true); }, 1200);
        return;
      }
    } catch (e) { }
    // Fallback: direct insert
    var c = cfg();
    var base = String(c.supabaseUrl).replace(/\/$/, '');
    var table = String(c.table || 'highscores');
    var payload = {
      player_name: 'Test-Eintrag',
      class_code: c.classCode || 'default',
      mode: 'cloud-test',
      title: 'Cloud Test ' + new Date().toLocaleTimeString('de-DE'),
      percent: 88,
      score: 22,
      total: 25
    };
    try {
      await fetch(base + '/rest/v1/' + table, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
        cache: 'no-store'
      });
      setTimeout(function () { refresh(true); }, 1200);
    } catch (e) {
      renderError(card, e);
    }
  }

  async function refresh(force) {
    var card = getCard();
    if (!card) return;
    if (inFlight && !force) return;

    var runId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    currentRunId = runId;
    inFlight = true;

    renderLoading(card, runId);

    try {
      var result = await fetchScores();
      // Guard: stale refresh cancelled by newer one
      if (currentRunId !== runId) return;
      card = getCard();
      if (!card) return;
      renderSuccess(card, result.rows, result.count, result.status);
    } catch (e) {
      if (currentRunId !== runId) return;
      card = getCard();
      if (!card) return;
      renderError(card, e);
    } finally {
      inFlight = false;
    }
  }

  function shouldTakeOver(card) {
    if (!card) return false;
    // Take over if not yet owned by this renderer version
    return card.dataset.hsRenderer !== VERSION;
  }

  function attach() {
    // MutationObserver: trigger on card appearing or being replaced
    var mo = new MutationObserver(function () {
      var card = getCard();
      if (card && shouldTakeOver(card)) {
        setTimeout(function () { refresh(false); }, 30);
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Retry guard: if card shows stale state, re-render
    setInterval(function () {
      var card = getCard();
      if (card && shouldTakeOver(card)) refresh(false);
    }, 3000);

    // Initial load with delay to let app.js render first
    setTimeout(function () { refresh(true); }, 400);
    setTimeout(function () { refresh(true); }, 1500);
  }

  window.HighscoreLiveRenderer = { version: VERSION, refresh: refresh, fetchScores: fetchScores };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
