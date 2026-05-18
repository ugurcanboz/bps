// V7.1.3 Temporary Cache Kill Worker
// Zweck: alte PWA-/Desktop-Caches zuverlässig entfernen. Dieser Worker cached NICHTS.
// Später deaktivieren/ersetzen, wenn PWA Offline-Cache final wieder aktiviert wird.
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
      for(const c of clients){ c.postMessage({type:"CACHE_KILL_SWITCH_ACTIVE", version:"7.1.3"}); }
    }catch(e){}
  })());
});
self.addEventListener("fetch", event => { /* absichtlich kein Cache */ });
