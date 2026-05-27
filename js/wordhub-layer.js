/* BPS-Trainer V9 · Apple-Style WordHub UI Layer
   Redesign: Icon Grid, Deep Sheet, Bottom Tab Bar
   Auto Dark/Light · Responsive · Touch-optimiert
   Kurs-sharing ready: selbsterklärend, kein Scrollen */
(function () {
  'use strict';

  var VERSION = 'v9.1.0';

  /* ── Tabs ─────────────────────────────────────────── */
  var TAB_HOME      = 0;
  var TAB_HIGHSCORE = 1;
  var TAB_SYSTEM    = 2;
  var activeTab     = TAB_HOME;

  /* ── Active sheet state ───────────────────────────── */
  var activeSheet = null;

  /* ── Branches ─────────────────────────────────────── */
  var BRANCHES = [
    { id: 'it',        label: 'IT / FISI',                  icon: '💻' },
    { id: 'kaufm',     label: 'Kaufmännisch / Verwaltung',   icon: '📋' },
    { id: 'sozial',    label: 'Soziales / Pädagogik',       icon: '🤝' }
  ];

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
      startLabel: 'Matrizen starten',
      branches: ['it', 'kaufm']
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
      startLabel: 'English starten',
      branches: ['it']
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
      startLabel: 'IT starten',
      branches: ['it']
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
    },
    /* Kaufmännische Module */
    {
      id: 'kaufmRechnen',
      label: 'Kaufm. Rechnen',
      icon: '📊',
      iconClass: 'c-orange',
      kicker: 'Rechnungswesen',
      title: 'Kaufmännisches Rechnen',
      desc: 'Prozentrechnung, Dreisatz, Zinsen und Skonto. <strong>Sicher und schnell kalkulieren</strong>.',
      tags: ['Dreisatz', 'Prozent', 'Skonto'],
      modes: ['kaufmRechnen'],
      startLabel: 'Rechnen starten',
      branches: ['kaufm']
    },
    {
      id: 'bueroWissen',
      label: 'Bürowissen',
      icon: '📁',
      iconClass: 'c-blue',
      kicker: 'Verwaltung',
      title: 'Büro & Verwaltung',
      desc: 'Gesetze, DIN 5008 Regelwerk und büroorganisatorische Abläufe. <strong>Wissen abrufen</strong>.',
      tags: ['DIN 5008', 'Recht', 'Abläufe'],
      modes: ['bueroWissen'],
      startLabel: 'Training starten',
      branches: ['kaufm']
    },
    /* Soziale / Pädagogische Module */
    {
      id: 'paedagogik',
      label: 'Pädagogik',
      icon: '🧸',
      iconClass: 'c-rose',
      kicker: 'Fachwissen',
      title: 'Pädagogisches Fachwissen',
      desc: 'Entwicklungsphasen, Bindungstheorie, Inklusion und SGB VIII. <strong>Strukturiertes Wissen</strong>.',
      tags: ['Piaget', 'SGB VIII', 'Entwicklung'],
      modes: ['paedagogik'],
      startLabel: 'Pädagogik starten',
      branches: ['sozial']
    },
    {
      id: 'situationen',
      label: 'Situationen',
      icon: '🤝',
      iconClass: 'c-teal',
      kicker: 'Praxisfälle',
      title: 'Praxissituationen & Kommunikation',
      desc: 'Konflikte im Gruppenraum, Elternarbeit und Team-Kommunikation. <strong>Empathisch handeln</strong>.',
      tags: ['Konflikte', 'Elternarbeit', 'Kommunikation'],
      modes: ['situationen'],
      startLabel: 'Praxis starten',
      branches: ['sozial']
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

  function getProfileName () {
    try {
      var raw = localStorage.getItem("eignungstest_trainer_profile_v901");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.name) return parsed.name;
      }
    } catch (e) {}
    return "";
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
    var currentBranch = localStorage.getItem('bps_branch') || '';
    var branchLabel = 'Branche wählen';
    for (var i = 0; i < BRANCHES.length; i++) {
      if (BRANCHES[i].id === currentBranch) {
        branchLabel = BRANCHES[i].label;
        break;
      }
    }
    var chip = $('whBranchChip');
    if (chip) {
      chip.textContent = branchLabel;
    }
  }

  /* ── Render Module Grid ───────────────────────────── */
  function renderGrid () {
    var grid = $('whGrid');
    if (!grid) return;

    var currentBranch = localStorage.getItem('bps_branch') || '';
    var isLoggedIn = !!localStorage.getItem('bps_logged_in');
    var filtered = MODULES.filter(function (mod) {
      return !mod.branches || mod.branches.indexOf(currentBranch) !== -1;
    });

    // Detailanalyse-Karte dynamisch als letztes Element
    var analyseCard = {
      id: 'analyse_card',
      label: 'Analyse',
      icon: '📈',
      iconClass: 'c-indigo',
      kicker: 'Statistiken',
      title: 'Ergebnisse & Analyse',
      desc: 'Detaillierte Analyse deiner Trainingsergebnisse, Schwächen und Fortschrittstrends.',
      tags: ['Statistiken', 'Verlauf', 'KI'],
      modes: [],
      startLabel: 'Analyse öffnen',
      isAnalyseCard: true
    };
    filtered.push(analyseCard);

    // Scan-Karte nur nach Login sichtbar
    if (isLoggedIn) {
      filtered.push({
        id: 'scan_card',
        label: 'Scan',
        icon: '📷',
        iconClass: 'c-slate',
        kicker: 'OCR Scanner',
        title: 'Fragen scannen',
        desc: 'Scanne eine Frage per Bild und importiere sie direkt in den Fragenpool.',
        tags: ['OCR', 'Import', 'Kamera'],
        modes: [],
        startLabel: null,
        isScanCard: true
      });
    }

    grid.innerHTML = filtered.map(function (mod, i) {
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
        var mod = filtered[idx];
        if (!mod) return;
        card.classList.add('wh-tapped');
        setTimeout(function () { card.classList.remove('wh-tapped'); }, 280);
        if (mod.isScanCard) {
          try { scanQRCode(); } catch (e) { notice('Scanner-Fehler'); }
        } else if (mod.isAnalyseCard) {
          try {
            if (window.App && typeof App.showAnalysis === 'function') {
              App.showAnalysis();
            } else {
              notice('Analyse nicht bereit.');
            }
          } catch (e) { notice('Fehler beim Öffnen.'); }
        } else {
          openSheet(mod);
        }
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
      { icon: '🏆', label: 'Rangliste' },
      { icon: '⚙', label: 'Profil' }
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

    if (activeTab === TAB_HOME) {
      // Home: Grid sichtbar, Tab-Content versteckt
      if (gridWrap) gridWrap.style.display = '';
      content.style.display = 'none';
      return;
    }

    // Nicht-Home: Grid verstecken, Tab-Content zeigen
    if (gridWrap) gridWrap.style.display = 'none';
    content.style.display = '';

    if (activeTab === TAB_HIGHSCORE) {
      renderHighscoreTab(content);
    } else if (activeTab === TAB_SYSTEM) {
      renderSystemTab(content);
    }
  }

  /* ── Rangliste Tab ────────────────────────────────── */
  function renderHighscoreTab (el) {
    // cloudHighscoreCard einbetten – HighscoreLiveRenderer erkennt es automatisch
    el.innerHTML =
      '<div class="wh-analysis-wrap">' +
        '<div class="wh-section-title">🏆 Rangliste</div>' +
        '<div id="cloudHighscoreCard" class="wh-highscore-card"></div>' +
      '</div>';

    // Live-Renderer triggern (hört per MutationObserver bereits mit)
    setTimeout(function () {
      if (window.HighscoreLiveRenderer && typeof HighscoreLiveRenderer.refresh === 'function') {
        try { HighscoreLiveRenderer.refresh(true); } catch (e) {}
      } else {
        // Lokaler Fallback wenn kein Cloud-Renderer verfügbar
        renderLocalHighscore($('cloudHighscoreCard'));
      }
    }, 80);
  }

  function renderLocalHighscore (card) {
    if (!card) return;
    var rows = [];
    try {
      // HighscoreEngine bevorzugen (gibt player_name zurück)
      if (window.App && App._test) {
        var rawList = App._test.StorageEngine ? (App._test.StorageEngine.read([]) || []) : [];
        if (App._test.HighscoreEngine && typeof App._test.HighscoreEngine.build === 'function') {
          var hs = App._test.HighscoreEngine.build(rawList);
          rows = (hs && hs.top) ? hs.top : rawList;
        } else {
          rows = rawList;
        }
      }
    } catch (e) {}

    rows.sort(function (a, b) { return (Number(b.percent) || 0) - (Number(a.percent) || 0); });
    rows = rows.slice(0, 20);

    if (!rows.length) {
      card.innerHTML = '<div class="wh-info-row"><span>Noch keine Ergebnisse vorhanden. Absolviere einen Test!</span></div>';
      return;
    }

    var html = '<ol class="hs-list">';
    rows.forEach(function (r, idx) {
      var name = esc(r.player_name || r.name || getProfileName() || 'Du');
      var title = esc(r.title || r.mode || 'Training');
      var pct = Number(r.percent) || 0;
      var medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
      html +=
        '<li class="hs-row">' +
          '<span class="hs-pos">' + (medal || (idx + 1) + '.') + '</span>' +
          '<span class="hs-main"><b>' + name + '</b><small>' + title + '</small></span>' +
          '<span class="hs-score">' + pct + '%</span>' +
        '</li>';
    });
    html += '</ol>';
    card.innerHTML = html;
  }

  /* ── System / Profil Tab ──────────────────────────── */
  function renderSystemTab (el) {
      var currentName = getProfileName();
      var rs = resultStats();
      var currentBranchLabel = 'Keine';
      var currentBranch = localStorage.getItem('bps_branch') || '';
      for (var i = 0; i < BRANCHES.length; i++) {
      if (BRANCHES[i].id === currentBranch) {
        currentBranchLabel = BRANCHES[i].label;
        break;
      }
    }

    el.innerHTML =
      '<div class="wh-analysis-wrap">' +
        '<div class="wh-section-title">Profil &amp; Name</div>' +
        '<div class="wh-profile-edit">' +
          '<div class="wh-input-group">' +
            '<input id="profileEditNameInput" class="wh-input" type="text" maxlength="32" value="' + esc(currentName) + '" placeholder="Dein Name für Cloud Highscore" autocomplete="name" enterkeyhint="done">' +
            '<button class="wh-btn-primary" id="whSaveProfileBtn">Speichern</button>' +
          '</div>' +
          '<div id="profileSaveState" class="wh-save-state"></div>' +
        '</div>' +

        '<div class="wh-section-title">Fachrichtung (Branche)</div>' +
        '<div class="wh-branch-changer">' +
          '<div class="wh-info-row"><span>Ausgewählte Fachrichtung</span><strong>' + esc(currentBranchLabel) + '</strong></div>' +
          '<div class="wh-branch-buttons">' +
            BRANCHES.map(function (b) {
              var isSel = b.id === currentBranch ? ' is-active' : '';
              return '<button class="wh-branch-btn' + isSel + '" data-branch="' + b.id + '">' + b.icon + ' ' + b.label + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="wh-section-title">Statistiken</div>' +
        '<div class="wh-info-row"><span>Trainingsläufe</span><strong>' + rs.runs + '</strong></div>' +
        '<div class="wh-info-row"><span>Ø Trefferquote</span><strong>' + rs.percent + '%</strong></div>' +
        '<div class="wh-info-row"><span>Bestwert</span><strong>' + rs.best + '%</strong></div>' +

        '<div class="wh-section-title">System &amp; Aktionen</div>' +
        '<div class="wh-system-btns">' +
          '<button class="wh-sys-btn" id="whBtnFeedback">💬 Feedback geben</button>' +
          '<button class="wh-sys-btn" id="whBtnAnalysis">Detailanalyse öffnen</button>' +
          '<button class="wh-sys-btn" id="whBtnScan">QR-Code Scanner</button>' +
          '<button class="wh-sys-btn" id="whBtnBackup">Backup exportieren</button>' +
          '<button class="wh-sys-btn" id="whBtnCache">Cache löschen</button>' +
          '<button class="wh-sys-btn wh-danger-btn" id="whBtnClear">Fortschritt zurücksetzen</button>' +
        '</div>' +
        '<div class="wh-footer-version">Version 9.1.0 · Stable</div>' +
      '</div>';

    var saveBtn = $('whSaveProfileBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        if (window.App && typeof App.saveProfileName === 'function') {
          var ok = App.saveProfileName();
          if (ok) {
            notice('Profilname gespeichert!');
            triggerHighscoreRefresh();
          }
        } else {
          notice('Speicherfunktion nicht verfügbar.');
        }
      });
    }

    Array.prototype.forEach.call(el.querySelectorAll('.wh-branch-btn'), function (btn) {
      btn.addEventListener('click', function () {
        var branchId = btn.getAttribute('data-branch');
        localStorage.setItem('bps_branch', branchId);
        notice('Fachrichtung gewechselt zu ' + btn.textContent);
        renderSystemTab(el);
        renderGrid();
        updateTopBar();
      });
    });

    var btnFeedback = $('whBtnFeedback');
    if (btnFeedback) {
      btnFeedback.addEventListener('click', function () {
        if (window.AppFeedback && typeof AppFeedback.openGeneralFeedbackSheet === 'function') {
          AppFeedback.openGeneralFeedbackSheet();
        }
      });
    }

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
    var btnScan = $('whBtnScan');
    if (btnScan) btnScan.addEventListener('click', function () {
      if (!localStorage.getItem('bps_logged_in')) { notice('Bitte zuerst einloggen'); return; }
      try { scanQRCode(); } catch (e) { notice('Scanner-Fehler'); }
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

    var btnCache = $('whBtnCache');
    if (btnCache) btnCache.addEventListener('click', function () {
      clearCaches().then(function () { notice('Cache gelöscht.'); });
    });

    var btnClear = $('whBtnClear');
    if (btnClear) btnClear.addEventListener('click', function () {
      if (!confirm('Gesamten Fortschritt löschen?')) return;
      try {
        if (window.App && typeof App.clearProgress === 'function') {
          App.clearProgress();
          notice('Fortschritt gelöscht.');
          renderSystemTab(el);
        }
      } catch (e) { notice('Fehler beim Löschen.'); }
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

    // ── QR Code Scanner ─────────────────────────────────────
    function loadTesseract(cb) {
      if (window.Tesseract) { cb(); return; }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@v2.1.5/dist/tesseract.min.js';
      script.onload = cb;
      document.body.appendChild(script);
    }
    function scanQRCode() {
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      fileInput.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          var dataUrl = ev.target.result;
          loadTesseract(function () {
            notice('Bild wird gescannt...');
            Tesseract.recognize(dataUrl, 'eng').then(function (result) {
              var text = result.data.text.trim();
              notice('Erkannter Text: ' + text);
              // TODO: parse text to question object and publish via BPSGithubSync
            }).catch(function (err) {
              notice('Scan-Fehler: ' + err.message);
            });
          });
        };
        reader.readAsDataURL(file);
      };
      document.body.appendChild(fileInput);
      fileInput.click();
      setTimeout(function () { document.body.removeChild(fileInput); }, 1000);
    }

  /* ── Branch Selection Overlay ─────────────────────── */
  function openBranchSelectionSheet (allowClose) {
    var backdrop = $('whSheetBackdrop');
    var sheet    = $('whSheet');
    if (!backdrop || !sheet) return;

    var closeBtnHtml = allowClose ? '<button class="wh-sheet-close" id="whSheetClose">✕</button>' : '';

    sheet.innerHTML =
      '<div class="wh-sheet-handle"></div>' +
      '<div class="wh-sheet-header">' +
        '<div class="wh-sheet-icon c-indigo">🎯</div>' +
        '<div class="wh-sheet-info">' +
          '<div class="wh-sheet-name">Fachrichtung wählen</div>' +
          '<div class="wh-sheet-kicker">' + (allowClose ? 'Ändern' : 'Pflichtauswahl') + '</div>' +
        '</div>' +
        closeBtnHtml +
      '</div>' +
      '<div class="wh-sheet-sep"></div>' +
      '<div class="wh-sheet-body">' +
        '<p class="wh-sheet-desc">Wähle deine Fachrichtung aus, um die passenden Lernmodule und Simulationsaufgaben anzuzeigen:</p>' +
        '<div class="wh-branch-list">' +
          BRANCHES.map(function (b) {
            return (
              '<button class="wh-branch-select-btn" data-branch="' + b.id + '">' +
                '<span class="wh-branch-icon">' + b.icon + '</span>' +
                '<span class="wh-branch-label">' + esc(b.label) + '</span>' +
              '</button>'
            );
          }).join('') +
        '</div>' +
      '</div>';

    backdrop.classList.add('show');
    sheet.offsetHeight;
    sheet.classList.add('show');

    if (allowClose) {
      var closeBtn = $('whSheetClose');
      if (closeBtn) closeBtn.onclick = closeSheet;
      backdrop.onclick = function (e) {
        if (e.target === backdrop) closeSheet();
      };
    } else {
      backdrop.onclick = null;
    }

    // Bind selection buttons
    Array.prototype.forEach.call(sheet.querySelectorAll('.wh-branch-select-btn'), function (btn) {
      btn.addEventListener('click', function () {
        var branchId = btn.getAttribute('data-branch');
        localStorage.setItem('bps_branch', branchId);
        notice('Fachrichtung zu ' + btn.querySelector('.wh-branch-label').textContent + ' gewechselt!');
        closeSheet();
        updateTopBar();
        renderGrid();
        if (activeTab === TAB_SYSTEM) {
          var content = $('whTabContent');
          if (content) renderSystemTab(content);
        }
      });
    });
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
        '<div class="wh-topbar-chips">' +
          '<button class="wh-branch-chip" id="whBranchChip" aria-label="Fachrichtung wechseln">Fachrichtung wählen</button>' +
          '<button class="wh-login-btn" id="whLoginBtn" aria-label="Login">Login</button>' +
          
       '</div>' +
      '</div>' +

      /* ── Grid (home) ── */
      '<div class="wh-grid-wrap" id="whGridWrap">' +
        '<div class="wh-grid" id="whGrid" role="grid" aria-label="Trainingsmodule"></div>' +
        '<div class="wh-home-feedback-wrap">' +
          '<button class="wh-home-feedback-btn" id="whHomeFeedbackBtn">💬 App bewerten / Feedback</button>' +
        '</div>' +
      '</div>' +

      /* ── Tab Content (highscore/system) ── */
      '<div class="wh-tab-content" id="whTabContent" style="display:none"></div>' +

      /* ── Tab Bar ── */
      '<nav class="wh-tabbar" id="whTabBar" aria-label="Navigation" role="tablist"></nav>';

    start.insertBefore(shell, start.firstChild);
    hideLegacy(shell);

    // Wire branch chip
    var branchChip = $('whBranchChip');
    if (branchChip) {
      branchChip.addEventListener('click', function () {
        openBranchSelectionSheet(true);
      });
      var loginBtn = $('whLoginBtn');
      if (loginBtn) {
        // Login-Status beim Start prüfen
        if (localStorage.getItem('bps_logged_in')) {
          loginBtn.textContent = '✓ Admin';
          loginBtn.style.opacity = '0.85';
        }

        loginBtn.addEventListener('click', function () {
          if (localStorage.getItem('bps_logged_in')) {
            // Logout-Dialog
            if (confirm('Admin-Bereich\n\nMöchten Sie sich abmelden?')) {
              localStorage.removeItem('bps_logged_in');
              loginBtn.textContent = 'Login';
              loginBtn.style.opacity = '';
              notice('Abgemeldet. Auf Wiedersehen!');
              renderGrid();
              renderTabContent();
            }
            return;
          }
          // Login
          var pwd = prompt('Passwort eingeben:');
          if (pwd === 'BBQ!2026!') {
            localStorage.setItem('bps_logged_in', '1');
            loginBtn.textContent = '✓ Admin';
            loginBtn.style.opacity = '0.85';
            notice('Login erfolgreich – Scan-Modul freigeschaltet!');
            renderGrid();
            renderTabContent();
          } else if (pwd !== null) {
            notice('Falsches Passwort');
          }
        });
      }
    }

    // Render all parts
    renderGrid();
    renderTabBar();
    updateTopBar();
    watchQuizScreens();

    // Wire home feedback button
    var homeFbBtn = $('whHomeFeedbackBtn');
    if (homeFbBtn) {
      homeFbBtn.addEventListener('click', function () {
        if (window.AppFeedback && typeof AppFeedback.openGeneralFeedbackSheet === 'function') {
          AppFeedback.openGeneralFeedbackSheet();
        }
      });
    }

    // Check branch setup on load
    var currentBranch = localStorage.getItem('bps_branch') || '';
    if (!currentBranch) {
      setTimeout(function () {
        openBranchSelectionSheet(false);
      }, 500);
    }

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
    modules: MODULES,
    openBranchSelection: function (allowClose) { openBranchSelectionSheet(allowClose); }
  };

})();
