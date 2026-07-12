#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ignored=new Set(['.git','node_modules','backup-output']);
const ext=/\.(js|mjs|cjs|json|md|html|css|toml|yml|yaml|txt|rules)$/i;
const patterns=[
 {name:'private key',re:/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/},
 {name:'Groq key',re:/\bgsk_[A-Za-z0-9]{20,}\b/},
 {name:'OpenAI key',re:/\bsk-[A-Za-z0-9_-]{20,}\b/},
 {name:'GitHub token',re:/\bgh[pousr]_[A-Za-z0-9]{20,}\b/},
 {name:'Cloudflare API token assignment',re:/CLOUDFLARE_API_TOKEN\s*=\s*['\"][^'\"]{12,}['\"]/i}
];
const findings=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(ignored.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(ext.test(e.name)&&fs.statSync(p).size<2_000_000){const s=fs.readFileSync(p,'utf8');for(const pat of patterns)if(pat.re.test(s))findings.push({file:path.relative(root,p),type:pat.name});}}}
walk(root);
console.log(JSON.stringify({suite:'secret scan',passed:findings.length?0:1,total:1,findings},null,2));
process.exit(findings.length?1:0);
