/* V8.3.5 safe production diagnostics shim */
(function(){
  window.ProductionDiagnostics = window.ProductionDiagnostics || {
    version: "8.3.5",
    safeOrigin: function(){ return location.protocol === "http:" || location.protocol === "https:"; },
    run: async function(){ return { ok:true, skipped: location.protocol === "file:", protocol: location.protocol }; }
  };
})();
