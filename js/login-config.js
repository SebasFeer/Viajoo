// ============================================================
// login-config.js — Dirección de tu Cloud Function de inicio de
// sesión con protección anti fuerza bruta ("loginWithPassword").
//
// El inicio de sesión con email y contraseña pasa por esta función
// (en vez de ir directo al SDK de Firebase desde el navegador) para
// que el límite de intentos fallidos sea real por cuenta y no se
// pueda esquivar borrando datos locales o probando desde otro
// dispositivo. Mientras esto esté vacío, ese inicio de sesión
// simplemente no funciona (para no dejar un atajo sin protección) —
// el resto de la app (Google, crear cuenta nueva) sigue funcionando.
// ============================================================

const LOGIN_ENDPOINT = "https://us-central1-travel-planner-e16e1.cloudfunctions.net/loginWithPassword";

export { LOGIN_ENDPOINT };
