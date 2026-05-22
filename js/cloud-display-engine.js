/* V8.4.0 Passive Cloud Display Engine
   Die aktive Anzeige sitzt direkt in app.js/CloudHighscoreEngine.refreshDashboard. */
(function(){
  'use strict';
  const VERSION='8.4.0';
  function refresh(){ try { return window.App && window.App.refreshCloudRanking ? window.App.refreshCloudRanking() : null; } catch(e){ console.error(e); } }
  window.CloudDisplayEngine = {version:VERSION, refresh, fetchBoards:null};
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(refresh, 900); setTimeout(refresh, 2200); });
})();
