/* Ablaufplan-Detektiv · FlowLogic Master-Szenarien · Phase 3
   Drei geprüfte Prozesswelten für denselben Aufgabenmotor: Postbote/Nachnahme, Parksensor, Login/2FA.
   Noch kein Fehlergenerator: Diese Szenarien bilden den korrekten Ablauf, aus dem spätere Mutationen entstehen. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';

  function schema(){
    if(!window.FlowLogicSchema || typeof window.FlowLogicSchema.createEmptyScenario !== 'function'){
      throw new Error('FlowLogicScenarios braucht FlowLogicSchema vor dem Laden.');
    }
    return window.FlowLogicSchema;
  }
  function clone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function indexById(items){
    var map = Object.create(null);
    asArray(items).forEach(function(item){ if(item && item.id) map[item.id] = item; });
    return map;
  }
  function makeZones(labels){
    return labels.map(function(label, idx){
      var start = idx * 10 + 1;
      return { id:'z'+(idx+1), label:label, order:idx+1, gridRange:[start, start+9] };
    });
  }
  function node(id, label, kind, zone, grid){
    var shape = kind === 'decision' ? 'diamond' : ((kind === 'start' || kind === 'end') ? 'oval' : 'rectangle');
    return { id:id, label:label, kind:kind, correctShape:shape, renderedShape:shape, zone:zone, grid:grid };
  }
  function edge(id, from, to, label, grid){
    return { id:id, from:from, to:to, correctTo:to, renderedTo:to, label:label || '', grid:grid || null };
  }
  function condition(id, nodeId, yesEdge, noEdge, text){
    return { id:id, nodeId:nodeId, label:text || '', branches:{ yes:yesEdge, no:noEdge } };
  }
  function route(id, label, startNode, endNode, nodeIds, edgeIds, zoneIds, tags){
    return { id:id, label:label, startNode:startNode, endNode:endNode, nodeIds:nodeIds, edgeIds:edgeIds, zoneIds:zoneIds, tags:tags || [] };
  }
  function baseScenario(overrides){
    var s = schema().createEmptyScenario(overrides || {});
    s.schemaVersion = 1;
    s.grid = { cols:10, rows:7 };
    s.difficulty = 'ctc';
    s.objective = { errorCount:11, categories:['Form','Pfeil','Inhalt'], mode:'detect_errors' };
    s.answerKey = [];
    s.metadata = Object.assign({}, s.metadata || {}, {
      phase:3,
      generatorReady:false,
      rendererReady:false,
      scorerReady:false,
      masterScenario:true,
      minimumRoutes:7,
      minimumZones:7,
      note:'Korrektes Prozessmodell. Fehler-Mutationen folgen ab Phase 4/8.'
    });
    return s;
  }

  function makePostboteNachnahme(){
    var s = baseScenario({
      id:'flow_master_postbote_nachnahme',
      title:'Postbote mit Nachnahme, falschem Adressaten und Nebenrouten',
      family:'logistics',
      tags:['master','phase3','logistics','nachnahme','adressat','zahlung','nebenroute'],
      zones: makeZones([
        'Start / Sendung prüfen',
        'Adresse finden',
        'Türkontakt',
        'Adressat / Berechtigung',
        'Nachnahme / Zahlung',
        'Übergabe / Benachrichtigung',
        'Abschluss / Filiale'
      ])
    });
    s.nodes = [
      node('n_start','Start','start','z1',2),
      node('a_scan','Sendungsdaten prüfen','action','z1',5),
      node('q_address','Adresse gefunden?','decision','z2',14),
      node('a_return_base','Paket zurück zur Zustellbasis','action','z7',62),
      node('a_go_door','Zur Haustür gehen','action','z2',18),
      node('a_ring','Klingeln','action','z3',23),
      node('q_opens','Person öffnet?','decision','z3',27),
      node('a_notice_absent','Benachrichtigung einwerfen','action','z6',53),
      node('a_filiale','Paket zur Filiale bringen','action','z7',64),
      node('q_recipient','Richtiger Adressat?','decision','z4',34),
      node('q_neighbor','Nachbarannahme erlaubt?','decision','z4',39),
      node('a_no_handover','Paket nicht übergeben','action','z6',51),
      node('a_record_neighbor','Nachbar dokumentieren','action','z6',56),
      node('a_notice_neighbor','Benachrichtigung an Empfänger','action','z7',66),
      node('q_cod','Nachnahme erforderlich?','decision','z5',44),
      node('a_handover','Paket übergeben','action','z6',55),
      node('a_signature','Unterschrift erfassen','action','z7',67),
      node('a_amount','Betrag nennen','action','z5',45),
      node('q_money','Betrag vollständig bezahlt?','decision','z5',49),
      node('a_take_money','Geld entgegennehmen','action','z5',50),
      node('a_receipt','Zahlung quittieren','action','z6',60),
      node('a_payment_notice','Zahlungsinfo hinterlassen','action','z6',59),
      node('n_end_return','Ende: nicht zustellbar','end','z7',63),
      node('n_end_filiale','Ende: Filiale','end','z7',69),
      node('n_end_delivered','Ende: zugestellt','end','z7',70),
      node('n_end_neighbor','Ende: Nachbarannahme','end','z7',68)
    ];
    s.edges = [
      edge('e_start_scan','n_start','a_scan','',3),
      edge('e_scan_address','a_scan','q_address','',10),
      edge('e_address_no','q_address','a_return_base','Nein',24),
      edge('e_address_yes','q_address','a_go_door','Ja',15),
      edge('e_return_end','a_return_base','n_end_return','',63),
      edge('e_go_ring','a_go_door','a_ring','',22),
      edge('e_ring_opens','a_ring','q_opens','',26),
      edge('e_opens_no','q_opens','a_notice_absent','Nein',37),
      edge('e_absent_filiale','a_notice_absent','a_filiale','',54),
      edge('e_filiale_end','a_filiale','n_end_filiale','',65),
      edge('e_opens_yes','q_opens','q_recipient','Ja',33),
      edge('e_recipient_no','q_recipient','a_no_handover','Nein',43),
      edge('e_no_handover_neighbor','a_no_handover','q_neighbor','',52),
      edge('e_neighbor_yes','q_neighbor','a_record_neighbor','Ja',48),
      edge('e_neighbor_doc_notice','a_record_neighbor','a_notice_neighbor','',57),
      edge('e_notice_neighbor_end','a_notice_neighbor','n_end_neighbor','',67),
      edge('e_neighbor_no','q_neighbor','a_notice_absent','Nein',58),
      edge('e_recipient_yes','q_recipient','q_cod','Ja',40),
      edge('e_cod_no','q_cod','a_handover','Nein',46),
      edge('e_handover_signature','a_handover','a_signature','',61),
      edge('e_signature_end','a_signature','n_end_delivered','',69),
      edge('e_cod_yes','q_cod','a_amount','Ja',45),
      edge('e_amount_money','a_amount','q_money','',47),
      edge('e_money_no','q_money','a_payment_notice','Nein',59),
      edge('e_payment_notice_filiale','a_payment_notice','a_filiale','',60),
      edge('e_money_yes','q_money','a_take_money','Ja',50),
      edge('e_take_receipt','a_take_money','a_receipt','',60),
      edge('e_receipt_handover','a_receipt','a_handover','',61)
    ];
    s.conditions = [
      condition('c_address','q_address','e_address_yes','e_address_no','Ist die Adresse auffindbar?'),
      condition('c_opens','q_opens','e_opens_yes','e_opens_no','Öffnet eine Person die Tür?'),
      condition('c_recipient','q_recipient','e_recipient_yes','e_recipient_no','Stimmt die Person mit dem Empfänger überein?'),
      condition('c_neighbor','q_neighbor','e_neighbor_yes','e_neighbor_no','Ist eine Nachbarannahme laut Vorgabe erlaubt?'),
      condition('c_cod','q_cod','e_cod_yes','e_cod_no','Muss vor Übergabe bezahlt werden?'),
      condition('c_money','q_money','e_money_yes','e_money_no','Ist der Nachnahmebetrag vollständig bezahlt?')
    ];
    s.routes = [
      route('r_address_missing','Adresse nicht gefunden','n_start','n_end_return',['n_start','a_scan','q_address','a_return_base','n_end_return'],['e_start_scan','e_scan_address','e_address_no','e_return_end'],['z1','z2','z7'],['negative','early-end']),
      route('r_person_absent','Niemand öffnet','n_start','n_end_filiale',['n_start','a_scan','q_address','a_go_door','a_ring','q_opens','a_notice_absent','a_filiale','n_end_filiale'],['e_start_scan','e_scan_address','e_address_yes','e_go_ring','e_ring_opens','e_opens_no','e_absent_filiale','e_filiale_end'],['z1','z2','z3','z6','z7'],['negative','notice']),
      route('r_wrong_no_neighbor','Falscher Adressat ohne Nachbarannahme','n_start','n_end_filiale',['n_start','a_scan','q_address','a_go_door','a_ring','q_opens','q_recipient','a_no_handover','q_neighbor','a_notice_absent','a_filiale','n_end_filiale'],['e_start_scan','e_scan_address','e_address_yes','e_go_ring','e_ring_opens','e_opens_yes','e_recipient_no','e_no_handover_neighbor','e_neighbor_no','e_absent_filiale','e_filiale_end'],['z1','z2','z3','z4','z6','z7'],['negative','wrong-recipient']),
      route('r_wrong_neighbor_allowed','Falscher Adressat mit Nachbarannahme','n_start','n_end_neighbor',['n_start','a_scan','q_address','a_go_door','a_ring','q_opens','q_recipient','a_no_handover','q_neighbor','a_record_neighbor','a_notice_neighbor','n_end_neighbor'],['e_start_scan','e_scan_address','e_address_yes','e_go_ring','e_ring_opens','e_opens_yes','e_recipient_no','e_no_handover_neighbor','e_neighbor_yes','e_neighbor_doc_notice','e_notice_neighbor_end'],['z1','z2','z3','z4','z6','z7'],['neighbor','documentation']),
      route('r_normal_delivery','Richtiger Adressat, keine Nachnahme','n_start','n_end_delivered',['n_start','a_scan','q_address','a_go_door','a_ring','q_opens','q_recipient','q_cod','a_handover','a_signature','n_end_delivered'],['e_start_scan','e_scan_address','e_address_yes','e_go_ring','e_ring_opens','e_opens_yes','e_recipient_yes','e_cod_no','e_handover_signature','e_signature_end'],['z1','z2','z3','z4','z5','z6','z7'],['success','delivery']),
      route('r_cod_paid','Nachnahme bezahlt','n_start','n_end_delivered',['n_start','a_scan','q_address','a_go_door','a_ring','q_opens','q_recipient','q_cod','a_amount','q_money','a_take_money','a_receipt','a_handover','a_signature','n_end_delivered'],['e_start_scan','e_scan_address','e_address_yes','e_go_ring','e_ring_opens','e_opens_yes','e_recipient_yes','e_cod_yes','e_amount_money','e_money_yes','e_take_receipt','e_receipt_handover','e_handover_signature','e_signature_end'],['z1','z2','z3','z4','z5','z6','z7'],['success','payment']),
      route('r_cod_not_paid','Nachnahme nicht bezahlt','n_start','n_end_filiale',['n_start','a_scan','q_address','a_go_door','a_ring','q_opens','q_recipient','q_cod','a_amount','q_money','a_payment_notice','a_filiale','n_end_filiale'],['e_start_scan','e_scan_address','e_address_yes','e_go_ring','e_ring_opens','e_opens_yes','e_recipient_yes','e_cod_yes','e_amount_money','e_money_no','e_payment_notice_filiale','e_filiale_end'],['z1','z2','z3','z4','z5','z6','z7'],['negative','payment'])
    ];
    s.metadata.summary = 'Alltagslogistik mit Adressprüfung, falschem Adressaten, Nachnahme, Zahlung und Nebenrouten.';
    return s;
  }

  function makeParksensor(){
    var s = baseScenario({
      id:'flow_master_parksensor',
      title:'Parksensor beim Rückwärtsfahren',
      family:'sensor',
      tags:['master','phase3','sensor','fahrzeug','schwellenwert','warnlogik'],
      zones: makeZones([
        'Start / Fahrzustand',
        'Systemaktivierung',
        'Sensortest',
        'Abstandsmessung',
        'Gefahrenbewertung',
        'Warnung / Reaktion',
        'Abschluss / Fehlerzustand'
      ])
    });
    s.nodes = [
      node('n_start','Start','start','z1',2),
      node('q_reverse','Rückwärtsgang eingelegt?','decision','z1',5),
      node('n_end_off','Ende: System bleibt aus','end','z7',61),
      node('a_activate','Sensoren aktivieren','action','z2',14),
      node('q_selftest','Selbsttest erfolgreich?','decision','z3',23),
      node('a_error','Fehler anzeigen','action','z7',62),
      node('n_end_error','Ende: Werkstatt prüfen','end','z7',63),
      node('a_measure','Abstand messen','action','z4',34),
      node('q_obstacle','Hindernis erkannt?','decision','z4',37),
      node('a_monitor','Weiter Abstand überwachen','action','z4',39),
      node('n_end_monitor','Ende: kein Hindernis','end','z7',64),
      node('a_evaluate','Abstand bewerten','action','z5',45),
      node('q_critical','Abstand kritisch?','decision','z5',48),
      node('a_slow_beep','langsamer Warnton','action','z6',54),
      node('a_fast_beep','schneller Warnton / Dauerton','action','z6',56),
      node('q_brake','Fahrer bremst?','decision','z6',59),
      node('a_remind','Warnung fortsetzen','action','z6',60),
      node('q_distance_safe','Abstand wieder sicher?','decision','z5',49),
      node('n_end_safe','Ende: Abstand sicher','end','z7',69),
      node('n_end_warning','Ende: Warnung bleibt aktiv','end','z7',70)
    ];
    s.edges = [
      edge('e_start_reverse','n_start','q_reverse','',3),
      edge('e_reverse_no','q_reverse','n_end_off','Nein',15),
      edge('e_reverse_yes','q_reverse','a_activate','Ja',8),
      edge('e_activate_selftest','a_activate','q_selftest','',18),
      edge('e_selftest_no','q_selftest','a_error','Nein',33),
      edge('e_error_end','a_error','n_end_error','',62),
      edge('e_selftest_yes','q_selftest','a_measure','Ja',24),
      edge('e_measure_obstacle','a_measure','q_obstacle','',36),
      edge('e_obstacle_no','q_obstacle','a_monitor','Nein',38),
      edge('e_monitor_end','a_monitor','n_end_monitor','',50),
      edge('e_obstacle_yes','q_obstacle','a_evaluate','Ja',40),
      edge('e_evaluate_critical','a_evaluate','q_critical','',47),
      edge('e_critical_no','q_critical','a_slow_beep','Nein',52),
      edge('e_slow_safe','a_slow_beep','q_distance_safe','',55),
      edge('e_safe_yes','q_distance_safe','n_end_safe','Ja',59),
      edge('e_safe_no','q_distance_safe','a_measure','Nein',58),
      edge('e_critical_yes','q_critical','a_fast_beep','Ja',53),
      edge('e_fast_brake','a_fast_beep','q_brake','',57),
      edge('e_brake_yes','q_brake','a_measure','Ja',59),
      edge('e_brake_no','q_brake','a_remind','Nein',60),
      edge('e_remind_end','a_remind','n_end_warning','',70)
    ];
    s.conditions = [
      condition('c_reverse','q_reverse','e_reverse_yes','e_reverse_no','Ist der Rückwärtsgang aktiv?'),
      condition('c_selftest','q_selftest','e_selftest_yes','e_selftest_no','Arbeiten die Sensoren fehlerfrei?'),
      condition('c_obstacle','q_obstacle','e_obstacle_yes','e_obstacle_no','Wurde ein Hindernis erkannt?'),
      condition('c_critical','q_critical','e_critical_yes','e_critical_no','Ist der Abstand kritisch klein?'),
      condition('c_safe','q_distance_safe','e_safe_yes','e_safe_no','Ist der Abstand nach der Reaktion wieder sicher?'),
      condition('c_brake','q_brake','e_brake_yes','e_brake_no','Reagiert der Fahrer mit Bremsen?')
    ];
    s.routes = [
      route('r_not_reverse','Rückwärtsgang nicht aktiv','n_start','n_end_off',['n_start','q_reverse','n_end_off'],['e_start_reverse','e_reverse_no'],['z1','z7'],['inactive']),
      route('r_selftest_error','Sensorfehler beim Selbsttest','n_start','n_end_error',['n_start','q_reverse','a_activate','q_selftest','a_error','n_end_error'],['e_start_reverse','e_reverse_yes','e_activate_selftest','e_selftest_no','e_error_end'],['z1','z2','z3','z7'],['error']),
      route('r_no_obstacle','Kein Hindernis erkannt','n_start','n_end_monitor',['n_start','q_reverse','a_activate','q_selftest','a_measure','q_obstacle','a_monitor','n_end_monitor'],['e_start_reverse','e_reverse_yes','e_activate_selftest','e_selftest_yes','e_measure_obstacle','e_obstacle_no','e_monitor_end'],['z1','z2','z3','z4','z7'],['normal']),
      route('r_obstacle_not_critical_safe','Hindernis, aber Abstand wird sicher','n_start','n_end_safe',['n_start','q_reverse','a_activate','q_selftest','a_measure','q_obstacle','a_evaluate','q_critical','a_slow_beep','q_distance_safe','n_end_safe'],['e_start_reverse','e_reverse_yes','e_activate_selftest','e_selftest_yes','e_measure_obstacle','e_obstacle_yes','e_evaluate_critical','e_critical_no','e_slow_safe','e_safe_yes'],['z1','z2','z3','z4','z5','z6','z7'],['warning','safe']),
      route('r_obstacle_not_critical_recheck','Hindernis, Abstand bleibt unsicher','n_start','a_measure',['n_start','q_reverse','a_activate','q_selftest','a_measure','q_obstacle','a_evaluate','q_critical','a_slow_beep','q_distance_safe','a_measure'],['e_start_reverse','e_reverse_yes','e_activate_selftest','e_selftest_yes','e_measure_obstacle','e_obstacle_yes','e_evaluate_critical','e_critical_no','e_slow_safe','e_safe_no'],['z1','z2','z3','z4','z5','z6'],['loop','recheck']),
      route('r_critical_driver_brakes','Kritischer Abstand, Fahrer bremst','n_start','a_measure',['n_start','q_reverse','a_activate','q_selftest','a_measure','q_obstacle','a_evaluate','q_critical','a_fast_beep','q_brake','a_measure'],['e_start_reverse','e_reverse_yes','e_activate_selftest','e_selftest_yes','e_measure_obstacle','e_obstacle_yes','e_evaluate_critical','e_critical_yes','e_fast_brake','e_brake_yes'],['z1','z2','z3','z4','z5','z6'],['critical','loop']),
      route('r_critical_no_brake','Kritischer Abstand, keine Bremsreaktion','n_start','n_end_warning',['n_start','q_reverse','a_activate','q_selftest','a_measure','q_obstacle','a_evaluate','q_critical','a_fast_beep','q_brake','a_remind','n_end_warning'],['e_start_reverse','e_reverse_yes','e_activate_selftest','e_selftest_yes','e_measure_obstacle','e_obstacle_yes','e_evaluate_critical','e_critical_yes','e_fast_brake','e_brake_no','e_remind_end'],['z1','z2','z3','z4','z5','z6','z7'],['critical','warning'])
    ];
    s.metadata.summary = 'Technische Sensorlogik mit Aktivierung, Selbsttest, Messung, Schwellenwerten, Warnsignal und Fahrerreaktion.';
    return s;
  }

  function makeLogin2FA(){
    var s = baseScenario({
      id:'flow_master_login_2fa',
      title:'App-Login mit Sperre, Passwortprüfung und 2FA',
      family:'it',
      tags:['master','phase3','it','login','2fa','sicherheit','konto'],
      zones: makeZones([
        'Start / Eingabe',
        'Konto prüfen',
        'Passwort prüfen',
        'Sperrstatus / Versuche',
        '2FA-Prüfung',
        'Zugriff / Wiederherstellung',
        'Abschluss / Sicherheit'
      ])
    });
    s.nodes = [
      node('n_start','Start','start','z1',2),
      node('a_open','Loginmaske öffnen','action','z1',5),
      node('q_input','E-Mail und Passwort eingegeben?','decision','z1',8),
      node('a_prompt_input','Eingabe nachfordern','action','z6',51),
      node('n_end_missing','Ende: Eingabe fehlt','end','z7',61),
      node('q_account','Konto vorhanden?','decision','z2',15),
      node('a_unknown','Fehlermeldung anzeigen','action','z6',52),
      node('n_end_unknown','Ende: Konto unbekannt','end','z7',62),
      node('q_locked','Konto gesperrt?','decision','z4',35),
      node('a_locked','Sperrhinweis anzeigen','action','z7',63),
      node('n_end_locked','Ende: gesperrt','end','z7',64),
      node('q_password','Passwort korrekt?','decision','z3',25),
      node('q_attempts','Versuche übrig?','decision','z4',38),
      node('a_attempt_minus','Fehlversuch zählen','action','z4',39),
      node('a_lock_account','Konto sperren','action','z7',65),
      node('q_2fa_required','2FA erforderlich?','decision','z5',44),
      node('a_send_code','Code senden','action','z5',45),
      node('q_code','Code korrekt?','decision','z5',49),
      node('a_access','Zugriff freigeben','action','z6',56),
      node('n_end_success','Ende: eingeloggt','end','z7',70),
      node('a_deny','Login ablehnen','action','z6',58),
      node('q_reset','Passwort-Reset anbieten?','decision','z6',59),
      node('a_reset_mail','Reset-Link senden','action','z6',60),
      node('n_end_failed','Ende: nicht eingeloggt','end','z7',69)
    ];
    s.edges = [
      edge('e_start_open','n_start','a_open','',3),
      edge('e_open_input','a_open','q_input','',6),
      edge('e_input_no','q_input','a_prompt_input','Nein',20),
      edge('e_prompt_end','a_prompt_input','n_end_missing','',61),
      edge('e_input_yes','q_input','q_account','Ja',10),
      edge('e_account_no','q_account','a_unknown','Nein',24),
      edge('e_unknown_end','a_unknown','n_end_unknown','',62),
      edge('e_account_yes','q_account','q_locked','Ja',21),
      edge('e_locked_yes','q_locked','a_locked','Ja',40),
      edge('e_locked_end','a_locked','n_end_locked','',63),
      edge('e_locked_no','q_locked','q_password','Nein',36),
      edge('e_password_yes','q_password','q_2fa_required','Ja',34),
      edge('e_password_no','q_password','q_attempts','Nein',28),
      edge('e_attempts_yes','q_attempts','a_attempt_minus','Ja',39),
      edge('e_attempt_minus_deny','a_attempt_minus','a_deny','',48),
      edge('e_attempts_no','q_attempts','a_lock_account','Nein',49),
      edge('e_lock_locked','a_lock_account','a_locked','',59),
      edge('e_2fa_no','q_2fa_required','a_access','Nein',54),
      edge('e_access_end','a_access','n_end_success','',68),
      edge('e_2fa_yes','q_2fa_required','a_send_code','Ja',45),
      edge('e_send_code','a_send_code','q_code','',47),
      edge('e_code_yes','q_code','a_access','Ja',55),
      edge('e_code_no','q_code','a_deny','Nein',57),
      edge('e_deny_reset','a_deny','q_reset','',58),
      edge('e_reset_yes','q_reset','a_reset_mail','Ja',60),
      edge('e_reset_mail_end','a_reset_mail','n_end_failed','',69),
      edge('e_reset_no','q_reset','n_end_failed','Nein',67)
    ];
    s.conditions = [
      condition('c_input','q_input','e_input_yes','e_input_no','Wurden Login-Daten eingegeben?'),
      condition('c_account','q_account','e_account_yes','e_account_no','Ist die E-Mail einem Konto zugeordnet?'),
      condition('c_locked','q_locked','e_locked_yes','e_locked_no','Ist das Konto bereits gesperrt?'),
      condition('c_password','q_password','e_password_yes','e_password_no','Stimmt das Passwort?'),
      condition('c_attempts','q_attempts','e_attempts_yes','e_attempts_no','Sind noch Fehlversuche erlaubt?'),
      condition('c_2fa','q_2fa_required','e_2fa_yes','e_2fa_no','Ist für dieses Konto 2FA aktiv?'),
      condition('c_code','q_code','e_code_yes','e_code_no','Ist der 2FA-Code korrekt?'),
      condition('c_reset','q_reset','e_reset_yes','e_reset_no','Soll Wiederherstellung angeboten werden?')
    ];
    s.routes = [
      route('r_missing_input','Eingabe fehlt','n_start','n_end_missing',['n_start','a_open','q_input','a_prompt_input','n_end_missing'],['e_start_open','e_open_input','e_input_no','e_prompt_end'],['z1','z6','z7'],['negative','input']),
      route('r_unknown_account','Konto unbekannt','n_start','n_end_unknown',['n_start','a_open','q_input','q_account','a_unknown','n_end_unknown'],['e_start_open','e_open_input','e_input_yes','e_account_no','e_unknown_end'],['z1','z2','z6','z7'],['negative','account']),
      route('r_already_locked','Konto bereits gesperrt','n_start','n_end_locked',['n_start','a_open','q_input','q_account','q_locked','a_locked','n_end_locked'],['e_start_open','e_open_input','e_input_yes','e_account_yes','e_locked_yes','e_locked_end'],['z1','z2','z4','z7'],['security','locked']),
      route('r_wrong_password_attempts_left','Falsches Passwort, Versuch übrig','n_start','n_end_failed',['n_start','a_open','q_input','q_account','q_locked','q_password','q_attempts','a_attempt_minus','a_deny','q_reset','n_end_failed'],['e_start_open','e_open_input','e_input_yes','e_account_yes','e_locked_no','e_password_no','e_attempts_yes','e_attempt_minus_deny','e_deny_reset','e_reset_no'],['z1','z2','z3','z4','z6','z7'],['negative','attempts']),
      route('r_wrong_password_lock','Falsches Passwort, Konto sperren','n_start','n_end_locked',['n_start','a_open','q_input','q_account','q_locked','q_password','q_attempts','a_lock_account','a_locked','n_end_locked'],['e_start_open','e_open_input','e_input_yes','e_account_yes','e_locked_no','e_password_no','e_attempts_no','e_lock_locked','e_locked_end'],['z1','z2','z3','z4','z7'],['security','lock']),
      route('r_success_no_2fa','Login erfolgreich ohne 2FA','n_start','n_end_success',['n_start','a_open','q_input','q_account','q_locked','q_password','q_2fa_required','a_access','n_end_success'],['e_start_open','e_open_input','e_input_yes','e_account_yes','e_locked_no','e_password_yes','e_2fa_no','e_access_end'],['z1','z2','z3','z4','z5','z6','z7'],['success']),
      route('r_success_with_2fa','Login erfolgreich mit 2FA','n_start','n_end_success',['n_start','a_open','q_input','q_account','q_locked','q_password','q_2fa_required','a_send_code','q_code','a_access','n_end_success'],['e_start_open','e_open_input','e_input_yes','e_account_yes','e_locked_no','e_password_yes','e_2fa_yes','e_send_code','e_code_yes','e_access_end'],['z1','z2','z3','z4','z5','z6','z7'],['success','2fa']),
      route('r_2fa_wrong_reset','2FA falsch, Reset anbieten','n_start','n_end_failed',['n_start','a_open','q_input','q_account','q_locked','q_password','q_2fa_required','a_send_code','q_code','a_deny','q_reset','a_reset_mail','n_end_failed'],['e_start_open','e_open_input','e_input_yes','e_account_yes','e_locked_no','e_password_yes','e_2fa_yes','e_send_code','e_code_no','e_deny_reset','e_reset_yes','e_reset_mail_end'],['z1','z2','z3','z4','z5','z6','z7'],['negative','2fa','reset'])
    ];
    s.metadata.summary = 'IT-Sicherheitslogik mit Eingaben, Kontoexistenz, Sperre, Fehlversuchen, 2FA und Wiederherstellung.';
    return s;
  }


  function makeGenericProcessScenario(cfg){
    cfg = cfg || {};
    var labels = cfg.labels || {};
    function L(key, fallback){ return labels[key] || fallback; }
    var s = baseScenario({
      id: cfg.id,
      title: cfg.title,
      family: cfg.family || 'daily-life',
      tags: ['master','phase10','scenario-pool'].concat(cfg.tags || []),
      zones: makeZones(cfg.zones || [
        'Start / Auftrag erfassen',
        'Voraussetzung pruefen',
        'Bereitschaft / Verfuegbarkeit',
        'Berechtigung / Zustand',
        'Sonderfall / Zusatzpruefung',
        'Ausfuehrung / Reaktion',
        'Abschluss / Fehlerbehandlung'
      ])
    });
    s.nodes = [
      node('n_start','Start','start','z1',2),
      node('a_start',L('a_start','Ausgangsdaten pruefen'),'action','z1',5),
      node('q_entry',L('q_entry','Grundvoraussetzung erfuellt?'),'decision','z2',14),
      node('a_prepare',L('a_prepare','naechsten Schritt vorbereiten'),'action','z2',18),
      node('q_ready',L('q_ready','System / Person bereit?'),'decision','z3',23),
      node('a_wait',L('a_wait','Warten und spaeter erneut pruefen'),'action','z6',51),
      node('n_end_wait',L('n_end_wait','Ende: spaeter erneut versuchen'),'end','z7',61),
      node('q_identity',L('q_identity','Berechtigung / Zustand korrekt?'),'decision','z4',34),
      node('a_entry_fail',L('a_entry_fail','Vorgang ablehnen'),'action','z6',52),
      node('a_block',L('a_block','Vorgang sicher stoppen'),'action','z6',56),
      node('n_end_reject',L('n_end_reject','Ende: abgelehnt'),'end','z7',62),
      node('n_end_error',L('n_end_error','Ende: Fehlerzustand'),'end','z7',63),
      node('q_special',L('q_special','Sonderfall vorhanden?'),'decision','z5',44),
      node('a_normal_success',L('a_normal_success','normalen Ablauf ausfuehren'),'action','z6',55),
      node('a_special_prepare',L('a_special_prepare','Sonderfall vorbereiten'),'action','z5',45),
      node('q_payment',L('q_payment','Zusatzbedingung erfuellt?'),'decision','z5',49),
      node('a_special_action',L('a_special_action','Sonderfall ausfuehren'),'action','z5',50),
      node('a_info',L('a_info','Information hinterlegen'),'action','z6',59),
      node('a_confirm',L('a_confirm','Ergebnis bestaetigen'),'action','z6',60),
      node('q_final',L('q_final','Abschluss erfolgreich?'),'decision','z6',57),
      node('a_support',L('a_support','Pruefung an Fachstelle geben'),'action','z6',67),
      node('n_end_review',L('n_end_review','Ende: Nachbearbeitung'),'end','z7',69),
      node('n_end_success',L('n_end_success','Ende: erfolgreich'),'end','z7',70)
    ];
    s.edges = [
      edge('e_start_action','n_start','a_start','',3),
      edge('e_action_entry','a_start','q_entry','',10),
      edge('e_entry_no','q_entry','a_entry_fail','Nein',24),
      edge('e_entry_fail_end','a_entry_fail','n_end_reject','',62),
      edge('e_entry_yes','q_entry','a_prepare','Ja',15),
      edge('e_prepare_ready','a_prepare','q_ready','',22),
      edge('e_ready_no','q_ready','a_wait','Nein',33),
      edge('e_wait_end','a_wait','n_end_wait','',61),
      edge('e_ready_yes','q_ready','q_identity','Ja',26),
      edge('e_identity_no','q_identity','a_block','Nein',43),
      edge('e_block_end','a_block','n_end_error','',63),
      edge('e_identity_yes','q_identity','q_special','Ja',40),
      edge('e_special_no','q_special','a_normal_success','Nein',46),
      edge('e_normal_final','a_normal_success','q_final','',55),
      edge('e_special_yes','q_special','a_special_prepare','Ja',45),
      edge('e_special_payment','a_special_prepare','q_payment','',47),
      edge('e_payment_no','q_payment','a_info','Nein',58),
      edge('e_info_review','a_info','n_end_review','',69),
      edge('e_payment_yes','q_payment','a_special_action','Ja',50),
      edge('e_special_confirm','a_special_action','a_confirm','',59),
      edge('e_confirm_final','a_confirm','q_final','',60),
      edge('e_final_yes','q_final','n_end_success','Ja',68),
      edge('e_final_no','q_final','a_support','Nein',66),
      edge('e_support_error','a_support','n_end_error','',67)
    ];
    s.conditions = [
      condition('c_entry','q_entry','e_entry_yes','e_entry_no',L('c_entry','Ist die Grundvoraussetzung erfuellt?')),
      condition('c_ready','q_ready','e_ready_yes','e_ready_no',L('c_ready','Ist der Ablauf bereit fuer den naechsten Schritt?')),
      condition('c_identity','q_identity','e_identity_yes','e_identity_no',L('c_identity','Ist Berechtigung oder Zustand korrekt?')),
      condition('c_special','q_special','e_special_yes','e_special_no',L('c_special','Liegt ein Sonderfall vor?')),
      condition('c_payment','q_payment','e_payment_yes','e_payment_no',L('c_payment','Ist die Zusatzbedingung erfuellt?')),
      condition('c_final','q_final','e_final_yes','e_final_no',L('c_final','Ist der Abschluss wirklich erfolgreich?'))
    ];
    s.routes = [
      route('r_entry_reject',L('r_entry_reject','Grundvoraussetzung fehlt'),'n_start','n_end_reject',['n_start','a_start','q_entry','a_entry_fail','n_end_reject'],['e_start_action','e_action_entry','e_entry_no','e_entry_fail_end'],['z1','z2','z6','z7'],['negative','entry']),
      route('r_not_ready',L('r_not_ready','Bereitschaft fehlt'),'n_start','n_end_wait',['n_start','a_start','q_entry','a_prepare','q_ready','a_wait','n_end_wait'],['e_start_action','e_action_entry','e_entry_yes','e_prepare_ready','e_ready_no','e_wait_end'],['z1','z2','z3','z6','z7'],['negative','wait']),
      route('r_identity_block',L('r_identity_block','Berechtigung oder Zustand falsch'),'n_start','n_end_error',['n_start','a_start','q_entry','a_prepare','q_ready','q_identity','a_block','n_end_error'],['e_start_action','e_action_entry','e_entry_yes','e_prepare_ready','e_ready_yes','e_identity_no','e_block_end'],['z1','z2','z3','z4','z6','z7'],['security','block']),
      route('r_normal_success',L('r_normal_success','Normaler erfolgreicher Ablauf'),'n_start','n_end_success',['n_start','a_start','q_entry','a_prepare','q_ready','q_identity','q_special','a_normal_success','q_final','n_end_success'],['e_start_action','e_action_entry','e_entry_yes','e_prepare_ready','e_ready_yes','e_identity_yes','e_special_no','e_normal_final','e_final_yes'],['z1','z2','z3','z4','z5','z6','z7'],['success','normal']),
      route('r_special_missing',L('r_special_missing','Sonderfall ohne Zusatzbedingung'),'n_start','n_end_review',['n_start','a_start','q_entry','a_prepare','q_ready','q_identity','q_special','a_special_prepare','q_payment','a_info','n_end_review'],['e_start_action','e_action_entry','e_entry_yes','e_prepare_ready','e_ready_yes','e_identity_yes','e_special_yes','e_special_payment','e_payment_no','e_info_review'],['z1','z2','z3','z4','z5','z6','z7'],['negative','special']),
      route('r_special_success',L('r_special_success','Sonderfall erfolgreich'),'n_start','n_end_success',['n_start','a_start','q_entry','a_prepare','q_ready','q_identity','q_special','a_special_prepare','q_payment','a_special_action','a_confirm','q_final','n_end_success'],['e_start_action','e_action_entry','e_entry_yes','e_prepare_ready','e_ready_yes','e_identity_yes','e_special_yes','e_special_payment','e_payment_yes','e_special_confirm','e_confirm_final','e_final_yes'],['z1','z2','z3','z4','z5','z6','z7'],['success','special']),
      route('r_final_support',L('r_final_support','Abschluss nicht bestaetigt'),'n_start','n_end_error',['n_start','a_start','q_entry','a_prepare','q_ready','q_identity','q_special','a_special_prepare','q_payment','a_special_action','a_confirm','q_final','a_support','n_end_error'],['e_start_action','e_action_entry','e_entry_yes','e_prepare_ready','e_ready_yes','e_identity_yes','e_special_yes','e_special_payment','e_payment_yes','e_special_confirm','e_confirm_final','e_final_no','e_support_error'],['z1','z2','z3','z4','z5','z6','z7'],['review','support'])
    ];
    s.metadata.summary = cfg.summary || 'Generisches Phase-10-Prozessmodell mit mehreren Routen, Nebenwegen und eindeutigem Antwortschema.';
    s.metadata.flowlogicLabels = {
      entryFailWrong: L('wrong_entry_fail','Vorgang trotzdem fortsetzen'),
      waitWrong: L('wrong_wait','Erfolgreich abschliessen ohne Bereitschaft'),
      blockWrong: L('wrong_block','Vorgang trotz falschem Zustand freigeben'),
      infoWrong: L('wrong_info','Sonderfall ohne Zusatzbedingung abschliessen'),
      confirmWrong: L('wrong_confirm','Ergebnis bestaetigen, bevor der Sonderfall ausgefuehrt wurde'),
      successWrong: L('wrong_success','Erfolg melden, bevor die Abschlusspruefung erfolgt')
    };
    return s;
  }

  function makePasswordReset(){
    return makeGenericProcessScenario({
      id:'flow_master_passwort_reset', title:'Passwort vergessen mit abgelaufenem Link und Sicherheitspruefung', family:'it',
      tags:['it','password','reset','security','phase10'],
      zones:['Start / Anfrage','Konto pruefen','E-Mail / Versand','Sicherheitsstatus','Link / Token','Neues Passwort','Abschluss / Sperre'],
      labels:{
        a_start:'Reset-Anfrage erfassen', q_entry:'E-Mail-Adresse bekannt?', a_prepare:'Reset-Link vorbereiten', q_ready:'Mailversand moeglich?', a_wait:'Versand spaeter erneut versuchen', q_identity:'Konto nicht gesperrt?', a_block:'Sperrhinweis anzeigen', q_special:'Reset-Link angefordert?', a_normal_success:'Login unveraendert lassen', a_special_prepare:'Reset-Link senden', q_payment:'Reset-Link noch gueltig?', a_special_action:'Neues Passwort setzen', a_info:'Neuen Link anfordern', a_confirm:'Passwortaenderung speichern', q_final:'Passwortregeln erfuellt?', a_support:'Support-Freigabe anfordern', n_end_reject:'Ende: Konto unbekannt', n_end_wait:'Ende: Mail wartet', n_end_error:'Ende: Sicherheitsstopp', n_end_review:'Ende: neuer Link noetig', n_end_success:'Ende: Passwort geaendert',
        c_entry:'Ist die E-Mail einem Konto zugeordnet?', c_ready:'Kann die Reset-Mail versendet werden?', c_identity:'Ist das Konto nicht gesperrt?', c_special:'Wurde wirklich ein Reset angefordert?', c_payment:'Ist der Reset-Link noch gueltig?', c_final:'Erfuellt das neue Passwort alle Regeln?',
        r_entry_reject:'E-Mail unbekannt', r_not_ready:'Mailversand nicht moeglich', r_identity_block:'Konto gesperrt', r_normal_success:'Kein Reset notwendig', r_special_missing:'Reset-Link abgelaufen', r_special_success:'Passwort erfolgreich geaendert', r_final_support:'Passwortregeln verletzt',
        wrong_entry_fail:'Reset-Link an unbekannte Adresse senden', wrong_wait:'Passwort ohne Mailversand aendern', wrong_block:'Gesperrtes Konto direkt entsperren', wrong_info:'Abgelaufenen Link trotzdem akzeptieren', wrong_confirm:'Passwort speichern vor Regelpruefung', wrong_success:'Login freigeben vor Passwortaenderung'
      },
      summary:'IT-Prozess fuer Passwort-Reset mit Kontoexistenz, Mailversand, Sperrstatus, Token-Gültigkeit und Passwortregeln.'
    });
  }

  function makeRouterDiagnose(){
    return makeGenericProcessScenario({
      id:'flow_master_router_diagnose', title:'Router-Diagnose mit IP-, DNS- und WLAN-Pruefung', family:'it',
      tags:['it','router','dns','network','phase10'],
      zones:['Start / Stoerung','Strom / Verbindung','WAN / Link','IP / DHCP','DNS / Routing','WLAN / Endgeraet','Abschluss / Provider'],
      labels:{
        a_start:'Stoerungsmeldung aufnehmen', q_entry:'Router hat Strom?', a_prepare:'Kabel / WAN-Port pruefen', q_ready:'WAN-Link aktiv?', a_wait:'Linkstatus beobachten', q_identity:'IP-Adresse erhalten?', a_block:'DHCP/WAN-Fehler melden', q_special:'DNS-Test erforderlich?', a_normal_success:'Verbindung testen', a_special_prepare:'DNS-Aufloesung pruefen', q_payment:'DNS antwortet korrekt?', a_special_action:'DNS korrigieren', a_info:'Providerstoerung dokumentieren', a_confirm:'Endgeraet erneut verbinden', q_final:'Internet erreichbar?', a_support:'Provider-Support einschalten', n_end_reject:'Ende: kein Strom', n_end_wait:'Ende: Link abwarten', n_end_error:'Ende: Netzfehler', n_end_review:'Ende: Provider prueft', n_end_success:'Ende: Verbindung stabil',
        c_entry:'Ist der Router eingeschaltet?', c_ready:'Ist die Leitung physisch verbunden?', c_identity:'Wurde eine gueltige IP bezogen?', c_special:'Muss DNS separat geprueft werden?', c_payment:'Loest DNS Namen korrekt auf?', c_final:'Erreicht das Endgeraet das Internet?',
        r_entry_reject:'Router ohne Strom', r_not_ready:'WAN-Link nicht aktiv', r_identity_block:'Keine IP-Adresse', r_normal_success:'Direkte Verbindung erfolgreich', r_special_missing:'DNS/Providerstoerung', r_special_success:'DNS korrigiert', r_final_support:'Internet weiterhin nicht erreichbar',
        wrong_entry_fail:'Internetzugang ohne Strom testen', wrong_wait:'Linkfehler als erledigt markieren', wrong_block:'Ohne IP direkt DNS testen', wrong_info:'Providerstoerung ignorieren', wrong_confirm:'Endgeraet verbinden vor DNS-Korrektur', wrong_success:'Erfolg melden vor Internet-Test'
      },
      summary:'FISI-nahes Diagnosemodell mit Strom, WAN, DHCP/IP, DNS, Endgeraet und Provider-Eskalation.'
    });
  }

  function makeTicketautomat(){
    return makeGenericProcessScenario({
      id:'flow_master_ticketautomat', title:'Ticketautomat mit Tarifwahl, Zahlung und Rueckgeld', family:'payment',
      tags:['payment','automat','ticket','geld','phase10'],
      zones:['Start / Auswahl','Tarif pruefen','Drucker / Vorrat','Zahlung','Rueckgeld / Sonderfall','Ticketausgabe','Abschluss / Stoerung'],
      labels:{
        a_start:'Ziel und Ticketart erfassen', q_entry:'Tarif gueltig?', a_prepare:'Preis berechnen', q_ready:'Automat betriebsbereit?', a_wait:'Wartung / erneuter Versuch', q_identity:'Zahlungsmittel akzeptiert?', a_block:'Zahlung ablehnen', q_special:'Rueckgeld erforderlich?', a_normal_success:'Ticket drucken', a_special_prepare:'Rueckgeld berechnen', q_payment:'Genug Wechselgeld vorhanden?', a_special_action:'Rueckgeld ausgeben', a_info:'Rueckgeldbeleg ausgeben', a_confirm:'Ticket und Zahlung bestaetigen', q_final:'Ticket gedruckt?', a_support:'Stoerung melden', n_end_reject:'Ende: Tarif ungueltig', n_end_wait:'Ende: Automat wartet', n_end_error:'Ende: Stoerung', n_end_review:'Ende: Beleg/Nachbearbeitung', n_end_success:'Ende: Ticket gekauft',
        c_entry:'Ist der gewaehlte Tarif gueltig?', c_ready:'Ist der Automat betriebsbereit?', c_identity:'Wurde ein akzeptiertes Zahlungsmittel genutzt?', c_special:'Muss Rueckgeld ausgegeben werden?', c_payment:'Ist genug Wechselgeld vorhanden?', c_final:'Wurde das Ticket wirklich gedruckt?',
        r_entry_reject:'Tarif ungueltig', r_not_ready:'Automat nicht bereit', r_identity_block:'Zahlungsmittel abgelehnt', r_normal_success:'Passende Zahlung ohne Rueckgeld', r_special_missing:'Rueckgeld fehlt', r_special_success:'Rueckgeld ausgegeben', r_final_support:'Ticketdruck fehlgeschlagen',
        wrong_entry_fail:'Ticket trotz ungueltigem Tarif drucken', wrong_wait:'Defekten Automaten als bezahlt markieren', wrong_block:'Unbekanntes Zahlungsmittel annehmen', wrong_info:'Rueckgeldfehler ignorieren', wrong_confirm:'Kauf bestaetigen vor Ticketdruck', wrong_success:'Erfolg melden ohne Ticket'
      },
      summary:'Zahlungslogik am Automaten mit Tarif, Betriebsstatus, Zahlungsmittel, Rueckgeld und Druckkontrolle.'
    });
  }

  function makeIndustrieMaschine(){
    return makeGenericProcessScenario({
      id:'flow_master_industrie_maschine', title:'Industrie-Maschine starten mit Material, Schutzhaube und Not-Aus', family:'industry',
      tags:['industry','machine','safety','production','phase10'],
      zones:['Start / Auftrag','Material','Sicherheit','Freigabe','Produktion','Kontrolle','Abschluss / Stoerung'],
      labels:{
        a_start:'Produktionsauftrag laden', q_entry:'Material vorhanden?', a_prepare:'Werkzeug einrichten', q_ready:'Schutzhaube geschlossen?', a_wait:'Materialnachschub anfordern', q_identity:'Not-Aus frei?', a_block:'Maschine sicher stoppen', q_special:'Qualitaetspruefung noetig?', a_normal_success:'Produktion starten', a_special_prepare:'Pruefprogramm aktivieren', q_payment:'Messwerte innerhalb Toleranz?', a_special_action:'Teil freigeben', a_info:'Teil aussortieren', a_confirm:'Charge dokumentieren', q_final:'Produktion stabil?', a_support:'Instandhaltung informieren', n_end_reject:'Ende: kein Material', n_end_wait:'Ende: wartet auf Material', n_end_error:'Ende: Sicherheitsstopp', n_end_review:'Ende: Ausschuss', n_end_success:'Ende: Produktion laeuft',
        c_entry:'Ist ausreichend Material vorhanden?', c_ready:'Ist die Schutzhaube geschlossen?', c_identity:'Ist der Not-Aus nicht aktiv?', c_special:'Muss eine Qualitaetspruefung erfolgen?', c_payment:'Liegen die Messwerte in Toleranz?', c_final:'Laeuft die Produktion stabil?',
        r_entry_reject:'Kein Material', r_not_ready:'Schutzhaube offen', r_identity_block:'Not-Aus aktiv', r_normal_success:'Produktion ohne Sonderpruefung', r_special_missing:'Toleranz verletzt', r_special_success:'Qualitaetspruefung bestanden', r_final_support:'Instabiler Lauf',
        wrong_entry_fail:'Maschine ohne Material starten', wrong_wait:'Offene Schutzhaube ignorieren', wrong_block:'Not-Aus ueberbruecken', wrong_info:'Fehlerteil freigeben', wrong_confirm:'Charge dokumentieren vor Freigabe', wrong_success:'Produktion stabil melden vor Kontrolle'
      },
      summary:'Industrieprozess mit Material, Sicherheit, Not-Aus, Qualitaetspruefung und Instandhaltung.'
    });
  }

  function makeFoerderbandSensor(){
    return makeGenericProcessScenario({
      id:'flow_master_foerderband_sensor', title:'Foerderband mit Sensorpruefung und Fehlerteil-Aussortierung', family:'industry',
      tags:['industry','sensor','foerderband','quality','phase10'],
      zones:['Start / Band','Teilezufuhr','Sensor','Messung','Aussortierung','Dokumentation','Abschluss / Fehler'],
      labels:{
        a_start:'Foerderband einschalten', q_entry:'Teil auf Band erkannt?', a_prepare:'Teil zur Messstation fahren', q_ready:'Sensor kalibriert?', a_wait:'Sensor neu kalibrieren', q_identity:'Messsignal plausibel?', a_block:'Band anhalten', q_special:'Fehlerteil erkannt?', a_normal_success:'Teil weiterleiten', a_special_prepare:'Ausschleuser vorbereiten', q_payment:'Ausschleuser frei?', a_special_action:'Fehlerteil aussortieren', a_info:'Fehlerteil markieren', a_confirm:'Messwert dokumentieren', q_final:'Teil korrekt sortiert?', a_support:'Anlage pruefen lassen', n_end_reject:'Ende: kein Teil', n_end_wait:'Ende: Kalibrierung', n_end_error:'Ende: Bandstopp', n_end_review:'Ende: Markierung', n_end_success:'Ende: Sortierung korrekt',
        c_entry:'Wurde ein Werkstueck erkannt?', c_ready:'Ist der Sensor kalibriert?', c_identity:'Ist das Messsignal plausibel?', c_special:'Wurde ein Fehlerteil erkannt?', c_payment:'Ist der Ausschleuser frei?', c_final:'Ist das Teil korrekt sortiert?',
        r_entry_reject:'Kein Werkstueck', r_not_ready:'Sensor nicht kalibriert', r_identity_block:'Unplausibles Signal', r_normal_success:'Gutes Teil weitergeleitet', r_special_missing:'Ausschleuser blockiert', r_special_success:'Fehlerteil aussortiert', r_final_support:'Sortierung unklar',
        wrong_entry_fail:'Leeres Band als Gutteil melden', wrong_wait:'Unkalibrierten Sensor nutzen', wrong_block:'Unplausibles Signal akzeptieren', wrong_info:'Fehlerteil unmarkiert weiterleiten', wrong_confirm:'Messwert speichern vor Messung', wrong_success:'Sortierung bestaetigen vor Ausschleusung'
      },
      summary:'Technisch-industrielle Prozesslogik mit Sensor, Plausibilitaet, Ausschleuser und Dokumentation.'
    });
  }

  function makeSupportTicket(){
    return makeGenericProcessScenario({
      id:'flow_master_support_ticket', title:'Support-Ticket mit Prioritaet, Zuweisung und Loesungspruefung', family:'support',
      tags:['support','ticket','admin','workflow','phase10'],
      zones:['Start / Meldung','Kategorie','Prioritaet','Zuweisung','Loesung','Rueckmeldung','Abschluss / Eskalation'],
      labels:{
        a_start:'Ticketmeldung erfassen', q_entry:'Beschreibung ausreichend?', a_prepare:'Kategorie zuordnen', q_ready:'Prioritaet bestimmbar?', a_wait:'Rueckfrage an Melder senden', q_identity:'Zustaendiges Team vorhanden?', a_block:'Ticket parken / eskalieren', q_special:'Sofortmassnahme noetig?', a_normal_success:'Ticket bearbeiten', a_special_prepare:'Sofortmassnahme einleiten', q_payment:'Loesung getestet?', a_special_action:'Loesung ausrollen', a_info:'Zwischenstand senden', a_confirm:'Rueckmeldung dokumentieren', q_final:'Problem behoben?', a_support:'An Second-Level geben', n_end_reject:'Ende: Rueckfrage offen', n_end_wait:'Ende: wartet auf Info', n_end_error:'Ende: eskaliert', n_end_review:'Ende: Zwischenstand', n_end_success:'Ende: geloest',
        c_entry:'Ist die Problembeschreibung ausreichend?', c_ready:'Kann die Prioritaet bestimmt werden?', c_identity:'Gibt es ein zustaendiges Team?', c_special:'Ist eine Sofortmassnahme notwendig?', c_payment:'Wurde die Loesung getestet?', c_final:'Bestaetigt der Melder die Behebung?',
        r_entry_reject:'Beschreibung fehlt', r_not_ready:'Prioritaet unklar', r_identity_block:'Kein Team zustaendig', r_normal_success:'Normale Bearbeitung geloest', r_special_missing:'Loesung nicht getestet', r_special_success:'Sofortmassnahme geloest', r_final_support:'Problem nicht behoben',
        wrong_entry_fail:'Unklare Meldung direkt schliessen', wrong_wait:'Ticket ohne Prioritaet bearbeiten', wrong_block:'Ticket ohne Team abschliessen', wrong_info:'Ungelöste Stoerung als geloest melden', wrong_confirm:'Rueckmeldung vor Loesung dokumentieren', wrong_success:'Ticket schliessen vor Bestaetigung'
      },
      summary:'Support-Prozess mit Meldequalitaet, Priorisierung, Teamzuweisung, Test und Rueckmeldung.'
    });
  }

  function makeOnlineBestellung(){
    return makeGenericProcessScenario({
      id:'flow_master_online_bestellung', title:'Online-Bestellung mit Lagerbestand, Zahlung und Versandfreigabe', family:'payment',
      tags:['payment','order','shop','warehouse','phase10'],
      zones:['Start / Warenkorb','Bestand','Kundendaten','Zahlung','Versand','Packen','Abschluss / Rueckfrage'],
      labels:{
        a_start:'Warenkorb pruefen', q_entry:'Artikel verfuegbar?', a_prepare:'Kundendaten pruefen', q_ready:'Adresse vollstaendig?', a_wait:'Adresse nachfordern', q_identity:'Zahlung autorisiert?', a_block:'Bestellung stoppen', q_special:'Expressversand gewaehlt?', a_normal_success:'Standardversand vorbereiten', a_special_prepare:'Expressfenster pruefen', q_payment:'Expresskapazitaet frei?', a_special_action:'Expressversand buchen', a_info:'Alternative Lieferoption senden', a_confirm:'Paket packen und labeln', q_final:'Sendung uebergeben?', a_support:'Kundenservice informieren', n_end_reject:'Ende: nicht verfuegbar', n_end_wait:'Ende: Adresse fehlt', n_end_error:'Ende: Zahlung fehlgeschlagen', n_end_review:'Ende: Rueckfrage Versand', n_end_success:'Ende: versendet',
        c_entry:'Ist der Artikel verfuegbar?', c_ready:'Ist die Lieferadresse vollstaendig?', c_identity:'Wurde die Zahlung autorisiert?', c_special:'Wurde Expressversand gewaehlt?', c_payment:'Ist Expresskapazitaet verfuegbar?', c_final:'Wurde die Sendung an den Dienstleister uebergeben?',
        r_entry_reject:'Artikel nicht verfuegbar', r_not_ready:'Adresse unvollstaendig', r_identity_block:'Zahlung abgelehnt', r_normal_success:'Standardversand', r_special_missing:'Express nicht moeglich', r_special_success:'Expressversand', r_final_support:'Uebergabe fehlgeschlagen',
        wrong_entry_fail:'Nicht verfuegbaren Artikel versenden', wrong_wait:'Ohne Adresse packen', wrong_block:'Ohne Zahlung versenden', wrong_info:'Expressproblem ignorieren', wrong_confirm:'Paket packen vor Zahlungsfreigabe', wrong_success:'Versand melden vor Uebergabe'
      },
      summary:'E-Commerce-Prozess mit Lagerbestand, Adresse, Zahlungsfreigabe, Standard-/Expressversand und Uebergabe.'
    });
  }

  var factories = Object.freeze({
    flow_master_postbote_nachnahme: makePostboteNachnahme,
    flow_master_parksensor: makeParksensor,
    flow_master_login_2fa: makeLogin2FA,
    flow_master_passwort_reset: makePasswordReset,
    flow_master_router_diagnose: makeRouterDiagnose,
    flow_master_ticketautomat: makeTicketautomat,
    flow_master_industrie_maschine: makeIndustrieMaschine,
    flow_master_foerderband_sensor: makeFoerderbandSensor,
    flow_master_support_ticket: makeSupportTicket,
    flow_master_online_bestellung: makeOnlineBestellung
  });

  function list(){
    return Object.keys(factories).map(function(id){
      var s = factories[id]();
      return { id:s.id, title:s.title, family:s.family, tags:s.tags.slice(), routes:s.routes.length, zones:s.zones.length, decisions:s.nodes.filter(function(n){ return n.kind === 'decision'; }).length };
    });
  }
  function get(id){
    if(!factories[id]) throw new Error('Unbekanntes FlowLogic Master-Szenario: '+id);
    return factories[id]();
  }
  function getAll(){ return Object.keys(factories).map(function(id){ return factories[id](); }); }
  function validateMasterScenario(s){
    var base = schema().validateScenario(s);
    var errors = base.errors ? base.errors.slice() : [];
    var warnings = base.warnings ? base.warnings.slice() : [];
    var decisions = asArray(s.nodes).filter(function(n){ return n && n.kind === 'decision'; });
    var endings = asArray(s.nodes).filter(function(n){ return n && n.kind === 'end'; });
    var routeZoneCoverage = Object.create(null);
    var routeEndCoverage = Object.create(null);
    asArray(s.routes).forEach(function(r){
      asArray(r.zoneIds).forEach(function(z){ routeZoneCoverage[z] = true; });
      if(r.endNode) routeEndCoverage[r.endNode] = true;
    });
    function addErr(code, msg, details){ errors.push({ code:code, message:msg, details:details || null }); }
    if(base.stats.gridMax !== 70) addErr('MASTER_GRID_NOT_70','Master-Szenario muss 70 Rasterfelder nutzen.', { gridMax:base.stats.gridMax });
    if(base.stats.zones < 7) addErr('MASTER_ZONES_TOO_FEW','Master-Szenario braucht mindestens 7 Prozesszonen.', { zones:base.stats.zones });
    if(base.stats.routes < 7) addErr('MASTER_ROUTES_TOO_FEW','Master-Szenario braucht mindestens 7 logische Routen.', { routes:base.stats.routes });
    if(decisions.length < 5) addErr('MASTER_DECISIONS_TOO_FEW','Master-Szenario braucht mindestens 5 echte Entscheidungen.', { decisions:decisions.length });
    if(endings.length < 3) addErr('MASTER_ENDINGS_TOO_FEW','Master-Szenario braucht mehrere fachliche Endpunkte.', { endings:endings.length });
    if(Object.keys(routeZoneCoverage).length < 6) addErr('MASTER_ROUTE_ZONE_COVERAGE_LOW','Routen muessen fast alle Prozesszonen abdecken.', { covered:Object.keys(routeZoneCoverage) });
    if(Object.keys(routeEndCoverage).length < 3) addErr('MASTER_ROUTE_END_COVERAGE_LOW','Routen muessen mehrere Endpunkte erreichen.', { covered:Object.keys(routeEndCoverage) });
    decisions.forEach(function(d){
      var cond = asArray(s.conditions).filter(function(c){ return c.nodeId === d.id; })[0];
      if(!cond) addErr('MASTER_DECISION_WITHOUT_CONDITION','Entscheidung ohne explizite Bedingung.', { nodeId:d.id });
    });
    return { ok:errors.length === 0, errors:errors, warnings:warnings, stats:Object.assign({}, base.stats, { decisions:decisions.length, endings:endings.length, routeZoneCoverage:Object.keys(routeZoneCoverage).length, routeEndCoverage:Object.keys(routeEndCoverage).length }) };
  }
  function validateAll(){
    var scenarios = getAll();
    var items = scenarios.map(function(s){ return { id:s.id, title:s.title, report:validateMasterScenario(s) }; });
    return { ok:items.every(function(x){ return x.report.ok; }), total:items.length, items:items };
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    list: list,
    get: get,
    getAll: getAll,
    validateMasterScenario: validateMasterScenario,
    validateAll: validateAll,
    clone: clone
  });

  window.FlowLogicScenarios = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase3.scenario-api', 'Phase 3: Master-Szenario-API vorhanden', function(t){
      t.assert(window.FlowLogicScenarios && window.FlowLogicScenarios.__version.indexOf('G39.26') !== -1, 'FlowLogicScenarios fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicScenarios.getAll === 'function', 'getAll fehlt.');
      t.assert(window.FlowLogicScenarios.getAll().length >= 10, 'Es muessen mindestens 10 Master-Szenarien aktiv sein.');
      return { version:window.FlowLogicScenarios.__version, scenarios:window.FlowLogicScenarios.list() };
    }, { phase:'3', critical:true });

    window.FlowLogicSelfTest.register('phase3.master-scenarios-valid', 'Phase 3: Alle Master-Szenarien bestehen Schema + Master-Regeln', function(t){
      var report = window.FlowLogicScenarios.validateAll();
      t.assert(report.ok, 'Mindestens ein Master-Szenario ist ungueltig.', report);
      return report;
    }, { phase:'3', critical:true });

    window.FlowLogicSelfTest.register('phase3.master-diversity', 'Phase 3: Szenario-Pool ist fachlich breit genug', function(t){
      var list = window.FlowLogicScenarios.list();
      var families = list.map(function(x){ return x.family; }).sort();
      t.assert(families.indexOf('logistics') !== -1, 'Logistik-Szenario fehlt.', families);
      t.assert(families.indexOf('sensor') !== -1, 'Sensorik-Szenario fehlt.', families);
      t.assert(families.indexOf('it') !== -1, 'IT-Szenario fehlt.', families);
      t.assert(families.indexOf('industry') !== -1, 'Industrie-Szenario fehlt.', families);
      t.assert(families.indexOf('payment') !== -1, 'Payment-/Automaten-Szenario fehlt.', families);
      t.assert(families.indexOf('support') !== -1, 'Support-Szenario fehlt.', families);
      t.assert(list.length >= 10, 'Phase 11 braucht mindestens 10 aktive Szenarien.', list);
      list.forEach(function(item){
        t.assert(item.routes >= 7, 'Szenario hat zu wenige Routen: '+item.id, item);
        t.assert(item.zones >= 7, 'Szenario hat zu wenige Zonen: '+item.id, item);
        t.assert(item.decisions >= 5, 'Szenario hat zu wenige Entscheidungen: '+item.id, item);
      });
      return { families:families, scenarios:list };
    }, { phase:'3', critical:true });
  }
})();
