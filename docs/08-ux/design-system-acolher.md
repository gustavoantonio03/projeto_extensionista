# Design System — Acolher

> Evolução do [[Design System — Serene Clinical Humanism]] para o **Portal do Paciente/Cuidador** (público infantil + adulto).
> Fonte de verdade dos valores: `packages/ui/src/theme.css` (Tailwind v4 `@theme`) e `packages/ui/src/tokens.ts` (`acolher`).
> Referências visuais aprovadas em 2026-10-14: app de cuidado infantil (pêssego/ameixa, folhas orgânicas, cards brancos arredondados) + landing editorial de saúde (títulos em serifa itálica, CTA terroso).

## Princípios

1. **Acolher a criança, respeitar o adulto** — ilustração e brincadeira gentil no Modo Criança; clareza e densidade controlada no Modo Cuidador. Mesma base visual.
2. **Calor, não alarme** — fundo creme/pêssego (nunca branco hospitalar), sombras com tinta ameixa (nunca preto), alertas firmes sem pânico.
3. **Emoji nunca sozinho** — todo ícone/emoji tem rótulo de texto visível.
4. **Toque generoso** — alvos ≥ 48px; ações primárias 56px.

## Cores

| Token (Tailwind) | Hex | Uso | Contraste |
|---|---|---|---|
| `canvas` | `#FFF8F0` | Fundo da página | — |
| `cream` | `#FAEBD6` | Fundo de ilustrações e heros | — |
| `peach-100` / `peach-200` | `#FDE6CF` / `#F9C98F` | Heros, cabeçalhos de seção (calendário) | — |
| `plum-600` | `#6E3F8C` | **Ação primária**, links, item ativo | 7,6:1 em branco · 5,0:1 em `peach-200` ✅ |
| `plum-700` | `#5A3175` | Hover/press da primária | 9,6:1 ✅ |
| `plum-50` / `plum-100` | `#F6F0FA` / `#EDE3F5` | Fundos suaves, chip selecionado | — |
| `lavender-300` | `#B79AD6` | Decoração (folhas, blobs) | decorativo |
| `orange-400` | `#F08A5D` | Decoração, destaque de dia no calendário | decorativo |
| `orange-700` | `#B04A26` | Texto/ícone de destaque laranja, CTA terroso | 5,4:1 ✅ |
| `ink` | `#1F2340` | Texto principal (navy) | 15,9:1 ✅ |
| `ink-muted` | `#5B5F7A` | Texto secundário | 6,2:1 ✅ |
| `line` | `#F1E4D6` | Divisores e bordas | — |
| `success-700` / `success-50` | `#2E7D5B` / `#E5F4EC` | Tomado, concluído, normal | 5,0:1 ✅ |
| `warning-700` / `warning-50` | `#9A5B0F` / `#FFF1DA` | Atenção, atrasado | 5,6:1 ✅ |
| `danger-600` / `danger-50` | `#C0392B` / `#FDECEA` | SOS, febre, erro | 5,4:1 ✅ |
| `clinical-700` / `clinical-50` | `#134E54` / `#E6EFF0` | "Equipe de saúde" (herança Serene) | 9,4:1 ✅ |

## Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| `font-display` | **Fraunces** (serifa suave, itálico para ênfase) | Títulos de tela e heros ("*Como você está hoje?*") |
| `font-sans` | **Nunito** (arredondada, legível) | Toda a UI e textos |

Escala: base **16px** (ajustável pelo usuário: 100% / 112,5% / 125% via `data-text-size` no `<html>`). Títulos 600–700, nunca black.

## Forma, sombra e espaço

- Raios: `rounded-xl` 12px (campos) · `rounded-2xl` 16px (botões, chips) · `rounded-card` 28px (cards) · `rounded-full` (pílulas, avatares).
- Sombras com tinta ameixa: `shadow-soft` (cards em repouso), `shadow-lift` (flutuantes), `shadow-modal` (diálogos).
- Grade de 8px; margem de tela 20px; seções separadas por 24–32px.
- Decoração: blobs orgânicos SVG (`DecorBlob`) em pêssego/lavanda/laranja no topo de heros — sempre `aria-hidden`.

## Componentes (`@siglo/ui`)

**Base:** `Button` · `Card` · `Badge` · `Chip` · `Avatar` · `IconBubble` · `ListTile` · `SectionHeader` · `Field`/`Input`/`Textarea` · `Switch` · `SegmentedControl` · `Sheet` (diálogo nativo) · `EmptyState` · `ErrorState` · `Skeleton` · `DecorBlob` · `ProgressBar`.
**Saúde:** `MoodPicker` · `PainScale` · `StatCard` · `LineChart` · `MiniCalendar` · `MedicationCard` · `TimelineItem`.
**Shell:** `BottomNav` · `SosButton`.

## Ilustrações

`apps/web/public/illustrations/` — estilo vetorial plano, fundo `cream` (#FAEBD6) para fundir com os containers. Mascote **Lumi** (estrelinha pêssego) aparece só no Modo Criança e em estados vazios.
