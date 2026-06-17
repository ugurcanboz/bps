/* Language Academy · Phase 24A
   Kleine robuste Translation Engine für DE/TR. Lädt keine externen Dateien im Offline-Fallback,
   kann aber JSON-Locale-Objekte registrieren und später durch fetch erweitert werden. */
(function(){
  'use strict';

  var VERSION = 'G54.7-phase24a-translation-engine';
  var dictionaries = Object.create(null);
  var embedded = {
    de: {
      'common.help':'Hilfe','common.next':'Weiter','common.back':'Zurück','common.close':'Schließen',
      'common.language':'Sprache','common.learningLanguage':'Lernsprache','common.helpLanguage':'Hilfssprache',
      'language.de':'Deutsch','language.tr':'Türkisch','course.a1.title':'Deutsch A1',
      'course.a1.lesson1.title':'Begrüßungen','course.a1.lesson1.task1.question':'Wähle die passende Begrüßung aus.',
      'course.a1.lesson1.task1.hint':'Achte darauf, ob die Situation formell oder informell ist.',
      'help.default':'Die Hilfe erklärt die Aufgabe, zeigt aber niemals direkt die Lösung.',
      'phase24a.status':'Language Foundation aktiv'
    },
    tr: {
      'common.help':'Yardım','common.next':'Devam','common.back':'Geri','common.close':'Kapat',
      'common.language':'Dil','common.learningLanguage':'Öğrenme dili','common.helpLanguage':'Yardım dili',
      'language.de':'Almanca','language.tr':'Türkçe','course.a1.title':'Almanca A1',
      'course.a1.lesson1.title':'Selamlaşmalar','course.a1.lesson1.task1.question':'Uygun selamlaşmayı seçin.',
      'course.a1.lesson1.task1.hint':'Durumun resmi mi yoksa samimi mi olduğuna dikkat edin.',
      'help.default':'Yardım, görevi açıklar ancak çözümü doğrudan göstermez.',
      'phase24a.status':'Dil temeli aktif'
    }
  };

  function store(){ return window.LanguageAcademyLanguageStore || null; }
  function normalizeLang(lang){ lang = String(lang || '').trim().toLowerCase(); return (lang === 'tr' || lang === 'de') ? lang : 'de'; }
  function register(lang, dict){
    lang = normalizeLang(lang);
    dictionaries[lang] = Object.assign({}, dictionaries[lang] || {}, dict || {});
    return dictionaries[lang];
  }
  function activeLanguage(kind){
    var settings = store() && typeof store().get === 'function' ? store().get() : { learningLanguage:'de', helpLanguage:'tr' };
    return normalizeLang(kind === 'help' ? settings.helpLanguage : settings.learningLanguage);
  }
  function interpolate(text, vars){
    if(!vars) return text;
    return String(text).replace(/\{\{\s*([\w.-]+)\s*\}\}/g, function(_, key){ return vars[key] == null ? '' : String(vars[key]); });
  }
  function t(key, options){
    options = options || {};
    var lang = normalizeLang(options.lang || activeLanguage(options.kind));
    var fallbackLang = normalizeLang(options.fallbackLang || 'de');
    var dict = dictionaries[lang] || {};
    var fallback = dictionaries[fallbackLang] || {};
    var value = dict[key] || fallback[key] || options.fallback || key;
    return interpolate(value, options.vars || null);
  }
  function translateObject(obj, lang, fallbackLang){
    if(typeof obj === 'string') return obj;
    if(!obj || typeof obj !== 'object') return '';
    lang = normalizeLang(lang || activeLanguage('learning'));
    fallbackLang = normalizeLang(fallbackLang || 'de');
    return obj[lang] || obj[fallbackLang] || obj.de || obj.tr || '';
  }
  function questionText(task, field, kind){
    task = task || {};
    field = field || 'question';
    var lang = activeLanguage(kind === 'help' ? 'help' : 'learning');
    return translateObject(task[field], lang, 'de');
  }
  function diagnostics(){
    return { ok:true, version:VERSION, languages:Object.keys(dictionaries), learningLanguage:activeLanguage('learning'), helpLanguage:activeLanguage('help'), sample:t('phase24a.status') };
  }

  register('de', embedded.de);
  register('tr', embedded.tr);

  window.LanguageAcademyTranslationEngine = Object.freeze({
    __version:VERSION,
    register:register,
    t:t,
    translateObject:translateObject,
    questionText:questionText,
    activeLanguage:activeLanguage,
    diagnostics:diagnostics
  });
  window.LA_t = t;
})();
