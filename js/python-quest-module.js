/* BPS-Trainer V10.3.0 · Python Quest Academy Module
   Eigenständiger Python-Lernpfad mit separater DB, Prüfungscenter, Level-Gating und Code-Coach-Anbindung. */
(function(){
  'use strict';
  var VERSION = '10.5.0-python-quest-phase-10-quiz-mastery';
  var DB = window.PYTHON_QUEST_DB || {levels:[], storageKey:'bps_python_quest_progress_v1'};
  var STORAGE_KEY = DB.storageKey || 'bps_python_quest_progress_v1';
  var SHELL_ID = 'pythonQuestBackdrop';
  var injected = false;
  var activeView = { screen:'dashboard', levelId:'py_level_01', examType:'final' };

  function $(id){ return document.getElementById(id); }
  function esc(value){ return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]; }); }
  function clamp(n,min,max){ n=Number(n)||0; return Math.max(min,Math.min(max,n)); }
  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';} }
  function levelById(id){ return (DB.levels||[]).filter(function(l){ return l.id === id; })[0] || (DB.levels||[])[0]; }
  function prevLevelId(level){ return level && level.unlockAfter; }
  function nextLevel(level){ return (DB.levels||[]).filter(function(l){ return l.level === (level.level+1); })[0] || null; }
  function countKeys(obj){ return obj && typeof obj === 'object' ? Object.keys(obj).length : 0; }

  function defaultProgress(){
    var levels = {};
    (DB.levels||[]).forEach(function(l){
      levels[l.id] = {
        status: l.level === 1 ? 'active' : 'locked',
        lessonDone:{}, checksDone:{}, practiceDone:{},
        midExam:{passed:false,score:0,attempts:0,last:null},
        finalExam:{passed:false,score:0,attempts:0,last:null},
        unlockedAt: l.level === 1 ? nowIso() : ''
      };
    });
    return { version:VERSION, xp:0, badges:[], currentLevel:'py_level_01', levels:levels, submissions:[], errorStats:{}, repairQueue:[], pythonProfile:{risk:'gruen',weakest:[],strongest:[],streak:0,lastFocus:'Aufbau'}, updatedAt:nowIso() };
  }
  function normalizeProgress(p){
    var base = defaultProgress();
    p = p && typeof p === 'object' ? p : {};
    base.xp = Number(p.xp || 0);
    base.badges = Array.isArray(p.badges) ? p.badges : [];
    base.currentLevel = p.currentLevel || 'py_level_01';
    (DB.levels||[]).forEach(function(l){
      var old = p.levels && p.levels[l.id] || {};
      base.levels[l.id] = Object.assign(base.levels[l.id], old);
      base.levels[l.id].lessonDone = base.levels[l.id].lessonDone || {};
      base.levels[l.id].checksDone = base.levels[l.id].checksDone || {};
      base.levels[l.id].practiceDone = base.levels[l.id].practiceDone || {};
      base.levels[l.id].midExam = Object.assign({passed:false,score:0,attempts:0,last:null}, base.levels[l.id].midExam || {});
      base.levels[l.id].finalExam = Object.assign({passed:false,score:0,attempts:0,last:null}, base.levels[l.id].finalExam || {});
      if(l.level === 1 && base.levels[l.id].status === 'locked') base.levels[l.id].status = 'active';
    });
    base.submissions = Array.isArray(p.submissions) ? p.submissions.slice(-60) : [];
    base.errorStats = p.errorStats && typeof p.errorStats === 'object' ? p.errorStats : {};
    base.repairQueue = Array.isArray(p.repairQueue) ? p.repairQueue.slice(-12) : [];
    base.pythonProfile = p.pythonProfile && typeof p.pythonProfile === 'object' ? p.pythonProfile : base.pythonProfile;
    return base;
  }
  function readProgress(){ try{ return normalizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')); }catch(e){ return defaultProgress(); } }
  function saveProgress(p){ try{ p.updatedAt=nowIso(); localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }catch(e){} return p; }
  function levelState(progress, id){ return progress.levels[id] || {}; }
  function isUnlocked(level, progress){
    if(!level) return false;
    var st = levelState(progress, level.id);
    if(level.level === 1) return true;
    if(st.status && st.status !== 'locked') return true;
    var prev = prevLevelId(level);
    return !!(prev && progress.levels[prev] && progress.levels[prev].finalExam && progress.levels[prev].finalExam.passed);
  }
  function addXp(progress, amount){ progress.xp = Math.max(0, Number(progress.xp||0) + Number(amount||0)); }
  function addBadge(progress, badge){ if(progress.badges.indexOf(badge) < 0) progress.badges.push(badge); }
  function ensureUnlocks(progress){
    (DB.levels||[]).forEach(function(l){
      var st = levelState(progress,l.id);
      if(l.level === 1) st.status = st.finalExam && st.finalExam.passed ? 'done' : 'active';
      else if(isUnlocked(l,progress)) st.status = st.finalExam && st.finalExam.passed ? 'done' : 'active';
      else st.status = 'locked';
    });
    return progress;
  }

  function levelMetrics(level, st){
    st = st || {};
    var lessonTotal = (level.lessons||[]).length;
    var checkTotal = (level.checks||[]).length;
    var practiceTotal = (level.practiceTasks||[]).length;
    var lessonDone = (level.lessons||[]).filter(function(x){ return st.lessonDone && st.lessonDone[x.id]; }).length;
    var checksCorrect = (level.checks||[]).filter(function(x){ return st.checksDone && st.checksDone[x.id] && st.checksDone[x.id].correct; }).length;
    var practiceDone = (level.practiceTasks||[]).filter(function(x){ return st.practiceDone && st.practiceDone[x.id]; }).length;
    var lessonsOk = lessonTotal === 0 || lessonDone >= lessonTotal;
    var checksOk = checkTotal === 0 || checksCorrect >= checkTotal;
    var practiceOk = practiceTotal === 0 || practiceDone >= practiceTotal;
    var midOk = !!(st.midExam && st.midExam.passed);
    var finalOk = !!(st.finalExam && st.finalExam.passed);
    var percent = Math.round((lessonsOk?20:lessonTotal?lessonDone/lessonTotal*20:20) + (checksOk?20:checkTotal?checksCorrect/checkTotal*20:20) + (practiceOk?20:practiceTotal?practiceDone/practiceTotal*20:20) + (midOk?25:0) + (finalOk?15:0));
    return {lessonTotal:lessonTotal, checkTotal:checkTotal, practiceTotal:practiceTotal, lessonDone:lessonDone, checksCorrect:checksCorrect, practiceDone:practiceDone, lessonsOk:lessonsOk, checksOk:checksOk, practiceOk:practiceOk, midOk:midOk, finalOk:finalOk, percent:clamp(percent,0,100)};
  }
  function missingBeforeExam(level, st, type){
    if(type === 'mid' && st && st.midExam && st.midExam.passed) return [];
    if(type !== 'mid' && st && st.finalExam && st.finalExam.passed) return [];
    var m = levelMetrics(level, st);
    var miss = [];
    if(type === 'mid'){
      if(!m.lessonsOk) miss.push('alle Mini-Lektionen markieren');
      if(!m.checksOk) miss.push('alle Verständnisfragen richtig lösen');
      if(!m.practiceOk) miss.push('alle Praxisübungen erledigen');
    } else {
      if(!m.midOk) miss.push('Zwischenprüfung bestehen');
      if(!m.lessonsOk) miss.push('alle Mini-Lektionen markieren');
      if(!m.checksOk) miss.push('alle Verständnisfragen richtig lösen');
      if(!m.practiceOk) miss.push('alle Praxisübungen erledigen');
    }
    return miss;
  }

  function ensureShell(){
    if($(SHELL_ID)) return $(SHELL_ID);
    var bd = document.createElement('div');
    bd.id = SHELL_ID;
    bd.className = 'python-quest-backdrop';
    bd.setAttribute('role','dialog');
    bd.setAttribute('aria-modal','true');
    bd.innerHTML = '<div class="python-quest-shell"><header class="python-quest-head"><div><div class="python-quest-kicker">Python Quest Academy</div><h2 id="pythonQuestTitle">Python lernen mit Prüfungslogik</h2><p id="pythonQuestSub">Level, Praxis, Zwischenprüfung, Abschlussprüfung und Code-Coach im gleichen Premium-Design.</p></div><button class="python-quest-close" type="button" data-py-action="close">✕</button></header><main class="python-quest-body" id="pythonQuestBody"></main></div>';
    document.body.appendChild(bd);
    bd.addEventListener('click', function(ev){ if(ev.target === bd) close(); });
    return bd;
  }
  function open(screen, levelId){
    ensureShell();
    activeView.screen = screen || 'dashboard';
    activeView.levelId = levelId || activeView.levelId || 'py_level_01';
    render();
    $(SHELL_ID).classList.add('show');
    document.body.classList.add('python-quest-active');
  }
  function close(){ var bd=$(SHELL_ID); if(bd) bd.classList.remove('show'); document.body.classList.remove('python-quest-active'); }

  function render(){
    var progress = ensureUnlocks(readProgress()); saveProgress(progress);
    var body = $('pythonQuestBody'); if(!body) return;
    if(activeView.screen === 'level') body.innerHTML = renderLevel(levelById(activeView.levelId), progress);
    else if(activeView.screen === 'exam') body.innerHTML = renderExam(levelById(activeView.levelId), progress, activeView.examType || 'final');
    else if(activeView.screen === 'roadmap') body.innerHTML = renderRoadmap(progress);
    else body.innerHTML = renderDashboard(progress);
    wireDynamic();
  }

  function stat(label,value,sub){ return '<div class="python-quest-stat"><span>'+esc(label)+'</span><b>'+esc(value)+'</b><small>'+esc(sub||'')+'</small></div>'; }
  function renderStats(progress){
    var all = DB.levels || [];
    var done = all.filter(function(l){ return levelState(progress,l.id).finalExam && levelState(progress,l.id).finalExam.passed; }).length;
    var unlocked = all.filter(function(l){ return isUnlocked(l,progress); }).length;
    var current = levelById(progress.currentLevel) || all[0];
    var currentMetrics = current ? levelMetrics(current, levelState(progress,current.id)) : {percent:0};
    return '<div class="python-quest-stats">'+
      stat('XP', progress.xp || 0, 'spielerischer Lernfortschritt')+
      stat('Level bestanden', done + '/' + all.length, 'nur mit Abschlussprüfung')+
      stat('Freigeschaltet', unlocked, 'kein Überspringen')+
      stat('Level-Fortschritt', currentMetrics.percent + '%', current ? 'Level ' + current.level + ' · ' + current.title : '')+
    '</div>';
  }


  function shortErrorLabel(cat){
    var raw = String(cat || '').split(':')[0].trim();
    return raw || 'Unklarer Fehler';
  }
  function categoryHelp(label){
    var k = String(label || '').toLowerCase();
    if(k.indexOf('datentyp')>=0) return 'Trainiere: input() liefert Text. Rechne erst nach int() oder float().';
    if(k.indexOf('struktur')>=0) return 'Trainiere: Code in Eingabe → Verarbeitung → Ausgabe gliedern.';
    if(k.indexOf('syntax')>=0) return 'Trainiere: Klammern, Anführungszeichen, Doppelpunkte und Einrückung prüfen.';
    if(k.indexOf('logik')>=0) return 'Trainiere: Grenzwerte und Bedingungen mit Testwerten kontrollieren.';
    if(k.indexOf('kommentar')>=0) return 'Trainiere: Kommentar muss erklären, was der nächste Abschnitt wirklich macht.';
    if(k.indexOf('variab')>=0) return 'Trainiere: Werte mit sprechenden Namen speichern, nicht nur a/b/x.';
    if(k.indexOf('aufgaben')>=0) return 'Trainiere: Aufgabenstellung Punkt für Punkt abhaken.';
    return 'Trainiere genau den Fehler aus der letzten Abgabe mit einer Mini-Version.';
  }
  function repairPromptFor(label, level){
    var k = String(label || '').toLowerCase();
    if(k.indexOf('datentyp')>=0) return 'Schreibe ein Mini-Programm: zwei Zahlen abfragen, beide mit int() umwandeln, Summe und Produkt ausgeben.';
    if(k.indexOf('struktur')>=0) return 'Sortiere dein Programm sichtbar in drei Abschnitte: # Eingabe, # Verarbeitung, # Ausgabe.';
    if(k.indexOf('syntax')>=0) return 'Nimm drei Codezeilen und prüfe jede Zeile auf Klammern, Anführungszeichen und Doppelpunkt.';
    if(k.indexOf('logik')>=0) return 'Teste eine Bedingung mit drei Grenzwerten: darunter, genau auf Grenze, darüber.';
    if(k.indexOf('kommentar')>=0) return 'Ergänze zu jedem Abschnitt einen Kommentar in eigenen Worten, z. B. „holt Alter vom User“.';
    if(k.indexOf('variab')>=0) return 'Ersetze unklare Namen wie a, b, x durch name, alter, punkte oder ergebnis.';
    if(k.indexOf('aufgaben')>=0) return 'Baue nur die Pflichtpunkte der Aufgabe als Mini-Version und analysiere erneut.';
    return 'Baue eine kleine Reparaturaufgabe passend zu Level '+(level&&level.level||'?')+' und analysiere erneut.';
  }
  function updatePythonProfile(progress, result, level, type){
    progress.errorStats = progress.errorStats || {};
    progress.repairQueue = Array.isArray(progress.repairQueue) ? progress.repairQueue : [];
    var labels = (result.errorCategories || []).map(shortErrorLabel);
    if(result.diagnostics && result.diagnostics.structureQuality && result.diagnostics.structureQuality.grade === 'rot') labels.push('Strukturfehler');
    if(result.diagnostics && result.diagnostics.commentQuality && result.diagnostics.commentQuality.score < 5) labels.push('Kommentarfehler');
    labels.forEach(function(label){ progress.errorStats[label] = Number(progress.errorStats[label]||0)+1; });
    var unique = labels.filter(function(x,i,a){ return x && a.indexOf(x)===i; }).slice(0,3);
    unique.forEach(function(label){
      var exists = progress.repairQueue.some(function(t){ return t.category === label && t.levelId === level.id && !t.done; });
      if(!exists && !result.passed){
        progress.repairQueue.unshift({ id:'repair_'+Date.now()+'_'+Math.random().toString(16).slice(2), levelId:level.id, level:level.level, category:label, title:'Reparatur: '+label, prompt:repairPromptFor(label, level), why:categoryHelp(label), createdAt:nowIso(), done:false });
      }
    });
    progress.repairQueue = progress.repairQueue.slice(0,12);
    var last = (progress.submissions||[]).slice(-5);
    var failed = last.filter(function(x){return !x.passed;}).length;
    var avg = last.length ? Math.round(last.reduce(function(a,x){return a+Number(x.score||0);},0)/last.length) : 0;
    var top = Object.keys(progress.errorStats||{}).sort(function(a,b){return Number(progress.errorStats[b]||0)-Number(progress.errorStats[a]||0);}).slice(0,5);
    var passedStreak = 0;
    for(var i=(progress.submissions||[]).length-1;i>=0;i--){ if(progress.submissions[i].passed) passedStreak++; else break; }
    var risk = failed>=3 || avg<65 ? 'rot' : (failed>=1 || avg<85 || top.some(function(k){return progress.errorStats[k]>=3;})) ? 'gelb' : 'gruen';
    progress.pythonProfile = { risk:risk, weakest:top.slice(0,3), strongest:[], streak:passedStreak, average:avg, recentFails:failed, lastFocus:top[0] || (result.passed?'Nächstes Level':'Basis stabilisieren'), updatedAt:nowIso() };
    result.learningImpact = progress.pythonProfile;
    return progress;
  }
  function renderPythonProfile(progress){
    var pr = progress.pythonProfile || {};
    var riskLabel = pr.risk === 'rot' ? 'kritisch' : pr.risk === 'gelb' ? 'riskant' : 'stabil';
    var weak = Array.isArray(pr.weakest) && pr.weakest.length ? pr.weakest : [];
    return '<section class="python-quest-panel"><h3>Python Fehler-DNA</h3><p>Der Coach speichert nicht nur einzelne Prüfungen, sondern erkennt wiederkehrende Fehlermuster. Daraus entstehen gezielte Reparaturaufgaben.</p><div class="python-quest-stats">'+
      stat('Risiko', riskLabel, 'Lernampel aus letzten Abgaben')+
      stat('Ø Score', pr.average ? pr.average+'%' : '—', 'letzte Prüfungen')+
      stat('Serie', (pr.streak||0)+'×', 'bestandene Prüfungen am Stück')+
      stat('Coach-Fokus', pr.lastFocus || 'Aufbau', 'nächster Hebel')+
    '</div>'+(weak.length?'<div class="python-badge-row">'+weak.map(function(x){return '<span>'+esc(x)+' · '+esc((progress.errorStats||{})[x]||0)+'×</span>';}).join('')+'</div>':'<p class="python-small">Noch keine wiederkehrende Schwäche erkannt.</p>')+'</section>';
  }
  function renderRepairCenter(progress, currentLevelId){
    var q = (progress.repairQueue||[]).filter(function(x){ return !x.done; }).slice(0,5);
    if(!q.length) return '<section class="python-quest-panel"><h3>Reparaturtraining</h3><p class="python-small">Aktuell keine offenen Reparaturaufgaben. Sobald der Coach wiederkehrende Fehler erkennt, entstehen hier gezielte Mini-Übungen.</p></section>';
    return '<section class="python-quest-panel"><h3>Reparaturtraining</h3><p>Diese Aufgaben entstehen aus echten Fehlern, nicht zufällig. Erst Fehler verstehen, dann weiterziehen.</p><div class="python-checklist">'+q.map(function(t){return '<div><b>'+esc(t.title)+'</b><br><span>'+esc(t.why)+'</span><br><small>'+esc(t.prompt)+'</small><br><button class="python-quest-secondary ghost" data-py-action="repair-done" data-id="'+esc(t.id)+'">Reparatur erledigt</button></div>';}).join('')+'</div></section>';
  }

  function renderLearningCurve(progress){
    var subs = Array.isArray(progress.submissions) ? progress.submissions.slice(-8).reverse() : [];
    var avg = subs.length ? Math.round(subs.reduce(function(a,x){ return a + Number(x.score||0); },0) / subs.length) : 0;
    var passed = subs.filter(function(x){ return x.passed; }).length;
    var errors = progress.errorStats || {};
    var topErrors = Object.keys(errors).sort(function(a,b){ return Number(errors[b]||0)-Number(errors[a]||0); }).slice(0,4);
    return '<section class="python-quest-panel"><h3>Lernkurve & Fehlerdiagnose</h3><p>Phase 4 speichert Versuche, Fehlertypen und Wiederholungsbedarf - plus PDF-Material und Datentyp-Diagnose.</p><div class="python-quest-stats">'+
      stat('Ø letzte Abgaben', subs.length ? avg+'%' : '—', subs.length+' Versuch(e)')+
      stat('Bestanden', passed+'/'+subs.length, 'letzte Prüfungen')+
      stat('Hauptfehler', topErrors[0] ? topErrors[0].split(':')[0] : '—', topErrors[0] ? errors[topErrors[0]]+'× erkannt' : 'noch keine Daten')+
      stat('Coach-Fokus', topErrors.length ? 'Reparatur' : 'Aufbau', topErrors.length ? 'gezielte Wiederholungen' : 'erstes Level starten')+
    '</div>'+(topErrors.length?'<div class="python-badge-row">'+topErrors.map(function(k){ return '<span>'+esc(k)+' · '+esc(errors[k])+'×</span>'; }).join('')+'</div>':'<p class="python-small">Noch keine Abgaben analysiert. Nach der ersten Prüfung entsteht hier deine persönliche Lernkurve.</p>')+
    (subs.length?'<div class="python-checklist">'+subs.map(function(x){ return '<div>'+esc(x.at||'').slice(0,10)+' · '+esc(x.levelId)+' · '+esc(x.type)+' · '+esc(x.score)+'% · '+esc(x.passed?'bestanden':'offen')+'</div>'; }).join('')+'</div>':'')+'</section>';
  }

  function nav(){ return '<div class="python-quest-nav"><button data-py-action="dashboard">Übersicht</button><button data-py-action="roadmap">Roadmap 1–30</button><button data-py-action="open-level" data-level="py_level_01">Level 1</button><button data-py-action="open-level" data-level="py_level_02">Level 2</button><button data-py-action="open-level" data-level="py_level_03">Level 3</button><button data-py-action="open-level" data-level="py_level_04">Level 4</button><button data-py-action="open-level" data-level="py_level_05">Level 5</button><button data-py-action="open-level" data-level="py_level_06">Level 6</button><button data-py-action="open-level" data-level="py_level_07">Level 7</button><button data-py-action="open-level" data-level="py_level_08">Level 8</button><button data-py-action="open-level" data-level="py_level_09">Level 9</button><button data-py-action="open-level" data-level="py_level_10">Level 10</button><button data-py-action="open-coach">Code-Coach</button></div>'; }

  function renderDashboard(progress){
    var levels = (DB.levels||[]).slice(0,10);
    return renderStats(progress)+nav()+
      '<section class="python-quest-panel"><h3>Phase 10 · Listen-Auswertung + Quiz-Meilenstein</h3><p>Neu sind Level 9 Punktelisten-Auswertung und Level 10 Mini-Quiz mit Score. Der Coach bewertet Listendurchlauf, Akkumulator, Punktestand, Struktur, Kommentare und Verständnisnachweis.</p><div class="python-badge-row">'+(DB.philosophy||[]).map(function(x){ return '<span>'+esc(x)+'</span>'; }).join('')+'</div></section>'+ 
      '<section class="python-quest-grid">'+levels.map(function(l){ return renderLevelCard(l,progress); }).join('')+'</section>'+ 
      renderLearningCurve(progress)+
      '<section class="python-quest-panel"><h3>Umsetzungsstand</h3><div class="python-checklist"><div>✅ Separate Python-Datenbank</div><div>✅ Level 1 vollständig</div><div>✅ Level 2 vollständig</div><div>✅ Level 3 vollständig</div><div>✅ Level 4 vollständig</div><div>✅ PDF-Lernmaterial Level 1-8 eingebunden</div><div>✅ Zwischenprüfung als Pflichtschritt</div><div>✅ Abschlussprüfung sperrt/öffnet nächste Level</div><div>✅ Code-Coach mit Fehlerkategorien</div><div>✅ Lernkurve/Versuchsprotokoll</div><div>✅ Analyse intern gegen gesperrte Prüfungen abgesichert</div><div>✅ Prüfungscenter Pro mit Ampeln</div><div>✅ Reflexionsfrage & Anti-Copy-Check</div></div></section>';
  }
  function renderLevelCard(l, progress){
    var st = levelState(progress,l.id);
    var unlocked = isUnlocked(l,progress);
    var cls = st.finalExam && st.finalExam.passed ? 'done' : (unlocked ? 'active' : 'locked');
    var label = st.finalExam && st.finalExam.passed ? 'bestanden' : (unlocked ? 'offen' : 'gesperrt');
    var m = levelMetrics(l,st);
    return '<article class="python-level-card '+cls+'" data-py-action="open-level" data-level="'+esc(l.id)+'"><span>Level '+l.level+' · '+esc(l.band)+'</span><h3>'+esc(l.title)+'</h3><p>'+esc(l.summary)+'</p><div class="python-progress-mini"><i style="width:'+m.percent+'%"></i></div><footer><small>'+esc((l.concepts||[]).slice(0,4).join(' · '))+'</small><b>'+esc(label)+'</b></footer></article>';
  }
  function renderRoadmap(progress){
    return renderStats(progress)+nav()+
      '<section class="python-quest-panel"><h3>Python-Level 1–30</h3><p>Die Level-DNA ist separat von der BPS/CTC-Datenbank. Dadurch bleibt der Eignungstest-Trainer sauber, während Python als eigener Lernpfad mit Prüfungsfreischaltung wächst.</p><div class="python-roadmap">'+(DB.levels||[]).map(function(l){ var st=levelState(progress,l.id); var cls=(st.finalExam&&st.finalExam.passed)?'done':(isUnlocked(l,progress)?'active':'locked'); return '<button class="'+cls+'" data-py-action="open-level" data-level="'+esc(l.id)+'">L'+l.level+'<br><small>'+esc(l.band)+'</small></button>'; }).join('')+'</div></section>';
  }

  function renderProgressPanel(level, st){
    var m = levelMetrics(level,st);
    function row(label, value, ok){ return '<div class="python-step '+(ok?'done':'todo')+'"><span>'+esc(label)+'</span><b>'+esc(value)+'</b></div>'; }
    return '<section class="python-quest-panel"><h3>Fortschritt innerhalb des Levels</h3><div class="python-meter"><i style="width:'+m.percent+'%"></i></div><div class="python-step-grid">'+
      row('Mini-Lektionen', m.lessonDone+'/'+m.lessonTotal, m.lessonsOk)+
      row('Verständnischeck', m.checksCorrect+'/'+m.checkTotal, m.checksOk)+
      row('Praxisübungen', m.practiceDone+'/'+m.practiceTotal, m.practiceOk)+
      row('Zwischenprüfung', st.midExam && st.midExam.passed ? 'bestanden' : 'offen', m.midOk)+
      row('Abschlussprüfung', st.finalExam && st.finalExam.passed ? 'bestanden' : 'offen', m.finalOk)+
    '</div></section>';
  }
  function renderLevel(level, progress){
    if(!level) return renderDashboard(progress);
    var unlocked = isUnlocked(level,progress);
    var st = levelState(progress,level.id);
    progress.currentLevel = level.id; saveProgress(progress);
    if(!unlocked){ return renderStats(progress)+nav()+'<section class="python-quest-panel"><h3>Level '+level.level+' ist noch gesperrt</h3><p>Dieses Level wird erst freigeschaltet, wenn die Abschlussprüfung von Level '+(level.level-1)+' bestanden ist.</p><button class="python-quest-primary" data-py-action="open-level" data-level="'+esc(level.unlockAfter || 'py_level_01')+'">Vorheriges Level öffnen</button></section>'; }
    var lessons = (level.lessons||[]).map(function(le){ var done=st.lessonDone&&st.lessonDone[le.id]; return '<article class="python-lesson '+(done?'done':'')+'"><h4>'+esc(le.title)+'</h4><p><b>Ziel:</b> '+esc(le.goal)+'</p><ul>'+(le.content||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul><pre class="python-code">'+esc(le.example||'')+'</pre><p class="python-small">'+esc(le.explanation||'')+'</p><button class="python-quest-secondary ghost" data-py-action="lesson-done" data-level="'+esc(level.id)+'" data-id="'+esc(le.id)+'">'+(done?'Verstanden ✓':'Als verstanden markieren')+'</button></article>'; }).join('');
    var checks = (level.checks||[]).map(function(q){ return renderMc(level,q,st); }).join('');
    var practices = (level.practiceTasks||[]).map(function(t){ var done=st.practiceDone&&st.practiceDone[t.id]; return '<article class="python-practice-card '+(done?'done':'')+'"><h4>'+esc(t.title)+'</h4><p>'+esc(t.prompt)+'</p>'+(t.expected?'<pre class="python-code">'+esc(t.expected)+'</pre>':'')+'<button class="python-quest-secondary" data-py-action="practice-done" data-level="'+esc(level.id)+'" data-id="'+esc(t.id)+'">'+(done?'Praktisch erledigt ✓':'Praktisch erledigt markieren')+'</button></article>'; }).join('');
    var midOk = st.midExam && st.midExam.passed;
    var finalOk = st.finalExam && st.finalExam.passed;
    var midMissing = missingBeforeExam(level,st,'mid');
    var finalMissing = missingBeforeExam(level,st,'final');
    return renderStats(progress)+nav()+
      '<section class="python-quest-panel"><h3>Level '+level.level+' · '+esc(level.title)+'</h3><p>'+esc(level.summary)+'</p><div class="python-badge-row">'+(level.concepts||[]).map(function(c){return '<span>'+esc(c)+'</span>';}).join('')+'</div>'+ (level.pdf ? '<div class="python-upload-row"><a class="python-quest-secondary" href="'+esc(level.pdf)+'" target="_blank" rel="noopener">Lern-PDF öffnen</a></div>' : '') +'</section>'+ 
      renderProgressPanel(level,st)+
      renderRepairCenter(progress, level.id)+
      '<section class="python-quest-two"><div class="python-quest-panel"><h3>Lernen</h3>'+lessons+'</div><div class="python-quest-panel"><h3>Verständnischeck</h3>'+checks+'</div></section>'+ 
      '<section class="python-quest-panel"><h3>Praxisübungen</h3><p>Diese Übungen sind bewusst vor die Prüfung gesetzt. Wer nur liest, kann später selten selbst schreiben.</p><div class="python-quest-two">'+practices+'</div></section>'+ 
      '<section class="python-quest-two"><div class="python-exam-box"><h3>Zwischenprüfung</h3><p>'+esc(level.midExam && level.midExam.purpose || 'Fortschritt prüfen.')+'</p><p><b>Status:</b> '+(midOk?'bestanden':'offen')+' · Score '+(st.midExam&&st.midExam.score||0)+'%</p>'+(midMissing.length?'<div class="python-alert">Vorher fehlt: '+esc(midMissing.join(', '))+'</div>':'<button class="python-quest-primary" data-py-action="open-exam" data-level="'+esc(level.id)+'" data-type="mid">Zwischenprüfung öffnen</button>')+'</div><div class="python-exam-box"><h3>Abschlussprüfung</h3><p>Erst nach bestandener Abschlussprüfung wird das nächste Level freigeschaltet.</p><p><b>Status:</b> '+(finalOk?'bestanden':'offen')+' · Score '+(st.finalExam&&st.finalExam.score||0)+'%</p>'+(finalMissing.length?'<div class="python-alert">Vorher fehlt: '+esc(finalMissing.join(', '))+'</div>':'<button class="python-quest-primary" data-py-action="open-exam" data-level="'+esc(level.id)+'" data-type="final">Abschlussprüfung öffnen</button>')+'</div></section>';
  }
  function renderMc(level,q,st){
    var done = st.checksDone && st.checksDone[q.id];
    return '<div class="python-mc" data-mc-id="'+esc(q.id)+'"><b>'+esc(q.question)+'</b>'+q.answers.map(function(a,i){ var cls = done ? (i===q.correct?'correct':(done.answer===i?'wrong':'')) : ''; return '<button class="'+cls+'" data-py-action="mc-answer" data-level="'+esc(level.id)+'" data-id="'+esc(q.id)+'" data-index="'+i+'">'+esc(a)+'</button>'; }).join('')+'<p class="python-small">'+(done?esc(q.explain):'Wähle eine Antwort. Sofortiges Feedback, kein Druck.')+'</p></div>';
  }

  function renderExam(level, progress, type){
    var st = levelState(progress, level.id);
    var missing = missingBeforeExam(level,st,type);
    if(missing.length){
      return renderStats(progress)+nav()+'<section class="python-quest-panel"><h3>'+esc(type==='mid'?'Zwischenprüfung noch gesperrt':'Abschlussprüfung noch gesperrt')+'</h3><p>Die Prüfung wird erst geöffnet, wenn die Lernschritte davor erledigt sind. Das verhindert Fake-Fortschritt und macht das Modul wirklich lehrreich.</p><div class="python-alert">Noch offen: '+esc(missing.join(', '))+'</div><button class="python-quest-primary" data-py-action="open-level" data-level="'+esc(level.id)+'">Zurück zum Level</button></section>';
    }
    var exam = type === 'mid' ? level.midExam : level.finalExam;
    var exSt = type === 'mid' ? st.midExam : st.finalExam;
    var taskText = type === 'mid' ? (exam.tasks||[]).join('\n') : exam.task;
    return renderStats(progress)+nav()+
      '<section class="python-quest-panel"><h3>'+esc(exam.title)+'</h3><p>'+esc(type==='mid'?'Zwischenprüfung misst den Fortschritt innerhalb des Levels.':'Abschlussprüfung entscheidet über die Freischaltung des nächsten Levels.')+'</p><div class="python-alert">Mindestscore: '+esc(exam.requiredScore || level.requiredScore || 85)+'%. Datei oder Text einreichen, dann analysieren lassen.</div>'+ (level.pdf ? '<div class="python-upload-row"><a class="python-quest-secondary" href="'+esc(level.pdf)+'" target="_blank" rel="noopener">Passendes Lern-PDF öffnen</a></div>' : '') +'</section>'+ 
      '<section class="python-quest-two"><div class="python-exam-box"><h3>Aufgabe</h3><p class="python-preline">'+esc(taskText)+'</p><h4>Bewertung</h4><ul>'+(exam.rubric||level.finalExam.rubric||[]).map(function(r){return '<li>'+esc(r.label)+' · '+esc(r.points)+' Punkte</li>';}).join('')+'</ul><h4>Testfälle</h4>'+renderTestCases(exam.testCases||[], null)+'</div><div class="python-exam-box"><h3>Abgabe</h3><div class="python-upload-row"><input class="python-file-input" id="pythonQuestFile" type="file" accept=".py,.txt,text/plain"><button class="python-quest-secondary" data-py-action="load-demo-code" data-level="'+esc(level.id)+'" data-type="'+esc(type)+'">Demo-Code laden</button></div><p class="python-small">Du kannst eine .py/.txt hochladen oder den Code direkt einfügen. Der Coach führt aktuell eine sichere statische Prüfung durch.</p><textarea id="pythonQuestCode" class="python-code-editor" spellcheck="false" placeholder="# Code hier einfügen oder Datei hochladen"></textarea><div class="python-reflection-box"><h4>Kurzer Verständnisnachweis</h4><p class="python-small">Erkläre in eigenen Worten, was dein Programm macht und warum die wichtigsten Befehle nötig sind. Umgangssprache ist okay, der Inhalt muss passen.</p><textarea id="pythonQuestReflection" class="python-reflection-editor" spellcheck="true" placeholder="Beispiel: Erst hole ich die Eingaben, dann wandle ich die Zahlen um, danach prüft if/else die Bedingung ..."></textarea></div><div class="python-upload-row"><button class="python-quest-primary" data-py-action="analyze-code" data-level="'+esc(level.id)+'" data-type="'+esc(type)+'">Mit Code-Coach analysieren</button><button class="python-quest-secondary" data-py-action="open-level" data-level="'+esc(level.id)+'">Zurück zum Level</button></div><h4>Code-Vorschau</h4><pre id="pythonQuestPreview" class="python-code-preview"><span>Noch kein Code geladen.</span></pre></div></section>'+ 
      '<section class="python-quest-panel"><h3>Analyse</h3><div id="pythonQuestAnalysis" class="python-analysis">'+(exSt&&exSt.last?renderAnalysis(exSt.last):'<p>Noch keine Analyse gestartet.</p>')+'</div></section>';
  }

  function demoCode(levelId, type){
    if(levelId === 'py_level_08'){
      if(type === 'mid') return '# merkt sich Produkte in einer Liste\neinkauf = []\neinkauf.append("Milch")\neinkauf.append("Brot")\nprint(f"Liste: {einkauf}")\nprint(f"Anzahl: {len(einkauf)}")';
      return '# Einkaufsliste: Daten sammeln, ändern und ausgeben\neinkauf = ["Milch"]\neinkauf.append("Brot")\neinkauf.append("Äpfel")\n\n# Ausgabe: zeigt Liste, Anzahl und ersten Eintrag\nprint("=== Einkaufsliste ===")\nprint(f"Alle Produkte: {einkauf}")\nprint(f"Anzahl: {len(einkauf)}")\nprint(f"Erster Eintrag: {einkauf[0]}")';
    }
    if(levelId === 'py_level_07'){
      if(type === 'mid') return '# läuft fünf Runden durch und zeigt jede Runde\nfor runde in range(1, 6):\n    print(f"Runde {runde}")';
      return '# Zahlen-Generator: Startwerte festlegen\nstart = 1\nende = 11\nschritt = 2\nsumme = 0\n\n# geht die Zahlen durch und rechnet sie zur Summe dazu\nfor zahl in range(start, ende, schritt):\n    print(f"Zahl: {zahl}")\n    summe += zahl\n\nprint(f"Summe: {summe}")';
    }
    if(levelId === 'py_level_05'){
      if(type === 'mid') return '# Eingabe: Alter wird abgefragt und als Zahl gespeichert\nalter = int(input("Alter: "))\n\n# checkt, ob die Person schon volljährig ist\nif alter >= 18:\n    print(f"Mit {alter} bist du volljährig.")\nelse:\n    print(f"Mit {alter} bist du minderjährig.")';
      return '# Eingabe: Alter und Punktzahl vom Nutzer holen\nalter = int(input("Alter: "))\npunkte = int(input("Punktzahl: "))\n\n# Entscheidung: erst Zulassung nach Alter prüfen, dann Punkte bewerten\nif alter < 18:\n    print(f"Mit {alter} bist du nicht zugelassen.")\nelif punkte >= 70:\n    print(f"Bestanden: {punkte} Punkte reichen aus.")\nelse:\n    print(f"Nicht bestanden: {punkte} Punkte reichen noch nicht.")';
    }
    if(levelId === 'py_level_04'){
      if(type === 'mid') return '# Zwischenprüfung Level 4: Zwei Zahlen berechnen\nzahl1 = int(input("Erste Zahl: "))\nzahl2 = int(input("Zweite Zahl: "))\nprint(f"Summe: {zahl1 + zahl2}")\nprint(f"Differenz: {zahl1 - zahl2}")';
      return '# Abschlussprüfung Level 4: Mini-Rechner\nzahl1 = float(input("Erste Zahl: "))\nzahl2 = float(input("Zweite Zahl: "))\nprint("=== Mini-Rechner ===")\nprint(f"Addition: {zahl1 + zahl2}")\nprint(f"Subtraktion: {zahl1 - zahl2}")\nprint(f"Multiplikation: {zahl1 * zahl2}")\nprint(f"Division: {zahl1 / zahl2}")';
    }
    if(levelId === 'py_level_03'){
      if(type === 'mid') return '# Zwischenprüfung Level 3: Eingaben nutzen\nname = input("Name: ")\nziel = input("Python-Ziel: ")\nprint(f"Hallo {name}!")\nprint(f"Dein Ziel: {ziel}")';
      return '# Abschlussprüfung Level 3: Dialogprogramm\nname = input("Name: ")\nstadt = input("Stadt: ")\nziel = input("Python-Ziel: ")\nprint("====================")\nprint(f"Name: {name}")\nprint(f"Stadt: {stadt}")\nprint(f"Ziel: {ziel}")';
    }
    if(levelId === 'py_level_02'){
      if(type === 'mid') return '# Profilzeile mit f-String\nname = "Mira"\nziel = "Python sicher lernen"\nprint("====================")\nprint(f"Name: {name}")\nprint(f"Ziel: {ziel}")';
      return '# Profilkarte mit Farbe\nname = "Mira"\nalter = 25\nstadt = "Ulm"\nziel = "Python sicher verstehen"\nprint("\\033[36m====================\\033[0m")\nprint(f"Name: {name}")\nprint(f"Alter: {alter}")\nprint(f"Stadt: {stadt}")\nprint(f"Ziel: {ziel}")\nprint("\\033[32mProfilkarte fertig!\\033[0m")';
    }
    if(type === 'mid') return '# Mini-Vorstellung\nname = "Mira"\nziel = "Python lernen"\nprint("Hallo!")\nprint(name)\nprint(ziel)';
    return '# Vorstellungsprogramm für Python Level 1\nname = "Mira"\nlernziel = "Python sicher verstehen"\nprint("Hallo Welt!")\nprint("Mein Name ist:", name)\nprint("Mein Ziel ist:", lernziel)';
  }
  function renderCodePreview(code){
    if(!String(code||'').trim()) return '<span>Noch kein Code geladen.</span>';
    return String(code||'').split(/\r?\n/).map(function(line,i){ return '<span><b>'+String(i+1).padStart(2,'0')+'</b> '+esc(line || ' ')+'</span>'; }).join('\n');
  }
  function renderTestCases(cases, result){
    if(!cases || !cases.length) return '<p class="python-small">Keine spezifischen Testfälle hinterlegt.</p>';
    var results = result && result.testResults || [];
    return '<div class="python-test-list">'+cases.map(function(tc,i){ var r=results[i]; var cls = !r ? '' : (r.passed?'pass':'fail'); return '<div class="'+cls+'"><span>'+esc(tc.name||('Test '+(i+1)))+'</span><b>'+(r ? (r.passed?'✓':'✕') : '—')+'</b></div>'; }).join('')+'</div>';
  }
  function qualityGrade(value, max){
    value=Number(value||0); max=Number(max||1);
    var pct=max?value/max*100:0;
    return pct>=80?'gruen':(pct>=55?'gelb':'rot');
  }
  function qualityLabel(g){ return g==='gruen'?'stabil':(g==='gelb'?'riskant':'kritisch'); }
  function renderQualityAmpels(result){
    var r=result && result.rubricScores || {}, d=result && result.diagnostics || {};
    var items=[['Funktion',r.logic,20,'Aufgabe/Testfälle'],['Syntax',r.syntax,20,'technisch lauffähig'],['Struktur',r.structure,20,'Aufbau/Wartbarkeit'],['Lesbarkeit',r.readability,10,'Namen/Ausgabe'],['Kommentare',r.comments,10,'Sinn & Kontext'],['Verständnis',r.reflection,5,'eigene Erklärung']];
    return '<div class="python-ampel-grid">'+items.map(function(x){ var g=qualityGrade(x[1],x[2]); return '<div class="python-ampel '+g+'"><span>'+esc(x[0])+'</span><b>'+qualityLabel(g)+'</b><small>'+esc(x[1]||0)+'/'+esc(x[2])+' · '+esc(x[3])+'</small></div>'; }).join('')+'</div>'+
      (d.structureQuality?'<div class="python-analysis-block"><h4>Strukturdiagnose</h4><p>Status: '+qualityLabel(d.structureQuality.grade)+' · '+esc((d.structureQuality.issues||[])[0]||'keine Auffälligkeit')+'</p></div>':'')+
      (d.commentQuality?'<div class="python-analysis-block"><h4>Kommentarqualität</h4><p>Status: '+qualityLabel(d.commentQuality.grade)+' · sinnvolle Kommentare: '+esc(d.commentQuality.good||0)+' · teilweise: '+esc(d.commentQuality.partial||0)+' · problematisch: '+esc((d.commentQuality.bad||0)+(d.commentQuality.misleading||0))+'</p></div>':'')+
      (d.reflectionQuality?'<div class="python-analysis-block"><h4>Verständnisnachweis</h4><p>Status: '+qualityLabel(d.reflectionQuality.grade)+' · '+esc(d.reflectionQuality.note||'')+'</p></div>':'');
  }
  function renderRubric(result){
    var r = result && result.rubricScores || {};
    var items = [['Syntax',r.syntax,20],['Pflichtkonzepte',r.concepts,20],['Logik',r.logic,20],['Struktur',r.structure,20],['Lesbarkeit',r.readability,10],['Kommentare',r.comments,5],['Verständnis',r.reflection,5]];
    return '<div class="python-rubric pro">'+items.map(function(x){ var val=Number(x[1]||0), grade=qualityGrade(val,x[2]); return '<div class="'+grade+'"><span>'+esc(x[0])+'</span><b>'+val+'/'+x[2]+'</b><i style="width:'+clamp(val/x[2]*100,0,100)+'%"></i></div>'; }).join('')+'</div>'+
      (result && result.knockoutReasons && result.knockoutReasons.length ? '<div class="python-alert"><b>K.O.-Regel aktiv:</b> '+esc(result.knockoutReasons.join(' · '))+'</div>' : '');
  }
  function renderAnalysis(result){
    if(!result) return '<p>Noch keine Analyse.</p>';
    var cls = result.passed ? 'pass' : 'fail';
    return '<div class="python-score '+cls+'"><b>'+esc(result.score)+'%</b><div><strong>'+esc(result.passed?'Bestanden':'Noch nicht bestanden')+'</strong><p>'+esc(result.summary || '')+'</p></div></div>'+ 
      '<div class="python-analysis-block"><h4>Prüfungscenter Pro</h4><p>Bewertet werden Funktion, Syntax, Struktur, Lesbarkeit, Kommentarqualität und eigener Verständnisnachweis. Funktionierender Chaos-Code kann weiterhin durchfallen.</p></div>'+ 
      renderRubric(result)+renderQualityAmpels(result)+
      (result.learningImpact?'<div class="python-analysis-block"><h4>Lernwirkung</h4><p>Risiko: '+esc(result.learningImpact.risk || '—')+' · Fokus: '+esc(result.learningImpact.lastFocus || '—')+' · Ø: '+esc(result.learningImpact.average || '—')+'%</p></div>':'')+
      (result.testResults?'<div class="python-analysis-block"><h4>Testfälle</h4>'+renderTestCases((result.diagnostics&&result.diagnostics.testCases)||[], result)+'</div>':'')+
      '<div class="python-feedback-list">'+
        '<div><strong>Stärken</strong><ul>'+(result.strengths||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'+ 
        '<div><strong>Verbessern</strong><ul>'+(result.improvements||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'+ 
        '<div><strong>Fehlerdiagnose</strong><ul>'+((result.errorCategories&&result.errorCategories.length?result.errorCategories:result.errors)||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'+ 
        '<div><strong>Nächster Schritt</strong><p>'+esc(result.nextStep || '')+'</p>'+(result.repairDrill?'<p class="python-alert">Übung: '+esc(result.repairDrill)+'</p>':'')+'</div>'+ 
      '</div>';
  }

  function analyzeCode(level, type){
    var codeEl = $('pythonQuestCode');
    var code = codeEl ? codeEl.value : '';
    var reflectionEl = $('pythonQuestReflection');
    var reflection = reflectionEl ? reflectionEl.value : '';
    var progress = ensureUnlocks(readProgress());
    var st = levelState(progress,level.id);
    var blocked = [];
    if(!isUnlocked(level, progress)) blocked.push('Level ist noch gesperrt');
    blocked = blocked.concat(missingBeforeExam(level, st, type));
    if(blocked.length){
      var blockedResult = { passed:false, score:0, requiredScore:(type === 'mid' ? level.midExam.requiredScore : level.finalExam.requiredScore), errors:blocked, errorCategories:blocked.map(function(x){return 'Gating: '+x;}), strengths:[], improvements:['Erledige zuerst die gesperrten Voraussetzungen.'], testResults:[], rubricScores:{syntax:0,concepts:0,logic:0,structure:0,readability:0,reflection:0,comments:0}, summary:'Analyse blockiert: Diese Prüfung ist noch nicht freigegeben.', nextStep:'Zurück zum Level und die fehlenden Schritte abschließen.', repairDrill:'Arbeite genau die angezeigte Voraussetzung ab und starte danach erneut.', checkedAt:nowIso(), levelId:level.id, examType:type, diagnostics:{testCases:[]} };
      var outBlocked = $('pythonQuestAnalysis'); if(outBlocked) outBlocked.innerHTML = renderAnalysis(blockedResult);
      return;
    }
    var exam = type === 'mid' ? level.midExam : level.finalExam;
    var payload = { mode:'python_exam', levelId:level.id, examType:type, level:level, exam:exam, code:code, reflection:reflection, referenceCode:demoCode(level.id,type) };
    var coach = window.BPSLearningCoachEngine;
    var result = coach && typeof coach.evaluatePythonSubmission === 'function' ? coach.evaluatePythonSubmission(payload) : localAnalyze(payload);
    var target = type === 'mid' ? st.midExam : st.finalExam;
    target.attempts = Number(target.attempts||0) + 1;
    target.score = result.score;
    target.passed = !!result.passed;
    target.last = result;
    progress.submissions.push({levelId:level.id, type:type, score:result.score, passed:!!result.passed, errors:(result.errorCategories||[]).slice(0,5), repairDrill:result.repairDrill||'', at:nowIso()});
    progress.submissions = progress.submissions.slice(-60);
    progress = updatePythonProfile(progress, result, level, type);
    if(result.passed){
      addXp(progress, type === 'mid' ? (DB.xpRules.midExamPass||45) : (DB.xpRules.finalExamPass||120));
      addBadge(progress, type === 'mid' ? 'Zwischenprüfung L'+level.level : 'Level '+level.level+' bestanden');
      if(result.score >= 96 && type === 'final'){ addXp(progress, DB.xpRules.perfectFinalBonus||40); addBadge(progress, 'Python Präzision L'+level.level); }
      if(type === 'final'){
        st.status='done';
        var next = nextLevel(level);
        if(next && progress.levels[next.id]){ progress.levels[next.id].status='active'; progress.levels[next.id].unlockedAt=nowIso(); progress.currentLevel=next.id; }
      }
    }
    saveProgress(ensureUnlocks(progress));
    var out = $('pythonQuestAnalysis'); if(out) out.innerHTML = renderAnalysis(result);
    var prev=$('pythonQuestPreview'); if(prev) prev.innerHTML = renderCodePreview(code);
    injectHomeCardSoon();
  }


  function normalizePythonCommentText(text){
    return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_äöüß\s+\-*/=<>!]/gi,' ').replace(/\s+/g,' ').trim();
  }

  function pythonCommentLexicon(){
    return {
      input:['eingabe','abfrage','abfragen','frage','fragen','fragt','einlesen','einliest','einlesen','holen','holt','reinholen','einsammeln','sammeln','erfassen','aufnehmen','eingeben','eintippen','tippen','nutzer','benutzer','user','person','mensch','antwort','antworten','wert rein','kommt rein','wird eingegeben','daten rein','input','input()','prompt','alter holen','name holen','stadt holen'],
      output:['ausgabe','ausgeben','anzeige','anzeigen','zeigt','zeigen','print','print()','meldung','text zeigen','ergebnis zeigen','ergebnis ausgeben','rausgeben','gibt raus','spuckt aus','schreibt raus','kommt raus','sichtbar machen','anzeigen lassen','auf bildschirm','bildschirm','terminal','konsole','antwort zeigen','stellt vor','vorstellen','vorstellung','begruesst','begrüßt','willkommen','kurz vor','programm stellt'],
      variable:['variable','variablen','speichern','speichert','merkt','merken','ablegen','wert','werte','daten','info','information','name','alter','stadt','ziel','zahl','preis','punkte','antwort speichern','zwischen speichern','festhalten','platzhalter'],
      conversion:['umwandeln','umwandlung','konvertieren','konvertierung','zahl machen','zur zahl','text zu zahl','string zu zahl','integer','int','int()','float','float()','datentyp','typ ändern','rechenbar machen','aus text zahl','damit gerechnet werden kann'],
      math:['rechnung','rechnen','berechnen','ausrechnen','addieren','addition','summe','plus','subtraktion','minus','differenz','multiplizieren','multiplikation','mal','teilen','division','geteilt','operator','operatoren','ergebnis','rechner','mini rechner'],
      loop:['schleife','loop','while','for','range','wiederholen','wiederholt','nochmal','solange','bis','stop','stopp','beenden','durchlauf','runde','zaehler','zähler','counter','werte durchgehen','zahlen durchgehen'],
      list:['liste','listen','list','array','einkaufsliste','produkte','namen','werte sammeln','mehrere werte','speichert mehrere','eintrag','einträge','eintraege','append','anhängen','anhaengen','len','länge','laenge','anzahl','index','erster wert','erstes element','punkteliste','punkte liste','notenliste'],
      score:['score','punkte','punktestand','zaehlt punkte','zählt punkte','punkt','gesamtpunkte','gesamt','summe','total','hochzaehlen','hochzählen','plus eins','richtig gibt punkt','punkt dazu','akkumulator','aufsummieren'],
      quiz:['quiz','frage','fragen','antwort','antworten','richtig','falsch','abfrage quiz','testfrage','prueft antwort','prüft antwort','checkt antwort','auswertung quiz'],
      condition:['if','else','elif','wenn','sonst','falls','bedingung','entscheidung','entscheiden','pruefen','prüfen','checken','abchecken','kontrollieren','vergleich','vergleichen','groesser','größer','kleiner','gleich','ungleich','mindestens','hoechstens','höchstens','volljaehrig','volljährig','minderjaehrig','minderjährig','bestanden','nicht bestanden','zugelassen'],
      formatting:['format','formatierung','strukturierte ausgabe','lesbar','schoen','schön','ordentlich','uebersichtlich','übersichtlich','trennlinie','linie','label','beschriftung','profilkarte','karte','farbe','ansi','farbig','reset','layout','optik','sauber anzeigen'],
      structure:['programm','python programm','struktur','aufbau','abschnitt','reihenfolge','erst','danach','dann','am ende','eingabe verarbeitung ausgabe','eingaben','verarbeitung','ausgaben','teil','bereich','block','logisch','sortiert','geordnet','uebersichtlich','übersichtlich','ablauf','programmablauf','schritt'],
      comment:['kommentar','hinweis','erklaert','erklärt','beschreibung','notiz','warum','damit','weil','zweck','sinn','verständnis','verstaendnis','orientierung']
    };
  }

  function wordHit(text, words){
    var t=' '+normalizePythonCommentText(text)+' ';
    return (words||[]).some(function(w){ return t.indexOf(' '+normalizePythonCommentText(w)+' ') >= 0 || t.indexOf(normalizePythonCommentText(w)) >= 0; });
  }

  function pythonLineConcepts(line){
    var l=String(line||'');
    var out=[];
    if(/\binput\s*\(/.test(l)) out.push('input');
    if(/\bprint\s*\(/.test(l)) out.push('output');
    if(/^[a-zA-Z_]\w*\s*=\s*[^=]/.test(l.trim())) out.push('variable');
    if(/\b(punkte|score|gesamt|summe|total)\b|\+=|\bsum\s*\(/i.test(l)) out.push('score');
    if(/quiz|frage|fragen|antwort|richtig|falsch/i.test(l)) out.push('quiz');
    if(/\b(int|float)\s*\(/.test(l)) out.push('conversion');
    if(/[+\-*\/]\s*[^#\n]+/.test(l) && !/^\s*#/.test(l)) out.push('math');
    if(/^\s*(if|elif|else)\b/.test(l)) out.push('condition');
    if(/^\s*(while|for)\b/.test(l) || /\brange\s*\(/.test(l) || /(\+=|-=|=\s*[^=]+[+\-]\s*1)/.test(l)) out.push('loop');
    if(/\[[^\]]*\]/.test(l) || /\.append\s*\(/.test(l) || /\blen\s*\(/.test(l) || /\w+\s*\[\s*\d+\s*\]/.test(l)) out.push('list');
    if(/={3,}|-{3,}|_{3,}|Name\s*:|Alter\s*:|Stadt\s*:|Ziel\s*:|\\033\[/.test(l)) out.push('formatting');
    return out;
  }

  function evaluateCommentQuality(code, level, exam){
    var lines=String(code||'').split(/\r?\n/), lex=pythonCommentLexicon();
    var comments=[];
    lines.forEach(function(line,i){
      var idx=line.indexOf('#');
      if(idx>=0){ comments.push({ text:line.slice(idx+1).trim(), before:line.slice(0,idx), line:i }); }
    });
    if(!comments.length) return {score:0, grade:'rot', count:0, good:0, partial:0, bad:0, misleading:0, issues:['Kein Kommentar vorhanden.'], acceptedSynonyms:0};
    var good=0, partial=0, bad=0, misleading=0, accepted=0, issues=[];
    comments.forEach(function(c){
      var text=normalizePythonCommentText(c.text);
      if(text.length < 3 || /^(test|todo|abc|asdf|hallo|ok|x|egal|bla|blabla|python ist cool)$/i.test(text)){ bad++; issues.push('Kommentar in Zeile '+(c.line+1)+' ist zu leer oder ohne Lernwert.'); return; }
      var groups=[];
      Object.keys(lex).forEach(function(k){ if(wordHit(text, lex[k])) groups.push(k); });
      accepted += groups.length;
      var nearby=[];
      if(c.before && c.before.trim()) nearby=pythonLineConcepts(c.before);
      if(!nearby.length){
        for(var j=c.line+1;j<Math.min(lines.length,c.line+5);j++){
          if(lines[j].trim() && lines[j].trim().indexOf('#')!==0){
            pythonLineConcepts(lines[j]).forEach(function(x){ if(nearby.indexOf(x)<0) nearby.push(x); });
          }
        }
      }
      var genericUseful = c.line===0 || groups.indexOf('structure')>=0 || groups.indexOf('comment')>=0 || groups.indexOf('formatting')>=0;
      var intersects = groups.some(function(g){ return nearby.indexOf(g)>=0 || (g==='output' && nearby.indexOf('print')>=0); });
      var mismatch = false;
      if(groups.indexOf('output')>=0 && nearby.length && nearby.indexOf('output')<0 && nearby.indexOf('formatting')<0) mismatch=true;
      if(groups.indexOf('input')>=0 && nearby.length && nearby.indexOf('input')<0) mismatch=true;
      if(groups.indexOf('math')>=0 && nearby.length && nearby.indexOf('math')<0 && nearby.indexOf('conversion')<0) mismatch=true;
      if(groups.indexOf('condition')>=0 && nearby.length && nearby.indexOf('condition')<0) mismatch=true;
      if(mismatch && !genericUseful){ misleading++; issues.push('Kommentar in Zeile '+(c.line+1)+' passt wahrscheinlich nicht zum Codeabschnitt.'); }
      else if(intersects || genericUseful || groups.length>=2){ good++; }
      else if(groups.length===1){ partial++; issues.push('Kommentar in Zeile '+(c.line+1)+' ist verständlich, aber noch zu allgemein.'); }
      else { bad++; issues.push('Kommentar in Zeile '+(c.line+1)+' enthält keine erkennbare Erklärung zum Code.'); }
    });
    var raw = good*10 + partial*6 + bad*2 - misleading*6;
    var score = Math.max(0, Math.min(10, Math.round(raw/Math.max(1,comments.length))));
    var grade = score>=8 ? 'gruen' : score>=5 ? 'gelb' : 'rot';
    if(good>0) issues.unshift('Sinnvolle Kommentare erkannt. Umgangssprache und Synonyme wurden akzeptiert, wenn der Inhalt gepasst hat.');
    return {score:score, grade:grade, count:comments.length, good:good, partial:partial, bad:bad, misleading:misleading, issues:issues.slice(0,6), acceptedSynonyms:accepted};
  }

  function evaluateProgramStructure(code, level, exam, commentQuality){
    var lines=String(code||'').split(/\r?\n/), nonEmpty=lines.filter(function(l){return l.trim();});
    var issues=[], score=20;
    if(!nonEmpty.length) return {score:0, grade:'rot', issues:['Kein Code vorhanden.'], knockout:true};
    var firstPrint=9999, lastInput=-1, firstInput=9999, lastAssignment=-1;
    nonEmpty.forEach(function(l,i){
      if(/\bprint\s*\(/.test(l)){ firstPrint=Math.min(firstPrint,i); }
      if(/\binput\s*\(/.test(l)){ firstInput=Math.min(firstInput,i); lastInput=Math.max(lastInput,i); }
      if(/^[a-zA-Z_]\w*\s*=\s*[^=]/.test(l.trim())) lastAssignment=Math.max(lastAssignment,i);
    });
    if(lastInput>firstPrint && firstPrint!==9999 && (exam.requiredConcepts||[]).indexOf('score')<0){ score-=4; issues.push('Eingaben kommen nach Ausgaben. Sauberer ist: Eingabe -> Verarbeitung -> Ausgabe.'); }
    if(lastAssignment>firstPrint && firstPrint!==9999 && (level.level||0)>=4 && (exam.requiredConcepts||[]).indexOf('list_loop')<0 && (exam.requiredConcepts||[]).indexOf('score')<0){ score-=3; issues.push('Verarbeitung/Zuweisungen stehen noch nach Ausgaben. Trenne die Abschnitte klarer.'); }
    var badNames=[];
    nonEmpty.forEach(function(l){ var m=l.trim().match(/^([a-zA-Z_]\w*)\s*=/); if(m && /^(a|b|c|x|y|z|xx|test|foo|bar|dings|sache)$/i.test(m[1])) badNames.push(m[1]); });
    if(badNames.length){ var penalty=Math.min(5,badNames.length*2); score-=penalty; issues.push('Unklare Variablennamen erkannt: '+badNames.slice(0,4).join(', ')+'. Nutze sprechende Namen wie alter, zahl1, punktzahl.'); }
    if(nonEmpty.some(function(l){return l.length>110;})){ score-=3; issues.push('Sehr lange Zeilen erschweren das Lesen.'); }
    if(nonEmpty.length>35 && (level.level||0)<8){ score-=3; issues.push('Für dieses Level ist der Code sehr lang. Kürzer und klarer strukturieren.'); }
    if((commentQuality&&commentQuality.score||0)<5){ score-=4; issues.push('Kommentare sind fehlend, zu allgemein oder passen nicht zum Code.'); }
    var hasSectionComment = /#.*(eingabe|input|verarbeitung|rechnung|ausgabe|print|entscheidung|prüfung|pruefung|abschnitt|teil|erst|danach|am ende)/i.test(code);
    if((level.level||0)>=4 && !hasSectionComment){ score-=2; issues.push('Es fehlen strukturierende Kommentare wie Eingabe, Verarbeitung, Ausgabe.'); }
    if((exam&&exam.requiredConcepts||[]).indexOf('if')>=0 && !/^\s*if\s+.+:\s*$/m.test(code)){ score-=2; issues.push('Für Entscheidungslevel muss die if-Struktur klar sichtbar sein.'); }
    score=Math.max(0,Math.min(20,score));
    var grade=score>=16?'gruen':score>=10?'gelb':'rot';
    var knockout = score<8;
    if(!issues.length) issues.push('Programmstruktur ist für dieses Level sauber: Reihenfolge, Namen und Lesbarkeit passen.');
    return {score:score, grade:grade, issues:issues.slice(0,7), knockout:knockout};
  }


  function normalizedTokensForSimilarity(text){
    return String(text||'').toLowerCase().replace(/#.*$/gm,' ').replace(/[^a-z0-9_äöüß]+/gi,' ').split(/\s+/).filter(function(x){ return x && x.length>1; });
  }
  function codeSimilarity(a,b){
    var A=normalizedTokensForSimilarity(a), B=normalizedTokensForSimilarity(b);
    if(!A.length || !B.length) return 0;
    var setB={}; B.forEach(function(x){setB[x]=true;});
    var hit=0; A.forEach(function(x){ if(setB[x]) hit++; });
    return Math.round(hit/Math.max(A.length,B.length)*100)/100;
  }
  function evaluateReflectionQuality(reflection, code, level){
    var text=normalizePythonCommentText(reflection||''), lex=pythonCommentLexicon();
    var groups=[];
    Object.keys(lex).forEach(function(k){ if(wordHit(text, lex[k])) groups.push(k); });
    var minLen=(level&&level.level||1)>=5?45:25;
    var score=0, issues=[];
    if(!text){ issues.push('Kein Verständnisnachweis geschrieben.'); }
    else {
      if(text.length>=minLen) score+=2; else issues.push('Erklärung ist noch sehr kurz.');
      if(groups.length>=2) score+=2; else issues.push('Erklärung nennt zu wenige passende Code-Ideen.');
      if(/warum|weil|damit|deshalb|sonst|brauche|nutze|check|prüf|pruef/i.test(reflection||'')) score+=1; else issues.push('Erkläre kurz, warum ein Befehl nötig ist.');
      if((level&&level.level||0)>=4 && !/(int|float|zahl|umwand|konvert|rechnen|rechnung)/i.test(reflection||'')) issues.push('Bei diesem Level sollte die Erklärung Datentyp/Rechnung erwähnen, wenn es relevant ist.');
      if((level&&level.level||0)>=5 && !/(if|else|elif|wenn|sonst|bedingung|entscheidung|prüf|check|vergleich)/i.test(reflection||'')) issues.push('Bei Entscheidungsleveln sollte die Erklärung die Bedingung/Entscheidung erwähnen.');
      if((level&&level.level||0)>=6 && (level&&level.level||0)<7 && !/(while|schleife|wiederhol|stop|ende|zähler|zaehler|läuft|laeuft)/i.test(reflection||'')) issues.push('Bei Schleifenleveln sollte die Erklärung Schleife, Wiederholung oder Ausstieg erwähnen.');
      if((level&&level.level||0)>=7 && (level&&level.level||0)<8 && !/(for|range|schleife|runde|zahlen|werte|durchlauf|wiederhol)/i.test(reflection||'')) issues.push('Bei for-Leveln sollte die Erklärung for/range oder feste Wiederholung erwähnen.');
      if((level&&level.level||0)>=8 && (level&&level.level||0)<10 && !/(liste|listen|append|len|index|eintrag|element|werte|mehrere|einkauf|punkte|summe|durchschnitt|for)/i.test(reflection||'')) issues.push('Bei Listenleveln sollte die Erklärung Liste, Einträge, Durchlauf oder Auswertung erwähnen.');
      if((level&&level.level||0)>=10 && !/(quiz|frage|antwort|punkte|score|richtig|falsch|if|prüf|check)/i.test(reflection||'')) issues.push('Bei Quizleveln sollte die Erklärung Fragen, Antwortprüfung oder Punktestand erwähnen.');
    }
    score=clamp(score,0,5);
    var grade=score>=4?'gruen':(score>=2?'gelb':'rot');
    var note=score>=4?'Erklärung passt zum Code und zeigt eigenes Verständnis.':(score>=2?'Erklärung ist teilweise brauchbar, aber noch zu dünn.':'Erklärung fehlt oder zeigt noch zu wenig Verständnis.');
    return {score:score, grade:grade, groups:groups.slice(0,6), issues:issues.slice(0,5), note:note};
  }

  function analysisCore(payload){
    var code = String(payload.code || '');
    var level = payload.level || {};
    var exam = payload.exam || {};
    var examType = payload.examType || 'final';
    var reflection = String(payload.reflection || '');
    var referenceCode = String(payload.referenceCode || '');
    var errors = [], strengths = [], improvements = [], errorCategories = [];
    var lines = code.split(/\r?\n/);
    var nonEmpty = lines.filter(function(l){ return l.trim(); });
    var printCount = (code.match(/\bprint\s*\(/g)||[]).length;
    var assignmentCount = nonEmpty.filter(function(l){ return /^[a-zA-Z_]\w*\s*=\s*[^=]/.test(l.trim()); }).length;
    var commentCount = nonEmpty.filter(function(l){ return l.trim().indexOf('#') === 0 || /\s#/.test(l); }).length;
    var fStringCount = (code.match(/(^|[^a-zA-Z0-9_])f["']/g)||[]).length;
    var inputCount = (code.match(/\binput\s*\(/g)||[]).length;
    var intCount = (code.match(/\bint\s*\(/g)||[]).length;
    var floatCount = (code.match(/\bfloat\s*\(/g)||[]).length;
    var conversionCount = intCount + floatCount;
    var mathOperatorCount = (code.match(/[+\-*\/]/g)||[]).length;
    var whileCount = (code.match(/^\s*while\s+.+:\s*$/gm)||[]).length;
    var forCount = (code.match(/^\s*for\s+\w+\s+in\s+.+:\s*$/gm)||[]).length;
    var rangeCount = (code.match(/\brange\s*\(/g)||[]).length;
    var listLiteralCount = (code.match(/=\s*\[[^\]]*\]/g)||[]).length;
    var appendCount = (code.match(/\.append\s*\(/g)||[]).length;
    var lenCount = (code.match(/\blen\s*\(/g)||[]).length;
    var indexAccessCount = (code.match(/\w+\s*\[\s*\d+\s*\]/g)||[]).length;
    var multiListCount = (code.match(/=\s*\[[^\]]*,[^\]]*\]/g)||[]).length;
    var listLoopCount = (code.match(/^\s*for\s+\w+\s+in\s+(?!range\s*\()[a-zA-Z_]\w*\s*:\s*$/gm)||[]).length;
    var accumulatorCount = (code.match(/(\+=|\bsum\s*\(|\bgesamt\s*=|\bsumme\s*=|\btotal\s*=)/gi)||[]).length;
    var scoreUpdateCount = (code.match(/\b(punkte|score|punktestand)\b[^\n]*(\+=|=\s*[^=]+\+\s*1)/gi)||[]).length;
    var quizQuestionCount = Math.max(inputCount, ((code.match(/\?["']|fragen\s*=\s*\[[^\]]*,[^\]]*,[^\]]*/gi)||[]).length), ((code.match(/fragen\s*=\s*\[[^\]]*,[^\]]*,[^\]]*/i)||[]).length?3:0));
    var ansiCount = (code.match(/\\033\[[0-9;]*m|\x1b\[[0-9;]*m|\u001b\[[0-9;]*m/g)||[]).length;
    var resetCount = (code.match(/\\033\[0m|\x1b\[0m|\u001b\[0m/g)||[]).length;
    var forbidden = (exam.forbiddenTokens||[]).filter(function(t){ return code.indexOf(t) >= 0; });
    var required = exam.requiredConcepts || level.concepts || [];
    var commentQuality = evaluateCommentQuality(code, level, exam);
    var structureQuality = evaluateProgramStructure(code, level, exam, commentQuality);
    var reflectionQuality = evaluateReflectionQuality(reflection, code, level);
    var similarityToReference = referenceCode ? codeSimilarity(code, referenceCode) : 0;
    function addErr(cat,msg){ errors.push(msg); if(errorCategories.indexOf(cat+': '+msg)<0) errorCategories.push(cat+': '+msg); }
    function hasConcept(name){
      if(name === 'print') return printCount > 0;
      if(name === 'comment') return commentQuality.score >= 5;
      if(name === 'variable') return assignmentCount > 0;
      if(name === 'f_string') return fStringCount > 0;
      if(name === 'ansi_color') return ansiCount > 0;
      if(name === 'formatting') return /={3,}|-{3,}|_{3,}|Name\s*:|Ziel\s*:|Alter\s*:|Stadt\s*:/i.test(code) || printCount >= 4;
      if(name === 'input') return /\binput\s*\(/.test(code);
      if(name === 'int') return /\bint\s*\(/.test(code);
      if(name === 'float') return /\bfloat\s*\(/.test(code);
      if(name === 'type_conversion') return conversionCount > 0;
      if(name === 'operators') return /[+\-*\/]/.test(code);
      if(name === 'if') return /^\s*if\s+.+:\s*$/m.test(code);
      if(name === 'else') return /^\s*else\s*:\s*$/m.test(code);
      if(name === 'elif') return /^\s*elif\s+.+:\s*$/m.test(code);
      if(name === 'comparison') return /(>=|<=|==|!=|>|<)/.test(code);
      if(name === 'indentation') return /^\s{2,}\S+/m.test(code);
      if(name === 'condition') return /^\s*(if|elif|else|while|for)\b/m.test(code);
      if(name === 'while') return whileCount > 0;
      if(name === 'for') return forCount > 0;
      if(name === 'range') return rangeCount > 0;
      if(name === 'iteration') return forCount > 0 || whileCount > 0;
      if(name === 'list') return listLiteralCount > 0;
      if(name === 'append') return appendCount > 0;
      if(name === 'len') return lenCount > 0;
      if(name === 'index') return indexAccessCount > 0;
      if(name === 'list_loop') return listLoopCount > 0;
      if(name === 'accumulator') return accumulatorCount > 0;
      if(name === 'score') return scoreUpdateCount > 0 || /\b(punkte|score|punktestand)\s*=\s*0/i.test(code);
      if(name === 'quiz') return quizQuestionCount > 0;
      return code.toLowerCase().indexOf(String(name).toLowerCase()) >= 0;
    }
    if(!code.trim()) addErr('Aufgabenverfehlung','Kein Code vorhanden.');
    if(forbidden.length) addErr('Sicherheitsfehler','Unsichere/verbotene Befehle gefunden: '+forbidden.join(', '));
    var quoteCount1 = (code.match(/"/g)||[]).length, quoteCount2 = (code.match(/'/g)||[]).length;
    if(quoteCount1 % 2 !== 0 || quoteCount2 % 2 !== 0) addErr('Syntaxfehler','Anführungszeichen sind vermutlich nicht geschlossen.');
    var openParen = (code.match(/\(/g)||[]).length, closeParen=(code.match(/\)/g)||[]).length;
    if(openParen !== closeParen) addErr('Syntaxfehler','Klammern sind nicht ausgeglichen.');
    var colonIssues = nonEmpty.filter(function(l){ return /^\s*(if|else|elif|for|while|def|class)\b/.test(l) && !/:\s*(#.*)?$/.test(l); });
    if(colonIssues.length) addErr('Syntaxfehler','Doppelpunkt fehlt vermutlich bei: '+colonIssues[0].trim());
    if(printCount <= 0) addErr('Aufgabenverfehlung','Es fehlt mindestens eine print()-Ausgabe.'); else strengths.push(printCount+' print()-Ausgabe(n) erkannt.');
    if(assignmentCount <= 0) addErr('Variablenfehler','Es wurde keine klare Variable mit = erkannt.'); else strengths.push(assignmentCount+' Variable/Zuweisung(en) erkannt.');
    if(commentCount <= 0) improvements.push('Füge mindestens einen erklärenden Kommentar mit # hinzu.'); else if(commentQuality.score >= 8) strengths.push('Sinnvolle Kommentare erkannt.'); else improvements.push('Kommentare sind vorhanden, aber inhaltlich noch zu schwach oder zu allgemein.');
    if(reflectionQuality.score >= 4) strengths.push('Verständnisnachweis passt: '+reflectionQuality.note); else improvements.push('Verständnisnachweis verbessern: '+reflectionQuality.note);
    (reflectionQuality.issues||[]).forEach(function(x){ if(improvements.indexOf(x)<0) improvements.push(x); });
    if(similarityToReference >= 0.82 && reflectionQuality.score < 4) addErr('Eigenständigkeit','Code ähnelt der Demo stark. Erkläre den Ablauf in eigenen Worten, bevor das Level freigeschaltet wird.');
    (commentQuality.issues||[]).forEach(function(x){ if(improvements.indexOf(x)<0 && strengths.indexOf(x)<0){ (commentQuality.score>=8?strengths:improvements).push(x); } });
    if(structureQuality.score >= 16) strengths.push('Saubere Programmstruktur erkannt.'); else improvements.push('Programmstruktur verbessern: '+(structureQuality.issues||[])[0]);
    (structureQuality.issues||[]).slice(1,4).forEach(function(x){ if(improvements.indexOf(x)<0 && strengths.indexOf(x)<0) improvements.push(x); });
    if(fStringCount > 0) strengths.push(fStringCount+' f-String(s) erkannt.');
    if(ansiCount > 0) strengths.push('ANSI-Farbcode erkannt.');
    if(ansiCount > 0 && resetCount === 0) improvements.push('ANSI-Farbe erkannt, aber Reset \\033[0m fehlt wahrscheinlich.');
    if((level.id === 'py_level_04' || level.id === 'py_level_05' || required.indexOf('type_conversion') >= 0 || required.indexOf('int') >= 0) && inputCount >= 2 && conversionCount < 2) addErr('Datentypfehler','Du fragst Eingaben ab, wandelst aber nicht beide Werte mit int() oder float() um.');
    if((level.id === 'py_level_04' || required.indexOf('operators') >= 0) && conversionCount === 0 && /input\s*\([^\n]+\+/.test(code)) improvements.push('Achtung: input() plus input() verbindet Text. Nutze int(input(...)) oder float(input(...)).');
    if(nonEmpty.some(function(l){ return l.length > 110; })) improvements.push('Einige Zeilen sind sehr lang. Teile sie besser auf.');
    if(nonEmpty.some(function(l){ return /print\s*\([^"'a-zA-Z0-9_#]/.test(l); })) improvements.push('Prüfe print(): Text braucht Anführungszeichen, Variablen nicht.');
    if(required.indexOf('if') >= 0 && /if\s+[^:\n]*[^=!<>]=[^=]/.test(code)) addErr('Logikfehler','In einer if-Bedingung wurde vermutlich = statt == verwendet.');
    if(required.indexOf('comparison') >= 0 && /alter\s*>\s*18/.test(code)) improvements.push('Grenzwert prüfen: Wenn 18 schon volljährig ist, brauchst du >= 18 statt > 18.');
    if(required.indexOf('for') >= 0 && forCount <= 0) addErr('Aufgabenverfehlung','Es fehlt eine for-Schleife.');
    if(required.indexOf('range') >= 0 && rangeCount <= 0) addErr('Aufgabenverfehlung','range() fehlt.');
    if(required.indexOf('list') >= 0 && listLiteralCount <= 0) addErr('Aufgabenverfehlung','Es fehlt eine echte Liste mit eckigen Klammern.');
    if(required.indexOf('append') >= 0 && appendCount <= 0 && multiListCount <= 0) addErr('Aufgabenverfehlung','append() oder mehrere Listenelemente fehlen.');
    if(required.indexOf('len') >= 0 && lenCount <= 0) addErr('Aufgabenverfehlung','len() fehlt.');
    if(required.indexOf('index') >= 0 && indexAccessCount <= 0) addErr('Aufgabenverfehlung','Indexzugriff fehlt.');
    if(required.indexOf('list_loop') >= 0 && listLoopCount <= 0) addErr('Aufgabenverfehlung','Es fehlt eine for-Schleife, die direkt über eine Liste läuft.');
    if(required.indexOf('accumulator') >= 0 && accumulatorCount <= 0) addErr('Aufgabenverfehlung','Es fehlt eine Auswertung mit Akkumulator oder sum().');
    if(required.indexOf('score') >= 0 && scoreUpdateCount <= 0) addErr('Aufgabenverfehlung','Der Punktestand wird nicht erkennbar erhöht.');
    var conceptHits = 0;
    required.forEach(function(c){ if(hasConcept(c)) conceptHits += 1; else improvements.push('Pflichtkonzept fehlt oder ist nicht klar sichtbar: '+c); });
    var testCases = exam.testCases || [];
    var testResults = testCases.map(function(tc){
      var ok = false;
      if(tc.type === 'static') ok = new RegExp(tc.pattern).test(code) === (tc.expected !== false);
      else if(tc.type === 'count_assignment') ok = assignmentCount >= Number(tc.min||1);
      else if(tc.type === 'count_print') ok = printCount >= Number(tc.min||1);
      else if(tc.type === 'count_f_string') ok = fStringCount >= Number(tc.min||1);
      else if(tc.type === 'count_input') ok = inputCount >= Number(tc.min||1);
      else if(tc.type === 'count_conversion') ok = conversionCount >= Number(tc.min||1);
      else if(tc.type === 'count_math_operator') ok = mathOperatorCount >= Number(tc.min||1);
      else if(tc.type === 'count_while') ok = whileCount >= Number(tc.min||1);
      else if(tc.type === 'count_for') ok = forCount >= Number(tc.min||1);
      else if(tc.type === 'count_range') ok = rangeCount >= Number(tc.min||1);
      else if(tc.type === 'count_list_literal') ok = listLiteralCount >= Number(tc.min||1);
      else if(tc.type === 'count_append') ok = appendCount >= Number(tc.min||1);
      else if(tc.type === 'count_len') ok = lenCount >= Number(tc.min||1);
      else if(tc.type === 'count_index_access') ok = indexAccessCount >= Number(tc.min||1);
      else if(tc.type === 'append_or_multi_list') ok = appendCount >= Number(tc.min||1) || multiListCount >= Number(tc.min||1);
      else if(tc.type === 'count_list_loop') ok = listLoopCount >= Number(tc.min||1);
      else if(tc.type === 'accumulator_or_sum') ok = accumulatorCount >= Number(tc.min||1);
      else if(tc.type === 'len_or_sum') ok = lenCount >= Number(tc.min||1) || /\bsum\s*\(/.test(code);
      else if(tc.type === 'score_update') ok = scoreUpdateCount >= Number(tc.min||1);
      else if(tc.type === 'quiz_questions') ok = quizQuestionCount >= Number(tc.min||1);
      else if(tc.type === 'comment_quality') ok = commentQuality.score >= Number(tc.min||5);
      else if(tc.type === 'structure_min') ok = structureQuality.score >= Number(tc.min||10);
      else if(tc.type === 'concept') ok = hasConcept(tc.concept);
      else ok = true;
      return {name:tc.name||'', passed:!!ok};
    });
    var failedTests = testResults.filter(function(t){ return !t.passed; });
    failedTests.forEach(function(t){ improvements.push('Testfall nicht erfüllt: '+t.name); });
    var syntaxScore = errors.some(function(e){return /Klammern|Anführungszeichen|Doppelpunkt/.test(e);}) ? 8 : 20;
    var conceptScore = Math.round((conceptHits / Math.max(1, required.length)) * 20);
    var testRatio = testResults.length ? (testResults.length - failedTests.length) / testResults.length : 1;
    var logicScore = Math.round(25 * testRatio);
    if(examType === 'final' && printCount >= 3 && assignmentCount >= 2) logicScore = Math.max(logicScore,18);
    if(examType === 'mid' && printCount >= 2 && assignmentCount >= 2) logicScore = Math.max(logicScore,18);
    logicScore = clamp(logicScore,0,25);
    var structureScore = structureQuality.score;
    var readabilityScore = nonEmpty.length && nonEmpty.length <= 28 ? 10 : 7;
    if(nonEmpty.some(function(l){return l.length > 110;})) readabilityScore -= 3;
    if(hasConcept('formatting')) readabilityScore = Math.min(10, readabilityScore + 1);
    readabilityScore = clamp(readabilityScore,0,10);
    var commentScore = Math.round(commentQuality.score / 10 * 5);
    var reflectionScore = reflectionQuality.score;
    var score = clamp(syntaxScore + conceptScore + Math.round(logicScore * 20 / 25) + structureScore + readabilityScore + commentScore + reflectionScore - forbidden.length*20, 0, 100);
    var needed = Number(exam.requiredScore || level.requiredScore || 85);
    var knockoutReasons=[];
    errors.forEach(function(e){ if(/Kein Code|verbotene|keine print|keine klare Variable|keine Variable|nicht beide Werte|for-Schleife|range\(\)|Liste|append\(\)|len\(\)|Indexzugriff|Akkumulator|Punktestand|Antwortprüfung|Eigenständigkeit/i.test(e)) knockoutReasons.push(e); });
    if(structureQuality.knockout) knockoutReasons.push('Struktur unter Mindestgrenze.');
    if(required.indexOf('comment')>=0 && commentQuality.score < 3) knockoutReasons.push('Kommentarqualität unter Mindestgrenze.');
    if(similarityToReference >= 0.82 && reflectionQuality.score < 4) knockoutReasons.push('Demo-Ähnlichkeit ohne ausreichende eigene Erklärung.');
    var knockout = knockoutReasons.length > 0;
    var passed = score >= needed && !knockout && failedTests.length === 0;
    if(!strengths.length) strengths.push('Noch keine belastbare Stärke erkannt, weil zu wenig Code vorhanden ist.');
    if(!improvements.length) improvements.push('Für dieses Level passend. Nächster Qualitätshebel: sprechendere Variablennamen und bewusst kurze Ausgaben.');
    var repairDrill = '';
    if(failedTests.length) repairDrill = 'Baue eine Mini-Version nur für den fehlenden Testfall: '+failedTests[0].name+'.';
    else if(errors.length) repairDrill = 'Korrigiere zuerst den ersten K.O.-Fehler und analysiere erneut.';
    else repairDrill = 'Erweitere dein Programm um eine zusätzliche, klar beschriftete Ausgabe.';
    return { passed:passed, score:score, requiredScore:needed, errors:errors, strengths:strengths, improvements:improvements, errorCategories:errorCategories, testResults:testResults, rubricScores:{syntax:syntaxScore, concepts:conceptScore, logic:Math.round(logicScore * 20 / 25), structure:structureScore, readability:readabilityScore, reflection:reflectionScore, comments:commentScore}, summary: passed ? 'Code-Coach: Die Level-Anforderungen sind erfüllt. Freischaltung ist gerechtfertigt.' : 'Code-Coach: Die Abgabe ist noch nicht stabil genug für die Freischaltung.', nextStep: passed ? 'Nächstes Level öffnen und den Anspruch kontrolliert erhöhen.' : 'Korrigiere die markierten Punkte und reiche erneut ein. Arbeite zuerst K.O.-Fehler und fehlende Testfälle ab.', repairDrill:repairDrill, checkedAt:nowIso(), engine:'PythonQuest local rule coach v10.5.0', levelId:level.id || payload.levelId || '', examType:examType, knockoutReasons:knockoutReasons, diagnostics:{ commentQuality:commentQuality, structureQuality:structureQuality, reflectionQuality:reflectionQuality, similarityToReference:similarityToReference, printCount:printCount, assignmentCount:assignmentCount, commentCount:commentCount, fStringCount:fStringCount, inputCount:inputCount, ansiCount:ansiCount, resetCount:resetCount, intCount:intCount, floatCount:floatCount, conversionCount:conversionCount, mathOperatorCount:mathOperatorCount, whileCount:whileCount, forCount:forCount, rangeCount:rangeCount, listLiteralCount:listLiteralCount, appendCount:appendCount, lenCount:lenCount, indexAccessCount:indexAccessCount, multiListCount:multiListCount, listLoopCount:listLoopCount, accumulatorCount:accumulatorCount, scoreUpdateCount:scoreUpdateCount, quizQuestionCount:quizQuestionCount, conceptHits:conceptHits, requiredConcepts:required, testCases:testCases } };
  }
  function localAnalyze(payload){ return analysisCore(payload); }

  function wireDynamic(){
    var file = $('pythonQuestFile');
    var code = $('pythonQuestCode');
    var preview = $('pythonQuestPreview');
    function syncPreview(){ if(preview && code) preview.innerHTML = renderCodePreview(code.value); }
    if(code && !code.__wired){ code.__wired=true; code.addEventListener('input', syncPreview); syncPreview(); }
    if(file && !file.__wired){
      file.__wired = true;
      file.addEventListener('change', function(){
        var f = file.files && file.files[0]; if(!f) return;
        if(!/\.(py|txt)$/i.test(f.name)){ alert('Bitte nur .py oder .txt hochladen.'); file.value=''; return; }
        var reader = new FileReader();
        reader.onload = function(){ var el=$('pythonQuestCode'); if(el){ el.value = String(reader.result || ''); } var prev=$('pythonQuestPreview'); if(prev) prev.innerHTML = renderCodePreview(String(reader.result || '')); };
        reader.readAsText(f);
      });
    }
  }

  function handleAction(el){
    var action = el.getAttribute('data-py-action');
    if(action === 'close') return close();
    if(action === 'dashboard'){ activeView.screen='dashboard'; return render(); }
    if(action === 'roadmap'){ activeView.screen='roadmap'; return render(); }
    if(action === 'open-level'){ activeView.screen='level'; activeView.levelId=el.getAttribute('data-level') || 'py_level_01'; return render(); }
    if(action === 'open-exam'){ activeView.screen='exam'; activeView.levelId=el.getAttribute('data-level') || 'py_level_01'; activeView.examType=el.getAttribute('data-type') || 'final'; return render(); }
    if(action === 'load-demo-code'){ var code=$('pythonQuestCode'); if(code){ code.value = demoCode(el.getAttribute('data-level') || activeView.levelId, el.getAttribute('data-type') || activeView.examType); } var prev=$('pythonQuestPreview'); if(prev && code) prev.innerHTML = renderCodePreview(code.value); return; }
    if(action === 'analyze-code'){ activeView.levelId=el.getAttribute('data-level') || activeView.levelId; activeView.examType=el.getAttribute('data-type') || activeView.examType; return analyzeCode(levelById(activeView.levelId), activeView.examType); }
    if(action === 'lesson-done') return markDone('lesson', el.getAttribute('data-level'), el.getAttribute('data-id'));
    if(action === 'practice-done') return markDone('practice', el.getAttribute('data-level'), el.getAttribute('data-id'));
    if(action === 'repair-done') return markRepairDone(el.getAttribute('data-id'));
    if(action === 'mc-answer') return answerMc(el);
    if(action === 'open-coach'){ if(window.BPSLearningCoach && typeof window.BPSLearningCoach.openHub === 'function') window.BPSLearningCoach.openHub(); else alert('Coach ist noch nicht geladen.'); return; }
  }
  function markDone(type, levelId, id){
    var p=readProgress(), st=levelState(p,levelId);
    if(type === 'lesson' && !st.lessonDone[id]){ st.lessonDone[id]=true; addXp(p, DB.xpRules.lesson || 10); }
    if(type === 'practice' && !st.practiceDone[id]){ st.practiceDone[id]=true; addXp(p, DB.xpRules.practiceDone || 15); }
    saveProgress(ensureUnlocks(p)); render();
  }
  function answerMc(el){
    var level=levelById(el.getAttribute('data-level')); if(!level) return;
    var q=(level.checks||[]).filter(function(x){return x.id===el.getAttribute('data-id');})[0]; if(!q) return;
    var idx=Number(el.getAttribute('data-index'));
    var p=readProgress(), st=levelState(p,level.id);
    st.checksDone = st.checksDone || {};
    var first = !st.checksDone[q.id];
    st.checksDone[q.id] = {correct:idx===q.correct, answer:idx, at:nowIso()};
    if(idx===q.correct && first){ addXp(p, DB.xpRules.mcCorrect || 8); }
    saveProgress(p);
    render();
  }

  function markRepairDone(id){
    var p=readProgress();
    (p.repairQueue||[]).forEach(function(t){ if(t.id===id){ t.done=true; t.doneAt=nowIso(); addXp(p, 12); } });
    saveProgress(p);
    render();
  }

  function injectHomeCardSoon(){}
  function injectHomeCard(){}
  function init(){
    if(injected) return window.PythonQuest;
    injected = true;
    ensureShell();
    document.addEventListener('click', function(ev){ var el=ev.target.closest('[data-py-action]'); if(el){ ev.preventDefault(); handleAction(el); } });
    injectHomeCardSoon();
    var mo = new MutationObserver(function(){ injectHomeCardSoon(); });
    try{ mo.observe(document.body,{childList:true,subtree:true}); }catch(e){}
    return window.PythonQuest;
  }

  window.PythonQuest = { version:VERSION, init:init, open:open, close:close, render:render, progress:readProgress, analyze:localAnalyze, db:function(){ return DB; }, reset:function(){ localStorage.removeItem(STORAGE_KEY); render(); } };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
