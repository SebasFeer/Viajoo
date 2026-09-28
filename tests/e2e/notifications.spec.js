import { test, expect } from "@playwright/test";
import { mockCloud, openApp, createTrip, mockNotifications } from "./fixtures/helpers.js";

function isoDaysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function dateAndTimeInHours(h) {
  const d = new Date(Date.now() + h * 3600 * 1000);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return { date, time };
}

async function activateNotifications(page) {
  await page.locator("#btn-settings").click();
  await page.waitForTimeout(200);
  await page.locator("#st-config").click();
  await page.waitForTimeout(200);
  await page.locator("#cfg-notifications").click();
  await page.waitForTimeout(200);
  await page.locator("#notif-toggle").click();
  await page.waitForTimeout(500);
}

test.beforeEach(async ({ page }) => {
  await mockCloud(page, { loggedIn: false });
  await mockNotifications(page);
  await openApp(page);
});

test("un viaje a 3 días avisa de la cuenta regresiva, y su transporte/reserva a 24h también", async ({ page }) => {
  await createTrip(page, { name: "Viaje A", destination: "Roma", startDate: isoDaysFromNow(3), endDate: isoDaysFromNow(10) });

  const transportWhen = dateAndTimeInHours(20);
  const reservationWhen = dateAndTimeInHours(22);
  await page.evaluate(
    async ({ transportWhen, reservationWhen }) => {
      const { Data } = await import("/js/db.js");
      const trip = (await Data.getAll("trips"))[0];
      await Data.add("transport", { trip_id: trip.id, type: "Tren", origin: "Madrid", destination: "Roma", date: transportWhen.date, time: transportWhen.time });
      await Data.add("reservations", { trip_id: trip.id, type: "Restaurante", name: "Trattoria da Luigi", date: reservationWhen.date, time: reservationWhen.time });
    },
    { transportWhen, reservationWhen }
  );

  await activateNotifications(page);

  const bodies = (await page.evaluate(() => window.__notifications)).map((n) => n.body);
  expect(bodies.some((b) => b.includes("Faltan 3 días") && b.includes("Roma"))).toBe(true);
  expect(bodies.some((b) => b.includes("tren") && b.includes("Roma"))).toBe(true);
  expect(bodies.some((b) => b.includes("Trattoria"))).toBe(true);
});

test("un viaje a 2 días con la maleta a medias avisa del recordatorio de equipaje", async ({ page }) => {
  await createTrip(page, { name: "Viaje B", destination: "Lisboa", startDate: isoDaysFromNow(2), endDate: isoDaysFromNow(9) });
  await page.evaluate(async () => {
    const { Data } = await import("/js/db.js");
    const trip = (await Data.getAll("trips"))[0];
    await Data.add("checklist", { trip_id: trip.id, task: "Pasaporte", completed: 0 });
  });

  await activateNotifications(page);

  const bodies = (await page.evaluate(() => window.__notifications)).map((n) => n.body);
  expect(bodies.some((b) => b.includes("maleta") && b.includes("Lisboa"))).toBe(true);
});

test("un viaje ya terminado con gastos sin saldar avisa del recordatorio de deudas", async ({ page }) => {
  await createTrip(page, { name: "Viaje C", destination: "Praga", startDate: isoDaysFromNow(-10), endDate: isoDaysFromNow(-3) });
  await page.evaluate(async () => {
    const { Data } = await import("/js/db.js");
    const trip = (await Data.getAll("trips"))[0];
    const compId = await Data.add("companions", { trip_id: trip.id, name: "Ana" });
    const today = new Date().toISOString().slice(0, 10);
    await Data.add("expenses", { trip_id: trip.id, category: "Comida", amount: 100, paid_by: "me", split_with: ["me", String(compId)], date: today, description: "Cena" });
  });

  await activateNotifications(page);

  const bodies = (await page.evaluate(() => window.__notifications)).map((n) => n.body);
  expect(bodies.some((b) => b.includes("sin saldar") && b.includes("Praga"))).toBe(true);
});

test.describe("viaje compartido actualizado", () => {
  test.use({ hasTouch: true });

  test("un pull-to-refresh que trae cambios de un viaje compartido avisa una vez", async ({ page }) => {
    await mockCloud(page, { loggedIn: false, syncOnLaunchResult: true });
    await mockNotifications(page);
    await openApp(page);

    await activateNotifications(page);
    await page.evaluate(() => document.querySelectorAll(".modal-overlay").forEach((m) => m.remove()));
    await page.evaluate(() => {
      window.__notifications = [];
    });

    await page.evaluate(() => {
      const target = document.body;
      const dispatch = (type, y) => {
        const touch = new Touch({ identifier: 1, target, clientX: 195, clientY: y });
        target.dispatchEvent(
          new TouchEvent(type, { touches: type === "touchend" ? [] : [touch], changedTouches: [touch], bubbles: true, cancelable: true })
        );
      };
      dispatch("touchstart", 50);
      dispatch("touchmove", 160);
      dispatch("touchend", 160);
    });
    await page.waitForTimeout(900);

    const bodies = (await page.evaluate(() => window.__notifications)).map((n) => n.body);
    expect(bodies.some((b) => b.includes("compartido"))).toBe(true);
  });
});
