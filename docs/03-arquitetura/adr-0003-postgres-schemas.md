# ADR-0003 — PostgreSQL com schemas por módulo

- **Status:** Aceito
- **Data:** 2026-09-17
- **Relacionados:** [[Cérebro do Projeto — SIGLO]] §3.3 · ADR-0001 · ADR-0002

## Contexto

Os módulos de domínio precisam persistir dados com ACID (fluxo clínico, rastreabilidade,
versionamento de laudos) e o BI precisa de leitura analítica — sem que módulos leiam o schema
um do outro diretamente.

## Opções consideradas

1. **Banco por serviço** — isolamento máximo, mas custo operacional alto para um time pequeno e
   joins/consistência entre bancos complexos.
2. **Schema único compartilhado** — simples, porém elimina a fronteira de domínio e facilita
   acoplamento acidental via tabelas do vizinho.
3. **PostgreSQL 16 único com schemas por módulo** — fronteira física dentro de um banco só.

## Decisão

Um único **PostgreSQL 16** com **schemas por módulo**:

```sql
pacientes · exames · laudos · iam · auditoria · bi
```

- Migrações **versionadas e imutáveis** (golang-migrate para `core`, Alembic para `bi`) — nunca DDL manual.
- `JSONB` para resultados heterogêneos de exames.
- **Views pseudonimizadas** exclusivas para consumo do [[Módulo BI]] (sem PII).
- Redis para sessões/cache do IAM; object storage S3-compatível para PDFs de laudos/DICOM.

## Consequências

- ✅ ACID transacional no fluxo clínico; fronteira de domínio auditável via schema.
- ✅ BI desacoplado por views pseudonimizadas (privacy by design).
- ⚠️ Migrações cruzam schemas por módulo — donos de módulo revisam PRs que tocam seu schema.
- ⚠️ Escala horizontal futura (sharding por módulo) exigirá ADR dedicado.
