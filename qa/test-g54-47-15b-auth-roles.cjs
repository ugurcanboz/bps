const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'js/modules/egt-access-control.js'),'utf8');
function load(snap){const window={EGTSecurityContext:{snapshot:()=>snap,initialize:async()=>{},refreshClaims:async()=>snap.claims||{},qaBypassAllowed:()=>false},dispatchEvent:()=>{}};window.window=window;vm.runInNewContext(code,{window,CustomEvent:function(){}});return window.EGTAccessControl;}
let ac=load({trustedRole:'participant',claimsTrusted:true,user:{uid:'u1',isAnonymous:false},claims:{}});
const checks=[]; const ok=(n,v)=>checks.push([n,!!v]);
ok('participant training',ac.can('training')); ok('participant no admin',!ac.can('adminArea')); ok('participant profile',ac.can('profile'));
ac=load({trustedRole:'teacher',claimsTrusted:true,user:{uid:'t1',isAnonymous:false},claims:{}}); ok('teacher area',ac.can('teacherArea')); ok('teacher no role management',!ac.can('roleManagement'));
ac=load({trustedRole:'admin',claimsTrusted:true,user:{uid:'a1',isAnonymous:false},claims:{}}); ok('admin area',ac.can('adminArea')); ok('admin role management',ac.can('roleManagement'));
ac=load({trustedRole:'admin',claimsTrusted:false,user:{uid:'a1',isAnonymous:false},claims:{}}); ok('untrusted local admin rejected',!ac.can('adminArea'));
ac=load({trustedRole:'admin',claimsTrusted:true,user:{uid:'a1',isAnonymous:true},claims:{}}); ok('anonymous admin rejected',!ac.can('adminArea'));
const adminEntry=fs.readFileSync(path.join(root,'js/modules/egt-admin-entry-module.js'),'utf8');ok('admin entry calls central guard',adminEntry.includes("EGTAccessControl.require('adminArea'"));
const auth=fs.readFileSync(path.join(root,'js/modules/egt-auth-engine.js'),'utf8');ok('privileged session requires trusted claims',auth.includes('untrusted-privileged-session')&&auth.includes('authoritativeSessionRole'));
const passed=checks.filter(x=>x[1]).length;console.log(JSON.stringify({phase:'G54.47.15B',passed,total:checks.length,checks},null,2));if(passed!==checks.length)process.exit(1);
