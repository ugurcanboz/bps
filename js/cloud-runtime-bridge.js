/* V8.3.9 Cloud Runtime Bridge disabled: Cloud is handled at source in js/app.js. */
(function(){
  'use strict';
  window.CloudHighscoreBridge = {version:'8.3.9', source:'app.js-source-fix', testCloud:function(){try{return window.App&&window.App.addCloudTestScore&&window.App.addCloudTestScore();}catch(e){console.error(e);}}, refreshCloud:function(){try{return window.App&&window.App.refreshCloudRanking&&window.App.refreshCloudRanking();}catch(e){console.error(e);}}};
})();
