/* ════════════════════════════════════════════════════════════════
   egt-simulation-engine.js — Phase 2B Simulation ModuleHost
   Ziel: Simulation als eigene Orchestrierungs-Schicht aus app.js lösen,
   ohne bestehende Legacy-Spezialfälle zu beschädigen.

   Phase 2A: Start/Finish/Abort + Events.
   Phase 2B: Kontroll-API für zentrale Simulationsfunktionen:
   showQuestion, tickTimer, renderAnswers, updateQuestionNav,
   chooseAnswer, recordAnswer, nextQuestion, showResult.

   Phase 2C: Standard-Multiple-Choice-Rendering physisch ins
   Simulationsmodul verschoben. EDV-Multi und Route-Memory bleiben
   vorerst bewusst als Spezialadapter in der App-Shell.

   Phase 2D: Fragenübersicht / updateQuestionNav physisch ins
   Simulationsmodul verschoben. Die App-Shell liefert nur noch
   kontrollierte Hooks für Drawer, Sprunglogik und Total-Berechnung.

   Phase 2E: Result-Grenze definiert. Score-/Meta-Berechnung und
   Ergebnis-Kopfbereich werden im Simulationsmodul vorbereitet;
   CategoryStats, Review, Highscore und Coach bleiben kontrollierte
   Shell-Hooks, bis diese Bereiche einzeln herausgelöst werden.

   Phase 2F: Route-Memory / Busfahrtroute als erster Spezialrenderer
   ins Simulationsmodul migriert. Rendering, Auswahl, Undo, Clear und
   Submit laufen im Modul; App-Shell liefert nur noch Aufzeichnungs-,
   Fortschritts- und Navigations-Hooks.

   Phase 2G: EDV-Multi als zweiter Spezialrenderer ins Simulationsmodul
   migriert. Auswahlpanel, Node-Toggle, Undo, Clear und Submit laufen
   im Modul; App-Shell liefert nur noch Visual-, History-, Progress-
   und Navigations-Hooks.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MODULE_NAME = 'EGTSimulation';
  var VERSION = 'G40.7-phase2g';

  var adapter = null;
  var activeSession = null;
  var sessionCounter = 0;
  var listeners = Object.create(null);
  var qnavManualPage = null;
  var inDelegation = Object.create(null);

  function nowIso() {
    try { return new Date().toISOString(); } catch (e) { return String(Date.now()); }
  }

  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (e) { return value; }
  }

  function safeNumber(value, fallback) {
    var n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function emit(name, detail) {
    var payload = detail || {};
    try {
      (listeners[name] || []).slice().forEach(function (fn) {
        try { fn(payload); } catch (e) { console.warn(MODULE_NAME + ' listener failed:', name, e); }
      });
    } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('egt:simulation:' + name, { detail: payload })); } catch (e) {}
  }

  function on(name, fn) {
    if (!name || typeof fn !== 'function') return function () {};
    if (!listeners[name]) listeners[name] = [];
    listeners[name].push(fn);
    return function () {
      listeners[name] = (listeners[name] || []).filter(function (item) { return item !== fn; });
    };
  }

  function normalizeConfig(config) {
    var cfg = config && typeof config === 'object' ? config : {};
    var mode = String(cfg.mode || cfg.modus || cfg.selectedMode || 'training');
    var features = Object.assign({ coachHilfe: true, merken: true, skip: true, lockBack: false }, cfg.features || {});
    return {
      sessionId: cfg.sessionId || ('sim_' + (++sessionCounter) + '_' + Date.now().toString(36)),
      mode: mode,
      modus: cfg.modus || mode,
      bereich: cfg.bereich || cfg.category || 'allgemein',
      niveau: cfg.niveau || cfg.level || 'standard',
      titel: cfg.titel || cfg.title || 'Eignungstest-Simulation',
      zeitProFrage: safeNumber(cfg.zeitProFrage, safeNumber(cfg.timePerQuestion, 25)),
      fragenAnzahl: safeNumber(cfg.fragenAnzahl, safeNumber(cfg.amount, 0)),
      aufgabenPool: Array.isArray(cfg.aufgabenPool) ? cfg.aufgabenPool.slice() : null,
      features: features,
      source: cfg.source || 'app-shell',
      createdAt: nowIso(),
      raw: cfg
    };
  }

  function setBodyFlags(isActive) {
    try {
      document.body.classList.toggle('egt-simulation-active', !!isActive);
      document.body.dataset.egtSimulation = isActive && activeSession ? activeSession.mode : '';
    } catch (e) {}
  }

  function requireAdapter() {
    if (!adapter) {
      throw new Error('EGTSimulation ist noch nicht mit der App-Shell verbunden. Erwartet: EGTSimulation.init(adapter).');
    }
    return adapter;
  }

  function callAdapter(name, args, fallback) {
    var shell = requireAdapter();
    args = Array.isArray(args) ? args : [];
    if (typeof shell[name] === 'function') {
      if (inDelegation[name]) {
        return typeof fallback === 'function' ? fallback.apply(null, args) : null;
      }
      inDelegation[name] = true;
      try {
        return shell[name].apply(shell, args);
      } finally {
        inDelegation[name] = false;
      }
    }
    return typeof fallback === 'function' ? fallback.apply(null, args) : null;
  }

  function getLegacyState() {
    try {
      var shell = requireAdapter();
      return typeof shell.getState === 'function' ? shell.getState() : null;
    } catch (e) { return null; }
  }

  function annotateSession(patch) {
    if (!activeSession) return null;
    Object.assign(activeSession, patch || {});
    activeSession.updatedAt = nowIso();
    return clone(activeSession);
  }


  function byId(id) {
    try { return document.getElementById(id); } catch (e) { return null; }
  }

  function escHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c];
    });
  }

  function showFeedback(html) {
    var feedback = byId('feedback');
    if (!feedback) return false;
    feedback.innerHTML = html || '';
    feedback.classList.remove('hidden');
    return true;
  }

  function currentQuestionIndex(state) {
    return state && typeof state.current === 'number' ? state.current : 0;
  }

  function getQuestionNavTotal(state) {
    try {
      var shell = requireAdapter();
      if (typeof shell.getQuestionNavTotal === 'function') {
        var adapterTotal = Number(shell.getQuestionNavTotal());
        if (Number.isFinite(adapterTotal) && adapterTotal > 0) return adapterTotal;
      }
    } catch (e) {}
    return state && Array.isArray(state.quiz) ? state.quiz.length : 0;
  }

  function ensureQuestionDrawerToggle() {
    try {
      var shell = requireAdapter();
      if (typeof shell.ensureQuestionDrawerToggle === 'function') return shell.ensureQuestionDrawerToggle();
    } catch (e) {}
    return null;
  }

  function setQuestionDrawer(open) {
    try {
      var shell = requireAdapter();
      if (typeof shell.setQuestionDrawer === 'function') return shell.setQuestionDrawer(!!open);
    } catch (e) {}
    return null;
  }

  function jumpToQuestion(index) {
    qnavManualPage = null;
    try {
      var shell = requireAdapter();
      if (typeof shell.jumpToQuestion === 'function') return shell.jumpToQuestion(index);
    } catch (e) { console.warn(MODULE_NAME + ' jumpToQuestion failed', e); }
    return null;
  }

  function isInstantFeedbackAllowed() {
    try {
      var shell = requireAdapter();
      if (typeof shell.isInstantFeedbackAllowed === 'function') return !!shell.isInstantFeedbackAllowed();
    } catch (e) {}
    return false;
  }

  function renderRouteWaitingMessage() {
    var answers = byId('answers');
    if (!answers) return null;
    answers.innerHTML = '<div class="route-answer-wait">Merke dir die Straßen in der richtigen Reihenfolge. Nach der Animation verschwinden Bus und Straßen.</div>';
    return true;
  }

  function routeNeed(question) {
    return Array.isArray(question && question.routeStreets) ? question.routeStreets.length : 0;
  }

  function routeSelected(question) {
    if (!question) return [];
    if (!Array.isArray(question.routeSelected)) question.routeSelected = [];
    return question.routeSelected;
  }

  function sameRouteOrder(given, expected) {
    if (!Array.isArray(given) || !Array.isArray(expected) || given.length !== expected.length) return false;
    for (var i = 0; i < expected.length; i++) {
      if (String(given[i]) !== String(expected[i])) return false;
    }
    return true;
  }

  function getCurrentRouteQuestion() {
    var state = getLegacyState() || {};
    var quiz = Array.isArray(state.quiz) ? state.quiz : [];
    var q = quiz[currentQuestionIndex(state)] || null;
    return q && q.type === 'routeMemory' ? q : null;
  }

  function parseEdvEntry(entry) {
    var raw = String(entry == null ? '' : entry);
    var match = raw.match(/^\s*([^:：\s]+)\s*[:：]\s*(.*)$/);
    if (match) return { id: String(match[1]), text: String(match[2] || '').trim() };
    return { id: raw.trim(), text: raw.trim() };
  }

  function edvSchema(question) {
    var q = question || {};
    if (Array.isArray(q.edvSchema)) {
      return q.edvSchema.map(function (item) {
        if (item && typeof item === 'object') return { id: String(item.id || ''), text: String(item.text || item.label || item.id || '') };
        return parseEdvEntry(item);
      }).filter(function (item) { return item.id; });
    }
    if (Array.isArray(q.a)) return q.a.map(parseEdvEntry).filter(function (item) { return item.id; });
    return [];
  }

  function edvCorrectIds(question) {
    var q = question || {};
    if (Array.isArray(q.edvCorrectIds)) return q.edvCorrectIds.map(String);
    return [];
  }

  function edvNeed(question) {
    var q = question || {};
    var explicit = Number(q.edvRequiredCount);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    var correct = edvCorrectIds(q);
    return correct.length || 0;
  }

  function edvSelected(question) {
    if (!question) return [];
    if (!Array.isArray(question.edvMultiSelected)) question.edvMultiSelected = [];
    var need = edvNeed(question);
    if (need > 0 && question.edvMultiSelected.length > need) question.edvMultiSelected = question.edvMultiSelected.slice(0, need);
    return question.edvMultiSelected;
  }

  function getCurrentEdvQuestion() {
    var state = getLegacyState() || {};
    var quiz = Array.isArray(state.quiz) ? state.quiz : [];
    var q = quiz[currentQuestionIndex(state)] || null;
    return q && q.type === 'edvmulti' ? q : null;
  }

  function renderEdvVisual(question) {
    try {
      var shell = requireAdapter();
      if (typeof shell.renderEdvVisual === 'function') return shell.renderEdvVisual(question);
    } catch (e) {}
    return null;
  }

  function renderEdvMultiAnswers(question) {
    var q = question || getCurrentEdvQuestion();
    var answers = byId('answers');
    var feedback = byId('feedback');
    var state = getLegacyState() || {};
    var current = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];

    if (!answers || !q || q.type !== 'edvmulti') return false;

    var need = edvNeed(q);
    var selected = edvSelected(q);
    var schema = edvSchema(q);
    var selectedHtml = selected.length
      ? selected.map(function (id, idx) {
          return '<button type="button" class="route-chip" data-edv-id="' + escHTML(id) + '">' + (idx + 1) + '. ' + escHTML(id) + ' ×</button>';
        }).join('')
      : '<span class="small">Noch kein Schema-Eintrag ausgewählt.</span>';

    answers.innerHTML =
      '<div class="edv-answer-panel">' +
        '<b>EDV-Multi-Select</b><br>' +
        '<span class="small">Ausgewählt: ' + selected.length + '/' + need + '. Du kannst entweder die Schema-Karten oben oder die Auswahlbuttons unten antippen. Erneutes Tippen wählt ab.</span>' +
        '<div class="route-selected-list">' + selectedHtml + '</div>' +
        '<div class="edv-option-grid">' +
          schema.map(function (item) {
            var used = selected.indexOf(item.id) >= 0 ? ' used' : '';
            return '<button type="button" class="edv-select-btn answer-card' + used + '" data-edv-id="' + escHTML(item.id) + '"><b>' + escHTML(item.id) + '</b><span>' + escHTML(item.text) + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="route-action-row">' +
          '<button type="button" class="btn btn-secondary" data-action="edv-undo">Letzte entfernen</button>' +
          '<button type="button" class="btn btn-secondary" data-action="edv-clear">Auswahl leeren</button>' +
          '<button type="button" class="btn btn-primary" data-action="edv-submit">Gesamtantwort werten</button>' +
        '</div>' +
      '</div>';

    bindEdvInteractions();

    if (history[current] && feedback) {
      var h = history[current];
      feedback.innerHTML = (h.correct ? '<b>Richtig.</b> ' : '<b>Falsch.</b> ') + (h.explanation || '');
      feedback.classList.remove('hidden');
    }

    emit('edv:rendered', { session: clone(activeSession), selected: selected.length, need: need, handledBy: 'module-edv-renderer' });
    return true;
  }

  function bindEdvInteractions() {
    var rootNodes = [];
    var answers = byId('answers');
    var visual = byId('visual');
    if (answers) rootNodes.push(answers);
    if (visual) rootNodes.push(visual);

    rootNodes.forEach(function (root) {
      Array.prototype.slice.call(root.querySelectorAll('[data-edv-id]')).forEach(function (btn) {
        if (btn.dataset && btn.dataset.egtEdvBound === '1') return;
        if (btn.dataset) btn.dataset.egtEdvBound = '1';
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          toggleEdvMultiNode(btn.getAttribute('data-edv-id'));
        });
      });
    });

    if (answers) {
      Array.prototype.slice.call(answers.querySelectorAll('[data-action]')).forEach(function (btn) {
        if (btn.dataset && btn.dataset.egtEdvActionBound === '1') return;
        if (btn.dataset) btn.dataset.egtEdvActionBound = '1';
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var action = btn.getAttribute('data-action');
          if (action === 'edv-undo') undoEdvMultiSelection();
          else if (action === 'edv-clear') clearEdvMultiSelection();
          else if (action === 'edv-submit') submitEdvMultiAnswer();
        });
      });
    }
  }

  function toggleEdvMultiNode(id) {
    var q = getCurrentEdvQuestion();
    var state = getLegacyState() || {};
    var current = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[current]) return false;

    id = String(id || '');
    if (!id) return false;
    var selected = edvSelected(q);
    var need = edvNeed(q);
    var pos = selected.indexOf(id);
    if (pos >= 0) selected.splice(pos, 1);
    else if (need > 0 && selected.length >= need) {
      showFeedback('<b>Maximal ' + need + ' Einträge.</b> Tippe eine gewählte Karte erneut an, um sie zu entfernen.');
      return false;
    } else selected.push(id);

    renderEdvVisual(q);
    renderEdvMultiAnswers(q);
    bindEdvInteractions();
    emit('edv:selected', { session: clone(activeSession), selected: clone(selected), need: need });
    return true;
  }

  function undoEdvMultiSelection() {
    var q = getCurrentEdvQuestion();
    var state = getLegacyState() || {};
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[currentQuestionIndex(state)]) return false;
    edvSelected(q).pop();
    renderEdvVisual(q);
    renderEdvMultiAnswers(q);
    bindEdvInteractions();
    return true;
  }

  function clearEdvMultiSelection() {
    var q = getCurrentEdvQuestion();
    var state = getLegacyState() || {};
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[currentQuestionIndex(state)]) return false;
    q.edvMultiSelected = [];
    renderEdvVisual(q);
    renderEdvMultiAnswers(q);
    bindEdvInteractions();
    return true;
  }

  function highlightEdvResult(selected, correctIds) {
    var selectedSet = new Set((selected || []).map(String));
    var correctSet = new Set((correctIds || []).map(String));
    Array.prototype.slice.call(document.querySelectorAll('[data-edv-id]')).forEach(function (el) {
      var id = String(el.getAttribute('data-edv-id') || '');
      if (!id) return;
      if (correctSet.has(id)) el.classList.add('correct-node');
      else if (selectedSet.has(id)) el.classList.add('wrong-node');
    });
  }

  function submitEdvMultiAnswer() {
    var q = getCurrentEdvQuestion();
    var state = getLegacyState() || {};
    var current = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[current]) return false;

    var selected = edvSelected(q).slice();
    var need = edvNeed(q);
    var correctIds = edvCorrectIds(q);
    if (selected.length !== need) {
      showFeedback('<b>EDV-Auswahl unvollständig.</b> Du hast ' + selected.length + '/' + need + ' Fehler markiert. Markiere genau ' + need + ' Einträge und werte dann die Gesamtantwort.');
      return false;
    }

    try { callAdapter('stopTimer'); } catch (e) {}
    callAdapter('recordEdvMultiAnswers', [selected], function () { return null; });
    callAdapter('markEdvMultiCoveredDone', [need, selected], function () { return null; });
    updateQuestionNav();
    renderEdvVisual(q);
    highlightEdvResult(selected, correctIds);

    var correctSet = new Set(correctIds.map(String));
    var found = selected.filter(function (id) { return correctSet.has(String(id)); }).length;
    var falsePos = selected.filter(function (id) { return !correctSet.has(String(id)); }).length;
    showFeedback('<b>EDV ausgewertet.</b> ' + found + '/' + need + ' Fehler korrekt gefunden' + (falsePos ? ', ' + falsePos + ' falsche Markierung(en)' : '') + '. Richtige Fehler: ' + correctIds.join(', ') + '.');

    emit('edv:submitted', { session: clone(activeSession), selected: clone(selected), correctIds: clone(correctIds), found: found, falsePositives: falsePos, handledBy: 'module-edv-submit' });
    setTimeout(function () {
      callAdapter('afterEdvMultiSubmit', [need, selected], function () {
        var latest = getLegacyState() || {};
        var quiz = Array.isArray(latest.quiz) ? latest.quiz : [];
        var index = currentQuestionIndex(latest);
        if (index < quiz.length - 1) nextQuestion();
        else showResult();
      });
    }, 1200);
    return true;
  }

  function renderRouteSequenceAnswers(question) {
    var q = question || getCurrentRouteQuestion();
    var answers = byId('answers');
    var feedback = byId('feedback');
    var state = getLegacyState() || {};
    var current = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];

    if (!answers || !q || q.type !== 'routeMemory') return false;

    if (!q.routeReady && !history[current]) {
      return renderRouteWaitingMessage();
    }

    var need = routeNeed(q);
    var selected = routeSelected(q);
    var options = Array.isArray(q.routeOptions) ? q.routeOptions : (Array.isArray(q.a) ? q.a : []);
    var selectedHtml = selected.length
      ? selected.map(function (street) {
          return '<button type="button" class="route-chip" data-route-street="' + escHTML(street) + '">' + escHTML(street) + ' ×</button>';
        }).join('')
      : '<span class="small">Noch keine Straße ausgewählt.</span>';

    answers.innerHTML =
      '<div class="route-sequence-panel">' +
        '<b>Tippe die Straßen in der gemerkten Reihenfolge an:</b>' +
        '<span class="small">Ausgewählt: ' + selected.length + '/' + need + '. Erneutes Tippen entfernt die Straße wieder.</span>' +
        '<div class="route-selected-list">' + selectedHtml + '</div>' +
        '<div class="route-option-grid">' +
          options.map(function (street) {
            var used = selected.indexOf(street) >= 0 ? ' used' : '';
            return '<button type="button" class="answer-card' + used + '" data-route-street="' + escHTML(street) + '">' + escHTML(street) + '</button>';
          }).join('') +
        '</div>' +
        '<div class="route-action-row">' +
          '<button type="button" class="btn btn-secondary" data-action="route-clear">Auswahl leeren</button>' +
          '<button type="button" class="btn btn-secondary" data-action="route-undo">Letzte entfernen</button>' +
          '<button type="button" class="btn btn-primary" data-action="route-submit">Gesamtantwort werten</button>' +
        '</div>' +
      '</div>';

    Array.prototype.slice.call(answers.querySelectorAll('[data-route-street]')).forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        selectRouteStreet(btn.getAttribute('data-route-street'));
      });
    });

    Array.prototype.slice.call(answers.querySelectorAll('[data-action]')).forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var action = btn.getAttribute('data-action');
        if (action === 'route-clear') clearRouteSelection();
        else if (action === 'route-undo') undoRouteStreet();
        else if (action === 'route-submit') submitRouteSequence();
      });
    });

    if (history[current] && feedback) {
      var h = history[current];
      feedback.innerHTML = (h.correct ? '<b>Richtig.</b> ' : '<b>Falsch.</b> ') + (h.explanation || '');
      feedback.classList.remove('hidden');
    }

    emit('route:rendered', { session: clone(activeSession), selected: selected.length, need: need, handledBy: 'module-route-renderer' });
    return true;
  }

  function selectRouteStreet(street) {
    var q = getCurrentRouteQuestion();
    var state = getLegacyState() || {};
    var current = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || !q.routeReady || history[current]) return false;

    var selected = routeSelected(q);
    var need = routeNeed(q);
    var existing = selected.indexOf(street);
    if (existing >= 0) {
      selected.splice(existing, 1);
    } else if (selected.length >= need) {
      showFeedback('<b>Route vollständig.</b> Tippe eine gewählte Straße erneut an, wenn du sie austauschen möchtest.');
      return false;
    } else {
      selected.push(street);
    }
    renderRouteSequenceAnswers(q);
    emit('route:selected', { session: clone(activeSession), selected: clone(selected), need: need });
    return true;
  }

  function undoRouteStreet() {
    var q = getCurrentRouteQuestion();
    var state = getLegacyState() || {};
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[currentQuestionIndex(state)]) return false;
    routeSelected(q).pop();
    renderRouteSequenceAnswers(q);
    return true;
  }

  function clearRouteSelection() {
    var q = getCurrentRouteQuestion();
    var state = getLegacyState() || {};
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[currentQuestionIndex(state)]) return false;
    q.routeSelected = [];
    renderRouteSequenceAnswers(q);
    return true;
  }

  function submitRouteSequence() {
    var q = getCurrentRouteQuestion();
    var state = getLegacyState() || {};
    var current = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];
    if (!q || history[current]) return false;

    var selected = routeSelected(q).slice();
    var expected = Array.isArray(q.routeStreets) ? q.routeStreets : [];
    if (selected.length < expected.length) {
      showFeedback('<b>Noch nicht vollständig.</b> Du hast ' + selected.length + '/' + expected.length + ' Straßen ausgewählt.');
      return false;
    }

    try { callAdapter('stopTimer'); } catch (e) {}
    var ok = sameRouteOrder(selected, expected);
    callAdapter('recordRouteAnswer', [selected, ok], function () { return null; });
    callAdapter('markCurrentQuestionDone', [current], function () {
      var s = getLegacyState() || {};
      if (Array.isArray(s.questionStates)) s.questionStates[current] = Array.isArray(s.markedQuestions) && s.markedQuestions[current] ? 'mark' : 'done';
      return true;
    });
    updateQuestionNav();
    showFeedback((ok ? '<b>Richtig.</b> ' : '<b>Falsch.</b> ') + (q.ex || ''));

    emit('route:submitted', { session: clone(activeSession), correct: ok, selected: clone(selected), expected: clone(expected), handledBy: 'module-route-submit' });
    setTimeout(function () {
      var latest = getLegacyState() || {};
      var quiz = Array.isArray(latest.quiz) ? latest.quiz : [];
      var index = currentQuestionIndex(latest);
      var adaptive = false;
      try {
        var shell = requireAdapter();
        adaptive = typeof shell.isAdaptiveElite === 'function' ? !!shell.isAdaptiveElite() : false;
      } catch (e) {}
      if (index < quiz.length - 1 || adaptive) nextQuestion();
      else showResult();
    }, 1100);
    return true;
  }

  function renderStandardAnswers(question) {
    var q = question || {};
    var answers = byId('answers');
    var feedback = byId('feedback');
    var state = getLegacyState() || {};
    var index = currentQuestionIndex(state);
    var history = Array.isArray(state.history) ? state.history : [];
    var previous = history[index] || null;
    var list = Array.isArray(q.a) ? q.a : [];

    if (!answers) return false;
    answers.innerHTML = '';

    list.forEach(function (ans, idx) {
      var b = document.createElement('button');
      b.className = 'answer-card';
      b.innerHTML = '<span class="answer-index">' + String.fromCharCode(65 + idx) + '</span><span class="answer-text">' + ans + '</span>';
      b.onclick = function () { return chooseAnswer(idx, b); };
      if (previous && previous.givenIndex === idx) b.classList.add('selected');
      answers.appendChild(b);
    });

    if (isInstantFeedbackAllowed() && previous) {
      var buttons = answers.querySelectorAll('button');
      if (previous.givenIndex !== null && buttons[previous.givenIndex]) {
        buttons[previous.givenIndex].classList.add(previous.correct ? 'correct' : 'wrong');
      }
      if (!previous.correct && previous.correctIndex !== undefined && buttons[previous.correctIndex]) {
        buttons[previous.correctIndex].classList.add('correct');
      }
      if (feedback && previous.explanation) {
        feedback.innerHTML = (previous.correct ? '<b>Richtig.</b> ' : '<b>Falsch.</b> ') + previous.explanation;
        feedback.classList.remove('hidden');
      }
    }

    return true;
  }

  function start(config) {
    var shell = requireAdapter();
    var normalized = normalizeConfig(config);

    if (activeSession && activeSession.status === 'running' && shell.stopTimer) {
      try { shell.stopTimer(); } catch (e) {}
    }

    activeSession = Object.assign({}, normalized, { status: 'starting', startedAt: nowIso() });
    setBodyFlags(true);
    emit('starting', clone(activeSession));

    try {
      if (typeof shell.beforeStart === 'function') shell.beforeStart(clone(activeSession));

      if (normalized.aufgabenPool && typeof shell.setQuestionPool === 'function') {
        shell.setQuestionPool(normalized.aufgabenPool, clone(activeSession));
      }

      // Phase 2B: offizieller Einstieg ist beginRun(). beginLegacyRun bleibt
      // als Rückfall erhalten, damit alte ZIPs/Adapter nicht brechen.
      if (typeof shell.beginRun === 'function') {
        shell.beginRun(clone(activeSession));
      } else if (typeof shell.beginLegacyRun === 'function') {
        shell.beginLegacyRun(clone(activeSession));
      } else if (typeof shell.begin === 'function') {
        shell.begin(clone(activeSession));
      } else {
        throw new Error('Kein Start-Hook für Simulation vorhanden.');
      }

      activeSession.status = 'running';
      activeSession.runningAt = nowIso();
      emit('started', clone(activeSession));
      return clone(activeSession);
    } catch (error) {
      activeSession.status = 'failed';
      activeSession.error = error && error.message ? error.message : String(error);
      setBodyFlags(false);
      emit('failed', clone(activeSession));
      throw error;
    }
  }

  function showQuestion(spIntro) {
    var state = getLegacyState();
    var index = state && typeof state.current === 'number' ? state.current : null;
    emit('question:beforeShow', { session: clone(activeSession), index: index, spIntro: !!spIntro });
    var result = callAdapter('showQuestion', [!!spIntro]);
    state = getLegacyState();
    annotateSession({ currentIndex: state && typeof state.current === 'number' ? state.current : index });
    emit('question:shown', { session: clone(activeSession), index: activeSession ? activeSession.currentIndex : index, spIntro: !!spIntro });
    return result;
  }

  function tickTimer() {
    emit('timer:tick:before', { session: clone(activeSession) });
    var result = callAdapter('tickTimer');
    var state = getLegacyState();
    annotateSession({ timeLeft: state && typeof state.timeLeft === 'number' ? state.timeLeft : null });
    emit('timer:tick', { session: clone(activeSession), timeLeft: activeSession ? activeSession.timeLeft : null });
    return result;
  }

  function renderAnswers(question) {
    var q = question || {};
    var result = null;
    var handledBy = 'standard-module';
    emit('answers:render:before', { session: clone(activeSession), question: clone(question) });

    try {
      var answers = byId('answers');
      if (answers) answers.innerHTML = '';
    } catch (e) {}

    if (q.type === 'edvmulti') {
      handledBy = 'module-edv-renderer';
      result = renderEdvMultiAnswers(q);
    } else if (q.type === 'routeMemory') {
      handledBy = 'module-route-renderer';
      result = renderRouteSequenceAnswers(q);
    } else if (q.type === 'novuraExamsFlowLogic' && window.App && typeof window.App.renderNovuraExamsFlowLogicAnswers === 'function') {
      handledBy = 'module-novura-exams-flowlogic-adapter';
      result = window.App.renderNovuraExamsFlowLogicAnswers(q);
    } else if ((q.type === 'novuraExamsRuleArithmeticInput' || q.type === 'novuraExamsLetterScanInput' || q.type === 'novuraExamsCoordinateTableInput' || q.type === 'novuraExamsNumberSeriesInput') && window.App && typeof window.App.renderNovuraExamsLohrInputAnswers === 'function') {
      handledBy = 'module-novura-exams-input-adapter';
      result = window.App.renderNovuraExamsLohrInputAnswers(q);
    } else {
      result = renderStandardAnswers(q);
    }

    emit('answers:rendered', { session: clone(activeSession), handledBy: handledBy });
    return result;
  }

  function updateQuestionNav() {
    var state = getLegacyState() || {};
    var nav = byId('questionNav');
    var quiz = Array.isArray(state.quiz) ? state.quiz : [];
    var history = Array.isArray(state.history) ? state.history : [];
    var questionStates = Array.isArray(state.questionStates) ? state.questionStates : [];
    var markedQuestions = Array.isArray(state.markedQuestions) ? state.markedQuestions : [];
    var current = currentQuestionIndex(state);
    var total = getQuestionNavTotal(state);
    var PER_PAGE = 30;
    var pages = Math.max(1, Math.ceil(Math.max(1, total) / PER_PAGE));

    ensureQuestionDrawerToggle();

    if (!nav) {
      emit('nav:updated', { session: clone(activeSession), current: current, total: total, handledBy: 'module-missing-dom' });
      return false;
    }

    nav.classList.add('qnav-drawer');
    nav.setAttribute('aria-label', 'Frageübersicht');
    nav.innerHTML = '';

    var page = qnavManualPage !== null ? qnavManualPage : Math.floor(current / PER_PAGE);
    if (page >= pages) page = pages - 1;
    if (page < 0) page = 0;

    if (pages > 1) {
      var bar = document.createElement('div');
      bar.className = 'qnav-pages';
      for (var p = 0; p < pages; p++) {
        (function (pageIndex) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'qnav-page-btn' + (pageIndex === page ? ' active' : '');
          var from = pageIndex * PER_PAGE + 1;
          var to = Math.min(total, (pageIndex + 1) * PER_PAGE);
          b.textContent = from + '–' + to;
          b.title = 'Fragen ' + from + ' bis ' + to + ' anzeigen';
          b.onclick = function () {
            qnavManualPage = pageIndex;
            updateQuestionNav();
          };
          bar.appendChild(b);
        })(p);
      }
      nav.appendChild(bar);
    }

    var start = page * PER_PAGE;
    var end = Math.min(total, start + PER_PAGE);
    for (var i = start; i < end; i++) {
      (function (questionIndex) {
        var d = document.createElement('div');
        var st = questionStates[questionIndex] || (history[questionIndex] ? 'done' : 'open');
        if (markedQuestions[questionIndex]) st = 'mark';
        d.className = 'progress-dot ' + st + (questionIndex === current ? ' current' : '');
        d.textContent = String(questionIndex + 1);
        d.title = 'Aufgabe ' + (questionIndex + 1) + ': ' + st;
        if (questionIndex < quiz.length) {
          d.onclick = function () {
            setQuestionDrawer(false);
            jumpToQuestion(questionIndex);
          };
        }
        nav.appendChild(d);
      })(i);
    }

    emit('nav:updated', {
      session: clone(activeSession),
      current: current,
      total: total,
      page: page + 1,
      pages: pages,
      handledBy: 'module-question-nav'
    });
    return true;
  }

  function chooseAnswer(index, button) {
    emit('answer:choose', { session: clone(activeSession), index: index });
    return callAdapter('chooseAnswer', [index, button]);
  }

  function recordAnswer(given, correct, timeout) {
    var result = callAdapter('recordAnswer', [given, correct, timeout]);
    var state = getLegacyState();
    emit('answer:recorded', {
      session: clone(activeSession),
      given: given,
      correct: !!correct,
      timeout: !!timeout,
      answered: state && Array.isArray(state.history) ? state.history.filter(Boolean).length : null
    });
    return result;
  }

  function nextQuestion() {
    emit('question:next:before', { session: clone(activeSession) });
    var result = callAdapter('nextQuestion');
    var state = getLegacyState();
    annotateSession({ currentIndex: state && typeof state.current === 'number' ? state.current : null });
    emit('question:next', { session: clone(activeSession), index: activeSession ? activeSession.currentIndex : null });
    return result;
  }

  function manualNextQuestion() {
    return callAdapter('manualNextQuestion');
  }

  function skipQuestion() {
    return callAdapter('skipQuestion');
  }


  function adapterFormatTime(value) {
    try {
      var shell = requireAdapter();
      if (typeof shell.formatTime === 'function') return shell.formatTime(value);
    } catch (e) {}
    try {
      if (!value) return 'nicht erfasst';
      var d = value instanceof Date ? value : new Date(value);
      return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return 'nicht erfasst'; }
  }

  function adapterFormatDuration(ms) {
    try {
      var shell = requireAdapter();
      if (typeof shell.formatDuration === 'function') return shell.formatDuration(ms);
    } catch (e) {}
    try {
      var total = Math.max(0, Math.round(Number(ms || 0) / 1000));
      var m = Math.floor(total / 60);
      var s = total % 60;
      return m + ':' + String(s).padStart(2, '0') + ' min';
    } catch (e) { return 'nicht erfasst'; }
  }

  function getResultTarget(mode) {
    if (mode === 'novuraExams') return 70;
    if (mode === 'assessments') return 75;
    return 80;
  }

  function isTrainingResultMode(mode) {
    return [
      'mathSprint', 'textMathSprint', 'logicSprint', 'concentrationSprint',
      'visualIQSprint', 'itSprint', 'knowledgeSprint', 'techniqueSprint',
      'errorTrainingPrep'
    ].indexOf(mode) >= 0;
  }

  function verdictForPercent(percent, target) {
    if (percent >= target) return 'Stark für diesen Modus.';
    if (percent >= target - 10) return 'Knapp dran, aber noch instabil unter Druck.';
    return 'Noch zu fehleranfällig für einen sicheren Lauf.';
  }

  function buildResultSummary(options) {
    var opts = options && typeof options === 'object' ? options : {};
    var state = opts.state || getLegacyState() || {};
    var history = Array.isArray(state.history) ? state.history.filter(Boolean) : [];
    var mode = String(opts.mode || state.selectedMode || (activeSession && activeSession.mode) || 'training');
    var score = history.filter(function (h) { return h && h.correct; }).length;
    var total = history.length || 1;
    var percent = Math.round(score / total * 100);
    var testStart = state.testStart || (activeSession && activeSession.startedAt) || null;
    var testEnd = state.testEnd || new Date();
    var durationMs = testStart ? (new Date(testEnd).getTime() - new Date(testStart).getTime()) : 0;
    var duration = testStart ? adapterFormatDuration(durationMs) : 'nicht erfasst';
    var durationSum = history.reduce(function (sum, h) { return sum + (h && h.duration ? Number(h.duration) : 0); }, 0);
    var avg = Math.round(durationSum / total / 100) / 10;
    var target = Number.isFinite(Number(opts.target)) ? Number(opts.target) : getResultTarget(mode);
    var verdict = verdictForPercent(percent, target);
    var quizTotal = state && Array.isArray(state.quiz) ? state.quiz.length : total;
    var examEnabled = !!(state.exam && state.exam.enabled);
    var trainingMode = isTrainingResultMode(mode);

    return {
      mode: mode,
      total: total,
      quizTotal: quizTotal,
      answered: total,
      score: score,
      percent: percent,
      target: target,
      verdict: verdict,
      avg: avg,
      duration: duration,
      durationMs: durationMs,
      startText: adapterFormatTime(testStart),
      endText: adapterFormatTime(testEnd),
      examEnabled: examEnabled,
      trainingMode: trainingMode,
      createdAt: nowIso()
    };
  }

  function renderResultHeader(summary) {
    var s = summary || buildResultSummary();
    var examBanner = s.examEnabled ? '<div class="exam-banner">Prüfungsmodus abgeschlossen. Offene Aufgaben wurden streng gewertet.</div>' : '';
    var trainingNote = s.trainingMode ? '<div class="training-note"><b>Blocktraining PRO:</b> Dieser Lauf zählt als gezielte Trainingseinheit. Nutze die Kategorieauswertung direkt für den nächsten Sprint.</div>' : '';
    return examBanner + trainingNote +
      '<div class="bigScore">' + s.score + '/' + s.total + '</div>' +
      '<div class="statsgrid">' +
        '<div class="stat"><b>Quote</b><br><strong>' + s.percent + '%</strong></div>' +
        '<div class="stat"><b>Beginn</b><br><strong>' + s.startText + '</strong></div>' +
        '<div class="stat"><b>Ende</b><br><strong>' + s.endText + '</strong></div>' +
        '<div class="stat"><b>Dauer</b><br><strong>' + s.duration + '</strong></div>' +
        '<div class="stat"><b>Ø pro Aufgabe</b><br><strong>' + s.avg + 's</strong></div>' +
      '</div>' +
      '<div class="tipBox"><b>' + s.verdict + '</b></div>';
  }

  function prepareResult(options) {
    var summary = buildResultSummary(options);
    var html = renderResultHeader(summary);
    annotateSession({ result: clone(summary) });
    emit('result:prepared', { session: clone(activeSession), summary: clone(summary), handledBy: 'module-result-boundary' });
    return { summary: summary, html: html };
  }

  function showResult() {
    emit('result:beforeShow', { session: clone(activeSession) });
    return callAdapter('showResult');
  }

  function finish(summary) {
    if (!activeSession) return null;
    activeSession.status = 'finished';
    activeSession.finishedAt = nowIso();
    activeSession.summary = clone(summary || {});
    setBodyFlags(false);
    emit('finished', clone(activeSession));
    return clone(activeSession);
  }

  function abort(reason) {
    var shell = requireAdapter();
    if (!activeSession) return null;
    // G51.0: Nach regulärem Ergebnis darf ein Home-Cleanup die fertige Session
    // nicht rückwirkend als abgebrochen markieren. Er soll nur Timer/Body-Flags schließen.
    if (activeSession.status === 'finished') {
      try { if (typeof shell.stopTimer === 'function') shell.stopTimer(); } catch (e0) {}
      setBodyFlags(false);
      emit('closed', clone(activeSession));
      return clone(activeSession);
    }
    activeSession.status = 'aborted';
    activeSession.abortedAt = nowIso();
    activeSession.reason = reason || 'aborted';
    try { if (typeof shell.stopTimer === 'function') shell.stopTimer(); } catch (e) {}
    setBodyFlags(false);
    emit('aborted', clone(activeSession));
    return clone(activeSession);
  }

  function restart() {
    var shell = requireAdapter();
    abort('restart');
    if (typeof shell.restart === 'function') return shell.restart();
    return null;
  }

  function getSession() {
    return clone(activeSession);
  }

  function init(nextAdapter) {
    adapter = nextAdapter && typeof nextAdapter === 'object' ? nextAdapter : null;
    emit('ready', { version: VERSION, connected: !!adapter });
    return api;
  }

  function isReady() {
    return !!adapter;
  }

  var api = {
    version: VERSION,
    init: init,
    isReady: isReady,
    start: start,
    showQuestion: showQuestion,
    tickTimer: tickTimer,
    renderAnswers: renderAnswers,
    renderStandardAnswers: renderStandardAnswers,
    renderRouteSequenceAnswers: renderRouteSequenceAnswers,
    selectRouteStreet: selectRouteStreet,
    undoRouteStreet: undoRouteStreet,
    clearRouteSelection: clearRouteSelection,
    submitRouteSequence: submitRouteSequence,
    renderEdvMultiAnswers: renderEdvMultiAnswers,
    toggleEdvMultiNode: toggleEdvMultiNode,
    undoEdvMultiSelection: undoEdvMultiSelection,
    clearEdvMultiSelection: clearEdvMultiSelection,
    submitEdvMultiAnswer: submitEdvMultiAnswer,
    updateQuestionNav: updateQuestionNav,
    chooseAnswer: chooseAnswer,
    recordAnswer: recordAnswer,
    nextQuestion: nextQuestion,
    manualNextQuestion: manualNextQuestion,
    skipQuestion: skipQuestion,
    showResult: showResult,
    buildResultSummary: buildResultSummary,
    renderResultHeader: renderResultHeader,
    prepareResult: prepareResult,
    finish: finish,
    abort: abort,
    restart: restart,
    getSession: getSession,
    on: on,
    _normalizeConfig: normalizeConfig
  };

  window.EGTSimulation = api;
})();
