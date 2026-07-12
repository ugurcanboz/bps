const fs=require('fs'),assert=require('assert');const read=p=>fs.readFileSync(p,'utf8');
const ui=read('js/modules/guided-welcome-ui.js'),css=read('css/guided-welcome.css'),gate=read('js/modules/egt-gate-screen.js'),index=read('index.html'),sw=read('service-worker.js');let n=0;function ok(name,fn){fn();n++;console.log('PASS',name)}
ok('engine-bound',()=>assert(ui.includes('NovuraGuidedWelcomeEngine')));
ok('auth-actions',()=>['login','register','demo'].forEach(v=>assert(ui.includes("authButton('"+v+"'")||ui.includes('data-nw-auth'))));
ok('introduction-and-permissions',()=>['FIRST_VISIT_ANSWER','INTRO_START','data-nw-permission','COMPANION_SELECTED'].forEach(t=>assert(ui.includes(t),t)));
ok('privacy-cleanup',()=>{const eng=read('js/core/guided-welcome-engine.js');assert(eng.includes('clearSensitiveContext'))});
ok('legacy-auth-delegation',()=>{assert(gate.includes('NovuraGuidedWelcomeUI.show'));assert(gate.includes('openSheet(action)'))});
ok('assets-once',()=>{assert.equal((index.match(/guided-welcome\.css/g)||[]).length,1);assert.equal((index.match(/guided-welcome-ui\.js/g)||[]).length,1)});
ok('responsive-a11y',()=>{assert(css.includes('@media(max-width:860px)'));assert(css.includes('prefers-reduced-motion'));assert(css.includes(':focus-visible'))});
ok('service-worker-assets',()=>{assert(sw.includes('guided-welcome.css'));assert(sw.includes('guided-welcome-ui.js'))});
console.log(`G54.49.0B regression: ${n}/8 bestanden`);