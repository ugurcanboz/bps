/* BPS-Trainer V9.3.0 · Learning Coach V2 Premium Engine
   Offline-first Coach: Wissensbasis + Memory + Adaptive Task DNA + Session Director. */
(function(){
  'use strict';

  var VERSION = '9.5.8-phase-c-premium-ux-polish';
  var STORAGE_KEY = 'bps_learning_coach_v2_memory';
  var SESSION_KEY = 'bps_learning_coach_v2_session';
  var STRONG_THRESHOLD = 7;
  var RELATED_THRESHOLD = 4;
  var STOP = {
    'was':1,'ist':1,'sind':1,'der':1,'die':1,'das':1,'ein':1,'eine':1,'einen':1,'einem':1,'einer':1,
    'und':1,'oder':1,'wie':1,'wo':1,'warum':1,'wieso':1,'weshalb':1,'bitte':1,'mir':1,'mich':1,'zu':1,
    'von':1,'im':1,'in':1,'am':1,'an':1,'auf':1,'für':1,'fur':1,'mit':1,'ohne':1,'thema':1,'erklär':1,
    'erklar':1,'erklaer':1,'erkläre':1,'hilfe':1,'brauch':1,'brauche':1,'mal':1,'einfach':1,'ich':1,'du':1
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
  function tokenize(value){ return normalize(value).split(/\s+/).filter(function(w){ return w && w.length >= 2 && !STOP[w]; }); }
  function stripHtml(value){
    if(typeof document === 'undefined') return String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    var div = document.createElement('div');
    div.innerHTML = String(value || '');
    return (div.textContent || div.innerText || '').replace(/\s+/g,' ').trim();
  }
  function knowledge(){ return Array.isArray(window.BPS_COACH_KNOWLEDGE_BASE) ? window.BPS_COACH_KNOWLEDGE_BASE : []; }
  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';} }
  function todayKey(){ try{return new Date().toISOString().slice(0,10);}catch(e){return 'today';} }
  function weekKey(date){
    try{
      var d = date ? new Date(date) : new Date();
      var tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      var day = tmp.getUTCDay() || 7;
      tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
      var yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
      var week = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
      return tmp.getUTCFullYear() + '-W' + String(week).padStart(2,'0');
    }catch(e){ return 'week'; }
  }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function shuffle(arr){ return arr.slice().sort(function(){ return Math.random() - 0.5; }); }
  function uid(prefix){ return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,7); }

  var PERSONALITIES = {
    motivating:{ id:'motivating', title:'Motivierend', cue:'ruhiger Push', good:'Stark.', bad:'Kein Drama.', style:'positiv und direkt' },
    strict:{ id:'strict', title:'Streng', cue:'Prüfungsdruck', good:'Sauber. Weiter.', bad:'Fehler erkannt. Korrigieren.', style:'knapp und fordernd' },
    calm:{ id:'calm', title:'Ruhig', cue:'Stress runter', good:'Das war sauber.', bad:'Wir sortieren den Fehler.', style:'ruhig und erklärend' },
    exam:{ id:'exam', title:'Prüfungsnah', cue:'BPS/CTC Fokus', good:'Prüfungsnah richtig.', bad:'Prüfungsfalle erkannt.', style:'strategisch' }
  };
  function personality(memory){ var id = memory && memory.preferences && memory.preferences.personality || 'motivating'; return PERSONALITIES[id] || PERSONALITIES.motivating; }
  function setPersonality(id){ var m = readMemory(); if(!PERSONALITIES[id]) id='motivating'; m.preferences = m.preferences || {}; m.preferences.personality = id; saveMemory(m); return personality(m); }
  function coachTone(text, type){
    var p = personality(readMemory());
    if(!text) return text;
    text = String(text).replace(/\s+/g,' ').trim();
    if(p.id === 'strict'){
      if(type === 'bad') return text.replace(/^Nicht schlimm\.?\s*/,'').replace(/^Guter Trainingsfehler:/,'Fehler sauber erkannt:');
      if(type === 'good') return text.replace(/^Stark\.?/,'Sauber.').replace(/^Richtig gelöst\.?/,'Richtig.');
      return text;
    }
    if(p.id === 'calm'){
      if(type === 'bad') return 'Kurz sortieren: ' + text.replace(/^Fehler gespeichert\.?\s*/,'');
      if(type === 'good') return text.replace(/^Stark\.?/,'Sehr gut.');
      return text;
    }
    if(p.id === 'exam'){
      if(type === 'good') return text + ' Genau solche Treffer zählen unter Prüfungsdruck.';
      if(type === 'bad') return text + ' Wichtig ist jetzt: Fehlerart erkennen, nicht ärgern.';
    }
    return text;
  }
  function humanLine(lines){ lines = (Array.isArray(lines)?lines:[]).filter(Boolean); return lines.length ? pick(lines) : ''; }
  function cleanCount(value, fallback, min, max){ value = parseInt(value,10); if(!isFinite(value)) value = fallback; return clamp(value, min, max); }
  function safeJsonParse(raw, fallback){ try{ var data = JSON.parse(raw); return data && typeof data === 'object' ? data : fallback; }catch(e){ return fallback; } }

  function defaultMemory(){
    return {
      version: VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      totals: { answered:0, correct:0, generatedAnswered:0, generatedCorrect:0, streak:0, bestStreak:0 },
      categories: {},
      mistakes: {},
      recentSignatures: [],
      recentTasks: [],
      dopamine: [],
      daily: {},
      mood: 'neutral',
      sessions: [],
      preferences: { personality:'motivating' },
      achievements: [],
      dailyChallenges: {},
      mistakeDNA: {},
      weekly: {},
      skillStats: {},
      spacedQueue: [],
      decisionLog: [],
      dnaStats: { normalized:0, inferred:0, missing:0 },
      preciseMistakes: [],
      learningCurve: { daily:[], predictions:{} },
      errorPathStats: {},
      learningPath: { lastPlan:null, history:[] },
      examSections: {},
      mastery: {},
      distractorEvidence: {},
      revengeOutcomes: []
    };
  }
  function readMemory(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultMemory();
      var data = JSON.parse(raw);
      if(!data || typeof data !== 'object') return defaultMemory();
      data.totals = data.totals || defaultMemory().totals;
      data.categories = data.categories || {};
      data.mistakes = data.mistakes || {};
      data.recentSignatures = Array.isArray(data.recentSignatures) ? data.recentSignatures : [];
      data.recentTasks = Array.isArray(data.recentTasks) ? data.recentTasks : [];
      data.dopamine = Array.isArray(data.dopamine) ? data.dopamine : [];
      data.daily = data.daily && typeof data.daily === 'object' ? data.daily : {};
      data.sessions = Array.isArray(data.sessions) ? data.sessions : [];
      data.preferences = data.preferences && typeof data.preferences === 'object' ? data.preferences : { personality:'motivating' };
      data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
      data.dailyChallenges = data.dailyChallenges && typeof data.dailyChallenges === 'object' ? data.dailyChallenges : {};
      data.mistakeDNA = data.mistakeDNA && typeof data.mistakeDNA === 'object' ? data.mistakeDNA : {};
      data.weekly = data.weekly && typeof data.weekly === 'object' ? data.weekly : {};
      data.skillStats = data.skillStats && typeof data.skillStats === 'object' ? data.skillStats : {};
      data.spacedQueue = Array.isArray(data.spacedQueue) ? data.spacedQueue : [];
      data.decisionLog = Array.isArray(data.decisionLog) ? data.decisionLog : [];
      data.dnaStats = data.dnaStats && typeof data.dnaStats === 'object' ? data.dnaStats : { normalized:0, inferred:0, missing:0 };
      data.preciseMistakes = Array.isArray(data.preciseMistakes) ? data.preciseMistakes : [];
      data.learningCurve = data.learningCurve && typeof data.learningCurve === 'object' ? data.learningCurve : { daily:[], predictions:{} };
      data.errorPathStats = data.errorPathStats && typeof data.errorPathStats === 'object' ? data.errorPathStats : {};
      data.learningPath = data.learningPath && typeof data.learningPath === 'object' ? data.learningPath : { lastPlan:null, history:[] };
      data.examSections = data.examSections && typeof data.examSections === 'object' ? data.examSections : {};
      data.mastery = data.mastery && typeof data.mastery === 'object' ? data.mastery : {};
      data.distractorEvidence = data.distractorEvidence && typeof data.distractorEvidence === 'object' ? data.distractorEvidence : {};
      data.revengeOutcomes = Array.isArray(data.revengeOutcomes) ? data.revengeOutcomes : [];
      return data;
    }catch(e){ return defaultMemory(); }
  }
  function saveMemory(memory){
    try{ memory.updatedAt = nowIso(); localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); }catch(e){}
    return memory;
  }
  function getCategory(memory, name){
    name = name || 'Allgemein';
    if(!memory.categories[name]) memory.categories[name] = {answered:0, correct:0, avgMs:0, lastAt:'', weakSignals:0};
    return memory.categories[name];
  }
  function recordMemory(payload){
    var memory = readMemory();
    var category = payload.group || payload.cat || 'Allgemein';
    var c = getCategory(memory, category);
    var duration = Number(payload.duration || 0);
    memory.totals.answered += 1;
    c.answered += 1;
    if(payload.correct){ memory.totals.correct += 1; c.correct += 1; memory.totals.streak += 1; }
    else { memory.totals.streak = 0; c.weakSignals += 1; }
    memory.totals.bestStreak = Math.max(memory.totals.bestStreak || 0, memory.totals.streak || 0);
    if(duration > 0) c.avgMs = c.avgMs ? Math.round((c.avgMs*0.75)+(duration*0.25)) : duration;
    c.lastAt = nowIso();
    var dayKey = todayKey();
    memory.daily = memory.daily || {};
    var day = memory.daily[dayKey] || { answered:0, correct:0, totalMs:0, categories:{}, mistakes:{}, rewards:0 };
    day.answered += 1;
    if(payload.correct) day.correct += 1;
    if(duration > 0) day.totalMs += duration;
    day.categories[category] = (day.categories[category] || 0) + 1;
    var dnaPayload = payload.dna || normalizeTaskDNA(payload.task || payload);
    var diagnosis = diagnoseMistakeDetailed(payload, dnaPayload);
    var mistake = payload.mistakeType || (diagnosis && diagnosis.type) || inferMistake(Object.assign({}, payload, { skill:dnaPayload.skill, subtype:dnaPayload.subtype, trap:dnaPayload.trap }));
    var mastery = updateMasteryModel(memory, payload, dnaPayload, diagnosis);
    var sectionStat = updateExamSectionStats(memory, payload, dnaPayload, diagnosis, mastery);
    var skillStat = updateSkillModel(memory, payload, dnaPayload, mistake);
    if(!payload.correct) queueSpacedReview(memory, payload, dnaPayload, mistake, diagnosis);
    else pruneSpacedQueue(memory, payload, true);
    memory.dnaStats = memory.dnaStats || { normalized:0, inferred:0, missing:0 };
    memory.dnaStats.normalized += 1; if(dnaPayload.inferred) memory.dnaStats.inferred += 1;
    if(mistake && !payload.correct){ memory.mistakes[mistake] = (memory.mistakes[mistake] || 0) + 1; day.mistakes[mistake] = (day.mistakes[mistake] || 0) + 1; }
    if(payload.signature){
      memory.recentSignatures.unshift(payload.signature);
      memory.recentSignatures = memory.recentSignatures.slice(0, 36);
    }
    if(payload.taskId){
      memory.recentTasks.unshift({id:payload.taskId, cat:category, ok:!!payload.correct, at:nowIso()});
      memory.recentTasks = memory.recentTasks.slice(0, 40);
    }
    var reward = buildReward(memory, payload);
    if(reward){ memory.dopamine.unshift({text:reward, at:nowIso()}); memory.dopamine = memory.dopamine.slice(0, 18); day.rewards += 1; }
    memory.daily[dayKey] = day;
    var wk = weekKey();
    var w = memory.weekly[wk] || { answered:0, correct:0, totalMs:0, categories:{}, mistakes:{} };
    w.answered += 1; if(payload.correct) w.correct += 1; if(duration > 0) w.totalMs += duration;
    w.categories[category] = (w.categories[category] || 0) + 1;
    if(mistake && !payload.correct) w.mistakes[mistake] = (w.mistakes[mistake] || 0) + 1;
    memory.weekly[wk] = w;
    Object.keys(memory.weekly).sort().reverse().slice(8).forEach(function(k){ delete memory.weekly[k]; });
    if(mistake && !payload.correct){
      var dna = memory.mistakeDNA[mistake] || { count:0, lastAt:'', categories:{}, revengeWon:0 };
      dna.count += 1; dna.lastAt = nowIso(); dna.categories[category] = (dna.categories[category] || 0) + 1; memory.mistakeDNA[mistake] = dna;
    }
    if(payload.correct && payload.mode === 'revenge' && payload.revengeMistake){
      var rdna = memory.mistakeDNA[payload.revengeMistake] || { count:0, lastAt:'', categories:{}, revengeWon:0 }; rdna.revengeWon = (rdna.revengeWon || 0) + 1; memory.mistakeDNA[payload.revengeMistake] = rdna;
    }
    var dayKeys = Object.keys(memory.daily).sort().reverse();
    dayKeys.slice(21).forEach(function(k){ delete memory.daily[k]; });
    if(!payload.correct && diagnosis){
      memory.preciseMistakes = Array.isArray(memory.preciseMistakes) ? memory.preciseMistakes : [];
      memory.preciseMistakes.unshift({ type:diagnosis.type, subtype:diagnosis.subtype, family:diagnosis.family, confidence:diagnosis.confidence, skillKey:diagnosis.skillKey, target:diagnosis.revengeTarget, evidence:diagnosis.evidence || [], remediation:diagnosis.remediation, errorPath:errorPathKey(diagnosis), distractorMapped:!!diagnosis.distractorMapped, at:nowIso() });
      memory.preciseMistakes = memory.preciseMistakes.slice(0,60);
    }
    updateErrorPathStats(memory, diagnosis, payload, dnaPayload);
    updateLearningPathHistory(memory, payload, diagnosis, dnaPayload);
    updateLearningCurve(memory);
    if(payload.generated){
      memory.totals.generatedAnswered += 1;
      if(payload.correct) memory.totals.generatedCorrect += 1;
    }
    saveMemory(memory);
    return { memory: memory, reward: reward, mistakeType: mistake, diagnosis: diagnosis };
  }
  function inferMistake(p){
    var label = normalize([p.cat,p.group,p.skill,p.subtype].join(' '));
    var dur = Number(p.duration || 0), allowed = Number(p.allowed || 0);
    if(p.timeout || (allowed && dur && dur > allowed*1000)) return 'Zeitdruckfehler';
    if(p.givenIndex == null) return 'Übersprungen/offen';
    if(p.trap && /addition statt|nur addition|nur multiplikation|muster|regel/i.test(p.trap)) return 'Muster falsch erkannt';
    if(p.trap && /rabatt|prozent|grundwert|dreisatz|rechen|zwischenschritt/i.test(p.trap)) return 'Rechenfalle';
    if(p.trap && /verwechselt|ähnliche|ahnliche|zeichen|aufmerksamkeit/i.test(p.trap)) return 'Konzentrationsfehler';
    if(p.trap && /meinung|tatsache|zeitform|genau lesen/i.test(p.trap)) return 'Verständnisfalle';
    if(/zahl|logik|matrix|muster|reihe/.test(label)) return 'Muster falsch erkannt';
    if(/mathe|rechnen|prozent|dreisatz/.test(label)) return 'Rechenfalle';
    if(/konzentr|aufmerksamkeit|zeichen/.test(label)) return 'Konzentrationsfehler';
    if(/sprache|satz|text|deutsch/.test(label)) return 'Verständnisfalle';
    if(/it|edv|fisi|netz/.test(label)) return 'Symptom falsch eingeordnet';
    return 'Antwortstrategie';
  }

  function mistakeFamily(type){
    var n = normalize(type || '');
    if(/zeit/.test(n)) return 'tempo';
    if(/muster|matrix|reihe|regel/.test(n)) return 'pattern';
    if(/rechen|prozent|dreisatz/.test(n)) return 'calculation';
    if(/konzentr|zeichen|aufmerksamkeit/.test(n)) return 'attention';
    if(/verstandnis|aussage|sprache|text/.test(n)) return 'comprehension';
    if(/symptom|dns|netz|it|edv/.test(n)) return 'diagnosis';
    return 'strategy';
  }
  function numberValue(value){
    var m = String(value == null ? '' : value).replace(',', '.').match(/-?\d+(?:\.\d+)?/);
    return m ? Number(m[0]) : NaN;
  }
  function lastNumbersFromText(text){
    return (String(text || '').match(/-?\d+(?:[,.]\d+)?/g) || []).map(function(x){ return Number(String(x).replace(',', '.')); }).filter(function(n){ return isFinite(n); });
  }
  function errorPathKey(diagnosis){
    if(!diagnosis) return 'unknown';
    return [diagnosis.family || 'strategy', diagnosis.subtype || diagnosis.type || 'unknown'].join('/');
  }

  function normalizeErrorPath(value){
    var n = normalize(value || '');
    if(!n) return '';
    if(/difference|differenz|linear|nur.*add/.test(n)) return 'pattern/difference_only_checked';
    if(/secondary|zweite|wechsel/.test(n)) return 'pattern/secondary_pattern_missed';
    if(/calc|rechen|nah/.test(n)) return 'calculation/correct_logic_wrong_calc';
    if(/dns.*ip|ip.*dns/.test(n)) return 'diagnosis/dns_ip_confused';
    if(/hardware|ram|cpu|ssd/.test(n)) return 'diagnosis/hardware_mapping_error';
    if(/opinion|meinung|tatsache/.test(n)) return 'comprehension/opinion_fact_confused';
    if(/keyword|schlussel|kontext/.test(n)) return 'comprehension/keyword_misread';
    if(/tempo|zeit|timeout/.test(n)) return 'tempo/tempo_blockade';
    if(/zeichen|symbol|attention/.test(n)) return 'attention/similar_symbol_confused';
    return n.indexOf('/') >= 0 ? n : ('strategy/' + n.replace(/\s+/g,'_'));
  }
  function splitErrorPath(path){
    path = normalizeErrorPath(path || 'strategy/unknown');
    var parts = path.split('/');
    return { family:parts[0] || 'strategy', subtype:parts[1] || parts[0] || 'unknown' };
  }
  function distractorMetaFromTask(task, givenIndex, selectedText){
    task = task || {};
    var all = [];
    if(Array.isArray(task.distractors)) all = all.concat(task.distractors);
    if(task.dna && Array.isArray(task.dna.distractors)) all = all.concat(task.dna.distractors);
    if(task.distractorMap && typeof task.distractorMap === 'object'){
      Object.keys(task.distractorMap).forEach(function(k){
        var v = task.distractorMap[k];
        if(v && typeof v === 'object') all.push(Object.assign({ value:k }, v));
      });
    }
    if(Array.isArray(task.answersMeta)) all = all.concat(task.answersMeta);
    if(Array.isArray(task.optionsMeta)) all = all.concat(task.optionsMeta);
    var answers = qOptions(task);
    var selected = selectedText || answers[givenIndex] || '';
    for(var i=0;i<all.length;i++){
      var d = all[i]; if(!d) continue;
      var idx = d.index != null ? Number(d.index) : (d.answerIndex != null ? Number(d.answerIndex) : NaN);
      var val = d.value != null ? String(d.value) : (d.answer != null ? String(d.answer) : '');
      if((isFinite(idx) && idx === Number(givenIndex)) || (val && normalize(val) === normalize(selected))){ return d; }
    }
    return null;
  }
  function diagnosisFromDistractor(payload, dna){
    var meta = distractorMetaFromTask(payload.task || payload, payload.givenIndex, payload.selectedText || payload.givenText || '');
    if(!meta || !(meta.errorPath || meta.errorType || meta.trap || meta.mistake)) return null;
    var path = splitErrorPath(meta.errorPath || meta.errorType || meta.mistake || meta.trap);
    var typeMap = { pattern:'Muster falsch erkannt', calculation:'Rechenfalle', diagnosis:'Symptom falsch eingeordnet', comprehension:'Verständnisfalle', tempo:'Zeitdruckfehler', attention:'Konzentrationsfehler', strategy:'Antwortstrategie' };
    var remediation = meta.remediation || meta.hint || meta.feedback || 'genau diese Antwortfalle in einer Revanche-Aufgabe absichern';
    return {
      type: meta.type || typeMap[path.family] || 'Antwortstrategie',
      subtype: meta.subtype || path.subtype,
      family: path.family,
      confidence: meta.confidence || 0.94,
      evidence: ['Antwortfallen-Mapping', meta.value != null ? ('gewählte Option: '+meta.value) : '', meta.hint || meta.reason || ''].filter(Boolean),
      remediation: remediation,
      revengeSignature: meta.revengeSignature || (path.family + '_' + path.subtype),
      distractorMapped: true
    };
  }
  function masteryForSkill(memory, dna){
    memory.mastery = memory.mastery && typeof memory.mastery === 'object' ? memory.mastery : {};
    var key = dna && (dna.skillKey || skillKeyFromDNA(dna)) || 'gemischt/standard/grundskill';
    if(!memory.mastery[key]) memory.mastery[key] = { key:key, score:0.5, answered:0, correct:0, lastAt:'', trend:0, evidence:[] };
    return memory.mastery[key];
  }
  function updateMasteryModel(memory, payload, dna, diagnosis){
    var m = masteryForSkill(memory, dna);
    var before = Number(m.score || 0.5);
    var duration = Number(payload.duration || payload.durationMs || 0);
    var expected = Number(dna && dna.expectedTimeMs || payload.expectedTimeMs || 0);
    var delta = payload.correct ? 0.055 : -0.075;
    if(payload.correct && expected && duration && duration <= expected) delta += 0.025;
    if(payload.correct && expected && duration && duration > expected*1.35) delta -= 0.015;
    if(!payload.correct && diagnosis && diagnosis.confidence >= 0.85) delta -= 0.025;
    if(!payload.correct && diagnosis && diagnosis.distractorMapped) delta -= 0.015;
    if(payload.mode === 'revenge' && payload.correct) delta += 0.04;
    m.score = Math.round(clamp(before + delta, 0.05, 0.99) * 1000) / 1000;
    m.trend = Math.round((m.score - before) * 1000) / 10;
    m.answered += 1; if(payload.correct) m.correct += 1;
    m.lastAt = nowIso();
    m.evidence.unshift({ at:m.lastAt, correct:!!payload.correct, delta:Math.round(delta*1000)/1000, diagnosis:diagnosis && errorPathKey(diagnosis) || '', mode:payload.mode || '' });
    m.evidence = m.evidence.slice(0,12);
    memory.mastery[m.key] = m;
    return m;
  }
  function examSectionKey(dna, payload){
    var exam = normalize(dna && dna.examTarget || payload && payload.examTarget || 'allgemein');
    var cat = normalize(dna && dna.category || payload && (payload.cat || payload.group) || 'gemischt');
    var subtype = normalize(dna && dna.subtype || payload && payload.subtype || '');
    if(/ctc|bosch|hard/.test(exam) || /matrix|wechsel|logik|zeitdruck/.test(subtype)) return 'ctc_' + (cat || 'mixed');
    if(/bps/.test(exam)) return 'bps_' + (cat || 'mixed');
    if(/it|edv/.test(cat)) return 'bps_it';
    if(/mathe|zahlen|rechnung/.test(cat)) return 'bps_mathe';
    if(/logik|matrix/.test(cat)) return 'ctc_logik';
    if(/konzentr|tempo/.test(cat)) return 'ctc_zeitdruck';
    return 'bps_gemischt';
  }
  function updateExamSectionStats(memory, payload, dna, diagnosis, mastery){
    memory.examSections = memory.examSections && typeof memory.examSections === 'object' ? memory.examSections : {};
    var key = examSectionKey(dna, payload);
    var sec = memory.examSections[key] || { key:key, answered:0, correct:0, avgMs:0, risk:0, lastAt:'', dominantErrors:{} };
    var duration = Number(payload.duration || payload.durationMs || 0);
    sec.answered += 1; if(payload.correct) sec.correct += 1;
    if(duration > 0) sec.avgMs = sec.avgMs ? Math.round(sec.avgMs*0.72 + duration*0.28) : duration;
    if(!payload.correct && diagnosis){ var ep=errorPathKey(diagnosis); sec.dominantErrors[ep]=(sec.dominantErrors[ep]||0)+1; }
    var quote = sec.correct / Math.max(1, sec.answered);
    var masteryPenalty = mastery ? (1 - mastery.score) * 35 : 12;
    var errPenalty = diagnosis && !payload.correct ? Math.min(28, (diagnosis.confidence || 0.6) * 22) : 0;
    sec.risk = Math.round(clamp((1-quote)*48 + masteryPenalty + errPenalty, 0, 100));
    sec.lastAt = nowIso();
    memory.examSections[key] = sec;
    return sec;
  }
  function sectionTrafficLight(){
    var m = readMemory();
    var out = Object.keys(m.examSections || {}).map(function(k){
      var s = m.examSections[k] || {}; var quote = s.answered ? Math.round(s.correct/s.answered*100) : 0;
      var state = s.answered < 3 ? 'riskant' : (s.risk <= 32 ? 'stabil' : (s.risk <= 62 ? 'riskant' : 'kritisch'));
      var errors = Object.keys(s.dominantErrors || {}).sort(function(a,b){ return (s.dominantErrors[b]||0)-(s.dominantErrors[a]||0); });
      return { key:k, title:k.replace(/_/g,' ').toUpperCase(), state:state, answered:s.answered||0, quote:quote, risk:s.risk||0, avgMs:s.avgMs||0, dominantError:errors[0] || '', reason: state==='stabil'?'belastbare Quote und niedriger Risikoindex':state==='riskant'?'brauchbar, aber noch schwankend oder zu wenig Daten':'wiederholte Fehler oder zu hohe Unsicherheit' };
    }).sort(function(a,b){ var rank={kritisch:0,riskant:1,stabil:2}; return (rank[a.state]-rank[b.state]) || (b.risk-a.risk); });
    return out;
  }
  function categoryErrorPath(payload, dna){
    payload = payload || {}; dna = dna || {};
    var subtype = normalize(dna.subtype || payload.subtype || '');
    var cat = normalize(dna.category || payload.cat || payload.group || '');
    var trap = normalize(dna.trap || payload.trap || '');
    var selectedText = normalize(payload.selectedText || payload.givenText || '');
    var correctText = normalize(payload.correctText || '');
    var taskText = payload.task ? stripHtml(payload.task.q || payload.task.question || payload.task.text || '') : stripHtml(payload.q || payload.question || payload.text || '');
    var evidence = [];
    var dur = Number(payload.duration || payload.durationMs || 0), expected = Number(dna.expectedTimeMs || payload.expectedTimeMs || 0);
    if(payload.givenIndex == null || payload.skipped){
      return { type:'Antwortstrategie', subtype:'skipped_or_open', family:'strategy', confidence:0.82, evidence:['keine auswertbare Antwort'], remediation:'erst eine sichere Teilregel finden, dann antworten oder bewusst skippen', revengeSignature:'strategy_skip' };
    }
    if(payload.timeout || (dur && expected && dur > expected*1.8)){
      return { type:'Zeitdruckfehler', subtype:'tempo_blockade', family:'tempo', confidence:0.86, evidence:['deutlich über Zielzeit'], remediation:'gleicher Skill mit kleinerem Reiz und klarer Zeitgrenze', revengeSignature:'tempo_same_skill' };
    }
    var mapped = diagnosisFromDistractor(payload, dna);
    if(mapped) return mapped;
    var selNum = numberValue(payload.selectedText), corNum = numberValue(payload.correctText);
    var nums = lastNumbersFromText(taskText);
    if(/zahlenreihe|wechselmuster|differenz|reihe/.test(subtype+' '+cat+' '+trap)){
      if(nums.length >= 4 && isFinite(selNum) && isFinite(corNum)){
        var last = nums[nums.length-1], prev = nums[nums.length-2], lastDiff = last - prev;
        var linearGuess = last + lastDiff;
        if(Math.abs(selNum-linearGuess) < 0.0001 && Math.abs(selNum-corNum) > 0.0001){
          return { type:'Muster falsch erkannt', subtype:'difference_only_checked', family:'pattern', confidence:0.9, evidence:['Antwort passt zur letzten Differenz', 'Zahlenreihe/Wechselmuster'], remediation:'nicht nur den letzten Sprung fortsetzen; erst prüfen, ob + und × wechseln', revengeSignature:'series_difference_only' };
        }
        if(Math.abs(selNum-corNum) <= Math.max(1, Math.abs(corNum)*0.08) && Math.abs(selNum-corNum) > 0){
          return { type:'Rechenfalle', subtype:'correct_logic_wrong_calc', family:'calculation', confidence:0.72, evidence:['Antwort liegt nah an der Lösung'], remediation:'Regel war vermutlich nah dran; letzten Rechenschritt bewusst kontrollieren', revengeSignature:'series_calc_control' };
        }
      }
      if(/wechsel|nur addition|nur multiplikation|linear/.test(trap+' '+selectedText)){
        return { type:'Muster falsch erkannt', subtype:'secondary_pattern_missed', family:'pattern', confidence:0.84, evidence:['Wechsel-/Musterfalle'], remediation:'zweite Regelhälfte markieren: A-B-A-B statt eine Regel erzwingen', revengeSignature:'series_secondary_pattern' };
      }
      return { type:'Muster falsch erkannt', subtype:'rule_fixed_too_early', family:'pattern', confidence:0.66, evidence:['Zahlenreihen-Skill'], remediation:'mindestens zwei mögliche Regeln testen, bevor du dich festlegst', revengeSignature:'series_rule_scan' };
    }
    if(/matrix|rotation|spiegel|visuell/.test(subtype+' '+cat+' '+trap)){
      if(/rotation|drehen|gedreht/.test(trap+' '+selectedText)) return { type:'Muster falsch erkannt', subtype:'rotation_confused', family:'pattern', confidence:0.82, evidence:['Rotationssignal'], remediation:'Drehung immer mit Richtung und Schrittweite prüfen', revengeSignature:'matrix_rotation' };
      if(/spiegel|mirror|gespiegelt/.test(trap+' '+selectedText)) return { type:'Muster falsch erkannt', subtype:'mirror_confused', family:'pattern', confidence:0.8, evidence:['Spiegelungsfalle'], remediation:'erst Spiegelachse suchen, dann Rotation ausschließen', revengeSignature:'matrix_mirror' };
      if(/zeile/.test(trap+' '+selectedText)) return { type:'Muster falsch erkannt', subtype:'row_pattern_missed', family:'pattern', confidence:0.78, evidence:['Zeilenregel'], remediation:'jede Zeile einzeln lesen, dann Spaltenregel gegenprüfen', revengeSignature:'matrix_row' };
      if(/spalte/.test(trap+' '+selectedText)) return { type:'Muster falsch erkannt', subtype:'column_pattern_missed', family:'pattern', confidence:0.78, evidence:['Spaltenregel'], remediation:'Spalten zuerst isoliert vergleichen; nicht nur horizontal denken', revengeSignature:'matrix_column' };
      return { type:'Muster falsch erkannt', subtype:'visual_relation_mixed', family:'pattern', confidence:0.63, evidence:['visuelle Logik'], remediation:'Form, Anzahl, Richtung und Farbe getrennt prüfen', revengeSignature:'matrix_relation' };
    }
    if(/netzwerk|dns|dhcp|ip|gateway|hardware|software|edv|it/.test(subtype+' '+cat+' '+trap+' '+selectedText+' '+correctText)){
      if(/dns/.test(selectedText+' '+trap) && /ip|adresse|dhcp|gateway/.test(correctText+' '+trap)) return { type:'Symptom falsch eingeordnet', subtype:'dns_ip_confused', family:'diagnosis', confidence:0.84, evidence:['DNS/IP-Verwechslung'], remediation:'Symptomkette prüfen: IP-Adresse → Gateway → DNS → Dienst', revengeSignature:'it_dns_ip' };
      if(/ip|adresse|gateway/.test(selectedText) && /dns|domain|name/.test(correctText+' '+trap)) return { type:'Symptom falsch eingeordnet', subtype:'ip_dns_confused', family:'diagnosis', confidence:0.84, evidence:['IP/DNS-Verwechslung'], remediation:'IP erreicht Gerät; DNS übersetzt Namen. Beides getrennt prüfen', revengeSignature:'it_ip_dns' };
      if(/hardware|ram|cpu|ssd|festplatte|speicher/.test(trap+' '+selectedText+' '+correctText)) return { type:'Symptom falsch eingeordnet', subtype:'hardware_mapping_error', family:'diagnosis', confidence:0.74, evidence:['Hardware-Begriff'], remediation:'Bauteil → Aufgabe → typisches Symptom sauber zuordnen', revengeSignature:'it_hardware_mapping' };
      return { type:'Symptom falsch eingeordnet', subtype:'it_cause_chain_missed', family:'diagnosis', confidence:0.67, evidence:['IT-Szenario'], remediation:'Ursache nicht aus Begriffen raten, sondern Symptomkette lesen', revengeSignature:'it_cause_chain' };
    }
    if(/prozent|dreisatz|rechnung|mathe|kaufm/.test(subtype+' '+cat+' '+trap)){
      if(/grundwert|endwert|prozentwert/.test(trap+' '+selectedText+' '+correctText)) return { type:'Rechenfalle', subtype:'value_role_confused', family:'calculation', confidence:0.8, evidence:['Wertrollen-Falle'], remediation:'Grundwert, Prozentwert und Ergebnis vor dem Rechnen beschriften', revengeSignature:'math_value_roles' };
      if(isFinite(selNum) && isFinite(corNum) && Math.abs(selNum-corNum) <= Math.max(1, Math.abs(corNum)*0.1)) return { type:'Rechenfalle', subtype:'near_result_calc_slip', family:'calculation', confidence:0.7, evidence:['nah an der Lösung'], remediation:'Rechenweg war vermutlich richtig; letzten Schritt kontrollieren', revengeSignature:'math_calc_slip' };
      return { type:'Rechenfalle', subtype:'operation_choice_wrong', family:'calculation', confidence:0.64, evidence:['Mathe/Kaufmännisch'], remediation:'erst entscheiden: Prozent, Dreisatz, Differenz oder Verhältnis', revengeSignature:'math_operation_choice' };
    }
    if(/sprache|satz|text|meinung|tatsache|grammatik/.test(subtype+' '+cat+' '+trap)){
      if(/meinung|tatsache|wert/.test(trap+' '+selectedText+' '+correctText)) return { type:'Verständnisfalle', subtype:'opinion_fact_confused', family:'comprehension', confidence:0.82, evidence:['Meinung/Tatsache'], remediation:'prüfen: belegbar/messbar = Tatsache, Bewertung = Meinung', revengeSignature:'language_opinion_fact' };
      if(/schlüssel|keyword|genau lesen|kontext/.test(trap)) return { type:'Verständnisfalle', subtype:'keyword_misread', family:'comprehension', confidence:0.72, evidence:['Kontextsignal'], remediation:'Schlüsselwort markieren und im ganzen Satz gegenprüfen', revengeSignature:'language_keyword_context' };
      return { type:'Verständnisfalle', subtype:'context_missed', family:'comprehension', confidence:0.62, evidence:['Sprach-/Textaufgabe'], remediation:'nicht einzelnes Wort wählen; Satzrichtung lesen', revengeSignature:'language_context' };
    }
    if(/konzentr|zeichen|aufmerksamkeit|tempo/.test(subtype+' '+cat+' '+trap)){
      return { type:'Konzentrationsfehler', subtype:'similar_symbol_confused', family:'attention', confidence:0.76, evidence:['Aufmerksamkeitsaufgabe'], remediation:'kleine Blöcke vergleichen und kurz rückprüfen', revengeSignature:'attention_symbol_block' };
    }
    return null;
  }

  function subtypeMistakeRules(dna, payload){
    dna = dna || {}; payload = payload || {};
    var subtype = normalize(dna.subtype || payload.subtype || '');
    var trap = normalize(dna.trap || payload.trap || '');
    var selectedText = normalize(payload.selectedText || payload.givenText || '');
    var evidence = [];
    if(payload.timeout){ evidence.push('Zeit abgelaufen'); return { type:'Zeitdruckfehler', subtype:'timeout', confidence:0.9, evidence:evidence, remediation:'gleiche Aufgabenart mit enger, aber realistischer Zielzeit' }; }
    var dur = Number(payload.duration || payload.durationMs || 0), expected = Number(dna.expectedTimeMs || payload.expectedTimeMs || 0);
    if(dur && expected && dur > expected*1.35) evidence.push('deutlich über Zielzeit');
    if(/wechselmuster/.test(subtype)){
      if(/addition|differenz|linear/.test(trap+selectedText)) return { type:'Muster falsch erkannt', subtype:'linear_statt_wechsel', confidence:0.78, evidence:evidence.concat(['Wechselmuster-Aufgabe', 'typische Falle: lineare Regel']), remediation:'Wechselmuster zuerst als Abfolge prüfen: + / × / + / ×' };
      return { type:'Muster falsch erkannt', subtype:'wechselregel_unvollstaendig', confidence:0.7, evidence:evidence.concat(['Wechselmuster-Aufgabe']), remediation:'Regelwechsel markieren, nicht nur letzten Sprung fortsetzen' };
    }
    if(/zahlenreihe/.test(subtype)) return { type:'Muster falsch erkannt', subtype:'zahlenfolge_regel_zu_frueh_fixiert', confidence:0.68, evidence:evidence.concat(['Zahlenreihe']), remediation:'mindestens zwei Regeln testen: Differenz, Faktor, Wechsel' };
    if(/matrix/.test(subtype)) return { type:'Muster falsch erkannt', subtype:'zeile_spalte_ebene_verwechselt', confidence:0.72, evidence:evidence.concat(['Matrixaufgabe']), remediation:'erst Zeile, dann Spalte, dann Form/Farbe/Rotation prüfen' };
    if(/prozent/.test(subtype)) return { type:'Rechenfalle', subtype:'grundwert_endwert_verwechselt', confidence:0.75, evidence:evidence.concat(['Prozentaufgabe']), remediation:'Grundwert, Prozentwert und Endwert getrennt notieren' };
    if(/dreisatz/.test(subtype)) return { type:'Rechenfalle', subtype:'direkt_indirekt_verwechselt', confidence:0.75, evidence:evidence.concat(['Dreisatzaufgabe']), remediation:'prüfen: mehr Personen = weniger Zeit? Dann indirekt rechnen' };
    if(/netzwerk|dns|dhcp|ip/.test(subtype+' '+dna.skill)) return { type:'Symptom falsch eingeordnet', subtype:'it_ursache_verwechselt', confidence:0.72, evidence:evidence.concat(['IT-/Netzwerk-Szenario']), remediation:'Symptomkette prüfen: IP → DNS → Gateway → Dienst' };
    if(/meinung|tatsache/.test(subtype)) return { type:'Verständnisfalle', subtype:'aussageart_verwechselt', confidence:0.75, evidence:evidence.concat(['Aussageart']), remediation:'prüfen: belegbar messbar = Tatsache, Wertung = Meinung' };
    if(/zeichenvergleich/.test(subtype)) return { type:'Konzentrationsfehler', subtype:'aehnliche_zeichen_verwechselt', confidence:0.78, evidence:evidence.concat(['Zeichenvergleich']), remediation:'Zeichen in kleinen Blöcken vergleichen, nicht als Gesamtbild' };
    return null;
  }
  function diagnoseMistakeDetailed(payload, dna){
    payload = payload || {}; dna = dna || normalizeTaskDNA(payload.task || payload || {});
    if(payload.correct){ return { type:'kein_fehler', subtype:'correct', confidence:1, evidence:['richtig gelöst'], remediation:'Schwierigkeit oder Tempo schrittweise erhöhen', family:'success', skillKey:dna.skillKey }; }
    var base = inferMistake(Object.assign({}, payload, { skill:dna.skill, subtype:dna.subtype, trap:dna.trap }));
    var detailed = categoryErrorPath(payload, dna) || subtypeMistakeRules(dna, payload) || { type:base, subtype:normalize(base).replace(/\s+/g,'_') || 'unspezifisch', confidence:0.55, evidence:[], remediation:'ähnliche Aufgabe mit klarerem Fokus wiederholen', revengeSignature:'general_strategy' };
    if(Number(payload.duration || 0) && dna.expectedTimeMs && Number(payload.duration) > dna.expectedTimeMs*1.35 && detailed.type !== 'Zeitdruckfehler'){
      detailed.evidence = (detailed.evidence || []).concat(['zusätzlich langsam gelöst']);
      detailed.secondaryType = 'Zeitdrucksignal';
    }
    detailed.family = mistakeFamily(detailed.type);
    detailed.skillKey = dna.skillKey;
    detailed.category = dna.category;
    detailed.subtypeKey = dna.subtype;
    detailed.trap = dna.trap;
    detailed.revengeTarget = { skillKey:dna.skillKey, category:dna.category, subtype:dna.subtype, trap:dna.trap, difficulty:clamp((dna.difficulty || 3) - 1,1,5), mistakeType:detailed.type, mistakeSubtype:detailed.subtype, errorPath:errorPathKey(detailed), revengeSignature:detailed.revengeSignature || errorPathKey(detailed) };
    detailed.explanation = detailed.type + ': ' + detailed.remediation;
    return detailed;
  }
  function updateErrorPathStats(memory, diagnosis, payload, dna){
    if(!diagnosis || diagnosis.type === 'kein_fehler') return;
    memory.errorPathStats = memory.errorPathStats && typeof memory.errorPathStats === 'object' ? memory.errorPathStats : {};
    var key = errorPathKey(diagnosis);
    var item = memory.errorPathStats[key] || { key:key, type:diagnosis.type, subtype:diagnosis.subtype, family:diagnosis.family, count:0, lastAt:'', skillKeys:{}, revengeWon:0, lastRemediation:'' };
    item.count += 1;
    item.lastAt = nowIso();
    item.lastRemediation = diagnosis.remediation || item.lastRemediation;
    if(dna && dna.skillKey) item.skillKeys[dna.skillKey] = (item.skillKeys[dna.skillKey] || 0) + 1;
    memory.errorPathStats[key] = item;
  }
  function updateLearningPathHistory(memory, payload, diagnosis, dna){
    memory.learningPath = memory.learningPath && typeof memory.learningPath === 'object' ? memory.learningPath : { lastPlan:null, history:[] };
    memory.learningPath.history = Array.isArray(memory.learningPath.history) ? memory.learningPath.history : [];
    memory.learningPath.history.unshift({ at:nowIso(), skillKey:dna && dna.skillKey || '', category:dna && dna.category || payload.cat || payload.group || '', subtype:dna && dna.subtype || payload.subtype || '', correct:!!payload.correct, difficulty:dna && dna.difficulty || payload.difficulty || 3, errorPath:diagnosis && errorPathKey(diagnosis) || '', phase:payload.phase || payload.stage || '' });
    memory.learningPath.history = memory.learningPath.history.slice(0,80);
  }
  function errorPathReport(){
    var m = readMemory();
    var list = Object.keys(m.errorPathStats || {}).map(function(k){ return m.errorPathStats[k]; }).sort(function(a,b){ return (b.count||0)-(a.count||0); });
    return { top:list.slice(0,8), dominant:list[0] || null, total:list.reduce(function(a,x){ return a+(x.count||0); },0) };
  }

  function updateLearningCurve(memory){
    memory.learningCurve = memory.learningCurve && typeof memory.learningCurve === 'object' ? memory.learningCurve : { daily:[], predictions:{} };
    var days = Object.keys(memory.daily || {}).sort().slice(-14);
    memory.learningCurve.daily = days.map(function(k){ var d=memory.daily[k]||{}; return { date:k, answered:d.answered||0, quote:d.answered?Math.round((d.correct||0)/d.answered*100):0, avgMs:d.answered&&d.totalMs?Math.round(d.totalMs/d.answered):0, mistakes:Object.assign({}, d.mistakes||{}) }; });
    var arr = memory.learningCurve.daily.filter(function(x){ return x.answered > 0; });
    var n = arr.length, slope = 0;
    if(n >= 3){
      var meanX=(n-1)/2, meanY=arr.reduce(function(a,x){return a+x.quote;},0)/n;
      var num=0, den=0; arr.forEach(function(x,i){ num += (i-meanX)*(x.quote-meanY); den += Math.pow(i-meanX,2); });
      slope = den ? num/den : 0;
    }
    var last = arr.length ? arr[arr.length-1].quote : 0;
    var avgMs = arr.length ? Math.round(arr.reduce(function(a,x){return a+(x.avgMs||0);},0)/arr.length) : 0;
    memory.learningCurve.predictions = { trendPerDay:Math.round(slope*10)/10, predicted7d:clamp(Math.round(last + slope*7),0,100), predicted14d:clamp(Math.round(last + slope*14),0,100), confidence:clamp(n*12,0,100), avgMs:avgMs, updatedAt:nowIso() };
    return memory.learningCurve;
  }
  function learningCurveReport(){ var m=readMemory(); updateLearningCurve(m); return m.learningCurve; }
  function examTrafficLight(){
    var r = readinessScore();
    var li = learningIntelligenceReport();
    var curve = learningCurveReport();
    var weakRisk = li.weakSkill && li.weakSkill.answered >= 3 && (li.weakSkill.correct / Math.max(1, li.weakSkill.answered)) < 0.6;
    function status(score, extraPenalty){
      if(r.confidence < 35) return { state:'riskant', reason:'zu wenig Daten für stabile Prognose' };
      var adjusted = score - (extraPenalty||0) - (weakRisk?8:0);
      if(adjusted >= 78 && r.stability >= 70) return { state:'stabil', reason:'Quote und Stabilität sind belastbar' };
      if(adjusted >= 58) return { state:'riskant', reason:'Basis vorhanden, aber Schwankungen oder Lücken bleiben' };
      return { state:'kritisch', reason:'Trefferquote, Tempo oder Abdeckung reichen noch nicht stabil' };
    }
    var sections = sectionTrafficLight();
    return { bps:status(r.bps,0), ctc:status(r.ctc,8), sections:sections, readiness:r, prediction:curve.predictions || {}, weakRisk:weakRisk ? { skill:li.weakSkill.skill, subtype:li.weakSkill.subtype, quote:Math.round(li.weakSkill.correct/Math.max(1,li.weakSkill.answered)*100) } : null };
  }
  function preciseRevengeProfile(mistake){
    var m = readMemory(); mistake = mistake || (m.preciseMistakes && m.preciseMistakes[0]) || null;
    if(!mistake && Array.isArray(m.spacedQueue) && m.spacedQueue.length){ var q=m.spacedQueue[0]; mistake={ type:q.mistake, target:q.revengeTarget || (q.dna||{}) }; }
    var target = mistake && (mistake.target || mistake.revengeTarget) || {};
    return { skill:'mixed', difficulty:clamp(target.difficulty || 3,1,5), count:5, mode:'revenge', revengeMistake:(mistake && (mistake.type || mistake.mistake)) || '', revengeTarget:target, exactSkillKey:target.skillKey || '', exactSubtype:target.subtype || '', exactTrap:target.trap || '', exactErrorPath:target.errorPath || mistake.errorPath || '', exactRevengeSignature:target.revengeSignature || '', reason:'Präzise Revanche: gleicher Denkfehler, andere Aufgabe.' };
  }

  function award(memory, key, text){
    if(!key || !text) return '';
    memory.achievements = Array.isArray(memory.achievements) ? memory.achievements : [];
    if(memory.achievements.some(function(a){return a.key === key;})) return '';
    memory.achievements.unshift({ key:key, text:text, at:nowIso() });
    memory.achievements = memory.achievements.slice(0,40);
    return text;
  }
  function buildReward(memory, p){
    var msg = '';
    if(p.correct && memory.totals.streak >= 10) msg = award(memory, 'streak10', '10er-Serie freigeschaltet. Das ist Prüfungsroutine.');
    if(!msg && p.correct && memory.totals.streak >= 7) msg = humanLine(['7er-Serie. Du kommst gerade richtig in den Prüfungsrhythmus.','Sieben Treffer am Stück. Das ist nicht Glück, das ist Struktur.']);
    if(!msg && p.correct && memory.totals.streak >= 5) msg = humanLine(['5er-Serie. Genau so fühlt sich echte Sicherheit an.','Fünf sauber gelöst. Dein Kopf arbeitet gerade stabil.']);
    if(!msg && p.correct && memory.totals.streak === 3) msg = humanLine(['3er-Serie. Du bist drin.','Drei in Folge. Jetzt nicht hetzen, einfach sauber bleiben.']);
    if(!msg && p.correct && p.mode === 'daily') msg = 'Daily Challenge sitzt. Kleiner Tageshaken, große Wirkung.';
    if(!msg && p.correct && p.mode === 'ctc-hard') msg = 'CTC-Hard getroffen. Das ist schwerer als bequem – genau deshalb wertvoll.';
    if(!msg && p.correct && p.mode === 'revenge') msg = 'Revanche gewonnen. Genau diese Falle hat dich diesmal nicht bekommen.';
    if(!msg && p.correct && p.generated && p.difficulty >= 4) msg = 'Schwere Transfer-Aufgabe gelöst. Das zeigt: Du erkennst das Muster, nicht nur die Aufgabe.';
    if(!msg && p.correct && p.duration && p.allowed && p.duration < p.allowed*1000*0.55) msg = 'Schneller als nötig und trotzdem richtig. Genau diese Kombi zählt.';
    if(!msg && p.correct) msg = humanLine(['Richtig. Ein weiterer Baustein Richtung Prüfungssicherheit.','Sauber gelöst. Genau so wächst Tempo ohne Chaos.','Passt. Dein Musterblick wird stabiler.']);
    if(!msg && p.timeout) msg = 'Zeitdruck erkannt. Das ist kein Scheitern, sondern ein klares Trainingssignal.';
    if(!msg) msg = 'Fehler gespeichert. Ich nutze das direkt für passendere Folgeaufgaben.';
    return coachTone(msg, p.correct ? 'good' : 'bad');
  }
  function memorySummary(){
    var m = readMemory();
    var cats = Object.keys(m.categories || {}).map(function(k){
      var c = m.categories[k], quote = c.answered ? Math.round(c.correct/c.answered*100) : 0;
      return { name:k, answered:c.answered, correct:c.correct, quote:quote, avgMs:c.avgMs || 0, weakSignals:c.weakSignals || 0 };
    });
    var weakest = cats.filter(function(c){return c.answered >= 2;}).sort(function(a,b){ return a.quote-b.quote || b.weakSignals-a.weakSignals; })[0] || null;
    var strongest = cats.filter(function(c){return c.answered >= 2;}).sort(function(a,b){ return b.quote-a.quote || b.answered-a.answered; })[0] || null;
    var slowest = cats.filter(function(c){return c.avgMs;}).sort(function(a,b){ return b.avgMs-a.avgMs; })[0] || null;
    var totalQuote = m.totals.answered ? Math.round(m.totals.correct/m.totals.answered*100) : 0;
    return { memory:m, totalQuote:totalQuote, weakest:weakest, strongest:strongest, slowest:slowest, categories:cats, recentReward:m.dopamine && m.dopamine[0] ? m.dopamine[0].text : '' };
  }

  function scoreItem(query, item, context){
    var q = normalize(query), words = tokenize(q), topic = normalize(item.topic || ''), subject = normalize(item.subject || ''), kws = Array.isArray(item.keywords) ? item.keywords : [], score = 0;
    if(!q || q.length < 2) return 0;
    if(q === topic) score += 14; else if(topic && q.indexOf(topic) !== -1) score += 10; else if(topic && topic.indexOf(q) !== -1 && q.length >= 4) score += 7;
    if(subject && q.indexOf(subject) !== -1) score += 1;
    kws.forEach(function(k){ var nk = normalize(k); if(!nk || nk.length < 2) return; if(q === nk) score += 11; else if(q.indexOf(nk) !== -1) score += nk.length >= 4 ? 6 : 3; else if(nk.indexOf(q) !== -1 && q.length >= 4) score += 4; });
    var itemWords = {}; tokenize(topic + ' ' + subject + ' ' + kws.join(' ')).forEach(function(w){ itemWords[w] = 1; });
    words.forEach(function(w){ if(itemWords[w]) score += w.length >= 4 ? 2 : 1; });
    if(context && context.branch && Array.isArray(item.branch) && item.branch.indexOf(context.branch) !== -1) score += 1;
    if(context && context.subject && normalize(context.subject) === subject) score += 1;
    if(words.length === 1 && words[0].length <= 2 && score < 12) return 0;
    return score;
  }
  function find(query, context){
    var scored = knowledge().map(function(item){ return { item:item, score:scoreItem(query,item,context||{}) }; }).filter(function(x){ return x.score > 0; }).sort(function(a,b){ return b.score-a.score; });
    var top = scored[0];
    if(!top) return { status:'none', related:[] };
    if(top.score >= STRONG_THRESHOLD) return { status:'hit', item:top.item, score:top.score, related:scored.slice(1,5).map(function(x){ return x.item; }) };
    if(top.score >= RELATED_THRESHOLD) return { status:'related', related:scored.slice(0,5).map(function(x){ return x.item; }) };
    return { status:'none', related:scored.slice(0,3).map(function(x){ return x.item; }) };
  }
  function currentTaskFromApp(){ try{ if(window.App && App._test && App._test.state && Array.isArray(App._test.state.quiz)){ return App._test.state.quiz[App._test.state.current] || null; } }catch(e){} return null; }
  function isTaskRequest(text){ return /\b(aufgabe|diese|aktuelle|tipp|hinweis|lösung|loesung|lösungsweg|loesungsweg|verstehe|schritt|erklär|erklaer)\b/.test(normalize(text)); }
  function qText(task){ return stripHtml(task && (task.q || task.question || task.text || task.prompt || '')); }
  function qOptions(task){ if(!task) return []; if(Array.isArray(task.answers)) return task.answers.map(stripHtml); if(Array.isArray(task.options)) return task.options.map(stripHtml); if(Array.isArray(task.a)) return task.a.map(stripHtml); return []; }
  function relatedTopic(item){ return { id:item.id || item.topic, topic:item.topic || 'Thema', subject:item.subject || '', keywords:item.keywords || [] }; }


  function skillKeyFromDNA(dna){
    dna = dna || {};
    return [dna.category || 'gemischt', dna.subtype || 'standard', dna.skill || 'grundskill'].map(function(x){ return normalize(x).replace(/\s+/g,'_') || 'x'; }).join('/');
  }
  function inferCategoryFromTask(q){
    var blob = normalize([q.group,q.category,q.cat,q.type,q.subtype,q.skill,q.testedConcept,(q.tags||[]).join(' '),q.q,q.question,q.text].join(' '));
    if(/it|edv|fisi|netzwerk|hardware|software|osi|dns|dhcp|server|client|ip|router|switch/.test(blob)) return 'it';
    if(/mathe|rechnen|prozent|dreisatz|kaufm|zahl|rechnung|euro|rabatt/.test(blob)) return 'mathe';
    if(/logik|matrix|muster|reihe|schlussfolger|analogie|visuell|würfel|wuerfel/.test(blob)) return 'logik';
    if(/konzentr|aufmerksamkeit|zeichen|tempo|streichen|vergleich/.test(blob)) return 'konzentration';
    if(/sprache|satz|deutsch|grammatik|text|erganz|ergänz|synonym|gegenteil/.test(blob)) return 'sprache';
    return 'gemischt';
  }
  function inferSubtypeFromTask(q, category){
    var blob = normalize([q.subtype,q.type,q.skill,q.testedConcept,(q.tags||[]).join(' '),q.q,q.question,q.text].join(' '));
    if(/wechsel|alternierend|abwechsel/.test(blob)) return 'wechselmuster';
    if(/matrix|feld|3x3|neun/.test(blob)) return 'matrix';
    if(/reihe|zahlenfolge|setze/.test(blob)) return 'zahlenreihe';
    if(/prozent|rabatt|grundwert/.test(blob)) return 'prozent';
    if(/dreisatz|personen|leistung/.test(blob)) return 'dreisatz';
    if(/dns|dhcp|ip|subnetz|gateway/.test(blob)) return 'netzwerk';
    if(/meinung|tatsache/.test(blob)) return 'meinung_tatsache';
    if(/zeichen|buchstaben|streichen|vergleich/.test(blob)) return 'zeichenvergleich';
    return category === 'gemischt' ? 'standard' : category;
  }
  function inferSkillFromTask(q, category, subtype){
    var direct = q.skill || q.testedConcept || (Array.isArray(q.skills) && q.skills[0]) || '';
    if(direct) return normalize(direct).replace(/\s+/g,'_');
    var map = {
      wechselmuster:'musterwechsel_erkennen', zahlenreihe:'zahlenreihen_regel_finden', matrix:'matrixlogik_erkennen',
      prozent:'prozent_sicher_rechnen', dreisatz:'verhaeltnis_umkehren', netzwerk:'netzwerk_symptom_deuten',
      meinung_tatsache:'aussageart_unterscheiden', zeichenvergleich:'visuell_genau_bleiben'
    };
    return map[subtype] || (category + '_grundskill');
  }
  function inferTrapFromTask(q, category, subtype){
    if(q.trap || q.commonMistake) return stripHtml(q.trap || q.commonMistake);
    var traps = {
      wechselmuster:'nur Addition oder nur Multiplikation vermutet', zahlenreihe:'Differenz zu früh festgelegt', matrix:'Zeile statt Spalte geprüft',
      prozent:'Prozentwert und Endwert verwechselt', dreisatz:'direkt statt umgekehrt gedacht', netzwerk:'Symptom der falschen Ursache zugeordnet',
      meinung_tatsache:'Meinung mit überprüfbarer Tatsache verwechselt', zeichenvergleich:'ähnliche Zeichen verwechselt'
    };
    return traps[subtype] || 'zu schnell entschieden';
  }
  function estimateExpectedTimeMs(category, subtype, difficulty){
    var base = { mathe:16000, logik:18000, it:17000, konzentration:14000, sprache:15000, gemischt:16000 }[category] || 16000;
    if(/matrix|wechsel|dreisatz|netzwerk/.test(subtype)) base += 3000;
    return Math.round(base * (0.75 + (clamp(difficulty || 3,1,5) * 0.15)));
  }
  function normalizeTaskDNA(q){
    q = q || {};
    var category = normalize(q.dna && q.dna.category || q.category || q.cat || q.group || inferCategoryFromTask(q)) || 'gemischt';
    var subtype = normalize(q.dna && q.dna.subtype || q.subtype || q.type || inferSubtypeFromTask(q, category)).replace(/\s+/g,'_') || 'standard';
    var difficulty = difficultyValue((q.dna && q.dna.difficulty) || q.difficulty || q.level || q.difficultyLevel || 3);
    var skill = normalize((q.dna && q.dna.skill) || q.skill || q.testedConcept || inferSkillFromTask(q, category, subtype)).replace(/\s+/g,'_') || (category + '_grundskill');
    var expectedTimeMs = parseInt((q.dna && q.dna.expectedTimeMs) || q.expectedTimeMs || q.targetTimeMs || q.timeMs || '',10);
    if(!isFinite(expectedTimeMs) || expectedTimeMs <= 0) expectedTimeMs = estimateExpectedTimeMs(category, subtype, difficulty);
    var trap = stripHtml((q.dna && q.dna.trap) || q.trap || q.commonMistake || inferTrapFromTask(q, category, subtype));
    var examTarget = normalize((q.dna && q.dna.examTarget) || q.examTarget || q.exam || q.target || 'allgemein') || 'allgemein';
    var inferred = !(q.dna && q.dna.category && q.dna.subtype && q.dna.skill && q.dna.expectedTimeMs && q.dna.trap);
    var distractorSchema = !!(q.distractors || (q.dna && q.dna.distractors) || q.distractorMap || q.answersMeta || q.optionsMeta);
    return { id:q.id || '', category:category, subtype:subtype, difficulty:difficulty, skill:skill, expectedTimeMs:expectedTimeMs, trap:trap, examTarget:examTarget, skillKey:[category,subtype,skill].join('/'), inferred:inferred, distractorSchema:distractorSchema };
  }
  function createSkillStat(dna){
    return { key:dna.skillKey || skillKeyFromDNA(dna), category:dna.category, subtype:dna.subtype, skill:dna.skill, answered:0, correct:0, avgMs:0, currentLevel:dna.difficulty || 3, lastMistake:'', streak:0, lastAt:'' };
  }
  function getSkillStat(memory, dna){
    memory.skillStats = memory.skillStats || {};
    var key = dna.skillKey || skillKeyFromDNA(dna);
    if(!memory.skillStats[key]) memory.skillStats[key] = createSkillStat(dna);
    return memory.skillStats[key];
  }
  function peekSkillStat(memory, dna){
    memory = memory || {}; memory.skillStats = memory.skillStats || {};
    var key = dna.skillKey || skillKeyFromDNA(dna);
    return memory.skillStats[key] || createSkillStat(dna);
  }
  function effectiveDifficulty(qOrDna, memory){
    var dna = qOrDna && qOrDna.skillKey ? qOrDna : normalizeTaskDNA(qOrDna || {});
    memory = memory || readMemory();
    var stat = peekSkillStat(memory, dna);
    var quote = stat.answered ? stat.correct / stat.answered : 0.5;
    var delta = 0;
    if(stat.answered >= 3 && quote < 0.55) delta += 1;
    if(stat.answered >= 5 && quote > 0.82 && stat.streak >= 3) delta -= 1;
    if(stat.avgMs && stat.avgMs > dna.expectedTimeMs * 1.25) delta += 0.5;
    if(stat.lastMistake) delta += 0.25;
    return clamp(Math.round((dna.difficulty || 3) + delta), 1, 5);
  }
  function updateSkillModel(memory, payload, dna, mistake){
    dna = dna || normalizeTaskDNA(payload || {});
    var stat = getSkillStat(memory, dna);
    var duration = Number(payload.duration || payload.durationMs || 0);
    stat.answered += 1;
    if(payload.correct){ stat.correct += 1; stat.streak += 1; }
    else { stat.streak = 0; stat.lastMistake = mistake || payload.mistakeType || inferMistake(payload); }
    if(duration > 0) stat.avgMs = stat.avgMs ? Math.round(stat.avgMs*0.7 + duration*0.3) : duration;
    stat.currentLevel = effectiveDifficulty(dna, memory);
    stat.lastAt = nowIso();
    memory.skillStats[stat.key] = stat;
    return stat;
  }
  function queueSpacedReview(memory, payload, dna, mistake, diagnosis){
    memory.spacedQueue = Array.isArray(memory.spacedQueue) ? memory.spacedQueue : [];
    var delayMinutes = payload.correct ? 1440 : 20;
    if(payload.mode === 'revenge') delayMinutes = payload.correct ? 2880 : 60;
    var due = new Date(Date.now() + delayMinutes * 60000).toISOString();
    var id = payload.taskId || dna.id || uid('review');
    memory.spacedQueue = memory.spacedQueue.filter(function(x){ return x.taskId !== id; });
    memory.spacedQueue.unshift({ taskId:id, signature:payload.signature || '', dna:dna, mistake:mistake || '', diagnosis:diagnosis || null, errorPath:diagnosis && errorPathKey(diagnosis) || '', revengeTarget:diagnosis && diagnosis.revengeTarget || null, dueAt:due, attempts: payload.correct ? 0 : 1, createdAt:nowIso() });
    memory.spacedQueue = memory.spacedQueue.slice(0,80);
  }
  function dueSpacedItems(memory){
    memory = memory || readMemory();
    var now = Date.now();
    return (memory.spacedQueue || []).filter(function(x){ return x && x.dueAt && Date.parse(x.dueAt) <= now; }).sort(function(a,b){ return Date.parse(a.dueAt)-Date.parse(b.dueAt); });
  }
  function pruneSpacedQueue(memory, payload, correct){
    if(!Array.isArray(memory.spacedQueue)) return;
    if(correct && payload.taskId){ memory.spacedQueue = memory.spacedQueue.filter(function(x){ return x.taskId !== payload.taskId; }); }
  }
  function learnerLevelFor(profile, memory){
    memory = memory || readMemory();
    var stats = Object.keys(memory.skillStats || {}).map(function(k){ return memory.skillStats[k]; });
    if(profile && profile.skill && profile.skill !== 'mixed'){
      stats = stats.filter(function(s){ return normalize(s.category).indexOf(profile.skill) >= 0 || normalize(s.skill).indexOf(profile.skill) >= 0 || normalize(s.subtype).indexOf(profile.skill) >= 0; });
    }
    if(!stats.length) return profile && profile.difficulty || 3;
    var avg = stats.reduce(function(a,s){ return a + (s.currentLevel || 3); },0) / stats.length;
    return clamp(Math.round(avg),1,5);
  }
  function logDecision(memory, entry){
    memory.decisionLog = Array.isArray(memory.decisionLog) ? memory.decisionLog : [];
    entry = entry || {}; entry.at = nowIso();
    memory.decisionLog.unshift(entry);
    memory.decisionLog = memory.decisionLog.slice(0,30);
  }
  function lastDecisionLog(){ return (readMemory().decisionLog || []).slice(0,10); }
  function taskDebugInfo(task){
    if(!task) return null;
    var dna = task.dna || normalizeTaskDNA(task);
    var mem = readMemory();
    var stat = peekSkillStat(mem, dna);
    return { dna:dna, effectiveDifficulty:effectiveDifficulty(dna, mem), skillStat:stat, dueReviews:dueSpacedItems(mem).slice(0,3), decisionLog:lastDecisionLog().slice(0,5) };
  }


  function allQuestionBanks(){
    var list = [];
    try{ if(Array.isArray(window.QUESTION_BANK_EXTERNAL)) list = list.concat(window.QUESTION_BANK_EXTERNAL); }catch(e){}
    try{ if(Array.isArray(window.QUESTION_BANK)) list = list.concat(window.QUESTION_BANK); }catch(e){}
    try{ if(window.App && App._banks && Array.isArray(App._banks.questions)) list = list.concat(App._banks.questions); }catch(e){}
    var seen = {}, out = [];
    list.forEach(function(q, idx){
      if(!q || typeof q !== 'object') return;
      var text = q.q || q.question || q.text || q.prompt;
      var answers = q.a || q.answers || q.options;
      if(!text || !Array.isArray(answers) || answers.length < 2 || q.correct == null) return;
      var id = q.id || ('bank_' + idx + '_' + normalize(text).slice(0,36));
      if(seen[id]) return; seen[id] = 1; out.push(q);
    });
    return out;
  }
  function difficultyValue(v){
    var n = normalize(v == null ? '' : v);
    if(/very|extrem|elite|ctc|hard|schwer|brutal/.test(n)) return 5;
    if(/medium|mittel|normal/.test(n)) return 3;
    if(/easy|leicht|warm/.test(n)) return 2;
    var num = parseInt(n,10); return num ? clamp(num,1,5) : 3;
  }
  function skillOfTask(q){
    var blob = normalize([q.group,q.category,q.cat,q.subtype,(q.tags||[]).join(' ')].join(' '));
    if(/it|edv|fisi|netzwerk|hardware|software|osi|dns|dhcp|server|client/.test(blob)) return 'it';
    if(/mathe|rechnen|prozent|dreisatz|kaufm|zahl|rechnung/.test(blob)) return 'math';
    if(/logik|matrix|muster|reihe|schlussfolger|analogie|visuell/.test(blob)) return 'logic';
    if(/konzentr|aufmerksamkeit|zeichen|tempo/.test(blob)) return 'concentration';
    if(/sprache|satz|deutsch|grammatik|text|erganz|ergänz/.test(blob)) return 'language';
    return 'mixed';
  }
  function qualitySignature(q){
    return [q.id || '', q.group || q.category || q.cat || '', q.subtype || q.type || '', normalize(q.q || q.question || q.text || '').slice(0,54)].join('|');
  }
  function taskHasErrorPath(q, errorPath){
    if(!errorPath) return false;
    var wanted = normalizeErrorPath(errorPath);
    var all = [];
    if(Array.isArray(q && q.distractors)) all = all.concat(q.distractors);
    if(q && q.dna && Array.isArray(q.dna.distractors)) all = all.concat(q.dna.distractors);
    if(q && q.distractorMap && typeof q.distractorMap === 'object') Object.keys(q.distractorMap).forEach(function(k){ all.push(q.distractorMap[k]); });
    return all.some(function(d){ return d && normalizeErrorPath(d.errorPath || d.errorType || d.mistake || d.trap) === wanted; });
  }
  function bankScore(q, profile, memory, slot){
    var dna = normalizeTaskDNA(q);
    var skill = profile.skill || 'mixed', score = 0;
    var qSkill = skillOfTask(q);
    var skillMatch = (skill === 'mixed') || qSkill === skill || normalize(dna.category).indexOf(skill) >= 0 || normalize(dna.skill).indexOf(skill) >= 0;
    score += skill === 'mixed' ? 4 : (skillMatch ? 28 : -10);
    var target = clamp(profile.difficulty || learnerLevelFor(profile, memory) || 3,1,5);
    var effective = effectiveDifficulty(dna, memory);
    score += 18 - Math.abs(target - effective) * 5;
    var due = dueSpacedItems(memory).filter(function(x){ return x.dna && (x.dna.skillKey === dna.skillKey || x.signature === qualitySignature(q) || x.taskId === q.id); })[0];
    if(due) score += 35;
    if(profile.exactSkillKey && dna.skillKey === profile.exactSkillKey) score += 42;
    if(profile.exactSubtype && dna.subtype === profile.exactSubtype) score += 24;
    if(profile.exactTrap && normalize(dna.trap).indexOf(normalize(profile.exactTrap).split(' ')[0]) >= 0) score += 16;
    if(profile.revengeMistake && normalize(dna.trap + ' ' + dna.subtype + ' ' + dna.skill).indexOf(normalize(profile.revengeMistake).split(' ')[0]) >= 0) score += 15;
    if(profile.exactErrorPath && taskHasErrorPath(q, profile.exactErrorPath)) score += 55;
    if(profile.exactRevengeSignature){
      var rs = normalize(profile.exactRevengeSignature);
      var dnaBlob = normalize([dna.category,dna.subtype,dna.skill,dna.trap].join(' '));
      rs.split('_').forEach(function(tok){ if(tok && tok.length > 2 && dnaBlob.indexOf(tok) >= 0) score += 6; });
    }
    if(dna.distractorSchema) score += 7;
    var sig = qualitySignature(q);
    if(memory.recentSignatures && memory.recentSignatures.indexOf(sig) >= 0) score -= 60;
    if(memory.recentTasks && memory.recentTasks.some(function(x){ return x && (x.id === q.id); })) score -= 50;
    if(q.verified === true || q.status === 'verified') score += 5;
    if(q.explanation || q.ex || q.stepByStep || q.tip) score += 6;
    if(slot % 3 === 0 && !skillMatch && skill !== 'mixed') score += 5;
    var c = memory.categories && memory.categories[dna.category];
    if(c && c.answered >= 2){ var quote = Math.round(c.correct/c.answered*100); if(quote < 70) score += 9; }
    score += Math.random() * 3;
    return score;
  }
  function toCoachTask(q, profile, slot){
    var dna = normalizeTaskDNA(q);
    var answers = (q.a || q.answers || q.options || []).map(function(x){ return stripHtml(x); });
    var correct = Number(q.correct);
    var cat = dna.category || q.category || q.cat || q.group || 'Datenbank';
    var group = q.group || cat;
    var subtype = dna.subtype || q.subtype || q.type || 'bank';
    var diff = effectiveDifficulty(dna, readMemory());
    var text = q.q || q.question || q.text || q.prompt || '';
    var ex = stripHtml(q.explanation || q.ex || q.stepByStep || 'Die Lösung stammt aus der geprüften Aufgabendatenbank.');
    var skill = dna.skill || q.testedConcept || q.skill || (q.tags && q.tags[0]) || skillOfTask(q);
    var trap = dna.trap || q.trap || q.commonMistake || q.tip || 'zu schnell statt systematisch geprüft';
    var t = task(cat, group, subtype, diff, text, answers, correct, ex, skill, stripHtml(trap));
    t.id = q.id || t.id;
    t.generated = false;
    t.bankDriven = true;
    t.source = q.source || 'Aufgabendatenbank';
    t.signature = qualitySignature(q);
    t.dna = dna;
    t.expectedTimeMs = dna.expectedTimeMs;
    t.coachIntro = bankIntro(t, profile, slot);
    t.success = bankSuccess(t);
    t.fail = bankFail(t);
    t.tip = q.tip || q.hint || '';
    t.stepByStep = q.stepByStep || '';
    return t;
  }
  function bankIntro(t, profile, slot){
    if(slot === 0) return humanLine(['Ich starte mit einer echten Bank-Aufgabe. Danach schärfe ich den Druck passend nach.','Erst echte Datenbank, dann gezielter Transfer. So trainierst du nicht auswendig, sondern sicher.']);
    if(t.difficulty >= 5) return 'Jetzt wird es bewusst schwer. Erst Regel sichern, dann antworten – nicht ins Raten rutschen.';
    if(profile.skill !== 'mixed') return 'Gezielter Drill: gleiche Baustelle, anderer Reiz. Genau so wird es stabil.';
    return 'Echte Bank-Aufgabe. Einmal ruhig lesen, Muster greifen, dann entscheiden.';
  }
  function bankSuccess(t){ return humanLine(['Stark. Echte Bank-Aufgabe getroffen – das zählt direkt für Prüfungssicherheit.','Sauber. Genau solche Treffer machen deine Vorbereitung belastbar.']); }
  function bankFail(t){ return 'Fehlerpfad gespeichert. Ich nehme daraus die nächste passendere Revanche, nicht einfach nur die nächste zufällige Aufgabe.'; }
  function selectBankTask(profile, slot){
    var bank = allQuestionBanks(), memory = readMemory();
    if(!bank.length) return null;
    var scored = bank.map(function(q){ return {q:q, score:bankScore(q, profile, memory, slot || 0)}; })
      .filter(function(x){ return x.score > -20; })
      .sort(function(a,b){ return b.score-a.score; });
    if(!scored.length) return null;
    var choice = scored[Math.floor(Math.random() * Math.min(6, scored.length))];
    var out = toCoachTask(choice.q, profile, slot || 0);
    logDecision(memory, { action:'select_bank_task', taskId:out.id, score:Math.round(choice.score), slot:slot || 0, profile:{ skill:profile.skill, difficulty:profile.difficulty, mode:profile.mode, stage:profile.stage }, dna:out.dna, reason:profile.exactSkillKey ? 'Präzise Revanche: gleicher Skill/Trap wird bevorzugt' : (dueSpacedItems(memory).length ? 'Spaced-Repetition oder adaptive Skill-Auswahl' : 'Skill/Difficulty-Match + Wiederholungssperre') });
    saveMemory(memory);
    return out;
  }
  function databaseStats(){
    var bank = allQuestionBanks(), stats = { total:bank.length, bySkill:{}, byDnaCategory:{}, verified:0, dnaReady:0, inferred:0 };
    bank.forEach(function(q){ var s=skillOfTask(q); var dna=normalizeTaskDNA(q); stats.bySkill[s]=(stats.bySkill[s]||0)+1; stats.byDnaCategory[dna.category]=(stats.byDnaCategory[dna.category]||0)+1; if(q.verified===true || q.status==='verified') stats.verified++; if(q.dna || (q.skill && q.subtype && q.trap)) stats.dnaReady++; else stats.inferred++; });
    return stats;
  }

  function answerCurrentTask(task, message, context){
    var wantsSteps = /lösung|loesung|lösungsweg|loesungsweg|schritt|ergebnis/.test(normalize(message));
    var steps = [];
    if(task.stepByStep) steps = String(task.stepByStep).split(/<br\s*\/?|\n|\d+\.\s*/i).map(stripHtml).filter(Boolean);
    if(!steps.length && task.steps && Array.isArray(task.steps)) steps = task.steps;
    if(!steps.length && wantsSteps) steps = ['Frage am Ende zuerst lesen.', 'Wichtige Zahlen/Wörter markieren.', 'Regel bestimmen: Rechnen, Sprache, Logik oder EDV.', 'Antwort prüfen: Passt sie zur Frage und zur Zeit?'];
    return { found:true, mode:'task-help', title:'Hilfe zur aktuellen Aufgabe', shortAnswer:wantsSteps?'Ich zeige dir den Lösungsweg anhand der vorhandenen Aufgabendaten.':'Ich gebe dir zuerst einen Tipp, ohne direkt alles zu verraten.', easyExplanation:task.tip || task.hint || 'Lies zuerst genau, was gefragt ist. Danach markierst du die entscheidenden Angaben.', memoryTrick:task.trick || 'Erst Frage verstehen, dann Muster suchen, dann rechnen.', steps:steps, example:task.similarQuestion || '', commonMistake:task.commonMistake || task.trap || 'Typische Falle: zu schnell antworten, bevor die Regel klar ist.', tested:task.testedConcept || task.cat || task.category || task.group || 'Aufgabentraining', taskText:qText(task), options:qOptions(task), source:'Aktueller Aufgabenkontext', context:context || {} };
  }
  function buildKnowledgeReply(item, meta, context){ return { found:true, mode:'knowledge', confidence:meta && meta.score, title:item.topic || 'Lerncoach', shortAnswer:item.shortAnswer || '', easyExplanation:item.easyExplanation || '', memoryTrick:item.memoryTrick || '', steps:item.steps || [], example:item.example || '', commonMistake:item.commonMistake || '', related:item.related || [], source:item.source || 'Lokale Wissensdatenbank', subject:item.subject || '', context:context || {} }; }
  function noResult(query, related, context){ return { found:false, mode:related && related.length ? 'related-only':'no-result', title:related && related.length ? 'Ich finde dazu keinen direkten Treffer':'Dazu habe ich noch keinen sicheren Eintrag', shortAnswer:related && related.length ? 'Ich finde ähnliche Themen, aber keinen Treffer, den ich sauber als Antwort verkaufen würde.':'Dazu habe ich noch keinen geprüften Coach-Eintrag. Ich rate hier bewusst nicht.', easyExplanation:'Ich bleibe ehrlich: Wenn Wissen fehlt, erfinde ich nichts. Training kann ich trotzdem starten und anhand deiner Antworten besser werden.', memoryTrick:'Sag zum Beispiel: „Starte 5 Logikaufgaben“, „Mach Mathe schwer“ oder „Erklär mir diese Aufgabe“.', steps:['Frage kürzer stellen','ein Schlüsselwort nennen','Coach-Training starten','fehlendes Thema später ergänzen'], related:(related || []).map(relatedTopic), source:'Lokale Wissensdatenbank · No-Hallucination-Regel', query:query, context:context || {} }; }

  var SKILLS = {
    math:'Mathe', logic:'Logik', concentration:'Konzentration', it:'IT/FISI', language:'Sprache', mixed:'Gemischt'
  };
  function detectIntent(text){
    var n = normalize(text);
    var count = (n.match(/\b(\d{1,2})\b/) || [])[1];
    count = count ? clamp(parseInt(count,10), 3, 12) : 5;
    var hard = /schwer|brutal|ctc|bosch|hart|prufung|prüfung|druck/.test(n);
    var easy = /leicht|warm|warmup|einstieg|langsam/.test(n);
    var skill = /edv|it|fisi|netzwerk|dns|hardware/.test(n) ? 'it' : /mathe|rechnen|prozent|dreisatz|zahl/.test(n) ? 'math' : /logik|matrix|muster|reihe/.test(n) ? 'logic' : /konzentr|aufmerksamkeit|tempo/.test(n) ? 'concentration' : /deutsch|sprache|satz|grammatik/.test(n) ? 'language' : 'mixed';
    var wantsTraining = /start|mach|train|ubung|übung|aufgaben|runde|coachtraining|fokus/.test(n);
    var mood = /angst|unsicher|frust|langsam|mude|müde|keine konzentration/.test(n) ? 'support' : /motiv|stark|push/.test(n) ? 'push' : '';
    return { wantsTraining:wantsTraining, skill:skill, count:count, difficulty:hard?5:(easy?2:3), mood:mood, raw:n };
  }
  function chooseProfile(intent){
    var s = memorySummary();
    var skill = intent.skill || 'mixed';
    if(skill === 'mixed' && s.weakest){
      if(/Mathe|Zahlen|Rechnen/i.test(s.weakest.name)) skill = 'math';
      else if(/Logik|Matrix/i.test(s.weakest.name)) skill = 'logic';
      else if(/IT|EDV|FISI/i.test(s.weakest.name)) skill = 'it';
      else if(/Konzentr/i.test(s.weakest.name)) skill = 'concentration';
    }
    return { skill:skill, count:intent.count || 5, difficulty:intent.difficulty || 3, reason:s.weakest ? ('Fokus wegen Schwächesignal: '+s.weakest.name) : 'Fokus für frischen Trainingsreiz', summary:s };
  }

  function makeOptions(correct, distractors){
    var all = [String(correct)].concat(distractors.map(String).filter(function(x){return String(x)!==String(correct);}));
    var unique = [];
    all.forEach(function(x){ if(unique.indexOf(x) < 0) unique.push(x); });
    while(unique.length < 4) unique.push(String(Number(correct || 0) + unique.length + 2));
    unique = shuffle(unique).slice(0,4);
    return { a:unique, correct:unique.indexOf(String(correct)) };
  }
  function genSeries(difficulty){
    var subtype = pick(difficulty >= 4 ? ['wechsel-plus-mal','quadratisch','differenz-steigt','mal-minus'] : ['plus','mal','wechsel-plus-mal','differenz-steigt']);
    var seq=[], answer, ex='', trap='';
    if(subtype === 'plus'){
      var start = Math.floor(3+Math.random()*18), step = Math.floor(3+Math.random()*9); seq=[start,start+step,start+2*step,start+3*step]; answer=start+4*step; ex='Jede Zahl steigt um '+step+'.'; trap='Zählfehler bei konstanter Differenz';
    }else if(subtype === 'mal'){
      var s = Math.floor(2+Math.random()*7), f = pick([2,3]); seq=[s,s*f,s*f*f,s*f*f*f]; answer=s*f*f*f*f; ex='Jede Zahl wird mit '+f+' multipliziert.'; trap='Addition statt Faktor vermutet';
    }else if(subtype === 'differenz-steigt'){
      var a0 = Math.floor(4+Math.random()*15), d = Math.floor(2+Math.random()*5), inc = Math.floor(1+Math.random()*4); seq=[a0]; for(var i=0;i<4;i++){ seq.push(seq[seq.length-1]+d+i*inc); } answer=seq.pop()+d+4*inc; ex='Die Abstände steigen: '+[d,d+inc,d+2*inc,d+3*inc,d+4*inc].join(', ')+'.'; trap='nur letzte Differenz fortgeführt';
    }else if(subtype === 'mal-minus'){
      var x = Math.floor(3+Math.random()*7), minus = Math.floor(1+Math.random()*4); seq=[x]; for(var j=0;j<4;j++){ seq.push(seq[seq.length-1]*2-minus); } answer=seq.pop()*2-minus; ex='Regel: mal 2, dann '+minus+' abziehen.'; trap='reine Verdopplung gewählt';
    }else{
      var p = Math.floor(2+Math.random()*5), plus = Math.floor(2+Math.random()*6), mult = pick([2,3]); seq=[p, p+plus, (p+plus)*mult, (p+plus)*mult+plus, ((p+plus)*mult+plus)*mult]; answer=seq[4]+plus; ex='Wechselmuster: +'+plus+', ×'+mult+', +'+plus+', ×'+mult+', dann wieder +'+plus+'.'; trap='nur Addition oder nur Multiplikation geprüft';
    }
    var opts = makeOptions(answer, [answer+1, answer-1, Math.round(answer*1.5), seq[seq.length-1]+(seq[seq.length-1]-seq[seq.length-2])]);
    return task('Zahlenreihe', 'Logik', subtype, difficulty, 'Setze die Reihe fort: <b>'+seq.join(' · ')+' · ?</b>', opts.a, opts.correct, ex, 'Muster erkennen', trap);
  }
  function genMentalMath(difficulty){
    var kind = pick(difficulty >= 4 ? ['rabatt','prozent','dreisatz','mix'] : ['prozent','dreisatz','plusminus']);
    var q, ans, ex, trap;
    if(kind === 'rabatt'){
      var price = pick([60,80,120,150,200,240]), pct = pick([10,15,20,25,30]); ans = price - price*pct/100; q='Ein Artikel kostet '+price+' €. Es gibt '+pct+' % Rabatt. Wie viel zahlst du?'; ex=pct+' % von '+price+' € sind '+(price*pct/100)+' €. Also '+price+' - '+(price*pct/100)+' = '+ans+' €.'; trap='Rabatt mit Endpreis verwechselt';
    }else if(kind === 'dreisatz'){
      var people=pick([2,3,4,5]), time=pick([6,8,10,12]), target=people*2; ans=time/2; q=people+' Personen brauchen '+time+' Stunden. Wie lange brauchen '+target+' Personen bei gleicher Leistung?'; ex='Doppelt so viele Personen brauchen halb so lange: '+ans+' Stunden.'; trap='direkt verdoppelt statt umgekehrt gedacht';
    }else if(kind === 'plusminus'){
      var a=pick([38,47,56,68,79]), b=pick([14,23,31,42]), c=pick([7,9,12,16]); ans=a+b-c; q='Rechne im Kopf: '+a+' + '+b+' - '+c; ex=a+' + '+b+' = '+(a+b)+', dann - '+c+' = '+ans+'.'; trap='Zwischenschritt verloren';
    }else if(kind === 'mix'){
      var base=pick([90,120,150]), p=pick([10,20,30]), fee=pick([6,8,12]); ans=base+base*p/100-fee; q='Ein Betrag von '+base+' € steigt um '+p+' % und danach werden '+fee+' € abgezogen. Ergebnis?'; ex=p+' % von '+base+' € = '+(base*p/100)+' €. '+base+' + '+(base*p/100)+' - '+fee+' = '+ans+' €.'; trap='Reihenfolge unsauber';
    }else{
      var total=pick([80,120,160,200]), percent=pick([10,25,50,75]); ans=total*percent/100; q='Wie viel sind '+percent+' % von '+total+'?'; ex=percent+' % bedeutet '+percent+'/100. Ergebnis: '+ans+'.'; trap='Prozentwert und Grundwert verwechselt';
    }
    var opts = makeOptions(ans, [ans+10, ans-10, Math.round(ans*1.2), Math.max(1, ans/2)]);
    return task('Kopfrechnen', 'Mathe', kind, difficulty, q, opts.a, opts.correct, ex, 'schnell und sauber rechnen', trap);
  }
  function genIT(difficulty){
    var pool = [
      {q:'Ein PC hat Internetprobleme. IP ist vorhanden, aber Webseiten öffnen nicht per Name. Was prüfst du zuerst?', a:['DNS-Einstellung','Bildschirmkabel','Tastaturlayout','Druckerwarteschlange'], c:0, ex:'Wenn IP-Verbindung da ist, aber Namen nicht auflösen, ist DNS der erste Verdacht.', trap:'Symptom falsch eingeordnet'},
      {q:'Ein Client bekommt keine automatische IP-Adresse. Welcher Dienst ist besonders verdächtig?', a:['DHCP','SMTP','HTTP','Bluetooth'], c:0, ex:'DHCP verteilt automatisch IP-Adressen.', trap:'Netzwerkdienst verwechselt'},
      {q:'Ein Benutzer kann sich an der Domäne nicht anmelden. Andere Nutzer können es. Was ist am wahrscheinlichsten?', a:['Benutzerkonto/Passwort prüfen','Switch austauschen','Monitor kalibrieren','Maus reinigen'], c:0, ex:'Wenn andere Logins funktionieren, liegt es eher am Konto oder Passwort.', trap:'zu große Fehlerursache gewählt'},
      {q:'Welche Angabe gehört typischerweise zu einer IPv4-Konfiguration?', a:['IP-Adresse, Subnetzmaske, Gateway, DNS','RAM, CPU, GPU, Netzteil','Name, Alter, Beruf, Ort','Dateiname, Schriftart, Farbe, Rand'], c:0, ex:'IPv4 braucht Adresse, Netzmaske, Gateway und oft DNS.', trap:'Begriffsfelder vermischt'}
    ];
    var x = pick(pool), opts = shuffle(x.a), corr = opts.indexOf(x.a[x.c]);
    return task('IT-Szenario', 'IT/FISI', 'diagnose', difficulty, x.q, opts, corr, x.ex, 'Symptom → Ursache', x.trap);
  }
  function genConcentration(difficulty){
    var letters = ['b','d','p','q','g','9','6'];
    var target = pick(['b','d','p','q']);
    var len = difficulty >= 4 ? 18 : 12;
    var arr = [];
    for(var i=0;i<len;i++) arr.push(pick(letters));
    var count = arr.filter(function(x){return x===target;}).length;
    if(count < 2){ arr[1]=target; arr[5]=target; count=arr.filter(function(x){return x===target;}).length; }
    var opts = makeOptions(count, [count+1, Math.max(0,count-1), count+2, Math.max(0,count-2)]);
    return task('Konzentration', 'Konzentration', 'zeichenzaehlen', difficulty, 'Wie oft kommt <b>'+target+'</b> vor?<br><span class="coach-sequence">'+arr.join(' ')+'</span>', opts.a, opts.correct, 'Zähle nur das Zielzeichen und ignoriere ähnliche Zeichen.', 'visuelle Genauigkeit', 'ähnliche Zeichen verwechselt');
  }
  function genLanguage(difficulty){
    var pool = [
      {q:'Welches Wort passt am besten? „Obwohl es regnete, ___ sie pünktlich.“', a:['kam','kommt','kommen','gekommen'], c:0, ex:'Der Satz steht in der Vergangenheit: sie kam pünktlich.', trap:'Zeitform nicht beachtet'},
      {q:'Was ist das Gegenteil von „präzise“?', a:['ungenau','schnell','freundlich','modern'], c:0, ex:'Präzise bedeutet genau. Das Gegenteil ist ungenau.', trap:'ähnlich klingendes Wort gewählt'},
      {q:'Welche Aussage ist eher eine Tatsache?', a:['Berlin ist die Hauptstadt Deutschlands.','Berlin ist die schönste Stadt.','Mathe ist immer leicht.','Alle mögen Prüfungen.'], c:0, ex:'Eine Hauptstadt ist überprüfbar; Schönheit ist Meinung.', trap:'Meinung und Tatsache verwechselt'}
    ];
    var x = pick(pool), opts = shuffle(x.a), corr = opts.indexOf(x.a[x.c]);
    return task('Sprache', 'Sprache', 'sprachlogik', difficulty, x.q, opts, corr, x.ex, 'genau lesen', x.trap);
  }
  function task(cat, group, subtype, difficulty, q, a, correct, ex, skill, trap){
    var signature = [cat, subtype, normalize(q).slice(0,32)].join('|');
    var dna = normalizeTaskDNA({ id:'', category:group || cat, cat:cat, subtype:subtype, difficulty:difficulty, skill:skill, trap:trap, q:q, expectedTimeMs:(difficulty>=4?18000:25000) }); return { id:uid('coach_task'), generated:true, cat:cat, group:group, subtype:subtype, difficulty:difficulty, q:q, a:a, correct:correct, ex:ex, skill:skill, trap:trap, signature:signature, time: difficulty>=4?18:25, coachIntro:coachIntro(cat, difficulty, skill), success:successLine(cat, difficulty), fail:failLine(trap), dna:dna, expectedTimeMs:dna.expectedTimeMs }; 
  }
  function coachIntro(cat, difficulty, skill){
    if(difficulty >= 5) return 'Jetzt eine schwere Variante. Ruhig bleiben: erst Regel finden, dann antworten.';
    if(difficulty >= 4) return 'Leicht über Komfortzone. Genau dieser Bereich bringt dich voran.';
    return 'Kurzer sauberer Treffer. Ziel: Sicherheit aufbauen, ohne dich zu überladen.';
  }
  function successLine(cat, difficulty){
    if(difficulty >= 4) return 'Stark. Das war nicht nur richtig, sondern prüfungsnah sauber.';
    return 'Sauber gelöst. Genau solche Treffer bauen Tempo und Vertrauen auf.';
  }
  function failLine(trap){ return 'Trainingssignal: '+(trap || 'Muster nicht sauber erkannt')+'. Kein Drama – genau das drehen wir jetzt.'; }
  function generateSyntheticTask(profile){
    var skill = profile.skill || 'mixed';
    var difficulty = clamp(profile.difficulty || 3, 1, 5);
    var makers = skill === 'math' ? [genMentalMath, genSeries] : skill === 'logic' ? [genSeries, genConcentration] : skill === 'it' ? [genIT, genMentalMath] : skill === 'concentration' ? [genConcentration, genSeries] : skill === 'language' ? [genLanguage, genConcentration] : [genSeries, genMentalMath, genIT, genConcentration, genLanguage];
    var memory = readMemory(), tries = 0, t;
    do { t = pick(makers)(difficulty); tries++; } while(t && memory.recentSignatures.indexOf(t.signature) >= 0 && tries < 10);
    if(t){ t.source = 'Coach-Generator'; t.generated = true; var mem=readMemory(); logDecision(mem, { action:'generate_transfer_task', taskId:t.id, profile:{ skill:skill, difficulty:difficulty }, dna:t.dna, reason:'Transfer-Reiz, Datenbanklücke oder Abwechslung' }); saveMemory(mem); }
    return t;
  }
  function generateTask(profile, slot){
    profile = profile || {};
    var bankAvailable = allQuestionBanks().length > 0;
    var useBank = bankAvailable && ((slot || 0) % 3 !== 2 || profile.skill !== 'mixed');
    var t = useBank ? selectBankTask(profile, slot || 0) : null;
    if(!t) t = generateSyntheticTask(profile);
    if(t && t.bankDriven && (slot || 0) % 3 === 1){
      t.coachIntro += ' Danach kommt bewusst ein Transfer-Reiz, damit es nicht nach Auswendiglernen wirkt.';
    }
    return t;
  }
  function startSession(options){
    options = options || {};
    var safeOptions = { skill:options.skill || 'mixed', count:cleanCount(options.count, 5, 3, 12), difficulty:cleanCount(options.difficulty, 3, 1, 5) };
    var base = chooseProfile(safeOptions);
    base.count = cleanCount(base.count || safeOptions.count, safeOptions.count, 3, 12);
    base.difficulty = cleanCount(base.difficulty || safeOptions.difficulty, safeOptions.difficulty, 1, 5);
    var profile = modeProfile(options.mode || 'focus-5', base);
    profile.count = cleanCount(profile.count, 5, 3, 12);
    profile.difficulty = cleanCount(profile.difficulty, 3, 1, 5);
    var pathPlan = learningPathPlan(Object.assign({}, options, { mode:profile.mode, skill:profile.skill, count:profile.count }));
    var session = { id:uid('coach_session'), startedAt:nowIso(), profile:profile, mode:profile.mode, count:profile.count, index:0, correct:0, answered:0, tasks:[], finished:false, learningIntelligence:{ learnerLevel:learnerLevelFor(profile), dueReviews:dueSpacedItems(readMemory()).length, reason:profile.reason || 'Adaptive Runde' }, learningPath:pathPlan };
    var memForPlan = readMemory(); memForPlan.learningPath = memForPlan.learningPath || { lastPlan:null, history:[] }; memForPlan.learningPath.lastPlan = pathPlan; saveMemory(memForPlan);
    for(var i=0;i<profile.count;i++){
      var phase = (pathPlan.phases || [])[i] || null;
      var sp = phaseProfile(stageProfile(profile, i), phase);
      var generated = generateTask(sp, i);
      if(!generated) generated = generateSyntheticTask({ skill:'mixed', difficulty:3 }) || task('Gemischt','Gemischt','fallback',3,'Welche Strategie ist hier am sinnvollsten?',['erst Frage lesen','sofort raten','Antworten ignorieren','Zeit stoppen'],0,'Zuerst muss klar sein, was gefragt ist. Dann entscheidest du systematisch.','Strategie','zu schnell geraten');
      generated.stage = sp.stage;
      generated.phaseKey = sp.phaseKey || '';
      generated.phaseGoal = sp.phaseGoal || '';
      generated.phasePriority = sp.phasePriority || '';
      generated.mode = profile.mode;
      if(profile.revengeMistake) generated.revengeMistake = profile.revengeMistake;
      generated.coachIntro = (sp.stage ? sp.stage + ': ' : '') + (generated.coachIntro || '');
      session.tasks.push(generated);
    }
    try{ localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }catch(e){}
    return session;
  }
  function readSession(){
    var s = null;
    try{ var raw=localStorage.getItem(SESSION_KEY); s = raw?safeJsonParse(raw,null):null; }catch(e){ s = null; }
    if(!s || typeof s !== 'object' || !Array.isArray(s.tasks)) return null;
    s.index = cleanCount(s.index,0,0,Math.max(0,s.tasks.length));
    s.answered = cleanCount(s.answered,0,0,999);
    s.correct = cleanCount(s.correct,0,0,999);
    s.count = cleanCount(s.count || s.tasks.length, s.tasks.length || 1, 1, 12);
    return s;
  }
  function saveSession(s){ try{ if(s && typeof s === 'object') localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }catch(e){} return s; }
  function currentSessionTask(){ var s=readSession(); if(!s || s.finished) return null; return {session:s, task:s.tasks[s.index] || null}; }
  function answerSessionTask(givenIndex){
    var s = readSession();
    if(!s || s.finished || !s.tasks[s.index]) return { ok:false, message:'Keine aktive Coach-Runde.' };
    var t = s.tasks[s.index];
    var idx = Number(givenIndex);
    if(!isFinite(idx) || idx < 0 || !Array.isArray(t.a) || idx >= t.a.length) return { ok:false, message:'Diese Antwort konnte nicht gewertet werden.' };
    if(t.__answeredAt) return { ok:false, message:'Diese Aufgabe wurde bereits gewertet.' };
    t.__answeredAt = nowIso();
    var correct = idx === Number(t.correct);
    s.answered += 1; if(correct) s.correct += 1;
    var revengeMistake = (s.profile && s.profile.revengeMistake) || (t && t.revengeMistake) || '';
    var rec = recordMemory({ generated:!!t.generated, taskId:t.id, signature:t.signature, cat:t.cat, group:t.group, subtype:t.subtype, skill:t.skill, dna:t.dna, task:t, correct:correct, givenIndex:idx, correctIndex:t.correct, selectedText:(t.a && t.a[idx]) || '', correctText:(t.a && t.a[t.correct]) || '', difficulty:t.difficulty, trap:t.trap, duration:0, allowed:t.time, mode:s.mode || (s.profile && s.profile.mode) || '', phase:t.phaseKey || t.stage || '', stage:t.stage || '', revengeMistake: revengeMistake });
    var feedback = { ok:true, correct:correct, reward:rec.reward, mistakeType:rec.mistakeType, task:t, session:s, explanation:t.ex, selected:idx, correctIndex:t.correct, line:correct ? t.success : t.fail };
    s.index += 1;
    if(s.index >= s.tasks.length){
      s.finished = true; s.finishedAt = nowIso();
      var m = readMemory(); m.sessions.unshift({id:s.id, at:s.finishedAt, mode:s.mode || (s.profile && s.profile.mode) || '', profile:s.profile, correct:s.correct, answered:s.answered}); m.sessions = m.sessions.slice(0,18); saveMemory(m); markDailyChallenge(s);
    }
    saveSession(s);
    feedback.session = s;
    return feedback;
  }
  function avgCategoryMs(categories){
    var total=0, count=0;
    (categories || []).forEach(function(c){ if(c.avgMs){ total += c.avgMs; count++; } });
    return count ? Math.round(total/count) : 0;
  }
  function coverageScore(categories){
    var names = (categories || []).filter(function(c){ return c.answered > 0; }).map(function(c){ return c.name; });
    var buckets = { math:0, logic:0, it:0, concentration:0, language:0 };
    names.forEach(function(n){
      if(/mathe|zahl|rechnen|prozent|dreisatz/i.test(n)) buckets.math=1;
      else if(/logik|matrix|muster|reihe/i.test(n)) buckets.logic=1;
      else if(/it|edv|fisi|netz|hardware|dns/i.test(n)) buckets.it=1;
      else if(/konzentr|aufmerksamkeit|tempo/i.test(n)) buckets.concentration=1;
      else if(/sprache|satz|deutsch|text/i.test(n)) buckets.language=1;
    });
    return Math.round(Object.keys(buckets).reduce(function(a,k){ return a + buckets[k]; },0) / 5 * 100);
  }
  function stabilityScore(memory){
    var sessions = (memory.sessions || []).slice(0,6);
    if(!sessions.length) return memory.totals.answered >= 10 ? 58 : 38;
    var quotes = sessions.map(function(s){ return s.answered ? Math.round(s.correct/s.answered*100) : 0; });
    var avg = quotes.reduce(function(a,b){return a+b;},0) / quotes.length;
    var variance = quotes.reduce(function(a,b){ return a + Math.pow(b-avg,2); },0) / quotes.length;
    return clamp(Math.round(avg - Math.sqrt(variance)*0.55), 0, 100);
  }
  function readinessScore(){
    var s = memorySummary(), m = s.memory;
    var answered = m.totals.answered || 0;
    var accuracy = answered ? s.totalQuote : 0;
    var avgMs = avgCategoryMs(s.categories);
    var speed = avgMs ? clamp(Math.round(100 - ((avgMs - 4500) / 80)), 25, 100) : (answered >= 8 ? 58 : 35);
    var coverage = coverageScore(s.categories);
    var stability = stabilityScore(m);
    var streak = clamp((m.totals.bestStreak || 0) * 8, 0, 100);
    var confidence = clamp(Math.round(answered / 28 * 100), 0, 100);
    var bpsRaw = accuracy*0.44 + speed*0.18 + coverage*0.14 + stability*0.18 + streak*0.06;
    var ctcPenalty = Math.max(0, 18 - (coverage * 0.08)) + (s.weakest && s.weakest.quote < 65 ? 8 : 0);
    var ctcRaw = accuracy*0.36 + speed*0.24 + coverage*0.12 + stability*0.14 + streak*0.06 + (answered >= 20 ? 8 : 0) - ctcPenalty;
    return {
      bps: clamp(Math.round(bpsRaw), 0, 100),
      ctc: clamp(Math.round(ctcRaw), 0, 100),
      confidence: confidence,
      accuracy: accuracy,
      speed: speed,
      coverage: coverage,
      stability: stability,
      streak: streak,
      avgMs: avgMs,
      label: confidence < 35 ? 'Daten sammeln' : (ctcRaw >= 75 ? 'prüfungsnah stabil' : bpsRaw >= 75 ? 'BPS stark, CTC noch schärfen' : 'aufbaubereit'),
      summary: s
    };
  }
  function trainingModes(){
    return [
      { id:'focus-5', title:'5-Min Fokus', skill:'mixed', difficulty:3, count:5, tone:'schnell reinfinden', promise:'kurzer Flow ohne Überforderung' },
      { id:'revenge', title:'Fehler-Revanche', skill:'mixed', difficulty:4, count:5, tone:'alte Fehler drehen', promise:'genau die Fallen, die dich zuletzt gebremst haben' },
      { id:'bps-sprint', title:'BPS Sprint', skill:'mixed', difficulty:4, count:8, tone:'Tempo + Breite', promise:'gemischt, kurz, prüfungsnah' },
      { id:'ctc-hard', title:'CTC Hard', skill:'mixed', difficulty:5, count:8, tone:'über Niveau trainieren', promise:'hart, aber kontrolliert' },
      { id:'daily', title:'Daily Challenge', skill:'mixed', difficulty:4, count:6, tone:'heutiger Reiz', promise:'ein kleiner täglicher Fortschrittsanker' }
    ];
  }
  function weeklyTrend(){
    var m = readMemory();
    var keys = Object.keys(m.weekly || {}).sort();
    var currentKey = weekKey();
    var current = m.weekly[currentKey] || {answered:0, correct:0, totalMs:0};
    var prev = keys.filter(function(k){ return k !== currentKey; }).slice(-1)[0];
    var previous = prev ? m.weekly[prev] : null;
    var quote = current.answered ? Math.round(current.correct/current.answered*100) : 0;
    var prevQuote = previous && previous.answered ? Math.round(previous.correct/previous.answered*100) : null;
    return { week:currentKey, answered:current.answered || 0, correct:current.correct || 0, quote:quote, previousQuote:prevQuote, delta:prevQuote == null ? null : quote-prevQuote, avgMs:current.answered && current.totalMs ? Math.round(current.totalMs/current.answered) : 0 };
  }
  function mistakeInsights(){
    var m = readMemory();
    return Object.keys(m.mistakeDNA || {}).map(function(k){
      var x = m.mistakeDNA[k] || {}; var cats = Object.keys(x.categories || {}).sort(function(a,b){ return (x.categories[b]||0)-(x.categories[a]||0); });
      return { name:k, count:x.count || 0, lastAt:x.lastAt || '', mainCategory:cats[0] || '', revengeWon:x.revengeWon || 0 };
    }).sort(function(a,b){ return b.count-a.count; }).slice(0,6);
  }
  function dailyChallenge(){
    var m = readMemory(); var key = todayKey();
    m.dailyChallenges = m.dailyChallenges || {};
    if(!m.dailyChallenges[key]){
      var modes = ['focus-5','revenge','bps-sprint','ctc-hard'];
      var idx = Math.abs(key.split('').reduce(function(a,c){return a+c.charCodeAt(0);},0)) % modes.length;
      var mode = modes[idx];
      var rec = nextRecommendation();
      m.dailyChallenges[key] = { id:'daily_'+key, date:key, mode:mode, skill:rec.skill || 'mixed', difficulty: mode==='ctc-hard'?5:Math.max(3, rec.difficulty || 3), count: mode==='ctc-hard'?8:6, done:false, bestQuote:null, title: mode==='ctc-hard'?'CTC Speed-Reiz': mode==='revenge'?'Fehler-Revanche': mode==='bps-sprint'?'BPS Sprint':'5-Minuten Fokus' };
      saveMemory(m);
    }
    return m.dailyChallenges[key];
  }
  function markDailyChallenge(session){
    if(!session || session.mode !== 'daily') return null;
    var m = readMemory(); var key = todayKey(); var d = m.dailyChallenges && m.dailyChallenges[key]; if(!d) return null;
    var quote = session.answered ? Math.round(session.correct/session.answered*100) : 0;
    d.done = true; d.bestQuote = d.bestQuote == null ? quote : Math.max(d.bestQuote, quote); d.finishedAt = nowIso();
    m.dailyChallenges[key] = d; saveMemory(m); return d;
  }
  function learningIntelligenceReport(){
    var m = readMemory();
    var stats = Object.keys(m.skillStats || {}).map(function(k){ return m.skillStats[k]; }).sort(function(a,b){ return (b.answered||0)-(a.answered||0); });
    var weak = stats.filter(function(s){ return s.answered >= 2; }).sort(function(a,b){ return ((a.correct/a.answered)-(b.correct/b.answered)) || (b.currentLevel-a.currentLevel); })[0] || null;
    var strong = stats.filter(function(s){ return s.answered >= 2; }).sort(function(a,b){ return ((b.correct/b.answered)-(a.correct/a.answered)) || (b.streak-a.streak); })[0] || null;
    var masteryList = Object.keys(m.mastery || {}).map(function(k){ return m.mastery[k]; }).sort(function(a,b){ return (a.score||0)-(b.score||0); });
    return { learnerLevel:learnerLevelFor({skill:'mixed'}, m), dueReviews:dueSpacedItems(m).length, queuedReviews:(m.spacedQueue||[]).length, spacedQueue:(m.spacedQueue||[]).slice(0,5), weakSkill:weak, strongSkill:strong, mastery:masteryList.slice(0,8), weakestMastery:masteryList[0] || null, strongestMastery:masteryList.slice().reverse()[0] || null, sectionTraffic:sectionTrafficLight(), dnaStats:m.dnaStats || {}, preciseMistakes:(m.preciseMistakes||[]).slice(0,5), learningCurve:learningCurveReport(), lastDecisions:(m.decisionLog||[]).slice(0,5), errorPath:errorPathReport(), learningPath:m.learningPath || { lastPlan:null, history:[] } };
  }
  function commandCenter(){
    var r = readinessScore(), m = r.summary.memory, day = (m.daily || {})[todayKey()] || {answered:0, correct:0, totalMs:0, categories:{}, mistakes:{}};
    var rec = nextRecommendation();
    var topMistake = Object.keys(m.mistakes || {}).sort(function(a,b){ return (m.mistakes[b]||0)-(m.mistakes[a]||0); })[0] || '';
    return {
      version: VERSION,
      readiness: r,
      today: { answered:day.answered || 0, correct:day.correct || 0, quote:day.answered ? Math.round(day.correct/day.answered*100) : 0, totalMs:day.totalMs || 0, categories:day.categories || {}, mistakes:day.mistakes || {} },
      recommendation: rec,
      modes: trainingModes(),
      strongest: r.summary.strongest,
      weakest: r.summary.weakest,
      topMistake: topMistake,
      recentRewards: (m.dopamine || []).slice(0,5),
      achievements: (m.achievements || []).slice(0,5),
      weekly: weeklyTrend(),
      personality: personality(m),
      personalities: PERSONALITIES,
      dailyChallenge: dailyChallenge(),
      mistakeInsights: mistakeInsights(),
      database: databaseStats(),
      learningIntelligence: learningIntelligenceReport(),
      learningCurve: learningCurveReport(),
      examTrafficLight: examTrafficLight(),
      preciseMistakes: (m.preciseMistakes || []).slice(0,8),
      errorPath: errorPathReport(),
      learningPath: m.learningPath || { lastPlan:null, history:[] },
      learningPathPlan: learningPathPlan({ count:5, mode:(rec && rec.mode) || 'focus-5', skill:(rec && rec.skill) || 'mixed' })
    };
  }
  function learningPathPlan(options){
    options = options || {};
    var m = readMemory();
    var rec = nextRecommendation();
    var count = cleanCount(options.count || rec.count || 5, 5, 3, 12);
    var mode = options.mode || rec.mode || 'focus-5';
    var due = dueSpacedItems(m);
    var lastPrecise = (m.preciseMistakes || [])[0] || null;
    var dominant = errorPathReport().dominant;
    var focusSkill = options.skill || rec.skill || 'mixed';
    var phases = [];
    for(var i=0;i<count;i++){
      var isLast = i === count-1;
      var phase = { index:i, key:'transfer', title:'Transfer', goal:'gleichen Skill unter anderem Reiz stabilisieren', difficultyDelta:0, priority:'balanced' };
      if(i === 0) phase = { index:i, key:'entry', title:'Einstieg', goal:'Kontrolle aufbauen und sauberen Start setzen', difficultyDelta:-1, priority:'confidence' };
      else if(i === 1 && due.length) phase = { index:i, key:'review', title:'Wiederholung', goal:'fällige Wiederholung sichern', difficultyDelta:0, priority:'spaced-review', target:due[0].revengeTarget || due[0].dna || null };
      else if(i === 1 && (lastPrecise || dominant)) phase = { index:i, key:'diagnosis', title:'Diagnose', goal:'dominanten Denkfehler erneut prüfen', difficultyDelta:0, priority:'error-path', target:lastPrecise && (lastPrecise.target || lastPrecise.revengeTarget) || null };
      else if((i === 2 || mode === 'revenge') && (lastPrecise || dominant)) phase = { index:i, key:'revenge', title:'Revanche', goal:'gleichen Denkfehler mit anderer Aufgabe knacken', difficultyDelta:-1, priority:'exact-revenge', target:lastPrecise && (lastPrecise.target || lastPrecise.revengeTarget) || null };
      else if(i === 3 || mode === 'ctc-hard') phase = { index:i, key:'challenge', title:'Challenge', goal:'unter höherem Anspruch stabil bleiben', difficultyDelta:1, priority:'stretch' };
      else if(isLast) phase = { index:i, key:'close', title:'Abschluss', goal:'mit lösbarem Erfolgssignal enden', difficultyDelta:0, priority:'finish-strong' };
      phases.push(phase);
    }
    return { mode:mode, focusSkill:focusSkill, count:count, recommendation:rec, dueReviews:due.length, dominantError:dominant, lastPrecise:lastPrecise, phases:phases, createdAt:nowIso() };
  }
  function phaseProfile(profile, phase){
    var p = Object.assign({}, profile);
    phase = phase || {};
    p.stage = phase.title || p.stage || 'Transfer';
    p.phaseKey = phase.key || 'transfer';
    p.phaseGoal = phase.goal || '';
    p.phasePriority = phase.priority || '';
    p.difficulty = clamp((profile.difficulty || 3) + (phase.difficultyDelta || 0), 1, 5);
    if(phase.target){
      p.exactSkillKey = phase.target.skillKey || p.exactSkillKey;
      p.exactSubtype = phase.target.subtype || p.exactSubtype;
      p.exactTrap = phase.target.trap || p.exactTrap;
      p.exactRevengeSignature = phase.target.revengeSignature || p.exactRevengeSignature;
      p.exactErrorPath = phase.target.errorPath || p.exactErrorPath;
      p.revengeMistake = phase.target.mistakeType || p.revengeMistake;
    }
    if(phase.key === 'review') p.mode = 'review';
    if(phase.key === 'revenge') p.mode = 'revenge';
    return p;
  }

  function modeProfile(mode, profile){
    profile = profile || {};
    var p = { skill:profile.skill || 'mixed', count:profile.count || 5, difficulty:profile.difficulty || 3, reason:profile.reason || 'Adaptive Coach-Runde', summary:profile.summary, mode:mode || profile.mode || 'focus-5' };
    if(p.mode === 'ctc-hard'){ p.skill='mixed'; p.difficulty=5; p.count=Math.max(8, p.count); p.reason='CTC Hard Mode: bewusst über Prüfungsniveau, aber mit Coach-Dramaturgie.'; }
    if(p.mode === 'bps-sprint'){ p.skill='mixed'; p.difficulty=4; p.count=Math.max(8, p.count); p.reason='BPS Sprint: gemischt, schnell, breit.'; }
    if(p.mode === 'daily'){ var dc = dailyChallenge(); p.skill=dc.skill || 'mixed'; p.difficulty=dc.difficulty || 4; p.count=dc.count || 6; p.reason='Daily Challenge: '+(dc.title || 'kurzer täglicher Fortschrittsanker')+'.'; }
    if(p.mode === 'revenge'){
      var m = readMemory();
      var pm = m.preciseMistakes && m.preciseMistakes[0];
      var rp = preciseRevengeProfile(pm);
      Object.keys(rp).forEach(function(k){ p[k] = rp[k]; });
      var s = memorySummary();
      if(!p.exactSkillKey && s.weakest){ p.skill=/Mathe|Zahl|Rechnen/i.test(s.weakest.name)?'math':/Logik|Matrix/i.test(s.weakest.name)?'logic':/IT|EDV|FISI/i.test(s.weakest.name)?'it':/Konzentr/i.test(s.weakest.name)?'concentration':'mixed'; }
      p.difficulty=Math.max(3, p.difficulty); p.reason='Fehler-Revanche: '+(p.revengeMistake || 'alte Falle')+' – gleicher Denkfehler, andere Aufgabe.';
    }
    if(p.mode === 'focus-5'){ p.count=5; p.reason=p.reason || '5-Minuten Fokus: kurz, sauber, motivierend.'; }
    return p;
  }
  function stageProfile(profile, slot){
    var p = Object.assign({}, profile);
    var last = slot >= (profile.count || 5)-1;
    if(slot === 0){ p.difficulty = Math.max(2, (profile.difficulty || 3)-1); p.stage='Einstieg'; }
    else if(last){ p.difficulty = Math.max(3, profile.difficulty || 3); p.stage='Erfolgssicherung'; }
    else if(slot === 2 || profile.mode === 'ctc-hard'){ p.difficulty = Math.min(5, (profile.difficulty || 3)+1); p.stage='Challenge'; }
    else { p.stage = profile.mode === 'revenge' ? 'Revanche' : 'Transfer'; }
    return p;
  }
  function nextRecommendation(){
    var s = memorySummary();
    if(!s.memory.totals.answered) return { title:'Erste 5 Signale sammeln', text:'Starte klein: 5 Aufgaben reichen, damit ich Tempo, Genauigkeit und erste Fehlerpfade messen kann.', skill:'mixed', difficulty:3, count:5, mode:'focus-5' };
    if(s.weakest) return { title:'Schwäche kurz drehen', text:s.weakest.name+' liegt bei '+s.weakest.quote+' %. Ich setze dort kurz an und halte die Runde bewusst klein.', skill:/Mathe|Zahl|Rechnen/i.test(s.weakest.name)?'math':/Logik|Matrix/i.test(s.weakest.name)?'logic':/IT|EDV|FISI/i.test(s.weakest.name)?'it':/Konzentr/i.test(s.weakest.name)?'concentration':'mixed', difficulty:clamp(Math.round(3 + (70-s.weakest.quote)/20),2,5), count:5, mode:'focus-5' };
    return { title:'Stabilität unter Druck prüfen', text:'Die Basis wirkt stabil. Nächster sinnvoller Reiz: gemischt, kurz und leicht über Komfortzone.', skill:'mixed', difficulty:4, count:5, mode:'focus-5' };
  }
  function coachStatement(text){
    var intent = detectIntent(text), summary = memorySummary();
    if(/personality|personlichkeit|persoenlichkeit|streng|ruhig|motivierend|prufungsnah|prüfungnah/.test(intent.raw)){ var id = /streng/.test(intent.raw)?'strict':/ruhig/.test(intent.raw)?'calm':/pruf|prüf|exam/.test(intent.raw)?'exam':/motivier/.test(intent.raw)?'motivating':''; if(id){ var pp=setPersonality(id); return {found:true, mode:'coach-note', title:'Coach-Persönlichkeit gesetzt', shortAnswer:'Coach-Stil: '+pp.title+'.', easyExplanation:'Alles klar. Ich formuliere ab jetzt '+pp.style+' – kurz genug fürs Training, aber mit klarem Lernsignal.', source:'Coach Preferences'}; } }
    if(/daily|challenge|tageschallenge|heute/.test(intent.raw) && /start|mach|zeige|challenge/.test(intent.raw)){ var dc=dailyChallenge(); return { found:true, mode:'start-training', title:'Daily Challenge bereit', shortAnswer:dc.title+' · heute zählt ein sauberer Abschluss, nicht maximale Länge.', recommendation:{mode:'daily', skill:dc.skill, difficulty:dc.difficulty, count:dc.count, title:'Daily starten'}, source:'Daily Challenge Engine' }; }
    if(intent.wantsTraining) return { found:true, mode:'start-training', title:'Coach-Training bereit', shortAnswer:'Ich stelle dir eine kurze Runde zusammen: echte Bank-Aufgaben, gezielte Revanche und ein Transferreiz.', recommendation:chooseProfile(intent), source:'Adaptive Coach Engine · Datenbank-Hybrid' };
    if(intent.mood === 'support') return { found:true, mode:'coach-note', title:'Coach Einschätzung', shortAnswer:'Okay. Dann gehen wir kleiner rein: erst Kontrolle zurückholen, dann Druck erhöhen.', easyExplanation:'Wenn du dich langsam oder unsicher fühlst, bringt ein kurzer Fokusblock mehr als ein langer Volltest. Ziel: ein sauberer Treffer, dann wieder steigern.', steps:['5 Aufgaben statt Volltest','erst reinkommen','eine Challenge sauber prüfen','Fehlerart merken und direkt nutzen'], recommendation:nextRecommendation(), source:'Coach Memory' };
    if(/fortschritt|analyse|leistung|status|dashboard/.test(intent.raw)) return { found:true, mode:'coach-status', title:'Dein Coach-Status', shortAnswer: summary.memory.totals.answered ? ('Aktuell: '+summary.totalQuote+' % Gesamtquote bei '+summary.memory.totals.answered+' gewerteten Aufgaben.') : 'Noch zu wenig Daten. Starte eine kurze Coach-Runde.', summary:summary, recommendation:nextRecommendation(), source:'Coach Memory' };
    return null;
  }
  function answer(message, context){
    context = context || {};
    if(!context.currentTask) context.currentTask = currentTaskFromApp();
    var query = String(message || '').trim();
    if(!query) return noResult('', [], context);
    var coach = coachStatement(query); if(coach) return coach;
    if(context.currentTask && isTaskRequest(query)) return answerCurrentTask(context.currentTask, query, context);
    var result = find(query, context);
    if(result.status === 'hit') return buildKnowledgeReply(result.item, result, context);
    if(result.status === 'related') return noResult(query, result.related, context);
    return noResult(query, result.related || [], context);
  }
  function randomTopics(limit, subject){ var list = knowledge().filter(function(x){ return !subject || normalize(x.subject) === normalize(subject); }); return shuffle(list).slice(0, limit || 8).map(relatedTopic); }
  function resetMemory(){ var m=defaultMemory(); saveMemory(m); try{localStorage.removeItem(SESSION_KEY);}catch(e){} return m; }

  function masteryReport(){ var m=readMemory(); return Object.keys(m.mastery || {}).map(function(k){ return m.mastery[k]; }).sort(function(a,b){ return (a.score||0)-(b.score||0); }); }



  function validateTaskDNAContract(task){
    var dna = normalizeTaskDNA(task || {});
    var raw = (task && task.dna) || task || {};
    var issues = [];
    var warnings = [];
    var required = ['id','category','subtype','difficulty','skill','expectedTimeMs','trap','examTarget'];
    required.forEach(function(k){
      var val = raw[k] !== undefined ? raw[k] : (raw.dna && raw.dna[k]);
      if(k === 'id' && (task && task.id)) val = task.id;
      if(val === undefined || val === null || String(val).trim() === '') issues.push('missing_' + k);
    });
    if(dna.difficulty < 1 || dna.difficulty > 5) issues.push('difficulty_out_of_range');
    if(!isFinite(dna.expectedTimeMs) || dna.expectedTimeMs < 3000 || dna.expectedTimeMs > 180000) warnings.push('expected_time_unusual');
    var ds = raw.distractors || (raw.dna && raw.dna.distractors) || raw.distractorMap || raw.answersMeta || raw.optionsMeta || [];
    if(ds && !Array.isArray(ds) && typeof ds === 'object') ds = Object.keys(ds).map(function(k){ return ds[k]; });
    if(!Array.isArray(ds) || !ds.length) warnings.push('no_distractor_evidence');
    else {
      ds.forEach(function(d, i){
        if(!d || typeof d !== 'object') issues.push('distractor_' + i + '_invalid');
        else {
          if(d.value === undefined && d.index === undefined) warnings.push('distractor_' + i + '_no_value_or_index');
          if(!d.errorPath) warnings.push('distractor_' + i + '_missing_errorPath');
          if(!d.hint && d.errorPath && d.errorPath !== 'correct') warnings.push('distractor_' + i + '_missing_hint');
        }
      });
    }
    if(dna.inferred) warnings.push('dna_inferred_by_adapter');
    return { ok: issues.length === 0, quality: clamp(100 - issues.length*18 - warnings.length*7, 0, 100), issues: issues, warnings: warnings, dna: dna };
  }

  function validateRecordAnswerPayload(payload, task){
    payload = payload || {};
    var issues = [];
    var warnings = [];
    if(!payload.taskId && !(task && task.id)) warnings.push('missing_taskId');
    if(payload.correct === undefined) issues.push('missing_correct_boolean');
    if(payload.selectedAnswer === undefined && payload.givenIndex === undefined && payload.selectedText === undefined) warnings.push('missing_selected_answer_signal');
    if(payload.correctAnswer === undefined && payload.correctText === undefined && !(task && (task.correct !== undefined || task.correctAnswer !== undefined))) warnings.push('missing_correct_answer_signal');
    var ms = Number(payload.timeMs || payload.duration || payload.durationMs || 0);
    if(!ms || ms < 0) warnings.push('missing_or_invalid_timeMs');
    var dnaCheck = validateTaskDNAContract(task || payload.task || payload);
    if(!dnaCheck.ok) warnings.push('task_dna_contract_incomplete');
    return { ok: issues.length === 0, issues: issues, warnings: warnings, dnaQuality: dnaCheck.quality, dna: dnaCheck.dna };
  }

  function repairMemory(options){
    options = options || {};
    var beforeRaw = '';
    try{ beforeRaw = localStorage.getItem(STORAGE_KEY) || ''; }catch(e){}
    var beforeBroken = false;
    try{ if(beforeRaw) JSON.parse(beforeRaw); }catch(e){ beforeBroken = true; }
    var memory = readMemory();
    var base = defaultMemory();
    Object.keys(base).forEach(function(k){
      if(memory[k] === undefined || memory[k] === null) memory[k] = base[k];
    });
    memory.totals = memory.totals && typeof memory.totals === 'object' ? memory.totals : base.totals;
    ['answered','correct','generatedAnswered','generatedCorrect','streak','bestStreak'].forEach(function(k){
      memory.totals[k] = Math.max(0, parseInt(memory.totals[k] || 0, 10) || 0);
    });
    memory.recentSignatures = Array.isArray(memory.recentSignatures) ? memory.recentSignatures.slice(-80) : [];
    memory.recentTasks = Array.isArray(memory.recentTasks) ? memory.recentTasks.slice(-80) : [];
    memory.dopamine = Array.isArray(memory.dopamine) ? memory.dopamine.slice(-80) : [];
    memory.sessions = Array.isArray(memory.sessions) ? memory.sessions.slice(-20) : [];
    memory.spacedQueue = Array.isArray(memory.spacedQueue) ? memory.spacedQueue.slice(-120) : [];
    memory.decisionLog = Array.isArray(memory.decisionLog) ? memory.decisionLog.slice(-120) : [];
    memory.preciseMistakes = Array.isArray(memory.preciseMistakes) ? memory.preciseMistakes.slice(-120) : [];
    memory.revengeOutcomes = Array.isArray(memory.revengeOutcomes) ? memory.revengeOutcomes.slice(-120) : [];
    memory.version = VERSION;
    saveMemory(memory);
    return { ok:true, repaired:true, hadBrokenJson:beforeBroken, totals:memory.totals, version:VERSION, reset:!!options.reset };
  }

  function memoryHealthReport(){
    var memory = readMemory();
    var issues = [];
    if(!memory.totals || typeof memory.totals !== 'object') issues.push('totals_missing');
    if(!memory.preferences || typeof memory.preferences !== 'object') issues.push('preferences_missing');
    if(!Array.isArray(memory.spacedQueue)) issues.push('spacedQueue_not_array');
    if(!Array.isArray(memory.decisionLog)) issues.push('decisionLog_not_array');
    if(!memory.skillStats || typeof memory.skillStats !== 'object') issues.push('skillStats_missing');
    if(!memory.mastery || typeof memory.mastery !== 'object') issues.push('mastery_missing');
    var volumeWarnings = [];
    if((memory.decisionLog || []).length > 150) volumeWarnings.push('decisionLog_large');
    if((memory.spacedQueue || []).length > 150) volumeWarnings.push('spacedQueue_large');
    return { ok: issues.length === 0, issues: issues, warnings: volumeWarnings, answered: memory.totals && memory.totals.answered || 0, skillCount:Object.keys(memory.skillStats||{}).length, spacedCount:(memory.spacedQueue||[]).length, version:VERSION };
  }

  function qaSelfCheck(options){
    options = options || {};
    var checks = [];
    function add(name, ok, info){ checks.push({ name:name, ok:!!ok, info:info || null }); }
    var repair = repairMemory();
    add('memory_repair', repair && repair.ok, repair);
    var health = memoryHealthReport();
    add('memory_health', health.ok, health);
    var banks = allQuestionBanks();
    add('question_bank_available', banks.length > 0, { count:banks.length });
    var sample = banks[0] || { id:'qa_sample', q:'2,4,8,?', a:['10','12','16'], correct:2, dna:{ category:'logik', subtype:'zahlenreihe', difficulty:2, skill:'verdopplung_erkennen', expectedTimeMs:9000, trap:'lineare_addition', examTarget:'bps', distractors:[{value:'10', errorPath:'difference_only_checked', hint:'Nur Addition geprüft.'}] } };
    var dna = validateTaskDNAContract(sample);
    add('dna_contract_validator_operational', !!(dna && dna.dna && dna.quality >= 0), dna);
    var payloadCheck = validateRecordAnswerPayload({ taskId:sample.id, correct:false, selectedAnswer:'x', timeMs:12000 }, sample);
    add('record_answer_payload_shape', payloadCheck.ok, payloadCheck);
    var before = readMemory().totals.answered || 0;
    recordMemory({ taskId:sample.id || 'qa_sample', correct:false, selectedAnswer:'qa_wrong', timeMs:12000, duration:12000, task:sample, dna:normalizeTaskDNA(sample), mode:'qa' });
    var after = readMemory().totals.answered || 0;
    add('record_memory_increments', after === before + 1, { before:before, after:after });
    var sess = startSession({ mode:'qa', count:3, difficulty:3 });
    add('session_start', !!(sess && Array.isArray(sess.tasks) && sess.tasks.length), { count:sess && sess.tasks && sess.tasks.length, learningPath:!!(sess && sess.learningPath) });
    var cc = commandCenter();
    add('command_center_ready', !!(cc && cc.readiness && cc.learningIntelligence), { hasReadiness:!!(cc && cc.readiness), hasLI:!!(cc && cc.learningIntelligence) });
    var tl = examTrafficLight();
    add('exam_traffic_light_ready', !!(tl && (tl.bps || tl.ctc || tl.sections)), tl);
    var failed = checks.filter(function(c){ return !c.ok; });
    return { ok: failed.length === 0, version:VERSION, checks:checks, failed:failed, score: Math.round((checks.length - failed.length) / Math.max(1, checks.length) * 100) };
  }



  function databaseDNAAudit(limit){
    var banks = allQuestionBanks();
    var total = banks.length;
    var result = { total:total, checked:0, ok:0, weak:0, missing:0, avgQuality:0, byCategory:{}, samples:[] };
    if(!total) return result;
    var sum = 0;
    banks.forEach(function(task){
      var check = validateTaskDNAContract(task);
      var cat = (check.dna && check.dna.category) || 'unknown';
      if(!result.byCategory[cat]) result.byCategory[cat] = { total:0, ok:0, weak:0, missing:0, avgQuality:0, _sum:0 };
      var bucket = result.byCategory[cat];
      result.checked += 1; bucket.total += 1; sum += check.quality; bucket._sum += check.quality;
      if(check.ok && check.quality >= 85){ result.ok += 1; bucket.ok += 1; }
      else if(check.quality >= 50){ result.weak += 1; bucket.weak += 1; }
      else { result.missing += 1; bucket.missing += 1; }
      if(result.samples.length < (limit || 12) && (!check.ok || check.quality < 85)){
        result.samples.push({ id: task.id || '', q: stripHtml(task.q || task.question || task.prompt || '').slice(0,100), quality: check.quality, issues: check.issues, warnings: check.warnings, inferred: check.dna && check.dna.inferred, category:cat, subtype:check.dna && check.dna.subtype });
      }
    });
    result.avgQuality = Math.round(sum / Math.max(1,total));
    Object.keys(result.byCategory).forEach(function(k){ var b=result.byCategory[k]; b.avgQuality=Math.round(b._sum/Math.max(1,b.total)); delete b._sum; });
    result.dnaReadyPercent = Math.round(result.ok / Math.max(1,total) * 100);
    result.status = result.dnaReadyPercent >= 80 ? 'integrationsstark' : result.dnaReadyPercent >= 40 ? 'teilbereit' : 'dna_nachziehen';
    return result;
  }

  function integrationContract(){
    return {
      version: VERSION,
      requiredFiles: [
        'css/learning-coach.css',
        'data/coach-knowledge-base.js',
        'js/learning-coach-engine.js',
        'js/learning-coach-ui.js'
      ],
      optionalQuestionBanks: [
        'data/question-bank.js',
        'data/question-bank-mathe.js',
        'data/question-bank-kaufm.js',
        'data/question-bank-sozial.js',
        'data/question-bank-it-extra.js'
      ],
      uiApi: ['init(options)','destroy()','configure(options)','openHub()','ask(text)','startTraining(skill,difficulty,count,mode)','recordAnswer(historyItem, task)','getState()'],
      engineApi: ['answer(text, context)','recordMemory(payload)','readinessScore()','commandCenter()','startSession(options)','answerSessionTask(index)','resetMemory()','diagnoseMistakeDetailed(payload,dna)','learningCurveReport()','examTrafficLight()','preciseRevengeProfile()','learningPathPlan()','errorPathReport()','sectionTrafficLight()','masteryReport()','validateTaskDNAContract(task)','validateRecordAnswerPayload(payload,task)','databaseDNAAudit(limit)','repairMemory()','memoryHealthReport()','qaSelfCheck()'],
      storageKeys: [STORAGE_KEY, SESSION_KEY, 'bps_learning_coach_dock_position_v1']
    };
  }

  window.BPSLearningCoachEngine = {
    version: VERSION,
    answer: answer,
    find: find,
    currentTaskFromApp: currentTaskFromApp,
    randomTopics: randomTopics,
    stripHtml: stripHtml,
    normalize: normalize,
    count: function(){ return knowledge().length; },
    databaseStats: databaseStats,
    allQuestionBanks: allQuestionBanks,
    memory: readMemory,
    memorySummary: memorySummary,
    recordMemory: recordMemory,
    nextRecommendation: nextRecommendation,
    readinessScore: readinessScore,
    commandCenter: commandCenter,
    trainingModes: trainingModes,
    weeklyTrend: weeklyTrend,
    dailyChallenge: dailyChallenge,
    mistakeInsights: mistakeInsights,
    personalities: function(){ return PERSONALITIES; },
    setPersonality: setPersonality,
    personality: function(){ return personality(readMemory()); },
    startSession: startSession,
    readSession: readSession,
    currentSessionTask: currentSessionTask,
    answerSessionTask: answerSessionTask,
    generateTask: generateTask,
    detectIntent: detectIntent,
    resetMemory: resetMemory,
    integrationContract: integrationContract,
    normalizeTaskDNA: normalizeTaskDNA,
    effectiveDifficulty: effectiveDifficulty,
    learnerLevelFor: learnerLevelFor,
    dueSpacedItems: dueSpacedItems,
    learningIntelligenceReport: learningIntelligenceReport,
    taskDebugInfo: taskDebugInfo,
    diagnoseMistakeDetailed: diagnoseMistakeDetailed,
    learningCurveReport: learningCurveReport,
    examTrafficLight: examTrafficLight,
    preciseRevengeProfile: preciseRevengeProfile,
    lastDecisionLog: lastDecisionLog,
    learningPathPlan: learningPathPlan,
    errorPathReport: errorPathReport,
    sectionTrafficLight: sectionTrafficLight,
    masteryReport: masteryReport,
    categoryErrorPath: categoryErrorPath,
    validateTaskDNAContract: validateTaskDNAContract,
    validateRecordAnswerPayload: validateRecordAnswerPayload,
    repairMemory: repairMemory,
    memoryHealthReport: memoryHealthReport,
    qaSelfCheck: qaSelfCheck,
    databaseDNAAudit: databaseDNAAudit
  };
})();
