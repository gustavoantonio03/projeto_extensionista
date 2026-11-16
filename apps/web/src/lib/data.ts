import {
  mockPatient,
  mockCaregivers,
  mockPrimaryCaregiver,
  mockSecondaryCaregiver,
  mockAuditTrail,
  mockMedicationLogs,
} from "../mocks/fixtures";
import {
  activePrescriptionsFor,
} from "./medico-data";
import type {
  Medication,
  DailyCheckIn,
  PrescriptionItem,
  CaregiverProfile,
  AuditEntry,
  MedicationLog,
  SessionState,
  SessionRole,
  AppMode,
  UserDoc,
} from "./types";
import { mockTeamUser } from "../mocks/medico-fixtures";
import { caregiverTag } from "./caregiver";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

// Simula delay de rede de 100ms a 250ms
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// Armazenamento em memória para interações do protótipo
const patientState = { ...mockPatient };
const checkInsState: DailyCheckIn[] = [];
const auditTrailState: AuditEntry[] = mockAuditTrail.map((e) => ({ ...e }));
const medicationLogsState: MedicationLog[] = mockMedicationLogs.map((l) => ({
  ...l,
}));

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
 * Estado da sessão integrada ao Firebase Auth + Firestore users/{uid}:
 * - Criança (`patient`) → modo "crianca"
 * - Cuidador (`caregiver`) → modo "cuidador"
 * - Médico (`doctor`) → modo "cuidador" com rota para "/medico"
 */
let currentSessionRole: SessionRole = "cuidador";
let currentAppMode: AppMode = "cuidador";
let activeCaregiverId: string = mockPrimaryCaregiver.id;
let currentFirebaseUserDoc: UserDoc | null = null;

export function syncFirebaseSession(userDoc: UserDoc): void {
  currentFirebaseUserDoc = userDoc;
  if (userDoc.role === "patient") {
    currentSessionRole = "crianca";
    currentAppMode = "crianca";
  } else if (userDoc.role === "doctor") {
    currentSessionRole = "medico";
    currentAppMode = "cuidador";
  } else {
    currentSessionRole = "cuidador";
    currentAppMode = "cuidador";
    // Mapeia para o cuidador correspondente se houver relação
    if (userDoc.relation?.toLowerCase().includes("pai")) {
      activeCaregiverId = "cg-pai";
    } else if (userDoc.relation?.toLowerCase().includes("avó") || userDoc.relation?.toLowerCase().includes("avo")) {
      activeCaregiverId = "cg-avo";
    } else {
      activeCaregiverId = "cg-mae";
    }
  }
}

export function clearFirebaseSession(): void {
  currentFirebaseUserDoc = null;
  currentSessionRole = "cuidador";
  currentAppMode = "cuidador";
  activeCaregiverId = mockPrimaryCaregiver.id;
}

function computeUserLabel(): string {
  if (currentFirebaseUserDoc) {
    if (currentFirebaseUserDoc.role === "patient") {
      return `Criança (${currentFirebaseUserDoc.shortName || currentFirebaseUserDoc.displayName})`;
    }
    if (currentFirebaseUserDoc.role === "doctor") {
      return currentFirebaseUserDoc.displayName || mockTeamUser.name;
    }
    const rel = currentFirebaseUserDoc.relation || "Mãe";
    const name = currentFirebaseUserDoc.shortName || currentFirebaseUserDoc.displayName;
    return `${rel} (${name})`;
  }

  if (currentSessionRole === "crianca") {
    return `Criança (${patientState.preferredName})`;
  }
  if (currentSessionRole === "medico") {
    return mockTeamUser.name;
  }
  return caregiverTag(findCaregiver(activeCaregiverId));
}


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
    performedBy: mockPrimaryCaregiver, // Mãe (Ana)
    performedAt: "08:05",
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver, // Pai (Carlos)
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
 * Gestão de Sessão Isolada (Logins Separados: Criança, Cuidadores e Médico)
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
  await delay(40);
  const found = mockCaregivers.find((c) => c.id === caregiverId);
  if (!found) {
    throw new Error(`Cuidador não encontrado com id ${caregiverId}`);
  }
  activeCaregiverId = caregiverId;
  currentSessionRole = "cuidador";
  currentAppMode = "cuidador";
  return found;
}

export async function getSessionState(): Promise<SessionState> {
  await delay(20);
  return {
    role: currentSessionRole,
    currentMode: currentAppMode,
    activeCaregiver: findCaregiver(activeCaregiverId),
    userLabel: computeUserLabel(),
    firebaseUid: currentFirebaseUserDoc?.uid,
    firebaseRole: currentFirebaseUserDoc?.role,
  };
}

export async function logoutSession(): Promise<void> {
  await delay(40);
  try {
    await signOut(auth);
  } catch (err) {
    // Silencia caso não haja usuário Firebase ativo
  }
  clearFirebaseSession();
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
      subject: `${rx.name} dada por ${actor.relationLabel}`,
      description: `${caregiverTag(actor)} deu ${rx.name} (${rx.dosage}).`,
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
  } else {
    delete takenState[id];

    // A trilha é preservada: o registro pendente é marcado como desfeito e deixa de
    // aparecer nas pendências de conferência; o log de administração é retirado.
    for (const entry of auditTrailState) {
      if (
        entry.action === "administrou_medicamento" &&
        entry.targetId === id &&
        entry.verificationStatus === "pendente"
      ) {
        entry.verificationStatus = undefined;
        entry.description = `${entry.description} (registro desfeito)`;
      }
    }
    for (let i = medicationLogsState.length - 1; i >= 0; i--) {
      const log = medicationLogsState[i]!;
      if (log.medicationId === id && log.verificationStatus === "pendente") {
        medicationLogsState.splice(i, 1);
      }
    }
  }

  return toMedication(rx);
}

/**
 * Realiza a dupla checagem (conferência cruzada) de uma medicação.
 * Outro cuidador valida que a dose confere, alterando status para "conferido".
 * Um cuidador nunca confere o próprio registro (retorna null).
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
  if (current.performedBy && current.performedBy.id === verifier.id) {
    return null;
  }

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
  const log = medicationLogsState.find(
    (l) => l.medicationId === medicationId && l.verificationStatus === "pendente"
  );
  if (log) {
    log.verificationStatus = "conferido";
    log.verifiedBy = verifier;
    log.verifiedAt = timeStr;
  }

  // Fecha a entrada original ("deu a medicação") que estava pendente
  for (const entry of auditTrailState) {
    if (
      entry.action === "administrou_medicamento" &&
      entry.targetId === medicationId &&
      entry.verificationStatus === "pendente"
    ) {
      entry.verificationStatus = "conferido";
      entry.verifiedBy = verifier;
      entry.verifiedAt = timeStr;
    }
  }

  // Gera entrada de auditoria
  auditTrailState.unshift({
    id: `audit-verif-${Date.now()}`,
    action: "conferiu_medicamento",
    description: `${caregiverTag(verifier)} conferiu a dose de ${medName}.`,
    performedBy: verifier,
    performedAt: timeStr,
    targetId: medicationId,
    verificationStatus: "conferido",
    verifiedBy: verifier,
    verifiedAt: timeStr,
  });

  if (!rx) return null;
  return toMedication(rx);
}

/**
 * Conferência de registros que não são medicação (ex.: temperatura/check-in).
 * Também impede que o mesmo cuidador valide o próprio registro.
 */
export async function verifyAuditEntry(
  entryId: string,
  verifierCaregiverId?: string
): Promise<AuditEntry | null> {
  await delay(80);
  const entry = auditTrailState.find((e) => e.id === entryId);
  if (!entry || entry.verificationStatus !== "pendente") return null;

  const verifier = findCaregiver(verifierCaregiverId ?? activeCaregiverId);
  if (entry.performedBy.id === verifier.id) return null;

  // Doses seguem o fluxo próprio (atualiza log, timeline e prescrição)
  if (entry.action === "administrou_medicamento" && entry.targetId) {
    await verifyMedicationAction(entry.targetId, verifier.id);
    return auditTrailState.find((e) => e.id === entryId) ?? null;
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  entry.verificationStatus = "conferido";
  entry.verifiedBy = verifier;
  entry.verifiedAt = timeStr;

  const checkIn = checkInsState.find((c) => c.id === entry.targetId);
  if (checkIn) {
    checkIn.verifiedBy = verifier;
    checkIn.verifiedAt = timeStr;
  }

  auditTrailState.unshift({
    id: `audit-verif-${Date.now()}`,
    action: "conferiu_registro",
    description: `${caregiverTag(verifier)} conferiu o registro de ${caregiverTag(
      entry.performedBy
    )} (${entry.performedAt}).`,
    performedBy: verifier,
    performedAt: timeStr,
    targetId: entry.targetId,
    verificationStatus: "conferido",
    verifiedBy: verifier,
    verifiedAt: timeStr,
  });

  return entry;
}

/** Retorna a trilha de auditoria completa da conta familiar. */
export async function getAuditTrail(): Promise<AuditEntry[]> {
  await delay(40);
  return [...auditTrailState];
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
  const authorLabel = checkIn.authorLabel || (actor ? caregiverTag(actor) : "Cuidador");

  const newCheckIn: DailyCheckIn = {
    ...checkIn,
    id: `chk-${Date.now()}`,
    date: dateStr,
    performedBy: actor,
    authorLabel,
    performedAt: timeStr,
  };

  checkInsState.unshift(newCheckIn);

  // Trilha de auditoria (entra como pendente de conferência por outro cuidador)
  auditTrailState.unshift({
    id: `audit-chk-${Date.now()}`,
    action: "registrou_sintoma",
    subject: `Temperatura ${checkIn.temperature.toFixed(1)}°C por ${authorLabel}`,
    description: `${authorLabel} registrou temperatura ${checkIn.temperature.toFixed(
      1
    )}°C.`,
    performedBy: actor,
    performedAt: timeStr,
    targetId: newCheckIn.id,
    verificationStatus: "pendente",
  });

  return newCheckIn;
}

/** Conferência cruzada de um check-in por outro cuidador. */
export async function verifyCheckIn(
  checkInId: string,
  verifierCaregiverId?: string
): Promise<DailyCheckIn | null> {
  const entry = auditTrailState.find(
    (e) => e.targetId === checkInId && e.verificationStatus === "pendente"
  );
  if (!entry) return null;
  const verified = await verifyAuditEntry(entry.id, verifierCaregiverId);
  if (!verified) return null;
  const checkIn = checkInsState.find((c) => c.id === checkInId);
  return checkIn ? { ...checkIn } : null;
}

/** Registro rápido da refeição, com autoria do cuidador ativo na trilha familiar. */
export async function registerMeal(
  status: "tudo" | "metade" | "enjoo",
  caregiverId?: string
): Promise<AuditEntry> {
  await delay(60);
  const actor = findCaregiver(caregiverId ?? activeCaregiverId);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const labels = {
    tudo: "comeu quase tudo",
    metade: "comeu a metade",
    enjoo: "ficou enjoada",
  } as const;

  const entry: AuditEntry = {
    id: `audit-meal-${Date.now()}`,
    action: "registrou_refeicao",
    subject: `Refeição (${labels[status]}) por ${actor.relationLabel}`,
    description: `${caregiverTag(actor)} registrou refeição: ${labels[status]}.`,
    performedBy: actor,
    performedAt: timeStr,
    targetId: `meal-${Date.now()}`,
  };
  auditTrailState.unshift(entry);
  return entry;
}
