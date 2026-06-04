/* Eignungstest-Trainer · UI-F2.2 iPad Touch Fallback
   Direkt gebundene Touch-/Pointer-Handler für iPadOS Desktop-Mode.
   Ergänzt premium-interactions.js, ohne App-/Coach-/Admin-Kernlogik zu ändern. */
(function(){
  'use strict';

  var SELECTOR = '[data-wh-action], .wh-tab[data-tab]';
  var lastKey = '';
  var lastAt = 0;
  var starts = new WeakMap();
  var TAP_TOLERANCE = 18;

  function now(){ return Date.now ? Date.now() : new Date().getTime(); }
  function isIPadLike(){
    try {
      var ua = navigator.userAgent || '';
      if (/iPad/i.test(ua)) return true;
      // iPadOS 13+ often reports as Macintosh but has touch points.
      if (/Macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return true;
    } catch(e) {}
    return false;
  }

  function isTouchLike(){
    try {
      return isIPadLike() || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
    } catch(e) { return false; }
  }

  function point(ev){
    var t = (ev.changedTouches && ev.changedTouches[0]) || (ev.touches && ev.touches[0]) || ev;
    return { x: Number(t.clientX || 0), y: Number(t.clientY || 0) };
  }

  function getActionEl(target){
    if (!target || !target.closest) return null;
    return target.closest(SELECTOR);
  }

  function hitEl(ev){
    var el = getActionEl(ev.target);
    if (el) return el;
    try {
      var p = point(ev);
      var hit = document.elementFromPoint(p.x, p.y);
      return getActionEl(hit);
    } catch(e) { return null; }
  }

  function sameTap(el, ev){
    var s = starts.get(el);
    if (!s) return true;
    var p = point(ev);
    return Math.abs(p.x - s.x) <= TAP_TOLERANCE && Math.abs(p.y - s.y) <= TAP_TOLERANCE;
  }

  function dedupe(el){
    var key = (el.getAttribute('data-wh-action') || '') + '|' + (el.getAttribute('data-tab') || '') + '|' + (el.className || '') + '|' + (el.textContent || '').trim().slice(0,40);
    var t = now();
    if (key === lastKey && (t - lastAt) < 430) return false;
    lastKey = key;
    lastAt = t;
    return true;
  }

  function prevent(ev){
    try { if (ev && ev.cancelable) ev.preventDefault(); } catch(e) {}
    try { ev.stopPropagation(); } catch(e) {}
    try { if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation(); } catch(e) {}
  }

  function pulse(el){
    try {
      el.classList.add('egt-action-pulse');
      setTimeout(function(){ el.classList.remove('egt-action-pulse'); }, 220);
    } catch(e) {}
  }

  function run(el, ev){
    if (!el) return false;
    if (!sameTap(el, ev)) return false;
    if (!dedupe(el)) return true;
    prevent(ev);
    pulse(el);

    try {
      if (el.matches && el.matches('.wh-tab[data-tab]')) {
        if (window.EGTPremiumInteractions && typeof window.EGTPremiumInteractions.switchTab === 'function') {
          window.EGTPremiumInteractions.switchTab(Number(el.getAttribute('data-tab')) || 0);
          return true;
        }
        if (window.EGTWordHubLayer && typeof window.EGTWordHubLayer.switchTab === 'function') {
          window.EGTWordHubLayer.switchTab(Number(el.getAttribute('data-tab')) || 0);
          return true;
        }
      }

      var action = el.getAttribute('data-wh-action');
      if (action && window.EGTPremiumInteractions && typeof window.EGTPremiumInteractions.handleAction === 'function') {
        window.EGTPremiumInteractions.handleAction(action, el);
        return true;
      }
    } catch(err) {
      try { console.warn('[Eignungstest-Trainer] iPad touch fallback failed', err); } catch(e) {}
    }

    return false;
  }

  function prepareEl(el){
    if (!el || el.__egtIPadTouchBound) return;
    el.__egtIPadTouchBound = true;
    try { el.setAttribute('role', el.classList.contains('wh-tab') ? 'tab' : 'button'); } catch(e) {}
    try { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0'); } catch(e) {}

    el.addEventListener('touchstart', function(ev){ starts.set(el, point(ev)); }, { passive:true, capture:true });
    el.addEventListener('touchend', function(ev){ run(el, ev); }, { passive:false, capture:true });
    el.addEventListener('pointerdown', function(ev){ starts.set(el, point(ev)); }, { passive:true, capture:true });
    el.addEventListener('pointerup', function(ev){ run(el, ev); }, { passive:false, capture:true });
    el.addEventListener('mouseup', function(ev){ if (isIPadLike()) run(el, ev); }, { passive:false, capture:true });
    el.addEventListener('keydown', function(ev){ if (ev.key === 'Enter' || ev.key === ' ') run(el, ev); }, { passive:false, capture:true });
  }

  function bindAll(){
    if (!isTouchLike()) return;
    try {
      var els = document.querySelectorAll(SELECTOR);
      for (var i=0;i<els.length;i++) prepareEl(els[i]);
    } catch(e) {}
  }

  function globalGuard(){
    if (!isTouchLike()) return;
    document.addEventListener('touchend', function(ev){
      var el = hitEl(ev);
      if (el && !el.__egtIPadTouchBound) prepareEl(el);
      if (el) run(el, ev);
    }, { passive:false, capture:true });

    document.addEventListener('pointerup', function(ev){
      var el = hitEl(ev);
      if (el && !el.__egtIPadTouchBound) prepareEl(el);
      if (isIPadLike() && el) run(el, ev);
    }, { passive:false, capture:true });
  }

  function boot(){
    bindAll();
    setTimeout(bindAll, 150);
    setTimeout(bindAll, 600);
    setTimeout(bindAll, 1400);
    try {
      var mo = new MutationObserver(function(){ bindAll(); });
      mo.observe(document.documentElement || document.body, { childList:true, subtree:true });
    } catch(e) {}
    globalGuard();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();

  window.EGTIPadTouchFallback = { bindAll: bindAll, isIPadLike: isIPadLike };
})();
