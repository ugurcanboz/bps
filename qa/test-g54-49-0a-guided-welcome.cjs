const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('js/core/guided-welcome-engine.js','utf8');
const sandbox={globalThis:{},Date,JSON,Object,String,Number};vm.createContext(sandbox);vm.runInContext(source,sandbox);
const API=sandbox.globalThis.NovuraGuidedWelcomeEngine,E=API.events,S=API.states;assert(API);
const e=API.create();assert.equal(e.snapshot().state,S.INIT);assert(e.dispatch(E.BOOT).ok);assert.equal(e.snapshot().state,S.FIRST_VISIT);
assert(e.dispatch(E.FIRST_VISIT_ANSWER,{firstVisit:true}).ok);assert(e.dispatch(E.INTRO_START).ok);
for(const expected of [S.NOVA,S.MISSION,S.PERMISSIONS]){assert(e.dispatch(E.NEXT).ok);assert.equal(e.snapshot().state,expected)}
assert(e.dispatch(E.PERMISSIONS_DONE).ok);assert.equal(e.snapshot().state,S.COMPANION_STYLE);
assert(e.dispatch(E.COMPANION_SELECTED,{companionStyle:'balanced'}).ok);assert.equal(e.snapshot().state,S.AUTH_CHOICE);
assert(e.dispatch(E.AUTH_SELECTED,{authAction:'demo'}).ok);assert(e.dispatch(E.AUTH_SUCCESS).ok);assert.equal(e.snapshot().state,S.APP_UNLOCKED);
const bad=API.create();bad.dispatch(E.BOOT);bad.dispatch(E.FIRST_VISIT_ANSWER,{firstVisit:true});bad.dispatch(E.INTRO_START);bad.dispatch(E.NEXT);bad.dispatch(E.NEXT);bad.dispatch(E.NEXT);bad.dispatch(E.PERMISSIONS_DONE);assert.equal(bad.dispatch(E.COMPANION_SELECTED,{companionStyle:'invalid'}).reason,'invalid-companion-style');
console.log(JSON.stringify({ok:true,phase:'G54.49.0A-regression',version:API.version,states:Object.keys(S).length},null,2));