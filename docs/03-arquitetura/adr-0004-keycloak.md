# ADR-0004 — Keycloak como provedor de identidade (OIDC)

- **Status:** Aceito
- **Data:** 2026-09-17
- **Relacionados:** [[Cérebro do Projeto — SIGLO]] §3.3 · Sprint 01 · ADR-0003

## Contexto

O [[Módulo Identidade e Acesso]] exige autenticação OIDC/OAuth2, RBAC fino por papel clínico,
MFA para a equipe clínica e trilhas auditáveis — sem construir gerenciamento de identidade
manualmente (anti-padrão em saúde).

## Opções consideradas

1. **Keycloak self-hosted** — maduro, OIDC nativo, RBAC/MFA, auditável, sem custo de licença.
2. **Auth0/Okta (SaaS)** — menos operação, porém custo por MAU alto em escala clínica e
   customização de fluxos clínicos limitada.
3. **Autenticação própria** — rejeitada: risco de segurança e custo de conformidade.

## Decisão

Adotar **Keycloak self-hosted** como IdP:

- OIDC/OAuth2 authorization code + PKCE para `apps/web` (Next.js).
- Mapeamento de papéis da [[Matriz de Papéis e Permissões (RBAC)]] em *claims* de token.
- **MFA obrigatório** para papéis clínicos (patologista, biomédico).
- Sessões/cache no Redis; trilha de login registrada no `auditoria.evento_auditoria`.

## Consequências

- ✅ RBAC fino, MFA e auditoria nativos; sem custo de licença.
- ⚠️ Operação do Keycloak (backup, upgrade, tuning) entra no time de plataforma — previsto no
  docker-compose local e no planejamento de ambientes.
- ⚠️ Integração será implementada no **Sprint 01**; este ADR registra apenas a decisão.
