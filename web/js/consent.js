// ============================================================
// consent.js — Banner de consentimiento de publicidad (Google
// AdSense) para la web de marketing de Viajoo. No se usa dentro de
// la app (PWA/Android), que nunca muestra anuncios.
//
// La decisión se guarda en localStorage y controla si se piden
// anuncios personalizados a Google o no (ver index.html/legal.html:
// un script, antes de cargar adsbygoogle.js, lee la misma clave para
// que la primera carga de la página ya respete la elección anterior
// sin esperar a este módulo).
// ============================================================

const CONSENT_KEY = "viajoo_ads_consent";

function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function setConsent(choice) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch (err) {
    // sin almacenamiento disponible: no hay nada que guardar, se
    // volverá a preguntar la próxima vez.
  }
}

function applyAdsSetting(consent) {
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.requestNonPersonalizedAds = consent?.choice === "granted" ? 0 : 1;
}

function renderBanner() {
  if (document.getElementById("cookie-banner")) return;
  const el = document.createElement("div");
  el.id = "cookie-banner";
  el.className = "cookie-banner";
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", "Preferencias de cookies");
  el.innerHTML = `
    <div class="wrap cookie-banner-inner">
      <p>Usamos cookies de Google AdSense para mostrar anuncios en esta web. Puedes aceptarlos (anuncios personalizados) o rechazarlos (sin personalizar) — la web funciona igual en ambos casos. <a href="legal.html#cookies">Más información</a>.</p>
      <div class="cookie-banner-actions">
        <button type="button" class="btn btn-secondary btn-sm" id="cookie-deny">Rechazar</button>
        <button type="button" class="btn btn-primary btn-sm" id="cookie-accept">Aceptar</button>
      </div>
    </div>`;
  document.body.appendChild(el);

  const choose = (choice) => {
    setConsent(choice);
    applyAdsSetting({ choice });
    el.remove();
  };
  el.querySelector("#cookie-accept").addEventListener("click", () => choose("granted"));
  el.querySelector("#cookie-deny").addEventListener("click", () => choose("denied"));
}

/** Se llama una vez al cargar la página: aplica la elección guardada
 * (si hay) y, si no, muestra el banner para preguntar. */
export function initConsent() {
  applyAdsSetting(getConsent());
  if (!getConsent()) renderBanner();

  // Enlace "Preferencias de cookies" del pie de página: reabre el
  // banner para cambiar de opinión cuando quieras.
  document.querySelectorAll("[data-cookie-prefs]").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      renderBanner();
    })
  );
}
