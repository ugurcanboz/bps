/* Eignungstest-Trainer V7.5.9 · App Config
   Single Source of Truth für Version, Build, Pfade, Feature-Gates und Core-Verträge. */
(function(){
  "use strict";
  if(window.AppConfig && window.AppConfig.__version === "7.5.9") return;
  const VERSION = "7.5.9";
  const BUILD = "v7500";
  const BASE_PATH = "./";
  const selectors = Object.freeze({
    appRoot:"appRoot", start:"start", appNav:"appNav", healthPanel:"healthPanel",
    globalDiagnostics:"globalDiagnosticsPanel", globalDiagnosticsContent:"globalDiagnosticsContent"
  });
  const paths = Object.freeze({
    styles:["./css/app.css","./css/mobile.css","./css/ui-lock.css"],
    core:["./js/core/app-config.js","./js/core/event-bus.js","./js/core/state-manager.js","./js/core/router.js","./js/core/schema.js","./js/core/feature-gates.js"],
    components:["./js/components/component-registry.js"],
    modules:["./js/module-registry.js","./js/modules/module-loader.js"],
    data:["./data/cloud-config.js","./data/question-bank.js"],
    manifest:"./manifest.json", updateCheck:"./update-check.json", moduleManifest:"./module-manifest.json"
  });
  const featureDefaults = Object.freeze({
    diagnostics:true,
    architectureGuard:true,
    updatePrompt:true,
    cacheKillSwitch:true,
    cloudSync:false,
    ocrImport:false,
    aiCoach:false,
    adaptiveEngine:false,
    analytics:false
  });
  const contracts = Object.freeze({
    noCoreMutationFromModules:true,
    uiLockRequired:true,
    moduleManifestRequired:true,
    questionSchemaRequired:true,
    stateSingleSourcePreferred:true,
    githubPagesSafe:true
  });
  function withVersion(path){ return String(path || "").includes("?") ? path + "&v=" + VERSION : path + "?v=" + VERSION; }
  window.AppConfig = Object.freeze({__version:VERSION, version:VERSION, build:BUILD, basePath:BASE_PATH, selectors, paths, featureDefaults, contracts, withVersion});
})();
