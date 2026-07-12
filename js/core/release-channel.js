/* Novura · Release-Kanal-Anzeige und Deployment-Schutz · G54.50.2C */
(function(){
  'use strict';
  var env=window.EGT_RUNTIME_ENV;
  if(!env) return;
  var productionHosts=['ugurcan-boz.github.io','assessments-trainer.de','www.assessments-trainer.de'];
  var host=''; try{host=String(location.hostname||'').toLowerCase();}catch(e){}
  var isKnownProduction=productionHosts.indexOf(host)>=0;
  var mismatch=(isKnownProduction&&env.name!=='production')||(!isKnownProduction&&env.name==='production'&&(host==='localhost'||host==='127.0.0.1'));
  window.EGT_RELEASE_GUARD=Object.freeze({ok:!mismatch,host:host,channel:env.channel,environment:env.name});

  function svgIcon(){return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M12 3 3.8 7.2v5.6c0 4.5 3.5 7.2 8.2 8.2 4.7-1 8.2-3.7 8.2-8.2V7.2L12 3Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.7 12 2.1 2.1 4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
  function mount(){
    if(env.name==='production') return;
    if(document.getElementById('egt-release-channel-badge')) return;
    var badge=document.createElement('div');
    badge.id='egt-release-channel-badge';
    badge.className='egt-release-channel-badge egt-release-channel-'+env.name;
    badge.setAttribute('role','status');
    badge.setAttribute('aria-label','Aktiver Release-Kanal: '+env.channel);
    badge.innerHTML=svgIcon()+'<span>'+env.channel+'</span>';
    document.body.appendChild(badge);
    if(mismatch){
      var warning=document.createElement('div');
      warning.className='egt-release-channel-warning';
      warning.setAttribute('role','alert');
      warning.textContent='Deployment blockiert: Domain und Release-Kanal passen nicht zusammen.';
      document.body.appendChild(warning);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
