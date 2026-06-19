/* Language Academy · Phase 38C.12A
   Academy-Hartmodus UX-Reparatur: Kontrast, Fenstergröße und Scroll-Verhältnis korrigiert.
   B1 bleibt harte Vorlage, B2-Pilot bleibt erhalten; es gibt keine einfache Standard-Simulation. */
(function(){
  'use strict';

  var VERSION = 'G54.38C.12A-academy-hardmode-ux-fix';
  var STORAGE_KEY = 'language-academy-exam-shell-session-v10-hardmode-ux-fix';
  var PARTS = ['reading','listening','writing','speaking'];
  var PART_LABELS = { reading:'Lesen', listening:'Hören', writing:'Schreiben', speaking:'Sprechen' };
  var PART_ICONS = { reading:'📖', listening:'🎧', writing:'✍️', speaking:'🎤' };

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
      answers:{ reading:{}, listening:{}, writing:'', speaking:'' },
      listeningAudio:{},
      transcriptConfirmed:false,
      parts:{ reading:null, listening:null, writing:null, speaking:null },
      final:null,
      partStartedAt:{ reading:nowIso() },
      partCompletedAt:{ reading:null, listening:null, writing:null, speaking:null },
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
    session.answers = Object.assign({ reading:{}, listening:{}, writing:'', speaking:'' }, session.answers || {});
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    session.parts = Object.assign({ reading:null, listening:null, writing:null, speaking:null }, session.parts || {});
    session.partOrder = PARTS.slice();
    session.partStartedAt = Object.assign({}, session.partStartedAt || {});
    session.partCompletedAt = Object.assign({ reading:null, listening:null, writing:null, speaking:null }, session.partCompletedAt || {});
    session.examWarnings = Array.isArray(session.examWarnings) ? session.examWarnings : [];
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
    return '<section class="la-card la-exam-entry-card" data-la-exam-entry="phase38c12a">' +
      '<div class="la-exam-entry-head"><span class="la-section-kicker">Academy-Hartmodus</span><em>Phase 38C.12A</em></div>' +
      '<h3>Academy-Hartmodus A1 bis C2 · bewusst strenger als Standardprüfungen</h3>' +
      '<p class="la-note">Diese Simulation ist absichtlich härter als typische Standardprüfungen. Wer sie stabil besteht, soll echte Prüfungen mit Reserve angehen können. Groq wird gezielt als strenger Prüfungslehrer für Schreiben und Sprechen genutzt; Lesen und Hören bleiben lokal stabil auswertbar. B1 ist als harte Vorlage stabilisiert, B2-Pilotdaten bleiben erhalten.</p>' +
      '<div class="la-exam-mini-grid"><div><b>Hard</b><small>kein einfacher Standardmodus</small></div><div><b>Timer</b><small>Prüfungsdruck</small></div><div><b>streng</b><small>Bewertung mit Punktdeckelung</small></div></div>' +
      '<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-open">Academy-Hartmodus öffnen</button><button type="button" class="la-secondary" data-ui-action="language-exam-open" data-la-exam-resume="1">Fortsetzen</button></div>' +
    '</section>';
  }
  function levelCard(level){
    var bp = getBlueprint(level) || {};
    var parts = bp.parts || {};
    var duration = PARTS.reduce(function(sum,p){ return sum + Number((parts[p] && parts[p].durationMinutes) || 0); }, 0);
    var strict = level === 'C1' || level === 'C2' ? 'sehr streng' : (level === 'B1' || level === 'B2' ? 'streng' : 'grundlegend');
    return '<button type="button" class="la-exam-level-card" data-ui-action="language-exam-start" data-la-exam-level="'+esc(level)+'">' +
      '<span>'+esc(level)+'</span><b>'+esc(bp.description || 'Prüfungssimulation')+'</b>' +
      '<small>'+esc(duration || '—')+' Min · Bestehen ab '+esc(bp.passScore || 70)+'% · '+esc(strict)+'</small>' +
    '</button>';
  }
  function renderHome(){
    var existing = loadSession();
    var body = '<div class="la-dashboard la-exam-shell" data-la-exam-shell="phase38c12a">' +
      '<section class="la-card la-exam-hero"><span class="la-section-kicker">Academy-Hartmodus</span><h3>Bewusst härter als Standardprüfungen</h3><p>Es gibt keinen einfachen Standardmodus mehr. Dieser Trainer prüft mit Reserve: Mindestleistung, Pflichtpunkte, Themenbezug, Zeitdruck, Punktdeckelung und Prüfungsreife. Ziel: Wer diese Simulation stabil besteht, hat realistische Chancen, echte Prüfungen deutlich sicherer anzugehen. B1 ist hart stabilisiert; B2 bleibt als Pilotarchitektur erhalten.</p><div class="la-exam-warning"><b>Wichtig:</b> Kein offizielles Zertifikat und keine Garantie. Es ist eine harte interne Vorbereitungssimulation mit bewusst höherer Messlatte.</div></section>' +
      (existing ? '<section class="la-card la-exam-active"><span class="la-section-kicker">Aktiver Versuch</span><h3>'+esc(existing.level)+' Prüfung fortsetzen</h3><p>Aktueller Teil: <b>'+esc(PART_LABELS[existing.currentPart] || existing.currentPart)+'</b> · Status: '+esc(existing.status)+'</p><div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-resume">Fortsetzen</button><button type="button" class="la-secondary" data-ui-action="language-exam-reset">Neuen Versuch starten</button></div></section>' : '') +
      '<section class="la-card"><span class="la-section-kicker">Niveau wählen</span><h3>Welche Prüfung willst du simulieren?</h3><div class="la-exam-level-grid">'+levelList().map(levelCard).join('')+'</div></section>' +
      '<section class="la-card"><span class="la-section-kicker">Bewertungsprinzip</span><div class="la-exam-rubric-grid"><div><b>Lesen/Hören</b><small>lokal, objektiv, zeitlich geführt</small></div><div><b>Schreiben/Sprechen</b><small>lokal + Groq-Mitprüfer</small></div><div><b>Prüfungsdruck</b><small>Timer, Status, Warnungen</small></div></div></section>' +
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
    return '<section class="la-card la-exam-session-head"><span class="la-section-kicker">'+esc(session.level)+' Prüfungssimulation</span><h3>'+esc(PART_ICONS[current])+' '+esc(PART_LABELS[current])+'</h3><p>'+esc(bp.description || 'Prüfungsmodus')+'</p><div class="la-exam-mini-grid"><div><b>'+esc(part.durationMinutes || '—')+'</b><small>Minuten</small></div><div><b>'+esc(part.minScore || bp.partMinScore || '—')+'%</b><small>Mindestteil</small></div><div><b>'+esc(bp.passScore || 70)+'%</b><small>Bestehen</small></div></div><div class="la-exam-status-strip"><span>Automatisch gespeichert</span><span>Keine Hilfe im Prüfungsmodus</span><span>Pflichtpunkte zählen hart</span></div>'+partNav(session)+'</section>';
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
    return Object.assign({ key:key, plays:0, revealed:false, lastPlayedAt:null, locked:false }, all[key] || {});
  }
  function defaultListeningTexts(level){
    level = normalizeLevel(level || 'B1');
    if(level === 'B2'){
      return [
        { title:'Interview Weiterbildung', body:'Moderatorin: Viele Betriebe bieten Onlineweiterbildungen an. Expertin: Das ist hilfreich, reicht aber allein nicht aus. Mitarbeitende brauchen feste Lernzeiten, klare Ziele und Rückmeldung, sonst bleibt der Erfolg zufällig.' },
        { title:'Kurze Radiomeldung', body:'In der Stadt werden Buslinien erweitert. Einige Geschäftsleute befürchten weniger Kundschaft, während die Verwaltung weniger Verkehr und bessere Luft erwartet. Entscheidend seien gute Alternativen für alle Gruppen.' }
      ];
    }
    return [
      { title:'Durchsage im Bürgerbüro', body:'Wegen einer technischen Störung können heute keine neuen Ausweise beantragt werden. Fertige Ausweise können am Schalter drei abgeholt werden. Ersatztermine werden automatisch per E-Mail verschickt.' },
      { title:'Telefonnotiz der Arztpraxis', body:'Ihr Termin am Dienstag um neun Uhr muss verschoben werden. Wir bieten Ihnen Freitag um fünfzehn Uhr an. Bitte rufen Sie bis morgen zwölf Uhr zurück, wenn der Termin nicht passt.' }
    ];
  }
  function listeningTextsForPilot(pilot, level){
    var texts = [];
    if(pilot && Array.isArray(pilot.texts)) texts = pilot.texts;
    if((!texts || !texts.length) && pilot && Array.isArray(pilot.audioTexts)) texts = pilot.audioTexts;
    if((!texts || !texts.length) && pilot && pilot.transcript) texts = [{ title:'Hörtext', body:String(pilot.transcript) }];
    if(!texts || !texts.length) texts = defaultListeningTexts(level);
    return texts.filter(function(t){ return t && String(t.body || t.text || '').trim().length; });
  }
  function listeningPlainText(pilot, level){
    var texts = listeningTextsForPilot(pilot, level);
    return texts.map(function(t, idx){ return 'Teil ' + (idx+1) + '. ' + (t.title || 'Hörtext') + '. ' + (t.body || t.text || ''); }).join(' ').replace(/\s+/g,' ').trim();
  }
  function browserSpeechAvailable(){
    return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  }
  function listeningConsoleHtml(session, pilot, textsHtml){
    var st = listeningState(session, pilot);
    var max = Number((pilot && pilot.maxPlays) || 2);
    var canPlay = st.plays < max;
    var hasListened = st.plays > 0;
    var shouldReveal = st.revealed || st.plays >= Number((pilot && pilot.showTranscriptAfterPlays) || max);
    var tts = browserSpeechAvailable();
    var progress = Math.max(0, Math.min(100, Math.round((st.plays / Math.max(1,max)) * 100)));
    var lockText = hasListened ? 'Antworten freigeschaltet' : 'Antworten gesperrt bis zum ersten Hören';
    return '<div class="la-listening-console" data-la-listening-key="'+esc(st.key)+'">' +
      '<div class="la-listening-head"><div><span class="la-section-kicker">'+esc(session.level || 'B1')+' Hörprüfung · Academy-Hartmodus</span><h4>Hören vor Antworten</h4><p>'+esc((pilot && pilot.audioInstruction) || 'Höre die Situation aufmerksam. Erst danach werden die Antworten freigeschaltet.')+'</p></div><div class="la-listening-counter"><b>'+esc(st.plays)+'/'+esc(max)+'</b><small>Hörvorgänge</small></div></div>'+
      '<div class="la-listening-progress"><span style="width:'+esc(progress)+'%"></span></div>'+
      '<div class="la-listening-actions"><button type="button" class="la-primary" data-ui-action="language-exam-play-listening" data-la-listening-key="'+esc(st.key)+'" '+(canPlay?'':'aria-disabled="true"')+'>'+(canPlay?'▶ Hörtext abspielen':'Hörlimit erreicht')+'</button><button type="button" class="la-secondary" data-ui-action="language-exam-reveal-listening" data-la-listening-key="'+esc(st.key)+'" '+(hasListened?'':'aria-disabled="true"')+'>Transkript anzeigen</button></div>'+
      '<div class="la-listening-status '+(hasListened?'is-unlocked':'is-locked')+'"><b>'+esc(lockText)+'</b><small>'+(tts?'Browser-Stimme verfügbar.':'Browser-Stimme nicht verfügbar: Lies den Text nach dem Anzeigen des Transkripts.')+'</small></div>'+
      '<div class="la-exam-warning"><b>Harte Hörregel:</b> Fragen zählen erst prüfungsnah, wenn mindestens einmal gehört wurde. Reines Lesen vor dem Hören ist kein echter Hörtest.</div>'+
      (shouldReveal ? '<div class="la-exam-sources is-transcript"><div class="la-transcript-label">Transkript nach Hörphase</div>'+textsHtml+'</div>' : '<div class="la-listening-transcript-locked"><b>Transkript verborgen</b><small>Es wird erst nach dem Hören oder auf Wunsch nach dem ersten Abspielen angezeigt.</small></div>')+
      '</div>';
  }
  function playListening(btn){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, 'listening');
    var st = listeningState(session, pilot);
    var max = Number((pilot && pilot.maxPlays) || 2);
    if(st.plays >= max) return renderSession(session);
    var text = listeningPlainText(pilot, session.level);
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    st.plays += 1;
    st.lastPlayedAt = nowIso();
    session.listeningAudio[st.key] = st;
    saveSession(session);
    try{
      if(browserSpeechAvailable()){
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(text || listeningPlainText(null, session.level));
        utter.lang = 'de-DE';
        utter.rate = 0.92;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
      }
    }catch(_err){}
    return renderSession(session);
  }
  function revealListening(){
    var session = loadSession() || defaultSession('B1');
    var pilot = getPilotPart(session, 'listening');
    var st = listeningState(session, pilot);
    if(st.plays <= 0) return renderSession(session);
    session.listeningAudio = Object.assign({}, session.listeningAudio || {});
    st.revealed = true;
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
    var structure = (rubric && rubric.requiredStructure) || task.requiredSpeechStructure || ['Begrüßung/Einstieg','Situation/Grund erklären','konkrete Information','Vorschlag/Lösung/Rückfrage','höflicher Abschluss','zusammenhängende Antwort'];
    var lower = String(value || '').toLowerCase();
    var wordsNow = (String(value || '').trim().match(/\b[\wÄÖÜäöüß-]+\b/g) || []).length;
    var greetingHit = /(guten tag|hallo|liebe|sehr geehrte|merhaba)/i.test(lower);
    var reasonHit = /(weil|wegen|da ich|grund|krank|termin|zug|behörde|arbeit|problem|leider)/i.test(lower);
    var concreteHit = /(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|uhr|termin|treffpunkt|bestellnummer|lieferdatum|30 minuten|nächste)/i.test(lower);
    var requestHit = /(bitte|könnten|würden|möglich|vorschlagen|lösung|ersatz|rückerstattung|tauschen|rückmeldung|bestätigung|frage)/i.test(lower);
    var closingHit = /(vielen dank|danke|auf wiederhören|freundliche grüße|bis bald|ich freue mich|rückmeldung)/i.test(lower);
    var connectedHit = wordsNow >= (task.minWords || 70) && /(weil|deshalb|außerdem|dann|aber|und|könnten|würde)/i.test(lower);
    var rows = structure.map(function(item){
      var check = /begrüßung|einstieg/i.test(item) ? greetingHit : (/grund|situation/i.test(item) ? reasonHit : (/konkrete|information/i.test(item) ? concreteHit : (/vorschlag|lösung|rückfrage/i.test(item) ? requestHit : (/abschluss/i.test(item) ? closingHit : (/zusammenhängend/i.test(item) ? connectedHit : null)))));
      return '<li class="'+(check===true?'is-ok':(check===false?'is-risk':''))+'"><span>'+esc(check===true?'✓':(check===false?'!':'•'))+'</span>'+esc(item)+'</li>';
    }).join('');
    return '<div class="la-writing-rubric la-speaking-rubric"><div><b>'+esc((task.level || (task.assessmentRubric && task.assessmentRubric.level) || 'B1'))+'-Sprechcheck hart</b><small>'+esc(wordsNow)+' Wörter · Ziel: '+esc(task.minWords || 75)+'–'+esc(task.maxWords || 190)+'</small></div><ul>'+rows+'</ul><p>Wichtig: Die KI bewertet erst das bestätigte Transkript. Stichwörter, zu kurze Antworten oder fehlende Gesprächsstruktur werden hart abgewertet.</p></div>';
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
      '<label class="la-exam-textarea-label"><span>'+esc(isSpeaking ? 'Bestätigtes Transkript / zusammenhängende Sprechantwort' : 'Schriftliche Antwort mit formellem Aufbau')+'</span><textarea data-la-exam-answer="'+esc(partName)+'" rows="10" placeholder="Sprechen: Begrüßung, Situation/Grund, konkrete Information, Vorschlag/Rückfrage, höflicher Abschluss. Schreiben: Betreff/Anlass, Anrede, Problem, Folge, Bitte, Abschluss …">'+esc(value)+'</textarea></label>' +
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
      '<span class="la-section-kicker">Strenger Ergebnisbericht · Phase 38D.1</span>' +
      '<h3>'+esc(final.passed?'Bestanden':'Nicht bestanden')+' · '+esc(final.overallScore)+'%</h3>' +
      '<div class="la-exam-verdict"><b>Prüfungsreife: '+esc(final.readiness)+'</b><small>'+esc(final.readinessVerdict || '')+'</small>'+pctBar(probability)+'</div>' +
      '<div class="la-exam-mini-grid"><div><b>'+esc(final.completedParts)+'/'+esc(final.totalParts || 4)+'</b><small>Teile abgeschlossen</small></div><div><b>'+esc(final.passScore)+'%</b><small>Bestehensgrenze</small></div><div><b>'+esc(probability)+'%</b><small>realistische Prognose</small></div></div>' +
      '<div class="la-exam-teacher-summary"><b>Prüferkommentar</b><p>'+esc(final.teacherSummary || '')+'</p></div>' +
      '<table class="la-table la-exam-result-table"><thead><tr><th>Teil</th><th>Punkte</th><th>Status</th><th>Hinweise</th></tr></thead><tbody>'+rows+'</tbody></table>' +
      '<div class="la-exam-report-grid"><div class="la-exam-report-box is-critical"><h4>Kritische Schwächen</h4>'+listHtml(final.criticalWeaknesses, 'Keine kritischen Schwächen erkannt.')+'</div><div class="la-exam-report-box is-strength"><h4>Stärken</h4>'+listHtml(final.strengths, 'Noch keine stabilen Stärken erkannt.')+'</div></div>' +
      '<div class="la-exam-report-box is-next"><h4>Konkrete Wiederholungsempfehlung</h4>'+listHtml(final.recommendations, 'Weitere Simulation durchführen.')+'<p class="la-note"><b>Nächster Schritt:</b> '+esc(final.nextRequiredAction || '')+'</p></div>' +
      '<div class="la-exam-warning"><b>Rechtlicher Hinweis:</b> '+esc(final.certificateNote || 'Dies ist eine interne Prüfungssimulation und kein offizielles Sprachzertifikat.')+'</div>' +
      '<div class="la-level-actions"><button type="button" class="la-primary" data-ui-action="language-exam-reset">Neue Simulation</button><button type="button" class="la-secondary" data-ui-action="language-course-open">Zurück zum Kurs</button></div>' +
      '</section>';
  }
  function renderSession(session){
    session = saveSession(session || loadSession() || defaultSession('B1'));
    var allDone = PARTS.every(function(p){ return !!(session.parts && session.parts[p]); });
    if(allDone && engine() && engine().computeFinal){ session.final = engine().computeFinal(session); saveSession(session); }
    var body = '<div class="la-dashboard la-exam-shell" data-la-exam-shell="phase38c12a" data-la-exam-level="'+esc(session.level)+'">' +
      examHeader(session) + examPressureBar(session) + renderCurrentPart(session) + (allDone ? renderResult(session) : '<section class="la-card"><div class="la-level-actions"><button type="button" class="la-secondary" data-ui-action="language-exam-prev-part">Vorheriger Teil</button><button type="button" class="la-primary" data-ui-action="language-exam-next-part">Nächster Teil</button><button type="button" class="la-secondary" data-ui-action="language-exam-home">Prüfungsübersicht</button></div></section>') + '</div>';
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
      var min = Number(pilot.passScore || 70);
      var timeState = partTimeState(session, part);
      session.partCompletedAt = Object.assign({}, session.partCompletedAt || {});
      session.partCompletedAt[part] = nowIso();
      session.parts[part] = {
        part:part, mode:'b1-hard-objective', timedOut: timeState.remaining <= 0, passed:score >= min && answeredCount === questions.length && timeState.remaining > 0,
        overallScore:score, score:score, correctCount:correctCount, totalQuestions:questions.length, answeredCount:answeredCount,
        readiness: score >= min && answeredCount === questions.length ? 'Objektiver '+session.level+'-Teil bestanden' : session.level+'-Teil noch nicht prüfungsreif',
        hardFailReasons: (score >= min && answeredCount === questions.length && timeState.remaining > 0) ? [] : [session.level+'-Mindestleistung nicht erreicht, nicht alle Fragen beantwortet oder Zeit rechnerisch überschritten.'],
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
    return { ok:!!(engine() && blueprints()), phase:'38D.1', version:VERSION, hasEngine:!!engine(), hasBlueprints:!!blueprints(), routes:['language-exam-open','language-exam-start','language-exam-hybrid-check'], levels:levelList(), storageKey:STORAGE_KEY, features:['visible exam shell','level selection','part navigation','B1 hard reading pool','B1 hard listening pool','B1 writing task pool','B1 speaking task pool','Groq examiner for free answers','strict final report','readiness prognosis','critical weakness report','repeat recommendations','no exam release gate','B1 expanded pool','hard edge case detection','visual exam pressure','countdown timer','completion status strip','mobile exam layout','realistic listening mode','browser tts playback','listening repeat limit','locked answers before listening','hidden transcript','strict b1 writing rubric','formal structure checklist','subject reason check','writing hard caps','strict b1 speaking rubric','speaking structure checklist','confirmed transcript mode','speaking hard caps','B1 full exam QA scenarios','pass/fail regression test','Groq fallback validation','incomplete exam validation','B2 exam architecture active','B2 reading/listening/writing/speaking starter pool','B2 argumentation requirements','B2 strict Groq examiner' ] };
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
    clearSession:clearSession
  });

  document.addEventListener('click', handleClick, true);
  document.addEventListener('change', bindInputs, true);
})();
