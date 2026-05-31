/* Eignungstest-Trainer.0.2 · Core Event Bus
   Minimal-invasiv: erweitert V9.0.2, ersetzt keine bestehende App-Logik. */
(function(){
  "use strict";
  if(window.AppEvents && window.AppEvents.__version === "9.0.2") return;
  const listeners = new Map();
  function on(name, handler){
    if(typeof name !== "string" || typeof handler !== "function") return () => {};
    if(!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(handler);
    return () => off(name, handler);
  }
  function once(name, handler){
    const stop = on(name, function(payload){ stop(); handler(payload); });
    return stop;
  }
  function off(name, handler){
    const bucket = listeners.get(name);
    if(bucket) bucket.delete(handler);
  }
  function emit(name, payload){
    const bucket = listeners.get(name);
    if(!bucket) return [];
    const results = [];
    [...bucket].forEach(fn => {
      try { results.push(fn(payload)); }
      catch(error){ console.warn("[AppEvents] Listener error", name, error); }
    });
    return results;
  }
  function clear(name){
    if(name) listeners.delete(name); else listeners.clear();
  }
  window.AppEvents = Object.freeze({__version:"9.0.2", on, once, off, emit, clear});
})();
