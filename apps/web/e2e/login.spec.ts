import { test, expect } from "@playwright/test";
import { TEST_ROUTES, TEST_UI_TEXTS, TEST_USERS } from "./fixtures/test-constants";

test.describe("Tela de Login e Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ROUTES.LOGIN);
  });

  test("deve exibir elementos de identidade visual e formulário de login", async ({ page }) => {
    // Título e identidade
    await expect(page.locator("h1")).toContainText(TEST_UI_TEXTS.APP_TITLE);
    await expect(page.getByText(TEST_UI_TEXTS.FIREBASE_HINT)).toBeVisible();

    // Inputs do formulário
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");
    const submitBtn = page.getByRole("button", { name: "Entrar no OncoVida" });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Rodapé de conformidade LGPD
    await expect(page.getByText(TEST_UI_TEXTS.LGPD_COMPLIANCE)).toBeVisible();
  });

  test("deve validar campos obrigatórios vazios", async ({ page }) => {
    const emailInput = page.locator("#login-email");
    await expect(emailInput).toHaveAttribute("required", "");

    const passwordInput = page.locator("#login-password");
    await expect(passwordInput).toHaveAttribute("required", "");
  });

  test("deve preencher credenciais de teste para perfil Criança", async ({ page }) => {
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");
    const fillClarinha = page.getByTestId(TEST_USERS.PATIENT.testId);

    await fillClarinha.scrollIntoViewIfNeeded();
    await fillClarinha.click();

    await expect(emailInput).toHaveValue(TEST_USERS.PATIENT.email);
    await expect(passwordInput).toHaveValue(TEST_USERS.PATIENT.password);
  });

  test("deve preencher credenciais de teste para perfil Cuidador (Mãe)", async ({ page }) => {
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");
    const fillMae = page.getByTestId(TEST_USERS.CAREGIVER.testId);

    await fillMae.scrollIntoViewIfNeeded();
    await fillMae.click();

    await expect(emailInput).toHaveValue(TEST_USERS.CAREGIVER.email);
    await expect(passwordInput).toHaveValue(TEST_USERS.CAREGIVER.password);
  });

  test("deve preencher credenciais de teste para perfil Médico", async ({ page }) => {
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");
    const fillMedico = page.getByTestId(TEST_USERS.DOCTOR.testId);

    await fillMedico.scrollIntoViewIfNeeded();
    await fillMedico.click();

    await expect(emailInput).toHaveValue(TEST_USERS.DOCTOR.email);
    await expect(passwordInput).toHaveValue(TEST_USERS.DOCTOR.password);
  });

  test("deve exibir o botão de provisionamento de usuários de teste (Seed)", async ({ page }) => {
    const seedBtn = page.getByRole("button", { name: /Criar Usuários de Teste no Firebase/i });
    await expect(seedBtn).toBeVisible();
  });
});
