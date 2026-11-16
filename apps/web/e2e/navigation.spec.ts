import { test, expect } from "@playwright/test";
import { TEST_ROUTES } from "./fixtures/test-constants";

test.describe("Navegação Mobile (BottomNav e Header)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ROUTES.HOME, { waitUntil: "domcontentloaded" });
    // Aguarda a hidratação do React para garantir que os handlers onClick estejam anexados
    await page.waitForFunction(() => {
      const btn = document.querySelector('nav[aria-label="Navegação Principal do Aplicativo"] button');
      return btn && Object.keys(btn).some((k) => k.startsWith("__reactProps") || k.startsWith("__reactFiber"));
    });
  });

  test("deve exibir o Header com identificação do app e botão de logout", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByText("OncoVida")).toBeVisible();

    const logoutBtn = header.getByRole("button", { name: "Sair da conta" });
    await expect(logoutBtn).toBeVisible();
  });

  test("deve renderizar a barra inferior (BottomNav) fixa estilo Instagram sem textos visíveis", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });
    await expect(nav).toBeVisible();

    // Deve conter exatamente 5 botões de abas
    const navButtons = nav.getByRole("button");
    await expect(navButtons).toHaveCount(5);

    // Deve ser fixo no rodapé da viewport
    const position = await nav.evaluate((el) => window.getComputedStyle(el).position);
    expect(position).toBe("fixed");

    // Estilo Instagram: NÃO deve exibir rótulos de texto visíveis dentro dos botões
    const innerText = (await nav.innerText()).trim();
    expect(innerText).toBe("");
  });

  // Testes individuais de navegação para isolar falhas (eliminando o Eager Test)
  test("deve navegar para a aba Remédios", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });
    const remediosBtn = nav.getByRole("button", { name: "Remédios" });
    await remediosBtn.click();

    await expect(page).toHaveURL(new RegExp(TEST_ROUTES.MEDICATIONS));
    await expect(remediosBtn).toHaveAttribute("aria-current", "page");
  });

  test("deve navegar para a aba Nutrição", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });
    const nutricaoBtn = nav.getByRole("button", { name: "Nutrição" });
    await nutricaoBtn.click();

    await expect(page).toHaveURL(new RegExp(TEST_ROUTES.NUTRITION));
    await expect(nutricaoBtn).toHaveAttribute("aria-current", "page");
  });

  test("deve navegar para a aba Família", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });
    const familiaBtn = nav.getByRole("button", { name: "Família" });
    await familiaBtn.click();

    await expect(page).toHaveURL(new RegExp(TEST_ROUTES.FAMILY));
    await expect(familiaBtn).toHaveAttribute("aria-current", "page");
  });

  test("deve navegar para a aba Clínico", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });
    const clinicoBtn = nav.getByRole("button", { name: "Clínico" });
    await clinicoBtn.click();

    await expect(page).toHaveURL(new RegExp(TEST_ROUTES.CLINICAL));
    await expect(clinicoBtn).toHaveAttribute("aria-current", "page");
  });

  test("deve retornar para a aba Meu Dia (Início)", async ({ page }) => {
    // Navega primeiro para uma aba secundária para validar o retorno
    await page.goto(TEST_ROUTES.MEDICATIONS, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => {
      const btn = document.querySelector('nav[aria-label="Navegação Principal do Aplicativo"] button');
      return btn && Object.keys(btn).some((k) => k.startsWith("__reactProps") || k.startsWith("__reactFiber"));
    });
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });
    const inicioBtn = nav.getByRole("button", { name: "Meu Dia" });
    await inicioBtn.click();

    await expect(page).toHaveURL(/http:\/\/[^/]+\/?$/);
    await expect(inicioBtn).toHaveAttribute("aria-current", "page");
  });
});