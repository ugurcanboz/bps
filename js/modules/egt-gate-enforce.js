/* egt-gate-enforce.js — G38.1 Sperrbildschirm-Enforcement
   Intercepts alle ui-router Aktionen, erzwingt Sperrbildschirm bei fehlendem/abgelaufenem Zugang.
   Hooks in App-Simulation-Events für Demo-Zähler-Decrement.
   Muss NACH ui-router.js und egt-auth-engine.js geladen werden. */
(function () {
  'use strict';

  /* Aktionen die IMMER erlaubt sind (Gate, Auth, Feedback, Settings) */
  var ALWAYS_ALLOWED = {
    'auth-demo-start': true, 'auth-redeem-code': true, 'auth-login': true,
    'auth-demo-simulation-start': true, 'login-open-core': true,
    'profile-open': true, 'profile-logout': true,
    'feedback': true, 'feedback-open-core': true,
    'settings': true, 'clear-cache': true,
    'egt-gate-demo': true, 'egt-gate-register': true, 'egt-gate-login': true,
    'egt-gate-redeem': true, 'egt-gate-contact': true, 'tab': true
  };

  /* Auch alle auth- und profile- Prefixe sind immer erlaubt (bereits im Router) */

  function engine() { return window.EGTAuthEngine || null; }

  /* Phase 39E QA bypass: nur lokal/per Query aktiv, niemals Standardzustand */
  function qaBypassEnabled() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('qa') === '1' || params.get('qaBypass') === '1' || localStorage.getItem('egt_qa_bypass_v1') === '1';
    } catch(e) {
      return false;
    }
  }


  /* Sperrbildschirm zeigen */
  function showGate(reason) {
    var ev = new CustomEvent('egt:show-gate', { detail: { reason: reason || 'no-session' } });
    window.dispatchEvent(ev);
  }

  /* Router-Intercept: BEVOR handleAction ausgeführt wird */
  function interceptRouter() {
    if (!window.addEventListener) return;
    document.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-ui-action]') : null;
      if (!el) return;
      var action = el.getAttribute('data-ui-action') || '';
      if (!action) return;
      if (qaBypassEnabled()) return;
      /* Auth/Gate-Aktionen immer durchlassen */
      if (ALWAYS_ALLOWED[action]) return;
      if (/^(auth|profile)-/.test(action)) return;
      /* Gate prüfen */
      if (qaBypassEnabled()) return;
      var eng = engine();
      if (!eng) return; // kein Engine = kein Gate (Fallback offen)
      var gs = eng.gateStatus();
      if (gs.open) return; // Zugang ok, durchlassen
      /* Gesperrt: Klick schlucken und Gate zeigen */
      e.preventDefault();
      e.stopImmediatePropagation();
      showGate(gs.reason);
    }, true /* capture = vor dem Router */);
  }

  /* Tab-Wechsel abfangen (Bottom-Nav) */
  function interceptTabs() {
    if (!window.addEventListener) return;
    document.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-ui-nav="tab"]') : null;
      if (!el) return;
      var tab = el.getAttribute('data-tab') || '';
      /* Home ist immer erlaubt (dort ist der Sperrbildschirm), Auth-Tabs auch */
      if (!tab || tab === 'home' || tab === '0') return;
      if (qaBypassEnabled()) return;
      var eng = engine();
      if (!eng) return;
      var gs = eng.gateStatus();
      if (gs.open) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      showGate(gs.reason);
    }, true);
  }

  /* Simulation-Ende-Hook: Demo-Zähler erhöhen */
  function hookSimulationEnd() {
    window.addEventListener('egt:simulation-ended', function () {
      var eng = engine();
      if (!eng) return;
      var s = eng.session;
      if (s && (s.role === 'demo' || s.role === 'trial')) {
        eng.recordSimulationUsed().then(function () {
          var gs = eng.gateStatus();
          if (!gs.open) showGate(gs.reason);
        });
      }
    });
    /* Auch auf App-internen Restart-Event hören */
    window.addEventListener('egt:quiz-completed', function () {
      window.dispatchEvent(new CustomEvent('egt:simulation-ended'));
    });
  }

  /* Periodische Gate-Prüfung (Code könnte ablaufen) */
  function startPeriodicCheck() {
    setInterval(function () {
      var eng = engine();
      if (!eng || !eng.session) return;
      var gs = eng.gateStatus();
      if (!gs.open && !document.querySelector('.egt-gate-screen')) showGate(gs.reason);
    }, 60000); // jede Minute
  }

  /* Gate-Status-Change: wenn gateOpen=true -> Sperrbildschirm entfernen */
  function handleGateOpen() {
    var gate = document.querySelector('.egt-gate-screen');
    if (gate) {
      gate.style.transition = 'opacity .4s';
      gate.style.opacity = '0';
      setTimeout(function () { if (gate.parentNode) gate.parentNode.removeChild(gate); }, 420);
    }
    // Body-Lock aufheben
    document.body.classList.remove('egt-gate-active');
    document.documentElement.style.overflow = '';
    // Top-Right aktualisieren
    try { if (window.EGTAuthProfileShell && EGTAuthProfileShell.refresh) EGTAuthProfileShell.refresh(); } catch(e){}
    try { if (window.updateLoginBtnState) window.updateLoginBtnState(); } catch(e){}
  }

  window.addEventListener('egt:gate-status-changed', function (e) {
    if (e.detail && e.detail.gateOpen) handleGateOpen();
  });

  // WICHTIG: Auch auf Session-Update hören -> sofort Gate-Status prüfen
  window.addEventListener('egt:auth-profile-updated', function (e) {
    var eng = window.EGTAuthEngine;
    if (eng) {
      var gs = eng.gateStatus();
      if (gs.open) handleGateOpen();
    }
  });

  /* Init */
  function init() {
    interceptRouter();
    interceptTabs();
    hookSimulationEnd();
    startPeriodicCheck();
    /* initiales Gate prüfen */
    function check() {
      if (qaBypassEnabled()) {
        handleGateOpen();
        return;
      }
      var eng = engine();
      if (!eng || !eng.ready) { setTimeout(check, 150); return; }
      var gs = eng.gateStatus();
      if (!gs.open) showGate(gs.reason);
    }
    setTimeout(check, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
