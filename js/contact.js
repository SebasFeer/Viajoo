// ============================================================
// contact.js — Envía un mensaje del formulario de contacto a tu
// Cloud Function "sendContactMessage" (ver contact-config.js). No
// necesita sesión iniciada: cualquiera puede escribir.
// ============================================================

import { CONTACT_ENDPOINT } from "./contact-config.js";

function isContactFormConfigured() {
  return !!CONTACT_ENDPOINT;
}

/**
 * Envía { name, email, message }. `website` es un campo trampa
 * opcional (invisible en el formulario) contra bots — se manda tal
 * cual, sin validar aquí; lo comprueba el servidor. Devuelve
 * { ok: true } si se guardó bien, o { ok: false, error } con un
 * mensaje ya listo para mostrar (límite diario alcanzado, campos
 * inválidos, sin conexión...).
 */
async function sendContactMessage({ name, email, message, website }) {
  if (!isContactFormConfigured()) {
    return { ok: false, error: "El formulario de contacto no está disponible ahora mismo." };
  }
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, website }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data.error || "No se pudo enviar el mensaje. Inténtalo de nuevo." };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Sin conexión. Revisa tu internet e inténtalo de nuevo." };
  }
}

export { isContactFormConfigured, sendContactMessage };
