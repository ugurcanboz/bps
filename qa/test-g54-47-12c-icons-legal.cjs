const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const ROOT=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const checks=[];function test(name,fn){try{fn();checks.push({name,ok:true})}catch(e){checks.push({name,ok:false,error:e.message})}}
test('SVG Icon-System geladen',()=>{const x=read('js/core/app-icons.js');assert(x.includes('window.EGTAppIcons'));assert(x.includes('<svg'));});
test('Info-Center ohne Emoji-Icons',()=>{const x=read('js/modules/info-legal-center.js');['🧭','💡','🤖','🌍','✉️','⚖️','🏭','💭','❌','💻','🌙','🧠','🎓','🛡️','📧','🐞','🤝','📇','🔐','📜','🧾'].forEach(e=>assert(!x.includes(e),'Emoji verblieben: '+e));});
test('Kontextbezogene Icons vorhanden',()=>{const x=read('js/core/app-icons.js');['journey','idea','ai','vision','contact','legal','imprint','privacy','terms','operator','database','microphone'].forEach(n=>assert(x.includes(n+':'),'Icon fehlt: '+n));});
test('Betreiberdaten eingetragen',()=>{const x=read('js/core/operator-config.js');['Ugurcan Bozkurt','Straßburgweg 27','89077','Ulm','Ugurcan.boz@googlemail.com'].forEach(v=>assert(x.includes(v),'Angabe fehlt: '+v));});
test('Entwicklungsstatus klar',()=>{const x=read('js/core/operator-config.js');assert(x.includes('publicRelease:false'));assert(x.includes('Entwicklungs- und Testphase'));});
test('Transparenzcenter integriert',()=>{const x=read('js/modules/info-legal-center.js');assert(x.includes("legal-transparency"));assert(x.includes('So arbeitet die Plattform'));});
test('Icon CSS responsiv und darkmode-kompatibel',()=>{const x=read('css/info-legal-center.css');assert(x.includes('.app-icon'));assert(x.includes('.info-transparency'));assert(read('js/core/app-icons.js').includes('currentColor'));});
test('App-Icon-Script in Index und Cache',()=>{assert(read('index.html').includes('./js/core/app-icons.js'));assert(read('service-worker.js').includes('./js/core/app-icons.js'));});
test('Version konsistent',()=>{const app=read('js/core/app-config.js');const v=(app.match(/var VERSION = '([^']+)'/)||[])[1];assert(v,'App-Version fehlt');['manifest.json','update-check.json','service-worker.js'].forEach(f=>assert(read(f).includes(v),'Aktuelle Version fehlt: '+f));['js/core/operator-config.js','js/core/app-icons.js'].forEach(f=>assert(read(f).includes('G54.47.12E'),'Feature-Phasenmarker fehlt: '+f));assert(/G54\.47\.(?:1[3-9]|[2-9]\d)/.test(read('js/modules/info-legal-center.js')),'Info-Center-Version fehlt oder ist zu alt');});
test('Keine externen Icon-Abhängigkeiten',()=>{const i=read('index.html');assert(!/fontawesome|material-icons|unpkg\.com\/.*icon|cdnjs.*font-awesome/i.test(i));});
const result={phase:'G54.47.12E',passed:checks.filter(x=>x.ok).length,total:checks.length,checks};
fs.mkdirSync(path.join(ROOT,'release'),{recursive:true});fs.writeFileSync(path.join(ROOT,'release','G54.47.12E_ICONS_LEGAL_QA.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(result.passed!==result.total)process.exit(1);
