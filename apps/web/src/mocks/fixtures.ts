import {
  PatientProfile,
  SuggestedMeal,
  CaregiverProfile,
  AuditEntry,
  MedicationLog,
  HabitItem,
} from "../lib/types";

export const mockPrimaryCaregiver: CaregiverProfile = {
  id: "cg-1",
  name: "Ana Paula Albuquerque",
  shortName: "Ana",
  displayName: "Ana Paula",
  relation: "mae",
  relationLabel: "Mãe",
  avatarUrl: "/illustrations/onboarding-cuidado.jpg",
  isPrimary: true,
  phone: "(11) 98111-2233",
};

export const mockSecondaryCaregiver: CaregiverProfile = {
  id: "cg-2",
  name: "Carlos Eduardo Albuquerque",
  shortName: "Carlos",
  displayName: "Carlos Eduardo",
  relation: "pai",
  relationLabel: "Pai",
  avatarUrl: "/illustrations/onboarding-familia.jpg",
  isPrimary: false,
  phone: "(11) 98222-3344",
};

export const mockTertiaryCaregiver: CaregiverProfile = {
  id: "cg-3",
  name: "Helena Marlene Albuquerque",
  shortName: "Helena",
  displayName: "Helena",
  relation: "avo",
  relationLabel: "Avó",
  avatarUrl: "/illustrations/onboarding-familia.jpg",
  isPrimary: false,
  phone: "(11) 98333-4455",
};

export const mockCaregivers: CaregiverProfile[] = [
  mockPrimaryCaregiver,
  mockSecondaryCaregiver,
  mockTertiaryCaregiver,
];

export const mockPatient: PatientProfile = {
  id: "pac-001",
  name: "Maria Clara Albuquerque",
  preferredName: "Clarinha",
  age: "7 anos",
  birthDate: "14/05/2019",
  diagnosis: "Leucemia Linfoide Aguda (LLA) - Fase de Manutenção",
  treatmentCycle: "Ciclo 3 - Dia 12 de 28",
  hospital: "Hospital Oncológico Pediátrico Central",
  avatarUrl: "/illustrations/onboarding-cuidado.jpg",
  caregiverName: "Ana Paula (Mãe)",
  status: "estavel",
};


/** 3 hábitos simples da rotina. */
export const mockDailyHabits: HabitItem[] = [
  { id: "agua", emoji: "🥤", label: "Beber água", detail: "8 copos", done: false },
  { id: "caminhada", emoji: "🚶", label: "Caminhada leve", detail: "15 min", done: true },
  { id: "sono", emoji: "🌙", label: "Dormir bem", detail: "8 h", done: true },
];

export const mockMedicationLogs: MedicationLog[] = [
  {
    id: "log-1",
    medicationId: "rx-2",
    medicationName: "Dexametasona",
    dosage: "1 comprimido",
    takenAt: "08:05",
    performedBy: mockPrimaryCaregiver,
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver,
    verifiedAt: "08:30",
  },
];

export const mockAuditTrail: AuditEntry[] = [
  {
    id: "audit-4",
    action: "registrou_sintoma",
    description: "Avó (Helena) registrou temperatura 36.7°C.",
    subject: "36.7°C",
    performedBy: mockTertiaryCaregiver,
    performedAt: "10:30",
    targetId: "temp-1030",
    verificationStatus: "pendente",
  },
  {
    id: "audit-1",
    action: "conferiu_medicamento",
    description: "Pai (Carlos Eduardo) conferiu a dose de Dexametasona.",
    subject: "Dexametasona",
    performedBy: mockSecondaryCaregiver,
    performedAt: "08:30",
    targetId: "rx-2",
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver,
    verifiedAt: "08:30",
  },
  {
    id: "audit-2",
    action: "administrou_medicamento",
    description: "Mãe (Ana Paula) deu Dexametasona.",
    subject: "Dexametasona",
    performedBy: mockPrimaryCaregiver,
    performedAt: "08:05",
    targetId: "rx-2",
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver,
    verifiedAt: "08:30",
  },
  {
    id: "audit-3",
    action: "registrou_sintoma",
    description: "Mãe (Ana Paula) registrou temperatura 36.5°C.",
    subject: "36.5°C",
    performedBy: mockPrimaryCaregiver,
    performedAt: "07:45",
    targetId: "temp-0745",
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver,
    verifiedAt: "07:52",
  },
];

export const mockSuggestedMeals: SuggestedMeal[] = [
  {
    id: "meal-1",
    title: "Sopa de abóbora",
    description: "Morna e aveludada.",
    tag: "Almoço",
    calories: 280,
    highlight: "Fácil de engolir",
    imageSrc: "",
  },
  {
    id: "meal-2",
    title: "Purê com frango desfiado",
    description: "Úmido e sem tempero forte.",
    tag: "Jantar",
    calories: 340,
    highlight: "Proteína leve",
    imageSrc: "",
  },
];
