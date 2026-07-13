/* Novura · universelle Deep-Sheet-Navigation · G54.50.2I */
(function (root) {
  'use strict';

  var VERSION = 'G54.50.2I';
  var stack = [];
  var current = null;
  var pendingRestore = null;
  var renderer = null;
  var sheet = null;
  var menuOpen = false;

  function visible(el) {
    if (!el) return false;
    return el.classList.contains('show') || el.classList.contains('is-visible');
  }

  function cloneConfig(config) {
    var copy = {};
    Object.keys(config || {}).forEach(function (key) {
      if (key === '__navRestore') return;
      copy[key] = config[key];
    });
    return copy;
  }

  function routeKey(config) {
    config = config || {};
    return String(config.navId || config.routeId || config.type || 'generic') + '::' + String(config.title || 'Menü');
  }

  function scroller() {
    if (!sheet) return null;
    return sheet.querySelector('[data-sheet-scroll]') || sheet.querySelector('.ui-deep-body');
  }

  function makeFocusRef(el) {
    if (!el || !el.getAttribute || !sheet || !sheet.contains(el)) return null;
    if (el.id) return { kind: 'id', value: el.id };
    var action = el.getAttribute('data-ui-action');
    var moduleId = el.getAttribute('data-module');
    if (action) return { kind: 'action', value: action, moduleId: moduleId || '' };
    var nav = el.getAttribute('data-deep-nav-id');
    if (nav) return { kind: 'nav', value: nav };
    return null;
  }

  function cssEscape(value) {
    if (root.CSS && typeof root.CSS.escape === 'function') return root.CSS.escape(String(value));
    return String(value).replace(/(["\\])/g, '\\$1');
  }

  function findFocus(ref) {
    if (!sheet || !ref) return null;
    if (ref.kind === 'id') return sheet.querySelector('#' + cssEscape(ref.value));
    if (ref.kind === 'nav') return sheet.querySelector('[data-deep-nav-id="' + cssEscape(ref.value) + '"]');
    if (ref.kind === 'action') {
      var selector = '[data-ui-action="' + cssEscape(ref.value) + '"]';
      if (ref.moduleId) selector += '[data-module="' + cssEscape(ref.moduleId) + '"]';
      return sheet.querySelector(selector);
    }
    return null;
  }

  function entry(config) {
    return {
      key: routeKey(config),
      title: String((config && config.title) || 'Menü'),
      config: cloneConfig(config),
      scrollTop: 0,
      focusRef: null
    };
  }

  function capture(entryToCapture) {
    if (!entryToCapture) return;
    var body = scroller();
    entryToCapture.scrollTop = body ? (body.scrollTop || 0) : 0;
    entryToCapture.focusRef = makeFocusRef(document.activeElement) || entryToCapture.focusRef;
  }

  function pathEntries() {
    var list = stack.slice();
    if (current) list.push(current);
    return list;
  }

  function presentation() {
    var path = pathEntries();
    var previous = stack.length ? stack[stack.length - 1] : null;
    return {
      version: VERSION,
      canBack: !!previous,
      backLabel: previous ? previous.title : '',
      currentTitle: current ? current.title : '',
      path: path.map(function (item, index) {
        return { index: index, title: item.title, current: index === path.length - 1 };
      })
    };
  }

  function begin(config, context) {
    context = context || {};
    sheet = context.sheet || sheet;
    renderer = context.renderer || renderer;

    if (pendingRestore) {
      current = pendingRestore;
      pendingRestore = null;
      try { if (typeof current.config.onNavActivate === 'function') current.config.onNavActivate(); } catch (e) { }
      return presentation();
    }

    var next = entry(config);
    var alreadyOpen = visible(sheet);

    if (!alreadyOpen || !current) {
      stack.length = 0;
      current = next;
    } else if (current.key === next.key || config.navMode === 'replace') {
      capture(current);
      next.scrollTop = current.scrollTop;
      next.focusRef = current.focusRef;
      current = next;
    } else {
      capture(current);
      stack.push(current);
      current = next;
    }

    try { if (typeof config.onNavActivate === 'function') config.onNavActivate(); } catch (e2) { }
    return presentation();
  }

  function restore(entryToRestore) {
    if (!entryToRestore || typeof renderer !== 'function') return false;
    pendingRestore = entryToRestore;
    var config = cloneConfig(entryToRestore.config);
    config.__navRestore = true;
    renderer(config);
    setTimeout(function () {
      var body = scroller();
      if (body) body.scrollTop = entryToRestore.scrollTop || 0;
      var focusTarget = findFocus(entryToRestore.focusRef);
      if (focusTarget && typeof focusTarget.focus === 'function') {
        try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); }
      } else {
        var currentTitle = sheet && sheet.querySelector('#uiSheetContextTitle');
        if (currentTitle && typeof currentTitle.focus === 'function') currentTitle.focus();
      }
    }, 0);
    return true;
  }

  function back() {
    if (!stack.length) return false;
    capture(current);
    var target = stack.pop();
    current = target;
    closeMenu();
    return restore(target);
  }

  function goTo(index) {
    var path = pathEntries();
    var targetIndex = Number(index);
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= path.length) return false;
    if (targetIndex === path.length - 1) {
      closeMenu();
      return true;
    }
    capture(current);
    var target = path[targetIndex];
    stack = path.slice(0, targetIndex);
    current = target;
    closeMenu();
    return restore(target);
  }

  function toggleMenu(force) {
    var menu = document.getElementById('uiSheetContextMenu');
    var button = document.getElementById('uiSheetContextTitle');
    if (!menu || !button) return false;
    menuOpen = typeof force === 'boolean' ? force : !menuOpen;
    menu.hidden = !menuOpen;
    button.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    if (menuOpen) {
      var currentItem = menu.querySelector('[aria-current="page"]');
      var first = currentItem || menu.querySelector('button');
      if (first && typeof first.focus === 'function') first.focus();
    }
    return menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
    var menu = document.getElementById('uiSheetContextMenu');
    var button = document.getElementById('uiSheetContextTitle');
    if (menu) menu.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
  }

  function reset() {
    stack.length = 0;
    current = null;
    pendingRestore = null;
    closeMenu();
  }

  document.addEventListener('keydown', function (event) {
    if (!current || !visible(sheet)) return;
    if (event.key === 'Escape' && menuOpen) {
      event.preventDefault();
      closeMenu();
      var titleButton = document.getElementById('uiSheetContextTitle');
      if (titleButton) titleButton.focus();
      return;
    }
    if (event.altKey && event.key === 'ArrowLeft' && stack.length) {
      event.preventDefault();
      back();
    }
  }, true);

  root.NovuraDeepSheetNavigation = Object.freeze({
    version: VERSION,
    begin: begin,
    back: back,
    goTo: goTo,
    toggleMenu: toggleMenu,
    closeMenu: closeMenu,
    reset: reset,
    canBack: function () { return stack.length > 0; },
    getPath: function () { return presentation().path; },
    diagnostics: function () {
      return {
        ok: true,
        version: VERSION,
        depth: stack.length,
        current: current ? current.title : null,
        path: pathEntries().map(function (item) { return item.title; })
      };
    }
  });
})(window);
