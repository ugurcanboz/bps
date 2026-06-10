/* Eignungstest-Trainer.0.2 · Module Loader
   Module docken künftig hier an, statt direkt Core/UI zu verändern. */
(function(){
  "use strict";
  if(window.AppModuleLoader && window.AppModuleLoader.__version === "internal") return;
  const modules = new Map();
  function register(definition){
    if(!definition || !definition.id) return false;
    if(window.AppSchema){ const check = AppSchema.validateModule(definition); if(!check.ok){ console.warn("[AppModuleLoader] module contract rejected", check.issues); return false; } }
    const id = String(definition.id);
    modules.set(id, Object.assign({enabled:true, version:"internal", init:null, destroy:null}, definition));
    if(window.AppState){
      const status = window.AppState.get("moduleStatus") || {};
      status[id] = {registered:true, enabled:definition.enabled !== false, version:definition.version || "internal"};
      window.AppState.set({moduleStatus:status});
    }
    if(window.AppEvents) window.AppEvents.emit("module:registered", {id, definition:modules.get(id)});
    return true;
  }
  function initAll(context){
    const ctx = Object.assign({App:window.App, state:window.AppState, events:window.AppEvents, router:window.AppRouter, components:window.AppComponents}, context || {});
    modules.forEach((mod,id)=>{
      if(mod.enabled === false || typeof mod.init !== "function" || mod.__initialized) return;
      try{ mod.init(ctx); mod.__initialized = true; if(window.AppEvents) window.AppEvents.emit("module:initialized", {id}); }
      catch(error){ console.warn("[AppModuleLoader] init error", id, error); if(window.AppEvents) window.AppEvents.emit("module:error", {id,error}); }
    });
  }
  function list(){ return [...modules.values()].map(m => ({id:m.id, version:m.version, enabled:m.enabled !== false, initialized:!!m.__initialized})); }
  window.AppModuleLoader = Object.freeze({__version:"internal", register, initAll, list});
})();
