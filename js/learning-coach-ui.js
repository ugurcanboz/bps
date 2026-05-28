/* BPS-Trainer V9.2.0 · Learning Coach UI
   Andockbarer lokaler KI-ähnlicher Lerncoach im bestehenden WordHub/Deep-Sheet-Stil. */
(function(){
  'use strict';

  var VERSION = '9.2.0';
  var isOpen = false;
  var resumeTimerOnClose = false;
  var messages = [];
  var lastContext = {};
  var CARD_ID = 'whCoachCard';
  var QUIZ_BTN_ID = 'bpsCoachQuizBtn';

  function $(id){ return document.getElementById(id); }
  function esc(value){ return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]; }); }
  function strip(value){ return window.BPSLearningCoachEngine ? window.BPSLearningCoachEngine.stripHtml(value) : String(value || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }

  function notice(text){
    try{
      if(window.BPSWordHubLayer && typeof BPSWordHubLayer.notice === 'function') return BPSWordHubLayer.notice(text);
    }catch(e){}
    console.log('[Coach]', text);
  }

  function quizVisible(){
    var q = $('quiz');
    return !!(q && !q.classList.contains('hidden'));
  }

  function getCurrentTask(){
    try{
      if(window.BPSLearningCoachEngine) return BPSLearningCoachEngine.currentTaskFromApp();
    }catch(e){}
    return null;
  }

  function getBranch(){
    try{ return localStorage.getItem('bps_branch') || ''; }catch(e){ return ''; }
  }

  function getContext(extra){
    var task = getCurrentTask();
    var ctx = {
      appVersion: window.TRAINER_BUILD_VERSION || VERSION,
      branch: getBranch(),
      currentTask: task,
      screen: quizVisible() ? 'quiz' : 'home'
    };
    if(extra){ Object.keys(extra).forEach(function(k){ ctx[k] = extra[k]; }); }
    lastContext = ctx;
    return ctx;
  }

  function pauseTimerIfNeeded(){
    resumeTimerOnClose = false;
    if(!quizVisible()) return;
    try{
      if(window.App && typeof App.pauseTimer === 'function'){
        App.pauseTimer();
        resumeTimerOnClose = true;
      }
    }catch(e){}
  }

  function resumeTimerIfNeeded(){
    if(!resumeTimerOnClose) return;
    resumeTimerOnClose = false;
    if(!quizVisible()) return;
    try{
      if(window.App && typeof App.resumeTimer === 'function') App.resumeTimer();
    }catch(e){}
  }

  function ensureShell(){
    if($('bpsCoachBackdrop') && $('bpsCoachSheet')) return;
    var bd = document.createElement('div');
    bd.id = 'bpsCoachBackdrop';
    bd.className = 'bps-coach-backdrop';
    bd.addEventListener('click', function(ev){ if(ev.target === bd) close(); });
    document.body.appendChild(bd);

    var sh = document.createElement('aside');
    sh.id = 'bpsCoachSheet';
    sh.className = 'bps-coach-sheet';
    sh.setAttribute('role','dialog');
    sh.setAttribute('aria-modal','true');
    sh.setAttribute('aria-label','Lerncoach');
    sh.innerHTML = ''+
      '<div class="bps-coach-grabber" aria-hidden="true"></div>'+
      '<header class="bps-coach-header">'+
        '<div class="bps-coach-icon">🎓</div>'+
        '<div class="bps-coach-title"><b id="bpsCoachTitle">Lerncoach</b><span id="bpsCoachSubtitle">Fragen, verstehen, Schritt für Schritt lernen</span></div>'+
        '<button class="bps-coach-close" id="bpsCoachClose" type="button" aria-label="Lerncoach schließen">✕</button>'+
      '</header>'+
      '<main class="bps-coach-body" id="bpsCoachBody"></main>'+
      '<footer class="bps-coach-footer">'+
        '<input class="bps-coach-input" id="bpsCoachInput" autocomplete="off" placeholder="Frag etwas, z. B. Prozent, DNS, Komma …">'+
        '<button class="bps-coach-send" id="bpsCoachSend" type="button">Senden</button>'+
      '</footer>';
    document.body.appendChild(sh);
    $('bpsCoachClose').addEventListener('click', close);
    $('bpsCoachSend').addEventListener('click', sendFromInput);
    $('bpsCoachInput').addEventListener('keydown', function(ev){ if(ev.key === 'Enter'){ ev.preventDefault(); sendFromInput(); } });
    document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape' && isOpen) close(); });
  }

  function open(title, subtitle, html, options){
    ensureShell();
    options = options || {};
    if(options.pauseTimer) pauseTimerIfNeeded();
    $('bpsCoachTitle').textContent = title || 'Lerncoach';
    $('bpsCoachSubtitle').textContent = subtitle || 'Fragen, verstehen, Schritt für Schritt lernen';
    $('bpsCoachBody').innerHTML = html || renderHub();
    $('bpsCoachBody').scrollTop = 0;
    $('bpsCoachBackdrop').classList.add('show');
    $('bpsCoachSheet').offsetHeight;
    $('bpsCoachSheet').classList.add('show');
    isOpen = true;
    setTimeout(function(){ try{ $('bpsCoachInput').focus({preventScroll:true}); }catch(e){} }, 120);
  }

  function close(){
    var bd = $('bpsCoachBackdrop'), sh = $('bpsCoachSheet');
    if(sh) sh.classList.remove('show');
    if(bd) bd.classList.remove('show');
    isOpen = false;
    resumeTimerIfNeeded();
  }

  function renderHub(){
    var count = window.BPSLearningCoachEngine ? BPSLearningCoachEngine.count() : 0;
    var task = getCurrentTask();
    var taskHtml = '';
    if(quizVisible() && task){
      taskHtml = '<div class="bps-coach-section bps-coach-taskbox">'+
        '<h3>Aktuelle Aufgabe erkannt</h3>'+
        '<p>'+esc(shorten(strip(task.q || task.question || ''), 230))+'</p>'+
        '<div class="bps-coach-chiprow">'+
          '<button class="bps-coach-chip primary" data-coach-action="ask" data-query="Gib mir einen Tipp zur aktuellen Aufgabe">💡 Tipp</button>'+
          '<button class="bps-coach-chip" data-coach-action="ask" data-query="Zeig mir den Lösungsweg zur aktuellen Aufgabe">📘 Lösungsweg</button>'+
        '</div>'+
      '</div>';
    }
    return ''+
      '<div class="bps-coach-section">'+
        '<h3>Was ist der Lerncoach?</h3>'+
        '<p>Ein lokaler Lernhelfer. Er erklärt nur Themen aus der Wissensdatenbank oder aus der aktuellen Aufgabe. Wenn nichts gefunden wird, sagt er ehrlich Bescheid.</p>'+
        '<p class="bps-coach-source">Wissensbasis: '+count+' lokale Einträge · keine externe KI · offline nutzbar</p>'+
      '</div>'+
      taskHtml+
      '<div class="bps-coach-section">'+
        '<h3>Schnell starten</h3>'+
        '<div class="bps-coach-row">'+
          actionBtn('Prozentrechnung','10 %, Rabatt, Grundwert')+
          actionBtn('Dreisatz','erst auf 1, dann hoch')+
          actionBtn('Kommasetzung','weil, dass, Nebensatz')+
          actionBtn('Simple Past','Englisch Vergangenheit')+
          actionBtn('DNS','IT einfach erklärt')+
          actionBtn('Rechnung','kaufmännisch prüfen')+
          actionBtn('Beobachtung','sozial/pädagogisch')+
          actionBtn('Textaufgaben lösen','Lesen, markieren, rechnen')+
        '</div>'+
      '</div>'+
      '<div class="bps-coach-section">'+
        '<h3>So fragst du gut</h3>'+
        '<p>Nutze kurze Begriffe: „Rabatt“, „Dreisatz“, „DNS“, „Komma“, „Beobachtung“ oder „Lösungsweg zur Aufgabe“.</p>'+
      '</div>'+
      renderChatLog();
  }

  function actionBtn(query, sub){
    return '<button type="button" class="bps-coach-action" data-coach-action="ask" data-query="'+esc(query)+'">'+esc(query)+'<small>'+esc(sub || '')+'</small></button>';
  }

  function renderChatLog(){
    if(!messages.length) return '<div class="bps-coach-chat-log" id="bpsCoachChatLog"></div>';
    return '<div class="bps-coach-chat-log" id="bpsCoachChatLog">'+messages.map(function(m){
      return '<div class="bps-coach-message '+(m.role === 'user' ? 'user' : 'coach')+'">'+m.html+'</div>';
    }).join('')+'</div>';
  }

  function sendFromInput(){
    var input = $('bpsCoachInput');
    var msg = input ? input.value.trim() : '';
    if(!msg) return;
    if(input) input.value = '';
    ask(msg);
  }

  function ask(query){
    if(!window.BPSLearningCoachEngine){ notice('Coach-Engine nicht geladen.'); return; }
    var context = getContext();
    var reply = BPSLearningCoachEngine.answer(query, context);
    messages.push({role:'user', html: esc(query)});
    messages.push({role:'coach', html: renderReply(reply, query)});
    open('Lerncoach Antwort', reply.title || 'Antwort', renderConversation(), { pauseTimer: quizVisible() });
  }

  function renderConversation(){
    return renderChatLog() + '<div class="bps-coach-section"><h3>Weiterfragen</h3><p>Du kannst unten direkt weiterfragen oder ein ähnliches Thema öffnen.</p></div>';
  }

  function renderReply(reply, query){
    if(!reply || reply.found === false) return renderNoResult(reply || {}, query);
    var html = '';
    html += '<div><b>'+esc(reply.title || 'Antwort')+'</b></div>';
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

  function renderNoResult(reply, query){
    var related = Array.isArray(reply.related) ? reply.related : [];
    var html = '<div class="bps-coach-section bps-coach-no-result"><h3>'+esc(reply.title || 'Noch kein passender Eintrag gefunden')+'</h3><p>'+esc(reply.shortAnswer || 'Dazu habe ich aktuell keinen passenden Eintrag gefunden.')+'</p></div>';
    html += '<div class="bps-coach-section"><h3>Warum?</h3><p>'+esc(reply.easyExplanation || 'Der Coach erfindet bewusst keine Antworten.')+'</p></div>';
    if(reply.steps && reply.steps.length) html += '<div class="bps-coach-section"><h3>Was du tun kannst</h3><ol>'+reply.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ol></div>';
    if(related.length) html += renderRelated(related.map(function(x){ return x.topic || x; }));
    html += '<div class="bps-coach-chiprow"><button class="bps-coach-chip" data-coach-action="focus">Anders formulieren</button><button class="bps-coach-chip warn" data-coach-action="feedback">Thema fehlt melden</button></div>';
    html += '<p class="bps-coach-source">Quelle: '+esc(reply.source || 'Lokale Wissensdatenbank')+'</p>';
    return html;
  }

  function renderRelated(list){
    var arr = list.map(function(x){ return typeof x === 'string' ? x : (x.topic || x.id || 'Thema'); }).filter(Boolean).slice(0,6);
    if(!arr.length) return '';
    return '<div class="bps-coach-section"><h3>Ähnliche Themen</h3><div class="bps-coach-chiprow">'+arr.map(function(t){ return '<button class="bps-coach-chip" data-coach-action="ask" data-query="'+esc(t)+'">'+esc(t)+'</button>'; }).join('')+'</div></div>';
  }

  function shorten(value, max){
    value = String(value || '');
    if(value.length <= max) return value;
    return value.slice(0, max - 1).trim() + '…';
  }

  function openHub(){
    messages = messages.slice(-6);
    open('Lerncoach', 'Fragen, verstehen, Schritt für Schritt lernen', renderHub(), { pauseTimer: quizVisible() });
  }

  function openWithTask(task){
    pauseTimerIfNeeded();
    var ctx = getContext({ currentTask: task || getCurrentTask() });
    var reply = window.BPSLearningCoachEngine ? BPSLearningCoachEngine.answer('Gib mir einen Tipp zur aktuellen Aufgabe', ctx) : null;
    open('Hilfe zur Aufgabe', 'Tipp, Merkhilfe und Lösungsweg bei Bedarf', renderReply(reply, 'Gib mir einen Tipp zur aktuellen Aufgabe'), { pauseTimer: true });
  }

  function injectCoachCard(){
    var grid = $('whGrid');
    if(!grid || $(CARD_ID)) return;
    var card = document.createElement('div');
    card.id = CARD_ID;
    card.className = 'wh-mod-card wh-coach-card';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label','Lerncoach öffnen');
    card.innerHTML = '<div class="wh-mod-icon c-blue">🎓</div><span class="wh-mod-label">Lerncoach</span>';
    card.addEventListener('click', openHub);
    card.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openHub(); } });
    grid.insertBefore(card, grid.firstChild || null);
  }

  function injectQuizButton(){
    var row = document.querySelector('.quiz-footer-row');
    if(!row || $(QUIZ_BTN_ID)) return;
    var btn = document.createElement('button');
    btn.id = QUIZ_BTN_ID;
    btn.type = 'button';
    btn.className = 'secondary bps-coach-quiz-btn';
    btn.textContent = '🎓 KI Coach';
    btn.addEventListener('click', function(){ openWithTask(getCurrentTask()); });
    row.insertBefore(btn, row.firstChild || null);
  }

  function patchAppHelp(){
    try{
      if(window.App && typeof App.openMathHelp === 'function' && !App.__coachHelpPatched){
        App.__coachHelpPatched = true;
        App.__legacyOpenMathHelp = App.openMathHelp;
        App.openMathHelp = function(q){ openWithTask(q || getCurrentTask()); };
      }
    }catch(e){}
  }

  function boot(){
    ensureShell();
    injectCoachCard();
    injectQuizButton();
    patchAppHelp();

    var grid = $('whGrid');
    if(grid){
      var moGrid = new MutationObserver(function(){ setTimeout(injectCoachCard, 0); });
      moGrid.observe(grid, {childList:true});
    }
    var bodyMo = new MutationObserver(function(){ injectQuizButton(); patchAppHelp(); });
    bodyMo.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});

    var tries = 0;
    var poll = setInterval(function(){
      injectCoachCard(); injectQuizButton(); patchAppHelp();
      tries++;
      if(tries > 40) clearInterval(poll);
    }, 250);
  }

  document.addEventListener('click', function(ev){
    var el = ev.target.closest('[data-coach-action]');
    if(!el) return;
    var action = el.getAttribute('data-coach-action');
    if(action === 'ask') ask(el.getAttribute('data-query') || el.textContent || '');
    if(action === 'focus') { var input = $('bpsCoachInput'); if(input) input.focus(); }
    if(action === 'feedback') {
      try{
        if(window.AppFeedback && typeof AppFeedback.openGeneralFeedbackSheet === 'function') AppFeedback.openGeneralFeedbackSheet();
        else notice('Feedback ist nicht verfügbar.');
      }catch(e){ notice('Feedback ist nicht verfügbar.'); }
    }
  });

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.BPSLearningCoach = {
    version: VERSION,
    open: openHub,
    openHub: openHub,
    openWithTask: openWithTask,
    ask: ask,
    close: close,
    getContext: getContext
  };
})();
