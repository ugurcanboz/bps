"use strict";
const CACHE_NAME = "eignungstest-trainer-v621-mobile-shell-cache";
const SW_VERSION = "6.2.1";
const CACHE_PREFIX = "eignungstest-trainer-";
const CORE_ASSETS = [
  "./",
  "./index.html?v=6.2.1",
  "./css/app.css?v=6.2.1",
  "./css/mobile.css?v=6.2.1",
  "./js/app.js?v=6.2.1",
  "./data/question-bank.js?v=6.2.1",
  "./data/cloud-config.js?v=6.2.1",
  "./manifest.json?v=6.2.1",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }

  const versionCritical = /\/(index\.html|service-worker\.js|js\/app\.js|css\/app\.css|data\/cloud-config\.js|data\/question-bank\.js|manifest\.json)$/i.test(url.pathname);

  if (versionCritical) {
    event.respondWith((async () => {
      try {
        const response = await fetch(req, {cache:"no-store"});
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, response.clone());
        }
        return response;
      } catch (error) {
        return caches.match(req) || caches.match("./index.html?v=6.2.1") || caches.match("./index.html");
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, response.clone());
      }
      return response;
    } catch (error) {
      return caches.match("./index.html?v=6.2.1") || caches.match("./index.html");
    }
  })());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "GET_VERSION") event.source && event.source.postMessage({type:"SW_VERSION", version:SW_VERSION, cache:CACHE_NAME});
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX)).map(key => caches.delete(key)))));
  }
});
