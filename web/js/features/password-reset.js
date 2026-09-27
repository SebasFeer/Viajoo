// ============================================================
// password-reset.js — "¿Olvidaste tu contraseña?" en la web.
//
// Firebase manda un email con un enlace para elegir una contraseña
// nueva (sendPasswordResetEmail). Usa una app de Firebase aparte con
// nombre propio, así no depende de la versión del SDK que cargue
// js/cloud.js ni toca su sesión: para pedir el email no hace falta
// haber iniciado sesión.
// ============================================================

import { firebaseConfig } from "../../../js/firebase-config.js";

const SDK_BASE = "https://www.gstatic.com/firebasejs/12.19.0";
const APP_NAME = "viajoo-web-reset";

const ERRORS = {
  "auth/invalid-email": "El email no es válido.",
  "auth/missing-email": "Escribe tu email.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  "auth/network-request-failed": "Sin conexión a internet.",
};

/** Devuelve { ok: true } o { ok: false, error } con un texto listo para mostrar. */
export async function sendReset(email) {
  try {
    const [{ initializeApp, getApps }, authMod] = await Promise.all([import(`${SDK_BASE}/firebase-app.js`), import(`${SDK_BASE}/firebase-auth.js`)]);
    const app = getApps().find((a) => a.name === APP_NAME) || initializeApp(firebaseConfig, APP_NAME);
    const auth = authMod.getAuth(app);
    auth.languageCode = "es";
    await authMod.sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: ERRORS[err?.code] || "No se pudo enviar el email. Revisa tu conexión e inténtalo de nuevo." };
  }
}

/** Ventana para pedir el email de recuperación. */
export function openPasswordReset(ctx, email = "") {
  const { openSheet, esc } = ctx;
  openSheet({
    title: "Recuperar contraseña",
    html: `
      <form class="pwr" novalidate>
        <p class="muted small" style="margin-top:0">Escribe el email de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.</p>
        <label class="field"><span class="label">Email</span><input id="pwr-email" type="email" autocomplete="email" value="${esc(email)}" required /></label>
        <p class="form-error" role="alert"></p>
        <button class="btn btn-primary btn-block" type="submit">Enviar enlace</button>
      </form>
      <div class="pwr-done" hidden>
        <p><b>Revisa tu correo.</b></p>
        <p class="muted small">Si hay una cuenta con <b class="pwr-to"></b>, te hemos enviado un enlace para crear una contraseña nueva. Puede tardar unos minutos; mira también en spam.</p>
        <p class="muted small">Si creaste la cuenta con Google, no tiene contraseña: entra con «Continuar con Google».</p>
        <button class="btn btn-secondary btn-block" type="button" data-pwr-close>Volver a iniciar sesión</button>
      </div>`,
    onMount(root, close) {
      const form = root.querySelector("form");
      const input = root.querySelector("#pwr-email");
      const err = root.querySelector(".form-error");
      const btn = form.querySelector("button[type=submit]");
      root.querySelector("[data-pwr-close]").addEventListener("click", close);
      setTimeout(() => input.focus(), 0);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const value = input.value.trim();
        err.textContent = "";
        if (!value) {
          err.textContent = "Escribe tu email.";
          return;
        }
        btn.disabled = true;
        btn.textContent = "Enviando…";
        const res = await sendReset(value);
        btn.disabled = false;
        btn.textContent = "Enviar enlace";
        if (!res.ok) {
          err.textContent = res.error;
          return;
        }
        root.querySelector(".pwr-to").textContent = value;
        form.hidden = true;
        root.querySelector(".pwr-done").hidden = false;
      });
    },
  });
}
