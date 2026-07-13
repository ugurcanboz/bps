/* Eignungstest-Trainer · Hörtraining und Audiorealismus · G54.46.11 */
(function(){
  'use strict';
  var VERSION='G54.46.11';
  var SCHEMA='egt-language-audio-realism-v1';
  var LEVELS=['A1','A2','B1','B2','C1','C2'];
  var activeRun=null;
  var voiceCache=[];
  var voiceReadyPromise=null;
  var PROFILES={
    A1:{rate:0.82,pauseMs:520,pitchA:1.02,pitchB:0.96,maxPlays:2,maxSegments:7,dialogueMode:'guided',accentMode:'standard',complexity:'slow-clear'},
    A2:{rate:0.87,pauseMs:440,pitchA:1.01,pitchB:0.97,maxPlays:2,maxSegments:8,dialogueMode:'guided',accentMode:'standard',complexity:'clear'},
    B1:{rate:0.93,pauseMs:350,pitchA:1.00,pitchB:0.98,maxPlays:2,maxSegments:10,dialogueMode:'mixed',accentMode:'standard',complexity:'natural'},
    B2:{rate:0.99,pauseMs:290,pitchA:1.00,pitchB:0.97,maxPlays:2,maxSegments:12,dialogueMode:'mixed',accentMode:'controlled-if-available',complexity:'natural-fast'},
    C1:{rate:1.04,pauseMs:235,pitchA:0.99,pitchB:1.02,maxPlays:1,maxSegments:14,dialogueMode:'dynamic',accentMode:'controlled-if-available',complexity:'advanced'},
    C2:{rate:1.08,pauseMs:190,pitchA:0.98,pitchB:1.03,maxPlays:1,maxSegments:16,dialogueMode:'dynamic',accentMode:'controlled-if-available',complexity:'near-natural'}
  };
  function normalizeLevel(level){level=String(level||'B1').toUpperCase();return LEVELS.indexOf(level)>=0?level:'B1';}
  function normalizeLanguage(language){language=String(language||'de').toLowerCase();return language.indexOf('en')===0||language==='english'||language==='englisch'?'en':'de';}
  function locale(language){return normalizeLanguage(language)==='en'?'en-US':'de-DE';}
  function profile(level){return Object.assign({},PROFILES[normalizeLevel(level)]);}
  function deviceInfo(){
    var ua='';try{ua=String(navigator.userAgent||'');}catch(e){}
    var platform='';try{platform=String(navigator.platform||'');}catch(e){}
    var touch=0;try{touch=Number(navigator.maxTouchPoints||0);}catch(e){}
    var ios=/iPad|iPhone|iPod/i.test(ua)||(platform==='MacIntel'&&touch>1);
    var android=/Android/i.test(ua);
    var standalone=false;try{standalone=!!(navigator.standalone||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches));}catch(e){}
    return {ios:ios,android:android,mobile:ios||android||touch>1,standalone:standalone,userAgent:ua};
  }
  function supported(){return typeof window!=='undefined'&&!!window.speechSynthesis&&typeof window.SpeechSynthesisUtterance!=='undefined';}
  function voiceScore(v,language,index){
    var lang=normalizeLanguage(language), l=String(v&&v.lang||'').toLowerCase(), n=String(v&&v.name||'').toLowerCase();
    var score=0;
    if(lang==='de'&&/^de(-|_)/.test(l))score+=70;
    if(lang==='en'&&/^en(-|_)/.test(l))score+=70;
    if(v&&v.localService)score+=18;
    if(/premium|enhanced|natural|neural|siri|microsoft|google|apple/.test(n))score+=16;
    if(/female|anna|katja|vicki|samantha|victoria|zira|hazel|serena|karen/.test(n))score+=4;
    if(/male|markus|daniel|thomas|alex|david|george|fred/.test(n))score+=3;
    score-=index*0.01;
    return score;
  }
  function getVoices(language){
    var list=[];try{list=window.speechSynthesis.getVoices()||[];}catch(e){}
    if(list.length)voiceCache=list.slice();else list=voiceCache.slice();
    return list.map(function(v,i){return {voice:v,score:voiceScore(v,language,i)};}).sort(function(a,b){return b.score-a.score;}).map(function(x){return x.voice;});
  }
  function loadVoices(waitMs){
    if(!supported())return Promise.resolve([]);
    var first=getVoices('de');if(first.length)return Promise.resolve(first);
    if(voiceReadyPromise)return voiceReadyPromise;
    voiceReadyPromise=new Promise(function(resolve){
      var done=false,timer=null;
      function finish(){if(done)return;done=true;if(timer)clearTimeout(timer);try{window.speechSynthesis.removeEventListener('voiceschanged',finish);}catch(e){}resolve(getVoices('de'));voiceReadyPromise=null;}
      try{window.speechSynthesis.addEventListener('voiceschanged',finish);}catch(e){}
      timer=setTimeout(finish,Math.max(120,Number(waitMs||650)));
    });
    return voiceReadyPromise;
  }
  function cleanText(text){
    return String(text||'').replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
  }
  function splitExplicitSpeakers(text){
    var src=String(text||'').trim();if(!src)return [];
    var re=/(^|\s)([A-ZÄÖÜ][A-Za-zÄÖÜäöüß\- ]{1,24}):\s*/g, matches=[],m;
    while((m=re.exec(src))){matches.push({start:m.index+(m[1]?m[1].length:0),label:m[2],contentStart:re.lastIndex});}
    if(!matches.length)return [];
    return matches.map(function(x,i){var end=i+1<matches.length?matches[i+1].start:src.length;return {speaker:x.label,text:cleanText(src.slice(x.contentStart,end))};}).filter(function(x){return x.text;});
  }
  function splitSentences(text){
    var src=cleanText(text);if(!src)return [];
    var rows=src.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[src];
    return rows.map(cleanText).filter(function(x){return x.length>1;});
  }
  function stripSyntheticIntro(text){return cleanText(String(text||'').replace(/^Hörtext\s+\d+\.\s*/i,'').replace(/^Listening text\s+\d+\.\s*/i,''));}
  function buildSegments(text,opts){
    opts=opts||{};var level=normalizeLevel(opts.level),p=profile(level),lang=normalizeLanguage(opts.language),explicit=splitExplicitSpeakers(text),rows=[];
    if(explicit.length){
      rows=explicit.map(function(x,i){return {text:stripSyntheticIntro(x.text),speaker:i%2?'speakerB':'speakerA',label:x.speaker||('Sprecher '+(i+1))};});
    }else{
      var sentences=splitSentences(stripSyntheticIntro(text));
      if((level==='A1'||level==='A2')||sentences.length<2||!opts.dialogueHint){rows=sentences.map(function(s){return {text:s,speaker:'narrator',label:lang==='en'?'Narrator':'Ansage'};});}
      else{
        rows=sentences.map(function(s,i){
          var switchEvery=level==='B1'?2:1;
          var role=(Math.floor(i/switchEvery)%2===0)?'speakerA':'speakerB';
          return {text:s,speaker:role,label:role==='speakerA'?(lang==='en'?'Speaker 1':'Sprecher 1'):(lang==='en'?'Speaker 2':'Sprecher 2')};
        });
      }
    }
    if(rows.length>p.maxSegments){
      var kept=rows.slice(0,p.maxSegments-1),tail=rows.slice(p.maxSegments-1).map(function(x){return x.text;}).join(' ');
      kept.push({text:tail,speaker:rows[p.maxSegments-1].speaker,label:rows[p.maxSegments-1].label});rows=kept;
    }
    return rows.filter(function(x){return x.text&&x.text.length>1;});
  }
  function chooseVoices(language,level){
    language=normalizeLanguage(language);level=normalizeLevel(level);
    var voices=getVoices(language), primary=voices[0]||null, secondary=null, accentVariation=false;
    if(primary){
      var primaryLang=String(primary.lang||'').toLowerCase(), preferred=[];
      if(['B2','C1','C2'].indexOf(level)>=0){
        if(language==='en') preferred=primaryLang.indexOf('en-gb')===0?['en-us','en-au','en-ca']:['en-gb','en-au','en-ca'];
        else preferred=primaryLang.indexOf('de-de')===0?['de-at','de-ch']:['de-de'];
        for(var p=0;p<preferred.length&&!secondary;p++) secondary=voices.filter(function(v){return v.voiceURI!==primary.voiceURI&&String(v.lang||'').toLowerCase().indexOf(preferred[p])===0;})[0]||null;
        accentVariation=!!secondary;
      }
      if(!secondary)secondary=voices.filter(function(v){return v.voiceURI!==primary.voiceURI&&String(v.lang||'').slice(0,2).toLowerCase()===locale(language).slice(0,2).toLowerCase();})[0]||voices[1]||primary;
    }
    return {primary:primary,secondary:secondary||primary,available:voices.length,distinct:!!(primary&&secondary&&primary.voiceURI!==secondary.voiceURI),accentVariation:accentVariation};
  }
  function estimateDurationMs(segments,level){
    var p=profile(level),wordCount=segments.reduce(function(n,s){return n+String(s.text||'').split(/\s+/).filter(Boolean).length;},0);
    var wordsPerMinute=165*p.rate;
    return Math.round((wordCount/Math.max(70,wordsPerMinute))*60000+Math.max(0,segments.length-1)*p.pauseMs);
  }
  function createPlan(options){
    options=options||{};var level=normalizeLevel(options.level),language=normalizeLanguage(options.language),p=profile(level),segments=buildSegments(options.text,{level:level,language:language,dialogueHint:!!options.dialogueHint});
    var voices=chooseVoices(language,level), dev=deviceInfo();
    var planned=segments.map(function(s,i){
      var useB=s.speaker==='speakerB',rate=p.rate+(useB?0.018:-0.008)+(i%3===2?0.008:0),pitch=useB?p.pitchB:p.pitchA;
      var selectedVoice=(useB?voices.secondary:voices.primary);
      return {index:i,text:s.text,speaker:s.speaker,label:s.label||s.speaker,lang:(selectedVoice&&selectedVoice.lang)||locale(language),rate:Math.max(0.72,Math.min(1.18,rate)),pitch:Math.max(0.82,Math.min(1.18,pitch)),pauseAfterMs:i===segments.length-1?0:p.pauseMs,voiceURI:selectedVoice&&(selectedVoice.voiceURI||''),voiceName:selectedVoice&&(selectedVoice.name||'')};
    });
    return {schema:SCHEMA,version:VERSION,id:String(options.id||('audio-'+Date.now())),level:level,language:language,locale:locale(language),mode:String(options.mode||'training'),segments:planned,segmentCount:planned.length,maxPlays:p.maxPlays,estimatedDurationMs:estimateDurationMs(planned,level),voiceCount:voices.available,distinctVoices:voices.distinct,device:dev,realism:voices.accentVariation?'multi-voice-accent-variation':(voices.distinct?'multi-voice':'prosody-variation'),accentVariation:voices.accentVariation,profile:p};
  }
  function cancel(reason){
    if(activeRun){activeRun.cancelled=true;if(activeRun.timer)clearTimeout(activeRun.timer);if(activeRun.heartbeat)clearInterval(activeRun.heartbeat);if(activeRun.resolve)activeRun.resolve({ok:false,cancelled:true,reason:reason||'cancelled'});activeRun=null;}
    try{if(supported())window.speechSynthesis.cancel();}catch(e){}
  }
  function play(options){
    options=options||{};
    if(!supported())return {started:false,plan:createPlan(options),promise:Promise.resolve({ok:false,error:'speech-synthesis-unavailable'})};
    cancel('replaced');
    var promise=loadVoices(700).then(function(){
      var plan=createPlan(options), run={cancelled:false,index:0,plan:plan,timer:null,heartbeat:null,resolve:null};activeRun=run;
      return new Promise(function(resolve){
        run.resolve=resolve;
        var callbacks=options.callbacks||{};
        function finish(result){if(run!==activeRun&&activeRun!==null)return;if(run.timer)clearTimeout(run.timer);if(run.heartbeat)clearInterval(run.heartbeat);activeRun=null;try{callbacks.onend&&callbacks.onend(result,plan);}catch(e){}resolve(result);}
        function fail(err,segment){try{callbacks.onerror&&callbacks.onerror(err,segment,plan);}catch(e){}finish({ok:false,error:String(err&&err.message||err||'audio-error'),segment:segment&&segment.index});}
        function next(){
          if(run.cancelled)return finish({ok:false,cancelled:true});
          if(run.index>=plan.segments.length)return finish({ok:true,segmentsPlayed:plan.segments.length,plan:plan});
          var seg=plan.segments[run.index], utter;
          try{utter=new SpeechSynthesisUtterance(seg.text);}catch(e){return fail(e,seg);}
          utter.lang=seg.lang;utter.rate=seg.rate;utter.pitch=seg.pitch;utter.volume=1;
          var voices=getVoices(plan.language), voice=voices.filter(function(v){return v.voiceURI===seg.voiceURI;})[0];if(voice)utter.voice=voice;
          utter.onstart=function(){try{callbacks.onsegment&&callbacks.onsegment(seg,plan);}catch(e){}};
          utter.onerror=function(ev){fail(ev&&ev.error?new Error(ev.error):new Error('speech-error'),seg);};
          utter.onend=function(){if(run.timer)clearTimeout(run.timer);run.index+=1;run.timer=setTimeout(next,seg.pauseAfterMs||0);};
          var watchdog=Math.max(4500,Math.round((seg.text.split(/\s+/).length/(150*seg.rate))*60000)+4000);
          run.timer=setTimeout(function(){try{window.speechSynthesis.cancel();}catch(e){}fail(new Error('speech-watchdog-timeout'),seg);},watchdog);
          try{window.speechSynthesis.speak(utter);}catch(e){fail(e,seg);}
        }
        var dev=plan.device;
        if(dev.ios){run.heartbeat=setInterval(function(){try{if(window.speechSynthesis&&window.speechSynthesis.speaking&&!window.speechSynthesis.paused)window.speechSynthesis.resume();}catch(e){}},4200);}
        try{callbacks.onstart&&callbacks.onstart(plan);}catch(e){}
        next();
      });
    });
    return {started:true,plan:null,promise:promise};
  }
  function replayPolicy(level,mode){var p=profile(level);return {maxPlays:p.maxPlays,transcriptLocked:String(mode||'simulation')==='simulation',level:normalizeLevel(level)};}
  function diagnose(){
    var rows=LEVELS.map(function(level){var p=profile(level);return {level:level,rate:p.rate,pauseMs:p.pauseMs,maxPlays:p.maxPlays,dialogueMode:p.dialogueMode};});
    return {ok:true,phase:VERSION,schema:SCHEMA,supported:supported(),device:deviceInfo(),voiceCounts:{de:getVoices('de').length,en:getVoices('en').length},profiles:rows};
  }
  if(supported()){
    try{window.speechSynthesis.addEventListener('voiceschanged',function(){voiceCache=window.speechSynthesis.getVoices()||[];});voiceCache=window.speechSynthesis.getVoices()||[];}catch(e){}
  }
  window.LanguageAudioRealismEngine=Object.freeze({__version:VERSION,schema:SCHEMA,levels:LEVELS.slice(),supported:supported,deviceInfo:deviceInfo,getProfile:profile,replayPolicy:replayPolicy,buildSegments:buildSegments,createPlan:createPlan,play:play,cancel:cancel,diagnose:diagnose,loadVoices:loadVoices});
})();
