/* Eignungstest-Trainer · G52.9 Phase 23
   Profile/Auth/User Domain Engine
   Kapselt lokale Profilidentität, AuthProfileShell, EGTAuthEngine, Gate-Status,
   Demo-Zähler und User-Identity als stabile Domain-Fassade. */
(function(){
  'use strict';

  const VERSION = 'G52.9-phase23';
  const DEFAULT_PROFILE_KEY = 'eignungstest_trainer_profile';
  const DEFAULT_SESSION_KEY = 'egt_auth_profile_session_v1';

  function safeJson(raw, fallback){ try { return JSON.parse(raw || ''); } catch(e){ return fallback; } }
  function nowIso(){ return new Date().toISOString(); }
  function safeStr(v){ return String(v == null ? '' : v); }
  function cleanName(v){ return safeStr(v).trim().replace(/\s+/g, ' ').slice(0, 32); }
  function emit(name, detail){ try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch(e){} }
  function localGet(key, fallback){ try { return safeJson(localStorage.getItem(key), fallback); } catch(e){ return fallback; } }
  function localSet(key, value){ try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch(e){ return false; } }
  function localString(key, fallback){ try { return localStorage.getItem(key) || fallback; } catch(e){ return fallback; } }

  function createPlayerId(){
    try { if(window.crypto && crypto.randomUUID) return 'plr_' + crypto.randomUUID(); } catch(e){}
    return 'plr_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function roleLabel(role){
    const map = { participant:'Teilnehmer', teacher:'Dozent', dozent:'Dozent', admin:'Admin', demo:'Demo', guest:'Gast' };
    return map[safeStr(role).toLowerCase()] || 'Gast';
  }

  function create(deps){
    deps = deps || {};
    const profileKey = deps.profileKey || DEFAULT_PROFILE_KEY;
    const sessionKey = deps.sessionKey || (window.AppConfig && AppConfig.sessionKey) || DEFAULT_SESSION_KEY;
    const legacyKeys = Array.isArray(deps.profileLegacyKeys) ? deps.profileLegacyKeys.slice() : [];
    const $ = typeof deps.$ === 'function' ? deps.$ : function(id){ return document.getElementById(id); };

    function shell(){ return window.EGTAuthProfileShell || null; }
    function auth(){ return window.EGTAuthEngine || null; }
    function userDb(){ return window.EGTUserDatabase || null; }
    function admin(){ return deps.adminPortal || window.AdminPortalDomainEngine || window.EGTAdminPortal || null; }

    function normalizeProfile(profile){
      const base = { player_id:createPlayerId(), name:'', display_name:'', createdAt:nowIso(), settings:{ mobileCompact:true }, stats:{} };
      const p = profile && typeof profile === 'object' ? profile : {};
      const migratedName = cleanName(p.name || p.display_name || p.nickname || p.displayName || '');
      return Object.assign({}, base, p, {
        player_id: safeStr(p.player_id || p.profileId || p.id || p.userId || base.player_id),
        name: migratedName,
        display_name: migratedName,
        settings: Object.assign({}, base.settings, {
          learningLanguage: 'de',
          helpLanguage: 'tr'
        }, p.settings || {}, {
          learningLanguage: String((p.settings && p.settings.learningLanguage) || p.learningLanguage || 'de').toLowerCase() === 'tr' ? 'tr' : 'de',
          helpLanguage: String((p.settings && p.settings.helpLanguage) || p.helpLanguage || 'tr').toLowerCase() === 'de' ? 'de' : 'tr'
        }),
        learningLanguage: String((p.settings && p.settings.learningLanguage) || p.learningLanguage || 'de').toLowerCase() === 'tr' ? 'tr' : 'de',
        helpLanguage: String((p.settings && p.settings.helpLanguage) || p.helpLanguage || 'tr').toLowerCase() === 'de' ? 'de' : 'tr',
        stats: Object.assign({}, base.stats, p.stats || {}),
        updatedAt: p.updatedAt || base.createdAt
      });
    }

    function readLocalProfile(){
      if(typeof deps.readLocalProfile === 'function') {
        try { return normalizeProfile(deps.readLocalProfile()); } catch(e){}
      }
      try{
        let raw = localStorage.getItem(profileKey);
        if(!raw){
          for(const key of legacyKeys){
            const legacy = localStorage.getItem(key);
            if(legacy){ raw = legacy; break; }
          }
        }
        const profile = normalizeProfile(raw ? JSON.parse(raw) : {});
        localStorage.setItem(profileKey, JSON.stringify(profile));
        return profile;
      } catch(e){
        const fallback = normalizeProfile({});
        try { localStorage.setItem(profileKey, JSON.stringify(fallback)); } catch(_e){}
        return fallback;
      }
    }

    function writeLocalProfile(profile){
      const base = readLocalProfile();
      const normalized = normalizeProfile(Object.assign({}, base, profile || {}, { updatedAt: nowIso() }));
      if(typeof deps.writeLocalProfile === 'function') {
        try { return !!deps.writeLocalProfile(normalized); } catch(e){}
      }
      return localSet(profileKey, normalized);
    }

    function currentSession(){
      try { if(shell() && typeof shell().currentSession === 'function') { const s = shell().currentSession(); if(s) return s; } } catch(e){}
      try { if(auth() && auth().session) return auth().session; } catch(e){}
      return localGet(sessionKey, null);
    }

    function gateStatus(){
      try { if(auth() && typeof auth().gateStatus === 'function') return auth().gateStatus() || { open:false, reason:'unknown' }; } catch(e){}
      const s = currentSession();
      if(!s) return { open:false, reason:'no-session' };
      const role = safeStr(s.role).toLowerCase();
      if(role === 'admin' || role === 'teacher' || role === 'dozent') return { open:true, reason:'privileged' };
      if(role === 'participant' && s.code) return { open:true, reason:'valid-code' };
      if(role === 'demo') {
        const demo = s.demo || {};
        const used = Number(demo.simulationsUsed || demo.count || 0);
        const max = Number(demo.max || 2);
        return used < max ? { open:true, reason:'demo', demoLeft:max-used } : { open:false, reason:'demo-exhausted', demoLeft:0 };
      }
      return { open:false, reason:'no-access' };
    }

    function identity(){
      let fromShell = null;
      try { if(shell() && typeof shell().highscoreIdentity === 'function') fromShell = shell().highscoreIdentity() || null; } catch(e){}
      const session = currentSession() || {};
      const profile = readLocalProfile();
      const playerName = cleanName((fromShell && (fromShell.playerName || fromShell.nickname)) || session.nickname || session.displayName || profile.name || profile.display_name || 'Gast') || 'Gast';
      const userId = safeStr((fromShell && fromShell.userId) || session.userId || session.learnerId || session.code || session.firebaseUid || profile.userId || profile.player_id || 'GUEST');
      return Object.assign({
        userId,
        learnerId: userId,
        playerId: safeStr((fromShell && (fromShell.profileId || fromShell.player_id)) || session.profileId || profile.player_id || userId),
        profileId: safeStr((fromShell && fromShell.profileId) || session.profileId || profile.profileId || ''),
        playerName,
        nickname: playerName,
        role: safeStr((fromShell && fromShell.role) || session.role || 'guest'),
        roleLabel: roleLabel((fromShell && fromShell.role) || session.role),
        groupId: safeStr((fromShell && fromShell.groupId) || session.groupId || profile.groupId || ''),
        email: safeStr(session.email || ''),
        source: (fromShell && fromShell.source) || session.source || 'local-profile',
        profile,
        session
      }, fromShell || {});
    }

    function activeLearnerId(){
      try {
        const a = admin();
        const snap = a && typeof a.state === 'function' ? a.state() : (a && a.state ? a.state : null);
        if(snap && snap.learner && (snap.learner.userId || snap.learner.code)) return safeStr(snap.learner.userId || snap.learner.code);
      } catch(e){}
      const id = identity();
      return id.userId || localString('egt_active_learner', 'GUEST') || 'GUEST';
    }

    function activeLearnerNeedsPasswordChange(){
      try {
        const a = admin();
        const snap = a && typeof a.state === 'function' ? a.state() : (a && a.state ? a.state : null);
        if(snap && snap.profile && snap.profile.mustChangePassword) return true;
      } catch(e){}
      const s = currentSession() || {};
      return !!(s.mustChangePassword || s.forcePasswordChange || (s.profile && s.profile.mustChangePassword));
    }

    function refresh(){
      try { if(shell() && typeof shell().refresh === 'function') shell().refresh(); } catch(e){}
      emit('egt:profile-auth-domain-refresh', { version:VERSION, identity:identity() });
      return state();
    }

    function handleAction(action, el){
      try { if(shell() && typeof shell().handleAction === 'function') return !!shell().handleAction(action, el || null); } catch(e){ return false; }
      return false;
    }

    function guardAction(action, el){
      try { if(shell() && typeof shell().guardAction === 'function') return !!shell().guardAction(action, el || null); } catch(e){}
      return gateStatus().open;
    }

    function canStartMode(mode){
      try { if(shell() && typeof shell().canStartMode === 'function') return !!shell().canStartMode(mode); } catch(e){}
      return gateStatus().open || ['settings','profile','feedback'].indexOf(safeStr(mode)) >= 0;
    }

    function canAccess(feature){
      try { if(shell() && typeof shell().canAccess === 'function') return !!shell().canAccess(feature); } catch(e){}
      const g = gateStatus();
      return g.open || ['auth','profile','login','settings','feedback','dashboard'].indexOf(safeStr(feature)) >= 0;
    }

    function callAuthEngine(method, args){
      const e = auth();
      if(e && typeof e[method] === 'function') return e[method].apply(e, args || []);
      return Promise.resolve({ ok:false, reason:'auth-engine-missing', message:'Auth-Engine nicht geladen.' });
    }

    function startDemo(){
      try { if(shell() && typeof shell().startDemo === 'function') return shell().startDemo(); } catch(e){}
      return callAuthEngine('startDemo', []);
    }
    function login(email, password){ return callAuthEngine('login', [email, password]); }
    function register(email, password, nickname, code){ return callAuthEngine('register', [email, password, nickname, code]); }
    function redeemCode(code, nickname, password){ return callAuthEngine('redeemCode', [code, nickname, password]); }
    function logout(){
      try { if(shell() && typeof shell().logout === 'function') return shell().logout(); } catch(e){}
      return callAuthEngine('logout', []);
    }
    function refreshProfile(){ return callAuthEngine('refreshProfile', []); }

    function recordDemoSimulation(payload){
      try { if(shell() && typeof shell().recordDemoSimulation === 'function') return shell().recordDemoSimulation(payload || {}); } catch(e){}
      try { if(auth() && typeof auth().recordSimulationUsed === 'function') return auth().recordSimulationUsed(payload || {}); } catch(e){}
      return false;
    }

    function openProfile(){ try { if(shell() && shell().openProfile) return shell().openProfile(); } catch(e){} return false; }
    function openProfileEdit(){ try { if(shell() && shell().openProfileEdit) return shell().openProfileEdit(); } catch(e){} return false; }
    function openLogin(){ try { if(shell() && shell().openLogin) return shell().openLogin(); } catch(e){} return false; }
    function openAuthGate(){ try { if(shell() && shell().openAuthGate) return shell().openAuthGate(); } catch(e){} return false; }
    function openAvatarPicker(){ try { if(shell() && shell().openAvatarPicker) return shell().openAvatarPicker(); } catch(e){} return false; }

    function saveProfileName(sourceEl){
      const active = sourceEl && sourceEl.value !== undefined ? sourceEl : document.activeElement;
      const profileInput = $('profileEditNameInput');
      const setupInput = $('profileNameInput');
      const candidates = [active, profileInput, setupInput].filter(Boolean);
      const input = candidates.find(el => el && el.value !== undefined && cleanName(el.value)) || profileInput || setupInput;
      const name = cleanName(input && input.value);
      if(!name){
        try { if(input){ input.focus(); input.classList.add('input-error'); setTimeout(()=>input.classList.remove('input-error'),900); } } catch(e){}
        return { ok:false, reason:'missing-name', message:'Bitte Namen eingeben' };
      }
      const profile = readLocalProfile();
      const ok = writeLocalProfile(Object.assign({}, profile, { name, display_name:name, nickname:name }));
      if(ok){
        emit('egt:profile-auth-domain-updated', { name, profile:readLocalProfile(), version:VERSION });
        try { if($('profileNameInput')) $('profileNameInput').value = name; } catch(e){}
        try { if($('profileEditNameInput')) $('profileEditNameInput').value = name; } catch(e){}
      }
      return { ok, name, profile:readLocalProfile() };
    }

    function state(){
      const session = currentSession();
      const id = identity();
      const g = gateStatus();
      return {
        version: VERSION,
        provider: 'ProfileAuthDomainEngine',
        session,
        identity: id,
        gate: g,
        gateOpen: !!g.open,
        activeLearnerId: activeLearnerId(),
        mustChangePassword: activeLearnerNeedsPasswordChange(),
        localProfile: readLocalProfile(),
        authReady: !!(auth() && auth().ready),
        shellReady: !!shell(),
        userDatabaseReady: !!userDb()
      };
    }


    function languageSettings(){
      const profile = readLocalProfile();
      let fromStore = null;
      try { if(window.LanguageAcademyLanguageStore && typeof window.LanguageAcademyLanguageStore.get === 'function') fromStore = window.LanguageAcademyLanguageStore.get(); } catch(e){}
      return Object.assign({ learningLanguage:'de', helpLanguage:'tr' }, profile.settings || {}, {
        learningLanguage: profile.learningLanguage || (profile.settings && profile.settings.learningLanguage) || (fromStore && fromStore.learningLanguage) || 'de',
        helpLanguage: profile.helpLanguage || (profile.settings && profile.settings.helpLanguage) || (fromStore && fromStore.helpLanguage) || 'tr'
      });
    }

    function updateLanguageSettings(next){
      next = next || {};
      const current = languageSettings();
      const learningLanguage = String(next.learningLanguage || current.learningLanguage || 'de').toLowerCase() === 'tr' ? 'tr' : 'de';
      const helpLanguage = String(next.helpLanguage || current.helpLanguage || 'tr').toLowerCase() === 'de' ? 'de' : 'tr';
      const profile = readLocalProfile();
      const saved = writeLocalProfile(Object.assign({}, profile, {
        learningLanguage,
        helpLanguage,
        settings: Object.assign({}, profile.settings || {}, { learningLanguage, helpLanguage })
      }));
      try { if(window.LanguageAcademyLanguageStore && typeof window.LanguageAcademyLanguageStore.set === 'function') window.LanguageAcademyLanguageStore.set({ learningLanguage, helpLanguage }); } catch(e){}
      emit('egt:profile-language-settings-updated', { learningLanguage, helpLanguage, version:VERSION });
      return saved ? languageSettings() : current;
    }

    function syncStatus(){
      let shellStatus = null;
      try { if(shell() && typeof shell().syncStatusSnapshot === 'function') shellStatus = shell().syncStatusSnapshot(); } catch(e){}
      return Object.assign({ version:VERSION, gate:gateStatus(), identity:identity() }, shellStatus || {});
    }

    function diagnostics(){
      const missing = [];
      if(!shell()) missing.push('EGTAuthProfileShell');
      if(!auth()) missing.push('EGTAuthEngine');
      return {
        ok: true,
        version: VERSION,
        missing,
        profileKey,
        sessionKey,
        gate: gateStatus(),
        identity: identity(),
        hasAdminPortal: !!admin(),
        hasUserDatabase: !!userDb()
      };
    }

    return Object.freeze({
      __version: VERSION,
      version: VERSION,
      normalizeProfile,
      readLocalProfile,
      writeLocalProfile,
      saveProfileName,
      currentSession,
      highscoreIdentity: identity,
      identity,
      activeLearnerId,
      activeLearnerNeedsPasswordChange,
      gateStatus,
      get gateOpen(){ return !!gateStatus().open; },
      canAccess,
      canStartMode,
      guardAction,
      handleAction,
      refresh,
      startDemo,
      login,
      register,
      redeemCode,
      logout,
      refreshProfile,
      recordDemoSimulation,
      openProfile,
      openProfileEdit,
      openLogin,
      openAuthGate,
      openAvatarPicker,
      languageSettings,
      updateLanguageSettings,
      syncStatus,
      state,
      diagnostics
    });
  }

  window.EGTProfileAuthDomainEngine = Object.freeze({ version:VERSION, create });
})();
