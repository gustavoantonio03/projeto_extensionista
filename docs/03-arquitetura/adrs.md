# Decisões de Arquitetura (ADRs)

> Índice de registros de decisão. Um ADR para toda decisão arquitetural ([[Cérebro do Projeto — SIGLO]] §4).

| # | Título | Status | Data |
|---|---|---|---|
| [ADR-0001](adr-0001-monorepo.md) | Monorepo com fronteiras por módulo de domínio | Aceito | 2026-09-17 |
| [ADR-0002](adr-0002-go-python.md) | Go (núcleo) + Python (dados/BI) | Aceito | 2026-09-17 |
| [ADR-0003](adr-0003-postgres-schemas.md) | PostgreSQL 16 com schemas por módulo | Aceito | 2026-09-17 |
| [ADR-0004](adr-0004-keycloak.md) | Keycloak como IdP (OIDC) | Aceito | 2026-09-17 |

## Processo

1. Proposta em PR com contexto, opções e consequências.
2. Revisão da arquitetura (2 aprovadores em módulos clínicos).
3. Status final: `Proposto` → `Aceito` → (eventualmente) `Substituído por ADR-XXXX`.
4. ADRs são imutáveis após aceitos; correções viram novo ADR.
