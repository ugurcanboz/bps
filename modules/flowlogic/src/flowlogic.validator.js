/* Ablaufplan-Detektiv · FlowLogic Distribution Validator · Phase 5
   Kontrolliert, ob eine komplette Fehlermenge wirklich pruefungsreif verteilt ist:
   nicht geclustert, nicht nebeneinander, ueber Routen/Zonen/Kategorien verteilt und eindeutig auswertbar. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';

  function schema(){ if(!window.FlowLogicSchema) throw new Error('FlowLogicSchema muss vor FlowLogicValidator geladen werden.'); return window.FlowLogicSchema; }
  function scenarios(){ if(!window.FlowLogicScenarios) throw new Error('FlowLogicScenarios muss vor FlowLogicValidator geladen werden.'); return window.FlowLogicScenarios; }
  function mutations(){ if(!window.FlowLogicMutations) throw new Error('FlowLogicMutations muss vor FlowLogicValidator geladen werden.'); return window.FlowLogicMutations; }
  function clone(value){ return schema().clone ? schema().clone(value) : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function add(list, code, message, details){ list.push({ code:code, message:message, details:details || null }); }
  function countBy(list, fn){
    var out = Object.create(null);
    asArray(list).forEach(function(item){ var key = fn(item); out[key] = (out[key] || 0) + 1; });
    return out;
  }
  function objectValues(obj){ return Object.keys(obj || {}).map(function(k){ return obj[k]; }); }
  function mergePolicy(policy){
    var base = {
      errorCount: 11,
      minZones: 5,
      maxPerZone: 3,
      minRoutes: 4,
      maxPerRoute: 6,
      minRouteLogicRequired: 6,
      requireAllCategories: true,
      minCategoryCounts: { Form:2, Pfeil:2, Inhalt:2 },
      noDuplicateGrids: true,
      noDuplicateTargets: true,
      noDuplicateMutations: true,
      blockOrthogonalAdjacentGrids: true,
      minUniqueFixCodes: 10,
      validateSchemaAfterApply: true
    };
    policy = policy || {};
    Object.keys(policy).forEach(function(k){
      if(k === 'minCategoryCounts') base.minCategoryCounts = Object.assign({}, base.minCategoryCounts, policy.minCategoryCounts || {});
      else base[k] = policy[k];
    });
    return base;
  }

  function gridPoint(grid, cols){
    cols = Number(cols || 10);
    return { row: Math.floor((Number(grid)-1) / cols), col: (Number(grid)-1) % cols };
  }
  function areOrthogonalAdjacent(a, b, cols){
    if(a === b) return true;
    var pa = gridPoint(a, cols), pb = gridPoint(b, cols);
    return Math.abs(pa.row - pb.row) + Math.abs(pa.col - pb.col) === 1;
  }
  function adjacencyPairs(items, cols){
    var pairs = [];
    for(var i=0; i<items.length; i++){
      for(var j=i+1; j<items.length; j++){
        if(areOrthogonalAdjacent(items[i].grid, items[j].grid, cols)){
          pairs.push({ a:items[i].id, b:items[j].id, gridA:items[i].grid, gridB:items[j].grid });
        }
      }
    }
    return pairs;
  }

  function normalizeSelection(scenario, selection){
    var candidates = mutations().candidatesForScenario(scenario);
    var byId = Object.create(null);
    candidates.forEach(function(m){ byId[m.id] = m; });
    return asArray(selection).map(function(item){
      if(typeof item === 'string') return byId[item] || null;
      if(item && item.mutationId && byId[item.mutationId]) return byId[item.mutationId];
      return item || null;
    }).filter(Boolean);
  }

  function summarizeDistribution(scenario, selection, policy){
    policy = mergePolicy(policy);
    var items = normalizeSelection(scenario, selection);
    var categories = countBy(items, function(x){ return x.category || ''; });
    var zones = countBy(items, function(x){ return x.zone || ''; });
    var targetKeys = items.map(function(x){ return (x.targetType || '')+':'+(x.targetId || ''); });
    var grids = items.map(function(x){ return x.grid; });
    var routes = Object.create(null);
    var routeLogicRequired = 0;
    var fixCodes = Object.create(null);
    items.forEach(function(item){
      if(item.routeLogicRequired) routeLogicRequired += 1;
      if(item.fixCode) fixCodes[item.fixCode] = true;
      asArray(item.routes).forEach(function(routeId){ routes[routeId] = (routes[routeId] || 0) + 1; });
    });
    return {
      scenarioId: scenario && scenario.id,
      total: items.length,
      expectedTotal: policy.errorCount,
      zones: zones,
      zoneCount: Object.keys(zones).filter(Boolean).length,
      maxZoneLoad: objectValues(zones).reduce(function(a,b){ return Math.max(a,b); }, 0),
      routes: routes,
      routeCount: Object.keys(routes).filter(Boolean).length,
      maxRouteLoad: objectValues(routes).reduce(function(a,b){ return Math.max(a,b); }, 0),
      categories: categories,
      routeLogicRequired: routeLogicRequired,
      grids: grids,
      uniqueGrids: Object.keys(countBy(items, function(x){ return x.grid; })).length,
      targetKeys: targetKeys,
      uniqueTargets: Object.keys(countBy(targetKeys, function(x){ return x; })).length,
      uniqueFixCodes: Object.keys(fixCodes).length,
      adjacencyPairs: adjacencyPairs(items, scenario.grid && scenario.grid.cols || 10),
      itemIds: items.map(function(x){ return x.id; })
    };
  }

  function duplicateValues(values){
    var seen = Object.create(null), duplicates = [];
    values.forEach(function(v){ if(seen[v] && duplicates.indexOf(v) === -1) duplicates.push(v); seen[v] = true; });
    return duplicates;
  }

  function validateDistribution(scenario, selection, policy){
    policy = mergePolicy(policy);
    var errors = [], warnings = [];
    if(!scenario || !scenario.id) add(errors, 'SCENARIO_MISSING', 'Validator braucht ein gueltiges Szenario.');
    var items = scenario ? normalizeSelection(scenario, selection) : [];
    var summary = scenario ? summarizeDistribution(scenario, items, policy) : { total:items.length };
    if(!scenario) return { ok:false, errors:errors, warnings:warnings, summary:summary, policy:policy };

    if(items.length !== policy.errorCount) add(errors, 'DISTRIBUTION_ERROR_COUNT_INVALID', 'Fehlermenge muss exakt '+policy.errorCount+' Fehler enthalten.', { actual:items.length, expected:policy.errorCount });
    var ids = items.map(function(x){ return x.id; });
    var duplicateIds = duplicateValues(ids);
    if(policy.noDuplicateMutations && duplicateIds.length) add(errors, 'DISTRIBUTION_DUPLICATE_MUTATIONS', 'Doppelte Mutation in Fehlermenge gefunden.', { duplicates:duplicateIds });

    var targetKeys = items.map(function(x){ return (x.targetType || '')+':'+(x.targetId || ''); });
    var duplicateTargets = duplicateValues(targetKeys);
    if(policy.noDuplicateTargets && duplicateTargets.length) add(errors, 'DISTRIBUTION_DUPLICATE_TARGETS', 'Mehrere Fehler auf demselben Element wuerden die Loesung uneindeutig machen.', { duplicates:duplicateTargets });

    var duplicateGrids = duplicateValues(items.map(function(x){ return x.grid; }));
    if(policy.noDuplicateGrids && duplicateGrids.length) add(errors, 'DISTRIBUTION_DUPLICATE_GRIDS', 'Mehrere Fehler auf demselben Rasterfeld sind nicht erlaubt.', { duplicates:duplicateGrids });
    if(policy.blockOrthogonalAdjacentGrids && summary.adjacencyPairs.length) add(errors, 'DISTRIBUTION_ADJACENT_GRIDS', 'Fehler duerfen nicht direkt nebeneinander liegen.', { pairs:summary.adjacencyPairs });

    if(summary.zoneCount < policy.minZones) add(errors, 'DISTRIBUTION_TOO_FEW_ZONES', 'Fehler muessen ueber mindestens '+policy.minZones+' Prozesszonen verteilt sein.', { zoneCount:summary.zoneCount, zones:summary.zones });
    Object.keys(summary.zones).forEach(function(zone){ if(summary.zones[zone] > policy.maxPerZone) add(errors, 'DISTRIBUTION_ZONE_OVERLOAD', 'Zu viele Fehler in Zone '+zone+'.', { zone:zone, count:summary.zones[zone], max:policy.maxPerZone }); });

    if(summary.routeCount < policy.minRoutes) add(errors, 'DISTRIBUTION_TOO_FEW_ROUTES', 'Fehler muessen mehrere logische Routen betreffen.', { routeCount:summary.routeCount, routes:summary.routes });
    Object.keys(summary.routes).forEach(function(route){ if(summary.routes[route] > policy.maxPerRoute) add(errors, 'DISTRIBUTION_ROUTE_OVERLOAD', 'Zu viele Fehler auf derselben Route.', { route:route, count:summary.routes[route], max:policy.maxPerRoute }); });
    if(summary.routeLogicRequired < policy.minRouteLogicRequired) add(errors, 'DISTRIBUTION_TOO_FEW_ROUTE_LOGIC_ERRORS', 'Zu wenige Fehler erfordern echte Routen-/Ja-Nein-Pruefung.', { routeLogicRequired:summary.routeLogicRequired, min:policy.minRouteLogicRequired });

    var constants = schema().constants;
    if(policy.requireAllCategories){
      constants.ERROR_CATEGORIES.forEach(function(cat){ if(!summary.categories[cat]) add(errors, 'DISTRIBUTION_CATEGORY_MISSING', 'Fehlerkategorie fehlt: '+cat, { categories:summary.categories }); });
    }
    Object.keys(policy.minCategoryCounts || {}).forEach(function(cat){
      var min = policy.minCategoryCounts[cat];
      if((summary.categories[cat] || 0) < min) add(errors, 'DISTRIBUTION_CATEGORY_TOO_LOW', 'Zu wenige Fehler in Kategorie '+cat+'.', { category:cat, actual:summary.categories[cat] || 0, min:min });
    });
    if(summary.uniqueFixCodes < policy.minUniqueFixCodes) add(errors, 'DISTRIBUTION_FIXCODE_DIVERSITY_LOW', 'Zu wenig unterschiedliche Korrektur-Codes.', { uniqueFixCodes:summary.uniqueFixCodes, min:policy.minUniqueFixCodes });

    items.forEach(function(item){
      var report = mutations().validateMutation(scenario, item);
      if(!report.ok) add(errors, 'DISTRIBUTION_MUTATION_INVALID', 'Ungültige Mutation in Fehlermenge.', { id:item.id, report:report });
    });

    if(policy.validateSchemaAfterApply && errors.length === 0){
      try {
        var mutated = mutations().applyMutationSet(scenario, items);
        var schemaReport = schema().validateScenario(mutated);
        if(!schemaReport.ok) add(errors, 'DISTRIBUTION_MUTATED_SCHEMA_INVALID', 'Mutierte Aufgabe verletzt den Szenario-Datenvertrag.', schemaReport);
        if(asArray(mutated.answerKey).length !== policy.errorCount) add(errors, 'DISTRIBUTION_ANSWERKEY_COUNT_INVALID', 'Antwortschluessel passt nicht zur Fehleranzahl.', { answerKey:asArray(mutated.answerKey).length, expected:policy.errorCount });
      } catch(err){
        add(errors, 'DISTRIBUTION_APPLY_FAILED', 'Fehlermenge konnte nicht sicher angewendet werden.', { message:err && err.message ? err.message : String(err) });
      }
    }

    return { ok:errors.length === 0, errors:errors, warnings:warnings, summary:summary, policy:policy };
  }

  function basicCandidateAllowed(scenario, item, chosen, policy){
    if(policy.noDuplicateMutations && chosen.some(function(x){ return x.id === item.id; })) return false;
    if(policy.noDuplicateTargets && chosen.some(function(x){ return x.targetType === item.targetType && x.targetId === item.targetId; })) return false;
    if(policy.noDuplicateGrids && chosen.some(function(x){ return x.grid === item.grid; })) return false;
    if(policy.blockOrthogonalAdjacentGrids && chosen.some(function(x){ return areOrthogonalAdjacent(x.grid, item.grid, scenario.grid && scenario.grid.cols || 10); })) return false;
    var zoneCount = chosen.filter(function(x){ return x.zone === item.zone; }).length;
    if(zoneCount + 1 > policy.maxPerZone) return false;
    var routeLoads = Object.create(null);
    chosen.forEach(function(x){ asArray(x.routes).forEach(function(r){ routeLoads[r] = (routeLoads[r] || 0) + 1; }); });
    var overRoute = false;
    asArray(item.routes).forEach(function(r){ if((routeLoads[r] || 0) + 1 > policy.maxPerRoute) overRoute = true; });
    return !overRoute;
  }

  function selectDistributedSet(scenario, policy){
    policy = mergePolicy(policy);
    var candidates = mutations().candidatesForScenario(scenario).slice();
    candidates.sort(function(a,b){
      var za = String(a.zone || '').localeCompare(String(b.zone || ''));
      if(za) return za;
      var ca = String(a.category || '').localeCompare(String(b.category || ''));
      if(ca) return ca;
      return Number(a.grid || 0) - Number(b.grid || 0);
    });
    var bestFailure = null;
    function rememberFailure(report){
      if(!bestFailure || report.errors.length < bestFailure.errors.length) bestFailure = report;
    }
    function walk(start, chosen){
      if(chosen.length === policy.errorCount){
        var report = validateDistribution(scenario, chosen, policy);
        if(report.ok) return chosen.slice();
        rememberFailure(report);
        return null;
      }
      if(candidates.length - start < policy.errorCount - chosen.length) return null;
      for(var i=start; i<candidates.length; i++){
        var item = candidates[i];
        if(!basicCandidateAllowed(scenario, item, chosen, policy)) continue;
        chosen.push(item);
        var result = walk(i+1, chosen);
        if(result) return result;
        chosen.pop();
      }
      return null;
    }
    var selected = walk(0, []);
    if(!selected){
      var err = new Error('Keine gueltige FlowLogic-Fehlerverteilung gefunden fuer '+scenario.id);
      err.report = bestFailure || { ok:false, errors:[{ code:'NO_COMBINATION', message:'Keine Kandidatenkombination gefunden.' }], summary:{ candidates:candidates.length }, policy:policy };
      throw err;
    }
    return selected;
  }

  function createValidatedTask(scenarioOrId, policy){
    var scenario = typeof scenarioOrId === 'string' ? scenarios().get(scenarioOrId) : clone(scenarioOrId);
    var selected = selectDistributedSet(scenario, policy);
    var task = mutations().applyMutationSet(scenario, selected);
    task.metadata = task.metadata || {};
    task.metadata.phase = Math.max(Number(task.metadata.phase || 0), 5);
    task.metadata.distributionReady = true;
    task.metadata.distributionPolicy = mergePolicy(policy);
    task.metadata.selectedMutationIds = selected.map(function(m){ return m.id; });
    var report = validateDistribution(scenario, selected, policy);
    if(!report.ok){
      var err = new Error('Validierte Aufgabe wurde nach Anwendung wieder ungueltig: '+scenario.id);
      err.report = report;
      throw err;
    }
    return { scenario:scenario, task:task, mutations:selected, report:report };
  }

  function validateAllScenarioPools(policy){
    var items = scenarios().getAll().map(function(s){
      try {
        var selected = selectDistributedSet(s, policy);
        var report = validateDistribution(s, selected, policy);
        return { scenarioId:s.id, title:s.title, ok:report.ok, selected:selected.map(function(m){ return m.id; }), report:report };
      } catch(err){
        return { scenarioId:s.id, title:s.title, ok:false, error:{ message:err && err.message ? err.message : String(err), report:err && err.report ? err.report : null } };
      }
    });
    return { ok:items.every(function(x){ return x.ok; }), total:items.length, items:items };
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    defaultPolicy: Object.freeze(mergePolicy()),
    mergePolicy: mergePolicy,
    validateDistribution: validateDistribution,
    summarizeDistribution: summarizeDistribution,
    selectDistributedSet: selectDistributedSet,
    createValidatedTask: createValidatedTask,
    validateAllScenarioPools: validateAllScenarioPools,
    areOrthogonalAdjacent: areOrthogonalAdjacent
  });

  window.FlowLogicValidator = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase5.validator-api', 'Phase 5: Verteilungs-Validator-API vorhanden', function(t){
      t.assert(window.FlowLogicValidator && window.FlowLogicValidator.__version.indexOf('G39.26') !== -1, 'FlowLogicValidator fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicValidator.validateDistribution === 'function', 'validateDistribution fehlt.');
      t.assert(typeof window.FlowLogicValidator.selectDistributedSet === 'function', 'selectDistributedSet fehlt.');
      return { version:window.FlowLogicValidator.__version, policy:window.FlowLogicValidator.defaultPolicy };
    }, { phase:'5', critical:true });

    window.FlowLogicSelfTest.register('phase5.rejects-clustered-or-duplicate-set', 'Phase 5: Cluster/Doppelungen werden blockiert', function(t){
      var s = window.FlowLogicScenarios.getAll()[0];
      var c = window.FlowLogicMutations.candidatesForScenario(s);
      var bad = [c[0],c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9]];
      var report = window.FlowLogicValidator.validateDistribution(s, bad);
      t.assert(!report.ok, 'Doppelte/unsaubere Fehlermenge wurde faelschlich akzeptiert.', report);
      var codes = report.errors.map(function(e){ return e.code; });
      t.assert(codes.indexOf('DISTRIBUTION_DUPLICATE_MUTATIONS') !== -1 || codes.indexOf('DISTRIBUTION_DUPLICATE_TARGETS') !== -1, 'Doppelung wurde nicht erkannt.', codes);
      return { blocked:true, errorCodes:codes };
    }, { phase:'5', critical:true });

    window.FlowLogicSelfTest.register('phase5.selects-valid-set-for-every-master-scenario', 'Phase 5: Fuer jedes Master-Szenario existiert eine gueltige 11-Fehler-Verteilung', function(t){
      var report = window.FlowLogicValidator.validateAllScenarioPools();
      t.assert(report.ok, 'Mindestens ein Szenario kann keine gueltige 11-Fehler-Verteilung bilden.', report);
      report.items.forEach(function(item){
        t.assert(item.report.summary.total === 11, 'Fehleranzahl ist nicht 11: '+item.scenarioId, item.report.summary);
        t.assert(item.report.summary.zoneCount >= 5, 'Zu wenige Zonen betroffen: '+item.scenarioId, item.report.summary);
        t.assert(item.report.summary.routeCount >= 4, 'Zu wenige Routen betroffen: '+item.scenarioId, item.report.summary);
        t.assert(item.report.summary.adjacencyPairs.length === 0, 'Direkt benachbarte Fehler gefunden: '+item.scenarioId, item.report.summary.adjacencyPairs);
      });
      return report;
    }, { phase:'5', critical:true });

    window.FlowLogicSelfTest.register('phase5.validated-task-remains-schema-valid', 'Phase 5: Validierte Aufgabe bleibt nach Mutation schema-valide', function(t){
      var output = [];
      window.FlowLogicScenarios.getAll().forEach(function(s){
        var built = window.FlowLogicValidator.createValidatedTask(s);
        var schemaReport = window.FlowLogicSchema.validateScenario(built.task);
        t.assert(schemaReport.ok, 'Validierte Aufgabe verletzt Schema: '+s.id, schemaReport);
        t.assert(built.task.answerKey.length === 11, 'Antwortschluessel muss exakt 11 Eintraege enthalten: '+s.id, built.task.answerKey);
        output.push({ scenarioId:s.id, answerKey:built.task.answerKey.length, zones:built.report.summary.zoneCount, routes:built.report.summary.routeCount, categories:built.report.summary.categories });
      });
      return output;
    }, { phase:'5', critical:true });
  }
})();
