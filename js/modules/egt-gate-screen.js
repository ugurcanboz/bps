/* egt-gate-screen.js — G38.4
   Desktop: 2-Spalten (Video links | Buttons rechts)
   Mobil: Einspaltig scrollbar
   Audio: professionelle Web-Audio-Sounds mit korrektem Unlock
*/
(function () {
  'use strict';

  var FORMSPREE = 'https://formspree.io/f/mykvbooq';
  var COPYRIGHT = '© 2026 Ugurcan Bozkurt – Alle Rechte vorbehalten';

  /* ═══════════════ WEB AUDIO ═══════════════ */
  var AC = null;
  var _muted = false;
  try { _muted = localStorage.getItem('egt_gate_muted') === '1'; } catch(e){}

  function getAC() {
    if (!AC) {
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
    }
    return AC;
  }

  // Unlock AudioContext beim ersten User-Gesture
  function unlockAC() {
    var c = getAC();
    if (c && c.state === 'suspended') { try { c.resume(); } catch(e){} }
  }
  document.addEventListener('click',       unlockAC, { once: true, passive: true });
  document.addEventListener('touchstart',  unlockAC, { once: true, passive: true });
  document.addEventListener('pointerdown', unlockAC, { once: true, passive: true });

  // Professionelle Sounds via additive Synthese
  function playSound(notes) {
    // notes: [{freq, vol, type, dur, attack, decay}]
    if (_muted) return;
    var c = getAC(); if (!c) return;
    if (c.state === 'suspended') { try { c.resume(); } catch(e){} }
    notes.forEach(function(n) {
      try {
        var osc = c.createOscillator();
        var gain = c.createGain();
        var now = c.currentTime;
        var atk = n.attack || 0.008;
        var dec = n.decay || n.dur || 0.3;
        osc.type = n.type || 'sine';
        osc.frequency.setValueAtTime(n.freq || 440, now);
        if (n.freqEnd) osc.frequency.exponentialRampToValueAtTime(n.freqEnd, now + dec);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(n.vol || 0.08, now + atk);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dec);
        osc.connect(gain); gain.connect(c.destination);
        osc.start(now); osc.stop(now + dec + 0.05);
      } catch(e) {}
    });
  }

  // Ton-Bibliothek (professionell, subtil)
  function sndClick() {
    playSound([
      { freq: 800, vol: 0.06, type: 'sine', attack: 0.005, dur: 0.08 },
      { freq: 1200, vol: 0.03, type: 'sine', attack: 0.005, dur: 0.06 }
    ]);
  }
  function sndSuccess() {
    playSound([
      { freq: 523, vol: 0.07, type: 'sine', attack: 0.01, dur: 0.15 },
      { freq: 659, vol: 0.06, type: 'sine', attack: 0.05, dur: 0.18 },
      { freq: 784, vol: 0.05, type: 'sine', attack: 0.10, dur: 0.25 },
      { freq: 1047, vol: 0.04, type: 'sine', attack: 0.16, dur: 0.30 }
    ]);
  }
  function sndError() {
    playSound([
      { freq: 320, vol: 0.08, type: 'triangle', attack: 0.01, dur: 0.12 },
      { freq: 240, vol: 0.06, type: 'triangle', attack: 0.06, dur: 0.20 }
    ]);
  }
  function sndScene() {
    playSound([
      { freq: 440, vol: 0.04, type: 'sine', attack: 0.02, dur: 0.35, freqEnd: 660 }
    ]);
  }
  function sndOpen() {
    playSound([
      { freq: 600, vol: 0.05, type: 'sine', attack: 0.01, dur: 0.12 },
      { freq: 800, vol: 0.04, type: 'sine', attack: 0.04, dur: 0.18, freqEnd: 1000 }
    ]);
  }

  function toggleMute() {
    _muted = !_muted;
    try { localStorage.setItem('egt_gate_muted', _muted ? '1' : '0'); } catch(e){}
    return _muted;
  }

  // Sound-Bridge für Cinematic
  window.EGTGateScreen = window.EGTGateScreen || {};
  window.EGTGateScreen._sound = function(type) {
    if (type === 'scene') sndScene();
  };

  /* ═══════════════ ICONS ═══════════════ */
  var IC = {
    play:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4Z"/><path d="M14 6v12"/></svg>',
    user:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 19a5 5 0 0 0-10 0"/><circle cx="9" cy="8" r="3.2"/><path d="M18 8v6M15 11h6"/></svg>',
    login:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>',
    mail:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    sound:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    mute:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
    arr:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    warn:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    brain:  '<svg viewBox="0 0 96 96" fill="none"><defs><linearGradient id="gbG" x1="12" y1="10" x2="86" y2="88" gradientUnits="userSpaceOnUse"><stop stop-color="#20D9FF"/><stop offset="1" stop-color="#C13CFF"/></linearGradient></defs><path d="M35 14c-9 0-16 7-16 16v3c-7 2-12 8-12 16s5 14 12 16v1c0 9 7 16 16 16 5 0 10-3 13-7 3 4 8 7 13 7 9 0 16-7 16-16v-1c7-2 12-8 12-16s-5-14-12-16v-3c0-9-7-16-16-16-6 0-11 3-14 8-3-5-8-8-14-8Z" stroke="url(#gbG)" stroke-width="4" fill="rgba(32,100,255,.06)"/><path d="M48 22v52" stroke="url(#gbG)" stroke-width="3"/></svg>',
  };

  /* ═══════════════ HTML ═══════════════ */
  function muteIcon() { return _muted ? IC.mute : IC.sound; }
  function muteLabel() { return _muted ? 'Ton an' : 'Ton aus'; }

  function badgeHTML(reason) {
    var map = {
      'demo-exhausted': { cls:'exhausted', t:'Demo-Versuche aufgebraucht (2/2). Code einlösen für Vollzugang.' },
      'code-expired':   { cls:'expired',   t:'Dein Teilnahmecode ist abgelaufen. Neuen Code einlösen.' },
      'trial-exhausted':{ cls:'exhausted', t:'Probezeit abgelaufen. Bitte gültigen Code einlösen.' },
      'no-access':      { cls:'exhausted', t:'Kein gültiger Zugang. Bitte Teilnahmecode einlösen.' },
      'needs-code':     { cls:'expired',   t:'✓ Eingeloggt – bitte Teilnahmecode einlösen um fortzufahren.' },
    };
    var b = reason && map[reason];
    if (!b) return '';
    return '<div class="egt-gate-status '+b.cls+'">'+IC.warn+'<span>'+b.t+'</span></div>';
  }

  function buildScreen(reason) {
    return (
      /* ─ Topbar ─ */
      '<div class="egt-gate-top">' +
        '<span class="logo">'+IC.brain+'</span>' +
        '<span class="brand"><b>Eignungstest-Trainer</b><small>Dein persönlicher Trainingsbereich</small></span>' +
        '<button id="egtGateMute" class="egt-gate-mute" aria-label="Ton umschalten">' +
          muteIcon()+'<span id="egtGateMuteLbl">'+muteLabel()+'</span>' +
        '</button>' +
      '</div>' +

      /* ─ Haupt-Body: Links Video | Rechts Buttons ─ */
      '<div class="egt-gate-body">' +

        /* Linke Spalte: Video */
        '<div class="egt-gate-left">' +
          '<div id="egtGateCineMount"></div>' +
        '</div>' +

        /* Rechte Spalte: Buttons */
        '<div class="egt-gate-right">' +
          '<div class="egt-gate-cta-head">' +
            '<h2>Wie möchtest du starten?</h2>' +
            '<p>Wähle deinen Einstieg – kein Umweg, kein Stress.</p>' +
          '</div>' +
          badgeHTML(reason) +
          '<div class="egt-gate-tiles">' +
            '<button class="egt-gate-tile primary" data-gate-action="demo">' +
              '<span class="ic">'+IC.play+'</span>' +
              '<span><b>Demo starten</b><small>2 Simulationen kostenlos testen</small></span>' +
              '<span class="arr">'+IC.arr+'</span>' +
            '</button>' +
            '<button class="egt-gate-tile" data-gate-action="register">' +
              '<span class="ic">'+IC.user+'</span>' +
              '<span><b>Registrieren</b><small>Kostenloses Konto erstellen</small></span>' +
              '<span class="arr">'+IC.arr+'</span>' +
            '</button>' +
            '<button class="egt-gate-tile" data-gate-action="redeem">' +
              '<span class="ic">'+IC.ticket+'</span>' +
              '<span><b>Code einlösen</b><small>Vollzugang sofort freischalten</small></span>' +
              '<span class="arr">'+IC.arr+'</span>' +
            '</button>' +
            '<button class="egt-gate-tile" data-gate-action="login">' +
              '<span class="ic">'+IC.login+'</span>' +
              '<span><b>Login</b><small>Bereits registriert? Hier anmelden</small></span>' +
              '<span class="arr">'+IC.arr+'</span>' +
            '</button>' +
            '<button class="egt-gate-tile" data-gate-action="contact">' +
              '<span class="ic">'+IC.mail+'</span>' +
              '<span><b>Kontakt & Hilfe</b><small>Fragen, Kaufinteresse oder Probleme</small></span>' +
              '<span class="arr">'+IC.arr+'</span>' +
            '</button>' +
          '</div>' +
          '<p class="egt-gate-copyright">'+COPYRIGHT+'</p>' +
        '</div>' +

      '</div>'
    );
  }

  /* ═══════════════ GATE SHOW / CLOSE ═══════════════ */
  var screenEl = null;
  var cineInst = null;

  function showGate(reason) {
    if (screenEl) return;
    screenEl = document.createElement('div');
    screenEl.className = 'egt-gate-screen';
    screenEl.setAttribute('role', 'dialog');
    screenEl.setAttribute('aria-modal', 'true');
    screenEl.setAttribute('aria-label', 'Zugang erforderlich');
    screenEl.innerHTML = buildScreen(reason || '');
    document.body.appendChild(screenEl);
    document.body.classList.add('egt-gate-active');
    document.documentElement.style.overflow = 'hidden';
    bindGateEvents();
    mountCinematic();
  }

  function closeGate() {
    if (!screenEl) return;
    if (cineInst) { try { cineInst.close(); } catch(e){} cineInst = null; }
    screenEl.style.transition = 'opacity .35s';
    screenEl.style.opacity = '0';
    setTimeout(function() {
      if (screenEl && screenEl.parentNode) screenEl.parentNode.removeChild(screenEl);
      screenEl = null;
      document.body.classList.remove('egt-gate-active');
      document.documentElement.style.overflow = '';
      // Top-Right-Button sofort auf Nickname/Rolle aktualisieren
      try {
        if (window.EGTAuthProfileShell && typeof EGTAuthProfileShell.refresh === 'function') {
          EGTAuthProfileShell.refresh();
        }
      } catch(e) {}
    }, 380);
  }

  /* ═══════════════ CINEMATIC MOUNTEN ═══════════════ */
  function mountCinematic() {
    var mount = document.getElementById('egtGateCineMount');
    if (!mount) return;
    var Cine = window.EGTCinematicIntro;
    if (!Cine || typeof Cine.mount !== 'function') {
      // Kein Cinematic: schönen Fallback-Gradient anzeigen
      mount.style.cssText = 'flex:1;background:linear-gradient(160deg,#0a1540,#05091e);display:flex;align-items:center;justify-content:center;';
      mount.innerHTML = '<div style="opacity:.25;width:120px;height:120px;">'+IC.brain+'</div>';
      return;
    }
    try {
      cineInst = Cine.mount(mount, {
        duration: 36000,
        keepOpen: true,
        onSelect: function() {}
      });
      // Embedded-Klasse setzen
      var cineEl = mount.querySelector('.egt-cine');
      if (cineEl) {
        cineEl.classList.add('egt-cine--embedded');
        // Explizit absolute positioning für Video-Vollausfüllung
        cineEl.style.cssText = 'position:absolute!important;inset:0!important;width:100%!important;height:100%!important;';
      }
      if (cineInst && cineInst.setMuted) cineInst.setMuted(_muted);
    } catch(e) {
      mount.style.background = 'linear-gradient(160deg,#0a1540,#05091e)';
    }
  }

  /* ═══════════════ GATE EVENTS ═══════════════ */
  function bindGateEvents() {
    if (!screenEl) return;
    screenEl.addEventListener('click', function(e) {
      unlockAC();
      var mute = e.target.closest('#egtGateMute');
      if (mute) {
        var m = toggleMute();
        var btn = document.getElementById('egtGateMute');
        if (btn) btn.innerHTML = muteIcon()+'<span id="egtGateMuteLbl">'+muteLabel()+'</span>';
        if (cineInst && cineInst.setMuted) cineInst.setMuted(m);
        sndClick();
        return;
      }
      var tile = e.target.closest('[data-gate-action]');
      if (tile) { sndClick(); openSheet(tile.getAttribute('data-gate-action')); }
    });
  }

  /* ═══════════════ SHEETS ═══════════════ */
  var sheetEl = null;
  var TITLES = { demo:'Demo starten', register:'Registrieren', login:'Login', redeem:'Code einlösen', contact:'Kontakt & Hilfe' };

  function openSheet(type) {
    closeSheet(); // entfernt alle offenen Sheets synchron
    sndOpen();
    // kurzes Delay damit closeSheet() DOM-Entfernung abschliessen kann
    setTimeout(function(){ _openSheetNow(type); }, 30);
  }
  function _openSheetNow(type) {
    sheetEl = document.createElement('div');
    sheetEl.className = 'egt-gate-overlay';
    sheetEl.setAttribute('role', 'dialog');
    sheetEl.innerHTML =
      '<div class="egt-gate-sheet">' +
        '<div class="egt-gate-sheet-head">' +
          '<h3>'+(TITLES[type]||type)+'</h3>' +
          '<button class="egt-gate-sheet-close" data-sheet-close aria-label="Schließen">✕</button>' +
        '</div>' +
        buildForm(type) +
      '</div>';
    document.body.appendChild(sheetEl);
    sheetEl.addEventListener('click', function(e) {
      if (e.target === sheetEl || e.target.closest('[data-sheet-close]')) { sndClick(); closeSheet(); return; }
      var link = e.target.closest('[data-open-sheet]');
      if (link) { sndClick(); openSheet(link.getAttribute('data-open-sheet')); return; }
      var sub = e.target.closest('[data-submit]');
      if (sub) { unlockAC(); handleSubmit(sub.getAttribute('data-submit')); }
    });
    sheetEl.addEventListener('change', function(e) {
      if (e.target.name === 'reason') {
        var w = document.getElementById('gateCustomReason');
        if (w) w.style.display = e.target.value === 'sonstiges' ? 'flex' : 'none';
      }
    });
    var first = sheetEl.querySelector('input');
    if (first) setTimeout(function(){ try { first.focus(); } catch(e){} }, 80);
  }

  function closeSheet() {
    // Alle offenen Sheets aus dem DOM entfernen (verhindert Sheet-Stapel)
    document.querySelectorAll('.egt-gate-overlay').forEach(function(el){
      el.style.opacity = '0'; el.style.transition = 'opacity .18s';
      setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 200);
    });
    sheetEl = null; // sofort null, nicht nach Delay
  }

  function buildForm(type) {
    if (type === 'demo') return (
      '<div class="egt-gate-form">' +
        '<div class="egt-gate-msg info">Du erhältst <b>2 kostenlose Simulationen</b>. Danach ist ein Zugangscode erforderlich.</div>' +
        '<button class="egt-gate-btn" data-submit="demo">Demo jetzt starten ▶</button>' +
        '<p class="egt-gate-note">Kein Account nötig – der Zähler wird auf Firebase gespeichert.</p>' +
        '<div class="egt-gate-msg" id="gDemoMsg" style="display:none"></div>' +
      '</div>'
    );
    if (type === 'register') return (
      '<div class="egt-gate-form">' +
        '<div class="egt-gate-msg info">Ein <b>gültiger Teilnahmecode</b> ist Pflicht. Ohne Code keine Registrierung – Demo-Modus separat nutzen.</div>' +
        '<label>E-Mail <input type="email" name="email" placeholder="name@beispiel.de" required autocomplete="email"></label>' +
        '<label>Nickname <small>(3–20 Zeichen, im Highscore sichtbar)</small><input type="text" name="nickname" minlength="3" maxlength="20" placeholder="Dein Nickname" required></label>' +
        '<label>Passwort <small>(min. 8 Zeichen)</small><input type="password" name="password" minlength="8" placeholder="Mindestens 8 Zeichen" required autocomplete="new-password"></label>' +
        '<label>Teilnahmecode <small>(Pflicht – wird geprüft und legt deine Rolle fest)</small><input type="text" name="code" placeholder="z. B. 2026-GK-A001" required></label>' +
        '<div class="egt-gate-msg" id="gRegMsg" style="display:none"></div>' +
        '<button class="egt-gate-btn" data-submit="register">Jetzt registrieren</button>' +
        '<p class="egt-gate-note">Nach der Registrierung erhältst du eine Bestätigungsmail von Firebase.</p>' +
        '<button class="egt-gate-btn-sec" data-open-sheet="login">Bereits registriert? Login</button>' +
      '</div>'
    );
    if (type === 'login') return (
      '<div class="egt-gate-form">' +
        '<label>E-Mail <input type="email" name="email" placeholder="name@beispiel.de" required autocomplete="email"></label>' +
        '<label>Passwort <input type="password" name="password" placeholder="Passwort" required autocomplete="current-password"></label>' +
        '<div class="egt-gate-msg" id="gLoginMsg" style="display:none"></div>' +
        '<button class="egt-gate-btn" data-submit="login">Einloggen</button>' +
        '<button class="egt-gate-btn-sec" data-open-sheet="register">Noch kein Konto? Jetzt registrieren</button>' +
        '<button class="egt-gate-btn-sec" data-open-sheet="redeem">Nur Code einlösen (bereits eingeloggt)</button>' +
      '</div>'
    );
    if (type === 'redeem') return (
      '<div class="egt-gate-form">' +
        '<div class="egt-gate-msg info">Bereits eingeloggt? Direkt Code eingeben. Sonst zuerst <b style="cursor:pointer;text-decoration:underline" data-open-sheet="login">einloggen</b>.</div>' +
        '<label>Teilnahmecode <input type="text" name="code" placeholder="z. B. 2026-GK-A001" required autocomplete="one-time-code"></label>' +
        '<div class="egt-gate-msg" id="gRedeemMsg" style="display:none"></div>' +
        '<button class="egt-gate-btn" data-submit="redeem">Code einlösen</button>' +
      '</div>'
    );
    if (type === 'contact') return (
      '<div class="egt-gate-form">' +
        '<label>Name <input type="text" name="name" placeholder="Dein Name" required autocomplete="name"></label>' +
        '<label>E-Mail <input type="email" name="email" placeholder="name@beispiel.de" required autocomplete="email"></label>' +
        '<label>Grund <select name="reason" required>' +
          '<option value="" disabled selected>Bitte wählen …</option>' +
          '<option value="kaufinteresse">Kaufinteresse</option>' +
          '<option value="bug">Bug / technisches Problem</option>' +
          '<option value="zugangscode">Frage zum Zugangscode</option>' +
          '<option value="sonstiges">Sonstiges</option>' +
        '</select></label>' +
        '<label id="gateCustomReason" style="display:none">Eigener Grund <input type="text" name="customReason" placeholder="Kurz beschreiben …" maxlength="120"></label>' +
        '<label>Nachricht <textarea name="message" placeholder="Deine Nachricht …" required minlength="10"></textarea></label>' +
        '<div class="egt-gate-msg" id="gContactMsg" style="display:none"></div>' +
        '<button class="egt-gate-btn" data-submit="contact">Absenden</button>' +
      '</div>'
    );
    return '';
  }

  /* ═══════════════ FORMULAR-HELPER ═══════════════ */
  function fv(n) {
    var el = sheetEl && sheetEl.querySelector('[name="'+n+'"]');
    return el ? (el.value||'').trim() : '';
  }
  function setMsg(id, cls, html) {
    var el = document.getElementById(id);
    if (!el) return;
    el.className = 'egt-gate-msg '+cls;
    el.innerHTML = html;
    el.style.display = 'block';
  }
  function setBusy(btn, busy) {
    if (btn) { btn.disabled = busy; btn.style.opacity = busy ? '.6' : ''; }
  }
  function eng() { return window.EGTAuthEngine || null; }

  /* ═══════════════ SUBMIT-HANDLER ═══════════════ */
  function handleSubmit(type) {
    var btn = sheetEl && sheetEl.querySelector('[data-submit="'+type+'"]');
    if      (type === 'demo')     handleDemo(btn);
    else if (type === 'register') handleRegister(btn);
    else if (type === 'login')    handleLogin(btn);
    else if (type === 'redeem')   handleRedeem(btn);
    else if (type === 'contact')  handleContact(btn);
  }

  function handleDemo(btn) {
    var e = eng();
    if (!e) { sndError(); setMsg('gDemoMsg','err','Auth-System nicht geladen.'); return; }
    setBusy(btn, true);
    e.startDemo().then(function(r) {
      setBusy(btn, false);
      if (r.ok) {
        sndSuccess();
        setMsg('gDemoMsg','ok','✓ Demo gestartet! Noch '+r.demoLeft+' von 2 Simulationen verfügbar.');
        setTimeout(function(){ closeSheet(); closeGate(); }, 1200);
      } else if (r.reason === 'demo-exhausted') {
        sndError(); setMsg('gDemoMsg','err','Demo-Versuche aufgebraucht. Bitte Code einlösen oder registrieren.');
      } else {
        sndError(); setMsg('gDemoMsg','err','Fehler: '+(r.reason||'Unbekannt'));
      }
    }).catch(function(err){ setBusy(btn,false); sndError(); setMsg('gDemoMsg','err',err.message||'Fehler.'); });
  }

  function handleRegister(btn) {
    var e = eng();
    if (!e) { sndError(); setMsg('gRegMsg','err','Auth-System nicht geladen.'); return; }
    var email=fv('email'), pw=fv('password'), nick=fv('nickname'), code=fv('code');
    if (!email||!pw||!nick) { sndError(); setMsg('gRegMsg','err','Bitte alle Pflichtfelder ausfüllen.'); return; }
    setBusy(btn, true);
    e.register(email, pw, nick, code).then(function(r) {
      setBusy(btn, false);
      if (r.ok) {
        sndSuccess();
        setMsg('gRegMsg','ok', r.codeValid
          ? '✓ Registriert & Vollzugang freigeschaltet!'
          : '✓ Registriert! 2 Demo-Versuche verfügbar. Code einlösen für Vollzugang.');
        setTimeout(function(){ closeSheet(); closeGate(); }, 1400);
      } else { sndError(); setMsg('gRegMsg','err',r.message||'Fehler.'); }
    }).catch(function(err){ setBusy(btn,false); sndError(); setMsg('gRegMsg','err',err.message||'Fehler.'); });
  }

  function handleLogin(btn) {
    var e = eng();
    if (!e) { sndError(); setMsg('gLoginMsg','err','Auth-System nicht geladen.'); return; }
    var email=fv('email'), pw=fv('password');
    if (!email||!pw) { sndError(); setMsg('gLoginMsg','err','E-Mail und Passwort eingeben.'); return; }
    setBusy(btn, true);
    e.login(email, pw).then(function(r) {
      setBusy(btn, false);
      if (r.ok) {
        sndSuccess();
        var gs = e.gateStatus();
        if (gs.open) {
          setMsg('gLoginMsg','ok','✓ Erfolgreich eingeloggt!');
          setTimeout(function(){ closeSheet(); closeGate(); }, 900);
        } else if (gs.reason === 'needs-code') {
          setMsg('gLoginMsg','ok','✓ Eingeloggt! Bitte jetzt Teilnahmecode einlösen…');
          setTimeout(function(){ openSheet('redeem'); }, 1100);
        } else if (gs.reason === 'demo-exhausted') {
          setMsg('gLoginMsg','err','Demo-Versuche aufgebraucht. <span data-open-sheet="redeem" style="cursor:pointer;text-decoration:underline;color:#93c5fd">Code einlösen</span>.');
        } else if (gs.reason === 'code-expired') {
          setMsg('gLoginMsg','err','Dein Code ist abgelaufen. <span data-open-sheet="redeem" style="cursor:pointer;text-decoration:underline;color:#93c5fd">Neuen Code einlösen</span>.');
        } else {
          setMsg('gLoginMsg','err','Kein gültiger Zugang. Bitte Code einlösen.');
        }
      } else { sndError(); setMsg('gLoginMsg','err',r.message||'Fehler.'); }
    }).catch(function(err){ setBusy(btn,false); sndError(); setMsg('gLoginMsg','err',err.message||'Fehler.'); });
  }

  function handleRedeem(btn) {
    var e = eng();
    if (!e) { sndError(); setMsg('gRedeemMsg','err','Auth-System nicht geladen.'); return; }
    var code = fv('code');
    if (!code) { sndError(); setMsg('gRedeemMsg','err','Bitte Code eingeben.'); return; }
    setBusy(btn, true);
    e.redeemCode(code).then(function(r) {
      setBusy(btn, false);
      if (r.ok) {
        sndSuccess(); setMsg('gRedeemMsg','ok','✓ Code eingelöst! Vollzugang freigeschaltet.');
        setTimeout(function(){ closeSheet(); closeGate(); }, 1200);
      } else { sndError(); setMsg('gRedeemMsg','err',r.message||'Ungültiger Code.'); }
    }).catch(function(err){ setBusy(btn,false); sndError(); setMsg('gRedeemMsg','err',err.message||'Fehler.'); });
  }

  function handleContact(btn) {
    var name=fv('name'), email=fv('email'), reason=fv('reason'), message=fv('message'), custom=fv('customReason');
    if (!name||!email||!reason||!message) { sndError(); setMsg('gContactMsg','err','Bitte alle Pflichtfelder ausfüllen.'); return; }
    setBusy(btn, true);
    var body = {
      name: name, email: email, message: message,
      reason: reason === 'sonstiges' && custom ? 'Sonstiges: '+custom : reason,
      _subject: 'Eignungstest-Trainer Kontakt: '+reason
    };
    fetch(FORMSPREE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function(res){ return res.json(); })
    .then(function(data){
      setBusy(btn, false);
      if (data.ok||data.next) { sndSuccess(); setMsg('gContactMsg','ok','✓ Nachricht gesendet! Wir melden uns bald.'); }
      else { sndError(); setMsg('gContactMsg','err','Fehler beim Senden. Bitte erneut versuchen.'); }
    }).catch(function(){ setBusy(btn,false); sndError(); setMsg('gContactMsg','err','Netzwerkfehler. Bitte erneut versuchen.'); });
  }

  /* ═══════════════ EVENTS ═══════════════ */
  window.addEventListener('egt:show-gate', function(e) { showGate(e.detail&&e.detail.reason); });
  window.addEventListener('egt:gate-status-changed', function(e) {
    if (e.detail && e.detail.gateOpen) { closeGate(); closeSheet(); }
  });
  // Auch auf Session-Update hören (nach Login/Register)
  window.addEventListener('egt:auth-profile-updated', function(e) {
    var eng = window.EGTAuthEngine;
    if (!eng) return;
    var gs = eng.gateStatus();
    if (gs.open) { closeGate(); closeSheet(); }
  });
  // EGTAuthProfileShell refresh Event
  window.addEventListener('egt:auth-profile-shell-ready', function() {
    var eng = window.EGTAuthEngine;
    if (eng && eng.gateOpen) { closeGate(); closeSheet(); }
  });

  /* Public */
  window.EGTGateScreen = Object.assign(window.EGTGateScreen||{}, {
    show: showGate, close: closeGate, toggleMute: toggleMute
  });

})();
