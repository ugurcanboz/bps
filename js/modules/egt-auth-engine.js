/* egt-auth-engine.js — G38.5
   Bridge zwischen Firebase Email-Auth (neu) und EGTUserDatabase/EGTAdminPortal (bestehend).
   - Registrierung: Firebase createUserWithEmailAndPassword + EGTUserDatabase.redeemAccessCode
   - Login: Firebase signInWithEmailAndPassword + EGTAdminPortal.loginWithCode (Profil laden)
   - Session wird in egt_auth_profile_session_v1 geschrieben (=EGTAuthProfileShell Session-Key)
     damit updateTopLogin() sofort Nickname+Rolle zeigt
   - Code-Validierung und Rollen-Vergabe bleibt 100% beim bestehenden System
*/
(function () {
  'use strict';

  var VERSION = 'G38.5-AUTH-BRIDGE-2026-06-13';
  var SESSION_KEY = 'egt_auth_profile_session_v1'; // GLEICHER Key wie auth-profile-shell.js

  function nowIso() { return new Date().toISOString(); }
  function emit(name, detail) { try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) { } }
  function localSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function localGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function localDel(k) { try { localStorage.removeItem(k); } catch (e) { } }

  /* ── State ── */
  var state = { ready: false, firebaseUser: null, session: null, error: '' };

  /* ── Firebase SDK laden (identisch wie admin-participant-engine) ── */
  function cfg() { return window.EGT_SYNC_CONFIG || {}; }
  function fbCfg() { var c = cfg(); return c.firebaseConfig || c.syncConfig || null; }
  function fbReady() { var c = fbCfg(); return !!(c && c.apiKey && c.authDomain && c.projectId && c.appId); }
  function sdkBase() { return 'https://www.gstatic.com/firebasejs/' + (cfg().sdkVersion || '12.14.0') + '/'; }

  var _fb = null;
  async function loadFb() {
    if (_fb) return _fb;
    if (!fbReady()) throw new Error('Firebase-Konfiguration fehlt.');
    var base = sdkBase();
    var appMod = await import(base + 'firebase-app.js');
    var authMod = await import(base + 'firebase-auth.js');
    var appName = 'egt-auth-bridge';
    var app;
    try { app = appMod.getApp(appName); } catch (e) { app = appMod.initializeApp(fbCfg(), appName); }
    var auth = authMod.getAuth(app);
    _fb = { auth, authMod };
    return _fb;
  }

  /* ── Session schreiben (in den Key den auth-profile-shell liest) ── */
  function saveSession(session) {
    state.session = session;
    if (session) {
      localSet(SESSION_KEY, session);
    } else {
      localDel(SESSION_KEY);
    }
    var open = session ? gateStatus().open : false;

    // 1) auth-profile-shell.js informieren (löst refreshUi() aus)
    emit('egt:auth-profile-updated', { session: session, gateOpen: open });

    // 2) Gate-Status-Event (schließt Sperrbildschirm wenn open=true)
    emit('egt:gate-status-changed', { gateOpen: open, session: session });

    // 3) Top-Login Button direkt aktualisieren (alle bekannten Hooks)
    setTimeout(function() {
      try { if (window.updateLoginBtnState) window.updateLoginBtnState(); } catch(e){}
      try { if (window.EGTAuthProfileShell && typeof EGTAuthProfileShell.refresh === 'function') EGTAuthProfileShell.refresh(); } catch(e){}
    }, 50);
  }

  /* ── Gate-Logik ── */
  function sessionIsValid(s) {
    if (!s) return false;
    // Admin, Dozent, Teilnehmer mit Code: immer gültig
    var role = String(s.role || '').toLowerCase();
    if (role === 'admin' || role === 'teacher' || role === 'dozent') return true;
    if (role === 'participant' && s.code) return true;
    // Demo: Zähler prüfen
    if (role === 'demo') {
      var demo = s.demo || {};
      var used = Number(demo.simulationsUsed || demo.count || 0);
      var max = Number(demo.max || 2);
      return used < max;
    }
    return false;
  }

  function gateStatus() {
    var s = state.session || localGet(SESSION_KEY);
    if (!s) return { open: false, reason: 'no-session' };
    var role = String(s.role || '').toLowerCase();
    // Admin/Dozent: immer offen
    if (role === 'admin' || role === 'teacher' || role === 'dozent') return { open: true, reason: 'privileged' };
    // Admin-E-Mail-Whitelist
    var adminEmails = (cfg().adminEmails || []);
    if (!Array.isArray(adminEmails)) adminEmails = [adminEmails];
    if (s.email && adminEmails.indexOf(s.email.toLowerCase()) >= 0) return { open: true, reason: 'admin-email' };
    // Teilnehmer mit Code: offen
    if ((role === 'participant' || role === 'teacher') && s.code) return { open: true, reason: 'valid-code' };
    // Firebase-Auth-User ohne Profil: zeige "Code einlösen" statt "Kein gültiger Zugang"
    if (s.source === 'firebase-auth' && s.firebaseUid && !s.code) return { open: false, reason: 'needs-code' };
    // Demo
    if (role === 'demo') {
      var demo = s.demo || {};
      var used = Number(demo.simulationsUsed || demo.count || 0);
      var max = Number(demo.max || 2);
      if (used < max) return { open: true, reason: 'demo', demoLeft: max - used };
      return { open: false, reason: 'demo-exhausted', demoLeft: 0 };
    }
    return { open: false, reason: 'no-access' };
  }

  /* ── Demo starten (lokal, kein Firebase Auth nötig) ── */
  async function startDemo() {
    var existing = localGet(SESSION_KEY);
    var demoUsed = 0;
    if (existing && existing.role === 'demo' && existing.demo) {
      demoUsed = Number(existing.demo.simulationsUsed || existing.demo.count || 0);
    }
    if (demoUsed >= 2) return { ok: false, reason: 'demo-exhausted', demoLeft: 0 };
    var session = {
      source: 'local-demo', role: 'demo',
      nickname: 'Demo-Nutzer', groupId: 'demo',
      demo: { simulationsUsed: demoUsed, count: demoUsed, max: 2 },
      updatedAt: nowIso()
    };
    saveSession(session);
    return { ok: true, session, demoLeft: 2 - demoUsed };
  }

  /* ── Registrierung: Firebase Auth + EGTUserDatabase.redeemAccessCode ── */
  async function register(email, password, nickname, accessCode) {
    if (!email || !password || !nickname) return { ok: false, reason: 'missing-fields', message: 'E-Mail, Passwort und Nickname sind Pflichtfelder.' };
    if (password.length < 8) return { ok: false, reason: 'weak-password', message: 'Passwort muss mindestens 8 Zeichen haben.' };
    if (!accessCode || !accessCode.trim()) return { ok: false, reason: 'no-code', message: 'Teilnahmecode ist Pflicht. Ohne gültigen Code ist keine Registrierung möglich.' };

    try {
      // 1) Firebase Auth: Account anlegen
      var fb = await loadFb();
      var cred = await fb.authMod.createUserWithEmailAndPassword(fb.auth, email, password);
      var fbUser = cred.user;
      state.firebaseUser = fbUser;

      // 2) Bestätigungsmail senden (Firebase built-in)
      try { await fb.authMod.sendEmailVerification(fbUser); } catch (e) { /* non-fatal */ }

      // 3) EGTUserDatabase: Zugangscode einlösen (Rolle, Gruppe, Profil)
      var db = window.EGTUserDatabase;
      if (!db || typeof db.redeemAccessCode !== 'function') {
        throw new Error('UserDatabase nicht bereit. Bitte Seite neu laden.');
      }
      var result = await db.redeemAccessCode({ code: accessCode.trim(), nickname: nickname.trim(), password: password });
      var profile = (result && result.profile) || {};

      // 4) Session mit firebaseUid anreichern
      var session = {
        source: 'firebase-auth',
        role: profile.role || result.role || 'participant',
        nickname: profile.nickname || profile.displayName || nickname.trim(),
        code: profile.code || accessCode.trim(),
        groupId: profile.groupId || '',
        profileId: profile.profileId || profile.id || fbUser.uid,
        firebaseUid: fbUser.uid,
        email: email,
        emailVerified: fbUser.emailVerified,
        updatedAt: nowIso()
      };
      saveSession(session);
      return { ok: true, session, role: session.role, emailVerificationSent: true };
    } catch (e) {
      // Firebase Auth Fehler übersetzen
      var msg = {
        'auth/email-already-in-use': 'Diese E-Mail ist bereits registriert. Bitte einloggen.',
        'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
        'auth/weak-password': 'Passwort zu schwach (min. 8 Zeichen).'
      }[e.code] || (e.message || 'Registrierung fehlgeschlagen.');
      return { ok: false, reason: e.code || 'register-error', message: msg };
    }
  }

  /* ── Firestore: Profil via Firebase-UID suchen ── */
  async function fetchProfileByUid(uid) {
    try {
      var fb = await loadFb();
      if (!fb.fsMod) {
        // fsMod laden
        var base = sdkBase();
        var fsMod = await import(base + 'firebase-firestore.js');
        var appMod = await import(base + 'firebase-app.js');
        var appName2 = 'egt-auth-bridge';
        var app2;
        try { app2 = appMod.getApp(appName2); } catch(e2) { app2 = appMod.initializeApp(fbCfg(), appName2); }
        fb.fsMod = fsMod;
        fb.db = fsMod.getFirestore(app2);
        _fb = fb;
      }
      var courseId2 = cfg().courseId || 'course_2026_gk';
      // 1) Direkt via UID in learners suchen
      var snap = await fb.fsMod.getDoc(fb.fsMod.doc(fb.db, 'courses/'+courseId2+'/learners/'+uid));
      if (snap.exists()) return snap.data();
      // 2) Query via firebaseUid Feld
      var qs = await fb.fsMod.getDocs(
        fb.fsMod.query(
          fb.fsMod.collection(fb.db, 'courses/'+courseId2+'/learners'),
          fb.fsMod.where('firebaseUid', '==', uid)
        )
      );
      if (!qs.empty) { var d = null; qs.forEach(function(doc){ if(!d) d=doc.data(); }); return d; }
      return null;
    } catch(e) { return null; }
  }

  /* ── Login: Firebase signIn + Profil aus Firestore laden ── */
  async function login(email, password) {
    if (!email || !password) return { ok: false, reason: 'missing-fields', message: 'E-Mail und Passwort eingeben.' };
    try {
      var fb = await loadFb();
      var cred = await fb.authMod.signInWithEmailAndPassword(fb.auth, email, password);
      var fbUser = cred.user;
      state.firebaseUser = fbUser;

      // 1) Profil via Firebase-UID aus Firestore laden
      var profile = await fetchProfileByUid(fbUser.uid);

      // Gesperrt? Login ablehnen
      if (profile && (profile.blocked || profile.status === 'blocked')) {
        try { await fb.authMod.signOut(fb.auth); } catch(e){}
        return { ok: false, reason: 'blocked', message: profile.blockedReason || 'Dein Konto wurde durch die Administration gesperrt. Wende dich über Kontakt & Hilfe an uns.' };
      }

      // 2) Fallback: gecachte Session
      if (!profile) {
        var cached = localGet(SESSION_KEY);
        if (cached && cached.firebaseUid === fbUser.uid) profile = cached;
      }

      // 3) Kein Profil gefunden aber Login erfolgreich:
      //    Admin-E-Mails (in EGT_SYNC_CONFIG.adminEmails) bekommen Admin-Rolle
      //    Alle anderen: Teilnehmer ohne Code → Gate zeigt "Code einlösen"
      var role = (profile && (profile.role || profile.accessRole)) || 'participant';
      var nickname = (profile && (profile.nickname || profile.displayName || profile.alias)) || email.split('@')[0];
      var code = (profile && (profile.code || profile.userId || profile.loginName)) || '';

      // Admin-E-Mail-Whitelist aus Config
      var adminEmails = (cfg().adminEmails || []);
      if (!Array.isArray(adminEmails)) adminEmails = [adminEmails];
      if (adminEmails.indexOf(email.toLowerCase()) >= 0) {
        role = 'admin'; code = code || 'ADMIN';
      }

      var session = {
        source: 'firebase-auth',
        role: role,
        nickname: nickname,
        code: code,
        groupId: (profile && profile.groupId) || '',
        profileId: (profile && (profile.profileId || profile.id)) || fbUser.uid,
        firebaseUid: fbUser.uid,
        email: email,
        emailVerified: fbUser.emailVerified,
        updatedAt: nowIso()
      };
      saveSession(session);

      // EGTUserDatabase State aktualisieren
      var db = window.EGTUserDatabase;
      if (db && typeof db.setSession === 'function' && profile) {
        try { db.setSession(profile); } catch (e) { }
      }

      return { ok: true, session, role: session.role };
    } catch (e) {
      var msg = {
        'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden.',
        'auth/wrong-password': 'Falsches Passwort.',
        'auth/invalid-credential': 'E-Mail oder Passwort falsch.',
        'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
        'auth/too-many-requests': 'Zu viele Versuche. Bitte kurz warten.'
      }[e.code] || (e.message || 'Login fehlgeschlagen.');
      return { ok: false, reason: e.code || 'login-error', message: msg };
    }
  }

  /* ── Code nachträglich einlösen (eingeloggt aber noch kein Code) ── */
  async function redeemCode(code) {
    var s = state.session || localGet(SESSION_KEY);
    if (!s) return { ok: false, reason: 'not-logged-in', message: 'Bitte zuerst einloggen oder registrieren.' };
    var db = window.EGTUserDatabase;
    if (!db || typeof db.redeemAccessCode !== 'function') return { ok: false, reason: 'db-not-ready', message: 'UserDatabase nicht bereit.' };
    try {
      var result = await db.redeemAccessCode({ code: code.trim(), nickname: s.nickname || 'Nutzer', password: '' });
      var profile = (result && result.profile) || {};
      var updated = Object.assign({}, s, {
        role: profile.role || result.role || s.role,
        code: profile.code || code.trim(),
        groupId: profile.groupId || s.groupId,
        updatedAt: nowIso()
      });
      saveSession(updated);
      return { ok: true, session: updated, role: updated.role };
    } catch (e) {
      return { ok: false, reason: 'redeem-error', message: e.message || 'Ungültiger Code.' };
    }
  }

  /* ── Logout ── */
  async function logout() {
    try { if (_fb) await _fb.authMod.signOut(_fb.auth); } catch (e) { }
    try { if (window.EGTUserDatabase && typeof EGTUserDatabase.logout === 'function') EGTUserDatabase.logout(); } catch (e) { }
    state.firebaseUser = null;
    saveSession(null);
  }

  /* ── Demo-Simulation zählen ── */
  function recordSimulationUsed() {
    var s = state.session || localGet(SESSION_KEY);
    if (!s || s.role !== 'demo') return;
    var demo = s.demo || {};
    var used = Number(demo.simulationsUsed || demo.count || 0) + 1;
    var updated = Object.assign({}, s, { demo: Object.assign({}, demo, { simulationsUsed: used, count: used }) });
    saveSession(updated);
    emit('egt:demo-simulation-used', { demoUsed: used, demoLeft: Math.max(0, 2 - used) });
  }

  /* ── Init: bestehende Session aus localStorage wiederherstellen ── */
  function init() {
    var cached = localGet(SESSION_KEY);
    if (cached) {
      state.session = cached;
      emit('egt:gate-status-changed', { gateOpen: gateStatus().open, session: cached, source: 'cache' });
    }
    // Firebase Auth-State beobachten (funktioniert nach Seiten-Reload)
    if (fbReady()) {
      loadFb().then(function (fb) {
        fb.authMod.onAuthStateChanged(fb.auth, function (user) {
          state.firebaseUser = user || null;
        });
      }).catch(function () { });
    }
    state.ready = true;
  }

  /* ── Profil neu aus Firestore laden (für Sperr-/Warnungs-Check) ── */
  async function refreshProfile() {
    var s = state.session || localGet(SESSION_KEY);
    if (!s || !s.firebaseUid) return s;
    try {
      var profile = await fetchProfileByUid(s.firebaseUid);
      if (profile) {
        // Session mit frischen Daten anreichern (blocked, pendingWarning)
        var merged = Object.assign({}, s, {
          blocked: profile.blocked || false,
          blockedReason: profile.blockedReason || '',
          status: profile.status || s.status,
          pendingWarning: profile.pendingWarning || null,
          role: profile.role || s.role
        });
        state.session = merged;
        localSet(SESSION_KEY, merged);
        return merged;
      }
    } catch (e) { }
    return s;
  }

  /* ── Public API ── */
  window.EGTAuthEngine = Object.freeze({
    refreshProfile: refreshProfile,
    version: VERSION,
    init: init,
    startDemo: startDemo,
    register: register,
    login: login,
    logout: logout,
    redeemCode: redeemCode,
    recordSimulationUsed: recordSimulationUsed,
    gateStatus: gateStatus,
    get session() { return state.session || localGet(SESSION_KEY); },
    get gateOpen() { return gateStatus().open; },
    get ready() { return state.ready; }
  });

})();
