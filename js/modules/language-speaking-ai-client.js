/* Language Academy · Phase 38B.3A
   Dedicated Speaking/Exam-Speaking AI Client.
   Uses Cloudflare Worker endpoints via EGTLanguageAIClient when available.
   No secrets, no Groq key, GitHub-Pages-compatible. */
(function(){
  'use strict';

  var VERSION = 'G54.46.13B-transparent-speaking-ai-client';
  var STATUS_EVENT = 'language-academy-speaking-ai:status';
  var lastStatus = { ok:null, mode:null, checkedAt:null, error:null };

  function cfg(){ return window.LanguageAcademyAIConfig || {}; }
  function baseClient(){ return window.EGTLanguageAIClient || null; }
  function evidenceEngine(){ return window.LanguageSpeakingEvidenceEngine || null; }
  function speakingEvidence(payload){
    var e=payload&&payload.evidence||{};
    if(evidenceEngine()&&evidenceEngine().createEvidence) return evidenceEngine().createEvidence(Object.assign({},e,{transcript:payload&&payload.userText||''}));
    return {source:'manual-transcript',audioAnalyzed:false,assessmentScope:'transcript-only',disclosure:'Die Bewertung basiert nur auf dem bestätigten Transkript. Aussprache und Intonation wurden nicht gemessen.'};
  }
  function transparentResult(result,payload){
    result=result||{}; var evidence=speakingEvidence(payload||{});
    if(evidenceEngine()&&evidenceEngine().normalizeAssessment) result.speakingAssessment=evidenceEngine().normalizeAssessment(result,evidence);
    result.evidence=evidence; result.assessmentScope=evidence.assessmentScope;
    if(!evidence.audioAnalyzed){
      if(result.fluencyScore!=null&&result.textFlowScore==null) result.textFlowScore=result.fluencyScore;
      result.fluencyScore=null; result.pronunciationScore=null; result.intonationScore=null; result.audioFluencyScore=null;
      result.examFeedback=cleanText((result.examFeedback||result.reply||'')+' '+evidence.disclosure,2400);
    }
    return result;
  }
  function enabled(){
    var c = cfg();
    return c.enabled !== false && !!String(c.workerBaseUrl || '').trim();
  }
  function emit(status){
    lastStatus = Object.assign({}, lastStatus, status || {}, { checkedAt:new Date().toISOString() });
    try{ document.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail:Object.assign({}, lastStatus) })); }catch(e){}
    return Object.assign({}, lastStatus);
  }
  function cleanText(value, max){
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max || 4000);
  }
  function cleanList(list, max){
    return (Array.isArray(list) ? list : []).map(function(x){ return cleanText(x, 180); }).filter(Boolean).slice(0, max || 12);
  }
  function normalizeLevel(level){
    var value = String(level || cfg().defaultLevel || 'B1').toUpperCase();
    return /^(A1|A2|B1|B2|C1|C2)$/.test(value) ? value : 'B1';
  }
  function localTopicScore(userText, topic, requiredPoints){
    var text = cleanText(userText, 4000).toLowerCase();
    var topicWords = cleanText(topic, 240).toLowerCase().split(/[^a-zäöüß0-9]+/i).filter(function(w){ return w.length >= 3; });
    var reqWords = cleanList(requiredPoints, 12).join(' ').toLowerCase().split(/[^a-zäöüß0-9]+/i).filter(function(w){ return w.length >= 4; });
    var words = topicWords.concat(reqWords);
    var unique = Array.from(new Set(words));
    if(!text) return 0;
    if(!unique.length) return Math.min(100, Math.max(20, text.split(/\s+/).length * 5));
    var hits = unique.filter(function(w){ return text.indexOf(w) !== -1; }).length;
    return Math.max(0, Math.min(100, Math.round((hits / unique.length) * 100)));
  }
  function localExamFallback(payload, reason){
    var userText = cleanText(payload && (payload.userText || payload.message), 4000);
    var requiredPoints = cleanList(payload && payload.requiredPoints, 12);
    var topic = cleanText(payload && payload.topic, 240) || 'Prüfungsgespräch';
    var topicScore = localTopicScore(userText, topic, requiredPoints);
    var wordCount = userText ? userText.split(/\s+/).length : 0;
    var lengthScore = Math.max(0, Math.min(100, wordCount * 5));
    var overall = Math.round((topicScore * 0.62) + (lengthScore * 0.38));
    var missing = requiredPoints.filter(function(point){
      var key = cleanText(point, 80).toLowerCase().split(/[^a-zäöüß0-9]+/i).filter(function(w){ return w.length >= 4; })[0];
      return key && userText.toLowerCase().indexOf(key) === -1;
    });
    var response = {
      ok:true,
      type:'exam-speaking',
      mode:'local-fallback',
      result:{
        reply:'Die Live-KI ist gerade nicht erreichbar. Ich bewerte deine Antwort deshalb mit der lokalen Notfallprüfung.',
        passed: overall >= 60 && topicScore >= 45,
        overallScore: overall,
        topicScore: topicScore,
        grammarScore: null,
        vocabularyScore: null,
        fluencyScore: null,
        textFlowScore: null,
        pronunciationScore: null,
        intonationScore: null,
        audioFluencyScore: null,
        offTopic: topicScore < 35,
        missingPoints: missing,
        strengths: topicScore >= 60 ? ['Die Antwort passt grundsätzlich zum Thema.'] : [],
        weaknesses: topicScore < 60 ? ['Der Themenbezug ist noch zu schwach oder wichtige Pflichtpunkte fehlen.'] : [],
        examFeedback: 'Lokale Fallback-Bewertung. Grund: ' + (reason || 'KI-Verbindung nicht verfügbar') + '. Für eine genaue Bewertung bitte später erneut mit Live-KI testen.',
        nextPrompt:'Formuliere die Antwort noch einmal mit Begrüßung, klarem Thema, Grund und passendem Abschluss.'
      }
    };
    response.result=transparentResult(response.result,payload);
    return response;
  }
  function localSpeakingFallback(payload, reason){
    var userText = cleanText(payload && (payload.userText || payload.message), 4000);
    var topic = cleanText(payload && payload.topic, 240) || 'Alltag';
    var topicScore = localTopicScore(userText, topic, []);
    var response = {
      ok:true,
      type:'speaking',
      mode:'local-fallback',
      result:{
        reply:'Die Live-KI ist gerade nicht erreichbar. Ich gebe dir eine lokale Rückmeldung.',
        topicScore:topicScore,
        offTopic:topicScore < 35,
        correction:'Prüfe, ob deine Antwort klar zum Thema passt und mindestens einen vollständigen Satz enthält.',
        nextQuestion:'Kannst du deine Antwort noch einmal genauer zum Thema "' + topic + '" formulieren?'
      },
      fallbackReason: reason || null
    };
    response.result=transparentResult(response.result,payload);
    return response;
  }
  async function checkSpeaking(payload){
    payload = payload || {};
    var prepared = {
      level: normalizeLevel(payload.level),
      topic: cleanText(payload.topic, 240) || 'Alltag',
      userText: cleanText(payload.userText || payload.message, 4000),
      history: Array.isArray(payload.history) ? payload.history : [],
      evidence: speakingEvidence(payload)
    };
    if(!prepared.userText){ throw new Error('userText fehlt für Speaking-Bewertung.'); }
    try{
      if(!enabled() || !baseClient() || !baseClient().speaking) throw new Error('Live-Speaking-Client nicht verfügbar.');
      var result = await baseClient().speaking(prepared);
      emit({ ok:true, mode:'live', error:null });
      if(result&&result.result) result.result=transparentResult(result.result,prepared); else result=transparentResult(result,prepared);
      return Object.assign({ mode:'live' }, result);
    }catch(error){
      emit({ ok:false, mode:'local-fallback', error:error && error.message ? error.message : String(error) });
      if(cfg().allowLocalFallback === false) throw error;
      return localSpeakingFallback(prepared, error && error.message ? error.message : String(error));
    }
  }
  async function checkExamSpeaking(payload){
    payload = payload || {};
    var prepared = {
      level: normalizeLevel(payload.level),
      topic: cleanText(payload.topic, 240) || 'Prüfungsgespräch',
      userText: cleanText(payload.userText || payload.message, 4000),
      requiredPoints: cleanList(payload.requiredPoints, 12),
      evidence: speakingEvidence(payload)
    };
    if(!prepared.userText){ throw new Error('userText fehlt für Prüfungsbewertung.'); }
    try{
      if(!enabled() || !baseClient() || !baseClient().examSpeaking) throw new Error('Live-Exam-Speaking-Client nicht verfügbar.');
      var result = await baseClient().examSpeaking(prepared);
      emit({ ok:true, mode:'live', error:null });
      if(result&&result.result) result.result=transparentResult(result.result,prepared); else result=transparentResult(result,prepared);
      return Object.assign({ mode:'live' }, result);
    }catch(error){
      emit({ ok:false, mode:'local-fallback', error:error && error.message ? error.message : String(error) });
      if(cfg().allowLocalFallback === false) throw error;
      return localExamFallback(prepared, error && error.message ? error.message : String(error));
    }
  }

  window.LanguageSpeakingAI = Object.freeze({
    __version: VERSION,
    checkSpeaking: checkSpeaking,
    checkExamSpeaking: checkExamSpeaking,
    isEnabled: enabled,
    lastStatus: function(){ return Object.assign({}, lastStatus); },
    statusEvent: STATUS_EVENT
  });
})();
