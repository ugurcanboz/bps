'use strict';

const crypto=require('node:crypto');

function normalizeBootstrapCode(value){
  return String(value||'').trim().toUpperCase().replace(/\s+/g,'');
}
function digestBootstrapCode(value){
  return crypto.createHash('sha256').update(normalizeBootstrapCode(value),'utf8').digest('hex');
}
function constantTimeDigestEquals(actual,expected){
  const a=Buffer.from(String(actual||''),'hex');
  const b=Buffer.from(String(expected||''),'hex');
  return a.length===b.length && a.length>0 && crypto.timingSafeEqual(a,b);
}
function codeMatches(value,expectedDigest){
  return constantTimeDigestEquals(digestBootstrapCode(value),String(expectedDigest||'').toLowerCase());
}
function lockAllowsClaim(lock,uid,nowMs){
  lock=lock||{}; uid=String(uid||''); nowMs=Number(nowMs||Date.now());
  if(!uid) return {ok:false,reason:'missing-uid'};
  if(lock.status==='completed') return {ok:false,reason:'completed'};
  if(lock.status==='claiming' && String(lock.claimedByUid||'')!==uid && Number(lock.claimExpiresAt||0)>nowMs){
    return {ok:false,reason:'claim-in-progress'};
  }
  return {ok:true,reason:'available'};
}

module.exports={normalizeBootstrapCode,digestBootstrapCode,constantTimeDigestEquals,codeMatches,lockAllowsClaim};
