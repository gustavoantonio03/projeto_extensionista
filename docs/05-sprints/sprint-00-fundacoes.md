# Sprint 00 — Fundações

> Semana 0 · Status: **em andamento** · Fonte: [[Cérebro do Projeto — SIGLO]] · Roadmap: [[Roadmap de Sprints]]

## Objetivo

Preparar as fundações do monorepo SIGLO para que **todo sprint seguinte nasça com qualidade embutida**:
monorepo estruturado, CI/CD com lint + testes + SAST ativos desde o dia 1, ambientes locais
dockerizados, ADRs 0001–0004 registrados, backlog inicial priorizado e tokens do design system
[[Design System — Serene Clinical Humanism]] extraídos para `packages/ui`.

## Escopo

| # | Entrega | Referência |
|---|---|---|
| 1 | Estrutura do monorepo (`apps/web`, `services/core`, `services/bi`, `packages/*`, `infra/`) | [[#arquitetura do cérebro]] |
| 2 | CI: lint + testes + SAST (Semgrep) + auditoria de dependências | [[CI/CD]] · [[Gates de Qualidade]] |
| 3 | Ambiente local: docker-compose (PostgreSQL 16, Redis, MinIO) + migrações | [[Ambientes e Infraestrutura]] |
| 4 | ADRs 0001–0004 | [[Decisões de Arquitetura (ADRs)]] |
| 5 | Backlog inicial priorizado (P0–P2, sprints 0–6) | [[Backlog do Produto]] |
| 6 | Tokens do design system em `packages/ui` | [[Design System — Serene Clinical Humanism]] |
| 7 | Rascunho do [[Inventário de Dados (LGPD)]] | [[#7 do cérebro]] |

## Fora de escopo

- Implementação de domínio (pacientes/exames/laudos) — sprints 02–06.
- Keycloak e fluxos de login — sprint 01.
- BI/ETL — sprint 08.

## DoD

- [x] Monorepo criado conforme estrutura-alvo do cérebro.
- [x] Pipeline com lint + testes + SAST rodando desde o primeiro commit.
- [x] `docker compose up` sobe banco com schemas por módulo criados.
- [x] 4 ADRs registrados e revisados.
- [x] Backlog inicial priorizado.
- [x] Tokens de cor, tipografia, espaçamento, raio e sombra extraídos para `packages/ui`.
- [x] Inventário de dados (rascunho) com entidades sensíveis mapeadas.

## Definição de "pronto" compartilhada

Seguir [[Definição de Pronto (DoD)]]: build verde, revisão aprovada, documentação atualizada e
sem regressão de acessibilidade nas telas existentes.
