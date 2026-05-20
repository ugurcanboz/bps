/* V8.0.5 safe production diagnostics shim */
(function(){
  window.ProductionDiagnostics = window.ProductionDiagnostics || {
    version: "8.0.5",
    safeOrigin: function(){ return location.protocol === "http:" || location.protocol === "https:"; },
    run: async function(){ return { ok:true, skipped: location.protocol === "file:", protocol: location.protocol }; }
  };
})();
