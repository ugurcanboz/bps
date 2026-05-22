/* Eignungstest-Trainer V8.3.9 · Feature Gates
   Große Features werden bewusst freigeschaltet, statt unkontrolliert Core/UI zu verändern. */
(function(){
  "use strict";
  if(window.FeatureGates && window.FeatureGates.__version === "8.3.9") return;
  const defaults = (window.AppConfig && window.AppConfig.featureDefaults) || {};
  const gates = Object.assign({}, defaults);
  function isEnabled(name){ return !!gates[name]; }
  function set(name, value){
    if(!name) return false;
    gates[String(name)] = !!value;
    if(window.AppEvents) window.AppEvents.emit("feature:gate", {name:String(name), enabled:!!value});
    return true;
  }
  function merge(values){ Object.keys(values || {}).forEach(k => set(k, values[k])); return list(); }
  function list(){ return Object.keys(gates).sort().map(name => ({name, enabled:!!gates[name]})); }
  window.FeatureGates = Object.freeze({__version:"8.3.9", isEnabled, set, merge, list});
})();
