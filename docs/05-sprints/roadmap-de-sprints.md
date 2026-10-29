# Roadmap de Sprints e Histórico de Evolução — SIGLO

> Fonte: [[Cérebro do Projeto — SIGLO]] · Decisão: [[ADR-0005 — Front-end First]] · Atualizado em: 2026-10-29

## 1. Recorte Geral

- **Fase 1 — Front-end (Sprints 01 → 08):** Portal do Paciente/Cuidador (`OncoVida`) 100% finalizado no front-end com dados mockados.
- **Fase 1B — Front-end (Sprints 09 → 12):** Portal do Médico / Equipe Multidisciplinar (`/medico/*`) com dados mockados.
- **Fase 2 — Back-end e Integração (Sprints B1 → B9):** Servidor, banco de dados (PostgreSQL/Prisma), autenticação real, integrações e BI.

---

## 2. Etapas Padrão de Rastreabilidade

Toda entrega é identificada como `📍 Sprint XX · Etapa XX.N — nome`:

| Etapa | Nome | O que acontece |
|---|---|---|
| `XX.1` | Refinamento | Histórias, critérios de aceite e ajustes nas regras de negócio |
| `XX.2` | Implementação | Componentes `@siglo/ui`, telas `apps/web` e camada `lib/data` |
| `XX.3` | QA & Acessibilidade | Lint, typecheck, testes unitários, contraste e navegação |
| `XX.4` | Review & Polimento | Limpeza visual, validação de build e atualização documental |

---

## 3. Fase 1 — Front-end do Portal Paciente/Cuidador

| Sprint | Nome | Entregas Principais | Status |
|---|---|---|---|
| **00** | Fundações | Monorepo, CI, ADRs 0001–0004, backlog inicial e tokens base | ✅ Concluído |
| **01** | Fundação Front-end e Design System | Next.js em `apps/web`, Design System "Acolher" (`@siglo/ui`) e mocks tipados | ✅ Concluído |
| **02** | Shell Mobile-First, Login Isolado e Dupla Checagem | Casca Mobile-First (`430px`), `BottomNav` fixa estilo Instagram (somente ícones e cápsula ativa), tela `/login` com sessões isoladas (Criança, Mãe, Pai, Médico), rastreabilidade e conferência cruzada (`MedicationCard` em 1 linha) e polimento visual das 5 abas | ✅ Concluído (Etapas 02.1–02.5) |
| **03** | Meu Dia | Check-in rápido de humor (`MoodPicker`), mapa de dor (`PainScale`) e temperatura *(gravação de voz descontinuada por escopo enxuto)* | ✅ Entregue no protótipo |
| **04** | Remédios e Agenda | 3 medicamentos essenciais do dia com dupla checagem, 3 hábitos simples + copos de água e `MiniCalendar` | ✅ Entregue no protótipo |
| **05** | Alimentação | Registro rápido da refeição sem culpa, 3 dicas curtas em pílulas e cardápio suave do dia | ✅ Entregue no protótipo |
| **06** | Dashboard Clínico (Cuidador) | Conferência cruzada 1-toque, 4 indicadores vitais e trilha de auditoria compacta em 1 linha | ✅ Entregue no protótipo |
| **07** | Família | 3 cuidadores vinculados à conta e mural com 2 recados curtos de carinho | ✅ Entregue no protótipo |
| **08** | Qualidade e Entrega do Front-end | E2E (Playwright + axe), revisão WCAG 2.1 AA e testes de usabilidade | 🔴 Pendente |

---

## 4. Fase 1B — Front-end do Portal do Médico / Equipe

| Sprint | Nome | Entregas Principais | Status |
|---|---|---|---|
| **09** | Shell Médico e Triagem | Rota `/medico`, `MedicoShell`, lista de pacientes por criticidade, KPIs e componentes clínicos (`SeverityBadge`, `LineChart`, `Tabs`, `Select`) | ✅ Concluído |
| **10** | Visão 360 do Paciente | `/medico/pacientes/[id]`: curvas de peso/altura, histórico de humor/dor, adesão medicamentosa e intercorrências | ✅ Concluído |
| **11** | Prescrição e Rotina | `/medico/prescricao`: cadastro/ajuste/suspensão de medicamentos e recomendações nutricionais integrados aos mocks do paciente | ✅ Concluído |
| **12** | Comunicação e QA Médico | `/medico/comunicacao`: recados clínicos e orientações aos cuidadores; validação de typecheck/testes/build | ✅ Concluído |

---

## 5. Fase 2 — Back-end e Integração (Planejamento Futuro)

| Sprint | Foco |
|---|---|
| **B1** | Identidade e Acesso (Autenticação real para sessões isoladas Criança, Cuidadores e Médico + RBAC + Auditoria v1) |
| **B2** | Banco de Dados (`Patient`, `Caregiver`, `Prescription`, `MedicationLog`, `DailyCheckIn`) + OpenAPI derivado de `apps/web/src/lib/types.ts` |
| **B3** | Exames: catálogo, ordem de serviço e coleta |
| **B4** | Rastreabilidade de amostras (QR/código de barras, storage S3 e HL7/FHIR) |
| **B5** | Laudos: emissão estruturada e dupla revisão |
| **B6** | Laudos: assinatura digital, liberação e notificações |
| **B7** | Integração Portal ↔ API (substituição de `apps/web/src/lib/data.ts` mock por API real) |
| **B8** | BI & Analytics (ETL e dashboards gerenciais com dados pseudonimizados) |
| **B9** | Hardening LGPD, pentest, UAT e Go-Live |

---

## 6. Changelog Histórico do Projeto

| Data | Versão | Mudança |
|---|---|---|
| 2026-10-29 | 0.7 | **Otimização para Grafo MOC:** Transformação do `CEREBRO-DO-PROJETO.md` em índice enxuto e modularização em `docs/01-visao/regras-de-negocio.md`, `docs/02-arquitetura/stack-tecnica.md` e `docs/03-planejamento/fase2-backend.md`. |
| 2026-10-29 | 0.6 | **Sessões Isoladas Multidispositivo & Limpeza de Features:** Transição de "Device Compartilhado com PIN" para **Sessões Isoladas Multidispositivo (`/login`)**; remoção de PIN e `PortalSwitcher` no cabeçalho; descontinuação da gravação de voz no check-in. |
| 2026-10-26 | 0.5b | **Polimento Final de UX/UI (Etapa 02.4):** `MedicationCard` condensado em 1 linha, redução a 3 medicamentos e 3 hábitos, trilha de auditoria compacta em `/clinico` e limpeza visual nas 5 abas. |
| 2026-10-19 | 0.5 | **Refatoração Mobile-First e Rastreabilidade Multi-Cuidador:** Múltiplos cuidadores na conta familiar (Mãe, Pai, Avó), autoria (`performedBy`, `performedAt`) e dupla checagem (`verifiedBy`, `verifiedAt`). |
| 2026-10-19 | 0.4 | **Fase 1B — Portal do Médico (`/medico/*`):** Sprints 09–12 concluídos com mocks. |
| 2026-10-14 | 0.3 | Diretriz **Front-end First** (`ADR-0005`), Design System "Acolher" e conformidade LGPD Art. 14. |
