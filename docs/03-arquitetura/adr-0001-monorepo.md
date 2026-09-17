# ADR-0001 — Monorepo com fronteiras por módulo de domínio

- **Status:** Aceito
- **Data:** 2026-09-17
- **Decisores:** Arquitetura SIGLO
- **Relacionados:** [[Cérebro do Projeto — SIGLO]] §3.4 · ADR-0002 · ADR-0003

## Contexto

O sistema envolve múltiplos módulos de domínio (pacientes, exames, laudos, BI, IAM) e um
frontend único. Precisamos decidir a topologia do código: monorepo único vs. múltiplos
repositórios por serviço.

## Opções consideradas

1. **Multirepo** (um repositório por serviço) — isolamento máximo, porém custo alto de
   versionamento de contratos, CI duplicado e dependências entre repos difíceis de sincronizar
   para um time pequeno.
2. **Monorepo com fronteiras por módulo** — um só repositório com `apps/`, `services/`,
   `packages/` e `infra/`, fronteiras rígidas por módulo de domínio.

## Decisão

Adotar **monorepo** com a estrutura-alvo do cérebro:

```text
apps/web · services/core (Go) · services/bi (Python) · packages/contracts · packages/ui · infra/
```

Regra de ouro: módulos comunicam-se por **contratos explícitos** (OpenAPI em
`packages/contracts`) e eventos de domínio — nunca por acesso direto ao schema do vizinho.

## Consequências

- ✅ Refactors de contrato atômicos; CI unificado; onboarding simples.
- ✅ Fronteiras de domínio continuam explícitas (schemas por módulo no PostgreSQL).
- ⚠️ Requer donos de módulo e lint de fronteiras para evitar acoplamento acidental.
- ➡️ Extração para microserviços só quando houver dor real (a documentar em novo ADR).
