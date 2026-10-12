// ============================================================
// rate-limit-config.js — Dirección de la Cloud Function que pone
// un límite real (por email) a registrar una cuenta / pedir
// recuperar contraseña en bucle.
//
// Mientras esto esté vacío, checkEmailActionQuota no bloquea nada
// (se comporta como si siempre hubiera cupo) — no deja un atajo sin
// protección, igual que login-config.js con el inicio de sesión.
// ============================================================

const EMAIL_ACTION_QUOTA_ENDPOINT = "https://us-central1-travel-planner-e16e1.cloudfunctions.net/checkEmailActionQuota";

export { EMAIL_ACTION_QUOTA_ENDPOINT };
