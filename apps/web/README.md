# apps/web — Portal do Paciente e Cuidador (OncoVida)

> **Front-end First (Fase 1)** — [[ADR-0005 — Front-end First]].
> Aplicação Next.js (App Router) + TypeScript + Tailwind CSS v4, consumindo os componentes e tokens de `@siglo/ui` (Design System Acolher).

## 🚀 Executando o Portal Localmente

Na raiz do monorepo:

```bash
# Instalar dependências de todos os workspaces
npm install

# Iniciar o servidor de desenvolvimento do portal
npm run dev
# ou:
npm run dev -w @siglo/web
```

Acesse em seu navegador: [http://localhost:3000](http://localhost:3000)

## 📱 Rotas e Telas Implementadas

| Rota | Tela | Público & Funcionalidades |
|---|---|---|
| `/` | **Meu Dia** | Check-in matinal por humor (`MoodPicker`), entrada de voz, mapa de dor (`PainScale`), temperatura axilar, paladar e alerta automático de acolhimento. |
| `/remedios` | **Remédios & Rotina** | Dose próxima com botão "Já tomei!", lista de medicamentos do dia, agenda mensal (`MiniCalendar`), hidratação interativa e conforto diário. |
| `/nutricao` | **Nutrição & Paladar** | Registro compassivo da refeição (sem culpa), pratos suaves sugeridos, dicas práticas para paladar alterado e pílulas de conhecimento em vídeo. |
| `/familia` | **Rede de Família** | Guardiões conectados com status em tempo real, mural de mensagens de carinho e atalhos rápidos de chamada/WhatsApp. |
| `/clinico` | **Painel Clínico** | Visão conjunta equipe/família, estatísticas de peso e altura, alertas vivos, linha do tempo de cuidados e conformidade LGPD (Art. 11 e 14). |

## 🧪 Qualidade & Verificação

```bash
# Typecheck TypeScript rigoroso
npm run typecheck -w @siglo/web

# Build de produção otimizado
npm run build -w @siglo/web

# Testes de componentes do design system
npm run ui:test
```
