const fs=require('fs');
const css=fs.readFileSync('css/guided-welcome.css','utf8');
const js=fs.readFileSync('js/modules/guided-welcome-ui.js','utf8');
const checks={
  version:/G54\.50\.2F/.test(js),
  modalScroll:/data-modal-scroll/.test(js),
  visibleDialog:/nw-overlay is-visible/.test(js),
  touchPan:/\.nw-chat[\s\S]*touch-action:pan-y/.test(css),
  momentum:/-webkit-overflow-scrolling:touch/.test(css),
  verticalScroll:/\.nw-chat[\s\S]*overflow-y:scroll/.test(css),
  flexMinHeight:/\.nw-card[\s\S]*min-height:0/.test(css),
  mobileHeight:/height:min\(640px,calc\(100dvh - 116px\)\)/.test(css)
};
const failed=Object.entries(checks).filter(([,v])=>!v);
console.log(JSON.stringify(checks,null,2));
if(failed.length){console.error('FAILED',failed.map(([k])=>k));process.exit(1)}
console.log('G54.50.2F Nova scroll QA 8/8');
