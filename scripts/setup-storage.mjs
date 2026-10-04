import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL para o ambiente correto.');
const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS commercial_lead_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL)`;
await sql`CREATE INDEX IF NOT EXISTS commercial_lead_limits_expiry ON commercial_lead_limits (expires_at)`;
console.log('Estrutura de limites preparada; nenhum lead ou configuração Salesforce foi alterado.');
