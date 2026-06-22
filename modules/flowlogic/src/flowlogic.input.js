/* Ablaufplan-Detektiv · FlowLogic Input Engine · Phase 7
   Strukturierte Fehlereingabe: Raster, Kategorie, Fehlertyp, Korrektur-Code und Antworttabelle.
   Wichtig: Freitext wird gespeichert, aber nicht als harte Bewertung verwendet. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';
  var SESSION_KEY = 'flowlogic_input_session_draft_v1';

  function clone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  function uid(prefix){ return (prefix || 'fl') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
  function nowIso(){ return new Date().toISOString(); }
  function schema(){ if(!window.FlowLogicSchema) throw new Error('FlowLogicSchema fehlt fuer Input Engine.'); return window.FlowLogicSchema; }
  function renderer(){ if(!window.FlowLogicRenderer) throw new Error('FlowLogicRenderer fehlt fuer Input Engine.'); return window.FlowLogicRenderer; }
  function validator(){ if(!window.FlowLogicValidator) throw new Error('FlowLogicValidator fehlt fuer Input Engine.'); return window.FlowLogicValidator; }

  function getConstants(){
    var c = schema().constants || {};
    return {
      categories: asArray(c.ERROR_CATEGORIES).slice(),
      errorTypes: asArray(c.ERROR_TYPES).slice()
    };
  }

  function taskFrom(value){
    if(value && value.task && value.task.nodes) return clone(value.task);
    if(value && value.nodes && value.edges) return clone(value);
    if(typeof value === 'string') return validator().createValidatedTask(value).task;
    return validator().createValidatedTask('flow_master_postbote_nachnahme').task;
  }

  function keyForAnswer(answer){
    return [answer.grid || '', answer.category || '', answer.errorType || '', answer.fixCode || ''].join('|');
  }

  function listGridOptions(task){
    var cols = task && task.grid && task.grid.cols || 10;
    var rows = task && task.grid && task.grid.rows || 7;
    var max = cols * rows;
    var list = [];
    for(var i=1; i<=max; i++) list.push(i);
    return list;
  }

  function listCorrectionOptions(task){
    var fixes = Object.create(null);
    asArray(task && task.answerKey).forEach(function(item){
      if(!item || !item.fixCode) return;
      fixes[item.fixCode] = {
        fixCode: item.fixCode,
        category: item.category,
        errorType: item.errorType,
        label: item.expected || item.fixCode
      };
    });
    var options = Object.keys(fixes).map(function(key){ return fixes[key]; });
    options.sort(function(a,b){
      var ca = String(a.category || '').localeCompare(String(b.category || ''));
      if(ca) return ca;
      var ea = String(a.errorType || '').localeCompare(String(b.errorType || ''));
      if(ea) return ea;
      return String(a.label || '').localeCompare(String(b.label || ''));
    });
    return options;
  }

  function listAnswerTargets(task){
    return asArray(task && task.answerKey).map(function(item){
      return {
        id: item.id,
        targetType: item.targetType,
        targetId: item.targetId,
        grid: item.grid,
        category: item.category,
        errorType: item.errorType,
        fixCode: item.fixCode,
        expected: item.expected,
        zone: item.zone,
        routes: asArray(item.routes).slice()
      };
    });
  }

  function getAnswerOptions(task){
    var constants = getConstants();
    return {
      grids: listGridOptions(task),
      categories: constants.categories,
      errorTypes: constants.errorTypes,
      corrections: listCorrectionOptions(task),
      maxAnswers: (task && task.objective && Number(task.objective.errorCount)) || asArray(task && task.answerKey).length || 11
    };
  }

  function createSession(taskOrScenarioId, options){
    options = options || {};
    var task = taskFrom(taskOrScenarioId || options.scenarioId);
    var session = {
      id: uid('flowlogic_session'),
      version: VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      mode: options.mode || 'training',
      task: task,
      answers: [],
      selectedGrid: null,
      selectedTarget: null,
      options: getAnswerOptions(task),
      locked: false,
      metadata: {
        phase: 7,
        structuredInputReady: true,
        scenarioId: task.id,
        title: task.title,
        errorCount: (task.objective && task.objective.errorCount) || asArray(task.answerKey).length || 11
      }
    };
    return session;
  }

  function normalizeDraft(draft){
    draft = draft || {};
    return {
      id: draft.id || uid('answer'),
      grid: draft.grid === '' || draft.grid == null ? null : Number(draft.grid),
      category: String(draft.category || '').trim(),
      errorType: String(draft.errorType || '').trim(),
      fixCode: String(draft.fixCode || '').trim(),
      note: String(draft.note || '').trim(),
      createdAt: draft.createdAt || nowIso(),
      updatedAt: nowIso()
    };
  }

  function validateDraft(session, draft, options){
    options = options || {};
    var errors = [];
    var warnings = [];
    var constants = getConstants();
    var task = session && session.task;
    var normalized = normalizeDraft(draft);
    var maxGrid = ((task && task.grid && task.grid.cols) || 10) * ((task && task.grid && task.grid.rows) || 7);
    var maxAnswers = session && session.options ? Number(session.options.maxAnswers || 11) : 11;
    function add(list, code, message, details){ list.push({ code:code, message:message, details:details || null }); }

    if(!Number.isInteger(normalized.grid) || normalized.grid < 1 || normalized.grid > maxGrid) add(errors, 'INPUT_GRID_INVALID', 'Rasterfeld muss zwischen 1 und '+maxGrid+' liegen.', { grid:normalized.grid });
    if(constants.categories.indexOf(normalized.category) === -1) add(errors, 'INPUT_CATEGORY_INVALID', 'Kategorie muss Form, Pfeil oder Inhalt sein.', { category:normalized.category });
    if(constants.errorTypes.indexOf(normalized.errorType) === -1) add(errors, 'INPUT_ERROR_TYPE_INVALID', 'Fehlertyp ist ungueltig.', { errorType:normalized.errorType });
    var correctionOptions = getAnswerOptions(task).corrections;
    var fixAllowed = correctionOptions.some(function(item){ return item.fixCode === normalized.fixCode; });
    if(!fixAllowed) add(errors, 'INPUT_FIXCODE_INVALID', 'Korrektur muss aus den strukturierten Optionen gewaehlt werden.', { fixCode:normalized.fixCode });
    if(session && asArray(session.answers).length >= maxAnswers && !options.allowExistingUpdate) add(errors, 'INPUT_MAX_ANSWERS_REACHED', 'Im aktuellen Modus sind maximal '+maxAnswers+' Fehlereintraege erlaubt.', { max:maxAnswers });
    if(session && asArray(session.answers).some(function(a){ return a.id !== normalized.id && Number(a.grid) === Number(normalized.grid); })) add(errors, 'INPUT_DUPLICATE_GRID', 'Dieses Rasterfeld wurde bereits als Fehler eingetragen.', { grid:normalized.grid });
    if(session && asArray(session.answers).some(function(a){ return a.id !== normalized.id && keyForAnswer(a) === keyForAnswer(normalized); })) add(errors, 'INPUT_DUPLICATE_ANSWER', 'Diese Antwort wurde bereits eingetragen.', { key:keyForAnswer(normalized) });
    if(!normalized.note) add(warnings, 'INPUT_NOTE_EMPTY', 'Optionale Notiz fehlt. Fuer harte Bewertung nicht notwendig, aber fuer Dozenten hilfreich.');
    return { ok:errors.length === 0, errors:errors, warnings:warnings, answer:normalized };
  }

  function addAnswer(session, draft){
    if(!session || !Array.isArray(session.answers)) throw new Error('addAnswer braucht eine FlowLogic-Input-Session.');
    if(session.locked) throw new Error('Session ist gesperrt und kann nicht mehr bearbeitet werden.');
    var report = validateDraft(session, draft);
    if(!report.ok){ var err = new Error('FlowLogic-Antwort ist ungueltig.'); err.report = report; throw err; }
    session.answers.push(report.answer);
    session.updatedAt = nowIso();
    return { ok:true, session:session, answer:report.answer, warnings:report.warnings };
  }

  function updateAnswer(session, answerId, patch){
    if(!session || !Array.isArray(session.answers)) throw new Error('updateAnswer braucht eine FlowLogic-Input-Session.');
    if(session.locked) throw new Error('Session ist gesperrt und kann nicht mehr bearbeitet werden.');
    var index = session.answers.findIndex(function(a){ return a.id === answerId; });
    if(index < 0) throw new Error('Antwort nicht gefunden: '+answerId);
    var merged = Object.assign({}, session.answers[index], patch || {}, { id:answerId, createdAt:session.answers[index].createdAt });
    var report = validateDraft(session, merged, { allowExistingUpdate:true });
    if(!report.ok){ var err = new Error('FlowLogic-Antwort-Update ist ungueltig.'); err.report = report; throw err; }
    session.answers[index] = report.answer;
    session.updatedAt = nowIso();
    return { ok:true, session:session, answer:report.answer, warnings:report.warnings };
  }

  function removeAnswer(session, answerId){
    if(!session || !Array.isArray(session.answers)) throw new Error('removeAnswer braucht eine FlowLogic-Input-Session.');
    if(session.locked) throw new Error('Session ist gesperrt und kann nicht mehr bearbeitet werden.');
    var before = session.answers.length;
    session.answers = session.answers.filter(function(a){ return a.id !== answerId; });
    session.updatedAt = nowIso();
    return { ok:before !== session.answers.length, session:session, removed:before - session.answers.length };
  }

  function clearAnswers(session){
    if(!session || !Array.isArray(session.answers)) throw new Error('clearAnswers braucht eine FlowLogic-Input-Session.');
    if(session.locked) throw new Error('Session ist gesperrt und kann nicht mehr bearbeitet werden.');
    var count = session.answers.length;
    session.answers = [];
    session.updatedAt = nowIso();
    return { ok:true, cleared:count, session:session };
  }

  function serializeSession(session){
    return {
      id: session && session.id,
      version: VERSION,
      mode: session && session.mode,
      createdAt: session && session.createdAt,
      updatedAt: session && session.updatedAt,
      taskId: session && session.task && session.task.id,
      title: session && session.task && session.task.title,
      expectedErrors: session && session.options && session.options.maxAnswers,
      answers: clone(session && session.answers || []),
      selectedGrid: session && session.selectedGrid || null,
      metadata: clone(session && session.metadata || {})
    };
  }

  function saveDraft(session){
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(serializeSession(session))); return true; } catch(e){ return false; }
  }

  function readForm(root){
    return {
      grid: root.querySelector('[data-flowlogic-input="grid"]') && root.querySelector('[data-flowlogic-input="grid"]').value,
      category: root.querySelector('[data-flowlogic-input="category"]') && root.querySelector('[data-flowlogic-input="category"]').value,
      errorType: root.querySelector('[data-flowlogic-input="errorType"]') && root.querySelector('[data-flowlogic-input="errorType"]').value,
      fixCode: root.querySelector('[data-flowlogic-input="fixCode"]') && root.querySelector('[data-flowlogic-input="fixCode"]').value,
      note: root.querySelector('[data-flowlogic-input="note"]') && root.querySelector('[data-flowlogic-input="note"]').value
    };
  }

  function setGrid(root, grid){
    var el = root.querySelector('[data-flowlogic-input="grid"]');
    if(el) el.value = String(grid || '');
    var badge = root.querySelector('[data-flowlogic-selected-grid]');
    if(badge) badge.textContent = grid ? ('Raster '+grid+' ausgewählt') : 'Kein Raster gewählt';
  }

  function optionsHtml(list, selected, labelFn, valueFn){
    return asArray(list).map(function(item){
      var value = valueFn ? valueFn(item) : item;
      var label = labelFn ? labelFn(item) : item;
      return '<option value="'+esc(value)+'"'+(String(value) === String(selected || '') ? ' selected' : '')+'>'+esc(label)+'</option>';
    }).join('');
  }

  function renderAnswerRows(session){
    var answers = asArray(session.answers);
    if(!answers.length){
      return '<tr><td colspan="5" class="flowlogic-empty-cell">Noch kein Fehler eingetragen. Wähle ein Rasterfeld und trage Kategorie, Fehlertyp und Korrektur ein.</td></tr>';
    }
    return answers.map(function(a, idx){
      return '<tr data-flowlogic-answer-row="'+esc(a.id)+'">'+
        '<td>'+(idx+1)+'</td>'+
        '<td><strong>'+esc(a.grid)+'</strong></td>'+
        '<td>'+esc(a.category)+'</td>'+ 
        '<td>'+esc(a.errorType)+'</td>'+ 
        '<td><button type="button" class="flowlogic-mini-btn" data-flowlogic-input-action="edit" data-answer-id="'+esc(a.id)+'">Bearbeiten</button> <button type="button" class="flowlogic-mini-btn is-danger" data-flowlogic-input-action="remove" data-answer-id="'+esc(a.id)+'">Löschen</button></td>'+ 
      '</tr>';
    }).join('');
  }

  function updateTable(root, session){
    var tbody = root.querySelector('[data-flowlogic-answer-body]');
    if(tbody) tbody.innerHTML = renderAnswerRows(session);
    var progress = root.querySelector('[data-flowlogic-answer-progress]');
    if(progress) progress.textContent = session.answers.length+' / '+session.options.maxAnswers+' Fehler eingetragen';
    var exportBox = root.querySelector('[data-flowlogic-session-json]');
    if(exportBox) exportBox.textContent = JSON.stringify(serializeSession(session), null, 2);
  }

  function renderControls(session){
    var opts = session.options;
    return ''+
      '<aside class="flowlogic-input-panel" aria-label="Fehlereingabe">'+
        '<div class="flowlogic-input-head">'+
          '<div><span class="flowlogic-eyebrow">Phase 7 · Eingabe</span><h3>Fehler eintragen</h3></div>'+ 
          '<strong data-flowlogic-answer-progress>'+session.answers.length+' / '+opts.maxAnswers+' Fehler eingetragen</strong>'+ 
        '</div>'+ 
        '<p class="flowlogic-input-hint">Bewertet wird später strukturiert über Raster, Kategorie, Fehlertyp und Korrektur-Code. Die Notiz ist für Dozenten sichtbar, aber nicht die harte automatische Wertung.</p>'+ 
        '<div class="flowlogic-selected-grid" data-flowlogic-selected-grid>Kein Raster gewählt</div>'+ 
        '<div class="flowlogic-form-grid">'+
          '<label>Rasterfeld<select data-flowlogic-input="grid"><option value="">Wählen…</option>'+optionsHtml(opts.grids)+'</select></label>'+ 
          '<label>Kategorie<select data-flowlogic-input="category"><option value="">Wählen…</option>'+optionsHtml(opts.categories)+'</select></label>'+ 
          '<label>Fehlertyp<select data-flowlogic-input="errorType"><option value="">Wählen…</option>'+optionsHtml(opts.errorTypes)+'</select></label>'+ 
          '<label>Korrektur<select data-flowlogic-input="fixCode"><option value="">Wählen…</option>'+optionsHtml(opts.corrections, '', function(item){ return item.category+' · '+item.label; }, function(item){ return item.fixCode; })+'</select></label>'+ 
          '<label class="flowlogic-form-wide">Notiz optional<textarea data-flowlogic-input="note" rows="3" placeholder="z.B. Nein-Weg darf nicht zur Übergabe führen"></textarea></label>'+ 
        '</div>'+ 
        '<div class="flowlogic-input-actions">'+
          '<button type="button" class="flowlogic-btn" data-flowlogic-input-action="add">Fehler übernehmen</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-input-action="clear-form">Formular leeren</button>'+ 
          '<button type="button" class="flowlogic-btn is-secondary" data-flowlogic-input-action="clear-all">Alle Einträge löschen</button>'+ 
        '</div>'+ 
        '<div class="flowlogic-input-message" data-flowlogic-input-message hidden></div>'+ 
        '<div class="flowlogic-answer-table-wrap"><table class="flowlogic-answer-table"><thead><tr><th>#</th><th>Raster</th><th>Kategorie</th><th>Fehlertyp</th><th>Aktion</th></tr></thead><tbody data-flowlogic-answer-body>'+renderAnswerRows(session)+'</tbody></table></div>'+ 
        '<details class="flowlogic-input-debug"><summary>Strukturierte Session anzeigen</summary><pre data-flowlogic-session-json>'+esc(JSON.stringify(serializeSession(session), null, 2))+'</pre></details>'+ 
      '</aside>';
  }

  function showMessage(root, report, okText){
    var box = root.querySelector('[data-flowlogic-input-message]');
    if(!box) return;
    box.hidden = false;
    if(report && report.ok === false){
      box.className = 'flowlogic-input-message is-error';
      box.innerHTML = '<strong>Eingabe blockiert</strong><ul>'+asArray(report.errors).map(function(e){ return '<li>'+esc(e.message)+'</li>'; }).join('')+'</ul>';
    } else {
      box.className = 'flowlogic-input-message is-ok';
      box.textContent = okText || 'Eingabe gespeichert.';
    }
  }

  function clearForm(root){
    ['grid','category','errorType','fixCode','note'].forEach(function(name){
      var el = root.querySelector('[data-flowlogic-input="'+name+'"]');
      if(el) el.value = '';
    });
    setGrid(root, null);
    root.removeAttribute('data-editing-answer-id');
  }

  function fillForm(root, answer){
    ['grid','category','errorType','fixCode','note'].forEach(function(name){
      var el = root.querySelector('[data-flowlogic-input="'+name+'"]');
      if(el) el.value = answer && answer[name] != null ? String(answer[name]) : '';
    });
    setGrid(root, answer && answer.grid);
    if(answer && answer.id) root.setAttribute('data-editing-answer-id', answer.id);
  }

  function renderTo(container, taskOrSession, options){
    if(!container || !container.appendChild) throw new Error('FlowLogicInput.renderTo braucht ein Ziel-Element.');
    var session = taskOrSession && taskOrSession.answers && taskOrSession.task ? taskOrSession : createSession(taskOrSession, options || {});
    var root = document.createElement('section');
    root.className = 'flowlogic-input-root';
    root.setAttribute('data-flowlogic-input-version', VERSION);
    var rendererHost = document.createElement('div');
    rendererHost.className = 'flowlogic-input-renderer';
    var renderHandle = renderer().renderTo(rendererHost, session.task, options && options.rendererOptions || {});
    var controls = document.createElement('div');
    controls.className = 'flowlogic-input-controls';
    controls.innerHTML = renderControls(session);
    root.appendChild(rendererHost);
    root.appendChild(controls);
    container.appendChild(root);

    function handleSvgClick(event){
      var target = event.target && event.target.closest ? event.target.closest('[data-flowlogic-grid]') : null;
      if(!target) return;
      var grid = Number(target.getAttribute('data-flowlogic-grid'));
      if(!grid) return;
      session.selectedGrid = grid;
      setGrid(root, grid);
      root.querySelectorAll('.flowlogic-node.is-selected').forEach(function(el){ el.classList.remove('is-selected'); });
      target.classList.add('is-selected');
      showMessage(root, { ok:true }, 'Raster '+grid+' ausgewählt. Jetzt Kategorie, Fehlertyp und Korrektur wählen.');
    }

    function handleControls(event){
      var btn = event.target && event.target.closest ? event.target.closest('[data-flowlogic-input-action]') : null;
      if(!btn) return;
      var action = btn.getAttribute('data-flowlogic-input-action');
      if(action === 'add'){
        try {
          var editing = root.getAttribute('data-editing-answer-id');
          if(editing) updateAnswer(session, editing, readForm(root));
          else addAnswer(session, readForm(root));
          updateTable(root, session);
          saveDraft(session);
          clearForm(root);
          showMessage(root, { ok:true }, editing ? 'Eintrag aktualisiert.' : 'Fehler wurde strukturiert übernommen.');
        } catch(err){ showMessage(root, err && err.report ? err.report : { ok:false, errors:[{ message:err && err.message ? err.message : String(err) }] }); }
      }
      if(action === 'clear-form') clearForm(root);
      if(action === 'clear-all'){
        clearAnswers(session);
        updateTable(root, session);
        saveDraft(session);
        clearForm(root);
        showMessage(root, { ok:true }, 'Alle Einträge wurden gelöscht.');
      }
      if(action === 'remove'){
        removeAnswer(session, btn.getAttribute('data-answer-id'));
        updateTable(root, session);
        saveDraft(session);
        showMessage(root, { ok:true }, 'Eintrag gelöscht.');
      }
      if(action === 'edit'){
        var id = btn.getAttribute('data-answer-id');
        var answer = session.answers.filter(function(a){ return a.id === id; })[0];
        fillForm(root, answer);
        showMessage(root, { ok:true }, 'Eintrag geladen. Änderungen mit „Fehler übernehmen“ speichern.');
      }
    }

    root.addEventListener('click', handleSvgClick);
    controls.addEventListener('click', handleControls);
    return {
      root:root,
      session:session,
      renderHandle:renderHandle,
      destroy:function(){
        root.removeEventListener('click', handleSvgClick);
        controls.removeEventListener('click', handleControls);
        try { if(renderHandle && renderHandle.destroy) renderHandle.destroy(); } catch(e){}
        if(root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  function selfCheck(){
    var task = validator().createValidatedTask('flow_master_postbote_nachnahme').task;
    var session = createSession(task, { mode:'selftest' });
    var first = asArray(task.answerKey)[0];
    if(!first) throw new Error('Phase 7 SelfCheck braucht Antwortschluessel.');
    var report = validateDraft(session, { grid:first.grid, category:first.category, errorType:first.errorType, fixCode:first.fixCode, note:'Selftest' });
    if(!report.ok){ var err = new Error('Gueltige strukturierte Eingabe wurde abgelehnt.'); err.report = report; throw err; }
    addAnswer(session, report.answer);
    return { ok:true, answers:session.answers.length, options:session.options.maxAnswers };
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    createSession: createSession,
    getAnswerOptions: getAnswerOptions,
    listAnswerTargets: listAnswerTargets,
    validateDraft: validateDraft,
    addAnswer: addAnswer,
    updateAnswer: updateAnswer,
    removeAnswer: removeAnswer,
    clearAnswers: clearAnswers,
    serializeSession: serializeSession,
    saveDraft: saveDraft,
    renderTo: renderTo,
    selfCheck: selfCheck
  });

  window.FlowLogicInput = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase7.input-api', 'Phase 7: Strukturierte Eingabe-API vorhanden', function(t){
      t.assert(window.FlowLogicInput && window.FlowLogicInput.__version.indexOf('G39.26') !== -1, 'FlowLogicInput fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicInput.createSession === 'function', 'createSession fehlt.');
      t.assert(typeof window.FlowLogicInput.validateDraft === 'function', 'validateDraft fehlt.');
      t.assert(typeof window.FlowLogicInput.renderTo === 'function', 'renderTo fehlt.');
      return { version:window.FlowLogicInput.__version };
    }, { phase:'7', critical:true });

    window.FlowLogicSelfTest.register('phase7.session-options-complete', 'Phase 7: Session hat Raster, Kategorien, Fehlertypen und Korrekturen', function(t){
      var session = window.FlowLogicInput.createSession('flow_master_parksensor', { mode:'selftest' });
      t.assert(session.options.grids.length === 70, '70er-Raster fehlt.', session.options);
      t.assert(session.options.categories.join('|') === 'Form|Pfeil|Inhalt', 'Kategorien falsch.', session.options.categories);
      t.assert(session.options.errorTypes.length >= 8, 'Zu wenige Fehlertypen.', session.options.errorTypes);
      t.assert(session.options.corrections.length >= 10, 'Zu wenige Korrektur-Optionen.', session.options.corrections.length);
      return { grids:session.options.grids.length, corrections:session.options.corrections.length };
    }, { phase:'7', critical:true });

    window.FlowLogicSelfTest.register('phase7.valid-answer-accepted-invalid-blocked', 'Phase 7: Gueltige Eingabe akzeptiert, ungueltige blockiert', function(t){
      var session = window.FlowLogicInput.createSession('flow_master_login_2fa', { mode:'selftest' });
      var first = session.task.answerKey[0];
      var ok = window.FlowLogicInput.validateDraft(session, { grid:first.grid, category:first.category, errorType:first.errorType, fixCode:first.fixCode, note:'ok' });
      t.assert(ok.ok, 'Gueltige Antwort wurde blockiert.', ok);
      window.FlowLogicInput.addAnswer(session, ok.answer);
      var bad = window.FlowLogicInput.validateDraft(session, { grid:999, category:'Ratebild', errorType:'XXX', fixCode:'YYY' });
      t.assert(!bad.ok && bad.errors.length >= 3, 'Ungueltige Antwort wurde nicht sauber blockiert.', bad);
      var duplicate = window.FlowLogicInput.validateDraft(session, { grid:first.grid, category:first.category, errorType:first.errorType, fixCode:first.fixCode });
      t.assert(!duplicate.ok, 'Doppeltes Raster wurde nicht blockiert.', duplicate);
      return { accepted:session.answers.length, invalidErrors:bad.errors.length, duplicateErrors:duplicate.errors.length };
    }, { phase:'7', critical:true });

    window.FlowLogicSelfTest.register('phase7.max-answers-enforced', 'Phase 7: Maximal 11 Antworten werden erzwungen', function(t){
      var session = window.FlowLogicInput.createSession('flow_master_postbote_nachnahme', { mode:'selftest' });
      session.options.maxAnswers = 1;
      var a = session.task.answerKey[0];
      var b = session.task.answerKey[1];
      window.FlowLogicInput.addAnswer(session, { grid:a.grid, category:a.category, errorType:a.errorType, fixCode:a.fixCode });
      var blocked = window.FlowLogicInput.validateDraft(session, { grid:b.grid, category:b.category, errorType:b.errorType, fixCode:b.fixCode });
      t.assert(!blocked.ok && blocked.errors.some(function(e){ return e.code === 'INPUT_MAX_ANSWERS_REACHED'; }), 'Maximalanzahl wurde nicht blockiert.', blocked);
      return { max:session.options.maxAnswers, answers:session.answers.length };
    }, { phase:'7', critical:true });

    window.FlowLogicSelfTest.register('phase7.render-dom-no-leak', 'Phase 7: Eingabe-Renderer/Destroy ohne DOM-Leak', function(t){
      var host = document.createElement('div');
      host.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1200px;height:800px;overflow:hidden;';
      document.body.appendChild(host);
      var before = document.querySelectorAll('.flowlogic-input-root').length;
      var handle = window.FlowLogicInput.renderTo(host, 'flow_master_postbote_nachnahme', { mode:'selftest' });
      t.assert(handle && handle.root, 'Input-Renderer hat kein Handle geliefert.');
      t.assert(host.querySelector('[data-flowlogic-input="grid"]'), 'Raster-Eingabe fehlt.');
      t.assert(host.querySelector('[data-flowlogic-answer-body]'), 'Antworttabelle fehlt.');
      handle.destroy();
      var after = document.querySelectorAll('.flowlogic-input-root').length;
      if(host.parentNode) host.parentNode.removeChild(host);
      t.assert(after === before, 'Input-DOM wurde nach destroy nicht sauber entfernt.', { before:before, after:after });
      return { before:before, after:after };
    }, { phase:'7', critical:true });
  }
})();
