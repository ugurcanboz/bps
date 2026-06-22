/* Eignungstest-Trainer · G54.43.8D · iPhone Scroll Guardian
   Stabilisiert Analyse/Fortschritt-Deep-Sheets und entkoppelt QA-Bubbles von der App-Navigation. */
(function(){
  'use strict';
  var VERSION = 'G54.43.8F';
  var raf = 0;

  function isTouch(){
    try { return (navigator.maxTouchPoints || 0) > 0 || window.matchMedia('(hover:none), (pointer:coarse)').matches; }
    catch(e){ return ('ontouchstart' in window); }
  }

  function setViewportVar(){
    try { document.documentElement.style.setProperty('--egt-visual-vh', (window.innerHeight || document.documentElement.clientHeight || 800) + 'px'); } catch(e){}
  }

  function isVisible(el){
    if(!el) return false;
    if(el.classList && (el.classList.contains('show') || el.classList.contains('is-visible'))) return true;
    try {
      var cs = getComputedStyle(el);
      var r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    } catch(e){ return false; }
  }

  function visibleDeepSheets(){
    try { return Array.prototype.slice.call(document.querySelectorAll('.ui-deep-sheet')).filter(isVisible); }
    catch(e){ return []; }
  }

  function repairSheet(sheet){
    if(!sheet) return;
    try {
      sheet.setAttribute('data-scroll-hotfix', VERSION);
      var body = sheet.querySelector('.ui-deep-body,[data-sheet-scroll]');
      if(body){
        body.setAttribute('data-scroll-hotfix-body', VERSION);
        body.style.webkitOverflowScrolling = 'touch';
        body.style.overflowY = 'auto';
        body.style.overflowX = 'hidden';
        body.style.touchAction = 'pan-y';
        body.style.minHeight = '0';
      }
    } catch(e){}
  }

  function normalize(){
    raf = 0;
    setViewportVar();
    var sheets = visibleDeepSheets();
    var active = sheets.length > 0;
    try {
      document.documentElement.classList.toggle('egt-deep-sheet-active', active);
      document.body.classList.toggle('egt-deep-sheet-active', active);
      document.body.classList.toggle('egt-ios-scroll-guard', isTouch());
    } catch(e){}
    sheets.forEach(repairSheet);

    try {
      var legacy = document.getElementById('analysis');
      if(legacy && !legacy.classList.contains('hidden')){
        document.documentElement.classList.remove('egt-layer-open','ui-overlay-open');
        document.body.classList.remove('egt-layer-open','ui-overlay-open','egt-ui-layer-active');
        document.documentElement.classList.remove('egt-deep-sheet-active');
        document.body.classList.remove('egt-deep-sheet-active');
      }
    } catch(e){}
  }

  function schedule(){
    if(raf) return;
    raf = requestAnimationFrame(normalize);
  }

  function installTouchContainment(){
    if(!isTouch()) return;
    document.addEventListener('touchstart', function(ev){
      var target = ev.target && ev.target.closest ? ev.target.closest('.ui-deep-body,[data-sheet-scroll],.egt-vsc__body,.egt-vsc__actions') : null;
      if(target) target.setAttribute('data-last-touch-scroll', String(Date.now()));
    }, { passive:true, capture:true });

    document.addEventListener('touchmove', function(ev){
      var scrollable = ev.target && ev.target.closest ? ev.target.closest('.ui-deep-body,[data-sheet-scroll],.egt-vsc__body,.egt-vsc__actions') : null;
      if(scrollable){
        try { ev.stopPropagation(); } catch(e){}
      }
    }, { passive:true, capture:true });
  }

  function init(){
    setViewportVar();
    normalize();
    installTouchContainment();
    try {
      new MutationObserver(schedule).observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['class','style','data-ui-deep-sheet'] });
    } catch(e){}
    window.addEventListener('resize', schedule, { passive:true });
    window.addEventListener('orientationchange', function(){ setTimeout(schedule, 80); setTimeout(schedule, 360); }, { passive:true });
    document.addEventListener('click', function(){ setTimeout(schedule, 40); }, true);
  }

  window.EGTIPhoneScrollHotfix = { version: VERSION, normalize: normalize, repairSheet: repairSheet };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
})();
