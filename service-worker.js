// V8.3.6 GitHub Pages Safe Cache Kill Worker
// Diagnose-Worker: cached nichts, löscht alte Caches und meldet sich danach ab.
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
      for(const c of clients){ c.postMessage({type:"CACHE_KILL_SWITCH_ACTIVE", version:"8.3.6"}); }
    }catch(e){}
  })());
});
self.addEventListener("fetch", event => { /* absichtlich kein Cache in V8.3.6 */ });
