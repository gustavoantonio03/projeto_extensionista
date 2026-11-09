import { test, expect } from "@playwright/test";

test.describe("Portal do Médico e Equipe Multidisciplinar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/medico");
  });

  test("deve exibir o cabeçalho e navegação do portal médico", async ({ page }) => {
    await expect(page.getByText("Portal do Médico")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Triagem do dia" })).toBeVisible();

    // Navegação lateral
    const nav = page.getByRole("navigation", { name: "Navegação do Portal do Médico" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "Triagem" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Prescrição" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Comunicação" })).toBeVisible();
  });

  test("deve listar pacientes monitorados com seus graus de criticidade", async ({ page }) => {
    // Aguarda carregar os cards/linhas de pacientes
    await expect(
      page.getByRole("link", { name: "Maria Clara Albuquerque", exact: true })
    ).toBeVisible();

    // Badges de gravidade
    const badge = page.getByText(/Crítico|Atenção|Estável/i).first();
    await expect(badge).toBeVisible();
  });

  test("deve permitir navegar para o prontuário / visão 360 do paciente", async ({ page }) => {
    const patientLink = page.getByRole("link", {
      name: "Maria Clara Albuquerque",
      exact: true,
    });
    await expect(patientLink).toBeVisible();
    await patientLink.click({ force: true });

    // Deve estar na rota /medico/pacientes/pac-001
    await expect(page).toHaveURL(/\/medico\/pacientes\/pac-001/);
    await expect(page.getByText("Maria Clara Albuquerque").first()).toBeVisible();
  });
});
