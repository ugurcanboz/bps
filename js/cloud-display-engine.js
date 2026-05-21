/* V8.3.9 Cloud Display Engine
   Ziel: Highscore-Anzeige unabhängig von alten Buttons/Re-Render-Pfaden stabil laden.
   Keine UI-Strukturänderung außerhalb des Cloud-Kastens. */
(function(){
  'use strict';
  const VERSION = '8.3.9';
  const STATE = { busy:false, lastRender:0, lastKey:'', observer:null };
  function cfg(){
    const c = window.CLOUD_HIGHSCORE_CONFIG || {};
    return {
      enabled: c.enabled !== false,
      provider: c.provider || 'supabase',
      url: String(c.supabaseUrl || '').replace(/\/$/,''),
      key: String(c.anonKey || ''),
      table: String(c.table || 'highscores'),
      classCode: String(c.classCode || 'default'),
      limit: Math.max(5, Math.min(50, Number(c.limit || 20)))
    };
  }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m])); }
  function card(){ return document.getElementById('cloudHighscoreCard'); }
  function configured(c){ return c.enabled && c.provider === 'supabase' && /^https:\/\/[^\s]+\.supabase\.co$/i.test(c.url) && c.key.length > 20 && !!c.table; }
  function endpoint(c, query){ return c.url + '/rest/v1/' + encodeURIComponent(c.table) + query; }
  function headers(c, extra){
    const h = Object.assign({'apikey':c.key, 'Content-Type':'application/json', 'Cache-Control':'no-cache'}, extra || {});
    // Publishable Keys funktionieren per apikey; klassische anon-JWTs zusätzlich mit Authorization.
    if(/^eyJ[A-Za-z0-9_-]+\./.test(c.key)) h.Authorization = 'Bearer ' + c.key;
    return h;
  }
  async function fetchJson(url, c, timeoutMs){
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timer = null;
    const opt = {method:'GET', headers:headers(c), cache:'no-store'};
    if(ctrl){ opt.signal = ctrl.signal; timer = setTimeout(()=>{try{ctrl.abort()}catch(e){}}, timeoutMs || 8000); }
    try{
      const res = await fetch(url, opt);
      const text = await res.text().catch(()=> '');
      if(!res.ok) throw new Error('HTTP ' + res.status + (text ? ' · ' + text.slice(0,220) : ''));
      try { return {status:res.status, items: JSON.parse(text || '[]')}; }
      catch(e){ return {status:res.status, items:[], parseError:String(e && e.message ? e.message : e)}; }
    } finally { if(timer) clearTimeout(timer); }
  }
  function startIso(period){
    const now = new Date();
    if(period === 'daily') return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    if(period === 'weekly') { const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const day = (d.getDay()+6)%7; d.setDate(d.getDate()-day); return d.toISOString(); }
    if(period === 'monthly') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return '';
  }
  function query(c, period, withClass){
    const parts = [
      'select=player_name,mode,title,percent,score,total,duration,rank,app_version,class_code,created_at',
      withClass ? 'class_code=eq.' + encodeURIComponent(c.classCode || 'default') : '',
      'order=percent.desc,score.desc,created_at.desc',
      'limit=' + encodeURIComponent(c.limit)
    ].filter(Boolean);
    const start = startIso(period);
    if(start) parts.push('created_at=gte.' + encodeURIComponent(start));
    return '?' + parts.join('&');
  }
  function normalize(rows){
    const seen = new Set();
    return (Array.isArray(rows) ? rows : []).map(r => ({
      player_name: r.player_name || r.name || r.player || 'Gast',
      title: r.title || r.mode || 'Training',
      mode: r.mode || '',
      percent: Math.max(0, Math.min(100, Number(r.percent ?? r.percentage ?? 0) || 0)),
      score: Number(r.score ?? 0) || 0,
      total: Number(r.total ?? 0) || 0,
      duration: r.duration || '',
      rank: r.rank || '',
      class_code: r.class_code || '',
      created_at: r.created_at || ''
    })).filter(r => {
      const k = [r.player_name,r.title,r.percent,r.score,r.total,r.created_at].join('|');
      if(seen.has(k)) return false; seen.add(k); return true;
    }).sort((a,b)=>(b.percent-a.percent)||(b.score-a.score)||String(b.created_at).localeCompare(String(a.created_at)));
  }
  async function fetchPeriod(c, period){
    // Erst normale Klasse, dann Fallback ohne class_code. Damit sieht man Ergebnisse auch bei alten/falsch gespeicherten class_codes.
    const first = await fetchJson(endpoint(c, query(c, period, true)), c, 8500);
    let rows = normalize(first.items);
    let source = 'class:' + c.classCode;
    if(!rows.length){
      const wide = await fetchJson(endpoint(c, query(c, period, false)), c, 8500);
      rows = normalize(wide.items);
      source = rows.length ? 'alle Klassen' : source;
    }
    return {period, rows, source, status:first.status};
  }
  async function fetchBoards(){
    const c = cfg();
    if(!configured(c)) return {ok:false, reason:'Cloud-Konfiguration unvollständig', c};
    const keys = ['daily','weekly','monthly','all'];
    const result = {daily:[], weekly:[], monthly:[], all:[], meta:{}};
    const settled = await Promise.all(keys.map(k => fetchPeriod(c,k).then(v=>({k,v})).catch(e=>({k,error:e}))));
    for(const entry of settled){
      if(entry.error){ result[entry.k] = {error:String(entry.error && entry.error.message ? entry.error.message : entry.error)}; }
      else { result[entry.k] = entry.v.rows; result.meta[entry.k] = entry.v.source; }
    }
    return {ok:true, c, boards:result};
  }
  function rowsHtml(rows, limit){
    if(rows && rows.error) return '<div class="small cloud-error-note">'+esc(rows.error)+'</div>';
    const list = Array.isArray(rows) ? rows.slice(0,limit || 5) : [];
    if(!list.length) return '<div class="small">Noch keine Cloud-Ergebnisse vorhanden.</div>';
    return '<div class="cloud-rank-list">' + list.map((r,i) =>
      '<div class="cloud-rank-row">' +
      '<span class="cloud-rank-pos">#'+(i+1)+'</span>' +
      '<span class="cloud-rank-main"><b>'+esc(r.player_name)+'</b><small>'+esc(r.title || r.mode || 'Training')+'</small></span>' +
      '<span class="cloud-rank-score">'+(Number(r.percent)||0)+'%<small>'+esc(r.rank || (r.percent>=90?'Elite':r.percent>=80?'Sehr stark':r.percent>=70?'Solide':'Training'))+'</small></span>' +
      '</div>').join('') + '</div>';
  }
  function countBoards(boards){ return ['daily','weekly','monthly','all'].reduce((s,k)=>s+(Array.isArray(boards[k])?boards[k].length:0),0); }
  function renderLoading(el){
    el.innerHTML = '<span class="coach-badge">Cloud Highscore · lädt</span><div class="coach-action">Ranking wird geladen</div><div class="small">V8.3.9 Cloud Display Engine · direkte Supabase-Abfrage ohne Testbutton.</div>';
  }
  function renderResult(el, data){
    if(!data.ok){
      el.innerHTML = '<span class="coach-badge">Cloud Highscore · prüfen</span><div class="coach-action">Cloud nicht vollständig verbunden</div><div class="small cloud-error-note">'+esc(data.reason || 'Konfiguration prüfen')+'</div>';
      return;
    }
    const b = data.boards;
    const total = countBoards(b);
    const meta = b.meta || {};
    el.innerHTML = '<span class="coach-badge">Cloud Highscore · Online</span>' +
      '<div class="coach-action">' + (total ? 'Ranking aktiv' : 'Keine Cloud-Einträge gefunden') + '</div>' +
      '<div class="small cloud-debug-line">Geladen: <b>'+total+'</b> Datensätze · Klasse: <code>'+esc(data.c.classCode)+'</code> · Quelle: '+esc(meta.all || 'class:'+data.c.classCode)+' · V'+VERSION+'</div>' +
      '<div class="cloud-board-grid">' +
      '<section class="cloud-board"><h4>Heute</h4>'+rowsHtml(b.daily,5)+'</section>' +
      '<section class="cloud-board"><h4>Woche</h4>'+rowsHtml(b.weekly,5)+'</section>' +
      '<section class="cloud-board"><h4>Monat</h4>'+rowsHtml(b.monthly,5)+'</section>' +
      '<section class="cloud-board"><h4>Gesamt</h4>'+rowsHtml(b.all,8)+'</section>' +
      '</div>';
  }
  function renderError(el, error){
    el.innerHTML = '<span class="coach-badge">Cloud Highscore · Fehler</span><div class="coach-action">Ranking konnte nicht geladen werden</div><div class="small cloud-error-note">'+esc(error && error.message ? error.message : error)+'</div>';
  }
  async function refresh(force){
    const el = card();
    if(!el) return;
    const now = Date.now();
    if(!force && STATE.busy) return;
    if(!force && now - STATE.lastRender < 700) return;
    STATE.busy = true; STATE.lastRender = now;
    try{ renderLoading(el); const data = await fetchBoards(); renderResult(el, data); }
    catch(e){ renderError(el, e); }
    finally{ STATE.busy = false; }
  }
  function hook(){
    if(STATE.observer) return;
    STATE.observer = new MutationObserver(() => {
      const el = card();
      if(el && !/Cloud Display Engine|Geladen:|Keine Cloud-Einträge|Ranking konnte nicht/.test(el.textContent || '')){
        refresh(false);
      }
    });
    STATE.observer.observe(document.documentElement, {childList:true, subtree:true});
    document.addEventListener('visibilitychange', () => { if(!document.hidden) setTimeout(()=>refresh(true),250); });
  }
  window.CloudDisplayEngine = {version:VERSION, refresh:()=>refresh(true), fetchBoards};
  document.addEventListener('DOMContentLoaded', () => { hook(); setTimeout(()=>refresh(true),600); setTimeout(()=>refresh(true),1800); });
  setTimeout(()=>{ hook(); refresh(false); }, 2500);
})();
