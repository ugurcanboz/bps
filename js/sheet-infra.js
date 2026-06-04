/* Eignungstest-Trainer · G22.3 Neutral Sheet Infrastructure
   Creates only toast and shared bottom-sheet elements. It never renders or hides the homepage. */
(function(){
  'use strict';
  if(window.BPSSheetLayer && window.BPSSheetLayer.__neutralInfra === true) return;
  function $(id){ return document.getElementById(id); }
  function ensure(){
    if(!$('bpsNotice')){ var n=document.createElement('div'); n.id='bpsNotice'; n.setAttribute('role','status'); n.setAttribute('aria-live','polite'); document.body.appendChild(n); }
    if(!$('bpsSheetBackdrop')){ var bd=document.createElement('div'); bd.id='bpsSheetBackdrop'; document.body.appendChild(bd); }
    if(!$('bpsSheet')){ var sh=document.createElement('div'); sh.id='bpsSheet'; sh.setAttribute('role','dialog'); sh.setAttribute('aria-modal','true'); document.body.appendChild(sh); }
  }
  function notice(text){ ensure(); var n=$('bpsNotice'); if(!n) return; n.textContent=String(text || ''); n.classList.add('show'); clearTimeout(notice._t); notice._t=setTimeout(function(){ n.classList.remove('show'); }, 2200); }
  function closeSheet(){ var bd=$('bpsSheetBackdrop'), sh=$('bpsSheet'); if(bd) bd.classList.remove('show'); if(sh) sh.classList.remove('show'); document.body.classList.remove('bps-sheet-open'); }
  function openSheet(content){ ensure(); var bd=$('bpsSheetBackdrop'), sh=$('bpsSheet'); if(!bd || !sh) return; if(typeof content === 'string') sh.innerHTML=content; else if(content && content.nodeType){ sh.innerHTML=''; sh.appendChild(content); } bd.classList.add('show'); sh.offsetHeight; sh.classList.add('show'); document.body.classList.add('bps-sheet-open'); bd.onclick=function(e){ if(e.target===bd) closeSheet(); }; }
  function openBranchSelection(){ notice('Fachrichtungs-Auswahl läuft über das Trainingsmenü.'); }
  function boot(){ ensure(); document.body.classList.add('bps-premium-ui-authoritative'); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.BPSSheetLayer = { __neutralInfra:true, version:'G22.5-sheet-infra', notice:notice, openSheet:openSheet, closeSheet:closeSheet, refresh:function(){}, switchTab:function(){}, openBranchSelection:openBranchSelection, modules:[] };
})();
