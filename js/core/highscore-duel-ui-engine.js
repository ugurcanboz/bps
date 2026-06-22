/* ════════════════════════════════════════════════════════════════
   highscore-duel-ui-engine.js — G52.2 Phase 16
   Zweck: Highscore-/Duell-UI als eigenes Fachmodul kapseln.
   Dieses Modul rendert keine App-Screens selbstständig, sondern liefert
   stabile HTML-Renderer und Datenadapter für App/UI-Renderer.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VERSION = 'G52.2-phase16';

  function fallbackEsc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function create(options) {
    options = options || {};
    var escHTML = typeof options.escHTML === 'function' ? options.escHTML : fallbackEsc;
    var getResults = typeof options.getResults === 'function' ? options.getResults : function () { return []; };
    var getDuels = typeof options.getDuels === 'function' ? options.getDuels : function () { return []; };
    var getPrognosisHtml = typeof options.getPrognosisHtml === 'function' ? options.getPrognosisHtml : function () { return ''; };

    function emit(name, detail) {
      try { document.dispatchEvent(new CustomEvent('egt:highscore-duel-ui:' + name, { detail: detail || {} })); } catch (e) {}
      try { if (window.AppEvents && typeof AppEvents.emit === 'function') AppEvents.emit('highscore-duel-ui:' + name, detail || {}); } catch (e2) {}
    }

    function duellAvatarHtml(name, size) {
      var n = String(name || '?').trim() || '?';
      var initials = n.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
      var hash = 0;
      for (var i = 0; i < n.length; i++) hash = (hash * 31 + n.charCodeAt(i)) >>> 0;
      var hue = hash % 360;
      var dim = Number(size || 40);
      return '<span class="duel-avatar" style="width:' + dim + 'px;height:' + dim + 'px;background:hsl(' + hue + ',62%,30%);border-color:hsl(' + hue + ',70%,52%)">' + escHTML(initials) + '</span>';
    }

    function fmtTime(ms) {
      var s = Math.round((Number(ms) || 0) / 1000);
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + ' min';
    }

    function winnerOf(a, b) {
      if (!a || !b || !a.result || !b.result) return null;
      if (a.result.correct !== b.result.correct) return a.result.correct > b.result.correct ? a : b;
      if (a.result.timeMs !== b.result.timeMs) return a.result.timeMs < b.result.timeMs ? a : b;
      return null;
    }

    function renderDuelHistory(history) {
      history = Array.isArray(history) ? history : [];
      if (!history.length) return '';
      return '<div class="duel-history"><b>Letzte Duelle</b>' + history.slice(0, 5).map(function (h) {
        h = h || {};
        var p1 = h.p1 || {};
        var p2 = h.p2 || {};
        var winner = h.winner ? ('🏆 ' + escHTML(h.winner)) : '🤝 Remis';
        var mode = h.mode === 'online' ? ' · 📡' : '';
        return '<div class="duel-history-row"><span>' + (h.winner ? duellAvatarHtml(h.winner, 22) : '') + ' ' + escHTML(p1.name || 'Spieler 1') + ' ' + escHTML(p1.correct == null ? 0 : p1.correct) + ' : ' + escHTML(p2.correct == null ? 0 : p2.correct) + ' ' + escHTML(p2.name || 'Spieler 2') + '</span><small>' + winner + mode + '</small></div>';
      }).join('') + '</div>';
    }

    function renderDuelSetup(data) {
      data = data || {};
      var myName = String(data.myName || '').trim();
      var histHtml = renderDuelHistory(data.history || []);
      return '<div class="duel-setup-card" data-ui-engine="highscore-duel-ui">' +
        '<div class="duel-setup-head"><span class="duel-setup-icon">⚔️</span><div><b>Duell-Modus</b><small>12 identische Aufgaben · 25 s pro Aufgabe · neuer Pool je Duell</small></div></div>' +
        '<div class="duel-mode-tabs">' +
          '<button type="button" id="duellTabOnline" class="duel-mode-tab active" onclick="App.duellSetupTab(\'online\')">📡 Online-Duell</button>' +
          '<button type="button" id="duellTabLocal" class="duel-mode-tab" onclick="App.duellSetupTab(\'local\')">📱 Lokal (1 Gerät)</button>' +
        '</div>' +
        '<div id="duellPaneOnline">' +
          '<label class="duel-input-label">Dein Name<input type="text" id="duellMyName" maxlength="18" placeholder="Dein Name" value="' + escHTML(myName || '') + '"></label>' +
          '<button type="button" class="duel-primary-btn" onclick="App.duellCreateOnline()">Duell erstellen → Code teilen 🚀</button>' +
          '<div class="duel-or-sep"><span>oder</span></div>' +
          '<label class="duel-input-label">Duell-Code eingeben<input type="text" id="duellJoinCode" maxlength="6" placeholder="z. B. K7M2XQ" autocapitalize="characters" style="text-transform:uppercase;letter-spacing:.25em;text-align:center;font-size:20px"></label>' +
          '<button type="button" class="duel-secondary-btn" onclick="App.duellJoinOnline()">Duell beitreten ⚔️</button>' +
          '<div id="duellOnlineStatus" class="duel-online-status"></div>' +
        '</div>' +
        '<div id="duellPaneLocal" class="hidden">' +
          '<label class="duel-input-label">Spieler 1<input type="text" id="duellP1Name" maxlength="18" placeholder="Name Spieler 1" value="' + escHTML(myName || 'Spieler 1') + '"></label>' +
          '<label class="duel-input-label">Spieler 2<input type="text" id="duellP2Name" maxlength="18" placeholder="Name Spieler 2" value="Spieler 2"></label>' +
          '<button type="button" class="duel-primary-btn" onclick="App.startDuell()">Lokales Duell starten 🚀</button>' +
        '</div>' +
        histHtml +
        '<button type="button" class="duel-secondary-btn" onclick="App.duellCancelSetup()">Abbrechen</button>' +
      '</div>';
    }

    function renderDuellComparison(p1, p2, opts) {
      opts = opts || {};
      p1 = p1 || { name: 'Spieler 1', result: {} };
      p2 = p2 || { name: 'Spieler 2', result: {} };
      var winner = winnerOf(p1, p2);
      var tie = !winner;
      var banner = tie
        ? '<div class="duel-winner-banner tie">🤝 Unentschieden! Gleiche Punkte, gleiche Zeit.</div>'
        : '<div class="duel-winner-banner">🏆 ' + duellAvatarHtml(winner.name, 34) + ' <b>' + escHTML(winner.name) + '</b> gewinnt das Duell!' + (p1.result.correct === p2.result.correct ? ' <small>(Zeit-Tiebreak)</small>' : '') + '</div>';

      function card(p) {
        var isWinner = !tie && winner === p;
        return '<div class="duel-player-card' + (isWinner ? ' winner' : '') + '">' +
          '<div class="duel-player-avatar-row">' + duellAvatarHtml(p.name, 44) + '</div>' +
          '<div class="duel-player-name">' + (isWinner ? '👑 ' : '') + escHTML(p.name) + '</div>' +
          '<div class="duel-player-score">' + escHTML((p.result && p.result.correct) || 0) + '<small>/' + escHTML((p.result && p.result.total) || 0) + '</small></div>' +
          '<div class="duel-player-time">⏱ ' + fmtTime(p.result && p.result.timeMs) + '</div>' +
        '</div>';
      }

      var blocks = Array.from(new Set(Object.keys((p1.result && p1.result.perBlock) || {}).concat(Object.keys((p2.result && p2.result.perBlock) || {}))));
      var blockHtml = '';
      if (blocks.length) {
        blockHtml = '<div class="duel-blocks-wrap"><b>Wer war in welchem Bereich besser?</b>';
        blocks.forEach(function (b) {
          var a = ((p1.result || {}).perBlock || {})[b] || { c: 0, n: 0, t: 0 };
          var bb = ((p2.result || {}).perBlock || {})[b] || { c: 0, n: 0, t: 0 };
          var crown1 = '', crown2 = '', remis = '';
          if (a.c > bb.c || (a.c === bb.c && a.t < bb.t && (a.c || bb.c))) crown1 = '👑 ';
          else if (bb.c > a.c || (a.c === bb.c && bb.t < a.t && (a.c || bb.c))) crown2 = '👑 ';
          else remis = ' <small class="duel-block-remis">Remis</small>';
          blockHtml += '<div class="duel-block-row"><span class="duel-block-name">' + escHTML(b) + remis + '</span>' +
            '<span class="duel-block-side' + (crown1 ? ' lead' : '') + '">' + crown1 + escHTML(p1.name) + ' <b>' + escHTML(a.c) + '/' + escHTML(a.n) + '</b> <small>' + fmtTime(a.t) + '</small></span>' +
            '<span class="duel-block-side' + (crown2 ? ' lead' : '') + '">' + crown2 + escHTML(p2.name) + ' <b>' + escHTML(bb.c) + '/' + escHTML(bb.n) + '</b> <small>' + fmtTime(bb.t) + '</small></span></div>';
        });
        blockHtml += '</div>';
      }

      var q1 = ((p1.result || {}).perQuestion || []);
      var q2 = ((p2.result || {}).perQuestion || []);
      var maxQ = Math.max(q1.length, q2.length);
      var ticks = '<div class="duel-tick-grid" style="grid-template-columns:minmax(70px,auto) repeat(' + maxQ + ',minmax(28px,1fr))"><div class="duel-tick-label">Frage</div>';
      for (var i = 0; i < maxQ; i++) ticks += '<div class="duel-tick-num">' + (i + 1) + '</div>';
      [p1, p2].forEach(function (p) {
        ticks += '<div class="duel-tick-label">' + escHTML(p.name) + '</div>';
        var qs = ((p.result || {}).perQuestion || []);
        for (var i = 0; i < maxQ; i++) {
          var v = qs[i];
          ticks += '<div class="duel-tick ' + (v === true ? 'win' : v === false ? 'lose' : 'none') + '">' + (v === true ? '✓' : v === false ? '✗' : '–') + '</div>';
        }
      });
      ticks += '</div>';

      var actions = opts.actions || '<button type="button" class="duel-primary-btn" onclick="App.duellRematch()">🔄 Revanche (neue Fragen)</button>' +
        '<button type="button" class="duel-secondary-btn" onclick="App.openDuellSetup()">Neues Duell</button>' +
        '<button type="button" class="duel-secondary-btn" onclick="App.duellExit()">Zum Start</button>';

      return '<div class="duel-result" data-ui-engine="highscore-duel-ui">' + banner +
        '<div class="duel-vs-grid">' + card(p1) + '<div class="duel-vs-sep">VS</div>' + card(p2) + '</div>' +
        blockHtml +
        '<div class="duel-ticks-wrap"><b>Frage-für-Frage-Vergleich</b>' + ticks + '</div>' +
        '<div class="duel-actions">' + actions + '</div></div>';
    }

    function highscoreData(input) {
      input = input || {};
      var res = Array.isArray(input.results) ? input.results : getResults();
      var duels = Array.isArray(input.duels) ? input.duels : getDuels();
      var prognosisHtml = input.prognosisHtml != null ? input.prognosisHtml : getPrognosisHtml();
      var top = res.slice().sort(function (a, b) { return (b.percent || 0) - (a.percent || 0); }).slice(0, 10)
        .map(function (r) { return { name: r.player_name || 'Gast', mode: r.title || r.mode || '', percent: Math.round(r.percent || 0), date: r.date || '' }; });
      var recent = res.slice(-8).reverse()
        .map(function (r) { return { name: r.player_name || 'Gast', mode: r.title || r.mode || '', percent: Math.round(r.percent || 0), date: r.date || '' }; });
      return { top: top, recent: recent, duels: duels, prognosisHtml: prognosisHtml, avatarHtml: duellAvatarHtml, __source: VERSION };
    }

    function diagnostics() {
      return {
        ok: true,
        version: VERSION,
        renderers: ['duellAvatarHtml', 'renderDuelSetup', 'renderDuellComparison', 'highscoreData'],
        note: 'Highscore-/Duell-UI ist aus app.js fachlich abgekapselt.'
      };
    }

    emit('created', { version: VERSION });
    return Object.freeze({
      __version: VERSION,
      avatarHtml: duellAvatarHtml,
      duellAvatarHtml: duellAvatarHtml,
      fmtTime: fmtTime,
      winnerOf: winnerOf,
      renderDuelHistory: renderDuelHistory,
      renderDuelSetup: renderDuelSetup,
      renderDuellComparison: renderDuellComparison,
      highscoreData: highscoreData,
      diagnostics: diagnostics
    });
  }

  window.EGTHighscoreDuelUIEngine = Object.freeze({ __version: VERSION, create: create });
})();
