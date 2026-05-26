/* BPS-Trainer V9 · Apple-Style WordHub UI Layer
   Redesign: Icon Grid, Deep Sheet, Bottom Tab Bar
   Auto Dark/Light · Responsive · Touch-optimiert
   Kurs-sharing ready: selbsterklärend, kein Scrollen */
(function () {
  'use strict';

  var VERSION = 'v9.0.1';

  /* ── Tabs ─────────────────────────────────────────── */
  var TAB_HOME      = 0;
  var TAB_ANALYSE   = 1;
  var TAB_HIGHSCORE = 2;
  var TAB_SYSTEM    = 3;
  var activeTab     = TAB_HOME;

  /* ── Active sheet state ───────────────────────────── */
  var activeSheet = null;

  /* ── Module definitions ───────────────────────────── */
  var MODULES = [
    {
      id: 'simulation',
      label: 'Simulation',
      icon: '🎯',
      iconClass: 'c-indigo',
      kicker: 'Prüfungsnah',
      title: 'CTC / BPS Simulation',
      desc: 'Echter Testlauf mit Blocklogik. <strong>Ruhig bleiben</strong> – sichere Punkte zuerst holen.',
      tags: ['BPS', 'CTC', 'Mix'],
      modes: ['ctcBosch', 'simulation', 'eignungstest', 'bps', 'ctcLohr'],
      startLabel: 'Simulation starten'
    },
    {
      id: 'logik',
      label: 'Logik',
      icon: '🔢',
      iconClass: 'c-teal',
      kicker: 'Analyse',
      title: 'Logik unter Druck',
      desc: 'Zahlenreihen, Aussagen & Muster. Ziel: <strong>schnell erkennen</strong>, nicht grübeln.',
      tags: ['Zahlenreihen', 'Zeitdruck', 'Muster'],
      modes: ['logic', 'logischesDenken', 'zahlenreihen', 'cognitive', 'logicSprint'],
      startLabel: 'Logik starten'
    },
    {
      id: 'matrizen',
      label: 'Matrizen',
      icon: '◼',
      iconClass: 'c-violet',
      kicker: 'Visuelle Intelligenz',
      title: 'Muster sehen',
      desc: 'Reihen, Spalten & Beziehungen. <strong>Regel erkennen</strong> – nicht raten.',
      tags: ['Matrizen', 'Rotation', 'Reihenlogik'],
      modes: ['matrixTraining', 'matrices', 'matrix', 'matrizen', 'matrixOnlySprint'],
      startLabel: 'Matrizen starten'
    },
    {
      id: 'mathe',
      label: 'Mathe',
      icon: '✕',
      iconClass: 'c-orange',
      kicker: 'Kopfrechnen',
      title: 'Schnell rechnen',
      desc: 'Prozent, Dreisatz & Textaufgaben. <strong>Sichere Treffer</strong> unter Zeitdruck.',
      tags: ['Prozent', 'Dreisatz', '9 in 4 Min'],
      modes: ['math', 'mathe', 'textMath', 'kopfrechnen', 'mathSprint'],
      startLabel: 'Mathe starten'
    },
    {
      id: 'deutsch',
      label: 'Deutsch',
      icon: '✏️',
      iconClass: 'c-blue',
      kicker: 'Sprache',
      title: 'Sätze schärfen',
      desc: 'Satzergänzung, Wortlogik & Textverständnis. <strong>Sauber lesen</strong> und schnell lösen.',
      tags: ['Satzergänzung', 'Text', 'Sprache'],
      modes: ['sentenceCompletion', 'satzergänzung', 'deutsch', 'german', 'sentenceSprint'],
      startLabel: 'Deutsch starten'
    },
    {
      id: 'wissen',
      label: 'Wissen',
      icon: '🌐',
      iconClass: 'c-green',
      kicker: 'Tempo',
      title: '40 Fragen Modus',
      desc: 'Politik, Geschichte & Weltwissen. <strong>Antwort sofort abrufen</strong>.',
      tags: ['BRD', 'Weltwissen', 'Tempo'],
      modes: ['generalKnowledge', 'allgemeinwissen', 'knowledge', 'general', 'knowledgeSprint'],
      startLabel: 'Wissen starten'
    },
    {
      id: 'englisch',
      label: 'Englisch',
      icon: '🗣',
      iconClass: 'c-sky',
      kicker: 'Basics',
      title: 'Simple. Fast. Correct.',
      desc: 'Grundwortschatz & Grammatik. <strong>Keine Zeit verlieren</strong>.',
      tags: ['Grammar', 'Vocabulary', 'Basics'],
      modes: ['english', 'englisch'],
      startLabel: 'English starten'
    },
    {
      id: 'it',
      label: 'IT / FISI',
      icon: '💻',
      iconClass: 'c-slate',
      kicker: 'FISI',
      title: 'Technik verstehen',
      desc: 'Hardware, Netzwerk & EDV-Logik. <strong>Praktisch denken</strong>.',
      tags: ['Netzwerk', 'Hardware', 'OS'],
      modes: ['itSprint', 'it', 'edv', 'itBasics'],
      startLabel: 'IT starten'
    },
    {
      id: 'konzentration',
      label: 'Fokus',
      icon: '👁',
      iconClass: 'c-rose',
      kicker: 'Aufmerksamkeit',
      title: 'Fehler finden',
      desc: 'Schnelle Wahrnehmung unter Druck. <strong>Ruhig bleiben</strong> und präzise tippen.',
      tags: ['Fokus', 'Tempo', 'Fehlerblick'],
      modes: ['concentrationSprint', 'concentrationPro', 'concentration', 'aufmerksamkeit'],
      startLabel: 'Fokus starten'
    }
  ];

  /* ── Helpers ──────────────────────────────────────── */
  function $ (id) { return document.getElementById(id); }

  function esc (val) {
    return String(val == null ? '' : val).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
    });
  }

  var noticeTimer = null;
  function notice (text) {
    var n = $('whNotice');
    if (!n) return;
    clearTimeout(noticeTimer);
    n.textContent = text;
    n.classList.add('show');
    noticeTimer = setTimeout(function () { n.classList.remove('show'); }, 2400);
  }

  function availableModes () {
    try {
      if (window.App && App._test && App._test.MODES) return App._test.MODES;
    } catch (e) {}
    return {};
  }

  function pickMode (module) {
    var modes = availableModes();
    for (var i = 0; i < module.modes.length; i++) {
      if (modes[module.modes[i]]) return module.modes[i];
    }
    var keys = Object.keys(modes);
    return keys.length ? keys[0] : null;
  }

  function bankCount () {
    try {
      if (window.App && App._test && App._test.QuestionBankEngine) {
        var s = App._test.QuestionBankEngine.stats();
        if (s && s.total) return Number(s.total) || 0;
      }
    } catch (e) {}
    try {
      if (window.QUESTION_BANK_EXTERNAL && Array.isArray(window.QUESTION_BANK_EXTERNAL)) {
        return window.QUESTION_BANK_EXTERNAL.length;
      }
    } catch (e) {}
    return 0;
  }

  function resultStats () {
    try {
      if (window.App && App._test && App._test.StorageEngine) {
        var list = App._test.StorageEngine.read([]) || [];
        if (!list.length) return { runs: 0, percent: 0, best: 0 };
        var sum = list.reduce(function (a, x) { return a + (Number(x.percent) || 0); }, 0);
        var best = list.reduce(function (a, x) { return Math.max(a, Number(x.percent) || 0); }, 0);
        return {
          runs: list.length,
          percent: Math.max(0, Math.min(100, Math.round(sum / list.length))),
          best: best
        };
      }
    } catch (e) {}
    return { runs: 0, percent: 0, best: 0 };
  }

  function modeAmount (modeKey) {
    try {
      var m = availableModes()[modeKey] || {};
      return Number(m.amount) || 0;
    } catch (e) { return 0; }
  }

  /* ── Quiz Screen Tracking ─────────────────────────── */
  function onQuizVisible (visible) {
    var shell = $('whShell');
    if (!shell) return;
    if (visible) {
      document.body.classList.add('quiz-screen-active');
      shell.style.visibility = 'hidden';
      shell.style.pointerEvents = 'none';
    } else {
      document.body.classList.remove('quiz-screen-active');
      shell.style.visibility = '';
      shell.style.pointerEvents = '';
      updateTopBar();
    }
  }

  function watchQuizScreens () {
    var IDS = ['quiz', 'memory', 'blockIntro', 'result', 'analysis'];
    var mo = new MutationObserver(function () {
      var any = IDS.some(function (id) {
        var el = $(id);
        return el && !el.classList.contains('hidden');
      });
      onQuizVisible(any);
    });
    IDS.forEach(function (id) {
      var el = $(id);
      if (el) mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
    mo.observe(document.body, { childList: true, subtree: false });
  }

  /* ── Deep Sheet ───────────────────────────────────── */
  function openSheet (mod) {
    activeSheet = mod;
    var backdrop = $('whSheetBackdrop');
    var sheet    = $('whSheet');
    if (!backdrop || !sheet) return;

    var modeKey = pickMode(mod);
    var amount  = modeKey ? modeAmount(modeKey) : 0;
    var rs = resultStats();

    sheet.innerHTML =
      '<div class="wh-sheet-handle"></div>' +
      '<div class="wh-sheet-header">' +
        '<div class="wh-sheet-icon ' + esc(mod.iconClass) + '">' + esc(mod.icon) + '</div>' +
        '<div class="wh-sheet-info">' +
          '<div class="wh-sheet-name">' + esc(mod.title) + '</div>' +
          '<div class="wh-sheet-kicker">' + esc(mod.kicker) + '</div>' +
        '</div>' +
        '<button class="wh-sheet-close" id="whSheetClose" aria-label="Schließen">✕</button>' +
      '</div>' +
      '<div class="wh-sheet-sep"></div>' +
      '<div class="wh-sheet-body">' +
        (rs.runs > 0 ?
          '<div class="wh-sheet-stats">' +
            '<div class="wh-stat-chip"><strong>' + rs.runs + '</strong><span>Läufe</span></div>' +
            '<div class="wh-stat-chip"><strong>' + rs.percent + '%</strong><span>Ø Schnitt</span></div>' +
            '<div class="wh-stat-chip"><strong>' + rs.best + '%</strong><span>Bestzeit</span></div>' +
          '</div>'
        : '') +
        '<p class="wh-sheet-desc">' + mod.desc + '</p>' +
        '<div class="wh-sheet-pills">' +
          mod.tags.map(function (t) { return '<span class="wh-pill">' + esc(t) + '</span>'; }).join('') +
          (amount > 0 ? '<span class="wh-pill is-count">' + amount + ' Aufgaben</span>' : '') +
        '</div>' +
        '<div class="wh-sheet-actions">' +
          (mod.startLabel
            ? '<button class="wh-btn-primary" id="whSheetStart">' + esc(mod.startLabel) + '</button>' +
              '<button class="wh-btn-info" id="whSheetInfo" aria-label="Info">ℹ</button>'
            : '<div></div>') +
        '</div>' +
      '</div>';

    // Wire buttons
    var closeBtn = $('whSheetClose');
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);

    var startBtn = $('whSheetStart');
    if (startBtn) startBtn.addEventListener('click', function () {
      closeSheet();
      startModule(mod);
    });

    var infoBtn = $('whSheetInfo');
    if (infoBtn) infoBtn.addEventListener('click', function () {
      notice(mod.label + (amount ? ' · ' + amount + ' Aufgaben verfügbar.' : ' · Modus bereit.'));
    });

    backdrop.classList.add('show');
    // Force reflow for animation
    sheet.offsetHeight;
    sheet.classList.add('show');

    // Close on backdrop tap
    backdrop.onclick = function (e) {
      if (e.target === backdrop) closeSheet();
    };
  }

  function closeSheet () {
    var backdrop = $('whSheetBackdrop');
    var sheet    = $('whSheet');
    if (!backdrop || !sheet) return;
    sheet.classList.remove('show');
    backdrop.classList.remove('show');
    activeSheet = null;
  }

  /* ── Start Module ─────────────────────────────────── */
  function startModule (mod) {
    var modeKey = pickMode(mod);
    try {
      if (window.App && typeof App.selectMode === 'function' && modeKey) {
        App.selectMode(modeKey);
      }
      if (window.App && typeof App.prepareTest === 'function') {
        App.prepareTest();
        notice(mod.label + ' startet…');
        return;
      }
      if (window.App && typeof App.startMode === 'function' && modeKey) {
        App.startMode(modeKey);
        notice(mod.label + ' startet…');
        return;
      }
      notice('App-Core noch nicht bereit.');
    } catch (err) {
      notice('Fehler: ' + (err && err.message ? err.message : 'Unbekannt'));
    }
  }

  /* ── Highscore Refresh ────────────────────────────── */
  function triggerHighscoreRefresh () {
    if (window.HighscoreLiveRenderer && typeof HighscoreLiveRenderer.refresh === 'function') {
      HighscoreLiveRenderer.refresh(true);
    } else if (window.App && typeof App.refreshCloudRanking === 'function') {
      App.refreshCloudRanking();
    }
  }

  /* ── Tab Switching ────────────────────────────────── */
  function switchTab (tab) {
    activeTab = tab;
    renderTabBar();
    renderTabContent();
    if (tab === TAB_HIGHSCORE) {
      setTimeout(triggerHighscoreRefresh, 150);
    }
  }

  /* ── Render Top Bar ───────────────────────────────── */
  function updateTopBar () {
    var rs = resultStats();
    var pill = $('whProgressPill');
    if (pill) {
      pill.innerHTML =
        '<strong>' + rs.percent + '%</strong>' +
        '<span>' + rs.runs + ' Läufe</span>';
    }
  }

  /* ── Render Module Grid ───────────────────────────── */
  function renderGrid () {
    var grid = $('whGrid');
    if (!grid) return;

    grid.innerHTML = MODULES.map(function (mod, i) {
      return (
        '<div class="wh-mod-card" data-mod="' + i + '" role="button" tabindex="0" ' +
             'aria-label="' + esc(mod.label) + ' öffnen">' +
          '<div class="wh-mod-icon ' + esc(mod.iconClass) + '">' + esc(mod.icon) + '</div>' +
          '<span class="wh-mod-label">' + esc(mod.label) + '</span>' +
        '</div>'
      );
    }).join('');

    // Wire clicks with tap animation
    Array.prototype.forEach.call(grid.querySelectorAll('.wh-mod-card'), function (card) {
      function activate () {
        var idx = Number(card.getAttribute('data-mod'));
        var mod = MODULES[idx];
        if (!mod) return;
        card.classList.add('wh-tapped');
        setTimeout(function () { card.classList.remove('wh-tapped'); }, 280);
        openSheet(mod);
      }

      card.addEventListener('click', activate);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });
  }

  /* ── Render Tab Bar ───────────────────────────────── */
  function renderTabBar () {
    var tabs = $('whTabBar');
    if (!tabs) return;

    var defs = [
      { icon: '⊞', label: 'Training' },
      { icon: '📊', label: 'Analyse' },
      { icon: '🏆', label: 'Rangliste' },
      { icon: '⚙', label: 'System' }
    ];

    tabs.innerHTML = defs.map(function (t, i) {
      return (
        '<button class="wh-tab' + (i === activeTab ? ' is-active' : '') + '" ' +
                'data-tab="' + i + '" aria-label="' + esc(t.label) + '">' +
          '<span class="wh-tab-icon">' + t.icon + '</span>' +
          '<span class="wh-tab-label">' + esc(t.label) + '</span>' +
        '</button>'
      );
    }).join('');

    Array.prototype.forEach.call(tabs.querySelectorAll('.wh-tab'), function (btn) {
      btn.addEventListener('click', function () {
        switchTab(Number(btn.getAttribute('data-tab')));
      });
    });
  }

  /* ── Render Tab Content ───────────────────────────── */
  function renderTabContent () {
    var content = $('whTabContent');
    if (!content) return;

    var gridWrap = $('whGridWrap');

    // Toggle grid visibility
    if (gridWrap) {
      gridWrap.style.display = (activeTab === TAB_HOME) ? '' : 'none';
    }

    if (activeTab === TAB_HOME) {
      content.innerHTML = '';
      content.style.display = 'none';
      return;
    }

    content.style.display = '';

    if (activeTab === TAB_ANALYSE) {
      renderAnalyseTab(content);
    } else if (activeTab === TAB_HIGHSCORE) {
      renderHighscoreTab(content);
    } else if (activeTab === TAB_SYSTEM) {
      renderSystemTab(content);
    }
  }

  /* ── Analyse Tab ──────────────────────────────────── */
  function renderAnalyseTab (el) {
    var rs = resultStats();
    var bc = bankCount();

    el.innerHTML =
      '<div class="wh-analysis-wrap">' +
        '<div class="wh-section-title">Fortschritt</div>' +
        '<div class="wh-info-row"><span>Trainingsläufe</span><strong>' + rs.runs + '</strong></div>' +
        '<div class="wh-info-row"><span>Ø Trefferquote</span><strong>' + rs.percent + '%</strong></div>' +
        '<div class="wh-info-row"><span>Bestwert</span><strong>' + rs.best + '%</strong></div>' +
        '<div class="wh-section-title">Aufgabenbank</div>' +
        '<div class="wh-info-row"><span>Verfügbare Aufgaben</span><strong>' + (bc || '–') + '</strong></div>' +
        '<div class="wh-section-title">Aktionen</div>' +
        '<div class="wh-system-btns">' +
          '<button class="wh-sys-btn" id="whBtnAnalysis">Detailanalyse</button>' +
          '<button class="wh-sys-btn wh-danger-btn" id="whBtnClear">Zurücksetzen</button>' +
        '</div>' +
      '</div>';

    var btnAnalysis = $('whBtnAnalysis');
    if (btnAnalysis) btnAnalysis.addEventListener('click', function () {
      try {
        if (window.App && typeof App.showAnalysis === 'function') {
          App.showAnalysis();
        } else {
          notice('Analyse nicht verfügbar.');
        }
      } catch (e) { notice('Fehler beim Öffnen.'); }
    });

    var btnClear = $('whBtnClear');
    if (btnClear) btnClear.addEventListener('click', function () {
      if (!confirm('Gesamten Fortschritt löschen?')) return;
      try {
        if (window.App && typeof App.clearProgress === 'function') {
          App.clearProgress();
          notice('Fortschritt gelöscht.');
          renderAnalyseTab(el);
        }
      } catch (e) { notice('Fehler beim Löschen.'); }
    });
  }

  /* ── Highscore Tab ────────────────────────────────── */
  function renderHighscoreTab (el) {
    el.innerHTML =
      '<div class="wh-hs-wrap">' +
        '<div class="wh-hs-header">' +
          '<span class="wh-hs-title">Cloud Ranking</span>' +
          '<button class="wh-hs-refresh" id="whHsRefresh" aria-label="Aktualisieren">↻</button>' +
        '</div>' +
        '<div id="cloudHighscoreCard">' +
          '<div class="hs-loading"><div class="hs-spinner"></div><span>Wird geladen…</span></div>' +
        '</div>' +
      '</div>';

    var refreshBtn = $('whHsRefresh');
    if (refreshBtn) refreshBtn.addEventListener('click', function () {
      var card = $('cloudHighscoreCard');
      if (card) card.innerHTML = '<div class="hs-loading"><div class="hs-spinner"></div><span>Wird aktualisiert…</span></div>';
      triggerHighscoreRefresh();
    });

    setTimeout(triggerHighscoreRefresh, 80);
  }

  /* ── System Tab ───────────────────────────────────── */
  function renderSystemTab (el) {
    el.innerHTML =
      '<div class="wh-analysis-wrap">' +
        '<div class="wh-section-title">App Info</div>' +
        '<div class="wh-info-row"><span>Version</span><strong>V9.0.1</strong></div>' +
        '<div class="wh-info-row"><span>UI Layer</span><strong>' + VERSION + ' · Apple</strong></div>' +
        '<div class="wh-section-title">Cache & PWA</div>' +
        '<div class="wh-system-btns">' +
          '<button class="wh-sys-btn" id="whBtnCache">Cache löschen</button>' +
          '<button class="wh-sys-btn" id="whBtnBackup">Backup exportieren</button>' +
          '<button class="wh-sys-btn" id="whBtnHealth">Systemstatus</button>' +
          '<button class="wh-sys-btn" id="whBtnDb">Datenbankstatus</button>' +
        '</div>' +
      '</div>';

    var btnCache = $('whBtnCache');
    if (btnCache) btnCache.addEventListener('click', function () {
      clearCaches().then(function () { notice('Cache gelöscht.'); });
    });

    var btnBackup = $('whBtnBackup');
    if (btnBackup) btnBackup.addEventListener('click', function () {
      try {
        if (window.App && typeof App.exportBackup === 'function') {
          App.exportBackup();
          notice('Backup wird exportiert…');
        } else {
          notice('Backup nicht verfügbar.');
        }
      } catch (e) { notice('Fehler.'); }
    });

    var btnHealth = $('whBtnHealth');
    if (btnHealth) btnHealth.addEventListener('click', function () {
      try {
        if (window.App && typeof App.showFrameworkHealth === 'function') {
          App.showFrameworkHealth();
        } else {
          notice('Systemstatus nicht verfügbar.');
        }
      } catch (e) { notice('Fehler.'); }
    });

    var btnDb = $('whBtnDb');
    if (btnDb) btnDb.addEventListener('click', function () {
      try {
        if (window.App && typeof App.showDatabaseInfo === 'function') {
          App.showDatabaseInfo();
        } else {
          notice('Datenbankstatus nicht verfügbar.');
        }
      } catch (e) { notice('Fehler.'); }
    });
  }

  /* ── Clear Caches ─────────────────────────────────── */
  async function clearCaches () {
    try {
      if (window.PWAEngine && typeof PWAEngine.clearCaches === 'function') {
        await PWAEngine.clearCaches();
      } else if ('caches' in window) {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      }
    } catch (e) {}
  }

  /* ── Hide Legacy DOM ──────────────────────────────── */
  function hideLegacy (shell) {
    var start = $('start');
    if (!start) return;
    Array.prototype.forEach.call(start.children, function (child) {
      if (child === shell) return;
      if (child.id === 'whNotice') return;
      var skip = ['quiz', 'memory', 'blockIntro', 'result', 'analysis'];
      if (skip.indexOf(child.id) !== -1) return;
      child.classList.add('wh-hidden-legacy');
      child.setAttribute('aria-hidden', 'true');
    });
  }

  /* ── Build Shell ──────────────────────────────────── */
  function buildShell () {
    var start = $('start') || document.querySelector('.app') || document.body;
    if (!start || $('whShell')) return;

    // Notice at body level
    if (!$('whNotice')) {
      var noticeEl = document.createElement('div');
      noticeEl.id = 'whNotice';
      noticeEl.className = 'wh-notice';
      noticeEl.setAttribute('role', 'status');
      noticeEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(noticeEl);
    }

    // Sheet backdrop
    if (!$('whSheetBackdrop')) {
      var bd = document.createElement('div');
      bd.id = 'whSheetBackdrop';
      bd.className = 'wh-sheet-backdrop';
      document.body.appendChild(bd);
    }

    // Sheet panel
    if (!$('whSheet')) {
      var sh = document.createElement('div');
      sh.id = 'whSheet';
      sh.className = 'wh-sheet';
      sh.setAttribute('role', 'dialog');
      sh.setAttribute('aria-modal', 'true');
      document.body.appendChild(sh);
    }

    // Main shell
    var shell = document.createElement('div');
    shell.id = 'whShell';
    shell.setAttribute('role', 'main');
    shell.innerHTML =
      /* ── Top Bar ── */
      '<div class="wh-topbar">' +
        '<div class="wh-title-block">' +
          '<span class="wh-app-name">BPS-Trainer</span>' +
          '<span class="wh-app-sub">V9 · Stable · Offline-First</span>' +
        '</div>' +
        '<button class="wh-progress-pill" id="whProgressPill" aria-label="Fortschritt anzeigen">' +
          '<strong>0%</strong>' +
          '<span>0 Läufe</span>' +
        '</button>' +
      '</div>' +

      /* ── Grid (home) ── */
      '<div class="wh-grid-wrap" id="whGridWrap">' +
        '<div class="wh-grid" id="whGrid" role="grid" aria-label="Trainingsmodule"></div>' +
      '</div>' +

      /* ── Tab Content (analyse/highscore/system) ── */
      '<div class="wh-tab-content" id="whTabContent" style="display:none"></div>' +

      /* ── Tab Bar ── */
      '<nav class="wh-tabbar" id="whTabBar" aria-label="Navigation" role="tablist"></nav>';

    start.insertBefore(shell, start.firstChild);
    hideLegacy(shell);

    // Progress pill → show analysis
    var pill = $('whProgressPill');
    if (pill) pill.addEventListener('click', function () {
      switchTab(TAB_ANALYSE);
    });

    // Render all parts
    renderGrid();
    renderTabBar();
    updateTopBar();
    watchQuizScreens();

    // Progressive refresh
    var ticks = 0;
    var poll = setInterval(function () {
      updateTopBar();
      ticks++;
      if (ticks > 20) clearInterval(poll);
    }, 350);

    setTimeout(function () { notice('BPS-Trainer bereit. Viel Erfolg! 🎯'); }, 600);
  }

  /* ── Boot ─────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildShell);
  } else {
    buildShell();
  }

  /* ── Public API ───────────────────────────────────── */
  window.BPSWordHubLayer = {
    version: VERSION,
    notice: notice,
    refresh: function () { updateTopBar(); renderGrid(); },
    switchTab: switchTab,
    openSheet: openSheet,
    closeSheet: closeSheet,
    modules: MODULES
  };

})();
