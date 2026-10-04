import { COMMERCIAL_CONFIG } from './commercial-config.js';
import { normalizeLead, campaignAttribution, submitLead, VENUES } from './shared/leads.js';
/**
 * Landing Page B2B - Distrito Araraquara
 * Script de Tratamento de Leads, Controle de Interface & WhatsApp Comercial
 * (Com Endurecimento de Segurança e Proteção Anti-Bot)
 */

// Public contact settings; server-side validation protects lead delivery.
const APP_CONFIG = Object.freeze({
  WHATSAPP_PHONE: '5516997195489',
  ATIVO_NOME: 'Distrito Araraquara (Araraquara/SP)',
  SUBMIT_DEBOUNCE_MS: 3000
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('b2b-form');
  try {
    const policy = new URL(COMMERCIAL_CONFIG.privacyPolicyUrl);
    if (policy.protocol === 'https:' && !policy.username && !policy.password) {
      const link = document.createElement('a'); link.href = policy.href; link.textContent = 'Política de privacidade'; link.target = '_blank'; link.rel = 'noopener noreferrer';
      document.getElementById('privacy-notice').append(' ', link);
    }
  } catch { /* A verified policy URL must be configured before release. */ }

  const modal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const whatsappTestBtn = document.getElementById('whatsapp-test-btn');
  const phoneInput = document.getElementById('whatsapp');
  const backToTopBtn = document.getElementById('back-to-top');
  modal?.addEventListener('close', () => form?.querySelector('.form-submit-btn')?.focus());

  // 1. Máscara de Telefone WhatsApp comercial (XX) XXXXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 6) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else {
        e.target.value = v;
      }
    });
  }

  // 2. Seletor de Data Flexível (Calendário + Texto Livre)
  const dataPrevistaInput = document.getElementById('data_prevista');
  const datePickerHelper = document.getElementById('date_picker_helper');
  const calendarTrigger = document.getElementById('calendar-trigger');

  if (calendarTrigger && datePickerHelper && dataPrevistaInput) {
    calendarTrigger.addEventListener('click', () => {
      if (typeof datePickerHelper.showPicker === 'function') {
        datePickerHelper.showPicker();
      } else {
        datePickerHelper.click();
      }
    });

    datePickerHelper.addEventListener('change', (e) => {
      const val = e.target.value; // YYYY-MM-DD
      if (val) {
        const parts = val.split('-');
        if (parts.length === 3) {
          dataPrevistaInput.value = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }
    });
  }

  let lastSubmittedData = null;

  let submitting = false, requestId = crypto.randomUUID(), lastFingerprint = '';
  if (form) form.addEventListener('submit', async event => {
    event.preventDefault(); if (submitting || !form.reportValidity()) return;
    const submitBtn = form.querySelector('.form-submit-btn'), status = document.getElementById('form-status');
    const value = id => document.getElementById(id)?.value || '';
    const input = { nome: value('nome'), empresa: value('empresa'), email: value('email'), whatsapp: value('whatsapp'), tipoEvento: value('tipo_evento'), publicoEstimado: value('publico_estimado'), dataPrevista: value('data_prevista'), descricaoEvento: value('descricao_evento'), localInteresse: value('local_interesse'), website: value('b2b_website_hp'), attribution: campaignAttribution(location.search) };
    const fingerprint = JSON.stringify(input);
    if (lastFingerprint && lastFingerprint !== fingerprint) requestId = crypto.randomUUID(); lastFingerprint = fingerprint;
    submitting = true; submitBtn.disabled = true; status.textContent = 'Enviando sua consulta…';
    try {
      const data = normalizeLead({ ...input, requestId }, 'distrito');
      const receipt = await submitLead(data);
      lastSubmittedData = data;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead', lead_id: receipt.leadId, lead_tipo: data.tipoEvento, lead_publico: data.publicoEstimado, local_interesse: data.localInteresse, origem: data.paginaOrigem, ativo: data.ativo });
      document.getElementById('lead-protocol').textContent = `Protocolo: ${receipt.leadId}`;
      modal.showModal(); closeModalBtn.focus();
      status.textContent = 'Consulta recebida.'; form.reset(); requestId = crypto.randomUUID(); lastFingerprint = '';
    } catch (error) { status.textContent = error.message || 'O recebimento não foi confirmado. Seus dados continuam no formulário.'; }
    finally { submitting = false; submitBtn.disabled = false; }
  });

  // 4. Fechar Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modal) modal.close();
    });
  }

  // 5. Envio Amigável e Cordial para o WhatsApp Comercial (+55 16 99719-5489)
  if (whatsappTestBtn) {
    whatsappTestBtn.addEventListener('click', () => {
      if (!lastSubmittedData) return;

      const phone = APP_CONFIG.WHATSAPP_PHONE;
      let text = `Olá! Gostaria de mais informações comerciais e consultar disponibilidade de datas para realizar um evento no *Distrito Araraquara*.%0A%0A` +
        `*Local de interesse:* ${encodeURIComponent(VENUES[lastSubmittedData.localInteresse] || 'Distrito Araraquara')}%0A%0A` +
        `*Meus Dados de Contato:*%0A` +
        `• *Nome:* ${encodeURIComponent(lastSubmittedData.nome)}%0A` +
        `• *Empresa / Produtora:* ${encodeURIComponent(lastSubmittedData.empresa)}%0A` +
        `• *E-mail:* ${encodeURIComponent(lastSubmittedData.email)}%0A` +
        `• *WhatsApp:* ${encodeURIComponent(lastSubmittedData.whatsapp)}%0A` +
        `• *Segmento:* ${encodeURIComponent(lastSubmittedData.tipoEvento)}%0A` +
        `• *Data Prevista:* ${encodeURIComponent(lastSubmittedData.dataPrevista)}%0A` +
        `• *Público Estimado:* ${encodeURIComponent(lastSubmittedData.publicoEstimado)}`;

      if (lastSubmittedData.descricaoEvento) {
        text += `%0A• *Descrição/Obs:* ${encodeURIComponent(lastSubmittedData.descricaoEvento)}`;
      }

      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  }

  // 6. Botão Flutuante "Voltar ao Topo"
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
