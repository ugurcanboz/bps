/* Eignungstest-Trainer V7.5.9 · Component Registry
   Zentrale UI-Bausteine für künftige Features. Bestehende HTML-Struktur bleibt geschützt. */
(function(){
  "use strict";
  if(window.AppComponents && window.AppComponents.__version === "7.5.9") return;
  const registry = new Map();
  const esc = value => String(value == null ? "" : value).replace(/[&<>\"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  function register(name, factory){
    if(typeof name !== "string" || typeof factory !== "function") return false;
    registry.set(name, factory); return true;
  }
  function render(name, props){
    const factory = registry.get(name);
    if(!factory) return "";
    try { return factory(props || {}, {esc}); }
    catch(error){ console.warn("[AppComponents] render error", name, error); return ""; }
  }
  function names(){ return [...registry.keys()].sort(); }
  register("card", (props, h) => `<div class="premium-card ${h.esc(props.className||"")}">${props.title ? `<h3>${h.esc(props.title)}</h3>` : ""}${props.body || ""}</div>`);
  register("section", (props, h) => `<section class="app-section ${h.esc(props.className||"")}">${props.title ? `<h2>${h.esc(props.title)}</h2>` : ""}${props.body || ""}</section>`);
  register("button", (props, h) => `<button class="${h.esc(props.variant||"primary")}" ${props.action ? `data-action="${h.esc(props.action)}"` : ""}>${h.esc(props.label||"OK")}</button>`);
  register("modal", (props, h) => `<div class="modal-backdrop"><div class="modal-card"><h3>${h.esc(props.title||"")}</h3><p>${h.esc(props.text||"")}</p>${props.actions||""}</div></div>`);
  window.AppComponents = Object.freeze({__version:"7.5.9", register, render, names});
})();
