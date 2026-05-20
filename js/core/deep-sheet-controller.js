(function(){
  'use strict';
  const VERSION = '8.1.2';
  const CATEGORIES = [
    {key:'simulation', label:'Simulationen', icon:'🎯', note:'Prüfungsnahe Läufe: BPS, CTC, Elite und Jogging.', vibe:'Prüfungsmodus · Zeitdruck · Abschlusswertung', modes:['ctcLohr','bps','ctc','jogging']},
    {key:'math', label:'Mathe', icon:'➗', note:'Grundrechnen, Kopfrechnen und Mathe-Sprints.', vibe:'Kopfrechnen · Prozent · Dreisatz', modes:['math','mathSprint']},
    {key:'logic', label:'Logik', icon:'🧩', note:'Zahlenreihen, Muster, Symbolfolgen und klassische Logik.', vibe:'Muster · Reihen · Schlussfolgern', modes:['logic','logicSprint']},
    {key:'matrix', label:'Matrizen', icon:'▦', note:'PDF-Matrizen und generierte Matrixmuster gezielt üben.', vibe:'Symbole · Rotation · Struktur erkennen', modes:['matrixOnlySprint']},
    {key:'visual', label:'Visual IQ', icon:'👁️', note:'Zahnräder, Spiegelung, Würfel, Faltung und Route Memory.', vibe:'Räumliches Denken · Technik · Route', modes:['visualIQ','visualIQSprint','routeMemoryMode']},
    {key:'language', label:'Sprache', icon:'✍️', note:'Englisch und Satzergänzung.', vibe:'Vokabeln · Grammatik · Lückensätze', modes:['english','sentenceSprint']},
    {key:'knowledge', label:'Wissen', icon:'📚', note:'Allgemeinwissen · Fakten · schnelle Auswahl', vibe:'Allgemeinwissen · Fakten · schnelle Auswahl', modes:['general','knowledgeSprint']},
    {key:'focus', label:'Konzentration', icon:'⚡', note:'Aufmerksamkeit, Tempo und Fehlertraining.', vibe:'Tempo · Fokus · Fehler reduzieren', modes:['concentrationPro','concentrationSprint','errorTrainingPrep']},
    {key:'it', label:'IT/FISI', icon:'🖥️', note:'Netzwerk, Hardware, Security und FISI-Grundlagen.', vibe:'Netzwerk · Hardware · FISI-Basis', modes:['it','itSprint']},
    {key:'technique', label:'Technik', icon:'⚙️', note:'Mechanik, Stromlaufpläne, Hebel, Rollen und Zahnräder.', vibe:'Mechanik · Strom · Zahnräder', modes:['techniqueSprint']}
  ];  let activeCategory = 0;
  let original = {};
  const $ = (id)=>document.getElementById(id);
  function appReady(){ return !!(window.App && App._test && App._test.MODES && App._test.state); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function cleanTitle(m,k){ return String((m && m.title) || k).replace(/^\d+\.\s*/,''); }
  function allModes(){
    if(!appReady()) return [];
    const MODES=App._test.MODES; const out=[]; const seen=new Set();
    CATEGORIES.forEach(c=>(c.modes||[]).forEach(k=>{ if(MODES[k] && !seen.has(k)){ seen.add(k); out.push(k); }}));
    Object.keys(MODES).forEach(k=>{ if(!seen.has(k)){ seen.add(k); out.push(k); }});
    return out;
  }
  function categoryForMode(mode){
    const idx=CATEGORIES.findIndex(c=>(c.modes||[]).includes(mode));
    return idx>=0 ? idx : 0;
  }
  function setSelectedMode(mode){
    if(!appReady() || !App._test.MODES[mode]) return false;
    App._test.state.selectedMode = mode;
    App._test.state.activeAppSection = 'practice';
    App._test.state.activeSheetCategory = categoryForMode(mode);
    activeCategory = categoryForMode(mode);
    return true;
  }
  function selectedMode(){ return appReady() ? (App._test.state.selectedMode || 'ctcLohr') : 'ctcLohr'; }
  function ensureShell(){
    let backdrop=$('trainingSheetBackdropClean');
    let sheet=$('trainingSheetClean');
    if(!backdrop){
      backdrop=document.createElement('div'); backdrop.id='trainingSheetBackdropClean'; backdrop.className='clean-sheet-backdrop'; backdrop.addEventListener('click', closeSheet); document.body.appendChild(backdrop);
    }
    if(!sheet){
      sheet=document.createElement('aside'); sheet.id='trainingSheetClean'; sheet.className='clean-training-sheet'; sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true'); sheet.innerHTML = '<div class="clean-sheet-grabber"></div><div class="clean-sheet-header"><div><b>Trainingsmenü</b><span>Kategorien · Simulationen · Blocktraining</span></div><button type="button" class="clean-sheet-close" aria-label="Schließen">×</button></div><div class="clean-sheet-body" id="trainingSheetCleanBody"></div>';
      sheet.querySelector('.clean-sheet-close').addEventListener('click', closeSheet);
      document.body.appendChild(sheet);
    }
    return {backdrop,sheet,body:$('trainingSheetCleanBody')};
  }
  function modeCard(k){
    const MODES=App._test.MODES; const m=MODES[k]; if(!m) return '';
    const selected=k===selectedMode(); const tags=(Array.isArray(m.tags)?m.tags:[]).slice(0,2).map(t=>`<em>${esc(t)}</em>`).join('');
    const title=esc(cleanTitle(m,k)); const amount=m.amount?`${m.amount} Aufgaben`:'Training';
    return `<button type="button" class="clean-mode-row ${selected?'is-selected':''}" data-mode="${esc(k)}"><span class="clean-row-dot">${selected?'✓':'+'}</span><span class="clean-row-copy"><b>${title}</b><small>${esc(amount)} · ${esc((m.desc||'').slice(0,110))}</small></span><span class="clean-row-tags">${tags}</span></button>`;
  }
  function renderSheet(){
    if(!appReady()) return;
    const {body}=ensureShell(); if(!body) return;
    activeCategory = Math.max(0, Math.min(activeCategory, CATEGORIES.length-1));
    const cat=CATEGORIES[activeCategory]; const MODES=App._test.MODES;
    const modes=(cat.modes||[]).filter(k=>MODES[k]);
    const sel=MODES[selectedMode()];
    body.innerHTML = `<div class="clean-sheet-router"><aside class="clean-category-list">${CATEGORIES.map((c,i)=>`<button type="button" class="clean-category-row ${i===activeCategory?'active':''}" data-cat="${i}" title="${esc(c.note)}"><span>${c.icon}</span><b>${esc(c.label)}</b><em>${(c.modes||[]).filter(k=>MODES[k]).length}</em></button>`).join('')}</aside>
      <section class="clean-mode-panel"><div class="clean-panel-head premium-panel-head"><div class="premium-panel-copy"><span class="premium-panel-icon">${cat.icon}</span><b>${esc(cat.label)}</b><small>${esc(cat.note)}</small><p>${esc(cat.vibe||cat.note)}</p></div><strong>${modes.length} Modi</strong></div><div class="clean-mode-list premium-mode-list">${modes.map(modeCard).join('') || '<div class="clean-empty">Keine Modi in dieser Kategorie.</div>'}</div></section>
      <footer class="clean-selected-bar premium-startbar"><div><span>Bereit</span><b>${esc(sel?cleanTitle(sel,selectedMode()):'Training')}</b><small>Start lädt nur diesen Modus. Kein Katalog, keine Aufgaben vorher.</small></div><button type="button" id="cleanSheetStartBtn">Starten</button></footer></div>`;
    body.querySelectorAll('[data-cat]').forEach(btn=>btn.addEventListener('click',()=>{ activeCategory=Number(btn.dataset.cat)||0; renderSheet(); }));
    body.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{ setSelectedMode(btn.dataset.mode); renderLauncher(); renderSheet(); }));
    const start=$('cleanSheetStartBtn'); if(start) start.addEventListener('click',()=>{ closeSheet(); setTimeout(()=>{ try{ App.prepareTest(); }catch(e){ console.error(e); } },40); });
  }
  function renderLauncher(){
    if(!appReady()) return;
    document.body.dataset.appSection = App._test.state.activeAppSection || document.body.dataset.appSection || 'home';
    const grid=$('modeGrid'); if(!grid) return;
    if((App._test.state.activeAppSection || 'home') !== 'practice') return;
    const MODES=App._test.MODES; const sel=MODES[selectedMode()];
    grid.innerHTML = `<div class="clean-training-launch"><button type="button" id="cleanOpenTrainingSheet"><span>▣</span><b>Trainingsmenü öffnen</b><small>${CATEGORIES.length} Kategorien · ${allModes().length} Module · Aufgaben erst nach Start</small></button></div>`;
    const btn=$('cleanOpenTrainingSheet'); if(btn) btn.addEventListener('click', openSheet);
    hideLegacyPractice();
  }
  function hideLegacyPractice(){
    ['modeTabs','modeSectionTitle','sectionActions','focusControls'].forEach(id=>{ const el=$(id); if(el){ el.innerHTML=''; el.style.display='none'; }});
    document.querySelectorAll('.warn.small,.exam-options,.db-actions').forEach(el=>{ el.style.display='none'; });
    document.querySelectorAll('#trainingSheet,#trainingSheetBackdrop').forEach(el=>{ el.remove(); });
  }
  function openSheet(tabOrMode){
    if(!appReady()) return;
    if(typeof tabOrMode==='string'){
      if(CATEGORIES.some(c=>c.key===tabOrMode)) activeCategory=CATEGORIES.findIndex(c=>c.key===tabOrMode);
      else if(App._test.MODES[tabOrMode]) activeCategory=categoryForMode(tabOrMode);
      else if(tabOrMode==='simulation') activeCategory=0;
      else if(tabOrMode==='block') activeCategory=CATEGORIES.findIndex(c=>c.key==='matrix');
    } else activeCategory = categoryForMode(selectedMode());
    const {backdrop,sheet}=ensureShell(); renderSheet();
    document.body.classList.add('clean-sheet-open');
    backdrop.classList.add('show'); sheet.classList.add('show');
  }
  function closeSheet(){
    const backdrop=$('trainingSheetBackdropClean'), sheet=$('trainingSheetClean');
    document.body.classList.remove('clean-sheet-open');
    if(backdrop) backdrop.classList.remove('show');
    if(sheet) sheet.classList.remove('show');
  }
  function patchApp(){
    if(!appReady() || window.__CLEAN_DEEP_SHEET_PATCHED__) return false;
    window.__CLEAN_DEEP_SHEET_PATCHED__=true;
    original = {setAppSection:App.setAppSection, setTopTab:App.setTopTab, openTrainingSheet:App.openTrainingSheet, closeTrainingSheet:App.closeTrainingSheet, chooseTrainingMode:App.chooseTrainingMode, setTrainingSheetCategory:App.setTrainingSheetCategory, selectMode:App.selectMode};
    App.openTrainingSheet = openSheet;
    App.closeTrainingSheet = closeSheet;
    App.setTrainingSheetCategory = function(i){ activeCategory=Number(i)||0; renderSheet(); };
    App.chooseTrainingMode = function(k){ setSelectedMode(k); renderLauncher(); renderSheet(); };
    App.selectMode = function(k){ setSelectedMode(k); closeSheet(); if(original.selectMode) original.selectMode.call(App,k); setTimeout(()=>{ try{ renderLauncher(); }catch(e){} },0); };
    App.setAppSection = function(section){
      const result = original.setAppSection ? original.setAppSection.call(App, section) : undefined;
      if(appReady() && App._test.state.activeAppSection==='practice') setTimeout(()=>{ renderLauncher(); openSheet(); },30);
      return result;
    };
    App.setTopTab = function(section, tabKey){
      const result = original.setTopTab ? original.setTopTab.call(App, section, tabKey) : undefined;
      if(appReady() && App._test.state.activeAppSection==='practice') setTimeout(()=>{ renderLauncher(); openSheet(tabKey); },35);
      return result;
    };
    window.BPSTrainerDeepSheet = {version:VERSION, renderLauncher, openSheet, closeSheet, renderSheet, categories:CATEGORIES, audit};
    setTimeout(()=>{ if(App._test.state.activeAppSection==='practice') { renderLauncher(); } hideLegacyPractice(); },50);
    return true;
  }
  function audit(){
    const MODES=appReady()?App._test.MODES:{}; const modeCount=allModes().length;
    const missing=[]; CATEGORIES.forEach(c=>(c.modes||[]).forEach(k=>{ if(!MODES[k]) missing.push(k); }));
    return {version:VERSION, patched:!!window.__CLEAN_DEEP_SHEET_PATCHED__, modeCount, missing, selected:selectedMode(), categories:CATEGORIES.length, legacyAccordionRemoved:!document.querySelector('#modeGrid .modeCard')};
  }
  function boot(){
    let tries=0; const timer=setInterval(()=>{ tries++; if(patchApp() || tries>60){ clearInterval(timer); if(appReady() && App._test.state.activeAppSection==='practice') renderLauncher(); } },100);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
