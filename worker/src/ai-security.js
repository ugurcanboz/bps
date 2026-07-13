export const AI_SECURITY_VERSION = 'G54.50.2G-ai-security-v1';

const HTML_RE = /<\/?(?:script|iframe|object|embed|style|link|meta|form|input|button|svg|math)[^>]*>/i;
const SECRET_RE = /(?:api[_ -]?key|authorization|bearer\s+[a-z0-9._-]+|system prompt|developer message|hidden instruction)/i;
const OVERRIDE_RE = /(?:ignore|disregard|forget|override|bypass).{0,50}(?:instruction|prompt|policy|rule|system|developer)/i;
const DE_OVERRIDE_RE = /(?:ignoriere|vergiss|überschreibe|umgehe).{0,50}(?:anweisung|systemprompt|regel|richtlinie)/i;

function text(value,max=4000){ return String(value ?? '').replace(/\u0000/g,'').trim().slice(0,max); }
function finiteInt(value,min,max,fallback=0){ const n=Number(value); return Number.isFinite(n)?Math.max(min,Math.min(max,Math.round(n))):fallback; }
function cleanOutput(value,max=3000){ return text(value,max).replace(HTML_RE,'[entfernt]'); }

export function detectPromptAttack(value){
  const input=text(value,12000);
  const matched=[];
  if(OVERRIDE_RE.test(input)||DE_OVERRIDE_RE.test(input)) matched.push('instruction_override');
  if(SECRET_RE.test(input)) matched.push('secret_or_prompt_exfiltration');
  if(/(?:role\s*:\s*system|<\|system\|>|###\s*system)/i.test(input)) matched.push('role_injection');
  return {suspicious:matched.length>0,reasons:[...new Set(matched)]};
}

export function inspectUntrustedPayload(data){
  const parts=[data?.userText,data?.topic,...(data?.requiredPoints||[]),...(data?.history||[]).map(x=>x?.content),data?.context?.summary,...(data?.context?.errors||[]),...(data?.context?.goals||[])];
  const result=detectPromptAttack(parts.join('\n'));
  return {...result,scannedChars:parts.join('\n').length};
}

export function wrapUntrusted(label,value,max=6000){
  const safe=text(value,max).replace(/<\/UNTRUSTED_[A-Z_]+>/gi,'[closing tag removed]');
  return `<UNTRUSTED_${label}>\n${safe}\n</UNTRUSTED_${label}>`;
}

function arrayStrings(value,maxItems,maxChars){ return (Array.isArray(value)?value:[]).slice(0,maxItems).map(v=>cleanOutput(v,maxChars)).filter(Boolean); }
function corrections(value){ return (Array.isArray(value)?value:[]).slice(0,3).map(item=>({
  original:cleanOutput(item?.original,400), improved:cleanOutput(item?.improved,500), reason:cleanOutput(item?.reason,500),
  category:['grammar','vocabulary','word-order','spelling','register','naturalness'].includes(item?.category)?item.category:'naturalness'
})).filter(x=>x.original||x.improved||x.reason); }

export function validateModelOutput(kind,role,input){
  if(!input||typeof input!=='object'||Array.isArray(input)) return {ok:false,error:'INVALID_MODEL_OUTPUT'};
  if(HTML_RE.test(JSON.stringify(input))||SECRET_RE.test(JSON.stringify(input))) return {ok:false,error:'UNSAFE_MODEL_OUTPUT'};
  if(kind==='coach'){
    const expectedRole=role==='conversation'?'conversation':'coach';
    const reply=cleanOutput(input.reply,3000);
    if(!reply) return {ok:false,error:'INVALID_MODEL_OUTPUT'};
    return {ok:true,value:{reply,corrections:corrections(input.corrections),nextQuestion:cleanOutput(input.nextQuestion,600),level:String(input.level||''),role:expectedRole}};
  }
  if(kind==='speaking'){
    const criteria=input.criteria||{};
    const normalized={taskCompletion:finiteInt(criteria.taskCompletion,0,20),grammar:finiteInt(criteria.grammar,0,20),vocabulary:finiteInt(criteria.vocabulary,0,20),coherence:finiteInt(criteria.coherence,0,20),comprehensibility:finiteInt(criteria.comprehensibility,0,20)};
    const score=Object.values(normalized).reduce((a,b)=>a+b,0);
    return {ok:true,value:{reply:cleanOutput(input.reply,2000),score,maxScore:100,strengths:arrayStrings(input.strengths,5,300),improvements:arrayStrings(input.improvements,5,300),correctedVersion:cleanOutput(input.correctedVersion,3000),criteria:normalized,assessmentScope:'text-transcript-only',role:'speakingEvaluator'}};
  }
  const criteria=input.criteria||{};
  const normalized={taskCompletion:finiteInt(criteria.taskCompletion,0,25),grammar:finiteInt(criteria.grammar,0,25),vocabulary:finiteInt(criteria.vocabulary,0,25),coherence:finiteInt(criteria.coherence,0,25)};
  const score=Object.values(normalized).reduce((a,b)=>a+b,0);
  return {ok:true,value:{score,maxScore:100,passed:score>=60,fulfilledPoints:arrayStrings(input.fulfilledPoints,12,300),missingPoints:arrayStrings(input.missingPoints,12,300),feedback:cleanOutput(input.feedback,2500),correctedVersion:cleanOutput(input.correctedVersion,3000),criteria:normalized,assessmentScope:'text-transcript-only',role:'examiner'}};
}
