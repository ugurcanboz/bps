/* V8.4.1 Passive Cloud Display Engine
   Die aktive Anzeige sitzt direkt in app.js/CloudHighscoreEngine.refreshDashboard. */
(function(){
  'use strict';
  const VERSION='8.4.1';
  function refresh(){ try { const eng = window.App && window.App._test && window.App._test.CloudHighscoreEngine; return eng && eng.refreshDashboard ? eng.refreshDashboard() : null; } catch(e){ console.error(e); } }
  window.CloudDisplayEngine = {version:VERSION, refresh, fetchBoards:null};
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(refresh, 900); setTimeout(refresh, 2200); });
})();
