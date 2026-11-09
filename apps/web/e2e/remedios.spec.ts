import { test, expect } from "@playwright/test";

test.describe("Tela de Remédios e Hábitos Diários", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/remedios");
  });

  test("deve renderizar a lista de remédios do dia com horários e dosagens", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Remédios de Hoje" })).toBeVisible();

    // Deve exibir badge com contagem de doses
    await expect(page.getByText(/doses/i)).toBeVisible();

    // Verifica presença de medicamentos essenciais
    await expect(page.getByText("Ondansetrona")).toBeVisible();
    await expect(page.getByText("Dexametasona")).toBeVisible();
  });

  test("deve permitir interação com o rastreador de hidratação (copos de água)", async ({ page }) => {
    await expect(page.getByText(/Água · \d+\/8 copos/)).toBeVisible();

    const drinkBtn = page.getByRole("button", { name: /\+ Beber 1 copo/i });
    if (await drinkBtn.isVisible()) {
      await drinkBtn.click();
      // O total de ml deve ser exibido no span indicador
      await expect(page.locator("span", { hasText: /ml/ }).first()).toBeVisible();
    }
  });

  test("deve permitir marcar hábitos diários como concluídos", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Hábitos do Dia" })).toBeVisible();

    // Botão de hábito existente em mockDailyHabits (ex: Caminhada leve ou Dormir bem)
    const habitBtn = page.getByRole("button", { name: /Caminhada leve|Dormir bem/i }).first();
    await expect(habitBtn).toBeVisible();
    await habitBtn.click();
  });
});
