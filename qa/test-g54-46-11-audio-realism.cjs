'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

function buildContext(opts={}){
  const spoken=[];
  const voices=[
    {name:'Anna Premium',lang:'de-DE',voiceURI:'de-anna',localService:true},
    {name:'Markus Enhanced',lang:'de-DE',voiceURI:'de-markus',localService:true},
    {name:'Helena Premium',lang:'de-AT',voiceURI:'de-helena-at',localService:true},
    {name:'Samantha Premium',lang:'en-US',voiceURI:'en-samantha',localService:true},
    {name:'Alex Enhanced',lang:'en-US',voiceURI:'en-alex',localService:true},
    {name:'Serena Premium',lang:'en-GB',voiceURI:'en-serena-gb',localService:true}
  ];
  function Utter(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;this.volume=1;this.voice=null;this.onstart=null;this.onend=null;this.onerror=null;}
  const speechSynthesis={
    speaking:false,paused:false,
    getVoices(){return opts.emptyVoices?[]:voices;},
    addEventListener(){},removeEventListener(){},cancel(){this.speaking=false;},resume(){},
    speak(u){this.speaking=true;spoken.push({text:u.text,lang:u.lang,rate:u.rate,pitch:u.pitch,voice:u.voice&&u.voice.voiceURI});if(u.onstart)u.onstart();setTimeout(()=>{this.speaking=false;if(u.onend)u.onend();},0);}
  };
  const navigator={userAgent:opts.ios?'Mozilla/5.0 (iPhone)':'Mozilla/5.0',platform:opts.ios?'iPhone':'Linux',maxTouchPoints:opts.ios?5:0,standalone:false};
  const context={window:{speechSynthesis,SpeechSynthesisUtterance:Utter,matchMedia(){return{matches:false};}},navigator,console,setTimeout,clearTimeout,setInterval,clearInterval,Date,Math,JSON,Promise,SpeechSynthesisUtterance:Utter};
  context.window.navigator=navigator;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/core/language-audio-realism-engine.js','utf8'),context,{filename:'language-audio-realism-engine.js'});
  return {engine:context.window.LanguageAudioRealismEngine,spoken,context};
}
const checks=[];
fs.mkdirSync('release', { recursive: true });
function check(name,fn){try{const r=fn();if(r&&typeof r.then==='function')return r.then(()=>checks.push({name,ok:true})).catch(e=>checks.push({name,ok:false,error:e.message}));checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}}
(async()=>{
  const {engine,spoken}=buildContext();
  check('engine-version',()=>assert.equal(engine.__version,'G54.46.11'));
  check('profiles-monotonic-rate',()=>{const rates=engine.levels.map(x=>engine.getProfile(x).rate);for(let i=1;i<rates.length;i++)assert(rates[i]>rates[i-1],rates.join(','));});
  check('pauses-decrease-by-level',()=>{const pauses=engine.levels.map(x=>engine.getProfile(x).pauseMs);for(let i=1;i<pauses.length;i++)assert(pauses[i]<pauses[i-1],pauses.join(','));});
  check('replay-policy',()=>{assert.equal(engine.replayPolicy('A1','simulation').maxPlays,2);assert.equal(engine.replayPolicy('B2','simulation').maxPlays,2);assert.equal(engine.replayPolicy('C1','simulation').maxPlays,1);assert.equal(engine.replayPolicy('C2','simulation').maxPlays,1);});
  check('explicit-dialogue-segmentation',()=>{const rows=engine.buildSegments('Moderatorin: Willkommen. Expertin: Vielen Dank. Moderatorin: Was ist wichtig?',{level:'B2',language:'de'});assert.equal(rows.length,3);assert.equal(rows[0].speaker,'speakerA');assert.equal(rows[1].speaker,'speakerB');});
  check('advanced-inferred-speaker-change',()=>{const rows=engine.buildSegments('The proposal looks convincing. However, the evidence is incomplete. A pilot would reduce the risk.',{level:'C1',language:'en',dialogueHint:true});assert(rows.length>=3);assert.notEqual(rows[0].speaker,rows[1].speaker);});
  check('a1-clear-narrator',()=>{const rows=engine.buildSegments('Der Kurs beginnt um acht Uhr. Bitte bringen Sie einen Ausweis mit.',{level:'A1',language:'de'});assert(rows.every(x=>x.speaker==='narrator'));});
  check('plan-selects-distinct-voices',()=>{const plan=engine.createPlan({text:'Speaker one explains the issue. Speaker two adds a limitation.',language:'en',level:'B2',dialogueHint:true});assert.equal(plan.language,'en');assert(plan.voiceCount>=2);assert.equal(plan.distinctVoices,true);assert.equal(plan.accentVariation,true);assert(plan.segments.some(x=>x.voiceURI==='en-samantha'||x.voiceURI==='en-alex'));assert(plan.segments.some(x=>x.voiceURI==='en-serena-gb'));});
  check('plan-duration-and-segments',()=>{const plan=engine.createPlan({text:'Moderatorin: Guten Tag. Experte: Danke für die Einladung. Moderatorin: Was empfehlen Sie?',language:'de',level:'B2',dialogueHint:true});assert.equal(plan.segmentCount,3);assert(plan.estimatedDurationMs>1000);assert(plan.segments.every(x=>x.pauseAfterMs>=0));});
  await check('play-runs-all-segments',async()=>{const run=engine.play({text:'Moderatorin: Satz eins. Experte: Satz zwei.',language:'de',level:'B2'});assert.equal(run.started,true);const result=await run.promise;assert.equal(result.ok,true);assert.equal(spoken.length,2);assert(spoken[0].voice&&spoken[1].voice);assert.notEqual(spoken[0].voice,spoken[1].voice);});
  check('diagnostics',()=>{const d=engine.diagnose();assert.equal(d.ok,true);assert.equal(d.profiles.length,6);assert(d.voiceCounts.de>=2);assert(d.voiceCounts.en>=2);});
  const ios=buildContext({ios:true}).engine.deviceInfo();
  check('ios-detection',()=>assert.equal(ios.ios,true));
  const result={phase:'G54.46.11',ok:checks.every(x=>x.ok),passed:checks.filter(x=>x.ok).length,total:checks.length,checks};
  fs.writeFileSync('release/G54.46.11_AUDIO_REALISM_TEST_RESULT.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  process.exit(result.ok?0:1);
})();
