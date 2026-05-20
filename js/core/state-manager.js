/* Eignungstest-Trainer V8.0.7 · Core State Manager
   Zentraler, kleiner App-Zustand für neue Features. Bestehende V8.0.7 Runtime bleibt unangetastet. */
(function(){
  "use strict";
  if(window.AppState && window.AppState.__version === "8.0.7") return;
  const KEY = "eignungstest_trainer_ui_state_v750";
  const defaults = Object.freeze({
    version:"8.0.7",
    activeSection:"start",
    activeTab:"training",
    profileName:"",
    updateModalOpen:false,
    mobileNavAttached:false,
    lastRoute:"#start",
    moduleStatus:{}
  });
  let state = Object.assign({}, defaults);
  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(raw) state = Object.assign({}, defaults, JSON.parse(raw), {version:"8.0.7"});
    }catch(error){ console.warn("[AppState] load fallback", error); state = Object.assign({}, defaults); }
    return get();
  }
  function persist(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(error){}
  }
  function get(path){
    if(!path) return clone(state);
    return String(path).split('.').reduce((acc,key)=>acc && Object.prototype.hasOwnProperty.call(acc,key) ? acc[key] : undefined, state);
  }
  function set(patch, options){
    if(!patch || typeof patch !== "object") return get();
    const before = get();
    state = Object.assign({}, state, patch, {version:"8.0.7"});
    if(!options || options.persist !== false) persist();
    if(window.AppEvents) window.AppEvents.emit("state:change", {before, after:get(), patch:clone(patch)});
    return get();
  }
  function reset(){ state = Object.assign({}, defaults); persist(); if(window.AppEvents) window.AppEvents.emit("state:reset", get()); return get(); }
  load();
  window.AppState = Object.freeze({__version:"8.0.7", get, set, reset, load});
})();
