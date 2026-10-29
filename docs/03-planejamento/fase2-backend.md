# Planejamento da Fase 2 — Back-end, Banco de Dados e Prisma/PostgreSQL

> **Status:** Planejado para a **Fase 2 (Sprints B1 → B9)** após a conclusão 100% do Front-end (Fase 1 e 1B).
> **Ponte Fase 1 → Fase 2:** Os contratos de `apps/web/src/lib/types.ts` e as assinaturas de `apps/web/src/lib/data.ts` servem como especificação direta para o schema do banco e rotas da API.

---

## 1. Modelagem de Dados Alvo (PostgreSQL / Prisma Schema)

As entidades abaixo refletem diretamente os tipos já validados no front-end (`PatientProfile`, `CaregiverProfile`, `Medication`, `MedicationLog`, `DailyCheckIn`, `AuditEntry`):

### 1.1 Tabelas Principais (`Patient`, `Caregiver`, `Session`)
- **`Patient` (Paciente Pediátrico):**
  - `id` (UUID, PK), `name`, `preferredName`, `birthDate`, `diagnosis`, `treatmentCycle`, `hospital`, `status` (`estavel` | `atencao` | `alerta`), `createdAt`.
- **`Caregiver` (Cuidadores Vinculados à Conta da Criança):**
  - `id` (UUID, PK), `patientId` (FK → `Patient.id`), `name`, `shortName`, `displayName`, `relation` (`mae` | `pai` | `avo` | `outro`), `relationLabel`, `isPrimary` (boolean), `phone`, `userId` (FK → credencial de login isolado).
- **`UserAccount` (Logins Isolados Multidispositivo):**
  - `id` (UUID, PK), `email`, `passwordHash` / `oidcSub`, `role` (`CRIANCA` | `CUIDADOR` | `MEDICO`), `patientId` (nullable), `caregiverId` (nullable).

### 1.2 Tabelas de Rotina Clínica e Dupla Checagem
- **`Prescription` (Prescrições Médicas Ativas/Suspensas):**
  - `id` (UUID, PK), `patientId` (FK → `Patient.id`), `name`, `dosage`, `time` (`HH:mm`), `period` (`manha` | `tarde` | `noite`), `instructions`, `category`, `status` (`ativo` | `suspenso`), `prescribedById`.
- **`MedicationLog` (Registro e Conferência Cruzada de Doses):**
  - `id` (UUID, PK), `prescriptionId` (FK → `Prescription.id`), `patientId` (FK → `Patient.id`), `takenAt` (timestamp), `performedById` (FK → `Caregiver.id`), `verificationStatus` (`pendente` | `conferido`), `verifiedById` (nullable FK → `Caregiver.id`), `verifiedAt` (nullable timestamp).
  - **Constraint de Negócio:** `verifiedById <> performedById` (um cuidador nunca confere a própria dose).
- **`DailyCheckIn` (Check-in Diário de Humor, Dor e Temperatura):**
  - `id` (UUID, PK), `patientId` (FK → `Patient.id`), `date`, `mood`, `painPart`, `painIntensity`, `temperature` (decimal), `performedById` (FK → `Caregiver.id`), `verifiedById` (nullable FK → `Caregiver.id`).
- **`AuditEntry` (Trilha de Auditoria Imutável / Append-Only):**
  - `id` (UUID, PK), `patientId` (FK → `Patient.id`), `action`, `subject`, `description`, `targetId`, `performedById` (FK → `Caregiver.id`), `performedAt`, `verificationStatus`, `verifiedById`, `verifiedAt`.

---

## 2. Módulos de Domínio do Back-end (Fase 2)

| Módulo | Responsabilidade | Principais Entidades |
|---|---|---|
| **Identidade e Acesso (IAM)** | Autenticação por sessões isoladas (`/login`), OIDC/JWT, RBAC (`CRIANCA`, `CUIDADOR`, `MEDICO`) | `UserAccount`, `Session`, `Role` |
| **Pacientes & Cuidadores** | Cadastro da criança, vínculo N:1 com cuidadores familiares, check-ins, prescrições e dupla checagem | `Patient`, `Caregiver`, `Prescription`, `MedicationLog`, `DailyCheckIn` |
| **Exames & Amostras** | Catálogo, ordem de serviço, coleta e rastreabilidade por QR/código de barras | `ExamOrder`, `Sample`, `RawResult` |
| **Laudos** | Emissão estruturada, revisão por pares, assinatura digital e liberação | `Report`, `ReportVersion`, `DigitalSignature` |
| **Auditoria & LGPD** | Trilha imutável de acessos e ações críticas, consentimentos (Art. 14) e política de retenção | `AuditEntry`, `ConsentRecord` |
| **BI & Analytics** | ETL e indicadores gerenciais (TAT, adesão medicamentosa) sobre views pseudonimizadas | `FactTAT`, `FactAdherence` |

---

## 3. Estratégia de Migração (Mocks → API Real)

1. **Geração de Contratos (`packages/contracts`):** Converter as interfaces de `apps/web/src/lib/types.ts` em schemas OpenAPI 3.1 / Prisma Schema.
2. **Substituição Transparente em `apps/web/src/lib/data.ts`:** Trocar o estado em memória pelas chamadas `fetch` autenticadas para os endpoints REST, mantendo a mesma assinatura de funções consumidas pelas páginas Next.js.
