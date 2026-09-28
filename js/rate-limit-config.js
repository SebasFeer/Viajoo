// ============================================================
// rate-limit-config.js — Direcciones de las Cloud Functions que
// ponen límites reales (por cuenta o por email) a acciones que antes
// no tenían ninguno: unirse a un viaje compartido probando códigos, y
// registrar una cuenta / pedir recuperar contraseña en bucle.
//
// Mientras esto esté vacío, esas dos acciones (unirse a un viaje
// compartido, registrarse, recuperar contraseña) simplemente no
// funcionan — no dejan un atajo sin protección, igual que
// login-config.js con el inicio de sesión.
// ============================================================

const JOIN_TRIP_ENDPOINT = "https://us-central1-travel-planner-e16e1.cloudfunctions.net/joinSharedTrip";
const EMAIL_ACTION_QUOTA_ENDPOINT = "https://us-central1-travel-planner-e16e1.cloudfunctions.net/checkEmailActionQuota";

export { JOIN_TRIP_ENDPOINT, EMAIL_ACTION_QUOTA_ENDPOINT };
