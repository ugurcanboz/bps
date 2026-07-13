/* Eignungstest-Trainer · Transparente Sprechbewertung · G54.46.12 */
(function(){
  'use strict';
  var VERSION='G54.46.12';
  var SCHEMA='egt-language-speaking-evidence-v1';
  var SOURCES=['manual-transcript','speech-recognition-transcript','audio-analysis'];
  function clamp(v,min,max){v=Number(v);if(!isFinite(v))return null;return Math.max(min,Math.min(max,v));}
  function clean(v,max){return String(v==null?'':v).replace(/\s+/g,' ').trim().slice(0,max||4000);}
  function words(v){var s=clean(v,12000);return s?s.split(/\s+/).filter(Boolean).length:0;}
  function source(v){v=String(v||'manual-transcript');return SOURCES.indexOf(v)>=0?v:'manual-transcript';}
  function cleanMetrics(m){
    m=m&&typeof m==='object'?m:{};
    return {
      pronunciationScore:clamp(m.pronunciationScore,0,100),
      intonationScore:clamp(m.intonationScore,0,100),
      audioFluencyScore:clamp(m.audioFluencyScore,0,100),
      paceWpm:clamp(m.paceWpm,0,400),
      pauseRatio:clamp(m.pauseRatio,0,1),
      signalQuality:clamp(m.signalQuality,0,100)
    };
  }
  function createEvidence(input){
    input=input||{};
    var transcript=clean(input.transcript||input.userText,12000);
    var src=source(input.source||(input.audioMetrics?'audio-analysis':(input.recognizerUsed?'speech-recognition-transcript':'manual-transcript')));
    var metrics=cleanMetrics(input.audioMetrics);
    var analyzer=clean(input.analyzer,160);
    var audioAnalyzed=src==='audio-analysis'&&!!analyzer&&[metrics.pronunciationScore,metrics.intonationScore,metrics.audioFluencyScore].some(function(v){return typeof v==='number';});
    if(!audioAnalyzed&&src==='audio-analysis')src='speech-recognition-transcript';
    var confidence=clamp(input.transcriptConfidence,0,1);
    var evidence={
      schema:SCHEMA,version:VERSION,source:src,transcriptSource:src==='manual-transcript'?'manual':'browser-speech-recognition',
      transcriptWordCount:words(transcript),transcriptConfidence:confidence,durationMs:Math.max(0,Math.round(Number(input.durationMs)||0)),
      edited:!!input.edited,hasRawAudio:!!input.hasRawAudio,audioAnalyzed:audioAnalyzed,analyzer:audioAnalyzed?analyzer:null,audioMetrics:audioAnalyzed?metrics:null,
      capabilities:{content:!!transcript,language:!!transcript,textFlow:!!transcript,pronunciation:audioAnalyzed&&typeof metrics.pronunciationScore==='number',intonation:audioAnalyzed&&typeof metrics.intonationScore==='number',audioFluency:audioAnalyzed&&typeof metrics.audioFluencyScore==='number'},
      assessmentScope:audioAnalyzed?'audio-and-transcript':'transcript-only',assessmentCompleteness:audioAnalyzed?100:67,
      generatedAt:new Date().toISOString()
    };
    evidence.disclosure=audioAnalyzed
      ? 'Die Bewertung nutzt Transkript und ausgewiesene Audioanalyse. Prüfe den genannten Analyzer und die Messwerte.'
      : 'Die Bewertung basiert nur auf dem bestätigten Transkript. Aussprache, Intonation und tatsächliche mündliche Flüssigkeit wurden nicht gemessen.';
    evidence.confidenceNote=confidence==null?'Keine Erkennungswahrscheinlichkeit verfügbar.':'Die Erkennungswahrscheinlichkeit beschreibt nur die Transkription, nicht die Aussprachequalität.';
    return evidence;
  }
  function score(v){var n=clamp(v,0,100);return n==null?null:Math.round(n);}
  function normalizeAssessment(result,evidence){
    result=result&&typeof result==='object'?result:{};
    evidence=createEvidence(Object.assign({},evidence||{}, {transcript:(evidence&&evidence.transcript)||result.userText||''}));
    var textFlow=score(result.textFlowScore!=null?result.textFlowScore:result.fluencyScore);
    var out={
      schema:SCHEMA,version:VERSION,evidence:evidence,
      scoreScope:evidence.audioAnalyzed?'speaking-with-audio':'text-based-speaking-task',
      content:{topicScore:score(result.topicScore),taskCompletionScore:score(result.taskCompletionScore!=null?result.taskCompletionScore:result.requiredScore)},
      language:{grammarScore:score(result.grammarScore),vocabularyScore:score(result.vocabularyScore),textFlowScore:textFlow},
      audio:{pronunciationScore:null,intonationScore:null,audioFluencyScore:null,paceWpm:null,signalQuality:null},
      measured:{content:evidence.capabilities.content,language:evidence.capabilities.language,pronunciation:false,intonation:false,audioFluency:false},
      disclosure:evidence.disclosure
    };
    if(evidence.audioAnalyzed){
      out.audio={pronunciationScore:score(evidence.audioMetrics.pronunciationScore),intonationScore:score(evidence.audioMetrics.intonationScore),audioFluencyScore:score(evidence.audioMetrics.audioFluencyScore),paceWpm:evidence.audioMetrics.paceWpm,signalQuality:evidence.audioMetrics.signalQuality};
      out.measured.pronunciation=evidence.capabilities.pronunciation;out.measured.intonation=evidence.capabilities.intonation;out.measured.audioFluency=evidence.capabilities.audioFluency;
    }
    out.textBasedScore=score(result.overallScore!=null?result.overallScore:result.score);
    out.officialSpeakingScore=evidence.audioAnalyzed?out.textBasedScore:null;
    return out;
  }
  function badge(evidence){
    evidence=createEvidence(evidence||{});
    return {label:evidence.audioAnalyzed?'Audio + Transkript analysiert':(evidence.source==='speech-recognition-transcript'?'Spracherkennung · nur Transkript':'Manuelles Transkript'),tone:evidence.audioAnalyzed?'complete':'limited',disclosure:evidence.disclosure};
  }
  window.LanguageSpeakingEvidenceEngine=Object.freeze({__version:VERSION,schema:SCHEMA,createEvidence:createEvidence,normalizeAssessment:normalizeAssessment,badge:badge,wordCount:words});
})();
