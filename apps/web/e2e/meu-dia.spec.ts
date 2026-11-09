import { test, expect } from "@playwright/test";

test.describe("Tela Meu Dia (Paciente e Cuidador)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("deve renderizar a saudação ao paciente e os blocos de check-in", async ({ page }) => {
    // Saudação personalizada
    await expect(page.getByRole("heading", { name: /Olá, Clarinha/i })).toBeVisible();

    // Seção de Humor
    await expect(page.getByText("Como está o humor agora?")).toBeVisible();

    // Seção de Dor
    await expect(page.getByText("Sente algum incômodo no corpo?")).toBeVisible();

    // Seção de Temperatura
    await expect(page.getByText("Temperatura")).toBeVisible();
    await expect(page.getByText("36.5°C")).toBeVisible();
  });

  test("deve permitir ajustar a temperatura", async ({ page }) => {
    const plusBtn = page.getByRole("button", { name: "Aumentar temperatura" });
    const minusBtn = page.getByRole("button", { name: "Diminuir temperatura" });

    // Aumenta 0.2°C
    await plusBtn.click();
    await expect(page.getByText("36.7°C")).toBeVisible();

    // Diminui 0.2°C duas vezes
    await minusBtn.click();
    await minusBtn.click();
    await expect(page.getByText("36.3°C")).toBeVisible();
  });

  test("deve permitir selecionar humor e registrar check-in com sucesso", async ({ page }) => {
    // Seleciona um humor
    const bemBtn = page.getByRole("button", { name: /bem/i }).first();
    if (await bemBtn.isVisible()) {
      await bemBtn.click();
    }

    // Clica em gravar check-in
    const saveBtn = page.getByRole("button", { name: "Gravar Como Me Sinto Hoje" });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Deve exibir confirmação de sucesso
    await expect(page.getByText("Gravado com Sucesso! ❤️")).toBeVisible();

    // Deve exibir trilha de rastreabilidade
    const trail = page.getByTestId("checkin-trail");
    await expect(trail).toBeVisible();
    await expect(trail).toContainText("Mãe (Ana)");
  });
});
