# 🧠 Cérebro do Projeto — SIGLO (MOC)

O **SIGLO (OncoVida)** é uma plataforma web **Mobile-First** voltada ao acompanhamento de crianças em tratamento oncológico pediátrico, conectando paciente, múltiplos cuidadores familiares e equipe médica.
Construído sob a diretriz **Front-end First** (100% funcional com mocks tipados na Fase 1 e preparado para integração com API/banco na Fase 2), o sistema opera com **Sessões Isoladas Multidispositivo (`/login`)** para garantir segurança infantil, rastreabilidade de autoria e **dupla checagem (conferência cruzada)** em cada medicação e registro diário.

> **Nota para a IA:** *Para economizar tokens, leia este MOC e abra apenas o arquivo de documentação estritamente necessário para a tarefa atual.*

---

## 🗺️ Índice de Documentação (Map of Content)

### 1. Visão e Regras de Negócio
- [Regras de Negócio, Perfis Isolados e Dupla Checagem](./docs/01-visao/regras-de-negocio.md) — Separação de logins (`/login`: Criança vs. Cuidadores vs. Médico), rastreabilidade em 1 linha, escopo enxuto por tela (sem voz) e LGPD (Art. 14).
- [Backlog do Produto](./docs/01-visao/backlog-do-produto.md) — Histórias de usuário (Fase 1, Fase 1B e Fase 2).

### 2. Arquitetura e Stack Técnica
- [Stack Técnica, Design System e Monorepo](./docs/02-arquitetura/stack-tecnica.md) — Decisões sobre Next.js 15, Tailwind CSS v4, variantes de componentes (`@siglo/ui`), `BottomNav` estilo Instagram e gates de qualidade.
- [Índice de ADRs (Decisões Arquiteturais)](./docs/03-arquitetura/adrs.md) · [ADR-0005 — Front-end First](./docs/03-arquitetura/adr-0005-front-end-first.md)
- [Design System — Acolher](./docs/08-ux/design-system-acolher.md) — Tokens visuais, paleta creme/ameixa/teal e diretrizes de acessibilidade WCAG 2.1 AA.

### 3. Planejamento de Back-end e Sprints
- [Planejamento da Fase 2 — Back-end e Banco de Dados](./docs/03-planejamento/fase2-backend.md) — Modelagem PostgreSQL/Prisma (`Patient`, `Caregiver`, `Prescription`, `MedicationLog`, `DailyCheckIn`, `AuditEntry`) e estratégia de migração dos mocks (`lib/data.ts`).
- [Roadmap de Sprints e Changelog](./docs/05-sprints/roadmap-de-sprints.md) — Status detalhado das Sprints (Fase 1, Fase 1B e Fase 2) e histórico de versões.
- [Inventário de Dados — LGPD](./docs/07-lgpd/inventario-de-dados.md) — Mapeamento de bases legais e proteção de dados de menores.
