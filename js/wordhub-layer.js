/* BPS-Trainer V9 · Apple-Style WordHub UI Layer
   Redesign: Icon Grid, Deep Sheet, Bottom Tab Bar
   Auto Dark/Light · Responsive · Touch-optimiert
   Kurs-sharing ready: selbsterklärend, kein Scrollen */
(function () {
  'use strict';

  var VERSION = 'v9.2.0';

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

    // Coach-Karte für alle sichtbar ganz oben
    filtered.unshift({
      id: 'coach_card',
      label: 'Lerncoach',
      icon: '🎓',
      iconClass: 'c-blue',
      kicker: 'Lernhelfer',
      title: 'Lerncoach',
      desc: 'Fragen stellen und Erklärungen aus der Wissensdatenbank erhalten.',
      tags: ['KI', 'Wissen', 'Offline'],
      modes: [],
      startLabel: 'Coach öffnen',
      isCoachCard: true
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
        desc: 'Scanne klare Texte per Bild, prüfe die OCR-Vorschau und erfasse Aufgaben bewusst als Entwurf.',
        tags: ['OCR', 'Import', 'Kamera'],
        modes: [],
        startLabel: null,
        isScanCard: true
      });
    }

    grid.innerHTML = filtered.map(function (mod, i) {
      var extraClass = mod.isCoachCard ? ' wh-coach-card' : '';
      var idAttr = mod.isCoachCard ? ' id="whCoachCard"' : '';
      return (
        '<div class="wh-mod-card' + extraClass + '"' + idAttr + ' data-mod="' + i + '" role="button" tabindex="0" ' +
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
        if (mod.isCoachCard) {
          try {
            if (window.BPSLearningCoach && typeof BPSLearningCoach.openHub === 'function') {
              BPSLearningCoach.openHub();
            } else {
              notice('Lerncoach nicht bereit.');
            }
          } catch (e) { notice('Fehler beim Öffnen.'); }
        } else if (mod.isScanCard) {
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
        '<div class="wh-footer-version">Version 9.2.0 · Stable</div>' +
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

  /* ── OCR Scanner · V9.1.1 Preview-first stable workflow ───── */
  var _tesseractReady = false;
  var _tesseractLoading = false;
  var _tesseractCbs = [];

  function loadTesseract (cb) {
    if (_tesseractReady && window.Tesseract) { cb(); return; }
    _tesseractCbs.push(cb);
    if (_tesseractLoading) return;
    _tesseractLoading = true;
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js';
    script.async = true;
    script.onload = function () {
      _tesseractReady = true;
      _tesseractLoading = false;
      var cbs = _tesseractCbs.splice(0);
      cbs.forEach(function (fn) { try { fn(); } catch (e) {} });
    };
    script.onerror = function () {
      _tesseractLoading = false;
      _tesseractCbs.splice(0);
      showScanSheet('error',
        '<div class="wh-scan-alert wh-scan-alert-error">' +
          '<b>Tesseract konnte nicht geladen werden.</b><br>' +
          'Die OCR-Erkennung benötigt aktuell eine Internetverbindung, weil die Bibliothek extern geladen wird.' +
        '</div>' +
        '<div class="wh-scan-actions">' +
          '<button class="wh-btn-primary" id="whScanLoadRetry">Erneut versuchen</button>' +
          '<button class="wh-btn-info" id="whScanManualEmpty">Manuell erfassen</button>' +
        '</div>'
      );
      var retry = $('whScanLoadRetry');
      if (retry) retry.addEventListener('click', function () { closeSheet(); scanQRCode(); });
      var manual = $('whScanManualEmpty');
      if (manual) manual.addEventListener('click', function () {
        showScanReviewSheet({ fileName: 'manuelle-eingabe', imageSrc: '', text: '', confidence: 0, imageAnalysis: null });
      });
    };
    document.body.appendChild(script);
  }

  function showScanSheet (state, content) {
    var backdrop = $('whSheetBackdrop');
    var sheet    = $('whSheet');
    if (!backdrop || !sheet) return;
    var kicker = 'Vorschau prüfen';
    if (state === 'loading') kicker = 'Wird erkannt…';
    if (state === 'result') kicker = 'Ergebnis prüfen';
    if (state === 'review') kicker = 'Aufgabe vorbereiten';
    if (state === 'error') kicker = 'Fehler';
    sheet.innerHTML =
      '<div class="wh-sheet-handle"></div>' +
      '<div class="wh-sheet-header">' +
        '<div class="wh-sheet-icon c-slate">📷</div>' +
        '<div class="wh-sheet-info">' +
          '<div class="wh-sheet-name">OCR Scanner</div>' +
          '<div class="wh-sheet-kicker">' + kicker + '</div>' +
        '</div>' +
        '<button class="wh-sheet-close" id="whScanClose" aria-label="Schließen">✕</button>' +
      '</div>' +
      '<div class="wh-sheet-sep"></div>' +
      '<div class="wh-sheet-body" id="whScanBody">' + content + '</div>';
    backdrop.classList.add('show');
    sheet.offsetHeight;
    sheet.classList.add('show');
    var closeBtn = $('whScanClose');
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    backdrop.onclick = function (e) { if (e.target === backdrop) closeSheet(); };
  }

  function injectScanStyles () {
    if ($('whScanStyles')) return;
    var st = document.createElement('style');
    st.id = 'whScanStyles';
    st.textContent =
      '.wh-scan-spinner{width:22px;height:22px;border:3px solid rgba(128,128,128,.25);' +
      'border-top-color:#6c63ff;border-radius:50%;animation:wh-spin .7s linear infinite;flex-shrink:0}' +
      '@keyframes wh-spin{to{transform:rotate(360deg)}}' +
      '.wh-scan-preview{max-width:100%;max-height:180px;border-radius:14px;object-fit:contain;display:block;margin:0 auto 14px;border:1px solid rgba(127,127,127,.16);background:rgba(127,127,127,.08)}' +
      '.wh-scan-conf{font-size:12px;color:var(--wh-fg2,#888);margin-bottom:8px}' +
      '.wh-scan-quality{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;color:var(--wh-fg2,#888);margin:0 0 10px}' +
      '.wh-scan-badge{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 9px;background:rgba(127,127,127,.10);font-weight:700;color:var(--wh-fg,#111)}' +
      '.wh-scan-badge.warn{background:rgba(245,158,11,.16);color:#b45309}.wh-scan-badge.ok{background:rgba(16,185,129,.15);color:#047857}.wh-scan-badge.bad{background:rgba(239,68,68,.14);color:#b91c1c}' +
      '.wh-scan-textbox{background:var(--wh-card,#1c1c1e);border-radius:14px;padding:14px;' +
      'font-size:14px;line-height:1.65;white-space:pre-wrap;word-break:break-word;' +
      'max-height:220px;overflow-y:auto;margin-bottom:14px;border:1px solid rgba(127,127,127,.16)}' +
      '.wh-scan-edit{width:100%;min-height:180px;max-height:260px;resize:vertical;border:1px solid rgba(127,127,127,.16);border-radius:14px;padding:14px;background:var(--wh-card,#1c1c1e);color:var(--wh-fg,#fff);font-size:14px;line-height:1.55;outline:none;margin-bottom:12px}' +
      '.wh-scan-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;width:100%}' +
      '.wh-scan-actions button{height:46px;border-radius:14px;font-size:14px;font-weight:700;border:0;' +
      'cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 16px;' +
      'transition:transform .15s ease,background .15s ease;-webkit-tap-highlight-color:transparent;flex:1 1 auto}' +
      '.wh-scan-actions .wh-btn-primary{background:var(--wh-accent,#007aff);color:#fff;' +
      'box-shadow:0 4px 12px rgba(0,122,255,.2);flex:2 1 auto}' +
      '.wh-scan-actions .wh-btn-info{width:auto !important;background:var(--wh-fill,rgba(120,120,128,.12));color:var(--wh-sub,#6c6c70)}' +
      '.wh-scan-actions button:active{transform:scale(.96)}' +
      '.wh-scan-alert{border-radius:14px;padding:12px 13px;margin:0 0 12px;font-size:13px;line-height:1.45;border:1px solid rgba(127,127,127,.16);background:rgba(127,127,127,.08);color:var(--wh-fg2,#888)}' +
      '.wh-scan-alert b{color:var(--wh-fg,#111)}.wh-scan-alert-warn{background:rgba(245,158,11,.14);border-color:rgba(245,158,11,.28);color:#92400e}.wh-scan-alert-error{background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.25);color:#b91c1c}.wh-scan-alert-ok{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.24);color:#047857}' +
      '.wh-scan-form{display:grid;gap:10px}.wh-scan-field label{display:block;font-size:12px;font-weight:800;color:var(--wh-fg2,#888);margin:0 0 6px}.wh-scan-field input,.wh-scan-field select,.wh-scan-field textarea{width:100%;border:1px solid rgba(127,127,127,.16);border-radius:13px;padding:11px 12px;background:var(--wh-card,#1c1c1e);color:var(--wh-fg,#fff);outline:none}.wh-scan-field textarea{min-height:96px;resize:vertical;line-height:1.45}' +
      '.wh-scan-mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:420px){.wh-scan-mini-grid{grid-template-columns:1fr}}';
    document.head.appendChild(st);
  }

  function fileToDataURL (file, cb) {
    var reader = new FileReader();
    reader.onload = function () { cb(null, String(reader.result || '')); };
    reader.onerror = function () { cb(new Error('Bild konnte nicht gelesen werden.')); };
    reader.readAsDataURL(file);
  }

  function analyzeImageForSimpleShapes (imageSrc, cb) {
    if (!imageSrc) { cb(null); return; }
    var img = new Image();
    img.onload = function () {
      try {
        var maxSide = 320;
        var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * scale));
        var h = Math.max(1, Math.round(img.height * scale));
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);
        var data = ctx.getImageData(0, 0, w, h).data;
        var dark = 0;
        var total = w * h;
        var lineHits = 0;
        var prev = 255;
        for (var y = 0; y < h; y += 2) {
          prev = 255;
          for (var x = 0; x < w; x += 2) {
            var idx = (y * w + x) * 4;
            var lum = (data[idx] * 0.299) + (data[idx + 1] * 0.587) + (data[idx + 2] * 0.114);
            if (lum < 115) dark++;
            if (Math.abs(prev - lum) > 85) lineHits++;
            prev = lum;
          }
        }
        var sampled = Math.max(1, Math.ceil(w / 2) * Math.ceil(h / 2));
        var darkRatio = dark / sampled;
        var edgeRatio = lineHits / sampled;
        var hasSimpleGeometry = edgeRatio > 0.035 || darkRatio > 0.09;
        cb({
          width: img.width,
          height: img.height,
          edgeRatio: edgeRatio,
          darkRatio: darkRatio,
          hasSimpleGeometry: hasSimpleGeometry,
          label: hasSimpleGeometry ? 'Einfache Linien/Formen möglich' : 'überwiegend Text/Bildfläche'
        });
      } catch (err) {
        cb(null);
      }
    };
    img.onerror = function () { cb(null); };
    img.src = imageSrc;
  }

  function fallbackCopy (text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      notice('Text kopiert!');
    } catch (e) { notice('Kopieren nicht möglich.'); }
  }

  function getScanQuality (confidence, text) {
    var len = (text || '').replace(/\s+/g, '').length;
    if (!len) return { cls: 'bad', label: 'Kein Text erkannt', note: 'Bitte neu scannen oder manuell erfassen.' };
    if (confidence >= 75 && len >= 20) return { cls: 'ok', label: 'Gute Text-Erkennung', note: 'Bitte trotzdem kurz prüfen, bevor du weitermachst.' };
    if (confidence >= 50 || len >= 35) return { cls: 'warn', label: 'Erkennung prüfen', note: 'Der Text kann Fehler enthalten. Bitte korrigieren oder neu scannen.' };
    return { cls: 'bad', label: 'Unsichere Erkennung', note: 'Besser neu scannen oder den Text manuell korrigieren.' };
  }

  function parseScanTextToDraft (text, imageAnalysis) {
    var clean = String(text || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    var lines = clean.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var optionRe = /^([A-Da-d]|[1-4])\s*[\).:\-]\s*(.+)$/;
    var options = [];
    var questionLines = [];
    lines.forEach(function (line) {
      var m = line.match(optionRe);
      if (m) {
        options.push(m[2].trim());
      } else {
        questionLines.push(line);
      }
    });
    var type = options.length >= 2 ? 'multiple-choice' : 'textaufgabe';
    if (imageAnalysis && imageAnalysis.hasSimpleGeometry && clean.length < 120) type = 'bild-formaufgabe';
    return {
      type: type,
      branch: localStorage.getItem('bps_branch') || '',
      module: '',
      difficulty: 'medium',
      question: questionLines.join('\n').trim() || clean,
      options: options,
      answer: '',
      explanation: '',
      tags: '',
      rawText: clean
    };
  }

  function scanNoticeHtml (confidence, text, imageAnalysis) {
    var q = getScanQuality(confidence, text);
    var shapeText = imageAnalysis ? imageAnalysis.label : 'Formanalyse nicht verfügbar';
    return '' +
      '<div class="wh-scan-quality">' +
        '<span class="wh-scan-badge ' + q.cls + '">' + q.label + '</span>' +
        '<span>OCR: ' + (Number(confidence) || 0) + '%</span>' +
      '</div>' +
      '<div class="wh-scan-alert ' + (q.cls === 'ok' ? 'wh-scan-alert-ok' : q.cls === 'bad' ? 'wh-scan-alert-error' : 'wh-scan-alert-warn') + '">' +
        q.note +
      '</div>' +
      '<div class="wh-scan-alert wh-scan-alert-warn">' +
        '<b>Wichtiger Hinweis:</b> Die OCR erkennt zuverlässig nur klare, einfache Texte. ' +
        'Einfache Tabellen, Linien oder Formen können höchstens vermutet werden. ' +
        'Komplexe Matrizen, Zahnräder, Würfelrotationen oder technische Skizzen bitte immer manuell prüfen.<br>' +
        '<small>Bildanalyse: ' + esc(shapeText) + '</small>' +
      '</div>';
  }

  function showScanReviewSheet (payload) {
    injectScanStyles();
    var draft = parseScanTextToDraft(payload.text, payload.imageAnalysis);
    var branchOptions = BRANCHES.map(function (b) {
      return '<option value="' + esc(b.id) + '"' + (b.id === draft.branch ? ' selected' : '') + '>' + esc(b.label) + '</option>';
    }).join('');
    var optionsText = (draft.options || []).join('\n');
    showScanSheet('review',
      '<div class="wh-scan-alert">' +
        '<b>Aufgabe vorbereiten:</b> Hier wird noch nichts in den Fragenpool importiert. Prüfe und korrigiere alles manuell. Erst mit „Als Entwurf speichern“ wird lokal ein Entwurf abgelegt.' +
      '</div>' +
      '<div class="wh-scan-form">' +
        '<div class="wh-scan-mini-grid">' +
          '<div class="wh-scan-field"><label>Aufgabentyp</label><select id="whScanType">' +
            '<option value="textaufgabe"' + (draft.type === 'textaufgabe' ? ' selected' : '') + '>Textaufgabe</option>' +
            '<option value="multiple-choice"' + (draft.type === 'multiple-choice' ? ' selected' : '') + '>Multiple Choice</option>' +
            '<option value="tabelle">Tabelle</option>' +
            '<option value="bild-formaufgabe"' + (draft.type === 'bild-formaufgabe' ? ' selected' : '') + '>Bild-/Formaufgabe</option>' +
            '<option value="logik-matrix">Logik / Matrix</option>' +
          '</select></div>' +
          '<div class="wh-scan-field"><label>Branche</label><select id="whScanBranch">' + branchOptions + '</select></div>' +
        '</div>' +
        '<div class="wh-scan-mini-grid">' +
          '<div class="wh-scan-field"><label>Modul</label><input id="whScanModule" value="' + esc(draft.module) + '" placeholder="z. B. Mathe, Deutsch, Logik"></div>' +
          '<div class="wh-scan-field"><label>Schwierigkeit</label><select id="whScanDifficulty">' +
            '<option value="easy">Leicht</option><option value="medium" selected>Mittel</option><option value="hard">Schwer</option><option value="exam">Prüfungsniveau</option>' +
          '</select></div>' +
        '</div>' +
        '<div class="wh-scan-field"><label>Frage / Aufgabenstellung</label><textarea id="whScanQuestion">' + esc(draft.question) + '</textarea></div>' +
        '<div class="wh-scan-field"><label>Antwortoptionen, falls vorhanden — eine pro Zeile</label><textarea id="whScanOptions">' + esc(optionsText) + '</textarea></div>' +
        '<div class="wh-scan-mini-grid">' +
          '<div class="wh-scan-field"><label>Richtige Lösung</label><input id="whScanAnswer" value="" placeholder="z. B. B oder 42"></div>' +
          '<div class="wh-scan-field"><label>Tags</label><input id="whScanTags" value="" placeholder="z. B. Prozent, Textaufgabe"></div>' +
        '</div>' +
        '<div class="wh-scan-field"><label>Erklärung optional</label><textarea id="whScanExplanation" placeholder="Kurzer Lösungsweg oder Hinweis"></textarea></div>' +
      '</div>' +
      '<div class="wh-scan-actions" style="margin-top:12px">' +
        '<button class="wh-btn-primary" id="whScanSaveDraft">Als Entwurf speichern</button>' +
        '<button class="wh-btn-info" id="whScanDraftJson">JSON kopieren</button>' +
        '<button class="wh-btn-info" id="whScanBackPreview">Zurück zur Vorschau</button>' +
        '<button class="wh-btn-info" id="whScanFresh">Neu scannen</button>' +
      '</div>'
    );

    function collectDraft () {
      var opts = ($('whScanOptions') ? $('whScanOptions').value : '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      return {
        id: 'scan-draft-' + Date.now(),
        createdAt: new Date().toISOString(),
        source: 'ocr-preview',
        appVersion: window.TRAINER_BUILD_VERSION || 'unknown',
        type: $('whScanType') ? $('whScanType').value : 'textaufgabe',
        branch: $('whScanBranch') ? $('whScanBranch').value : '',
        module: $('whScanModule') ? $('whScanModule').value.trim() : '',
        difficulty: $('whScanDifficulty') ? $('whScanDifficulty').value : 'medium',
        question: $('whScanQuestion') ? $('whScanQuestion').value.trim() : '',
        options: opts,
        answer: $('whScanAnswer') ? $('whScanAnswer').value.trim() : '',
        explanation: $('whScanExplanation') ? $('whScanExplanation').value.trim() : '',
        tags: ($('whScanTags') ? $('whScanTags').value : '').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
        ocr: {
          confidence: payload.confidence || 0,
          rawText: payload.text || '',
          fileName: payload.fileName || '',
          imageAnalysis: payload.imageAnalysis || null
        }
      };
    }

    var save = $('whScanSaveDraft');
    if (save) save.addEventListener('click', function () {
      try {
        var d = collectDraft();
        if (!d.question && !d.options.length) { notice('Bitte erst Frage oder Text eintragen.'); return; }
        var list = JSON.parse(localStorage.getItem('bps_scan_drafts') || '[]');
        list.unshift(d);
        localStorage.setItem('bps_scan_drafts', JSON.stringify(list.slice(0, 100)));
        notice('Scan-Entwurf lokal gespeichert.');
      } catch (e) { notice('Entwurf konnte nicht gespeichert werden.'); }
    });
    var jsonBtn = $('whScanDraftJson');
    if (jsonBtn) jsonBtn.addEventListener('click', function () {
      fallbackCopy(JSON.stringify(collectDraft(), null, 2));
    });
    var back = $('whScanBackPreview');
    if (back) back.addEventListener('click', function () { showScanResultSheet(payload); });
    var fresh = $('whScanFresh');
    if (fresh) fresh.addEventListener('click', function () { closeSheet(); scanQRCode(); });
  }

  function showScanResultSheet (payload) {
    injectScanStyles();
    var safeText = payload.text || '';
    showScanSheet('result',
      (payload.imageSrc ? '<img src="' + payload.imageSrc + '" class="wh-scan-preview" alt="Scan-Vorschau">' : '') +
      scanNoticeHtml(payload.confidence, safeText, payload.imageAnalysis) +
      '<label style="display:block;font-size:12px;font-weight:800;color:var(--wh-fg2,#888);margin:0 0 7px">Erkannter Text — bitte vor dem Weitergehen prüfen/korrigieren</label>' +
      '<textarea id="whScanResultText" class="wh-scan-edit" spellcheck="false">' + esc(safeText) + '</textarea>' +
      '<div class="wh-scan-actions">' +
        '<button class="wh-btn-primary" id="whScanContinue">Weiter prüfen</button>' +
        '<button class="wh-btn-info" id="whScanCopy">📋 Kopieren</button>' +
        '<button class="wh-btn-info" id="whScanAgain">🔄 Neu scannen</button>' +
        '<button class="wh-btn-info" id="whScanCancel">Abbrechen</button>' +
      '</div>'
    );
    var textEl = $('whScanResultText');
    var continueBtn = $('whScanContinue');
    if (continueBtn) continueBtn.addEventListener('click', function () {
      payload.text = textEl ? textEl.value.trim() : safeText;
      showScanReviewSheet(payload);
    });
    var copyBtn = $('whScanCopy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      fallbackCopy(textEl ? textEl.value : safeText);
    });
    var againBtn = $('whScanAgain');
    if (againBtn) againBtn.addEventListener('click', function () { closeSheet(); scanQRCode(); });
    var cancelBtn = $('whScanCancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closeSheet);
  }

  function scanQRCode () {
    injectScanStyles();
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none';
    var fired = false;
    var cleanupTimer = null;

    function removeInput () {
      clearTimeout(cleanupTimer);
      if (document.body.contains(fileInput)) document.body.removeChild(fileInput);
    }

    fileInput.addEventListener('change', function (e) {
      if (fired) return;
      fired = true;
      removeInput();

      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type || '')) {
        showScanSheet('error', '<div class="wh-scan-alert wh-scan-alert-error">Bitte nur ein Bild auswählen.</div>');
        return;
      }

      fileToDataURL(file, function (readErr, imageSrc) {
        if (readErr || !imageSrc) {
          showScanSheet('error',
            '<div class="wh-scan-alert wh-scan-alert-error">Bild konnte nicht gelesen werden.</div>' +
            '<button class="wh-btn-primary" id="whScanRetryRead">Erneut scannen</button>'
          );
          var rr = $('whScanRetryRead');
          if (rr) rr.addEventListener('click', function () { closeSheet(); scanQRCode(); });
          return;
        }

        showScanSheet('loading',
          '<div style="text-align:center;padding:12px 0">' +
            '<img src="' + imageSrc + '" class="wh-scan-preview" alt="Vorschau">' +
            '<div class="wh-scan-alert">' +
              '<b>Hinweis:</b> Der Scanner erkennt vor allem klare Texte. Formen/Tabellen werden nur einfach eingeschätzt und müssen danach manuell geprüft werden.' +
            '</div>' +
            '<div style="display:flex;align-items:center;justify-content:center;gap:10px;color:var(--wh-fg2,#888)">' +
              '<div class="wh-scan-spinner"></div>' +
              '<span id="whScanProgress">Text wird erkannt… 0%</span>' +
            '</div>' +
          '</div>'
        );

        analyzeImageForSimpleShapes(imageSrc, function (imageAnalysis) {
          loadTesseract(function () {
            Tesseract.recognize(imageSrc, 'deu+eng', {
              logger: function (m) {
                if (m.status === 'recognizing text') {
                  var pEl = $('whScanProgress');
                  if (pEl) pEl.textContent = 'Text wird erkannt… ' + Math.round((m.progress || 0) * 100) + '%';
                }
              }
            }).then(function (result) {
              var text = result.data && result.data.text ? result.data.text.trim() : '';
              var conf = result.data && result.data.confidence != null ? Math.round(result.data.confidence) : 0;

              if (!text) {
                showScanSheet('error',
                  '<img src="' + imageSrc + '" class="wh-scan-preview" alt="Scan-Vorschau">' +
                  '<div class="wh-scan-alert wh-scan-alert-error">' +
                    '<b>Kein Text erkannt.</b><br>Bitte schärfer/heller fotografieren oder die Aufgabe manuell erfassen.' +
                  '</div>' +
                  '<div class="wh-scan-alert wh-scan-alert-warn">' +
                    '<b>Hinweis:</b> Komplexe Formen, Matrizen, Zahnräder oder technische Skizzen werden nicht sicher automatisch erkannt.' +
                  '</div>' +
                  '<div class="wh-scan-actions">' +
                    '<button class="wh-btn-primary" id="whScanRetry">Erneut scannen</button>' +
                    '<button class="wh-btn-info" id="whScanManual">Manuell erfassen</button>' +
                  '</div>'
                );
                var r = $('whScanRetry');
                if (r) r.addEventListener('click', function () { closeSheet(); scanQRCode(); });
                var m = $('whScanManual');
                if (m) m.addEventListener('click', function () {
                  showScanReviewSheet({ fileName: file.name || 'scan', imageSrc: imageSrc, text: '', confidence: 0, imageAnalysis: imageAnalysis });
                });
                return;
              }

              showScanResultSheet({
                fileName: file.name || 'scan',
                imageSrc: imageSrc,
                text: text,
                confidence: conf,
                imageAnalysis: imageAnalysis
              });
            }).catch(function (err) {
              showScanSheet('error',
                '<img src="' + imageSrc + '" class="wh-scan-preview" alt="Scan-Vorschau">' +
                '<div class="wh-scan-alert wh-scan-alert-error">' +
                  '<b>Scan-Fehler:</b><br>' + esc(err && err.message ? err.message : 'Unbekannt') +
                '</div>' +
                '<div class="wh-scan-actions">' +
                  '<button class="wh-btn-primary" id="whScanRetry2">Erneut versuchen</button>' +
                  '<button class="wh-btn-info" id="whScanManual2">Manuell erfassen</button>' +
                '</div>'
              );
              var r2 = $('whScanRetry2');
              if (r2) r2.addEventListener('click', function () { closeSheet(); scanQRCode(); });
              var m2 = $('whScanManual2');
              if (m2) m2.addEventListener('click', function () {
                showScanReviewSheet({ fileName: file.name || 'scan', imageSrc: imageSrc, text: '', confidence: 0, imageAnalysis: imageAnalysis });
              });
            });
          });
        });
      });
    });

    document.body.appendChild(fileInput);
    cleanupTimer = setTimeout(function () {
      if (!fired) removeInput();
    }, 300000);
    fileInput.click();
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
