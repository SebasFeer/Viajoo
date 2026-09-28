// ============================================================
// analytics.js — Estadísticas de uso anónimas (Firebase
// Analytics / Google Analytics), con dos condiciones para que
// funcione de verdad:
//
//   1. Que el proyecto Firebase tenga Analytics activado (rellena
//      "measurementId" en firebase-config.js — sin eso, esto no
//      hace nada, ni siquiera intenta cargar nada).
//   2. Que la persona haya activado "Estadísticas de uso" en
//      Ajustes → Preferencias (por defecto está APAGADO). Sin ese
//      consentimiento, nunca se carga el SDK de Analytics ni se
//      manda ningún dato — ni para quien nunca inicia sesión.
//
// Es independiente de cloud.js (que solo carga el SDK de Firebase
// al iniciar sesión / sincronizar): así también puede medir uso de
// quien nunca crea una cuenta, que es la mayoría de la app al ser
// 100% funcional en local. Ambos módulos pueden acabar cargando el
// mismo SDK de Firebase por separado, así que initializeApp() se
// hace con cuidado de no duplicar la app si el otro ya la creó.
// ============================================================

import { firebaseConfig } from "./firebase-config.js";
import { Data } from "./db.js";

const SDK_BASE = "https://www.gstatic.com/firebasejs/12.19.0";
const CONSENT_KEY = "analytics_consent";

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

async function hasAnalyticsConsent() {
  const value = await Data.settingGet(CONSENT_KEY).catch(() => false);
  return value === true;
}

async function setAnalyticsConsent(value) {
  await Data.settingSet(CONSENT_KEY, !!value);
  if (value) await loadAnalytics();
}

/** Se llama una vez al arrancar la app: si ya se había dado
 * consentimiento en una sesión anterior, carga Analytics de una vez
 * (para no esperar al primer track() y perderse el primer evento). */
async function initAnalyticsIfConsented() {
  if (await hasAnalyticsConsent()) await loadAnalytics();
}

/** Registra un evento de uso (p. ej. "trip_created"), solo si hay
 * consentimiento y Analytics está configurado. Nunca lanza: un fallo
 * aquí no debe afectar a la función que se estaba usando de verdad. */
async function track(eventName, params) {
  try {
    if (!(await hasAnalyticsConsent())) return;
    const instance = await loadAnalytics();
    if (!instance || !logEventFn) return;
    logEventFn(instance, eventName, params);
  } catch (err) {
    // nunca debe romper la acción que disparó el evento
  }
}

export { isAnalyticsConfigured, hasAnalyticsConsent, setAnalyticsConsent, initAnalyticsIfConsented, track };
