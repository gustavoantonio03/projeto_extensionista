# @siglo/contracts — Contratos API-first

> Fonte de verdade das APIs ([[Cérebro do Projeto — SIGLO]] §4): **OpenAPI antes da implementação**.

- Módulos publicam/consomem contratos aqui — nunca acessam o schema do vizinho (ADR-0001).
- CI roda **OpenAPI diff**: breaking change bloqueia merge ([[Gates de Qualidade]]).

## Estrutura planejada

```text
packages/contracts/
├── openapi/
│   ├── pacientes.v1.yaml   # Sprint 02
│   ├── exames.v1.yaml      # Sprint 03
│   └── laudos.v1.yaml      # Sprint 05
└── events/                 # eventos de domínio (AsyncAPI) — a partir do Sprint 03
```

Na Sprint 00 apenas a convenção é estabelecida; o primeiro contrato entra no Sprint 02.
