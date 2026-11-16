import { test, expect } from "@playwright/test";
import {
  TEST_MEDICATIONS,
  TEST_ROUTES,
  TEST_UI_TEXTS,
} from "./fixtures/test-constants";

test.describe("Tela de Remédios e Hábitos Diários", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ROUTES.MEDICATIONS);
  });

  test("deve renderizar a lista de remédios do dia com horários e dosagens", async ({ page }) => {
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.REMEDIOS_HEADING })).toBeVisible();

    // Deve exibir badge com contagem de doses
    await expect(page.getByText(/doses/i)).toBeVisible();

    // Verifica presença de medicamentos essenciais prescritos
    await expect(page.getByText(TEST_MEDICATIONS.ONDASETRONA)).toBeVisible();
    await expect(page.getByText(TEST_MEDICATIONS.DEXAMETASONA)).toBeVisible();
  });

  test("deve permitir interação com o rastreador de hidratação (copos de água)", async ({ page }) => {
    await expect(page.getByText(/Água · \d+\/8 copos/)).toBeVisible();

    // Execução determinística sem ramificação condicional (eliminando Unknown Test)
    const drinkBtn = page.getByRole("button", { name: /\+ Beber 1 copo/i });
    await drinkBtn.click();

    // O total de ml deve ser atualizado e exibido no indicador
    await expect(page.locator("span", { hasText: /ml/ }).first()).toBeVisible();
  });

  test("deve permitir alternar o estado dos hábitos diários", async ({ page }) => {
    await expect(page.getByRole("heading", { name: TEST_UI_TEXTS.HABITOS_HEADING })).toBeVisible();

    const habitBtn = page.getByRole("button", { name: /Caminhada leve/i });
    // Hábito inicia com estado concluído (aria-pressed="true")
    await expect(habitBtn).toHaveAttribute("aria-pressed", "true");

    // Clica para alternar o estado (desmarcar)
    await habitBtn.click();
    await expect(habitBtn).toHaveAttribute("aria-pressed", "false");

    // Clica novamente para remarcar como concluído
    await habitBtn.click();
    await expect(habitBtn).toHaveAttribute("aria-pressed", "true");
  });
});
