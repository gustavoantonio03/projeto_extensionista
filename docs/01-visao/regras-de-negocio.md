# Regras de Negócio, Perfis e Usabilidade — OncoVida (SIGLO)

> **Escopo:** Portal Oncológico Pediátrico (Paciente/Cuidador e Equipe Médica).
> **Diretriz Vigente:** Front-end First (100% Mockado na Fase 1) · Mobile-First · Sessões Isoladas Multidispositivo.

---

## 1. Problema, Solução e Objetivos de Produto

### 1.1 Problema
- **Laboratório e Equipe:** Processos fragmentados (planilhas, sistemas legados, WhatsApp) entre coleta, análise, prescrição e orientação familiar.
- **Família:** Crianças em tratamento oncológico e seus múltiplos cuidadores (mãe, pai, avós) lidam com diversos medicamentos, sintomas e orientações sem rastreabilidade de quem administrou cada dose, gerando risco de doses duplicadas ou esquecidas.

### 1.2 Solução
Um **Web App Mobile-First** (estilo aplicativo nativo/Instagram, otimizado para uso com uma mão) que acompanha a rotina diária da criança com sessões isoladas por perfil, suporte a múltiplos cuidadores na mesma conta familiar e dupla checagem de ações críticas.

---

## 2. Arquitetura de Perfis e Sessões Isoladas (`/login`)

A aplicação **não utiliza dispositivo compartilhado com trava de PIN**. O controle de acesso opera por **Sessões Isoladas Multidispositivo** através da rota `/login`:

| Perfil de Login | Rota Inicial | Permissões e Escopo de Visão |
|---|---|---|
| **Criança (`Clarinha`)** | `/` (Meu Dia) | Visão lúdica e acolhedora; informa humor (`MoodPicker`), local/intensidade de dor (`PainScale`) e vê recados no mural. **Somente leitura** para medicamentos e sem acesso ao Dashboard Clínico (`/clinico`). |
| **Cuidadora Principal (`Mãe — Ana`)** | `/clinico` | Visão completa de gestão familiar (5 abas na `BottomNav`): administra doses, registra check-in/temperatura/refeição e realiza conferência cruzada de registros feitos por outros cuidadores. |
| **Cuidador Familiar (`Pai — Carlos` / `Avó — Helena`)** | `/clinico` | Mesmas permissões de cuidador autenticado, com autoria individual em cada ação e permissão para validar (dupla checagem) registros feitos pela Mãe. |
| **Médico (`Dr. Roberto Silva`)** | `/medico` | Portal desktop/clínico amplo: Triagem por criticidade, Visão 360 do paciente, Prescrição de medicamentos/nutrição e Comunicação com a família. |

- **Cabeçalho (`Header.tsx`):** Exibe exclusivamente o usuário logado no momento, o botão simples de **Sair / Logout** (que encerra a sessão e redireciona para `/login`) e o botão de emergência **SOS**.

---

## 3. Rastreabilidade e Conferência Cruzada (Dupla Checagem)

1. **Autoria Obrigatória:** Toda ação crítica (administrar medicamento, registrar check-in/temperatura ou registrar refeição) grava explicitamente **qual cuidador realizou a ação e o horário** (`performedBy`, `performedAt`).
2. **Exibição Condensada em 1 Linha:**
   - Se pendente: exibe apenas horário previsto e dosagem (`08:00 · 8mg • 1 comprimido`).
   - Se administrado: unifica status, horário e autor (`✅ 08:05 por Mãe (Ana)`).
   - Se conferido: adiciona na mesma linha o validador (`✅ 08:05 por Mãe (Ana) · ✓ Pai`).
3. **Regra de Dupla Checagem:**
   - Um registro recém-criado nasce com `verificationStatus = "pendente"`.
   - **Apenas outro cuidador diferente do autor** pode confirmar/validar a ação (`canVerify: activeCaregiver.id !== performedBy.id`), mudando o status para `"conferido"` (`verifiedBy`, `verifiedAt`).
   - Apenas o próprio autor pode desfazer um registro, e somente enquanto ainda não tiver sido conferido.

---

## 4. Escopo Enxuto por Tela (Portal Paciente/Cuidador)

- **Feature Descontinuada (Voz):** A gravação de relato por voz no check-in foi **descontinuada** para manter a interface limpa e direta.
- **Meu Dia (`/`):** Saudação enxuta, seletor de humor (`MoodPicker`), mapa corporal e intensidade de dor (`PainScale`) e controle de temperatura.
- **Remédios (`/remedios`):** Lista enxuta com os **3 medicamentos essenciais do dia** (manhã, tarde e noite), **3 hábitos simples** + hidratação interativa por copos e calendário semanal (`MiniCalendar`).
- **Nutrição (`/nutricao`):** Seletor rápido da refeição sem culpa, **3 dicas curtas em pílulas** e cardápio suave do dia (sem excesso de calorias ou horários quebrados).
- **Família (`/familia`):** Lista dos **3 cuidadores vinculados à conta** (Mãe, Pai, Avó) e mural de carinho com no máximo **2 recados curtos**.
- **Dashboard do Cuidador (`/clinico`):** Topo com conferência cruzada em 1 toque, 4 indicadores vitais diretos (`Temperatura`, `Hidratação`, `Peso`, `Estatura`), **Trilha de Auditoria Compacta** (3 a 4 últimos eventos em 1 linha cada) e selo discreto de 1 linha de LGPD no rodapé.

---

## 5. Segurança, Privacidade (LGPD) e Acessibilidade

- **LGPD (Art. 11 e Art. 14):** Tratamento de dados sensíveis de saúde de crianças no melhor interesse do menor; na Fase 1 são utilizados exclusivamente dados fictícios (zero PII real).
- **Acessibilidade (WCAG 2.1 AA):** Alvos de toque generosos (`min-h-[48px]`), contraste validado nos tokens do Design System "Acolher", emojis sempre acompanhados de rótulo textual ou `aria-label` e navegação inferior fixa estilo Instagram apenas com ícones e cápsula ativa.
