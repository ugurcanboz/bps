// V7.0.10 Temporary Cache Kill Worker
// Zweck: alte PWA-/Desktop-Caches zuverlässig entfernen. Später durch normalen Offline-Service-Worker ersetzen.
self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    try{
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }catch(e){}
    try{ await self.registration.unregister(); }catch(e){}
    try{
      const clients = await self.clients.matchAll({type:"window", includeUncontrolled:true});
      for(const c of clients){ c.postMessage({type:"CACHE_KILL_SWITCH_ACTIVE", version:"7.0.10"}); }
    }catch(e){}
  })());
});
self.addEventListener("fetch", event => { /* absichtlich kein Cache */ });
