# Ambientes e Infraestrutura

> Fonte: [[Cérebro do Projeto — SIGLO]] §3 · ADR-0003 · ADR-0004

## Ambientes

| Ambiente | Objetivo | Dados | Deploy |
|---|---|---|---|
| **Local** | desenvolvimento diário | sintéticos/seed | `docker compose up` (raiz do repo) |
| **Dev (compartilhado)** | integração contínua por PR | sintéticos | CI por ambiente efêmero |
| **Staging** | homologação clínica, UAT | pseudonimizados | promote automático do `main` |
| **Produção** | go-live (Sprint 10) | reais + LGPD integral | release semântico, imagem assinada |

## Stack de infraestrutura

- **PostgreSQL 16** — schemas por módulo (`pacientes`, `exames`, `laudos`, `iam`, `auditoria`, `bi`), migrações versionadas.
- **Redis 7** — sessões/cache do IAM (Sprint 01).
- **MinIO** — object storage S3-compatível para PDFs de laudos/DICOM (Sprint 04+).
- **Keycloak** — IdP OIDC (Sprint 01, ADR-0004).

## Composição local (docker-compose)

Serviços expostos na rede interna `siglo-net`; apenas portas necessárias publicadas:

| Serviço | Porta local | Credenciais |
|---|---|---|
| postgres | 5432 | usuário `siglo` · senha `CHANGE_ME_LOCAL` (apenas dev) |
| redis | 6379 | sem senha (apenas dev) |
| minio | 9000/9001 | usuário `siglo` · senha `CHANGE_ME_LOCAL` (apenas dev) |

Secrets reais **nunca** em código — cofre + variáveis de ambiente por ambiente
([[Cérebro do Projeto — SIGLO]] §7). O `.env` local é gerenciado pelo painel do Freebuff
(Keys/API keys) e nunca é commitado.

### Variáveis de ambiente locais — solução adotada (Sprint 00)

A plataforma bloqueia a criação de qualquer arquivo com padrão `.env*` no repositório
(`.env.example` e `.env.example.template` foram testados e negados). O exemplo versionado
é portanto **`env.example`** (sem ponto inicial, na raiz), contendo **apenas nomes de
variáveis e valores fictícios/de desenvolvimento** — nenhum segredo real; as credenciais
dev espelham o `infra/docker-compose.yml`.

```bash
# gerar o .env local a partir do exemplo:
cp env.example .env
```

Regras complementares: o `.env` (e qualquer `.env.*`) está no `.gitignore`;
valores reais de staging/produção são configurados no Freebuff (Keys/API keys e
`freebuff-deploy env` para produção), nunca em arquivos versionados.

### Variáveis de ambiente (referência)

| Variável | Uso | Sprint |
|---|---|---|
| `POSTGRES_HOST/PORT/USER/PASSWORD/DB` | conexão PostgreSQL | 00 |
| `REDIS_ADDR` | sessões/cache IAM | 01 |
| `S3_ENDPOINT`, `S3_BUCKET_LAUDOS`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | object storage de laudos/DICOM | 04 |
| `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID` | OIDC (ADR-0004) | 01 |
| `CORE_HTTP_ADDR` | bind HTTP do `services/core` | 00 |

## Migrações

- `services/core`: **golang-migrate** — arquivos em `services/core/migrations/`, aplicados por job do compose.
- `services/bi`: **Alembic** (a partir do Sprint 08) — schemas analíticos e views pseudonimizadas.
- Regra: migração versionada e imutável; **nunca DDL manual**.

## Observabilidade (a partir do Sprint 01)

- Logs estruturados JSON **sem PII**; correlação por request-id no API Gateway.
- Tracing distribuído (OpenTelemetry) planejado para o gateway e `services/core`.
