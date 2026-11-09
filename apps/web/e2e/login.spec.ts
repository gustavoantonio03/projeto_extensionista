import { test, expect } from "@playwright/test";

test.describe("Tela de Login e Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("deve exibir elementos de identidade visual e formulário de login", async ({ page }) => {
    // Título e identidade
    await expect(page.locator("h1")).toContainText("OncoVida · SIGLO");
    await expect(page.getByText("Acesso integrado com Firebase Authentication")).toBeVisible();

    // Inputs do formulário
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");
    const submitBtn = page.getByRole("button", { name: "Entrar no OncoVida" });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Rodapé de conformidade LGPD
    await expect(page.getByText("LGPD Art. 14")).toBeVisible();
  });

  test("deve validar campos obrigatórios vazios", async ({ page }) => {
    // Clica em entrar com campos vazios (HTML5 validation ou validação de estado)
    const emailInput = page.locator("#login-email");
    await expect(emailInput).toHaveAttribute("required", "");

    const passwordInput = page.locator("#login-password");
    await expect(passwordInput).toHaveAttribute("required", "");
  });

  test("deve preencher credenciais ao clicar no botão 'Preencher' das contas de teste", async ({ page }) => {
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");

    // Preencher conta Criança
    const fillClarinha = page.getByTestId("fill-clarinha");
    await fillClarinha.scrollIntoViewIfNeeded();
    await fillClarinha.click();
    await expect(emailInput).toHaveValue("clarinha@siglo.com");
    await expect(passwordInput).toHaveValue("siglo123");

    // Preencher conta Mãe
    const fillMae = page.getByTestId("fill-mae");
    await fillMae.scrollIntoViewIfNeeded();
    await fillMae.click();
    await expect(emailInput).toHaveValue("mae@siglo.com");
    await expect(passwordInput).toHaveValue("siglo123");

    // Preencher conta Médico
    const fillMedico = page.getByTestId("fill-medico");
    await fillMedico.scrollIntoViewIfNeeded();
    await fillMedico.click();
    await expect(emailInput).toHaveValue("medico@siglo.com");
    await expect(passwordInput).toHaveValue("siglo123");
  });

  test("deve exibir o botão de provisionamento de usuários de teste (Seed)", async ({ page }) => {
    const seedBtn = page.getByRole("button", { name: /Criar Usuários de Teste no Firebase/i });
    await expect(seedBtn).toBeVisible();
  });
});
