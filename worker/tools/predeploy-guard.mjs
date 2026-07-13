import fs from 'node:fs';
const requested=(process.argv[2]||'').toLowerCase();
const allowed=['beta','production'];
if(!allowed.includes(requested)){
  console.error('Deployment blockiert: Kanal muss beta oder production sein.');
  process.exit(2);
}
const toml=fs.readFileSync(new URL('../wrangler.toml',import.meta.url),'utf8');
if(!toml.includes(`[env.${requested}]`)){
  console.error(`Deployment blockiert: [env.${requested}] fehlt in wrangler.toml.`);
  process.exit(3);
}
const required=['GROQ_API_KEY','MONITORING_TOKEN'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length && process.env.ALLOW_CLOUDFLARE_SECRETS!=='1'){
  console.error(`Deployment blockiert: lokale Freigabe fehlt. Setze ALLOW_CLOUDFLARE_SECRETS=1, nachdem die Secrets in Cloudflare für ${requested} geprüft wurden.`);
  process.exit(4);
}
if(requested==='production' && process.env.CONFIRM_PRODUCTION_DEPLOY!=='G54.47.15I'){
  console.error('Produktions-Deployment blockiert: CONFIRM_PRODUCTION_DEPLOY=G54.47.15I fehlt.');
  process.exit(5);
}
console.log(`Predeploy-Check grün: ${requested.toUpperCase()}`);
