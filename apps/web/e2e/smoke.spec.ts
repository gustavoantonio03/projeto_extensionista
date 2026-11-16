import { test, expect } from "@playwright/test";
import {
  TEST_ROUTES,
  TEST_USERS,
  TEST_PATIENT,
  TEST_UI_TEXTS,
} from "./fixtures/test-constants";

async function loginAs(page: any, user: { email: string; password: string }) {
  await page.goto(TEST_ROUTES.LOGIN);
  const emailInput = page.locator("#login-email");
  const passwordInput = page.locator("#login-password");
  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  await page.getByRole("button", { name: "Entrar no OncoVida" }).click();
}

test.describe("Smoke Tests — Caminho Crítico Ponta a Ponta (Online / Integrado)", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("Fluxo Crítico Paciente: Login Real -> Check-in 'Meu Dia' -> Salvar -> Logout", async ({ page }) => {
    // 1 & 2. Login real como Paciente (Clarinha)
    await loginAs(page, TEST_USERS.PATIENT);

    // 3. Chegada e hidratação do portal da Criança (Meu Dia)
    await expect(
      page.getByRole("heading", { name: new RegExp(`Olá, ${TEST_PATIENT.nickName}`, "i") })
    ).toBeVisible({ timeout: 15000 });

    // 4. Interação com o Check-in: selecionar humor e confirmar
    const moodHappy = page.getByRole("button", { name: /Bem/i }).first();
    if (await moodHappy.isVisible()) {
      await moodHappy.click();
    }

    const saveButton = page.getByRole("button", { name: /Gravar Meu Dia/i });
    await saveButton.scrollIntoViewIfNeeded();
    await saveButton.click();

    // 5. Verificação da gravação com sucesso
    await expect(page.getByText(TEST_UI_TEXTS.CHECKIN_SUCCESS)).toBeVisible({ timeout: 5000 });

    // 6. Logout do Paciente
    const logoutBtn = page.getByRole("button", { name: "Sair da conta" });
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
    await logoutBtn.click();

    // 7. Retorno seguro para a tela de Login
    await expect(page.getByRole("button", { name: "Entrar no OncoVida" })).toBeVisible({ timeout: 10000 });
  });

  test("Fluxo Crítico Cuidador: Login Real -> Dashboard Clínico -> Remédios -> Logout", async ({ page }) => {
    // 1 & 2. Login real como Cuidadora (Mãe Ana)
    await loginAs(page, TEST_USERS.CAREGIVER);

    // 3. Chegada à rota /clinico
    await expect(
      page.getByRole("heading", { name: TEST_UI_TEXTS.CLINICO_HEADING })
    ).toBeVisible({ timeout: 15000 });

    // 4. Navegação para tela de Remédios
    await page.goto(TEST_ROUTES.MEDICATIONS, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.REMEDIOS_HEADING })).toBeVisible({ timeout: 10000 });

    // 5. Logout da Cuidadora
    const logoutBtn = page.getByRole("button", { name: "Sair da conta" });
    await logoutBtn.click();

    // 6. Retorno ao login
    await expect(page.getByRole("button", { name: "Entrar no OncoVida" })).toBeVisible({ timeout: 10000 });
  });

  test("Fluxo Crítico Médico: Login Real -> Triagem de Pacientes -> Prontuário 360 -> Logout", async ({ page }) => {
    // 1 & 2. Login real como Médico (Dr. Roberto Silva)
    await loginAs(page, TEST_USERS.DOCTOR);

    // 3. Chegada ao Portal do Médico
    await expect(page.getByText(TEST_UI_TEXTS.PORTAL_MEDICO).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.TRIAGEM_HEADING })).toBeVisible();

    // 4. Visualização do paciente na lista de triagem
    const patientLink = page.getByRole("link", { name: TEST_PATIENT.fullName }).first();
    await expect(patientLink).toBeVisible();

    // 5. Acesso à Visão 360 / Prontuário
    await patientLink.scrollIntoViewIfNeeded();
    await patientLink.click({ timeout: 5000 }).catch(async () => {
      await patientLink.evaluate((el: HTMLElement) => el.click());
    });

    await expect(page).toHaveURL(new RegExp(TEST_ROUTES.DOCTOR_PATIENT_360), { timeout: 10000 });

    // 6. Logout do Médico
    const doctorLogout = page.locator("button:visible[data-testid*='doctor-logout'], button:visible[aria-label='Sair da conta médica']").first();
    await expect(doctorLogout).toBeVisible({ timeout: 5000 });
    await doctorLogout.click();

    // 7. Retorno ao login
    await expect(page.getByRole("button", { name: "Entrar no OncoVida" })).toBeVisible({ timeout: 10000 });
  });
});
