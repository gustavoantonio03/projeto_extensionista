import {
  PatientProfile,
  Medication,
  SuggestedMeal,
  ClinicalEvent,
  FamilyMember,
  CareTeamMember,
  Appointment,
} from "../lib/types";

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

export const mockMedications: Medication[] = [
  {
    id: "med-1",
    name: "Ondansetrona",
    dosage: "8mg • 1 comprimido",
    time: "14:00",
    period: "tarde",
    instructions: "Tomar com 1 copo de água cheinho logo após o almoço para prevenir enjoo.",
    category: "antiemetico",
    taken: false,
  },
  {
    id: "med-2",
    name: "Dexametasona",
    dosage: "4mg • 1 comprimido",
    time: "08:00",
    period: "manha",
    instructions: "Tomar junto com o café da manhã.",
    category: "corticoide",
    taken: true,
    takenAt: "08:05",
  },
  {
    id: "med-3",
    name: "Capecitabina",
    dosage: "500mg • Quimioterapia Oral",
    time: "20:00",
    period: "noite",
    instructions: "Tomar 30 minutos após o jantar com bastante água.",
    category: "quimio-oral",
    taken: false,
  },
];

export const mockSuggestedMeals: SuggestedMeal[] = [
  {
    id: "meal-1",
    title: "Sopa Suave de Abóbora e Mandioquinha",
    description: "Com abóbora kabocha, cenoura e mandioquinha cozidas com gengibre sutil.",
    tag: "Textura Aveludada",
    calories: 280,
    highlight: "Fácil de engolir e hidratante",
    imageSrc: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "meal-2",
    title: "Purê Cremoso com Franguinho Desfiado",
    description: "Peito de frango cozido bem úmido com purê de batata caseiro.",
    tag: "Proteína Fácil",
    calories: 340,
    highlight: "Alta proteína e sem resíduo",
    imageSrc: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80",
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
