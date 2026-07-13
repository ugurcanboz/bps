#!/usr/bin/env node
const args=Object.fromEntries(process.argv.slice(2).map(x=>{const [k,...v]=x.replace(/^--/,'').split('=');return[k,v.join('=')||true]}));
const base=String(args.url||process.env.WORKER_URL||'').replace(/\/$/,'');
if(!base){console.error('Usage: npm run load:live -- --url=https://worker.example --requests=50 --concurrency=10');process.exit(2);}
const total=Math.max(1,Math.min(1000,Number(args.requests||50))); const concurrency=Math.max(1,Math.min(100,Number(args.concurrency||10)));
const paid=String(args['allow-cost']||'false')==='true'; const target=paid?'/api/coach':'/api/health';
const times=[]; const statuses={}; let next=0;
async function one(i){const started=performance.now(); const init=paid?{method:'POST',headers:{'Content-Type':'application/json','X-Request-ID':`live-${Date.now()}-${i}`},body:JSON.stringify({message:'Antworte nur mit OK.',level:'A1',language:'Deutsch'})}:{}; try{const r=await fetch(base+target,init); statuses[r.status]=(statuses[r.status]||0)+1; await r.arrayBuffer();}catch(e){statuses.NETWORK=(statuses.NETWORK||0)+1;} times.push(performance.now()-started);}
async function runner(){while(true){const i=next++;if(i>=total)return;await one(i);}}
const started=performance.now(); await Promise.all(Array.from({length:concurrency},runner)); times.sort((a,b)=>a-b);
const pct=p=>Math.round(times[Math.min(times.length-1,Math.floor(times.length*p))]||0); const duration=performance.now()-started;
console.log(JSON.stringify({target,requests:total,concurrency,durationMs:Math.round(duration),requestsPerSecond:Number((total/(duration/1000)).toFixed(2)),latencyMs:{min:Math.round(times[0]||0),p50:pct(.5),p95:pct(.95),max:Math.round(times.at(-1)||0)},statuses},null,2));
if(Object.keys(statuses).some(s=>s==='NETWORK'||Number(s)>=500))process.exitCode=1;
