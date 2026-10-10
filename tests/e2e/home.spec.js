import { test, expect } from "@playwright/test";
import { mockCloud, openApp } from "./fixtures/helpers.js";

test.beforeEach(async ({ page }) => {
  await mockCloud(page, { loggedIn: false });
});

test("la pantalla principal no tiene CTA de IA (copiloto retirado)", async ({ page }) => {
  await openApp(page);
  await expect(page.locator("#btn-ai-plan-trip")).toHaveCount(0);
});

test("la reserva rápida (Hotel/Vuelo/Actividades) está en la pantalla principal", async ({ page }) => {
  await openApp(page);
  await expect(page.locator("#qb-hotels")).toBeVisible();
  await expect(page.locator("#qb-flights")).toBeVisible();
  await expect(page.locator("#qb-activities")).toBeVisible();
});
