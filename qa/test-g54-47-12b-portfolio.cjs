const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'..');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
function assert(v,m){if(!v)throw new Error(m)}
const tests=[]; function test(n,f){tests.push([n,f])}
test('Operator-Konfiguration vorhanden',()=>{const s=read('js/core/operator-config.js');['operatorName','supportEmail','streetAddress','legalForm'].forEach(x=>assert(s.includes(x),'Fehlt '+x))});
test('Operator-Konfiguration geladen',()=>assert(read('index.html').includes('js/core/operator-config.js'),'Script fehlt in index'));
test('Operator-Konfiguration im Cache',()=>assert(read('service-worker.js').includes('js/core/operator-config.js'),'Script fehlt im Service Worker'));
test('Portfolio enthält veredelte Hero-Struktur',()=>{const s=read('js/modules/info-legal-center.js');['info-profile-mark','info-stats','Meine Reise entdecken'].forEach(x=>assert(s.includes(x),'Fehlt '+x))});
test('Timeline enthält acht Stationen',()=>{const s=read('js/modules/info-legal-center.js');for(let i=1;i<=8;i++)assert(s.includes(String(i).padStart(2,'0')),'Timeline '+i+' fehlt')});
test('Kontakt bietet Feedback und konfigurierbare Mail',()=>{const s=read('js/modules/info-legal-center.js');assert(s.includes('feedback-open-core'),'Feedback fehlt');assert(s.includes("mailto:"),'Mailto fehlt')});
test('Kontaktdaten stammen aus zentraler Konfiguration',()=>{const s=read('js/core/operator-config.js');assert(s.includes("supportEmail:'Ugurcan.boz@googlemail.com'"),'Echte Support-Mail fehlt')});
test('Rechtlicher Betreiber-Check vorhanden',()=>{const s=read('js/modules/info-legal-center.js');['operatorReadiness','legal-operator','Betreiber-Check'].forEach(x=>assert(s.includes(x),'Fehlt '+x))});
test('Impressum nutzt zentrale Konfiguration',()=>{const s=read('js/modules/info-legal-center.js');['streetAddress','postalCode','responsibleForContent'].forEach(x=>assert(s.includes(x),'Fehlt '+x))});
test('Responsive und reduzierte Bewegung vorhanden',()=>{const s=read('css/info-legal-center.css');assert(s.includes('@container(max-width:620px)'),'Container Query fehlt');assert(s.includes('prefers-reduced-motion:reduce'),'Reduced Motion fehlt')});
let pass=0; for(const [n,f] of tests){try{f();console.log('PASS',n);pass++}catch(e){console.error('FAIL',n,e.message)}}
console.log(`${pass}/${tests.length} bestanden`); if(pass!==tests.length)process.exit(1);
