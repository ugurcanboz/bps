/* Eignungstest-Trainer · UI-F2.5 Sheet Guard
   Ein zentraler Wächter für Close-Buttons und Scroll-Lock in Sheets/Modals. */
(function(){
  'use strict';

  var ACTIVE_SELECTOR = [
    '.bps-deep-sheet.show',
    '.bps-sheet-backdrop.show',
    '.wh-sheet.show',
    '.wh-sheet-backdrop.show',
    '.egt-admin-modal.show',
    '.update-modal-backdrop.is-visible',
    '.python-quest-backdrop.show',
    '.training-sheet.show',
    '.training-sheet-backdrop.show',
    '.clean-training-sheet.show',
    '.clean-sheet-backdrop.show',
    '#egtPasswordChangeModal.show'
  ].join(',');

  var SCROLLABLE_SELECTOR = [
    '.bps-sheet-body',
    '.wh-sheet-body',
    '.egt-admin-modal.show',
    '.egt-admin-body',
    '.egt-admin-list',
    '.update-modal-card',
    '.python-quest-backdrop.show',
    '.python-quest-body',
    '.training-sheet-content',
    '.clean-sheet-router',
    '.training-sheet-router',
    '.clean-mode-panel',
    '.training-mode-panel',
    'textarea',
    'input',
    'select'
  ].join(',');

  var CLOSE_SELECTOR = [
    '[data-fb-close]',
    '[data-close]',
    '.egt-admin-close',
    '.training-sheet-close',
    '.wh-sheet-close',
    '.bps-sheet-close',
    '.clean-sheet-close',
    '.global-diagnostics-close',
    '.python-quest-close',
    '#fbCloseBtn',
    '#fbCancelBtn',
    '#bpsSheetClose',
    '[aria-label*="Schließen"]',
    '[aria-label*="schließen"]',
    '[aria-label*="Close"]',
    '[aria-label*="close"]'
  ].join(',');

  var lock = null;
  var lastCloseAt = 0;

  function q(sel){ try { return document.querySelector(sel); } catch(e){ return null; } }
  function qa(sel){ try { return Array.prototype.slice.call(document.querySelectorAll(sel)); } catch(e){ return []; } }
  function active(){ return !!q(ACTIVE_SELECTOR); }
  function closest(el, sel){ try { return el && el.closest ? el.closest(sel) : null; } catch(e){ return null; } }
  function isVisible(el){
    if(!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  }

  function lockBackground(){
    if(lock || !active()) return;
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    lock = {
      y:y,
      htmlOverflow:document.documentElement.style.overflow,
      bodyPosition:document.body.style.position,
      bodyTop:document.body.style.top,
      bodyLeft:document.body.style.left,
      bodyRight:document.body.style.right,
      bodyWidth:document.body.style.width,
      bodyOverflow:document.body.style.overflow,
      bodyTouchAction:document.body.style.touchAction
    };
    document.documentElement.classList.add('egt-modal-scroll-lock');
    document.body.classList.add('egt-modal-scroll-lock');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + y + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  function unlockBackground(){
    if(!lock || active()) return;
    var y = lock.y || 0;
    document.documentElement.classList.remove('egt-modal-scroll-lock');
    document.body.classList.remove('egt-modal-scroll-lock');
    document.documentElement.style.overflow = lock.htmlOverflow || '';
    document.body.style.position = lock.bodyPosition || '';
    document.body.style.top = lock.bodyTop || '';
    document.body.style.left = lock.bodyLeft || '';
    document.body.style.right = lock.bodyRight || '';
    document.body.style.width = lock.bodyWidth || '';
    document.body.style.overflow = lock.bodyOverflow || '';
    document.body.style.touchAction = lock.bodyTouchAction || '';
    lock = null;
    try { window.scrollTo(0, y); } catch(e) {}
  }

  function syncLock(){
    if(active()) lockBackground();
    else unlockBackground();
  }

  function closeAllFrom(target){
    var handled = false;

    if(closest(target, '.bps-sheet-close') || closest(target, '#bpsSheetClose')){
      try { if(window.EGTTrainerDeepSheet && typeof window.EGTTrainerDeepSheet.close === 'function') { window.EGTTrainerDeepSheet.close(); handled = true; } } catch(e) {}
      try { if(window.App && typeof window.App.closeTrainingSheet === 'function') { window.App.closeTrainingSheet(); handled = true; } } catch(e) {}
      qa('.bps-deep-sheet.show,.bps-sheet-backdrop.show').forEach(function(el){ el.classList.remove('show'); handled = true; });
    }

    if(closest(target, '.wh-sheet-close') || closest(target, '#fbCloseBtn') || closest(target, '#fbCancelBtn')){
      try { if(window.AppFeedback && typeof window.AppFeedback.closeSheet === 'function') { window.AppFeedback.closeSheet(); handled = true; } } catch(e) {}
      qa('.wh-sheet.show,.wh-sheet-backdrop.show').forEach(function(el){ el.classList.remove('show'); handled = true; });
    }

    if(closest(target, '.egt-admin-close') || closest(target, '[data-fb-close]')){
      var admin = closest(target, '.egt-admin-modal') || q('.egt-admin-modal.show');
      if(admin){ admin.classList.remove('show'); handled = true; }
    }

    if(closest(target, '.python-quest-close')){
      var py = closest(target, '.python-quest-backdrop') || q('.python-quest-backdrop.show');
      if(py){ py.classList.remove('show'); handled = true; }
    }

    var generic = closest(target, '.update-modal-backdrop,.training-sheet,.clean-training-sheet,#egtPasswordChangeModal');
    if(generic && (closest(target, CLOSE_SELECTOR) || target === generic)){
      generic.classList.remove('show');
      generic.classList.remove('is-visible');
      handled = true;
    }

    if(!handled){
      var modal = closest(target, '.show,.is-visible');
      if(modal && /modal|sheet|backdrop/i.test(modal.className || '')){
        modal.classList.remove('show');
        modal.classList.remove('is-visible');
        handled = true;
      }
    }

    setTimeout(syncLock, 40);
    return handled;
  }

  function closeHandler(ev){
    var target = ev.target;
    var btn = closest(target, CLOSE_SELECTOR);
    if(!btn) return;

    var t = Date.now();
    if(t - lastCloseAt < 280) return;
    lastCloseAt = t;

    if(closeAllFrom(btn)){
      try { if(ev.cancelable) ev.preventDefault(); } catch(e) {}
      try { ev.stopPropagation(); } catch(e) {}
    }
  }

  function backdropHandler(ev){
    var target = ev.target;
    if(!target) return;
    if(target.classList && (
      target.classList.contains('bps-sheet-backdrop') ||
      target.classList.contains('update-modal-backdrop') ||
      target.classList.contains('training-sheet-backdrop') ||
      target.classList.contains('clean-sheet-backdrop')
    )){
      closeAllFrom(target);
      try { if(ev.cancelable) ev.preventDefault(); } catch(e) {}
      try { ev.stopPropagation(); } catch(e) {}
    }
  }

  function touchMoveGuard(ev){
    if(!lock) return;
    var scrollable = closest(ev.target, SCROLLABLE_SELECTOR);
    if(scrollable && isVisible(scrollable)) return;
    try { if(ev.cancelable) ev.preventDefault(); } catch(e) {}
  }

  function observe(){
    var mo = new MutationObserver(function(){ setTimeout(syncLock, 0); });
    try { mo.observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['class','style']}); } catch(e) {}
    setInterval(syncLock, 850);
  }

  document.addEventListener('click', closeHandler, true);
  document.addEventListener('touchend', closeHandler, true);
  document.addEventListener('pointerup', closeHandler, true);
  document.addEventListener('click', backdropHandler, true);
  document.addEventListener('touchmove', touchMoveGuard, {capture:true, passive:false});
  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape'){
      qa('.bps-deep-sheet.show,.bps-sheet-backdrop.show,.wh-sheet.show,.wh-sheet-backdrop.show,.egt-admin-modal.show,.update-modal-backdrop.is-visible,.python-quest-backdrop.show,.training-sheet.show,.training-sheet-backdrop.show,.clean-training-sheet.show,.clean-sheet-backdrop.show').forEach(function(el){ el.classList.remove('show'); el.classList.remove('is-visible'); });
      setTimeout(syncLock, 40);
    }
  }, true);

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ observe(); syncLock(); });
  else { observe(); syncLock(); }

  window.EGTSheetGuard = { sync:syncLock, closeAll:function(){ qa(ACTIVE_SELECTOR).forEach(function(el){ el.classList.remove('show'); el.classList.remove('is-visible'); }); setTimeout(syncLock, 40); } };
})();
