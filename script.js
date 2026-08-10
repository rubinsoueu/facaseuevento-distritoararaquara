/**
 * Landing Page B2B - Distrito Araraquara
 * Script de Tratamento de Leads, Controle de Interface & WhatsApp Comercial
 * (Com Endurecimento de Segurança e Proteção Anti-Bot)
 */

// Configurações globais imutáveis protegidas contra substituição em memória
const APP_CONFIG = Object.freeze({
  WHATSAPP_PHONE: '5516997195489',
  ATIVO_NOME: 'Distrito Araraquara (Araraquara/SP)',
  SUBMIT_DEBOUNCE_MS: 3000
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('b2b-form');
  const modal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const whatsappTestBtn = document.getElementById('whatsapp-test-btn');
  const phoneInput = document.getElementById('whatsapp');
  const backToTopBtn = document.getElementById('back-to-top');

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

  // 3. Submissão do Formulário B2B com Validação & Anti-Bot
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Checagem Anti-Bot Honeypot (campo invisível)
      const hpField = document.getElementById('b2b_website_hp');
      if (hpField && hpField.value.trim() !== '') {
        console.warn('[Segurança] Submissão automatizada bloqueada via Honeypot.');
        return;
      }

      // Prevenção de envios duplos acidentais (Debounce)
      const submitBtn = form.querySelector('.form-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.disabled = false;
        }, APP_CONFIG.SUBMIT_DEBOUNCE_MS);
      }

      const descInput = document.getElementById('descricao_evento');
      const formData = {
        ativo: APP_CONFIG.ATIVO_NOME,
        nome: document.getElementById('nome').value.trim(),
        empresa: document.getElementById('empresa').value.trim(),
        email: document.getElementById('email').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        tipoEvento: document.getElementById('tipo_evento').value,
        dataPrevista: document.getElementById('data_prevista').value,
        publicoEstimado: document.getElementById('publico_estimado').value,
        descricaoEvento: descInput ? descInput.value.trim() : '',
        timestamp: new Date().toISOString()
      };

      lastSubmittedData = formData;

      // Integrador preparado para Salesforce / Backend Proxy Seguro
      sendToSalesforce(formData);

      // Abre Modal de Confirmação
      if (modal) {
        modal.classList.add('active');
      }

      form.reset();
    });
  }

  // 4. Fechar Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  // 5. Envio Amigável e Cordial para o WhatsApp Comercial (+55 16 99719-5489)
  if (whatsappTestBtn) {
    whatsappTestBtn.addEventListener('click', () => {
      if (!lastSubmittedData) return;

      const phone = APP_CONFIG.WHATSAPP_PHONE;
      let text = `Olá! Gostaria de mais informações comerciais e consultar disponibilidade de datas para realizar um evento no *Distrito Araraquara*.%0A%0A` +
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

/**
 * Função de integração preparada para o Salesforce (via Proxy de Backend Seguro)
 * Chaves e segredos de API permanecem exclusivamente no lado do servidor.
 * @param {Object} data Dados capturados no formulário B2B
 */
function sendToSalesforce(data) {
  console.log('[Salesforce Integration Hook - Secure Proxy Target]:', data);
}
