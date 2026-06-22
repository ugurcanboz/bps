/* Language Academy · Phase 38D.7
   Robuste Prüfungs-Engine: harte lokale Bewertung + optionaler Groq-Prüfer.
   Phase 38D.7 ergänzt B2-Gesamt-QA, Endsimulation und Regressionschecks für alle fünf Prüfungsteile. */
(function(){
  'use strict';

  var VERSION = 'G54.38D.7-b2-total-qa-engine';
  var STATUS_EVENT = 'language-academy-exam:status';
  var lastStatus = { ok:null, mode:null, checkedAt:null, error:null };

  function clamp(n, min, max){ n = Number(n || 0); return Math.max(min, Math.min(max, n)); }
  function round(n){ return Math.round(Number(n || 0)); }
  function nowIso(){ return new Date().toISOString(); }
  function blueprints(){ return window.LanguageExamBlueprints || null; }
  function difficultyRules(){ return window.LanguageLevelDifficultyRules || null; }
  function difficulty(level){ return difficultyRules() && difficultyRules().get ? difficultyRules().get(normalizeLevel(level)) : null; }
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
    if(/anrede|begrüßung|einstieg|adressat/.test(point)) return markerHit(text, [/sehr geehrte/, /guten tag/, /hallo/, /liebe\s+/, /dear/, /merhaba/]);
    if(/abschluss|schlussformel|verabschiedung/.test(point)) return markerHit(text, [/mit freundlichen grüßen/, /freundliche grüße/, /vielen dank/, /danke/, /beste grüße/, /ich freue mich auf/i, /rückmeldung/i]);
    if(/verspätung/.test(point)) return markerHit(text, [/später/, /verspät/, /bus.*spät/, /komme.*nicht.*pünktlich/]);
    if(/problem|beschreiben|mitteilen|abwesenheit|lärm|zugang|funktioniert|beschwerde/.test(point)) return markerHit(text, [/problem/, /funktioniert nicht/, /nicht funktioniert/, /zugang/, /beschwer/, /lärm/, /laut/, /abwesen/, /nicht kommen/, /nicht arbeiten/, /kann .* nicht/, /seit\s+\w+/, /seit\s+\d+/]);
    if(/folge|nachteil|konsequenz/.test(point)) return markerHit(text, [/deshalb/, /dadurch/, /folge/, /nachteil/, /verpasst/, /konnte nicht/, /nicht teilnehmen/, /schlafen/, /konzentrieren/, /problem für mich/]);
    if(/lösung|maßnahme|fordern|vorschlagen|ersatz|rückzahlung|alternative|schichttausch/.test(point)) return markerHit(text, [/bitte/, /ich bitte/, /ich fordere/, /lösung/, /ersatz/, /rückzahlung/, /zusätzliche/, /neuen termin/, /maßnahme/, /schichttausch/, /tausch/, /alternative/, /vorschlag/, /könnten sie/]);
    if(/zeitraum|dauer|termin|datum|uhrzeit/.test(point)) return markerHit(text, [/\b\d{1,2}[:.]\d{2}\b/, /montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag/, /morgen|heute|nächste|woche|tag|uhr|termin|zeitraum|dauer|von .* bis/]);
    if(/grund|begründung/.test(point)) return markerHit(text, [/weil/, /da ich/, /wegen/, /grund/, /termin/, /krank/, /behörde/, /arzt/, /familie/, /bus.*spät/]);
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

  function levelComplexitySignals(userText){
    var t = cleanText(userText, 12000).toLowerCase();
    var wc = words(userText).length;
    var sentences = (cleanText(userText, 12000).match(/[.!?]/g) || []).length;
    var argumentConnectors = (t.match(/\b(einerseits|andererseits|allerdings|dennoch|außerdem|zudem|folglich|daher|deshalb|während|obwohl|hingegen|im gegensatz|aus diesem grund|beispielsweise|zum beispiel|meiner ansicht|ich bin der meinung|meiner meinung|zusammenfassend|abschließend)\b/g) || []).length;
    var ownPosition = /\b(meine meinung|meiner meinung|meine begründete meinung|ich bin der meinung|ich halte|ich finde|meines erachtens|aus meiner sicht|ich vertrete die auffassung|ich stimme|ich lehne|ich würde empfehlen|ich empfehle|meiner auffassung nach)\b/i.test(t);
    var proContra = /\b(vorteil|vorteile|nachteile?|chance|chancen|risiko|risiken|problem|probleme|kritik|lösung|einerseits|andererseits|dafür|dagegen|gegenargument|grenze|kosten|folgen)\b/i.test(t);
    var example = /\b(zum beispiel|beispielsweise|etwa|konkret|in meinem alltag|aus meinem alltag|in der arbeit|bei der arbeit|ein beispiel|als beispiel)\b/i.test(t);
    var justification = /\b(weil|da|denn|daher|deshalb|aus diesem grund|aufgrund|begründen|begründung|argument|führt dazu|dadurch|folglich|die folge|das liegt daran)\b/i.test(t);
    return { wordCount:wc, sentenceCount:sentences, argumentConnectors:argumentConnectors, ownPosition:ownPosition, proContra:proContra, example:example, justification:justification };
  }
  function levelDifferentiationCaps(level, part, userText, local){
    var profile = difficulty(level);
    var signals = levelComplexitySignals(userText);
    var reasons = [];
    var caps = [];
    if(!profile) return { reasons:[], cap:null, signals:signals };
    var profileCaps = profile.caps || {};
    if((part === 'writing' || part === 'speaking') && profile.severity >= 4){
      if(signals.wordCount > 0 && signals.wordCount < (profile[part === 'writing' ? 'writingWords' : 'speakingWords'][0] || 100)){
        reasons.push(level + ': Umfang liegt unter dem Niveauprofil. Eine A1/A2/B1-Antwort darf hier nicht als '+level+' bestehen.');
        caps.push(part === 'speaking' ? 45 : (profileCaps.tooShort || 40));
      }
      if(!signals.proContra){ reasons.push(level + ': Abwägung/Argumentationsansatz fehlt.'); caps.push(profileCaps.noArgumentation || 58); }
      if(!signals.ownPosition){ reasons.push(level + ': eigene Position ist nicht klar erkennbar.'); caps.push(profileCaps.noOwnPosition || 60); }
      if(!signals.justification){ reasons.push(level + ': Begründung/Argumentstütze fehlt.'); caps.push(Math.min(profileCaps.noArgumentation || 58, 55)); }
      if(signals.argumentConnectors < 2){ reasons.push(level + ': zu wenige niveaupassende Konnektoren/Strukturmarker.'); caps.push(profileCaps.simpleLanguage || 65); }
      if((part === 'writing' || part === 'speaking') && !signals.example){ reasons.push(level + ': konkretes Beispiel fehlt.'); caps.push(part === 'speaking' ? 70 : Math.min(profileCaps.noArgumentation || 58, 62)); }
    }
    if((part === 'writing' || part === 'speaking') && profile.severity <= 2){
      if(local && local.wordCount > 0 && local.wordCount < Math.max(8, Math.round((profile[part === 'writing' ? 'writingWords' : 'speakingWords'][0] || 30) * 0.60))){
        reasons.push(level + ': Kerninformation ist zu knapp für den Hardmode.');
        caps.push(profileCaps.tooShort || 45);
      }
    }
    return { reasons:collectUnique(reasons), cap:caps.length ? Math.min.apply(Math, caps) : null, signals:signals };
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
    var taskText = String(((task && task.taskType) || '') + ' ' + ((task && task.prompt) || '') + ' ' + ((task && task.title) || '') + ' ' + ((task && task.register) || '')).toLowerCase();
    var registerNeeded = /(beschwerde|teamleitung|hausverwaltung|anbieter|arbeitgeber|behörde|vermieter|formelle\s+(e-mail|mail|nachricht|beschwerde)|formell\s+schreiben)/.test(taskText) && !/(halbformell|stellungnahme|meinungsbeitrag|argumentativer beitrag)/.test(taskText);
    var argumentativeText = /(stellungnahme|argumentativ|argumentative|meinungsbeitrag|beitrag|essay|kommentar|position)/.test(taskText) && !registerNeeded;
    var informalRisk = /(hey\b|hi\b|servus|alter|bruder|digga|lol|!{2,}|\?{2,})/i.test(t);
    var demandToneRisk = /(sofort|unverschämt|frechheit|ich verlange sofort|das ist schei)/i.test(t);
    var ok = paragraphLike && !informalRisk && !demandToneRisk && (argumentativeText || (frame.greeting && frame.closing && (!registerNeeded || subject || frame.polite)));
    var missing = [];
    if(registerNeeded && !frame.greeting) missing.push('formelle Anrede fehlt');
    if(registerNeeded && !subject) missing.push('klarer Betreff/Anlass fehlt');
    if(!paragraphLike) missing.push('Text ist nicht ausreichend gegliedert');
    if(registerNeeded && !frame.closing) missing.push('höflicher Abschluss fehlt');
    if(informalRisk) missing.push('Register zu informell');
    if(demandToneRisk) missing.push('Ton zu scharf oder unsachlich');
    return { greeting:frame.greeting, closing:frame.closing, polite:frame.polite, subject:subject, paragraphLike:paragraphLike, registerNeeded:registerNeeded, argumentativeText:argumentativeText, informalRisk:informalRisk, demandToneRisk:demandToneRisk, ok:ok, missing:missing };
  }

  function speakingStructureCheck(userText, task){
    var t = cleanText(userText, 12000).toLowerCase();
    var frame = hasFormalFrame(userText);
    var wc = words(userText).length;
    var raw = cleanText(userText, 12000);
    var sentenceCount = (raw.match(/[.!?]/g) || []).length || raw.split(/\b(weil|deshalb|außerdem|zudem|allerdings|dennoch|andererseits)\b/i).length - 1;
    var sentenceLike = sentenceCount >= 3 || (wc >= 80 && /\b(weil|deshalb|außerdem|zudem|allerdings|dennoch|andererseits|einerseits)\b/i.test(t));
    var taskText = String(((task && task.prompt) || '') + ' ' + ((task && task.requiredPoints || []).join(' ')) + ' ' + ((task && task.requiredSpeechStructure || []).join(' '))).toLowerCase();
    var argumentativeTask = (task && Number(task.minWords || 0) >= 150) || /vorteil|nachteil|argument|position|abwäg|pro|contra|fazit|kompromiss|empfehlung/i.test(taskText);
    var concreteTime = /\b\d{1,2}[:.]\d{2}\b|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|nächste|uhr|termin|vormittag|nachmittag|abend|woche/i.test(t);
    var reason = /\bweil\b|\bwegen\b|\bda\b|\bdenn\b|grund|begründ|argument|aufgrund|deshalb|daher|dadurch|folge|führt dazu|krank|termin|zug|behörde|arbeit|familie|dringend/i.test(t);
    var request = /bitte|könnten|würden|vorschlag|möglich|rückmeldung|bestätigung|ersatz|rückerstattung|tauschen|neuen termin|lösung|frage|fragen/i.test(t);
    var question = /\?|könnten sie|ist es möglich|wann|wo|wie viel|kost|uhrzeit|treffpunkt|passt/i.test(t);
    var informalRisk = /(alter|bruder|digga|lol|schei|halt die|nerv|!{2,}|\?{2,})/i.test(t);
    var keywordsOnly = wc > 0 && wc < 18 && (cleanText(userText, 12000).split(/[.!?]/).filter(function(x){ return words(x).length >= 4; }).length < 1);

    if(argumentativeTask){
      var intro = /\b(thema|frage|diskussion|es geht|zunächst|heutzutage|in vielen|aktuell|immer mehr|die frage ist)\b/i.test(t) || wc >= 80;
      var proContra = /\b(vorteil|vorteile|nachteil|nachteile|chance|chancen|risiko|risiken|einerseits|andererseits|dafür|dagegen|problem|grenze|kosten|folgen)\b/i.test(t);
      var ownPosition = /\b(meiner meinung|meine meinung|ich bin der meinung|ich halte|ich finde|aus meiner sicht|meines erachtens|ich vertrete|ich empfehle|ich würde empfehlen)\b/i.test(t);
      var example = /\b(zum beispiel|beispielsweise|konkret|etwa|in meinem alltag|aus meinem alltag|in der arbeit|bei der arbeit|ein beispiel)\b/i.test(t);
      var conclusion = /\b(fazit|abschließend|zusammenfassend|deshalb sollte|daher sollte|ich empfehle|empfehlung|kompromiss|lösung|sinnvoll wäre|realistisch wäre)\b/i.test(t);
      var ok = sentenceLike && intro && proContra && ownPosition && reason && example && conclusion && !informalRisk && !keywordsOnly;
      var missing = [];
      if(!intro) missing.push('Einleitung/Themenbezug fehlt');
      if(!sentenceLike) missing.push('keine zusammenhängende Argumentation');
      if(!proContra) missing.push('Pro/Contra oder Abwägung fehlt');
      if(!ownPosition) missing.push('eigene Position fehlt');
      if(!reason) missing.push('Begründung fehlt');
      if(!example) missing.push('konkretes Beispiel fehlt');
      if(!conclusion) missing.push('Fazit, Lösung oder Empfehlung fehlt');
      if(informalRisk) missing.push('Ton/Register nicht prüfungstauglich');
      if(keywordsOnly) missing.push('nur Stichwörter statt Sprechantwort');
      return { argumentative:true, intro:intro, proContra:proContra, ownPosition:ownPosition, reason:reason, example:example, conclusion:conclusion, sentenceLike:sentenceLike, informalRisk:informalRisk, keywordsOnly:keywordsOnly, ok:ok, missing:missing };
    }

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
    return { argumentative:false, greeting:frame.greeting, closing:frame.closing, polite:frame.polite, sentenceLike:sentenceLike, reason:reason, request:request, question:question, concreteTime:concreteTime, informalRisk:informalRisk, keywordsOnly:keywordsOnly, ok:ok, missing:missing };
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
      if(ws.informalRisk || ws.demandToneRisk){ reasons.push('Register/Ton ist für diese Schreibprüfung nicht passend.'); caps.push(58); }
      if(ws.registerNeeded && !ws.subject){ reasons.push('Der Anlass/Betreff der formellen Nachricht ist nicht klar genug.'); caps.push(74); }
    }
    if(part === 'speaking'){
      var ss = local && local.speakingStructure ? local.speakingStructure : speakingStructureCheck(userText, task);
      if(!ss.ok){ reasons.push('Sprechstruktur unvollständig: ' + (ss.missing || []).slice(0,3).join(', ') + '.'); caps.push(68); }
      if(ss.keywordsOnly){ reasons.push('Nur Stichwörter statt zusammenhängender Sprechantwort.'); caps.push(35); }
      if(ss.informalRisk){ reasons.push('Ton/Register ist für diese Sprechprüfung nicht passend.'); caps.push(55); }
      if((task && task.minWords || 0) >= 70 && list.length > 0 && list.length < Math.round((task.minWords || 70) * 0.65)){ reasons.push('Sprechantwort deutlich unter dem Niveau-Mindestumfang.'); caps.push((task && task.minWords || 0) >= 160 ? 45 : 50); }
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
    if(local.part === 'writing' && local.minWords && local.wordCount > 0 && local.wordCount < Math.round(local.minWords * 0.75)){ capped = Math.min(capped, 64); reasons.push('Schreibantwort deutlich unter der Niveau-Mindestlänge.'); }
    if(local.offTopic && local.topicScore < 18){ capped = Math.min(capped, caps.completeOffTopic || 20); reasons.push('Antwort wirkt komplett am Thema vorbei.'); }
    else if(local.offTopic && local.topicScore < 35){ capped = Math.min(capped, caps.strongOffTopic || 35); reasons.push('Starke Themenverfehlung.'); }
    if(local.missingCorePoints >= 2){ capped = Math.min(capped, caps.missingCorePoint || 68); reasons.push('Mehrere zentrale Pflichtpunkte fehlen.'); }
    if(local.part === 'writing' && local.writingStructure && !local.writingStructure.ok){ capped = Math.min(capped, 72); reasons.push('Schreibaufbau/Register nicht prüfungstauglich.'); }
    if(local.part === 'writing' && local.writingStructure && (local.writingStructure.informalRisk || local.writingStructure.demandToneRisk)){ capped = Math.min(capped, 58); reasons.push('Unpassender Ton/Register in formeller Schreibaufgabe.'); }
    if(local.part === 'speaking' && local.speakingStructure && !local.speakingStructure.ok){ capped = Math.min(capped, local.minWords >= 160 ? 68 : 72); reasons.push('Sprechstruktur nicht prüfungstauglich.'); }
    if(local.part === 'speaking' && local.minWords && local.wordCount > 0 && local.wordCount < (local.minWords >= 160 ? local.minWords : Math.round(local.minWords * 0.75))){ capped = Math.min(capped, local.minWords >= 160 ? 45 : 64); reasons.push('Sprechantwort unter der Niveau-Mindestlänge.'); }
    if(local.part === 'speaking' && local.speakingStructure && local.speakingStructure.keywordsOnly){ capped = Math.min(capped, 35); reasons.push('Nur Stichwörter statt zusammenhängender Sprechantwort.'); }
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
    var profile = difficulty(level);
    var profileWords = profile && (part === 'writing' ? profile.writingWords : (part === 'speaking' ? profile.speakingWords : null));
    var min = Number(task.minWords || (profileWords && profileWords[0]) || (bp && bp.parts && bp.parts[part] && bp.parts[part].minWords) || 0);
    var max = Number(task.maxWords || (profileWords && profileWords[1]) || 0) || null;
    var wc = words(userText).length;
    var reqHits = countRequiredHits(userText, req, part);
    var fulfilled = reqHits.filter(function(x){ return x.hit; }).length;
    var missing = reqHits.filter(function(x){ return !x.hit; }).map(function(x){ return x.point; });
    var local = {
      level:level,
      levelProfile: profile ? profile.label : null,
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
    local.offTopic = local.topicScore < 35 && local.requiredScore < 60;
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
    var diffCap = levelDifferentiationCaps(level, part, userText, local);
    local.levelSignals = diffCap.signals || null;
    local.edgeCaseReasons = collectUnique((edge.reasons || []).concat(diffCap.reasons || []));
    var capped = applyHardCaps(local.rawScore, local);
    var capPool = [capped.score];
    if(edge.cap != null) capPool.push(edge.cap);
    if(diffCap.cap != null) capPool.push(diffCap.cap);
    local.score = Math.min.apply(Math, capPool);
    local.capReasons = collectUnique((capped.capReasons || []).concat(local.edgeCaseReasons || []));
    var minScore = (bp && bp.parts && bp.parts[part] && bp.parts[part].minScore) || (bp && bp.partMinScore) || 55;
    local.passedLocal = local.score >= minScore && !local.offTopic && wc >= Math.max(8, Math.round(min * ((part === 'speaking' && min >= 160) ? 1 : 0.55)));
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
    var profile = difficulty(level);
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
    if(part === 'speaking' && local.minWords && local.wordCount < (local.minWords >= 160 ? local.minWords : Math.round(local.minWords * 0.65))) hardFail.push('Sprechantwort unter dem Niveau-Mindestumfang.');
    if(part === 'speaking' && local.speakingStructure && (local.speakingStructure.keywordsOnly || local.speakingStructure.informalRisk)) hardFail.push('Sprechantwort nicht prüfungstauglich strukturiert.');
    if(part === 'speaking' && local.speakingStructure && local.speakingStructure.argumentative && difficulty(level) && difficulty(level).severity >= 4){
      if(!local.speakingStructure.example) hardFail.push(level + '-Anforderung nicht erfüllt: konkretes Beispiel fehlt.');
      if(!local.speakingStructure.conclusion) hardFail.push(level + '-Anforderung nicht erfüllt: Fazit/Lösung/Empfehlung fehlt.');
    }
    if(local.levelSignals && difficulty(level) && difficulty(level).severity >= 4){
      if(!local.levelSignals.proContra) hardFail.push(level + '-Anforderung nicht erfüllt: Argumentation/Abwägung fehlt.');
      if(!local.levelSignals.ownPosition) hardFail.push(level + '-Anforderung nicht erfüllt: eigene Position fehlt.');
    }
    var passed = hardFail.length === 0 && overall >= bp.passScore && local.score >= partMin;
    var readiness = overall >= bp.safePassScore && hardFail.length === 0 ? 'Sehr gute reale Chancen' :
      (passed ? 'Realistische Chancen' : (overall >= bp.passScore - 8 ? 'Unsichere Chancen' : 'Noch nicht prüfungsbereit'));
    return {
      level:level,
      levelProfile: profile ? profile.label : null,
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
        examinerMode:'strict-'+String(level).toLowerCase()+'-academy-hardmode',
        rubric: part === 'writing' ? {
          role:'strenger '+level+'-Schreibprüfer im Academy-Hartmodus',
          levelProfile: difficulty(level) ? difficulty(level).label : level,
          expectedSkills: difficulty(level) ? difficulty(level).skills : [],
          mustHave: difficulty(level) ? difficulty(level).writingMust : [],
          judge:['Aufgabenbezug','Pflichtpunkte','Niveaupassung '+level,'Aufbau','Register/Höflichkeit','Grammatik','Wortschatz','Kohärenz','Argumentation'],
          hardCaps:['Thema verfehlt maximal 40%','zu kurz maximal nach Niveauprofil','fehlende zentrale Pflichtpunkte maximal 68%','zu einfache Sprache für '+level+' deckeln','fehlende Argumentation bei B2+ hart deckeln'],
          noSugarcoating:true
        } : {
          role:'strenger '+level+'-Sprechprüfer im Academy-Hartmodus',
          levelProfile: difficulty(level) ? difficulty(level).label : level,
          expectedSkills: difficulty(level) ? difficulty(level).skills : [],
          mustHave: difficulty(level) ? difficulty(level).speakingMust : [],
          judge:['Aufgabenbezug','B2-Mündlichkeit','Pro/Contra','eigene Position','Begründung','konkretes Beispiel','Lösung/Fazit','Konnektoren','Wortschatz','Flüssigkeit'],
          hardCaps:['zu kurz maximal 45%','keine eigene Meinung maximal 60%','keine Begründung maximal 55%','kein Beispiel maximal 70%','nur Stichpunkte maximal 40%','Thema verfehlt maximal 30-40%','nur B1-Wortschatz maximal 65%'],
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
      parts:{ reading:null, listening:null, grammar:null, writing:null, speaking:null }
    };
  }
  function partLabel(part){
    return ({ reading:'Lesen', listening:'Hören', grammar:'Grammatik & Sprachbausteine', writing:'Schreiben', speaking:'Sprechen' })[part] || part;
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
    var partNames = (session.partOrder && session.partOrder.length ? session.partOrder : ['reading','listening','grammar','writing','speaking']);
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
  function buildRecommendations(breakdown, bp, level){
    var rec = [];
    var byPart = {};
    breakdown.forEach(function(item){ byPart[item.part] = item; });
    var isB2Plus = String(level || '').toUpperCase() === 'B2' || String(level || '').toUpperCase() === 'C1' || String(level || '').toUpperCase() === 'C2';
    if(byPart.reading && byPart.reading.score !== null && byPart.reading.score < partMinScore(bp, 'reading')) rec.push(isB2Plus ? 'Lesen: Trainiere längere Sachtexte mit Autorabsicht, indirekten Aussagen, Argumentationsstruktur und Ablenker-Begründung.' : 'Lesen: Arbeite mit längeren B1-Texten, markiere Schlüsselstellen und begründe jede Antwort mit einer Textstelle.');
    if(byPart.listening && byPart.listening.score !== null && byPart.listening.score < partMinScore(bp, 'listening')) rec.push(isB2Plus ? 'Hören: Trainiere Interviews und Diskussionen. Achte auf Sprecherhaltung, Einschränkungen, indirekte Kritik und Bedingungen.' : 'Hören: Trainiere Durchsagen, Telefonnotizen und Detailinformationen. Höre erst global, dann gezielt nach Zahlen, Zeiten und Gründen.');
    if(byPart.grammar && byPart.grammar.score !== null && byPart.grammar.score < partMinScore(bp, 'grammar')) rec.push(isB2Plus ? 'Grammatik & Sprachbausteine: Wiederhole komplexe Konnektoren, Passiv, indirekte Rede, Nominalisierung, Register und Textkohärenz.' : 'Grammatik & Sprachbausteine: Wiederhole Konnektoren, Satzstellung, Kasus/Präpositionen und höfliche Formulierungen mit Lückentexten.');
    if(byPart.writing && byPart.writing.score !== null && byPart.writing.score < Math.max(partMinScore(bp, 'writing'), bp.passScore - 5)) rec.push(isB2Plus ? 'Schreiben: Übe 180–280 Wörter mit Einleitung, Pro/Contra, eigener Position, konkretem Beispiel, kohärenten Konnektoren und klarem Schluss.' : 'Schreiben: Übe formelle E-Mails mit Anrede, Problem, Folge, konkreter Forderung und höflichem Abschluss.');
    if(byPart.speaking && byPart.speaking.score !== null && byPart.speaking.score < Math.max(partMinScore(bp, 'speaking'), bp.passScore - 5)) rec.push(isB2Plus ? 'Sprechen: Übe 2–4 Minuten zusammenhängend mit Pro/Contra, eigener Position, Begründung, Beispiel und Fazit statt kurzer Behauptungen.' : 'Sprechen: Übe 1–2 Minuten zusammenhängend zu antworten. Nenne Grund, Vorschlag und Abschluss, statt nur Einzelwörter zu sagen.');
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
      if(item.result && item.part === 'listening' && item.result.helperMode) critical.push(item.label + ': Hilfsmodus/Transkript-Fallback genutzt – Ergebnis ist nutzbar, aber weniger streng als echtes Hören.');
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
    if(completedParts < 5) return { label:'Unvollständig', probability:0, verdict:'Es fehlen noch Prüfungsteile. Eine echte Prognose ist erst nach vollständiger Simulation sinnvoll.' };
    if(passed && overall >= (bp.safePassScore || 82) && weakParts.length === 0) return { label:'Sehr gute reale Chancen', probability:85, verdict:'Die Simulation wurde sicher bestanden. Eine echte Prüfung bleibt trotzdem abhängig von Tagesform und offizieller Aufgabenvariante.' };
    if(passed && weakParts.length === 0) return { label:'Realistische Chancen', probability:70, verdict:'Die Simulation wurde bestanden. Die reale Chance ist gut, aber noch nicht absolut sicher.' };
    if(overall >= (bp.passScore || 70) - 8) return { label:'Unsichere Chancen', probability:45, verdict:'Die Gesamtleistung ist nahe an der Grenze oder einzelne Teilbereiche sind kritisch. Eine echte Prüfung wäre riskant.' };
    return { label:'Noch nicht prüfungsbereit', probability:25, verdict:'Die Simulation zeigt deutliche Lücken. Vor einer echten Prüfung sollte gezielt weiter trainiert werden.' };
  }
  function buildTeacherSummary(final){
    if(final.completedParts < 5) return 'Die Prüfungssimulation ist noch nicht vollständig. Für eine harte Prognose müssen Lesen, Hören, Grammatik & Sprachbausteine, Schreiben und Sprechen bewertet sein.';
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
    var expectedTotal = (session.partOrder && session.partOrder.length) || 5;
    var passed = completedParts === expectedTotal && overall >= bp.passScore && weakParts.length === 0;
    var band = readinessBand(overall, passed, weakParts, completedParts, bp);
    var criticalWeaknesses = buildCriticalWeaknesses(breakdown);
    var recommendations = buildRecommendations(breakdown, bp, level);
    var strengths = buildStrengths(breakdown, bp);
    var final = {
      level:level,
      completedParts:completedParts,
      totalParts:expectedTotal,
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
        level: options.level || 'B1',
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
    session.partOrder = ['reading','listening','grammar','writing','speaking'];
    session.answers = { reading:{}, listening:{}, writing:'', speaking:'' };
    session.parts = { reading:null, listening:null, grammar:null, writing:null, speaking:null };
    session.qaScenario = type;
    if(type === 'good-pass'){
      session.parts.reading = createQaPartResult('reading', 88, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 82, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 86, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 78, {minScore:60, ai:{overallScore:80, strengths:['Aufgabe vollständig erfüllt'], weaknesses:[]}});
      session.parts.speaking = createQaPartResult('speaking', 76, {minScore:60, ai:{overallScore:77, strengths:['klare Gesprächsstruktur'], weaknesses:[]}});
    }else if(type === 'borderline-pass'){
      session.parts.reading = createQaPartResult('reading', 74, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 69, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 76, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 71, {minScore:60, missingPoints:['eine Begründung könnte genauer sein'], missingCorePoints:0});
      session.parts.speaking = createQaPartResult('speaking', 70, {minScore:60, missingPoints:['Rückfrage nur knapp formuliert'], missingCorePoints:0});
    }else if(type === 'borderline-fail'){
      session.parts.reading = createQaPartResult('reading', 72, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 68, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 59, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 61, {minScore:60, missingPoints:['konkrete Forderung fehlt'], missingCorePoints:1});
      session.parts.speaking = createQaPartResult('speaking', 54, {minScore:60, forceFail:true, hardFailReasons:['Mindestleistung im Prüfungsteil Sprechen nicht erreicht.'], missingPoints:['konkreter Vorschlag fehlt'], missingCorePoints:1});
    }else if(type === 'weak-speaking'){
      session.parts.reading = createQaPartResult('reading', 86, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 80, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 78, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 75, {minScore:60});
      session.parts.speaking = createQaPartResult('speaking', 39, {minScore:60, forceFail:true, wordCount:24, hardFailReasons:['Sprechantwort deutlich unter dem Niveau-Mindestumfang.','Nur Stichwörter statt zusammenhängender Sprechantwort.'], missingPoints:['Grund fehlt','Vorschlag fehlt','höflicher Abschluss fehlt'], missingCorePoints:3, edgeCaseReasons:['Nur Stichwörter statt zusammenhängender Sprechantwort.']});
    }else if(type === 'wrong-writing-topic'){
      session.parts.reading = createQaPartResult('reading', 78, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 76, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 74, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 34, {minScore:60, forceFail:true, offTopic:true, topicScore:20, hardFailReasons:['Starke Themenverfehlung.','Antwort erfüllt die Schreibaufgabe inhaltlich nicht.'], missingPoints:['Problem fehlt','konkrete Lösung fehlt','formeller Anlass fehlt'], missingCorePoints:3});
      session.parts.speaking = createQaPartResult('speaking', 72, {minScore:60});
    }else if(type === 'incomplete-listening'){
      session.parts.reading = createQaPartResult('reading', 82, {minScore:55});
      session.parts.listening = null;
      session.parts.grammar = createQaPartResult('grammar', 72, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 76, {minScore:60});
      session.parts.speaking = createQaPartResult('speaking', 74, {minScore:60});
    }else if(type === 'weak-grammar'){
      session.parts.reading = createQaPartResult('reading', 84, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 81, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 41, {minScore:58, forceFail:true, hardFailReasons:['Grammatik & Sprachbausteine deutlich unter B1-Hardmode-Mindestleistung.']});
      session.parts.writing = createQaPartResult('writing', 78, {minScore:60});
      session.parts.speaking = createQaPartResult('speaking', 75, {minScore:60});
    }else if(type === 'listening-helper-mode'){
      session.parts.reading = createQaPartResult('reading', 81, {minScore:55});
      session.parts.listening = Object.assign(createQaPartResult('listening', 76, {minScore:55, mode:'academy-hard-listening-helper'}), { helperMode:true, audioMode:'transcript-helper', readiness:'Hörteil bestanden, aber mit Transkript-Hilfsmodus markiert' });
      session.parts.grammar = createQaPartResult('grammar', 75, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 73, {minScore:60});
      session.parts.speaking = createQaPartResult('speaking', 72, {minScore:60});
    }else if(type === 'groq-down-fallback'){
      session.parts.reading = createQaPartResult('reading', 84, {minScore:55});
      session.parts.listening = createQaPartResult('listening', 79, {minScore:55});
      session.parts.grammar = createQaPartResult('grammar', 77, {minScore:58});
      session.parts.writing = createQaPartResult('writing', 73, {minScore:60, aiError:'Simulierter Groq-Ausfall: lokaler Fallback wurde verwendet.', weights:{local:1, ai:0}});
      session.parts.speaking = createQaPartResult('speaking', 71, {minScore:60, aiError:'Simulierter Groq-Ausfall: lokaler Fallback wurde verwendet.', weights:{local:1, ai:0}});
    }else{
      return createB1FullQaSession('good-pass');
    }
    session.final = computeFinal(session);
    return session;
  }
  function runB1FullExamQaScenarios(){
    var names = ['good-pass','borderline-pass','borderline-fail','weak-speaking','wrong-writing-topic','incomplete-listening','weak-grammar','listening-helper-mode','groq-down-fallback'];
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
      'weak-grammar':'nicht bestanden',
      'listening-helper-mode':'bestanden',
      'groq-down-fallback':'bestanden'
    };
    var results = runB1FullExamQaScenarios().map(function(item){
      var decision = item.final && item.final.examDecision;
      return { scenario:item.scenario, expected:expected[item.scenario], actual:decision, ok:decision === expected[item.scenario], overall:item.final && item.final.overallScore, readiness:item.final && item.final.readiness, weakParts:item.final && item.final.weakParts, totalParts:item.final && item.final.totalParts, completedParts:item.final && item.final.completedParts };
    });
    return { ok:results.every(function(x){ return x.ok && x.totalParts === 5; }), phase:'38C.14', scenarios:results, checkedAt:nowIso() };
  }
  function validateB1HardmodeTotalQa(){
    var validation = validateB1FullExamQaScenarios();
    var sessions = runB1FullExamQaScenarios();
    var checks = [];
    checks.push({ name:'five-part-hardmode', ok:sessions.every(function(x){ return x.final && x.final.totalParts === 5; }) });
    checks.push({ name:'grammar-required', ok:sessions.some(function(x){ return x.scenario === 'weak-grammar' && x.final && x.final.examDecision === 'nicht bestanden' && x.final.weakParts.indexOf('grammar') >= 0; }) });
    checks.push({ name:'listening-helper-mode-marked', ok:sessions.some(function(x){ return x.scenario === 'listening-helper-mode' && JSON.stringify(x.final.criticalWeaknesses || []).indexOf('Hilfsmodus') >= 0; }) });
    checks.push({ name:'groq-fallback-stable', ok:sessions.some(function(x){ return x.scenario === 'groq-down-fallback' && x.final && x.final.examDecision === 'bestanden'; }) });
    checks.push({ name:'incomplete-listening-fails', ok:sessions.some(function(x){ return x.scenario === 'incomplete-listening' && x.final && x.final.examDecision === 'nicht bestanden'; }) });
    return { ok:validation.ok && checks.every(function(c){ return c.ok; }), phase:'38C.14', validation:validation, checks:checks, checkedAt:nowIso() };
  }


  function createB2FullQaSession(type){
    type = String(type || 'strong-pass');
    var session = createSession('B2');
    session.id = 'phase38d7-b2-fullqa-' + type + '-' + Date.now();
    session.status = 'qa-simulated';
    session.currentPart = 'speaking';
    session.partOrder = ['reading','listening','grammar','writing','speaking'];
    session.answers = { reading:{}, listening:{}, grammar:{}, writing:'', speaking:'' };
    session.parts = { reading:null, listening:null, grammar:null, writing:null, speaking:null };
    session.qaScenario = type;
    var common = { level:'B2', mode:'phase38d7-b2-total-qa' };
    function q(part, score, options){ return createQaPartResult(part, score, Object.assign({}, common, options || {})); }
    if(type === 'strong-pass'){
      session.parts.reading = q('reading', 88, {minScore:58});
      session.parts.listening = q('listening', 84, {minScore:58});
      session.parts.grammar = q('grammar', 86, {minScore:60});
      session.parts.writing = q('writing', 82, {minScore:58, wordCount:222, minWords:180, ai:{overallScore:84, strengths:['strukturierte B2-Stellungnahme','klare Abwägung'], weaknesses:[]}});
      session.parts.speaking = q('speaking', 83, {minScore:58, wordCount:228, minWords:180, ai:{overallScore:84, strengths:['differenzierte mündliche Argumentation'], weaknesses:[]}});
    }else if(type === 'borderline-pass'){
      session.parts.reading = q('reading', 72, {minScore:58});
      session.parts.listening = q('listening', 70, {minScore:58});
      session.parts.grammar = q('grammar', 69, {minScore:60});
      session.parts.writing = q('writing', 71, {minScore:58, wordCount:190, minWords:180, missingPoints:['Gegenperspektive nur knapp ausgeführt'], missingCorePoints:0});
      session.parts.speaking = q('speaking', 70, {minScore:58, wordCount:188, minWords:180, missingPoints:['Beispiel bleibt knapp'], missingCorePoints:0});
    }else if(type === 'overall-borderline-fail'){
      session.parts.reading = q('reading', 67, {minScore:58});
      session.parts.listening = q('listening', 66, {minScore:58});
      session.parts.grammar = q('grammar', 66, {minScore:60});
      session.parts.writing = q('writing', 69, {minScore:58, wordCount:186, minWords:180});
      session.parts.speaking = q('speaking', 68, {minScore:58, wordCount:184, minWords:180});
    }else if(type === 'weak-listening'){
      session.parts.reading = q('reading', 82, {minScore:58});
      session.parts.listening = q('listening', 46, {minScore:58, forceFail:true, hardFailReasons:['B2-Hören deutlich unter Mindestleistung: indirekte Aussagen und Sprecherhaltung nicht sicher erkannt.']});
      session.parts.grammar = q('grammar', 77, {minScore:60});
      session.parts.writing = q('writing', 78, {minScore:58, wordCount:214, minWords:180});
      session.parts.speaking = q('speaking', 76, {minScore:58, wordCount:208, minWords:180});
    }else if(type === 'weak-grammar'){
      session.parts.reading = q('reading', 84, {minScore:58});
      session.parts.listening = q('listening', 79, {minScore:58});
      session.parts.grammar = q('grammar', 44, {minScore:60, forceFail:true, hardFailReasons:['Grammatik & Sprachbausteine unter B2-Mindestleistung: Konnektoren, Passiv, Nominalstil oder Register unsicher.']});
      session.parts.writing = q('writing', 77, {minScore:58, wordCount:216, minWords:180});
      session.parts.speaking = q('speaking', 76, {minScore:58, wordCount:205, minWords:180});
    }else if(type === 'weak-writing-a1-style'){
      session.parts.reading = q('reading', 81, {minScore:58});
      session.parts.listening = q('listening', 78, {minScore:58});
      session.parts.grammar = q('grammar', 74, {minScore:60});
      session.parts.writing = q('writing', 38, {minScore:58, forceFail:true, wordCount:17, minWords:180, hardFailReasons:['A1/B1-artige Kurzantwort statt B2-Stellungnahme.','Schreibantwort unter der B2-Mindestlänge.','Eigene Position, Abwägung und Beispiel fehlen.'], missingPoints:['Argumentation fehlt','konkretes Beispiel fehlt','Schluss/Fazit fehlt'], missingCorePoints:3, capReasons:['B2: Umfang liegt unter dem Niveauprofil.']});
      session.parts.speaking = q('speaking', 75, {minScore:58, wordCount:205, minWords:180});
    }else if(type === 'weak-speaking-a1-style'){
      session.parts.reading = q('reading', 82, {minScore:58});
      session.parts.listening = q('listening', 77, {minScore:58});
      session.parts.grammar = q('grammar', 75, {minScore:60});
      session.parts.writing = q('writing', 76, {minScore:58, wordCount:210, minWords:180});
      session.parts.speaking = q('speaking', 36, {minScore:58, forceFail:true, wordCount:12, minWords:180, hardFailReasons:['A1/B1-artige Kurzantwort statt B2-Sprechleistung.','Sprechantwort unter dem Niveau-Mindestumfang.','Nur Behauptung ohne Abwägung, Begründung und Beispiel.'], missingPoints:['Pro/Contra fehlt','eigene Position fehlt','konkretes Beispiel fehlt','Fazit fehlt'], missingCorePoints:4, capReasons:['B2: Umfang liegt unter dem Niveauprofil.']});
    }else if(type === 'writing-topic-missed'){
      session.parts.reading = q('reading', 78, {minScore:58});
      session.parts.listening = q('listening', 75, {minScore:58});
      session.parts.grammar = q('grammar', 73, {minScore:60});
      session.parts.writing = q('writing', 29, {minScore:58, forceFail:true, wordCount:185, minWords:180, offTopic:true, topicScore:18, hardFailReasons:['B2-Schreibthema deutlich verfehlt.','Aufgabenbezug trotz ausreichender Länge nicht erfüllt.'], missingPoints:['Thema/Anlass fehlt','Argumente zum Thema fehlen','Fazit zum Thema fehlt'], missingCorePoints:3});
      session.parts.speaking = q('speaking', 72, {minScore:58, wordCount:194, minWords:180});
    }else if(type === 'speaking-no-example'){
      session.parts.reading = q('reading', 80, {minScore:58});
      session.parts.listening = q('listening', 76, {minScore:58});
      session.parts.grammar = q('grammar', 72, {minScore:60});
      session.parts.writing = q('writing', 74, {minScore:58, wordCount:208, minWords:180});
      session.parts.speaking = q('speaking', 56, {minScore:58, forceFail:true, wordCount:202, minWords:180, hardFailReasons:['B2-Anforderung nicht erfüllt: konkretes Beispiel fehlt.'], missingPoints:['konkretes Beispiel fehlt'], missingCorePoints:1, capReasons:['Ohne konkretes Beispiel maximal 70 %, zusätzlich Mindestleistung im Teil nicht erreicht.']});
    }else if(type === 'listening-helper-mode'){
      session.parts.reading = q('reading', 82, {minScore:58});
      session.parts.listening = Object.assign(q('listening', 75, {minScore:58, mode:'phase38d7-b2-listening-helper'}), { helperMode:true, audioMode:'transcript-helper', readiness:'B2-Hörteil bestanden, aber mit Transkript-Hilfsmodus markiert' });
      session.parts.grammar = q('grammar', 76, {minScore:60});
      session.parts.writing = q('writing', 74, {minScore:58, wordCount:205, minWords:180});
      session.parts.speaking = q('speaking', 73, {minScore:58, wordCount:198, minWords:180});
    }else if(type === 'groq-down-fallback'){
      session.parts.reading = q('reading', 84, {minScore:58});
      session.parts.listening = q('listening', 78, {minScore:58});
      session.parts.grammar = q('grammar', 74, {minScore:60});
      session.parts.writing = q('writing', 72, {minScore:58, wordCount:199, minWords:180, aiError:'Simulierter Groq-Ausfall: lokaler B2-Fallback wurde verwendet.', weights:{local:1, ai:0}});
      session.parts.speaking = q('speaking', 71, {minScore:58, wordCount:192, minWords:180, aiError:'Simulierter Groq-Ausfall: lokaler B2-Fallback wurde verwendet.', weights:{local:1, ai:0}});
    }else if(type === 'incomplete-speaking'){
      session.parts.reading = q('reading', 84, {minScore:58});
      session.parts.listening = q('listening', 80, {minScore:58});
      session.parts.grammar = q('grammar', 76, {minScore:60});
      session.parts.writing = q('writing', 75, {minScore:58, wordCount:210, minWords:180});
      session.parts.speaking = null;
    }else{
      return createB2FullQaSession('strong-pass');
    }
    session.final = computeFinal(session);
    return session;
  }
  function runB2FullExamQaScenarios(){
    var names = ['strong-pass','borderline-pass','overall-borderline-fail','weak-listening','weak-grammar','weak-writing-a1-style','weak-speaking-a1-style','writing-topic-missed','speaking-no-example','listening-helper-mode','groq-down-fallback','incomplete-speaking'];
    return names.map(function(name){ var session = createB2FullQaSession(name); return { scenario:name, session:session, final:session.final }; });
  }
  function b2LocalRegressionSamples(){
    var pilot = window.LanguageB2ExamPilot || null;
    var attempt = pilot && pilot.buildAttempt ? pilot.buildAttempt('homeoffice') : null;
    var writingTask = pilot && pilot.getAttemptPart ? pilot.getAttemptPart(attempt,'writing') : ((getBlueprint('B2') && getBlueprint('B2').writingTasks && getBlueprint('B2').writingTasks[0]) || {});
    var speakingTask = pilot && pilot.getAttemptPart ? pilot.getAttemptPart(attempt,'speaking') : ((getBlueprint('B2') && getBlueprint('B2').speakingTasks && getBlueprint('B2').speakingTasks[0]) || {});
    var weakWriting = 'Hallo, digitale Bildung ist gut. Ich lerne gern am Computer. Das ist praktisch. Viele Grüße Ali';
    var weakSpeaking = 'Ich finde Homeoffice gut. Es ist gut, weil es gut ist.';
    var strongWriting = 'Sehr geehrte Damen und Herren, im Folgenden nehme ich zur digitalen Bildung Stellung. Dieses Thema ist wichtig, weil immer mehr Schulen, berufliche Kurse und Weiterbildungen digitale Lernformen nutzen. Einerseits bietet digitale Bildung große Chancen: Lernende können Materialien wiederholen, flexibel lernen und auch von zu Hause teilnehmen. Zum Beispiel kann eine berufstätige Person am Abend ein Video ansehen, danach gezielte Übungen bearbeiten und am nächsten Tag konkrete Fragen stellen. Außerdem erleichtern digitale Bildung den Zugang zu zusätzlichen Informationen, aktuellen Aufgaben und individueller Wiederholung. Andererseits gibt es auch Risiken. Nicht alle Menschen haben ein geeignetes Gerät, eine stabile Internetverbindung oder genug technische Erfahrung. Wenn persönliche Betreuung fehlt, können schwächere Lernende schnell den Anschluss verlieren. Auch Datenschutz, Ablenkung und unklare Qualitätskontrolle müssen ernst genommen werden. Aus meiner Sicht ist deshalb entscheidend, dass digitale Bildung nicht nur aus Technik besteht, sondern pädagogisch begleitet wird. Meiner Meinung nach sollte digitale Bildung eine sinnvolle Ergänzung sein, aber kein vollständiger Ersatz für Unterricht mit Lehrkraft. So bleiben soziale Kontakte, direkte Rückfragen und Motivation erhalten. Abschließend lässt sich sagen: Die Chancen überwiegen nur, wenn Technik, Betreuung, Datenschutz und pädagogisches Konzept zusammenpassen. Mit freundlichen Grüßen Ali';
    var strongSpeaking = 'Das Thema Homeoffice wird in vielen Unternehmen sehr intensiv diskutiert, weil sich die Arbeitswelt seit einigen Jahren stark verändert hat. Zunächst bietet Homeoffice deutliche Vorteile. Viele Beschäftigte sparen Zeit, weil sie nicht jeden Tag pendeln müssen, und sie können sich auf schwierige Aufgaben oft besser konzentrieren. Außerdem kann Homeoffice für Eltern oder Menschen mit langen Arbeitswegen eine große Entlastung sein. Zum Beispiel hat eine Kollegin in meinem früheren Kurs berichtet, dass sie durch zwei Homeoffice-Tage pro Woche weniger Stress hatte, ihre Tochter pünktlich abholen konnte und ihre Aufgaben trotzdem zuverlässig erledigt hat. Dieses Beispiel zeigt, dass Flexibilität die Motivation erhöhen kann. Andererseits gibt es auch Nachteile. Der Kontakt zum Team kann schwächer werden, neue Mitarbeitende lernen Abläufe manchmal langsamer kennen, und manche Menschen haben zu Hause keinen geeigneten Arbeitsplatz. Auch Datenschutz und Erreichbarkeit müssen klar geregelt werden. Aus meiner Sicht sollte Homeoffice dauerhaft möglich sein, aber nicht jeden Tag verpflichtend. Ich bin der Meinung, dass zwei oder drei Tage pro Woche realistisch sind, weil dadurch Flexibilität und Teamkontakt verbunden werden. Für Aufgaben mit viel Austausch sollten feste Bürotage bleiben. Abschließend würde ich empfehlen, klare Regeln zu Arbeitszeiten, Datenschutz, gemeinsamen Präsenztagen und technischer Ausstattung festzulegen.';
    return {
      writingTask:writingTask && writingTask.id,
      speakingTask:speakingTask && speakingTask.id,
      weakWriting:localAssessResponse({level:'B2', part:'writing', task:writingTask, userText:weakWriting}),
      weakSpeaking:localAssessResponse({level:'B2', part:'speaking', task:speakingTask, userText:weakSpeaking}),
      strongWriting:localAssessResponse({level:'B2', part:'writing', task:writingTask, userText:strongWriting}),
      strongSpeaking:localAssessResponse({level:'B2', part:'speaking', task:speakingTask, userText:strongSpeaking})
    };
  }
  function validateB2FullExamQaScenarios(){
    var expected = {
      'strong-pass':'bestanden',
      'borderline-pass':'bestanden',
      'overall-borderline-fail':'nicht bestanden',
      'weak-listening':'nicht bestanden',
      'weak-grammar':'nicht bestanden',
      'weak-writing-a1-style':'nicht bestanden',
      'weak-speaking-a1-style':'nicht bestanden',
      'writing-topic-missed':'nicht bestanden',
      'speaking-no-example':'nicht bestanden',
      'listening-helper-mode':'bestanden',
      'groq-down-fallback':'bestanden',
      'incomplete-speaking':'nicht bestanden'
    };
    var results = runB2FullExamQaScenarios().map(function(item){
      var decision = item.final && item.final.examDecision;
      return { scenario:item.scenario, expected:expected[item.scenario], actual:decision, ok:decision === expected[item.scenario], overall:item.final && item.final.overallScore, readiness:item.final && item.final.readiness, weakParts:item.final && item.final.weakParts, totalParts:item.final && item.final.totalParts, completedParts:item.final && item.final.completedParts, criticalWeaknesses:item.final && item.final.criticalWeaknesses };
    });
    return { ok:results.every(function(x){ return x.ok && x.totalParts === 5; }), phase:'38D.7', scenarios:results, checkedAt:nowIso() };
  }
  function validateB2HardmodeTotalQa(){
    var validation = validateB2FullExamQaScenarios();
    var sessions = runB2FullExamQaScenarios();
    var local = b2LocalRegressionSamples();
    var pool = window.LanguageB2ExamPilot && window.LanguageB2ExamPilot.poolInfo ? window.LanguageB2ExamPilot.poolInfo() : null;
    var checks = [];
    checks.push({ name:'b2-five-part-hardmode', ok:sessions.every(function(x){ return x.final && x.final.totalParts === 5; }) });
    checks.push({ name:'b2-pool-8x8x8x8x8', ok:!!pool && pool.reading===8 && pool.listening===8 && pool.grammar===8 && pool.writing===8 && pool.speaking===8 && pool.combinations===32768, pool:pool });
    checks.push({ name:'weak-listening-fails', ok:sessions.some(function(x){ return x.scenario==='weak-listening' && x.final && x.final.examDecision==='nicht bestanden' && x.final.weakParts.indexOf('listening')>=0; }) });
    checks.push({ name:'weak-grammar-fails', ok:sessions.some(function(x){ return x.scenario==='weak-grammar' && x.final && x.final.examDecision==='nicht bestanden' && x.final.weakParts.indexOf('grammar')>=0; }) });
    checks.push({ name:'weak-writing-fails', ok:sessions.some(function(x){ return x.scenario==='weak-writing-a1-style' && x.final && x.final.examDecision==='nicht bestanden' && x.final.weakParts.indexOf('writing')>=0; }) });
    checks.push({ name:'weak-speaking-fails', ok:sessions.some(function(x){ return x.scenario==='weak-speaking-a1-style' && x.final && x.final.examDecision==='nicht bestanden' && x.final.weakParts.indexOf('speaking')>=0; }) });
    checks.push({ name:'incomplete-speaking-fails', ok:sessions.some(function(x){ return x.scenario==='incomplete-speaking' && x.final && x.final.examDecision==='nicht bestanden' && x.final.completedParts===4; }) });
    checks.push({ name:'listening-helper-mode-marked', ok:sessions.some(function(x){ return x.scenario==='listening-helper-mode' && x.final && x.final.examDecision==='bestanden' && JSON.stringify(x.final.criticalWeaknesses||[]).indexOf('Hilfsmodus')>=0; }) });
    checks.push({ name:'groq-fallback-stable', ok:sessions.some(function(x){ return x.scenario==='groq-down-fallback' && x.final && x.final.examDecision==='bestanden'; }) });
    checks.push({ name:'a1-writing-fails-b2-hardmode', ok:local.weakWriting && local.weakWriting.score <= 45 && !local.weakWriting.passedLocal, score:local.weakWriting && local.weakWriting.score, reasons:local.weakWriting && local.weakWriting.capReasons });
    checks.push({ name:'a1-speaking-fails-b2-hardmode', ok:local.weakSpeaking && local.weakSpeaking.score <= 45 && !local.weakSpeaking.passedLocal, score:local.weakSpeaking && local.weakSpeaking.score, reasons:local.weakSpeaking && local.weakSpeaking.capReasons });
    checks.push({ name:'structured-b2-writing-can-pass', ok:local.strongWriting && local.strongWriting.wordCount >= 180 && local.strongWriting.score >= 70 && local.strongWriting.passedLocal, score:local.strongWriting && local.strongWriting.score, words:local.strongWriting && local.strongWriting.wordCount });
    checks.push({ name:'structured-b2-speaking-can-pass', ok:local.strongSpeaking && local.strongSpeaking.wordCount >= 180 && local.strongSpeaking.score >= 70 && local.strongSpeaking.passedLocal, score:local.strongSpeaking && local.strongSpeaking.score, words:local.strongSpeaking && local.strongSpeaking.wordCount });
    return { ok:validation.ok && checks.every(function(c){ return c.ok; }), phase:'38D.7', validation:validation, checks:checks, localSamples:local, checkedAt:nowIso() };
  }


  function validateLevelDifferentiation(){
    var profileOk = difficultyRules() && difficultyRules().validateDifferentiation ? difficultyRules().validateDifferentiation() : { ok:false, checks:[{name:'rules-loaded', ok:false}] };
    var b2Task = getBlueprint('B2') && getBlueprint('B2').writingTasks && getBlueprint('B2').writingTasks[0];
    var a1Task = getBlueprint('A1') && getBlueprint('A1').writingTasks && getBlueprint('A1').writingTasks[0];
    var simpleB2 = localAssessResponse({ level:'B2', part:'writing', task:b2Task, userText:'Hallo, Onlinekurs ist gut. Ich lerne zuhause. Viele Grüße Ali' });
    var validA1 = localAssessResponse({ level:'A1', part:'writing', task:a1Task, userText:'Hallo Mehmet, ich komme heute später zum Kurs. Der Bus ist spät und ich kann nicht pünktlich kommen. Ich komme um 18 Uhr. Bitte warte kurz auf mich. Viele Grüße Ali' });
    var b2Full = localAssessResponse({ level:'B2', part:'writing', task:b2Task, userText:'Sehr geehrte Damen und Herren,\n\nim Folgenden nehme ich zur digitalen Bildung Stellung. Dieses Thema ist wichtig, weil immer mehr Schulen und Kurse digitale Lernformen nutzen. Einerseits bietet digitale Bildung viele Chancen: Lernende können Materialien wiederholen, flexibel lernen und auch von zu Hause teilnehmen. Zum Beispiel kann eine berufstätige Person am Abend ein Video ansehen und danach gezielte Übungen bearbeiten. Außerdem erleichtern digitale Plattformen den Zugang zu zusätzlichen Informationen.\n\nAndererseits gibt es auch Risiken. Nicht alle Menschen haben ein gutes Gerät, eine stabile Internetverbindung oder genug technische Erfahrung. Wenn die persönliche Betreuung fehlt, können schwächere Lernende schnell den Anschluss verlieren. Auch Datenschutz und Ablenkung müssen ernst genommen werden.\n\nMeine begründete Meinung ist deshalb, dass digitale Bildung eine sinnvolle Ergänzung sein sollte, aber kein vollständiger Ersatz für Unterricht mit Lehrkraft. Abschließend lässt sich sagen: Die Chancen überwiegen nur, wenn Technik, Betreuung und pädagogisches Konzept zusammenpassen.\n\nMit freundlichen Grüßen\nAli' });
    var checks = [];
    checks.push({ name:'difficulty-rules-valid', ok:!!profileOk.ok, details:profileOk.checks || [] });
    checks.push({ name:'simple-a1-answer-fails-b2', ok:simpleB2.score <= 65 && !simpleB2.passedLocal, score:simpleB2.score, reasons:simpleB2.capReasons });
    checks.push({ name:'valid-a1-answer-can-pass-a1', ok:validA1.score >= 50, score:validA1.score, reasons:validA1.capReasons });
    checks.push({ name:'structured-b2-answer-can-pass-b2', ok:b2Full.score >= 70 && b2Full.passedLocal, score:b2Full.score, reasons:b2Full.capReasons });
    checks.push({ name:'b2-profile-harder-than-a1', ok:(difficulty('B2').writingWords[0] >= difficulty('A1').writingWords[0]*5) && (difficulty('B2').severity > difficulty('A1').severity) });
    return { ok:checks.every(function(c){ return c.ok; }), phase:'38D.2B', checks:checks, samples:{ simpleB2:simpleB2, validA1:validA1, b2Full:b2Full }, checkedAt:nowIso() };
  }

  window.LanguageExamEngine = Object.freeze({
    __version:VERSION,
    statusEvent:STATUS_EVENT,
    lastStatus:function(){ return Object.assign({}, lastStatus); },
    listLevels:function(){ return blueprints() && blueprints().listLevels ? blueprints().listLevels() : ['A1','A2','B1','B2','C1','C2']; },
    getBlueprint:getBlueprint,
    getDifficultyProfile:difficulty,
    validateLevelDifferentiation:validateLevelDifferentiation,
    createSession:createSession,
    localAssessResponse:localAssessResponse,
    assessSpeakingExam:assessSpeakingExam,
    assessWritingExam:assessWritingExam,
    combineHybrid:combineHybrid,
    computeFinal:computeFinal,
    createB1FullQaSession:createB1FullQaSession,
    runB1FullExamQaScenarios:runB1FullExamQaScenarios,
    validateB1FullExamQaScenarios:validateB1FullExamQaScenarios,
    validateB1HardmodeTotalQa:validateB1HardmodeTotalQa,
    createB2FullQaSession:createB2FullQaSession,
    runB2FullExamQaScenarios:runB2FullExamQaScenarios,
    validateB2FullExamQaScenarios:validateB2FullExamQaScenarios,
    validateB2HardmodeTotalQa:validateB2HardmodeTotalQa
  });
})();
