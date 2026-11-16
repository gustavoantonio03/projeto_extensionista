/**
 * Constantes centralizadas para a suíte de testes E2E do Playwright.
 * Elimina o Test Smell "Hard-Coded Test Data" (testsmells.org).
 */

export const TEST_USERS = {
  PATIENT: {
    email: "clarinha@siglo.com",
    password: "siglo123",
    testId: "fill-clarinha",
    label: "Criança (Clarinha)",
  },
  CAREGIVER: {
    email: "mae@siglo.com",
    password: "siglo123",
    testId: "fill-mae",
    label: "Mãe (Ana)",
  },
  DOCTOR: {
    email: "medico@siglo.com",
    password: "siglo123",
    testId: "fill-medico",
    label: "Médico",
  },
} as const;

export const TEST_ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  MEDICATIONS: "/remedios",
  NUTRITION: "/nutricao",
  FAMILY: "/familia",
  CLINICAL: "/clinico",
  DOCTOR: "/medico",
  DOCTOR_PATIENT_360: "/medico/pacientes/pac-001",
} as const;

export const TEST_PATIENT = {
  id: "pac-001",
  fullName: "Maria Clara Albuquerque",
  nickName: "Clarinha",
  baselineTemp: "36.5°C",
  tempPlusOne: "36.7°C",
  tempMinusTwo: "36.3°C",
} as const;

export const TEST_MEDICATIONS = {
  ONDASETRONA: "Ondansetrona",
  DEXAMETASONA: "Dexametasona",
} as const;

export const TEST_UI_TEXTS = {
  APP_TITLE: "OncoVida · SIGLO",
  FIREBASE_HINT: "Acesso integrado com Firebase Authentication",
  LGPD_COMPLIANCE: "LGPD Art. 14",
  CHECKIN_SUCCESS: "Gravado com Sucesso! ❤️",
  PORTAL_MEDICO: "Portal do Médico",
  TRIAGEM_HEADING: "Triagem do dia",
  REMEDIOS_HEADING: "Remédios de Hoje",
  HABITOS_HEADING: "Hábitos do Dia",
  CLINICO_HEADING: "Indicadores Vitais",
} as const;
