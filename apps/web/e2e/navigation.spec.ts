import { test, expect } from "@playwright/test";

test.describe("Navegação Mobile (BottomNav e Header)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("deve exibir o Header com logo OncoVida e identificação do usuário", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header.getByText("OncoVida")).toBeVisible();

    // Botão Sair deve estar presente
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

  test("deve navegar corretamente entre as 5 abas através da barra inferior", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação Principal do Aplicativo" });

    // 1. Aba Remédios
    const remediosBtn = nav.getByRole("button", { name: "Remédios" });
    await remediosBtn.click();
    await expect(page).toHaveURL(/\/remedios/);
    await expect(remediosBtn).toHaveAttribute("aria-current", "page");

    // 2. Aba Nutrição
    const nutricaoBtn = nav.getByRole("button", { name: "Nutrição" });
    await nutricaoBtn.click();
    await expect(page).toHaveURL(/\/nutricao/);
    await expect(nutricaoBtn).toHaveAttribute("aria-current", "page");

    // 3. Aba Família
    const familiaBtn = nav.getByRole("button", { name: "Família" });
    await familiaBtn.click();
    await expect(page).toHaveURL(/\/familia/);
    await expect(familiaBtn).toHaveAttribute("aria-current", "page");

    // 4. Aba Clínico
    const clinicoBtn = nav.getByRole("button", { name: "Clínico" });
    await clinicoBtn.click();
    await expect(page).toHaveURL(/\/clinico/);
    await expect(clinicoBtn).toHaveAttribute("aria-current", "page");

    // 5. Retornar para Meu Dia (Início)
    const inicioBtn = nav.getByRole("button", { name: "Meu Dia" });
    await inicioBtn.click();
    await expect(page).toHaveURL(/http:\/\/[^/]+\/?$/);
    await expect(inicioBtn).toHaveAttribute("aria-current", "page");
  });
});
