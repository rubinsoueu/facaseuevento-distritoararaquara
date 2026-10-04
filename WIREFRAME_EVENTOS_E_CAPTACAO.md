# Wireframe aprovado — eventos, assistentes e captação

04/10/2026. Criado antes das alterações funcionais desta etapa. Base: plano aprovado no chat. Produção da LP e Salesforce permanecem na versão atual até validação.

## Partida e evento / Dia de jogo

```text
PARTIDA E EVENTO                         [Preencher com IA]
Tipo: [Partida | Show / festa / outro evento]
Situação: [Agendado | Ao vivo | Encerrado | Cancelado | Adiado]
Partida: competição, equipes, escudos, placar
Evento: título, categoria, descrição, atrações, organizador, imagem
Para ambos: data, local, ingressos, abertura, avisos, fontes
[Conferir fatos] [Adicionar / atualizar na agenda]
```

Campos de futebol são recolhidos em eventos. Informações operacionais só são preenchidas quando confirmadas pelo organizador. Arena e Esplanada são locais diferentes. Cadastro da agenda pode alimentar o destaque sem duplicar a edição.

## IA e fontes

```text
[Preencher com IA] → tarefa contextual e áreas pré-selecionadas
1. Descreva o que precisa / escolha um exemplo
2. [Enviar para IA]     [Usar uma LLM externa]
3. Fontes / pendências / comparação → [Aplicar ao rascunho]
4. Publicação explícita
```

Fontes HTTPS, função editorial e confirmação humana são registradas. O radar verifica estrutura, confirmação e adequação do domínio conhecido; não atesta sozinho a veracidade de uma página. Nenhuma URL configurada vira proxy de rede arbitrário.

## Biblioteca

`Todas | Escudos | Notícias | Eventos | Arena | Produtos | Logos | Outras` + busca. Upload recebe categoria; imagens existentes são classificadas pelo diretório. Sem excluir originais.

## Público

- Agenda: cartões mais espaçosos, título/dados em linhas reservadas e ações alinhadas na base. Link para detalhes permanentes.
- Minha visita: explicação inicial, escolha do evento e ficha de acesso, mapa, calendário e orientações; ausência de dado é explícita.
- Realize seu evento: consulta comercial, sem promessa de reserva; local Arena fixo e visível.
- Memória da Fonte: acervo editorial opcional, editável e com indicação de fonte.

## Formulários comerciais

```text
LP DISTRITO: Local [espaços | Preciso de orientação]
ARENA:       Local: Arena Fonte Luminosa (fixo)
Contato / empresa / email / WhatsApp
Tipo / público / data ou período / necessidades
Finalidade do contato + política de privacidade configurável
[Consultar disponibilidade]
Enviando → recebido com protocolo OU falha (campos preservados)
```

Campanha, origem e local são campos separados. Conversão concluída só após reconhecimento do receptor; WhatsApp é uma alternativa escolhida pelo visitante.

## Limite da etapa

Preparar código e testes sem enviar leads reais nem alterar a LP publicada. A integração nova ficará indisponível de forma explícita até conectar o receptor confirmado e criar/mapear os campos do Salesforce na próxima etapa.
