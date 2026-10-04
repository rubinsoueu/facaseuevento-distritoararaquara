class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

// A future Salesforce receiver must acknowledge a persisted lead explicitly.
// Never treat iframe load, HTTP 200 alone or a button click as delivery.
export async function deliverLead(data, env = process.env, fetcher = fetch) {
  if (!env.LEAD_WEBHOOK_URL || !env.LEAD_WEBHOOK_TOKEN) throw new HttpError(503, 'Recepção comercial ainda não configurada. Use o contato comercial disponível; seus dados foram preservados.');
  let url; try { url = new URL(env.LEAD_WEBHOOK_URL); } catch { throw new HttpError(503, 'Endereço do receptor inválido.'); }
  if (url.protocol !== 'https:' || url.username || url.password || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[|0\.)/.test(url.hostname) || /\.(local|internal)$/.test(url.hostname)) throw new HttpError(503, 'Endereço do receptor inválido.');
  const response = await fetcher(url.href, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.LEAD_WEBHOOK_TOKEN}`, 'Idempotency-Key': data.requestId }, body: JSON.stringify(data) });
  if (!response.ok) throw new HttpError(502, 'O receptor recusou o contato. Seus dados foram preservados.');
  const raw = await response.text();
  if (raw.length > 20000) throw new HttpError(502, 'Resposta do receptor inválida.');
  let receipt; try { receipt = JSON.parse(raw); } catch { throw new HttpError(502, 'O recebimento não foi confirmado.'); }
  if (receipt.received !== true || typeof receipt.leadId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(receipt.leadId)) throw new HttpError(502, 'O recebimento não foi confirmado. Seus dados foram preservados.');
  return { received: true, leadId: receipt.leadId };
}
