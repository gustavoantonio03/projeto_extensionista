import {
  mockPatient,
  mockSuggestedMeals,
  mockClinicalTimeline,
  mockFamilyMembers,
  mockCareTeam,
  mockAppointments,
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
} from "./types";

// Simula delay de rede de 100ms a 250ms
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// Armazenamento em memória para interações do protótipo
const patientState = { ...mockPatient };
const timelineState = [...mockClinicalTimeline];
const checkInsState: DailyCheckIn[] = [];

/** O portal do paciente demonstra a criança "pac-001". */
const PORTAL_PATIENT_ID = mockPatient.id;

/** Estado "tomado" por id de prescrição (a prescrição em si pertence ao Portal do Médico). */
const takenState: Record<string, { taken: boolean; takenAt?: string }> = {
  "rx-2": { taken: true, takenAt: "08:05" },
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
  };
}

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

export async function toggleMedicationTaken(
  id: string,
  taken: boolean
): Promise<Medication | null> {
  await delay(80);
  const rx = activePrescriptionsFor(PORTAL_PATIENT_ID).find((p) => p.id === id);
  if (!rx) return null;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  takenState[id] = { taken, takenAt: taken ? timeStr : undefined };

  // Se marcado como tomado, adiciona na timeline clínica
  if (taken) {
    timelineState.unshift({
      id: `evt-${Date.now()}`,
      time: timeStr,
      title: `${rx.name} administrado`,
      description: "Confirmado pelo cuidador familiar no aplicativo.",
      category: "Prescrição",
      tag: "Dose Confirmada",
      status: "done",
    });
  }

  return toMedication(rx);
}

export async function submitCheckIn(
  checkIn: Omit<DailyCheckIn, "id" | "date">
): Promise<DailyCheckIn> {
  await delay(200);
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]!;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  const newCheckIn: DailyCheckIn = {
    ...checkIn,
    id: `chk-${Date.now()}`,
    date: dateStr,
  };

  checkInsState.unshift(newCheckIn);

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
      ? `Dor relatada em ${checkIn.painPart} (${checkIn.painIntensity}). Temperatura: ${checkIn.temperature}°C.`
      : `Temperatura: ${checkIn.temperature}°C. Sono: ${checkIn.sleepQuality}.`,
    category: "Relato de Sintoma",
    tag: checkIn.mood === "bem" ? "Estável" : "Atenção",
    status: checkIn.mood === "apoio" ? "warning" : "info",
  });

  return newCheckIn;
}

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
