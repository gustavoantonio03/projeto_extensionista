import { test, expect } from "@playwright/test";
import {
  TEST_PATIENT,
  TEST_ROUTES,
  TEST_UI_TEXTS,
  TEST_USERS,
} from "./fixtures/test-constants";

test.describe("Tela Meu Dia (Paciente e Cuidador)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ROUTES.HOME);
  });

  test("deve renderizar a saudação ao paciente e os blocos de check-in", async ({ page }) => {
    // Saudação personalizada
    await expect(
      page.getByRole("heading", { name: new RegExp(`Olá, ${TEST_PATIENT.nickName}`, "i") })
    ).toBeVisible();

    // Seção de Humor
    await expect(page.getByText("Como está o humor agora?")).toBeVisible();

    // Seção de Dor
    await expect(page.getByText("Sente algum incômodo no corpo?")).toBeVisible();

    // Seção de Temperatura com valor padrão
    await expect(page.getByText("Temperatura")).toBeVisible();
    await expect(page.getByText(TEST_PATIENT.baselineTemp)).toBeVisible();
  });

  test("deve permitir ajustar a temperatura", async ({ page }) => {
    const plusBtn = page.getByRole("button", { name: "Aumentar temperatura" });
    const minusBtn = page.getByRole("button", { name: "Diminuir temperatura" });

    // Aumenta 0.2°C
    await plusBtn.click();
    await expect(page.getByText(TEST_PATIENT.tempPlusOne)).toBeVisible();

    // Diminui 0.2°C duas vezes
    await minusBtn.click();
    await minusBtn.click();
    await expect(page.getByText(TEST_PATIENT.tempMinusTwo)).toBeVisible();
  });

  test("deve permitir selecionar humor e registrar check-in com sucesso", async ({ page }) => {
    // Seleção determinística do humor com role='radio' sem bypass condicional (eliminando Unknown Test)
    const bemRadio = page.getByRole("radio", { name: /Estou Bem/i });
    await bemRadio.click();
    await expect(bemRadio).toHaveAttribute("aria-checked", "true");

    // Grava check-in diretamente com auto-wait do Playwright (eliminando Duplicate Assert)
    const saveBtn = page.getByRole("button", { name: "Gravar Como Me Sinto Hoje" });
    await saveBtn.click();

    // Validação do feedback de sucesso
    await expect(page.getByText(TEST_UI_TEXTS.CHECKIN_SUCCESS)).toBeVisible();

    // Trilha de auditoria confirma o cuidador responsável
    const trail = page.getByTestId("checkin-trail");
    await expect(trail).toContainText(TEST_USERS.CAREGIVER.label);
  });
});
