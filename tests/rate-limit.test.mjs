import test from 'node:test';
import assert from 'node:assert/strict';
import { limitLeads } from '../server/rate-limit.mjs';
test('unconfigured durable limits fail closed before receiver delivery', async () => {
  await assert.rejects(limitLeads('test', {}), error => error.status === 503);
});
test('a durable bucket refusal stops the request with 429', async () => {
  let call = 0;
  const externalDatabase = async () => { call++; return []; };
  await assert.rejects(limitLeads('test', {}, externalDatabase), error => error.status === 429);

});
