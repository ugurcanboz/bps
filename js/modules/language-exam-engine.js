/* Language Academy · Phase 38C.10
   Robuste Prüfungs-Engine: harte lokale Bewertung + optionaler Groq-Prüfer.
   Phase 38C.10 härtet zusätzlich die B1-Sprechprüfung mit Gesprächsstruktur, Transkript-Safe-Mode und Punktdeckelung. */
(function(){
  'use strict';

  var VERSION = 'G54.38C.11-b1-full-exam-qa-engine';
  var STATUS_EVENT = 'language-academy-exam:status';
  var lastStatus = { ok:null, mode:null, checkedAt:null, error:null };

  function clamp(n, min, max){ n = Number(n || 0); return Math.max(min, Math.min(max, n)); }
  function round(n){ return Math.round(Number(n || 0)); }
  function nowIso(){ return new Date().toISOString(); }
  function blueprints(){ return window.LanguageExamBlueprints || null; }
  function speakingAI(){ return window.LanguageSpeakingAI || null; }
  function emit(status){
    lastStatus = Object.assign({}, lastStatus, status || {}, { checkedAt:nowIso() });
    try{ document.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail:Object.assign({}, lastStatus) })); }catch(e){}
    return Object.assign({}, lastStatus);
  }
  function normalizeLevel(level){
    var value = String(level || 'B1').toUpperCase();
    return /^(A1|A2|B1|B2|C1|C2)$/.test(value) ? value : 'B1';
  }
  function getBlueprint(level){
    var bp = blueprints();
    return bp && bp.get ? bp.get(normalizeLevel(level)) : null;
  }
  function cleanText(value, max){
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max || 8000);
  }
  function words(text){
    var t = cleanText(text, 12000).toLowerCase();
    return t ? t.split(/[^a-zäöüß0-9]+/i).filter(Boolean) : [];
  }
  function meaningfulWords(text, minLength){
    return words(text).filter(function(w){ return w.length >= (minLength || 4); });
  }
  function unique(list){ return Array.from(new Set(list || [])); }
  function taskKeyTerms(task){
    var req = Array.isArray(task && task.requiredPoints) ? task.requiredPoints : [];
    return unique(
      meaningfulWords((task && task.title) || '', 4)
        .concat(meaningfulWords((task && task.prompt) || '', 5))
        .concat(meaningfulWords(req.join(' '), 4))
    ).slice(0, 40);
  }
  function markerHit(text, patterns){
    return (patterns || []).some(function(rx){ return rx.test(text); });
  }
  function semanticRequiredHit(text, point, part){
    point = String(point || '').toLowerCase();
    if(!point) return false;
    if(/anrede|begrüßung|einstieg/.test(point)) return markerHit(text, [/sehr geehrte/, /guten tag/, /hallo/, /liebe\s+/, /dear/, /merhaba/]);
    if(/abschluss|schlussformel|verabschiedung/.test(point)) return markerHit(text, [/mit freundlichen grüßen/, /freundliche grüße/, /vielen dank/, /danke/, /beste grüße/, /ich freue mich auf/i, /rückmeldung/i]);
    if(/problem|beschreiben|mitteilen|abwesenheit|lärm|zugang|funktioniert|beschwerde/.test(point)) return markerHit(text, [/problem/, /funktioniert nicht/, /nicht funktioniert/, /zugang/, /beschwer/, /lärm/, /laut/, /abwesen/, /nicht kommen/, /nicht arbeiten/, /kann .* nicht/, /seit\s+\w+/, /seit\s+\d+/]);
    if(/folge|nachteil|konsequenz/.test(point)) return markerHit(text, [/deshalb/, /dadurch/, /folge/, /nachteil/, /verpasst/, /konnte nicht/, /nicht teilnehmen/, /schlafen/, /konzentrieren/, /problem für mich/]);
    if(/lösung|maßnahme|fordern|vorschlagen|ersatz|rückzahlung|alternative|schichttausch/.test(point)) return markerHit(text, [/bitte/, /ich bitte/, /ich fordere/, /lösung/, /ersatz/, /rückzahlung/, /zusätzliche/, /neuen termin/, /maßnahme/, /schichttausch/, /tausch/, /alternative/, /vorschlag/, /könnten sie/]);
    if(/zeitraum|dauer|termin|datum|uhrzeit/.test(point)) return markerHit(text, [/\d{1,2}[:.]\d{2}/, /montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag/, /morgen|heute|nächste|woche|tag|uhr|termin|zeitraum|dauer|von .* bis/]);
    if(/grund|begründung/.test(point)) return markerHit(text, [/weil/, /da ich/, /wegen/, /grund/, /termin/, /krank/, /behörde/, /arzt/, /familie/]);
    if(/rückmeldung|bestätigung/.test(point)) return markerHit(text, [/rückmeldung/, /bestätigung/, /bestätigen/, /antwort/, /melden/, /bescheid/]);
    if(/sachlich|höflich|ton|respektvoll/.test(point)) return !markerHit(text, [/idiot/, /schei/, /dumm/, /frech/, /sofort!!!/]) && markerHit(text, [/bitte/, /danke/, /freundlich/, /höflich/, /verständnis/]);
    return null;
  }
  function countRequiredHits(userText, requiredPoints, part){
    var text = cleanText(userText, 12000).toLowerCase();
    return (requiredPoints || []).map(function(point){
      var semantic = semanticRequiredHit(text, point, part);
      var keys = meaningfulWords(point, 4).slice(0, 4);
      var hit = semantic === null ? keys.some(function(k){ return text.indexOf(k) !== -1; }) : semantic;
      return { point:point, hit:!!hit, keys:keys, semantic:semantic !== null };
    });
  }
  function topicScore(userText, task){
    var text = cleanText(userText, 12000).toLowerCase();
    if(!text) return 0;
    var keys = taskKeyTerms(task);
    if(!keys.length) return 50;
    var hits = keys.filter(function(k){ return text.indexOf(k) !== -1; }).length;
    return clamp(Math.round((hits / keys.length) * 100), 0, 100);
  }
  function lengthScore(userText, minWords, maxWords){
    var wc = words(userText).length;
    if(!wc) return 0;
    if(!minWords) return clamp(wc * 6, 0, 100);
    if(wc < minWords) return clamp(Math.round((wc / minWords) * 70), 0, 70);
    if(maxWords && wc > maxWords * 1.35) return 72;
    return 100;
  }
  function structureScore(userText){
    var text = cleanText(userText, 12000);
    if(!text) return 0;
    var sentenceCount = (text.match(/[.!?]/g) || []).length || Math.max(1, text.split(/\b(und|aber|weil|deshalb|denn|dann|außerdem)\b/i).length - 1);
    var wc = words(text).length;
    if(wc < 8) return 20;
    if(sentenceCount >= 3 && wc >= 50) return 92;
    if(sentenceCount >= 2 && wc >= 30) return 78;
    if(wc >= 20) return 62;
    return 45;
  }

  function lexicalDiversityScore(userText){
    var list = words(userText);
    if(!list.length) return 0;
    var uniq = unique(list);
    return clamp(Math.round((uniq.length / list.length) * 100), 0, 100);
  }
  function hasFormalFrame(userText){
    var t = cleanText(userText, 12000).toLowerCase();
    var greeting = /(sehr geehrte|guten tag|hallo|liebe|dear|merhaba)/i.test(t);
    var closing = /(mit freundlichen grüßen|freundliche grüße|vielen dank|danke|beste grüße|gruß|hochachtungsvoll)/i.test(t);
    var polite = /(bitte|vielen dank|danke|freundlich|verständnis|rückmeldung|mit freundlichen)/i.test(t);
    return { greeting:greeting, closing:closing, polite:polite, ok:greeting && closing && polite };
  }
  function writingStructureCheck(userText, task){
    var t = cleanText(userText, 12000).toLowerCase();
    var frame = hasFormalFrame(userText);
    var subject = /(betreff|beschwerde|anfrage|bitte um|termin|schichttausch|lärm|onlinekurs|rückerstattung)/i.test(t);
    var paragraphLike = (cleanText(userText, 12000).split(/\n\s*\n|\n|\.\s+/).filter(function(x){ return words(x).length >= 6; }).length >= 3);
    var taskText = ((task && (task.prompt + ' ' + task.title)) || '').toLowerCase();
    var registerNeeded = /(formell|beschwerde|teamleitung|hausverwaltung|anbieter|arbeitgeber|behörde)/.test(taskText);
    var informalRisk = /(hey\b|hi\b|servus|alter|bruder|digga|lol|!{2,}|\?{2,})/i.test(t);
    var demandToneRisk = /(sofort|unverschämt|frechheit|ich verlange sofort|das ist schei)/i.test(t);
    var ok = frame.greeting && frame.closing && paragraphLike && (!registerNeeded || !informalRisk) && !demandToneRisk;
    var missing = [];
    if(!frame.greeting) missing.push('formelle Anrede fehlt');
    if(registerNeeded && !subject) missing.push('klarer Betreff/Anlass fehlt');
    if(!paragraphLike) missing.push('Text ist nicht ausreichend gegliedert');
    if(!frame.closing) missing.push('höflicher Abschluss fehlt');
    if(informalRisk) missing.push('Register zu informell');
    if(demandToneRisk) missing.push('Ton zu scharf oder unsachlich');
    return { greeting:frame.greeting, closing:frame.closing, polite:frame.polite, subject:subject, paragraphLike:paragraphLike, registerNeeded:registerNeeded, informalRisk:informalRisk, demandToneRisk:demandToneRisk, ok:ok, missing:missing };
  }

  function speakingStructureCheck(userText, task){
    var t = cleanText(userText, 12000).toLowerCase();
    var frame = hasFormalFrame(userText);
    var wc = words(userText).length;
    var sentenceLike = (cleanText(userText, 12000).match(/[.!?]/g) || []).length >= 2 || /\b(weil|deshalb|außerdem|dann|könnten|würde|bitte|vorschlagen)\b/i.test(t);
    var concreteTime = /\b\d{1,2}[:.]\d{2}\b|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|nächste|uhr|termin|vormittag|nachmittag|abend|woche/i.test(t);
    var reason = /\bweil\b|\bwegen\b|\bda ich\b|grund|krank|termin|zug|behörde|arbeit|familie|dringend/i.test(t);
    var request = /bitte|könnten|würden|vorschlag|möglich|rückmeldung|bestätigung|ersatz|rückerstattung|tauschen|neuen termin|lösung|frage|fragen/i.test(t);
    var question = /\?|könnten sie|ist es möglich|wann|wo|wie viel|kost|uhrzeit|treffpunkt|passt/i.test(t);
    var informalRisk = /(alter|bruder|digga|lol|schei|halt die|nerv|!{2,}|\?{2,})/i.test(t);
    var keywordsOnly = wc > 0 && wc < 18 && (cleanText(userText, 12000).split(/[.!?]/).filter(function(x){ return words(x).length >= 4; }).length < 1);
    var ok = frame.greeting && (frame.closing || frame.polite) && sentenceLike && request && !informalRisk && !keywordsOnly;
    var missing = [];
    if(!frame.greeting) missing.push('Begrüßung/Einstieg fehlt');
    if(!sentenceLike) missing.push('keine zusammenhängende Gesprächsstruktur');
    if(!reason) missing.push('Grund/Situation nicht klar erklärt');
    if(!request) missing.push('Vorschlag, Rückfrage oder konkrete Bitte fehlt');
    if(!question && /frage|erfragen|kurs|schule|information/i.test(((task && task.prompt) || '') + ' ' + ((task && task.title) || ''))) missing.push('konkrete Rückfrage fehlt');
    if(!concreteTime && /termin|uhrzeit|schicht|treffpunkt|zeitraum|ankunft/i.test(((task && task.prompt) || '') + ' ' + ((task && task.requiredPoints || []).join(' ')))) missing.push('konkrete Zeit/Terminangabe fehlt');
    if(!frame.closing) missing.push('höflicher Abschluss fehlt');
    if(informalRisk) missing.push('Ton/Register nicht prüfungstauglich');
    if(keywordsOnly) missing.push('nur Stichwörter statt Sprechantwort');
    return { greeting:frame.greeting, closing:frame.closing, polite:frame.polite, sentenceLike:sentenceLike, reason:reason, request:request, question:question, concreteTime:concreteTime, informalRisk:informalRisk, keywordsOnly:keywordsOnly, ok:ok, missing:missing };
  }
  function detectHardEdgeCases(userText, task, part, local){
    var t = cleanText(userText, 12000).toLowerCase();
    var list = words(userText);
    var reasons = [];
    var caps = [];
    if(list.length > 0 && list.length < 8){ reasons.push('Nur einzelne Wörter oder Stichwörter statt zusammenhängender Antwort.'); caps.push(35); }
    if(list.length >= 12 && lexicalDiversityScore(userText) < 38){ reasons.push('Sehr geringe sprachliche Vielfalt oder starke Wiederholungen.'); caps.push(58); }
    if(part === 'writing'){
      var ws = local && local.writingStructure ? local.writingStructure : writingStructureCheck(userText, task);
      if((task && task.minWords || 0) >= 90 && !ws.ok){ reasons.push('Formelle Schreibstruktur unvollständig: ' + (ws.missing || []).slice(0,3).join(', ') + '.'); caps.push(68); }
      if(ws.informalRisk || ws.demandToneRisk){ reasons.push('Register/Ton ist für eine B1-Schreibprüfung nicht passend.'); caps.push(58); }
      if(ws.registerNeeded && !ws.subject){ reasons.push('Der Anlass/Betreff der formellen Nachricht ist nicht klar genug.'); caps.push(74); }
    }
    if(part === 'speaking'){
      var ss = local && local.speakingStructure ? local.speakingStructure : speakingStructureCheck(userText, task);
      if(!ss.ok){ reasons.push('Sprechstruktur unvollständig: ' + (ss.missing || []).slice(0,3).join(', ') + '.'); caps.push(68); }
      if(ss.keywordsOnly){ reasons.push('Nur Stichwörter statt zusammenhängender Sprechantwort.'); caps.push(35); }
      if(ss.informalRisk){ reasons.push('Ton/Register ist für eine B1-Sprechprüfung nicht passend.'); caps.push(55); }
      if((task && task.minWords || 0) >= 70 && list.length > 0 && list.length < Math.round((task.minWords || 70) * 0.65)){ reasons.push('Sprechantwort deutlich unter dem B1-Umfang.'); caps.push(50); }
    }
    if(local && local.topicScore < 55 && local.missingCorePoints >= 2){ reasons.push('Gute Einzelsprache reicht nicht: zentrale Aufgabe wird inhaltlich nicht erfüllt.'); caps.push(55); }
    if(/pizza|fußball|fussball|urlaub|musik|film|shopping/.test(t) && local && local.topicScore < 50){ reasons.push('Typischer Off-Topic-Inhalt erkannt.'); caps.push(30); }
    if(local && local.totalRequiredPoints >= 5 && local.fulfilledRequiredPoints <= 1){ reasons.push('Fast alle Pflichtpunkte fehlen.'); caps.push(45); }
    return { reasons:collectUnique(reasons), cap:caps.length ? Math.min.apply(Math, caps) : null };
  }

  function applyHardCaps(score, local){
    var caps = (blueprints() && blueprints().rubric && blueprints().rubric.hardCaps) || {};
    var capped = score;
    var reasons = [];
    if(local.wordCount === 0){ capped = Math.min(capped, caps.emptyAnswer || 0); reasons.push('Leere Antwort.'); }
    if(local.wordCount > 0 && local.wordCount < Math.max(8, Math.round((local.minWords || 0) * 0.45))){ capped = Math.min(capped, caps.tooShort || 45); reasons.push('Antwort deutlich zu kurz.'); }
    if(local.part === 'writing' && local.minWords && local.wordCount > 0 && local.wordCount < Math.round(local.minWords * 0.75)){ capped = Math.min(capped, 64); reasons.push('Schreibantwort deutlich unter der B1-Mindestlänge.'); }
    if(local.topicScore < 18){ capped = Math.min(capped, caps.completeOffTopic || 20); reasons.push('Antwort wirkt komplett am Thema vorbei.'); }
    else if(local.topicScore < 35){ capped = Math.min(capped, caps.strongOffTopic || 35); reasons.push('Starke Themenverfehlung.'); }
    if(local.missingCorePoints >= 2){ capped = Math.min(capped, caps.missingCorePoint || 68); reasons.push('Mehrere zentrale Pflichtpunkte fehlen.'); }
    if(local.part === 'writing' && local.writingStructure && !local.writingStructure.ok){ capped = Math.min(capped, 72); reasons.push('Schreibaufbau/Register nicht prüfungstauglich.'); }
    if(local.part === 'writing' && local.writingStructure && (local.writingStructure.informalRisk || local.writingStructure.demandToneRisk)){ capped = Math.min(capped, 58); reasons.push('Unpassender Ton/Register in formeller Schreibaufgabe.'); }
    if(local.part === 'speaking' && local.speakingStructure && !local.speakingStructure.ok){ capped = Math.min(capped, 72); reasons.push('Sprechstruktur nicht prüfungstauglich.'); }
    if(local.part === 'speaking' && local.speakingStructure && local.speakingStructure.keywordsOnly){ capped = Math.min(capped, 35); reasons.push('Nur Stichwörter statt B1-Sprechantwort.'); }
    if(local.part === 'speaking' && local.speakingStructure && local.speakingStructure.informalRisk){ capped = Math.min(capped, 55); reasons.push('Unpassender Ton/Register in Sprechaufgabe.'); }
    return { score:round(capped), capReasons:reasons };
  }
  function localAssessResponse(options){
    options = options || {};
    var level = normalizeLevel(options.level);
    var bp = getBlueprint(level);
    var part = String(options.part || 'speaking');
    var task = options.task || (bp && bp.speakingTasks && bp.speakingTasks[0]) || {};
    var userText = cleanText(options.userText || options.message, 12000);
    var req = Array.isArray(task.requiredPoints) ? task.requiredPoints : (Array.isArray(options.requiredPoints) ? options.requiredPoints : []);
    var min = Number(task.minWords || (bp && bp.parts && bp.parts[part] && bp.parts[part].minWords) || 0);
    var max = Number(task.maxWords || 0) || null;
    var wc = words(userText).length;
    var reqHits = countRequiredHits(userText, req, part);
    var fulfilled = reqHits.filter(function(x){ return x.hit; }).length;
    var missing = reqHits.filter(function(x){ return !x.hit; }).map(function(x){ return x.point; });
    var local = {
      level:level,
      part:part,
      taskId:task.id || null,
      wordCount:wc,
      minWords:min,
      maxWords:max,
      topicScore:topicScore(userText, task),
      lengthScore:lengthScore(userText, min, max),
      structureScore:structureScore(userText),
      lexicalDiversityScore:lexicalDiversityScore(userText),
      writingStructure: part === 'writing' ? writingStructureCheck(userText, task) : null,
      speakingStructure: part === 'speaking' ? speakingStructureCheck(userText, task) : null,
      requiredScore:req.length ? round((fulfilled / req.length) * 100) : 70,
      fulfilledRequiredPoints:fulfilled,
      totalRequiredPoints:req.length,
      missingPoints:missing,
      missingCorePoints:missing.length,
      offTopic:false,
      passedLocal:false,
      rawScore:0,
      score:0,
      capReasons:[],
      edgeCaseReasons:[]
    };
    local.offTopic = local.topicScore < 35;
    if(part === 'writing'){
      var writingStructureScore = local.writingStructure && local.writingStructure.ok ? 100 : Math.max(35, 100 - ((local.writingStructure && local.writingStructure.missing ? local.writingStructure.missing.length : 0) * 14));
      local.writingStructureScore = writingStructureScore;
      local.rawScore = round(local.topicScore * 0.25 + local.requiredScore * 0.30 + local.lengthScore * 0.15 + local.structureScore * 0.15 + writingStructureScore * 0.15);
    }else if(part === 'speaking'){
      var speakingStructureScore = local.speakingStructure && local.speakingStructure.ok ? 100 : Math.max(30, 100 - ((local.speakingStructure && local.speakingStructure.missing ? local.speakingStructure.missing.length : 0) * 12));
      local.speakingStructureScore = speakingStructureScore;
      local.rawScore = round(local.topicScore * 0.28 + local.requiredScore * 0.30 + local.lengthScore * 0.15 + speakingStructureScore * 0.17 + local.structureScore * 0.10);
    }else{
      local.rawScore = round(local.topicScore * 0.30 + local.requiredScore * 0.30 + local.lengthScore * 0.20 + local.structureScore * 0.20);
    }
    var edge = detectHardEdgeCases(userText, task, part, local);
    local.edgeCaseReasons = edge.reasons || [];
    var capped = applyHardCaps(local.rawScore, local);
    local.score = edge.cap != null ? Math.min(capped.score, edge.cap) : capped.score;
    local.capReasons = collectUnique((capped.capReasons || []).concat(local.edgeCaseReasons || []));
    var minScore = (bp && bp.parts && bp.parts[part] && bp.parts[part].minScore) || (bp && bp.partMinScore) || 55;
    local.passedLocal = local.score >= minScore && !local.offTopic && wc >= Math.max(8, Math.round(min * 0.55));
    return local;
  }
  function normalizeAiResult(aiResponse){
    var r = aiResponse && aiResponse.result ? aiResponse.result : aiResponse;
    r = r || {};
    return {
      mode: (aiResponse && aiResponse.mode) || 'unknown',
      passed: !!r.passed,
      overallScore: clamp(r.overallScore, 0, 100),
      topicScore: clamp(r.topicScore, 0, 100),
      grammarScore: r.grammarScore == null ? null : clamp(r.grammarScore, 0, 100),
      vocabularyScore: r.vocabularyScore == null ? null : clamp(r.vocabularyScore, 0, 100),
      fluencyScore: r.fluencyScore == null ? null : clamp(r.fluencyScore, 0, 100),
      offTopic: !!r.offTopic,
      missingPoints: Array.isArray(r.missingPoints) ? r.missingPoints : [],
      strengths: Array.isArray(r.strengths) ? r.strengths : [],
      weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses : [],
      examFeedback: cleanText(r.examFeedback || r.reply || '', 2400),
      nextPrompt: cleanText(r.nextPrompt || '', 800)
    };
  }
  function combineHybrid(level, part, local, ai){
    var bp = getBlueprint(level) || { passScore:70, safePassScore:82, partMinScore:55 };
    var rubric = (blueprints() && blueprints().rubric) || { localWeight:0.4, aiWeight:0.6 };
    var aiUsable = ai && typeof ai.overallScore === 'number' && ai.overallScore > 0;
    var localWeight = aiUsable ? Number(rubric.localWeight || 0.4) : 1;
    var aiWeight = aiUsable ? Number(rubric.aiWeight || 0.6) : 0;
    var overall = round(local.score * localWeight + (aiUsable ? ai.overallScore * aiWeight : 0));
    var partMin = (bp.parts && bp.parts[part] && bp.parts[part].minScore) || bp.partMinScore || 55;
    var hardFail = [];
    if(local.offTopic || (ai && ai.offTopic)) hardFail.push('Themenverfehlung erkannt.');
    if(local.wordCount < Math.max(8, Math.round((local.minWords || 0) * 0.45))) hardFail.push('Antwort deutlich zu kurz.');
    if(local.missingCorePoints >= 2) hardFail.push('Zentrale Pflichtpunkte fehlen.');
    (local.edgeCaseReasons || []).forEach(function(reason){ hardFail.push(reason); });
    if(overall < partMin) hardFail.push('Mindestleistung im Prüfungsteil nicht erreicht.');
    if(part === 'writing' && local.minWords && local.wordCount < Math.round(local.minWords * 0.75)) hardFail.push('Schreibantwort deutlich unter der Mindestlänge.');
    if(part === 'speaking' && local.minWords && local.wordCount < Math.round(local.minWords * 0.65)) hardFail.push('Sprechantwort deutlich unter dem B1-Mindestumfang.');
    if(part === 'speaking' && local.speakingStructure && (local.speakingStructure.keywordsOnly || local.speakingStructure.informalRisk)) hardFail.push('Sprechantwort nicht prüfungstauglich strukturiert.');
    var passed = hardFail.length === 0 && overall >= bp.passScore && local.score >= partMin;
    var readiness = overall >= bp.safePassScore && hardFail.length === 0 ? 'Sehr gute reale Chancen' :
      (passed ? 'Realistische Chancen' : (overall >= bp.passScore - 8 ? 'Unsichere Chancen' : 'Noch nicht prüfungsbereit'));
    return {
      level:level,
      part:part,
      passed:passed,
      overallScore:overall,
      passScore:bp.passScore,
      safePassScore:bp.safePassScore,
      partMinScore:partMin,
      readiness:readiness,
      hardFailReasons:hardFail,
      local:local,
      ai:ai || null,
      weights:{ local:localWeight, ai:aiWeight },
      generatedAt:nowIso()
    };
  }
  async function assessAiExamPart(options){
    options = options || {};
    var part = String(options.part || 'speaking');
    var level = normalizeLevel(options.level);
    var bp = getBlueprint(level);
    var taskList = part === 'writing' ? (bp && bp.writingTasks) : (bp && bp.speakingTasks);
    var task = options.task || (taskList && taskList[0]) || {};
    var userText = cleanText(options.userText || options.message, 12000);
    var local = localAssessResponse({ level:level, part:part, task:task, userText:userText });
    var ai = null;
    var aiError = null;
    try{
      if(!speakingAI() || !speakingAI().checkExamSpeaking) throw new Error('LanguageSpeakingAI nicht verfügbar.');
      var res = await speakingAI().checkExamSpeaking({
        level:level,
        topic: (part === 'writing' ? 'Schreibprüfung: ' : 'Sprechprüfung: ') + (task.title || options.topic || 'Prüfungsaufgabe'),
        userText:userText,
        requiredPoints: task.requiredPoints || options.requiredPoints || [],
        examinerMode:'strict-b1-writing-speaking',
        rubric: part === 'writing' ? {
          role:'strenger B1-Schreibprüfer',
          judge:['Aufgabenbezug','Pflichtpunkte','formeller Aufbau','Betreff/Anlass','Register/Höflichkeit','Grammatik','Wortschatz','Kohärenz'],
          hardCaps:['Thema verfehlt maximal 40%','zu kurz maximal 45%','fehlende zentrale Pflichtpunkte maximal 68%','unformeller/aggressiver Ton maximal 58%'],
          noSugarcoating:true
        } : {
          role:'strenger B1-Sprechprüfer',
          noSugarcoating:true
        }
      });
      ai = normalizeAiResult(res);
      emit({ ok:true, mode:ai.mode || 'live', error:null });
    }catch(error){
      aiError = error && error.message ? error.message : String(error);
      emit({ ok:false, mode:'local-only', error:aiError });
    }
    var hybrid = combineHybrid(level, part, local, ai);
    if(aiError) hybrid.aiError = aiError;
    return hybrid;
  }

  async function assessSpeakingExam(options){
    options = Object.assign({}, options || {}, { part:'speaking' });
    return assessAiExamPart(options);
  }
  async function assessWritingExam(options){
    options = Object.assign({}, options || {}, { part:'writing' });
    return assessAiExamPart(options);
  }
  function createSession(level){
    level = normalizeLevel(level);
    var bp = getBlueprint(level);
    return {
      id:'exam-' + level.toLowerCase() + '-' + Date.now(),
      level:level,
      startedAt:nowIso(),
      status:'created',
      currentPart:null,
      blueprintVersion: blueprints() ? blueprints().__version : null,
      passScore: bp ? bp.passScore : 70,
      safePassScore: bp ? bp.safePassScore : 82,
      parts:{ reading:null, listening:null, writing:null, speaking:null }
    };
  }
  function partLabel(part){
    return ({ reading:'Lesen', listening:'Hören', writing:'Schreiben', speaking:'Sprechen' })[part] || part;
  }
  function partMinScore(bp, part){
    return (bp && bp.parts && bp.parts[part] && bp.parts[part].minScore) || (bp && bp.partMinScore) || 55;
  }
  function resultScore(result){
    if(!result) return null;
    if(typeof result.overallScore === 'number') return round(result.overallScore);
    if(typeof result.score === 'number') return round(result.score);
    return null;
  }
  function collectUnique(list){
    var seen = {};
    return (list || []).filter(function(item){
      item = cleanText(item, 400);
      if(!item || seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
  function partBreakdown(session, bp){
    var partNames = ['reading','listening','writing','speaking'];
    return partNames.map(function(part){
      var result = session.parts && session.parts[part];
      var score = resultScore(result);
      var min = partMinScore(bp, part);
      var passed = !!(result && (result.passed === true || result.passedLocal === true)) && score !== null && score >= min;
      var hardFailReasons = collectUnique((result && (result.hardFailReasons || result.capReasons)) || []);
      var missingPoints = collectUnique((result && result.local && result.local.missingPoints) || (result && result.missingPoints) || []);
      var aiWeaknesses = collectUnique((result && result.ai && result.ai.weaknesses) || []);
      var aiStrengths = collectUnique((result && result.ai && result.ai.strengths) || []);
      var status = !result ? 'offen' : (passed ? 'bestanden' : 'kritisch');
      var risk = !result ? 'not-completed' : (score < min ? 'below-minimum' : (score < (bp.passScore || 70) ? 'borderline' : 'ok'));
      return {
        part:part,
        label:partLabel(part),
        score:score,
        minScore:min,
        passed:passed,
        status:status,
        risk:risk,
        readiness: cleanText((result && result.readiness) || '', 400),
        hardFailReasons:hardFailReasons,
        missingPoints:missingPoints,
        aiWeaknesses:aiWeaknesses,
        aiStrengths:aiStrengths,
        result:result || null
      };
    });
  }
  function buildRecommendations(breakdown, bp){
    var rec = [];
    var byPart = {};
    breakdown.forEach(function(item){ byPart[item.part] = item; });
    if(byPart.reading && byPart.reading.score !== null && byPart.reading.score < partMinScore(bp, 'reading')) rec.push('Lesen: Arbeite mit längeren B1-Texten, markiere Schlüsselstellen und begründe jede Antwort mit einer Textstelle.');
    if(byPart.listening && byPart.listening.score !== null && byPart.listening.score < partMinScore(bp, 'listening')) rec.push('Hören: Trainiere Durchsagen, Telefonnotizen und Detailinformationen. Höre erst global, dann gezielt nach Zahlen, Zeiten und Gründen.');
    if(byPart.writing && byPart.writing.score !== null && byPart.writing.score < Math.max(partMinScore(bp, 'writing'), bp.passScore - 5)) rec.push('Schreiben: Übe formelle E-Mails mit Anrede, Problem, Folge, konkreter Forderung und höflichem Abschluss.');
    if(byPart.speaking && byPart.speaking.score !== null && byPart.speaking.score < Math.max(partMinScore(bp, 'speaking'), bp.passScore - 5)) rec.push('Sprechen: Übe 1–2 Minuten zusammenhängend zu antworten. Nenne Grund, Vorschlag und Abschluss, statt nur Einzelwörter zu sagen.');
    breakdown.forEach(function(item){
      item.missingPoints.slice(0, 3).forEach(function(point){ rec.push(item.label + ': Pflichtpunkt wiederholen – ' + point + '.'); });
      item.hardFailReasons.slice(0, 2).forEach(function(reason){ rec.push(item.label + ': ' + reason); });
    });
    if(!rec.length) rec.push('Prüfungsniveau halten: Wiederhole die Simulation mit anderem Thema und achte darauf, dass kein Teilbereich unter die Mindestleistung fällt.');
    return collectUnique(rec).slice(0, 8);
  }
  function buildCriticalWeaknesses(breakdown){
    var critical = [];
    breakdown.forEach(function(item){
      if(item.status === 'offen') critical.push(item.label + ': Prüfungsteil noch nicht abgeschlossen.');
      if(item.score !== null && item.score < item.minScore) critical.push(item.label + ': Mindestleistung unterschritten (' + item.score + '% statt mindestens ' + item.minScore + '%).');
      if(item.passed === false && item.score !== null) critical.push(item.label + ': als nicht bestanden bewertet.');
      item.hardFailReasons.forEach(function(reason){ critical.push(item.label + ': ' + reason); });
      if(item.missingPoints.length >= 2) critical.push(item.label + ': mehrere Pflichtpunkte fehlen.');
    });
    return collectUnique(critical).slice(0, 10);
  }
  function buildStrengths(breakdown, bp){
    var strengths = [];
    breakdown.forEach(function(item){
      if(item.score !== null && item.score >= (bp.safePassScore || 82)) strengths.push(item.label + ': sicherer Bereich mit ' + item.score + '%.');
      else if(item.score !== null && item.score >= (bp.passScore || 70)) strengths.push(item.label + ': bestanden mit ' + item.score + '%.');
      item.aiStrengths.slice(0, 2).forEach(function(s){ strengths.push(item.label + ': ' + s); });
    });
    if(!strengths.length) strengths.push('Noch kein stabiler Stärkenbereich. Erst alle Prüfungsteile abschließen und gezielt wiederholen.');
    return collectUnique(strengths).slice(0, 8);
  }
  function readinessBand(overall, passed, weakParts, completedParts, bp){
    if(completedParts < 4) return { label:'Unvollständig', probability:0, verdict:'Es fehlen noch Prüfungsteile. Eine echte Prognose ist erst nach vollständiger Simulation sinnvoll.' };
    if(passed && overall >= (bp.safePassScore || 82) && weakParts.length === 0) return { label:'Sehr gute reale Chancen', probability:85, verdict:'Die Simulation wurde sicher bestanden. Eine echte Prüfung bleibt trotzdem abhängig von Tagesform und offizieller Aufgabenvariante.' };
    if(passed && weakParts.length === 0) return { label:'Realistische Chancen', probability:70, verdict:'Die Simulation wurde bestanden. Die reale Chance ist gut, aber noch nicht absolut sicher.' };
    if(overall >= (bp.passScore || 70) - 8) return { label:'Unsichere Chancen', probability:45, verdict:'Die Gesamtleistung ist nahe an der Grenze oder einzelne Teilbereiche sind kritisch. Eine echte Prüfung wäre riskant.' };
    return { label:'Noch nicht prüfungsbereit', probability:25, verdict:'Die Simulation zeigt deutliche Lücken. Vor einer echten Prüfung sollte gezielt weiter trainiert werden.' };
  }
  function buildTeacherSummary(final){
    if(final.completedParts < 4) return 'Die Prüfungssimulation ist noch nicht vollständig. Für eine harte Prognose müssen Lesen, Hören, Schreiben und Sprechen bewertet sein.';
    if(final.passed && final.readiness === 'Sehr gute reale Chancen') return 'Der Teilnehmer zeigt eine stabile Leistung über alle Prüfungsteile. Das Ergebnis spricht für echte Prüfungsreife, sofern die Leistung wiederholbar bleibt.';
    if(final.passed) return 'Der Teilnehmer hat bestanden, aber die Leistung sollte durch weitere Simulationen abgesichert werden. Besonders wichtig ist, dass kein Teilbereich abrutscht.';
    if(final.criticalWeaknesses.length) return 'Nicht bestanden. Die kritischen Schwächen zeigen, dass die Leistung für eine echte Prüfung aktuell noch zu unsicher ist.';
    return 'Nicht bestanden. Die Gesamtleistung reicht noch nicht aus, auch wenn einzelne Bereiche akzeptabel sein können.';
  }
  function computeFinal(session){
    session = session || {};
    var level = normalizeLevel(session.level);
    var bp = getBlueprint(level) || { passScore:70, safePassScore:82, partMinScore:55, parts:{} };
    var breakdown = partBreakdown(session, bp);
    var available = breakdown.filter(function(x){ return typeof x.score === 'number'; });
    var overall = available.length ? round(available.reduce(function(sum,x){ return sum + x.score; },0) / available.length) : 0;
    var weakParts = breakdown.filter(function(x){ return x.score === null || x.score < x.minScore || x.passed === false; }).map(function(x){ return x.part; });
    var completedParts = available.length;
    var passed = completedParts === 4 && overall >= bp.passScore && weakParts.length === 0;
    var band = readinessBand(overall, passed, weakParts, completedParts, bp);
    var criticalWeaknesses = buildCriticalWeaknesses(breakdown);
    var recommendations = buildRecommendations(breakdown, bp);
    var strengths = buildStrengths(breakdown, bp);
    var final = {
      level:level,
      completedParts:completedParts,
      totalParts:4,
      overallScore:overall,
      passScore:bp.passScore,
      safePassScore:bp.safePassScore,
      passed:passed,
      readiness:band.label,
      readinessProbability:band.probability,
      readinessVerdict:band.verdict,
      weakParts:weakParts,
      partBreakdown:breakdown.map(function(item){
        return { part:item.part, label:item.label, score:item.score, minScore:item.minScore, passed:item.passed, status:item.status, risk:item.risk, readiness:item.readiness, hardFailReasons:item.hardFailReasons, missingPoints:item.missingPoints, aiWeaknesses:item.aiWeaknesses, aiStrengths:item.aiStrengths };
      }),
      criticalWeaknesses:criticalWeaknesses,
      strengths:strengths,
      recommendations:recommendations,
      teacherSummary:'',
      examDecision: passed ? 'bestanden' : 'nicht bestanden',
      certificateEligible:false,
      certificateNote:'Dies ist eine interne Prüfungssimulation und kein offizielles Sprachzertifikat. Es gibt bewusst keine Prüfungsfreigabe, sondern nur Ergebnisbericht, Prognose und Empfehlung.',
      nextRequiredAction: passed ? 'Leistung mit weiteren Aufgabenvarianten absichern.' : 'Schwache Teilbereiche gezielt wiederholen und Simulation mit neuer Variante erneut starten.',
      generatedAt:nowIso()
    };
    final.teacherSummary = buildTeacherSummary(final);
    return final;
  }


  function createQaPartResult(part, score, options){
    options = options || {};
    score = round(score);
    var min = Number(options.minScore || (part === 'reading' || part === 'listening' ? 55 : 60));
    var passed = !!options.forcePass || (score >= min && !options.forceFail);
    var base = {
      part:part,
      mode:options.mode || 'phase38c11-qa-simulation',
      passed:passed,
      passedLocal:passed,
      overallScore:score,
      score:score,
      readiness: options.readiness || (passed ? 'QA: Prüfungsteil bestanden' : 'QA: Prüfungsteil kritisch'),
      hardFailReasons: collectUnique(options.hardFailReasons || []),
      capReasons: collectUnique(options.capReasons || []),
      generatedAt:nowIso()
    };
    if(part === 'writing' || part === 'speaking'){
      base.local = {
        level:'B1',
        part:part,
        score:score,
        wordCount:Number(options.wordCount || (part === 'writing' ? 130 : 95)),
        minWords:Number(options.minWords || (part === 'writing' ? 110 : 70)),
        topicScore:Number(options.topicScore == null ? score : options.topicScore),
        fulfilledRequiredPoints:Number(options.fulfilledRequiredPoints == null ? 5 : options.fulfilledRequiredPoints),
        totalRequiredPoints:Number(options.totalRequiredPoints || 6),
        missingPoints:collectUnique(options.missingPoints || []),
        missingCorePoints:Number(options.missingCorePoints || 0),
        offTopic:!!options.offTopic,
        edgeCaseReasons:collectUnique(options.edgeCaseReasons || [])
      };
      if(options.aiError){ base.aiError = options.aiError; }
      if(options.ai){ base.ai = options.ai; }
      base.weights = options.weights || { local: options.aiError ? 1 : 0.4, ai: options.aiError ? 0 : 0.6 };
    }
    return base;
  }
  function createB1FullQaSession(type){
    type = String(type || 'good-pass');
    var session = createSession('B1');
    session.id = 'phase38c11-b1-fullqa-' + type + '-' + Date.now();
    session.status = 'qa-simulated';
    session.currentPart = 'speaking';
    session.partOrder = ['reading','listening','writing','speaking'];
    session.answers = { reading:{}, listening:{}, writing:'', speaking:'' };
    session.parts = { reading:null, listening:null, writing:null, speaking:null };
    session.qaScenario = type;
    if(type === 'good-pass'){
      session.parts.reading = createQaPartResult('reading', 88, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 82, {minScore:55});
      session.parts.writing = createQaPartResult('writing', 78, {minScore:60, ai:{overallScore:80, strengths:['Aufgabe vollständig erfüllt'], weaknesses:[]}});
      session.parts.speaking = createQaPartResult('speaking', 76, {minScore:60, ai:{overallScore:77, strengths:['klare Gesprächsstruktur'], weaknesses:[]}});
    }else if(type === 'borderline-pass'){
      session.parts.reading = createQaPartResult('reading', 74, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 69, {minScore:55});
      session.parts.writing = createQaPartResult('writing', 71, {minScore:60, missingPoints:['eine Begründung könnte genauer sein'], missingCorePoints:0});
      session.parts.speaking = createQaPartResult('speaking', 70, {minScore:60, missingPoints:['Rückfrage nur knapp formuliert'], missingCorePoints:0});
    }else if(type === 'borderline-fail'){
      session.parts.reading = createQaPartResult('reading', 72, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 68, {minScore:55});
      session.parts.writing = createQaPartResult('writing', 61, {minScore:60, missingPoints:['konkrete Forderung fehlt'], missingCorePoints:1});
      session.parts.speaking = createQaPartResult('speaking', 54, {minScore:60, forceFail:true, hardFailReasons:['Mindestleistung im Prüfungsteil Sprechen nicht erreicht.'], missingPoints:['konkreter Vorschlag fehlt'], missingCorePoints:1});
    }else if(type === 'weak-speaking'){
      session.parts.reading = createQaPartResult('reading', 86, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 80, {minScore:55});
      session.parts.writing = createQaPartResult('writing', 75, {minScore:60});
      session.parts.speaking = createQaPartResult('speaking', 39, {minScore:60, forceFail:true, wordCount:24, hardFailReasons:['Sprechantwort deutlich unter dem B1-Mindestumfang.','Nur Stichwörter statt B1-Sprechantwort.'], missingPoints:['Grund fehlt','Vorschlag fehlt','höflicher Abschluss fehlt'], missingCorePoints:3, edgeCaseReasons:['Nur Stichwörter statt zusammenhängender Sprechantwort.']});
    }else if(type === 'wrong-writing-topic'){
      session.parts.reading = createQaPartResult('reading', 78, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 76, {minScore:55});
      session.parts.writing = createQaPartResult('writing', 34, {minScore:60, forceFail:true, offTopic:true, topicScore:20, hardFailReasons:['Starke Themenverfehlung.','Antwort erfüllt die Schreibaufgabe inhaltlich nicht.'], missingPoints:['Problem fehlt','konkrete Lösung fehlt','formeller Anlass fehlt'], missingCorePoints:3});
      session.parts.speaking = createQaPartResult('speaking', 72, {minScore:60});
    }else if(type === 'incomplete-listening'){
      session.parts.reading = createQaPartResult('reading', 82, {minScore:55});
      session.parts.listening = null;
      session.parts.writing = createQaPartResult('writing', 76, {minScore:60});
      session.parts.speaking = createQaPartResult('speaking', 74, {minScore:60});
    }else if(type === 'groq-down-fallback'){
      session.parts.reading = createQaPartResult('reading', 84, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 79, {minScore:55});
      session.parts.writing = createQaPartResult('writing', 73, {minScore:60, aiError:'Simulierter Groq-Ausfall: lokaler Fallback wurde verwendet.', weights:{local:1, ai:0}});
      session.parts.speaking = createQaPartResult('speaking', 71, {minScore:60, aiError:'Simulierter Groq-Ausfall: lokaler Fallback wurde verwendet.', weights:{local:1, ai:0}});
    }else{
      return createB1FullQaSession('good-pass');
    }
    session.final = computeFinal(session);
    return session;
  }
  function runB1FullExamQaScenarios(){
    var names = ['good-pass','borderline-pass','borderline-fail','weak-speaking','wrong-writing-topic','incomplete-listening','groq-down-fallback'];
    return names.map(function(name){
      var session = createB1FullQaSession(name);
      return { scenario:name, session:session, final:session.final };
    });
  }
  function validateB1FullExamQaScenarios(){
    var expected = {
      'good-pass':'bestanden',
      'borderline-pass':'bestanden',
      'borderline-fail':'nicht bestanden',
      'weak-speaking':'nicht bestanden',
      'wrong-writing-topic':'nicht bestanden',
      'incomplete-listening':'nicht bestanden',
      'groq-down-fallback':'bestanden'
    };
    var results = runB1FullExamQaScenarios().map(function(item){
      var decision = item.final && item.final.examDecision;
      return { scenario:item.scenario, expected:expected[item.scenario], actual:decision, ok:decision === expected[item.scenario], overall:item.final && item.final.overallScore, readiness:item.final && item.final.readiness, weakParts:item.final && item.final.weakParts };
    });
    return { ok:results.every(function(x){ return x.ok; }), phase:'38C.11', scenarios:results, checkedAt:nowIso() };
  }

  window.LanguageExamEngine = Object.freeze({
    __version:VERSION,
    statusEvent:STATUS_EVENT,
    lastStatus:function(){ return Object.assign({}, lastStatus); },
    listLevels:function(){ return blueprints() && blueprints().listLevels ? blueprints().listLevels() : ['A1','A2','B1','B2','C1','C2']; },
    getBlueprint:getBlueprint,
    createSession:createSession,
    localAssessResponse:localAssessResponse,
    assessSpeakingExam:assessSpeakingExam,
    assessWritingExam:assessWritingExam,
    combineHybrid:combineHybrid,
    computeFinal:computeFinal,
    createB1FullQaSession:createB1FullQaSession,
    runB1FullExamQaScenarios:runB1FullExamQaScenarios,
    validateB1FullExamQaScenarios:validateB1FullExamQaScenarios
  });
})();
