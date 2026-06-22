/* Ablaufplan-Detektiv · FlowLogic SVG Renderer · Phase 6
   Rendert validierte FlowLogic-Aufgaben als skalierbaren SVG-Ablaufplan mit 10x7-Raster,
   sauberen Formen, Pfeilen, Labels und grossen Touch-Flaechen. Keine Bewertung, kein Generator. */
(function(){
  'use strict';

  var VERSION = 'G39.26-FLOWLOGIC-STANDALONE-PHASE12-2026-06-14';
  var MODULE_ID = 'flowlogic';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function clone(value){ return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function asArray(value){ return Array.isArray(value) ? value : []; }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  function byId(items){
    var map = Object.create(null);
    asArray(items).forEach(function(item){ if(item && item.id) map[item.id] = item; });
    return map;
  }
  function number(value, fallback){
    var n = Number(value);
    return isFinite(n) ? n : fallback;
  }
  function textOf(item){ return String((item && (item.renderedLabel || item.label)) || '').trim(); }

  function getConfig(task, options){
    options = options || {};
    var grid = task && task.grid || {};
    var cols = number(options.cols || grid.cols, 10);
    var rows = number(options.rows || grid.rows, 7);
    var width = number(options.width, 1000);
    var height = number(options.height, 720);
    return {
      cols: cols,
      rows: rows,
      width: width,
      height: height,
      cellW: width / cols,
      cellH: height / rows,
      nodeW: number(options.nodeW, 86),
      nodeH: number(options.nodeH, 54),
      diamondW: number(options.diamondW, 88),
      diamondH: number(options.diamondH, 70),
      terminalW: number(options.terminalW, 88),
      terminalH: number(options.terminalH, 48),
      touchPad: number(options.touchPad, 12),
      maxLabelLines: number(options.maxLabelLines, 3),
      maxCharsPerLine: number(options.maxCharsPerLine, 13)
    };
  }

  function gridToCell(grid, cfg){
    var g = Math.max(1, Math.min(cfg.cols * cfg.rows, number(grid, 1)));
    var index = g - 1;
    return { col: index % cfg.cols, row: Math.floor(index / cfg.cols), grid: g };
  }

  function centerForGrid(grid, cfg){
    var cell = gridToCell(grid, cfg);
    return {
      x: cell.col * cfg.cellW + cfg.cellW / 2,
      y: cell.row * cfg.cellH + cfg.cellH / 2,
      col: cell.col,
      row: cell.row,
      grid: cell.grid
    };
  }

  function boxForNode(node, cfg){
    var c = centerForGrid(node.grid, cfg);
    var shape = node.renderedShape || node.correctShape || 'rectangle';
    var w = cfg.nodeW;
    var h = cfg.nodeH;
    if(shape === 'diamond') { w = cfg.diamondW; h = cfg.diamondH; }
    if(shape === 'oval') { w = cfg.terminalW; h = cfg.terminalH; }
    if(shape === 'circle') { w = Math.min(cfg.nodeW, cfg.nodeH); h = w; }
    return {
      id: node.id,
      grid: node.grid,
      cx: c.x,
      cy: c.y,
      x: c.x - w / 2,
      y: c.y - h / 2,
      w: w,
      h: h,
      shape: shape,
      kind: node.kind,
      label: textOf(node),
      source: node
    };
  }

  function wrapLabel(text, maxChars, maxLines){
    text = String(text || '').replace(/\s+/g, ' ').trim();
    if(!text) return [''];
    var words = text.split(' ');
    var lines = [];
    var current = '';
    words.forEach(function(word){
      if(!current) current = word;
      else if((current + ' ' + word).length <= maxChars) current += ' ' + word;
      else { lines.push(current); current = word; }
    });
    if(current) lines.push(current);
    var normalized = [];
    lines.forEach(function(line){
      if(line.length <= maxChars + 4) normalized.push(line);
      else {
        var rest = line;
        while(rest.length > maxChars + 4){ normalized.push(rest.slice(0, maxChars + 2)); rest = rest.slice(maxChars + 2); }
        if(rest) normalized.push(rest);
      }
    });
    if(normalized.length > maxLines){
      normalized = normalized.slice(0, maxLines);
      var last = normalized[normalized.length - 1];
      normalized[normalized.length - 1] = last.length > 3 ? last.slice(0, Math.max(1, maxChars - 1)) + '…' : last + '…';
    }
    return normalized.length ? normalized : [''];
  }

  function boundaryPoint(fromBox, toBox){
    var dx = toBox.cx - fromBox.cx;
    var dy = toBox.cy - fromBox.cy;
    if(dx === 0 && dy === 0) return { x: fromBox.cx, y: fromBox.cy };
    var hw = Math.max(1, fromBox.w / 2);
    var hh = Math.max(1, fromBox.h / 2);
    var scale = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
    return { x: fromBox.cx + dx * scale, y: fromBox.cy + dy * scale };
  }

  function makePath(edgeLayout){
    var a = edgeLayout.start;
    var b = edgeLayout.end;
    var dx = Math.abs(b.x - a.x);
    var dy = Math.abs(b.y - a.y);
    if(dx < 8 || dy < 8){ return 'M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' L '+b.x.toFixed(1)+' '+b.y.toFixed(1); }
    var midY = a.y + (b.y - a.y) * 0.5;
    return 'M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' C '+a.x.toFixed(1)+' '+midY.toFixed(1)+', '+b.x.toFixed(1)+' '+midY.toFixed(1)+', '+b.x.toFixed(1)+' '+b.y.toFixed(1);
  }

  function edgeMidpoint(edgeLayout){
    return {
      x: (edgeLayout.start.x + edgeLayout.end.x) / 2,
      y: (edgeLayout.start.y + edgeLayout.end.y) / 2
    };
  }

  function buildLayout(task, options){
    if(!task || !task.grid || !Array.isArray(task.nodes) || !Array.isArray(task.edges)){
      throw new Error('FlowLogicRenderer.buildLayout braucht eine FlowLogic-Aufgabe mit grid/nodes/edges.');
    }
    var cfg = getConfig(task, options || {});
    var nodeMap = byId(task.nodes);
    var nodeBoxes = Object.create(null);
    var nodes = task.nodes.map(function(node){
      var box = boxForNode(node, cfg);
      box.lines = wrapLabel(box.label, cfg.maxCharsPerLine, cfg.maxLabelLines);
      nodeBoxes[node.id] = box;
      return box;
    });
    var edges = task.edges.map(function(edge){
      var from = nodeBoxes[edge.from];
      var renderedTargetId = edge.renderedTo || edge.to;
      var to = nodeBoxes[renderedTargetId];
      var label = edge.renderedLabel != null ? edge.renderedLabel : (edge.label || '');
      var layout = {
        id: edge.id,
        fromId: edge.from,
        toId: renderedTargetId,
        correctToId: edge.correctTo || edge.to,
        originalToId: edge.to,
        label: String(label || ''),
        source: edge,
        fromBox: from || null,
        toBox: to || null,
        grid: edge.grid || null
      };
      if(from && to){
        layout.start = boundaryPoint(from, to);
        layout.end = boundaryPoint(to, from);
        layout.path = makePath(layout);
        layout.mid = edgeMidpoint(layout);
      }
      return layout;
    });
    return { config:cfg, nodes:nodes, edges:edges, nodeMap:nodeMap, task:task };
  }

  function intersects(a, b, padding){
    padding = padding || 0;
    return !(a.x + a.w + padding <= b.x || b.x + b.w + padding <= a.x || a.y + a.h + padding <= b.y || b.y + b.h + padding <= a.y);
  }

  function validateLayout(taskOrLayout, options){
    var layout = taskOrLayout && taskOrLayout.nodes && taskOrLayout.edges && taskOrLayout.config
      ? taskOrLayout
      : buildLayout(taskOrLayout, options || {});
    var errors = [];
    var warnings = [];
    var cfg = layout.config;
    function add(list, code, message, details){ list.push({ code:code, message:message, details:details || null }); }
    if(layout.nodes.length < 2) add(errors, 'RENDER_NODES_TOO_FEW', 'Renderer braucht mindestens Start- und Endknoten.');
    layout.nodes.forEach(function(node){
      if(!node.id) add(errors, 'RENDER_NODE_ID_MISSING', 'Knoten ohne ID im Layout.', node);
      if(!isFinite(node.cx) || !isFinite(node.cy)) add(errors, 'RENDER_NODE_COORD_INVALID', 'Knoten hat ungueltige Koordinaten.', node);
      if(node.x < 0 || node.y < 0 || node.x + node.w > cfg.width || node.y + node.h > cfg.height) add(errors, 'RENDER_NODE_OUT_OF_VIEWBOX', 'Knoten liegt ausserhalb der SVG-viewBox.', { id:node.id, box:{x:node.x,y:node.y,w:node.w,h:node.h}, viewBox:{w:cfg.width,h:cfg.height} });
      if(!node.lines || !node.lines.length) add(errors, 'RENDER_NODE_TEXT_EMPTY', 'Knoten hat keinen darstellbaren Text.', { id:node.id });
      if(node.lines && node.lines.length > cfg.maxLabelLines) add(errors, 'RENDER_NODE_TEXT_TOO_MANY_LINES', 'Knotentext ueberschreitet Zeilenlimit.', { id:node.id, lines:node.lines });
    });
    for(var i=0; i<layout.nodes.length; i++){
      for(var j=i+1; j<layout.nodes.length; j++){
        if(intersects(layout.nodes[i], layout.nodes[j], 2)){
          add(errors, 'RENDER_NODE_OVERLAP', 'Zwei Hauptformen ueberlappen im SVG-Layout.', { a:layout.nodes[i].id, b:layout.nodes[j].id });
        }
      }
    }
    layout.edges.forEach(function(edge){
      if(!edge.fromBox) add(errors, 'RENDER_EDGE_FROM_MISSING', 'Pfeil startet an unbekanntem Knoten.', { edgeId:edge.id, from:edge.fromId });
      if(!edge.toBox) add(errors, 'RENDER_EDGE_TO_MISSING', 'Pfeil endet an unbekanntem Knoten.', { edgeId:edge.id, to:edge.toId });
      if(edge.fromBox && edge.toBox){
        if(!edge.path || edge.path.indexOf('M ') !== 0) add(errors, 'RENDER_EDGE_PATH_INVALID', 'Pfeilpfad konnte nicht berechnet werden.', { edgeId:edge.id });
        if(!isFinite(edge.start.x) || !isFinite(edge.end.x)) add(errors, 'RENDER_EDGE_COORD_INVALID', 'Pfeil hat ungueltige Koordinaten.', { edgeId:edge.id });
      }
    });
    if(layout.edges.length < 1) add(errors, 'RENDER_EDGES_MISSING', 'Keine Pfeile im Layout vorhanden.');
    return { ok:errors.length === 0, errors:errors, warnings:warnings, summary:{ nodes:layout.nodes.length, edges:layout.edges.length, viewBox:[0,0,cfg.width,cfg.height] } };
  }

  function shapeSvg(node){
    var attrs = 'class="flowlogic-node-shape flowlogic-shape-'+esc(node.shape)+' flowlogic-kind-'+esc(node.kind)+'" data-flowlogic-node-id="'+esc(node.id)+'"';
    if(node.shape === 'diamond'){
      var pts = [
        [node.cx, node.y],
        [node.x + node.w, node.cy],
        [node.cx, node.y + node.h],
        [node.x, node.cy]
      ].map(function(p){ return p[0].toFixed(1)+','+p[1].toFixed(1); }).join(' ');
      return '<polygon '+attrs+' points="'+pts+'"></polygon>';
    }
    if(node.shape === 'oval'){
      return '<ellipse '+attrs+' cx="'+node.cx.toFixed(1)+'" cy="'+node.cy.toFixed(1)+'" rx="'+(node.w/2).toFixed(1)+'" ry="'+(node.h/2).toFixed(1)+'"></ellipse>';
    }
    if(node.shape === 'circle'){
      return '<circle '+attrs+' cx="'+node.cx.toFixed(1)+'" cy="'+node.cy.toFixed(1)+'" r="'+(Math.min(node.w,node.h)/2).toFixed(1)+'"></circle>';
    }
    return '<rect '+attrs+' x="'+node.x.toFixed(1)+'" y="'+node.y.toFixed(1)+'" width="'+node.w.toFixed(1)+'" height="'+node.h.toFixed(1)+'" rx="14" ry="14"></rect>';
  }

  function textSvg(node){
    var lineH = 13;
    var y0 = node.cy - ((node.lines.length - 1) * lineH / 2) + 4;
    var tspans = node.lines.map(function(line, idx){
      return '<tspan x="'+node.cx.toFixed(1)+'" y="'+(y0 + idx * lineH).toFixed(1)+'">'+esc(line)+'</tspan>';
    }).join('');
    return '<text class="flowlogic-node-label" data-flowlogic-node-label="'+esc(node.id)+'" text-anchor="middle" aria-hidden="true">'+tspans+'</text>';
  }

  function gridSvg(cfg){
    var out = ['<g class="flowlogic-grid" aria-hidden="true">'];
    for(var r=0; r<cfg.rows; r++){
      for(var c=0; c<cfg.cols; c++){
        var n = r * cfg.cols + c + 1;
        var x = c * cfg.cellW;
        var y = r * cfg.cellH;
        out.push('<rect class="flowlogic-grid-cell" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+cfg.cellW.toFixed(1)+'" height="'+cfg.cellH.toFixed(1)+'"></rect>');
        out.push('<text class="flowlogic-grid-number" x="'+(x+6).toFixed(1)+'" y="'+(y+14).toFixed(1)+'">'+n+'</text>');
      }
    }
    out.push('</g>');
    return out.join('');
  }

  function zonesSvg(task, cfg){
    var zones = asArray(task.zones).slice().sort(function(a,b){ return Number(a.order || 0) - Number(b.order || 0); });
    var out = ['<g class="flowlogic-zone-layer" aria-hidden="true">'];
    zones.forEach(function(zone){
      if(!Array.isArray(zone.gridRange)) return;
      var start = gridToCell(zone.gridRange[0], cfg);
      var end = gridToCell(zone.gridRange[1], cfg);
      if(start.row !== end.row) return;
      var x = start.col * cfg.cellW;
      var y = start.row * cfg.cellH;
      var w = (end.col - start.col + 1) * cfg.cellW;
      out.push('<rect class="flowlogic-zone-band" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+cfg.cellH.toFixed(1)+'"></rect>');
      out.push('<text class="flowlogic-zone-label" x="'+(x+cfg.cellW/2).toFixed(1)+'" y="'+(y+cfg.cellH-8).toFixed(1)+'">'+esc(zone.label)+'</text>');
    });
    out.push('</g>');
    return out.join('');
  }

  function edgesSvg(layout){
    var out = ['<g class="flowlogic-edge-layer">'];
    layout.edges.forEach(function(edge){
      if(!edge.path) return;
      out.push('<path class="flowlogic-edge" data-flowlogic-edge-id="'+esc(edge.id)+'" d="'+edge.path+'" marker-end="url(#flowlogic-arrow-head)"></path>');
      out.push('<path class="flowlogic-edge-touch" data-flowlogic-target-type="edge" data-flowlogic-target-id="'+esc(edge.id)+'" data-flowlogic-grid="'+esc(edge.grid || '')+'" d="'+edge.path+'" tabindex="0" role="button" aria-label="Pfeil '+esc(edge.id)+'"></path>');
      if(edge.label){
        out.push('<g class="flowlogic-edge-label-group" data-flowlogic-edge-label="'+esc(edge.id)+'">');
        out.push('<rect class="flowlogic-edge-label-bg" x="'+(edge.mid.x-17).toFixed(1)+'" y="'+(edge.mid.y-12).toFixed(1)+'" width="34" height="20" rx="10"></rect>');
        out.push('<text class="flowlogic-edge-label" x="'+edge.mid.x.toFixed(1)+'" y="'+(edge.mid.y+4).toFixed(1)+'" text-anchor="middle">'+esc(edge.label)+'</text>');
        out.push('</g>');
      }
    });
    out.push('</g>');
    return out.join('');
  }

  function nodesSvg(layout){
    var cfg = layout.config;
    var out = ['<g class="flowlogic-node-layer">'];
    layout.nodes.forEach(function(node){
      out.push('<g class="flowlogic-node" data-flowlogic-target-type="node" data-flowlogic-target-id="'+esc(node.id)+'" data-flowlogic-grid="'+esc(node.grid)+'" tabindex="0" role="button" aria-label="Raster '+esc(node.grid)+': '+esc(node.label)+'">');
      out.push(shapeSvg(node));
      out.push(textSvg(node));
      out.push('<rect class="flowlogic-node-touch" x="'+(node.x-cfg.touchPad).toFixed(1)+'" y="'+(node.y-cfg.touchPad).toFixed(1)+'" width="'+(node.w+cfg.touchPad*2).toFixed(1)+'" height="'+(node.h+cfg.touchPad*2).toFixed(1)+'" rx="18" ry="18"></rect>');
      out.push('<title>Raster '+esc(node.grid)+' · '+esc(node.label)+'</title>');
      out.push('</g>');
    });
    out.push('</g>');
    return out.join('');
  }

  function renderSvgString(task, options){
    var layout = buildLayout(task, options || {});
    var report = validateLayout(layout);
    var cfg = layout.config;
    var title = task.title || 'Ablaufplan-Detektiv';
    return {
      ok: report.ok,
      report: report,
      layout: layout,
      svg: ''+
        '<svg class="flowlogic-svg" xmlns="'+SVG_NS+'" viewBox="0 0 '+cfg.width+' '+cfg.height+'" role="img" aria-label="'+esc(title)+'" preserveAspectRatio="xMidYMid meet">'+
          '<defs>'+ 
            '<marker id="flowlogic-arrow-head" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">'+
              '<path class="flowlogic-arrow-head" d="M 0 0 L 12 6 L 0 12 z"></path>'+ 
            '</marker>'+ 
          '</defs>'+ 
          '<rect class="flowlogic-svg-bg" x="0" y="0" width="'+cfg.width+'" height="'+cfg.height+'" rx="22"></rect>'+ 
          zonesSvg(task, cfg)+
          gridSvg(cfg)+
          edgesSvg(layout)+
          nodesSvg(layout)+
        '</svg>'
    };
  }

  function renderTo(container, task, options){
    if(!container || !container.appendChild) throw new Error('FlowLogicRenderer.renderTo braucht ein gueltiges Container-Element.');
    options = options || {};
    var result = renderSvgString(task, options);
    if(options.clear !== false) container.innerHTML = '';
    var root = document.createElement('section');
    root.className = 'flowlogic-renderer-root';
    root.setAttribute('data-flowlogic-renderer-version', VERSION);
    root.innerHTML = ''+
      '<header class="flowlogic-renderer-head">'+
        '<div><span class="flowlogic-eyebrow">SVG-Renderer · Phase 6</span><h3>'+esc(task.title || 'Ablaufplan')+'</h3></div>'+ 
        '<div class="flowlogic-renderer-meta"><span>'+esc(asArray(task.answerKey).length)+' Fehler-Schluessel</span><span>'+esc(asArray(task.nodes).length)+' Elemente</span><span>'+esc(asArray(task.edges).length)+' Pfeile</span></div>'+ 
      '</header>'+ 
      '<div class="flowlogic-svg-shell" data-flowlogic-svg-shell>'+result.svg+'</div>'+ 
      '<footer class="flowlogic-renderer-foot">'+
        '<span>Raster: '+esc((task.grid && task.grid.cols || 10)+' × '+(task.grid && task.grid.rows || 7))+'</span>'+ 
        '<span>Layout: '+(result.ok ? 'gültig' : 'prüfen')+'</span>'+ 
      '</footer>';
    container.appendChild(root);
    return { root:root, svg:root.querySelector('svg'), layout:result.layout, report:result.report, ok:result.ok, destroy:function(){ if(root.parentNode) root.parentNode.removeChild(root); } };
  }

  function makePreviewTask(scenarioId){
    if(!window.FlowLogicValidator || typeof window.FlowLogicValidator.createValidatedTask !== 'function') throw new Error('FlowLogicValidator fehlt fuer Preview-Aufgabe.');
    var id = scenarioId || 'flow_master_postbote_nachnahme';
    return window.FlowLogicValidator.createValidatedTask(id).task;
  }

  function renderPreviewTo(container, scenarioId, options){
    return renderTo(container, makePreviewTask(scenarioId), options || {});
  }

  var api = Object.freeze({
    __version: VERSION,
    moduleId: MODULE_ID,
    buildLayout: buildLayout,
    validateLayout: validateLayout,
    renderSvgString: renderSvgString,
    renderTo: renderTo,
    renderPreviewTo: renderPreviewTo,
    makePreviewTask: makePreviewTask,
    wrapLabel: wrapLabel,
    centerForGrid: centerForGrid
  });

  window.FlowLogicRenderer = api;

  if(window.FlowLogicSelfTest && typeof window.FlowLogicSelfTest.register === 'function'){
    window.FlowLogicSelfTest.register('phase6.renderer-api', 'Phase 6: SVG-Renderer-API vorhanden', function(t){
      t.assert(window.FlowLogicRenderer && window.FlowLogicRenderer.__version.indexOf('G39.26') !== -1, 'FlowLogicRenderer fehlt oder hat falsche Version.');
      t.assert(typeof window.FlowLogicRenderer.buildLayout === 'function', 'buildLayout fehlt.');
      t.assert(typeof window.FlowLogicRenderer.renderSvgString === 'function', 'renderSvgString fehlt.');
      t.assert(typeof window.FlowLogicRenderer.renderTo === 'function', 'renderTo fehlt.');
      return { version:window.FlowLogicRenderer.__version };
    }, { phase:'6', critical:true });

    window.FlowLogicSelfTest.register('phase6.layout-valid-all-master-scenarios', 'Phase 6: Alle validierten Master-Aufgaben sind renderbar', function(t){
      var items = [];
      window.FlowLogicScenarios.getAll().forEach(function(s){
        var built = window.FlowLogicValidator.createValidatedTask(s.id);
        var layout = window.FlowLogicRenderer.buildLayout(built.task);
        var report = window.FlowLogicRenderer.validateLayout(layout);
        t.assert(report.ok, 'Renderer-Layout ist ungueltig: '+s.id, report);
        t.assert(report.summary.nodes === built.task.nodes.length, 'Node-Anzahl stimmt nicht: '+s.id, report.summary);
        t.assert(report.summary.edges === built.task.edges.length, 'Edge-Anzahl stimmt nicht: '+s.id, report.summary);
        items.push({ scenarioId:s.id, nodes:report.summary.nodes, edges:report.summary.edges, warnings:report.warnings.length });
      });
      return items;
    }, { phase:'6', critical:true });

    window.FlowLogicSelfTest.register('phase6.svg-string-complete', 'Phase 6: SVG-String enthaelt Raster, Formen und Pfeile', function(t){
      var task = window.FlowLogicRenderer.makePreviewTask('flow_master_postbote_nachnahme');
      var rendered = window.FlowLogicRenderer.renderSvgString(task);
      t.assert(rendered.ok, 'SVG-Layout-Report nicht OK.', rendered.report);
      t.assert(rendered.svg.indexOf('<svg') !== -1, 'SVG-Tag fehlt.');
      t.assert(rendered.svg.indexOf('flowlogic-grid-cell') !== -1, 'Rasterzellen fehlen.');
      t.assert(rendered.svg.indexOf('flowlogic-edge') !== -1, 'Pfeile fehlen.');
      t.assert(rendered.svg.indexOf('flowlogic-node') !== -1, 'Knoten fehlen.');
      return { length:rendered.svg.length, nodes:rendered.layout.nodes.length, edges:rendered.layout.edges.length };
    }, { phase:'6', critical:true });

    window.FlowLogicSelfTest.register('phase6.render-dom-no-leak', 'Phase 6: DOM-Render/Destroy ohne Leak', function(t){
      var host = document.createElement('div');
      host.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1200px;height:800px;overflow:hidden;';
      document.body.appendChild(host);
      var before = document.querySelectorAll('.flowlogic-renderer-root').length;
      var handle = window.FlowLogicRenderer.renderPreviewTo(host, 'flow_master_parksensor');
      t.assert(handle && handle.svg, 'Renderer hat kein SVG erzeugt.');
      t.assert(host.querySelectorAll('.flowlogic-node').length >= 10, 'Zu wenige gerenderte Knoten.');
      t.assert(host.querySelectorAll('.flowlogic-edge').length >= 10, 'Zu wenige gerenderte Pfeile.');
      handle.destroy();
      var after = document.querySelectorAll('.flowlogic-renderer-root').length;
      if(host.parentNode) host.parentNode.removeChild(host);
      t.assert(after === before, 'Renderer-DOM wurde nach destroy nicht sauber entfernt.', { before:before, after:after });
      return { before:before, after:after };
    }, { phase:'6', critical:true });
  }
})();
