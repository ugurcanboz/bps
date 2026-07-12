/* Eignungstest-Trainer · Language Didactic Engine · G54.46.9
   Einheitliche Lektionsdramaturgie für Deutsch und Englisch A1-C2.
   Neue Lerninhalte bleiben Lernstoff; die Engine erzeugt keine Prüfungs- oder Zertifikatsaussage. */
(function (root) {
  'use strict';

  var VERSION = 'G54.46.9';
  var SCHEMA = 'egt-language-didactic-v1';
  var STORAGE_KEY = 'language_academy_didactic_progress_v1';
  var LEVEL_ORDER = { a1: 1, a2: 2, b1: 3, b2: 4, c1: 5, c2: 6 };

  function text(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }
  function array(value) { return Array.isArray(value) ? value.filter(Boolean) : []; }
  function normalizeLanguage(value) { return String(value || 'de').toLowerCase().indexOf('en') === 0 ? 'en' : 'de'; }
  function normalizeLevel(value) {
    var raw = String(value || 'a1').toLowerCase().replace(/^en-/, '');
    return LEVEL_ORDER[raw] ? raw : 'a1';
  }
  function first(values, fallback) {
    for (var i = 0; i < values.length; i++) {
      var candidate = text(values[i]);
      if (candidate) return candidate;
    }
    return text(fallback);
  }
  function unique(values) {
    var seen = {}, out = [];
    array(values).forEach(function (value) {
      var clean = text(value), key = clean.toLowerCase();
      if (clean && !seen[key]) { seen[key] = true; out.push(clean); }
    });
    return out;
  }
  function localized(value) {
    if (value && typeof value === 'object') return text(value.de || value.en || value.tr || '');
    return text(value);
  }
  function parseGermanVocab(value) {
    var raw = text(value), parts = raw.split(/\s*=\s*/);
    return { target: text(parts[0]), support: text(parts.slice(1).join(' = ')) };
  }
  function vocabPairs(language, lesson) {
    return array(lesson && lesson.vocab).map(function (entry) {
      if (Array.isArray(entry)) return { target: text(entry[0]), support: text(entry[1]) };
      return parseGermanVocab(entry);
    }).filter(function (entry) { return entry.target; });
  }
  function taskPrompt(task) { return localized(task && (task.prompt || task.instruction)); }
  function taskExplanation(task) { return localized(task && task.explain); }
  function taskModel(task) {
    if (!task) return '';
    if (task.expectedText) return localized(task.expectedText);
    if (Array.isArray(task.choices)) {
      for (var i = 0; i < task.choices.length; i++) {
        var choice = task.choices[i];
        if (choice && typeof choice === 'object' && String(choice.id) === String(task.answer)) return text(choice.text);
      }
    }
    if (Array.isArray(task.answer)) return task.answer.join(' ');
    if (typeof task.answer === 'string' && task.answer.length > 1) return text(task.answer);
    return '';
  }
  function levelProfile(level) {
    level = normalizeLevel(level);
    var profiles = {
      a1: { label: 'A1', minWords: 3, targetSentences: 1, cognitive: 'erkennen und in einem kurzen Satz anwenden', connector: '', explanation: 'Du arbeitest mit kurzen, klaren Beispielen. Achte zuerst auf Bedeutung und Wortstellung.' },
      a2: { label: 'A2', minWords: 8, targetSentences: 2, cognitive: 'in einer vertrauten Alltagssituation anwenden', connector: 'weil', explanation: 'Du verbindest bekannte Wörter zu kurzen Aussagen und nennst einen einfachen Grund oder Ablauf.' },
      b1: { label: 'B1', minWords: 20, targetSentences: 3, cognitive: 'zusammenhängend beschreiben und begründen', connector: 'weil, deshalb oder jedoch', explanation: 'Du formulierst mehrere zusammenhängende Sätze, erklärst einen Grund und reagierst passend auf die Situation.' },
      b2: { label: 'B2', minWords: 45, targetSentences: 4, cognitive: 'strukturiert argumentieren und angemessen reagieren', connector: 'einerseits, andererseits, dennoch oder daher', explanation: 'Du strukturierst deine Aussage, wägest Aspekte ab und verwendest ein zur Situation passendes Register.' },
      c1: { label: 'C1', minWords: 70, targetSentences: 5, cognitive: 'differenziert analysieren, einordnen und präzisieren', connector: 'allerdings, insofern, während oder folglich', explanation: 'Du analysierst Zusammenhänge, machst Einschränkungen sichtbar und formulierst präzise für Zielgruppe und Kontext.' },
      c2: { label: 'C2', minWords: 90, targetSentences: 6, cognitive: 'Nuancen synthetisieren und stilistisch sicher vermitteln', connector: 'zwar, gleichwohl, wohingegen oder nicht zuletzt', explanation: 'Du verbindest mehrere Perspektiven, steuerst Ton und Wirkung bewusst und arbeitest feine Bedeutungsunterschiede heraus.' }
    };
    return profiles[level];
  }
  function languageLabels(language) {
    if (normalizeLanguage(language) === 'en') {
      return {
        target: 'Englisch', guidedLead: 'Bearbeite zuerst die geführte Aufgabe', transferLead: 'Formuliere danach deine eigene englische Anwendung',
        selfCheck: ['Die Aussage erfüllt die Situation.', 'Die Formulierung passt zum Niveau.', 'Ich habe meinen Text laut gelesen oder gesprochen.']
      };
    }
    return {
      target: 'Deutsch', guidedLead: 'Bearbeite zuerst die geführte Aufgabe', transferLead: 'Formuliere danach deine eigene deutsche Anwendung',
      selfCheck: ['Die Aussage erfüllt die Situation.', 'Satzbau und Wortwahl passen zum Niveau.', 'Ich habe meinen Text laut gelesen oder gesprochen.']
    };
  }
  function deriveExplanation(language, level, lesson, pairs) {
    var profile = levelProfile(level), labels = languageLabels(language), goal = text(lesson.goal || lesson.goalI18n && lesson.goalI18n.de);
    var focus = pairs.slice(0, 3).map(function (pair) { return pair.target; }).join(', ');
    return labels.target + ' ' + profile.label + ': ' + profile.explanation + (focus ? ' Wichtige Bausteine dieser Lektion sind ' + focus + '.' : '') + (goal ? ' Dein Ziel: ' + goal : '');
  }
  function deriveGuidedPrompt(language, level, lesson, tasks) {
    var profile = levelProfile(level), practice = array(lesson.practice), listening = array(lesson.listening);
    var prompt = first([practice[0], taskPrompt(tasks[0]), listening[0]], 'Bearbeite eine passende Aufgabe zum Lektionsziel.');
    return languageLabels(language).guidedLead + ': ' + prompt + ' Zielhandlung: ' + profile.cognitive + '.';
  }
  function deriveModel(language, level, lesson, tasks, pairs) {
    var speaking = array(lesson.speaking);
    var model = first([speaking[0], taskModel(tasks[0]), pairs[0] && pairs[0].target], 'Ich formuliere eine passende Beispielantwort.');
    return model;
  }
  function deriveTransferPrompt(language, level, lesson, pairs) {
    var lang = normalizeLanguage(language), profile = levelProfile(level), title = text(lesson.title || 'dieses Thema'), goal = text(lesson.goal || 'das Lektionsziel');
    var keywords = pairs.slice(0, 3).map(function (pair) { return pair.target; }).filter(Boolean);
    var keywordNote = keywords.length ? ' Nutze möglichst ' + keywords.join(', ') + '.' : '';
    if (lang === 'en') {
      if (profile.label === 'A1') return 'Write one short English sentence for a real situation connected with “' + title + '”.' + keywordNote;
      if (profile.label === 'A2') return 'Write two connected English sentences for a familiar situation. Add one simple reason or time reference.' + keywordNote;
      if (profile.label === 'B1') return 'Write a short connected response for the situation “' + title + '”. State what happened, your reaction and one reason.' + keywordNote;
      if (profile.label === 'B2') return 'Write a structured English response about “' + title + '”. Include a clear position, supporting detail and an appropriate conclusion.' + keywordNote;
      if (profile.label === 'C1') return 'Write a differentiated English response that analyses “' + title + '”, qualifies one claim and adapts the register to the audience.' + keywordNote;
      return 'Write a precise English response that synthesises at least two perspectives on “' + title + '” and controls nuance, register and effect.' + keywordNote;
    }
    if (profile.label === 'A1') return 'Schreibe einen kurzen deutschen Satz für eine echte Situation zum Thema „' + title + '“.' + keywordNote;
    if (profile.label === 'A2') return 'Schreibe zwei verbundene deutsche Sätze zu einer vertrauten Situation. Ergänze einen einfachen Grund oder Zeitpunkt.' + keywordNote;
    if (profile.label === 'B1') return 'Formuliere eine kurze zusammenhängende Antwort zum Thema „' + title + '“. Beschreibe die Situation, deine Reaktion und einen Grund.' + keywordNote;
    if (profile.label === 'B2') return 'Formuliere eine strukturierte Antwort zum Thema „' + title + '“. Nenne eine Position, eine Begründung und eine passende Schlussfolgerung.' + keywordNote;
    if (profile.label === 'C1') return 'Analysiere das Thema „' + title + '“ differenziert, schränke mindestens eine Aussage ein und passe das Register an die Zielgruppe an.' + keywordNote;
    return 'Verbinde zum Thema „' + title + '“ mindestens zwei Perspektiven und formuliere Nuancen, Register und Wirkung stilistisch präzise.' + keywordNote + (goal ? ' Die Antwort soll sichtbar zum Lernziel passen.' : '');
  }
  function criteria(language, level) {
    var lang = normalizeLanguage(language), profile = levelProfile(level), out = [];
    out.push('Mindestens ' + profile.minWords + ' Wörter und etwa ' + profile.targetSentences + ' vollständige' + (profile.targetSentences === 1 ? 'r Satz' : ' Sätze') + '.');
    out.push(lang === 'en' ? 'The response addresses the lesson situation, not only isolated vocabulary.' : 'Die Antwort bearbeitet die Lektionssituation und besteht nicht nur aus einzelnen Wörtern.');
    out.push(profile.connector ? ((lang === 'en' ? 'Use an appropriate connector or equivalent structure, for example: ' : 'Nutze einen passenden Konnektor oder eine gleichwertige Struktur, zum Beispiel: ') + profile.connector + '.') : (lang === 'en' ? 'Use clear basic word order.' : 'Nutze eine klare grundlegende Wortstellung.'));
    return out;
  }
  function defaultFeedback(language) {
    var lang = normalizeLanguage(language);
    return {
      before: lang === 'en' ? 'First understand the model, then answer without copying it word for word.' : 'Verstehe zuerst das Modell und antworte danach, ohne es Wort für Wort zu kopieren.',
      correct: lang === 'en' ? 'Correct. Explain to yourself why the answer fits and use the same pattern in your own sentence.' : 'Richtig. Erkläre dir kurz, warum die Antwort passt, und nutze das Muster anschließend in deinem eigenen Satz.',
      retry: lang === 'en' ? 'Not yet. Compare meaning, word order and the concrete situation before trying again.' : 'Noch nicht. Vergleiche Bedeutung, Wortstellung und die konkrete Situation, bevor du erneut antwortest.'
    };
  }
  function buildPlan(input) {
    input = input || {};
    var language = normalizeLanguage(input.language), level = normalizeLevel(input.level), lesson = input.lesson || {}, tasks = array(input.tasks), pairs = vocabPairs(language, lesson), profile = levelProfile(level), labels = languageLabels(language);
    var goal = text(lesson.goal || lesson.goalI18n && lesson.goalI18n.de || 'Das Thema sicher verstehen und anwenden.');
    return {
      schema: SCHEMA,
      version: VERSION,
      language: language,
      level: level,
      levelLabel: profile.label,
      lessonId: text(lesson.id || 'lesson'),
      title: text(lesson.title || 'Lektion'),
      goal: goal,
      explanation: deriveExplanation(language, level, lesson, pairs),
      modelExample: deriveModel(language, level, lesson, tasks, pairs),
      guidedPractice: deriveGuidedPrompt(language, level, lesson, tasks),
      freeApplication: {
        prompt: deriveTransferPrompt(language, level, lesson, pairs),
        minWords: profile.minWords,
        targetSentences: profile.targetSentences,
        starter: language === 'en' ? first(array(lesson.speaking), 'In this situation, I would ...') : first(tasks.map(taskModel), 'In dieser Situation würde ich ...')
      },
      criteria: criteria(language, level),
      feedback: defaultFeedback(language),
      selfCheck: labels.selfCheck,
      stages: [
        { id: 'goal', label: '1 · Lernziel', purpose: goal },
        { id: 'explain', label: '2 · Kurz erklärt', purpose: deriveExplanation(language, level, lesson, pairs) },
        { id: 'guided', label: '3 · Geführt üben', purpose: deriveGuidedPrompt(language, level, lesson, tasks) },
        { id: 'transfer', label: '4 · Selbst anwenden', purpose: deriveTransferPrompt(language, level, lesson, pairs) },
        { id: 'feedback', label: '5 · Feedback & nächster Schritt', purpose: language === 'en' ? 'Check the criteria, review mistakes and continue only after one own application.' : 'Prüfe die Kriterien, wiederhole Fehler und gehe erst nach einer eigenen Anwendung weiter.' }
      ]
    };
  }
  function countWords(value) {
    var clean = text(value);
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  }
  function countSentences(value) {
    var clean = text(value);
    if (!clean) return 0;
    var ends = clean.match(/[.!?]+(?:\s|$)/g);
    return Math.max(1, ends ? ends.length : 1);
  }
  function evaluateTransfer(input) {
    input = input || {};
    var plan = input.plan || buildPlan(input), response = text(input.response), words = countWords(response), sentences = countSentences(response), checked = array(input.checkedCriteria), profile = levelProfile(plan.level);
    var wordReady = words >= profile.minWords, sentenceReady = sentences >= Math.max(1, profile.targetSentences - 1), selfReady = checked.length >= 2;
    var status = !response ? 'empty' : (wordReady && sentenceReady && selfReady ? 'ready' : (words >= Math.ceil(profile.minWords * 0.55) ? 'draft' : 'short'));
    var message;
    if (status === 'empty') message = 'Noch keine eigene Anwendung gespeichert.';
    else if (status === 'ready') message = 'Die Anwendung erfüllt die formalen Lernkriterien. Grammatik und inhaltliche Genauigkeit werden dadurch nicht automatisch zertifiziert.';
    else if (status === 'draft') message = 'Guter Entwurf. Ergänze noch Inhalt, vollständige Sätze oder den Selbstcheck.';
    else message = 'Die Antwort ist noch zu kurz für dieses Niveau. Nutze das Modell und formuliere vollständiger.';
    return { status: status, response: response, words: words, sentences: sentences, checkedCriteria: checked, requiredWords: profile.minWords, targetSentences: profile.targetSentences, message: message, ready: status === 'ready' };
  }
  function recommendation(input) {
    input = input || {};
    var done = Number(input.done || 0), total = Number(input.total || 0), accuracy = Number(input.accuracy || 0), due = Number(input.due || 0), transferReady = !!input.transferReady, nextTitle = text(input.nextLessonTitle || 'die nächste Lektion');
    if (done === 0) return { code: 'start-guided', title: 'Mit der geführten Übung starten', detail: 'Lies die kurze Erklärung, bearbeite die erste Aufgabe und nutze danach das Modell für eine eigene Anwendung.' };
    if (accuracy < 60) return { code: 'repeat-guided', title: 'Geführte Übung wiederholen', detail: 'Wiederhole zuerst falsche Aufgaben und vergleiche Bedeutung, Satzbau und Situation.' };
    if (due > 0) return { code: 'review-due', title: 'Fälliges Review bearbeiten', detail: due + ' Aufgabe(n) sind tatsächlich fällig. Bearbeite diese vor neuem Stoff.' };
    if (!transferReady) return { code: 'complete-transfer', title: 'Eigene Anwendung abschließen', detail: 'Nutze den Wortschatz in einer eigenen Antwort und prüfe sie mit den drei Selbstcheck-Kriterien.' };
    if (total && done < total) return { code: 'continue-lesson', title: 'Lektion weiterführen', detail: 'Die eigene Anwendung ist vorhanden. Bearbeite nun die restlichen Aufgaben dieser Lektion.' };
    if (accuracy < 85) return { code: 'targeted-review', title: 'Fehler gezielt wiederholen', detail: 'Die Lektion ist abgeschlossen, aber einzelne Muster brauchen noch Sicherheit.' };
    return { code: 'next-lesson', title: 'Weiter mit ' + nextTitle, detail: 'Lernziel, Aufgaben und eigene Anwendung sind abgeschlossen. Die nächste Lektion ist sinnvoll.' };
  }
  function safeRead() {
    try {
      var raw = root.localStorage && root.localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (!data || typeof data !== 'object') data = {};
      if (!data.records || typeof data.records !== 'object') data.records = {};
      data.schema = SCHEMA;
      return data;
    } catch (e) { return { schema: SCHEMA, records: {} }; }
  }
  function safeWrite(data) {
    try { if (root.localStorage) root.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
  }
  function recordKey(language, level, lessonId) { return normalizeLanguage(language) + ':' + normalizeLevel(level) + ':' + text(lessonId); }
  function getRecord(language, level, lessonId) {
    var data = safeRead(), record = data.records[recordKey(language, level, lessonId)] || {};
    return {
      schema: SCHEMA,
      response: text(record.response),
      checkedCriteria: array(record.checkedCriteria),
      evaluation: record.evaluation || null,
      updatedAt: record.updatedAt || null
    };
  }
  function saveRecord(input) {
    input = input || {};
    var data = safeRead(), key = recordKey(input.language, input.level, input.lessonId), plan = input.plan || buildPlan(input);
    var evaluation = evaluateTransfer({ plan: plan, response: input.response, checkedCriteria: input.checkedCriteria });
    data.records[key] = { schema: SCHEMA, response: evaluation.response, checkedCriteria: evaluation.checkedCriteria, evaluation: evaluation, updatedAt: new Date().toISOString() };
    data.updatedAt = data.records[key].updatedAt;
    safeWrite(data);
    return data.records[key];
  }
  function auditLesson(input) {
    var plan = buildPlan(input), errors = [];
    ['goal', 'explanation', 'modelExample', 'guidedPractice'].forEach(function (field) { if (!text(plan[field])) errors.push(field + ' fehlt'); });
    if (!plan.freeApplication || !text(plan.freeApplication.prompt)) errors.push('freie Anwendung fehlt');
    if (!Array.isArray(plan.criteria) || plan.criteria.length < 3) errors.push('Erfolgskriterien unvollständig');
    if (!Array.isArray(plan.stages) || plan.stages.length !== 5) errors.push('Lernphasen unvollständig');
    if (!plan.feedback || !text(plan.feedback.correct) || !text(plan.feedback.retry)) errors.push('Feedback fehlt');
    return { ok: errors.length === 0, language: plan.language, level: plan.level, lessonId: plan.lessonId, errors: errors, plan: plan };
  }

  root.LanguageDidacticEngine = {
    version: VERSION,
    schema: SCHEMA,
    storageKey: STORAGE_KEY,
    buildPlan: buildPlan,
    evaluateTransfer: evaluateTransfer,
    recommendation: recommendation,
    getRecord: getRecord,
    saveRecord: saveRecord,
    auditLesson: auditLesson,
    countWords: countWords,
    countSentences: countSentences
  };
})(typeof window !== 'undefined' ? window : this);
