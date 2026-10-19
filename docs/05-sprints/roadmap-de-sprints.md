# Roadmap de Sprints

> Fonte: [[Cérebro do Projeto — SIGLO]] §5 · Decisão: [[ADR-0005 — Front-end First]] · Atualizado: 2026-10-14

## Recorte

- **Fase 1 — Front-end (Sprints 01 → 08):** Portal do Paciente/Cuidador 100% finalizado no front-end, com mocks.
- **Fase 1B — Front-end (Sprints 09 → 12):** Portal do Médico / Equipe Multidisciplinar (`/medico/*`), com mocks.
- **Fase 2 — Back-end e integração (B1 → B9):** tudo que envolve servidor, banco, IdP, integrações e BI.

**O front-end está "finalizado" quando o Sprint 12 fechar** com: todas as rotas do §2.1 do cérebro
implementadas (paciente + médico), estados loading/vazio/erro, WCAG 2.1 AA verificado, E2E das jornadas críticas verde e
teste de usabilidade com famílias e equipe clínica realizado.

## Etapas padrão (rastreabilidade)

Toda entrega é identificada como `📍 Sprint XX · Etapa XX.N — nome`.

| Etapa | Nome | O que acontece |
|---|---|---|
| XX.1 | Refinamento | Histórias, critérios de aceite, ajustes no cérebro/backlog |
| XX.2 | Implementação | Componentes `@siglo/ui`, telas `apps/web`, mocks |
| XX.3 | QA & Acessibilidade | Lint, typecheck, testes, contraste, teclado, leitor de tela |
| XX.4 | Review & Documentação | Demo, status no cérebro e no doc do sprint |

## Fase 1 — Front-end

| Sprint | Nome | Histórias (backlog) | Status |
|---|---|---|---|
| 00 | Fundações | F-1…F-6 | ✅ concluído |
| 01 | Fundação Front-end e Design System | FE-01…FE-06 | ✅ concluído |
| 02 | Shell, Boas-vindas e Perfis | FE-07…FE-12 | 🔴 |
| 03 | Meu Dia | FE-13…FE-17 | 🔴 |
| 04 | Remédios e Agenda | FE-18…FE-22 | 🔴 |
| 05 | Alimentação e Aprender | FE-23…FE-26 | 🔴 |
| 06 | Exames e Evolução | FE-27…FE-31 | 🔴 |
| 07 | Família e Equipe | FE-32…FE-36 | 🔴 |
| 08 | Qualidade e Entrega do Front-end | FE-37…FE-42 | 🔴 |

> **Nota de status (2026-10-19):** as 5 telas principais do portal (Meu Dia, Remédios, Nutrição, Família, Clínico) foram entregues na Etapa 01.2. Itens ainda **pendentes** dos Sprints 02–08: onboarding/login simulado, `/exames`, `/perfil`, E2E Playwright+axe e teste de usabilidade. Os sprints permanecem abertos até concluir esses itens.

## Fase 1B — Front-end do Portal do Médico / Equipe

| Sprint | Nome | Histórias (backlog) | Status |
|---|---|---|---|
| 09 | Shell Médico e Triagem | MD-01…MD-07 | ✅ implementado (telas + mocks) |
| 10 | Visão 360 do Paciente | MD-08…MD-13 | ✅ implementado (telas + mocks) |
| 11 | Prescrição e Rotina | MD-14…MD-18 | ✅ implementado (telas + mocks) |
| 12 | Comunicação e Entrega Front-end Médico | MD-19…MD-23 | ✅ implementado (telas + mocks) |

> **Nota de status (2026-10-19):** Todas as rotas do Portal do Médico (`/medico`, `/medico/pacientes/[id]`, `/medico/prescricao`, `/medico/comunicacao`) foram implementadas, integradas bidirecionalmente com os dados do paciente (`/remedios`, `/nutricao`, `/familia`), validadas com testes unitários no `@siglo/ui` e build de produção do `@siglo/web` sem erros.

## Fase 2 — Back-end (fase futura)

| Sprint | Foco | Origem v0.2 |
|---|---|---|
| B1 | Identidade e Acesso (Keycloak/RBAC/auditoria) | S01 |
| B2 | Pacientes + OpenAPI derivado de `apps/web/src/lib/types.ts` | S02 |
| B3 | Exames: fluxo | S03 |
| B4 | Rastreabilidade | S04 |
| B5 | Laudos: emissão (+ telas internas do laboratório) | S05 |
| B6 | Laudos: liberação + Notificações — MVP clínico | S06 |
| B7 | Integração Portal ↔ API | S07 |
| B8 | BI | S08 |
| B9 | Hardening LGPD + UAT e Go-live | S09–S10 |
