# Backlog do Produto

> Fonte: [[Cérebro do Projeto — SIGLO]] · Versão 0.3 (2026-10-14) — **Front-end First** ([[ADR-0005 — Front-end First]]).
> Prioridade: **P0** bloqueia o sprint · **P1** importante · **P2** pode deslizar.
> Público: 🧒 criança · 🧑 cuidador/adulto · 👥 ambos.

## Sprint 00 — Fundações ✅

| ID | História | Pri. |
|---|---|---|
| F-1 | Como dev, quero o monorepo estruturado por módulos de domínio | P0 |
| F-2 | Como arquiteto, quero ADRs 0001–0004 registrados | P0 |
| F-3 | Como dev, quero CI com lint, testes e SAST desde o dia 1 | P0 |
| F-4 | Como dev, quero ambiente local dockerizado (PostgreSQL, Redis, MinIO) | P0 |
| F-5 | Como designer/dev, quero os tokens do design system em `packages/ui` | P0 |
| F-6 | Como DPO, quero o rascunho do inventário de dados LGPD | P0 |

# Fase 1 — Front-end do Portal

## Sprint 01 — Fundação Front-end e Design System

| ID | História | Pri. |
|---|---|---|
| FE-01 | Como dev, quero `apps/web` em Next.js + TypeScript + Tailwind v4 rodando no workspace npm | P0 |
| FE-02 | Como designer, quero os tokens "Acolher" (cores, fontes, raios, sombras) com contraste AA documentado | P0 |
| FE-03 | Como dev, quero componentes base React em `@siglo/ui` (botão, card, chip, badge, campos, lista, modal, estados) | P0 |
| FE-04 | Como dev, quero componentes de saúde (seletor de humor, escala de dor, gráfico, calendário, progresso) | P0 |
| FE-05 | Como dev, quero a camada de dados mock tipada (`lib/types`, `lib/data`, `mocks/`) | P0 |
| FE-06 | Como time, quero uma vitrine do design system para revisar visualmente os componentes | P1 |

## Sprint 02 — Shell, Boas-vindas e Perfis

| ID | História | Pri. |
|---|---|---|
| FE-07 | 👥 Como novo usuário, quero um onboarding ilustrado em 3 passos | P0 |
| FE-08 | 🧑 Como cuidador, quero entrar (login simulado) | P0 |
| FE-09 | 🧑 Como cuidador, quero escolher a criança acompanhada e o modo (Criança/Cuidador) | P0 |
| FE-10 | 👥 Como usuário, quero navegação inferior (mobile) / lateral (desktop) com no máximo 5 itens | P0 |
| FE-11 | 👥 Como usuário, quero um botão SOS sempre visível com contatos da equipe | P0 |
| FE-12 | 👥 Como usuário, quero ajustar tamanho do texto e reduzir animações | P1 |

## Sprint 03 — Meu Dia

| ID | História | Pri. |
|---|---|---|
| FE-13 | 🧒 Como criança, quero dizer como me sinto tocando em um rosto com emoji e texto | P0 |
| FE-14 | 🧒 Como criança, quero mostrar onde dói tocando no corpo e escolher a intensidade | P0 |
| FE-15 | 🧑 Como cuidador, quero registrar sintomas, temperatura e sono | P0 |
| FE-16 | 👥 Como usuário, quero gravar por voz (simulado) em vez de escrever | P1 |
| FE-17 | 👥 Como usuário, quero ver o resumo do dia (próxima dose, próximo compromisso) | P0 |

## Sprint 04 — Remédios e Agenda

| ID | História | Pri. |
|---|---|---|
| FE-18 | 👥 Como usuário, quero ver a próxima dose com instrução simples e marcar "já tomei" | P0 |
| FE-19 | 🧑 Como cuidador, quero a lista de remédios do dia com status (tomado/pendente/atrasado) | P0 |
| FE-20 | 👥 Como usuário, quero um calendário mensal com consultas, exames e quimioterapias | P0 |
| FE-21 | 🧒 Como criança, quero acompanhar hábitos (água, caminhada, sono) de forma lúdica | P1 |
| FE-22 | 🧑 Como cuidador, quero adiar um lembrete ("lembrar em 15 min") | P2 |

## Sprint 05 — Alimentação e Aprender

| ID | História | Pri. |
|---|---|---|
| FE-23 | 👥 Como usuário, quero registrar quanto consegui comer, sem culpa | P0 |
| FE-24 | 🧑 Como cuidador, quero ver refeições sugeridas para a fase do tratamento | P1 |
| FE-25 | 👥 Como usuário, quero dicas rápidas para boca diferente (gosto metálico, enjoo) | P0 |
| FE-26 | 👥 Como usuário, quero pílulas de conhecimento (vídeos curtos) por tema e idade | P1 |

## Sprint 06 — Exames e Evolução

| ID | História | Pri. |
|---|---|---|
| FE-27 | 🧑 Como cuidador, quero ver exames agendados com preparo | P0 |
| FE-28 | 🧑 Como cuidador, quero ver resultados liberados com explicação em linguagem simples | P0 |
| FE-29 | 👥 Como usuário, quero gráficos de peso e altura ao longo do tratamento | P1 |
| FE-30 | 🧒 Como criança, quero ver minha jornada de tratamento como um caminho de conquistas | P1 |
| FE-31 | 🧑 Como cuidador, quero que detalhes clínicos apareçam apenas no Modo Cuidador | P0 |

## Sprint 07 — Família e Equipe

| ID | História | Pri. |
|---|---|---|
| FE-32 | 👥 Como família, quero enviar e receber mensagens de carinho | P0 |
| FE-33 | 🧑 Como cuidador, quero ver a equipe de cuidado e contatá-la | P0 |
| FE-34 | 🧑 Como cuidador, quero ver a linha do tempo de eventos (check-ins, doses, refeições) | P1 |
| FE-35 | 🧑 Como cuidador, quero gerenciar quem da família tem acesso (visual, mock) | P1 |
| FE-36 | 👥 Como usuário, quero uma tela de perfil, privacidade e acessibilidade | P0 |

## Sprint 08 — Qualidade e Entrega do Front-end

| ID | História | Pri. |
|---|---|---|
| FE-37 | Como usuário, quero estados de carregando, vazio e erro claros em todas as telas | P0 |
| FE-38 | Como usuário, quero o portal responsivo (celular, tablet, desktop) | P0 |
| FE-39 | Como time, quero E2E (Playwright + axe) das jornadas críticas no CI | P0 |
| FE-40 | Como time, quero auditoria WCAG 2.1 AA de todas as telas | P0 |
| FE-41 | Como time, quero teste de usabilidade com 5 famílias e baseline SUS | P1 |
| FE-42 | Como time, quero documentação de [[Arquitetura Frontend]] e guia de integração para a Fase 2 | P0 |

# Fase 1B — Front-end do Portal do Médico / Equipe Multidisciplinar

> Mesma regra da Fase 1: **somente UI + mocks**. Público: 🩺 médico · 👩‍⚕️ enfermagem/nutrição.

## Sprint 09 — Shell Médico e Triagem

| ID | História | Pri. |
|---|---|---|
| MD-01 | 🩺 Como médico, quero um shell próprio (`/medico`) com menu lateral e identificação do perfil | P0 |
| MD-02 | 👥 Como usuário de demonstração, quero alternar entre Portal do Paciente e Portal do Médico | P0 |
| MD-03 | 🩺 Como médico, quero ver a lista de pacientes monitorados ordenada por criticidade (crítico › atenção › estável) | P0 |
| MD-04 | 🩺 Como médico, quero indicadores do dia (críticos, em atenção, check-ins pendentes, adesão média) | P0 |
| MD-05 | 🩺 Como médico, quero filtrar por busca, leito, tratamento e criticidade | P0 |
| MD-06 | 🩺 Como médico, quero ver o motivo do alerta (febre, pico de dor, dose atrasada) direto na linha do paciente | P0 |
| MD-07 | Como dev, quero componentes `@siglo/ui` clínicos reutilizáveis (`SeverityBadge`, `LineChart`, `Tabs`, `Select`) | P0 |

## Sprint 10 — Visão 360 do Paciente

| ID | História | Pri. |
|---|---|---|
| MD-08 | 🩺 Como médico, quero o resumo clínico do paciente (diagnóstico, ciclo, responsável, alertas ativos) | P0 |
| MD-09 | 🩺 Como médico, quero curvas de peso e altura ao longo do tratamento | P0 |
| MD-10 | 🩺 Como médico, quero o histórico de humor, dor e temperatura reportados pela família | P0 |
| MD-11 | 🩺 Como médico, quero a adesão aos medicamentos (tomadas × previstas) por dia | P0 |
| MD-12 | 🩺 Como médico, quero a linha do tempo de intercorrências com gravidade | P1 |
| MD-13 | 🩺 Como médico, quero atalhos para prescrever e para falar com o cuidador a partir do paciente | P1 |

## Sprint 11 — Prescrição e Rotina

| ID | História | Pri. |
|---|---|---|
| MD-14 | 🩺 Como médico, quero cadastrar um medicamento (nome, dose, horário, instruções) para um paciente | P0 |
| MD-15 | 🩺 Como médico, quero ajustar dose/horário e suspender um medicamento com confirmação | P0 |
| MD-16 | 🩺 Como médico, quero que a prescrição apareça em `/remedios` do paciente | P0 |
| MD-17 | 👩‍⚕️ Como nutricionista, quero registrar recomendações nutricionais que aparecem em `/nutricao` | P0 |
| MD-18 | 🩺 Como médico, quero ver o histórico de alterações da prescrição | P1 |

## Sprint 12 — Comunicação e Entrega Front-end Médico

| ID | História | Pri. |
|---|---|---|
| MD-19 | 🩺 Como médico, quero enviar orientações clínicas a um cuidador (com prioridade normal/urgente) | P0 |
| MD-20 | 👩‍⚕️ Como enfermagem, quero responder recados dos cuidadores | P0 |
| MD-21 | 👥 Como cuidador, quero ver as orientações da equipe em `/familia` | P0 |
| MD-22 | Como usuário, quero estados de carregando, vazio e erro nas telas médicas | P0 |
| MD-23 | Como time, quero `ui:typecheck`, `ui:test` e `build` verdes e revisão WCAG 2.1 AA do portal médico | P0 |

# Fase 2 — Back-end (fase futura)

| Sprint | Histórias herdadas do plano v0.2 |
|---|---|
| B1 | I-1 OIDC (Keycloak) · I-2 RBAC · I-3 auditoria v1 · I-4 shell autenticado real · I-5 MFA |
| B2 | P-1 cadastro · P-2 busca · P-3 consentimentos · P-4 vínculo cuidador · P-5 PII mascarada em logs |
| B3 | E-1 catálogo · E-2 ordem de serviço · E-3 status · E-4 protótipo com técnico |
| B4 | R-1 QR/código de barras · R-2 histórico da amostra · R-3 anexos S3 · R-4 spike HL7/FHIR |
| B5 | L-1 templates · L-2 editor estruturado · L-3 dupla revisão |
| B6 | L-4 versionamento · L-5 assinatura · L-6 notificação de laudo · L-7 trilha/retenção |
| B7 | Integração do portal: substituir `lib/data` mock por API |
| B8 | B-1 modelo estrela + ETL + dashboards |
| B9 | S-1 pentest/RIPD/incidentes/DR · G-1 UAT e go-live |
