#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const here=path.dirname(fileURLToPath(import.meta.url));
const target=path.resolve(here,'../functions/tools/bootstrap-admin.mjs');
const result=spawnSync(process.execPath,[target],{stdio:'inherit',env:process.env});
process.exit(result.status==null?1:result.status);
