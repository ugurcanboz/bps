/* Ablaufplan-Detektiv · FlowLogic Scenario Schema · Phase 2
   Universeller Datenvertrag fuer Ablaufplan-/Routenlogik-Aufgaben.
   Wichtig: Noch kein Generator und kein Renderer. Dieses Modul validiert nur, ob ein Szenario spaeter eindeutig darstellbar und auswertbar ist. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';

  var NODE_SHAPES = Object.freeze(['oval','rectangle','diamond','circle','note']);
  var NODE_KINDS = Object.freeze(['start','end','action','decision','merge','note']);
  var EDGE_LABELS = Object.freeze(['','Ja','Nein','OK','Fehler','Weiter']);
  var ERROR_CATEGORIES = Object.freeze(['Form','Pfeil','Inhalt']);
  var ERROR_TYPES = Object.freeze([
    'WRONG_SHAPE',
    'WRONG_ARROW_TARGET',
    'YES_NO_SWAPPED',
    'MISSING_REQUIRED_CHECK',
    'WRONG_SEQUENCE',
    'IMPOSSIBLE_ACTION',
    'WRONG_END_POINT',
    'SKIPPED_STEP',
    'WRONG_LABEL',
    'ROUTE_LOGIC_BROKEN'
  ]);
  var DIFFICULTIES = Object.freeze(['learn','easy','training','ctc','exam','hard']);
  var SCENARIO_FAMILIES = Object.freeze(['logistics','it','industry','sensor','payment','support','administration','daily-life']);

  function clone(value){
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function asArray(value){ return Array.isArray(value) ? value : []; }
  function hasOwn(obj, key){ return Object.prototype.hasOwnProperty.call(obj, key); }
  function isObject(value){ return !!value && typeof value === 'object' && !Array.isArray(value); }
  function isString(value){ return typeof value === 'string' && value.trim().length > 0; }
  function isNumber(value){ return typeof value === 'number' && isFinite(value); }
  function unique(values){
    var seen = Object.create(null);
    var dupes = [];
    values.forEach(function(v){
      if(seen[v]) dupes.push(v);
      seen[v] = true;
    });
    return { unique:dupes.length === 0, duplicates:dupes };
  }
  function add(list, code, message, details){ list.push({ code:code, message:message, details:details || null }); }

  function createEmptyScenario(overrides){
    var base = {
      schemaVersion: 1,
      id: '',
      title: '',
      family: 'daily-life',
      difficulty: 'training',
      tags: [],
      grid: { cols: 10, rows: 7 },
      objective: {
        errorCount: 11,
        categories: ERROR_CATEGORIES.slice(),
        mode: 'detect_errors'
      },
      zones: [],
      nodes: [],
      edges: [],
      routes: [],
      conditions: [],
      answerKey: [],
      metadata: {
        phase: 2,
        generatorReady: false,
        rendererReady: false,
        scorerReady: false
      }
    };
    if(overrides && isObject(overrides)){
      Object.keys(overrides).forEach(function(key){ base[key] = overrides[key]; });
    }
    return base;
  }

  function gridMax(scenario){
    var grid = scenario && scenario.grid || {};
    var cols = Number(grid.cols || 0);
    var rows = Number(grid.rows || 0);
    return cols * rows;
  }

  function indexById(items){
    var map = Object.create(null);
    asArray(items).forEach(function(item){ if(item && item.id) map[item.id] = item; });
    return map;
  }

  function buildIndex(scenario){
    return {
      zones: indexById(scenario.zones),
      nodes: indexById(scenario.nodes),
      edges: indexById(scenario.edges),
      routes: indexById(scenario.routes),
      conditions: indexById(scenario.conditions),
      answerKey: indexById(scenario.answerKey),
      gridMax: gridMax(scenario)
    };
  }

  function validateGrid(scenario, errors, warnings){
    var grid = scenario.grid || {};
    if(!Number.isInteger(grid.cols) || grid.cols < 4 || grid.cols > 16) add(errors, 'GRID_COLS_INVALID', 'Rasterspalten muessen zwischen 4 und 16 liegen.', { cols:grid.cols });
    if(!Number.isInteger(grid.rows) || grid.rows < 4 || grid.rows > 14) add(errors, 'GRID_ROWS_INVALID', 'Rasterzeilen muessen zwischen 4 und 14 liegen.', { rows:grid.rows });
    var total = gridMax(scenario);
    if(total < 20) add(errors, 'GRID_TOO_SMALL', 'Raster ist fuer FlowLogic-Aufgaben zu klein.', { total:total });
    if(total !== 70 && scenario.difficulty === 'ctc') add(warnings, 'GRID_NOT_70_CTC', 'CTC-Standard sollte 10 x 7 = 70 Felder nutzen.', { total:total });
  }

  function validateZones(scenario, idx, errors, warnings){
    var zones = asArray(scenario.zones);
    if(zones.length < 1) add(errors, 'ZONES_MISSING', 'Mindestens eine Prozesszone ist Pflicht.');
    var ids = zones.map(function(z){ return z && z.id; });
    var dupe = unique(ids.filter(Boolean));
    if(!dupe.unique) add(errors, 'ZONE_IDS_DUPLICATE', 'Zonen-IDs sind doppelt.', { duplicates:dupe.duplicates });
    zones.forEach(function(zone){
      if(!zone || !isString(zone.id)) return add(errors, 'ZONE_ID_MISSING', 'Zone ohne ID gefunden.', { zone:zone });
      if(!isString(zone.label)) add(errors, 'ZONE_LABEL_MISSING', 'Zone braucht ein Label.', { zoneId:zone.id });
      if(!Number.isInteger(zone.order)) add(errors, 'ZONE_ORDER_MISSING', 'Zone braucht eine numerische Reihenfolge.', { zoneId:zone.id });
      if(zone.gridRange){
        var a = zone.gridRange[0], b = zone.gridRange[1];
        if(!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > idx.gridMax || a > b){
          add(errors, 'ZONE_GRID_RANGE_INVALID', 'Zonen-Rasterbereich ist ungueltig.', { zoneId:zone.id, gridRange:zone.gridRange, gridMax:idx.gridMax });
        }
      } else {
        add(warnings, 'ZONE_GRID_RANGE_MISSING', 'Zone hat noch keinen Rasterbereich. Fuer spaetere Verteilung sollte gridRange gesetzt werden.', { zoneId:zone.id });
      }
    });
  }

  function validateNodes(scenario, idx, errors, warnings){
    var nodes = asArray(scenario.nodes);
    if(nodes.length < 2) add(errors, 'NODES_TOO_FEW', 'Szenario braucht mindestens Start- und Endknoten.');
    var ids = nodes.map(function(n){ return n && n.id; });
    var dupe = unique(ids.filter(Boolean));
    if(!dupe.unique) add(errors, 'NODE_IDS_DUPLICATE', 'Knoten-IDs sind doppelt.', { duplicates:dupe.duplicates });
    var startCount = 0, endCount = 0;
    nodes.forEach(function(node){
      if(!node || !isString(node.id)) return add(errors, 'NODE_ID_MISSING', 'Knoten ohne ID gefunden.', { node:node });
      if(!isString(node.label)) add(errors, 'NODE_LABEL_MISSING', 'Knoten braucht sichtbaren Text.', { nodeId:node.id });
      if(NODE_KINDS.indexOf(node.kind) === -1) add(errors, 'NODE_KIND_INVALID', 'Knotenart ist ungueltig.', { nodeId:node.id, kind:node.kind });
      if(NODE_SHAPES.indexOf(node.correctShape) === -1) add(errors, 'NODE_CORRECT_SHAPE_INVALID', 'correctShape ist ungueltig.', { nodeId:node.id, correctShape:node.correctShape });
      if(node.renderedShape != null && NODE_SHAPES.indexOf(node.renderedShape) === -1) add(errors, 'NODE_RENDERED_SHAPE_INVALID', 'renderedShape ist ungueltig.', { nodeId:node.id, renderedShape:node.renderedShape });
      if(!Number.isInteger(node.grid) || node.grid < 1 || node.grid > idx.gridMax) add(errors, 'NODE_GRID_INVALID', 'Knoten liegt ausserhalb des Rasters.', { nodeId:node.id, grid:node.grid, gridMax:idx.gridMax });
      if(!idx.zones[node.zone]) add(errors, 'NODE_ZONE_INVALID', 'Knoten verweist auf unbekannte Zone.', { nodeId:node.id, zone:node.zone });
      if(node.kind === 'start') startCount += 1;
      if(node.kind === 'end') endCount += 1;
      if(node.kind === 'decision' && node.correctShape !== 'diamond') add(warnings, 'DECISION_SHOULD_BE_DIAMOND', 'Entscheidungsknoten sollte korrekt eine Raute sein.', { nodeId:node.id });
      if(node.kind === 'action' && node.correctShape !== 'rectangle') add(warnings, 'ACTION_SHOULD_BE_RECTANGLE', 'Handlungsknoten sollte korrekt ein Rechteck sein.', { nodeId:node.id });
      if((node.kind === 'start' || node.kind === 'end') && node.correctShape !== 'oval') add(warnings, 'TERMINAL_SHOULD_BE_OVAL', 'Start/Ende sollte korrekt oval sein.', { nodeId:node.id });
    });
    if(startCount !== 1) add(errors, 'START_COUNT_INVALID', 'Szenario braucht genau einen Startknoten.', { startCount:startCount });
    if(endCount < 1) add(errors, 'END_MISSING', 'Szenario braucht mindestens einen Endknoten.', { endCount:endCount });
  }

  function validateEdges(scenario, idx, errors, warnings){
    var edges = asArray(scenario.edges);
    if(edges.length < 1) add(errors, 'EDGES_MISSING', 'Szenario braucht Pfeile/Kanten.');
    var ids = edges.map(function(e){ return e && e.id; });
    var dupe = unique(ids.filter(Boolean));
    if(!dupe.unique) add(errors, 'EDGE_IDS_DUPLICATE', 'Pfeil-IDs sind doppelt.', { duplicates:dupe.duplicates });
    edges.forEach(function(edge){
      if(!edge || !isString(edge.id)) return add(errors, 'EDGE_ID_MISSING', 'Pfeil ohne ID gefunden.', { edge:edge });
      if(!idx.nodes[edge.from]) add(errors, 'EDGE_FROM_INVALID', 'Pfeil startet an unbekanntem Knoten.', { edgeId:edge.id, from:edge.from });
      if(!idx.nodes[edge.to]) add(errors, 'EDGE_TO_INVALID', 'Pfeil endet an unbekanntem Knoten.', { edgeId:edge.id, to:edge.to });
      if(edge.correctTo != null && !idx.nodes[edge.correctTo]) add(errors, 'EDGE_CORRECT_TO_INVALID', 'correctTo verweist auf unbekannten Knoten.', { edgeId:edge.id, correctTo:edge.correctTo });
      if(edge.renderedTo != null && !idx.nodes[edge.renderedTo]) add(errors, 'EDGE_RENDERED_TO_INVALID', 'renderedTo verweist auf unbekannten Knoten.', { edgeId:edge.id, renderedTo:edge.renderedTo });
      if(edge.label != null && typeof edge.label !== 'string') add(errors, 'EDGE_LABEL_INVALID', 'Pfeilbeschriftung muss Text sein.', { edgeId:edge.id, label:edge.label });
      if(edge.grid != null && (!Number.isInteger(edge.grid) || edge.grid < 1 || edge.grid > idx.gridMax)) add(errors, 'EDGE_GRID_INVALID', 'Pfeil-Hinweisraster liegt ausserhalb des Rasters.', { edgeId:edge.id, grid:edge.grid });
    });
    var outgoing = Object.create(null);
    edges.forEach(function(edge){ if(edge && edge.from) (outgoing[edge.from] || (outgoing[edge.from] = [])).push(edge); });
    asArray(scenario.nodes).forEach(function(node){
      if(!node || node.kind !== 'decision') return;
      var out = outgoing[node.id] || [];
      var labels = out.map(function(e){ return String(e.label || '').toLowerCase(); });
      if(out.length < 2) add(errors, 'DECISION_BRANCHES_TOO_FEW', 'Entscheidung braucht mindestens zwei ausgehende Pfade.', { nodeId:node.id, outgoing:out.map(function(e){ return e.id; }) });
      if(labels.indexOf('ja') === -1 || labels.indexOf('nein') === -1) add(warnings, 'DECISION_BRANCH_LABELS_INCOMPLETE', 'Entscheidung sollte Ja- und Nein-Pfad besitzen.', { nodeId:node.id, labels:labels });
    });
  }

  function validateConditions(scenario, idx, errors, warnings){
    var conditions = asArray(scenario.conditions);
    conditions.forEach(function(cond){
      if(!cond || !isString(cond.id)) return add(errors, 'CONDITION_ID_MISSING', 'Bedingung ohne ID gefunden.', { condition:cond });
      if(!idx.nodes[cond.nodeId]) add(errors, 'CONDITION_NODE_INVALID', 'Bedingung verweist auf unbekannten Knoten.', { conditionId:cond.id, nodeId:cond.nodeId });
      if(idx.nodes[cond.nodeId] && idx.nodes[cond.nodeId].kind !== 'decision') add(errors, 'CONDITION_NODE_NOT_DECISION', 'Bedingung muss an einer Entscheidung haengen.', { conditionId:cond.id, nodeId:cond.nodeId });
      if(!cond.branches || !cond.branches.yes || !cond.branches.no) add(errors, 'CONDITION_BRANCHES_MISSING', 'Bedingung braucht yes/no-Branches.', { conditionId:cond.id });
      if(cond.branches){
        if(cond.branches.yes && !idx.edges[cond.branches.yes]) add(errors, 'CONDITION_YES_EDGE_INVALID', 'Yes-Branch verweist auf unbekannten Pfeil.', { conditionId:cond.id, yes:cond.branches.yes });
        if(cond.branches.no && !idx.edges[cond.branches.no]) add(errors, 'CONDITION_NO_EDGE_INVALID', 'No-Branch verweist auf unbekannten Pfeil.', { conditionId:cond.id, no:cond.branches.no });
      }
    });
    var decisionCount = asArray(scenario.nodes).filter(function(n){ return n && n.kind === 'decision'; }).length;
    if(decisionCount > 0 && conditions.length === 0) add(warnings, 'CONDITIONS_MISSING', 'Szenario hat Entscheidungen, aber noch keine expliziten Bedingungen.', { decisionCount:decisionCount });
  }

  function validateRoutes(scenario, idx, errors, warnings){
    var routes = asArray(scenario.routes);
    if(routes.length < 1) add(errors, 'ROUTES_MISSING', 'Mindestens eine logische Route ist Pflicht.');
    var ids = routes.map(function(r){ return r && r.id; });
    var dupe = unique(ids.filter(Boolean));
    if(!dupe.unique) add(errors, 'ROUTE_IDS_DUPLICATE', 'Routen-IDs sind doppelt.', { duplicates:dupe.duplicates });
    routes.forEach(function(route){
      if(!route || !isString(route.id)) return add(errors, 'ROUTE_ID_MISSING', 'Route ohne ID gefunden.', { route:route });
      if(!isString(route.label)) add(errors, 'ROUTE_LABEL_MISSING', 'Route braucht ein Label.', { routeId:route.id });
      if(!idx.nodes[route.startNode]) add(errors, 'ROUTE_START_INVALID', 'Route startet an unbekanntem Knoten.', { routeId:route.id, startNode:route.startNode });
      if(!idx.nodes[route.endNode]) add(errors, 'ROUTE_END_INVALID', 'Route endet an unbekanntem Knoten.', { routeId:route.id, endNode:route.endNode });
      asArray(route.nodeIds).forEach(function(id){ if(!idx.nodes[id]) add(errors, 'ROUTE_NODE_INVALID', 'Route enthaelt unbekannten Knoten.', { routeId:route.id, nodeId:id }); });
      asArray(route.edgeIds).forEach(function(id){ if(!idx.edges[id]) add(errors, 'ROUTE_EDGE_INVALID', 'Route enthaelt unbekannten Pfeil.', { routeId:route.id, edgeId:id }); });
      asArray(route.zoneIds).forEach(function(id){ if(!idx.zones[id]) add(errors, 'ROUTE_ZONE_INVALID', 'Route enthaelt unbekannte Zone.', { routeId:route.id, zoneId:id }); });
      if(asArray(route.nodeIds).length < 2) add(warnings, 'ROUTE_TOO_SHORT', 'Route ist sehr kurz. Fuer echte Pruefungsaufgaben spaeter ausbauen.', { routeId:route.id });
    });
  }

  function validateAnswerKey(scenario, idx, errors, warnings){
    var key = asArray(scenario.answerKey);
    var objective = scenario.objective || {};
    if(key.length === 0){
      add(warnings, 'ANSWER_KEY_EMPTY_PHASE2_OK', 'answerKey ist in Phase 2 noch leer erlaubt. Ab Generator/Scorer wird er Pflicht.');
      return;
    }
    var ids = key.map(function(e){ return e && e.id; });
    var dupe = unique(ids.filter(Boolean));
    if(!dupe.unique) add(errors, 'ANSWER_KEY_IDS_DUPLICATE', 'Antwortschluessel-IDs sind doppelt.', { duplicates:dupe.duplicates });
    key.forEach(function(item){
      if(!item || !isString(item.id)) return add(errors, 'ANSWER_KEY_ID_MISSING', 'Antwortschluessel ohne ID gefunden.', { item:item });
      if(!isString(item.targetId)) add(errors, 'ANSWER_TARGET_MISSING', 'Fehler braucht targetId.', { id:item.id });
      if(item.targetType === 'edge'){
        if(!idx.edges[item.targetId]) add(errors, 'ANSWER_TARGET_EDGE_INVALID', 'Fehler verweist auf unbekannten Pfeil.', { id:item.id, targetId:item.targetId });
      } else if(item.targetType === 'node'){
        if(!idx.nodes[item.targetId]) add(errors, 'ANSWER_TARGET_NODE_INVALID', 'Fehler verweist auf unbekannten Knoten.', { id:item.id, targetId:item.targetId });
      } else {
        add(errors, 'ANSWER_TARGET_TYPE_INVALID', 'Fehler braucht targetType node/edge.', { id:item.id, targetType:item.targetType });
      }
      if(ERROR_CATEGORIES.indexOf(item.category) === -1) add(errors, 'ANSWER_CATEGORY_INVALID', 'Fehlerkategorie ist ungueltig.', { id:item.id, category:item.category });
      if(ERROR_TYPES.indexOf(item.errorType) === -1) add(errors, 'ANSWER_ERROR_TYPE_INVALID', 'Fehlertyp ist ungueltig.', { id:item.id, errorType:item.errorType });
      if(!isString(item.fixCode)) add(errors, 'ANSWER_FIX_CODE_MISSING', 'Fehler braucht fixCode.', { id:item.id });
      if(!isString(item.expected)) add(errors, 'ANSWER_EXPECTED_MISSING', 'Fehler braucht erwartete Korrektur.', { id:item.id });
      if(!idx.zones[item.zone]) add(errors, 'ANSWER_ZONE_INVALID', 'Fehler verweist auf unbekannte Zone.', { id:item.id, zone:item.zone });
      asArray(item.routes).forEach(function(routeId){ if(!idx.routes[routeId]) add(errors, 'ANSWER_ROUTE_INVALID', 'Fehler verweist auf unbekannte Route.', { id:item.id, routeId:routeId }); });
      if(!Number.isInteger(item.grid) || item.grid < 1 || item.grid > idx.gridMax) add(errors, 'ANSWER_GRID_INVALID', 'Fehler-Raster ist ungueltig.', { id:item.id, grid:item.grid });
    });
    if(objective.errorCount && key.length !== objective.errorCount){
      add(warnings, 'ANSWER_COUNT_DIFFERS_OBJECTIVE', 'answerKey-Anzahl weicht vom Ziel ab. In Phase 2 Warnung, spaeter Blocker.', { expected:objective.errorCount, actual:key.length });
    }
  }

  function validateScenario(raw, options){
    options = options || {};
    var scenario = raw;
    var errors = [];
    var warnings = [];
    if(!isObject(scenario)){
      return { ok:false, errors:[{ code:'SCENARIO_NOT_OBJECT', message:'Szenario muss ein Objekt sein.', details:null }], warnings:[], stats:{} };
    }
    if(scenario.schemaVersion !== 1) add(errors, 'SCHEMA_VERSION_INVALID', 'schemaVersion muss 1 sein.', { schemaVersion:scenario.schemaVersion });
    if(!isString(scenario.id)) add(errors, 'SCENARIO_ID_MISSING', 'Szenario braucht eine ID.');
    if(!isString(scenario.title)) add(errors, 'SCENARIO_TITLE_MISSING', 'Szenario braucht einen Titel.');
    if(SCENARIO_FAMILIES.indexOf(scenario.family) === -1) add(errors, 'SCENARIO_FAMILY_INVALID', 'Szenario-Familie ist ungueltig.', { family:scenario.family });
    if(DIFFICULTIES.indexOf(scenario.difficulty) === -1) add(errors, 'SCENARIO_DIFFICULTY_INVALID', 'Schwierigkeit ist ungueltig.', { difficulty:scenario.difficulty });
    if(!Array.isArray(scenario.tags)) add(errors, 'SCENARIO_TAGS_INVALID', 'tags muss ein Array sein.');
    validateGrid(scenario, errors, warnings);
    var idx = buildIndex(scenario);
    validateZones(scenario, idx, errors, warnings);
    validateNodes(scenario, idx, errors, warnings);
    validateEdges(scenario, idx, errors, warnings);
    validateConditions(scenario, idx, errors, warnings);
    validateRoutes(scenario, idx, errors, warnings);
    validateAnswerKey(scenario, idx, errors, warnings);

    var stats = {
      nodes: asArray(scenario.nodes).length,
      edges: asArray(scenario.edges).length,
      routes: asArray(scenario.routes).length,
      zones: asArray(scenario.zones).length,
      conditions: asArray(scenario.conditions).length,
      answerKey: asArray(scenario.answerKey).length,
      gridMax: idx.gridMax
    };
    return { ok:errors.length === 0, errors:errors, warnings:warnings, stats:stats };
  }

  function assertValidScenario(scenario){
    var report = validateScenario(scenario);
    if(!report.ok){
      var err = new Error('FlowLogic Szenario ungueltig: '+report.errors.map(function(e){ return e.code; }).join(', '));
      err.report = report;
      throw err;
    }
    return report;
  }

  function makePhase2Fixture(){
    return createEmptyScenario({
      id: 'phase2_contract_fixture',
      title: 'Phase-2-Datenvertrag Testprozess',
      family: 'it',
      difficulty: 'ctc',
      tags: ['fixture','schema','phase2'],
      grid: { cols: 10, rows: 7 },
      zones: [
        { id:'z_start', label:'Start / Eingang', order:1, gridRange:[1,10] },
        { id:'z_check', label:'Pruefung / Entscheidung', order:2, gridRange:[11,40] },
        { id:'z_end', label:'Abschluss', order:3, gridRange:[41,70] }
      ],
      nodes: [
        { id:'n_start', label:'Start', kind:'start', correctShape:'oval', renderedShape:'oval', zone:'z_start', grid:2 },
        { id:'n_action', label:'Eingabe pruefen', kind:'action', correctShape:'rectangle', renderedShape:'rectangle', zone:'z_check', grid:13 },
        { id:'q_ok', label:'Eingabe gueltig?', kind:'decision', correctShape:'diamond', renderedShape:'diamond', zone:'z_check', grid:25 },
        { id:'n_success', label:'Vorgang freigeben', kind:'action', correctShape:'rectangle', renderedShape:'rectangle', zone:'z_end', grid:47 },
        { id:'n_error', label:'Fehler anzeigen', kind:'action', correctShape:'rectangle', renderedShape:'rectangle', zone:'z_end', grid:55 },
        { id:'n_end', label:'Ende', kind:'end', correctShape:'oval', renderedShape:'oval', zone:'z_end', grid:68 }
      ],
      edges: [
        { id:'e_start_action', from:'n_start', to:'n_action', label:'', grid:7 },
        { id:'e_action_q', from:'n_action', to:'q_ok', label:'', grid:18 },
        { id:'e_q_yes', from:'q_ok', to:'n_success', label:'Ja', grid:36 },
        { id:'e_q_no', from:'q_ok', to:'n_error', label:'Nein', grid:35 },
        { id:'e_success_end', from:'n_success', to:'n_end', label:'', grid:58 },
        { id:'e_error_end', from:'n_error', to:'n_end', label:'', grid:62 }
      ],
      conditions: [
        { id:'c_ok', nodeId:'q_ok', question:'Eingabe gueltig?', branches:{ yes:'e_q_yes', no:'e_q_no' } }
      ],
      routes: [
        { id:'r_success', label:'Eingabe gueltig', startNode:'n_start', endNode:'n_end', nodeIds:['n_start','n_action','q_ok','n_success','n_end'], edgeIds:['e_start_action','e_action_q','e_q_yes','e_success_end'], zoneIds:['z_start','z_check','z_end'] },
        { id:'r_error', label:'Eingabe ungueltig', startNode:'n_start', endNode:'n_end', nodeIds:['n_start','n_action','q_ok','n_error','n_end'], edgeIds:['e_start_action','e_action_q','e_q_no','e_error_end'], zoneIds:['z_start','z_check','z_end'] }
      ],
      answerKey: [
        { id:'err_shape_01', targetType:'node', targetId:'q_ok', grid:25, zone:'z_check', routes:['r_success','r_error'], category:'Form', errorType:'WRONG_SHAPE', fixCode:'QUESTION_MUST_BE_DIAMOND', expected:'Eine Frage muss in einer Raute stehen.' },
        { id:'err_edge_01', targetType:'edge', targetId:'e_q_no', grid:35, zone:'z_check', routes:['r_error'], category:'Pfeil', errorType:'WRONG_ARROW_TARGET', fixCode:'NO_ROUTE_MUST_SHOW_ERROR', expected:'Nein muss zum Fehlerpfad fuehren.' }
      ]
    });
  }

  function makeInvalidFixture(){
    var scenario = makePhase2Fixture();
    scenario.id = '';
    scenario.nodes[2].grid = 999;
    scenario.edges[0].to = 'missing_node';
    scenario.routes[0].edgeIds.push('missing_edge');
    scenario.answerKey[0].category = 'Optik';
    return scenario;
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    constants: Object.freeze({
      NODE_SHAPES: NODE_SHAPES,
      NODE_KINDS: NODE_KINDS,
      EDGE_LABELS: EDGE_LABELS,
      ERROR_CATEGORIES: ERROR_CATEGORIES,
      ERROR_TYPES: ERROR_TYPES,
      DIFFICULTIES: DIFFICULTIES,
      SCENARIO_FAMILIES: SCENARIO_FAMILIES
    }),
    createEmptyScenario: createEmptyScenario,
    validateScenario: validateScenario,
    assertValidScenario: assertValidScenario,
    buildIndex: buildIndex,
    clone: clone,
    fixtures: Object.freeze({
      makePhase2Fixture: makePhase2Fixture,
      makeInvalidFixture: makeInvalidFixture
    })
  });

  window.FlowLogicSchema = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase2.schema-api', 'Phase 2: Universelle Schema-API vorhanden', function(t){
      t.assert(window.FlowLogicSchema && window.FlowLogicSchema.__version.indexOf('G39.26') !== -1, 'FlowLogicSchema fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicSchema.validateScenario === 'function', 'validateScenario fehlt.');
      t.assert(typeof window.FlowLogicSchema.createEmptyScenario === 'function', 'createEmptyScenario fehlt.');
      t.assert(window.FlowLogicSchema.constants.ERROR_CATEGORIES.join('|') === 'Form|Pfeil|Inhalt', 'Fehlerkategorien muessen Form/Pfeil/Inhalt sein.');
      return { version:window.FlowLogicSchema.__version, categories:window.FlowLogicSchema.constants.ERROR_CATEGORIES };
    }, { phase:'2', critical:true });

    window.FlowLogicSelfTest.register('phase2.valid-fixture', 'Phase 2: Gueltiges Szenario besteht Datenvertrag', function(t){
      var fixture = window.FlowLogicSchema.fixtures.makePhase2Fixture();
      var report = window.FlowLogicSchema.validateScenario(fixture);
      t.assert(report.ok, 'Gueltiges Fixture wurde abgelehnt.', report);
      t.assert(report.stats.gridMax === 70, 'Fixture muss 70 Rasterfelder haben.', report.stats);
      t.assert(report.stats.routes >= 2, 'Fixture braucht mindestens zwei Routen.', report.stats);
      return report;
    }, { phase:'2', critical:true });

    window.FlowLogicSelfTest.register('phase2.invalid-fixture-blocked', 'Phase 2: Ungueltiges Szenario wird blockiert', function(t){
      var invalid = window.FlowLogicSchema.fixtures.makeInvalidFixture();
      var report = window.FlowLogicSchema.validateScenario(invalid);
      t.assert(!report.ok, 'Ungueltiges Fixture wurde faelschlich akzeptiert.', report);
      var codes = report.errors.map(function(e){ return e.code; });
      t.assert(codes.indexOf('SCENARIO_ID_MISSING') !== -1, 'fehlende Szenario-ID wurde nicht erkannt.', codes);
      t.assert(codes.indexOf('NODE_GRID_INVALID') !== -1, 'ungueltiges Node-Raster wurde nicht erkannt.', codes);
      t.assert(codes.indexOf('EDGE_TO_INVALID') !== -1, 'ungueltiger Pfeil-Endpunkt wurde nicht erkannt.', codes);
      t.assert(codes.indexOf('ANSWER_CATEGORY_INVALID') !== -1, 'ungueltige Fehlerkategorie wurde nicht erkannt.', codes);
      return { blocked:true, errorCodes:codes };
    }, { phase:'2', critical:true });

    window.FlowLogicSelfTest.register('phase2.universal-contract', 'Phase 2: Datenmodell bleibt szenario-neutral', function(t){
      var families = window.FlowLogicSchema.constants.SCENARIO_FAMILIES;
      ['logistics','it','industry','sensor','payment','support','administration'].forEach(function(family){
        t.assert(families.indexOf(family) !== -1, 'Szenario-Familie fehlt: '+family, families);
      });
      var errorTypes = window.FlowLogicSchema.constants.ERROR_TYPES;
      ['WRONG_SHAPE','WRONG_ARROW_TARGET','YES_NO_SWAPPED','WRONG_SEQUENCE','ROUTE_LOGIC_BROKEN'].forEach(function(type){
        t.assert(errorTypes.indexOf(type) !== -1, 'Fehlertyp fehlt: '+type, errorTypes);
      });
      return { families:families.length, errorTypes:errorTypes.length };
    }, { phase:'2', critical:true });
  }
})();
