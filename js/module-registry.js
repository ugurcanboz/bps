/* Eignungstest-Trainer V9.0.2 · Module Registry
   Neue Features werden hier registriert, statt Core/UI direkt zu verändern. */
(function(){
  "use strict";
  const modules = new Map();
  const state = Object.seal({version:"9.0.2", lockedUi:true, started:false, initialized:[]});

  function assertName(name){
    if(!name || typeof name !== "string" || !/^[a-z0-9][a-z0-9_-]*$/i.test(name)){
      throw new Error("Module braucht einen stabilen Namen: letters, numbers, - oder _.");
    }
  }
  function register(name, definition){
    assertName(name);
    if(window.AppSchema){ const check = AppSchema.validateModule(Object.assign({id:name}, definition || {})); if(!check.ok) throw new Error("Modulvertrag verletzt: " + check.issues.map(i=>i.field+": "+i.message).join(", ")); }
    if(modules.has(name)) throw new Error("Module bereits registriert: " + name);
    const safeDefinition = Object.assign({name, enabled:true, version:"0.1.0", description:""}, definition || {});
    modules.set(name, Object.freeze(safeDefinition));
    return modules.get(name);
  }
  function get(name){ return modules.get(name) || null; }
  function list(){ return Array.from(modules.values()).map(m => ({name:m.name, enabled:m.enabled !== false, version:m.version || "", description:m.description || ""})); }
  async function initAll(context){
    state.started = true;
    const safeContext = Object.freeze(Object.assign({App:window.App || null, version:state.version}, context || {}));
    for(const mod of modules.values()){
      if(mod.enabled === false || typeof mod.init !== "function") continue;
      try{ await mod.init(safeContext); state.initialized.push(mod.name); }
      catch(error){ console.warn("Trainer module init failed:", mod.name, error); }
    }
    return list();
  }
  window.TrainerModules = Object.freeze({__version:"9.0.2", register, get, list, initAll, state});
})();
