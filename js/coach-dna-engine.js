/* Eignungstest-Trainer · Coach DNA Engine
   Phase 3 Complete: userId-Datenbasis, Kategorieprofil, Fehler-DNA, echte Empfehlungen ohne Doppelzählung. */
(function(){
  'use strict';
  var STORAGE_KEY='egt_coach_dna_v2';
  var LEGACY_KEY='egt_coach_dna_v1';
  var PENDING_KEY='egt_coach_dna_pending_v1';
  var ACTIVE_KEY='egt_active_learner';
  var MAX_PENDING_AGE_MS=4*60*60*1000;

  function nowIso(){ try{return new Date().toISOString();}catch(e){return '';} }
  function nowMs(){ return Date.now ? Date.now() : new Date().getTime(); }
  function normalizeId(value){ return String(value||'guest').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'GUEST'; }
  function activeUserId(){ try{return normalizeId(localStorage.getItem(ACTIVE_KEY)||'guest');}catch(e){return 'GUEST';} }
  function readJson(key, fallback){ try{return JSON.parse(localStorage.getItem(key)||'')||fallback;}catch(e){return fallback;} }
  function writeJson(key, value){ try{localStorage.setItem(key, JSON.stringify(value));}catch(e){} }
  function clamp(n,min,max){ n=Number(n); if(!isFinite(n)) n=0; return Math.max(min, Math.min(max,n)); }
  function pct(c,t){ return t ? Math.round((c/t)*100) : 0; }
  function safeText(v){ return String(v==null?'':v).replace(/\bundefined\b|\bnull\b/g,'').trim(); }

  function readAll(){
    var data=readJson(STORAGE_KEY, null);
    if(data && typeof data==='object') return data;
    var legacy=readJson(LEGACY_KEY, {});
    if(legacy && typeof legacy==='object') writeJson(STORAGE_KEY, legacy);
    return legacy || {};
  }
  function saveAll(data){ writeJson(STORAGE_KEY, data||{}); }
  function readPendingAll(){ return readJson(PENDING_KEY, {}) || {}; }
  function savePendingAll(data){ writeJson(PENDING_KEY, data||{}); }

  var CATEGORY_MAP=[
    [/python|programm|code|variable|liste|loop|schleife/i,'Python'],
    [/mathe|math|rechnen|prozent|dreisatz|bruch|zahl/i,'Mathematik'],
    [/logik|matrix|zahlenreihe|würfel|wuerfel|visual|iq|muster|spiegel/i,'Logik'],
    [/it|edv|fisi|netzwerk|hardware|software|server|dns/i,'IT & EDV'],
    [/konzentration|zeichen|streichen|aufmerksam|fokus/i,'Konzentration'],
    [/sprache|deutsch|satz|wort|text/i,'Sprache'],
    [/simulation|assessments|novuraExams|bosch|eignungstest|prüfung|pruefung/i,'Simulation']
  ];
  function normalizeCategory(input){
    var s=safeText(input)||'Allgemein';
    for(var i=0;i<CATEGORY_MAP.length;i++){ if(CATEGORY_MAP[i][0].test(s)) return CATEGORY_MAP[i][1]; }
    return s.length>28 ? s.slice(0,28) : s;
  }
  function inferErrorType(payload){
    payload=payload||{};
    if(payload.timeout || payload.skipped || payload.givenIndex===null) return 'ausgelassen_oder_zeit';
    if(payload.mistakeType) return safeText(payload.mistakeType);
    if(payload.selectedKind && payload.schemaKind && payload.selectedKind!==payload.schemaKind) return 'fehlerart_verwechselt';
    if(payload.correct===false && Number(payload.duration||0)>0 && Number(payload.duration||0)<3500) return 'zu_schnell_geantwortet';
    if(payload.correct===false) return 'inhaltlicher_fehler';
    return '';
  }
  function emptyProfile(userId){
    return {userId:normalizeId(userId), createdAt:nowIso(), updatedAt:nowIso(), totals:{answered:0,correct:0,wrong:0,totalMs:0,streak:0,bestStreak:0,sessions:0}, categories:{}, errors:{}, recent:[], recommendations:[], readiness:{level:'unbekannt',percent:0,score:0,label:'Noch zu wenig Daten'}, nextAction:{title:'Ersten Testlauf starten',text:'Sammle zuerst echte Trainingsdaten.',category:'Allgemein'}};
  }
  function getProfile(userId){ var all=readAll(); userId=normalizeId(userId||activeUserId()); return all[userId] || emptyProfile(userId); }
  function putProfile(profile){ var all=readAll(); profile.updatedAt=nowIso(); all[normalizeId(profile.userId)]=profile; saveAll(all); return profile; }
  function ensureCategory(profile, name){ name=normalizeCategory(name); profile.categories=profile.categories||{}; if(!profile.categories[name]) profile.categories[name]={answered:0,correct:0,wrong:0,totalMs:0,avgMs:0,lastAt:'',trend:[]}; return profile.categories[name]; }

  function addAttemptToProfile(profile, attempt){
    var cat=ensureCategory(profile, attempt.group||attempt.cat||attempt.category||attempt.mode||'Allgemein');
    var ok=!!attempt.correct; var ms=Number(attempt.duration||attempt.time||0)||0;
    cat.answered++; if(ok) cat.correct++; else cat.wrong++; cat.totalMs+=ms; cat.avgMs=cat.answered?Math.round(cat.totalMs/cat.answered):0; cat.lastAt=nowIso();
    profile.totals.answered++; if(ok){ profile.totals.correct++; profile.totals.streak=(profile.totals.streak||0)+1; } else { profile.totals.wrong++; profile.totals.streak=0; }
    profile.totals.bestStreak=Math.max(profile.totals.bestStreak||0, profile.totals.streak||0); profile.totals.totalMs+=ms;
    var err=inferErrorType(attempt); if(err){ profile.errors[err]=(profile.errors[err]||0)+1; }
    profile.recent=(profile.recent||[]).concat([{date:nowIso(),mode:attempt.mode||'',title:attempt.q||attempt.title||'',category:normalizeCategory(attempt.group||attempt.cat||attempt.category||attempt.mode),correct:ok,errorType:err}]).slice(-40);
  }
  function addAggregateToProfile(profile, result){
    var cats=result.cats||{}; var touched=false; var totalMs=0;
    Object.keys(cats).forEach(function(raw){ var src=cats[raw]||{}; var c=ensureCategory(profile, raw); var n=Number(src.n||src.total||0); var r=Number(src.r||src.correct||0); var ms=Number(src.t||src.totalMs||0); if(!n) return; touched=true; c.answered+=n; c.correct+=r; c.wrong+=Math.max(0,n-r); c.totalMs+=ms; c.avgMs=c.answered?Math.round(c.totalMs/c.answered):0; c.lastAt=nowIso(); c.trend=(c.trend||[]).concat([{date:nowIso(),percent:pct(r,n),n:n}]).slice(-12); totalMs+=ms; });
    if(!touched){ var cat=ensureCategory(profile, result.group||result.category||result.mode||result.title||'Allgemein'); var n=Number(result.total||1); var r=Number(result.score!=null?result.score:(result.correct?1:0)); cat.answered+=n; cat.correct+=r; cat.wrong+=Math.max(0,n-r); cat.lastAt=nowIso(); cat.trend=(cat.trend||[]).concat([{date:nowIso(),percent:pct(r,n),n:n}]).slice(-12); }
    var total=Number(result.total||Object.keys(cats).reduce(function(s,k){return s+Number((cats[k]||{}).n||0);},0)||1);
    var correct=Number(result.score!=null?result.score:Object.keys(cats).reduce(function(s,k){return s+Number((cats[k]||{}).r||0);},0));
    profile.totals.answered+=total; profile.totals.correct+=correct; profile.totals.wrong+=Math.max(0,total-correct); profile.totals.totalMs+=totalMs||Number(result.avg||0)*total||0; profile.totals.streak = correct>=total ? (profile.totals.streak||0)+1 : 0; profile.totals.bestStreak=Math.max(profile.totals.bestStreak||0, profile.totals.streak||0);
  }
  function weaknesses(profile){
    profile=profile||getProfile(); return Object.keys(profile.categories||{}).map(function(k){ var c=profile.categories[k]||{}; return {category:k,answered:c.answered||0,correct:c.correct||0,wrong:c.wrong||0,percent:pct(c.correct||0,c.answered||0),avgMs:c.avgMs||0}; }).filter(function(x){return x.answered>=3;}).sort(function(a,b){ return a.percent-b.percent || b.answered-a.answered; });
  }
  function strengths(profile){ return weaknesses(profile).slice().reverse().filter(function(x){return x.percent>=70;}); }
  function updateReadiness(profile){
    var t=profile.totals||{}; var a=t.answered||0; var p=pct(t.correct||0,a); var weak=weaknesses(profile)[0];
    var label='Daten sammeln'; var level='unbekannt';
    if(a>=80 && p>=75){ level='stabil'; label='Stabil'; }
    else if(a>=35 && p>=60){ level='aufbau'; label='Aufbau stabil'; }
    else if(a>=10){ level='riskant'; label='Schwächen sichtbar'; }
    profile.readiness={level:level,percent:clamp(Math.round(a/80*100),0,100),score:p,label:label};
    profile.nextAction=weak ? {title:'Nächster Fokus: '+weak.category,text:'Trainiere gezielt diese Kategorie. Trefferquote aktuell '+weak.percent+'% bei '+weak.answered+' Aufgaben.',category:weak.category} : {title:a?'Stabilisieren':'Ersten Testlauf starten',text:a?'Mache einen gemischten Testlauf, damit der Coach belastbarer wird.':'Sammle zuerst echte Trainingsdaten.',category:'Allgemein'};
    return profile;
  }

  function recordAttempt(payload){
    payload=payload||{}; var userId=normalizeId(payload.userId||payload.learnerId||activeUserId());
    var all=readPendingAll(); var list=Array.isArray(all[userId]) ? all[userId] : [];
    var cut=nowMs()-MAX_PENDING_AGE_MS;
    list=list.filter(function(x){ return Number(x._ms||0)>=cut; });
    payload._ms=nowMs(); payload._id=[payload.mode||'', payload.q||payload.title||'', payload.givenIndex, payload.correct, payload._ms].join('|');
    list.push(payload); all[userId]=list.slice(-250); savePendingAll(all);
    return {userId:userId,pending:all[userId].length};
  }
  function consumePending(userId, expectedTotal){
    var all=readPendingAll(); var list=Array.isArray(all[userId]) ? all[userId] : [];
    var cut=nowMs()-MAX_PENDING_AGE_MS;
    list=list.filter(function(x){ return Number(x._ms||0)>=cut; });
    var n=Number(expectedTotal||0);
    var used=n>0 ? list.slice(-n) : list.slice();
    var remaining=n>0 ? list.slice(0, Math.max(0,list.length-n)) : [];
    all[userId]=remaining; savePendingAll(all);
    return used;
  }
  function recordResult(result){
    result=result||{}; var userId=normalizeId(result.userId||result.learnerId||activeUserId()); var profile=getProfile(userId); profile.userId=userId;
    var total=Number(result.total||0); var attempts=consumePending(userId,total);
    if(attempts.length && (!total || attempts.length>=Math.min(total,3))){
      attempts.forEach(function(a){ addAttemptToProfile(profile, Object.assign({}, a, {mode:a.mode||result.mode||''})); });
      var byCat={}; attempts.forEach(function(a){ var c=normalizeCategory(a.group||a.cat||a.category||a.mode||'Allgemein'); byCat[c]=byCat[c]||{n:0,r:0}; byCat[c].n++; if(a.correct) byCat[c].r++; });
      Object.keys(byCat).forEach(function(k){ var c=ensureCategory(profile,k); c.trend=(c.trend||[]).concat([{date:nowIso(),percent:pct(byCat[k].r,byCat[k].n),n:byCat[k].n}]).slice(-12); });
    } else {
      addAggregateToProfile(profile,result);
    }
    var correct=Number(result.score!=null?result.score:(attempts.length?attempts.filter(function(a){return !!a.correct;}).length:0));
    var usedTotal=Number(result.total||attempts.length||1);
    profile.totals.sessions=(profile.totals.sessions||0)+1;
    profile.recent=(profile.recent||[]).concat([{date:nowIso(),mode:result.mode||'',title:result.title||'',percent:Number(result.percent||pct(correct,usedTotal)),total:usedTotal,correct:correct,session:true}]).slice(-40);
    updateReadiness(profile); putProfile(profile); return profile;
  }
  function dashboard(userId){ var p=getProfile(userId); updateReadiness(p); return {profile:p, weaknesses:weaknesses(p).slice(0,5), strengths:strengths(p).slice(0,5), nextAction:p.nextAction, readiness:p.readiness}; }
  function reset(userId){ var all=readAll(); var id=normalizeId(userId||activeUserId()); delete all[id]; saveAll(all); var p=readPendingAll(); delete p[id]; savePendingAll(p); }
  window.EGTCoachDNA={version:'phase-3-complete', activeUserId:activeUserId, normalizeCategory:normalizeCategory, getProfile:getProfile, putProfile:putProfile, recordResult:recordResult, recordAttempt:recordAttempt, dashboard:dashboard, weaknesses:weaknesses, strengths:strengths, reset:reset, storageKey:STORAGE_KEY, pendingKey:PENDING_KEY};
})();
