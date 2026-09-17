# Backlog do Produto

> Fonte: [[Cérebro do Projeto — SIGLO]] · MVP clínico ao fim do Sprint 06.
> Prioridade: **P0** bloqueia o sprint · **P1** importante · **P2** pode deslizar.

## Sprint 00 — Fundações

| ID | História | Pri. | Sprint |
|---|---|---|---|
| F-1 | Como dev, quero o monorepo estruturado por módulos de domínio para trabalhar com fronteiras claras | P0 | 00 |
| F-2 | Como arquiteto, quero ADRs 0001–0004 registrados para decisões auditáveis | P0 | 00 |
| F-3 | Como dev, quero CI com lint, testes e SAST ativos desde o dia 1 | P0 | 00 |
| F-4 | Como dev, quero ambiente local dockerizado (PostgreSQL, Redis, MinIO) | P0 | 00 |
| F-5 | Como designer/dev, quero os tokens do design system em `packages/ui` | P0 | 00 |
| F-6 | Como DPO, quero o rascunho do inventário de dados LGPD | P0 | 00 |

## Sprint 01 — Identidade e Acesso

| ID | História | Pri. | Sprint |
|---|---|---|---|
| I-1 | Como usuário da equipe, quero autenticar via OIDC (Keycloak) | P0 | 01 |
| I-2 | Como admin, quero RBAC com papéis mínimos definidos na matriz | P0 | 01 |
| I-3 | Como auditor, quero trilha de auditoria v1 (login e ações sensíveis) | P0 | 01 |
| I-4 | Como dev, quero shell Next.js autenticado com guarda de rotas | P0 | 01 |
| I-5 | Como segurança, quero MFA obrigatório para equipe clínica | P1 | 01 |

## Sprint 02 — Pacientes

| ID | História | Pri. | Sprint |
|---|---|---|---|
| P-1 | Como recepção, quero cadastrar paciente com dados mínimos necessários | P0 | 02 |
| P-2 | Como recepção, quero buscar pacientes por nome/documento com máscara e paginação | P0 | 02 |
| P-3 | Como recepção, quero registrar consentimentos com finalidade e base legal | P0 | 02 |
| P-4 | Como cuidador, quero ser vinculado a um paciente com permissões limitadas | P1 | 02 |
| P-5 | Como DPO, quero PII mascarada em logs | P0 | 02 |

## Sprint 03 — Exames: fluxo

| ID | História | Pri. | Sprint |
|---|---|---|---|
| E-1 | Como biomédico, quero catálogo de exames com preparo e prazo | P0 | 03 |
| E-2 | Como recepção, quero abrir ordem de serviço com múltiplos exames | P0 | 03 |
| E-3 | Como técnico, quero acompanhar status (coleta → triagem → análise) | P0 | 03 |
| E-4 | Como designer, quero protótipo testado com técnico de laboratório | P1 | 03 |

## Sprint 04 — Rastreabilidade

| ID | História | Pri. | Sprint |
|---|---|---|---|
| R-1 | Como técnico, quero gerar código de barras/QR por amostra | P0 | 04 |
| R-2 | Como técnico, quero escanear a amostra e ver histórico completo | P0 | 04 |
| R-3 | Como técnico, quero anexar resultados em storage S3-compatível | P0 | 04 |
| R-4 | Como arquiteto, quero spike HL7/FHIR com contrato de integração | P1 | 04 |

## Sprint 05 — Laudos: emissão

| ID | História | Pri. | Sprint |
|---|---|---|---|
| L-1 | Como patologista, quero templates por tipo de exame | P0 | 05 |
| L-2 | Como patologista, quero editor estruturado com campos validados | P0 | 05 |
| L-3 | Como patologista, quero fluxo de dupla revisão obrigatória | P0 | 05 |

## Sprint 06 — Laudos: liberação (MVP clínico)

| ID | História | Pri. | Sprint |
|---|---|---|---|
| L-4 | Como patologista, quero versionamento imutável de laudos | P0 | 06 |
| L-5 | Como patologista, quero assinatura digital no laudo | P0 | 06 |
| L-6 | Como paciente, quero ser notificado quando o laudo for liberado | P0 | 06 |
| L-7 | Como gestor, quero trilha de acesso ao laudo e política de retenção | P0 | 06 |

## Pós-MVP (Sprints 07–10)

| ID | História | Pri. | Sprint |
|---|---|---|---|
| U-1 | Portal do paciente com design system e WCAG 2.1 AA | P0 | 07 |
| B-1 | Modelo estrela + ETL Python + dashboards TAT/retrabalho | P0 | 08 |
| S-1 | Pentest interno, RIPD, resposta a incidentes, backup/DR drill | P0 | 09 |
| G-1 | UAT, playbook de operação e go-live | P0 | 10 |
