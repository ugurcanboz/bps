// V7.0.8 Desktop Final Restore Stable
// Service Worker intentionally disabled. This file only removes old registrations if loaded.
self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    try{ const keys=await caches.keys(); await Promise.all(keys.filter(k=>/trainer|eignungstest|ctc|pwa/i.test(k)).map(k=>caches.delete(k))); }catch(e){}
    try{ await self.registration.unregister(); }catch(e){}
    try{ const clients=await self.clients.matchAll({type:"window", includeUncontrolled:true}); for(const c of clients){ c.postMessage({type:"SW_DISABLED", version:"7.0.8"}); } }catch(e){}
  })());
});
self.addEventListener("fetch", () => {});
