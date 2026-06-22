/* Language Academy · Phase 38E.5
   Mini-Übungssets auswerten und Trainingsfortschritt speichern. */
(function(){
  'use strict';

  var VERSION = 'G54.38E.5-mini-training-progress';
  var STORAGE_KEY = 'language-academy-exam-shell-session-v24-mini-training-progress';
  var HISTORY_KEY = 'language-academy-exam-shell-history-v1';
  var PARTS = ['reading','listening','grammar','writing','speaking'];
  var PART_LABELS = { reading:'Lesen', listening:'Hören', grammar:'Grammatik & Sprachbausteine', writing:'Schreiben', speaking:'Sprechen' };
  var PART_ICONS = { reading:'📖', listening:'🎧', grammar:'🧩', writing:'✍️', speaking:'🎤' };
  var TRAINING_KEY = 'language-academy-exam-training-session-v1';
  var TRAINING_PROGRESS_KEY = 'language-academy-mini-training-progress-v1';

  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"]/g,function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]);
    });
  }
  function nowIso(){ return new Date().toISOString(); }
  function isoMs(value){ var t = Date.parse(value || ''); return Number.isFinite(t) ? t : Date.now(); }
  function clamp(n,min,max){ n = Number(n || 0); return Math.max(min, Math.min(max, n)); }
  function two(n){ n = Math.max(0, Math.floor(Number(n || 0))); return n < 10 ? '0' + n : String(n); }
  function formatSeconds(total){ total = Math.max(0, Math.floor(Number(total || 0))); return two(total / 60) + ':' + two(total % 60); }
  function engine(){ return window.LanguageExamEngine || null; }
  function blueprints(){ return window.LanguageExamBlueprints || null; }
  function difficultyRules(){ return window.LanguageLevelDifficultyRules || null; }
  function difficulty(level){ return difficultyRules() && difficultyRules().get ? difficultyRules().get(normalizeLevel(level)) : null; }
  function pilotForLevel(level){
    level = normalizeLevel(level);
    if(level === 'B1') return window.LanguageB1ExamPilot || null;
    if(level === 'B2') return window.LanguageB2ExamPilot || null;
    return null;
  }
  function attemptKeyForLevel(level){ return String(normalizeLevel(level)).toLowerCase() + 'ExamAttempt'; }
  function normalizeLevel(level){
    var value = String(level || 'B1').toUpperCase();
    return /^(A1|A2|B1|B2|C1|C2)$/.test(value) ? value : 'B1';
  }
  function getBlueprint(level){
    if(engine() && engine().getBlueprint) return engine().getBlueprint(level);
    if(blueprints() && blueprints().get) return blueprints().get(level);
    return null;
  }
  function defaultSession(level){
    level = normalizeLevel(level || 'B1');
    var base = engine() && engine().createSession ? engine().createSession(level) : null;
    return Object.assign({
      id:'exam-shell-' + level.toLowerCase() + '-' + Date.now(),
      level:level,
      status:'created',
      currentPart:'reading',
      startedAt:nowIso(),
      updatedAt:nowIso(),
      strictMode:true,
      partOrder:PARTS.slice(),
      answers:{ reading:{}, listening:{}, grammar:{}, writing:'', speaking:'' },
      listeningAudio:{},
      transcriptConfirmed:false,
      parts:{ reading:null, listening:null, grammar:null, writing:null, speaking:null },
      final:null,
      partStartedAt:{ reading:nowIso() },
      partCompletedAt:{ reading:null, listening:null, grammar:null, writing:null, speaking:null },
      examWarnings:[],
      b1ExamAttempt: level === 'B1' && window.LanguageB1ExamPilot && window.LanguageB1ExamPilot.buildAttempt ? window.LanguageB1ExamPilot.buildAttempt(String(Date.now())) : null,
      b2ExamAttempt: level === 'B2' && window.LanguageB2ExamPilot && window.LanguageB2ExamPilot.buildAttempt ? window.LanguageB2ExamPilot.buildAttempt(String(Date.now())) : null
    }, base || {});
  }
  function loadSession(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      var parsed = JSON.parse(raw);
      if(!parsed || !parsed.level) return null;
      return normalizeSession(parsed);
    }catch(e){ return null; }
  }
  function normalizeSession(session){
    session = session || defaultSession('B1');
    session.level = normalizeLevel(session.level || 'B1');
    session.status = session.status || 'created';
    session.currentPart = PARTS.indexOf(session.currentPart) >= 0 ? session.currentPart : 'reading';
    session.answers = Object.assign({ reading:{}, listening:{}, grammar:{}, writing:'', speaking:'' }, session.answers || {});
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    session.parts = Object.assign({ reading:null, listening:null, grammar:null, writing:null, speaking:null }, session.parts || {});
    session.partOrder = PARTS.slice();
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    session.partCompletedAt = Object.assign({ reading:null, listening:null, grammar:null, writing:null, speaking:null }, session.partCompletedAt || {});
    session.examWarnings = Array.isArray(session.examWarnings) ? session.examWarnings : [];
    session.trainingFocus = session.trainingFocus && session.trainingFocus.part ? session.trainingFocus : null;
    if(session.status === 'training' && session.trainingFocus && PARTS.indexOf(session.trainingFocus.part) >= 0){
      session.currentPart = session.trainingFocus.part;
      session.strictMode = false;
    }
    if(!session.partStartedAt[session.currentPart]) session.partStartedAt[session.currentPart] = nowIso();
    var pilot = pilotForLevel(session.level);
    var attemptKey = attemptKeyForLevel(session.level);
    if(pilot && pilot.buildAttempt && !session[attemptKey]){
      session[attemptKey] = pilot.buildAttempt(session.id || Date.now());
    }
    session.updatedAt = nowIso();
    return session;
  }
  function saveSession(session){
    session = normalizeSession(session);
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }catch(e){}
    return session;
  }
  function clearSession(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }
  function openSheet(title, subtitle, body, icon){
    try{
      if(window.EGTUILayer && typeof window.EGTUILayer.openDeepSheet === 'function'){
        var res = window.EGTUILayer.openDeepSheet({ type:'language-exam-shell', theme:'blue', title:title, kicker:'Language Academy Prüfung', subtitle:subtitle, iconHtml:icon || '🎓', bodyHtml:body });
        setTimeout(bindInputs,40);
        return res;
      }
    }catch(e){}
    var host = document.getElementById('language-exam-shell-fallback');
    if(!host){ host = document.createElement('div'); host.id='language-exam-shell-fallback'; document.body.appendChild(host); }
    host.innerHTML = '<div class="la-exam-fallback">'+body+'</div>';
    setTimeout(bindInputs,40);
    return true;
  }
  function levelList(){
    var list = blueprints() && blueprints().listLevels ? blueprints().listLevels() : ['A1','A2','B1','B2','C1','C2'];
    return list.map(normalizeLevel);
  }
  function summaryCardHtml(){
    return '<section class="la-card la-exam-entry-card" data-la-exam-entry="phase38e5">' +
      '<div class="la-exam-entry-head"><span class="la-section-kicker">Academy-Hartmodus</span><em>Phase 38E.5</em></div>' +
      '<h3>Academy-Hartmodus A1 bis C2 · jetzt mit Grammatik & Sprachbausteinen</h3>' +
      '<p class="la-note">Diese Simulation ist absichtlich härter als typische Standardprüfungen. Wer sie stabil besteht, soll echte Prüfungen mit Reserve angehen können. Zusätzlich zu Lesen, Hören, Schreiben und Sprechen wird jetzt Grammatik & Sprachbausteine als Pflichtblock geprüft.</p>' +
      '<div class="la-exam-mini-grid"><div><b>5</b><small>Pflichtteile</small></div><div><b>Grammatik</b><small>Sprachbausteine zählen</small></div><div><b>streng</b><small>Punktdeckelung</small></div></div>' +
      '<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-open">Academy-Hartmodus öffnen</button><button type="button" class="la-secondary" data-ui-action="language-exam-open" data-la-exam-resume="1">Fortsetzen</button></div>' +
    '</section>';
  }
  function levelCard(level){
    var bp = getBlueprint(level) || {};
    var parts = bp.parts || {};
    var profile = difficulty(level) || {};
    var duration = PARTS.reduce(function(sum,p){ return sum + Number((parts[p] && parts[p].durationMinutes) || 0); }, 0);
    var strict = level === 'C1' || level === 'C2' ? 'sehr streng' : (level === 'B1' || level === 'B2' ? 'streng' : 'grundlegend');
    var write = profile.writingWords ? (profile.writingWords[0]+'–'+profile.writingWords[1]+' Wörter') : 'niveauabhängig';
    var skill = profile.skills && profile.skills.length ? profile.skills[0] : (bp.description || 'Prüfungssimulation');
    var grammar = profile.grammar && profile.grammar.length ? profile.grammar.slice(0,2).join(' · ') : 'Sprachbausteine';
    return '<button type="button" class="la-exam-level-card la-exam-level-card-'+esc(level.toLowerCase())+'" data-ui-action="language-exam-start" data-la-exam-level="'+esc(level)+'">' +
      '<span>'+esc(level)+'</span><b>'+esc(profile.label || bp.description || 'Prüfungssimulation')+'</b>' +
      '<small>'+esc(duration || '—')+' Min · Bestehen ab '+esc(bp.passScore || 70)+'% · '+esc(strict)+'</small>' +
      '<em class="la-level-difficulty-line">Schreiben: '+esc(write)+'</em>' +
      '<em class="la-level-difficulty-line">Fokus: '+esc(skill)+'</em>' +
      '<em class="la-level-difficulty-line">Grammatik: '+esc(grammar)+'</em>' +
    '</button>';
  }

  function partPoolCount(level, part){
    var pilot = pilotForLevel(level);
    var poolName = part + 'Pool';
    if(pilot && Array.isArray(pilot[poolName])) return pilot[poolName].length;
    var bp = getBlueprint(level) || {};
    if(part === 'writing' && Array.isArray(bp.writingTasks)) return bp.writingTasks.length;
    if(part === 'speaking' && Array.isArray(bp.speakingTasks)) return bp.speakingTasks.length;
    return level === 'B2' ? 8 : (level === 'B1' && (part === 'reading' || part === 'listening' || part === 'grammar') ? 3 : 1);
  }
  function levelCombinationCount(level){
    return PARTS.reduce(function(sum, part){ return sum * Math.max(1, partPoolCount(level, part)); }, 1);
  }
  function loadHistory(){
    try{
      var raw = localStorage.getItem(HISTORY_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter(function(x){ return x && x.level; }).slice(0, 40) : [];
    }catch(e){ return []; }
  }
  function saveHistory(list){
    try{ localStorage.setItem(HISTORY_KEY, JSON.stringify((Array.isArray(list)?list:[]).slice(0,40))); }catch(e){}
  }
  function attemptFingerprint(session){
    return [session && session.id, session && session.level, session && session.final && session.final.overallScore, session && session.final && session.final.completedParts].join('|');
  }
  function archiveFinalAttempt(session){
    if(!session || !session.final) return;
    var fingerprint = attemptFingerprint(session);
    var list = loadHistory().filter(function(item){ return item.fingerprint !== fingerprint; });
    var breakdown = Array.isArray(session.final.partBreakdown) ? session.final.partBreakdown : [];
    list.unshift({
      id:session.id || ('attempt-' + Date.now()),
      fingerprint:fingerprint,
      level:normalizeLevel(session.level),
      createdAt:session.startedAt || nowIso(),
      completedAt:session.final.generatedAt || session.updatedAt || nowIso(),
      overallScore:Number(session.final.overallScore || 0),
      passed:!!session.final.passed,
      readiness:session.final.readiness || '',
      readinessProbability:Number(session.final.readinessProbability || 0),
      completedParts:Number(session.final.completedParts || 0),
      partScores:breakdown.reduce(function(map, item){ map[item.part] = Number(item.score || 0); return map; }, {}),
      criticalWeaknesses:Array.isArray(session.final.criticalWeaknesses) ? session.final.criticalWeaknesses.slice(0,8) : [],
      recommendations:Array.isArray(session.final.recommendations) ? session.final.recommendations.slice(0,8) : [],
      nextRequiredAction:session.final.nextRequiredAction || ''
    });
    saveHistory(list);
  }
  function bestHistoryByLevel(){
    return loadHistory().reduce(function(map,item){
      var level = normalizeLevel(item.level);
      if(!map[level] || Number(item.overallScore || 0) > Number(map[level].overallScore || 0)) map[level] = item;
      return map;
    }, {});
  }
  function currentProgressByLevel(existing){
    var map = bestHistoryByLevel();
    if(existing && existing.level){
      var partsDone = PARTS.filter(function(p){ return !!(existing.parts && existing.parts[p]); }).length;
      var scores = PARTS.map(function(p){ var r = existing.parts && existing.parts[p]; return r ? Number(r.overallScore || r.score || 0) : null; }).filter(function(v){ return v != null; });
      var avg = scores.length ? Math.round(scores.reduce(function(a,b){ return a+b; },0) / scores.length) : 0;
      map[normalizeLevel(existing.level)] = Object.assign({}, map[normalizeLevel(existing.level)] || {}, { active:true, completedParts:partsDone, overallScore:avg, readiness:'aktiver Versuch', partScores:(existing.parts||{}) });
    }
    return map;
  }
  function requirementMini(level){
    var r = difficulty(level) || {};
    var bp = getBlueprint(level) || {};
    var parts = bp.parts || {};
    return {
      writing:r.writingWords ? r.writingWords[0]+'–'+r.writingWords[1] : ((parts.writing&&parts.writing.minWords)||'—'),
      speaking:r.speakingWords ? r.speakingWords[0]+'–'+r.speakingWords[1] : ((parts.speaking&&parts.speaking.minWords)||'—'),
      grammar:r.grammar && r.grammar.length ? r.grammar.slice(0,2).join(', ') : (((parts.grammar&&parts.grammar.format)||[]).slice(0,2).join(', ') || 'niveauabhängig'),
      focus:r.skills && r.skills.length ? r.skills.slice(0,2).join(', ') : (bp.description || 'Prüfung')
    };
  }
  function nextRecommendation(level, item){
    level = normalizeLevel(level);
    if(!item || !item.completedParts) return 'Ersten Hardmode-Versuch starten';
    if(item.active && item.completedParts < PARTS.length) return 'Aktiven Versuch beenden';
    if(item.passed && Number(item.readinessProbability || item.overallScore || 0) >= 82) return level === 'B2' ? 'B2 halten oder C1-Vorbereitung starten' : 'Nächstes Niveau vorbereiten';
    if(item.passed) return 'Bestehen stabilisieren, schwächsten Teil wiederholen';
    return 'Schwächste Prüfungsteile gezielt trainieren';
  }

  function levelTarget(level){
    var bp = getBlueprint(level) || {};
    return Number(bp.passScore || (level === 'B2' ? 76 : 70));
  }
  function partMinTarget(level, part){
    var bp = getBlueprint(level) || {};
    var cfg = bp.parts && bp.parts[part] ? bp.parts[part] : {};
    return Number(cfg.minScore || bp.partMinScore || (level === 'B2' ? 65 : 55));
  }
  function partScoreFromItem(item, part){
    if(!item) return null;
    if(item.partScores && item.partScores[part] != null){
      var v = item.partScores[part];
      if(typeof v === 'object') return Number(v.overallScore || v.score || 0);
      return Number(v || 0);
    }
    return null;
  }
  function weaknessBand(score, min){
    if(score == null) return 'open';
    if(score < Math.max(35, min - 20)) return 'critical';
    if(score < min) return 'weak';
    if(score < min + 8) return 'borderline';
    return 'stable';
  }
  function partWeaknessReason(part, band, score, min){
    var label = PART_LABELS[part] || part;
    if(band === 'open') return label + ': noch nicht abgeschlossen';
    if(band === 'critical') return label + ': deutlich unter Mindestleistung (' + score + '% / Ziel ' + min + '%)';
    if(band === 'weak') return label + ': unter Mindestleistung (' + score + '% / Ziel ' + min + '%)';
    if(band === 'borderline') return label + ': knapp, noch nicht stabil (' + score + '% / Ziel ' + min + '%)';
    return label + ': stabil (' + score + '%)';
  }
  function trainingPlanForPart(level, part, band){
    var hard = normalizeLevel(level) === 'B2';
    var base = {
      reading:['Hauptaussage und Autorabsicht markieren','Ablenker aktiv begründen','2 Varianten unter Zeitdruck lösen'],
      listening:['erst ohne Transkript hören','Sprecherhaltung und Bedingungen notieren','danach Fehler mit Transkript kontrollieren'],
      grammar:['Konnektoren, Satzstellung und Register wiederholen','falsche Optionen begründen','mindestens 24 Sprachbausteine am Stück trainieren'],
      writing:['Pflichtpunkte vor dem Schreiben abhaken','Einleitung, Argumente, Beispiel, Fazit sauber trennen','Text nach Register, Umfang und Thema prüfen'],
      speaking:['Antwort als Mini-Struktur sprechen','eigene Position, Begründung und Beispiel erzwingen','Transkript bestätigen und Schwächen korrigieren']
    }[part] || ['Teil wiederholen','Fehleranalyse durchführen','zweiten Versuch starten'];
    var intensity = band === 'critical' ? 'Sofort-Fokus' : (band === 'weak' ? 'Pflichttraining' : (band === 'borderline' ? 'Stabilisierung' : 'Erhaltung'));
    var minutes = band === 'critical' ? 35 : (band === 'weak' ? 25 : 15);
    return {
      part:part,
      label:PART_LABELS[part] || part,
      band:band,
      intensity:intensity,
      minutes:minutes,
      target: hard ? 'B2-Hardmode-Reserve aufbauen' : normalizeLevel(level)+' sicher bestehen',
      steps:base
    };
  }


  function miniTrainingSetFor(level, part, band){
    level = normalizeLevel(level || 'B2');
    part = PARTS.indexOf(part) >= 0 ? part : 'grammar';
    band = band || 'open';
    var isB2 = level === 'B2';
    var label = PART_LABELS[part] || part;
    var prefix = level + ' · ' + label;
    var pressure = band === 'critical' || band === 'weak' ? 'Pflicht-Rettung' : (band === 'borderline' ? 'Stabilisierung' : 'Reserveaufbau');
    var sets = {
      reading:[
        { kind:'Markieren', title:prefix+' · Hauptaussage sichern', prompt:isB2 ? 'Lies einen argumentativen Text und formuliere in einem Satz: Was will der Autor wirklich erreichen?' : 'Lies einen kurzen Text und notiere die wichtigste Information.', expected:'Eine Hauptaussage, keine zufällige Detailangabe.', solution:isB2 ? 'Nicht: „Es geht um Digitalisierung.“ Besser: „Der Autor befürwortet digitale Weiterbildung, warnt aber vor sozialer Ungleichheit durch fehlende Unterstützung.“' : 'Wer? Was? Wann? Wo? in einem klaren Satz.', checklist:['Thema erkannt','Autorabsicht oder Kerninfo benannt','keine Nebeninformation als Hauptaussage'] },
        { kind:'Ablenker', title:prefix+' · falsche Antwort begründen', prompt:'Wähle bei einer Aufgabe bewusst eine falsche Option und erkläre, welches Wort oder welche Übertreibung sie falsch macht.', expected:'Ablenker aktiv entlarven.', solution:'Typische Fehler: „immer“, „nie“, falsche Ursache, falsche zeitliche Reihenfolge, Aussage steht ähnlich, aber nicht gleich im Text.', checklist:['Signalwort gefunden','Belegstelle im Text gesucht','falsche Schlussfolgerung erkannt'] },
        { kind:'Tempo', title:prefix+' · 6-Minuten-Lesedurchlauf', prompt:'Bearbeite einen Text in drei Runden: 1 Minute Überblick, 3 Minuten Fragen, 2 Minuten Belege kontrollieren.', expected:'Zeitstruktur statt planloses Lesen.', solution:'Bei B2 zählt nicht jedes Wort, sondern These, Einschränkung, Gegenargument, Fazit und Beleg.', checklist:['erst Überblick','dann Fragen','am Ende Belege'] }
      ],
      listening:[
        { kind:'Ohne Transkript', title:prefix+' · erstes Hören ohne Hilfe', prompt:'Höre einmal ohne Transkript. Notiere nur Sprecher, Thema und Zielkonflikt.', expected:'Hörverstehen ohne visuelle Hilfe.', solution:isB2 ? 'B2-Ziel: nicht nur Fakten hören, sondern Haltung, indirekte Kritik und Bedingungen erkennen.' : 'Ziel: Ort, Zeit, Person und Hauptinformation sichern.', checklist:['Transkript nicht geöffnet','Haltung notiert','eine Bedingung oder Änderung erkannt'] },
        { kind:'Sprecherhaltung', title:prefix+' · Meinung erkennen', prompt:'Notiere zwei Wörter, die zeigen, ob die Person zustimmt, zweifelt oder kritisiert.', expected:'Ton und Absicht erkennen.', solution:'Beispiele: „grundsätzlich sinnvoll, aber…“ = teilweise Zustimmung mit Einschränkung; „problematisch finde ich…“ = Kritik.', checklist:['Zustimmung/Kritik erkannt','Einschränkung markiert','nicht nur Einzelwort geraten'] },
        { kind:'Kontrolle', title:prefix+' · Transkript erst danach', prompt:'Öffne das Transkript erst nach dem Hören und markiere genau die Stelle, an der dein Fehler entstanden ist.', expected:'Fehlerquelle finden.', solution:'Fehler entstehen oft durch ähnliche Zahlen, negierte Aussagen, Bedingungen oder vertauschte Reihenfolge.', checklist:['Fehlerstelle gefunden','Grund benannt','zweites Hören gezielt genutzt'] }
      ],
      grammar:[
        { kind:'Konnektor', title:prefix+' · Satzverknüpfung', prompt:isB2 ? 'Setze passend ein: ___ die Maßnahme kurzfristig teuer ist, kann sie langfristig Kosten senken.' : 'Setze passend ein: Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.', expected:isB2 ? 'obwohl / auch wenn' : 'weil', solution:isB2 ? '„Obwohl“ passt, weil ein Gegensatz zwischen kurzfristigen Kosten und langfristigem Nutzen entsteht.' : '„weil“ passt, weil ein Grund genannt wird.', checklist:['Bedeutung geprüft','Nebensatzstellung beachtet','Register passend'] },
        { kind:'Satzstellung', title:prefix+' · Umformung', prompt:isB2 ? 'Forme um: „Viele Menschen nutzen KI. Sie kennen die Risiken nicht.“ → mit „ohne dass“.' : 'Forme um: „Ich habe Zeit. Ich komme.“ → mit „wenn“.', expected:isB2 ? 'Viele Menschen nutzen KI, ohne dass sie die Risiken kennen.' : 'Wenn ich Zeit habe, komme ich.', solution:'Achte auf Verbposition und darauf, dass der Sinn gleich bleibt.', checklist:['Verb am richtigen Platz','Sinn bleibt gleich','kein unnötiger Wortsalat'] },
        { kind:'Register', title:prefix+' · formeller Ausdruck', prompt:isB2 ? 'Ersetze „Das ist blöd“ durch einen formellen Ausdruck.' : 'Ersetze „Hi“ in einer formellen Nachricht.', expected:isB2 ? 'Das ist problematisch / Dies halte ich für unangemessen.' : 'Sehr geehrte Damen und Herren / Guten Tag', solution:'Im Hardmode zählt Register: Alltagssprache kann Schreiben und Sprechen deckeln.', checklist:['formell','präzise','nicht beleidigend'] }
      ],
      writing:[
        { kind:'Planung', title:prefix+' · Schreibgerüst vor dem Text', prompt:isB2 ? 'Plane 5 Abschnitte: Einleitung, Pro, Contra, eigene Position mit Beispiel, Fazit/Forderung.' : 'Plane 4 Sätze: Anrede, Grund, Bitte, Abschluss.', expected:'Struktur vor Formulierung.', solution:isB2 ? 'B2 ohne klare Struktur wirkt wie B1. Erst Gliederung, dann Text.' : 'Kurze Texte brauchen trotzdem Anlass, Bitte und Abschluss.', checklist:['alle Pflichtpunkte geplant','Reihenfolge logisch','Beispiel vorgesehen'] },
        { kind:'Pflichtpunkt', title:prefix+' · Beispiel erzwingen', prompt:isB2 ? 'Schreibe zwei Sätze mit „Zum Beispiel…“ und „Daraus folgt…“ zum aktuellen Thema.' : 'Schreibe einen konkreten Satz mit Uhrzeit, Ort oder Bitte.', expected:'Konkretheit statt leere Meinung.', solution:'Schwach: „Das ist gut.“ Stark: „Zum Beispiel könnten Beschäftigte zwei Tage pro Woche im Homeoffice arbeiten, wenn die Erreichbarkeit geregelt ist.“', checklist:['konkretes Beispiel','Folge erklärt','nicht nur Meinung'] },
        { kind:'Revision', title:prefix+' · 90-Sekunden-Korrektur', prompt:'Prüfe deinen Text auf Umfang, Thema, Register, Pflichtpunkte und Konnektoren.', expected:'Endkontrolle wie in echter Prüfung.', solution:'Vor Abgabe immer fragen: Habe ich alle Punkte beantwortet oder nur schön formuliert?', checklist:['Wortzahl passt','Register passt','Pflichtpunkte sichtbar'] }
      ],
      speaking:[
        { kind:'Sprechgerüst', title:prefix+' · 60-Sekunden-Antwort planen', prompt:isB2 ? 'Plane: Einstieg, Pro, Contra, eigene Position, Beispiel, Empfehlung.' : 'Plane: Wer bist du? Was ist das Thema? Was möchtest du sagen?', expected:'Sprechen mit Struktur.', solution:isB2 ? 'B2-Sprechen braucht hörbare Ordnung: „Zunächst… Andererseits… Aus meiner Sicht… Zum Beispiel… Daher empfehle ich…“' : 'Kurze, klare Sätze sind besser als einzelne Wörter.', checklist:['eigene Position','Begründung','Beispiel'] },
        { kind:'Transkript', title:prefix+' · Stichpunkte in Sätze verwandeln', prompt:'Nimm drei Stichpunkte und formuliere daraus mindestens fünf vollständige Sätze.', expected:'Keine Stichpunktantwort.', solution:'Stichpunkte werden hart gedeckelt. Das bestätigte Transkript muss zusammenhängend klingen.', checklist:['vollständige Sätze','Verbindungswörter','keine Liste'] },
        { kind:'Nachfrage', title:prefix+' · Gegenposition beantworten', prompt:isB2 ? 'Reagiere auf: „Das ist zu teuer und unrealistisch.“ Antworte mit Einschränkung und Kompromiss.' : 'Reagiere auf eine einfache Rückfrage und begründe kurz.', expected:'Spontane Reaktion trainieren.', solution:isB2 ? '„Der Einwand ist nachvollziehbar. Trotzdem könnte ein begrenztes Pilotprojekt zeigen, ob der Nutzen die Kosten rechtfertigt.“' : '„Ich verstehe die Frage. Ich denke…, weil…“', checklist:['Gegenargument aufgegriffen','nicht ausgewichen','Kompromiss oder Begründung'] }
      ]
    };
    return { level:level, part:part, band:band, label:label, pressure:pressure, title:prefix+' · Mini-Übungsset', tasks:sets[part] || [] };
  }


  function loadTrainingProgress(){
    try{
      var raw = localStorage.getItem(TRAINING_PROGRESS_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    }catch(e){ return []; }
  }
  function saveTrainingProgressList(list){
    list = Array.isArray(list) ? list.slice(-80) : [];
    try{ localStorage.setItem(TRAINING_PROGRESS_KEY, JSON.stringify(list)); }catch(e){}
    return list;
  }
  function miniTaskState(session, idx){
    var f = session && session.trainingFocus ? session.trainingFocus : {};
    var answers = f.miniAnswers || {};
    var checks = f.miniChecks || {};
    return { answer:String(answers[idx] || ''), checks:Array.isArray(checks[idx]) ? checks[idx] : [] };
  }
  function evaluateMiniTraining(session){
    session = normalizeSession(session || loadSession() || defaultSession('B2'));
    var f = session.trainingFocus || {};
    var set = f.miniSet && Array.isArray(f.miniSet.tasks) ? f.miniSet : miniTrainingSetFor(session.level, f.part, f.band);
    var tasks = set.tasks || [];
    var details = tasks.map(function(task, idx){
      var state = miniTaskState(session, idx);
      var words = state.answer.trim() ? state.answer.trim().split(/\s+/).filter(Boolean).length : 0;
      var checklistTotal = Array.isArray(task.checklist) ? task.checklist.length : 0;
      var checked = state.checks.length;
      var answerOk = words >= (task.kind === 'Tempo' ? 3 : 8);
      var checklistOk = checklistTotal ? checked >= Math.max(1, Math.ceil(checklistTotal * 0.67)) : true;
      var done = answerOk && checklistOk;
      var score = Math.round((answerOk ? 55 : Math.min(45, words * 5)) + (checklistTotal ? (checked / Math.max(1, checklistTotal)) * 45 : 45));
      return { index:idx, title:task.title || ('Mini-Übung '+(idx+1)), kind:task.kind || 'Übung', words:words, checked:checked, checklistTotal:checklistTotal, done:done, score:clamp(score,0,100) };
    });
    var completed = details.filter(function(x){ return x.done; }).length;
    var score = details.length ? Math.round(details.reduce(function(sum,x){ return sum + x.score; },0) / details.length) : 0;
    var passed = details.length > 0 && completed === details.length && score >= 70;
    var status = passed ? 'completed' : (completed ? 'partial' : 'open');
    var nextAction = passed ? 'Mini-Übungsset abgeschlossen. Jetzt den Transfer-Prüfungsteil bearbeiten und danach eine neue Simulation starten.' : 'Noch nicht stabil: Bearbeite alle Mini-Aufgaben mit kurzer Antwort und hake mindestens zwei Drittel der Checkliste ab.';
    return { id:'mini-training-'+Date.now(), level:normalizeLevel(session.level), part:f.part || session.currentPart, label:f.label || PART_LABELS[f.part] || f.part, band:f.band || 'open', score:score, completed:completed, total:details.length, passed:passed, status:status, details:details, nextAction:nextAction, createdAt:nowIso(), source:'mini-training-set' };
  }
  function persistTrainingProgress(session, result){
    result = result || evaluateMiniTraining(session);
    var list = loadTrainingProgress();
    list.push(result);
    saveTrainingProgressList(list);
    try{ localStorage.setItem(TRAINING_KEY, JSON.stringify(Object.assign({}, result, { updatedAt:nowIso() }))); }catch(e){}
    return result;
  }
  function latestTrainingProgress(level, part){
    level = normalizeLevel(level || 'B2');
    part = PARTS.indexOf(part) >= 0 ? part : null;
    var list = loadTrainingProgress().filter(function(x){ return normalizeLevel(x.level) === level && (!part || x.part === part); });
    return list.length ? list[list.length - 1] : null;
  }
  function trainingProgressSummaryHtml(level){
    var list = loadTrainingProgress().filter(function(x){ return normalizeLevel(x.level) === normalizeLevel(level || 'B2'); }).slice(-5).reverse();
    if(!list.length) return '<div class="la-training-progress-summary"><b>Noch kein gespeicherter Trainingsfortschritt</b><small>Starte ein Mini-Training und werte es aus.</small></div>';
    var rows = list.map(function(item){
      return '<li><b>'+esc(PART_LABELS[item.part] || item.part)+' · '+esc(item.score)+'%</b><small>'+esc(item.completed)+'/'+esc(item.total)+' Mini-Aufgaben · '+esc(item.status)+' · '+esc((item.createdAt || '').slice(0,16).replace('T',' '))+'</small></li>';
    }).join('');
    return '<div class="la-training-progress-summary"><b>Gespeicherter Trainingsfortschritt</b><ul>'+rows+'</ul></div>';
  }
  function miniTrainingResultHtml(session){
    if(!session || session.status !== 'training' || !session.trainingFocus) return '';
    var result = session.trainingFocus.miniProgress || null;
    if(!result) return '<div class="la-mini-training-result is-open"><b>Noch nicht ausgewertet</b><small>Bearbeite die Mini-Aufgaben und klicke danach auf „Mini-Übungen auswerten“.</small></div>';
    var details = (result.details || []).map(function(d){ return '<li class="'+(d.done?'is-done':'is-open')+'"><b>'+esc(two(d.index+1))+' · '+esc(d.kind)+'</b><small>'+esc(d.score)+'% · '+esc(d.words)+' Wörter · '+esc(d.checked)+'/'+esc(d.checklistTotal)+' Checkpunkte</small></li>'; }).join('');
    return '<div class="la-mini-training-result '+(result.passed?'is-pass':'is-partial')+'"><b>'+esc(result.score)+'% · '+esc(result.completed)+'/'+esc(result.total)+' Mini-Aufgaben abgeschlossen</b><small>'+esc(result.nextAction)+'</small><ul>'+details+'</ul></div>';
  }

  function miniTrainingSetHtml(session){
    if(!session || session.status !== 'training' || !session.trainingFocus) return '';
    var f = session.trainingFocus;
    var set = f.miniSet && Array.isArray(f.miniSet.tasks) ? f.miniSet : miniTrainingSetFor(session.level, f.part, f.band);
    var tasks = (set.tasks || []).map(function(task, idx){
      var state = miniTaskState(session, idx);
      var checklist = (task.checklist || []).map(function(item, cidx){
        var checked = state.checks.indexOf(cidx) >= 0 ? ' checked' : '';
        return '<label><input type="checkbox" data-la-mini-check="'+esc(idx)+'" data-la-mini-check-index="'+esc(cidx)+'"'+checked+'> <span>'+esc(item)+'</span></label>';
      }).join('');
      return '<article class="la-mini-training-task" data-la-mini-training-task="'+esc(idx+1)+'"><div class="la-mini-training-task-head"><span>'+esc(two(idx+1))+'</span><b>'+esc(task.title || ('Mini-Übung '+(idx+1)))+'</b><em>'+esc(task.kind || 'Übung')+'</em></div><p>'+esc(task.prompt || '')+'</p><div class="la-mini-training-expected"><b>Ziel:</b> '+esc(task.expected || 'gezielt üben')+'</div><label class="la-mini-training-answer-label">Deine Kurzlösung / Notiz<textarea data-la-mini-answer="'+esc(idx)+'" rows="4" placeholder="Schreibe hier deine Lösung, Begründung oder Kontrollnotiz…">'+esc(state.answer)+'</textarea></label>'+(checklist?'<div class="la-mini-training-checklist">'+checklist+'</div>':'')+'<details class="la-mini-training-solution"><summary>Musterlösung / Prüflogik anzeigen</summary><p>'+esc(task.solution || '')+'</p></details></article>';
    }).join('');
    return '<section class="la-mini-training-set" data-la-mini-training-set="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Mini-Übungsset mit Fortschritt · Phase 38E.5</span><em>'+esc(set.pressure || 'Training')+'</em></div><h4>'+esc(set.title || 'Mini-Übungsset')+'</h4><p class="la-note">Bearbeite die Mini-Aufgaben schriftlich, hake die Checkliste ab und werte das Set aus. Der Fortschritt wird lokal gespeichert und im Dashboard sichtbar.</p><div class="la-mini-training-grid">'+tasks+'</div>'+miniTrainingResultHtml(session)+'<div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-mini-evaluate">Mini-Übungen auswerten</button><button type="button" class="la-secondary" data-ui-action="language-exam-mini-reset">Mini-Antworten zurücksetzen</button></div></section>';
  }

  function buildWeaknessProfile(level, item){
    level = normalizeLevel(level || (item && item.level) || 'B1');
    item = item || null;
    var entries = PARTS.map(function(part){
      var min = partMinTarget(level, part);
      var score = partScoreFromItem(item, part);
      var band = weaknessBand(score, min);
      return { part:part, label:PART_LABELS[part], score:score, minScore:min, band:band, reason:partWeaknessReason(part, band, score, min), training:trainingPlanForPart(level, part, band) };
    });
    var priority = entries.slice().sort(function(a,b){
      var weight = { critical:0, weak:1, open:2, borderline:3, stable:4 };
      var wa = weight[a.band] == null ? 5 : weight[a.band];
      var wb = weight[b.band] == null ? 5 : weight[b.band];
      if(wa !== wb) return wa - wb;
      return Number(a.score == null ? -1 : a.score) - Number(b.score == null ? -1 : b.score);
    });
    var critical = entries.filter(function(e){ return e.band === 'critical' || e.band === 'weak' || e.band === 'open'; });
    var borderline = entries.filter(function(e){ return e.band === 'borderline'; });
    var stable = entries.filter(function(e){ return e.band === 'stable'; });
    var action = critical.length ? 'Erst ' + critical[0].label + ' gezielt trainieren, dann neue Simulation starten.' : (borderline.length ? borderline[0].label + ' stabilisieren, damit das Bestehen nicht kippt.' : 'Niveau halten und nächsthöhere Prüfung vorbereiten.');
    return { level:level, targetScore:levelTarget(level), entries:entries, priority:priority, critical:critical, borderline:borderline, stable:stable, action:action };
  }
  function weaknessProfileHtml(level, item){
    var profile = buildWeaknessProfile(level, item);
    var cards = profile.priority.slice(0,5).map(function(entry){
      var score = entry.score == null ? 'offen' : entry.score + '%';
      return '<article class="la-weakness-card is-'+esc(entry.band)+'" data-la-training-card="'+esc(entry.part)+'"><div><span>'+esc(entry.label)+'</span><b>'+esc(score)+'</b><small>Ziel: '+esc(entry.minScore)+'%</small></div><p>'+esc(entry.reason)+'</p><em>'+esc(entry.training.intensity)+' · ca. '+esc(entry.training.minutes)+' Min. · 3 Mini-Übungen</em><ul>'+entry.training.steps.map(function(step){ return '<li>'+esc(step)+'</li>'; }).join('')+'</ul><button type="button" class="la-primary la-training-start" data-ui-action="language-exam-training-start" data-la-training-level="'+esc(profile.level)+'" data-la-training-part="'+esc(entry.part)+'">Mini-Training starten</button></article>';
    }).join('');
    var summary = '<div class="la-weakness-summary"><div><b>'+esc(profile.critical.length)+'</b><small>kritisch/offen</small></div><div><b>'+esc(profile.borderline.length)+'</b><small>knapp</small></div><div><b>'+esc(profile.stable.length)+'</b><small>stabil</small></div></div>';
    return '<section class="la-card la-weakness-profile" data-la-weakness-profile="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Schwächenprofil · Phase 38E.5</span><em>'+esc(profile.level)+' Trainingspfad</em></div><h3>Lernstandsdetails und gezielte Trainingspfade</h3><p class="la-note">Die App betrachtet nicht nur den Gesamtscore, sondern jeden Prüfungsteil einzeln. Kritische oder offene Teile werden zuerst trainiert, knappe Teile werden stabilisiert, starke Teile bleiben im Erhaltungsmodus.</p>'+summary+'<div class="la-weakness-grid">'+cards+'</div><div class="la-exam-report-box is-next"><h4>Nächster gezielter Schritt</h4><p>'+esc(profile.action)+'</p></div></section>';
  }
  function saveTrainingState(session){
    try{ localStorage.setItem(TRAINING_KEY, JSON.stringify({ level:normalizeLevel(session.level), part:session.trainingFocus && session.trainingFocus.part, band:session.trainingFocus && session.trainingFocus.band, miniProgress:session.trainingFocus && session.trainingFocus.miniProgress || null, updatedAt:nowIso() })); }catch(e){}
  }
  function trainingProfileFor(level, part, sourceItem){
    var profile = buildWeaknessProfile(level, sourceItem || null);
    var found = profile.entries.filter(function(entry){ return entry.part === part; })[0];
    return found || { part:part, label:PART_LABELS[part] || part, score:null, minScore:partMinTarget(level,part), band:'open', training:trainingPlanForPart(level,part,'open') };
  }
  function startTraining(level, part){
    level = normalizeLevel(level || 'B2');
    part = PARTS.indexOf(part) >= 0 ? part : 'grammar';
    var history = loadHistory();
    var item = history.filter(function(x){ return normalizeLevel(x.level) === level; })[0] || null;
    var entry = trainingProfileFor(level, part, item);
    var session = defaultSession(level);
    session.status = 'training';
    session.strictMode = false;
    session.currentPart = part;
    session.trainingFocus = {
      level:level,
      part:part,
      label:entry.label,
      band:entry.band,
      targetScore:entry.minScore,
      minutes:entry.training && entry.training.minutes ? entry.training.minutes : 20,
      intensity:entry.training && entry.training.intensity ? entry.training.intensity : 'Training',
      steps:entry.training && entry.training.steps ? entry.training.steps.slice(0,5) : [],
      miniSet:miniTrainingSetFor(level, part, entry.band),
      createdAt:nowIso(),
      source:'weakness-profile',
      miniAnswers:{},
      miniChecks:{},
      miniProgress:null
    };
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    session.partStartedAt[part] = nowIso();
    saveTrainingState(session);
    return renderSession(saveSession(session));
  }
  function trainingModeBanner(session){
    if(!session || session.status !== 'training' || !session.trainingFocus) return '';
    var f = session.trainingFocus;
    var steps = Array.isArray(f.steps) ? f.steps : [];
    return '<section class="la-card la-training-mode-banner" data-la-training-mode="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Trainingsmodus · Phase 38E.5</span><em>'+esc(f.intensity || 'Training')+' · '+esc(f.minutes || 20)+' Min.</em></div><h3>'+esc(PART_ICONS[f.part] || '🎯')+' '+esc(f.label || PART_LABELS[f.part] || f.part)+' gezielt trainieren</h3><p class="la-note">Dieser Modus startet direkt aus deinem Schwächenprofil. Er ist kein kompletter Prüfungsversuch, sondern ein fokussierter Trainingsblock für genau den Teil, der dich aktuell am stärksten bremst.</p><div class="la-training-target-grid"><div><b>'+esc(session.level)+'</b><small>Niveau</small></div><div><b>'+esc(f.targetScore || partMinTarget(session.level,f.part))+'%</b><small>Zielwert</small></div><div><b>'+esc(f.band || 'open')+'</b><small>Status</small></div></div>'+(steps.length?'<ul class="la-training-step-list">'+steps.map(function(step){ return '<li>'+esc(step)+'</li>'; }).join('')+'</ul>':'')+miniTrainingSetHtml(session)+'<div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-home">Zur Übersicht</button><button type="button" class="la-primary" data-ui-action="language-exam-training-finish">Training abschließen</button></div></section>';
  }
  function finishTraining(){
    var session = loadSession() || defaultSession('B2');
    if(session.status === 'training'){
      var miniResult = evaluateMiniTraining(session);
      session.trainingFocus.miniProgress = miniResult;
      persistTrainingProgress(session, miniResult);
      session.status = 'training-completed';
      session.updatedAt = nowIso();
      session.examWarnings = (session.examWarnings || []).concat(['Trainingsmodus aus Schwächenprofil abgeschlossen. Für Prüfungsreife anschließend vollständige Simulation starten.']);
      saveSession(session);
    }
    return renderHome();
  }

  function dashboardHtml(existing){
    var progress = currentProgressByLevel(existing);
    var levels = ['A1','A2','B1','B2'];
    var rows = levels.map(function(level){
      var req = requirementMini(level);
      var item = progress[level] || null;
      var score = item ? Number(item.overallScore || 0) : 0;
      var status = !item ? 'noch offen' : (item.active ? 'aktiv' : (item.passed ? 'bestanden' : 'nicht bestanden'));
      var cls = !item ? 'is-open' : (item.passed ? 'is-pass' : (item.active ? 'is-active' : 'is-fail'));
      return '<article class="la-exam-dashboard-level '+cls+'" data-la-dashboard-level="'+esc(level)+'"><div><span>'+esc(level)+'</span><b>'+esc(score || '—')+(score?'%':'')+'</b><small>'+esc(status)+' · '+esc(item ? ((item.completedParts||0)+'/'+PARTS.length+' Teile') : '0/'+PARTS.length+' Teile')+'</small>'+pctBar(score)+'</div><ul><li>Schreiben: '+esc(req.writing)+' Wörter</li><li>Sprechen: '+esc(req.speaking)+' Wörter</li><li>Grammatik: '+esc(req.grammar)+'</li><li>Fokus: '+esc(req.focus)+'</li></ul><em>'+esc(nextRecommendation(level,item))+'</em><button type="button" class="la-secondary" data-ui-action="language-exam-start" data-la-exam-level="'+esc(level)+'">'+esc(level)+' starten</button></article>';
    }).join('');
    var history = loadHistory();
    var hist = history.length ? history.slice(0,5).map(function(item){ return '<li><b>'+esc(item.level)+' · '+esc(item.overallScore)+'%</b><span>'+esc(item.passed?'bestanden':'nicht bestanden')+' · '+esc(item.readiness || 'Bewertung')+'</span></li>'; }).join('') : '<li><span>Noch kein abgeschlossener Versuch gespeichert.</span></li>';
    return '<section class="la-card la-exam-dashboard-overview" data-la-exam-dashboard="phase38e5"><div class="la-exam-entry-head"><span class="la-section-kicker">Prüfungsdashboard · Phase 38E.5</span><em>A1–B2 Vergleich</em></div><h3>Gesamtübersicht: Niveau, Lernstand und nächste Schritte</h3><p class="la-note">Das Dashboard vergleicht A1 bis B2 nicht nur optisch, sondern nach echten Anforderungen: Wortumfang, Grammatik, Aufgabenhärte, Pflichtteile und gespeicherte Versuchsergebnisse.</p><div class="la-exam-dashboard-grid">'+rows+'</div><div class="la-exam-history"><b>Letzte abgeschlossene Versuche</b><ul>'+hist+'</ul></div>'+trainingProgressSummaryHtml((existing&&existing.level)||'B2')+weaknessProfileHtml((existing&&existing.level)||'B2', progress[(existing&&existing.level)||'B2'] || history[0] || null)+'<div class="la-exam-warning"><b>Arbeitslogik:</b> Nicht nur Gesamtscore zählen. Für Prüfungsreife müssen alle fünf Teile abgeschlossen sein und die Mindestleistungen pro Teil stabil sitzen. Phase 38E.5 zeigt daraus konkrete Trainingspfade.</div></section>';
  }

  function renderHome(){
    var existing = loadSession();
    var body = '<div class="la-dashboard la-exam-shell" data-la-exam-shell="phase38e5">' +
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Academy-Hartmodus</span><h3>Bewusst härter als Standardprüfungen</h3><p>Es gibt keinen einfachen Standardmodus mehr. Dieser Trainer prüft mit Reserve: Mindestleistung, Pflichtpunkte, Themenbezug, Zeitdruck, Punktdeckelung und Prüfungsreife. Ziel: Wer diese Simulation stabil besteht, hat realistische Chancen, echte Prüfungen deutlich sicherer anzugehen. A1 bis B2 werden im Dashboard vergleichbar: Versuchsergebnisse, Wortumfang, Grammatikniveau, Pflichtteile und nächste Trainingsschritte werden sichtbar gebündelt.</p><div class="la-exam-warning"><b>Wichtig:</b> Kein offizielles Zertifikat und keine Garantie. Es ist eine harte interne Vorbereitungssimulation mit bewusst höherer Messlatte.</div></section>' + dashboardHtml(existing) +
      (existing ? '<section class="la-card la-exam-active"><span class="la-section-kicker">Aktiver Versuch</span><h3>'+esc(existing.level)+' Prüfung fortsetzen</h3><p>Aktueller Teil: <b>'+esc(PART_LABELS[existing.currentPart] || existing.currentPart)+'</b> · Status: '+esc(existing.status)+'</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-resume">Fortsetzen</button><button type="button" class="la-secondary" data-ui-action="language-exam-reset">Neuen Versuch starten</button></div></section>' : '') +
      '<section class="la-card"><span class="la-section-kicker">Niveau wählen</span><h3>Welche Prüfung willst du simulieren?</h3><div class="la-exam-level-grid">'+levelList().map(levelCard).join('')+'</div></section>' +
      '<section class="la-card"><span class="la-section-kicker">Bewertungsprinzip</span><div class="la-exam-warning"><b>Level-Garantie:</b> Der Aufbau bleibt gleich, aber Textlänge, Wortumfang, Grammatik, Pflichtpunkte, Punktdeckelung und Groq-Prüferrolle sind pro Niveau unterschiedlich. Eine A1-Antwort darf B2 nicht bestehen.</div><div class="la-exam-rubric-grid"><div><b>Lesen/Hören</b><small>lokal, objektiv, zeitlich geführt</small></div><div><b>Grammatik</b><small>lokal, hart, keine KI-Limits</small></div><div><b>Schreiben/Sprechen</b><small>lokal + Groq-Mitprüfer</small></div><div><b>Prüfungsdruck</b><small>Timer, Status, Warnungen</small></div></div></section>' +
      '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-course-open">Zurück zum Sprachkurs</button></div></section>' +
    '</div>';
    return openSheet('Academy-Hartmodus', 'Strenger als Standardprüfungen · mit Groq-Prüfungslehrer.', body, '🎓');
  }
  function partDurationSeconds(session, partName){
    var bp = getBlueprint(session.level) || {};
    var part = (bp.parts && bp.parts[partName]) || {};
    return Math.max(60, Number(part.durationMinutes || 10) * 60);
  }
  function partTimeState(session, partName){
    session = normalizeSession(session || defaultSession('B1'));
    partName = partName || session.currentPart || 'reading';
    var total = partDurationSeconds(session, partName);
    var started = session.partStartedAt && session.partStartedAt[partName] ? session.partStartedAt[partName] : session.startedAt;
    var elapsed = Math.max(0, Math.floor((Date.now() - isoMs(started)) / 1000));
    var remaining = Math.max(0, total - elapsed);
    var pctLeft = clamp(Math.round((remaining / total) * 100), 0, 100);
    var state = remaining <= 0 ? 'expired' : (pctLeft <= 15 ? 'danger' : (pctLeft <= 35 ? 'warning' : 'ok'));
    return { total:total, elapsed:elapsed, remaining:remaining, pctLeft:pctLeft, state:state, startedAt:started };
  }
  function completionState(session){
    var done = PARTS.filter(function(p){ return !!(session.parts && session.parts[p]); }).length;
    return { done:done, total:PARTS.length, pct:Math.round((done / PARTS.length) * 100) };
  }
  function partPressureNotice(session){
    var ts = partTimeState(session, session.currentPart);
    if(ts.state === 'expired') return 'Zeit rechnerisch abgelaufen. Du kannst technisch weiterarbeiten, aber der Bericht markiert den Teil als kritisch.';
    if(ts.state === 'danger') return 'Nur noch wenig Zeit. Jetzt nicht perfektionieren, sondern Pflichtpunkte vollständig sichern.';
    if(ts.state === 'warning') return 'Zeitdruck beginnt. Prüfe Pflichtpunkte, bevor du weitergehst.';
    return 'Bearbeite ruhig, aber prüfungsnah. Die Simulation speichert deine Eingaben automatisch.';
  }
  function examPressureBar(session){
    var current = session.currentPart || 'reading';
    var ts = partTimeState(session, current);
    var cs = completionState(session);
    return '<section class="la-card la-exam-pressure is-'+esc(ts.state)+'" data-la-exam-timer-root="1">' +
      '<div class="la-exam-pressure-top"><span class="la-section-kicker">Prüfungsdruck aktiv</span><b>'+esc(PART_LABELS[current])+' · <span data-la-exam-timer="1" data-la-exam-start="'+esc(ts.startedAt)+'" data-la-exam-total="'+esc(ts.total)+'">'+esc(formatSeconds(ts.remaining))+'</span></b></div>' +
      '<div class="la-exam-timebar"><span data-la-exam-timebar="1" style="width:'+esc(ts.pctLeft)+'%"></span></div>' +
      '<div class="la-exam-pressure-grid"><div><b>'+esc(formatSeconds(ts.elapsed))+'</b><small>verstrichen</small></div><div><b>'+esc(cs.done)+'/'+esc(cs.total)+'</b><small>Teile bewertet</small></div><div><b>'+esc(cs.pct)+'%</b><small>Fortschritt</small></div></div>' +
      '<p>'+esc(partPressureNotice(session))+'</p>' +
      '</section>';
  }
  function partNav(session){
    return '<div class="la-exam-part-nav">' + PARTS.map(function(p,idx){
      var done = !!(session.parts && session.parts[p]);
      var cls = 'la-exam-part-tab' + (session.currentPart === p ? ' is-active' : '') + (done ? ' is-done' : '');
      return '<button type="button" class="'+cls+'" data-ui-action="language-exam-open-part" data-la-exam-part="'+esc(p)+'"><span>'+esc(idx+1)+'</span><b>'+esc(PART_LABELS[p])+'</b><small>'+esc(done ? 'fertig' : 'offen')+'</small></button>';
    }).join('') + '</div>';
  }
  function examHeader(session){
    var bp = getBlueprint(session.level) || {};
    var current = session.currentPart || 'reading';
    var part = (bp.parts && bp.parts[current]) || {};
    return '<section class="la-card la-exam-session-head"><span class="la-section-kicker">'+esc(session.level)+' Academy-Hartmodus</span><h3>'+esc(PART_ICONS[current])+' '+esc(PART_LABELS[current])+'</h3><p>'+esc(bp.description || 'Prüfungsmodus')+'</p><div class="la-exam-mini-grid"><div><b>'+esc(part.durationMinutes || '—')+'</b><small>Minuten</small></div><div><b>'+esc(part.minScore || bp.partMinScore || '—')+'%</b><small>Mindestteil</small></div><div><b>'+esc(bp.passScore || 70)+'%</b><small>Bestehen</small></div></div><div class="la-exam-status-strip"><span>Automatisch gespeichert</span><span>Keine Hilfe im Prüfungsmodus</span><span>Pflichtpunkte zählen hart</span></div>'+partNav(session)+'</section>';
  }
  function getPilotPart(session, partName){
    var pilot = session ? pilotForLevel(session.level) : null;
    if(pilot){
      var key = attemptKeyForLevel(session.level);
      if(session[key] && typeof pilot.getAttemptPart === 'function') return pilot.getAttemptPart(session[key], partName);
      if(typeof pilot.get === 'function') return pilot.get(partName);
    }
    return null;
  }
  function listeningState(session, pilot){
    var key = pilot && pilot.id ? pilot.id : 'default-listening';
    var all = Object.assign({}, session.listeningAudio || {});
    return Object.assign({
      key:key,
      plays:0,
      revealed:false,
      lastPlayedAt:null,
      lastTextLength:0,
      audioMode:'not-started',
      strictAudio:true,
      helperMode:false,
      fallbackUsed:false,
      lastError:null
    }, all[key] || {});
  }
  function defaultListeningTexts(level){
    level = normalizeLevel(level || 'B1');
    if(level === 'B2'){
      return [
        { title:'Interview Weiterbildung', body:'Moderatorin: Viele Betriebe bieten Onlineweiterbildungen an. Expertin: Onlinekurse können sinnvoll sein, aber nur, wenn Betriebe feste Lernzeiten, klare Ziele und Rückmeldungen einplanen. Ohne diese Struktur brechen viele Teilnehmende ab oder wenden das Gelernte nicht an.' },
        { title:'Radiobeitrag Verkehr', body:'In der Innenstadt sollen Buslinien ausgebaut und Parkplätze reduziert werden. Einige Geschäftsleute fürchten weniger Kundschaft. Die Verwaltung erwartet dagegen weniger Staus, bessere Luft und zuverlässigere Wege. Entscheidend sei, dass Menschen ohne Auto nicht benachteiligt werden.' }
      ];
    }
    if(level === 'A1') return [{ title:'Kurze Durchsage', body:'Der Deutschkurs beginnt heute um achtzehn Uhr in Raum zwei. Bitte bringen Sie einen Stift und Ihren Ausweis mit.' }];
    if(level === 'A2') return [{ title:'Telefonnotiz', body:'Guten Tag, hier ist die Praxis Schneider. Ihr Termin morgen um zehn Uhr muss leider verschoben werden. Bitte kommen Sie am Freitag um elf Uhr oder rufen Sie uns zurück.' }];
    return [
      { title:'Durchsage im Bürgerbüro', body:'Wegen einer technischen Störung können heute keine neuen Ausweise beantragt werden. Fertige Ausweise können am Schalter drei abgeholt werden. Ersatztermine werden automatisch per E-Mail verschickt.' },
      { title:'Telefonnotiz der Arztpraxis', body:'Ihr Termin am Dienstag um neun Uhr muss verschoben werden. Wir bieten Ihnen Freitag um fünfzehn Uhr an. Bitte rufen Sie bis morgen zwölf Uhr zurück, wenn der Termin nicht passt.' }
    ];
  }
  function normalizeListeningTexts(list){
    return (Array.isArray(list) ? list : []).map(function(t, idx){
      if(typeof t === 'string') return { title:'Hörtext '+(idx+1), body:t };
      return { title:(t && (t.title || t.heading || t.label)) || ('Hörtext '+(idx+1)), body:String((t && (t.body || t.text || t.transcript || t.content)) || '').trim() };
    }).filter(function(t){ return t.body && t.body.length > 10; });
  }
  function listeningPayload(pilot, level){
    var raw = [];
    var source = 'fallback';
    if(pilot && Array.isArray(pilot.texts) && pilot.texts.length){ raw = pilot.texts; source = 'pilot-texts'; }
    if((!raw || !raw.length) && pilot && Array.isArray(pilot.audioTexts) && pilot.audioTexts.length){ raw = pilot.audioTexts; source = 'pilot-audioTexts'; }
    if((!raw || !raw.length) && pilot && pilot.transcript){ raw = [{ title:'Hörtext', body:String(pilot.transcript) }]; source = 'pilot-transcript'; }
    var texts = normalizeListeningTexts(raw);
    var fallbackUsed = false;
    if(!texts.length){ texts = normalizeListeningTexts(defaultListeningTexts(level)); fallbackUsed = true; source = 'level-fallback'; }
    var plain = texts.map(function(t, idx){ return 'Hörtext ' + (idx+1) + '. ' + (t.title || 'Situation') + '. ' + t.body; }).join(' ').replace(/\s+/g,' ').trim();
    if(!plain || plain.length < 20){
      texts = normalizeListeningTexts(defaultListeningTexts(level));
      fallbackUsed = true;
      source = 'emergency-fallback';
      plain = texts.map(function(t, idx){ return 'Hörtext ' + (idx+1) + '. ' + (t.title || 'Situation') + '. ' + t.body; }).join(' ').replace(/\s+/g,' ').trim();
    }
    return { texts:texts, plain:plain, source:source, fallbackUsed:fallbackUsed, textLength:plain.length };
  }
  function listeningTextsForPilot(pilot, level){ return listeningPayload(pilot, level).texts; }
  function listeningPlainText(pilot, level){ return listeningPayload(pilot, level).plain; }
  function browserSpeechAvailable(){
    return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  }
  function listeningConsoleHtml(session, pilot, textsHtml){
    var st = listeningState(session, pilot);
    var payload = listeningPayload(pilot, session.level);
    var max = Number((pilot && pilot.maxPlays) || 2);
    var canPlay = st.plays < max;
    var hasListened = st.plays > 0;
    var isHelper = !!(st.helperMode || st.lastError || !st.strictAudio || (!browserSpeechAvailable() && st.revealed));
    var shouldReveal = st.revealed || st.plays >= Number((pilot && pilot.showTranscriptAfterPlays) || max);
    var tts = browserSpeechAvailable();
    var progress = Math.max(0, Math.min(100, Math.round((st.plays / Math.max(1,max)) * 100)));
    var lockText = hasListened ? (isHelper ? 'Antworten im Hilfsmodus freigeschaltet' : 'Antworten prüfungsnah freigeschaltet') : 'Antworten gesperrt bis zum ersten Hören';
    var statusText = isHelper ? 'Hilfsmodus aktiv: Transkript/Audio-Fallback genutzt. Ergebnis bleibt Training, nicht perfekte Hörsimulation.' : (tts ? 'Browser-Stimme verfügbar. Der Hörtext wird vorgelesen.' : 'Browser-Stimme nicht verfügbar. Starte den Hilfsmodus und lies das Transkript bewusst erst danach.');
    var sourceText = payload.fallbackUsed ? 'Fallback-Hörtext · '+esc(payload.textLength)+' Zeichen' : 'Aufgaben-Hörtext · '+esc(payload.textLength)+' Zeichen';
    return '<div class="la-listening-console" data-la-listening-key="'+esc(st.key)+'" data-la-listening-mode="'+esc(isHelper?'helper':'strict')+'">' +
      '<div class="la-listening-head"><div><span class="la-section-kicker">'+esc(session.level || 'B1')+' Hörprüfung · Academy-Hartmodus</span><h4>Hören vor Antworten</h4><p>'+esc((pilot && pilot.audioInstruction) || 'Höre die Situation aufmerksam. Erst danach werden die Antworten freigeschaltet. Das Transkript ist nur Fallback/Hilfsmodus.')+'</p></div><div class="la-listening-counter"><b>'+esc(st.plays)+'/'+esc(max)+'</b><small>Hörvorgänge</small></div></div>'+ 
      '<div class="la-listening-sourcebar"><span>'+sourceText+'</span><span>'+esc(tts?'Audio bereit':'Audio eingeschränkt')+'</span><span>'+esc(isHelper?'Hilfsmodus':'Strenge Simulation')+'</span></div>'+ 
      '<div class="la-listening-progress"><span style="width:'+esc(progress)+'%"></span></div>'+ 
      '<div class="la-listening-actions"><button type="button" class="la-primary" data-ui-action="language-exam-play-listening" data-la-listening-key="'+esc(st.key)+'" '+(canPlay?'':'aria-disabled="true"')+'>'+(canPlay?'▶ Hörtext abspielen':'Hörlimit erreicht')+'</button><button type="button" class="la-secondary" data-ui-action="language-exam-reveal-listening" data-la-listening-key="'+esc(st.key)+'" '+((hasListened || !tts)?'':'aria-disabled="true"')+'>'+(tts?'Transkript anzeigen':'Hilfsmodus: Transkript öffnen')+'</button></div>'+ 
      '<div class="la-listening-status '+(hasListened?'is-unlocked':'is-locked')+' '+(isHelper?'is-helper':'')+'"><b>'+esc(lockText)+'</b><small>'+esc(statusText)+'</small>'+(st.lastError?'<small class="la-listening-error">Audiohinweis: '+esc(st.lastError)+'</small>':'')+'</div>'+ 
      '<div class="la-exam-warning"><b>Harte Hörregel:</b> Eine Antwort zählt nur prüfungsnah, wenn der Hörtext mindestens einmal abgespielt wurde. Transkript ist Hilfsmodus und wird im Bericht markiert.</div>'+ 
      (shouldReveal ? '<div class="la-exam-sources is-transcript"><div class="la-transcript-label">Transkript / Hilfsmodus</div>'+textsHtml+'</div>' : '<div class="la-listening-transcript-locked"><b>Transkript verborgen</b><small>Erst hören. Danach darfst du zur Kontrolle oder bei Audiofehlern den Hilfsmodus öffnen.</small></div>')+
      '</div>';
  }
  function playListening(btn){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, 'listening');
    var st = listeningState(session, pilot);
    var max = Number((pilot && pilot.maxPlays) || 2);
    if(st.plays >= max) return renderSession(session);
    var payload = listeningPayload(pilot, session.level);
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    st.plays += 1;
    st.lastPlayedAt = nowIso();
    st.lastTextLength = payload.textLength;
    st.fallbackUsed = !!payload.fallbackUsed;
    st.audioMode = browserSpeechAvailable() ? 'browser-tts' : 'no-tts-helper';
    st.strictAudio = browserSpeechAvailable();
    st.helperMode = !browserSpeechAvailable();
    st.lastError = null;
    try{
      if(browserSpeechAvailable()){
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(payload.plain);
        utter.lang = 'de-DE';
        utter.rate = session.level === 'B2' ? 0.98 : 0.92;
        utter.pitch = 1;
        utter.onerror = function(){
          var fresh = loadSession() || session;
          fresh.listeningAudio = Object.assign({}, fresh.listeningAudio || {});
          var cur = listeningState(fresh, pilot);
          cur.helperMode = true;
          cur.strictAudio = false;
          cur.lastError = 'Browser-Stimme konnte nicht sauber abgespielt werden.';
          fresh.listeningAudio[cur.key] = cur;
          saveSession(fresh);
        };
        window.speechSynthesis.speak(utter);
      }else{
        st.revealed = true;
        st.lastError = 'Browser-Stimme ist auf diesem Gerät/Browser nicht verfügbar.';
      }
    }catch(err){
      st.helperMode = true;
      st.strictAudio = false;
      st.revealed = true;
      st.lastError = 'Audio konnte nicht gestartet werden.';
    }
    session.listeningAudio[st.key] = st;
    return renderSession(saveSession(session));
  }
  function revealListening(){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, 'listening');
    var st = listeningState(session, pilot);
    var tts = browserSpeechAvailable();
    if(st.plays <= 0 && tts) return renderSession(session);
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    st.revealed = true;
    if(st.plays <= 0 || !tts){
      st.helperMode = true;
      st.strictAudio = false;
      st.audioMode = 'transcript-helper';
      st.lastError = st.lastError || 'Transkript wurde ohne strengen Hördurchlauf geöffnet.';
    }
    session.listeningAudio[st.key] = st;
    return renderSession(saveSession(session));
  }

  function renderObjectivePart(session, partName){
    var pilot = getPilotPart(session, partName);
    var isReading = partName === 'reading';
    var title = pilot ? pilot.title : (isReading ? 'Lesen · Pilotaufgabe' : 'Hören · Pilotaufgabe');
    var intro = pilot ? pilot.intro : 'Bearbeite die Aufgabe aufmerksam und beantworte die Fragen.';
    var texts = isReading ? (pilot && Array.isArray(pilot.texts) ? pilot.texts : [
      { title:'Nachricht', body:'Der Kurs beginnt heute um 18 Uhr in Raum 204. Bitte bring deinen Ausweis mit.' }
    ]) : listeningTextsForPilot(pilot, session.level);
    var questions = pilot && Array.isArray(pilot.questions) ? pilot.questions : [
      { id:'q1', question:isReading ? 'Welche Information ist richtig?' : 'Wann ist der neue Termin?', options:isReading ? [['a','Der Kurs beginnt um 18 Uhr in Raum 204.'], ['b','Der Kurs fällt aus.'], ['c','Der Kurs ist online.']] : [['a','Montag um 10 Uhr'], ['b','Freitag um 15 Uhr'], ['c','Sonntag um 18 Uhr']], correct:isReading ? 'a' : 'b', explanation:'Pilotfrage.' }
    ];
    var selectedMap = (session.answers && session.answers[partName] && session.answers[partName].answers) || {};
    var result = session.parts && session.parts[partName];
    var textHtml = texts.map(function(t){ return '<article class="la-exam-source"><b>'+esc(t.title || 'Text')+'</b><p>'+esc(t.body || '')+'</p></article>'; }).join('');
    var listeningSt = partName === 'listening' ? listeningState(session, pilot) : null;
    var listeningUnlocked = partName !== 'listening' || (listeningSt && listeningSt.plays > 0);
    var questionsHtml = questions.map(function(q, idx){
      var selected = selectedMap[q.id];
      var opts = (q.options || []).map(function(a){
        var cls = 'la-answer-choice' + (selected === a[0] ? ' is-selected' : '');
        if(!listeningUnlocked){ cls += ' is-disabled'; }
        if(result){ cls += a[0] === q.correct ? ' is-correct' : (selected === a[0] ? ' is-wrong' : ''); }
        return '<button type="button" class="'+cls+'" data-ui-action="language-exam-objective-answer" data-la-exam-part="'+esc(partName)+'" data-la-question-id="'+esc(q.id)+'" data-la-answer="'+esc(a[0])+'" '+(listeningUnlocked?'':'aria-disabled="true"')+'><span>'+esc(String(a[0]).toUpperCase())+'</span><b>'+esc(a[1])+'</b></button>';
      }).join('');
      var explanation = result ? '<small class="la-exam-explanation">'+esc(q.explanation || '')+'</small>' : '';
      return '<div class="la-exam-question"><h4>'+esc(idx+1)+'. '+esc(q.question || '')+'</h4><div class="la-answer-grid">'+opts+'</div>'+explanation+'</div>';
    }).join('');
    var note = pilot && pilot.audioSimulationNote ? '<div class="la-exam-warning"><b>Hörhinweis:</b> '+esc(pilot.audioSimulationNote)+'</div>' : '';
    var sourceBlock = partName === 'listening' ? listeningConsoleHtml(session, pilot, textHtml) : '<div class="la-exam-sources">'+textHtml+'</div>';
    return '<section class="la-card la-exam-task la-exam-paper" data-la-exam-objective="'+esc(partName)+'"><div class="la-exam-proctor-line"><b>Prüfungsmodus</b><span>Keine Soforthilfe · keine Übersetzung · erst beantworten, dann bewerten.</span></div><span class="la-section-kicker">'+esc(PART_LABELS[partName])+' · '+esc(session.level)+' Aufgabenpool hart</span><h3>'+esc(title)+'</h3>' + (pilot && pilot.variantTitle ? '<div class="la-exam-pool-badge">'+esc(pilot.variantTitle)+'</div>' : '') + '<p class="la-exam-prompt">'+esc(intro)+'</p>'+note+sourceBlock+'<div class="la-exam-questions '+(listeningUnlocked?'':'is-locked')+'">'+questionsHtml+'</div><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-complete-objective" data-la-exam-part="'+esc(partName)+'" '+(listeningUnlocked?'':'aria-disabled="true"')+'>Teil bewerten</button></div>'+scoreBox(result)+'</section>';
  }
  function currentTask(session, partName){
    var pilot = session ? pilotForLevel(session.level) : null;
    if(pilot && typeof pilot.getFreeTask === 'function'){
      var pilotTask = pilot.getFreeTask(partName, session[attemptKeyForLevel(session.level)]);
      if(pilotTask) return pilotTask;
    }
    var bp = getBlueprint(session.level) || {};
    var list = partName === 'writing' ? bp.writingTasks : bp.speakingTasks;
    return (list && list[0]) || { level:session.level, title:PART_LABELS[partName], prompt:'Bearbeite die Aufgabe vollständig.', requiredPoints:['Aufgabe vollständig erfüllen'], minWords: partName === 'writing' ? 80 : 50 };
  }

  function defaultGrammarTask(level){
    level = normalizeLevel(level || 'B1');
    if(level === 'B2') return {
      id:'fallback-b2-grammar-hard', variantTitle:'B2 Grammatik · Fallback', title:'Grammatik & Sprachbausteine · B2', durationMinutes:22, intro:'B2-Hardmode prüft Konnektoren, Register, Satzbau und Präzision.', passScore:76,
      questions:[
        {id:'fgb21', skill:'Konnektor', question:'___ digitale Angebote praktisch sind, ersetzen sie nicht jede persönliche Beratung.', options:[['a','Obwohl'],['b','Weil'],['c','Deshalb']], correct:'a', explanation:'Gegensatz mit obwohl.'},
        {id:'fgb22', skill:'Passiv', question:'Die Teilnahmebedingungen ___ vor Kursbeginn verschickt.', options:[['a','werden'],['b','wird'],['c','hat']], correct:'a', explanation:'Plural Passiv Präsens.'},
        {id:'fgb23', skill:'Register', question:'Welche Formulierung ist formell?', options:[['a','Das ist mega schlecht.'],['b','Ich halte diese Regelung für problematisch.'],['c','Gar kein Bock darauf.']], correct:'b', explanation:'Sachliches Register.'},
        {id:'fgb24', skill:'Präposition', question:'Viele Teilnehmende sind ___ eine klare Struktur angewiesen.', options:[['a','auf'],['b','an'],['c','über']], correct:'a', explanation:'angewiesen auf + Akkusativ.'},
        {id:'fgb25', skill:'Konjunktiv II', question:'Es ___ sinnvoll, die Frist zu verlängern.', options:[['a','wäre'],['b','warst'],['c','hatte']], correct:'a', explanation:'Vorsichtige Bewertung mit Konjunktiv II.'}
      ]
    };
    return {
      id:'fallback-b1-grammar-hard', variantTitle:'B1 Grammatik · Fallback', title:'Grammatik & Sprachbausteine · B1', durationMinutes:20, intro:'B1-Hardmode prüft Satzstellung, Konnektoren, Präpositionen und höfliche Formen.', passScore:75,
      questions:[
        {id:'fg1', skill:'Konnektor', question:'Ich kann nicht kommen, ___ ich krank bin.', options:[['a','weil'],['b','deshalb'],['c','trotzdem']], correct:'a', explanation:'Nebensatz mit weil.'},
        {id:'fg2', skill:'Satzstellung', question:'Welche Satzstellung ist korrekt?', options:[['a','Morgen habe ich einen Termin.'],['b','Morgen ich habe einen Termin.'],['c','Ich morgen habe einen Termin.']], correct:'a', explanation:'Verb auf Position 2.'},
        {id:'fg3', skill:'Präposition', question:'Ich interessiere mich ___ den Kurs.', options:[['a','für'],['b','auf'],['c','bei']], correct:'a', explanation:'sich interessieren für.'},
        {id:'fg4', skill:'Höflichkeit', question:'Welche Bitte ist höflich?', options:[['a','Gib Termin!'],['b','Könnten Sie mir bitte einen Termin geben?'],['c','Du machst Termin.']], correct:'b', explanation:'Konjunktiv II + bitte.'},
        {id:'fg5', skill:'Perfekt', question:'Der Zugang ___ nicht funktioniert.', options:[['a','hat'],['b','ist'],['c','wird']], correct:'a', explanation:'funktionieren bildet Perfekt mit haben.'}
      ]
    };
  }
  function getGrammarTask(session){
    var pilot = session ? pilotForLevel(session.level) : null;
    if(pilot && typeof pilot.getGrammarTask === 'function'){
      var g = pilot.getGrammarTask(session[attemptKeyForLevel(session.level)]);
      if(g) return g;
    }
    var part = getPilotPart(session, 'grammar');
    return part || defaultGrammarTask(session && session.level);
  }
  function renderGrammarPart(session){
    var task = getGrammarTask(session);
    var questions = Array.isArray(task.questions) ? task.questions : [];
    var result = session.parts && session.parts.grammar;
    var answers = Object.assign({}, (session.answers && session.answers.grammar && session.answers.grammar.answers) || {});
    var answered = questions.filter(function(q){ return !!answers[q.id]; }).length;
    var qHtml = questions.map(function(q,idx){
      var selected = answers[q.id];
      var opts = (q.options || []).map(function(opt){ var key=opt[0], label=opt[1]; var cls = selected===key ? 'is-selected' : ''; return '<button type="button" class="la-answer-option '+cls+'" data-ui-action="language-exam-objective-answer" data-la-exam-part="grammar" data-la-question-id="'+esc(q.id)+'" data-la-answer="'+esc(key)+'"><span>'+esc(key.toUpperCase())+'</span><b>'+esc(label)+'</b></button>'; }).join('');
      return '<article class="la-exam-question la-grammar-question"><div class="la-question-head"><span>Aufgabe '+esc(idx+1)+'</span><em>'+esc(q.skill || q.type || 'Sprachbaustein')+'</em></div><h4>'+esc(q.question || '')+'</h4><div class="la-answer-grid">'+opts+'</div></article>';
    }).join('');
    return '<section class="la-card la-exam-task la-exam-paper la-grammar-panel"><div class="la-exam-proctor-line"><b>Academy-Hartmodus</b><span>Grammatik zählt als eigener Pflichtblock. Raten reicht nicht.</span></div><span class="la-section-kicker">🧩 '+esc(session.level)+' Grammatik & Sprachbausteine</span><h3>'+esc(task.title || 'Grammatik & Sprachbausteine')+'</h3>'+(task.variantTitle?'<div class="la-exam-pool-badge">'+esc(task.variantTitle)+'</div>':'')+'<p class="la-exam-prompt">'+esc(task.intro || 'Wähle die grammatisch und kommunikativ beste Lösung.')+'</p><div class="la-exam-mini-grid"><div><b>'+esc(questions.length)+'</b><small>Aufgaben</small></div><div><b>'+esc(task.passScore || 75)+'%</b><small>Mindestwert</small></div><div><b>'+esc(answered)+'/'+esc(questions.length)+'</b><small>beantwortet</small></div></div><div class="la-exam-warning"><b>Harte Regel:</b> Grammatik & Sprachbausteine sind kein Bonus. Wer hier stark schwach ist, bekommt im Ergebnis eine echte Prüfungswarnung.</div>'+qHtml+'<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-complete-objective" data-la-exam-part="grammar">Grammatikblock bewerten</button></div>'+scoreBox(result)+'</section>';
  }

  function renderWritingRubric(task, value){
    var rubric = task && task.assessmentRubric;
    var structure = (rubric && rubric.requiredStructure) || task.requiredStructure || ['Betreff/Anlass','formelle Anrede','Problem/Sachverhalt','Folge/Begründung','konkrete Bitte/Forderung','höflicher Abschluss'];
    var lower = String(value || '').toLowerCase();
    var wordsNow = (String(value || '').trim().match(/\b[\wÄÖÜäöüß-]+\b/g) || []).length;
    var subjectHit = /(betreff|beschwerde|anfrage|bitte um|termin|schichttausch|lärm|onlinekurs|rückerstattung|reparatur|entschuldigung)/i.test(lower);
    var greetingHit = /(sehr geehrte|guten tag|hallo|liebe)/i.test(lower);
    var closingHit = /(mit freundlichen grüßen|freundliche grüße|vielen dank|danke|beste grüße|gruß)/i.test(lower);
    var requestHit = /(bitte|ich bitte|ich fordere|lösung|ersatz|rückzahlung|termin|maßnahme|rückmeldung|bestätigung)/i.test(lower);
    var rows = structure.map(function(item){
      var check = /betreff|anlass/i.test(item) ? subjectHit : (/anrede/i.test(item) ? greetingHit : (/abschluss/i.test(item) ? closingHit : (/bitte|forderung|rückfrage|erwartung/i.test(item) ? requestHit : null)));
      return '<li class="'+(check===true?'is-ok':(check===false?'is-risk':''))+'"><span>'+esc(check===true?'✓':(check===false?'!':'•'))+'</span>'+esc(item)+'</li>';
    }).join('');
    return '<div class="la-writing-rubric"><div><b>'+esc((task.level || (task.assessmentRubric && task.assessmentRubric.level) || 'B1'))+'-Schreibcheck hart</b><small>'+esc(wordsNow)+' Wörter · Ziel: '+esc(task.minWords || 110)+'–'+esc(task.maxWords || 180)+'</small></div><ul>'+rows+'</ul><p>Wichtig: Gute Grammatik reicht nicht, wenn Pflichtpunkte, Anlass oder formeller Aufbau fehlen.</p></div>';
  }

  function renderSpeakingRubric(task, value){
    var rubric = task && task.assessmentRubric;
    var structure = (rubric && rubric.requiredSpeechStructure) || task.requiredSpeechStructure || ['Begrüßung/Einstieg','Situation/Grund erklären','konkrete Information','Vorschlag/Lösung/Rückfrage','höflicher Abschluss','zusammenhängende Antwort'];
    var lower = String(value || '').toLowerCase();
    var wordsNow = (String(value || '').trim().match(/\b[\wÄÖÜäöüß-]+\b/g) || []).length;
    var argumentative = Number(task && task.minWords || 0) >= 160 || /argument|vorteil|nachteil|position|fazit|empfehlung|kompromiss/i.test(String((task && task.prompt) || '') + ' ' + structure.join(' '));
    var greetingHit = /(guten tag|hallo|liebe|sehr geehrte|merhaba)/i.test(lower);
    var reasonHit = /(weil|wegen|da |denn|grund|begründ|argument|aufgrund|deshalb|daher|dadurch|folge|problem|leider)/i.test(lower);
    var concreteHit = /(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|uhr|termin|treffpunkt|bestellnummer|lieferdatum|30 minuten|nächste|zum beispiel|beispielsweise|konkret|in meinem alltag|bei der arbeit|ein beispiel)/i.test(lower);
    var requestHit = /(bitte|könnten|würden|möglich|vorschlagen|lösung|ersatz|rückerstattung|tauschen|rückmeldung|bestätigung|frage|empfehlen|empfehlung|kompromiss|sollte)/i.test(lower);
    var closingHit = /(vielen dank|danke|auf wiederhören|freundliche grüße|bis bald|ich freue mich|rückmeldung|fazit|abschließend|zusammenfassend|empfehlung)/i.test(lower);
    var connectedHit = wordsNow >= (task.minWords || 70) && /(weil|deshalb|außerdem|zudem|allerdings|dennoch|andererseits|einerseits|aber|während|obwohl)/i.test(lower);
    var proContraHit = /(vorteil|vorteile|nachteil|nachteile|chance|chancen|risiko|risiken|einerseits|andererseits|dafür|dagegen|kosten|grenzen)/i.test(lower);
    var ownPositionHit = /(meiner meinung|meine meinung|ich bin der meinung|ich halte|ich finde|aus meiner sicht|meines erachtens|ich empfehle|ich würde empfehlen)/i.test(lower);
    var exampleHit = /(zum beispiel|beispielsweise|konkret|in meinem alltag|bei der arbeit|ein beispiel|etwa)/i.test(lower);
    var conclusionHit = /(fazit|abschließend|zusammenfassend|empfehlung|ich empfehle|kompromiss|lösung|daher sollte|deshalb sollte|realistisch wäre)/i.test(lower);
    var rows = structure.map(function(item){
      var check;
      if(argumentative){
        check = /einleitung|themenbezug|thema/i.test(item) ? (wordsNow >= 30) : (/dafür|pro|vorteil|argumente dafür/i.test(item) ? proContraHit : (/dagegen|contra|nachteil|argumente dagegen|grenzen/i.test(item) ? proContraHit : (/position|meinung/i.test(item) ? ownPositionHit : (/beispiel/i.test(item) ? exampleHit : (/fazit|empfehlung|kompromiss|lösung/i.test(item) ? conclusionHit : connectedHit)))));
      }else{
        check = /begrüßung|einstieg/i.test(item) ? greetingHit : (/grund|situation/i.test(item) ? reasonHit : (/konkrete|information/i.test(item) ? concreteHit : (/vorschlag|lösung|rückfrage/i.test(item) ? requestHit : (/abschluss/i.test(item) ? closingHit : (/zusammenhängend/i.test(item) ? connectedHit : null)))));
      }
      return '<li class="'+(check===true?'is-ok':(check===false?'is-risk':''))+'"><span>'+esc(check===true?'✓':(check===false?'!':'•'))+'</span>'+esc(item)+'</li>';
    }).join('');
    var note = argumentative ? 'Wichtig: B2-Sprechen braucht Pro/Contra, eigene Position, Begründung, Beispiel und Fazit. Gute Aussprache allein reicht nicht.' : 'Wichtig: Die KI bewertet erst das bestätigte Transkript. Stichwörter, zu kurze Antworten oder fehlende Gesprächsstruktur werden hart abgewertet.';
    return '<div class="la-writing-rubric la-speaking-rubric"><div><b>'+esc((task.level || (task.assessmentRubric && task.assessmentRubric.level) || 'B1'))+'-Sprechcheck hart</b><small>'+esc(wordsNow)+' Wörter · Ziel: '+esc(task.minWords || 75)+'–'+esc(task.maxWords || 190)+'</small></div><ul>'+rows+'</ul><p>'+esc(note)+'</p></div>';
  }

  function renderFreePart(session, partName){
    var task = currentTask(session, partName);
    var value = (session.answers && session.answers[partName]) || '';
    var result = session.parts && session.parts[partName];
    var isSpeaking = partName === 'speaking';
    var meta = [];
    if(task.minWords) meta.push('mind. '+task.minWords+' Wörter');
    if(task.maxWords) meta.push('max. '+task.maxWords+' Wörter');
    if(task.prepSeconds) meta.push(task.prepSeconds+' Sek. Vorbereitung');
    if(task.responseSeconds) meta.push(task.responseSeconds+' Sek. Antwortzeit');
    var hardHints = Array.isArray(task.hardFailHints) && task.hardFailHints.length ? '<div class="la-exam-warning"><b>Harte Regeln:</b><ul>'+task.hardFailHints.map(function(h){ return '<li>'+esc(h)+'</li>'; }).join('')+'</ul></div>' : '';
    var writingRubric = !isSpeaking ? renderWritingRubric(task, value) : '';
    var speakingRubric = isSpeaking ? renderSpeakingRubric(task, value) : '';
    return '<section class="la-card la-exam-task la-exam-paper" data-la-exam-free="'+esc(partName)+'"><div class="la-exam-proctor-line"><b>Prüfungsmodus</b><span>Antwort vollständig formulieren. Stichpunkte werden hart abgewertet.</span></div><span class="la-section-kicker">'+esc(PART_LABELS[partName])+' · '+esc(isSpeaking ? ((task.level || session.level || 'B1') + ' Sprechprüfung hart') : ((task.level || session.level || 'B1') + ' Schreibprüfung hart'))+'</span><h3>'+esc(task.title || PART_LABELS[partName])+'</h3>'+(task.variantTitle?'<div class="la-exam-pool-badge">'+esc(task.variantTitle)+'</div>':'')+(meta.length?'<div class="la-exam-mini-grid"><div><b>'+esc(meta[0]||'streng')+'</b><small>Vorgabe</small></div><div><b>'+esc(meta[1]||session.level||'B1')+'</b><small>Rahmen</small></div><div><b>'+esc(meta[2]||'bewertet')+'</b><small>Prüfung</small></div></div>':'')+'<p class="la-exam-prompt">'+esc(task.prompt || '')+'</p>'+writingRubric+speakingRubric+'<div class="la-exam-required"><b>Pflichtpunkte:</b><ul>'+((task.requiredPoints||[]).map(function(p){return '<li>'+esc(p)+'</li>';}).join(''))+'</ul></div>' + hardHints +
      (isSpeaking ? '<div class="la-exam-warning"><b>iPhone/iPad-Safe-Mode:</b> Sprich frei, lies dein Transkript kritisch und korrigiere es vor der Bewertung. Die KI bewertet nur dein bestätigtes Transkript. Zu kurze Antworten, Stichwörter und fehlende Gesprächsstruktur werden hart gedeckelt.</div>' : '<div class="la-exam-warning"><b>Schreiben hart:</b> Groq bewertet als strenger '+esc(task.level || session.level || 'B1')+'-Schreibprüfer. Thema, Pflichtpunkte, formeller Aufbau, Betreff/Anlass, Register und Kohärenz zählen. Zu kurze oder nur höfliche, aber inhaltsarme Texte werden gedeckelt.</div>') +
      '<label class="la-exam-textarea-label"><span>'+esc(isSpeaking ? 'Bestätigtes Transkript / zusammenhängende Sprechantwort' : 'Schriftliche Antwort mit formellem Aufbau')+'</span><textarea data-la-exam-answer="'+esc(partName)+'" rows="10" placeholder="Sprechen B2: Einleitung, Pro/Contra, eigene Position, Begründung, Beispiel, Fazit/Empfehlung. Schreiben: Betreff/Anlass, Anrede, Problem, Folge, Bitte, Abschluss …">'+esc(value)+'</textarea></label>' +
      '<div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-local-check" data-la-exam-part="'+esc(partName)+'">Lokale Vorprüfung</button><button type="button" class="la-primary" data-ui-action="language-exam-hybrid-check" data-la-exam-part="'+esc(partName)+'">Mit Groq-Prüfungslehrer bewerten</button></div>' + scoreBox(result) + '</section>';
  }
  function scoreBox(result){
    if(!result) return '<div class="la-exam-score is-empty"><b>Noch nicht bewertet</b><small>Bearbeite diesen Prüfungsteil und starte die Bewertung.</small></div>';
    var score = typeof result.overallScore === 'number' ? result.overallScore : result.score;
    var passed = result.passed === true || result.passedLocal === true;
    var reasons = result.hardFailReasons || result.capReasons || [];
    var aiInfo = result.aiError ? '<small class="is-warning">Groq nicht erreichbar: '+esc(result.aiError)+'</small>' : '';
    var details = result.local ? '<small>Lokal: '+esc(result.local.score)+'% · KI-Gewicht: '+esc(Math.round(((result.weights&&result.weights.ai)||0)*100))+'%</small>' : '';
    return '<div class="la-exam-score '+(passed?'is-pass':'is-fail')+'"><b>'+esc(score || 0)+'% · '+esc(passed ? 'bestanden' : 'nicht bestanden')+'</b><small>'+esc(result.readiness || (passed?'realistische Chancen':'noch nicht prüfungsbereit'))+'</small>'+details+aiInfo+(reasons.length?'<ul>'+reasons.map(function(r){return '<li>'+esc(r)+'</li>';}).join('')+'</ul>':'')+'</div>';
  }
  function renderCurrentPart(session){
    if(session.currentPart === 'reading') return renderObjectivePart(session,'reading');
    if(session.currentPart === 'listening') return renderObjectivePart(session,'listening');
    if(session.currentPart === 'grammar') return renderGrammarPart(session);
    if(session.currentPart === 'writing') return renderFreePart(session,'writing');
    return renderFreePart(session,'speaking');
  }
  function pctBar(score){
    var value = Math.max(0, Math.min(100, Number(score || 0)));
    return '<div class="la-exam-progress"><span style="width:'+esc(value)+'%"></span></div>';
  }
  function listHtml(items, emptyText){
    items = Array.isArray(items) ? items : [];
    if(!items.length) return '<p class="la-note">'+esc(emptyText || 'Keine Einträge.')+'</p>';
    return '<ul>'+items.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('')+'</ul>';
  }
  function partStatusLabel(item){
    if(!item || item.score == null) return 'offen';
    if(item.passed) return 'bestanden';
    if(item.score < item.minScore) return 'unter Mindestleistung';
    return 'kritisch';
  }
  function renderResult(session){
    var final = session.final || (engine() && engine().computeFinal ? engine().computeFinal(session) : null);
    if(!final) return '';
    var parts = Array.isArray(final.partBreakdown) ? final.partBreakdown : PARTS.map(function(p){
      var r = session.parts && session.parts[p];
      return { part:p, label:PART_LABELS[p], score:r ? (r.overallScore || r.score || 0) : null, minScore:55, passed:!!(r && (r.passed || r.passedLocal)), status:r?'bewertet':'offen', hardFailReasons:[], missingPoints:[] };
    });
    var rows = parts.map(function(item){
      var scoreText = item.score == null ? 'offen' : item.score + '%';
      var cls = item.passed ? 'is-pass' : (item.score == null ? 'is-open' : 'is-fail');
      var issues = (item.hardFailReasons || []).concat(item.missingPoints || []).slice(0, 3);
      return '<tr class="'+cls+'"><td><b>'+esc(item.label || PART_LABELS[item.part] || item.part)+'</b></td><td>'+esc(scoreText)+'<small> Mindestwert: '+esc(item.minScore || '—')+'%</small>'+pctBar(item.score || 0)+'</td><td>'+esc(partStatusLabel(item))+'</td><td>'+(issues.length ? issues.map(function(x){ return '<small>• '+esc(x)+'</small>'; }).join('') : '<small>Keine kritischen Hinweise.</small>')+'</td></tr>';
    }).join('');
    var probability = final.readinessProbability == null ? 0 : final.readinessProbability;
    var finalCls = final.passed ? 'is-pass' : 'is-fail';
    return '<section class="la-card la-exam-final '+finalCls+'">' +
      '<span class="la-section-kicker">Strenger Ergebnisbericht · Phase 38E.5</span>' +
      '<h3>'+esc(final.passed?'Bestanden':'Nicht bestanden')+' · '+esc(final.overallScore)+'%</h3>' +
      '<div class="la-exam-verdict"><b>Prüfungsreife: '+esc(final.readiness)+'</b><small>'+esc(final.readinessVerdict || '')+'</small>'+pctBar(probability)+'</div>' +
      '<div class="la-exam-mini-grid"><div><b>'+esc(final.completedParts)+'/'+esc(final.totalParts || PARTS.length)+'</b><small>Teile abgeschlossen</small></div><div><b>'+esc(final.passScore)+'%</b><small>Bestehensgrenze</small></div><div><b>'+esc(probability)+'%</b><small>realistische Prognose</small></div></div>' +
      '<div class="la-exam-teacher-summary"><b>Prüferkommentar</b><p>'+esc(final.teacherSummary || '')+'</p></div>' +
      '<div class="la-exam-table-scroll" role="region" aria-label="B2 Ergebnisübersicht"><table class="la-table la-exam-result-table"><thead><tr><th>Teil</th><th>Punkte</th><th>Status</th><th>Hinweise</th></tr></thead><tbody>'+rows+'</tbody></table></div>' +
      '<div class="la-exam-report-grid"><div class="la-exam-report-box is-critical"><h4>Kritische Schwächen</h4>'+listHtml(final.criticalWeaknesses, 'Keine kritischen Schwächen erkannt.')+'</div><div class="la-exam-report-box is-strength"><h4>Stärken</h4>'+listHtml(final.strengths, 'Noch keine stabilen Stärken erkannt.')+'</div></div>' +
      weaknessProfileHtml(session.level, { level:session.level, overallScore:final.overallScore, passed:final.passed, completedParts:final.completedParts, partScores:parts.reduce(function(map,item){ map[item.part] = Number(item.score || 0); return map; }, {}) }) +
      '<div class="la-exam-report-box is-next"><h4>Konkrete Wiederholungsempfehlung</h4>'+listHtml(final.recommendations, 'Weitere Simulation durchführen.')+'<p class="la-note"><b>Nächster Schritt:</b> '+esc(final.nextRequiredAction || '')+'</p></div>' +
      '<div class="la-exam-warning"><b>Rechtlicher Hinweis:</b> '+esc(final.certificateNote || 'Dies ist eine interne Prüfungssimulation und kein offizielles Sprachzertifikat.')+'</div>' +
      '<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-reset">Neue Simulation</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Zurück zum Kurs</button></div>' +
      '</section>';
  }
  function renderSession(session){
    session = saveSession(session || loadSession() || defaultSession('B1'));
    var allDone = PARTS.every(function(p){ return !!(session.parts && session.parts[p]); });
    if(allDone && engine() && engine().computeFinal){ session.final = engine().computeFinal(session); saveSession(session); archiveFinalAttempt(session); }
    var body = '<div class="la-dashboard la-exam-shell" data-la-exam-shell="phase38e5" data-la-exam-level="'+esc(session.level)+'">' +
      examHeader(session) + (session.status === 'training' ? trainingModeBanner(session) : examPressureBar(session)) + renderCurrentPart(session) + (allDone ? renderResult(session) : '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-prev-part">Vorheriger Teil</button><button type="button" class="la-primary" data-ui-action="language-exam-next-part">Nächster Teil</button><button type="button" class="la-secondary" data-ui-action="language-exam-home">Prüfungsübersicht</button></div></section>') + '</div>';
    var opened = openSheet(session.level + ' Prüfung', 'Teilnavigation, Bewertung und Ergebnisbericht.', body, '🎓');
    setTimeout(function(){ bindInputs(); startVisualTimers(); }, 0);
    return opened;
  }
  function start(level){
    var session = defaultSession(level);
    session.status = 'running';
    session.currentPart = 'reading';
    return renderSession(saveSession(session));
  }
  function resume(){ return renderSession(loadSession() || defaultSession('B1')); }
  function setPart(part){
    var session = loadSession() || defaultSession('B1');
    if(PARTS.indexOf(part) >= 0){ session.currentPart = part; session.partStartedAt = Object.assign({}, session.partStartedAt || {}); if(!session.partStartedAt[part]) session.partStartedAt[part] = nowIso(); saveSession(session); }
    return renderSession(session);
  }
  function move(delta){
    var session = loadSession() || defaultSession('B1');
    var idx = Math.max(0, PARTS.indexOf(session.currentPart));
    idx = Math.max(0, Math.min(PARTS.length - 1, idx + delta));
    session.currentPart = PARTS[idx];
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    if(!session.partStartedAt[session.currentPart]) session.partStartedAt[session.currentPart] = nowIso();
    return renderSession(saveSession(session));
  }
  function bindInputs(){
    document.querySelectorAll('[data-la-mini-answer]').forEach(function(input){
      if(input.getAttribute('data-la-bound') === '1') return;
      input.setAttribute('data-la-bound','1');
      input.addEventListener('input',function(){
        var idx = input.getAttribute('data-la-mini-answer');
        var session = loadSession() || defaultSession('B2');
        if(!session.trainingFocus) return;
        session.trainingFocus.miniAnswers = Object.assign({}, session.trainingFocus.miniAnswers || {});
        session.trainingFocus.miniAnswers[idx] = input.value;
        session.trainingFocus.miniProgress = null;
        saveTrainingState(session);
        saveSession(session);
      });
    });
    document.querySelectorAll('[data-la-mini-check]').forEach(function(input){
      if(input.getAttribute('data-la-bound') === '1') return;
      input.setAttribute('data-la-bound','1');
      input.addEventListener('change',function(){
        var idx = input.getAttribute('data-la-mini-check');
        var cidx = Number(input.getAttribute('data-la-mini-check-index') || 0);
        var session = loadSession() || defaultSession('B2');
        if(!session.trainingFocus) return;
        session.trainingFocus.miniChecks = Object.assign({}, session.trainingFocus.miniChecks || {});
        var arr = Array.isArray(session.trainingFocus.miniChecks[idx]) ? session.trainingFocus.miniChecks[idx].slice() : [];
        if(input.checked && arr.indexOf(cidx) < 0) arr.push(cidx);
        if(!input.checked) arr = arr.filter(function(x){ return x !== cidx; });
        session.trainingFocus.miniChecks[idx] = arr;
        session.trainingFocus.miniProgress = null;
        saveTrainingState(session);
        saveSession(session);
      });
    });
    document.querySelectorAll('[data-la-exam-answer]').forEach(function(input){
      if(input.getAttribute('data-la-bound') === '1') return;
      input.setAttribute('data-la-bound','1');
      input.addEventListener('input',function(){
        var part = input.getAttribute('data-la-exam-answer');
        var session = loadSession() || defaultSession('B1');
        session.answers[part] = input.value;
        saveSession(session);
      });
    });
  }
  function completeObjective(part){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, part);
    if(part === 'listening'){
      var lst = listeningState(session, pilot);
      if(!lst || lst.plays <= 0){
        session.parts[part] = { part:part, mode:'b1-listening-locked', passed:false, overallScore:0, score:0, readiness:'Hörteil nicht prüfungsnah bearbeitet', hardFailReasons:['Der Hörtext wurde noch nicht abgespielt. In der realistischen Hörprüfung müssen die Fragen nach dem Hören beantwortet werden.'], generatedAt:nowIso() };
        return renderSession(saveSession(session));
      }
    }
    var questions = pilot && Array.isArray(pilot.questions) ? pilot.questions : null;
    var selectedMap = session.answers && session.answers[part] && session.answers[part].answers ? session.answers[part].answers : {};
    if(questions && questions.length){
      var correctCount = questions.filter(function(q){ return selectedMap[q.id] === q.correct; }).length;
      var answeredCount = questions.filter(function(q){ return !!selectedMap[q.id]; }).length;
      var score = Math.round((correctCount / questions.length) * 100);
      if(answeredCount < questions.length){ score = Math.min(score, Math.round((answeredCount / questions.length) * 70)); }
      var listeningMeta = part === 'listening' ? listeningState(session, pilot) : null;
      var helperPenalty = listeningMeta && (listeningMeta.helperMode || listeningMeta.strictAudio === false || listeningMeta.audioMode === 'transcript-helper');
      if(helperPenalty){ score = Math.min(score, 84); }
      var min = Number(pilot.passScore || 70);
      var timeState = partTimeState(session, part);
      session.partCompletedAt = Object.assign({}, session.partCompletedAt || {});
      session.partCompletedAt[part] = nowIso();
      session.parts[part] = {
        part:part, mode:part === 'listening' ? 'academy-hard-listening-final' : (part === 'grammar' ? 'academy-hard-grammar-language-elements' : 'academy-hard-objective'), timedOut: timeState.remaining <= 0, passed:score >= min && answeredCount === questions.length && timeState.remaining > 0,
        overallScore:score, score:score, correctCount:correctCount, totalQuestions:questions.length, answeredCount:answeredCount,
        helperMode:!!helperPenalty,
        audioMode:listeningMeta ? listeningMeta.audioMode : null,
        readiness: score >= min && answeredCount === questions.length ? (part === 'grammar' ? 'Grammatik & Sprachbausteine bestanden' : (helperPenalty ? 'Hörteil im Hilfsmodus bestanden · nicht ganz streng' : 'Objektiver '+session.level+'-Teil bestanden')) : session.level+'-Teil noch nicht prüfungsreif',
        hardFailReasons: (score >= min && answeredCount === questions.length && timeState.remaining > 0) ? (helperPenalty ? ['Hinweis: Transkript-/Audio-Hilfsmodus wurde genutzt. Für maximale Prüfungsnähe später ohne Hilfsmodus wiederholen.'] : []) : [session.level+'-Mindestleistung nicht erreicht, nicht alle Fragen beantwortet oder Zeit rechnerisch überschritten.'],
        generatedAt:nowIso()
      };
      return renderSession(saveSession(session));
    }
    var ans = session.answers && session.answers[part] && session.answers[part].answer;
    var correct = part === 'reading' ? 'a' : 'b';
    var fallbackScore = ans === correct ? 100 : (ans ? 20 : 0);
    var bp = getBlueprint(session.level) || {};
    var fallbackMin = (bp.parts && bp.parts[part] && bp.parts[part].minScore) || bp.partMinScore || 55;
    var fallbackTimeState = partTimeState(session, part); session.partCompletedAt = Object.assign({}, session.partCompletedAt || {}); session.partCompletedAt[part] = nowIso();
    session.parts[part] = { part:part, timedOut:fallbackTimeState.remaining <= 0, passed:fallbackScore >= fallbackMin && fallbackTimeState.remaining > 0, overallScore:fallbackScore, score:fallbackScore, readiness: fallbackScore >= fallbackMin ? 'Objektiver Teil bestanden' : 'Objektiver Teil schwach', hardFailReasons: fallbackScore >= fallbackMin ? [] : ['Antwort falsch oder nicht beantwortet.'], generatedAt:nowIso() };
    return renderSession(saveSession(session));
  }
  function setObjectiveAnswer(part, answer, questionId){
    var session = loadSession() || defaultSession('B1');
    var current = Object.assign({ answers:{} }, session.answers[part] || {});
    if(questionId){ current.answers[questionId] = answer; }
    else { current.answer = answer; }
    session.answers[part] = current;
    return renderSession(saveSession(session));
  }
  async function assessFree(part, hybrid){
    var session = loadSession() || defaultSession('B1');
    var text = session.answers && session.answers[part] ? session.answers[part] : '';
    var task = currentTask(session, part);
    try{
      if(part === 'speaking' && hybrid && engine() && engine().assessSpeakingExam){
        session.parts[part] = await engine().assessSpeakingExam({ level:session.level, task:task, userText:text });
      }else if(part === 'writing' && hybrid && engine() && engine().assessWritingExam){
        session.parts[part] = await engine().assessWritingExam({ level:session.level, task:task, userText:text });
      }else if(engine() && engine().localAssessResponse){
        var local = engine().localAssessResponse({ level:session.level, part:part, task:task, userText:text });
        session.parts[part] = Object.assign({}, local, { overallScore:local.score, passed:local.passedLocal, readiness:local.passedLocal?'lokal bestanden':'lokal nicht bestanden' });
      }else{
        session.parts[part] = { part:part, overallScore:0, passed:false, hardFailReasons:['Prüfungsengine nicht geladen.'] };
      }
    }catch(error){
      var fallback = engine() && engine().localAssessResponse ? engine().localAssessResponse({ level:session.level, part:part, task:task, userText:text }) : { score:0, passedLocal:false };
      session.parts[part] = Object.assign({}, fallback, { overallScore:fallback.score || 0, passed:!!fallback.passedLocal, aiError:error && error.message ? error.message : String(error), readiness:'lokaler Fallback' });
    }
    var tsFree = partTimeState(session, part);
    session.partCompletedAt = Object.assign({}, session.partCompletedAt || {});
    session.partCompletedAt[part] = nowIso();
    if(session.parts && session.parts[part]){
      session.parts[part].timedOut = tsFree.remaining <= 0;
      if(tsFree.remaining <= 0){
        session.parts[part].passed = false;
        session.parts[part].hardFailReasons = (session.parts[part].hardFailReasons || []).concat(['Zeit rechnerisch überschritten.']);
        session.parts[part].readiness = 'Zeit überschritten · nicht prüfungsreif';
      }
    }
    return renderSession(saveSession(session));
  }
  function startVisualTimers(){
    document.querySelectorAll('[data-la-exam-timer]').forEach(function(node){
      var start = isoMs(node.getAttribute('data-la-exam-start'));
      var total = Number(node.getAttribute('data-la-exam-total') || 0);
      var elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
      var remaining = Math.max(0, total - elapsed);
      node.textContent = formatSeconds(remaining);
      var bar = document.querySelector('[data-la-exam-timebar]');
      if(bar){ bar.style.width = clamp(Math.round((remaining / Math.max(1,total)) * 100), 0, 100) + '%'; }
      var root = document.querySelector('[data-la-exam-timer-root]');
      if(root){
        root.classList.toggle('is-danger', remaining <= Math.round(total * 0.15));
        root.classList.toggle('is-warning', remaining > Math.round(total * 0.15) && remaining <= Math.round(total * 0.35));
      }
    });
  }
  setInterval(startVisualTimers, 1000);
  function diagnostics(){
    return { ok:!!(engine() && blueprints()), phase:'38E.5', version:VERSION, hasEngine:!!engine(), hasBlueprints:!!blueprints(), routes:['language-exam-open','language-exam-start','language-exam-hybrid-check','language-exam-dashboard'], levels:levelList(), storageKey:STORAGE_KEY, features:['visible exam shell','level selection','part navigation','B1 hard reading pool','B1 hard listening pool','B1 writing task pool','B1 speaking task pool','Groq examiner for free answers','strict final report','readiness prognosis','critical weakness report','repeat recommendations','no exam release gate','B1 expanded pool','hard edge case detection','visual exam pressure','countdown timer','completion status strip','mobile exam layout','realistic listening mode','browser tts playback','listening repeat limit','locked answers before listening','hidden transcript','strict b1 writing rubric','formal structure checklist','subject reason check','writing hard caps','strict b1 speaking rubric','speaking structure checklist','confirmed transcript mode','speaking hard caps','B1 full exam QA scenarios','pass/fail regression test','Groq fallback validation','incomplete exam validation','B2 exam architecture active','B2 hard reading pool active','B2 hard listening pool active','B2 hard grammar pool active','B2 hard writing pool active','B2 hard speaking pool active','B2 speaking 8 variants','B2 speaking 180-350 words','B2 speaking example hard cap','B2 speaking own-position hard cap','B2 writing formal complaint','B2 writing argumentative essay','B2 writing strict word count','B2 writing register hard caps','B2 grammar nominalization','B2 grammar passive reported speech','B2 grammar register correction','B2 grammar sentence order','B2 listening speaker attitude','B2 listening indirect criticism','B2 listening conditions and constraints','level difficulty matrix','A1 vs B2 differentiation guarantee','dynamic examiner profile per level','level-specific hard caps','B2 reading author intent','B2 reading indirect meaning','B2 reading hard distractors','B2 reading/listening/writing/speaking starter pool','B2 argumentation requirements','B2 strict Groq examiner','listening final helper mode','audio fallback marking','transcript helper mode','listening source validation','grammar language elements required block','B1/B2 grammar pool','five-part hardmode exam','B1 hardmode total QA','grammar required in final QA','B2 full exam QA scenarios','B2 endsimulation matrix','B2 hardmode total regression','B2 all five parts validation','B2 incomplete part fail validation','B2 Groq fallback regression','B2 helper listening marking','B2 A1/B1 answer rejection','listening helper mode marked in final QA','B2 visual device QA','desktop ipad iphone viewport simulation','result table scroll guard','touch target guard','deployment cache validation','service worker network-first deployment check','exam dashboard overview','A1-B2 learning status comparison','attempt history archive','next-step recommendation matrix','level requirement comparison cards','weakness profile','part-specific training paths','critical-borderline-stable bands','result-linked training plan','dashboard learning details','weakness profile direct training start','focused training session','training mode banner','training completion route','part-specific training launch buttons','real mini exercise sets per weakness','mini training set renderer','reading listening grammar writing speaking mini drills','pattern solution and checklist per mini task','mini training evaluation','mini task answer persistence','local training progress history','dashboard training progress summary' ] };
  }
  function handleClick(ev){
    var btn = ev.target && ev.target.closest && ev.target.closest('[data-ui-action]');
    if(!btn) return false;
    var action = btn.getAttribute('data-ui-action') || '';
    if(action.indexOf('language-exam-') !== 0) return false;
    if(btn.getAttribute('aria-disabled') === 'true'){ ev.preventDefault(); ev.stopPropagation(); return true; }
    ev.preventDefault(); ev.stopPropagation();
    if(action === 'language-exam-open' || action === 'language-exam-home') return renderHome();
    if(action === 'language-exam-start') return start(btn.getAttribute('data-la-exam-level') || 'B1');
    if(action === 'language-exam-training-start') return startTraining(btn.getAttribute('data-la-training-level') || btn.getAttribute('data-la-exam-level') || 'B2', btn.getAttribute('data-la-training-part') || 'grammar');
    if(action === 'language-exam-training-finish') return finishTraining();
    if(action === 'language-exam-mini-evaluate'){ var ms = loadSession() || defaultSession('B2'); if(ms.trainingFocus){ ms.trainingFocus.miniProgress = evaluateMiniTraining(ms); saveTrainingState(ms); return renderSession(saveSession(ms)); } return renderSession(ms); }
    if(action === 'language-exam-mini-reset'){ var rs = loadSession() || defaultSession('B2'); if(rs.trainingFocus){ rs.trainingFocus.miniAnswers = {}; rs.trainingFocus.miniChecks = {}; rs.trainingFocus.miniProgress = null; saveTrainingState(rs); return renderSession(saveSession(rs)); } return renderSession(rs); }
    if(action === 'language-exam-resume') return resume();
    if(action === 'language-exam-reset'){ clearSession(); return renderHome(); }
    if(action === 'language-exam-open-part') return setPart(btn.getAttribute('data-la-exam-part') || 'reading');
    if(action === 'language-exam-prev-part') return move(-1);
    if(action === 'language-exam-next-part') return move(1);
    if(action === 'language-exam-objective-answer') return setObjectiveAnswer(btn.getAttribute('data-la-exam-part') || 'reading', btn.getAttribute('data-la-answer') || '', btn.getAttribute('data-la-question-id') || '');
    if(action === 'language-exam-play-listening') return playListening(btn);
    if(action === 'language-exam-reveal-listening') return revealListening();
    if(action === 'language-exam-complete-objective') return completeObjective(btn.getAttribute('data-la-exam-part') || 'reading');
    if(action === 'language-exam-local-check') return assessFree(btn.getAttribute('data-la-exam-part') || 'writing', false);
    if(action === 'language-exam-hybrid-check') return assessFree(btn.getAttribute('data-la-exam-part') || 'speaking', true);
    return true;
  }

  window.LanguageExamShell = Object.freeze({
    __version:VERSION,
    open:renderHome,
    start:start,
    resume:resume,
    summaryCardHtml:summaryCardHtml,
    diagnostics:diagnostics,
    loadSession:loadSession,
    clearSession:clearSession,
    dashboardHtml:dashboardHtml,
    buildWeaknessProfile:buildWeaknessProfile,
    weaknessProfileHtml:weaknessProfileHtml,
    loadHistory:loadHistory,
    startTraining:startTraining,
    trainingModeBanner:trainingModeBanner,
    miniTrainingSetFor:miniTrainingSetFor,
    miniTrainingSetHtml:miniTrainingSetHtml,
    evaluateMiniTraining:evaluateMiniTraining,
    loadTrainingProgress:loadTrainingProgress,
    trainingProgressSummaryHtml:trainingProgressSummaryHtml
  });

  document.addEventListener('click', handleClick, true);
  document.addEventListener('change', bindInputs, true);
})();
