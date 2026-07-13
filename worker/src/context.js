export const CONTEXT_ENGINE_VERSION = 'G54.46.13E-context-v1';

function clean(value, max=500){ return String(value || '').replace(/\s+/g,' ').trim().slice(0,max); }
function uniq(items, max){
  const seen=new Set(), out=[];
  for(const raw of Array.isArray(items)?items:[]){ const value=clean(raw,240); const key=value.toLowerCase(); if(value && !seen.has(key)){seen.add(key);out.push(value);} if(out.length>=max)break; }
  return out;
}
export function normalizeLearningContext(input){
  const source=input && typeof input==='object' ? input : {};
  return {
    summary:clean(source.summary,1200),
    errors:uniq(source.errors || source.errorHistory,8),
    vocabulary:uniq(source.vocabulary || source.vocabularyHistory,12),
    grammar:uniq(source.grammar || source.grammarHistory,8),
    goals:uniq(source.goals,5),
    preferences:{
      correctionStyle:clean(source.preferences?.correctionStyle,80),
      explanationLanguage:clean(source.preferences?.explanationLanguage,40)
    }
  };
}
export function optimizeHistory(history,{maxMessages=8,maxChars=6400}={}){
  const valid=(Array.isArray(history)?history:[]).filter(x=>x&&['user','assistant'].includes(x.role)&&clean(x.content,2000));
  const out=[]; let chars=0;
  for(let i=valid.length-1;i>=0&&out.length<maxMessages;i--){
    const item={role:valid[i].role,content:clean(valid[i].content,1600)};
    if(chars+item.content.length>maxChars && out.length) break;
    chars+=item.content.length; out.unshift(item);
  }
  return out;
}
export function buildContextBlock(context){
  const c=normalizeLearningContext(context);
  const lines=[];
  if(c.summary) lines.push(`Conversation summary: ${c.summary}`);
  if(c.errors.length) lines.push(`Recurring errors: ${c.errors.join(' | ')}`);
  if(c.vocabulary.length) lines.push(`Active vocabulary: ${c.vocabulary.join(' | ')}`);
  if(c.grammar.length) lines.push(`Grammar focus: ${c.grammar.join(' | ')}`);
  if(c.goals.length) lines.push(`Learning goals: ${c.goals.join(' | ')}`);
  if(c.preferences.correctionStyle) lines.push(`Correction style: ${c.preferences.correctionStyle}`);
  if(c.preferences.explanationLanguage) lines.push(`Explanation language: ${c.preferences.explanationLanguage}`);
  return lines.join('\n').slice(0,2600);
}
export function tokenBudget(kind, history, context){
  const historyChars=(history||[]).reduce((n,x)=>n+String(x.content||'').length,0);
  const contextChars=buildContextBlock(context).length;
  const estimatedInputTokens=Math.ceil((historyChars+contextChars)/4);
  const maxOutputTokens=kind==='coach'?700:900;
  return {estimatedInputTokens,maxOutputTokens,historyMessages:(history||[]).length,contextChars};
}
