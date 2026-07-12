/* ════════════════════════════════════════════════════════════════
   admin-portal-domain-engine.js — G52.8 / Phase 22
   Zweck: Admin-/Dozentenportal als fachliche Domain-Grenze kapseln.
   Das bestehende EGTAdminPortal bleibt die Implementierung, aber App,
   Router und Module sprechen bevorzugt diese stabile Facade an.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G54.4-phase29-admin-novuraExams-report';

  function portal() { return (typeof window !== 'undefined' && window.EGTAdminPortal) ? window.EGTAdminPortal : null; }
  function userDb() { return (typeof window !== 'undefined' && window.EGTUserDatabase) ? window.EGTUserDatabase : null; }

  function emit(name, detail) {
    var payload = detail || {};
    payload.version = payload.version || VERSION;
    try { document.dispatchEvent(new CustomEvent('egt:admin-domain:' + name, { detail: payload })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('admin-domain:' + name, payload); } catch (e2) {}
  }

  function safeCall(target, method, args, fallback) {
    try {
      if (target && typeof target[method] === 'function') return target[method].apply(target, args || []);
    } catch (e) {
      emit('error', { method: method, error: e && e.message ? e.message : String(e) });
      if (fallback instanceof Error) throw fallback;
      return fallback;
    }
    return fallback;
  }

  function safeAsync(target, method, args, fallback) {
    try {
      if (target && typeof target[method] === 'function') return Promise.resolve(target[method].apply(target, args || []));
    } catch (e) {
      emit('error', { method: method, error: e && e.message ? e.message : String(e) });
      return Promise.reject(e);
    }
    return Promise.resolve(fallback);
  }

  function clone(obj) { try { return JSON.parse(JSON.stringify(obj || {})); } catch (e) { return obj || {}; } }

  function normalizeRole(role) {
    role = String(role || '').trim().toLowerCase();
    if (role === 'teacher' || role === 'dozentin' || role === 'lehrer') return 'dozent';
    if (role === 'administrator') return 'admin';
    if (role === 'learner' || role === 'participant') return 'teilnehmer';
    return role || 'gast';
  }

  function stateSnapshot() {
    var p = portal();
    var s = safeCall(p, 'state', [], {}) || {};
    var role = currentRole();
    return Object.assign({
      provider: p ? 'EGTAdminPortal' : 'missing',
      domainVersion: VERSION,
      role: role,
      adminOpen: isAdminOpen(),
      dozentOpen: isDozentOpen(),
      ready: !!(s.ready || p),
      online: !!s.online,
      learner: s.learner || null,
      profile: s.profile || null,
      courseId: s.courseId || ''
    }, clone(s));
  }

  function diagnostics() {
    var p = portal();
    var db = userDb();
    var s = {};
    try { s = p && typeof p.state === 'function' ? p.state() : {}; } catch (e) {}
    var methods = ['open','close','state','loginWithCode','listLearners','createAccessCode','listAccessCodes','trackEvent','duellCreate','duellJoin','duellSubmit','duellFetch'];
    var missing = methods.filter(function (m) { return !(p && typeof p[m] === 'function'); });
    return {
      ok: !!p,
      version: VERSION,
      provider: p ? 'EGTAdminPortal' : 'missing',
      userDatabase: !!db,
      novuraExamsReportEngine: !!window.NovuraExamsAdminReportEngine,
      ready: !!(s && s.ready),
      online: !!(s && s.online),
      role: currentRole(),
      adminOpen: isAdminOpen(),
      dozentOpen: isDozentOpen(),
      courseId: s && s.courseId || '',
      missing: missing
    };
  }

  function init() { return safeAsync(portal(), 'init', [], safeCall(userDb(), 'init', [], null)); }
  function openPortal(reason) {
    var p = portal();
    try {
      if (p && typeof p.open === 'function') {
        var opened = p.open(reason);
        emit('open', { reason: reason || 'admin-domain-open', provider: 'EGTAdminPortal' });
        return opened !== false;
      }
    } catch (e) {
      emit('error', { method: 'open', error: e && e.message ? e.message : String(e) });
      return true;
    }
    emit('missing', { method: 'open', reason: reason || '' });
    return false;
  }
  function closePortal(reason) {
    var ok = safeCall(portal(), 'close', [], false);
    emit('close', { reason: reason || 'admin-domain-close', ok: ok !== false });
    return ok !== false;
  }
  function currentRole() { return normalizeRole(safeCall(portal(), 'currentRole', [], 'gast')); }
  function isAdminOpen() { return !!safeCall(portal(), 'isAdminOpen', [], false); }
  function isDozentOpen() { return !!safeCall(portal(), 'isDozentOpen', [], false); }
  function can(permission) { return !!safeCall(portal(), 'can', [permission], false); }
  function canViewLearner(role, learner) { return !!safeCall(portal(), 'canViewLearner', [role || currentRole(), learner], false); }
  function canViewGroup(role, groupId) { return !!safeCall(portal(), 'canViewGroup', [role || currentRole(), groupId], false); }
  function activeDozentProfile() { return safeCall(portal(), 'activeDozentProfile', [], null); }
  function setActiveDozentProfile(profile) { return safeCall(portal(), 'setActiveDozentProfile', [profile], null); }

  function loginWithCode(code, name, opts) { return safeAsync(portal(), 'loginWithCode', [code, name, opts], null); }
  function logout() {
    var p = portal(), db = userDb();
    if (p && typeof p.logout === 'function') return safeAsync(p, 'logout', [], null);
    return safeAsync(db, 'logout', [], null);
  }

  function listLearners() { return safeAsync(portal(), 'listLearners', Array.prototype.slice.call(arguments), []); }
  function createLearner(payload) { return safeAsync(portal(), 'createLearner', [payload], null); }
  function updateLearner(id, patch) { return safeAsync(portal(), 'updateLearner', [id, patch], null); }
  function deleteLearner(id) { return safeAsync(portal(), 'deleteLearner', [id], null); }
  function setLearnerStatus(id, status) { return safeAsync(portal(), 'setLearnerStatus', [id, status], null); }
  function renameLearner(id, name) { return safeAsync(portal(), 'renameLearner', [id, name], null); }
  function changeLearnerRole(id, role) { return safeAsync(portal(), 'changeLearnerRole', [id, role], null); }
  function blockLearner(id, reason) { return safeAsync(portal(), 'blockLearner', [id, reason], null); }
  function warnLearner(id, payload) { return safeAsync(portal(), 'warnLearner', [id, payload], null); }
  function resetPassword(id) { return safeAsync(portal(), 'resetPassword', [id], null); }
  function changePassword(oldPassword, newPassword) { return safeAsync(portal(), 'changePassword', [oldPassword, newPassword], null); }
  function listUserArchive() { return safeAsync(portal(), 'listUserArchive', Array.prototype.slice.call(arguments), []); }

  function createAccessCode(payload) { return safeAsync(portal(), 'createAccessCode', [payload], null); }
  function listAccessCodes(role) { return safeAsync(portal(), 'listAccessCodes', [role || currentRole()], []); }
  function revokeAccessCode(code) { return safeAsync(portal(), 'revokeAccessCode', [code], null); }
  function generateBulkCodes(opts) { return safeAsync(portal(), 'generateBulkCodes', [opts], []); }
  function extendCode(code, opts) { return safeAsync(portal(), 'extendCode', [code, opts], null); }
  function nextCode() { return safeCall(portal(), 'nextCode', Array.prototype.slice.call(arguments), ''); }
  function generatePassword() { return safeCall(portal(), 'generatePassword', Array.prototype.slice.call(arguments), ''); }

  function courseStats() { return safeAsync(portal(), 'courseStats', Array.prototype.slice.call(arguments), null); }
  function exportCourse() { return safeAsync(portal(), 'exportCourse', Array.prototype.slice.call(arguments), null); }
  function exportCourseCsv() { return safeAsync(portal(), 'exportCourseCsv', Array.prototype.slice.call(arguments), null); }
  function resetCourse() { return safeAsync(portal(), 'resetCourse', Array.prototype.slice.call(arguments), null); }
  function getCourseSettings() { return safeCall(portal(), 'getCourseSettings', [], {}); }
  function saveCourseSettings(settings) { return safeAsync(portal(), 'saveCourseSettings', [settings], null); }

  function listTickets() { return safeAsync(portal(), 'listTickets', Array.prototype.slice.call(arguments), []); }
  function saveTicket(ticket) { return safeAsync(portal(), '_saveTicket', [ticket], null); }
  function updateTicketStatus(id, status) { return safeAsync(portal(), 'updateTicketStatus', [id, status], null); }
  function updateTicketAdminFields(id, patch) { return safeAsync(portal(), 'updateTicketAdminFields', [id, patch], null); }
  function addTicketComment(id, comment) { return safeAsync(portal(), 'addTicketComment', [id, comment], null); }
  function ticketOpenCount() { return safeCall(portal(), 'ticketOpenCount', [], 0); }
  function updateTicketBadge() { return safeCall(portal(), 'updateTicketBadge', [], null); }

  function trackEvent(event) { return safeAsync(portal(), 'trackEvent', [event], null); }
  function enrichCoachPayload(payload) { return safeAsync(portal(), 'enrichCoachPayload', [payload], payload || {}); }
  function loadCoachContext() { return safeAsync(portal(), 'loadCoachContext', Array.prototype.slice.call(arguments), null); }
  function riskFromProfile(profile) { return safeCall(portal(), 'riskFromProfile', [profile], 'unbekannt'); }
  function coachDnaSnapshot(profile) { return safeCall(portal(), 'coachDnaSnapshot', [profile], null); }

  function novuraExamsReportFromHistory(history, quiz, opts) {
    var engine = window.NovuraExamsAdminReportEngine;
    if(!engine || typeof engine.buildReport !== 'function') return null;
    return engine.buildReport(Object.assign({ history: history || [], quiz: quiz || [] }, opts || {}, { mode:'novuraExams', branch:'it', simType:'novuraExams', pool:'it-novura-exams' }));
  }
  function novuraExamsReportFromResult(result) {
    var engine = window.NovuraExamsAdminReportEngine;
    if(!result) return null;
    if(result.novuraExamsReport) return result.novuraExamsReport;
    if(engine && typeof engine.buildReport === 'function') return engine.buildReport({ record: result, mode: result.mode });
    return null;
  }
  function renderNovuraExamsReportSummary(report) {
    var engine = window.NovuraExamsAdminReportEngine;
    if(engine && typeof engine.renderAdminSummary === 'function') return engine.renderAdminSummary(report);
    return '<div class="admin-domain-scope-card"><b>Novura Exams-Auswertung</b><br><span class="small">Novura Exams-Report-Engine nicht geladen.</span></div>';
  }
  function enrichNovuraExamsAdminEvent(payload) {
    var engine = window.NovuraExamsAdminReportEngine;
    if(engine && typeof engine.toAdminEvent === 'function') return engine.toAdminEvent(payload || {}, { mode: (payload && payload.mode) || 'novuraExams' });
    return payload || {};
  }


  function syncStatus() { return safeCall(portal(), 'syncStatus', [], { ready: false, provider: 'missing', pending: 0, online: false, domainVersion: VERSION }); }
  function flushPendingSync() { return safeAsync(portal(), 'flushPendingSync', [], null); }

  function duellCreate(payload) { return safeAsync(portal(), 'duellCreate', [payload], null); }
  function duellJoin(code, payload) { return safeAsync(portal(), 'duellJoin', [code, payload], null); }
  function duellSubmit(code, role, result) { return safeAsync(portal(), 'duellSubmit', [code, role, result], null); }
  function duellFetch(code) { return safeAsync(portal(), 'duellFetch', [code], null); }

  function renderScopeSummary() {
    var snap = stateSnapshot();
    var role = currentRole();
    var label = role === 'admin' ? 'Admin · Vollzugriff' : role === 'dozent' ? 'Dozent · Gruppenzugriff' : role === 'teilnehmer' ? 'Teilnehmer' : 'Nicht angemeldet';
    return '<div class="admin-domain-scope-card"><span class="coach-badge">Admin-Domain</span><div class="coach-action">' + label + '</div><div class="small">Provider: ' + (snap.provider || 'missing') + ' · Online: ' + (snap.online ? 'ja' : 'nein') + ' · Kurs: ' + (snap.courseId || '-') + '</div></div>';
  }

  function create() {
    var api = {
      __version: VERSION,
      __provider: 'admin-domain-facade',
      getPortal: portal,
      getUserDatabase: userDb,
      init: init,
      open: openPortal,
      openPortal: openPortal,
      close: closePortal,
      closePortal: closePortal,
      state: stateSnapshot,
      snapshot: stateSnapshot,
      diagnostics: diagnostics,
      currentRole: currentRole,
      isAdminOpen: isAdminOpen,
      isDozentOpen: isDozentOpen,
      can: can,
      canViewLearner: canViewLearner,
      canViewGroup: canViewGroup,
      activeDozentProfile: activeDozentProfile,
      setActiveDozentProfile: setActiveDozentProfile,
      loginWithCode: loginWithCode,
      logout: logout,
      listLearners: listLearners,
      createLearner: createLearner,
      updateLearner: updateLearner,
      deleteLearner: deleteLearner,
      setLearnerStatus: setLearnerStatus,
      renameLearner: renameLearner,
      changeLearnerRole: changeLearnerRole,
      blockLearner: blockLearner,
      warnLearner: warnLearner,
      resetPassword: resetPassword,
      changePassword: changePassword,
      listUserArchive: listUserArchive,
      createAccessCode: createAccessCode,
      listAccessCodes: listAccessCodes,
      revokeAccessCode: revokeAccessCode,
      generateBulkCodes: generateBulkCodes,
      extendCode: extendCode,
      nextCode: nextCode,
      generatePassword: generatePassword,
      courseStats: courseStats,
      exportCourse: exportCourse,
      exportCourseCsv: exportCourseCsv,
      resetCourse: resetCourse,
      getCourseSettings: getCourseSettings,
      saveCourseSettings: saveCourseSettings,
      listTickets: listTickets,
      saveTicket: saveTicket,
      _saveTicket: saveTicket,
      updateTicketStatus: updateTicketStatus,
      updateTicketAdminFields: updateTicketAdminFields,
      addTicketComment: addTicketComment,
      ticketOpenCount: ticketOpenCount,
      updateTicketBadge: updateTicketBadge,
      trackEvent: trackEvent,
      enrichCoachPayload: enrichCoachPayload,
      loadCoachContext: loadCoachContext,
      riskFromProfile: riskFromProfile,
      coachDnaSnapshot: coachDnaSnapshot,
      novuraExamsReportFromHistory: novuraExamsReportFromHistory,
      novuraExamsReportFromResult: novuraExamsReportFromResult,
      renderNovuraExamsReportSummary: renderNovuraExamsReportSummary,
      enrichNovuraExamsAdminEvent: enrichNovuraExamsAdminEvent,
      syncStatus: syncStatus,
      flushPendingSync: flushPendingSync,
      duellCreate: duellCreate,
      duellJoin: duellJoin,
      duellSubmit: duellSubmit,
      duellFetch: duellFetch,
      renderScopeSummary: renderScopeSummary
    };
    return Object.freeze(api);
  }

  var factory = Object.freeze({ __version: VERSION, create: create, diagnostics: diagnostics });
  window.EGTAdminPortalDomainEngine = factory;
  if (!window.AdminPortalDomainEngine) {
    try { window.AdminPortalDomainEngine = create(); } catch (e) { window.AdminPortalDomainEngine = { __version: VERSION, diagnostics: diagnostics, open: function(){ return false; } }; }
  }
})();
