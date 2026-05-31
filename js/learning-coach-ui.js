/* BPS-Trainer V9.3.0 · Learning Coach V2 Premium UI
   Andockbarer Coach mit Memory-Dashboard, Transkription und adaptivem Coach-Training. */
(function(){
  'use strict';

  var VERSION = '9.8.0-python-quest-phase-3';
  var DEFAULT_CONFIG = {
    autoMount:true,
    mountSelector:'body',
    injectHomeCard:true,
    injectQuizButton:true,
    patchAppHelp:true,
    pauseAppTimer:true,
    enableSpeech:true,
    debug:false
  };
  var CONFIG = Object.assign({}, DEFAULT_CONFIG, window.BPSLearningCoachConfig || {});
  var initialized = false;
  var observerBag = [];
  var timerBag = [];
  var listenerBag = [];
  var delegatedClickBound = !!window.__BPS_LEARNING_COACH_DELEGATED_CLICK_BOUND__;
  var isOpen = false;
  var resumeTimerOnClose = false;
  var messages = [];
  var lastContext = {};
  var lastTrainingFeedback = null;
  var commandCenterOpen = false;
  var CARD_ID = 'whCoachCard';
  var QUIZ_BTN_ID = 'bpsCoachQuizBtn';
  var DOCK_POS_KEY = 'bps_learning_coach_dock_position_v1';
  var dockDrag = { active:false, moved:false, pointerId:null, startX:0, startY:0, originX:0, originY:0, suppressClick:false };

  function $(id){ return document.getElementById(id); }
  function esc(value){ return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]; }); }
  function strip(value){ return window.BPSLearningCoachEngine ? window.BPSLearningCoachEngine.stripHtml(value) : String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
  function engine(){ return window.BPSLearningCoachEngine; }
  function notice(text){ try{ if(window.BPSWordHubLayer && typeof BPSWordHubLayer.notice === 'function') return BPSWordHubLayer.notice(text); }catch(e){} if(CONFIG.debug) console.log('[Coach]', text); }
  function mountRoot(){ var target = CONFIG.mountSelector && CONFIG.mountSelector !== 'body' ? document.querySelector(CONFIG.mountSelector) : null; return target || document.body; }
  function bind(target, type, handler, options){ if(!target || !target.addEventListener) return; target.addEventListener(type, handler, options || false); listenerBag.push({target:target,type:type,handler:handler,options:options || false}); }
  function trackObserver(observer){ if(observer) observerBag.push(observer); return observer; }
  function trackTimer(id){ if(id) timerBag.push(id); return id; }
  function quizVisible(){ var q = $('quiz'); return !!(q && !q.classList.contains('hidden')); }
  function getCurrentTask(){ try{ if(engine()) return engine().currentTaskFromApp(); }catch(e){} return null; }
  function getBranch(){ try{ return localStorage.getItem('bps_branch') || ''; }catch(e){ return ''; } }
  function getContext(extra){ var task = getCurrentTask(); var ctx = { appVersion: window.TRAINER_BUILD_VERSION || VERSION, branch: getBranch(), currentTask: task, screen: quizVisible() ? 'quiz' : 'home' }; if(extra){ Object.keys(extra).forEach(function(k){ ctx[k] = extra[k]; }); } lastContext = ctx; return ctx; }
  function pauseTimerIfNeeded(){ resumeTimerOnClose = false; if(!CONFIG.pauseAppTimer || !quizVisible()) return; try{ if(window.App && typeof App.pauseTimer === 'function'){ App.pauseTimer(); resumeTimerOnClose = true; } }catch(e){} }
  function resumeTimerIfNeeded(){ if(!resumeTimerOnClose) return; resumeTimerOnClose = false; if(!quizVisible()) return; try{ if(window.App && typeof App.resumeTimer === 'function') App.resumeTimer(); }catch(e){} }


  function viewportSafeArea(){
    var vv = window.visualViewport;
    return {
      w: Math.max(280, Math.round(vv && vv.width ? vv.width : window.innerWidth || document.documentElement.clientWidth || 390)),
      h: Math.max(320, Math.round(vv && vv.height ? vv.height : window.innerHeight || document.documentElement.clientHeight || 760))
    };
  }
  function clamp(n, min, max){ return Math.min(Math.max(n, min), max); }
  function dockBounds(dock){
    var vp = viewportSafeArea();
    var rect = dock.getBoundingClientRect();
    var pad = 10;
    var bottomReserve = 12;
    try{ bottomReserve = Math.max(12, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom') || '12', 10) || 12); }catch(e){}
    return {
      minX: pad,
      minY: pad,
      maxX: Math.max(pad, vp.w - rect.width - pad),
      maxY: Math.max(pad, vp.h - rect.height - bottomReserve)
    };
  }
  function normalizeDockPosition(pos, dock){
    var b = dockBounds(dock);
    var x = Number(pos && pos.x), y = Number(pos && pos.y);
    if(!isFinite(x) || !isFinite(y)){
      x = b.maxX;
      y = Math.max(b.minY, 76);
    }
    return { x: Math.round(clamp(x, b.minX, b.maxX)), y: Math.round(clamp(y, b.minY, b.maxY)) };
  }
  function applyDockPosition(dock, pos){
    if(!dock) return;
    pos = normalizeDockPosition(pos, dock);
    dock.style.left = pos.x + 'px';
    dock.style.top = pos.y + 'px';
    dock.style.right = 'auto';
    dock.style.bottom = 'auto';
    dock.classList.add('is-positioned');
  }
  function saveDockPosition(dock){
    if(!dock) return;
    var rect = dock.getBoundingClientRect();
    var pos = normalizeDockPosition({ x: rect.left, y: rect.top }, dock);
    try{ localStorage.setItem(DOCK_POS_KEY, JSON.stringify({ x: pos.x, y: pos.y, savedAt: Date.now(), version: VERSION })); }catch(e){}
    applyDockPosition(dock, pos);
  }
  function restoreDockPosition(dock){
    if(!dock) return;
    var raw = null;
    try{ raw = JSON.parse(localStorage.getItem(DOCK_POS_KEY) || 'null'); }catch(e){ raw = null; }
    applyDockPosition(dock, raw || null);
  }
  function magnetizeDockPosition(dock, x, y){
    var b = dockBounds(dock);
    var edge = 18;
    if(Math.abs(x - b.minX) < edge) x = b.minX;
    if(Math.abs(x - b.maxX) < edge) x = b.maxX;
    if(Math.abs(y - b.minY) < edge) y = b.minY;
    if(Math.abs(y - b.maxY) < edge) y = b.maxY;
    return normalizeDockPosition({ x:x, y:y }, dock);
  }
  function startDockDrag(ev){
    var dock = ev.currentTarget;
    if(!dock || ev.button && ev.button !== 0) return;
    var rect = dock.getBoundingClientRect();
    dockDrag.active = true;
    dockDrag.moved = false;
    dockDrag.pointerId = ev.pointerId;
    dockDrag.startX = ev.clientX;
    dockDrag.startY = ev.clientY;
    dockDrag.originX = rect.left;
    dockDrag.originY = rect.top;
    dock.classList.add('is-dragging');
    try{ dock.setPointerCapture(ev.pointerId); }catch(e){}
    window.addEventListener('pointermove', moveDockDrag, { passive:false });
    window.addEventListener('pointerup', endDockDrag, { passive:false });
    window.addEventListener('pointercancel', endDockDrag, { passive:false });
  }
  function moveDockDrag(ev){
    if(!dockDrag.active) return;
    var dock = $('bpsCoachDock'); if(!dock) return;
    if(dockDrag.pointerId !== null && ev.pointerId !== dockDrag.pointerId) return;
    var dx = ev.clientX - dockDrag.startX;
    var dy = ev.clientY - dockDrag.startY;
    if(Math.abs(dx) + Math.abs(dy) > 6) dockDrag.moved = true;
    if(dockDrag.moved) ev.preventDefault();
    applyDockPosition(dock, { x: dockDrag.originX + dx, y: dockDrag.originY + dy });
  }
  function endDockDrag(ev){
    if(!dockDrag.active) return;
    var dock = $('bpsCoachDock');
    if(dock){
      dock.classList.remove('is-dragging');
      try{ dock.releasePointerCapture(dockDrag.pointerId); }catch(e){}
      var rect = dock.getBoundingClientRect();
      var pos = magnetizeDockPosition(dock, rect.left, rect.top);
      dock.classList.add('is-settling');
      applyDockPosition(dock, pos);
      setTimeout(function(){ if(dock) dock.classList.remove('is-settling'); }, 180);
      try{ localStorage.setItem(DOCK_POS_KEY, JSON.stringify({ x: pos.x, y: pos.y, savedAt: Date.now(), version: VERSION })); }catch(e){}
    }
    if(dockDrag.moved){ dockDrag.suppressClick = true; setTimeout(function(){ dockDrag.suppressClick = false; }, 260); }
    dockDrag.active = false;
    dockDrag.pointerId = null;
    window.removeEventListener('pointermove', moveDockDrag);
    window.removeEventListener('pointerup', endDockDrag);
    window.removeEventListener('pointercancel', endDockDrag);
  }
  function reflowDockPosition(){ var dock = $('bpsCoachDock'); if(dock) restoreDockPosition(dock); }

  function ensureShell(){
    if(!$('bpsCoachDock')){
      var dock = document.createElement('button');
      dock.id = 'bpsCoachDock';
      dock.className = 'bps-coach-dock';
      dock.type = 'button';
      dock.setAttribute('aria-label','Coach öffnen');
      dock.innerHTML = '<span class="bps-coach-dock-orb">✦</span><span><b>Coach</b><small id="bpsCoachDockHint">bereit</small></span>';
      dock.addEventListener('click', function(ev){
        if(dockDrag.suppressClick){ ev.preventDefault(); ev.stopPropagation(); dockDrag.suppressClick = false; return; }
        openHub();
      });
      dock.addEventListener('pointerdown', startDockDrag, { passive:false });
      mountRoot().appendChild(dock);
      requestAnimationFrame(function(){ restoreDockPosition(dock); });
    }
    if($('bpsCoachBackdrop') && $('bpsCoachSheet')) return;
    var bd = document.createElement('div');
    bd.id = 'bpsCoachBackdrop';
    bd.className = 'bps-coach-backdrop';
    bd.addEventListener('click', function(ev){ if(ev.target === bd) close(); });
    mountRoot().appendChild(bd);

    var sh = document.createElement('aside');
    sh.id = 'bpsCoachSheet';
    sh.className = 'bps-coach-sheet';
    sh.setAttribute('role','dialog');
    sh.setAttribute('aria-modal','true');
    sh.setAttribute('aria-label','KI Coach');
    sh.innerHTML = ''+
      '<div class="bps-coach-grabber" aria-hidden="true"></div>'+
      '<header class="bps-coach-header">'+
        '<div class="bps-coach-icon">✦</div>'+
        '<div class="bps-coach-title"><b id="bpsCoachTitle">KI Coach V9.5.8</b><span id="bpsCoachSubtitle">adaptiv · lokal · prüfungsnah</span></div>'+
        '<button class="bps-coach-dashboard-toggle" id="bpsCoachPersonality" type="button" data-coach-action="personality-cycle" aria-label="Coach Stil wechseln">🎭</button>'+
        '<button class="bps-coach-dashboard-toggle" id="bpsCoachDashboardToggle" type="button" data-coach-action="command-toggle" aria-label="Coach Dashboard öffnen">◈</button>'+
        '<button class="bps-coach-close" id="bpsCoachClose" type="button" aria-label="Coach schließen">✕</button>'+
      '</header>'+
      '<main class="bps-coach-body" id="bpsCoachBody"></main>'+
      '<footer class="bps-coach-footer">'+
        '<button class="bps-coach-mic" id="bpsCoachMic" type="button" aria-label="Spracheingabe starten">🎤</button>'+
        '<input class="bps-coach-input" id="bpsCoachInput" autocomplete="off" placeholder="Sag oder schreib: Starte 5 schwere Logikaufgaben …">'+
        '<button class="bps-coach-send" id="bpsCoachSend" type="button">Senden</button>'+
      '</footer>';
    mountRoot().appendChild(sh);
    $('bpsCoachClose').addEventListener('click', close);
    $('bpsCoachSend').addEventListener('click', sendFromInput);
    $('bpsCoachInput').addEventListener('keydown', function(ev){ if(ev.key === 'Enter'){ ev.preventDefault(); sendFromInput(); } });
    $('bpsCoachMic').addEventListener('click', startTranscription);
    bind(document, 'keydown', function(ev){ if(ev.key === 'Escape' && isOpen) close(); });
  }

  function open(title, subtitle, html, options){
    ensureShell(); options = options || {}; if(options.pauseTimer) pauseTimerIfNeeded();
    $('bpsCoachTitle').textContent = title || 'KI Coach V2';
    $('bpsCoachSubtitle').textContent = subtitle || 'adaptiv · lokal · prüfungsnah';
    $('bpsCoachBody').innerHTML = wrapCommandCenter(html || renderHub());
    var toggle = $('bpsCoachDashboardToggle'); if(toggle) toggle.classList.toggle('active', commandCenterOpen);
    $('bpsCoachBody').scrollTop = 0;
    $('bpsCoachBackdrop').classList.add('show');
    $('bpsCoachSheet').offsetHeight;
    $('bpsCoachSheet').classList.add('show');
    isOpen = true;
    updateDock();
    setTimeout(function(){ try{ $('bpsCoachInput').focus({preventScroll:true}); }catch(e){} }, 120);
  }
  function close(){ var bd=$('bpsCoachBackdrop'), sh=$('bpsCoachSheet'); if(sh) sh.classList.remove('show'); if(bd) bd.classList.remove('show'); isOpen=false; updateDock(); resumeTimerIfNeeded(); }

  function updateDock(){
    var hint = $('bpsCoachDockHint');
    if(!hint || !engine()) return;
    var s = engine().memorySummary();
    if(isOpen) hint.textContent = 'aktiv';
    else if(s.recentReward) hint.textContent = s.recentReward.slice(0,24) + (s.recentReward.length>24?'…':'');
    else hint.textContent = s.memory.totals.answered ? (s.totalQuote + '% Quote') : 'bereit';
  }
  function percent(n){ return isFinite(n) ? Math.round(n) + '%' : '–'; }
  function sec(ms){ return ms ? (Math.round(ms/100)/10)+'s' : '–'; }
  function softModeName(value){ return String(value || 'focus').replace(/-/g,' ').replace(/\b\w/g,function(c){ return c.toUpperCase(); }); }
  function safeTaskText(value){ return String(value || '').replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi,'').replace(/on\w+\s*=\s*["'][^"']*["']/gi,''); }

  function wrapCommandCenter(html){
    return (commandCenterOpen ? renderCommandCenter() : '') + (html || '');
  }
  function readinessMood(c){
    var r = c && c.readiness || {};
    var tl = c && c.examTrafficLight || {};
    var bps = tl.bps && tl.bps.state || '';
    var ctc = tl.ctc && tl.ctc.state || '';
    var answered = c && c.today && c.today.answered || 0;
    if((bps === 'kritisch' || ctc === 'kritisch') && (r.confidence || 0) >= 35){
      return { cls:'critical', title:'Heute gezielt schärfen', text:'Ein Bereich ist kritisch. Starte lieber eine kurze Revanche statt einen langen Volltest.' };
    }
    if((bps === 'stabil' || (r.bps || 0) >= 75) && (r.confidence || 0) >= 45){
      return { cls:'stable', title:'Basis wirkt stabil', text:'Jetzt lohnt sich kontrollierter Druck: kurze Runde, klare Fehlerdiagnose, dann Pause.' };
    }
    if(answered > 0){
      return { cls:'active', title:'Coach sammelt brauchbare Signale', text:'Die nächste Runde sollte klein bleiben, damit die Diagnose sauberer wird.' };
    }
    return { cls:'empty', title:'Noch keine belastbaren Daten', text:'Starte mit 5 Aufgaben. Danach kann der Coach Tempo, Fehlerpfade und Revanche sinnvoller steuern.' };
  }
  function renderCommandSnapshot(c){
    var mood = readinessMood(c);
    var rec = c && c.recommendation || {};
    var r = c && c.readiness || {};
    return '<div class="bps-command-snapshot '+esc(mood.cls)+'">'+
      '<div><span>Coach-Einschätzung</span><b>'+esc(mood.title)+'</b><p>'+esc(mood.text)+'</p></div>'+ 
      '<button type="button" data-coach-action="train-start" data-mode="'+esc(rec.mode || 'focus-5')+'" data-skill="'+esc(rec.skill || 'mixed')+'" data-difficulty="'+esc(rec.difficulty || 3)+'" data-count="'+esc(rec.count || 5)+'">'+esc(rec.title || 'Fokus starten')+'</button>'+ 
      '<small>'+esc((r.confidence || 0) < 35 ? 'Score noch vorsichtig lesen · Datenbasis klein' : 'Score aus Quote, Tempo, Stabilität und Fehlerpfaden')+'</small>'+ 
    '</div>';
  }
  function renderCommandCenter(){
    if(!engine() || !engine().commandCenter) return '';
    var c = engine().commandCenter();
    var r = c.readiness || {bps:0, ctc:0, confidence:0, label:'Daten sammeln'};
    var rec = c.recommendation || {title:'Coach-Runde starten', text:'Kurzer Fokusblock', skill:'mixed', difficulty:3, count:5};
    var top = c.topMistake || (c.weakest ? c.weakest.name : 'noch offen');
    var weekly = c.weekly || {answered:0, quote:0, delta:null};
    var dc = c.dailyChallenge || {title:'Daily Challenge', mode:'daily', skill:'mixed', difficulty:4, count:6, done:false};
    var person = c.personality || {title:'Motivierend', cue:'ruhiger Push', id:'motivating'};
    return '<section class="bps-coach-command">'+
      '<div class="bps-command-head"><span>Command Center · V9.5.8</span><b>'+esc(r.label || 'Readiness')+'</b><button type="button" data-coach-action="command-toggle">Schließen</button></div>'+
      renderCommandSnapshot(c)+
      '<div class="bps-readiness-grid">'+
        readinessRing('BPS', r.bps, r.confidence >= 35 ? 'Bereitschaft' : 'erste Daten')+
        readinessRing('CTC', r.ctc, r.confidence >= 35 ? 'Hard-Mode' : 'noch ungenau')+
        statCard('Tempo', percent(r.speed || 0), r.avgMs ? sec(r.avgMs)+' Ø' : 'noch messen')+
        statCard('Stabilität', percent(r.stability || 0), 'Schwankung')+
      '</div>'+
      '<div class="bps-command-strip"><div><span>Heute</span><b>'+esc((c.today && c.today.answered || 0)+' Aufgaben · '+(c.today && c.today.quote || 0)+'%')+'</b></div><div><span>Woche</span><b>'+esc((weekly.answered||0)+' Aufgaben · '+(weekly.delta==null?'Trend offen':(weekly.delta>=0?'+':'')+weekly.delta+'%'))+'</b></div><div><span>Coach-Stil</span><b>'+esc(person.title)+'</b></div></div>'+
      renderTrafficAndPrediction(c)+ 
      renderSectionTraffic(c)+
      renderLearningPath(c)+
      '<div class="bps-coach-section bps-daily-card"><h3>Daily Challenge</h3><p>'+esc(dc.done ? ('Heute erledigt · Bestwert '+(dc.bestQuote||0)+'%') : (dc.title+' · '+(dc.count||6)+' Aufgaben · Level '+(dc.difficulty||4)))+'</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-mode="daily" data-skill="'+esc(dc.skill||'mixed')+'" data-difficulty="'+esc(dc.difficulty||4)+'" data-count="'+esc(dc.count||6)+'">'+esc(dc.done?'Nochmal schlagen':'Daily starten')+'</button><button class="bps-coach-chip" data-coach-action="personality-cycle">🎭 Stil: '+esc(person.title)+'</button></div></div>'+ 
      '<div class="bps-coach-section bps-command-rec"><h3>Empfehlung</h3><p>'+esc(rec.text || '')+'</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-mode="'+esc(rec.mode || 'focus-5')+'" data-skill="'+esc(rec.skill || 'mixed')+'" data-difficulty="'+esc(rec.difficulty || 3)+'" data-count="'+esc(rec.count || 5)+'">'+esc(rec.title || 'Starten')+'</button><button class="bps-coach-chip" data-coach-action="ask" data-query="Zeig mir meinen Fortschritt">Analyse</button></div></div>'+ 
      '<div class="bps-coach-section"><h3>Fehler-DNA</h3>'+renderMistakeDNA(c.mistakeInsights, top)+'</div>'+ 
      '<div class="bps-coach-section"><h3>Lernintelligenz</h3>'+renderLearningIntelligence(c.learningIntelligence)+'</div>'+ 
      '<div class="bps-coach-section"><h3>Premium-Modi</h3><div class="bps-coach-mode-grid">'+(c.modes || []).map(function(m){ return modeBtn(m.skill,m.difficulty,m.count,m.title,m.promise,m.id); }).join('')+'</div></div>'+ 
      (c.achievements && c.achievements.length ? '<div class="bps-command-rewards"><b>Erfolge</b>'+c.achievements.slice(0,3).map(function(x){ return '<span>'+esc(x.text || x)+'</span>'; }).join('')+'</div>' : '')+
      (c.recentRewards && c.recentRewards.length ? '<div class="bps-command-rewards"><b>Letzte Signale</b>'+c.recentRewards.slice(0,3).map(function(x){ return '<span>'+esc(x.text || x)+'</span>'; }).join('')+'</div>' : '')+
    '</section>';
  }

  function renderTrafficAndPrediction(c){
    var tl = c && c.examTrafficLight || null;
    var curve = c && c.learningCurve || {};
    var pred = curve.predictions || (tl && tl.prediction) || {};
    if(!tl && !pred) return '';
    function lamp(x){ x=x||{state:'riskant',reason:'Daten sammeln'}; return '<div class="bps-traffic '+esc(x.state)+'"><span>'+esc(x.state || 'offen')+'</span><small>'+esc(x.reason || '')+'</small></div>'; }
    return '<div class="bps-coach-section bps-prognosis-card"><h3>Prüfungsampel & Lernkurve</h3>'+ 
      '<div class="bps-traffic-grid"><div><b>BPS</b>'+lamp(tl && tl.bps)+'</div><div><b>CTC</b>'+lamp(tl && tl.ctc)+'</div></div>'+ 
      '<p>'+esc('Trend: '+(pred.trendPerDay==null?'offen':(pred.trendPerDay>=0?'+':'')+pred.trendPerDay+'%/Tag')+' · Prognose 7 Tage: '+(pred.predicted7d==null?'–':pred.predicted7d+'%'))+'</p>'+ 
      '</div>';
  }

  function renderSectionTraffic(c){
    var sections = c && c.examTrafficLight && Array.isArray(c.examTrafficLight.sections) ? c.examTrafficLight.sections : [];
    if(!sections.length) return '';
    return '<div class="bps-coach-section bps-section-traffic-card"><h3>Prüfungsbereiche</h3><div class="bps-section-traffic-list">'+sections.slice(0,5).map(function(s){
      return '<div class="bps-section-traffic '+esc(s.state||'riskant')+'"><b>'+esc(s.title||s.key||'Bereich')+'</b><span>'+esc((s.state||'offen')+' · '+(s.quote||0)+'% · Risiko '+(s.risk||0))+'</span><small>'+esc(s.dominantError ? ('Fokus: '+s.dominantError) : (s.reason||''))+'</small></div>';
    }).join('')+'</div></div>';
  }

  function renderLearningPath(c){
    var plan = c && (c.learningPathPlan || (c.learningPath && c.learningPath.lastPlan)) || null;
    if(!plan || !Array.isArray(plan.phases)) return '';
    var phases = plan.phases.slice(0,5).map(function(p){
      return '<span title="'+esc(p.goal||'')+'"><b>'+esc(p.title||p.key||'Phase')+'</b><small>'+esc(p.priority||'')+'</small></span>';
    }).join('');
    var dom = c && c.errorPath && c.errorPath.dominant ? c.errorPath.dominant : null;
    return '<div class="bps-coach-section bps-learning-path-card"><h3>Lernpfad</h3>'+ 
      '<p>'+esc('Nächste Runde: '+(plan.focusSkill||'mixed')+' · '+(plan.count||5)+' Aufgaben · '+(plan.dueReviews||0)+' Reviews fällig')+'</p>'+ 
      '<div class="bps-path-steps">'+phases+'</div>'+ 
      (dom ? '<p><b>Dominanter Denkfehler:</b> '+esc((dom.type||'Fehler')+' · '+(dom.subtype||'')+' ('+(dom.count||0)+'×)')+'</p>' : '')+
      '</div>';
  }

  function renderLearningIntelligence(li){
    li = li || {};
    var weak = li.weakSkill || null, strong = li.strongSkill || null;
    var decisions = Array.isArray(li.lastDecisions) ? li.lastDecisions : [];
    var precise = Array.isArray(li.preciseMistakes) ? li.preciseMistakes : [];
    var curve = li.learningCurve || {};
    var pred = curve.predictions || {};
    var dna = li.dnaStats || {};
    var ep = li.errorPath || {};
    var dom = ep.dominant || null;
    return '<div class="bps-li-grid">'+
      '<div><span>Lernlevel</span><b>'+esc(li.learnerLevel || 3)+'/5</b><small>adaptiv berechnet</small></div>'+ 
      '<div><span>Reviews</span><b>'+esc((li.dueReviews || 0)+'/'+(li.queuedReviews || 0))+'</b><small>fällig/gespeichert</small></div>'+ 
      '<div><span>DNA</span><b>'+esc((dna.normalized||0)+'×')+'</b><small>'+esc((dna.inferred||0)+' geschätzt')+'</small></div>'+ 
      '</div>'+ 
      (weak ? '<p><b>Schärfen:</b> '+esc(weak.category+' · '+weak.subtype+' · '+Math.round((weak.correct/Math.max(1,weak.answered))*100)+'%')+'</p>' : '<p>Noch keine stabile Schwäche erkannt.</p>')+
      (strong ? '<p><b>Stabil:</b> '+esc(strong.category+' · '+strong.subtype+' · '+Math.round((strong.correct/Math.max(1,strong.answered))*100)+'%')+'</p>' : '')+
      '<p><b>Vorhersage:</b> '+esc(pred.confidence ? ('7 Tage '+pred.predicted7d+'% · 14 Tage '+pred.predicted14d+'% · Vertrauen '+pred.confidence+'%') : 'noch Daten sammeln')+'</p>'+
      renderMasteryLine(li)+
      (dom ? '<p><b>Denkfehler-Fokus:</b> '+esc((dom.type||'Fehler')+' · '+(dom.subtype||'')+' · '+(dom.lastRemediation||''))+'</p>' : '')+
      (precise.length ? '<details class="bps-li-debug" open><summary>Feinere Fehlerdiagnose</summary>'+precise.slice(0,3).map(function(x){ return '<p>'+esc((x.type||'Fehler')+' · '+(x.subtype||'')+' · '+(x.remediation||''))+'</p>'; }).join('')+'</details>' : '')+
      (decisions.length ? '<details class="bps-li-debug"><summary>Warum diese Aufgaben?</summary>'+decisions.slice(0,3).map(function(d){ return '<p>'+esc((d.action||'Auswahl')+' · '+(d.reason||'adaptive Auswahl')+' · Level '+((d.dna&&d.dna.difficulty)||'?'))+'</p>'; }).join('')+'</details>' : '');
  }

  function renderMasteryLine(li){
    var weakest = li && li.weakestMastery;
    var strongest = li && li.strongestMastery;
    if(!weakest && !strongest) return '';
    function pct(x){ return Math.round(Number(x && x.score || 0)*100); }
    var html = '<div class="bps-mastery-line">';
    if(weakest) html += '<p><b>Mastery niedrig:</b> '+esc((weakest.key||'Skill').replace(/\//g,' · ')+' · '+pct(weakest)+'%')+'</p>';
    if(strongest) html += '<p><b>Mastery stark:</b> '+esc((strongest.key||'Skill').replace(/\//g,' · ')+' · '+pct(strongest)+'%')+'</p>';
    return html + '</div>';
  }

  function renderMistakeDNA(items, fallback){
    items = Array.isArray(items) ? items : [];
    if(!items.length) return '<p>'+esc(fallback && fallback !== 'noch offen' ? fallback : 'Noch keine klare Fehler-DNA. Eine kurze Runde reicht, damit ich präziser werde.')+'</p>';
    return '<div class="bps-mistake-dna">'+items.slice(0,4).map(function(x){ return '<button type="button" data-coach-action="train-start" data-mode="revenge" data-skill="mixed" data-difficulty="4" data-count="5"><b>'+esc(x.name)+'</b><small>'+esc((x.count||0)+'× · '+(x.mainCategory||'gemischt')+' · Revanche '+(x.revengeWon||0))+'</small></button>'; }).join('')+'</div>';
  }
  function readinessRing(label, value, sub){
    value = Math.max(0, Math.min(100, Number(value || 0)));
    return '<div class="bps-readiness-card"><div class="bps-readiness-ring" style="--p:'+value+'"><b>'+value+'%</b></div><span>'+esc(label)+'</span><small>'+esc(sub || '')+'</small></div>';
  }
  function renderHub(){
    var e = engine();
    var count = e ? e.count() : 0;
    var db = e && e.databaseStats ? e.databaseStats() : {total:0, verified:0, bySkill:{}};
    var s = e ? e.memorySummary() : null;
    var rec = e ? e.nextRecommendation() : {title:'Coach bereit', text:'Engine lädt.', skill:'mixed', difficulty:3, count:5};
    var task = getCurrentTask();
    var active = e ? e.currentSessionTask() : null;
    if(active && active.task) return renderTraining(active.session, active.task);
    return ''+
      '<section class="bps-coach-hero">'+
        '<div><span class="bps-coach-kicker">Coach V9.5.8 · Premium UX Polish</span><h2>Dein Coach führt die nächste sinnvolle Runde.</h2><p>Kurze Diagnose, klare Empfehlung, gezielte Revanche. Öffne ◈ für Readiness, Lernpfad und Prüfungsampel.</p></div>'+
        '<button class="bps-coach-hero-btn" data-coach-action="command-toggle">◈ Dashboard</button>'+
      '</section>'+
      renderPulse(s)+renderDatabasePulse(db)+
      (task && quizVisible() ? renderTaskBox(task) : '')+
      '<div class="bps-coach-section bps-coach-recommendation"><h3>Coach-Empfehlung</h3><p>'+esc(rec.text)+'</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-skill="'+esc(rec.skill)+'" data-difficulty="'+esc(rec.difficulty)+'" data-count="'+esc(rec.count)+'">Jetzt starten</button><button class="bps-coach-chip" data-coach-action="ask" data-query="Zeig mir meinen Fortschritt">Status anzeigen</button></div></div>'+
      '<div class="bps-coach-section"><h3>Trainingsprofile</h3><div class="bps-coach-mode-grid">'+
        modeBtn('mixed','3','5','5-Minuten Coach','gemischt, frisch, motivierend')+
        modeBtn('logic','4','5','Logik Push','Zahlenreihen + Musterfallen')+
        modeBtn('math','4','5','Mathe Druck','Prozent, Dreisatz, Kopfrechnen')+
        modeBtn('it','3','5','IT Diagnose','FISI-Szenarien statt Lexikon')+
        modeBtn('concentration','4','5','Fokus Sprint','Zeichen, Tempo, Genauigkeit')+
        modeBtn('language','3','5','Sprache Quick','Satz, Begriff, Tatsache/Meinung')+
        '<button class="bps-coach-mode" data-coach-action="python-open"><b>Python Quest</b><small>Levelkurs · Code-Coach · Prüfungscenter</small></button>'+ 
      '</div></div>'+
      '<div class="bps-coach-section"><h3>Schnell fragen</h3><div class="bps-coach-row">'+
        actionBtn('Starte 5 schwere Logikaufgaben','adaptiv generieren')+
        actionBtn('Ich war heute langsam','Coach reagiert menschlich')+
        actionBtn('Zeig mir meinen Fortschritt','Memory auswerten')+
        actionBtn('Gib mir einen Tipp zur aktuellen Aufgabe','prüfungsnah helfen')+
        actionBtn('DNS','Wissensbasis')+
        actionBtn('Dreisatz','Wissensbasis')+
      '</div><p class="bps-coach-source">Wissensbasis: '+count+' lokale Einträge · Aufgabenbank: '+db.total+' Aufgaben · davon '+db.verified+' geprüft · Coach Memory lokal</p></div>'+
      renderChatLog();
  }
  function renderPulse(s){
    if(!s) return '';
    var m=s.memory, answered=m.totals.answered || 0;
    return '<div class="bps-coach-pulse-grid">'+
      statCard('Quote', answered ? percent(s.totalQuote) : 'neu', answered ? 'aus '+answered+' Signalen' : 'erste Runde starten')+
      statCard('Serie', String(m.totals.streak || 0), 'Bestwert '+(m.totals.bestStreak || 0))+
      statCard('Stärke', s.strongest ? s.strongest.name : 'offen', s.strongest ? percent(s.strongest.quote) : 'noch lernen')+
      statCard('Fokus', s.weakest ? s.weakest.name : 'gemischt', s.weakest ? percent(s.weakest.quote) : 'Daten sammeln')+
    '</div>';
  }
  function statCard(label,value,sub){ return '<div class="bps-coach-stat"><span>'+esc(label)+'</span><b>'+esc(value)+'</b><small>'+esc(sub || '')+'</small></div>'; }
  function renderDatabasePulse(db){ if(!db || !db.total) return '<div class="bps-coach-section bps-coach-db-pulse bps-empty-state"><h3>Aufgabenbank noch nicht gekoppelt</h3><p>Der Coach läuft, nutzt aber nur Wissensbasis und Transfer-Aufgaben. Für volle Lernintelligenz später die Hauptdatenbank anbinden.</p></div>'; var skills=db.bySkill||{}; var bits=['math','logic','it','language','concentration'].map(function(k){ return skills[k] ? k+': '+skills[k] : ''; }).filter(Boolean).join(' · '); var dnaReady = db.dnaReady != null ? (' · DNA-ready '+db.dnaReady+'/'+db.total) : ''; return '<div class="bps-coach-section bps-coach-db-pulse"><h3>Aufgabenbank gekoppelt</h3><p>'+esc(db.total+' echte Aufgaben verfügbar · '+(db.verified||0)+' geprüft'+dnaReady)+'</p><small>'+esc(bits || 'Gemischte Bank aktiv')+'</small></div>'; }
  function modeBtn(skill,difficulty,count,title,sub,mode){ return '<button class="bps-coach-mode" data-coach-action="train-start" data-mode="'+esc(mode || 'focus-5')+'" data-skill="'+esc(skill)+'" data-difficulty="'+esc(difficulty)+'" data-count="'+esc(count)+'"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></button>'; }
  function actionBtn(query, sub){ return '<button type="button" class="bps-coach-action" data-coach-action="ask" data-query="'+esc(query)+'">'+esc(query)+'<small>'+esc(sub || '')+'</small></button>'; }
  function renderTaskBox(task){ return '<div class="bps-coach-section bps-coach-taskbox"><h3>Aktuelle Aufgabe erkannt</h3><p>'+esc(shorten(strip(task.q || task.question || ''), 230))+'</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="ask" data-query="Gib mir einen Tipp zur aktuellen Aufgabe">💡 Tipp</button><button class="bps-coach-chip" data-coach-action="ask" data-query="Zeig mir den Lösungsweg zur aktuellen Aufgabe">📘 Lösungsweg</button></div></div>'; }

  function renderTraining(session, task){
    session = session || {index:0,count:1,mode:'focus'};
    if(!task || !Array.isArray(task.a)){
      return '<div class="bps-coach-section"><h3>Coach-Runde konnte nicht geladen werden</h3><p>Die Sitzung war beschädigt oder unvollständig. Starte die Runde neu, dann setze ich sauber auf.</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-skill="mixed" data-difficulty="3" data-count="5">Neu starten</button><button class="bps-coach-chip" data-coach-action="hub">Zur Übersicht</button></div></div>';
    }
    var progress = Math.min(100, Math.round((session.index)/(session.count || 1)*100));
    var fb = lastTrainingFeedback ? renderTrainingFeedback(lastTrainingFeedback) : '';
    var sourceLabel = task.bankDriven ? 'echte Bank-Aufgabe' : 'Transfer-Aufgabe';
    return '<div class="bps-coach-training-head"><span>'+esc(softModeName(session.mode))+' · '+(session.index+1)+'/'+session.count+' · '+esc(sourceLabel)+'</span><b>'+esc((task.stage ? task.stage+' · ' : '') + (task.cat || 'Training'))+' · '+esc(task.skill || 'Fokus')+'</b><div class="bps-coach-mini-progress"><i style="width:'+progress+'%"></i></div><p>'+esc(task.coachIntro || 'Kurz fokussieren, dann sauber entscheiden.')+'</p></div>'+fb+
      '<div class="bps-coach-generated-task"><div class="bps-coach-dna"><span>'+esc(task.bankDriven ? 'Bank-DNA' : 'Transfer-DNA')+': '+esc(task.subtype || 'mixed')+'</span><span>Level '+esc(task.difficulty || 3)+'</span><span>Falle: '+esc(task.trap || 'zu schnell entschieden')+'</span></div><h3>'+safeTaskText(task.q)+'</h3><div class="bps-coach-answer-grid">'+
      task.a.map(function(ans,idx){ return '<button data-coach-action="train-answer" data-index="'+idx+'">'+esc(ans)+'</button>'; }).join('')+
      '</div></div><div class="bps-coach-chiprow"><button class="bps-coach-chip" data-coach-action="train-stop">Runde beenden</button><button class="bps-coach-chip" data-coach-action="ask" data-query="Erklär mir diese Aufgabe">Fragen</button></div>';
  }
  function renderTrainingFeedback(fb){
    if(!fb) return '';
    var cls = fb.correct ? 'good' : 'bad';
    var headline = fb.correct ? 'Sauber gelöst' : 'Fehlerpfad erkannt';
    var chosen = fb.task && Array.isArray(fb.task.a) && fb.selected != null ? fb.task.a[fb.selected] : '';
    var correct = fb.task && Array.isArray(fb.task.a) && fb.correctIndex != null ? fb.task.a[fb.correctIndex] : '';
    var meta = !fb.correct && correct ? ('Richtig: '+correct+(chosen ? ' · deine Wahl: '+chosen : '')) : ''; 
    return '<div class="bps-coach-training-feedback '+cls+'"><b>'+esc(headline)+'</b><p>'+esc(fb.line || '')+'</p>'+(meta?'<small>'+esc(meta)+'</small>':'')+'<p>'+esc(fb.explanation || '')+'</p>'+(fb.mistakeType?'<small>Fehler-DNA: '+esc(fb.mistakeType)+'</small>':'')+'<small>'+esc(fb.reward || '')+'</small></div>';
  }
  function renderSessionFinished(session){
    var quote = session.answered ? Math.round(session.correct/session.answered*100) : 0;
    var s = engine().memorySummary();
    var db = engine().databaseStats ? engine().databaseStats() : {total:0, verified:0, bySkill:{}};
    var cc = engine().commandCenter ? engine().commandCenter() : null;
    var weekly = cc && cc.weekly ? cc.weekly : null;
    var dna = cc && cc.mistakeInsights && cc.mistakeInsights[0] ? cc.mistakeInsights[0].name : '';
    return '<div class="bps-coach-finish"><span>Coach-Runde abgeschlossen</span><h2>'+session.correct+'/'+session.answered+' richtig</h2><p>'+esc(quote >= 80 ? 'Sehr stark. Das war nicht nur Training, das war echte Stabilität.' : quote >= 60 ? 'Solide. Ich habe genug Signale, um die nächste Runde gezielter zu machen.' : 'Nicht schlimm. Genau daraus bauen wir jetzt die bessere Folgeaufgabe.')+'</p></div>'+renderPulse(s)+renderDatabasePulse(db)+(weekly?'<div class="bps-coach-section"><h3>Wochenwirkung</h3><p>'+esc((weekly.delta==null?'Trend wird aufgebaut.':'Wochentrend: '+(weekly.delta>=0?'+':'')+weekly.delta+' %.')+(dna?' Fokus-DNA: '+dna+'.':''))+'</p></div>':'')+'<div class="bps-coach-section"><h3>Nächster sinnvoller Schritt</h3><p>'+esc(engine().nextRecommendation().text)+'</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-skill="'+esc(engine().nextRecommendation().skill)+'" data-difficulty="'+esc(engine().nextRecommendation().difficulty)+'" data-count="5">Nächste Runde</button><button class="bps-coach-chip" data-coach-action="hub">Zur Übersicht</button></div></div>';
  }

  function renderChatLog(){ if(!messages.length) return '<div class="bps-coach-chat-log" id="bpsCoachChatLog"></div>'; return '<div class="bps-coach-chat-log" id="bpsCoachChatLog">'+messages.map(function(m){ return '<div class="bps-coach-message '+(m.role === 'user' ? 'user' : 'coach')+'">'+m.html+'</div>'; }).join('')+'</div>'; }
  function sendFromInput(){ var input=$('bpsCoachInput'); var msg=input ? input.value.trim() : ''; if(!msg) return; if(input) input.value=''; ask(msg); }
  function ask(query){
    if(!engine()){ notice('Coach-Engine nicht geladen.'); return; }
    var reply;
    try{
      var context = getContext();
      reply = engine().answer(query, context);
    }catch(e){
      console.warn('[Coach] Antwortfehler', e);
      reply = { found:false, title:'Coach kurz neu sortieren', shortAnswer:'Da ist beim Verarbeiten etwas hängen geblieben. Deine App läuft weiter – starte die Frage oder Runde einfach nochmal.', easyExplanation:'Ich habe den Fehler abgefangen, damit kein kaputter Coach-State entsteht.', steps:['Frage erneut senden','oder kurze Coach-Runde starten'], source:'Coach Quality Guard' };
    }
    messages.push({role:'user', html:esc(query)});
    messages.push({role:'coach', html:renderReply(reply, query)});
    messages = messages.slice(-10);
    open('KI Coach V9.5.8', reply.title || 'Antwort', renderConversation(reply), { pauseTimer: quizVisible() });
  }
  function renderConversation(reply){
    var action = '';
    if(reply && (reply.mode === 'start-training' || reply.recommendation)){
      var r = reply.recommendation;
      var skill = r.skill || (r.summary && r.summary.weakest ? 'mixed' : 'mixed');
      var diff = r.difficulty || 3;
      var count = r.count || 5;
      action = '<div class="bps-coach-section"><h3>Direkt umsetzen</h3><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-mode="'+esc(r.mode || 'focus-5')+'" data-skill="'+esc(skill)+'" data-difficulty="'+esc(diff)+'" data-count="'+esc(count)+'">Coach-Runde starten</button><button class="bps-coach-chip" data-coach-action="hub">Übersicht</button></div></div>';
    }
    return renderChatLog() + action + '<div class="bps-coach-section"><h3>Weiterfragen</h3><p>Du kannst unten schreiben oder über 🎤 diktieren.</p></div>';
  }
  function renderReply(reply, query){
    if(!reply || reply.found === false) return renderNoResult(reply || {}, query);
    if(reply.mode === 'coach-status') return renderStatus(reply);
    var html = '<div><b>'+esc(reply.title || 'Antwort')+'</b></div>';
    if(reply.shortAnswer) html += '<p>'+esc(reply.shortAnswer)+'</p>';
    if(reply.easyExplanation) html += '<div class="bps-coach-section"><h3>Einfach erklärt</h3><p>'+esc(reply.easyExplanation)+'</p></div>';
    if(reply.memoryTrick) html += '<div class="bps-coach-section"><h3>🧠 Merkhilfe</h3><p>'+esc(reply.memoryTrick)+'</p></div>';
    if(reply.steps && reply.steps.length) html += '<div class="bps-coach-section"><h3>Schritt für Schritt</h3><ol>'+reply.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ol></div>';
    if(reply.example) html += '<div class="bps-coach-section"><h3>Beispiel</h3><p>'+esc(reply.example)+'</p></div>';
    if(reply.commonMistake) html += '<div class="bps-coach-section"><h3>Typische Falle</h3><p>'+esc(reply.commonMistake)+'</p></div>';
    if(reply.tested) html += '<div class="bps-coach-section"><h3>Was wird geprüft?</h3><p>'+esc(reply.tested)+'</p></div>';
    if(reply.taskText) html += '<div class="bps-coach-section"><h3>Aufgabe</h3><p>'+esc(reply.taskText)+'</p></div>';
    if(reply.related && reply.related.length) html += renderRelated(reply.related);
    html += '<p class="bps-coach-source">Quelle: '+esc(reply.source || 'Lokaler Lerncoach')+'</p>';
    return html;
  }
  function renderStatus(reply){
    var s = reply.summary || engine().memorySummary();
    var db = engine().databaseStats ? engine().databaseStats() : {total:0, verified:0, bySkill:{}};
    return '<div><b>'+esc(reply.title || 'Coach-Status')+'</b></div><p>'+esc(reply.shortAnswer || '')+'</p>'+renderPulse(s)+renderDatabasePulse(db)+'<div class="bps-coach-section"><h3>Interpretation</h3><p>'+esc(s.weakest ? ('Aktueller Fokusbereich: '+s.weakest.name+'. Nicht dramatisch, aber ideal für kurze Wiederholungen.') : 'Noch nicht genug Daten für eine echte Schwächenanalyse.')+'</p></div>';
  }
  function renderNoResult(reply, query){
    var related = Array.isArray(reply.related) ? reply.related : [];
    var html = '<div class="bps-coach-section bps-coach-no-result"><h3>'+esc(reply.title || 'Noch kein passender Eintrag gefunden')+'</h3><p>'+esc(reply.shortAnswer || 'Dazu habe ich aktuell keinen passenden Eintrag gefunden.')+'</p></div>';
    html += '<div class="bps-coach-section"><h3>Was ich stattdessen kann</h3><p>'+esc(reply.easyExplanation || 'Der Coach erfindet bewusst keine Antworten, kann aber Training erzeugen.')+'</p></div>';
    if(reply.steps && reply.steps.length) html += '<div class="bps-coach-section"><h3>Nächste Optionen</h3><ol>'+reply.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ol></div>';
    if(related.length) html += renderRelated(related.map(function(x){ return x.topic || x; }));
    html += '<div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-skill="mixed" data-difficulty="3" data-count="5">Coach-Training starten</button><button class="bps-coach-chip" data-coach-action="focus">Anders formulieren</button><button class="bps-coach-chip warn" data-coach-action="feedback">Thema fehlt melden</button></div>';
    html += '<p class="bps-coach-source">Quelle: '+esc(reply.source || 'Lokale Wissensdatenbank')+'</p>';
    return html;
  }
  function renderRelated(list){ var arr=list.map(function(x){ return typeof x === 'string' ? x : (x.topic || x.id || 'Thema'); }).filter(Boolean).slice(0,6); if(!arr.length) return ''; return '<div class="bps-coach-section"><h3>Ähnliche Themen</h3><div class="bps-coach-chiprow">'+arr.map(function(t){ return '<button class="bps-coach-chip" data-coach-action="ask" data-query="'+esc(t)+'">'+esc(t)+'</button>'; }).join('')+'</div></div>'; }
  function shorten(value,max){ value=String(value||''); return value.length <= max ? value : value.slice(0,max-1).trim()+'…'; }

  function startTraining(skill, difficulty, count, mode){
    if(!engine()) return;
    lastTrainingFeedback = null;
    try{
      var session = engine().startSession({ skill:skill || 'mixed', difficulty:Number(difficulty || 3), count:Number(count || 5), mode: mode || 'focus-5' });
      var task = session && session.tasks ? session.tasks[session.index] : null;
      open('Coach-Training', session && session.profile ? session.profile.reason : 'adaptive Runde', renderTraining(session, task), { pauseTimer: quizVisible() });
    }catch(e){
      console.warn('[Coach] Startfehler', e);
      open('Coach-Training', 'Quality Guard', '<div class="bps-coach-section"><h3>Runde konnte nicht starten</h3><p>Ich habe einen ungültigen Zustand abgefangen. Bitte starte die Runde neu.</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="train-start" data-skill="mixed" data-difficulty="3" data-count="5">Neu starten</button></div></div>', { pauseTimer: quizVisible() });
    }
  }
  function answerTraining(idx){
    if(!engine()) return;
    var buttons = document.querySelectorAll('[data-coach-action="train-answer"]');
    buttons.forEach(function(b){ b.disabled = true; b.classList.add('is-locked'); });
    var feedback;
    try{ feedback = engine().answerSessionTask(Number(idx)); }
    catch(e){ console.warn('[Coach] Wertungsfehler', e); feedback = {ok:false, message:'Antwort konnte nicht sauber gewertet werden.'}; }
    if(!feedback.ok){ notice(feedback.message || 'Keine aktive Coach-Runde.'); buttons.forEach(function(b){ b.disabled = false; b.classList.remove('is-locked'); }); return; }
    lastTrainingFeedback = feedback;
    updateDock();
    if(feedback.session.finished){
      open('Coach-Runde fertig', 'Auswertung + nächster Reiz', renderSessionFinished(feedback.session), { pauseTimer: quizVisible() });
      lastTrainingFeedback = null;
      return;
    }
    var next = engine().currentSessionTask();
    open('Coach-Training', 'weiter im Flow', renderTraining(next && next.session, next && next.task), { pauseTimer: quizVisible() });
  }
  function stopTraining(){ try{ localStorage.removeItem('bps_learning_coach_v2_session'); }catch(e){} lastTrainingFeedback=null; openHub(); }
  function openHub(){ messages = messages.slice(-6); open('KI Coach V9.5.8', 'menschlicher · stabiler · prüfungsnah', renderHub(), { pauseTimer: quizVisible() }); }
  function openWithTask(task){ pauseTimerIfNeeded(); var ctx=getContext({ currentTask:task || getCurrentTask() }); var reply=engine() ? engine().answer('Gib mir einen Tipp zur aktuellen Aufgabe', ctx) : null; open('Hilfe zur Aufgabe', 'Tipp, Strategie und Lösungsweg', renderReply(reply, 'Gib mir einen Tipp zur aktuellen Aufgabe'), { pauseTimer:true }); }

  function cyclePersonality(){
    if(!engine() || !engine().personality || !engine().setPersonality) return;
    var order = ['motivating','strict','calm','exam'];
    var cur = engine().personality().id || 'motivating';
    var next = order[(order.indexOf(cur)+1) % order.length] || 'motivating';
    var p = engine().setPersonality(next);
    notice('Coach-Stil: '+p.title);
    open('Coach-Stil', p.title+' · '+p.cue, '<div class="bps-coach-section"><h3>'+esc(p.title)+'</h3><p>'+esc('Ab jetzt reagiert der Coach '+p.style+'.')+'</p><div class="bps-coach-chiprow"><button class="bps-coach-chip primary" data-coach-action="command-toggle">Command Center</button><button class="bps-coach-chip" data-coach-action="hub">Zurück</button></div></div>', { pauseTimer: quizVisible() });
  }
  function startTranscription(){
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var mic = $('bpsCoachMic'), input = $('bpsCoachInput');
    if(!CONFIG.enableSpeech){ notice('Spracheingabe ist in dieser Integration deaktiviert.'); return; }
    if(!SR){ notice('Spracheingabe wird auf diesem Gerät/Browser nicht unterstützt.'); return; }
    try{
      var rec = new SR(); rec.lang='de-DE'; rec.interimResults=false; rec.maxAlternatives=1;
      if(mic) mic.classList.add('listening');
      rec.onresult=function(ev){ var text = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : ''; if(input){ input.value=text; input.focus(); } if(text) ask(text); };
      rec.onerror=function(){ notice('Transkription abgebrochen oder nicht verstanden.'); };
      rec.onend=function(){ if(mic) mic.classList.remove('listening'); };
      rec.start();
    }catch(e){ if(mic) mic.classList.remove('listening'); notice('Spracheingabe konnte nicht gestartet werden.'); }
  }

  function injectCoachCard(){
    if(!CONFIG.injectHomeCard) return;
    var grid = $('whGrid'); if(!grid || $(CARD_ID)) return;
    var card = document.createElement('div'); card.id = CARD_ID; card.className = 'wh-mod-card wh-coach-card'; card.setAttribute('role','button'); card.setAttribute('tabindex','0'); card.setAttribute('aria-label','KI Coach öffnen');
    card.innerHTML = '<div class="wh-mod-icon c-blue">✦</div><span class="wh-mod-label">KI Coach V9.5.8</span><small class="wh-mod-sub">adaptiv</small>';
    card.addEventListener('click', openHub); card.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openHub(); } }); grid.insertBefore(card, grid.firstChild || null);
  }
  function injectQuizButton(){ if(!CONFIG.injectQuizButton) return; var row=document.querySelector('.quiz-footer-row'); if(!row || $(QUIZ_BTN_ID)) return; var btn=document.createElement('button'); btn.id=QUIZ_BTN_ID; btn.type='button'; btn.className='secondary bps-coach-quiz-btn'; btn.textContent='✦ KI Coach'; btn.addEventListener('click', function(){ openWithTask(getCurrentTask()); }); row.insertBefore(btn, row.firstChild || null); }
  function patchAppHelp(){ if(!CONFIG.patchAppHelp) return; try{ if(window.App && typeof App.openMathHelp === 'function' && !App.__coachHelpPatched){ App.__coachHelpPatched=true; App.__legacyOpenMathHelp=App.openMathHelp; App.openMathHelp=function(q){ openWithTask(q || getCurrentTask()); }; } }catch(e){} }

  function onAnswerRecorded(historyItem, task){
    if(!engine() || !historyItem) return;
    var payload = {
      generated:false,
      taskId: task && (task.id || task.q),
      signature: task ? [task.cat, task.type || '', strip(task.q || '').slice(0,32)].join('|') : '',
      cat: historyItem.cat,
      group: historyItem.group,
      correct: !!historyItem.correct,
      timeout: !!historyItem.timeout,
      givenIndex: historyItem.givenIndex,
      correctIndex: historyItem.correctIndex,
      duration: historyItem.duration || 0,
      allowed: historyItem.allowed || 0,
      trap: task && (task.trap || task.commonMistake)
    };
    var rec = engine().recordMemory(payload);
    if(rec && rec.reward) updateDock();
  }
  function onSessionFinished(){ updateDock(); }

  function boot(options){
    if(options && typeof options === 'object') CONFIG = Object.assign({}, CONFIG, options);
    if(initialized) { updateDock(); reflowDockPosition(); return window.BPSLearningCoach; }
    initialized = true;
    ensureShell(); injectCoachCard(); injectQuizButton(); patchAppHelp(); updateDock();
    var grid = $('whGrid'); if(grid && CONFIG.injectHomeCard){ var moGrid = trackObserver(new MutationObserver(function(){ setTimeout(injectCoachCard,0); })); moGrid.observe(grid,{childList:true}); }
    var bodyMo = trackObserver(new MutationObserver(function(){ injectQuizButton(); patchAppHelp(); })); bodyMo.observe(document.body,{childList:true, subtree:true, attributes:true, attributeFilter:['class']});
    var tries=0; var poll=trackTimer(setInterval(function(){ injectCoachCard(); injectQuizButton(); patchAppHelp(); updateDock(); reflowDockPosition(); tries++; if(tries>40){ clearInterval(poll); } },250));
    bind(window, 'resize', function(){ setTimeout(reflowDockPosition, 80); });
    if(window.visualViewport) bind(window.visualViewport, 'resize', function(){ setTimeout(reflowDockPosition, 80); });
    bind(window, 'orientationchange', function(){ setTimeout(reflowDockPosition, 220); });
    return window.BPSLearningCoach;
  }
  function destroy(){
    close(); initialized = false;
    observerBag.forEach(function(o){ try{o.disconnect();}catch(e){} }); observerBag=[];
    timerBag.forEach(function(id){ try{clearInterval(id); clearTimeout(id);}catch(e){} }); timerBag=[];
    listenerBag.forEach(function(x){ try{x.target.removeEventListener(x.type,x.handler,x.options);}catch(e){} }); listenerBag=[];
    ['bpsCoachDock','bpsCoachBackdrop','bpsCoachSheet',CARD_ID,QUIZ_BTN_ID].forEach(function(id){ var el=$(id); if(el && el.parentNode) el.parentNode.removeChild(el); });
    if(window.App && window.App.__coachHelpPatched && window.App.__legacyOpenMathHelp){ try{ window.App.openMathHelp = window.App.__legacyOpenMathHelp; delete window.App.__coachHelpPatched; delete window.App.__legacyOpenMathHelp; }catch(e){} }
  }

  function delegatedClick(ev){
    var el = ev.target.closest('[data-coach-action]'); if(!el) return;
    var action = el.getAttribute('data-coach-action');
    if(action === 'ask') ask(el.getAttribute('data-query') || el.textContent || '');
    if(action === 'focus'){ var input=$('bpsCoachInput'); if(input) input.focus(); }
    if(action === 'hub') openHub();
    if(action === 'command-toggle'){ commandCenterOpen = !commandCenterOpen; open('KI Coach V9.5.8', commandCenterOpen ? 'Command Center geöffnet' : 'Chat + Training', renderHub(), { pauseTimer: quizVisible() }); }
    if(action === 'train-start') startTraining(el.getAttribute('data-skill') || 'mixed', el.getAttribute('data-difficulty') || 3, el.getAttribute('data-count') || 5, el.getAttribute('data-mode') || 'focus-5');
    if(action === 'train-answer') answerTraining(el.getAttribute('data-index'));
    if(action === 'train-stop') stopTraining();
    if(action === 'personality-cycle') cyclePersonality();
    if(action === 'python-open') { try{ if(window.PythonQuest && typeof PythonQuest.open === 'function') PythonQuest.open('dashboard'); else notice('Python Quest ist noch nicht geladen.'); }catch(e){ notice('Python Quest konnte nicht geöffnet werden.'); } }
    if(action === 'feedback') { try{ if(window.AppFeedback && typeof AppFeedback.openGeneralFeedbackSheet === 'function') AppFeedback.openGeneralFeedbackSheet(); else notice('Feedback ist nicht verfügbar.'); }catch(e){ notice('Feedback ist nicht verfügbar.'); } }
  }
  function recordAnswer(payload, task){ return onAnswerRecorded(payload, task); }
  function getState(){ return engine() ? { version:VERSION, initialized:initialized, config:Object.assign({}, CONFIG), memory:engine().memorySummary(), readiness:engine().readinessScore(), currentSession:engine().currentSessionTask(), qa: engine().memoryHealthReport ? engine().memoryHealthReport() : null } : { version:VERSION, initialized:initialized, config:Object.assign({}, CONFIG) }; }
  window.BPSLearningCoach = { version:VERSION, init:boot, destroy:destroy, configure:function(options){ CONFIG = Object.assign({}, CONFIG, options || {}); return Object.assign({}, CONFIG); }, open:openHub, openHub:openHub, openWithTask:openWithTask, ask:ask, close:close, getContext:getContext, getState:getState, startTraining:startTraining, onAnswerRecorded:onAnswerRecorded, recordAnswer:recordAnswer, onSessionFinished:onSessionFinished, cyclePersonality:cyclePersonality, qaSelfCheck:function(){ return engine() && engine().qaSelfCheck ? engine().qaSelfCheck() : { ok:false, reason:'engine_missing' }; }, repairMemory:function(){ return engine() && engine().repairMemory ? engine().repairMemory() : { ok:false, reason:'engine_missing' }; } };
  if(!delegatedClickBound){ document.addEventListener('click', delegatedClick); delegatedClickBound = true; window.__BPS_LEARNING_COACH_DELEGATED_CLICK_BOUND__ = true; }
  if(CONFIG.autoMount !== false){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot(); }); else boot(); }
})();
