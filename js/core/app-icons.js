(function(){
  'use strict';
  var VERSION='G54.47.12E';
  var PATHS={
    sparkle:'<path d="M12 2l1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7L12 2Z"/><path d="M5 14l1 2.5L8.5 18 6 19l-1 2.5L4 19l-2.5-1L4 16.5 5 14Z"/>',
    journey:'<path d="M4 19c4-6 5-12 10-12h5"/><path d="m16 4 3 3-3 3"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="10" r="2"/>',
    idea:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14.5A7 7 0 1 1 15.5 14.5C14.5 15.5 14 16.2 14 18h-4c0-1.8-.5-2.5-1.5-3.5Z"/>',
    ai:'<rect x="5" y="6" width="14" height="12" rx="3"/><path d="M9 10h.01M15 10h.01M9 14c2 2 4 2 6 0M12 2v4M8 21v-3M16 21v-3M2 11h3M19 11h3"/>',
    vision:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/><path d="m16.5 6.5.7 1.5 1.6.3-1.2 1.1.2 1.6-1.3-.8-1.4.8.3-1.6-1.2-1.1 1.6-.3.7-1.5Z"/>',
    contact:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    legal:'<path d="M12 3v18M5 6h14M5 6l-3 6h6L5 6ZM19 6l-3 6h6l-3-6ZM8 21h8"/>',
    factory:'<path d="M3 21V9l6 3V9l6 3V5h6v16H3Z"/><path d="M7 17h.01M11 17h.01M16 17h2"/>',
    decision:'<path d="M12 3a7 7 0 0 0-4 12.7V19h8v-3.3A7 7 0 0 0 12 3Z"/><path d="M9 22h6"/>',
    fail:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
    code:'<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
    night:'<path d="M20 15.5A8.5 8.5 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z"/><path d="M16 3h.01M20 7h.01"/>',
    learn:'<path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3V5Z"/><path d="M4 19h11a3 3 0 0 1 3 3M8 9h6M8 13h4"/>',
    certificate:'<path d="M6 3h12v13H6z"/><path d="M9 7h6M9 11h4"/><path d="m9 16-1 5 4-2 4 2-1-5"/>',
    shield:'<path d="M12 3 4.5 6v5.5c0 4.7 3.1 7.8 7.5 9.5 4.4-1.7 7.5-4.8 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    bug:'<path d="M8 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0V8Z"/><path d="M5 10h3M16 10h3M5 15h3M16 15h3M10 4 8 2M14 4l2-2M10 12h4"/>',
    handshake:'<path d="m8 12 3-3a2 2 0 0 1 3 0l4 4"/><path d="m4 13 5 5a2 2 0 0 0 3 0l1-1"/><path d="m14 16 1 1a2 2 0 0 0 3-3l-5-5"/><path d="M3 8l4-3 3 3M21 8l-4-3-2 2"/>',
    imprint:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h4"/><circle cx="9" cy="8" r="1"/>',
    privacy:'<path d="M12 3 5 6v5c0 4.5 2.8 7.5 7 9 4.2-1.5 7-4.5 7-9V6l-7-3Z"/><rect x="9" y="10" width="6" height="5" rx="1"/><path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10"/>',
    terms:'<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h3"/><path d="m14 16 1.5 1.5L19 14"/>',
    operator:'<circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M19 5h2v5h-2"/>',
    status:'<path d="M4 20V8l4-3 4 3 4-3 4 3v12H4Z"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>',
    database:'<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    microphone:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    pending:'<circle cx="12" cy="12" r="7"/><path d="M12 8v4l3 2"/>',
    warning:'<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4M12 17h.01"/>',
    export:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    cache:'<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M18.5 9A7 7 0 0 0 6 6.5L4 9M5.5 15A7 7 0 0 0 18 17.5l2-2.5"/>',
    history:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M3 12H1m2 0 2-2"/>',
    userdelete:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 10-4.5"/><path d="m16 16 5 5m0-5-5 5"/>',
    arrow:'<path d="M5 12h14M14 7l5 5-5 5"/>'
  };
  function icon(name,label,cls){
    var path=PATHS[name]||PATHS.sparkle;
    var aria=label?' role="img" aria-label="'+String(label).replace(/"/g,'&quot;')+'"':' aria-hidden="true"';
    return '<svg class="app-icon '+(cls||'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'+aria+'>'+path+'</svg>';
  }
  window.EGTAppIcons=Object.freeze({version:VERSION,icon:icon,names:Object.freeze(Object.keys(PATHS))});
})();
