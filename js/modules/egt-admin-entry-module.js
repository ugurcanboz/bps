/* ════════════════════════════════════════════════════════════════
   egt-admin-entry-module.js — Phase 3C Admin Entry Module
   Zweck: Admin/Login-Portal als eigene Entry-Grenze über AppModuleHost
   registrieren. Die vorhandene AdminPortal-Logik bleibt unverändert.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G54.47.15C-admin-entry-secure';

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent('egt:module:admin-entry:' + name, { detail: detail || {} })); } catch (e) {}
    try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('module:admin-entry:' + name, detail || {}); } catch (e2) {}
  }

  function closeUiLayers() {
    try { if (window.EGTUILayer && typeof EGTUILayer.closeSheet === 'function') EGTUILayer.closeSheet(); } catch (e) {}
    try {
      Array.prototype.slice.call(document.querySelectorAll('.ui-sheet.show,.ui-sheet.is-visible,.ui-sheet-backdrop.show,.ui-sheet-backdrop.is-visible')).forEach(function (el) {
        el.classList.remove('show', 'is-visible');
      });
      document.documentElement.classList.remove('ui-overlay-open');
      document.body.classList.remove('ui-overlay-open');
    } catch (e2) {}
  }

  async function openAdminPortal(reason) {
    try {
      if (!window.EGTAccessControl || typeof EGTAccessControl.require !== 'function') throw new Error('Zentrale Zugriffskontrolle fehlt.');
      await EGTAccessControl.require('adminArea', { forceRefresh: true, allowDevelopmentBypass: true });
    } catch (guardError) {
      emit('denied', { reason: reason || 'admin-entry', error: guardError && guardError.message ? guardError.message : 'Keine Adminberechtigung', version: VERSION });
      try { if (window.showToast) window.showToast('Adminzugriff verweigert. Bitte mit einem berechtigten Konto anmelden.'); } catch (e) {}
      return false;
    }
    closeUiLayers();
    /* G54.45.2: Layer-Lock des Routers synchron lösen, damit die
       Scrollposition der Seite nicht verloren geht (Sprung auf 0). */
    try { if (window.EGTUIRouter && typeof EGTUIRouter.close === 'function') EGTUIRouter.close(); } catch (e) {}
    try {
      if (window.AdminPortalDomainEngine && typeof AdminPortalDomainEngine.open === 'function') {
        AdminPortalDomainEngine.open(reason || 'admin-entry');
        emit('opened', { reason: reason || 'admin-entry', provider: 'AdminPortalDomainEngine', version: VERSION });
        return true;
      }
      if (window.EGTAdminPortal && typeof EGTAdminPortal.open === 'function') {
        EGTAdminPortal.open();
        emit('opened', { reason: reason || 'admin-entry', provider: 'EGTAdminPortal-fallback', version: VERSION });
        return true;
      }
    } catch (e) {
      emit('error', { reason: reason || 'admin-entry', error: e && e.message ? e.message : String(e), version: VERSION });
      return true;
    }
    try {
      if (window.App && typeof App.showFrameworkHealth === 'function') {
        App.showFrameworkHealth();
        emit('opened', { reason: reason || 'admin-entry', provider: 'framework-health-fallback', version: VERSION });
        return true;
      }
    } catch (e2) {}
    emit('missing', { reason: reason || 'admin-entry', error: 'EGTAdminPortal.open nicht verfügbar', version: VERSION });
    return false;
  }

  async function start(ctx) {
    var payload = (ctx && ctx.payload) || {};
    var reason = payload.action || payload.entry || payload.source || 'admin-entry-module-phase3c';
    emit('beforeStart', { reason: reason, branch: ctx && ctx.branch ? ctx.branch.id : null, version: VERSION });
    return await openAdminPortal(reason);
  }

  function stop(payload) {
    emit('stopped', { reason: payload && payload.reason ? payload.reason : 'switch', version: VERSION });
    return true;
  }

  var api = Object.freeze({ __version: VERSION, start: start, stop: stop, open: openAdminPortal });
  window.EGTAdminEntryModule = api;

  if (window.AppModuleHost && typeof AppModuleHost.register === 'function') {
    AppModuleHost.register({
      id: 'admin-entry',
      label: 'Admin Entry',
      version: VERSION,
      branchAware: false,
      start: start,
      stop: stop
    });
  } else {
    console.warn('[EGTAdminEntryModule] AppModuleHost fehlt; Registrierung übersprungen.');
  }
})();
