/* Ablaufplan-Detektiv · FlowLogic Mutations · Phase 5
   Gepruefte Fehlerbibliothek fuer Form-, Pfeil- und Inhaltsfehler.
   Phase 5 erweitert die Kandidaten bewusst ueber mehrere Zonen, damit der
   Verteilungs-Validator spaeter echte 11-Fehler-Aufgaben ohne Cluster bilden kann. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';

  function schema(){
    if(!window.FlowLogicSchema) throw new Error('FlowLogicSchema muss vor FlowLogicMutations geladen werden.');
    return window.FlowLogicSchema;
  }
  function scenarios(){
    if(!window.FlowLogicScenarios) throw new Error('FlowLogicScenarios muss vor FlowLogicMutations geladen werden.');
    return window.FlowLogicScenarios;
  }
  function clone(value){ return schema().clone ? schema().clone(value) : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function isString(value){ return typeof value === 'string' && value.trim().length > 0; }
  function unique(values){
    var seen = Object.create(null), dupes = [];
    values.forEach(function(v){ if(seen[v]) dupes.push(v); seen[v] = true; });
    return { ok:dupes.length === 0, duplicates:dupes };
  }
  function byId(items){
    var map = Object.create(null);
    asArray(items).forEach(function(item){ if(item && item.id) map[item.id] = item; });
    return map;
  }
  function findNode(s, id){ return byId(s.nodes)[id] || null; }
  function findEdge(s, id){ return byId(s.edges)[id] || null; }
  function findRoute(s, id){ return byId(s.routes)[id] || null; }
  function routesForTarget(s, targetType, targetId){
    return asArray(s.routes).filter(function(route){
      return targetType === 'node'
        ? asArray(route.nodeIds).indexOf(targetId) !== -1
        : asArray(route.edgeIds).indexOf(targetId) !== -1;
    }).map(function(route){ return route.id; });
  }
  function targetGrid(s, targetType, targetId){
    var item = targetType === 'node' ? findNode(s, targetId) : findEdge(s, targetId);
    return item && Number.isInteger(item.grid) ? item.grid : null;
  }
  function targetZone(s, targetType, targetId){
    if(targetType === 'node'){
      var node = findNode(s, targetId);
      return node ? node.zone : '';
    }
    var edge = findEdge(s, targetId);
    var from = edge ? findNode(s, edge.from) : null;
    return from ? from.zone : '';
  }
  function targetLabel(s, targetType, targetId){
    var item = targetType === 'node' ? findNode(s, targetId) : findEdge(s, targetId);
    return item ? (item.label || item.id) : targetId;
  }
  function mutationBase(s, def){
    var targetType = def.targetType;
    var targetId = def.targetId;
    return Object.freeze({
      id: def.id,
      scenarioId: s.id,
      family: s.family,
      title: def.title,
      category: def.category,
      errorType: def.errorType,
      fixCode: def.fixCode,
      expected: def.expected,
      targetType: targetType,
      targetId: targetId,
      targetLabel: targetLabel(s, targetType, targetId),
      grid: def.grid || targetGrid(s, targetType, targetId),
      zone: def.zone || targetZone(s, targetType, targetId),
      routes: def.routes || routesForTarget(s, targetType, targetId),
      operation: def.operation,
      payload: Object.freeze(clone(def.payload || {})),
      difficulty: def.difficulty || 'ctc',
      routeLogicRequired: !!def.routeLogicRequired,
      tags: Object.freeze(asArray(def.tags).slice()),
      explanation: def.explanation || def.expected,
      phase: 4
    });
  }
  function nodeShape(s, targetId, renderedShape, def){
    def = def || {};
    return mutationBase(s, Object.assign({
      id: s.id+'__shape__'+targetId+'__as_'+renderedShape,
      title: 'Formfehler: '+targetLabel(s, 'node', targetId),
      category: 'Form',
      errorType: 'WRONG_SHAPE',
      fixCode: def.fixCode || 'NODE_SHAPE_MUST_MATCH_KIND',
      expected: def.expected || 'Die Form muss zur Bedeutung des Elements passen.',
      targetType: 'node',
      targetId: targetId,
      operation: 'SET_RENDERED_SHAPE',
      payload: { renderedShape: renderedShape },
      tags: ['shape','form']
    }, def));
  }
  function edgeTarget(s, targetId, renderedTo, def){
    def = def || {};
    return mutationBase(s, Object.assign({
      id: s.id+'__edge_target__'+targetId+'__to_'+renderedTo,
      title: 'Pfeilfehler: '+targetLabel(s, 'edge', targetId),
      category: 'Pfeil',
      errorType: def.errorType || 'WRONG_ARROW_TARGET',
      fixCode: def.fixCode || 'EDGE_TARGET_MUST_MATCH_ROUTE',
      expected: def.expected || 'Der Pfeil muss zum fachlich richtigen naechsten Schritt fuehren.',
      targetType: 'edge',
      targetId: targetId,
      operation: 'SET_RENDERED_TARGET',
      payload: { renderedTo: renderedTo },
      routeLogicRequired: true,
      tags: ['arrow','route']
    }, def));
  }
  function edgeLabel(s, targetId, renderedLabel, def){
    def = def || {};
    return mutationBase(s, Object.assign({
      id: s.id+'__edge_label__'+targetId+'__'+String(renderedLabel).toLowerCase(),
      title: 'Pfeilbeschriftung falsch: '+targetLabel(s, 'edge', targetId),
      category: 'Pfeil',
      errorType: 'WRONG_LABEL',
      fixCode: def.fixCode || 'EDGE_LABEL_MUST_MATCH_CONDITION',
      expected: def.expected || 'Die Ja/Nein-Beschriftung muss zur Bedingung passen.',
      targetType: 'edge',
      targetId: targetId,
      operation: 'SET_RENDERED_EDGE_LABEL',
      payload: { renderedLabel: renderedLabel },
      routeLogicRequired: true,
      tags: ['arrow-label','condition']
    }, def));
  }
  function nodeLabel(s, targetId, renderedLabel, def){
    def = def || {};
    return mutationBase(s, Object.assign({
      id: s.id+'__content__'+targetId,
      title: 'Inhaltsfehler: '+targetLabel(s, 'node', targetId),
      category: 'Inhalt',
      errorType: def.errorType || 'IMPOSSIBLE_ACTION',
      fixCode: def.fixCode || 'NODE_CONTENT_MUST_MATCH_ROUTE_STATE',
      expected: def.expected || 'Der Inhalt muss zum erreichten Zustand der Route passen.',
      targetType: 'node',
      targetId: targetId,
      operation: 'SET_RENDERED_LABEL',
      payload: { renderedLabel: renderedLabel },
      routeLogicRequired: !!def.routeLogicRequired,
      tags: ['content','logic']
    }, def));
  }

  function postboteMutations(s){
    return [
      nodeShape(s,'n_start','rectangle',{ fixCode:'START_MUST_BE_OVAL', expected:'Der Start muss als Oval dargestellt werden.' }),
      nodeLabel(s,'a_scan','Paket ohne Sendungsdaten zustellen',{ errorType:'WRONG_SEQUENCE', fixCode:'SHIPMENT_DATA_FIRST', expected:'Sendungsdaten muessen vor jeder Zustellung geprueft werden.', routeLogicRequired:true }),
      edgeTarget(s,'e_address_no','a_go_door',{ fixCode:'ADDRESS_NOT_FOUND_NO_DOOR_ROUTE', expected:'Wenn die Adresse nicht gefunden wurde, darf der Postbote nicht zur Haustuer gehen.', routeLogicRequired:true }),
      nodeShape(s,'q_opens','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Person öffnet?“ ist eine Entscheidung und muss in eine Raute.' }),
      nodeShape(s,'q_neighbor','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Nachbarannahme erlaubt?“ ist eine Ja/Nein-Pruefung und muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_cod','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Nachnahme erforderlich?“ muss als Entscheidung/Raute dargestellt werden.' }),
      edgeTarget(s,'e_cod_no','a_amount',{ fixCode:'NO_COD_NO_PAYMENT_ROUTE', expected:'Wenn keine Nachnahme erforderlich ist, darf kein Betrag genannt werden.' }),
      nodeLabel(s,'a_return_base','Paket beim falschen Haus ablegen',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'UNKNOWN_ADDRESS_RETURN_TO_BASE', expected:'Wenn die Adresse nicht gefunden wurde, muss das Paket zur Zustellbasis zurueck.', routeLogicRequired:true }),
      nodeShape(s,'q_address','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Adresse gefunden?“ ist eine Ja/Nein-Frage und muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_recipient','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Richtiger Adressat?“ ist eine Entscheidung und muss in eine Raute.' }),
      nodeShape(s,'q_money','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Betrag vollständig bezahlt?“ muss als Raute dargestellt werden.' }),
      nodeShape(s,'a_handover','diamond',{ fixCode:'ACTION_MUST_BE_RECTANGLE', expected:'„Paket übergeben“ ist eine Handlung und muss ein Rechteck sein.' }),
      nodeShape(s,'n_end_delivered','diamond',{ fixCode:'END_MUST_BE_OVAL', expected:'Ein Ende darf nicht als Frage/Raute dargestellt werden, sondern als Oval.' }),
      edgeTarget(s,'e_opens_no','q_recipient',{ fixCode:'NO_PERSON_NO_RECIPIENT_CHECK', expected:'Wenn niemand öffnet, darf nicht der Adressat geprüft werden. Der Nein-Weg muss zur Benachrichtigung/Filiale führen.' }),
      edgeTarget(s,'e_recipient_no','a_handover',{ fixCode:'WRONG_RECIPIENT_MUST_NOT_RECEIVE_PACKAGE', expected:'Bei falschem Adressaten darf das Paket nicht übergeben werden.' }),
      edgeTarget(s,'e_money_no','a_handover',{ fixCode:'NO_PAYMENT_MUST_NOT_DELIVER', expected:'Bei nicht vollständiger Nachnahme-Zahlung darf das Paket nicht übergeben werden.' }),
      edgeTarget(s,'e_neighbor_no','a_record_neighbor',{ fixCode:'NO_NEIGHBOR_PERMISSION_NO_NEIGHBOR_HANDOVER', expected:'Wenn Nachbarannahme nicht erlaubt ist, darf kein Nachbar dokumentiert und beliefert werden.' }),
      edgeLabel(s,'e_cod_yes','Nein',{ fixCode:'COD_YES_LABEL_MUST_STAY_YES', expected:'Der Pfad zur Nachnahme-Zahlung muss mit „Ja“ beschriftet sein.' }),
      nodeLabel(s,'a_payment_notice','Paket trotzdem übergeben',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'UNPAID_COD_MUST_NOT_HANDOVER', expected:'Bei nicht bezahlter Nachnahme muss Zahlungsinfo/Filiale folgen, nicht Paketübergabe.', routeLogicRequired:true }),
      nodeLabel(s,'a_receipt','Zahlung quittieren vor Geldeingang',{ errorType:'WRONG_SEQUENCE', fixCode:'RECEIPT_AFTER_MONEY_ONLY', expected:'Eine Zahlung darf erst quittiert werden, nachdem Geld entgegengenommen wurde.', routeLogicRequired:true })
    ];
  }

  function parksensorMutations(s){
    return [
      nodeShape(s,'n_start','rectangle',{ fixCode:'START_MUST_BE_OVAL', expected:'Der Start muss als Oval dargestellt werden.' }),
      nodeShape(s,'a_activate','diamond',{ fixCode:'ACTION_MUST_BE_RECTANGLE', expected:'„Sensoren aktivieren“ ist eine Handlung und muss ein Rechteck sein.' }),
      edgeTarget(s,'e_reverse_yes','n_end_off',{ fixCode:'REVERSE_YES_MUST_ACTIVATE_SENSOR', expected:'Bei eingelegtem Rueckwaertsgang muss das Sensorsystem aktiviert werden.' }),
      edgeTarget(s,'e_activate_selftest','a_measure',{ fixCode:'SELFTEST_BEFORE_MEASUREMENT', expected:'Nach dem Aktivieren muss zuerst der Selbsttest folgen, bevor gemessen wird.' }),
      nodeShape(s,'q_obstacle','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Hindernis erkannt?“ ist eine Entscheidung und muss eine Raute sein.' }),
      nodeShape(s,'q_distance_safe','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Abstand wieder sicher?“ muss als Ja/Nein-Raute dargestellt werden.' }),
      nodeShape(s,'n_end_off','rectangle',{ fixCode:'END_MUST_BE_OVAL', expected:'Ein Abschlusszustand muss als Oval dargestellt werden.' }),
      edgeTarget(s,'e_safe_yes','a_remind',{ grid:50, fixCode:'SAFE_DISTANCE_ENDS_WARNING', expected:'Wenn der Abstand wieder sicher ist, darf die Warnung nicht fortgesetzt werden.' }),
      nodeLabel(s,'a_monitor','System abschalten',{ errorType:'ROUTE_LOGIC_BROKEN', fixCode:'NO_OBSTACLE_CONTINUE_MONITORING', expected:'Wenn kein Hindernis erkannt wird, soll weiter ueberwacht werden; nicht einfach abschalten.', routeLogicRequired:true }),
      nodeLabel(s,'a_remind','Warnung beenden',{ errorType:'ROUTE_LOGIC_BROKEN', fixCode:'NO_BRAKE_WARNING_MUST_CONTINUE', expected:'Wenn der Fahrer nicht bremst, muss die Warnung fortgesetzt werden.', routeLogicRequired:true }),
      nodeShape(s,'q_reverse','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Rückwärtsgang eingelegt?“ ist eine Entscheidung und muss eine Raute sein.' }),
      nodeShape(s,'q_selftest','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Selbsttest erfolgreich?“ muss als Ja/Nein-Raute dargestellt werden.' }),
      nodeShape(s,'q_critical','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Abstand kritisch?“ ist eine Entscheidung und muss eine Raute sein.' }),
      nodeShape(s,'a_measure','diamond',{ fixCode:'ACTION_MUST_BE_RECTANGLE', expected:'„Abstand messen“ ist eine Handlung und muss ein Rechteck sein.' }),
      nodeShape(s,'n_end_error','rectangle',{ fixCode:'END_MUST_BE_OVAL', expected:'Ein Abschlusszustand muss als Oval dargestellt werden.' }),
      edgeTarget(s,'e_reverse_no','a_activate',{ fixCode:'NO_REVERSE_NO_SENSOR_ACTIVATION', expected:'Wenn kein Rückwärtsgang eingelegt ist, darf das System nicht aktiviert werden.' }),
      edgeTarget(s,'e_selftest_no','a_measure',{ fixCode:'FAILED_SELFTEST_MUST_SHOW_ERROR', expected:'Bei fehlgeschlagenem Selbsttest muss ein Fehler angezeigt werden, keine Messung starten.' }),
      edgeTarget(s,'e_critical_yes','a_slow_beep',{ fixCode:'CRITICAL_DISTANCE_NEEDS_FAST_WARNING', expected:'Bei kritischem Abstand muss schneller Warnton/Dauerton folgen.' }),
      edgeTarget(s,'e_brake_no','a_measure',{ fixCode:'NO_BRAKE_WARNING_CONTINUES', expected:'Wenn der Fahrer nicht bremst, muss die Warnung fortgesetzt werden.' }),
      edgeLabel(s,'e_obstacle_no','Ja',{ fixCode:'NO_OBSTACLE_LABEL_MUST_STAY_NO', expected:'Der Pfad „kein Hindernis“ muss mit „Nein“ beschriftet sein.' }),
      nodeLabel(s,'a_fast_beep','langsamer Warnton',{ errorType:'ROUTE_LOGIC_BROKEN', fixCode:'CRITICAL_DISTANCE_NOT_SLOW_BEEP', expected:'Bei kritischem Abstand reicht ein langsamer Warnton nicht aus.', routeLogicRequired:true }),
      nodeLabel(s,'a_error','Sensoren weiter verwenden',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'FAILED_SENSOR_NOT_USE_FOR_MEASUREMENT', expected:'Bei Sensorfehler darf das System nicht normal weiterverwendet werden.', routeLogicRequired:true })
    ];
  }

  function loginMutations(s){
    return [
      nodeShape(s,'n_start','rectangle',{ fixCode:'START_MUST_BE_OVAL', expected:'Der Start muss als Oval dargestellt werden.' }),
      nodeShape(s,'q_account','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Konto vorhanden?“ ist eine Entscheidung und muss eine Raute sein.' }),
      nodeShape(s,'q_attempts','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Versuche übrig?“ muss als Ja/Nein-Raute dargestellt werden.' }),
      nodeShape(s,'q_2fa_required','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„2FA erforderlich?“ ist eine Entscheidung und muss eine Raute sein.' }),
      nodeShape(s,'q_code','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Code korrekt?“ muss als Ja/Nein-Raute dargestellt werden.' }),
      edgeTarget(s,'e_account_no','q_locked',{ fixCode:'UNKNOWN_ACCOUNT_NO_LOCK_CHECK', expected:'Wenn das Konto unbekannt ist, darf nicht geprueft werden, ob es gesperrt ist.' }),
      edgeTarget(s,'e_2fa_yes','a_access',{ fixCode:'TWO_FA_REQUIRED_NO_DIRECT_ACCESS', expected:'Wenn 2FA erforderlich ist, muss zuerst ein Code gesendet und geprueft werden.' }),
      edgeTarget(s,'e_reset_no','a_reset_mail',{ fixCode:'RESET_NO_NO_RESET_MAIL', expected:'Wenn kein Passwort-Reset gewuenscht ist, darf kein Reset-Link gesendet werden.' }),
      nodeLabel(s,'a_prompt_input','Login ohne Eingabe erlauben',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'MISSING_INPUT_NO_LOGIN', expected:'Ohne E-Mail und Passwort darf kein Login erlaubt werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_unknown','Zugriff freigeben',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'UNKNOWN_ACCOUNT_NO_ACCESS', expected:'Bei unbekanntem Konto darf kein Zugriff freigegeben werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_reset_mail','Passwort direkt anzeigen',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'PASSWORD_RESET_SEND_LINK_NOT_PASSWORD', expected:'Beim Passwort-Reset darf kein Passwort angezeigt werden; es muss ein Link gesendet werden.', routeLogicRequired:true }),
      nodeShape(s,'q_input','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„E-Mail und Passwort eingegeben?“ ist eine Entscheidung und muss eine Raute sein.' }),
      nodeShape(s,'q_locked','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Konto gesperrt?“ muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_password','rectangle',{ fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'„Passwort korrekt?“ ist eine Ja/Nein-Prüfung und muss eine Raute sein.' }),
      nodeShape(s,'a_access','diamond',{ fixCode:'ACTION_MUST_BE_RECTANGLE', expected:'„Zugriff freigeben“ ist eine Handlung und muss ein Rechteck sein.' }),
      nodeShape(s,'n_end_success','diamond',{ fixCode:'END_MUST_BE_OVAL', expected:'„Ende: eingeloggt“ ist ein Abschluss und muss als Oval dargestellt werden.' }),
      edgeTarget(s,'e_input_no','q_account',{ fixCode:'MISSING_INPUT_CANNOT_CHECK_ACCOUNT', expected:'Ohne Eingabe darf nicht geprüft werden, ob ein Konto vorhanden ist.' }),
      edgeTarget(s,'e_locked_yes','q_password',{ fixCode:'LOCKED_ACCOUNT_NO_PASSWORD_CHECK', expected:'Bei gesperrtem Konto darf keine normale Passwortprüfung mehr folgen.' }),
      edgeTarget(s,'e_password_no','q_2fa_required',{ fixCode:'WRONG_PASSWORD_NO_2FA_SUCCESS_ROUTE', expected:'Bei falschem Passwort darf nicht zur 2FA-Prüfung gewechselt werden.' }),
      edgeTarget(s,'e_code_no','a_access',{ fixCode:'WRONG_2FA_CODE_NO_ACCESS', expected:'Bei falschem 2FA-Code darf kein Zugriff freigegeben werden.' }),
      edgeLabel(s,'e_2fa_no','Ja',{ fixCode:'NO_2FA_LABEL_MUST_STAY_NO', expected:'Der Pfad ohne 2FA muss mit „Nein“ beschriftet sein.' }),
      nodeLabel(s,'a_access','Zugriff freigeben trotz falschem Code',{ errorType:'IMPOSSIBLE_ACTION', fixCode:'ACCESS_ONLY_AFTER_VALID_CREDENTIALS', expected:'Zugriff darf nur nach gültigem Passwort und ggf. korrektem 2FA-Code freigegeben werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_lock_account','Login trotzdem erlauben',{ errorType:'ROUTE_LOGIC_BROKEN', fixCode:'LOCK_ROUTE_MUST_BLOCK_LOGIN', expected:'Wenn keine Versuche übrig sind, muss das Konto gesperrt werden; Login darf nicht erlaubt werden.', routeLogicRequired:true })
    ];
  }


  function genericMutations(s){
    var labels = (s.metadata && s.metadata.flowlogicLabels) || {};
    function W(key, fallback){ return labels[key] || fallback; }
    return [
      nodeShape(s,'n_start','rectangle',{ fixCode:'FORM_START_'+s.id, expected:'Der Start muss als Oval dargestellt werden.' }),
      nodeShape(s,'q_entry','rectangle',{ fixCode:'FORM_ENTRY_DECISION_'+s.id, expected:'Die Grundvoraussetzung ist eine Ja/Nein-Entscheidung und muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_ready','rectangle',{ fixCode:'FORM_READY_DECISION_'+s.id, expected:'Die Bereitschaftspruefung muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_identity','rectangle',{ fixCode:'FORM_IDENTITY_DECISION_'+s.id, expected:'Die Berechtigungs-/Zustandspruefung muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_special','rectangle',{ fixCode:'FORM_SPECIAL_DECISION_'+s.id, expected:'Der Sonderfall ist eine Entscheidung und muss als Raute dargestellt werden.' }),
      nodeShape(s,'q_payment','rectangle',{ fixCode:'FORM_ADDITIONAL_DECISION_'+s.id, expected:'Die Zusatzbedingung muss als Ja/Nein-Raute dargestellt werden.' }),
      nodeShape(s,'q_final','rectangle',{ fixCode:'FORM_FINAL_DECISION_'+s.id, expected:'Die Abschlusspruefung ist eine Entscheidung und muss als Raute dargestellt werden.' }),
      nodeShape(s,'a_start','diamond',{ fixCode:'FORM_START_ACTION_'+s.id, expected:'Die erste fachliche Handlung muss als Rechteck dargestellt werden.' }),
      nodeShape(s,'a_prepare','diamond',{ fixCode:'FORM_PREPARE_ACTION_'+s.id, expected:'Vorbereiten ist eine Handlung und muss ein Rechteck sein.' }),
      nodeShape(s,'a_normal_success','diamond',{ fixCode:'FORM_NORMAL_ACTION_'+s.id, expected:'Der normale Ablauf ist eine Handlung und muss ein Rechteck sein.' }),
      nodeShape(s,'a_special_action','diamond',{ fixCode:'FORM_SPECIAL_ACTION_'+s.id, expected:'Die Sonderfallausfuehrung ist eine Handlung und muss ein Rechteck sein.' }),
      nodeShape(s,'n_end_success','diamond',{ fixCode:'FORM_SUCCESS_END_'+s.id, expected:'Ein Abschluss muss als Oval dargestellt werden, nicht als Raute.' }),
      nodeShape(s,'n_end_error','rectangle',{ fixCode:'FORM_ERROR_END_'+s.id, expected:'Ein Fehler-Endpunkt muss als Oval dargestellt werden.' }),
      edgeTarget(s,'e_entry_no','a_prepare',{ fixCode:'ROUTE_ENTRY_NO_STOPS_'+s.id, expected:'Wenn die Grundvoraussetzung fehlt, darf der Ablauf nicht zum naechsten Schritt weitergehen.', routeLogicRequired:true }),
      edgeTarget(s,'e_entry_yes','a_entry_fail',{ fixCode:'ROUTE_ENTRY_YES_CONTINUES_'+s.id, expected:'Wenn die Grundvoraussetzung erfuellt ist, muss der Ja-Pfad weiter in den Ablauf fuehren.', routeLogicRequired:true }),
      edgeTarget(s,'e_ready_no','q_identity',{ fixCode:'ROUTE_NOT_READY_NO_IDENTITY_'+s.id, expected:'Wenn die Bereitschaft fehlt, darf nicht bereits Berechtigung/Zustand geprueft werden.', routeLogicRequired:true }),
      edgeTarget(s,'e_identity_no','a_normal_success',{ fixCode:'ROUTE_IDENTITY_FAIL_NO_SUCCESS_'+s.id, expected:'Bei falscher Berechtigung oder falschem Zustand darf kein Erfolgspfad folgen.', routeLogicRequired:true }),
      edgeTarget(s,'e_special_no','a_special_prepare',{ fixCode:'ROUTE_NO_SPECIAL_NO_SPECIAL_PREP_'+s.id, expected:'Wenn kein Sonderfall vorliegt, darf keine Sonderfallvorbereitung folgen.', routeLogicRequired:true }),
      edgeTarget(s,'e_payment_no','a_normal_success',{ fixCode:'ROUTE_ADDITIONAL_FAIL_NO_SUCCESS_'+s.id, expected:'Wenn die Zusatzbedingung fehlt, darf nicht in den erfolgreichen Ablauf gewechselt werden.', routeLogicRequired:true }),
      edgeTarget(s,'e_payment_yes','a_info',{ fixCode:'ROUTE_ADDITIONAL_YES_EXECUTE_'+s.id, expected:'Wenn die Zusatzbedingung erfuellt ist, muss der Sonderfall ausgefuehrt werden.', routeLogicRequired:true }),
      edgeTarget(s,'e_final_no','n_end_success',{ fixCode:'ROUTE_FINAL_NO_NOT_SUCCESS_'+s.id, expected:'Wenn der Abschluss nicht bestaetigt ist, darf kein Erfolgsende erreicht werden.', routeLogicRequired:true }),
      edgeLabel(s,'e_special_yes','Nein',{ fixCode:'LABEL_SPECIAL_YES_'+s.id, expected:'Der Pfad in den Sonderfall muss mit „Ja“ beschriftet sein.' }),
      edgeLabel(s,'e_payment_no','Ja',{ fixCode:'LABEL_PAYMENT_NO_'+s.id, expected:'Der negative Pfad der Zusatzbedingung muss mit „Nein“ beschriftet sein.' }),
      edgeLabel(s,'e_final_yes','Nein',{ fixCode:'LABEL_FINAL_YES_'+s.id, expected:'Der erfolgreiche Abschluss muss mit „Ja“ beschriftet sein.' }),
      nodeLabel(s,'a_entry_fail',W('entryFailWrong','Vorgang trotzdem fortsetzen'),{ errorType:'ROUTE_LOGIC_BROKEN', fixCode:'CONTENT_ENTRY_FAIL_'+s.id, expected:'Bei fehlender Grundvoraussetzung muss der Vorgang abgelehnt oder sauber beendet werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_wait',W('waitWrong','Erfolg melden trotz fehlender Bereitschaft'),{ errorType:'IMPOSSIBLE_ACTION', fixCode:'CONTENT_WAIT_STATE_'+s.id, expected:'Wenn die Bereitschaft fehlt, muss gewartet, nachgefordert oder spaeter neu geprueft werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_block',W('blockWrong','Vorgang trotz falschem Zustand freigeben'),{ errorType:'IMPOSSIBLE_ACTION', fixCode:'CONTENT_BLOCK_STATE_'+s.id, expected:'Bei falscher Berechtigung oder falschem Zustand muss sicher gestoppt werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_info',W('infoWrong','Sonderfall ohne Zusatzbedingung abschliessen'),{ errorType:'ROUTE_LOGIC_BROKEN', fixCode:'CONTENT_INFO_STATE_'+s.id, expected:'Wenn die Zusatzbedingung fehlt, muss informiert, nachbearbeitet oder abgebrochen werden.', routeLogicRequired:true }),
      nodeLabel(s,'a_confirm',W('confirmWrong','Ergebnis bestaetigen, bevor der Sonderfall ausgefuehrt wurde'),{ errorType:'WRONG_SEQUENCE', fixCode:'CONTENT_CONFIRM_SEQUENCE_'+s.id, expected:'Die Bestaetigung darf erst nach der fachlich richtigen Ausfuehrung erfolgen.', routeLogicRequired:true }),
      nodeLabel(s,'a_normal_success',W('successWrong','Erfolg melden, bevor die Abschlusspruefung erfolgt'),{ errorType:'WRONG_SEQUENCE', fixCode:'CONTENT_SUCCESS_SEQUENCE_'+s.id, expected:'Ein Erfolg darf erst nach den erforderlichen Pruefungen und Abschlussbedingungen gemeldet werden.', routeLogicRequired:true })
    ];
  }

  function candidatesForScenario(s){
    if(!s || !s.id) throw new Error('candidatesForScenario braucht ein Szenario.');
    if(s.id === 'flow_master_postbote_nachnahme') return postboteMutations(s);
    if(s.id === 'flow_master_parksensor') return parksensorMutations(s);
    if(s.id === 'flow_master_login_2fa') return loginMutations(s);
    return genericMutations(s);
  }

  function validateMutation(s, mutation){
    var errors = [], warnings = [];
    function add(code, message, details){ errors.push({ code:code, message:message, details:details || null }); }
    function warn(code, message, details){ warnings.push({ code:code, message:message, details:details || null }); }
    var constants = schema().constants;
    var idx = schema().buildIndex(s);
    if(!mutation || typeof mutation !== 'object') add('MUTATION_NOT_OBJECT','Mutation muss ein Objekt sein.');
    if(mutation){
      if(!isString(mutation.id)) add('MUTATION_ID_MISSING','Mutation braucht stabile ID.');
      if(mutation.scenarioId !== s.id) add('MUTATION_SCENARIO_MISMATCH','Mutation gehoert nicht zu diesem Szenario.', { mutationScenario:mutation.scenarioId, scenario:s.id });
      if(constants.ERROR_CATEGORIES.indexOf(mutation.category) === -1) add('MUTATION_CATEGORY_INVALID','Kategorie ungueltig.', { category:mutation.category });
      if(constants.ERROR_TYPES.indexOf(mutation.errorType) === -1) add('MUTATION_ERROR_TYPE_INVALID','Fehlertyp ungueltig.', { errorType:mutation.errorType });
      if(!isString(mutation.fixCode)) add('MUTATION_FIXCODE_MISSING','fixCode fehlt.');
      if(!isString(mutation.expected)) add('MUTATION_EXPECTED_MISSING','Erwartete Korrektur fehlt.');
      if(mutation.targetType !== 'node' && mutation.targetType !== 'edge') add('MUTATION_TARGET_TYPE_INVALID','targetType muss node oder edge sein.', { targetType:mutation.targetType });
      if(mutation.targetType === 'node' && !idx.nodes[mutation.targetId]) add('MUTATION_TARGET_NODE_INVALID','Zielknoten existiert nicht.', { targetId:mutation.targetId });
      if(mutation.targetType === 'edge' && !idx.edges[mutation.targetId]) add('MUTATION_TARGET_EDGE_INVALID','Zielpfeil existiert nicht.', { targetId:mutation.targetId });
      if(!idx.zones[mutation.zone]) add('MUTATION_ZONE_INVALID','Zone existiert nicht.', { zone:mutation.zone });
      asArray(mutation.routes).forEach(function(routeId){ if(!idx.routes[routeId]) add('MUTATION_ROUTE_INVALID','Route existiert nicht.', { routeId:routeId }); });
      if(!Number.isInteger(mutation.grid) || mutation.grid < 1 || mutation.grid > idx.gridMax) add('MUTATION_GRID_INVALID','Rasterfeld der Mutation ist ungueltig.', { grid:mutation.grid, max:idx.gridMax });
      if(['SET_RENDERED_SHAPE','SET_RENDERED_TARGET','SET_RENDERED_LABEL','SET_RENDERED_EDGE_LABEL'].indexOf(mutation.operation) === -1){
        add('MUTATION_OPERATION_INVALID','Operation ist nicht erlaubt.', { operation:mutation.operation });
      }
      if(mutation.operation === 'SET_RENDERED_SHAPE'){
        if(mutation.targetType !== 'node') add('MUTATION_SHAPE_TARGET_NOT_NODE','Formfehler darf nur auf Knoten angewendet werden.');
        if(constants.NODE_SHAPES.indexOf(mutation.payload && mutation.payload.renderedShape) === -1) add('MUTATION_RENDERED_SHAPE_INVALID','renderedShape ungueltig.', mutation.payload);
      }
      if(mutation.operation === 'SET_RENDERED_TARGET'){
        if(mutation.targetType !== 'edge') add('MUTATION_TARGET_TARGET_NOT_EDGE','Pfeilziel-Fehler darf nur auf Kanten angewendet werden.');
        if(!idx.nodes[mutation.payload && mutation.payload.renderedTo]) add('MUTATION_RENDERED_TO_INVALID','renderedTo verweist auf unbekannten Knoten.', mutation.payload);
      }
      if(mutation.operation === 'SET_RENDERED_EDGE_LABEL'){
        if(mutation.targetType !== 'edge') add('MUTATION_LABEL_TARGET_NOT_EDGE','Pfeilbeschriftung darf nur auf Kanten angewendet werden.');
        if(typeof (mutation.payload && mutation.payload.renderedLabel) !== 'string') add('MUTATION_EDGE_LABEL_INVALID','renderedLabel muss Text sein.', mutation.payload);
      }
      if(mutation.operation === 'SET_RENDERED_LABEL'){
        if(mutation.targetType !== 'node') add('MUTATION_CONTENT_TARGET_NOT_NODE','Inhaltsfehler darf nur auf Knoten angewendet werden.');
        if(!isString(mutation.payload && mutation.payload.renderedLabel)) add('MUTATION_RENDERED_LABEL_INVALID','renderedLabel muss sichtbarer Text sein.', mutation.payload);
      }
      if(asArray(mutation.routes).length === 0) warn('MUTATION_ROUTES_EMPTY','Mutation ist keiner Route zugeordnet. Spaeter fuer Generator weniger wertvoll.', { id:mutation.id });
      if(!mutation.routeLogicRequired && mutation.category !== 'Form') warn('MUTATION_ROUTE_LOGIC_FLAG_LOW','Pfeil-/Inhaltsfehler sollte normalerweise Routenlogik erfordern.', { id:mutation.id });
    }
    return { ok:errors.length === 0, errors:errors, warnings:warnings };
  }

  function answerItemFromMutation(mutation){
    return {
      id: 'err_'+mutation.id.replace(/[^a-zA-Z0-9_]+/g,'_'),
      targetType: mutation.targetType,
      targetId: mutation.targetId,
      grid: mutation.grid,
      zone: mutation.zone,
      routes: asArray(mutation.routes).slice(),
      category: mutation.category,
      errorType: mutation.errorType,
      fixCode: mutation.fixCode,
      expected: mutation.expected,
      mutationId: mutation.id,
      routeLogicRequired: !!mutation.routeLogicRequired
    };
  }

  function applyMutation(scenario, mutationOrId){
    var s = clone(scenario);
    var candidates = candidatesForScenario(s);
    var mutation = typeof mutationOrId === 'string'
      ? candidates.filter(function(m){ return m.id === mutationOrId; })[0]
      : mutationOrId;
    if(!mutation) throw new Error('Mutation nicht gefunden: '+mutationOrId);
    var check = validateMutation(s, mutation);
    if(!check.ok){
      var err = new Error('Mutation ungueltig: '+mutation.id);
      err.report = check;
      throw err;
    }
    if(!Array.isArray(s.answerKey)) s.answerKey = [];
    if(s.answerKey.some(function(item){ return item && item.mutationId === mutation.id; })) throw new Error('Mutation bereits angewendet: '+mutation.id);
    if(s.answerKey.some(function(item){ return item && item.targetType === mutation.targetType && item.targetId === mutation.targetId; })) throw new Error('Fuer dieses Ziel existiert bereits ein Fehler: '+mutation.targetId);
    if(mutation.targetType === 'node'){
      var node = findNode(s, mutation.targetId);
      if(!node) throw new Error('Zielknoten fehlt beim Anwenden: '+mutation.targetId);
      if(mutation.operation === 'SET_RENDERED_SHAPE') node.renderedShape = mutation.payload.renderedShape;
      if(mutation.operation === 'SET_RENDERED_LABEL') node.renderedLabel = mutation.payload.renderedLabel;
    } else {
      var edge = findEdge(s, mutation.targetId);
      if(!edge) throw new Error('Zielpfeil fehlt beim Anwenden: '+mutation.targetId);
      if(mutation.operation === 'SET_RENDERED_TARGET') edge.renderedTo = mutation.payload.renderedTo;
      if(mutation.operation === 'SET_RENDERED_EDGE_LABEL') edge.renderedLabel = mutation.payload.renderedLabel;
    }
    s.answerKey.push(answerItemFromMutation(mutation));
    s.metadata = s.metadata || {};
    s.metadata.phase = Math.max(Number(s.metadata.phase || 0), 4);
    s.metadata.mutationReady = true;
    s.metadata.mutationsApplied = asArray(s.metadata.mutationsApplied).concat([mutation.id]);
    s.metadata.answerKeyMode = 'structured_fix_code';
    return s;
  }

  function applyMutationSet(scenario, idsOrMutations){
    return asArray(idsOrMutations).reduce(function(current, item){ return applyMutation(current, item); }, scenario);
  }

  function listAllCandidates(){
    var all = [];
    scenarios().getAll().forEach(function(s){ all = all.concat(candidatesForScenario(s)); });
    return all;
  }

  function validateLibrary(){
    var items = [];
    var allOk = true;
    scenarios().getAll().forEach(function(s){
      var candidates = candidatesForScenario(s);
      var reports = candidates.map(function(m){ return { id:m.id, report:validateMutation(s,m) }; });
      var ok = reports.every(function(r){ return r.report.ok; });
      allOk = allOk && ok;
      items.push({ scenarioId:s.id, total:candidates.length, ok:ok, reports:reports });
    });
    var ids = listAllCandidates().map(function(m){ return m.id; });
    var dupe = unique(ids);
    if(!dupe.ok) allOk = false;
    return { ok:allOk && dupe.ok, total:ids.length, duplicateIds:dupe.duplicates, items:items };
  }

  function summarizeByScenario(){
    return scenarios().getAll().map(function(s){
      var candidates = candidatesForScenario(s);
      var counts = { Form:0, Pfeil:0, Inhalt:0 };
      candidates.forEach(function(m){ counts[m.category] = (counts[m.category] || 0) + 1; });
      return { scenarioId:s.id, title:s.title, family:s.family, total:candidates.length, categories:counts, routeLogicRequired:candidates.filter(function(m){ return m.routeLogicRequired; }).length };
    });
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    candidatesForScenario: candidatesForScenario,
    listAllCandidates: listAllCandidates,
    validateMutation: validateMutation,
    validateLibrary: validateLibrary,
    applyMutation: applyMutation,
    applyMutationSet: applyMutationSet,
    answerItemFromMutation: answerItemFromMutation,
    summarizeByScenario: summarizeByScenario
  });

  window.FlowLogicMutations = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase4.mutation-api', 'Phase 4: Fehlerbibliothek-API vorhanden', function(t){
      t.assert(window.FlowLogicMutations && window.FlowLogicMutations.__version.indexOf('G39.26') !== -1, 'FlowLogicMutations fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicMutations.candidatesForScenario === 'function', 'candidatesForScenario fehlt.');
      t.assert(typeof window.FlowLogicMutations.applyMutation === 'function', 'applyMutation fehlt.');
      return { version:window.FlowLogicMutations.__version, total:window.FlowLogicMutations.listAllCandidates().length };
    }, { phase:'4', critical:true });

    window.FlowLogicSelfTest.register('phase4.library-valid', 'Phase 4: Alle Mutationen sind eindeutig bewertbar', function(t){
      var report = window.FlowLogicMutations.validateLibrary();
      t.assert(report.ok, 'Fehlerbibliothek enthaelt ungueltige Mutationen.', report);
      t.assert(report.total >= 30, 'Fehlerbibliothek muss fuer Phase 4 mindestens 30 Kandidaten enthalten.', report);
      return report;
    }, { phase:'4', critical:true });

    window.FlowLogicSelfTest.register('phase4.category-coverage', 'Phase 4: Jedes Master-Szenario hat Form/Pfeil/Inhalt-Kandidaten', function(t){
      var summary = window.FlowLogicMutations.summarizeByScenario();
      summary.forEach(function(item){
        t.assert(item.total >= 10, 'Szenario hat zu wenige Mutationskandidaten: '+item.scenarioId, item);
        t.assert(item.categories.Form >= 3, 'Szenario hat zu wenige Formfehler-Kandidaten: '+item.scenarioId, item);
        t.assert(item.categories.Pfeil >= 4, 'Szenario hat zu wenige Pfeilfehler-Kandidaten: '+item.scenarioId, item);
        t.assert(item.categories.Inhalt >= 2, 'Szenario hat zu wenige Inhaltsfehler-Kandidaten: '+item.scenarioId, item);
        t.assert(item.routeLogicRequired >= 5, 'Szenario hat zu wenige routenlogische Fehler: '+item.scenarioId, item);
      });
      return summary;
    }, { phase:'4', critical:true });

    window.FlowLogicSelfTest.register('phase4.apply-samples-validate-schema', 'Phase 4: Beispiel-Mutationen bleiben schema-valide und erzeugen Antwortschluessel', function(t){
      var samples = [];
      window.FlowLogicScenarios.getAll().forEach(function(s){
        var candidates = window.FlowLogicMutations.candidatesForScenario(s);
        var pick = [];
        ['Form','Pfeil','Inhalt'].forEach(function(cat){
          var item = candidates.filter(function(m){ return m.category === cat; })[0];
          if(item) pick.push(item);
        });
        var mutated = window.FlowLogicMutations.applyMutationSet(s, pick);
        var report = window.FlowLogicSchema.validateScenario(mutated);
        t.assert(report.ok, 'Mutiertes Szenario ist nicht schema-valide: '+s.id, { report:report, picked:pick.map(function(x){ return x.id; }) });
        t.assert(mutated.answerKey.length === pick.length, 'Antwortschluessel-Anzahl passt nicht: '+s.id, mutated.answerKey);
        mutated.answerKey.forEach(function(item){
          t.assert(item.fixCode && item.expected && item.category, 'Antwortschluessel ist unvollstaendig.', item);
        });
        samples.push({ scenarioId:s.id, applied:pick.map(function(x){ return x.id; }), answerKey:mutated.answerKey.length });
      });
      return samples;
    }, { phase:'4', critical:true });
  }
})();
