# ADR-0005 — Front-end First (Portal do Paciente/Cuidador)

- **Status:** Aceito
- **Data:** 2026-10-14
- **Relacionados:** [[Cérebro do Projeto — SIGLO]] §3.1 e §5 · [[Roadmap de Sprints]] · ADR-0001 · ADR-0004

## Contexto

O produto em foco passou a ser o **Portal do Paciente/Cuidador (OncoVida)**, usado por **crianças em
tratamento** e por **adultos/cuidadores**. Há alta incerteza de UX (dois públicos muito diferentes) e
baixa incerteza técnica de back-end. Investir primeiro em APIs, banco e IdP atrasaria a validação das
jornadas com as famílias.

## Opções consideradas

1. **Back-end primeiro (plano v0.2)** — portal só no Sprint 07; risco de construir APIs para jornadas não validadas.
2. **Fatias verticais (front + back por feature)** — mais realista em produção, mas desacelera a validação de UX.
3. **Front-end First com mocks tipados** — UI completa e testável com famílias; back-end implementa contratos já validados.

## Decisão

Adotar **Front-end First** (opção 3):

- Fase 1 (Sprints 01–08): somente `apps/web` + `packages/ui`. **Sem** lógica de servidor, banco ou integração real.
- Dados vêm de fixtures estáticas em `apps/web/src/mocks`, acessadas **apenas** via `apps/web/src/lib/data`
  (funções assíncronas com latência simulada), com tipos em `apps/web/src/lib/types.ts`.
- Sessão/login **simulados** (estado local), atrás de uma interface substituível pelo OIDC do ADR-0004.
- Preferências do usuário (modo Criança/Cuidador, tamanho de texto) ficam em `localStorage` — nunca dados clínicos reais.
- Fase 2 (B1–B9): os tipos viram rascunho do OpenAPI em `packages/contracts`; `lib/data` passa a chamar a API.

## Consequências

- ✅ Jornadas validadas com usuários reais antes de qualquer custo de back-end.
- ✅ Telas não mudam na integração: só a implementação de `lib/data`.
- ⚠️ Risco de divergência mock × contrato real — mitigado por tipos centralizados e revisão em B2.
- ⚠️ ADR-0004 (Keycloak) continua válido, com implementação adiada para B1.
