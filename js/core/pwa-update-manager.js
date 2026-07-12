/* Novura · PWA Update Manager · G54.50.2D */
(function () {
  'use strict';
  var VERSION = (window.AppConfig && window.AppConfig.fullVersion) || 'G54.50.2D-2026-07-12';
  var registration = null;
  var refreshing = false;
  var updateAvailable = false;
  var listeners = [];

  function emit(type, detail) {
    var payload = Object.assign({ type: type, version: VERSION }, detail || {});
    listeners.forEach(function (fn) { try { fn(payload); } catch (e) {} });
    try { window.dispatchEvent(new CustomEvent('egt:pwa-update', { detail: payload })); } catch (e) {}
  }

  function validContext() {
    return 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  }

  async function register() {
    if (!validContext()) return null;
    registration = await navigator.serviceWorker.register('./service-worker.js', { scope: './', updateViaCache: 'none' });
    if (registration.waiting && navigator.serviceWorker.controller) markWaiting(registration.waiting);
    registration.addEventListener('updatefound', function () {
      var worker = registration.installing;
      if (!worker) return;
      emit('installing');
      worker.addEventListener('statechange', function () {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) markWaiting(worker);
        if (worker.state === 'redundant') emit('install-failed');
      });
    });
    setTimeout(function () { registration.update().catch(function () {}); }, 1500);
    return registration;
  }

  function markWaiting(worker) {
    updateAvailable = true;
    emit('available', { worker: worker });
  }

  async function activateUpdate() {
    if (!registration) await register();
    var worker = registration && registration.waiting;
    if (!worker) {
      await registration.update();
      worker = registration.waiting;
    }
    if (!worker) return false;
    worker.postMessage({ type: 'SKIP_WAITING' });
    return true;
  }

  async function clearAppCaches() {
    var count = 0;
    if ('caches' in window) {
      var keys = await caches.keys();
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf('egt-trainer-') === 0 && await caches.delete(keys[i])) count++;
      }
    }
    if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_APP_CACHES' });
    return { caches: count, workers: 0 };
  }

  navigator.serviceWorker && navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    refreshing = true;
    emit('activated');
    window.location.reload();
  });

  navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data.type === 'SW_ACTIVATED') emit('worker-activated', data);
    if (data.type === 'SW_VERSION') emit('worker-version', data);
  });

  window.EGTPWAUpdateManager = {
    version: VERSION,
    register: register,
    check: async function () { if (!registration) await register(); await registration.update(); return !!registration.waiting; },
    activate: activateUpdate,
    clearAppCaches: clearAppCaches,
    hasUpdate: function () { return updateAvailable || !!(registration && registration.waiting); },
    on: function (fn) { if (typeof fn === 'function') listeners.push(fn); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; }
  };

  if (validContext()) register().catch(function (error) { emit('registration-failed', { code: error && error.name || 'ERROR' }); });
})();
