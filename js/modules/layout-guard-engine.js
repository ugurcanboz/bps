/* ============================================================
   EGT LAYOUT-GUARD-ENGINE · App-übergreifende Render-Wache
   ------------------------------------------------------------
   Prüft nach jedem Aufgaben-Render (und bei Resize/Rotation)
   automatisch Layout-Invarianten im Quiz und repariert
   Verstöße selbstständig ("Self-Healing"):

   1. Experiment-/Fremdklassen am #quiz (z. B. training-cockpit)
      → entfernen, Basis-Layout wiederherstellen
   2. Überlappung Frage ↔ Topbar (Signatur kollabierter
      grid-template-areas) → Grid-Inline-Styles zurücksetzen
   3. Horizontaler Overflow von Frage/Antworten/Visual
      (Master-DNA Regel 1: kein Scrollen) → Containment erzwingen
   4. Kollabierte Antwort-Container (Höhe ~0 trotz Inhalt)
      → Höhen-Restriktionen aufheben

   Jeder Eingriff wird in einem lokalen Ringpuffer protokolliert
   (egt-layout-guard-log, max. 30 Einträge) – abrufbar über
   EGTLayoutGuard.log() für gezielte Fehlersuche pro Gerät.

   Konservatives Prinzip: Die Engine greift NUR ein, wenn ein
   messbarer Verstoß vorliegt. Kein dauerhaftes DOM-Thrashing.
   ============================================================ */
(function () {
  'use strict';

  var LOG_KEY = 'egt-layout-guard-log';
  var enabled = true;
  // G51.2: training-cockpit ist KEINE Experiment-Klasse mehr.
  // Diese Klasse ist das produktive Prüfungs-Layout.
  // Vorher wurde sie 120 ms nach jedem Render entfernt; dadurch sprangen Frage/Antworten sichtbar um.
  var EXPERIMENT_CLASSES = [];

  function $(id) { return document.getElementById(id); }

  function rect(el) {
    try { return el && el.getBoundingClientRect ? el.getBoundingClientRect() : null; }
    catch (e) { return null; }
  }

  // Überlappung zweier Boxen, relativ zur kleineren Fläche (>25 % = Verstoß)
  function overlapRatio(a, b) {
    if (!a || !b || !a.width || !b.width || !a.height || !b.height) return 0;
    var x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    var y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    var inter = x * y;
    var minArea = Math.min(a.width * a.height, b.width * b.height) || 1;
    return inter / minArea;
  }

  function log(entry) {
    try {
      var l = [];
      try { l = JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch (e) { l = []; }
      l.unshift(Object.assign({
        ts: Date.now(),
        vw: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
        ua: String((navigator && navigator.userAgent) || '').slice(0, 90)
      }, entry));
      localStorage.setItem(LOG_KEY, JSON.stringify(l.slice(0, 30)));
    } catch (e) {}
  }

  function check(opts) {
    var result = { ok: true, violations: [], fixed: [] };
    if (!enabled) return result;
    var quiz = $('quiz');
    if (!quiz) return result;
    try { if (quiz.classList && quiz.classList.contains('hidden')) return result; } catch (e) {}

    var topbar = quiz.querySelector ? quiz.querySelector('.topbar') : null;
    var question = $('question');
    var answers = $('answers') || (quiz.querySelector ? quiz.querySelector('.answers') : null);
    var visual = $('visual');
    var nav = $('questionNav');

    // 1) Veraltete Experiment-Klassen am Quiz-Container
    // G51.2: Die produktive Klasse `training-cockpit` darf hier NICHT entfernt werden.
    // Sie stabilisiert Grid, Antwortspalten und Touch-Ziele. Wird sie nachträglich entfernt,
    // springen Antwortkarten sichtbar nach unten/oben.
    EXPERIMENT_CLASSES.forEach(function (c) {
      try {
        if (!c || c === 'training-cockpit') return;
        if (quiz.classList && quiz.classList.contains(c)) {
          result.violations.push('experiment-class:' + c);
          quiz.classList.remove(c);
          result.fixed.push('class-removed:' + c);
        }
      } catch (e) {}
    });

    // G51.2: Während einer aktiven Simulation das Cockpit-Layout hart erhalten.
    try {
      var simActive = document.body && document.body.classList && document.body.classList.contains('egt-simulation-active');
      if (simActive && quiz.classList && !quiz.classList.contains('training-cockpit')) {
        quiz.classList.add('training-cockpit');
        result.fixed.push('training-cockpit-restored');
      }
    } catch (e) {}

    // 2) Überlappung Frage ↔ Topbar (kollabiertes Area-Grid)
    var rTop = rect(topbar), rQ = rect(question);
    if (rTop && rQ && overlapRatio(rTop, rQ) > 0.25) {
      result.violations.push('overlap:question-topbar');
      try {
        ['display', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows']
          .forEach(function (p) { quiz.style.removeProperty(p); });
        [topbar, question, answers, visual, nav].forEach(function (el) {
          if (!el || !el.style) return;
          ['grid-area', 'grid-column', 'grid-row', 'position', 'top', 'left', 'transform']
            .forEach(function (p) { el.style.removeProperty(p); });
        });
        result.fixed.push('grid-reset');
      } catch (e) {}
    }

    // 3) Horizontaler Overflow (Master-DNA: kein Scrollen, alles sichtbar)
    var docW = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth || 0;
    if (docW > 0) {
      [question, answers, visual].forEach(function (el) {
        if (!el) return;
        var r = rect(el);
        if (r && r.width > 0 && (r.right > docW + 8 || r.left < -8)) {
          result.violations.push('overflow:' + (el.id || 'element'));
          try {
            el.style.maxWidth = '100%';
            el.style.minWidth = '0';
            el.style.boxSizing = 'border-box';
            result.fixed.push('contained:' + (el.id || 'element'));
          } catch (e) {}
        }
      });
    }

    // 4) Kollabierter Antwort-Container trotz Inhalt
    if (answers && String(answers.innerHTML || '').trim()) {
      var rA = rect(answers);
      if (rA && rA.width > 0 && rA.height < 4) {
        result.violations.push('answers-collapsed');
        try {
          answers.style.removeProperty('height');
          answers.style.removeProperty('max-height');
          answers.style.removeProperty('overflow');
          result.fixed.push('answers-height-reset');
        } catch (e) {}
      }
    }

    result.ok = result.violations.length === 0;
    if (!result.ok) {
      log({ violations: result.violations, fixed: result.fixed, context: (opts && opts.context) || '' });
    }
    return result;
  }

  // Entprellte Prüfung nach Render-/Viewport-Ereignissen
  var timer = null;
  function schedule(context) {
    try { clearTimeout(timer); } catch (e) {}
    timer = setTimeout(function () { check({ context: context }); }, 120);
  }

  try { window.addEventListener('resize', function () { schedule('resize'); }); } catch (e) {}
  try { window.addEventListener('orientationchange', function () { schedule('orientation'); }); } catch (e) {}
  try { document.addEventListener('egt:question-rendered', function () { schedule('question-rendered'); }); } catch (e) {}

  window.EGTLayoutGuard = {
    version: 'G51.2-answer-stability',
    check: check,
    schedule: schedule,
    log: function () { try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch (e) { return []; } },
    clearLog: function () { try { localStorage.removeItem(LOG_KEY); } catch (e) {} },
    setEnabled: function (v) { enabled = !!v; return enabled; }
  };
})();
