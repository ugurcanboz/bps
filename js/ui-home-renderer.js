/* Eignungstest-Trainer · UI Home Renderer
   Rendert Startseite, Schnellzugriff und Modul-Sheets. Styling liegt zentral in ui-foundation.css. */
(function () {
  'use strict';

  var VERSION = 'G54.39C.2-svg-dashboard-qa-rest-emoji-cleanup';

  /* ── Tabs ─────────────────────────────────────────── */
  var TAB_HOME      = 0;
  var TAB_HIGHSCORE = 1;
  var TAB_SIM       = 2;
  var TAB_DUELS     = 3;
  var TAB_PROFILE   = 4;
  var activeTab     = TAB_HOME;
  var activePracticeMode = 'practice';

  /* ── Active sheet state ───────────────────────────── */
  var activeSheet = null;

  /* ── Branches ─────────────────────────────────────── */
  var BRANCHES = [
    { id: 'it',        label: 'IT / FISI',                  iconName: 'it' },
    { id: 'kaufm',     label: 'Kaufmännisch / Verwaltung',   iconName: 'kaufm' },
    { id: 'sozial',    label: 'Sozialpädagogik',            iconName: 'social' }
  ];


  /* ── Unified SVG Icon System ─────────────────────── */
  var ICON_PATHS = {
    target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>',
    dashboard: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10.5V20h11v-9.5"/><path d="M10 20v-5h4v5"/>',
    practice: '<path d="M5 19h14"/><path d="M7 16.5 16.8 6.7a2.1 2.1 0 0 1 3 3L10 19H7v-2.5Z"/><path d="M14.8 8.7l2.5 2.5"/>',
    progress: '<path d="M5 20V9"/><path d="M12 20V4"/><path d="M19 20v-7"/><path d="M3.8 20h16.4"/>',
    coach: '<path d="M12 3.8v3.4"/><path d="M12 16.8v3.4"/><path d="M3.8 12h3.4"/><path d="M16.8 12h3.4"/><path d="m6.9 6.9 2.4 2.4"/><path d="m14.7 14.7 2.4 2.4"/><path d="m17.1 6.9-2.4 2.4"/><path d="m9.3 14.7-2.4 2.4"/><circle cx="12" cy="12" r="2.3"/>',
    more: '<circle cx="6.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17.5" cy="12" r="1.5"/>',
    it: '<rect x="4" y="5" width="16" height="10" rx="2"/><path d="M8 19h8"/><path d="M10 15v4"/><path d="M14 15v4"/>',
    kaufm: '<path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7"/><path d="M4 9.2A2.2 2.2 0 0 1 6.2 7h11.6A2.2 2.2 0 0 1 20 9.2v8.6A2.2 2.2 0 0 1 17.8 20H6.2A2.2 2.2 0 0 1 4 17.8Z"/><path d="M4 12h16"/><path d="M10.5 12v2"/><path d="M13.5 12v2"/>',
    social: '<circle cx="8" cy="9" r="2.5"/><circle cx="16" cy="9" r="2.5"/><path d="M4.5 18a4 4 0 0 1 7 0"/><path d="M12.5 18a4 4 0 0 1 7 0"/><path d="M10 11.5h4"/>',
    knowledge: '<circle cx="12" cy="12" r="8"/><path d="M4.5 12h15"/><path d="M12 4a12 12 0 0 1 0 16"/><path d="M12 4a12 12 0 0 0 0 16"/>',
    language: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H15a2 2 0 0 1 2 2v9.5A2.5 2.5 0 0 1 14.5 18H10l-3.5 2v-2H6.5A2.5 2.5 0 0 1 4 15.5Z"/><path d="M17 7h2.5A2.5 2.5 0 0 1 22 9.5v4A2.5 2.5 0 0 1 19.5 16H18v2l-3-2"/>',
    individual: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M12 2v2"/><path d="M21 12h-2"/><path d="M5 12H3"/>',
    logic: '<path d="M8 6h3v3H8z"/><path d="M13 6h3v3h-3z"/><path d="M8 11h3v3H8z"/><path d="M13 11h3v3h-3z"/><path d="M7 19h10"/>',
    matrix: '<rect x="5" y="5" width="4" height="4" rx="1"/><rect x="10" y="5" width="4" height="4" rx="1"/><rect x="15" y="5" width="4" height="4" rx="1"/><rect x="5" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="15" y="10" width="4" height="4" rx="1"/><rect x="5" y="15" width="4" height="4" rx="1"/><rect x="10" y="15" width="4" height="4" rx="1"/><path d="M16 17h3"/><path d="M17.5 15.5v3"/>',
    math: '<path d="M7 6h10"/><path d="M12 6v12"/><path d="M7 12h10"/><path d="m7.5 18 3-3"/><path d="m7.5 15 3 3"/><path d="M16 15h3"/><path d="M16 18h3"/>',
    german: '<path d="M6 5h9a3 3 0 0 1 3 3v11l-4-2-4 2V8a3 3 0 0 0-3-3Z"/><path d="M6 5a3 3 0 0 0-3 3v11l4-2 4 2"/>',
    english: '<path d="M12 4a8 8 0 0 1 8 8"/><path d="M12 20a8 8 0 0 1-8-8"/><path d="M12 4a8 8 0 0 0-8 8"/><path d="M12 20a8 8 0 0 0 8-8"/><path d="M4 12h16"/><path d="M12 4v16"/>',
    network: '<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M8 12h5.5"/><path d="M8 11.2 15.8 7"/><path d="M8 12.8 15.8 17"/>',
    hardware: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v3"/><path d="M15 2v3"/><path d="M9 19v3"/><path d="M15 19v3"/><path d="M2 9h3"/><path d="M2 15h3"/><path d="M19 9h3"/><path d="M19 15h3"/>',
    focus: '<path d="M2.5 12s3.5-5.5 9.5-5.5S21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    calculator: '<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 8h6"/><path d="M9 12h2"/><path d="M13 12h2"/><path d="M9 15h2"/><path d="M13 15h2"/><path d="M9 18h2"/><path d="M13 18h2"/>',
    office: '<path d="M6 20V6.8A1.8 1.8 0 0 1 7.8 5H16a2 2 0 0 1 2 2v13"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/><path d="M4 20h16"/>',
    economy: '<path d="M5 18h14"/><path d="M7 15V9"/><path d="M12 15V6"/><path d="M17 15v-3"/><circle cx="18" cy="6" r="2"/>',
    document: '<path d="M8 4h6l4 4v12H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M14 4v4h4"/><path d="M9 12h6"/><path d="M9 16h6"/>',
    chat: '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H11l-4 3v-3h-.5A2.5 2.5 0 0 1 4 12.5Z"/><path d="M8 9h7"/><path d="M8 12h4"/>',
    education: '<path d="m4 9 8-4 8 4-8 4-8-4Z"/><path d="M7 11.5V15a12 12 0 0 0 10 0v-3.5"/><path d="M20 10v5"/>',
    sprout: '<path d="M12 21v-8"/><path d="M12 13c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6Z"/><path d="M12 13c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z"/>',
    cases: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M8 9h8"/><path d="M8 13h8"/><path d="M8 17h4"/>',
    shield: '<path d="M12 3 19 6v5c0 4.4-2.7 7.8-7 10-4.3-2.2-7-5.6-7-10V6l7-3Z"/><path d="m9.5 12 1.8 1.8 3.7-3.7"/>',
    clipboard: '<rect x="7" y="5" width="10" height="15" rx="2"/><path d="M9 5.5h6"/><path d="M10 3h4v4h-4z"/><path d="M10 11h4"/><path d="M10 15h4"/>',
    python: '<path d="M9 6h4a3 3 0 0 1 3 3v2H9a2 2 0 0 0-2 2v1"/><path d="M15 18h-4a3 3 0 0 1-3-3v-2h7a2 2 0 0 0 2-2v-1"/><circle cx="10.2" cy="8.7" r=".8" fill="currentColor" stroke="none"/><circle cx="13.8" cy="15.3" r=".8" fill="currentColor" stroke="none"/>',
    scan: '<path d="M7 3H5a2 2 0 0 0-2 2v2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M17 21h2a2 2 0 0 0 2-2v-2"/><path d="M8 12h8"/><path d="M8 9h8"/><path d="M8 15h5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2.5"/><path d="M12 19.5V22"/><path d="m4.9 4.9 1.8 1.8"/><path d="m17.3 17.3 1.8 1.8"/><path d="M2 12h2.5"/><path d="M19.5 12H22"/><path d="m4.9 19.1 1.8-1.8"/><path d="m17.3 6.7 1.8-1.8"/>',
    trophy: '<path d="M8 4h8v3a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a3 3 0 0 0 3 4"/><path d="M16 6h3a3 3 0 0 1-3 4"/><path d="M12 11v5"/><path d="M9 20h6"/><path d="M10 16h4"/>',
    duel: '<path d="M14 4l6 6"/><path d="m15 9-7 7-3 1 1-3 7-7"/><path d="M10 4l10 10"/><path d="M4 20l6-6"/>',
    admin: '<path d="M4 7h16"/><path d="M7 4v6"/><path d="M17 4v6"/><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 13h3"/><path d="M13 13h3"/><path d="M8 17h8"/>',
    feedback: '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H9l-4 4v-4h-.5A2.5 2.5 0 0 1 2 13.5Z"/><path d="m9 9 3 3 3-3"/>'
  };

  var ICON_NAME_MAP = {
    simulation: 'target', logik: 'logic', matrizen: 'matrix', mathe: 'math', deutsch: 'german', wissen: 'knowledge', englisch: 'english',
    it: 'it', netzwerk: 'network', hardware_os: 'hardware', konzentration: 'focus', kaufmRechnen: 'calculator', bueroWissen: 'office',
    wirtschaft: 'economy', din5008: 'document', kommunikation: 'chat', paedagogik: 'education', entwicklung_bindung: 'sprout',
    situationen: 'cases', kommunikation_sozial: 'chat', recht_sozial: 'shield', doku_beobachtung: 'clipboard', python_quest: 'python',
    kaufm: 'kaufm', sozial: 'social', knowledge: 'knowledge', analyse_card: 'progress', scan_card: 'scan', coach_card: 'coach',
    analysis: 'progress', coach: 'coach', language: 'language', individual: 'individual', more: 'more', practice: 'practice'
  };

  function resolveIconName(source) {
    if (!source) return '';
    if (typeof source === 'string') return ICON_NAME_MAP[source] || source;
    return source.iconName || ICON_NAME_MAP[source.id] || '';
  }

  function iconSvg(name, className) {
    var iconName = resolveIconName(name) || 'more';
    var body = ICON_PATHS[iconName] || ICON_PATHS.more;
    var cls = className || 'ui-svg-icon';
    return '<svg class="' + esc(cls) + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + body + '</g></svg>';
  }

  function resolveIconMarkup(icon) {
    if (!icon) return iconSvg('more');
    if (typeof icon === 'string' && icon.indexOf('<') >= 0) return icon;
    var iconName = resolveIconName(icon);
    if (iconName && ICON_PATHS[iconName]) return iconSvg(iconName);
    return esc(icon || '');
  }

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
      id: 'simulation', label: 'Simulation', iconName: 'target', iconClass: 'c-indigo',
      kicker: 'Prüfungsnah', title: 'Eignungstest Simulation',
      desc: 'Prüfungsnaher Mix mit Zeitdruck. <strong>Sichere Punkte zuerst holen</strong> und Blöcke ruhig abarbeiten.',
      tags: ['Eignungstest', 'Zeitdruck', 'Mix'],
      modes: ['ctcBosch', 'simulation', 'eignungstest', 'bps', 'ctcLohr'], startLabel: 'Simulation starten',
      branches: ['it','kaufm','sozial','wissen']
    },
    {
      id: 'logik', label: 'Logik', iconName: 'logic', iconClass: 'c-teal',
      kicker: 'Denken', title: 'Logik & Muster',
      desc: 'Zahlenreihen, Muster und Schlussfolgerungen. <strong>Regel erkennen</strong>, nicht grübeln.',
      tags: ['Zahlenreihen', 'Muster', 'Tempo'], modes: ['logic', 'logischesDenken', 'zahlenreihen', 'cognitive', 'logicSprint'], startLabel: 'Logik starten',
      branches: ['it','kaufm','wissen']
    },
    {
      id: 'matrizen', label: 'Matrizen', iconName: 'matrix', iconClass: 'c-violet',
      kicker: 'Visuell', title: 'Matrizen & Mustersehen',
      desc: 'Visuelle Beziehungen, Reihen und Spalten. <strong>Strukturen sauber erkennen</strong>.',
      tags: ['Matrizen', 'Rotation', 'Reihenlogik'], modes: ['matrixTraining', 'matrices', 'matrix', 'matrizen', 'matrixOnlySprint'], startLabel: 'Matrizen starten',
      branches: ['it','wissen']
    },
    {
      id: 'mathe', label: 'Mathe', iconName: 'math', iconClass: 'c-orange',
      kicker: 'Rechnen', title: 'Mathe & Textaufgaben',
      desc: 'Prozent, Dreisatz, Kopfrechnen und Textaufgaben. <strong>Schnell und sicher</strong> rechnen.',
      tags: ['Prozent', 'Dreisatz', 'Kopfrechnen'], modes: ['math', 'mathe', 'textMath', 'kopfrechnen', 'mathSprint'], startLabel: 'Mathe starten',
      branches: ['it','kaufm','wissen']
    },
    {
      id: 'deutsch', label: 'Deutsch', iconName: 'german', iconClass: 'c-blue',
      kicker: 'Sprache', title: 'Deutsch & Textverständnis',
      desc: 'Satzergänzung, Wortlogik, Grammatik und Textverständnis. <strong>Genau lesen</strong> und sauber entscheiden.',
      tags: ['Satzergänzung', 'Text', 'Sprache'], modes: ['sentenceCompletion', 'satzergänzung', 'deutsch', 'german', 'sentenceSprint'], startLabel: 'Deutsch starten',
      branches: ['kaufm','sozial','wissen','it']
    },
    {
      id: 'wissen', label: 'Wissen', iconName: 'knowledge', iconClass: 'c-green',
      kicker: 'Allgemeinwissen', title: 'Allgemeinwissen sicher abrufen',
      desc: 'Politik, Geschichte, Gesellschaft und Weltwissen. <strong>Schnell abrufen</strong>, sicher punkten.',
      tags: ['BRD', 'Gesellschaft', 'Weltwissen'], modes: ['generalKnowledge', 'allgemeinwissen', 'knowledge', 'general', 'knowledgeSprint'], startLabel: 'Wissen starten',
      branches: ['wissen','kaufm','sozial','it']
    },
    {
      id: 'englisch', label: 'Englisch', iconName: 'english', iconClass: 'c-sky',
      kicker: 'Basics', title: 'Englisch Basics',
      desc: 'Grundwortschatz und einfache Grammatik. <strong>Keine Zeit verlieren</strong>.',
      tags: ['Grammar', 'Vocabulary', 'Basics'], modes: ['english', 'englisch'], startLabel: 'Englisch starten',
      branches: ['it','wissen']
    },
    {
      id: 'it', label: 'IT-Grundlagen', iconName: 'it', iconClass: 'c-slate',
      kicker: 'FISI', title: 'IT-Grundlagen',
      desc: 'EDV, Hardware, Netzwerk und Betriebssysteme. <strong>Technisch und praktisch denken</strong>.',
      tags: ['EDV', 'Hardware', 'Netzwerk'], modes: ['itSprint', 'it', 'edv', 'itBasics'], startLabel: 'IT starten',
      branches: ['it']
    },
    {
      id: 'netzwerk', label: 'Netzwerk', iconName: 'network', iconClass: 'c-blue',
      kicker: 'FISI', title: 'Netzwerkgrundlagen',
      desc: 'IP, DNS, Subnetze und Grundbegriffe der Netzwerktechnik. <strong>Zusammenhänge verstehen</strong>.',
      tags: ['IP', 'DNS', 'Subnetz'], modes: ['itSprint', 'it', 'edv', 'itBasics'], startLabel: 'Netzwerk starten',
      branches: ['it']
    },
    {
      id: 'hardware_os', label: 'Hardware & OS', iconName: 'hardware', iconClass: 'c-indigo',
      kicker: 'FISI', title: 'Hardware & Betriebssysteme',
      desc: 'PC-Komponenten, Betriebssysteme, einfache Administration und Fehlersuche. <strong>Praxisnah denken</strong>.',
      tags: ['Hardware', 'Windows', 'OS'], modes: ['itSprint', 'it', 'edv', 'itBasics'], startLabel: 'Hardware starten',
      branches: ['it']
    },
    {
      id: 'konzentration', label: 'Fokus', iconName: 'focus', iconClass: 'c-rose',
      kicker: 'Aufmerksamkeit', title: 'Konzentration & Fehlerblick',
      desc: 'Schnelle Wahrnehmung unter Druck. <strong>Ruhig bleiben</strong> und präzise tippen.',
      tags: ['Fokus', 'Tempo', 'Fehlerblick'], modes: ['concentrationSprint', 'concentrationPro', 'concentration', 'aufmerksamkeit'], startLabel: 'Fokus starten',
      branches: ['it','kaufm','sozial','wissen']
    },
    {
      id: 'kaufmRechnen', label: 'Kaufm. Rechnen', iconName: 'calculator', iconClass: 'c-orange',
      kicker: 'Rechnungswesen', title: 'Kaufmännisches Rechnen',
      desc: 'Prozentrechnung, Dreisatz, Zinsen, Skonto, Rabatt und Mehrwertsteuer. <strong>Sicher kalkulieren</strong>.',
      tags: ['Dreisatz', 'Prozent', 'Skonto'], modes: ['kaufmRechnen'], startLabel: 'Rechnen starten',
      branches: ['kaufm']
    },
    {
      id: 'bueroWissen', label: 'Büro & Verwaltung', iconName: 'office', iconClass: 'c-blue',
      kicker: 'Verwaltung', title: 'Büroorganisation & Verwaltung',
      desc: 'Abläufe, Organisation, Akten, Fristen und Verwaltungssicherheit. <strong>Ordnung ins System bringen</strong>.',
      tags: ['Büro', 'Abläufe', 'Verwaltung'], modes: ['bueroWissen'], startLabel: 'Bürowissen starten',
      branches: ['kaufm']
    },
    {
      id: 'wirtschaft', label: 'Wirtschaft', iconName: 'economy', iconClass: 'c-green',
      kicker: 'Kaufmännisch', title: 'Wirtschaft & Finanzen',
      desc: 'Grundbegriffe aus Wirtschaft, Betrieb, Markt und Finanzen. <strong>Zusammenhänge erkennen</strong>.',
      tags: ['Wirtschaft', 'Finanzen', 'Betrieb'], modes: ['bueroWissen','kaufmRechnen'], startLabel: 'Wirtschaft starten',
      branches: ['kaufm']
    },
    {
      id: 'din5008', label: 'DIN 5008', iconName: 'document', iconClass: 'c-slate',
      kicker: 'Kommunikation', title: 'DIN 5008 & Schriftverkehr',
      desc: 'Geschäftsbrief, E-Mail, Aufbau und formale Standards. <strong>Professionell schreiben</strong>.',
      tags: ['DIN 5008', 'Brief', 'E-Mail'], modes: ['bueroWissen','deutsch'], startLabel: 'DIN 5008 starten',
      branches: ['kaufm']
    },
    {
      id: 'kommunikation', label: 'Kommunikation', iconName: 'chat', iconClass: 'c-sky',
      kicker: 'Kaufmännisch', title: 'Kommunikation & Deutsch',
      desc: 'Kundenkontakt, klare Sprache, Textverständnis und schriftliche Kommunikation. <strong>Sachlich und sicher</strong>.',
      tags: ['Kommunikation', 'Deutsch', 'Kundenkontakt'], modes: ['sentenceCompletion','deutsch','sentenceSprint'], startLabel: 'Kommunikation starten',
      branches: ['kaufm']
    },
    {
      id: 'paedagogik', label: 'Pädagogik', iconName: 'education', iconClass: 'c-rose',
      kicker: 'Fachwissen', title: 'Pädagogisches Fachwissen',
      desc: 'Bild vom Kind, Bildungsbereiche, Inklusion und pädagogische Grundlagen. <strong>Fachlich sauber argumentieren</strong>.',
      tags: ['Pädagogik', 'Inklusion', 'Bildung'], modes: ['paedagogik'], startLabel: 'Pädagogik starten',
      branches: ['sozial']
    },
    {
      id: 'entwicklung_bindung', label: 'Entwicklung & Bindung', iconName: 'sprout', iconClass: 'c-green',
      kicker: 'Sozialpädagogik', title: 'Entwicklung & Bindung',
      desc: 'Entwicklungsphasen, Bindungstheorie und kindliche Bedürfnisse. <strong>Fachbegriffe gezielt nutzen</strong>.',
      tags: ['Entwicklung', 'Bindung', 'Piaget'], modes: ['paedagogik'], startLabel: 'Entwicklung starten',
      branches: ['sozial']
    },
    {
      id: 'situationen', label: 'Praxisfälle', iconName: 'cases', iconClass: 'c-teal',
      kicker: 'Praxis', title: 'Praxissituationen & Handeln',
      desc: 'Konflikte, Gruppenraum, Elternarbeit und Team-Kommunikation. <strong>Empathisch und professionell handeln</strong>.',
      tags: ['Konflikte', 'Elternarbeit', 'Team'], modes: ['situationen'], startLabel: 'Praxis starten',
      branches: ['sozial']
    },
    {
      id: 'kommunikation_sozial', label: 'Kommunikation', iconName: 'chat', iconClass: 'c-blue',
      kicker: 'Sozialpädagogik', title: 'Kommunikation & Elternarbeit',
      desc: 'Gesprächsführung, Konfliktklärung, Elternkontakt und Teamarbeit. <strong>Ruhig und klar bleiben</strong>.',
      tags: ['Elternarbeit', 'Team', 'Konflikt'], modes: ['situationen'], startLabel: 'Kommunikation starten',
      branches: ['sozial']
    },
    {
      id: 'recht_sozial', label: 'Recht / Schutz', iconName: 'shield', iconClass: 'c-slate',
      kicker: 'Sozialpädagogik', title: 'Recht, Schutzauftrag & SGB VIII',
      desc: 'Kinderschutz, Aufsicht, Beteiligung und rechtliche Grundlagen. <strong>Sicherheit in Fachfragen</strong>.',
      tags: ['SGB VIII', 'Kinderschutz', 'Aufsicht'], modes: ['paedagogik','situationen'], startLabel: 'Recht starten',
      branches: ['sozial']
    },
    {
      id: 'doku_beobachtung', label: 'Beobachtung', iconName: 'clipboard', iconClass: 'c-orange',
      kicker: 'Sozialpädagogik', title: 'Beobachtung & Dokumentation',
      desc: 'Beobachten, dokumentieren, reflektieren und pädagogisch begründen. <strong>Fachlich nachvollziehbar</strong>.',
      tags: ['Beobachtung', 'Doku', 'Reflexion'], modes: ['paedagogik','situationen'], startLabel: 'Beobachtung starten',
      branches: ['sozial']
    },
    {
      id: 'python_quest', label: 'Python Quest', iconName: 'python', iconClass: 'c-green',
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
    if (id === 'wissen') return { id: 'wissen', label: 'Allgemeinwissen', iconName: 'knowledge' };
    return null;
  }

  function moduleIconHtml(mod) {
    if (!mod) return '';
    var iconName = resolveIconName(mod);
    if (iconName && ICON_PATHS[iconName]) return iconSvg(iconName);
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
    if (!source) return iconSvg('target');
    var iconName = resolveIconName(source);
    if (iconName && ICON_PATHS[iconName]) return iconSvg(iconName);
    if (source.iconAsset) return '<img src="' + esc(source.iconAsset) + '" alt="">';
    return source.icon ? esc(source.icon) : iconSvg('target');
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
    var iconHtml = config.iconHtml || iconSvg('target');
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
        '<button type="button" class="ui-sheet-close ui-deep-close" id="uiSheetClose" aria-label="Schließen">×</button>' +
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
        '<button type="button" class="ui-deep-primary" data-ui-action="open-module" data-module="' + esc(startId) + '"><span class="ui-inline-icon">' + iconSvg('practice', 'ui-inline-icon-svg') + '</span>Training starten</button>' +
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

  function currentBranchId () {
    try {
      if (window.AppModuleHost && typeof AppModuleHost.getBranch === 'function') return AppModuleHost.getBranch().id || 'it';
      return localStorage.getItem('bps_branch') || 'it';
    } catch (e) { return 'it'; }
  }

  function branchInfoList () {
    try {
      if (window.AppModuleHost && typeof AppModuleHost.listBranches === 'function') return AppModuleHost.listBranches();
    } catch (e) {}
    return BRANCHES.slice();
  }

  function simulationProfileCard(branchId, simType, title, desc, icon) {
    var mode = simType === 'ctc' ? 'ctcLohr' : 'bps';
    var time = simType === 'ctc' ? 'ca. 33–35 Min. · 6 CTC-Blöcke' : '50 Sekunden pro Aufgabe';
    var badge = simType === 'ctc' ? 'CTC' : 'BPS';
    return '<button type="button" class="ui-deep-card product-sim-choice" data-ui-action="start-simulation-profile" data-branch="' + esc(branchId) + '" data-simtype="' + esc(simType) + '" data-mode="' + esc(mode) + '">' +
      '<span class="ui-deep-card-icon">' + resolveIconMarkup(icon || 'target') + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(title) + '</b><small>' + esc(desc) + ' · ' + time + ' · keine Hilfe</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">' + badge + ' ›</span>' +
    '</button>';
  }

  function simulationCenterBody() {
    return '' +
      '<div class="product-flow product-flow-simulation">' +
        '<div class="ui-deep-benefits product-rules">' +
          '<div class="ui-deep-benefit"><b>BPS</b><span>50 Sek./Aufgabe</span></div>' +
          '<div class="ui-deep-benefit"><b>CTC</b><span>ca. 33–35 Min. · echter Blockablauf</span></div>' +
          '<div class="ui-deep-benefit"><b>Coach</b><span>erst nach Abschluss</span></div>' +
        '</div>' +
        '<div class="product-warning"><b>Simulationsregel:</b> keine Hilfe, kein Sofortfeedback, kein Coach während der Aufgabe. Auswertung und KI-Coach starten erst nach Testende.</div>' +
        '<div class="ui-deep-section-label">1. Bereich wählen → 2. Testtyp starten</div>' +
        '<div class="product-track-grid">' +
          '<section class="product-track-card product-track-it">' +
            '<div class="product-track-head"><span>' + iconSvg('it') + '</span><div><b>IT / FISI</b><small>BPS oder CTC</small></div></div>' +
            '<div class="product-sim-options">' +
              simulationProfileCard('it', 'bps', 'BPS-Simulation', 'IT-passender Aufgabenmix', 'target') +
              simulationProfileCard('it', 'ctc', 'CTC-Lohr Simulation', 'Allgemeinwissen, Mathe, Regelrechnung, Konzentration, Tabellen und Wenn-Dann-Ablauf', 'practice') +
            '</div>' +
          '</section>' +
          '<section class="product-track-card product-track-social">' +
            '<div class="product-track-head"><span>' + iconSvg('social') + '</span><div><b>Sozialpädagogik</b><small>BPS ohne IT-Fragen</small></div></div>' +
            '<div class="product-sim-options">' +
              simulationProfileCard('sozial', 'bps', 'BPS-Simulation', 'pädagogiknahe Mischung ohne IT-Fragen', 'target') +
            '</div>' +
          '</section>' +
          '<section class="product-track-card product-track-kaufm">' +
            '<div class="product-track-head"><span>' + iconSvg('kaufm') + '</span><div><b>Kaufmännisch</b><small>BPS mit kaufmännischem Fokus</small></div></div>' +
            '<div class="product-sim-options">' +
              simulationProfileCard('kaufm', 'bps', 'BPS-Simulation', 'kaufmännisch passender Aufgabenmix', 'target') +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>';
  }

  function simulationBranchBody (mod, rs) {
    return simulationCenterBody();
  }

  function openSimulationCenterDeepSheet() {
    return openDeepSheet({
      type: 'simulation-center',
      theme: 'indigo',
      title: 'Simulation Center',
      kicker: 'Prüfungsmodus',
      subtitle: 'Wähle zuerst deinen Bereich und danach den Testtyp. Simulationen laufen ohne Hilfe; der KI-Coach bewertet erst danach.',
      iconHtml: iconSvg('target'),
      bodyHtml: simulationCenterBody()
    });
  }

  function trainingCategoryCard(action, title, desc, icon, attrs) {
    return '<button type="button" class="ui-deep-card product-training-card" data-ui-action="' + esc(action) + '" ' + (attrs || '') + '>' +
      '<span class="ui-deep-card-icon">' + resolveIconMarkup(icon || 'practice') + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(title) + '</b><small>' + esc(desc) + '</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' +
    '</button>';
  }

  function branchTrainingOptions(branchId) {
    var sets = {
      it: [
        ['math','Mathe'], ['logic','Logik'], ['general','Allgemeinwissen'], ['it','IT-Grundlagen'],
        ['python_quest','Python'], ['english','Englisch'], ['sentenceSprint','Deutsch'], ['techniqueSprint','Technik'], ['matrixOnlySprint','Matrizen']
      ],
      sozial: [
        ['math','Mathe'], ['sentenceSprint','Deutsch'], ['english','Englisch'], ['general','Allgemeinwissen'],
        ['paedagogik','Sozialpädagogik'], ['situationen','Pädagogische Situationen'], ['textComprehensionSprint','Textverständnis'], ['logic','Logik']
      ],
      kaufm: [
        ['math','Mathe'], ['kaufmRechnen','Prozent / Dreisatz'], ['bueroWissen','Kaufmännisches Wissen'],
        ['sentenceSprint','Deutsch'], ['english','Englisch'], ['general','Allgemeinwissen'], ['logic','Logik']
      ]
    };
    return sets[branchId] || sets.it;
  }

  function branchTrainingTitle(branchId) {
    if (branchId === 'sozial') return 'Sozialpädagogik Training';
    if (branchId === 'kaufm') return 'Kaufmännisches Training';
    return 'IT / FISI Training';
  }

  function branchTrainingBody(branchId) {
    var options = branchTrainingOptions(branchId);
    var preset = branchId === 'it' ? ['math','logic','general','it'] : (branchId === 'sozial' ? ['math','sentenceSprint','english','paedagogik'] : ['math','kaufmRechnen','sentenceSprint','general']);
    return '' +
      '<div class="product-flow product-flow-branch-training" data-training-branch="' + esc(branchId) + '">' +
        '<div class="product-warning"><b>Training:</b> Zeit läuft mit, aber ohne harten Simulationsdruck. Hilfe und KI-Coach sind erlaubt.</div>' +
        '<div class="ui-deep-section-label">Kategorien wählen</div>' +
        '<div class="product-training-checkgrid">' +
          options.map(function (it) {
            var checked = preset.indexOf(it[0]) >= 0 ? ' checked' : '';
            return '<label class="product-training-check"><input type="checkbox" data-training-mix="1" value="' + esc(it[0]) + '"' + checked + '><span>' + esc(it[1]) + '</span></label>';
          }).join('') +
        '</div>' +
        '<div class="ui-deep-startbox product-training-startbox">' +
          '<div><b>Gemischten Aufgabenpool starten</b><span>Die gewählten Kategorien werden als Trainingsmix gespeichert. Simulation bleibt davon getrennt.</span></div>' +
          '<button type="button" class="ui-deep-primary" data-ui-action="start-training-mix" data-branch="' + esc(branchId) + '">Training starten</button>' +
        '</div>' +
      '</div>';
  }

  function openBranchTrainingDeepSheet(branchId) {
    branchId = branchId || 'it';
    return openDeepSheet({
      type: 'branch-training',
      theme: 'blue',
      title: branchTrainingTitle(branchId),
      kicker: 'Berufsfeld-Training',
      subtitle: 'Wähle mehrere Kategorien. Die App baut daraus einen gemischten Trainingspool mit Hilfe und Coach-Unterstützung.',
      iconHtml: branchId === 'sozial' ? iconSvg('social') : (branchId === 'kaufm' ? iconSvg('kaufm') : iconSvg('it')),
      bodyHtml: branchTrainingBody(branchId)
    });
  }

  function trainingCenterBody() {
    return '' +
      '<div class="product-flow product-flow-training">' +
        '<div class="ui-deep-benefits product-rules">' +
          '<div class="ui-deep-benefit"><b>Training</b><span>Hilfe erlaubt</span></div>' +
          '<div class="ui-deep-benefit"><b>Zeit</b><span>läuft mit</span></div>' +
          '<div class="ui-deep-benefit"><b>Coach</b><span>darf erklären</span></div>' +
        '</div>' +
        '<div class="ui-deep-section-label">Berufsfeld-Training</div>' +
        '<div class="ui-deep-grid product-training-grid">' +
          trainingCategoryCard('branch-training', 'IT / FISI Training', 'Kategorien wählen: IT, Mathe, Logik, Python, Englisch, Deutsch, Technik.', 'it', 'data-branch="it"') +
          trainingCategoryCard('branch-training', 'Sozialpädagogik Training', 'Keine IT-Fragen: Mathe, Deutsch, Englisch, Pädagogik, Situationen, Textverständnis.', 'social', 'data-branch="sozial"') +
          trainingCategoryCard('branch-training', 'Kaufmännisches Training', 'Prozent, Dreisatz, Deutsch, Englisch, Tabellenverständnis, Wirtschaft, Logik.', 'kaufm', 'data-branch="kaufm"') +
        '</div>' +
        '<div class="ui-deep-section-label">Einzeltraining</div>' +
        '<div class="ui-deep-grid product-single-grid">' +
          trainingCategoryCard('single-training', 'Mathe', 'Kopfrechnen, Prozent, Dreisatz, Brüche und Textaufgaben.', 'math', 'data-mode="math"') +
          trainingCategoryCard('single-training', 'Deutsch', 'Satzergänzung, Sprache und Textverständnis.', 'german', 'data-mode="sentenceSprint"') +
          trainingCategoryCard('single-training', 'Englisch', 'Vokabeln, Grammatik und Basics.', 'english', 'data-mode="english"') +
          trainingCategoryCard('single-training', 'Logik', 'Zahlenreihen, Muster, Aussagenlogik.', 'logic', 'data-mode="logic"') +
          trainingCategoryCard('single-training', 'Matrizen', 'Mustersehen und visuelle Beziehungen.', 'matrix', 'data-mode="matrixOnlySprint"') +
          trainingCategoryCard('single-training', 'Allgemeinwissen', 'Politik, Geschichte, Geografie, Alltag.', 'knowledge', 'data-mode="general"') +
          trainingCategoryCard('single-training', 'Technisches Verständnis', 'Mechanik, Technik, Visual IQ.', 'settings', 'data-mode="techniqueSprint"') +
          trainingCategoryCard('python-quest', 'Python-Kurs', 'Levelsystem, Übungen, Zwischen- und Abschlussprüfung.', 'python') +
        '</div>' +
        '<div class="ui-deep-startbox">' +
          '<div><b>Fehler wiederholen</b><span>Später eigener Fehlerpool. Bis dahin öffnet diese Tür die Analyse-Empfehlung.</span></div>' +
          '<button type="button" class="ui-deep-primary" data-ui-action="analysis">Schwächen ansehen</button>' +
        '</div>' +
      '</div>';
  }

  function openTrainingCenterDeepSheet() {
    return openDeepSheet({
      type: 'training-center',
      theme: 'blue',
      title: 'Training Center',
      kicker: 'Vorbereitung',
      subtitle: 'Trainiere mit Hilfe, Feedback und KI-Coach. Berufsfelder bleiben sauber getrennt.',
      iconHtml: iconSvg('practice'),
      bodyHtml: trainingCenterBody()
    });
  }

  function openMoreDeepSheet() {
    var body = '' +
      '<div class="ui-deep-section-label">Mehr</div>' +
      '<div class="ui-deep-grid product-more-grid">' +
        actionCardHtml('auth-open', 'Profil', 'Login, Zugangscode, Demo und Benutzerprofil', 'user') +
        actionCardHtml('settings', 'Einstellungen', 'System, Cache, Daten und App-Optionen', 'settings') +
        actionCardHtml('highscore-sheet', 'Highscore', 'Ranking, Zeitraum, Cloud und lokale Liste', 'trophy') +
        actionCardHtml('duel-hub', 'Duell', 'Challenge, Verlauf und Wettkampf', 'duel') +
        actionCardHtml('admin-open', 'Admin / Dozent', 'Teilnehmer, Gruppen, Codes und Auswertung', 'admin') +
        actionCardHtml('feedback', 'Feedback / Hilfe', 'Fehler melden oder Verbesserung notieren', 'feedback') +
      '</div>';
    return openDeepSheet({ type:'more-menu', theme:'slate', title:'Mehr', kicker:'System', subtitle:'Alles Wichtige, das nicht dauerhaft in die Hauptnavigation gehört.', iconHtml:iconSvg('more'), bodyHtml:body });
  }

  /* ── Deep Sheet ───────────────────────────────────── */
  function moduleDeepBody(mod, modeKey, amount, rs) {
    if (mod && mod.id === 'simulation') return simulationBranchBody(mod, rs || resultStats());
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
        '<button type="button" class="ui-deep-primary" id="uiSheetStart"><span class="ui-inline-icon">' + iconSvg('target', 'ui-inline-icon-svg') + '</span>Starten</button>' +
      '</div>';
  }

  function openSheet (mod) {
    activeSheet = mod;
    if (!mod) return false;
    if (mod && mod.id === 'simulation') return openSimulationCenterDeepSheet();
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
      if (mod && mod.id === 'simulation' && window.AppModuleHost && typeof AppModuleHost.startSimulation === 'function') {
        startBranchSimulation(currentBranchId(), null, 'ui-home-sheet-phase5');
        notice(mod.label + ' startet…');
        return;
      }
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
      '<span class="ui-deep-card-icon">' + resolveIconMarkup(icon || 'more') + '</span>' +
      '<span class="ui-deep-card-copy"><b>' + esc(title || 'Aktion') + '</b><small>' + esc(desc || '') + '</small></span>' +
      '<span class="ui-deep-card-arrow" aria-hidden="true">›</span>' +
    '</button>';
  }

  function deepModuleListHtml(items) {
    return '<div class="ui-deep-grid">' + items.map(function(it){
      return moduleCardHtml(moduleById(it) || { id: it, label: it, kicker: 'Modul öffnen', iconName: 'target', iconClass: '' });
    }).join('') + '</div>';
  }

  function openPracticeDeepSheet(mode) {
    return openTrainingCenterDeepSheet();
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
        actionCardHtml('coach-open-core', 'KI-Coach öffnen', 'Fragen stellen, Erklärungen holen und Lernhinweise prüfen', 'coach') +
        actionCardHtml('analysis', 'Schwächenanalyse', 'Ergebnisse, Fehlerarten und Entwicklung prüfen', '▥') +
        actionCardHtml('practice', 'Empfohlen üben', 'Direkt in passende Übungsmodule einsteigen', '↗') +
        actionCardHtml('learn', 'Grundlagen wiederholen', 'Erst verstehen, dann Aufgaben lösen', '◎') +
        actionCardHtml('open-module', 'Simulation starten', 'Prüfungsnah testen und Daten für den Coach sammeln', 'target', 'data-module="simulation"') +
        actionCardHtml('progress', 'Prüfungsampel', 'Fortschritt und Leistungsstand kompakt ansehen', '▤') +
      '</div>' +
      '<div class="ui-deep-startbox">' +
        '<div><b>Nächster sinnvoller Schritt</b><span>Bei wenig Daten: zuerst Simulation oder Üben starten. Bei vorhandenen Daten: Analyse öffnen.</span></div>' +
        '<button type="button" class="ui-deep-primary" data-ui-action="analysis">Coach-Analyse öffnen</button>' +
      '</div>';
    return openDeepSheet({ type:'coach-menu', theme:'blue', title:'KI-Coach', kicker:'Coach', subtitle:'Analyse, Empfehlungen und nächste Trainingsschritte an einem Ort.', iconHtml:iconSvg('coach'), bodyHtml:body });
  }

  function analysisV2OptionsHtml(items, selected) {
    return items.map(function (it) {
      var value = (typeof it === 'string') ? it : it.value;
      var label = (typeof it === 'string') ? it : it.label;
      return '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }

  function analysisV2Seed(area, period, view) {
    /* G54.43.5 · Coach-Auswertung final
       Dashboard V2 nutzt ab jetzt eine zentrale Adapter-Schicht. Dadurch
       können Sprachkurs, Simulation, CTC/BPS, Mathematik, Logik, Wissen,
       Deutsch, Englisch und IT/FISI einheitlich analysiert werden. Falls der
       Adapter fehlt oder noch keine echten Daten vorhanden sind, bleibt der
       alte sichere Fallback aktiv. */
    try {
      if (window.EGTAnalysisDataAdapter && typeof EGTAnalysisDataAdapter.getDashboard === 'function') {
        var adapted = EGTAnalysisDataAdapter.getDashboard(area || 'all', period || 'days30', view || 'overview');
        if (adapted && adapted.cfg && adapted.trend && adapted.bars) return adapted;
      }
    } catch (adapterError) {}

    var rs = resultStats();
    var base = Math.max(0, Math.min(100, Number(rs.percent || 0) || 0));
    if (!base) base = 58;
    var areaMap = {
      all:        { label:'Alle Bereiche',     lines:['Mathematik','Logik','Sprachkurs','Simulation','IT/FISI'], focus:'Zahlenreihen', score:base, best:rs.best || 0 },
      language:   { label:'Sprachkurs',        lines:['Lesen','Hören','Schreiben','Sprechen','Grammatik'], focus:'Grammatik', score:Math.min(100, base + 4), best:rs.best || 0 },
      simulation: { label:'Simulation',        lines:['Allgemeinwissen','Mathematik','Koordinaten','Wenn-Dann','Zeit'], focus:'Zeitdruck', score:Math.max(0, base - 2), best:rs.best || 0 },
      ctc:        { label:'CTC/BPS',           lines:['Allgemeinwissen','Mathematik','Zahlenreihen','Koordinaten','Wenn-Dann'], focus:'Zahlenreihen', score:Math.max(0, base - 4), best:rs.best || 0 },
      math:       { label:'Mathematik',        lines:['Grundrechnen','Dreisatz','Prozent','Zahlenreihen','Textaufgaben'], focus:'Zahlenreihen', score:Math.max(0, base - 6), best:rs.best || 0 },
      logic:      { label:'Logik',             lines:['Muster','Regeln','Reihen','Figuren','Tempo'], focus:'Regelwechsel', score:Math.min(100, base + 2), best:rs.best || 0 },
      knowledge:  { label:'Allgemeinwissen',   lines:['Politik','Geschichte','Geografie','Wirtschaft','Aktuelles'], focus:'Wirtschaft', score:Math.min(100, base + 1), best:rs.best || 0 },
      german:     { label:'Deutsch',           lines:['Lesen','Grammatik','Wortschatz','Schreiben','Verstehen'], focus:'Satzbau', score:Math.min(100, base + 3), best:rs.best || 0 },
      english:    { label:'Englisch',          lines:['Reading','Vocabulary','Grammar','Listening','Use of English'], focus:'Grammar', score:Math.max(0, base - 1), best:rs.best || 0 },
      it:         { label:'IT/FISI',           lines:['Netzwerk','Hardware','Linux','Windows','Security'], focus:'Netzwerkgrundlagen', score:Math.max(0, base - 3), best:rs.best || 0 }
    };
    var cfg = areaMap[area] || areaMap.all;
    var spread = [0, 8, -6, 5, -10];
    var bars = cfg.lines.map(function (name, i) { return { label:name, value:Math.max(18, Math.min(98, cfg.score + (spread[i] || 0))) }; });
    var trend = [Math.max(15, cfg.score - 18), Math.max(20, cfg.score - 10), Math.max(25, cfg.score - 7), Math.min(100, cfg.score - 1), Math.min(100, cfg.score + 5)];
    var forecast = Math.max(0, Math.min(100, Math.round((cfg.score * 0.70) + ((rs.best || cfg.score) * 0.20) + (Math.min(rs.runs || 0, 12) * 0.9))));
    var viewLabel = ({ overview:'Übersicht', trend:'Verlauf', strengths:'Stärken & Schwächen', forecast:'Prognose', errors:'Fehleranalyse' })[view] || 'Übersicht';
    var periodLabel = ({ today:'Heute', days7:'7 Tage', days30:'30 Tage', days90:'90 Tage', alltime:'Gesamt' })[period] || '30 Tage';
    return { cfg:cfg, bars:bars, trend:trend, forecast:forecast, viewLabel:viewLabel, periodLabel:periodLabel, runs:rs.runs || 0, best:rs.best || 0, source:'fallback', dataReady:false, note:'Fallback-Daten' };
  }

  function analysisV2LineSvg(data) {
    var chart = data && data.chart ? data.chart : null;
    var labels = chart && Array.isArray(chart.labels) ? chart.labels.slice(0,5) : ['Start','1','2','3','Heute'];
    var series = chart && Array.isArray(chart.series) ? chart.series.slice(0,5) : [];
    if (!series.length) {
      var t = (data && data.trend && data.trend.length) ? data.trend : [40,48,55,61,66];
      series = [{ label: (data && data.cfg && data.cfg.lines && data.cfg.lines[0]) || 'Verlauf', values:t }];
    }
    function clampChart(v){ v = Number(v); if (!isFinite(v)) v = 0; return Math.max(0, Math.min(100, v)); }
    function y(v){ return Math.round(116 - (clampChart(v) * 0.88)); }
    function x(i){ return Math.round(24 + i*58); }
    function points(values){ return values.slice(0,5).map(function(v,i){ return x(i) + ',' + y(v); }).join(' '); }
    var svg = '<svg class="analysis-v2-chart-svg analysis-v2-chart-svg-multiline" viewBox="0 0 280 148" role="img" aria-label="Leistungsverlauf mit mehreren Linien">' +
      '<line x1="24" y1="116" x2="268" y2="116" class="analysis-v2-axis"/>' +
      '<line x1="24" y1="72" x2="268" y2="72" class="analysis-v2-gridline"/>' +
      '<line x1="24" y1="36" x2="268" y2="36" class="analysis-v2-gridline"/>';
    series.forEach(function(row, idx){
      var cls = 'line-' + String.fromCharCode(97 + idx);
      var vals = Array.isArray(row.values) ? row.values.slice(0,5) : [];
      while (vals.length < 5) vals.push(vals.length ? vals[vals.length-1] : 0);
      svg += '<polyline points="' + esc(points(vals)) + '" class="analysis-v2-line ' + cls + '"/>';
      vals.forEach(function(v,i){ svg += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="2.8" class="analysis-v2-series-dot ' + cls + '"/>'; });
    });
    svg += '<g class="analysis-v2-xlabels">' + labels.map(function(label,i){ return '<text x="' + x(i) + '" y="140" text-anchor="middle">' + esc(label) + '</text>'; }).join('') + '</g></svg>';
    return svg;
  }

  function analysisV2LegendHtml(data) {
    var chart = data && data.chart ? data.chart : null;
    var series = chart && Array.isArray(chart.series) ? chart.series.slice(0,5) : [];
    if (!series.length && data && data.cfg && data.cfg.lines) series = data.cfg.lines.slice(0,3).map(function(label){ return { label: label, latest: 0 }; });
    return '<div class="analysis-v2-legend analysis-v2-legend-bound" data-analysis-chart-legend="adapter-bound">' + series.map(function(row, idx){
      var cls = 'line-' + String.fromCharCode(97 + idx);
      var latest = Number(row.latest || (row.values && row.values[row.values.length-1]) || 0);
      var value = data && data.dataReady ? (' · ' + Math.round(latest) + '%') : '';
      return '<span><i class="' + cls + '"></i>' + esc(row.label || ('Linie ' + (idx+1))) + esc(value) + '</span>';
    }).join('') + '</div>';
  }

  function analysisV2BarsHtml(data) {
    var list = (data && Array.isArray(data.barsDisplay) && data.barsDisplay.length) ? data.barsDisplay : ((data && data.bars) || []);
    return '<div class="analysis-v2-bars" data-analysis-bars="adapter-bound-weakest-first">' + list.map(function (b, idx) {
      var value = Math.max(0, Math.min(100, Number(b.value)||0));
      var cls = idx === 0 ? ' is-top-weakness' : (b.real ? ' is-real' : ' is-fallback');
      var meta = b.real ? ((b.count || 0) + '×') : 'Vorschau';
      return '<div class="analysis-v2-bar-row' + cls + '"><span>' + esc(b.label) + '<em>' + esc(meta) + '</em></span><div class="analysis-v2-bar-track"><i style="width:' + esc(value) + '%"></i></div><b>' + esc(Math.round(value)) + '%</b></div>';
    }).join('') + '</div>';
  }

  function analysisV2WeaknessHtml(data) {
    var weak = data && Array.isArray(data.topWeaknesses) ? data.topWeaknesses.slice(0,3) : [];
    var strong = data && Array.isArray(data.topStrengths) ? data.topStrengths.slice(0,2) : [];
    if (!data || !data.dataReady || !weak.length) return '';
    return '<div class="analysis-v2-weakbox" data-analysis-top-weaknesses="adapter-bound">' +
      '<div><b>Top-Schwächen</b><span>niedrigste echte Bereichswerte zuerst</span></div>' +
      '<ol>' + weak.map(function (w) { return '<li><strong>' + esc(w.label) + '</strong><em>' + esc(Math.round(Number(w.value)||0)) + '%</em></li>'; }).join('') + '</ol>' +
      (strong.length ? '<p>Stärkster Hebel: <strong>' + esc(strong[0].label) + '</strong> stabil halten, während <strong>' + esc(weak[0].label) + '</strong> gezielt trainiert wird.</p>' : '') +
    '</div>';
  }

  function analysisV2ForecastHtml(data) {
    var f = data && data.forecastDetail ? data.forecastDetail : null;
    if (!data || !data.dataReady || !f) return '';
    var formula = Array.isArray(f.formula) ? f.formula.slice(0,6) : [];
    var riskTone = String(f.riskLevel || 'mittel').replace(/[^a-z0-9_-]/gi,'');
    return '<div class="analysis-v2-forecast-box analysis-v2-risk-' + esc(riskTone) + '" data-analysis-forecast-engine="explainable-cautious">' +
      '<div class="analysis-v2-forecast-top"><div><b>Prognose</b><span>' + esc(f.label || 'vorsichtige Einschätzung') + '</span></div><strong>' + esc(Math.round(Number(f.probability)||0)) + '%</strong></div>' +
      '<p>' + esc(f.wording || 'Prognose wird aus Leistung, Trend, Risiko und Datenbasis berechnet.') + '</p>' +
      '<div class="analysis-v2-forecast-grid">' +
        '<span><small>Trend</small><b>' + esc(f.trend || 'stabil') + (Number(f.trendDelta) ? ' ' + (Number(f.trendDelta)>0?'+':'') + esc(f.trendDelta) : '') + '</b></span>' +
        '<span><small>Risiko</small><b>' + esc(f.riskLabel || 'Grundlagen') + '</b></span>' +
        '<span><small>Datenbasis</small><b>' + esc(f.confidenceLabel || 'noch wenig Daten') + '</b></span>' +
      '</div>' +
      '<details><summary>Berechnung anzeigen</summary><ul>' + formula.map(function(x){ return '<li><span>' + esc(x.label) + '</span><b>' + esc(x.value) + '</b><em>' + esc(x.weight) + '</em></li>'; }).join('') + '</ul></details>' +
      '<div class="analysis-v2-forecast-note"><b>Empfehlung:</b> ' + esc(f.recommendation || 'Weitere Läufe sammeln und danach neu bewerten.') + '</div>' +
    '</div>';
  }


  function analysisV2ForecastChartHtml(data) {
    var fc = data && data.forecastChart ? data.forecastChart : null;
    if (!data || !data.dataReady || !fc) return '';
    var labels = Array.isArray(fc.labels) ? fc.labels.slice(0,8) : [];
    var actual = Array.isArray(fc.actual) ? fc.actual.slice(0,8) : [];
    var forecast = Array.isArray(fc.forecast) ? fc.forecast.slice(0,8) : [];
    var targetLine = Array.isArray(fc.target) ? fc.target.slice(0,8) : [];
    if (!labels.length || !actual.length) return '';
    function clampChart(v){ v = Number(v); if (!isFinite(v)) v = 0; return Math.max(0, Math.min(100, v)); }
    function y(v){ return Math.round(122 - (clampChart(v) * 0.94)); }
    function x(i){ return Math.round(24 + i*34.8); }
    function poly(values){
      var pts = [];
      values.forEach(function(v,i){ if (v !== null && v !== undefined && isFinite(Number(v))) pts.push(x(i) + ',' + y(v)); });
      return pts.join(' ');
    }
    var target = Number(fc.targetValue || 75) || 75;
    var svg = '<svg class="analysis-v2-forecast-svg" viewBox="0 0 280 158" role="img" aria-label="Prognose-Diagramm mit echter Leistung, Prognose und Zielmarke">' +
      '<line x1="24" y1="122" x2="268" y2="122" class="analysis-v2-axis"/>' +
      '<line x1="24" y1="75" x2="268" y2="75" class="analysis-v2-gridline"/>' +
      '<line x1="24" y1="28" x2="268" y2="28" class="analysis-v2-gridline"/>' +
      '<polyline points="' + esc(poly(targetLine)) + '" class="analysis-v2-target-line"/>' +
      '<text x="268" y="' + esc(y(target)-4) + '" text-anchor="end" class="analysis-v2-target-label">Ziel ' + esc(Math.round(target)) + '%</text>' +
      '<polyline points="' + esc(poly(actual)) + '" class="analysis-v2-actual-line"/>' +
      '<polyline points="' + esc(poly(forecast)) + '" class="analysis-v2-forecast-line"/>';
    actual.forEach(function(v,i){ if (v !== null && v !== undefined && isFinite(Number(v))) svg += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3" class="analysis-v2-actual-dot"/>'; });
    forecast.forEach(function(v,i){ if (v !== null && v !== undefined && isFinite(Number(v))) svg += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3" class="analysis-v2-forecast-dot"/>'; });
    svg += '<g class="analysis-v2-xlabels analysis-v2-forecast-xlabels">' + labels.map(function(label,i){ return '<text x="' + x(i) + '" y="150" text-anchor="middle">' + esc(i < 5 ? label : ('P' + (i-4))) + '</text>'; }).join('') + '</g></svg>';
    return '<div class="analysis-v2-chart-card analysis-v2-forecast-chart-card" data-analysis-forecast-chart="target-actual-prediction">' +
      '<div class="analysis-v2-chart-head"><b>Prognose-Diagramm</b><span>' + esc(fc.note || 'Tendenz, keine Garantie') + '</span></div>' +
      svg +
      '<div class="analysis-v2-legend analysis-v2-forecast-legend"><span><i class="actual"></i>Ist-Leistung</span><span><i class="forecast"></i>Prognose</span><span><i class="target"></i>Zielmarke</span></div>' +
      '<p class="analysis-v2-forecast-disclaimer">Die Prognoselinie ist eine vorsichtige Tendenz aus bisherigen Ergebnissen, Trend und Risiko-Bereich. Sie ist keine Bestehensgarantie.</p>' +
    '</div>';
  }

  function analysisV2ErrorAnalysisHtml(data) {
    var ea = data && data.errorAnalysis ? data.errorAnalysis : null;
    if (!data || !data.dataReady || !ea || !Array.isArray(ea.groups) || !ea.groups.length) return '';
    function priorityLabel(p) {
      p = String(p || 'niedrig');
      if (p === 'hoch') return 'Priorität hoch';
      if (p === 'mittel') return 'Priorität mittel';
      return 'Priorität niedrig';
    }
    return '<div class="analysis-v2-errorbox" data-analysis-error-groups="adapter-priority-training">' +
      '<div class="analysis-v2-errorbox-head"><div><b>Fehleranalyse</b><span>' + esc(ea.note || 'echte Fehlergruppen und Trainingshinweise') + '</span></div><strong>' + esc(priorityLabel(ea.topPriority)) + '</strong></div>' +
      '<div class="analysis-v2-error-list">' + ea.groups.slice(0,5).map(function(g){
        var pr = String(g.priority || 'niedrig').replace(/[^a-z0-9_-]/gi,'');
        return '<div class="analysis-v2-error-item is-' + esc(pr) + '">' +
          '<div><b>' + esc(g.label) + '</b><span>' + esc(priorityLabel(g.priority)) + ' · ' + esc(g.count || 1) + ' Treffer</span></div>' +
          '<em>' + esc(Math.round(Number(g.severity)||0)) + '</em>' +
          '<p>' + esc(g.trainingHint || 'Gezielt wiederholen und danach erneut prüfen.') + '</p>' +
        '</div>';
      }).join('') + '</div>' +
      '<div class="analysis-v2-error-training"><b>Trainingshinweis:</b> ' + esc(ea.trainingHint || 'Starte ein kurzes Schwächentraining und prüfe danach den Trend erneut.') + '</div>' +
    '</div>';
  }


  function analysisV2CoachInsightHtml(data) {
    var ci = data && data.coachInsight ? data.coachInsight : null;
    if (!ci) {
      return '<div class="analysis-v2-coach" data-analysis-coach-insight="fallback"><b>Coach-Auswertung</b><p>' +
        (data && data.dataReady ? 'Die Auswertung ist aktiv. Trainiere den angezeigten Fokus und prüfe danach den Verlauf erneut.' : 'Noch keine gespeicherten Ergebnisse vorhanden. Starte zuerst ein Training oder eine Simulation.') +
      '</p></div>';
    }
    var tone = String(ci.tone || 'watch').replace(/[^a-z0-9_-]/gi,'');
    var bullets = Array.isArray(ci.bullets) ? ci.bullets.slice(0,3) : [];
    return '<div class="analysis-v2-coach analysis-v2-coach-' + esc(tone) + '" data-analysis-coach-insight="forecast-weakness-errors">' +
      '<div class="analysis-v2-coach-head"><div><b>Coach-Auswertung</b><span>' + esc(ci.title || 'Kurze Interpretation') + '</span></div><strong>' + esc(ci.priority || 'mittel') + '</strong></div>' +
      '<p>' + esc(ci.summary || 'Die Analyse fasst Prognose, Schwäche und Fehlergruppen zusammen.') + '</p>' +
      '<div class="analysis-v2-coach-next"><b>Nächster Schritt:</b> ' + esc(ci.nextStep || 'Gezielt trainieren und danach erneut prüfen.') + '</div>' +
      (bullets.length ? '<ul>' + bullets.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
    '</div>';
  }


  function analysisV2KpiHtml(label, value, hint, tone) {
    var cls = tone ? ' analysis-v2-kpi-' + String(tone).replace(/[^a-z0-9_-]/gi,'') : '';
    return '<div class="analysis-v2-kpi' + cls + '"><small>' + esc(label) + '</small><b>' + esc(value) + '</b><span>' + esc(hint || '') + '</span></div>';
  }

  function analysisV2EmptyStateHtml(data) {
    if (data && data.dataReady) return '';
    return '<div class="analysis-v2-empty" data-analysis-empty-state="true">' +
      '<b>Noch keine echten Daten für diese Auswahl</b>' +
      '<p>Starte ein Training, eine Simulation oder einen Sprachkurs-Test. Danach ersetzt der Adapter diese Vorschau automatisch durch echte gespeicherte Werte.</p>' +
      '<div><span>Bereich: ' + esc((data && data.cfg && data.cfg.label) || 'Alle Bereiche') + '</span><span>Zeitraum: ' + esc((data && data.periodLabel) || '30 Tage') + '</span></div>' +
    '</div>';
  }

  function analysisV2Render(area, period, view) {
    var data = analysisV2Seed(area || 'all', period || 'days30', view || 'overview');
    var target = document.getElementById('analysisV2Dynamic');
    if (!target) return false;
    var score = Math.round(Number(data.cfg && data.cfg.score) || 0);
    var runs = Number(data.runs || data.scopedRecords || 0) || 0;
    var bestValue = Number(data.best || (data.cfg && data.cfg.best) || 0) || 0;
    var dataHint = data.dataReady ? (runs + ' echte Einträge') : 'Vorschau bis echte Daten vorliegen';
    var scoreValue = data.dataReady ? (score + '%') : '—';
    var bestText = data.dataReady ? (Math.round(bestValue) + '%') : '—';
    var forecastDetail = data.forecastDetail || {};
    var forecastText = data.dataReady ? (Math.round(Number(data.forecast)||0) + '%') : '—';
    target.innerHTML =
      analysisV2EmptyStateHtml(data) +
      '<div class="analysis-v2-kpis" data-analysis-kpis="real-adapter-values">' +
        analysisV2KpiHtml('Bereich', data.cfg.label, data.periodLabel, 'area') +
        analysisV2KpiHtml('Ø Leistung', scoreValue, data.dataReady ? data.viewLabel : 'wartet auf echte Ergebnisse', data.dataReady ? 'ok' : 'empty') +
        analysisV2KpiHtml('Trainingsläufe', data.dataReady ? runs : '0', data.dataReady ? 'passende Einträge' : 'keine gespeicherten Läufe', data.dataReady ? 'info' : 'empty') +
        analysisV2KpiHtml('Bestwert', bestText, data.dataReady ? 'höchster Wert im Filter' : 'noch nicht messbar', data.dataReady ? 'best' : 'empty') +
        analysisV2KpiHtml('Prognose', forecastText, data.dataReady ? (forecastDetail.riskLevel ? ('Risiko: ' + forecastDetail.riskLevel) : 'vorsichtig geschätzt') : 'nach mehreren Läufen aktiv', data.dataReady ? 'forecast' : 'empty') +
        analysisV2KpiHtml('Fokus', data.dataReady ? data.cfg.focus : 'Training starten', data.dataReady ? 'nächster Hebel' : 'erst Daten sammeln', data.dataReady ? 'focus' : 'empty') +
      '</div>' +
      '<div class="analysis-v2-data-chip"><b>Datenquelle:</b><span>' + esc(data.dataReady ? 'Echte gespeicherte Adapterwerte' : 'Sicherer Empty-State mit Vorschauwerten') + '</span></div>' +
      '<div class="analysis-v2-chart-card">' +
        '<div class="analysis-v2-chart-head"><b>Leistungsverlauf</b><span>' + esc(data.note || (data.dataReady ? 'aus gespeicherten Trainingsdaten' : 'Vorschau ohne echte Daten')) + '</span></div>' +
        analysisV2LineSvg(data) +
        analysisV2LegendHtml(data) +
      '</div>' +
      '<div class="analysis-v2-chart-card">' +
        '<div class="analysis-v2-chart-head"><b>Stärken & Schwächen</b><span>' + esc(data.dataReady ? ('echte Balken · schwächster Bereich zuerst') : 'wird nach echten Läufen präzise') + '</span></div>' +
        analysisV2BarsHtml(data) +
        analysisV2WeaknessHtml(data) +
      '</div>' +
      analysisV2ForecastHtml(data) +
      analysisV2ForecastChartHtml(data) +
      analysisV2ErrorAnalysisHtml(data) +
      analysisV2CoachInsightHtml(data);
    return true;
  }

  window.EGTAnalysisV2 = window.EGTAnalysisV2 || {};
  window.EGTAnalysisV2.version = 'G54.43.5-coach-interpretation-final';
  window.EGTAnalysisV2.refresh = function () {
    var area = (document.getElementById('analysisV2Area') || {}).value || 'all';
    var period = (document.getElementById('analysisV2Period') || {}).value || 'days30';
    var view = (document.getElementById('analysisV2View') || {}).value || 'overview';
    return analysisV2Render(area, period, view);
  };

  function openAnalysisDeepSheet() {
    var areaOptions = [
      { value:'all', label:'Alle Bereiche' }, { value:'language', label:'Sprachkurs' }, { value:'simulation', label:'Simulation' },
      { value:'ctc', label:'CTC/BPS' }, { value:'math', label:'Mathematik' }, { value:'logic', label:'Logik' },
      { value:'knowledge', label:'Allgemeinwissen' }, { value:'german', label:'Deutsch' }, { value:'english', label:'Englisch' }, { value:'it', label:'IT/FISI' }
    ];
    var periodOptions = [
      { value:'today', label:'Heute' }, { value:'days7', label:'7 Tage' }, { value:'days30', label:'30 Tage' },
      { value:'days90', label:'90 Tage' }, { value:'alltime', label:'Gesamt' }
    ];
    var viewOptions = [
      { value:'overview', label:'Übersicht' }, { value:'trend', label:'Verlauf' }, { value:'strengths', label:'Stärken & Schwächen' },
      { value:'forecast', label:'Prognose' }, { value:'errors', label:'Fehleranalyse' }
    ];
    var body =
      '<div class="analysis-v2-shell" data-analysis-dashboard-v2="G54.43.5">' +
        '<div class="analysis-v2-filter-grid">' +
          '<label><span>Bereich</span><select id="analysisV2Area" onchange="window.EGTAnalysisV2&&window.EGTAnalysisV2.refresh()">' + analysisV2OptionsHtml(areaOptions, 'all') + '</select></label>' +
          '<label><span>Zeitraum</span><select id="analysisV2Period" onchange="window.EGTAnalysisV2&&window.EGTAnalysisV2.refresh()">' + analysisV2OptionsHtml(periodOptions, 'days30') + '</select></label>' +
          '<label><span>Ansicht</span><select id="analysisV2View" onchange="window.EGTAnalysisV2&&window.EGTAnalysisV2.refresh()">' + analysisV2OptionsHtml(viewOptions, 'overview') + '</select></label>' +
        '</div>' +
        '<div id="analysisV2Dynamic" class="analysis-v2-dynamic"></div>' +
        '<div class="analysis-v2-actions">' +
          '<button type="button" class="ui-deep-primary" data-ui-action="practice">Schwächen trainieren</button>' +
          '<button type="button" class="ui-deep-secondary" data-ui-action="progress">Fortschritt kompakt</button>' +
        '</div>' +
      '</div>';
    var ok = openDeepSheet({ type:'analysis-dashboard-v2', theme:'green', title:'Analyse & Fortschritt', kicker:'Dashboard V2 · Coach-Auswertung', subtitle:'Kurze Interpretation aus Prognose, Top-Schwäche und Fehleranalyse.', iconHtml:'▥', bodyHtml:body });
    setTimeout(function(){ try { if (window.EGTAnalysisV2 && typeof EGTAnalysisV2.refresh === 'function') EGTAnalysisV2.refresh(); } catch(e){} }, 30);
    return ok;
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
        actionCardHtml('auth-open', 'Login & Profil', 'Zugangscode, Demo, Profil und UserDatabase öffnen', 'user') +
        actionCardHtml('login-open-core', 'Admin-Portal öffnen', 'Bestehendes Teilnehmer-, Dozenten- oder Adminportal', 'admin') +
        actionCardHtml('feedback-open-core', 'Feedback geben', 'Feedback- und Fehlerformular öffnen', 'feedback') +
        actionCardHtml('backup', 'Backup exportieren', 'Lokale Daten sichern', '⤓') +
        actionCardHtml('clear-cache', 'Cache löschen', 'PWA/Service-Worker Cache bereinigen', '↻') +
        actionCardHtml('clear-progress', 'Fortschritt zurücksetzen', 'Trainingsdaten bewusst löschen', '×') +
        actionCardHtml('branch-sheet', 'Fachrichtung wählen', 'IT, Sozial, Kaufmännisch oder Wissen auswählen', '◇') +
      '</div>';
    return openDeepSheet({ type:'settings-menu', theme:'blue', title:'Mehr & Einstellungen', kicker:'Menü', subtitle:'System, Daten und Einstellungen an einem Ort.', iconHtml:iconSvg('settings'), bodyHtml:body });
  }

  function openLoginDeepSheet() {
    var body =
      '<div class="ui-deep-grid">' +
        actionCardHtml('auth-login', 'Login', 'Mit bestehendem Teilnehmercode anmelden', 'user') +
        actionCardHtml('auth-redeem-code', 'Zugangscode einlösen', 'Registrierung mit Rolle und Gruppe vorbereiten', '▣') +
        actionCardHtml('auth-demo-start', 'Demo starten', 'Demo-Sitzung vorbereiten', '▶') +
        actionCardHtml('login-open-core', 'Admin-Portal', 'Bestehendes Admin-/Dozentenportal öffnen', 'admin') +
        actionCardHtml('branch-sheet', 'Fachrichtung wählen', 'Trainingsbereich wechseln', '◇') +
      '</div>';
    return openDeepSheet({ type:'login-menu', theme:'blue', title:'Login', kicker:'Menü', subtitle:'Teilnehmer, Dozent oder Admin anmelden.', iconHtml:iconSvg('admin'), bodyHtml:body });
  }

  function openFeedbackDeepSheet() {
    var body =
      '<div class="ui-deep-grid">' +
        actionCardHtml('feedback-open-core', 'Feedbackformular öffnen', 'Fehler melden oder Verbesserung notieren', 'feedback') +
        actionCardHtml('settings', 'Einstellungen', 'Weitere Systemaktionen ansehen', 'settings') +
      '</div>';
    return openDeepSheet({ type:'feedback-menu', theme:'rose', title:'Feedback', kicker:'Menü', subtitle:'Rückmeldung und Support an einem Ort.', iconHtml:iconSvg('feedback'), bodyHtml:body });
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
    return openDeepSheet({ type:'python-menu', theme:'green', title:'Python Quest', kicker:'Menü', subtitle:'Optionales Coding-Modul für IT-Interessierte öffnen.', iconHtml:iconSvg('python'), bodyHtml:body });
  }


  function branchSimulationModuleId(branchId) {
    if (branchId === 'it') return 'sim-it';
    if (branchId === 'kaufm') return 'sim-kaufm';
    if (branchId === 'sozial') return 'sim-sozial';
    return '';
  }

  function startBranchSimulation(branchId, modeKey, source) {
    var moduleId = branchSimulationModuleId(branchId || currentBranchId());
    try {
      if (moduleId && window.AppModuleHost && typeof AppModuleHost.startModule === 'function') {
        return AppModuleHost.startModule(moduleId, { branch: branchId || currentBranchId(), mode: modeKey || null, source: source || 'ui-home-phase5-branch-sim' });
      }
    } catch (e) {}
    try {
      if (window.AppModuleHost && typeof AppModuleHost.startSimulation === 'function') {
        return !!AppModuleHost.startSimulation({ branch: branchId || currentBranchId(), mode: modeKey || null, source: source || 'ui-home-phase5-fallback' });
      }
    } catch (e2) {}
    return false;
  }

  /* ── Start Module ─────────────────────────────────── */
  function startModule (mod) {
    var modeKey = pickMode(mod);
    try {
      if (mod && mod.id === 'simulation' && window.AppModuleHost && typeof AppModuleHost.startSimulation === 'function') {
        startBranchSimulation(currentBranchId(), modeKey, 'ui-home-startModule-phase5');
        notice(mod.label + ' startet…');
        return;
      }
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
  function normalizeTab (tab) {
    if (tab === TAB_HOME || tab === TAB_HIGHSCORE || tab === TAB_SIM || tab === TAB_DUELS || tab === TAB_PROFILE) return tab;
    var raw = String(tab == null ? 'home' : tab).toLowerCase().trim();
    if (raw === 'home' || raw === '0') return TAB_HOME;
    if (raw === 'highscore' || raw === 'ranking' || raw === '1') return TAB_HIGHSCORE;
    if (raw === 'simulation' || raw === 'sim' || raw === '2') return TAB_SIM;
    if (raw === 'duels' || raw === 'duelle' || raw === 'duel' || raw === '3') return TAB_DUELS;
    if (raw === 'profile' || raw === 'profil' || raw === 'user' || raw === '4') return TAB_PROFILE;
    return TAB_HOME;
  }

  function switchTab (tab) {
    var normalized = normalizeTab(tab);
    // Gate-Check: geschützte Tabs nur mit gültiger Session
    var FREE_TABS = { home: true, 0: true };
    if (!FREE_TABS[tab] && !FREE_TABS[normalized]) {
      try {
        var eng = window.EGTAuthEngine;
        if (eng && eng.ready && !eng.gateStatus().open) {
          window.dispatchEvent(new CustomEvent('egt:show-gate', { detail: { reason: eng.gateStatus().reason } }));
          return;
        }
      } catch (e) { }
    }

    if (normalized === TAB_SIM) { try { openSimulationCenterDeepSheet(); return; } catch (e) {} }
    if (String(tab).toLowerCase && String(tab).toLowerCase() === 'training') { try { openTrainingCenterDeepSheet(); return; } catch (e2) {} }
    if (String(tab).toLowerCase && String(tab).toLowerCase() === 'more') { try { openMoreDeepSheet(); return; } catch (e3) {} }

    activeTab = normalized;
    renderTabBar();
    renderTabContent();
    if (normalized === TAB_HIGHSCORE) {
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
      iconName: 'coach',
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
      iconName: 'progress',
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
        iconName: 'scan',
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
          '<div class="ui-mod-icon ' + esc(mod.iconClass) + '">' + moduleIconHtml(mod) + '</div>' +
          '<span class="ui-mod-label">' + esc(mod.label) + '</span>' +
        '</button>'
      );
    }).join('');
  }

  /* ── Render Bottom Dock ───────────────────────────────
     UI-G12: Bottom dock is a real foundation component.
     No glyph fallback, no image loading, no legacy tabbar classes. */
  function navIcon (name) {
    return iconSvg(name, 'egt-dock-svg');
  }

  function renderTabBar () {
    var tabs = $('egtBottomDock');
    if (!tabs) return;

    tabs.className = 'egt-bottom-dock egt-bottom-dock-g37 product-bottom-dock';
    tabs.setAttribute('aria-label', 'Hauptnavigation');
    tabs.setAttribute('role', 'navigation');

    var navItems = [
      { label: 'Home',       icon: 'dashboard', action: 'tab', tab: 'home' },
      { label: 'Simulation', icon: 'target',    action: 'simulation-center', center: true },
      { label: 'Training',   icon: 'practice',  action: 'training-center' },
      { label: 'Analyse',    icon: 'progress',  action: 'analysis' },
      { label: 'Mehr',       icon: 'more',      action: 'more-menu' }
    ];

    tabs.innerHTML = navItems.map(function (item) {
      var selected = (item.action === 'tab' && activeTab === TAB_HOME);
      var attrs = item.action === 'tab'
        ? 'data-ui-nav="tab" data-tab="' + esc(item.tab || 'home') + '"'
        : 'data-ui-action="' + esc(item.action) + '"';
      return (
        '<button type="button" class="egt-dock-btn' + (selected ? ' is-active' : '') + (item.center ? ' is-center-action' : '') + '" ' + attrs +
                ' aria-label="' + esc(item.label) + '">' +
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

    if (activeTab === TAB_HIGHSCORE) {
      renderHighscoreTab(content);
    } else if (activeTab === TAB_DUELS) {
      renderDuelsTab(content);
    } else if (activeTab === TAB_PROFILE) {
      renderProfileTab(content);
    } else {
      renderHighscoreTab(content);
    }
  }

  
  
  /* ── Highscore Tab ────────────────────────────────── */
  function renderHighscoreTab (el) {
    var shellHtml = '<div id="cloudHighscoreCard" class="ui-highscore-card"></div>';
    try {
      if (window.App && App._test && App._test.CloudHighscoreEngine && typeof App._test.CloudHighscoreEngine.renderShell === 'function') {
        shellHtml = App._test.CloudHighscoreEngine.renderShell();
      }
    } catch (e) {}

    el.innerHTML =
      '<div class="ui-analysis-wrap ui-highscore-page">' +
        '<div class="ui-section-title"><span class="ui-inline-icon">' + iconSvg('trophy', 'ui-inline-icon-svg') + '</span> Highscore</div>' +
        '<p class="ui-section-subtitle">Ranglisten, Zeiträume, Punkte, Entwicklung, Streaks, Belohnungen, Cloud-Status und lokale Sicherheitsliste.</p>' +
        shellHtml +
      '</div>';

    setTimeout(function () {
      try {
        if (window.App && typeof App.refreshCloudRanking === 'function') {
          App.refreshCloudRanking();
          return;
        }
      } catch (e) {}
      try { renderLocalHighscore($('cloudHighscoreCard')); } catch (e2) {}
    }, 80);
  }

  function renderDuelsTab (el) {
    var data = null;
    try { data = window.App && typeof App.highscoreData === 'function' ? App.highscoreData() : null; } catch (e) {}
    var duels = (data && data.duels) || [];
    var av = (data && data.avatarHtml) ? data.avatarHtml : function () { return ''; };
    var html =
      '<div class="ui-analysis-wrap ui-duel-page">' +
        '<div class="ui-section-title"><span class="ui-inline-icon">' + iconSvg('duel', 'ui-inline-icon-svg') + '</span> Duelle</div>' +
        '<p class="ui-section-subtitle">Eigener Wettkampfbereich. Highscore bleibt Ranking, Duelle bleiben Challenge.</p>' +
        '<div class="ui-action-card-grid ui-g37-duel-actions">' +
          '<button type="button" class="ui-action-card" data-ui-action="duel-mode"><b>Duell starten</b><small>2 Spieler lokal oder online vorbereiten</small></button>' +
          '<button type="button" class="ui-action-card" data-ui-action="simulation-center"><b>Simulation trainieren</b><small>Prüfungsdaten für spätere Duelle sammeln</small></button>' +
        '</div>' +
        '<div class="ui-deep-section-label">Letzte Duelle</div>';
    if (duels.length) {
      html += '<div class="hs-duel-list">' + duels.slice(0, 12).map(function (d) {
        var when = d.ts ? new Date(d.ts).toLocaleDateString('de-DE') : '';
        var p1 = d.p1 || { name: 'Spieler 1', correct: 0 };
        var p2 = d.p2 || { name: 'Spieler 2', correct: 0 };
        var winner = d.winner ? '<div class="hs-duel-winner">' + av(d.winner, 30) + ' <b>' + esc(d.winner) + '</b> gewinnt</div>' : '<div class="hs-duel-winner tie">Unentschieden</div>';
        return '<div class="hs-duel-card">' + winner +
          '<div class="hs-duel-score">' + av(p1.name, 24) + ' ' + esc(p1.name) + ' <b>' + esc(p1.correct) + ' : ' + esc(p2.correct) + '</b> ' + esc(p2.name) + ' ' + av(p2.name, 24) + '</div>' +
          '<div class="hs-duel-meta">' + (d.mode === 'online' ? 'Online' : 'Lokal') + ' · ' + esc(d.total || 12) + ' Aufgaben · ' + esc(when) + '</div>' +
        '</div>';
      }).join('') + '</div>';
    } else {
      html += '<div class="ui-deep-empty">Noch keine Duelle gespielt. Starte ein Duell über den Button oben.</div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function renderProfileTab (el) {
    el.innerHTML =
      '<div class="ui-analysis-wrap ui-profile-page">' +
        '<div class="ui-section-title"><span class="ui-inline-icon">' + iconSvg('user', 'ui-inline-icon-svg') + '</span> Profil</div>' +
        '<p class="ui-section-subtitle">Benutzer, Avatar, Zugangscode, Gruppe, Einstellungen sowie Admin-/Dozentenfunktionen bleiben an einem Ort.</p>' +
        '<div class="ui-action-card-grid">' +
          '<button type="button" class="ui-action-card" data-ui-action="profile-open"><b>Profil öffnen</b><small>Benutzerbereich und Login</small></button>' +
          '<button type="button" class="ui-action-card" data-ui-action="settings"><b>Einstellungen</b><small>App, Darstellung und Daten</small></button>' +
          '<button type="button" class="ui-action-card" data-ui-action="admin-open"><b>Admin / Dozent</b><small>Gruppen, Codes und Kontrolle</small></button>' +
        '</div>' +
      '</div>';
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
      var medal = idx === 0 ? '1.' : idx === 1 ? '2.' : idx === 2 ? '3.' : '';
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
          '<button type="button" class="ui-sys-btn" data-ui-action="feedback" id="uiBtnFeedback"><span class="ui-inline-icon">' + iconSvg('feedback', 'ui-inline-icon-svg') + '</span>Feedback geben</button>' +
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
        /* G54.42.6 · Analyse Legacy-Restpfad Fix
           Dieser Profil/System-Button darf nicht mehr direkt App.showAnalysis()
           aufrufen, weil dadurch die alte Legacy-Seite #analysis sichtbar werden
           kann. Primär wird der moderne Analyse-Entry/Deep-Sheet-Pfad genutzt. */
        if (window.EGTAnalysisEntryModule && typeof EGTAnalysisEntryModule.open === 'function') {
          EGTAnalysisEntryModule.open('profile-system-analysis-button');
        } else if (window.EGTUILayer && typeof EGTUILayer.openActionMenu === 'function') {
          EGTUILayer.openActionMenu('analysis') || EGTUILayer.openActionMenu('progress');
        } else if (window.App && typeof App.showAnalysis === 'function') {
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
        '<div class="ui-sheet-icon c-slate">' + iconSvg('scan') + '</div>' +
        '<div class="ui-sheet-info">' +
          '<div class="ui-sheet-name">OCR Scanner</div>' +
          '<div class="ui-sheet-kicker">' + kicker + '</div>' +
        '</div>' +
        '<button class="ui-sheet-close" id="uiScanClose" aria-label="Schließen">×</button>' +
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
        '<button class="ui-btn-info" id="uiScanCopy">Kopieren</button>' +
        '<button class="ui-btn-info" id="uiScanAgain">Neu scannen</button>' +
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
              '<span class="ui-app-sub">Simulation · Training · Analyse</span>' +
            '</div>' +
          '</div>' +
          '<div class="ui-topbar-chips">' +
            '<button type="button" class="ui-branch-chip ui-hidden" id="uiBranchChip" aria-label="Fachrichtung wechseln" data-ui-action="branch-sheet">IT / FISI</button>' +
            '<button class="ui-login-btn" id="uiLoginBtn" aria-label="Login" data-ui-action="auth-open"><span class="ui-login-avatar" aria-hidden="true"></span><span class="ui-login-label">Login</span></button>' +
          '</div>' +
        '</header>' +

        '<main class="ui-home-scroll" id="uiHomeViewport">' +
          '<section class="ui-hero-ui product-home-hero" aria-label="Simulation starten">' +
            '<div class="ui-hero-copy">' +
              '<span class="ui-hero-pill">Simulationstrainer</span>' +
              '<h1 class="ui-hero-title">Simulation zuerst.<span>Training gezielt.</span></h1>' +
              '<p>Starte prüfungsnahe BPS- oder CTC-Simulationen. Training, Coach und Analyse helfen dir danach gezielt weiter.</p>' +
              '<button class="ui-hero-cta" type="button" data-ui-action="simulation-center"><span class="ui-inline-icon">' + iconSvg('target', 'ui-inline-icon-svg') + '</span>Simulation starten</button>' +
            '</div>' +
            '<div class="ui-hero-visual" aria-hidden="true"><picture><source media="(hover: none) and (pointer: coarse)" srcset="./assets/ui/hero-target-ios.svg"><img class="ui-hero-target" src="./assets/ui/hero-target.svg" alt=""></picture></div>' +
          '</section>' +

          '<section class="ui-sim-hero" aria-label="Eignungstest Simulation">' +
            '<button type="button" class="ui-sim-hero-card" data-ui-action="simulation-center">' +
              '<span class="ui-sim-hero-icon" aria-hidden="true">' + iconSvg('target') + '</span>' +
              '<span class="ui-sim-hero-copy">' +
                '<span class="ui-sim-kicker">Kernfunktion · Prüfungsnah</span>' +
                '<b>Simulation Center</b>' +
                '<small>Bereich wählen, BPS oder CTC starten, keine Hilfe im Test, Auswertung und KI-Coach erst danach.</small>' +
              '</span>' +
              '<span class="ui-sim-hero-cta">Center öffnen ›</span>' +
            '</button>' +
          '</section>' +

          '<section class="ui-section-title-block">' +
            '<h2>Trainingsbereich wählen</h2>' +
            '<p>Wähle deinen Bereich und starte dein individuelles Training.</p>' +
          '</section>' +
          '<section class="ui-training-area-grid" aria-label="Trainingsbereich wählen">' +
            '<button type="button" class="ui-training-area-card ui-area-it" data-ui-action="branch-training" data-branch="it">' +
              '<span class="ui-area-icon">' + iconSvg('it') + '</span><b>IT / FISI</b><small>Informatik & Fachinformatik</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-social" data-ui-action="branch-training" data-branch="sozial">' +
              '<span class="ui-area-icon">' + iconSvg('social') + '</span><b>Sozialpädagogik</b><small>Erzieher*in & Sozialpädagogik</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-kaufm" data-ui-action="branch-training" data-branch="kaufm">' +
              '<span class="ui-area-icon">' + iconSvg('kaufm') + '</span><b>Kaufmännisch</b><small>Büro, Verwaltung & Rechnen</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-knowledge" data-ui-action="training-center">' +
              '<span class="ui-area-icon">' + iconSvg('knowledge') + '</span><b>Allgemeinwissen</b><small>Wissen testen & erweitern</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-individual language-course-hero-card" data-ui-action="language-course-open">' +
              '<span class="ui-area-icon">' + iconSvg('language') + '</span><b>Sprachkurs</b><small>Deutsch/Türkisch · A1–C2 vorbereitet</small>' +
            '</button>' +
            '<button type="button" class="ui-training-area-card ui-area-individual" data-ui-action="training-center">' +
              '<span class="ui-area-icon">' + iconSvg('individual') + '</span><b>Individuell</b><small>Eigene Stärken trainieren</small>' +
            '</button>' +
          '</section>' +

          '<section class="ui-section-title-block product-recommend-title">' +
            '<h2>Heute empfohlen</h2>' +
            '<p>Dynamische Kurzwege statt doppelter Übungslisten.</p>' +
          '</section>' +
          '<section class="ui-quick-grid product-recommend-grid" aria-label="Heute empfohlen">' +
            '<button type="button" class="ui-quick-card ui-area-it" data-ui-action="simulation-center"><span class="ui-quick-icon">' + iconSvg('target') + '</span><b>BPS/CTC wählen</b><small>Simulation Center</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-social" data-ui-action="training-center"><span class="ui-quick-icon">' + iconSvg('practice') + '</span><b>Gezielt trainieren</b><small>Berufsfeld oder Einzeltraining</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-knowledge" data-ui-action="analysis"><span class="ui-quick-icon">' + iconSvg('progress') + '</span><b>Prüfungsreife</b><small>Analyse & Fortschritt</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-individual" data-ui-action="coach"><span class="ui-quick-icon">' + iconSvg('coach') + '</span><b>KI-Coach</b><small>Empfehlung & Erklärung</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-it" data-ui-action="python-quest"><span class="ui-quick-icon">' + iconSvg('python') + '</span><b>Python fortsetzen</b><small>Levelsystem</small></button>' +
            '<button type="button" class="ui-quick-card language-course-hero-card" data-ui-action="language-course-open"><span class="ui-quick-icon">' + iconSvg('language') + '</span><b>Sprachkurs</b><small>Deutsch/Türkisch öffnen</small></button>' +
            '<button type="button" class="ui-quick-card ui-area-social" data-ui-action="more-menu"><span class="ui-quick-icon">' + iconSvg('more') + '</span><b>Mehr</b><small>Profil, Highscore, Duell, Admin</small></button>' +
          '</section>' +

          '<section class="ui-banner">' +
            '<div class="ui-banner-left"><div class="ui-gem">◇</div><div><b>Deine Prüfungsreife</b><span>Prognose, Schwächen und nächster sinnvoller Schritt.</span></div></div>' +
            '<button class="ui-btn" type="button" data-ui-action="analysis">Analyse öffnen ›</button>' +
          '</section>' +

          '<div class="ui-grid-wrap ui-runtime-grid-holder" id="uiModuleGridWrap" hidden><div class="ui-grid" id="uiModuleGrid" role="grid" aria-label="Trainingsmodule"></div><div class="ui-home-feedback-wrap"><button class="ui-home-feedback-btn" id="uiHomeFeedbackBtn"><span class="ui-inline-icon">' + iconSvg('feedback', 'ui-inline-icon-svg') + '</span>App bewerten / Feedback</button></div></div>' +
        '</main>' +

        '<div class="ui-tab-content" id="uiTabContent" style="display:none"></div>' +
        '<nav class="egt-bottom-dock" id="egtBottomDock" aria-label="Navigation" role="tablist"></nav>' +
      '</div>';

    start.insertBefore(shell, start.firstChild);
    if (typeof hideRuntimeAnchors === 'function') {
      hideRuntimeAnchors(shell);
    }
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
        // G35.0: Top-right user button is owned by auth-profile-shell.js.
        // Legacy Admin/Learner text updates intentionally removed to avoid distributed user UI.

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

    setTimeout(function () { if (!window.matchMedia || !window.matchMedia('(max-width: 780px)').matches) notice('Eignungstest-Trainer bereit. Viel Erfolg!'); }, 600);
  }

  /* ── Boot ─────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildShell);
  } else {
    buildShell();
  }

  /* ── Public API ───────────────────────────────────── */
  function openDuelSheet () {
    var data = null;
    try { data = window.App && typeof App.highscoreData === 'function' ? App.highscoreData() : null; } catch (e) {}
    var av = (data && data.avatarHtml) ? data.avatarHtml : function () { return ''; };
    var duels = (data && data.duels) || [];
    var body =
      '<div class="ui-deep-section-label"><span class="ui-inline-icon">' + iconSvg('duel', 'ui-inline-icon-svg') + '</span> Duell-Zentrale</div>' +
      '<div class="ui-action-card-grid ui-g37-duel-actions">' +
        '<button type="button" class="ui-action-card" data-ui-action="duel-mode"><b>Duell starten</b><small>Lokal oder online spielen</small></button>' +
        '<button type="button" class="ui-action-card" data-ui-action="simulation-center"><b>Simulation öffnen</b><small>Prüfungsmodus als Grundlage</small></button>' +
      '</div>' +
      '<div class="ui-deep-section-label">Letzte Duelle</div>';
    if (duels.length) {
      body += '<div class="hs-duel-list">' + duels.slice(0, 10).map(function (d) {
        var when = d.ts ? new Date(d.ts).toLocaleDateString('de-DE') : '';
        var p1 = d.p1 || { name: 'Spieler 1', correct: 0 };
        var p2 = d.p2 || { name: 'Spieler 2', correct: 0 };
        var banner = d.winner
          ? '<div class="hs-duel-winner">' + av(d.winner, 30) + ' <b>' + esc(d.winner) + '</b> gewinnt</div>'
          : '<div class="hs-duel-winner tie">Unentschieden</div>';
        return '<div class="hs-duel-card">' + banner +
          '<div class="hs-duel-score">' + av(p1.name, 24) + ' ' + esc(p1.name) + ' <b>' + esc(p1.correct) + ' : ' + esc(p2.correct) + '</b> ' + esc(p2.name) + ' ' + av(p2.name, 24) + '</div>' +
          '<div class="hs-duel-meta">' + (d.mode === 'online' ? 'Online' : 'Lokal') + ' · ' + esc(d.total || 12) + ' Aufgaben · ' + esc(when) + '</div></div>';
      }).join('') + '</div>';
    } else {
      body += '<div class="ui-deep-empty">Noch keine Duelle gespielt. Fordere jemanden heraus.</div>';
    }
    return openDeepSheet({
      type: 'duel', theme: 'red', title: 'Duelle', kicker: 'Wettkampf',
      subtitle: 'Separater Bereich für Challenge, Verlauf und direkte Duellstarts.', iconHtml: iconSvg('duel'),
      bodyHtml: body
    });
  }

  function openHighscoreSheet () {
    var data = null;
    try { data = window.App && typeof App.highscoreData === 'function' ? App.highscoreData() : null; } catch (e) {}
    var body = '';
    if (data && data.prognosisHtml) body += data.prognosisHtml;
    body += '<div class="ui-deep-section-label"><span class="ui-inline-icon">' + iconSvg('trophy', 'ui-inline-icon-svg') + '</span> Highscore</div>' +
      '<div class="ui-deep-empty">Highscore ist jetzt ein eigener Bottom-Menüpunkt mit Ranking, Zeiträumen, Diagrammen, Streaks und Cloud-Status.</div>' +
      '<button type="button" class="ui-deep-primary" data-ui-nav="tab" data-tab="highscore" style="width:100%;margin:10px 0 16px"><span class="ui-inline-icon">' + iconSvg('trophy', 'ui-inline-icon-svg') + '</span>Highscore öffnen</button>';
    var top = (data && data.top) || [];
    if (top.length) {
      body += '<div class="hs-list">' + top.slice(0,5).map(function (r, i) {
        return '<div class="hs-row"><span class="hs-pos">' + (i + 1) + '</span><span class="hs-main">' + esc(r.name) + ' <small>' + esc(String(r.mode).replace(/^\d+\.\s*/, '')) + '</small></span><span class="hs-score">' + esc(r.percent) + '%</span></div>';
      }).join('') + '</div>';
    }
    return openDeepSheet({
      type: 'highscore', theme: 'orange', title: 'Highscore', kicker: 'Ranking',
      subtitle: 'Ranking bleibt getrennt von Duellen.', iconHtml: iconSvg('trophy'), bodyHtml: body
    });
  }

  window.EGTUILayer = {
    version: VERSION,
    notice: notice,
    refresh: function () { updateTopBar(); renderGrid(); },
    switchTab: switchTab,
    openPracticeMode: function (mode) { return openPracticeDeepSheet((mode === 'learn') ? 'learn' : 'practice'); },
    openDeepSheet: openDeepSheet,
    openHighscoreSheet: openHighscoreSheet,
    openDuelSheet: openDuelSheet,
    openSimulationCenter: openSimulationCenterDeepSheet,
    openTrainingCenter: openTrainingCenterDeepSheet,
    openBranchTraining: openBranchTrainingDeepSheet,
    openMoreMenu: openMoreDeepSheet,
    openSheet: openSheet,
    openBranchMenu: openBranchMenu,
    openActionMenu: function (kind) {
      if (kind === 'simulation-center') return openSimulationCenterDeepSheet();
      if (kind === 'training-center') return openTrainingCenterDeepSheet();
      if (kind === 'more-menu') return openMoreDeepSheet();
      if (kind === 'practice') return openTrainingCenterDeepSheet();
      if (kind === 'learn') return openTrainingCenterDeepSheet();
      if (kind === 'coach') return openCoachDeepSheet();
      if (kind === 'analysis') return openAnalysisDeepSheet();
      if (kind === 'progress') return openProgressDeepSheet();
      if (kind === 'settings') return openSettingsDeepSheet();
      if (kind === 'login') return openLoginDeepSheet();
      if (kind === 'feedback') return openFeedbackDeepSheet();
      if (kind === 'scan') return openScanDeepSheet();
      if (kind === 'python') return openPythonQuestDeepSheet();
      if (kind === 'language-course') { try { if (window.LanguageAcademyCourseEntry && typeof window.LanguageAcademyCourseEntry.open === 'function') return window.LanguageAcademyCourseEntry.open(); } catch(e){} return false; }
      return false;
    },
    closeSheet: closeSheet,
    startModule: startModule,
    moduleById: moduleById,
    scan: scanQRCode,
    setBranch: function (branchId) { if (!branchId) return; localStorage.setItem('bps_branch', branchId); updateTopBar(); renderGrid(); if (activeTab === TAB_PROFILE) { var c = $('uiTabContent'); if (c) renderProfileTab(c); } },
    clearCaches: clearCaches,
    modules: MODULES,
    branchContent: BRANCH_CONTENT,
    openBranchSelection: function (allowClose) { openBranchSelectionSheet(allowClose); }
  };

  try { window.EGTUIHomeLayer = window.EGTUILayer; } catch(e) {}
})();
