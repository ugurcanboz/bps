/* egt-user-notices.js — G39.1
   Zeigt beim Nutzer:
   - Warnungs-Popup wenn pendingWarning im Profil (von Admin gesetzt)
   - Gesperrt-Screen wenn blocked=true
   Liest aus der Firebase-Session bzw. Firestore-Profil. */
(function () {
  'use strict';

  function nowIso() { return new Date().toISOString(); }
  function localGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function localSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

  var SESSION_KEY = 'egt_auth_profile_session_v1';
  var ACK_KEY = 'egt_warning_acked_v1';

  /* ── Warnungs-Popup ── */
  function showWarning(warning) {
    if (document.querySelector('.egt-warning-popup')) return;
    var pop = document.createElement('div');
    pop.className = 'egt-warning-popup';
    pop.innerHTML =
      '<div class="egt-warning-box">' +
        '<div class="egt-warning-icon">⚠️</div>' +
        '<div class="egt-warning-title">Administration</div>' +
        '<div class="egt-warning-text">' + escapeHtml(warning.text || 'Es liegt eine Mitteilung der Administration vor.') + '</div>' +
        '<button class="egt-warning-ack">Verstanden</button>' +
      '</div>';
    document.body.appendChild(pop);
    pop.querySelector('.egt-warning-ack').onclick = function () {
      // Als gelesen markieren (lokal, damit es nicht erneut erscheint)
      var acked = localGet(ACK_KEY) || [];
      if (warning.id && acked.indexOf(warning.id) < 0) { acked.push(warning.id); localSet(ACK_KEY, acked); }
      // Firestore-Warnung als acknowledged markieren
      try {
        if (window.EGTAdminPortal && typeof EGTAdminPortal.acknowledgeWarning === 'function') {
          var s = localGet(SESSION_KEY);
          if (s) EGTAdminPortal.acknowledgeWarning(s.code || s.profileId || s.firebaseUid);
        }
      } catch (e) { }
      pop.style.opacity = '0'; pop.style.transition = 'opacity .3s';
      setTimeout(function () { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 320);
    };
  }

  /* ── Gesperrt-Screen ── */
  function showBlocked(reason) {
    if (document.querySelector('.egt-blocked-screen')) return;
    var scr = document.createElement('div');
    scr.className = 'egt-blocked-screen';
    scr.innerHTML =
      '<div class="egt-blocked-box">' +
        '<div class="egt-blocked-icon">🔒</div>' +
        '<div class="egt-blocked-title">Konto gesperrt</div>' +
        '<div class="egt-blocked-text">' + escapeHtml(reason || 'Dein Konto wurde durch die Administration gesperrt.') + '</div>' +
        '<div class="egt-blocked-hint">Für eine Entsperrung wende dich über „Kontakt &amp; Hilfe" an die Administration.</div>' +
      '</div>';
    document.body.appendChild(scr);
    // App unbedienbar machen
    document.body.style.overflow = 'hidden';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
    });
  }

  /* ── Profil aus Firestore neu laden und prüfen ── */
  async function checkUserStatus() {
    var s = localGet(SESSION_KEY);
    if (!s) return;
    /* G54.45.2: Vorher wurde hier bei s.source !== 'firebase-auth' sofort
       abgebrochen — lokal angemeldete Teilnehmer (Zugangscode/lokales Profil,
       der Normalfall im Kursbetrieb) sahen dadurch WEDER Verwarnungen NOCH
       den Gesperrt-Bildschirm. Jetzt: Firebase-Profil wenn vorhanden,
       sonst frisches Profil aus dem lokalen Teilnehmerbestand. */

    var profile = null;
    if (s.source === 'firebase-auth') {
      try {
        if (window.EGTAuthEngine && typeof EGTAuthEngine.refreshProfile === 'function') {
          profile = await EGTAuthEngine.refreshProfile();
        }
      } catch (e) { }
    }
    if (!profile) {
      try {
        var code = String(s.code || s.userId || s.profileId || '').trim().toUpperCase();
        if (code) {
          var all = JSON.parse(localStorage.getItem('egt_global_learner_profiles') || '{}') || {};
          if (all[code]) profile = all[code];
        }
      } catch (e2) { }
    }
    // Fallback: Session-Daten
    if (!profile) profile = s;

    // 1) Gesperrt?
    if (profile.blocked || profile.status === 'blocked') {
      showBlocked(profile.blockedReason);
      return;
    }

    // 2) Pending Warning?
    var warning = profile.pendingWarning;
    if (warning && warning.text) {
      var acked = localGet(ACK_KEY) || [];
      if (!warning.id || acked.indexOf(warning.id) < 0) {
        showWarning(warning);
      }
    }
  }

  // Beim Login / Session-Update prüfen
  window.addEventListener('egt:auth-profile-updated', function () {
    setTimeout(checkUserStatus, 1200);
  });
  // Beim App-Start prüfen (verzögert, damit Firestore bereit ist)
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(checkUserStatus, 2500);
  } else {
    window.addEventListener('load', function () { setTimeout(checkUserStatus, 2500); });
  }

  window.EGTUserNotices = { check: checkUserStatus, showWarning: showWarning, showBlocked: showBlocked };

})();
