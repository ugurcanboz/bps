/* Language Academy · Phase 24A Help System
   Liefert nur Erklärung/Hinweis in der Hilfssprache. Keine Lösungsausgabe. */
(function(){
  'use strict';
  var VERSION = 'G54.7-phase24a-help-system';

  function engine(){ return window.LanguageAcademyTranslationEngine || null; }
  function sanitizeHint(task){
    task = task || {};
    var cloned = Object.assign({}, task);
    delete cloned.answer; delete cloned.correct; delete cloned.solution; delete cloned.correctAnswer; delete cloned.options;
    return cloned;
  }
  function getHint(task, fallbackKey){
    var e = engine();
    if(!e) return '';
    var safeTask = sanitizeHint(task || {});
    var hint = e.questionText(safeTask, 'hint', 'help');
    if(hint) return hint;
    return e.t(fallbackKey || 'help.default', { kind:'help' });
  }
  function diagnostics(){ return { ok:!!engine(), version:VERSION, hasTranslationEngine:!!engine(), sample:getHint({ hint:{ de:'Hinweis', tr:'İpucu' }, answer:'NICHT ZEIGEN' }) }; }

  window.LanguageAcademyHelpSystem = Object.freeze({ __version:VERSION, getHint:getHint, sanitizeHint:sanitizeHint, diagnostics:diagnostics });
})();
