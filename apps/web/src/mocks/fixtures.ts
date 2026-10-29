import {
  PatientProfile,
  Medication,
  SuggestedMeal,
  ClinicalEvent,
  FamilyMember,
  CareTeamMember,
  Appointment,
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

/** 3 remédios essenciais do dia (manhã, tarde, noite). */
export const mockMedications: Medication[] = [
  {
    id: "med-2",
    name: "Dexametasona",
    dosage: "1 comprimido",
    time: "08:00",
    period: "manha",
    instructions: "Com o café da manhã.",
    category: "corticoide",
    taken: true,
    takenAt: "08:05",
    performedBy: mockPrimaryCaregiver,
    performedAt: "08:05",
    verificationStatus: "conferido",
    verifiedBy: mockSecondaryCaregiver,
    verifiedAt: "08:30",
  },
  {
    id: "med-1",
    name: "Ondansetrona",
    dosage: "1 comprimido",
    time: "14:00",
    period: "tarde",
    instructions: "Depois do almoço, com água.",
    category: "antiemetico",
    taken: false,
  },
  {
    id: "med-3",
    name: "Capecitabina",
    dosage: "1 comprimido",
    time: "20:00",
    period: "noite",
    instructions: "30 min após o jantar.",
    category: "quimio-oral",
    taken: false,
  },
];

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

export const mockClinicalTimeline: ClinicalEvent[] = [
  {
    id: "evt-1",
    time: "14:00",
    title: "Ondansetrona 8mg administrada",
    description: "Prevenção de êmese tardia. Confirmado pelo cuidador familiar.",
    category: "Prescrição",
    tag: "Pontual",
    status: "done",
  },
  {
    id: "evt-2",
    time: "12:40",
    title: "Náusea leve relatada pela criança",
    description: "Check-in por emoji/voz: 'Senti a boca amarga, mas a água com gotinhas de limão ajudou'.",
    category: "Relato de Sintoma",
    tag: "Grau 1",
    status: "warning",
  },
  {
    id: "evt-3",
    time: "12:15",
    title: "Almoço: Aceitação de 50% do prato",
    description: "Comeu metade do purê com frango desfiado. Boa tolerância gástrica imediata.",
    category: "Aporte Nutricional",
    tag: "Almoço",
    status: "done",
  },
  {
    id: "evt-4",
    time: "08:05",
    title: "Dexametasona 4mg ingerida",
    description: "Criança bem disposta, brincou com blocos de montar.",
    category: "Início da Rotina",
    tag: "Disposição Boa",
    status: "done",
  },
];

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: "fam-1",
    name: "Ana Paula",
    relation: "Mãe (Cuidadora Principal)",
    avatarUrl: "/illustrations/onboarding-cuidado.jpg",
    phone: "(11) 98111-2233",
    isEmergencyContact: true,
    lastMessage: "Clarinha acabou de tomar o lanche da tarde!",
  },
  {
    id: "fam-2",
    name: "Carlos Eduardo",
    relation: "Pai",
    avatarUrl: "/illustrations/onboarding-familia.jpg",
    phone: "(11) 98222-3344",
    isEmergencyContact: true,
    lastMessage: "Estou a caminho da farmácia para pegar o colírio.",
  },
  {
    id: "fam-3",
    name: "Vovó Marlene",
    relation: "Avó",
    avatarUrl: "/illustrations/onboarding-familia.jpg",
    phone: "(11) 98333-4455",
    isEmergencyContact: false,
    lastMessage: "Mandei um áudio de historinha pra ela ouvir antes de dormir! ❤️",
  },
];

export const mockCareTeam: CareTeamMember[] = [
  {
    id: "nurse-1",
    name: "Enfermeira Clara Mendes",
    role: "Navegadora Oncológica Pediátrica",
    avatarUrl: "/illustrations/equipe-cuidado.jpg",
    phone: "(11) 98765-4321",
    whatsapp: "5511987654321",
    status: "online",
  },
  {
    id: "doc-1",
    name: "Dr. Roberto Silveira",
    role: "Oncologista Pediátrico",
    avatarUrl: "/illustrations/equipe-cuidado.jpg",
    phone: "(11) 3456-7890",
    whatsapp: "551134567890",
    status: "plantao",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "app-1",
    title: "Consulta Médica Presencial - Retorno de Ciclo",
    doctorName: "Dr. Roberto Silveira",
    specialty: "Oncologia Pediátrica",
    date: "2026-10-24",
    time: "09:30",
    location: "Centro Oncológico Integrado - Consultório 304",
    notes: "Trazer exames de hemograma da semana.",
  },
  {
    id: "app-2",
    title: "Hemograma Completo + Plaquetas",
    doctorName: "Laboratório SIGLO",
    specialty: "Coleta Laboratorial",
    date: "2026-10-22",
    time: "08:00",
    location: "Unidade Kids - Coleta Humanizada",
    notes: "Jejum leve de 3 horas.",
  },
];
