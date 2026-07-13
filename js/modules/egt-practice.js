/* ════════════════════════════════════════════════════════════════
   egt-practice.js — Phase 4 freies Lern-/Übungsmodul
   Zweck: Üben/Lernen als echtes Fachmodul mit ruhigem Lernbereich,
   Coach-Hilfe, Verständnishilfen und kontrolliertem Start in bestehende
   Trainingsmodi kapseln. Simulation bleibt getrennt.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G42.0-phase4';
  var MODULE_ID = 'practice';
  var state = {
    mode: 'practice',
    branch: 'it',
    selectedCategory: 'math',
    selectedMode: 'math',
    mounted: false
  };

  var CATEGORIES = [
    {
      id: 'math',
      title: 'Mathe verstehen',
      icon: '➗',
      desc: 'Kopfrechnen, Grundrechnen, Textaufgaben und Verhältnisrechnung ohne Simulationsdruck.',
      modes: [
        { id: 'math', title: 'Mathe Grundlagen', note: 'ruhig rechnen, Erklärung lesen' },
        { id: 'mathSprint', title: 'Mathe Sprint', note: 'kurzer Block für Tempo' },
        { id: 'textMathSprint', title: 'Textaufgaben', note: 'Aufgabe lesen, Rechenweg erkennen' },
        { id: 'algebraSprint', title: 'Gleichungen', note: 'Umformen Schritt für Schritt' },
        { id: 'ratioLogicSprint', title: 'Verhältnis / Regel', note: 'Muster und Brüche trainieren' }
      ]
    },
    {
      id: 'logic',
      title: 'Logik & Muster',
      icon: '🧩',
      desc: 'Zahlenreihen, Aussagen, Symbolfolgen und Matrixdenken langsam begreifen.',
      modes: [
        { id: 'logic', title: 'Logik Grundlagen', note: 'klassische Muster' },
        { id: 'logicSprint', title: 'Logik Sprint', note: 'kurze schnelle Serie' },
        { id: 'numberSeriesBookSprint', title: 'Zahlenreihen', note: 'Differenzen, Faktoren, Wechselmuster' },
        { id: 'symbolLogicSprint', title: 'Symbole', note: 'Formen und Reihenfolge' },
        { id: 'matrixOnlySprint', title: 'Matrizen', note: 'Reihe, Spalte, Rotation, Anzahl' }
      ]
    },
    {
      id: 'focus',
      title: 'Konzentration',
      icon: '⚡',
      desc: 'Aufmerksamkeit, visuelles Scannen und Fehlerfinden mit besser lesbarer Übungslogik.',
      modes: [
        { id: 'concentrationPro', title: 'Konzentration Pro', note: 'ruhig und genau scannen' },
        { id: 'concentrationSprint', title: 'Konzentration Sprint', note: 'Tempo steigern' },
        { id: 'errorTrainingPrep', title: 'Fehlersuche', note: 'Blicksprünge und Details' },
        { id: 'visualIQ', title: 'Visual IQ', note: 'räumliches Denken' },
        { id: 'visualIQSprint', title: 'Visual Sprint', note: 'kurzer visueller Block' }
      ]
    },
    {
      id: 'language',
      title: 'Sprache & Wissen',
      icon: '📚',
      desc: 'Deutsch, Englisch, Satzlogik, Textverständnis und Allgemeinwissen wiederholen.',
      modes: [
        { id: 'general', title: 'Allgemeinwissen', note: 'Fragen mit Erklärung' },
        { id: 'knowledgeSprint', title: 'Wissen Sprint', note: 'kurzer Wissensblock' },
        { id: 'english', title: 'Englisch', note: 'Wortschatz und Grammatik' },
        { id: 'sentenceSprint', title: 'Satzergänzung', note: 'Beziehung im Satz erkennen' },
        { id: 'textComprehensionSprint', title: 'Textverständnis', note: 'lesen, markieren, schlussfolgern' }
      ]
    },
    {
      id: 'it',
      title: 'IT / FISI',
      icon: '💻',
      desc: 'Hardware, Netzwerk, Security, Windows/Linux und IT-Grundlagen für die FISI-Vorbereitung.',
      modes: [
        { id: 'it', title: 'IT Grundlagen', note: 'Basiswissen ohne Druck' },
        { id: 'itSprint', title: 'IT Sprint', note: 'kurzer FISI-Block' },
        { id: 'techniqueSprint', title: 'Technikverständnis', note: 'Mechanik und technische Logik' },
        { id: 'routeMemoryMode', title: 'Route merken', note: 'visuelle Merkfähigkeit' }
      ]
    }
  ];

  function emit(name, detail) {
    var payload = detail || {};
    payload.version = payload.version || VERSION;
    try { document.dispatchEvent(new CustomEvent('egt:module:practice:' + name, { detail: payload })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:practice:' + name, payload); } catch (e2) {}
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c] || c;
    });
  }

  function categoryById(id) {
    return CATEGORIES.find(function (cat) { return cat.id === id; }) || CATEGORIES[0];
  }

  function selectedCategory() { return categoryById(state.selectedCategory); }

  function selectedModeDef() {
    var cat = selectedCategory();
    return (cat.modes || []).find(function (item) { return item.id === state.selectedMode; }) || (cat.modes || [])[0];
  }

  function branchInfo() {
    try { if (window.AppModuleHost && typeof AppModuleHost.getBranch === 'function') return AppModuleHost.getBranch(state.branch); } catch (e) {}
    return { id: state.branch || 'it', label: 'IT / FISI', icon: '💻' };
  }

  function ensureShell() {
    var root = document.getElementById('egtPracticeModuleRoot');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'egtPracticeModuleRoot';
    root.className = 'egt-practice-root';
    root.innerHTML = '<div class="egt-practice-backdrop" data-practice-action="close"></div><section class="egt-practice-shell" role="dialog" aria-modal="true" aria-labelledby="egtPracticeTitle"><div class="egt-practice-content" id="egtPracticeContent"></div></section>';
    document.body.appendChild(root);
    root.addEventListener('click', onClick);
    state.mounted = true;
    return root;
  }

  function cardHtml(cat) {
    var active = cat.id === state.selectedCategory;
    return '<button type="button" class="egt-practice-category ' + (active ? 'active' : '') + '" data-practice-action="category" data-category="' + esc(cat.id) + '">' +
      '<span>' + esc(cat.icon) + '</span><b>' + esc(cat.title) + '</b><small>' + esc(cat.desc) + '</small></button>';
  }

  function modeHtml(mode) {
    var active = mode.id === state.selectedMode;
    return '<button type="button" class="egt-practice-mode ' + (active ? 'selected' : '') + '" data-practice-action="mode" data-mode="' + esc(mode.id) + '">' +
      '<span class="egt-practice-mode-check">' + (active ? '✓' : '+') + '</span><span><b>' + esc(mode.title) + '</b><small>' + esc(mode.note || 'Übungsblock') + '</small></span></button>';
  }

  function render() {
    var root = ensureShell();
    var content = root.querySelector('#egtPracticeContent');
    var cat = selectedCategory();
    var mode = selectedModeDef() || { id: state.selectedMode, title: state.selectedMode, note: '' };
    var branch = branchInfo() || {};
    var learn = state.mode === 'learn';
    content.innerHTML =
      '<div class="egt-practice-head">' +
        '<div><span class="egt-practice-kicker">' + esc(branch.icon || '📘') + ' ' + esc(branch.label || 'Lernbereich') + '</span>' +
        '<h2 id="egtPracticeTitle">' + (learn ? 'Lernmodus' : 'Freies Üben') + '</h2>' +
        '<p>Ruhiger Bereich zum Verstehen. Keine Prüfungssimulation, kein harter Testdruck, sondern Hinweise, Sofortfeedback und bewusste Wiederholung.</p></div>' +
        '<button type="button" class="egt-practice-close" data-practice-action="close" aria-label="Schließen">×</button>' +
      '</div>' +
      '<div class="egt-practice-alert"><b>Abgrenzung zur Simulation:</b> Hier darfst du langsam arbeiten, Erklärungen lesen und Fehler direkt nutzen. Die echte Simulation bleibt separat und prüfungsnah.</div>' +
      '<div class="egt-practice-layout">' +
        '<aside class="egt-practice-side"><h3>Bibliothek</h3><div class="egt-practice-categories">' + CATEGORIES.map(cardHtml).join('') + '</div></aside>' +
        '<main class="egt-practice-main">' +
          '<section class="egt-practice-panel"><div class="egt-practice-panel-title"><span>' + esc(cat.icon) + '</span><div><h3>' + esc(cat.title) + '</h3><p>' + esc(cat.desc) + '</p></div></div>' +
          '<div class="egt-practice-modes">' + (cat.modes || []).map(modeHtml).join('') + '</div></section>' +
          '<section class="egt-practice-help"><h3>Coach-Hilfe</h3><p><b>Empfohlen:</b> ' + esc(mode.title) + ' starten, jeden Fehler lesen und das Muster danach laut oder schriftlich zusammenfassen.</p>' +
          '<div class="egt-practice-help-grid"><div><b>1. Verstehen</b><span>Regel erkennen, nicht raten.</span></div><div><b>2. Anwenden</b><span>Aufgabe lösen und Erklärung prüfen.</span></div><div><b>3. Wiederholen</b><span>Fehler später erneut trainieren.</span></div></div>' +
          '<div class="egt-practice-placeholder"><b>Vorbereitet:</b> Live-Chat, Coach-Frage und Duell-Anfrage bleiben Platzhalter für spätere Module.</div></section>' +
        '</main>' +
      '</div>' +
      '<div class="egt-practice-actions"><button type="button" class="btn btn-secondary" data-practice-action="coach">Coach öffnen</button><button type="button" class="btn btn-secondary" data-practice-action="legacy">Altes Trainingsmenü</button><button type="button" class="btn btn-primary" data-practice-action="start">Ausgewählte Übung starten</button></div>';
    return root;
  }

  function open(options) {
    options = options || {};
    state.mode = options.mode === 'learn' || options.entry === 'learn' ? 'learn' : 'practice';
    state.branch = options.branch || options.branchId || state.branch || 'it';
    if (options.category) state.selectedCategory = categoryById(options.category).id;
    var cat = selectedCategory();
    if (options.trainingMode) state.selectedMode = String(options.trainingMode);
    if (!cat.modes.some(function (m) { return m.id === state.selectedMode; })) state.selectedMode = (cat.modes[0] || {}).id || 'math';
    var root = render();
    requestAnimationFrame(function () {
      root.classList.add('show');
      document.body.classList.add('egt-practice-open', 'assessments-sheet-open');
    });
    emit('opened', { mode: state.mode, branch: state.branch, category: state.selectedCategory, trainingMode: state.selectedMode });
    return true;
  }

  function close() {
    var root = document.getElementById('egtPracticeModuleRoot');
    if (root) root.classList.remove('show');
    document.body.classList.remove('egt-practice-open', 'assessments-sheet-open');
    emit('closed', { mode: state.mode, branch: state.branch });
    return true;
  }

  function selectCategory(id) {
    var cat = categoryById(id);
    state.selectedCategory = cat.id;
    state.selectedMode = (cat.modes[0] || {}).id || state.selectedMode;
    render();
    emit('category:selected', { category: state.selectedCategory, trainingMode: state.selectedMode });
  }

  function selectMode(id) {
    state.selectedMode = String(id || state.selectedMode || 'math');
    render();
    emit('mode:selected', { category: state.selectedCategory, trainingMode: state.selectedMode });
  }

  function startSelected() {
    var mode = state.selectedMode || 'math';
    close();
    try { if (window.App && typeof App.chooseTrainingMode === 'function') App.chooseTrainingMode(mode); } catch (e) {}
    try { if (window.App && typeof App.prepareTest === 'function') { App.prepareTest(); emit('startedTraining', { trainingMode: mode, category: state.selectedCategory }); return true; } } catch (e2) { emit('error', { error: e2 && e2.message ? e2.message : String(e2) }); }
    try { if (window.App && typeof App.openTrainingSheet === 'function') { App.openTrainingSheet(); return true; } } catch (e3) {}
    return false;
  }

  function openCoach() {
    try { if (window.AppModuleHost && typeof AppModuleHost.startModule === 'function') return AppModuleHost.startModule('coach-entry', { source: 'practice-module', branch: state.branch }); } catch (e) {}
    try { if (window.EGTLearningCoach && typeof EGTLearningCoach.open === 'function') return EGTLearningCoach.open(); } catch (e2) {}
    return false;
  }

  function openLegacy() {
    close();
    try { if (window.App && typeof App.openTrainingSheet === 'function') return App.openTrainingSheet(); } catch (e) {}
    try { if (window.EGTUILayer && typeof EGTUILayer.openPracticeMode === 'function') return EGTUILayer.openPracticeMode(state.mode); } catch (e2) {}
    return false;
  }

  function onClick(ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-practice-action]') : null;
    if (!el) return;
    var action = el.getAttribute('data-practice-action');
    ev.preventDefault();
    ev.stopPropagation();
    if (action === 'close') return close();
    if (action === 'category') return selectCategory(el.getAttribute('data-category'));
    if (action === 'mode') return selectMode(el.getAttribute('data-mode'));
    if (action === 'start') return startSelected();
    if (action === 'coach') return openCoach();
    if (action === 'legacy') return openLegacy();
  }

  function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    return open({
      mode: payload.mode || payload.entry || 'practice',
      branch: ctx && ctx.branch ? ctx.branch.id : payload.branch,
      category: payload.category,
      trainingMode: payload.trainingMode || payload.modeId
    });
  }

  function stop(payload) {
    close();
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch' });
    return true;
  }

  var api = Object.freeze({
    __version: VERSION,
    open: open,
    close: close,
    start: start,
    stop: stop,
    selectCategory: selectCategory,
    selectMode: selectMode,
    startSelected: startSelected,
    categories: function () { return JSON.parse(JSON.stringify(CATEGORIES)); }
  });

  window.EGTPracticeModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: MODULE_ID,
      label: 'Freies Lernen / Üben',
      version: VERSION,
      branchAware: true,
      start: start,
      stop: stop
    });
  } else {
    console.warn('[EGTPracticeModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }

  emit('ready', { module: MODULE_ID });
})();
