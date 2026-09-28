import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MOCK_CLOUD_PATH = fileURLToPath(new URL("./mock-cloud.js", import.meta.url));
export const MOCK_CLOUD_SOURCE = readFileSync(MOCK_CLOUD_PATH, "utf8");

/** Sirve el mock de cloud.js en vez del real (que hablaría con Firebase). */
export async function mockCloud(page, config = {}) {
  await page.addInitScript((cfg) => {
    window.__mockCloudConfig = cfg;
  }, config);
  await page.route("**/js/cloud.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: MOCK_CLOUD_SOURCE })
  );
}

/** Abre la app y cierra la bienvenida de onboarding si aparece. */
export async function openApp(page) {
  await page.goto("/index.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const skip = page.locator("#ob-skip");
  if (await skip.count()) {
    await skip.click();
    await page.waitForTimeout(300);
  }
}

/** Sustituye window.Notification por un espía: permiso "granted" de
 * entrada, y cada notificación creada se guarda en window.__notifications
 * en vez de mostrarse de verdad. */
export async function mockNotifications(page) {
  await page.addInitScript(() => {
    window.__notifications = [];
    class FakeNotification {
      constructor(title, opts) {
        window.__notifications.push({ title, body: (opts && opts.body) || "" });
      }
    }
    FakeNotification.permission = "granted";
    FakeNotification.requestPermission = () => Promise.resolve("granted");
    window.Notification = FakeNotification;
  });
}

/** Activa el modo Pro de pruebas (Ajustes → Modo desarrollador), para
 * poder crear más de 2 viajes en un test sin que estorbe el límite del
 * plan gratis. */
export async function enableTestProMode(page) {
  await page.evaluate(async () => {
    const { Data } = await import("/js/db.js");
    await Data.settingSet("is_pro", true);
  });
}

/** Crea un viaje desde la pantalla de inicio; deja al usuario en el
 * home (sale del viaje si el alta lo hubiera abierto). */
export async function createTrip(page, { name, destination, startDate, endDate }) {
  if (await page.locator("#btn-back").count()) {
    await page.locator("#btn-back").click();
    await page.waitForTimeout(200);
  }
  await page.locator("#fab-new-trip").click();
  await page.locator("#f_name").waitFor();
  await page.fill("#f_name", name);
  await page.fill("#f_destination", destination);
  await page.fill("#f_start_date", startDate);
  await page.fill("#f_end_date", endDate);
  await page.locator('button[type="submit"]').click();
  await page.locator(".modal-overlay").waitFor({ state: "detached" }).catch(() => {});
  await page.waitForTimeout(200);
}
