/* Novura · Privacy-first Weather Context · G54.50.1 */
(function(root){'use strict';
var VERSION='G54.50.1-2026-07-12';
var TTL=30*60*1000;
var ENDPOINT='https://api.open-meteo.com/v1/forecast';
function now(){return Date.now()}
function timeout(ms){var c=typeof AbortController!=='undefined'?new AbortController():null;var id=setTimeout(function(){if(c)c.abort()},ms);return{signal:c&&c.signal,clear:function(){clearTimeout(id)}}}
function classify(code,precip,isDay,temp){code=Number(code);precip=Number(precip||0);temp=Number(temp);
 var kind='neutral',label='ruhig';
 if(precip>0||[51,53,55,56,57,61,63,65,66,67,80,81,82,85,86,95,96,99].indexOf(code)>=0){kind='rain';label='regnerisch'}
 else if([71,73,75,77].indexOf(code)>=0){kind='snow';label='verschneit'}
 else if([0,1].indexOf(code)>=0){kind='clear';label=isDay===0?'klar':'sonnig'}
 else if([2,3,45,48].indexOf(code)>=0){kind='cloudy';label=code>=45?'neblig':'bewölkt'}
 if(Number.isFinite(temp)&&temp<=3&&kind==='neutral'){kind='cold';label='kühl'}
 return{kind:kind,label:label,temperature:Number.isFinite(temp)?Math.round(temp):null};
}
function sanitize(raw){var c=raw&&raw.current||{};var out=classify(c.weather_code,c.precipitation,c.is_day,c.temperature_2m);return{kind:out.kind,label:out.label,temperature:out.temperature,fetchedAt:new Date().toISOString(),expiresAt:new Date(now()+TTL).toISOString(),source:'Open-Meteo'} }
function valid(x){return !!(x&&x.kind&&x.expiresAt&&Date.parse(x.expiresAt)>now())}
async function fetchCurrent(latitude,longitude){if(!Number.isFinite(latitude)||!Number.isFinite(longitude))throw new Error('invalid_coordinates');if(root.navigator&&root.navigator.onLine===false)throw new Error('offline');
 var u=ENDPOINT+'?latitude='+encodeURIComponent(latitude.toFixed(3))+'&longitude='+encodeURIComponent(longitude.toFixed(3))+'&current=temperature_2m,precipitation,weather_code,is_day&timezone=auto';
 var t=timeout(6500);try{var r=await root.fetch(u,{cache:'no-store',signal:t.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('weather_http_'+r.status);return sanitize(await r.json())}finally{t.clear()}}
async function refreshFromPosition(position){var c=position&&position.coords;if(!c)throw new Error('position_missing');var weather=await fetchCurrent(Number(c.latitude),Number(c.longitude));if(root.NovuraContextEngine)root.NovuraContextEngine.patch({weather:weather});return weather}
function current(){var m=root.NovuraContextEngine&&root.NovuraContextEngine.load();return m&&valid(m.weather)?m.weather:null}
function clear(){if(root.NovuraContextEngine)root.NovuraContextEngine.patch({weather:null})}
root.NovuraWeatherContext=Object.freeze({version:VERSION,ttl:TTL,endpoint:ENDPOINT,classify:classify,sanitize:sanitize,valid:valid,current:current,fetchCurrent:fetchCurrent,refreshFromPosition:refreshFromPosition,clear:clear});
})(typeof window!=='undefined'?window:globalThis);
