import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // A 1 worker: en runners con pocos recursos (CI gratis, sandboxes),
  // dos Chromium a la vez pueden hacer que el navegador se caiga en
  // mitad de un test en vez de fallar limpiamente.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:8955",
    viewport: { width: 390, height: 700 },
    locale: "es-ES", // la app detecta el idioma del navegador; los tests asumen español
    serviceWorkers: "block", // los tests van contra el HTML/JS servido en vivo, no contra la caché offline
  },
  webServer: {
    command: "node tests/e2e/static-server.mjs",
    url: "http://localhost:8955/index.html",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
