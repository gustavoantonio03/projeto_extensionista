import {
  mockPatient,
  mockSuggestedMeals,
  mockClinicalTimeline,
  mockFamilyMembers,
  mockCareTeam,
  mockAppointments,
  mockCaregivers,
  mockPrimaryCaregiver,
  mockSecondaryCaregiver,
  mockAuditTrail,
  mockMedicationLogs,
} from "../mocks/fixtures";
import {
  activePrescriptionsFor,
  nutritionFor,
  teamMessagesFor,
} from "./medico-data";
import type {
  PatientProfile,
  Medication,
  SuggestedMeal,
  ClinicalEvent,
  FamilyMember,
  CareTeamMember,
  Appointment,
  DailyCheckIn,
  NutritionRecommendation,
  ClinicalMessage,
  PrescriptionItem,
  CaregiverProfile,
  AuditEntry,
  MedicationLog,
  SessionState,
  AppMode,
} from "./types";

// Simula delay de rede de 100ms a 250ms
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// Armazenamento em memória para interações do protótipo
const patientState = { ...mockPatient };
const timelineState = [...mockClinicalTimeline];
const checkInsState: DailyCheckIn[] = [];
const auditTrailState: AuditEntry[] = [...mockAuditTrail];
const medicationLogsState: MedicationLog[] = [...mockMedicationLogs];

/** O portal do paciente demonstra a criança "pac-001". */
const PORTAL_PATIENT_ID = mockPatient.id;

/** Helper seguro para resolver cuidador sem risco de undefined */
function findCaregiver(id?: string): CaregiverProfile {
  if (id) {
    const found = mockCaregivers.find((c) => c.id === id);
    if (found) return found;
  }
  return mockPrimaryCaregiver;
}

/**
 * Estado da sessão familiar (mockada):
 * - Modo padrão: "crianca" (com trava parental ativada)
 * - PIN padrão de segurança parental: "1234"
 * - Cuidador padrão: Ana Paula (Mãe)
 */
let currentAppMode: AppMode = "crianca";
let activeCaregiverId: string = mockPrimaryCaregiver.id;
let isParentLocked: boolean = true;
const PARENT_PIN = "1234";

interface MedicationActionState {
  taken: boolean;
  takenAt?: string;
  performedBy?: CaregiverProfile;
  performedAt?: string;
  verificationStatus?: "pendente" | "conferido";
  verifiedBy?: CaregiverProfile;
  verifiedAt?: string;
}

/** Estado "tomado" por id de prescrição com autoria e status de dupla checagem. */
const takenState: Record<string, MedicationActionState> = {
  "rx-2": {
    taken: true,
    takenAt: "08:05",
    performedBy: mockPrimaryCaregiver, // Mãe (Ana Paula)
    performedAt: "08:05",
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver, // Pai (Carlos Eduardo)
    verifiedAt: "08:30",
  },
};

function periodOf(time: string): Medication["period"] {
  const hour = Number(time.split(":")[0] ?? 0);
  if (hour < 12) return "manha";
  if (hour < 18) return "tarde";
  return "noite";
}

function toMedication(rx: PrescriptionItem): Medication {
  const state = takenState[rx.id];
  return {
    id: rx.id,
    name: rx.name,
    dosage: rx.dosage,
    time: rx.time,
    period: periodOf(rx.time),
    instructions: rx.instructions,
    category: rx.category,
    taken: state?.taken ?? false,
    takenAt: state?.takenAt,
    performedBy: state?.performedBy,
    performedAt: state?.performedAt,
    verificationStatus: state?.verificationStatus,
    verifiedBy: state?.verifiedBy,
    verifiedAt: state?.verifiedAt,
  };
}

/* ========================================================================
 * Gestão de Sessão, Modo (Criança vs. Cuidador), PIN e Múltiplos Cuidadores
 * ======================================================================== */

export async function getCaregivers(): Promise<CaregiverProfile[]> {
  await delay(20);
  return [...mockCaregivers];
}

export async function getActiveCaregiver(): Promise<CaregiverProfile> {
  await delay(20);
  return findCaregiver(activeCaregiverId);
}

export async function setActiveCaregiver(
  caregiverId: string
): Promise<CaregiverProfile> {
  await delay(50);
  const found = mockCaregivers.find((c) => c.id === caregiverId);
  if (!found) {
    throw new Error(`Cuidador não encontrado com id ${caregiverId}`);
  }
  activeCaregiverId = caregiverId;
  return found;
}

export async function isParentModeLocked(): Promise<boolean> {
  await delay(20);
  return isParentLocked;
}

export async function verifyParentPin(pin: string): Promise<boolean> {
  await delay(120);
  const isValid = pin.trim() === PARENT_PIN;
  if (isValid) {
    isParentLocked = false;
    currentAppMode = "cuidador";
  }
  return isValid;
}

export async function lockParentMode(): Promise<void> {
  await delay(30);
  isParentLocked = true;
  currentAppMode = "crianca";
}

export async function getSessionState(): Promise<SessionState> {
  await delay(20);
  return {
    currentMode: currentAppMode,
    activeCaregiver: findCaregiver(activeCaregiverId),
    isParentLocked,
  };
}

export async function setAppMode(
  mode: AppMode,
  pin?: string
): Promise<{ success: boolean; mode: AppMode }> {
  await delay(50);
  if (mode === "cuidador") {
    if (isParentLocked) {
      if (!pin || pin.trim() !== PARENT_PIN) {
        return { success: false, mode: currentAppMode };
      }
      isParentLocked = false;
    }
    currentAppMode = "cuidador";
    return { success: true, mode: "cuidador" };
  }

  // Ao alternar para o Modo Criança, bloqueia a trava parental para segurança
  currentAppMode = "crianca";
  isParentLocked = true;
  return { success: true, mode: "crianca" };
}

/* ========================================================================
 * Perfil do Paciente e Prescrições / Medicamentos com Dupla Checagem
 * ======================================================================== */

export async function getPatientProfile(): Promise<PatientProfile> {
  await delay();
  return { ...patientState };
}

/** Medicamentos do dia = prescrições ATIVAS feitas pelo médico (/medico/prescricao). */
export async function getMedications(): Promise<Medication[]> {
  await delay();
  return activePrescriptionsFor(PORTAL_PATIENT_ID)
    .map(toMedication)
    .sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Marca ou desmarca medicamento como tomado.
 * Grava quem realizou a ação (caregiverId ou o cuidador ativo) e horário,
 * iniciando a conferência como "pendente".
 */
export async function toggleMedicationTaken(
  id: string,
  taken: boolean,
  caregiverId?: string
): Promise<Medication | null> {
  await delay(80);
  const rx = activePrescriptionsFor(PORTAL_PATIENT_ID).find((p) => p.id === id);
  if (!rx) return null;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  if (taken) {
    const actor = findCaregiver(caregiverId ?? activeCaregiverId);

    takenState[id] = {
      taken: true,
      takenAt: timeStr,
      performedBy: actor,
      performedAt: timeStr,
      verificationStatus: "pendente",
      verifiedBy: undefined,
      verifiedAt: undefined,
    };

    // Registra na trilha de auditoria
    const audit: AuditEntry = {
      id: `audit-${Date.now()}`,
      action: "administrou_medicamento",
      description: `${actor.relationLabel} (${actor.shortName}) registrou administração de ${rx.name} (${rx.dosage}).`,
      performedBy: actor,
      performedAt: timeStr,
      targetId: id,
      verificationStatus: "pendente",
    };
    auditTrailState.unshift(audit);

    // Registra no log de medicamentos
    medicationLogsState.unshift({
      id: `log-${Date.now()}`,
      medicationId: id,
      medicationName: `${rx.name} ${rx.dosage}`,
      dosage: rx.dosage,
      takenAt: timeStr,
      performedBy: actor,
      verificationStatus: "pendente",
    });

    // Se marcado como tomado, adiciona na timeline clínica
    timelineState.unshift({
      id: `evt-${Date.now()}`,
      time: timeStr,
      title: `${rx.name} administrado`,
      description: `Registrado por ${actor.name} (${actor.relationLabel}) às ${timeStr}. Aguardando conferência cruzada.`,
      category: "Prescrição",
      tag: "Dose Confirmada",
      status: "done",
    });
  } else {
    delete takenState[id];
  }

  return toMedication(rx);
}

/**
 * Realiza a dupla checagem (conferência cruzada) de uma medicação.
 * Outro cuidador valida que a dose confere, alterando status para "conferido".
 */
export async function verifyMedicationAction(
  medicationId: string,
  verifierCaregiverId?: string
): Promise<Medication | null> {
  await delay(80);
  const current = takenState[medicationId];
  if (!current || !current.taken) return null;

  const defaultVerifierId =
    current.performedBy?.id === mockPrimaryCaregiver.id
      ? mockSecondaryCaregiver.id
      : mockPrimaryCaregiver.id;

  const verifier = findCaregiver(verifierCaregiverId ?? defaultVerifierId);

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  const updatedAction: MedicationActionState = {
    ...current,
    verificationStatus: "conferido",
    verifiedBy: verifier,
    verifiedAt: timeStr,
  };
  takenState[medicationId] = updatedAction;

  const rx = activePrescriptionsFor(PORTAL_PATIENT_ID).find(
    (p) => p.id === medicationId
  );
  const medName = rx?.name ?? medicationId;

  // Atualiza logs existentes
  const log = medicationLogsState.find((l) => l.medicationId === medicationId);
  if (log) {
    log.verificationStatus = "conferido";
    log.verifiedBy = verifier;
    log.verifiedAt = timeStr;
  }

  // Gera entrada de auditoria
  auditTrailState.unshift({
    id: `audit-verif-${Date.now()}`,
    action: "conferiu_medicamento",
    description: `${verifier.relationLabel} (${verifier.shortName}) conferiu e validou a dose de ${medName}.`,
    performedBy: verifier,
    performedAt: timeStr,
    targetId: medicationId,
    verificationStatus: "conferido",
    verifiedBy: verifier,
    verifiedAt: timeStr,
  });

  // Timeline clínica
  timelineState.unshift({
    id: `evt-verif-${Date.now()}`,
    time: timeStr,
    title: `${medName} conferido por ${verifier.relationLabel}`,
    description: `Dupla checagem validada por ${verifier.name} (${verifier.relationLabel}) às ${timeStr}.`,
    category: "Dupla Checagem",
    tag: "Conferido",
    status: "done",
  });

  if (!rx) return null;
  return toMedication(rx);
}

/** Retorna a trilha de auditoria completa da conta familiar. */
export async function getAuditTrail(): Promise<AuditEntry[]> {
  await delay(40);
  return [...auditTrailState];
}

/** Retorna o histórico de logs de administração de medicamentos. */
export async function getMedicationLogs(): Promise<MedicationLog[]> {
  await delay(40);
  return [...medicationLogsState];
}

/* ========================================================================
 * Check-in Diário com Autoria do Cuidador
 * ======================================================================== */

export async function submitCheckIn(
  checkIn: Omit<DailyCheckIn, "id" | "date">,
  caregiverId?: string
): Promise<DailyCheckIn> {
  await delay(200);
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]!;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  const actor = findCaregiver(caregiverId ?? activeCaregiverId);

  const newCheckIn: DailyCheckIn = {
    ...checkIn,
    id: `chk-${Date.now()}`,
    date: dateStr,
    performedBy: actor,
    performedAt: timeStr,
  };

  checkInsState.unshift(newCheckIn);

  // Trilha de auditoria
  auditTrailState.unshift({
    id: `audit-chk-${Date.now()}`,
    action: "registrou_sintoma",
    description: `${actor.relationLabel} (${actor.shortName}) registrou check-in diário (temperatura: ${checkIn.temperature}°C).`,
    performedBy: actor,
    performedAt: timeStr,
    targetId: newCheckIn.id,
  });

  // Gera evento na linha do tempo
  const moodLabels = {
    bem: "Disposição boa",
    "mais-ou-menos": "Sentindo um pouco de moleza/sono",
    apoio: "Necessita de apoio e carinho (dor ou tristeza)",
  };

  timelineState.unshift({
    id: `evt-chk-${Date.now()}`,
    time: timeStr,
    title: `Check-in matinal: ${moodLabels[checkIn.mood]}`,
    description: checkIn.painPart
      ? `Dor em ${checkIn.painPart} (${checkIn.painIntensity}). Temperatura: ${checkIn.temperature}°C. Registrado por ${actor.name} (${actor.relationLabel}).`
      : `Temperatura: ${checkIn.temperature}°C. Sono: ${checkIn.sleepQuality}. Registrado por ${actor.name} (${actor.relationLabel}).`,
    category: "Relato de Sintoma",
    tag: checkIn.mood === "bem" ? "Estável" : "Atenção",
    status: checkIn.mood === "apoio" ? "warning" : "info",
  });

  return newCheckIn;
}

/* ========================================================================
 * Nutrição, Comunicação e Consultas
 * ======================================================================== */

export async function getSuggestedMeals(): Promise<SuggestedMeal[]> {
  await delay();
  return [...mockSuggestedMeals];
}

/** Recomendações nutricionais registradas pela equipe (/medico/prescricao). */
export async function getNutritionRecommendations(): Promise<NutritionRecommendation[]> {
  await delay(80);
  return nutritionFor(PORTAL_PATIENT_ID);
}

/** Orientações enviadas pela equipe aos cuidadores (/medico/comunicacao). */
export async function getTeamGuidance(): Promise<ClinicalMessage[]> {
  await delay(80);
  return teamMessagesFor(PORTAL_PATIENT_ID);
}

export async function getClinicalTimeline(): Promise<ClinicalEvent[]> {
  await delay();
  return [...timelineState];
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  await delay();
  return [...mockFamilyMembers];
}

export async function getCareTeam(): Promise<CareTeamMember[]> {
  await delay();
  return [...mockCareTeam];
}

export async function getAppointments(): Promise<Appointment[]> {
  await delay();
  return [...mockAppointments];
}
