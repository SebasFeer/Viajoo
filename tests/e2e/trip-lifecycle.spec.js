import { test, expect } from "@playwright/test";
import { mockCloud, openApp, createTrip } from "./fixtures/helpers.js";

test.beforeEach(async ({ page }) => {
  await mockCloud(page, { loggedIn: false });
  await openApp(page);
});

test("crear un viaje lo añade a Mis viajes", async ({ page }) => {
  await createTrip(page, { name: "Budapest", destination: "Budapest", startDate: "2027-06-01", endDate: "2027-06-05" });
  await expect(page.getByText("Budapest").first()).toBeVisible();
});

test("una actividad del itinerario no muestra la etiqueta de categoría duplicada", async ({ page }) => {
  await createTrip(page, { name: "Budapest", destination: "Budapest", startDate: "2027-06-01", endDate: "2027-06-05" });
  await page.locator(".trip-card").first().click();
  await page.locator('[data-tab="itinerary"]').click();
  await page.waitForTimeout(200);

  await page.locator("#fab-add").click();
  await page.locator("#f_title").waitFor();
  await page.fill("#f_title", "Parlamento de Budapest");
  await page.fill("#f_date", "2027-06-01");
  await page.fill("#f_location", "Plaza Kossuth Lajos tér.");
  await page.locator("#f_type").selectOption({ label: "Monumento" });
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);

  const row = page.locator(".tl-row", { hasText: "Parlamento de Budapest" });
  await expect(row).toBeVisible();
  // Regresión: el icono de color del riel ya basta para identificar
  // la categoría — no debe repetirse como chip de texto en la fila.
  await expect(row.locator(".tag-chip")).toHaveCount(0);
});
