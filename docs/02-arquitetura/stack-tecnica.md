# Stack Técnica, Design System e Engenharia — SIGLO

> **Arquitetura Vigente:** Monorepo em `npm workspaces` · Front-end First (`@siglo/web` + `@siglo/ui`).

---

## 1. Stack Front-end (Fase 1 e Fase 1B)

| Camada | Tecnologia | Decisão Técnica |
|---|---|---|
| **Framework Web** | **Next.js 15 (App Router) + React 19 + TypeScript** | Rotas por arquivo em `apps/web/src/app`, renderização híbrida e configuração limpa (`devIndicators: false`). |
| **Estilização** | **Tailwind CSS v4 (`@tailwindcss/postcss`)** | Escaneamento cross-workspace via `@source "../../../packages/ui/src";` em `globals.css` e tokens CSS em `@siglo/ui/theme.css`. |
| **Variantes de Componentes** | **CVA (`class-variance-authority`) / Tailwind Variants + `clsx` + `tailwind-merge`** | Componentes reutilizáveis isolados em `packages/ui` com variantes tipadas e utilitário `cn()`. |
| **Design System** | **`@siglo/ui` (Tema "Acolher")** | Paleta acolhedora creme/pêssego (`#FFF8F0`), ameixa (`#6E3F8C`), terracota (`#B04A26`) e teal clínico (`#134E54`); tipografia `Nunito` (UI) e `Fraunces` (display). |
| **Ícones** | **`lucide-react`** | Ícones vetoriais leves e consistentes nos portais Paciente/Cuidador e Médico. |
| **Testes Front-end** | **Vitest + Testing Library + jsdom** | Testes unitários e de acessibilidade dos componentes de `@siglo/ui` (`npm run ui:test`). |

---

## 2. Estrutura do Monorepo

```text
siglo/
├── CEREBRO-DO-PROJETO.md        # 🧠 MOC (Map of Content) enxuto
├── docs/                        # Documentação modular (Visão, Arquitetura, Planejamento, Sprints)
├── apps/
│   └── web/                     # Next.js 15 — Portal Paciente/Cuidador + Portal Médico
│       └── src/
│           ├── app/             # Rotas App Router (/, /login, /remedios, /nutricao, /familia, /clinico, /medico/*)
│           ├── components/      # AppFrame, Header, MedicoShell
│           ├── lib/             # types.ts, data.ts, medico-data.ts, caregiver.ts, useMedicationTrail.ts
│           └── mocks/           # fixtures.ts e medico-fixtures.ts
└── packages/
    ├── contracts/               # Contratos OpenAPI (Fase 2)
    └── ui/                      # Design System "@siglo/ui" (tokens, theme.css e componentes React)
```

---

## 3. Padrões de Layout e Componentes (`@siglo/ui` e `apps/web`)

1. **Casca Mobile-First (`AppFrame.tsx`):**
   - Nas rotas do Paciente/Cuidador, renderiza um container estilo smartphone (`max-w-[430px] mx-auto min-h-screen overflow-x-hidden box-border`) centralizado no desktop e `100%` no mobile.
   - Nas rotas `/medico/*`, ocupa a largura total de desktop para análise clínica densa.
2. **Barra Inferior Fixa Estilo Instagram (`BottomNav.tsx`):**
   - Fixa no rodapé da viewport (`position: fixed; bottom: 0; max-width: 430px`), exibindo apenas os ícones com cápsula arredondada (`rounded-full`) no item ativo e suporte a `safe-area-inset-bottom`.
3. **Camada de Dados Mockada (`apps/web/src/lib/data.ts`):**
   - Todas as telas consomem funções assíncronas tipadas (`getMedications`, `toggleMedicationTaken`, `verifyMedicationAction`, `submitCheckIn`, `loginAs`, `logoutSession`), permitindo substituir os mocks por chamadas HTTP na Fase 2 sem reescrever componentes visuais.

---

## 4. Gates de Qualidade e Boas Práticas

- **Comandos de verificação obrigatórios antes de cada entrega:**
  - `npm run ui:typecheck` (`tsc --noEmit` em `@siglo/ui`)
  - `npm run ui:test` (`vitest run` em `@siglo/ui`)
  - `npm run typecheck -w @siglo/web` (`tsc --noEmit` em `@siglo/web`)
  - `npm run build -w @siglo/web` (`next build` de produção)
- **Versionamento e Código:** Trunk-based com Conventional Commits, zero PII em logs/fixtures e componentes visuais base sempre centralizados em `packages/ui`.
