# Inventário de Dados (LGPD) — rascunho

> Base legal predominante: **tutela da saúde (art. 11, LGPD)** — dados pessoais sensíveis.
> Status: **rascunho inicial (Sprint 00)** — a validar com DPO a cada sprint.
> Fonte: [[Cérebro do Projeto — SIGLO]] §7 · [[Módulo Auditoria e Conformidade]]

## Como ler esta tabela

- **Classificação**: `pessoal` · `sensível (saúde)` · `operacional`.
- **Base legal**: `tutela da saúde (art. 11, II, f)` para dados clínicos; consentimento explícito apenas para finalidades acessórias.
- **Ciclo de vida**: coleta → uso → armazenamento → compartilhamento → descarte/retenção.

## Entidades e campos

| Entidade | Campo | Classificação | Finalidade | Base legal | Retenção | Risco | Controles |
|---|---|---|---|---|---|---|---|
| `paciente` | nome completo | pessoal (sensível indireto) | identificação assistencial | tutela da saúde | CFM/prazo clínico a validar | alto | RBAC, mascaramento em logs, auditoria |
| `paciente` | CPF/documento | pessoal | identificação inequívoca e faturamento | tutela da saúde | a validar com DPO | alto | criptografia em repouso, acesso mínimo |
| `paciente` | data de nascimento | pessoal | identificação e cálculo de idade clínica | tutela da saúde | a validar | médio | mascaramento em exports |
| `paciente` | contato (telefone, e-mail) | pessoal | comunicação sobre exames/laudos | tutela da saúde | a validar | médio | uso apenas em notificações transacionais |
| `consentimento` | finalidade, aceite, data, revogação | pessoal | comprovar consentimento acessório | consentimento (art. 11, I) | prazo de prescrição | baixo | trilha imutável |
| `vinculo_cuidador` | vínculo cuidador–paciente | pessoal | acesso limitado do cuidador | tutela da saúde | término do vínculo | médio | permissões explícitas, auditoria |
| `ordem_exame` | referência ao paciente | pessoal (indireto) | executar fluxo assistencial | tutela da saúde | prazo clínico | alto | RBAC por papel |
| `amostra` | código de barras/QR, cadeia de custódia | operacional + pessoal indireto | rastreabilidade | tutela da saúde | prazo clínico | médio | auditoria append-only |
| `resultado` | valores/laudo bruto | sensível (saúde) | diagnóstico e tratamento | tutela da saúde | prazo clínico | crítico | criptografia, RBAC, trilha de acesso |
| `laudo` / `versao_laudo` | conteúdo clínico | sensível (saúde) | diagnóstico e tratamento | tutela da saúde | CFM/prazo clínico | crítico | versionamento imutável, assinatura, trilha |
| `assinatura` | certificado/impressão | pessoal | autenticidade do laudo | tutela da saúde | prazo legal | baixo | cofre de chaves |
| `evento_auditoria` | quem, quando, o quê | pessoal (mínimo) | conformidade e investigação | obrigação legal (art. 10) | política de retenção | baixo | append-only, sem PII adicional |
| `fato_tat` (BI) | métricas pseudonimizadas | operacional | indicadores de gestão | legitimidade (art. 7) | indefinido/rotativo | baixo | **sem PII**, views pseudonimizadas |
| `usuario` | nome, e-mail institucional, papel | pessoal | autenticação e RBAC | obrigação legal/legitimidade | desligamento | baixo | MFA clínico, sessões auditadas |

## Decisões de design de privacidade (Sprint 00)

1. **Minimização**: cada campo acima deve ter finalidade justificada antes de virar coluna no banco (privacy by design).
2. **Pseudonimização para BI**: [[Módulo BI]] consome apenas views pseudonimizadas — nunca tabelas clínicas diretas.
3. **Logs sem PII**: padrão de logging estruturado exige mascaramento de identificadores (enforcement no review + lint).
4. **Trilha append-only**: todo acesso a dado de saúde gera `evento_auditoria` (quem, quando, o quê).
5. **Retenção**: prazos clínicos a validar com DPO/CFM antes do Sprint 06 (liberação de laudos).
6. **Direitos do titular**: fluxos de acesso/correção/eliminação mapeados para o [[Módulo Pacientes]] (Sprint 02).

## Pendências

- [ ] Validar prazos de retenção com DPO (bloqueia Sprint 06).
- [ ] Mapear operadores (nuvem, e-mail/SMS) e contratos de operador.
- [ ] RIPD completo — Sprint 09.
