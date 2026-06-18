/* Modul-Template
   Kopieren nach modules/<feature>/<feature>.js und erst danach in index.html einbinden. */
(function(){
  "use strict";
  if(!window.TrainerModules) return;
  window.TrainerModules.register("example-module", {
    version:"0.1.0",
    description:"Beispielmodul ohne Core/UI-Eingriff.",
    enabled:false,
    async init(context){
      // context.App enthält die Haupt-App, falls benötigt.
      // UI-Regel: eigene Klassen im Modul verwenden, keine Core-Klassen überschreiben.
    }
  });
})();
