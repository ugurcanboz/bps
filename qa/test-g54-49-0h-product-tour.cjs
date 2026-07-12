const fs=require('fs'),path=require('path'),assert=require('assert');const r=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(r,p),'utf8');let n=0;function ok(k,f){f();n++;console.log('PASS',k)}
ok('engine',()=>{let s=read('js/core/nova-product-tour-engine.js');assert(s.includes('G54.50.1'));assert(s.includes("novura.novaProductTour.v1"));assert(s.includes("dashboard"));assert(s.includes("language"));assert(s.includes("complete:function"))});
ok('ui',()=>{let s=read('js/modules/nova-product-tour-ui.js');assert(s.includes('egt:auth-profile-updated'));assert(s.includes('data-npt-start'));assert(s.includes('data-npt-later'));assert(s.includes('data-npt-skip'));assert(s.includes("Escape"))});
ok('integration',()=>{let s=read('index.html');assert(s.includes('nova-product-tour.css'));assert(s.includes('nova-product-tour-engine.js'));assert(s.includes('nova-product-tour-ui.js'))});
ok('transition-copy',()=>{let s=read('js/modules/guided-welcome-ui.js');assert(s.includes('Willkommen zurück. Melde dich an'));assert(s.includes('Dann erstellen wir jetzt dein Profil'));assert(s.includes('unverbindlich'))});
ok('a11y-css',()=>{let s=read('css/nova-product-tour.css');assert(s.includes('prefers-reduced-motion'));assert(s.includes(':focus-visible'));assert(s.includes('.npt-target'))});
console.log(`G54.49.0H regression: ${n}/5 bestanden`);
