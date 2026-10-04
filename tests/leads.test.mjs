import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLead, submitLead } from '../shared/leads.js';
import { deliverLead } from '../server/leads.mjs';
const fixture = { nome: 'Pessoa de teste', empresa: 'Produtora', email: 'pessoa@example.com', whatsapp: '(16) 99999-9999', tipoEvento: 'Show', publicoEstimado: 'Até 1.000 pessoas', dataPrevista: 'Outubro/2027', descricaoEvento: '', localInteresse: 'arena', requestId: 'aabbccdd-1234-4567-8901-aabbccddeeff', attribution: { utm_source: 'google', utm_campaign: 'teste' } };
test('Arena enforces its venue and malformed contacts never reach the receiver', () => {
  assert.equal(normalizeLead({ ...fixture, localInteresse: 'esplanada' }, 'arena').localInteresse, 'arena');
  assert.equal(normalizeLead(fixture, 'distrito').paginaOrigem, 'lp-distrito'); assert.equal(normalizeLead(fixture, 'distrito').attribution.utm_source, 'google');
  assert.throws(() => normalizeLead({ ...fixture, email: 'x' }, 'arena'), /email/i);
  assert.throws(() => normalizeLead({ ...fixture, whatsapp: '1' }, 'arena'), /WhatsApp/);
  assert.throws(() => normalizeLead({ ...fixture, localInteresse: 'inventado' }, 'distrito'), /local/i);
});
test('missing connector and an unconfirmed remote response never produce a success receipt', async () => {
  await assert.rejects(deliverLead(fixture, {}, async () => { throw new Error('must not call'); }), /configur/i);
  await assert.rejects(deliverLead(fixture, { LEAD_WEBHOOK_URL: 'https://receiver.example/api', LEAD_WEBHOOK_TOKEN: 'fixture-only' }, async () => new Response('{}', { status: 200 })), /confirma/i);
  const received = await deliverLead(fixture, { LEAD_WEBHOOK_URL: 'https://receiver.example/api', LEAD_WEBHOOK_TOKEN: 'fixture-only' }, async () => new Response(JSON.stringify({ received: true, leadId: 'lead-fixture-1' }), { status: 200 }));
  assert.deepEqual(received, { received: true, leadId: 'lead-fixture-1' });
});
test('redirects and local webhook URLs are refused', async () => {
  for (const url of ['http://localhost/api', 'https://127.0.0.1/api', 'https://user:password@receiver.example/api']) await assert.rejects(deliverLead(fixture, { LEAD_WEBHOOK_URL: url, LEAD_WEBHOOK_TOKEN: 'fixture-only' }), /endereço/i);
  await assert.rejects(deliverLead(fixture, { LEAD_WEBHOOK_URL: 'https://receiver.example/api', LEAD_WEBHOOK_TOKEN: 'fixture-only' }, async () => new Response('', { status: 302 })), /recusou/i);
});
test('non-JSON receiver failure has a readable error and never an accepted receipt', async () => {
  await assert.rejects(submitLead(fixture, { fetcher: async () => new Response('<html>indisponível</html>', { status: 503 }) }), /servidor|recebimento/i);
});
