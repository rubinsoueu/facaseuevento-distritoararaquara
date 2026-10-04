export const VENUES = { arena: 'Arena Fonte Luminosa', gigantao: 'Gigantão', pavilhao: 'Pavilhão de Exposições', convencoes: 'Centro de Convenções', esplanada: 'Esplanada de Eventos', orientacao: 'Preciso de orientação' };
const limits = { nome: 100, empresa: 100, email: 120, whatsapp: 20, tipoEvento: 160, publicoEstimado: 80, dataPrevista: 50, descricaoEvento: 500 };
export function normalizeLead(input, context) {
  if (!input || typeof input !== 'object' || !['arena', 'distrito'].includes(context)) throw new Error('Solicitação inválida.');
  if (input.website) throw new Error('Solicitação inválida.');
  const data = {};
  for (const [key, max] of Object.entries(limits)) {
    if (typeof input[key] !== 'string' || input[key].length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(input[key])) throw new Error(`Confira o campo ${key}.`);
    data[key] = input[key].trim();
    if (key !== 'descricaoEvento' && !data[key]) throw new Error(`Preencha o campo ${key}.`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('Confira seu email.');
  data.whatsapp = data.whatsapp.replace(/\D/g, '');
  if (!/^\d{10,13}$/.test(data.whatsapp)) throw new Error('Confira seu WhatsApp com DDD.');
  data.localInteresse = context === 'arena' ? 'arena' : input.localInteresse;
  if (!Object.hasOwn(VENUES, data.localInteresse)) throw new Error('Escolha um local válido.');
  data.ativo = 'Distrito Araraquara';
  data.localNome = VENUES[data.localInteresse];
  data.paginaOrigem = context === 'arena' ? 'site-arena' : 'lp-distrito';
  if (typeof input.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,64}$/.test(input.requestId)) throw new Error('Identificador de envio inválido.');
  data.requestId = input.requestId;
  data.attribution = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']) {
    const value = input.attribution?.[key];
    if (typeof value === 'string' && !/[\x00-\x1f]/.test(value)) data.attribution[key] = value.slice(0, 300);
  }
  return data;
}
export function campaignAttribution(search) {
  const values = new URLSearchParams(search), result = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']) if (values.has(key)) result[key] = values.get(key).slice(0, 300);
  return result;
}
export async function submitLead(data, { endpoint = '/api/leads', fetcher = fetch } = {}) {
  const response = await fetcher(endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(20000) });
  let receipt; try { receipt = await response.json(); } catch { throw new Error('O servidor não confirmou o recebimento. Seus dados continuam no formulário.'); }
  if (!response.ok || receipt.received !== true || typeof receipt.leadId !== 'string' || !receipt.leadId) throw new Error(receipt.error || 'O recebimento não foi confirmado. Seus dados continuam no formulário.');
  return receipt;
}
