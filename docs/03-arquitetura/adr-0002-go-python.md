# ADR-0002 — Go + Python como linguagens de backend

- **Status:** Aceito
- **Data:** 2026-09-17
- **Relacionados:** [[Cérebro do Projeto — SIGLO]] §3.3 · ADR-0001

## Contexto

O núcleo de domínio precisa de alta concorrência (filas de exame/laudo, rastreabilidade em tempo
real) e tipagem forte; a camada de dados/BI precisa de produtividade analítica, ETL e geração de
PDF de laudos, com caminho natural para ML.

## Opções consideradas

1. **Tudo em Go** — excelente concorrência, mas ETL/estatística e geração de documentos são mais
   produtivos no ecossistema Python (pandas/dbt).
2. **Tudo em Python** — produtividade, porém concorrência e desempenho do núcleo clínico ficam
   abaixo do necessário para filas de exame.
3. **Go (núcleo) + Python (dados/BI)** — linguagem certa para cada camada.

## Decisão

- **`services/core` — Go** (chi/Fiber + `pgx`): módulos `pacientes`, `exames`, `laudos`, `iam`,
  `auditoria` com padrão **handler → service → repository**.
- **`services/bi` — Python** (FastAPI + pandas/dbt): ETL, indicadores e geração de PDF.
- Contratos compartilhados em `packages/contracts` (OpenAPI) — API-first antes da implementação.

## Consequências

- ✅ Concorrência e baixo custo operacional no núcleo; produtividade analítica no BI.
- ⚠️ Duas toolchains no CI (gofmt/golangci-lint · ruff/mypy) e duas imagens de runtime.
- ⚠️ Curva dupla para o time; mitigada por contratos OpenAPI e README por módulo.
