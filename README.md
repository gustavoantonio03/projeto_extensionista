# SIGLO — Sistema Integrado de Gestão de Laboratório Oncológico

> Plataforma web modular que digitaliza o fluxo ponta a ponta do laboratório:
> **pacientes → exames → rastreabilidade → laudo assinado → BI**.
> Hub de conhecimento: [`CEREBRO-DO-PROJETO.md`](CEREBRO-DO-PROJETO.md)

## Estrutura do monorepo

```text
├── CEREBRO-DO-PROJETO.md        # 🧠 hub central (Map of Content)
├── docs/                        # wiki do projeto (ADRs, LGPD, sprints…)
├── apps/web/                    # Next.js — portal paciente + admin (Sprint 01+)
├── services/core/               # Go — monolito modular de domínio
│   ├── cmd/api/                 # entrypoint HTTP (healthz)
│   ├── internal/pacientes/      # handler → service → repository
│   └── migrations/              # golang-migrate (schemas por módulo)
├── services/bi/                 # Python — FastAPI + ETL (Sprint 08)
├── packages/contracts/          # OpenAPI — API-first
├── packages/ui/                 # 🎨 design system "Serene Clinical Humanism"
└── infra/                       # docker-compose local (PG16, Redis, MinIO)
```

## Quick start (local)

```bash
# 1. Variáveis de ambiente (exemplo com valores fictícios de dev)
cp env.example .env

# 2. Infra (PostgreSQL 16 + Redis + MinIO + migrações)
docker compose -f infra/docker-compose.yml up -d

# 3. Núcleo de domínio (Go)
cd services/core && go run ./cmd/api   # health: http://localhost:8080/healthz

# 4. BI (Python)
cd services/bi && pip install -r requirements-dev.txt && uvicorn app.main:app --reload
```

> O frontend `apps/web` (Next.js) entra no Sprint 01 com Keycloak (ADR-0004).

## Qualidade (gates do CI — [[CI/CD]])

- **packages/ui**: `tsc --noEmit` + Vitest.
- **services/core**: `go vet` + `go test -race`.
- **services/bi**: `ruff check` + `pytest`.
- **SAST**: Semgrep (`p/default`) em todo PR.
- **Infra**: `docker compose config -q`.

## Documentação

- ADRs: [`docs/03-arquitetura/adrs.md`](docs/03-arquitetura/adrs.md)
- LGPD: [`docs/07-lgpd/inventario-de-dados.md`](docs/07-lgpd/inventario-de-dados.md)
- Sprints: [`docs/05-sprints/sprint-00-fundacoes.md`](docs/05-sprints/sprint-00-fundacoes.md)
- Design system: [`packages/ui/README.md`](packages/ui/README.md)
