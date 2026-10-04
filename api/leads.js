import { normalizeLead } from '../shared/leads.js';
import { deliverLead } from '../server/leads.mjs';
import { limitLeads } from '../server/rate-limit.mjs';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Use o formulário de contato.' }); }
    let origin; try { origin = new URL(req.headers.origin); } catch { return res.status(403).json({ error: 'Origem inválida.' }); }
    if (origin.host !== req.headers.host || origin.protocol !== 'https:') return res.status(403).json({ error: 'Origem inválida.' });
    if (!String(req.headers['content-type']).startsWith('application/json')) return res.status(415).json({ error: 'Envie dados JSON.' });
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    if (Buffer.byteLength(raw) > 12000) return res.status(413).json({ error: 'Contato acima do limite.' });
    let input; try { input = JSON.parse(raw); } catch { return res.status(400).json({ error: 'Dados inválidos.' }); }
    let lead; try { lead = normalizeLead(input, 'distrito'); } catch (error) { return res.status(400).json({ error: error.message }); }
    const identity = String(req.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim() || 'anonymous';
    await limitLeads(identity);
    const receipt = await deliverLead(lead);
    return res.status(201).json(receipt);
  } catch (error) { return res.status(error.status || 502).json({ error: error.status ? error.message : 'Não foi possível confirmar o recebimento. Seus dados foram preservados.' }); }
}
