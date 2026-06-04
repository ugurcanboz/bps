/* Eignungstest-Trainer · UI-F1.11 Trackpad Scroll Guard
   Fixes Chrome/Windows cases where the premium home shell visually scrolls with the scrollbar,
   but two-finger touchpad/wheel input is eaten by legacy fixed/overflow layers. */
(function(){
  'use strict';

  function isPremiumHome(){
    return document.body && document.body.classList.contains('ui-f-premium-home-ready');
  }

  function modalOrSheetOpen(){
    var body = document.body;
    if(!body) return false;
    if(body.classList.contains('bps-sheet-open') || body.classList.contains('training-sheet-open')) return true;
    if(document.querySelector('.egt-admin-modal.show')) return true;
    if(document.querySelector('.python-quest-backdrop.show')) return true;
    if(document.querySelector('.training-sheet.open, .training-sheet.show')) return true;
    if(document.querySelector('#whSheet.show, #whSheet.open, #whSheet.is-open')) return true;
    return false;
  }

  function isInteractive(el){
    if(!el || !el.closest) return false;
    return !!el.closest('input, textarea, select, option, [contenteditable="true"], .wh-tabbar, #whTabBar, .egt-admin-modal, .python-quest-backdrop, .training-sheet, .training-sheet-content, .clean-category-list, .training-mode-list, .wh-sheet, .wh-sheet-body');
  }

  function nativeScrollableAncestor(el){
    var node = el;
    while(node && node !== document.body && node !== document.documentElement){
      if(node.nodeType !== 1){ node = node.parentElement; continue; }
      var style = window.getComputedStyle(node);
      var oy = style.overflowY;
      var canY = (oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight + 2;
      if(canY) return node;
      node = node.parentElement;
    }
    return null;
  }

  function normalizeWheelDelta(ev){
    var dy = ev.deltaY || 0;
    if(ev.deltaMode === 1) dy *= 24;
    else if(ev.deltaMode === 2) dy *= Math.max(window.innerHeight || 800, 600);

    // Precision touchpads often send tiny deltas. Native scroll feels much faster;
    // this restores a natural speed only when the guard must proxy the wheel event.
    var a = Math.abs(dy);
    if(a > 0 && a < 8) dy *= 11;
    else if(a < 18) dy *= 7.5;
    else if(a < 44) dy *= 4.2;
    else if(a < 80) dy *= 2.4;
    return dy;
  }

  function scrollPageBy(deltaY){
    var scroller = document.scrollingElement || document.documentElement || document.body;
    if(!scroller) return;
    scroller.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
  }

  window.addEventListener('wheel', function(ev){
    if(!isPremiumHome()) return;
    if(modalOrSheetOpen()) return;
    if(ev.ctrlKey) return; // keep browser zoom gestures intact
    if(Math.abs(ev.deltaY) < Math.abs(ev.deltaX)) return; // horizontal gestures should stay horizontal
    if(isInteractive(ev.target)) return;
    if(nativeScrollableAncestor(ev.target)) return;

    if(ev.cancelable) ev.preventDefault();
    scrollPageBy(normalizeWheelDelta(ev));
  }, {capture:true, passive:false});

  // Hard safety: legacy classes may remain after sheet experiments and can kill wheel/touch scroll.
  function markDisplayMode(){
    if(!document.body) return;
    var standalone = false;
    try { standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches; } catch(e) {}
    if(window.navigator && window.navigator.standalone) standalone = true;
    document.body.classList.toggle('standalone-pwa-mode', !!standalone);
    document.body.classList.toggle('mobile-browser-mode', !standalone && window.matchMedia && window.matchMedia('(max-width: 780px)').matches);
  }

  function unlockPremiumScroll(){
    if(!isPremiumHome()) return;
    if(modalOrSheetOpen()) return;
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    document.body.style.touchAction = 'pan-y';
    markDisplayMode();
  }

  document.addEventListener('DOMContentLoaded', function(){ markDisplayMode(); unlockPremiumScroll(); }, {once:true});
  window.addEventListener('load', function(){ markDisplayMode(); unlockPremiumScroll(); }, {once:true});
  window.addEventListener('resize', markDisplayMode);
  window.addEventListener('pageshow', unlockPremiumScroll);
})();
