import type {
  TeamUser,
  MonitoredPatient,
  Patient360,
  PrescriptionItem,
  PrescriptionChange,
  NutritionRecommendation,
  ClinicalMessage,
} from "../lib/types";

/** Todos os dados abaixo são FICTÍCIOS (LGPD: nenhum PII real em fixtures). */

export const mockTeamUser: TeamUser = {
  id: "team-1",
  name: "Dr. Roberto Silveira",
  role: "medico",
  roleLabel: "Oncologista Pediátrico",
  crm: "CRM-SP 000000",
};

export const mockMonitoredPatients: MonitoredPatient[] = [
  {
    id: "pac-001",
    name: "Maria Clara Albuquerque",
    preferredName: "Clarinha",
    age: "7 anos",
    bed: "A-12",
    treatment: "LLA",
    cycle: "Ciclo 3 · Dia 12/28",
    caregiver: "Ana Paula (mãe)",
    caregiverPhone: "(11) 98111-2233",
    severity: "atencao",
    alerts: [
      { id: "al-1", kind: "recusa-alimentar", text: "Aceitou só 50% do almoço; náusea leve", at: "12:40" },
    ],
    lastCheckIn: "12:42",
    adherencePct: 86,
    lastTemperature: 36.5,
    avatarUrl: "/illustrations/onboarding-cuidado.jpg",
  },
  {
    id: "pac-002",
    name: "Pedro Henrique Matos",
    preferredName: "Pedrinho",
    age: "5 anos",
    bed: "A-03",
    treatment: "LMA",
    cycle: "Ciclo 1 · Dia 8/21",
    caregiver: "Carla Matos (mãe)",
    caregiverPhone: "(11) 97000-1122",
    severity: "critico",
    alerts: [
      { id: "al-2", kind: "febre", text: "Febre 38,4 °C (neutropenia esperada)", at: "10:15" },
      { id: "al-3", kind: "dor", text: "Dor forte na barriga reportada no check-in", at: "10:18" },
    ],
    lastCheckIn: "10:18",
    adherencePct: 71,
    lastTemperature: 38.4,
    avatarUrl: "/illustrations/onboarding-rotina.jpg",
  },
  {
    id: "pac-003",
    name: "Sofia Ribeiro Lima",
    preferredName: "Sofi",
    age: "9 anos",
    bed: "B-07",
    treatment: "Tumor Sólido",
    cycle: "Ciclo 5 · Dia 3/21",
    caregiver: "Marcos Lima (pai)",
    caregiverPhone: "(11) 96000-3344",
    severity: "estavel",
    alerts: [],
    lastCheckIn: "09:05",
    adherencePct: 96,
    lastTemperature: 36.4,
    avatarUrl: "/illustrations/onboarding-familia.jpg",
  },
  {
    id: "pac-004",
    name: "Lucas Andrade Souza",
    preferredName: "Lucas",
    age: "11 anos",
    bed: "B-02",
    treatment: "Linfoma",
    cycle: "Ciclo 2 · Dia 15/28",
    caregiver: "Patrícia Souza (mãe)",
    caregiverPhone: "(11) 95000-5566",
    severity: "atencao",
    alerts: [
      { id: "al-4", kind: "dose-atrasada", text: "Ondansetrona 14:00 sem confirmação há 2 h", at: "16:00" },
      { id: "al-5", kind: "sem-checkin", text: "Sem check-in hoje", at: "—" },
    ],
    lastCheckIn: "—",
    adherencePct: 58,
    lastTemperature: 36.9,
    avatarUrl: "/illustrations/equipe-cuidado.jpg",
  },
  {
    id: "pac-005",
    name: "Isabela Torres Nunes",
    preferredName: "Isa",
    age: "6 anos",
    bed: "A-09",
    treatment: "LLA",
    cycle: "Manutenção · Mês 4",
    caregiver: "Fernanda Nunes (mãe)",
    caregiverPhone: "(11) 94000-7788",
    severity: "estavel",
    alerts: [],
    lastCheckIn: "08:30",
    adherencePct: 100,
    lastTemperature: 36.6,
    avatarUrl: "/illustrations/mascote-lumi.jpg",
  },
  {
    id: "pac-006",
    name: "Gabriel Moreira Cunha",
    preferredName: "Gabi",
    age: "8 anos",
    bed: "B-11",
    treatment: "Tumor Sólido",
    cycle: "Ciclo 4 · Dia 19/21",
    caregiver: "Renato Cunha (pai)",
    caregiverPhone: "(11) 93000-9900",
    severity: "atencao",
    alerts: [{ id: "al-6", kind: "dor", text: "Dor moderada nas pernas por 2 dias seguidos", at: "ontem" }],
    lastCheckIn: "09:50",
    adherencePct: 90,
    lastTemperature: 37.1,
    avatarUrl: "/illustrations/onboarding-cuidado.jpg",
  },
];

const months = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"];

function growthFor(baseWeight: number, baseHeight: number) {
  return months.map((label, i) => ({
    label,
    weightKg: Math.round((baseWeight + i * 0.35) * 10) / 10,
    heightCm: Math.round(baseHeight + i * 0.6),
  }));
}

export const mockPatient360: Record<string, Patient360> = {
  "pac-001": {
    patientId: "pac-001",
    diagnosis: "Leucemia Linfoide Aguda (LLA) — fase de manutenção",
    allergies: ["Sem alergias medicamentosas conhecidas"],
    growth: growthFor(19.6, 114),
    symptoms: [
      { id: "s1", date: "19/10", mood: "mais-ou-menos", painPart: "barriga", painIntensity: "pouco", temperature: 36.5, note: "Gosto metálico; água com limão ajudou." },
      { id: "s2", date: "18/10", mood: "bem", temperature: 36.4 },
      { id: "s3", date: "17/10", mood: "bem", temperature: 36.6 },
      { id: "s4", date: "16/10", mood: "mais-ou-menos", painPart: "cabeca", painIntensity: "pouco", temperature: 36.8 },
    ],
    adherence: [
      { label: "Seg", taken: 3, expected: 3 },
      { label: "Ter", taken: 3, expected: 3 },
      { label: "Qua", taken: 2, expected: 3 },
      { label: "Qui", taken: 3, expected: 3 },
      { label: "Sex", taken: 2, expected: 3 },
      { label: "Sáb", taken: 3, expected: 3 },
      { label: "Dom", taken: 2, expected: 3 },
    ],
    intercurrences: [
      { id: "i1", date: "12/10", title: "Náusea tardia grau 1", description: "Resolvida com ondansetrona; sem necessidade de internação.", severity: "atencao" },
      { id: "i2", date: "02/10", title: "Coleta de hemograma", description: "Neutrófilos 1.800/mm³ — dentro do esperado para o ciclo.", severity: "estavel" },
    ],
  },
  "pac-002": {
    patientId: "pac-002",
    diagnosis: "Leucemia Mieloide Aguda (LMA) — indução",
    allergies: ["Dipirona (reação cutânea)"],
    growth: growthFor(17.2, 108),
    symptoms: [
      { id: "s5", date: "19/10", mood: "apoio", painPart: "barriga", painIntensity: "forte", temperature: 38.4, note: "Choroso, recusou almoço." },
      { id: "s6", date: "18/10", mood: "mais-ou-menos", temperature: 37.7 },
      { id: "s7", date: "17/10", mood: "mais-ou-menos", painPart: "garganta", painIntensity: "medio", temperature: 37.2 },
    ],
    adherence: [
      { label: "Seg", taken: 2, expected: 4 },
      { label: "Ter", taken: 3, expected: 4 },
      { label: "Qua", taken: 3, expected: 4 },
      { label: "Qui", taken: 4, expected: 4 },
      { label: "Sex", taken: 2, expected: 4 },
      { label: "Sáb", taken: 3, expected: 4 },
      { label: "Dom", taken: 3, expected: 4 },
    ],
    intercurrences: [
      { id: "i3", date: "19/10", title: "Febre em paciente neutropênico", description: "38,4 °C às 10:15. Protocolo de febre neutropênica acionado; orientar retorno imediato.", severity: "critico" },
      { id: "i4", date: "15/10", title: "Mucosite grau 2", description: "Iniciado bochecho de suporte e dieta pastosa.", severity: "atencao" },
    ],
  },
};

/** Gera um 360 simples para pacientes sem ficha detalhada nos mocks. */
export function fallback360(patientId: string): Patient360 {
  return {
    patientId,
    diagnosis: "Acompanhamento oncológico pediátrico",
    allergies: ["Sem alergias medicamentosas conhecidas"],
    growth: growthFor(22, 120),
    symptoms: [
      { id: `${patientId}-s1`, date: "19/10", mood: "bem", temperature: 36.5 },
      { id: `${patientId}-s2`, date: "18/10", mood: "bem", temperature: 36.6 },
    ],
    adherence: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((label) => ({
      label,
      taken: 3,
      expected: 3,
    })),
    intercurrences: [],
  };
}

export const mockPrescriptions: PrescriptionItem[] = [
  { id: "rx-1", patientId: "pac-001", name: "Ondansetrona", dosage: "8mg • 1 comprimido", time: "14:00", instructions: "Tomar com 1 copo de água cheinho logo após o almoço para prevenir enjoo.", category: "antiemetico", status: "ativo" },
  { id: "rx-2", patientId: "pac-001", name: "Dexametasona", dosage: "4mg • 1 comprimido", time: "08:00", instructions: "Tomar junto com o café da manhã.", category: "corticoide", status: "ativo" },
  { id: "rx-3", patientId: "pac-001", name: "Capecitabina", dosage: "500mg • Quimioterapia Oral", time: "20:00", instructions: "Tomar 30 minutos após o jantar com bastante água.", category: "quimio-oral", status: "ativo" },
  { id: "rx-4", patientId: "pac-002", name: "Cefepima", dosage: "1g • endovenoso", time: "06:00", instructions: "Administração hospitalar conforme protocolo de febre neutropênica.", category: "suporte", status: "ativo" },
];

export const mockPrescriptionChanges: PrescriptionChange[] = [
  { id: "ch-1", patientId: "pac-001", at: "12/10 09:10", by: "Dr. Roberto Silveira", summary: "Ondansetrona ajustada de 4mg para 8mg após náusea tardia." },
];

export const mockNutritionRecs: NutritionRecommendation[] = [
  { id: "nr-1", patientId: "pac-001", title: "Reforço hídrico e textura suave", text: "Priorizar alimentos úmidos e frios; oferecer pequenas porções a cada 2 horas. Evitar frituras e cheiros fortes durante o ciclo.", by: "Dra. Camila Albuquerque (Nutrição)", at: "12/10 10:00" },
];

export const mockClinicalMessages: ClinicalMessage[] = [
  { id: "cm-1", patientId: "pac-001", direction: "cuidador-para-equipe", author: "Ana Paula (mãe)", text: "Doutor, a Clarinha reclamou de gosto de ferro na boca hoje. Posso dar picolé de limão antes do almoço?", priority: "normal", at: "19/10 12:45", read: false },
  { id: "cm-2", patientId: "pac-002", direction: "cuidador-para-equipe", author: "Carla Matos (mãe)", text: "O Pedrinho está com febre de 38,4 e com dor de barriga. O que devemos fazer?", priority: "urgente", at: "19/10 10:20", read: false },
  { id: "cm-3", patientId: "pac-001", direction: "equipe-para-cuidador", author: "Enf. Clara Mendes", text: "Pode sim, Ana! Picolé de limão antes das refeições ajuda. Evite talheres de metal por enquanto.", priority: "normal", at: "12/10 15:30", read: true },
];
