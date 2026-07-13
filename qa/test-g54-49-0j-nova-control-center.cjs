const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');let n=0;
function ok(name,fn){fn();n++;console.log('PASS',name)}
ok('module-and-version',()=>{const s=read('js/modules/nova-control-center.js');assert(s.includes('G54.50.1'));assert(s.includes('NovuraControlCenter'));});
ok('settings-entry',()=>{const s=read('js/ui-home-renderer.js');assert(s.includes("actionCardHtml('nova-control-center'"));});
ok('introduction-replay',()=>{const s=read('js/modules/nova-control-center.js');assert(s.includes('resetIntroduction'));assert(s.includes('NovuraGuidedWelcomeUI.show'));});
ok('tour-replay',()=>{const s=read('js/modules/nova-control-center.js');assert(s.includes('NovuraProductTourUI.reset'));assert(s.includes('showOffer({force:true})'));});
ok('companion-control',()=>{const s=read('js/modules/nova-control-center.js');for(const t of ['quiet','balanced','active','companionStyle'])assert(s.includes(t),t)});
ok('permission-transparency',()=>{const s=read('js/modules/nova-control-center.js');for(const t of ['navigator.permissions','Notification.permission','Browser-Einstellungen'])assert(s.includes(t),t)});
ok('weather-delete',()=>{const s=read('js/modules/nova-control-center.js');assert(s.includes('NovuraWeatherContext.clear'));});
ok('privacy',()=>{const s=read('js/modules/nova-control-center.js');assert(s.includes('niemals dein Standortverlauf'));assert(!s.includes('latitude'));assert(!s.includes('longitude'));});
ok('accessibility',()=>{const s=read('js/modules/nova-control-center.js');for(const t of ['aria-modal','aria-labelledby','aria-pressed','aria-live'])assert(s.includes(t),t)});
ok('assets-loaded',()=>{const i=read('index.html');assert(i.includes('nova-control-center.css'));assert(i.includes('nova-control-center.js'));});
console.log(`G54.50.1 Nova Control Center: ${n}/10 bestanden`);
