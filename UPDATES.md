# Updates & Registro de Desenvolvimento - Distrito Araraquara

## [2026-08-11] - Tags de Rastreamento de Tráfego Pago (Google Tag Manager GTM-MT96ZDVS)
- **Instalação do GTM no `<head>`**: Inserido o script principal do Google Tag Manager (`GTM-MT96ZDVS`) no topo da seção `<head>` do `index.html`.
- **Fallback `<noscript>` no `<body>`**: Inserido o iframe de suporte `<noscript>` imediatamente após a abertura do `<body>`.
- **Evento de Conversão no `dataLayer`**: Configurado o disparo automático do evento `generate_lead` na camada de dados (`window.dataLayer.push()`) na submissão do formulário B2B para fácil integração com o Google Ads, Meta Ads (Facebook/Instagram), TikTok Ads e LinkedIn Ads.

## [2026-08-11] - Correção do Carregamento do Logo Mobile em Produção (Vercel)
- **Causa Raiz**: O diretório `assets/Logo/` estava configurado no `.vercelignore` para ignorar arquivos de design pesados (`.ai` e `.pdf`). Como o logo do header mobile apontava para `assets/Logo/Png/1.png`, a Vercel ignorava a pasta inteira e o navegador exibia o ícone de imagem quebrada com texto alt no celular.
- **Solução Definitiva**: Copiada a imagem do logo mobile para o diretório de publicação oficial em `assets/Logos/Logo_Mobile_Branco.png` e atualizada a tag `<source srcset="...">` no `index.html`. O logo mobile agora é publicado corretamente em produção sem conflitos com regras do `.vercelignore`.

## [2026-08-10] - Repositório GitHub & Implantação de Produção na Vercel
- **Repositório GitHub**: Criado e sincronizado o repositório público [`rubinsoueu/facaseuevento-distritoararaquara`](https://github.com/rubinsoueu/facaseuevento-distritoararaquara).
- **Publicação na Vercel**: Implantação de produção realizada com sucesso no endereço oficial:
  👉 **[https://facaseuevento-distritoararaquara.vercel.app](https://facaseuevento-distritoararaquara.vercel.app)**
- **Otimização de Arquivos**: Adicionados arquivos `.gitignore` e `.vercelignore` excluindo arquivos pesados de edição (`.ai` e imagens brutas não utilizadas) para manter o deploy leve, ultrarrápido e otimizado.

## [2026-08-10] - Implementação de Segurança & Endurecimento do Código (Security Hardening)
- **Proteção Anti-Bot (Honeypot)**: Inserido campo invisível de verificação (`#b2b_website_hp`) no formulário B2B para identificar e descartar envios automatizados por robôs de spam.
- **Congelamento de Configurações (`Object.freeze`)**: Objeto `APP_CONFIG` imutável no `script.js` impedindo substituição em memória do número do WhatsApp (`5516997195489`) por extensões de terceiros.
- **Limites de Caracteres (`maxlength`)**: Atributos de segurança adicionados em todos os campos (`nome: 100`, `empresa: 100`, `email: 120`, `whatsapp: 20`, `data_prevista: 50`, `descricao_evento: 500`) evitando estouros de buffer.
- **Proteção Contra Cliques Duplos (Debounce)**: Botão de submissão temporariamente desabilitado por 3 segundos após o envio para evitar disparos duplicados acidentais.
- **Padrão de Proxy Backend**: Gancho `sendToSalesforce()` estruturado para comunicação por backend proxy, eliminando exposição de chaves privadas no código do cliente.

## [2026-08-10] - Alinhamento Superior dos Títulos do Rodapé ("Canais Oficiais" e "Endereço")
- **Alinhamento dos Títulos no Topo (PC)**: Atualizadas as colunas do rodapé no PC com `align-items: flex-start` e `margin-top: 2.2rem` em `.footer-col`. Os títulos *"CANAIS OFICIAIS"* e *"ENDEREÇO"* agora iniciam exatamente na mesma linha do topo, perfeitamente alinhados entre si e paralelos ao início do parágrafo de texto abaixo do logo.
- **Mobile Reset**: Mantido `margin-top: 0` no celular para empilhamento limpo.

## [2026-08-10] - Alinhamento Vertical das Colunas do Rodapé no PC
- **Alinhamento Inferior das Colunas no Rodapé (PC)**: Configurado `align-items: flex-end` na `.footer-grid` do computador. Os blocos *"CANAIS OFICIAIS"* e *"ENDEREÇO"* agora descem perfeitamente alinhados na base inferior com o texto descritivo abaixo do logo, exatamente como demarcado na referência visual.
- **Mobile Mantido**: Resetado o alinhamento nas telas menores (`@media (max-width: 992px)`) para empilhamento limpo sem distorção.

## [2026-08-10] - Ampliação de Logos na Versão PC
- **Logo do Header Ampliado (PC)**: Aumentada a altura do logo do topo de `60px` para `85px` no computador, proporcionando maior presença e legibilidade à marca oficial.
- **Logo do Rodapé Ampliado (PC)**: Aumentada a altura do logo do rodapé de `70px` para `95px` no computador, atingindo a proporção imponente do site oficial de referência.

## [2026-08-10] - Gradiente Horizontal no Hero (Esquerda para Direita)
- **Filtro Fotográfico do Hero**: Atualizada a camada `.hero-bg-overlay` no PC para um gradiente horizontal em 90 graus (`linear-gradient(90deg, ...)`).
- **Legibilidade & Contraste**: O lado esquerdo inicia com alta opacidade (escura), garantindo 100% de leitura para os textos brancos e botões, enquanto transiciona suavemente clareando até o lado direito (`15%` de opacidade), revelando a foto aérea da Arena e do complexo com alta vivacidade.

## [2026-08-10] - Adição do Campo Opcional "Resumo ou Descrição do Evento" no Formulário B2B
- **Novo Campo no Formulário**: Adicionado o campo `<textarea>` com 3 linhas para **Resumo ou Descrição do Evento (Opcional)** (`#descricao_evento`) em largura total (`full width`), posicionado entre o campo *"Data Prevista"* e o botão *"Solicitar Orçamento Comercial"*.
- **Placeholder**: Configurado com o texto *"Conte brevemente sobre o formato, necessidades técnicas ou atrações do evento..."*.
- **Integração no WhatsApp**: Atualizado o gerador de mensagem do WhatsApp para incluir automaticamente o parâmetro `• Descrição/Obs: [Texto digitado]` sempre que o usuário preencher este campo.
- **Integração Salesforce**: O campo `descricaoEvento` foi mapeado no payload capturado pela função `sendToSalesforce()`.

## [2026-08-10] - Reestruturação da Galeria: 5 Cards Idênticos em 1 Linha no PC
- **Layout de 5 Colunas Única Linha no PC**: Atualizada a `.gallery-grid` no computador para `grid-template-columns: repeat(5, 1fr)`. Todos os 5 equipamentos (Arena Fonte Luminosa, Ginásio Gigantão, Pavilhão de Feiras, Centro de Convenções e Esplanada de Eventos) agora estão alinhados lado a lado em **uma única linha horizontal idêntica e simétrica**.
- **Enquadramento da Esplanada**: Aplicada a altura uniforme em todas as 5 caixas de imagem (`200px`) com a imagem da Esplanada ajustada para `object-position: center bottom` no PC, exibindo com nitidez o palco, os painéis do evento e a multidão do meio para baixo.
- **Mobile Preservado**: Mantido o empilhamento responsivo perfeito em 1 coluna no celular.

## [2026-08-10] - Harmonização Responsiva da Esplanada de Eventos
- **Quebra de Linha Mobile no Título da Esplanada**: Configurada a classe `.area-tag` com `display: block` nas telas mobile (`<= 600px`). O bloco `(+26.000 m²)` agora desce por inteiro para a segunda linha no celular, eliminando a quebra isolada do `m²)`.

## [2026-08-10] - Ajustes Finais de Rodapé
- **Logo do Rodapé Ampliado**: Aumentada a altura do logo do rodapé para `70px` para maior destaque e equilíbrio estético.
- **Remoção do Texto de Rodapé**: Removida a expressão *"Landing Page de Captação B2B."* dos direitos reservados no rodapé inferior.

## [2026-08-10] - Ajuste das Fotos do Centro de Convenções e Esplanada de Eventos
- **Centro de Convenções**: Convertida e aplicada a foto da fachada externa ([`Externo_centro_convencoes.jpg`](file:///D:/Trabalhando/Revee/Landing%20Pages%20para%20Tr%C3%A1fego-Oficial/02%20-%20Distrito%20Araraquara/assets/Imagens/Externo_centro_convencoes.jpg)) em formato web compatível.
- **Esplanada de Eventos**: Nome da seção atualizado para **"Esplanada de Eventos (+26.000 m²)"** e imagem atualizada para a foto panorâmica externa ([`Esplanada_outdoor_02.png`](file:///D:/Trabalhando/Revee/Landing%20Pages%20para%20Tr%C3%A1fego-Oficial/02%20-%20Distrito%20Araraquara/assets/Imagens/Esplanada_outdoor_02.png)).

## [2026-08-10] - Refinamentos de Galeria, Tagline Hero & Branding
- **Tagline Principal no Hero**: Substituídas as pílulas antigas pela tag limpa e destacada `O Maior Hub Multiuso do Interior Paulista` (padrão Geraldão).
- **Remoção do Filtro Verde do Header**: Fundo do Hero atualizado para um gradiente fotográfico escuro limpo/neutro sem película verde cobrindo a foto.
- **Logo Ampliado no PC**: Aumentada a altura da marca no desktop para `60px`, proporcionando maior imponência visual.
- **Logo Exclusivo no Mobile**: Header celular (`< 768px`) configurado para carregar exclusivamente a marca `assets/Logo/Png/1.png`.

## [2026-08-10] - Alinhamento Estratégico B2B (Agronegócio & Corporativo) & Padrão Visual Geraldão
- **Branding & Logos Oficiais**: Organizados os logos oficiais PNG em `assets/Logos/`. Aplicada a **Logo Horizontal Branca** no computador e a **Logo Vertical Branca** no mobile (`< 768px`), com link direto para o site oficial do ativo (`www.distritoararaquara.com.br`).
- **Formulário Segmentado (5 Públicos-Alvo)**: Atualizadas as opções do formulário para atender Feiras de Agronegócio/TecnoCampo, Shows Sertanejos/Festivais, Convenções Corporativas/RH, Simpósios Médicos/Acadêmicos, Ativações Outdoor na Esplanada e Eventos Esportivos no Gigantão/Arena.
- **Seletor de Data Flexível**: Adicionado o assistente de calendário com ícone clicável, mantendo a liberdade para o usuário digitar períodos livres (ex: *"Outubro/2026"*).
- **Galeria de Fotos dos Equipamentos**: Criada seção dedicada com fotos reais extraídas dos assets para a Arena Fonte Luminosa, Ginásio Gigantão, Pavilhão de Feiras, Centro de Convenções e Esplanada de Eventos (+26.000 m²).
- **Métricas em Linha Única**: Aplicação de `white-space: nowrap` para exibição em **linha única perfeita** nos números de métrica no PC.
- **WhatsApp Comercial Cordial**: Reformulada a mensagem disparada no botão do WhatsApp para uma linguagem de primeiro contato amigável, educada e natural.
- **Botão Voltar ao Topo**: Implementado botão flutuante minimalista no canto inferior direito com rolagem suave.

## [2026-08-07] - Inicialização da Landing Page B2B
- **Estrutura Base**: Criada a página HTML5 semântica isolada com 5 seções principais de alta conversão.
- **Design System**: Implementada a paleta oficial de cores sólidas do Distrito Araraquara (Fundo Verde Escuro `#092719`, Destaques Verde Vivo `#53AC2C`, Cards Cinza-Areia `#F4F1EB`) sem degradês.
- **Ficha Técnica & Métricas**: Cadastrados os 5 equipamentos principais (+300.000m² área total, Arena Fonte Luminosa com 20.205 lugares, Anfiteatro para 950 sentados, Pavilhão de Feiras, Gigantão para 5.000 pessoas e Esplanada Outdoor com +26.000m²).
- **Mídia Kit**: Configurado o download direto da Apresentação Comercial em PDF (`assets/Apresentação Comercial Distrito Araraquara.pdf`).
- **Formulário B2B & Salesforce**: Criada validação JS com modal de confirmação, gancho `sendToSalesforce()` preparado para integração por Webhook/API + disparo direto via WhatsApp Comercial (`+55 (16) 99719-5489`).
- **Otimização**: Carregamento ultra-rápido sem dependências externas pesadas (HTML/CSS/JS Vanilla puro).
