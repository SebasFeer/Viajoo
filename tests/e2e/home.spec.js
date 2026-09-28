import { test, expect } from "@playwright/test";
import { mockCloud, openApp } from "./fixtures/helpers.js";

test.beforeEach(async ({ page }) => {
  await mockCloud(page, { loggedIn: false });
});

test("el CTA de planificar no menciona 'IA' ni 'Pro'", async ({ page }) => {
  await openApp(page);
  const cta = page.locator("#btn-ai-plan-trip");
  await expect(cta).toBeVisible();
  const text = (await cta.textContent()) || "";
  expect(text).not.toMatch(/\bIA\b/);
  expect(text).not.toMatch(/\bPro\b/);
  expect(text).toContain("¿Planificamos tu viaje?");
});

test("la reserva rápida (Hotel/Vuelo/Actividades) está en la pantalla principal", async ({ page }) => {
  await openApp(page);
  await expect(page.locator("#qb-hotels")).toBeVisible();
  await expect(page.locator("#qb-flights")).toBeVisible();
  await expect(page.locator("#qb-activities")).toBeVisible();
});
