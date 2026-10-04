import { createHash } from 'node:crypto';
const fail = (status, message) => Object.assign(new Error(message), { status });
let client;
export async function limitLeads(identity, env = process.env, suppliedClient) {
  if (!env.DATABASE_URL && !suppliedClient) throw fail(503, 'Recepção comercial ainda não configurada. Seus dados foram preservados.');
  if (!suppliedClient && !client) { const { neon } = await import('@neondatabase/serverless'); client = neon(env.DATABASE_URL); }
  const sql = suppliedClient || client;
  const key = createHash('sha256').update(String(identity)).digest('hex');
  await sql`DELETE FROM commercial_lead_limits WHERE id IN (SELECT id FROM commercial_lead_limits WHERE expires_at < NOW() LIMIT 100)`;
  for (const [id, max] of [[`ip:${key}`, 8], ['global', 120]]) {
    const rows = await sql`INSERT INTO commercial_lead_limits (id, count, expires_at) VALUES (${id}, 1, NOW() + INTERVAL '1 minute') ON CONFLICT (id) DO UPDATE SET count = CASE WHEN commercial_lead_limits.expires_at <= NOW() THEN 1 ELSE commercial_lead_limits.count + 1 END, expires_at = CASE WHEN commercial_lead_limits.expires_at <= NOW() THEN NOW() + INTERVAL '1 minute' ELSE commercial_lead_limits.expires_at END WHERE commercial_lead_limits.expires_at <= NOW() OR commercial_lead_limits.count < ${max} RETURNING count`;
    if (!rows.length) throw fail(429, 'Muitas solicitações. Aguarde um minuto e tente novamente.');
  }
}
