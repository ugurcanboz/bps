/* Eignungstest-Trainer · UI Home Renderer
   Rendert Startseite, Schnellzugriff und Modul-Sheets. Styling liegt zentral in ui-foundation.css. */
(function () {
  'use strict';

  var VERSION = 'ui-g20-professional-content-registry';

  /* ── Tabs ─────────────────────────────────────────── */
  var TAB_HOME      = 0;
  var TAB_PRACTICE  = 1;
  var TAB_PROGRESS  = 2;
  var TAB_COACH     = 3;
  var TAB_MORE      = 4;
  var activeTab     = TAB_HOME;
  var activePracticeMode = 'practice';

  /* ── Active sheet state ───────────────────────────── */
  var activeSheet = null;

  /* ── Branches ─────────────────────────────────────── */
  var BRANCHES = [
    { id: 'it',        label: 'IT / FISI',                  icon: '💻' },
    { id: 'kaufm',     label: 'Kaufmännisch / Verwaltung',   icon: '💼', iconAsset: './assets/ui/icon-kaufm-ios.svg' },
    { id: 'sozial',    label: 'Sozialpädagogik',            icon: '🤝' }
  ];

  /* ── Professional content registry ────────────────── */
  var BRANCH_CONTENT = {
    it: {
      title: 'IT / FISI Training',
      kicker: 'Fachrichtung',
      subtitle: 'Netzwerk, Hardware, Betriebssysteme, Logik und prüfungsnahes Denken.',
      theme: 'blue',
      primary: ['it','netzwerk','hardware_os','logik','matrizen','mathe','englisch','konzentration','simulation'],
      optional: ['python_quest','deutsch','wissen'],
      start: 'it'
    },
    kaufm: {
      title: 'Kaufmännisches Training',
      kicker: 'Fachrichtung',
      subtitle: 'Kaufmännisches Rechnen, Büroorganisation, Wirtschaft und Kommunikation.',
      theme: 'orange',
      primary: ['kaufmRechnen','bueroWissen','wirtschaft','din5008','kommunikation','deutsch','konzentration','logik'],
      optional: ['mathe','wissen','simulation'],
      start: 'kaufmRechnen'
    },
    sozial: {
      title: 'Sozialpädagogik Training',
      kicker: 'Fachrichtung',
      subtitle: 'Pädagogisches Fachwissen, Entwicklung, Praxisfälle, Recht und Kommunikation.',
      theme: 'rose',
      primary: ['paedagogik','entwicklung_bindung','situationen','kommunikation_sozial','recht_sozial','doku_beobachtung','deutsch','konzentration'],
      optional: ['wissen','simulation'],
      start: 'paedagogik'
    },
    wissen: {
      title: 'Allgemeinwissen',
      kicker: 'Grundlagen',
      subtitle: 'Wissen, Sprache, Logik, Mathematik und Konzentration für Eignungstests.',
      theme: 'green',
      primary: ['wissen','deutsch','englisch','logik','mathe','konzentration','simulation'],
      optional: ['matrizen'],
      start: 'wissen'
    }
  };

  /* ── Module definitions ───────────────────────────── */
  var MODULES = [
    {
      id: 'simulation', label: 'Simulation', icon: '🎯', iconClass: 'c-indigo',
      kicker: 'Prüfungsnah', title: 'Eignungstest Simulation',
      desc: 'Prüfungsnaher Mix mit Zeitdruck. <strong>Sichere Punkte zuerst holen</strong> und Blöcke ruhig abarbeiten.',
      tags: ['Eignungstest', 'Zeitdruck', 'Mix'],
      modes: ['ctcBosch', 'simulation', 'eignungstest', 'bps', 'ctcLohr'], startLabel: 'Simulation starten',
      branches: ['it','kaufm','sozial','wissen']
    },
    {
      id: 'logik', label: 'Logik', icon: '🔢', iconClass: 'c-teal',
      kicker: 'Denken', title: 'Logik & Muster',
      desc: 'Zahlenreihen, Muster und Schlussfolgerungen. <strong>Regel erkennen</strong>, nicht grübeln.',
      tags: ['Zahlenreihen', 'Muster', 'Tempo'], modes: ['logic', 'logischesDenken', 'zahlenreihen', 'cognitive', 'logicSprint'], startLabel: 'Logik starten',
      branches: ['it','kaufm','wissen']
    },
    {
      id: 'matrizen', label: 'Matrizen', icon: '◼', iconClass: 'c-violet',
      kicker: 'Visuell', title: 'Matrizen & Mustersehen',
      desc: 'Visuelle Beziehungen, Reihen und Spalten. <strong>Strukturen sauber erkennen</strong>.',
      tags: ['Matrizen', 'Rotation', 'Reihenlogik'], modes: ['matrixTraining', 'matrices', 'matrix', 'matrizen', 'matrixOnlySprint'], startLabel: 'Matrizen starten',
      branches: ['it','wissen']
    },
    {
      id: 'mathe', label: 'Mathe', icon: '✕', iconClass: 'c-orange',
      kicker: 'Rechnen', title: 'Mathe & Textaufgaben',
      desc: 'Prozent, Dreisatz, Kopfrechnen und Textaufgaben. <strong>Schnell und sicher</strong> rechnen.',
      tags: ['Prozent', 'Dreisatz', 'Kopfrechnen'], modes: ['math', 'mathe', 'textMath', 'kopfrechnen', 'mathSprint'], startLabel: 'Mathe starten',
      branches: ['it','kaufm','wissen']
    },
    {
      id: 'deutsch', label: 'Deutsch', icon: '✏️', iconClass: 'c-blue',
      kicker: 'Sprache', title: 'Deutsch & Textverständnis',
      desc: 'Satzergänzung, Wortlogik, Grammatik und Textverständnis. <strong>Genau lesen</strong> und sauber entscheiden.',
      tags: ['Satzergänzung', 'Text', 'Sprache'], modes: ['sentenceCompletion', 'satzergänzung', 'deutsch', 'german', 'sentenceSprint'], startLabel: 'Deutsch starten',
      branches: ['kaufm','sozial','wissen','it']
    },
    {
      id: 'wissen', label: 'Wissen', icon: '🌐', iconClass: 'c-green',
      kicker: 'Allgemeinwissen', title: 'Allgemeinwissen sicher abrufen',
      desc: 'Politik, Geschichte, Gesellschaft und Weltwissen. <strong>Schnell abrufen</strong>, sicher punkten.',
      tags: ['BRD', 'Gesellschaft', 'Weltwissen'], modes: ['generalKnowledge', 'allgemeinwissen', 'knowledge', 'general', 'knowledgeSprint'], startLabel: 'Wissen starten',
      branches: ['wissen','kaufm','sozial','it']
    },
    {
      id: 'englisch', label: 'Englisch', icon: '🗣', iconClass: 'c-sky',
      kicker: 'Basics', title: 'Englisch Basics',
      desc: 'Grundwortschatz und einfache Grammatik. <strong>Keine Zeit verlieren</strong>.',
      tags: ['Grammar', 'Vocabulary', 'Basics'], modes: ['english', 'englisch'], startLabel: 'Englisch starten',
      branches: ['it','wissen']
    },
    {
      id: 'it', label: 'IT-Grundlagen', icon: '💻', iconClass: 'c-slate',
      kicker: 'FISI', title: 'IT-Grundlagen',
      desc: 'EDV, Hardware, Netzwerk und Betriebssysteme. <strong>Technisch und praktisch denken</strong>.',
      tags: ['EDV', 'Hardware', 'Netzwerk'], modes: ['itSprint', 'it', 'edv', 'itBasics'], startLabel: 'IT starten',
      branches: ['it']
    },
    {
      id: 'netzwerk', label: 'Netzwerk', icon: '🌐', iconClass: 'c-blue',
      kicker: 'FISI', title: 'Netzwerkgrundlagen',
      desc: 'IP, DNS, Subnetze und Grundbegriffe der Netzwerktechnik. <strong>Zusammenhänge verstehen</strong>.',
      tags: ['IP', 'DNS', 'Subnetz'], modes: ['itSprint', 'it', 'edv', 'itBasics'], startLabel: 'Netzwerk starten',
      branches: ['it']
    },
    {
      id: 'hardware_os', label: 'Hardware & OS', icon: '🖥️', iconClass: 'c-indigo',
      kicker: 'FISI', title: 'Hardware & Betriebssysteme',
      desc: 'PC-Komponenten, Betriebssysteme, einfache Administration und Fehlersuche. <strong>Praxisnah denken</strong>.',
      tags: ['Hardware', 'Windows', 'OS'], modes: ['itSprint', 'it', 'edv', 'itBasics'], startLabel: 'Hardware starten',
      branches: ['it']
    },
    {
      id: 'konzentration', label: 'Fokus', icon: '👁', iconClass: 'c-rose',
      kicker: 'Aufmerksamkeit', title: 'Konzentration & Fehlerblick',
      desc: 'Schnelle Wahrnehmung unter Druck. <strong>Ruhig bleiben</strong> und präzise tippen.',
      tags: ['Fokus', 'Tempo', 'Fehlerblick'], modes: ['concentrationSprint', 'concentrationPro', 'concentration', 'aufmerksamkeit'], startLabel: 'Fokus starten',
      branches: ['it','kaufm','sozial','wissen']
    },
    {
      id: 'kaufmRechnen', label: 'Kaufm. Rechnen', icon: '📊', iconClass: 'c-orange',
      kicker: 'Rechnungswesen', title: 'Kaufmännisches Rechnen',
      desc: 'Prozentrechnung, Dreisatz, Zinsen, Skonto, Rabatt und Mehrwertsteuer. <strong>Sicher kalkulieren</strong>.',
      tags: ['Dreisatz', 'Prozent', 'Skonto'], modes: ['kaufmRechnen'], startLabel: 'Rechnen starten',
      branches: ['kaufm']
    },
    {
      id: 'bueroWissen', label: 'Büro & Verwaltung', icon: '📁', iconClass: 'c-blue',
      kicker: 'Verwaltung', title: 'Büroorganisation & Verwaltung',
      desc: 'Abläufe, Organisation, Akten, Fristen und Verwaltungssicherheit. <strong>Ordnung ins System bringen</strong>.',
      tags: ['Büro', 'Abläufe', 'Verwaltung'], modes: ['bueroWissen'], startLabel: 'Bürowissen starten',
      branches: ['kaufm']
    },
    {
      id: 'wirtschaft', label: 'Wirtschaft', icon: '💶', iconClass: 'c-green',
      kicker: 'Kaufmännisch', title: 'Wirtschaft & Finanzen',
      desc: 'Grundbegriffe aus Wirtschaft, Betrieb, Markt und Finanzen. <strong>Zusammenhänge erkennen</strong>.',
      tags: ['Wirtschaft', 'Finanzen', 'Betrieb'], modes: ['bueroWissen','kaufmRechnen'], startLabel: 'Wirtschaft starten',
      branches: ['kaufm']
    },
    {
      id: 'din5008', label: 'DIN 5008', icon: '📄', iconClass: 'c-slate',
      kicker: 'Kommunikation', title: 'DIN 5008 & Schriftverkehr',
      desc: 'Geschäftsbrief, E-Mail, Aufbau und formale Standards. <strong>Professionell schreiben</strong>.',
      tags: ['DIN 5008', 'Brief', 'E-Mail'], modes: ['bueroWissen','deutsch'], startLabel: 'DIN 5008 starten',
      branches: ['kaufm']
    },
    {
      id: 'kommunikation', label: 'Kommunikation', icon: '💬', iconClass: 'c-sky',
      kicker: 'Kaufmännisch', title: 'Kommunikation & Deutsch',
      desc: 'Kundenkontakt, klare Sprache, Textverständnis und schriftliche Kommunikation. <strong>Sachlich und sicher</strong>.',
      tags: ['Kommunikation', 'Deutsch', 'Kundenkontakt'], modes: ['sentenceCompletion','deutsch','sentenceSprint'], startLabel: 'Kommunikation starten',
      branches: ['kaufm']
    },
    {
      id: 'paedagogik', label: 'Pädagogik', icon: '🧸', iconClass: 'c-rose',
      kicker: 'Fachwissen', title: 'Pädagogisches Fachwissen',
      desc: 'Bild vom Kind, Bildungsbereiche, Inklusion und pädagogische Grundlagen. <strong>Fachlich sauber argumentieren</strong>.',
      tags: ['Pädagogik', 'Inklusion', 'Bildung'], modes: ['paedagogik'], startLabel: 'Pädagogik starten',
      branches: ['sozial']
    },
    {
      id: 'entwicklung_bindung', label: 'Entwicklung & Bindung', icon: '🌱', iconClass: 'c-green',
      kicker: 'Sozialpädagogik', title: 'Entwicklung & Bindung',
      desc: 'Entwicklungsphasen, Bindungstheorie und kindliche Bedürfnisse. <strong>Fachbegriffe gezielt nutzen</strong>.',
      tags: ['Entwicklung', 'Bindung', 'Piaget'], modes: ['paedagogik'], startLabel: 'Entwicklung starten',
      branches: ['sozial']
    },
    {
      id: 'situationen', label: 'Praxisfälle', icon: '🤝', iconClass: 'c-teal',
      kicker: 'Praxis', title: 'Praxissituationen & Handeln',
      desc: 'Konflikte, Gruppenraum, Elternarbeit und Team-Kommunikation. <strong>Empathisch und professionell handeln</strong>.',
      tags: ['Konflikte', 'Elternarbeit', 'Team'], modes: ['situationen'], startLabel: 'Praxis starten',
      branches: ['sozial']
    },
    {
      id: 'kommunikation_sozial', label: 'Kommunikation', icon: '🗨️', iconClass: 'c-blue',
      kicker: 'Sozialpädagogik', title: 'Kommunikation & Elternarbeit',
      desc: 'Gesprächsführung, Konfliktklärung, Elternkontakt und Teamarbeit. <strong>Ruhig und klar bleiben</strong>.',
      tags: ['Elternarbeit', 'Team', 'Konflikt'], modes: ['situationen'], startLabel: 'Kommunikation starten',
      branches: ['sozial']
    },
    {
      id: 'recht_sozial', label: 'Recht / Schutz', icon: '⚖️', iconClass: 'c-slate',
      kicker: 'Sozialpädagogik', title: 'Recht, Schutzauftrag & SGB VIII',
      desc: 'Kinderschutz, Aufsicht, Beteiligung und rechtliche Grundlagen. <strong>Sicherheit in Fachfragen</strong>.',
      tags: ['SGB VIII', 'Kinderschutz', 'Aufsicht'], modes: ['paedagogik','situationen'], startLabel: 'Recht starten',
      branches: ['sozial']
    },
    {
      id: 'doku_beobachtung', label: 'Beobachtung', icon: '📋', iconClass: 'c-orange',
      kicker: 'Sozialpädagogik', title: 'Beobachtung & Dokumentation',
      desc: 'Beobachten, dokumentieren, reflektieren und pädagogisch begründen. <strong>Fachlich nachvollziehbar</strong>.',
      tags: ['Beobachtung', 'Doku', 'Reflexion'], modes: ['paedagogik','situationen'], startLabel: 'Beobachtung starten',
      branches: ['sozial']
    },
    {
      id: 'python_quest', label: 'Python Quest', icon: '🐍', iconClass: 'c-green',
      kicker: 'Optional', title: 'Python Quest Academy',
      desc: 'Optionales Coding-Modul für IT-Interessierte. <strong>Nicht Teil kaufmännischer oder sozialpädagogischer Pflichtbereiche</strong>.',
      tags: ['Coding', 'Syntax', 'Optional'], modes: ['python_quest'], startLabel: 'Quest starten',
      branches: ['it'], optional: true
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
    var n = $('uiNotice');
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


  function branchById(id) {
    for (var i = 0; i < BRANCHES.length; i++) if (BRANCHES[i].id === id) return BRANCHES[i];
    if (id === 'wissen') return { id: 'wissen', label: 'Allgemeinwissen', icon: '🌐', iconAsset: './assets/ui/icon-knowledge.svg' };
    return null;
  }

  function moduleIconHtml(mod) {
    if (!mod) return '';
    if (mod.iconAsset) return '<img src="' + esc(mod.iconAsset) + '" alt="">';
    return esc(mod.icon || '');
  }

  function uniqueModuleIds(ids) {
    var seen = {};
    return (ids || []).filter(function (id) {
      if (!id || seen[id]) return false;
      seen[id] = true;
      return !!moduleById(id);
    });
  }

  function branchConfig(branch) {
    return BRANCH_CONTENT[branch] || null;
  }

  function branchModules(branch, includeOptional) {
    var cfg = branchConfig(branch);
    if (!cfg) return [];
    var ids = (cfg.primary || []).slice();
    if (includeOptional) ids = ids.concat(cfg.optional || []);
    return uniqueModuleIds(ids).map(moduleById);
  }

  function branchOptionalModules(branch) {
    var cfg = branchConfig(branch);
    return cfg ? uniqueModuleIds(cfg.optional || []).map(moduleById) : [];
  }

  function isTouchDevice () {
    try { return (navigator.maxTouchPoints || 0) > 0 || ('ontouchstart' in window); } catch (e) { return false; }
  }

  function sheetIconHtml (source) {
    if (!source) return '🎯';
    if (source.iconAsset) return '<img src="' + esc(source.iconAsset) + '" alt="">';
    if (source.id === 'kaufm' && isTouchDevice()) return '<img src="./assets/ui/icon-kaufm-ios.svg" alt="">';
    return source.icon ? esc(source.icon) : '🎯';
  }

  function openDeepSheet (config) {
    config = config || {};
    var backdrop = $('uiSheetBackdrop');
    var sheet    = $('uiSheet');
    if (!backdrop || !sheet) return false;

    var theme = config.theme || 'indigo';
    var title = config.title || 'Menü';
    var kicker = config.kicker || '';
    var subtitle = config.subtitle || '';
    var iconHtml = config.iconHtml || '🎯';
    var bodyHtml = config.bodyHtml || '';
    var footerHtml = config.footerHtml || '';

    sheet.setAttribute('data-ui-deep-sheet', config.type || 'generic');
    if (config.branch) sheet.setAttribute('data-branch', config.branch); else sheet.removeAttribute('data-branch');
    sheet.className = 'ui-sheet ui-deep-sheet ui-deep-theme-' + esc(theme);
    sheet.innerHTML =
      '<div class="ui-sheet-handle" aria-hidden="true"></div>' +
      '<div class="ui-deep-head">' +
        '<div class="ui-deep-icon c-' + esc(theme) + '">' + iconHtml + '</div>' +
        '<div class="ui-deep-titlebox">' +
          '<div class="ui-deep-kicker">' + esc(kicker) + '</div>' +
          '<h2 class="ui-deep-title">' + esc(title) + '</h2>' +
          (subtitle ? '<p class="ui-deep-subtitle">' + esc(subtitle) + '</p>' : '') +
        '</div>' +
        '<button type="button" class="ui-sheet-close ui-deep-close" id="uiSheetClose" aria-label="Schließen">✕</button>' +
      '</div>' +
      '<div class="ui-deep-body" data-sheet-scroll>' + bodyHtml + '</div>' +
      (footerHtml ? '<div class="ui-deep-footer">' + footerHtml + '</div>' : '');

    var closeBtn = $('uiSheetClose');
    if (closeBtn) closeBtn.onclick = closeSheet;
    backdrop.onclick = function (e) { if (e.target === backdrop) closeSheet(); };

    backdrop.classList.add('show', 'is-visible');
    sheet.offsetHeight;
    sheet.classList.add('show', 'is-visible');
    try {
      document.documentElement.classList.add('egt-layer-open','ui-overlay-open');
      document.body.classList.add('egt-layer-open','egt-ui-layer-active','ui-overlay-open');
    } catch(e) {}
    return true;
  }

  function branchStatsHtml(branchId) {
    var list = branchModules(branchId || '', false);
    var optional = branchOptionalModules(branchId || '');
    return '<div class="ui-deep-benefits">' +
      '<div class="ui-deep-benefit"><b>' + list.length + '</b><span>Pflichtbereiche</span></div>' +
      '<div class="ui-deep-benefit"><b>' + optional.length + '</b><span>Zusatzmodule</span></div>' +
      '<div class="ui-deep-benefit"><b>Coach</b><span>Analysefähig</span></div>' +
    '</div>';
  }

  function moduleCardHtml(mod) {
    return '<button type="button" class="ui-deep-card" data-ui-action="open-module" data-module="' + esc(mod.id) + '">' +
      '<span class="ui-deep-card-icon ' + esc(mod.iconClass || '') + '">' + moduleIconHtml(mod) + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(mod.label) + '</b><small>' + esc(mod.kicker || 'Modul öffnen') + '</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' +
    '</button>';
  }

  function showFoundationSheet(title, kicker, iconHtml, bodyHtml) {
    return openDeepSheet({
      type: 'foundation',
      title: title,
      kicker: kicker || 'Menü',
      iconHtml: iconHtml || '🎯',
      bodyHtml: bodyHtml || ''
    });
  }

  function openBranchMenu(branchId, preferredModule) {
    var branch = branchById(branchId);
    var cfg = branchConfig(branchId || '');
    if (!branch && preferredModule) {
      var fallback = moduleById(preferredModule);
      if (fallback) return openSheet(fallback);
      return false;
    }
    if (branchId && branchId !== 'wissen') {
      try { localStorage.setItem('bps_branch', branchId); updateTopBar(); } catch(e) {}
    }
    var list = branchModules(branchId || '', false);
    var optional = branchOptionalModules(branchId || '');
    var primaryIds = list.map(function(m){ return m.id; });
    if (preferredModule && primaryIds.indexOf(preferredModule) !== -1) {
      list.sort(function(a,b){ return (a.id === preferredModule ? -1 : 0) + (b.id === preferredModule ? 1 : 0); });
    }
    var cards = list.map(moduleCardHtml).join('');
    var optionalCards = optional.length ?
      '<div class="ui-deep-section-label">Optionale Zusatzmodule</div><div class="ui-deep-grid ui-deep-grid-optional">' + optional.map(moduleCardHtml).join('') + '</div>' : '';
    var empty = '<div class="ui-deep-empty">Für diesen Bereich sind noch keine Module hinterlegt.</div>';
    var startId = (cfg && cfg.start) || (list[0] && list[0].id) || 'simulation';
    var body =
      branchStatsHtml(branchId) +
      '<div class="ui-deep-section-label">Fachlich passende Module</div>' +
      '<div class="ui-deep-grid">' + (cards || empty) + '</div>' +
      optionalCards +
      '<div class="ui-deep-startbox">' +
        '<div><b>Schnellstart</b><span>Starte mit dem wichtigsten Modul dieses Bereichs.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="open-module" data-module="' + esc(startId) + '">Training starten 🚀</button>' +
      '</div>';
    return openDeepSheet({
      type: 'branch-menu',
      branch: branchId || '',
      theme: (cfg && cfg.theme) || (branchId === 'kaufm' ? 'orange' : branchId === 'sozial' ? 'rose' : branchId === 'wissen' ? 'green' : 'blue'),
      title: (cfg && cfg.title) || (branch ? branch.label : 'Trainingsbereich'),
      kicker: (cfg && cfg.kicker) || 'Training',
      subtitle: (cfg && cfg.subtitle) || 'Wähle ein fachlich passendes Modul.',
      iconHtml: sheetIconHtml(branch),
      bodyHtml: body
    });
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
    var shell = $('uiShell');
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
  function moduleDeepBody(mod, modeKey, amount, rs) {
    return '' +
      (rs.runs > 0 ?
        '<div class="ui-deep-benefits">' +
          '<div class="ui-deep-benefit"><b>' + rs.runs + '</b><span>Läufe</span></div>' +
          '<div class="ui-deep-benefit"><b>' + rs.percent + '%</b><span>Ø Schnitt</span></div>' +
          '<div class="ui-deep-benefit"><b>' + rs.best + '%</b><span>Bestwert</span></div>' +
        '</div>' :
        '<div class="ui-deep-benefits">' +
          '<div class="ui-deep-benefit"><b>Original</b><span>Aufgabenlogik</span></div>' +
          '<div class="ui-deep-benefit"><b>Sofort</b><span>Feedback</span></div>' +
          '<div class="ui-deep-benefit"><b>Analyse</b><span>Fortschritt</span></div>' +
        '</div>') +
      '<p class="ui-deep-desc">' + mod.desc + '</p>' +
      '<div class="ui-deep-pills">' +
        mod.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') +
        (amount > 0 ? '<span>' + amount + ' Aufgaben</span>' : '') +
      '</div>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>' + esc(mod.startLabel || 'Training starten') + '</b><span>' + (modeKey ? 'Modus bereit: ' + esc(modeKey) : 'App-Core wird beim Start geprüft.') + '</span></div>' +
        '<button type="button" class="ui-deep-primary" id="uiSheetStart">Starten 🚀</button>' +
      '</div>';
  }

  function openSheet (mod) {
    activeSheet = mod;
    if (!mod) return false;
    var modeKey = pickMode(mod);
    var amount  = modeKey ? modeAmount(modeKey) : 0;
    var rs = resultStats();
    var opened = openDeepSheet({
      type: 'module',
      theme: (mod.iconClass || 'c-indigo').replace(/^c-/, '') || 'indigo',
      title: mod.title || mod.label || 'Modul',
      kicker: mod.kicker || 'Training',
      subtitle: mod.desc ? String(mod.desc).replace(/<[^>]+>/g, '') : '',
      iconHtml: moduleIconHtml(mod),
      bodyHtml: moduleDeepBody(mod, modeKey, amount, rs)
    });
    var startBtn = $('uiSheetStart');
    if (startBtn) startBtn.onclick = function () {
      closeSheet();
      startModule(mod);
    };
    return opened;
  }

  function closeSheet () {
    var backdrop = $('uiSheetBackdrop');
    var sheet    = $('uiSheet');
    if (!backdrop || !sheet) return;
    sheet.classList.remove('show','is-visible');
    backdrop.classList.remove('show','is-visible');
    try { document.documentElement.classList.remove('egt-layer-open','ui-overlay-open'); document.body.classList.remove('egt-layer-open','egt-ui-layer-active','ui-overlay-open'); } catch(e) {}
    activeSheet = null;
  }


  /* ── Global Deep Interaction Menus ──────────────────
     UI-G19: Every interactive door opens through the same Deep-Sheet foundation.
     Kachel = Tür. Deep Sheet = zentraler Raum. Inhalt wird dynamisch eingesetzt. */
  function actionCardHtml(action, title, desc, icon, extraAttrs) {
    return '<button type="button" class="ui-deep-card" data-ui-action="' + esc(action) + '" ' + (extraAttrs || '') + '>' +
      '<span class="ui-deep-card-icon">' + esc(icon || '›') + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(title || 'Aktion') + '</b><small>' + esc(desc || '') + '</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' +
    '</button>';
  }

  function deepModuleListHtml(items) {
    return '<div class="ui-deep-grid">' + items.map(function(it){
      return moduleCardHtml(moduleById(it) || { id: it, label: it, kicker: 'Modul öffnen', icon: '🎯', iconClass: '' });
    }).join('') + '</div>';
  }

  function openPracticeDeepSheet(mode) {
    var isLearn = mode === 'learn';
    var ids = isLearn
      ? ['deutsch','mathe','logik','it','kaufmRechnen','bueroWissen','paedagogik','situationen','wissen']
      : ['simulation','mathe','logik','konzentration','deutsch','it','kaufmRechnen','paedagogik','wissen'];
    var body =
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + (isLearn ? 'Lernen' : 'Üben') + '</b><span>' + (isLearn ? 'Verstehen, merken, anwenden' : 'Direkt Aufgaben lösen') + '</span></div>' +
        '<div class="ui-deep-benefit"><b>Sauber</b><span>Fachlich sortiert</span></div>' +
        '<div class="ui-deep-benefit"><b>Analyse</b><span>Coach kann auswerten</span></div>' +
      '</div>' +
      '<div class="ui-deep-section-label">' + (isLearn ? 'Lernbereiche' : 'Übungsbereiche') + '</div>' +
      deepModuleListHtml(ids) +
      '<div class="ui-deep-startbox">' +
        '<div><b>' + (isLearn ? 'Strukturiert lernen' : 'Prüfungsnah starten') + '</b><span>' + (isLearn ? 'Starte mit Grundlagen und wechsle danach in Aufgaben.' : 'Starte eine gemischte Simulation mit Zeitdruck.') + '</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="open-module" data-module="simulation">Simulation starten 🚀</button>' +
      '</div>';
    return openDeepSheet({
      type: isLearn ? 'learn-menu' : 'practice-menu',
      theme: isLearn ? 'rose' : 'blue',
      title: isLearn ? 'Lernmodus' : 'Üben & Aufgaben lösen',
      kicker: isLearn ? 'Lernen' : 'Training',
      subtitle: isLearn ? 'Grundlagen verstehen, fachlich sortiert wiederholen und danach trainieren.' : 'Wähle einen passenden Übungsbereich. Keine fachfremden Module im Schnellzugriff.',
      iconHtml: isLearn ? '🎓' : '📘',
      bodyHtml: body
    });
  }

  function openCoachDeepSheet() {
    var rs = resultStats();
    var body =
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + rs.runs + '</b><span>Trainingsläufe</span></div>' +
        '<div class="ui-deep-benefit"><b>' + rs.percent + '%</b><span>Ø Trefferquote</span></div>' +
        '<div class="ui-deep-benefit"><b>' + rs.best + '%</b><span>Bestwert</span></div>' +
      '</div>' +
      '<div class="ui-deep-section-label">Coach-Aktionen</div>' +
      '<div class="ui-deep-grid">' +
        actionCardHtml('coach-open-core', 'KI-Coach öffnen', 'Fragen stellen, Erklärungen holen und Lernhinweise prüfen', '✦') +
        actionCardHtml('analysis', 'Schwächenanalyse', 'Ergebnisse, Fehlerarten und Entwicklung prüfen', '▥') +
        actionCardHtml('practice', 'Empfohlen üben', 'Direkt in passende Übungsmodule einsteigen', '↗') +
        actionCardHtml('learn', 'Grundlagen wiederholen', 'Erst verstehen, dann Aufgaben lösen', '◎') +
        actionCardHtml('open-module', 'Simulation starten', 'Prüfungsnah testen und Daten für den Coach sammeln', '🎯', 'data-module="simulation"') +
        actionCardHtml('progress', 'Prüfungsampel', 'Fortschritt und Leistungsstand kompakt ansehen', '▤') +
      '</div>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>Nächster sinnvoller Schritt</b><span>Bei wenig Daten: zuerst Simulation oder Üben starten. Bei vorhandenen Daten: Analyse öffnen.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="analysis">Coach-Analyse öffnen</button>' +
      '</div>';
    return openDeepSheet({ type:'coach-menu', theme:'blue', title:'KI-Coach', kicker:'Coach', subtitle:'Analyse, Empfehlungen und nächste Trainingsschritte an einem Ort.', iconHtml:'✦', bodyHtml:body });
  }

  function openAnalysisDeepSheet() {
    var rs = resultStats();
    var body =
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + rs.runs + '</b><span>Trainingsläufe</span></div>' +
        '<div class="ui-deep-benefit"><b>' + rs.percent + '%</b><span>Durchschnitt</span></div>' +
        '<div class="ui-deep-benefit"><b>' + rs.best + '%</b><span>Bestwert</span></div>' +
      '</div>' +
      '<div class="ui-deep-section-label">Analyse</div>' +
      '<div class="ui-deep-grid">' +
        actionCardHtml('analysis-open-core', 'Detailanalyse öffnen', 'Bestehende App-Analyse starten', '▥') +
        actionCardHtml('progress', 'Fortschritt kompakt', 'Zusammenfassung und nächste Schritte', '▤') +
        actionCardHtml('practice', 'Schwächen trainieren', 'Mit Übungen weitermachen', '↗') +
        actionCardHtml('clear-progress', 'Fortschritt zurücksetzen', 'Nur wenn du bewusst neu starten willst', '×') +
      '</div>';
    return openDeepSheet({ type:'analysis-menu', theme:'green', title:'Analyse', kicker:'Menü', subtitle:'Fortschritt, Ergebnisse und nächste Schritte zentral an einem Ort.', iconHtml:'▥', bodyHtml:body });
  }

  function openProgressDeepSheet() {
    var rs = resultStats();
    var body =
      '<div class="ui-deep-benefits">' +
        '<div class="ui-deep-benefit"><b>' + rs.runs + '</b><span>Läufe</span></div>' +
        '<div class="ui-deep-benefit"><b>' + rs.percent + '%</b><span>Ø Quote</span></div>' +
        '<div class="ui-deep-benefit"><b>' + rs.best + '%</b><span>Bestwert</span></div>' +
      '</div>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>Weiterentwickeln</b><span>Nutze Analyse oder Training, um deinen nächsten Sprung zu machen.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="analysis">Analyse öffnen</button>' +
      '</div>';
    return openDeepSheet({ type:'progress-menu', theme:'green', title:'Fortschritt', kicker:'Menü', subtitle:'Dein Leistungsstand kompakt im zentralen Sheet.', iconHtml:'▤', bodyHtml:body });
  }

  function openSettingsDeepSheet() {
    var body =
      '<div class="ui-deep-section-label">System & Einstellungen</div>' +
      '<div class="ui-deep-grid">' +
        actionCardHtml('login-open-core', 'Login öffnen', 'Teilnehmer, Dozent oder Admin anmelden', '♙') +
        actionCardHtml('feedback-open-core', 'Feedback geben', 'Feedback- und Fehlerformular öffnen', '✉') +
        actionCardHtml('backup', 'Backup exportieren', 'Lokale Daten sichern', '⤓') +
        actionCardHtml('clear-cache', 'Cache löschen', 'PWA/Service-Worker Cache bereinigen', '↻') +
        actionCardHtml('clear-progress', 'Fortschritt zurücksetzen', 'Trainingsdaten bewusst löschen', '×') +
        actionCardHtml('branch-sheet', 'Fachrichtung wählen', 'IT, Sozial, Kaufmännisch oder Wissen auswählen', '◇') +
      '</div>';
    return openDeepSheet({ type:'settings-menu', theme:'blue', title:'Mehr & Einstellungen', kicker:'Menü', subtitle:'System, Daten und Einstellungen an einem Ort.', iconHtml:'☼', bodyHtml:body });
  }

  function openLoginDeepSheet() {
    var body =
      '<div class="ui-deep-grid">' +
        actionCardHtml('login-open-core', 'Login öffnen', 'Teilnehmer, Dozent oder Admin anmelden', '♙') +
        actionCardHtml('branch-sheet', 'Fachrichtung wählen', 'Trainingsbereich wechseln', '◇') +
      '</div>';
    return openDeepSheet({ type:'login-menu', theme:'blue', title:'Login', kicker:'Menü', subtitle:'Teilnehmer, Dozent oder Admin anmelden.', iconHtml:'♙', bodyHtml:body });
  }

  function openFeedbackDeepSheet() {
    var body =
      '<div class="ui-deep-grid">' +
        actionCardHtml('feedback-open-core', 'Feedbackformular öffnen', 'Fehler melden oder Verbesserung notieren', '✉') +
        actionCardHtml('settings', 'Einstellungen', 'Weitere Systemaktionen ansehen', '☼') +
      '</div>';
    return openDeepSheet({ type:'feedback-menu', theme:'rose', title:'Feedback', kicker:'Menü', subtitle:'Rückmeldung und Support an einem Ort.', iconHtml:'✉', bodyHtml:body });
  }

  function openScanDeepSheet() {
    var body =
      '<p class="ui-deep-desc">Scans bleiben bewusst geführt: erst Vorschau prüfen, dann übernehmen. So vermeiden wir schlechte OCR-Daten in der Aufgabenbank.</p>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>Scanner starten</b><span>Für Admins oder eingeloggte Teilnehmer.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="scan-open-core">Scanner öffnen</button>' +
      '</div>';
    return openDeepSheet({ type:'scan-menu', theme:'blue', title:'Scanner', kicker:'Menü', subtitle:'OCR/Import als kontrollierter Prozess.', iconHtml:'▣', bodyHtml:body });
  }

  function openPythonQuestDeepSheet() {
    var body =
      '<p class="ui-deep-desc">Python Quest öffnet als eigenes Lernmodul. Der Einstieg ist als optionales IT-Zusatzmodul geführt.</p>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>Python Quest starten</b><span>Coding-Aufgaben und Grundlagen öffnen.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="python-quest-open-core">Quest öffnen</button>' +
      '</div>';
    return openDeepSheet({ type:'python-menu', theme:'green', title:'Python Quest', kicker:'Menü', subtitle:'Optionales Coding-Modul für IT-Interessierte öffnen.', iconHtml:'🐍', bodyHtml:body });
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
    if (tab === TAB_PROGRESS) {
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
    var chip = $('uiBranchChip');
    if (chip) {
      chip.textContent = branchLabel;
    }
  }

  /* ── Render Module Grid ───────────────────────────── */
  function renderGrid () {
    var grid = $('uiModuleGrid');
    if (!grid) return;

    var currentBranch = localStorage.getItem('bps_branch') || '';
    var isLoggedIn = !!localStorage.getItem('egt_active_learner') || !!(window.EGTAdminPortal && typeof EGTAdminPortal.isAdminOpen === 'function' && EGTAdminPortal.isAdminOpen());
    var filtered = currentBranch ? branchModules(currentBranch, true) : branchModules('wissen', true);

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

    grid.innerHTML = filtered.map(function (mod) {
      var extraClass = mod.isCoachCard ? ' ui-coach-card' : '';
      var idAttr = mod.isCoachCard ? ' id="uiCoachCard"' : '';
      var action = 'open-module';
      if (mod.isCoachCard) action = 'coach';
      else if (mod.isScanCard) action = 'scan';
      else if (mod.isAnalyseCard) action = 'analysis';
      else if (mod.id === 'python_quest') action = 'python-quest';
      return (
        '<button type="button" class="ui-mod-card' + extraClass + '"' + idAttr +
             ' data-ui-action="' + action + '" data-module="' + esc(mod.id) + '" aria-label="' + esc(mod.label) + ' öffnen">' +
          '<div class="ui-mod-icon ' + esc(mod.iconClass) + '">' + esc(mod.icon) + '</div>' +
          '<span class="ui-mod-label">' + esc(mod.label) + '</span>' +
        '</button>'
      );
    }).join('');
  }

  /* ── Render Bottom Dock ───────────────────────────────
     UI-G12: Bottom dock is a real foundation component.
     No glyph fallback, no image loading, no legacy tabbar classes. */
  function navIcon (name) {
    var paths = {
      dashboard: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10.5V20h11v-9.5"/><path d="M10 20v-5h4v5"/>',
      practice: '<path d="M5 19h14"/><path d="M7 16.5 16.8 6.7a2.1 2.1 0 0 1 3 3L10 19H7v-2.5Z"/><path d="M14.8 8.7l2.5 2.5"/>',
      progress: '<path d="M5 20V9"/><path d="M12 20V4"/><path d="M19 20v-7"/><path d="M3.8 20h16.4"/>',
      coach: '<path d="M12 3.8v3.4"/><path d="M12 16.8v3.4"/><path d="M3.8 12h3.4"/><path d="M16.8 12h3.4"/><path d="m6.9 6.9 2.4 2.4"/><path d="m14.7 14.7 2.4 2.4"/><path d="m17.1 6.9-2.4 2.4"/><path d="m9.3 14.7-2.4 2.4"/><circle cx="12" cy="12" r="2.3"/>',
      more: '<circle cx="6.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17.5" cy="12" r="1.5"/>'
    };
    return '<svg class="egt-dock-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || paths.more) + '</g></svg>';
  }

  function renderTabBar () {
    var tabs = $('egtBottomDock');
    if (!tabs) return;

    tabs.className = 'egt-bottom-dock';
    tabs.setAttribute('aria-label', 'Navigation');
    tabs.setAttribute('role', 'tablist');

    var navItems = [
      { label: 'Dashboard', icon: 'dashboard' },
      { label: 'Üben', icon: 'practice' },
      { label: 'Fortschritt', icon: 'progress' },
      { label: 'Coach', icon: 'coach' },
      { label: 'Mehr', icon: 'more' }
    ];

    tabs.innerHTML = navItems.map(function (item, i) {
      return (
        '<button type="button" class="egt-dock-btn' + (i === activeTab ? ' is-active' : '') + '" ' +
                'data-ui-nav="tab" data-tab="' + i + '" aria-label="' + esc(item.label) + '" role="tab" aria-selected="' + (i === activeTab ? 'true' : 'false') + '">' +
          '<span class="egt-dock-icon">' + navIcon(item.icon) + '</span>' +
          '<span class="egt-dock-label">' + esc(item.label) + '</span>' +
        '</button>'
      );
    }).join('');
  }

  /* ── Render Tab Content ───────────────────────────── */
  function renderTabContent () {
    var content = $('uiTabContent');
    var home = $('uiHomeViewport');
    var gridWrap = $('uiModuleGridWrap');
    if (!content) return;

    if (gridWrap) gridWrap.style.display = 'none';

    if (activeTab === TAB_HOME) {
      if (home) home.style.display = '';
      content.style.display = 'none';
      return;
    }

    if (home) home.style.display = 'none';
    content.style.display = '';

    if (activeTab === TAB_PRACTICE) {
      renderPracticeTab(content);
    } else if (activeTab === TAB_PROGRESS) {
      renderHighscoreTab(content);
    } else if (activeTab === TAB_COACH) {
      renderCoachTab(content);
    } else if (activeTab === TAB_MORE) {
      renderSystemTab(content);
    }
  }

  function renderPracticeTab (el) {
    var mode = activePracticeMode === 'learn' ? 'learn' : 'practice';
    var isLearn = mode === 'learn';
    var items = isLearn ? [
      ['deutsch','Deutsch & Textverständnis','Sprache, Satzergänzung und Texte Schritt für Schritt'],
      ['mathe','Mathe verstehen','Prozent, Dreisatz und Textaufgaben sicher aufbauen'],
      ['logik','Logik verstehen','Muster, Reihen und Regeln erkennen'],
      ['it','IT-Grundlagen lernen','Hardware, Netzwerk und EDV strukturiert wiederholen'],
      ['kaufmRechnen','Kaufmännisch lernen','Prozent, Skonto, Rabatt und Bürorechnen verstehen'],
      ['paedagogik','Sozialpädagogik lernen','Fachbegriffe, Entwicklung und Praxis verknüpfen'],
      ['wissen','Allgemeinwissen lernen','Politik, Geschichte und Gesellschaft sortieren']
    ] : [
      ['simulation','Simulation','Prüfungsnaher Mix'],
      ['mathe','Mathe','Kopfrechnen & Textaufgaben'],
      ['logik','Logik','Muster, Reihen, Aussagen'],
      ['konzentration','Konzentration','Fehlerblick & Tempo'],
      ['it','IT / FISI','EDV, Hardware, Netzwerk'],
      ['kaufmRechnen','Kaufmännisch','Rechnen, Skonto, Verwaltung'],
      ['paedagogik','Sozialpädagogik','Fachwissen & Praxis'],
      ['deutsch','Deutsch','Satzergänzung & Sprache'],
      ['wissen','Allgemeinwissen','Politik, Geschichte, Welt']
    ];
    el.innerHTML =
      '<div class="ui-panel ui-foundation-targets" data-ui-target-mode="' + esc(mode) + '">' +
        '<div class="ui-target-head">' +
          '<div>' +
            '<h2>' + (isLearn ? 'Lernmodus' : 'Üben') + '</h2>' +
            '<p>' + (isLearn ? 'Strukturierter Lernaufbau. Erst verstehen, dann trainieren.' : 'Aufgaben lösen. Direkt in fachlich passende Module einsteigen.') + '</p>' +
          '</div>' +
          '<div class="ui-target-switch" role="group" aria-label="Zielmodus wechseln">' +
            '<button type="button" class="' + (!isLearn ? 'is-active ' : '') + 'ui-target-switch-btn" data-ui-action="practice">Üben</button>' +
            '<button type="button" class="' + (isLearn ? 'is-active ' : '') + 'ui-target-switch-btn" data-ui-action="learn">Lernmodus</button>' +
          '</div>' +
        '</div>' +
        '<div class="ui-action-card-grid">' +
          items.map(function(it){
            return '<button type="button" class="ui-action-card" data-ui-action="open-module" data-module="' + esc(it[0]) + '">' +
              '<b>' + esc(it[1]) + '</b><small>' + esc(it[2]) + '</small>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderCoachTab (el) {
    var rs = resultStats();
    el.innerHTML =
      '<div class="ui-panel">' +
        '<h2>Coach</h2>' +
        '<p>Dein Coach arbeitet mit deinen gespeicherten Ergebnissen. Öffne den Coach oder starte direkt eine empfohlene Einheit.</p>' +
        '<div class="ui-actions">' +
          '<button type="button" data-ui-action="coach">Coach öffnen</button>' +
          '<button type="button" data-ui-action="start-training">Training starten</button>' +
          '<button type="button" data-ui-action="analysis">Analyse öffnen</button>' +
        '</div>' +
        '<p style="margin-top:18px">Gespeicherte Läufe: <b>' + rs.runs + '</b> · Durchschnitt: <b>' + rs.percent + '%</b> · Bestwert: <b>' + rs.best + '%</b></p>' +
      '</div>';
  }

  /* ── Rangliste Tab ────────────────────────────────── */
  function renderHighscoreTab (el) {
    // cloudHighscoreCard einbetten – HighscoreLiveRenderer erkennt es automatisch
    el.innerHTML =
      '<div class="ui-analysis-wrap">' +
        '<div class="ui-section-title">🏆 Rangliste</div>' +
        '<div id="cloudHighscoreCard" class="ui-highscore-card"></div>' +
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
      card.innerHTML = '<div class="ui-info-row"><span>Noch keine Ergebnisse vorhanden. Absolviere einen Test!</span></div>';
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
      '<div class="ui-analysis-wrap">' +
        '<div class="ui-section-title">Profil &amp; Name</div>' +
        '<div class="ui-profile-edit">' +
          '<div class="ui-input-group">' +
            '<input id="profileEditNameInput" class="ui-input" type="text" maxlength="32" value="' + esc(currentName) + '" placeholder="Dein Name für Cloud Highscore" autocomplete="name" enterkeyhint="done">' +
            '<button class="ui-btn-primary" id="uiSaveProfileBtn">Speichern</button>' +
          '</div>' +
          '<div id="profileSaveState" class="ui-save-state"></div>' +
        '</div>' +

        '<div class="ui-section-title">Fachrichtung (Branche)</div>' +
        '<div class="ui-branch-changer">' +
          '<div class="ui-info-row"><span>Ausgewählte Fachrichtung</span><strong>' + esc(currentBranchLabel) + '</strong></div>' +
          '<div class="ui-branch-buttons">' +
            BRANCHES.map(function (b) {
              var isSel = b.id === currentBranch ? ' is-active' : '';
              return '<button type="button" class="ui-branch-btn' + isSel + '" data-ui-action="set-branch" data-branch="' + b.id + '">' + b.icon + ' ' + b.label + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="ui-section-title">Statistiken</div>' +
        '<div class="ui-info-row"><span>Trainingsläufe</span><strong>' + rs.runs + '</strong></div>' +
        '<div class="ui-info-row"><span>Ø Trefferquote</span><strong>' + rs.percent + '%</strong></div>' +
        '<div class="ui-info-row"><span>Bestwert</span><strong>' + rs.best + '%</strong></div>' +

        '<div class="ui-section-title">System &amp; Aktionen</div>' +
        '<div class="ui-system-btns">' +
          '<button type="button" class="ui-sys-btn" data-ui-action="feedback" id="uiBtnFeedback">💬 Feedback geben</button>' +
          '<button type="button" class="ui-sys-btn" data-ui-action="analysis" id="uiBtnAnalysis">Detailanalyse öffnen</button>' +
          '<button type="button" class="ui-sys-btn" data-ui-action="scan" id="uiBtnScan">QR-Code Scanner</button>' +
          '<button type="button" class="ui-sys-btn" data-ui-action="backup" id="uiBtnBackup">Backup exportieren</button>' +
          '<button type="button" class="ui-sys-btn" data-ui-action="clear-cache" id="uiBtnCache">Cache löschen</button>' +
          '<button type="button" class="ui-sys-btn ui-danger-btn" data-ui-action="clear-progress" id="uiBtnClear">Fortschritt zurücksetzen</button>' +
        '</div>' +
        '' +
      '</div>';

    var saveBtn = $('uiSaveProfileBtn');
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

    Array.prototype.forEach.call(el.querySelectorAll('.ui-branch-btn'), function (btn) {
      btn.addEventListener('click', function () {
        var branchId = btn.getAttribute('data-branch');
        localStorage.setItem('bps_branch', branchId);
        notice('Fachrichtung gewechselt zu ' + btn.textContent);
        renderSystemTab(el);
        renderGrid();
        updateTopBar();
      });
    });

    var btnFeedback = $('uiBtnFeedback');
    if (btnFeedback) {
      btnFeedback.addEventListener('click', function () {
        if (window.AppFeedback && typeof AppFeedback.openGeneralFeedbackSheet === 'function') {
          AppFeedback.openGeneralFeedbackSheet();
        }
      });
    }

    var btnAnalysis = $('uiBtnAnalysis');
    if (btnAnalysis) btnAnalysis.addEventListener('click', function () {
      try {
        if (window.App && typeof App.showAnalysis === 'function') {
          App.showAnalysis();
        } else {
          notice('Analyse nicht verfügbar.');
        }
      } catch (e) { notice('Fehler beim Öffnen.'); }
    });
    var btnScan = $('uiBtnScan');
    if (btnScan) btnScan.addEventListener('click', function () {
      if (!localStorage.getItem('egt_active_learner') && !(window.EGTAdminPortal && typeof EGTAdminPortal.isAdminOpen === 'function' && EGTAdminPortal.isAdminOpen())) { notice('Bitte zuerst einloggen'); return; }
      try { scanQRCode(); } catch (e) { notice('Scanner-Fehler'); }
    });

    var btnBackup = $('uiBtnBackup');
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

    var btnCache = $('uiBtnCache');
    if (btnCache) btnCache.addEventListener('click', function () {
      clearCaches().then(function () { notice('Cache gelöscht.'); });
    });

    var btnClear = $('uiBtnClear');
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

  /* ── OCR Scanner ·  Vorschau zuerst ───── */
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
        '<div class="ui-scan-alert ui-scan-alert-error">' +
          '<b>Tesseract konnte nicht geladen werden.</b><br>' +
          'Die OCR-Erkennung benötigt aktuell eine Internetverbindung, weil die Bibliothek extern geladen wird.' +
        '</div>' +
        '<div class="ui-scan-actions">' +
          '<button class="ui-btn-primary" id="uiScanLoadRetry">Erneut versuchen</button>' +
          '<button class="ui-btn-info" id="uiScanManualEmpty">Manuell erfassen</button>' +
        '</div>'
      );
      var retry = $('uiScanLoadRetry');
      if (retry) retry.addEventListener('click', function () { closeSheet(); scanQRCode(); });
      var manual = $('uiScanManualEmpty');
      if (manual) manual.addEventListener('click', function () {
        showScanReviewSheet({ fileName: 'manuelle-eingabe', imageSrc: '', text: '', confidence: 0, imageAnalysis: null });
      });
    };
    document.body.appendChild(script);
  }

  function showScanSheet (state, content) {
    var backdrop = $('uiSheetBackdrop');
    var sheet    = $('uiSheet');
    if (!backdrop || !sheet) return;
    var kicker = 'Vorschau prüfen';
    if (state === 'loading') kicker = 'Wird erkannt…';
    if (state === 'result') kicker = 'Ergebnis prüfen';
    if (state === 'review') kicker = 'Aufgabe vorbereiten';
    if (state === 'error') kicker = 'Fehler';
    sheet.innerHTML =
      '<div class="ui-sheet-handle"></div>' +
      '<div class="ui-sheet-header">' +
        '<div class="ui-sheet-icon c-slate">📷</div>' +
        '<div class="ui-sheet-info">' +
          '<div class="ui-sheet-name">OCR Scanner</div>' +
          '<div class="ui-sheet-kicker">' + kicker + '</div>' +
        '</div>' +
        '<button class="ui-sheet-close" id="uiScanClose" aria-label="Schließen">✕</button>' +
      '</div>' +
      '<div class="ui-sheet-sep"></div>' +
      '<div class="ui-sheet-body" id="uiScanBody">' + content + '</div>';
    backdrop.classList.add('show','is-visible');
    sheet.offsetHeight;
    sheet.classList.add('show','is-visible');
    try { document.documentElement.classList.add('egt-layer-open','ui-overlay-open'); document.body.classList.add('egt-layer-open','egt-ui-layer-active','ui-overlay-open'); } catch(e) {}
    var closeBtn = $('uiScanClose');
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    backdrop.onclick = function (e) { if (e.target === backdrop) closeSheet(); };
  }

  function injectScanStyles () {
    if ($('uiScanStyles')) return;
    var st = document.createElement('style');
    st.id = 'uiScanStyles';
    st.textContent =
      '.ui-scan-spinner{width:22px;height:22px;border:3px solid rgba(128,128,128,.25);' +
      'border-top-color:#6c63ff;border-radius:50%;animation:ui-spin .7s linear infinite;flex-shrink:0}' +
      '@keyframes ui-spin{to{transform:rotate(360deg)}}' +
      '.ui-scan-preview{max-width:100%;max-height:180px;border-radius:14px;object-fit:contain;display:block;margin:0 auto 14px;border:1px solid rgba(127,127,127,.16);background:rgba(127,127,127,.08)}' +
      '.ui-scan-conf{font-size:12px;color:var(--ui-fg2,#888);margin-bottom:8px}' +
      '.ui-scan-quality{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;color:var(--ui-fg2,#888);margin:0 0 10px}' +
      '.ui-scan-badge{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 9px;background:rgba(127,127,127,.10);font-weight:700;color:var(--ui-fg,#111)}' +
      '.ui-scan-badge.warn{background:rgba(245,158,11,.16);color:#b45309}.ui-scan-badge.ok{background:rgba(16,185,129,.15);color:#047857}.ui-scan-badge.bad{background:rgba(239,68,68,.14);color:#b91c1c}' +
      '.ui-scan-textbox{background:var(--ui-card,#1c1c1e);border-radius:14px;padding:14px;' +
      'font-size:14px;line-height:1.65;white-space:pre-wrap;word-break:break-word;' +
      'max-height:220px;overflow-y:auto;margin-bottom:14px;border:1px solid rgba(127,127,127,.16)}' +
      '.ui-scan-edit{width:100%;min-height:180px;max-height:260px;resize:vertical;border:1px solid rgba(127,127,127,.16);border-radius:14px;padding:14px;background:var(--ui-card,#1c1c1e);color:var(--ui-fg,#fff);font-size:14px;line-height:1.55;outline:none;margin-bottom:12px}' +
      '.ui-scan-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;width:100%}' +
      '.ui-scan-actions button{height:46px;border-radius:14px;font-size:14px;font-weight:700;border:0;' +
      'cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 16px;' +
      'transition:transform .15s ease,background .15s ease;-webkit-tap-highlight-color:transparent;flex:1 1 auto}' +
      '.ui-scan-actions .ui-btn-primary{background:var(--ui-accent,#007aff);color:#fff;' +
      'box-shadow:0 4px 12px rgba(0,122,255,.2);flex:2 1 auto}' +
      '.ui-scan-actions .ui-btn-info{width:auto !important;background:var(--ui-fill,rgba(120,120,128,.12));color:var(--ui-sub,#6c6c70)}' +
      '.ui-scan-actions button:active{transform:scale(.96)}' +
      '.ui-scan-alert{border-radius:14px;padding:12px 13px;margin:0 0 12px;font-size:13px;line-height:1.45;border:1px solid rgba(127,127,127,.16);background:rgba(127,127,127,.08);color:var(--ui-fg2,#888)}' +
      '.ui-scan-alert b{color:var(--ui-fg,#111)}.ui-scan-alert-warn{background:rgba(245,158,11,.14);border-color:rgba(245,158,11,.28);color:#92400e}.ui-scan-alert-error{background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.25);color:#b91c1c}.ui-scan-alert-ok{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.24);color:#047857}' +
      '.ui-scan-form{display:grid;gap:10px}.ui-scan-field label{display:block;font-size:12px;font-weight:800;color:var(--ui-fg2,#888);margin:0 0 6px}.ui-scan-field input,.ui-scan-field select,.ui-scan-field textarea{width:100%;border:1px solid rgba(127,127,127,.16);border-radius:13px;padding:11px 12px;background:var(--ui-card,#1c1c1e);color:var(--ui-fg,#fff);outline:none}.ui-scan-field textarea{min-height:96px;resize:vertical;line-height:1.45}' +
      '.ui-scan-mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:420px){.ui-scan-mini-grid{grid-template-columns:1fr}}';
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
      '<div class="ui-scan-quality">' +
        '<span class="ui-scan-badge ' + q.cls + '">' + q.label + '</span>' +
        '<span>OCR: ' + (Number(confidence) || 0) + '%</span>' +
      '</div>' +
      '<div class="ui-scan-alert ' + (q.cls === 'ok' ? 'ui-scan-alert-ok' : q.cls === 'bad' ? 'ui-scan-alert-error' : 'ui-scan-alert-warn') + '">' +
        q.note +
      '</div>' +
      '<div class="ui-scan-alert ui-scan-alert-warn">' +
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
      '<div class="ui-scan-alert">' +
        '<b>Aufgabe vorbereiten:</b> Hier wird noch nichts in den Fragenpool importiert. Prüfe und korrigiere alles manuell. Erst mit „Als Entwurf speichern“ wird lokal ein Entwurf abgelegt.' +
      '</div>' +
      '<div class="ui-scan-form">' +
        '<div class="ui-scan-mini-grid">' +
          '<div class="ui-scan-field"><label>Aufgabentyp</label><select id="uiScanType">' +
            '<option value="textaufgabe"' + (draft.type === 'textaufgabe' ? ' selected' : '') + '>Textaufgabe</option>' +
            '<option value="multiple-choice"' + (draft.type === 'multiple-choice' ? ' selected' : '') + '>Multiple Choice</option>' +
            '<option value="tabelle">Tabelle</option>' +
            '<option value="bild-formaufgabe"' + (draft.type === 'bild-formaufgabe' ? ' selected' : '') + '>Bild-/Formaufgabe</option>' +
            '<option value="logik-matrix">Logik / Matrix</option>' +
          '</select></div>' +
          '<div class="ui-scan-field"><label>Branche</label><select id="uiScanBranch">' + branchOptions + '</select></div>' +
        '</div>' +
        '<div class="ui-scan-mini-grid">' +
          '<div class="ui-scan-field"><label>Modul</label><input id="uiScanModule" value="' + esc(draft.module) + '" placeholder="z. B. Mathe, Deutsch, Logik"></div>' +
          '<div class="ui-scan-field"><label>Schwierigkeit</label><select id="uiScanDifficulty">' +
            '<option value="easy">Leicht</option><option value="medium" selected>Mittel</option><option value="hard">Schwer</option><option value="exam">Prüfungsniveau</option>' +
          '</select></div>' +
        '</div>' +
        '<div class="ui-scan-field"><label>Frage / Aufgabenstellung</label><textarea id="uiScanQuestion">' + esc(draft.question) + '</textarea></div>' +
        '<div class="ui-scan-field"><label>Antwortoptionen, falls vorhanden — eine pro Zeile</label><textarea id="uiScanOptions">' + esc(optionsText) + '</textarea></div>' +
        '<div class="ui-scan-mini-grid">' +
          '<div class="ui-scan-field"><label>Richtige Lösung</label><input id="uiScanAnswer" value="" placeholder="z. B. B oder 42"></div>' +
          '<div class="ui-scan-field"><label>Tags</label><input id="uiScanTags" value="" placeholder="z. B. Prozent, Textaufgabe"></div>' +
        '</div>' +
        '<div class="ui-scan-field"><label>Erklärung optional</label><textarea id="uiScanExplanation" placeholder="Kurzer Lösungsweg oder Hinweis"></textarea></div>' +
      '</div>' +
      '<div class="ui-scan-actions" style="margin-top:12px">' +
        '<button class="ui-btn-primary" id="uiScanSaveDraft">Als Entwurf speichern</button>' +
        '<button class="ui-btn-info" id="uiScanDraftJson">JSON kopieren</button>' +
        '<button class="ui-btn-info" id="uiScanBackPreview">Zurück zur Vorschau</button>' +
        '<button class="ui-btn-info" id="uiScanFresh">Neu scannen</button>' +
      '</div>'
    );

    function collectDraft () {
      var opts = ($('uiScanOptions') ? $('uiScanOptions').value : '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      return {
        id: 'scan-draft-' + Date.now(),
        createdAt: new Date().toISOString(),
        source: 'ocr-preview',
        appVersion: 'intern',
        type: $('uiScanType') ? $('uiScanType').value : 'textaufgabe',
        branch: $('uiScanBranch') ? $('uiScanBranch').value : '',
        module: $('uiScanModule') ? $('uiScanModule').value.trim() : '',
        difficulty: $('uiScanDifficulty') ? $('uiScanDifficulty').value : 'medium',
        question: $('uiScanQuestion') ? $('uiScanQuestion').value.trim() : '',
        options: opts,
        answer: $('uiScanAnswer') ? $('uiScanAnswer').value.trim() : '',
        explanation: $('uiScanExplanation') ? $('uiScanExplanation').value.trim() : '',
        tags: ($('uiScanTags') ? $('uiScanTags').value : '').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
        ocr: {
          confidence: payload.confidence || 0,
          rawText: payload.text || '',
          fileName: payload.fileName || '',
          imageAnalysis: payload.imageAnalysis || null
        }
      };
    }

    var save = $('uiScanSaveDraft');
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
    var jsonBtn = $('uiScanDraftJson');
    if (jsonBtn) jsonBtn.addEventListener('click', function () {
      fallbackCopy(JSON.stringify(collectDraft(), null, 2));
    });
    var back = $('uiScanBackPreview');
    if (back) back.addEventListener('click', function () { showScanResultSheet(payload); });
    var fresh = $('uiScanFresh');
    if (fresh) fresh.addEventListener('click', function () { closeSheet(); scanQRCode(); });
  }

  function showScanResultSheet (payload) {
    injectScanStyles();
    var safeText = payload.text || '';
    showScanSheet('result',
      (payload.imageSrc ? '<img src="' + payload.imageSrc + '" class="ui-scan-preview" alt="Scan-Vorschau">' : '') +
      scanNoticeHtml(payload.confidence, safeText, payload.imageAnalysis) +
      '<label style="display:block;font-size:12px;font-weight:800;color:var(--ui-fg2,#888);margin:0 0 7px">Erkannter Text — bitte vor dem Weitergehen prüfen/korrigieren</label>' +
      '<textarea id="uiScanResultText" class="ui-scan-edit" spellcheck="false">' + esc(safeText) + '</textarea>' +
      '<div class="ui-scan-actions">' +
        '<button class="ui-btn-primary" id="uiScanContinue">Weiter prüfen</button>' +
        '<button class="ui-btn-info" id="uiScanCopy">📋 Kopieren</button>' +
        '<button class="ui-btn-info" id="uiScanAgain">🔄 Neu scannen</button>' +
        '<button class="ui-btn-info" id="uiScanCancel">Abbrechen</button>' +
      '</div>'
    );
    var textEl = $('uiScanResultText');
    var continueBtn = $('uiScanContinue');
    if (continueBtn) continueBtn.addEventListener('click', function () {
      payload.text = textEl ? textEl.value.trim() : safeText;
      showScanReviewSheet(payload);
    });
    var copyBtn = $('uiScanCopy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      fallbackCopy(textEl ? textEl.value : safeText);
    });
    var againBtn = $('uiScanAgain');
    if (againBtn) againBtn.addEventListener('click', function () { closeSheet(); scanQRCode(); });
    var cancelBtn = $('uiScanCancel');
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
        showScanSheet('error', '<div class="ui-scan-alert ui-scan-alert-error">Bitte nur ein Bild auswählen.</div>');
        return;
      }

      fileToDataURL(file, function (readErr, imageSrc) {
        if (readErr || !imageSrc) {
          showScanSheet('error',
            '<div class="ui-scan-alert ui-scan-alert-error">Bild konnte nicht gelesen werden.</div>' +
            '<button class="ui-btn-primary" id="uiScanRetryRead">Erneut scannen</button>'
          );
          var rr = $('uiScanRetryRead');
          if (rr) rr.addEventListener('click', function () { closeSheet(); scanQRCode(); });
          return;
        }

        showScanSheet('loading',
          '<div style="text-align:center;padding:12px 0">' +
            '<img src="' + imageSrc + '" class="ui-scan-preview" alt="Vorschau">' +
            '<div class="ui-scan-alert">' +
              '<b>Hinweis:</b> Der Scanner erkennt vor allem klare Texte. Formen/Tabellen werden nur einfach eingeschätzt und müssen danach manuell geprüft werden.' +
            '</div>' +
            '<div style="display:flex;align-items:center;justify-content:center;gap:10px;color:var(--ui-fg2,#888)">' +
              '<div class="ui-scan-spinner"></div>' +
              '<span id="uiScanProgress">Text wird erkannt… 0%</span>' +
            '</div>' +
          '</div>'
        );

        analyzeImageForSimpleShapes(imageSrc, function (imageAnalysis) {
          loadTesseract(function () {
            Tesseract.recognize(imageSrc, 'deu+eng', {
              logger: function (m) {
                if (m.status === 'recognizing text') {
                  var pEl = $('uiScanProgress');
                  if (pEl) pEl.textContent = 'Text wird erkannt… ' + Math.round((m.progress || 0) * 100) + '%';
                }
              }
            }).then(function (result) {
              var text = result.data && result.data.text ? result.data.text.trim() : '';
              var conf = result.data && result.data.confidence != null ? Math.round(result.data.confidence) : 0;

              if (!text) {
                showScanSheet('error',
                  '<img src="' + imageSrc + '" class="ui-scan-preview" alt="Scan-Vorschau">' +
                  '<div class="ui-scan-alert ui-scan-alert-error">' +
                    '<b>Kein Text erkannt.</b><br>Bitte schärfer/heller fotografieren oder die Aufgabe manuell erfassen.' +
                  '</div>' +
                  '<div class="ui-scan-alert ui-scan-alert-warn">' +
                    '<b>Hinweis:</b> Komplexe Formen, Matrizen, Zahnräder oder technische Skizzen werden nicht sicher automatisch erkannt.' +
                  '</div>' +
                  '<div class="ui-scan-actions">' +
                    '<button class="ui-btn-primary" id="uiScanRetry">Erneut scannen</button>' +
                    '<button class="ui-btn-info" id="uiScanManual">Manuell erfassen</button>' +
                  '</div>'
                );
                var r = $('uiScanRetry');
                if (r) r.addEventListener('click', function () { closeSheet(); scanQRCode(); });
                var m = $('uiScanManual');
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
                '<img src="' + imageSrc + '" class="ui-scan-preview" alt="Scan-Vorschau">' +
                '<div class="ui-scan-alert ui-scan-alert-error">' +
                  '<b>Scan-Fehler:</b><br>' + esc(err && err.message ? err.message : 'Unbekannt') +
                '</div>' +
                '<div class="ui-scan-actions">' +
                  '<button class="ui-btn-primary" id="uiScanRetry2">Erneut versuchen</button>' +
                  '<button class="ui-btn-info" id="uiScanManual2">Manuell erfassen</button>' +
                '</div>'
              );
              var r2 = $('uiScanRetry2');
              if (r2) r2.addEventListener('click', function () { closeSheet(); scanQRCode(); });
              var m2 = $('uiScanManual2');
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

  /* ── Branch Selection Deep Sheet ──────────────────── */
  function openBranchSelectionSheet (allowClose) {
    var body =
      '<div class="ui-deep-section-label">Fachrichtung auswählen</div>' +
      '<div class="ui-deep-grid">' +
        BRANCHES.map(function (b) {
          return '<button type="button" class="ui-deep-card" data-ui-action="set-branch" data-branch="' + esc(b.id) + '">' +
            '<span class="ui-deep-card-icon">' + sheetIconHtml(b) + '</span>' +
            '<span class="ui-deep-card-copy"><b>' + esc(b.label) + '</b><small>Bereich aktivieren</small></span>' +
            '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' +
          '</button>';
        }).join('') +
      '</div>';
    return openDeepSheet({
      type: 'branch-selection',
      theme: 'blue',
      title: 'Fachrichtung wählen',
      kicker: allowClose ? 'Auswahl' : 'Pflichtauswahl',
      subtitle: 'Diese Auswahl steuert, welche Module und Empfehlungen im Training bevorzugt werden.',
      iconHtml: '◇',
      bodyHtml: body
    });
  }

  function moduleById (id) {
    for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i];
    return null;
  }

  /* UI-G5: all home doors route through js/ui-router.js. */



  function brandLogoMarkup () {
    return '<span class="ui-brand-logo" aria-hidden="true">' +
      '<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
      '<defs><linearGradient id="uiBrandBrainGradient" x1="12" y1="10" x2="86" y2="88" gradientUnits="userSpaceOnUse"><stop stop-color="#20D9FF"/><stop offset="0.5" stop-color="#2F80FF"/><stop offset="1" stop-color="#C13CFF"/></linearGradient></defs>' +
      '<path d="M35 14c-9 0-16 7-16 16v3c-7 2-12 8-12 16s5 14 12 16v1c0 9 7 16 16 16 5 0 10-3 13-7 3 4 8 7 13 7 9 0 16-7 16-16v-1c7-2 12-8 12-16s-5-14-12-16v-3c0-9-7-16-16-16-6 0-11 3-14 8-3-5-8-8-14-8Z" stroke="url(#uiBrandBrainGradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M47 22v53" stroke="url(#uiBrandBrainGradient)" stroke-width="5" stroke-linecap="round" opacity=".92"/>' +
      '<path d="M27 34h12M25 50h16M29 65h10M57 34h12M55 50h16M57 65h10" stroke="url(#uiBrandBrainGradient)" stroke-width="5" stroke-linecap="round" opacity=".88"/>' +
      '</svg></span>';
  }

  function buildShell () {
    var start = $('start') || document.querySelector('.app') || document.body;
    if (!start || $('uiShell')) return;

    // Notice at body level
    if (!$('uiNotice')) {
      var noticeEl = document.createElement('div');
      noticeEl.id = 'uiNotice';
      noticeEl.className = 'ui-notice';
      noticeEl.setAttribute('role', 'status');
      noticeEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(noticeEl);
    }

    // Sheet backdrop
    if (!$('uiSheetBackdrop')) {
      var bd = document.createElement('div');
      bd.id = 'uiSheetBackdrop';
      bd.className = 'ui-sheet-backdrop';
      document.body.appendChild(bd);
    }

    // Sheet panel
    if (!$('uiSheet')) {
      var sh = document.createElement('div');
      sh.id = 'uiSheet';
      sh.className = 'ui-sheet';
      sh.setAttribute('role', 'dialog');
      sh.setAttribute('aria-modal', 'true');
      document.body.appendChild(sh);
    }

    // Main shell
    var shell = document.createElement('div');
    shell.id = 'uiShell';
    shell.setAttribute('role', 'main');
    shell.innerHTML =
      '<div class="ui-home">' +
        '<header class="ui-header">' +
          '<div class="ui-brand">' +
            brandLogoMarkup() +
            '<div class="ui-brand-text">' +
              '<span class="ui-app-name">Eignungstest-Trainer</span>' +
              '<span class="ui-app-sub">Dein persönlicher Trainingsbereich</span>' +
            '</div>' +
          '</div>' +
          '<div class="ui-topbar-chips">' +
            '<button type="button" class="ui-branch-chip ui-hidden" id="uiBranchChip" aria-label="Fachrichtung wechseln" data-ui-action="branch-sheet">IT / FISI</button>' +
            '<button class="ui-login-btn" id="uiLoginBtn" aria-label="Login" data-ui-action="login">Login</button>' +
          '</div>' +
        '</header>' +

        '<main class="ui-home-scroll" id="uiHomeViewport">' +
          '<section class="ui-hero-ui" aria-label="Training starten">' +
            '<div class="ui-hero-copy">' +
              '<span class="ui-hero-pill">Bereit für deinen Erfolg?</span>' +
              '<h1 class="ui-hero-title">Trainiere smarter.<span>Bestehe sicher.</span></h1>' +
              '<p>Übungsaufgaben, Lösungen, Coach und Analysen für deinen Erfolg.</p>' +
              '<button class="ui-hero-cta" type="button" data-ui-action="start-training">Training starten 🚀</button>' +
            '</div>' +
            '<div class="ui-hero-visual" aria-hidden="true"><picture><source media="(hover: none) and (pointer: coarse)" srcset="./assets/ui/hero-target-ios.svg"><img class="ui-hero-target" src="./assets/ui/hero-target.svg" alt=""></picture></div>' +
          '</section>' +

          '<section class="ui-section-title-block">' +
            '<h2>Trainingsbereich wählen</h2>' +
            '<p>Wähle deinen Bereich und starte dein individuelles Training.</p>' +
          '</section>' +
          '<section class="ui-training-area-grid" aria-label="Trainingsbereich wählen">' +
            '<button type="button" class="ui-training-area-card ui-area-it" data-ui-action="branch-menu" data-branch="it" data-module="it">' +
              '<span class="ui-area-icon"><img src="./assets/ui/icon-it.svg" alt=""></span><b>IT / FISI</b><small>Informatik & Fachinformatik</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-social" data-ui-action="branch-menu" data-branch="sozial" data-module="paedagogik">' +
              '<span class="ui-area-icon"><img src="./assets/ui/icon-social.svg" alt=""></span><b>Sozialpädagogik</b><small>Erzieher*in & Sozialpädagogik</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-kaufm" data-ui-action="branch-menu" data-branch="kaufm" data-module="kaufmRechnen">' +
              '<span class="ui-area-icon"><picture><source media="(hover: none) and (pointer: coarse)" srcset="./assets/ui/icon-kaufm-ios.svg"><img src="./assets/ui/icon-kaufm.svg" alt=""></picture></span><b>Kaufmännisch</b><small>Büro, Verwaltung & Rechnen</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-knowledge" data-ui-action="branch-menu" data-branch="wissen" data-module="wissen">' +
              '<span class="ui-area-icon"><img src="./assets/ui/icon-knowledge.svg" alt=""></span><b>Allgemeinwissen</b><small>Wissen testen & erweitern</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-individual" data-ui-action="coach">' +
              '<span class="ui-area-icon"><img src="./assets/ui/icon-individual.svg" alt=""></span><b>Individuell</b><small>Eigene Stärken trainieren</small>' +
            '</button>' +
          '</section>' +

          '<section class="ui-section-title-block">' +
            '<h2>Schnellzugriff</h2>' +
          '</section>' +
          '<section class="ui-quick-grid" aria-label="Schnellzugriff">' +
            '<button type="button" class="ui-quick-card ui-area-it" data-ui-action="practice"><span class="ui-quick-icon"><img src="./assets/ui/icon-practice.svg" alt=""></span><b>Üben</b><small>Aufgaben lösen</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-social" data-ui-action="learn"><span class="ui-quick-icon"><img src="./assets/ui/icon-learn.svg" alt=""></span><b>Lernmodus</b><small>Strukturiert lernen</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-knowledge" data-ui-action="coach"><span class="ui-quick-icon"><img src="./assets/ui/icon-coach.svg" alt=""></span><b>Coach</b><small>Dein KI-Coach</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-individual" data-ui-action="analysis"><span class="ui-quick-icon"><img src="./assets/ui/icon-analysis.svg" alt=""></span><b>Analyse</b><small>Fortschritt prüfen</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-social" data-ui-action="progress"><span class="ui-quick-icon"><img src="./assets/ui/icon-progress.svg" alt=""></span><b>Fortschritt</b><small>Deine Erfolge</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-it" data-ui-action="settings"><span class="ui-quick-icon"><img src="./assets/ui/icon-settings.svg" alt=""></span><b>Einstellungen</b><small>Anpassen</small></button>' +
          '</section>' +

          '<section class="ui-banner">' +
            '<div class="ui-banner-left"><div class="ui-gem">◇</div><div><b>UI-Vorteile nutzen</b><span>Mehr Funktionen, mehr Erfolg.</span></div></div>' +
            '<button class="ui-btn" type="button" data-ui-action="feedback">Mehr erfahren ›</button>' +
          '</section>' +

          '<div class="ui-grid-wrap ui-runtime-grid-holder" id="uiModuleGridWrap" hidden><div class="ui-grid" id="uiModuleGrid" role="grid" aria-label="Trainingsmodule"></div><div class="ui-home-feedback-wrap"><button class="ui-home-feedback-btn" id="uiHomeFeedbackBtn">💬 App bewerten / Feedback</button></div></div>' +
        '</main>' +

        '<div class="ui-tab-content" id="uiTabContent" style="display:none"></div>' +
        '<nav class="egt-bottom-dock" id="egtBottomDock" aria-label="Navigation" role="tablist">' +
        '<button type="button" class="egt-dock-btn is-active" data-ui-nav="tab" data-tab="0" role="tab"><span class="egt-dock-icon">' + navIcon('dashboard') + '</span><span class="egt-dock-label">Dashboard</span></button>' +
        '<button type="button" class="egt-dock-btn" data-ui-nav="tab" data-tab="1" role="tab"><span class="egt-dock-icon">' + navIcon('practice') + '</span><span class="egt-dock-label">Üben</span></button>' +
        '<button type="button" class="egt-dock-btn" data-ui-nav="tab" data-tab="2" role="tab"><span class="egt-dock-icon">' + navIcon('progress') + '</span><span class="egt-dock-label">Fortschritt</span></button>' +
        '<button type="button" class="egt-dock-btn" data-ui-nav="tab" data-tab="3" role="tab"><span class="egt-dock-icon">' + navIcon('coach') + '</span><span class="egt-dock-label">Coach</span></button>' +
        '<button type="button" class="egt-dock-btn" data-ui-nav="tab" data-tab="4" role="tab"><span class="egt-dock-icon">' + navIcon('more') + '</span><span class="egt-dock-label">Mehr</span></button>' +
        '</nav>' +
      '</div>';

    start.insertBefore(shell, start.firstChild);
    hideRuntimeAnchors(shell);
    document.body.classList.add('ui-f-ui-home-ready');
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(e) {}
    try {
      window.scrollTo(0, 0);
      var homeScroll = document.getElementById('uiHomeViewport');
      if (homeScroll) homeScroll.scrollTop = 0;
    } catch(e) {}
    // UI-G13: UI-Startseiten-Aktionen werden zentral über js/ui-router.js verarbeitet.

    // Wire branch chip
    var branchChip = $('uiBranchChip');
    if (branchChip) {
      branchChip.addEventListener('click', function () {
        openBranchSelectionSheet(true);
      });
      var loginBtn = $('uiLoginBtn');
      if (loginBtn) {
        window.updateLoginBtnState = function () {
          var isAdmin = !!(window.EGTAdminPortal && typeof EGTAdminPortal.isAdminOpen === 'function' && EGTAdminPortal.isAdminOpen());
          var activeLearner = localStorage.getItem('egt_active_learner');
          
          if (isAdmin) {
            loginBtn.textContent = '✓ Admin';
            loginBtn.classList.add('is-admin');
            loginBtn.style.opacity = '0.85';
          } else if (activeLearner) {
            var displayName = activeLearner;
            try {
              var all = JSON.parse(localStorage.getItem('egt_global_learner_profiles') || '{}');
              var profile = all[activeLearner.toUpperCase()];
              if (profile && (profile.displayName || profile.alias)) {
                displayName = profile.displayName || profile.alias;
              }
            } catch(e){}
            loginBtn.textContent = '✓ ' + displayName;
            loginBtn.classList.remove('is-admin');
            loginBtn.style.opacity = '0.85';
          } else {
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('is-admin');
            loginBtn.style.opacity = '';
          }
        };

        window.updateLoginBtnState();

        // Listen to events from the Eignungstest-Trainer portal
        window.addEventListener('egt:learner-login', function () {
          if (window.updateLoginBtnState) window.updateLoginBtnState();
          renderGrid();
          renderTabContent();
        });
        window.addEventListener('egt:admin-login', function () {
          if (window.updateLoginBtnState) window.updateLoginBtnState();
          renderGrid();
          renderTabContent();
        });
        window.addEventListener('egt:learner-logout', function () {
          if (window.updateLoginBtnState) window.updateLoginBtnState();
          renderGrid();
          renderTabContent();
        });
        window.addEventListener('egt:password-changed', function () {
          if (window.updateLoginBtnState) window.updateLoginBtnState();
          renderGrid();
          renderTabContent();
        });
      }
    }

    // Render all parts
    renderGrid();
    renderTabBar();
    updateTopBar();
    watchQuizScreens();

    // Wire home feedback button
    var homeFbBtn = $('uiHomeFeedbackBtn');
    if (homeFbBtn) {
      homeFbBtn.addEventListener('click', function () {
        if (window.AppFeedback && typeof AppFeedback.openGeneralFeedbackSheet === 'function') {
          AppFeedback.openGeneralFeedbackSheet();
        }
      });
    }

    // Default branch without intrusive overlay. Fachbereiche sind jetzt direkt im Dashboard sichtbar.
    var currentBranch = localStorage.getItem('bps_branch') || '';
    if (!currentBranch) {
      localStorage.setItem('bps_branch', 'it');
      updateTopBar();
    }

    // Progressive refresh
    var ticks = 0;
    var poll = setInterval(function () {
      updateTopBar();
      ticks++;
      if (ticks > 20) clearInterval(poll);
    }, 350);

    setTimeout(function () { if (!window.matchMedia || !window.matchMedia('(max-width: 780px)').matches) notice('Eignungstest-Trainer bereit. Viel Erfolg! 🎯'); }, 600);
  }

  /* ── Boot ─────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildShell);
  } else {
    buildShell();
  }

  /* ── Public API ───────────────────────────────────── */
  window.EGTUILayer = {
    version: VERSION,
    notice: notice,
    refresh: function () { updateTopBar(); renderGrid(); },
    switchTab: switchTab,
    openPracticeMode: function (mode) { return openPracticeDeepSheet((mode === 'learn') ? 'learn' : 'practice'); },
    openDeepSheet: openDeepSheet,
    openSheet: openSheet,
    openBranchMenu: openBranchMenu,
    openActionMenu: function (kind) {
      if (kind === 'practice') return openPracticeDeepSheet('practice');
      if (kind === 'learn') return openPracticeDeepSheet('learn');
      if (kind === 'coach') return openCoachDeepSheet();
      if (kind === 'analysis') return openAnalysisDeepSheet();
      if (kind === 'progress') return openProgressDeepSheet();
      if (kind === 'settings') return openSettingsDeepSheet();
      if (kind === 'login') return openLoginDeepSheet();
      if (kind === 'feedback') return openFeedbackDeepSheet();
      if (kind === 'scan') return openScanDeepSheet();
      if (kind === 'python') return openPythonQuestDeepSheet();
      return false;
    },
    closeSheet: closeSheet,
    startModule: startModule,
    moduleById: moduleById,
    scan: scanQRCode,
    setBranch: function (branchId) { if (!branchId) return; localStorage.setItem('bps_branch', branchId); updateTopBar(); renderGrid(); if (activeTab === TAB_MORE) { var c = $('uiTabContent'); if (c) renderSystemTab(c); } },
    clearCaches: clearCaches,
    modules: MODULES,
    branchContent: BRANCH_CONTENT,
    openBranchSelection: function (allowClose) { openBranchSelectionSheet(allowClose); }
  };

  try { window.EGTUIHomeLayer = window.EGTUILayer; } catch(e) {}
})();
