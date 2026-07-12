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

  var VERSION = 'G54.46.2-AUTH-CLAIMS-2026-07-10';
  var SESSION_KEY = 'egt_auth_profile_session_v1'; // GLEICHER Key wie auth-profile-shell.js
  var QA_BYPASS_KEY = 'egt_qa_bypass_v1'; // Phase 39E: lokaler Smoke-Test-Bypass

  /* Phase 39E QA bypass helpers */
  function qaBypassEnabled() {
    try {
      var sec=window.EGTSecurityContext;
      var allowed=!!(sec&&sec.qaBypassAllowed&&sec.qaBypassAllowed());
      if(!allowed){ localStorage.removeItem(QA_BYPASS_KEY); return false; }
      var params = new URLSearchParams(window.location.search || '');
      if (params.get('qa') === '1' || params.get('qaBypass') === '1') {
        localStorage.setItem(QA_BYPASS_KEY, '1');
        return true;
      }
      return localStorage.getItem(QA_BYPASS_KEY) === '1';
    } catch (e) { return false; }
  }

  function qaSession() {
    return {
      source: 'phase39e-qa-bypass',
      role: 'admin',
      nickname: 'QA Smoke Tester',
      email: 'qa@local.test',
      code: 'QA-BYPASS-39E',
      groupId: 'qa',
      qaBypass: true, trustedClaims: false, developmentOnly: true,
      updatedAt: nowIso()
    };
  }


  function nowIso() { return new Date().toISOString(); }
  function authoritativeSessionRole(session, expectedRole) {
    try {
      var sec=window.EGTSecurityContext;
      if(!(sec&&sec.snapshot)) return false;
      var snap=sec.snapshot();
      var expected=String(expectedRole||session&&session.role||'guest').toLowerCase().replace('dozent','teacher');
      var actual=String(snap.trustedRole||'guest').toLowerCase().replace('dozent','teacher');
      var uid=String(session&&session.firebaseUid||'');
      return snap.claimsTrusted===true && !!snap.user && !snap.user.isAnonymous && !!uid && String(snap.user.uid||'')===uid && actual===expected;
    } catch(e) { return false; }
  }
  function developmentLegacySessionAllowed(){
    try{ var sec=window.EGTSecurityContext; return !!(sec&&sec.legacyCodeLoginAllowed&&sec.legacyCodeLoginAllowed()); }catch(e){ return false; }
  }
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
    var sec=window.EGTSecurityContext;
    if(!sec) throw new Error('Sicherheitskontext fehlt.');
    await sec.initialize();
    var mods=sec.modules;
    _fb={auth:sec.auth,authMod:mods.authMod,fsMod:mods.fsMod,db:sec.db,app:sec.app};
    return _fb;
  }

  async function trustedClaims(force){
    var sec=window.EGTSecurityContext;
    if(!sec) return {role:'guest',claims:{},trusted:false};
    await sec.initialize();
    var claims=await sec.refreshClaims(force===true);
    return {role:sec.trustedRole||'guest',claims:claims||{},trusted:!!sec.claimsTrusted};
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
    if (role === 'admin' || role === 'teacher' || role === 'dozent') return authoritativeSessionRole(s,role) || developmentLegacySessionAllowed();
    if (role === 'participant' && s.code) return authoritativeSessionRole(s,'participant') || developmentLegacySessionAllowed();
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
    if (qaBypassEnabled()) return { open: true, reason: 'qa-bypass' };
    var s = state.session || localGet(SESSION_KEY);
    if (!s) return { open: false, reason: 'no-session' };
    var role = String(s.role || '').toLowerCase();
    // Admin/Dozent nur mit signierten Firebase Custom Claims.
    if (role === 'admin' || role === 'teacher' || role === 'dozent') return (authoritativeSessionRole(s,role)||developmentLegacySessionAllowed()) ? { open: true, reason: authoritativeSessionRole(s,role)?'trusted-live-claims':'development-legacy' } : { open:false, reason:'untrusted-privileged-session' };
    // Teilnehmer mit Code: nur bei Live-Abgleich von UID und signiertem Token-Claim offen.
    if (role === 'participant' && s.code && (authoritativeSessionRole(s,'participant')||developmentLegacySessionAllowed())) return { open: true, reason: authoritativeSessionRole(s,'participant')?'trusted-live-participant':'development-legacy' };
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
      var result = await db.redeemAccessCode({ code: accessCode.trim(), nickname: nickname.trim(), firebaseUid: fbUser.uid, email: email });
      var profile = (result && result.profile) || {};

      // 4) Server hat Rolle/Gruppe als Custom Claims gesetzt; Token erzwingen.
      var claimInfo=await trustedClaims(true);
      var session = {
        source: 'firebase-auth',
        role: claimInfo.role || 'participant',
        nickname: profile.nickname || profile.displayName || nickname.trim(),
        code: profile.code || accessCode.trim(),
        groupId: profile.groupId || '',
        profileId: profile.profileId || profile.id || fbUser.uid,
        firebaseUid: fbUser.uid,
        email: email,
        emailVerified: fbUser.emailVerified,
        trustedClaims: claimInfo.trusted,
        claimsIssuedAt: nowIso(),
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

      // 3) Vertrauenswürdige Rolle ausschließlich aus signiertem ID-Token lesen.
      var claimInfo=await trustedClaims(true);
      var role=claimInfo.role || 'guest';
      var nickname = (profile && (profile.nickname || profile.displayName || profile.alias)) || email.split('@')[0];
      var code = (profile && (profile.code || profile.userId || profile.loginName)) || '';

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
        trustedClaims: claimInfo.trusted,
        claimsIssuedAt: nowIso(),
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
      var result = await db.redeemAccessCode({ code: code.trim(), nickname: s.nickname || 'Nutzer', firebaseUid:s.firebaseUid, email:s.email||'' });
      var profile = (result && result.profile) || {};
      var claimInfo=await trustedClaims(true);
      var updated = Object.assign({}, s, {
        role: claimInfo.role || 'participant',
        code: profile.code || code.trim(),
        groupId: profile.groupId || result.groupId || s.groupId,
        trustedClaims:claimInfo.trusted,
        claimsIssuedAt:nowIso(),
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
    if (qaBypassEnabled()) {
      state.session = qaSession();
      emit('egt:auth-profile-updated', { session: state.session, gateOpen: true, source: 'qa-bypass' });
      emit('egt:gate-status-changed', { gateOpen: true, session: state.session, source: 'qa-bypass' });
    }
    var cached = localGet(SESSION_KEY);
    if (!state.session && cached) {
      state.session = cached;
      emit('egt:gate-status-changed', { gateOpen: gateStatus().open, session: cached, source: 'cache' });
    }
    // Firebase Auth-State beobachten (funktioniert nach Seiten-Reload)
    if (fbReady()) {
      loadFb().then(function (fb) {
        fb.authMod.onAuthStateChanged(fb.auth, function (user) {
          state.firebaseUser = user || null;
          if(!user){ return; }
          trustedClaims(false).then(function(info){
            var cached=state.session||localGet(SESSION_KEY);
            if(cached){
              var merged=Object.assign({},cached,{role:info.role,trustedClaims:info.trusted,claimsIssuedAt:nowIso()});
              saveSession(merged);
            }
          }).catch(function(){});
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
          role: s.role
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
    get qaBypass() { return qaBypassEnabled(); },
    enableQaBypass: function () {
      var sec=window.EGTSecurityContext;
      if(!(sec&&sec.qaBypassAllowed&&sec.qaBypassAllowed())) throw new Error('QA-Bypass ist außerhalb lokaler Entwicklung deaktiviert.');
      try { localStorage.setItem(QA_BYPASS_KEY, '1'); } catch(e){}
      state.session = qaSession();
      emit('egt:auth-profile-updated', { session: state.session, gateOpen: true, source: 'qa-bypass-enable' });
      emit('egt:gate-status-changed', { gateOpen: true, session: state.session, source: 'qa-bypass-enable' });
      return state.session;
    },
    disableQaBypass: function () {
      try { localStorage.removeItem(QA_BYPASS_KEY); } catch(e){}
      state.session = localGet(SESSION_KEY);
      emit('egt:gate-status-changed', { gateOpen: gateStatus().open, session: state.session, source: 'qa-bypass-disable' });
    },
    get ready() { return state.ready; }
  });

})();
