/* egt-ticket-system.js — G39.13
   Bug-Meldungen als Tickets mit automatischem Screenshot.
   Speichert in Firestore: courses/{courseId}/tickets/{ticketId}
   Admin-Portal sieht Ticket-Anzahl als Badge.
   html2canvas lädt dynamisch (nur wenn Bug gemeldet wird). */
(function () {
  'use strict';

  var TICKET_KEY = 'egt_tickets_pending_v1';
  var H2C_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

  function nowIso() { return new Date().toISOString(); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function emit(n, d) { try { window.dispatchEvent(new CustomEvent(n, { detail: d || {} })); } catch (e) { } }
  function safeJson(s, fb) { try { return JSON.parse(s || ''); } catch (e) { return fb; } }

  /* ── html2canvas dynamisch laden ── */
  var _h2cPromise = null;
  function loadH2C() {
    if (typeof window.html2canvas === 'function') return Promise.resolve(window.html2canvas);
    if (_h2cPromise) return _h2cPromise;
    _h2cPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = H2C_URL;
      s.onload = function () { resolve(window.html2canvas); };
      s.onerror = function () { reject(new Error('html2canvas konnte nicht geladen werden.')); };
      document.head.appendChild(s);
    });
    return _h2cPromise;
  }

  /* ── Screenshot erstellen (ohne Formulare/Overlays) ── */
  async function makeScreenshot() {
    try {
      var h2c = await loadH2C();
      // Formulare + Gate-Overlays temporär ausblenden
      var hidden = [];
      document.querySelectorAll('.egt-gate-overlay, .egt-feedback-modal, #egtFeedbackSheet, .egt-ticket-modal').forEach(function (el) {
        if (getComputedStyle(el).display !== 'none') { el.style.visibility = 'hidden'; hidden.push(el); }
      });
      await new Promise(function (r) { setTimeout(r, 80); });
      var canvas = await h2c(document.body, {
        useCORS: true, allowTaint: true, scale: 0.6,
        width: window.innerWidth, height: window.innerHeight,
        windowWidth: window.innerWidth, windowHeight: window.innerHeight,
        ignoreElements: function (el) {
          return el.classList && (el.classList.contains('egt-gate-overlay') || el.classList.contains('egt-ticket-modal') || el.classList.contains('egt-feedback-modal'));
        }
      });
      hidden.forEach(function (el) { el.style.visibility = ''; });
      return canvas.toDataURL('image/jpeg', 0.65);
    } catch (e) {
      return null;
    }
  }

  /* ── App-Kontext sammeln ── */
  function gatherContext() {
    var ctx = {
      url: window.location.href,
      viewport: window.innerWidth + 'x' + window.innerHeight,
      userAgent: navigator.userAgent.slice(0, 120),
      timestamp: nowIso(),
      appVersion: (window.AppConfig && window.AppConfig.version) || '?',
      activeTab: '',
      question: null
    };
    // Aktiver Tab
    try {
      var activeBtn = document.querySelector('[data-ui-nav="tab"].is-active, [data-ui-nav="tab"][aria-selected="true"]');
      if (activeBtn) ctx.activeTab = activeBtn.getAttribute('data-tab') || '';
    } catch (e) { }
    // Quiz-Kontext
    try {
      if (window.App && window.App._test && window.App._test.state) {
        var st = window.App._test.state;
        var q = st.quiz && st.quiz[st.current];
        if (q) ctx.question = { id: q.id || '?', mode: st.selectedMode || '?', index: st.current };
      }
    } catch (e) { }
    return ctx;
  }

  /* ── Ticket in Firestore speichern ── */
  async function saveTicketToFirestore(ticket) {
    var db = window.EGTUserDatabase;
    if (!db) return false;
    try {
      var snap = db.snapshot ? db.snapshot() : {};
      if (!snap.online) return false;
      // db.sync ist intern – wir nutzen den gleichen Firestore-Instance via EGTAdminPortal
      var admin = window.EGTAdminPortal;
      if (admin && typeof admin._saveTicket === 'function') {
        await admin._saveTicket(ticket);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /* ── Ticket lokal puffern ── */
  function bufferTicket(ticket) {
    try {
      var buf = safeJson(localStorage.getItem(TICKET_KEY), []);
      buf.push(ticket);
      localStorage.setItem(TICKET_KEY, JSON.stringify(buf.slice(-20)));
      var mirror = safeJson(localStorage.getItem('egt_bug_tickets_v1'), []);
      if (!Array.isArray(mirror)) mirror = [];
      if (!mirror.some(function (x) { return x && x.id === ticket.id; })) mirror.unshift(ticket);
      localStorage.setItem('egt_bug_tickets_v1', JSON.stringify(mirror.slice(0, 300)));
    } catch (e) { }
  }

  /* ── Offline-Tickets flushen ── */
  async function flushPendingTickets() {
    try {
      var buf = safeJson(localStorage.getItem(TICKET_KEY), []);
      if (!buf.length) return;
      var remaining = [];
      for (var i = 0; i < buf.length; i++) {
        var ok = await saveTicketToFirestore(buf[i]);
        if (!ok) remaining.push(buf[i]);
      }
      localStorage.setItem(TICKET_KEY, JSON.stringify(remaining));
      if (remaining.length < buf.length) emit('egt:ticket-flushed', { flushed: buf.length - remaining.length });
    } catch (e) { }
  }

  /* ═══════════════ TICKET-MODAL UI ═══════════════ */
  var modalEl = null;

  function showTicketModal() {
    if (modalEl) return;
    modalEl = document.createElement('div');
    modalEl.className = 'egt-ticket-modal';
    modalEl.innerHTML = [
      '<div class="etm-backdrop"></div>',
      '<div class="etm-sheet">',
        '<div class="etm-head">',
          '<h3>🐛 Bug melden</h3>',
          '<button class="etm-close" aria-label="Schließen">✕</button>',
        '</div>',
        '<div class="etm-body">',
          '<div class="etm-preview-wrap" id="etmPreviewWrap">',
            '<div class="etm-preview-loading" id="etmPreviewLoading">',
              '<div class="etm-spinner"></div>',
              '<span>Screenshot wird erstellt…</span>',
            '</div>',
            '<img class="etm-preview-img" id="etmPreviewImg" style="display:none" alt="Screenshot">',
          '</div>',
          '<div class="etm-form">',
            '<label class="etm-label">Kategorie',
              '<select id="etmCategory" class="etm-input">',
                '<option value="darstellung">Darstellung / Layout</option>',
                '<option value="aufgabe">Aufgabe fehlerhaft</option>',
                '<option value="funktion">Funktion funktioniert nicht</option>',
                '<option value="absturz">App-Absturz / Fehler</option>',
                '<option value="sonstiges">Sonstiges</option>',
              '</select>',
            '</label>',
            '<label class="etm-label">Priorität',
              '<select id="etmPriority" class="etm-input">',
                '<option value="niedrig">Niedrig</option>',
                '<option value="mittel" selected>Mittel</option>',
                '<option value="hoch">Hoch</option>',
                '<option value="kritisch">Kritisch 🚨</option>',
              '</select>',
            '</label>',
            '<label class="etm-label">Beschreibung <span style="color:#f87171">*</span>',
              '<textarea id="etmDesc" class="etm-input etm-textarea" placeholder="Was ist passiert? Was hast du erwartet?" required></textarea>',
            '</label>',
            '<div class="etm-msg" id="etmMsg" style="display:none"></div>',
            '<div class="etm-row">',
              '<button class="etm-btn-sec" id="etmRetake">📸 Neu aufnehmen</button>',
              '<button class="etm-btn-primary" id="etmSubmit">Ticket senden ▶</button>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(modalEl);
    // Styles injizieren
    injectStyles();
    // Events
    modalEl.querySelector('.etm-backdrop').onclick = closeModal;
    modalEl.querySelector('.etm-close').onclick = closeModal;
    modalEl.querySelector('#etmRetake').onclick = function () { captureScreenshot(); };
    modalEl.querySelector('#etmSubmit').onclick = submitTicket;
    // Screenshot sofort machen
    captureScreenshot();
  }

  var _screenshotData = null;

  function captureScreenshot() {
    var loading = document.getElementById('etmPreviewLoading');
    var img = document.getElementById('etmPreviewImg');
    if (loading) loading.style.display = 'flex';
    if (img) img.style.display = 'none';
    _screenshotData = null;
    makeScreenshot().then(function (data) {
      _screenshotData = data;
      if (loading) loading.style.display = 'none';
      if (img && data) { img.src = data; img.style.display = 'block'; }
      else if (img) { img.alt = 'Screenshot nicht verfügbar (offline oder Fehler)'; img.style.display = 'block'; }
    });
  }

  function closeModal() {
    if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
  }

  function setMsg(cls, text) {
    var el = document.getElementById('etmMsg');
    if (!el) return;
    el.className = 'etm-msg etm-msg-' + cls;
    el.textContent = text;
    el.style.display = 'block';
  }

  async function submitTicket() {
    var desc = (document.getElementById('etmDesc') || {}).value || '';
    if (!desc.trim()) { setMsg('err', 'Bitte Beschreibung eingeben.'); return; }
    var btn = document.getElementById('etmSubmit');
    if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet…'; }

    var session = null;
    try { session = window.EGTAuthEngine && EGTAuthEngine.session; } catch (e) { }

    var ticket = {
      id: 'TKT-' + Date.now().toString(36).toUpperCase(),
      createdAt: nowIso(),
      status: 'offen',
      priority: (document.getElementById('etmPriority') || {}).value || 'mittel',
      category: (document.getElementById('etmCategory') || {}).value || 'sonstiges',
      description: desc.trim(),
      screenshot: _screenshotData || null,
      context: gatherContext(),
      reporter: {
        nickname: (session && session.nickname) || 'Anonym',
        role: (session && session.role) || 'unknown',
        uid: (session && (session.firebaseUid || session.profileId || session.userId)) || 'anon',
        groupId: (session && session.groupId) || ''
      },
      groupId: (session && session.groupId) || ''
    };

    var ok = await saveTicketToFirestore(ticket);
    if (!ok) { bufferTicket(ticket); }

    emit('egt:ticket-created', { ticket: ticket, saved: ok });
    setMsg('ok', ok ? '✓ Ticket ' + ticket.id + ' gesendet! Danke für die Meldung.' : '✓ Ticket gespeichert – wird übertragen sobald du online bist.');
    if (btn) { btn.disabled = false; btn.textContent = 'Weiteres Ticket senden'; btn.onclick = function () { closeModal(); setTimeout(showTicketModal, 100); }; }
  }

  /* ── Styles ── */
  function injectStyles() {
    if (document.getElementById('etm-styles')) return;
    var s = document.createElement('style');
    s.id = 'etm-styles';
    s.textContent = [
      '.egt-ticket-modal{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:flex-end;justify-content:center;}',
      '.etm-backdrop{position:absolute;inset:0;background:rgba(2,6,23,.75);backdrop-filter:blur(6px);}',
      '.etm-sheet{position:relative;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;background:#0c1635;border:1px solid rgba(96,165,250,.2);border-radius:22px 22px 0 0;padding:22px 22px max(20px,env(safe-area-inset-bottom));animation:etm-in .3s cubic-bezier(.16,1,.3,1) both;}',
      '@keyframes etm-in{from{transform:translateY(50px);opacity:0}to{transform:none;opacity:1}}',
      '.etm-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}',
      '.etm-head h3{margin:0;font-size:1.1rem;font-weight:700;color:#f1f5ff;}',
      '.etm-close{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.08);border:none;color:#cbd5e1;font-size:1rem;cursor:pointer;display:grid;place-items:center;}',
      '.etm-body{display:flex;flex-direction:column;gap:14px;}',
      '.etm-preview-wrap{border-radius:12px;overflow:hidden;background:#060e24;border:1px solid rgba(96,165,250,.15);min-height:120px;display:flex;align-items:center;justify-content:center;}',
      '.etm-preview-loading{display:flex;align-items:center;gap:10px;color:#8da3c8;font-size:.84rem;padding:20px;}',
      '.etm-spinner{width:20px;height:20px;border:2px solid rgba(32,217,255,.2);border-top-color:#20d9ff;border-radius:50%;animation:etm-spin .7s linear infinite;flex-shrink:0;}',
      '@keyframes etm-spin{to{transform:rotate(360deg)}}',
      '.etm-preview-img{width:100%;display:block;max-height:220px;object-fit:contain;}',
      '.etm-form{display:flex;flex-direction:column;gap:12px;}',
      '.etm-label{display:flex;flex-direction:column;gap:5px;font-size:.8rem;color:#8da3c8;}',
      '.etm-input{background:rgba(255,255,255,.06);border:1px solid rgba(96,165,250,.18);border-radius:10px;padding:10px 13px;color:#f1f5ff;font-size:.9rem;outline:none;font-family:inherit;transition:border-color .15s;}',
      '.etm-input:focus{border-color:#20d9ff;}',
      '.etm-textarea{resize:vertical;min-height:80px;}',
      '.etm-row{display:flex;gap:10px;}',
      '.etm-btn-primary{flex:1;padding:12px;background:linear-gradient(120deg,#20d9ff,#c13cff);border:none;border-radius:11px;color:#06121f;font-weight:700;font-size:.92rem;cursor:pointer;}',
      '.etm-btn-primary:disabled{opacity:.5;cursor:not-allowed;}',
      '.etm-btn-sec{padding:12px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:11px;color:#cbd5e1;font-size:.86rem;font-weight:600;cursor:pointer;}',
      '.etm-msg{padding:9px 13px;border-radius:9px;font-size:.82rem;}',
      '.etm-msg-ok{background:rgba(53,211,154,.12);color:#35d39a;border:1px solid rgba(53,211,154,.3);}',
      '.etm-msg-err{background:rgba(248,113,113,.12);color:#f87171;border:1px solid rgba(248,113,113,.3);}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Online: Offline-Tickets flushen ── */
  window.addEventListener('online', function () { setTimeout(flushPendingTickets, 1500); });
  window.addEventListener('egt:sync-ready', function () { setTimeout(flushPendingTickets, 1000); });

  /* ── Public API ── */
  window.EGTTicketSystem = {
    open: showTicketModal,
    close: closeModal,
    flush: flushPendingTickets
  };

})();
