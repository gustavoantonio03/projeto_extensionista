import { test, expect } from "@playwright/test";
import {
  TEST_PATIENT,
  TEST_ROUTES,
  TEST_UI_TEXTS,
} from "./fixtures/test-constants";

test.describe("Portal do Médico e Equipe Multidisciplinar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ROUTES.DOCTOR, { waitUntil: "domcontentloaded" });
  });

  test("deve exibir o cabeçalho e navegação do portal médico", async ({ page }) => {
    await expect(page.getByText(TEST_UI_TEXTS.PORTAL_MEDICO).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.TRIAGEM_HEADING })).toBeVisible();

    // Navegação lateral do portal
    const nav = page.getByRole("navigation", { name: "Navegação do Portal do Médico" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Triagem" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Prescrição" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Comunicação" })).toBeVisible();
  });

  test("deve listar pacientes monitorados com seus graus de criticidade", async ({ page }) => {
    // Aguarda carregar o card do paciente principal sem exact: true e com .first()
    await expect(
      page.getByRole("link", { name: TEST_PATIENT.fullName }).first()
    ).toBeVisible();

    // Badges de gravidade
    const badge = page.getByText(/Crítico|Atenção|Estável/i).first();
    await expect(badge).toBeVisible();
  });

  test("deve permitir navegar para o prontuário / visão 360 do paciente", async ({ page }) => {
    const patientLink = page.getByRole("link", {
      name: TEST_PATIENT.fullName,
    }).first();

    await patientLink.scrollIntoViewIfNeeded();
    await patientLink.click({ timeout: 5000 }).catch(async () => {
      await patientLink.evaluate((el: HTMLElement) => el.click());
    });

    // Validação da rota dinâmica do prontuário
    await expect(page).toHaveURL(new RegExp(TEST_ROUTES.DOCTOR_PATIENT_360));
  });
});
