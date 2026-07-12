import test from 'node:test';
import assert from 'node:assert/strict';
import {validateClientEvents} from '../src/monitoring.js';
test('accepts sanitized client events',()=>{const r=validateClientEvents({events:[{type:'javascript_error',area:'runtime',code:'TypeError',severity:'error',route:'/app'}]});assert.equal(r.ok,true);assert.equal(r.events.length,1);});
test('rejects unknown event types',()=>{const r=validateClientEvents({events:[{type:'user_text',code:'secret'}]});assert.equal(r.ok,false);});
test('rejects oversized batches',()=>{const r=validateClientEvents({events:Array.from({length:26},()=>({type:'offline'}))});assert.equal(r.ok,false);});
