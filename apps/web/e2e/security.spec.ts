import { test, expect } from "@playwright/test";
import { TEST_ROUTES, TEST_USERS, TEST_UI_TEXTS, TEST_PATIENT } from "./fixtures/test-constants";

async function loginAs(page: any, user: { email: string; password: string }) {
  await page.goto(TEST_ROUTES.LOGIN);
  const emailInput = page.locator("#login-email");
  const passwordInput = page.locator("#login-password");
  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  await page.getByRole("button", { name: "Entrar no OncoVida" }).click();
}

test.describe("Segurança da Aplicação (Security & Access Control)", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("deve bloquear escalação de privilégio quando Paciente (Criança) tenta acessar /medico", async ({ page }) => {
    // 1. Realiza login real como Paciente via formulário de autenticação
    await loginAs(page, TEST_USERS.PATIENT);

    // Aguarda chegada à página inicial da criança
    await expect(
      page.getByRole("heading", { name: new RegExp(`Olá, ${TEST_PATIENT.nickName}`, "i") })
    ).toBeVisible({ timeout: 15000 });

    // 2. Tenta forçar acesso direto à rota restrita do médico
    await page.goto(TEST_ROUTES.DOCTOR, { waitUntil: "domcontentloaded" });

    // 3. Valida que o guarda RBAC intercepta: prontuário/triagem NÃO pode estar visível
    const heading = page.getByRole("heading", { name: TEST_UI_TEXTS.TRIAGEM_HEADING });
    await expect(heading).not.toBeVisible();

    // Deve redirecionar para fora de /medico
    await page.waitForURL((url) => !url.pathname.startsWith("/medico"), { timeout: 10000 });
  });

  test("deve bloquear escalação de privilégio quando Cuidador (Mãe) tenta acessar /medico", async ({ page }) => {
    // 1. Realiza login real como Cuidadora
    await loginAs(page, TEST_USERS.CAREGIVER);

    // Aguarda chegada à tela clínica do cuidador
    await expect(
      page.getByRole("heading", { name: TEST_UI_TEXTS.CLINICO_HEADING })
    ).toBeVisible({ timeout: 15000 });

    // 2. Tenta forçar acesso direto ao portal médico
    await page.goto(TEST_ROUTES.DOCTOR, { waitUntil: "domcontentloaded" });

    // 3. O cabeçalho da equipe médica não pode ser concedido sem perfil de doutor
    const heading = page.getByRole("heading", { name: TEST_UI_TEXTS.TRIAGEM_HEADING });
    await expect(heading).not.toBeVisible();
    await page.waitForURL((url) => !url.pathname.startsWith("/medico"), { timeout: 10000 });
  });

  test("deve permitir acesso completo ao portal médico para usuário autenticado com perfil de Médico", async ({ page }) => {
    // 1. Realiza login com perfil de Médico
    await loginAs(page, TEST_USERS.DOCTOR);

    // 2. Aguarda redirecionamento autorizado para /medico
    await expect(page.getByText(TEST_UI_TEXTS.PORTAL_MEDICO).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.TRIAGEM_HEADING })).toBeVisible();

    // 3. Valida a presença do botão de logout médico seguro (adaptável a mobile e desktop)
    const logoutBtn = page.locator("button:visible[data-testid*='doctor-logout'], button:visible[aria-label='Sair da conta médica']").first();
    await expect(logoutBtn).toBeVisible({ timeout: 10000 });
  });

  test("deve neutralizar tentativas de injeção de scripts (XSS) no formulário de autenticação", async ({ page }) => {
    await page.goto(TEST_ROUTES.LOGIN);

    const xssPayload = `"><script>window.__xss_vulnerable = true;</script>`;
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");

    // Injeta payload no campo de e-mail e senha
    await emailInput.fill(xssPayload);
    await passwordInput.fill("SenhaInvalida123!");
    await page.getByRole("button", { name: "Entrar no OncoVida" }).click();

    // Valida que nenhuma flag injetada no window foi executada
    const isVulnerable = await page.evaluate(() => (window as any).__xss_vulnerable);
    expect(isVulnerable).toBeUndefined();

    // Valida que o DOM renderiza de forma segura sem crash
    await expect(page.locator("body")).toBeVisible();
  });

  test("não deve vazar credenciais sensíveis ou chaves privadas no DOM ou no objeto window", async ({ page }) => {
    await page.goto(TEST_ROUTES.LOGIN);

    // Audita o HTML renderizado e o window em busca de palavras-chave perigosas
    const pageHtml = await page.content();
    const sensitiveKeywords = [
      "private_key",
      "client_secret",
      "FIREBASE_ADMIN",
      "service_account",
      "BEGIN RSA PRIVATE KEY",
      "BEGIN PRIVATE KEY",
    ];

    for (const keyword of sensitiveKeywords) {
      expect(pageHtml.includes(keyword)).toBeFalsy();
    }

    // Verifica que nenhum segredo vazou no window global
    const windowGlobals = await page.evaluate(() => {
      const keys = Object.keys(window);
      return keys.filter((k) => /secret|private|token|serviceaccount/i.test(k));
    });

    expect(windowGlobals.length).toBe(0);
  });
});
