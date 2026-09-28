import { test, expect } from "@playwright/test";
import { mockCloud, openApp } from "./fixtures/helpers.js";

test.use({ hasTouch: true });

test("deslizar para recargar sincroniza en el sitio, sin recargar la página ni perder el saludo", async ({ page }) => {
  await mockCloud(page, { loggedIn: true, syncOnLaunchResult: false });
  let navigations = 0;
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) navigations++;
  });

  await openApp(page);
  navigations = 0; // ignora la navegación de goto()
  await page.evaluate(() => {
    window.__syncOnLaunchCalls = 0;
  });

  const greetingBefore = (await page.locator(".hero-greeting").textContent()) || "";
  expect(greetingBefore).toContain("Sebastian");

  await page.evaluate(() => {
    const target = document.body;
    const dispatch = (type, y) => {
      const touch = new Touch({ identifier: 1, target, clientX: 195, clientY: y });
      target.dispatchEvent(
        new TouchEvent(type, { touches: type === "touchend" ? [] : [touch], changedTouches: [touch], bubbles: true, cancelable: true })
      );
    };
    dispatch("touchstart", 50);
    dispatch("touchmove", 160); // dy = 110, pasa el umbral de 70px
    dispatch("touchend", 160);
  });
  await page.waitForTimeout(900); // pasa MIN_SPIN_MS del gesto

  expect(navigations).toBe(0); // antes esto hacía location.reload()
  const syncCalls = await page.evaluate(() => window.__syncOnLaunchCalls);
  expect(syncCalls).toBe(1);
  const greetingAfter = (await page.locator(".hero-greeting").textContent()) || "";
  expect(greetingAfter).toContain("Sebastian"); // nunca pasa por el saludo genérico de arranque
});

test("un arrastre corto (por debajo del umbral) no sincroniza nada", async ({ page }) => {
  await mockCloud(page, { loggedIn: true, syncOnLaunchResult: false });
  await openApp(page);
  await page.evaluate(() => {
    window.__syncOnLaunchCalls = 0;
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
    dispatch("touchmove", 90); // dy = 40, no llega al umbral
    dispatch("touchend", 90);
  });
  await page.waitForTimeout(600);

  const syncCalls = await page.evaluate(() => window.__syncOnLaunchCalls);
  expect(syncCalls).toBe(0);
});
