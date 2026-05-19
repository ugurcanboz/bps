/* BPS-Trainer V7.5.0 · Schema Contracts
   Einheitliche Prüfverträge für Fragen, Module und Feature-Konfigurationen. */
(function(){
  "use strict";
  if(window.AppSchema && window.AppSchema.__version === "7.5.0") return;
  const allowedQuestionTypes = new Set(["single","multiple","text","number","sequence","matrix","visual","memory","route","edv","logic","math"]);
  const allowedDifficulties = new Set(["leicht","mittel","schwer","ctc","bosch","bps","adaptive"]);
  function isPlainObject(value){ return value && typeof value === "object" && !Array.isArray(value); }
  function issue(field, message, level){ return {field, message, level:level || "error"}; }
  function validateQuestion(q){
    const issues=[];
    if(!isPlainObject(q)) return {ok:false, issues:[issue("question","Frage muss ein Objekt sein")]};
    if(!q.id) issues.push(issue("id","stabile id fehlt"));
    if(!q.type) issues.push(issue("type","type fehlt"));
    else if(!allowedQuestionTypes.has(String(q.type))) issues.push(issue("type","unbekannter type: "+q.type,"warn"));
    if(!q.category) issues.push(issue("category","category fehlt","warn"));
    if(q.difficulty && !allowedDifficulties.has(String(q.difficulty))) issues.push(issue("difficulty","unbekannte Schwierigkeit: "+q.difficulty,"warn"));
    if(q.answer === undefined && q.correct === undefined) issues.push(issue("answer","answer/correct fehlt"));
    if(q.explanation === undefined) issues.push(issue("explanation","Erklärung fehlt","warn"));
    return {ok:issues.filter(i=>i.level==="error").length===0, issues};
  }
  function normalizeQuestion(q){
    const copy = Object.assign({type:"single", category:"allgemein", difficulty:"mittel", tags:[], explanation:""}, q || {});
    if(!Array.isArray(copy.tags)) copy.tags = [String(copy.tags)];
    if(!copy.id) copy.id = "q_" + Date.now() + "_" + Math.random().toString(36).slice(2,8);
    return copy;
  }
  function validateModule(definition){
    const issues=[];
    if(!isPlainObject(definition)) return {ok:false, issues:[issue("module","Modul muss ein Objekt sein")]};
    if(!definition.id && !definition.name) issues.push(issue("id","Modul braucht id/name"));
    const id = String(definition.id || definition.name || "");
    if(id && !/^[a-z0-9][a-z0-9_-]*$/i.test(id)) issues.push(issue("id","nur Buchstaben, Zahlen, - und _ erlaubt"));
    if(definition.init !== undefined && typeof definition.init !== "function") issues.push(issue("init","init muss eine Funktion sein","warn"));
    if(!definition.version) issues.push(issue("version","Modulversion fehlt","warn"));
    return {ok:issues.filter(i=>i.level==="error").length===0, issues};
  }
  window.AppSchema = Object.freeze({__version:"7.5.0", allowedQuestionTypes:[...allowedQuestionTypes], allowedDifficulties:[...allowedDifficulties], validateQuestion, normalizeQuestion, validateModule});
})();
