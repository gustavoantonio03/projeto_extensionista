import {
  mockTeamUser,
  mockMonitoredPatients,
  mockPatient360,
  fallback360,
  mockPrescriptions,
  mockPrescriptionChanges,
  mockNutritionRecs,
  mockClinicalMessages,
} from "../mocks/medico-fixtures";
import type {
  TeamUser,
  MonitoredPatient,
  Patient360,
  PrescriptionItem,
  PrescriptionChange,
  NutritionRecommendation,
  ClinicalMessage,
} from "./types";

/**
 * Camada de dados MOCK do Portal do Médico (Fase 1B).
 * Estado em memória: persiste durante a navegação (SPA) e zera ao recarregar a página.
 * Na Fase 2 estas funções passam a chamar a API (mesmas assinaturas).
 */

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T,>(v: T): T => structuredClone(v);

let prescriptions: PrescriptionItem[] = clone(mockPrescriptions);
let changes: PrescriptionChange[] = clone(mockPrescriptionChanges);
let nutrition: NutritionRecommendation[] = clone(mockNutritionRecs);
let messages: ClinicalMessage[] = clone(mockClinicalMessages);

export function nowStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ---------- Leitura síncrona (consumida pela camada do portal do paciente) ---------- */
export function activePrescriptionsFor(patientId: string): PrescriptionItem[] {
  return prescriptions.filter((p) => p.patientId === patientId && p.status === "ativo");
}
export function nutritionFor(patientId: string): NutritionRecommendation[] {
  return nutrition.filter((n) => n.patientId === patientId);
}
export function teamMessagesFor(patientId: string): ClinicalMessage[] {
  return messages.filter((m) => m.patientId === patientId && m.direction === "equipe-para-cuidador");
}

/* ---------- API assíncrona (mock) ---------- */
export async function getTeamUser(): Promise<TeamUser> {
  await delay(40);
  return clone(mockTeamUser);
}

export async function getMonitoredPatients(): Promise<MonitoredPatient[]> {
  await delay();
  return clone(mockMonitoredPatients);
}

export async function getMonitoredPatient(id: string): Promise<MonitoredPatient | null> {
  await delay();
  const p = mockMonitoredPatients.find((x) => x.id === id);
  return p ? clone(p) : null;
}

export async function getPatient360(id: string): Promise<Patient360> {
  await delay(160);
  return clone(mockPatient360[id] ?? fallback360(id));
}

export async function getPrescriptions(patientId: string): Promise<PrescriptionItem[]> {
  await delay();
  return clone(prescriptions.filter((p) => p.patientId === patientId));
}

export type PrescriptionInput = Omit<PrescriptionItem, "id" | "status"> & { id?: string };

export async function savePrescription(input: PrescriptionInput, by: string): Promise<PrescriptionItem> {
  await delay(160);
  const existing = input.id ? prescriptions.find((p) => p.id === input.id) : undefined;
  if (existing) {
    const before = `${existing.dosage} às ${existing.time}`;
    Object.assign(existing, { ...input, id: existing.id });
    changes.unshift({
      id: `ch-${Date.now()}`,
      patientId: existing.patientId,
      at: nowStamp(),
      by,
      summary: `${existing.name} ajustado: ${before} → ${existing.dosage} às ${existing.time}.`,
    });
    return clone(existing);
  }
  const created: PrescriptionItem = { ...input, id: `rx-${Date.now()}`, status: "ativo" };
  prescriptions.push(created);
  changes.unshift({
    id: `ch-${Date.now()}`,
    patientId: created.patientId,
    at: nowStamp(),
    by,
    summary: `${created.name} prescrito: ${created.dosage} às ${created.time}.`,
  });
  return clone(created);
}

export async function setPrescriptionStatus(
  id: string,
  status: PrescriptionItem["status"],
  by: string
): Promise<PrescriptionItem | null> {
  await delay(120);
  const item = prescriptions.find((p) => p.id === id);
  if (!item) return null;
  item.status = status;
  changes.unshift({
    id: `ch-${Date.now()}`,
    patientId: item.patientId,
    at: nowStamp(),
    by,
    summary: `${item.name} ${status === "suspenso" ? "suspenso" : "reativado"}.`,
  });
  return clone(item);
}

export async function getPrescriptionChanges(patientId: string): Promise<PrescriptionChange[]> {
  await delay(80);
  return clone(changes.filter((c) => c.patientId === patientId));
}

export async function getNutritionRecs(patientId: string): Promise<NutritionRecommendation[]> {
  await delay(80);
  return clone(nutrition.filter((n) => n.patientId === patientId));
}

export async function addNutritionRec(
  input: Pick<NutritionRecommendation, "patientId" | "title" | "text">,
  by: string
): Promise<NutritionRecommendation> {
  await delay(120);
  const rec: NutritionRecommendation = { ...input, id: `nr-${Date.now()}`, by, at: nowStamp() };
  nutrition.unshift(rec);
  return clone(rec);
}

export async function getMessages(): Promise<ClinicalMessage[]> {
  await delay();
  return clone(messages);
}

export async function sendTeamMessage(
  input: Pick<ClinicalMessage, "patientId" | "text" | "priority">,
  author: string
): Promise<ClinicalMessage> {
  await delay(160);
  const msg: ClinicalMessage = {
    ...input,
    id: `cm-${Date.now()}`,
    direction: "equipe-para-cuidador",
    author,
    at: nowStamp(),
    read: true,
  };
  messages.unshift(msg);
  return clone(msg);
}

export async function markMessageRead(id: string): Promise<void> {
  await delay(40);
  const m = messages.find((x) => x.id === id);
  if (m) m.read = true;
}

/** Útil para testes/demonstração: restaura o estado inicial dos mocks. */
export function resetMedicoMocks(): void {
  prescriptions = clone(mockPrescriptions);
  changes = clone(mockPrescriptionChanges);
  nutrition = clone(mockNutritionRecs);
  messages = clone(mockClinicalMessages);
}
