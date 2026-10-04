# Continuidade — LP Distrito Araraquara

Atualizado em 04/10/2026. Melhorias em `improvements/arena-commercial-flow`, sem alterar `master` ou produção. A base preservada é `4b72d24792b8e27285d48b199d303a8f343ecdd1`.

## Implementação

HTML/CSS/JS mantidos. `script.js` agora é módulo. `shared/leads.js` é o contrato compartilhado com a Arena (copiado, manter sincronizado ao evoluir). Não expõe segredos. `server/leads.mjs` exige webhook HTTPS com token de ambiente e confirmação de recebimento; `api/leads.js` valida origem, tamanho e campos. `server/rate-limit.mjs` usa Neon para limites duráveis por IP/global. Sem receptor/banco, falha explicitamente; não há modal de sucesso nem conversão fictícia.

O formulário tem local de interesse independente do público, mantém preenchimento em falha e dispara `generate_lead` apenas após protocolo recebido. Não repassar nome/email/WhatsApp ao dataLayer. `requestId` permanece no retry do mesmo conteúdo; receptor deve garantir idempotência. WhatsApp é escolha do visitante. Diálogo usa foco/modal nativos; refinamentos de teclado/redução de movimento e mobile aplicados.

`commercial-config.js`: definir `privacyPolicyUrl` com a política oficial HTTPS antes da publicação. A finalidade do contato está visível. A URL está vazia porque a política oficial ainda não foi fornecida; não inventar documentos jurídicos.

## Preparação e verificações

- `npm install --ignore-scripts`; `npm test`.
- Configurar `DATABASE_URL`, `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` na Vercel por ambiente, nunca no cliente/Git.
- Inicializar limites usando `npm run storage:setup` no banco correto. Script idempotente; NÃO foi executado em serviço real.
- Webhook deve persistir o contato no Salesforce e retornar `{ "received": true, "leadId": "protocolo" }`, respeitando `Idempotency-Key` e limites adicionais do receptor.
- Criar/mapear novos campos e conferir a chave primária no Salesforce antes de publicar. O sistema anterior usava EmailAddress como chave; considerar RequestId para preservar consultas diferentes do mesmo contato, sem migrar/apagar a base existente sem plano.
- Manter Preview separado de Production e testar falha/sucesso/duplicação/origem/campanha após conexão real.

Seis testes passaram localmente. UI validada em 320/390px; formulário verificado contra receptor LOCAL SIMULADO: erro preserva dados; sucesso abre diálogo visível com protocolo e foco, e fechar devolve foco. Nenhum lead real foi enviado. SQL durável tem código e tratamento fail-closed; o teste com adaptador externo simulado NÃO comprova integração real Neon.

Seis fotos WebP geradas com originais preservados: 6.933.032 bytes → 1.860.334 bytes. `media-optimization.json` registra os caminhos e pesos. Sem medição de PageSpeed/Core Web Vitals real.

## Backup / recuperação

Histórico completo preservado em mirror/bundle e arquivos em ZIP privado no projeto Arena; `master` e produção continuam com a integração antiga. No histórico, selecionar o commit base acima permite recuperar todos os arquivos/integradores antigos. O backup não inclui leads/configurações secretas do Salesforce ou GTM. `UPDATES.md` registra histórico legado; o desenho atual é este documento.

## Publicação pendente

Não mergear/deployar esta branch antes de configurar receptor, limites, política e confirmar um lead controlado no Salesforce. No Preview, inspecionar GTM/Ads para evitar duplicação entre conversão web e CRM. Nenhum secret/serviço/deployment foi criado nesta etapa.

PR de rascunho: https://github.com/rubinsoueu/facaseuevento-distritoararaquara/pull/2 . Não mergeado.
