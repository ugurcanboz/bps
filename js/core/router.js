/* Eignungstest-Trainer V7.5.0 · Hash Router Adapter
   Gibt neuen Modulen einen stabilen Router, ohne die alte App-Navigation zu zerstören. */
(function(){
  "use strict";
  if(window.AppRouter && window.AppRouter.__version === "7.5.0") return;
  const routes = new Map();
  function normalize(route){
    const value = String(route || "start").replace(/^#/, "").trim();
    return value || "start";
  }
  function register(route, handler){
    const key = normalize(route);
    if(typeof handler === "function") routes.set(key, handler);
    return key;
  }
  function go(route, payload){
    const key = normalize(route);
    if(location.hash !== "#" + key) history.replaceState(null, "", "#" + key);
    if(window.AppState) window.AppState.set({activeSection:key, lastRoute:"#" + key});
    if(window.AppEvents) window.AppEvents.emit("route:change", {route:key, payload:payload || null});
    const handler = routes.get(key);
    if(handler){ try { handler(payload || null); } catch(error){ console.warn("[AppRouter] route handler error", key, error); } }
    return key;
  }
  function current(){ return normalize(location.hash || "start"); }
  window.addEventListener("hashchange", () => go(current()), {passive:true});
  window.AppRouter = Object.freeze({__version:"7.5.0", register, go, current});
})();
