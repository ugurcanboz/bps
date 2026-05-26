/* BPS-Trainer V9.0.1 · Service Worker
   Sauberer Cache-First mit Version-Busting.
   Cache wird bei neuem Build automatisch ersetzt. */
var CACHE_NAME = 'bps-trainer-v9-0-1';
var ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './css/mobile.css',
  './css/ui-lock.css',
  './css/clean-deepsheet.css',
  './css/wordhub-layer.css',
  './css/cross-platform-fix.css',
  './js/app.js',
  './js/wordhub-layer.js',
  './js/highscore-live-renderer.js',
  './data/question-bank.js',
  './data/cloud-config.js',
  './manifest.json'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS).catch(function (e) {
        console.warn('[SW V9] Cache addAll partial fail:', e);
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // Network-first for cloud-config and update-check
  if (url.pathname.includes('cloud-config') || url.pathname.includes('update-check')) {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});
