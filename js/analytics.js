// ============================================================
// analytics.js — Estadísticas de uso (Firebase Analytics / Google
// Analytics) para que el desarrollador vea cómo se usa la app. Se
// activa sola en cuanto el proyecto Firebase tiene Analytics
// configurado (rellena "measurementId" en firebase-config.js — sin
// eso, esto no hace nada, ni siquiera intenta cargar nada). No hay
// ningún interruptor para la persona usuaria: se informa de esto en
// la Política de Privacidad y en Cookies y almacenamiento local, sin
// pedir una confirmación aparte dentro de la app.
//
// Es independiente de cloud.js (que solo carga el SDK de Firebase
// al iniciar sesión / sincronizar): así también puede medir uso de
// quien nunca crea una cuenta, que es la mayoría de la app al ser
// 100% funcional en local. Ambos módulos pueden acabar cargando el
// mismo SDK de Firebase por separado, así que initializeApp() se
// hace con cuidado de no duplicar la app si el otro ya la creó.
// ============================================================

import { firebaseConfig } from "./firebase-config.js";

const SDK_BASE = "https://www.gstatic.com/firebasejs/12.19.0";

let analyticsInstance = null;
let logEventFn = null;
let loadingPromise = null;

function isAnalyticsConfigured() {
  return !!firebaseConfig.measurementId;
}

async function loadAnalytics() {
  if (!isAnalyticsConfigured()) return null;
  if (analyticsInstance) return analyticsInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const [appMod, analyticsMod] = await Promise.all([
        import(`${SDK_BASE}/firebase-app.js`),
        import(`${SDK_BASE}/firebase-analytics.js`),
      ]);
      // cloud.js puede haber inicializado ya la app de Firebase (si la
      // persona también tiene sesión iniciada) — reutilizarla en vez
      // de llamar a initializeApp() otra vez, que lanzaría un error.
      const app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(firebaseConfig);
      analyticsInstance = analyticsMod.getAnalytics(app);
      logEventFn = analyticsMod.logEvent;
      return analyticsInstance;
    } catch (err) {
      return null; // sin conexión, CDN bloqueado, etc.: nunca rompe la app
    }
  })();

  return loadingPromise;
}

/** Se llama una vez al arrancar la app: carga Analytics de una vez
 * si está configurado (para no esperar al primer track() y perderse
 * el primer evento). */
async function initAnalytics() {
  await loadAnalytics();
}

/** Registra un evento de uso (p. ej. "trip_created"), si Analytics
 * está configurado. Nunca lanza: un fallo aquí no debe afectar a la
 * función que se estaba usando de verdad. */
async function track(eventName, params) {
  try {
    const instance = await loadAnalytics();
    if (!instance || !logEventFn) return;
    logEventFn(instance, eventName, params);
  } catch (err) {
    // nunca debe romper la acción que disparó el evento
  }
}

export { isAnalyticsConfigured, initAnalytics, track };
