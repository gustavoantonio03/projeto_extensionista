import { test, expect } from "@playwright/test";
import { TEST_ROUTES, TEST_UI_TEXTS } from "./fixtures/test-constants";

test.describe("Tela de Acompanhamento Clínico do Cuidador", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ROUTES.CLINICAL);
  });

  test("deve exibir a área de acompanhamento clínico e indicadores vitais", async ({ page }) => {
    // Seção de Indicadores Vitais (eliminando Duplicate Assert de header redundante)
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.CLINICO_HEADING })).toBeVisible();
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
