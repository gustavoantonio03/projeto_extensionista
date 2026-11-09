import { test, expect } from "@playwright/test";

test.describe("Tela de Acompanhamento Clínico do Cuidador", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/clinico");
  });

  test("deve exibir a área de acompanhamento clínico e indicadores vitais", async ({ page }) => {
    // Header com identificação
    await expect(page.locator("header")).toBeVisible();

    // Seção de Indicadores Vitais
    await expect(page.getByRole("heading", { name: "Indicadores Vitais" })).toBeVisible();
    await expect(page.getByText("Temperatura")).toBeVisible();
    await expect(page.getByText("Hidratação")).toBeVisible();
  });

  test("deve exibir seção de conferência cruzada com dupla checagem", async ({ page }) => {
    // Seção de conferência cruzada
    const section = page.getByRole("region", { name: "Conferência Cruzada" });
    await expect(section).toBeVisible();

    // Badge ou texto de dupla checagem
    await expect(page.getByText(/Dupla Checagem|conferidos/i).first()).toBeVisible();
  });
});
