/**
 * @siglo/web — Tipos do Portal do Paciente/Cuidador
 * Estes tipos servem de fonte para os mocks na Fase 1
 * e servirão de base para o OpenAPI em packages/contracts na Fase 2 (Sprint B2).
 */

export type UserRole = "paciente" | "cuidador" | "familia" | "clinico";
export type AppMode = "crianca" | "cuidador";

export interface PatientProfile {
  id: string;
  name: string;
  preferredName: string;
  age: string;
  birthDate: string;
  diagnosis: string;
  treatmentCycle: string;
  hospital: string;
  avatarUrl: string;
  caregiverName: string;
  status: "estavel" | "atencao" | "alerta";
}

export interface DailyCheckIn {
  id: string;
  date: string;
  mood: "bem" | "mais-ou-menos" | "apoio";
  painPart?: "cabeca" | "garganta" | "barriga" | "bracos" | "pernas";
  painIntensity?: "pouco" | "medio" | "forte";
  tasteSymptoms: string[]; // ex: ['gosto-metalico', 'enjoo']
  temperature: number; // ex: 36.5
  sleepQuality: "otimo" | "picado" | "dificuldade";
  voiceNoteUrl?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  period: "manha" | "tarde" | "noite";
  instructions: string;
  category: "antiemetico" | "corticoide" | "quimio-oral" | "suporte";
  taken: boolean;
  takenAt?: string;
}

export interface SuggestedMeal {
  id: string;
  title: string;
  description: string;
  tag: string;
  calories: number;
  highlight: string;
  imageSrc: string;
}

export interface MealLog {
  id: string;
  mealType: "cafe" | "almoco" | "lanche" | "jantar";
  acceptance: "tudo" | "metade" | "pouco" | "rejeicao";
  symptoms: string[];
  notes?: string;
}

export interface ClinicalEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  tag?: string;
  status: "done" | "warning" | "info";
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatarUrl: string;
  phone: string;
  isEmergencyContact: boolean;
  lastMessage?: string;
}

export interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  phone: string;
  whatsapp: string;
  status: "online" | "plantao" | "offline";
}

export interface Appointment {
  id: string;
  title: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
}

/* ========================================================================
 * Portal do Médico / Equipe Multidisciplinar (Fase 1B) — apenas mocks.
 * Estes tipos também alimentarão o OpenAPI em packages/contracts (Fase 2).
 * ======================================================================== */

export type Severity = "critico" | "atencao" | "estavel";
export type TeamRole = "medico" | "enfermagem" | "nutricao";

export interface TeamUser {
  id: string;
  name: string;
  role: TeamRole;
  roleLabel: string;
  crm?: string;
}

export interface Alert {
  id: string;
  kind: "febre" | "dor" | "dose-atrasada" | "sem-checkin" | "recusa-alimentar";
  text: string;
  at: string;
}

export interface MonitoredPatient {
  id: string;
  name: string;
  preferredName: string;
  age: string;
  bed: string;
  treatment: "LLA" | "LMA" | "Tumor Sólido" | "Linfoma";
  cycle: string;
  caregiver: string;
  caregiverPhone: string;
  severity: Severity;
  alerts: Alert[];
  lastCheckIn: string; // "HH:MM" ou "—"
  adherencePct: number;
  lastTemperature: number;
  avatarUrl: string;
}

export interface GrowthPoint {
  label: string;
  weightKg: number;
  heightCm: number;
}

export interface SymptomRecord {
  id: string;
  date: string; // dd/mm
  mood: "bem" | "mais-ou-menos" | "apoio";
  painPart?: "cabeca" | "garganta" | "barriga" | "bracos" | "pernas";
  painIntensity?: "pouco" | "medio" | "forte";
  temperature: number;
  note?: string;
}

export interface AdherenceDay {
  label: string;
  taken: number;
  expected: number;
}

export interface Intercurrence {
  id: string;
  date: string;
  title: string;
  description: string;
  severity: Severity;
}

export interface Patient360 {
  patientId: string;
  diagnosis: string;
  allergies: string[];
  growth: GrowthPoint[];
  symptoms: SymptomRecord[];
  adherence: AdherenceDay[];
  intercurrences: Intercurrence[];
}

export interface PrescriptionItem {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  category: Medication["category"];
  status: "ativo" | "suspenso";
}

export interface PrescriptionChange {
  id: string;
  patientId: string;
  at: string;
  by: string;
  summary: string;
}

export interface NutritionRecommendation {
  id: string;
  patientId: string;
  title: string;
  text: string;
  by: string;
  at: string;
}

export interface ClinicalMessage {
  id: string;
  patientId: string;
  direction: "equipe-para-cuidador" | "cuidador-para-equipe";
  author: string;
  text: string;
  priority: "normal" | "urgente";
  at: string;
  read: boolean;
}
