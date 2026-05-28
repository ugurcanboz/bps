/* BPS-Trainer V9.2.0 · Learning Coach Engine
   Lokal, offline-first, no-hallucination: Der Coach antwortet nur auf Datenbank- oder Aufgabenkontext. */
(function(){
  'use strict';

  var VERSION = '9.2.0';
  var STRONG_THRESHOLD = 7;
  var RELATED_THRESHOLD = 4;
  var STOP = {
    'was':1,'ist':1,'sind':1,'der':1,'die':1,'das':1,'ein':1,'eine':1,'einen':1,'einem':1,'einer':1,
    'und':1,'oder':1,'wie':1,'wo':1,'warum':1,'wieso':1,'weshalb':1,'bitte':1,'mir':1,'mich':1,'zu':1,
    'von':1,'im':1,'in':1,'am':1,'an':1,'auf':1,'für':1,'fur':1,'mit':1,'ohne':1,'thema':1,'erklär':1,
    'erklar':1,'erklaer':1,'erkläre':1,'hilfe':1,'brauch':1,'brauche':1,'mal':1,'einfach':1
  };

  function normalize(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss')
      .replace(/[^a-z0-9%\s\-]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  function tokenize(value){
    return normalize(value).split(/\s+/).filter(function(w){ return w && w.length >= 2 && !STOP[w]; });
  }

  function stripHtml(value){
    var div = document.createElement('div');
    div.innerHTML = String(value || '');
    return (div.textContent || div.innerText || '').replace(/\s+/g,' ').trim();
  }

  function knowledge(){
    return Array.isArray(window.BPS_COACH_KNOWLEDGE_BASE) ? window.BPS_COACH_KNOWLEDGE_BASE : [];
  }

  function scoreItem(query, item, context){
    var q = normalize(query);
    var words = tokenize(q);
    var topic = normalize(item.topic || '');
    var subject = normalize(item.subject || '');
    var kws = Array.isArray(item.keywords) ? item.keywords : [];
    var score = 0;

    if(!q || q.length < 2) return 0;
    if(q === topic) score += 14;
    else if(topic && q.indexOf(topic) !== -1) score += 10;
    else if(topic && topic.indexOf(q) !== -1 && q.length >= 4) score += 7;

    if(subject && q.indexOf(subject) !== -1) score += 1;

    kws.forEach(function(k){
      var nk = normalize(k);
      if(!nk || nk.length < 2) return;
      if(q === nk) score += 11;
      else if(q.indexOf(nk) !== -1) score += nk.length >= 4 ? 6 : 3;
      else if(nk.indexOf(q) !== -1 && q.length >= 4) score += 4;
    });

    var itemWords = {};
    tokenize(topic + ' ' + subject + ' ' + kws.join(' ')).forEach(function(w){ itemWords[w] = 1; });
    words.forEach(function(w){
      if(itemWords[w]) score += w.length >= 4 ? 2 : 1;
    });

    if(context && context.branch && Array.isArray(item.branch) && item.branch.indexOf(context.branch) !== -1) score += 1;
    if(context && context.subject && normalize(context.subject) === subject) score += 1;

    // Einzelbuchstaben und sehr kurze Zufallstreffer abfangen.
    if(words.length === 1 && words[0].length <= 2 && score < 12) return 0;
    return score;
  }

  function find(query, context){
    var list = knowledge();
    var scored = list.map(function(item){ return { item: item, score: scoreItem(query, item, context || {}) }; })
      .filter(function(x){ return x.score > 0; })
      .sort(function(a,b){ return b.score - a.score; });
    var top = scored[0];
    if(!top) return { status:'none', related: [] };
    if(top.score >= STRONG_THRESHOLD) return { status:'hit', item: top.item, score: top.score, related: scored.slice(1,5).map(function(x){ return x.item; }) };
    if(top.score >= RELATED_THRESHOLD) return { status:'related', related: scored.slice(0,5).map(function(x){ return x.item; }) };
    return { status:'none', related: scored.slice(0,3).map(function(x){ return x.item; }) };
  }

  function currentTaskFromApp(){
    try{
      if(window.App && App._test && App._test.state && Array.isArray(App._test.state.quiz)){
        return App._test.state.quiz[App._test.state.current] || null;
      }
    }catch(e){}
    return null;
  }

  function isTaskRequest(text){
    var n = normalize(text);
    return /\b(aufgabe|diese|aktuelle|tipp|hinweis|lösung|loesung|lösungsweg|loesungsweg|verstehe|schritt|erklär|erklaer)\b/.test(n);
  }

  function qText(task){ return stripHtml(task && (task.q || task.question || task.text || task.prompt || '')); }
  function qOptions(task){
    if(!task) return [];
    if(Array.isArray(task.answers)) return task.answers.map(stripHtml);
    if(Array.isArray(task.options)) return task.options.map(stripHtml);
    return [];
  }

  function answerCurrentTask(task, message, context){
    var wantsSteps = /lösung|loesung|lösungsweg|loesungsweg|schritt|ergebnis/.test(normalize(message));
    var steps = [];
    if(task.stepByStep) steps = String(task.stepByStep).split(/<br\s*\/?|\n|\d+\.\s*/i).map(stripHtml).filter(Boolean);
    if(!steps.length && task.steps && Array.isArray(task.steps)) steps = task.steps;
    if(!steps.length && wantsSteps) steps = [
      'Lies zuerst die Frage am Ende der Aufgabe.',
      'Markiere alle wichtigen Zahlen, Wörter und Einheiten.',
      'Entscheide, welche Regel passt: Prozent, Dreisatz, Fläche, Logik oder Sprache.',
      'Rechne oder begründe Schritt für Schritt und prüfe, ob das Ergebnis realistisch ist.'
    ];
    var topicGuess = (task.testedConcept || task.cat || task.category || task.group || 'Aufgabentraining');
    return {
      found: true,
      mode: 'task-help',
      title: 'Hilfe zur aktuellen Aufgabe',
      shortAnswer: wantsSteps ? 'Ich zeige dir den Lösungsweg anhand der vorhandenen Aufgabendaten.' : 'Ich gebe dir zuerst einen Tipp, ohne direkt alles zu verraten.',
      easyExplanation: task.tip || task.hint || 'Lies zuerst genau, was gefragt ist. Danach markierst du alle wichtigen Angaben im Text.',
      memoryTrick: task.trick || 'Frage zuerst lesen. Dann Zahlen markieren. Dann erst rechnen oder antworten.',
      steps: steps,
      example: task.similarQuestion || '',
      commonMistake: task.commonMistake || 'Typische Falle: zu schnell rechnen, ohne die Frage genau zu lesen.',
      tested: topicGuess,
      taskText: qText(task),
      options: qOptions(task),
      source: 'Aktueller Aufgabenkontext',
      context: context || {}
    };
  }

  function buildKnowledgeReply(item, meta, context){
    return {
      found: true,
      mode: 'knowledge',
      confidence: meta && meta.score,
      title: item.topic || 'Lerncoach',
      shortAnswer: item.shortAnswer || '',
      easyExplanation: item.easyExplanation || '',
      memoryTrick: item.memoryTrick || '',
      steps: item.steps || [],
      example: item.example || '',
      commonMistake: item.commonMistake || '',
      related: item.related || [],
      source: item.source || 'Lokale Wissensdatenbank',
      subject: item.subject || '',
      context: context || {}
    };
  }

  function relatedTopic(item){ return { id: item.id || item.topic, topic: item.topic || 'Thema', subject: item.subject || '', keywords: item.keywords || [] }; }

  function noResult(query, related, context){
    return {
      found: false,
      mode: related && related.length ? 'related-only' : 'no-result',
      title: related && related.length ? 'Kein direkter Treffer gefunden' : 'Noch kein passender Eintrag gefunden',
      shortAnswer: related && related.length ? 'Zu deiner genauen Frage habe ich aktuell noch keinen eigenen Eintrag gespeichert.' : 'Dazu habe ich aktuell noch keinen passenden Eintrag in meiner Wissensdatenbank gefunden.',
      easyExplanation: 'Der Lerncoach erfindet bewusst keine Antworten. Er nutzt nur die lokale Wissensdatenbank oder eine aktuelle Aufgabe als Kontext.',
      memoryTrick: 'Versuche einen kurzen Begriff, zum Beispiel „Prozent“, „Dreisatz“, „Komma“, „DNS“, „Rechnung“ oder „Beobachtung“.',
      steps: ['Frage kürzer formulieren', 'ein Schlüsselwort verwenden', 'ähnliche Themen öffnen', 'Feedback senden, wenn ein Thema fehlt'],
      related: (related || []).map(relatedTopic),
      source: 'Lokale Wissensdatenbank · No-Hallucination-Regel',
      query: query,
      context: context || {}
    };
  }

  function answer(message, context){
    context = context || {};
    if(!context.currentTask) context.currentTask = currentTaskFromApp();
    var query = String(message || '').trim();
    if(!query) return noResult('', [], context);
    if(context.currentTask && isTaskRequest(query)) return answerCurrentTask(context.currentTask, query, context);
    var result = find(query, context);
    if(result.status === 'hit') return buildKnowledgeReply(result.item, result, context);
    if(result.status === 'related') return noResult(query, result.related, context);
    return noResult(query, result.related || [], context);
  }

  function randomTopics(limit, subject){
    var list = knowledge().filter(function(x){ return !subject || normalize(x.subject) === normalize(subject); });
    list = list.slice().sort(function(){ return Math.random() - 0.5; });
    return list.slice(0, limit || 8).map(relatedTopic);
  }

  window.BPSLearningCoachEngine = {
    version: VERSION,
    answer: answer,
    find: find,
    currentTaskFromApp: currentTaskFromApp,
    randomTopics: randomTopics,
    stripHtml: stripHtml,
    normalize: normalize,
    count: function(){ return knowledge().length; }
  };
})();
