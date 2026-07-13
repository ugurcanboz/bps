'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
let n=0;function ok(name,fn){fn();n++;console.log('✓',name);}
const app=read('js/core/app-config.js');
const ui=read('js/ui-home-renderer.js');
const nav=read('js/core/deep-sheet-navigation.js');
const css=read('css/deep-sheet-navigation.css');
const index=read('index.html');
const sw=read('service-worker.js');
const info=read('js/modules/info-legal-center.js');
ok('release version is G54.50.2I',()=>assert(app.includes("var VERSION = 'G54.50.2I'")));
ok('navigation engine loads before deep-sheet renderer',()=>assert(index.indexOf('<script src="./js/core/deep-sheet-navigation.js"></script>')<index.indexOf('<script src="./js/ui-home-renderer.js"></script>')));
ok('navigation stylesheet is loaded last among performance layers',()=>assert(index.includes('css/deep-sheet-navigation.css')&&index.indexOf('css/deep-sheet-navigation.css')>index.indexOf('css/performance-stability.css')));
ok('header is dynamic back current close',()=>{assert(ui.includes('ui-deep-navbar'));assert(ui.includes('ui-deep-back-label'));assert(ui.includes('uiSheetContextHeading'));assert(ui.includes('uiSheetClose'));});
ok('current heading opens an interactive path menu',()=>{assert(ui.includes('aria-haspopup=\"menu\"'));assert(ui.includes('uiSheetContextMenu'));assert(ui.includes('data-ui-sheet-depth'));});
ok('router maintains stack and direct ancestor jumps',()=>{assert(nav.includes('var stack = []'));assert(nav.includes('function back()'));assert(nav.includes('function goTo(index)'));assert(nav.includes('pathEntries'));});
ok('scroll and focus are restored',()=>{assert(nav.includes('entryToRestore.scrollTop'));assert(nav.includes('findFocus(entryToRestore.focusRef)'));assert(nav.includes('preventScroll'));});
ok('legal center contributes contextual route ids',()=>{assert(info.includes('navId:actionAtOpen'));assert(info.includes('onNavActivate:function(){activeAction=actionAtOpen;}'));});
ok('responsive titles truncate without hiding semantics',()=>{assert(css.includes('text-overflow:ellipsis'));assert(css.includes('.ui-deep-back-label'));assert(css.includes('@media(max-width:350px)'));});
ok('animation policy remains lightweight',()=>{assert(!/backdrop-filter|filter\s*:\s*blur|animation\s*:[^;]*infinite/.test(css));assert(css.includes('background-color .14s ease'));});
ok('keyboard back and menu escape are supported',()=>{assert(nav.includes("event.altKey && event.key === 'ArrowLeft'"));assert(nav.includes("event.key === 'Escape' && menuOpen"));});
ok('service worker caches new navigation assets',()=>{assert(sw.includes('./js/core/deep-sheet-navigation.js'));assert(sw.includes('./css/deep-sheet-navigation.css'));assert(sw.includes('egt-trainer-g54-50-2i'));});
ok('I documentation and rollback exist',()=>{assert(fs.existsSync(path.join(root,'docs/G54.50.2I-UNIVERSAL-DEEP-SHEET-NAVIGATION.md')));assert(fs.existsSync(path.join(root,'docs/ROLLBACK-G54.50.2I.md')));});

// Lightweight state-machine simulation without a browser.
ok('state machine returns contextual parent titles',()=>{
  const fakeDoc={activeElement:null,getElementById:()=>null,addEventListener:()=>{}};
  const sandbox={window:{},document:fakeDoc,setTimeout:(fn)=>fn(),console,CSS:{escape:s=>s}};
  sandbox.window=sandbox;
  vm.runInNewContext(nav,sandbox,{filename:'deep-sheet-navigation.js'});
  const api=sandbox.NovuraDeepSheetNavigation;
  const fakeSheet={classList:{contains:()=>false},querySelector:()=>null,contains:()=>false};
  const render=()=>true;
  let p=api.begin({type:'info',title:'Informationen'},{sheet:fakeSheet,renderer:render});
  assert.strictEqual(p.canBack,false);
  fakeSheet.classList.contains=()=>true;
  p=api.begin({type:'legal',title:'Rechtliches'},{sheet:fakeSheet,renderer:render});
  assert.strictEqual(p.backLabel,'Informationen');
  p=api.begin({type:'terms',title:'Nutzungsbedingungen'},{sheet:fakeSheet,renderer:render});
  assert.strictEqual(p.backLabel,'Rechtliches');
  assert.deepStrictEqual(Array.from(p.path,x=>x.title),['Informationen','Rechtliches','Nutzungsbedingungen']);
});
console.log(`G54.50.2I Universal Deep-Sheet Navigation: ${n}/14 bestanden`);
