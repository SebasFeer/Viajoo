// ============================================================
// functions/index.js — Cloud Functions de Viajoo: formulario de
// contacto, inicio de sesión con protección anti fuerza bruta,
// unirse a un viaje compartido y los cupos diarios de registro/
// recuperar contraseña. Todas responden a peticiones HTTP públicas
// (onRequest), con CORS activado para que las llame el navegador.
// ============================================================

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

function todayUtcString() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD en UTC
}

// ============================================================
// Cloud Function "sendContactMessage" — formulario de contacto.
//
// Esta función NO exige sesión iniciada: cualquiera (incluso alguien
// con problemas para registrarse) tiene que poder escribir. Como es
// un endpoint público, valida los campos y limita cuántos mensajes
// puede mandar la misma dirección de email en un día, para frenar
// spam básico sin necesitar un captcha.
//
// El mensaje SIEMPRE se guarda en Firestore (colección
// "contact_messages"), así que nunca se pierde aunque el envío del
// correo de abajo no esté configurado todavía. Se envía usando la
// API de Deomail (https://deomail.com), el proveedor de
// contacto@viajoo.es. Para activarlo hace falta:
//   1. Crear una clave API en Deomail (Ajustes → Claves API).
//   2. Guardar la clave con:
//      firebase functions:secrets:set DEOMAIL_API_KEY
//   3. Volver a desplegar esta función.
// Mientras DEOMAIL_API_KEY no esté configurada, el mensaje se guarda
// igualmente en Firestore — se puede leer desde la consola de
// Firebase — solo que no se envía el correo automático.
// OJO: la API de Deomail no tiene campo "reply_to", así que el
// nombre y email de quien escribe van bien visibles en el asunto y
// el cuerpo del correo, para poder copiarlos a mano al responder.
// ============================================================

const CONTACT_MESSAGE_MAX_LENGTH = 2000;
const CONTACT_DAILY_LIMIT_PER_EMAIL = 5;
const CONTACT_TO_EMAIL = "contacto@viajoo.es";
const CONTACT_FROM_EMAIL = "contacto@viajoo.es";

const DEOMAIL_API_KEY = defineSecret("DEOMAIL_API_KEY");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Envía un email con la API de Deomail. A lo mejor esfuerzo: si el
 * secreto todavía no tiene una clave real (queda en el valor
 * marcador de posición mientras no se configura), no hace nada. Los
 * fallos de red se registran pero nunca se propagan — quien llama
 * decide si eso debe impedir responder "ok". */
async function sendEmailViaDeomail({ from, to, subject, text, html }) {
  if (!DEOMAIL_API_KEY.value() || DEOMAIL_API_KEY.value() === "PENDIENTE_DE_CONFIGURAR") return;
  await fetch("https://api.deomail.com/v1/send", {
    method: "POST",
    headers: {
      "X-API-Key": DEOMAIL_API_KEY.value(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, html }),
  });
}

/** Igual que reserveDailyQuota, pero por email (no por cuenta) y con
 * su propio tope: evita que una misma dirección inunde el buzón. */
async function reserveContactQuota(email) {
  const today = todayUtcString();
  const ref = admin.firestore().collection("contact_message_quota").doc(`${email}_${today}`);
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? snap.data().count || 0 : 0;
    if (count >= CONTACT_DAILY_LIMIT_PER_EMAIL) return { allowed: false };
    tx.set(ref, { email, date: today, count: count + 1 }, { merge: true });
    return { allowed: true };
  });
}

exports.sendContactMessage = onRequest(
  { secrets: [DEOMAIL_API_KEY], cors: true },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "Método no permitido." });
        return;
      }

      const body = req.body || {};
      const name = String(body.name || "").trim().slice(0, 200);
      const email = String(body.email || "").trim().slice(0, 200);
      const message = String(body.message || "").trim().slice(0, CONTACT_MESSAGE_MAX_LENGTH);
      // Campo trampa: invisible para una persona, pero un bot que
      // rellena todos los campos del formulario sí lo escribe.
      const honeypot = String(body.website || "").trim();

      if (honeypot) {
        // No delatamos que se detectó como spam: respondemos como si
        // hubiera ido bien para no darle pistas al bot.
        res.status(200).json({ ok: true });
        return;
      }

      if (!name || !email || !message) {
        res.status(400).json({ error: "Faltan campos por rellenar." });
        return;
      }
      if (!isValidEmail(email)) {
        res.status(400).json({ error: "El email no es válido." });
        return;
      }
      if (message.length < 10) {
        res.status(400).json({ error: "Cuéntanos un poco más en el mensaje." });
        return;
      }

      const quota = await reserveContactQuota(email);
      if (!quota.allowed) {
        res.status(429).json({ error: "Has enviado demasiados mensajes hoy. Inténtalo mañana." });
        return;
      }

      await admin.firestore().collection("contact_messages").add({
        name,
        email,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "new",
      });

      try {
        await sendEmailViaDeomail({
          from: CONTACT_FROM_EMAIL,
          to: [CONTACT_TO_EMAIL],
          subject: `Nuevo mensaje de contacto de ${name} (${email})`,
          text: `De: ${name} <${email}>\n\n${message}`,
          html: `<p><strong>De:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
        });
      } catch (mailErr) {
        // El mensaje ya está a salvo en Firestore; un fallo aquí no
        // debe impedir responder "ok" a quien escribió.
        console.error("Error enviando el email de contacto:", mailErr);
      }

      res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error interno enviando el mensaje." });
    }
  }
);

// ============================================================
// LOGIN CON PROTECCIÓN ANTI FUERZA BRUTA — sustituye al inicio de
// sesión con email/contraseña hecho directo desde el cliente, para
// que los intentos fallidos se cuenten de verdad por cuenta (no se
// pueden esquivar borrando datos locales o cambiando de
// dispositivo). Bloqueos progresivos, contados desde el último
// inicio de sesión correcto:
//   - 3 fallos seguidos -> bloqueo de 1 minuto
//   - 5 fallos seguidos -> bloqueo de 5 minutos
//   - 7 fallos seguidos -> cuenta bloqueada hasta que se revise a
//     mano (se avisa por email a contacto@viajoo.es para que el
//     admin la revise)
//
// El Admin SDK no puede comprobar contraseñas (solo emitir tokens),
// así que la contraseña se verifica llamando a la API pública de
// Identity Toolkit — la misma que usa el SDK de cliente por debajo.
// Si es correcta, se firma un "custom token" con el Admin SDK: el
// cliente lo usa con signInWithCustomToken para completar el inicio
// de sesión sin haber tenido que manejar la contraseña él mismo.
//
// Para desbloquear una cuenta bloqueada por seguridad: en la consola
// de Firebase, colección "login_lockouts", documento con el email
// (en minúsculas) como id — borra el documento o pon failCount a 0
// y adminLocked a false.
// ============================================================

// Clave pública del proyecto (la misma que en js/firebase-config.js
// — no es secreta, solo identifica el proyecto; la seguridad real la
// dan las reglas de Firestore y este mismo límite de intentos).
const FIREBASE_WEB_API_KEY = "AIzaSyAf7_HlFAGs4cpxE5beaic5bXgmvdFOV5c";

const LOGIN_LOCKOUT_STEPS = [
  { attempts: 3, lockMs: 60 * 1000 },
  { attempts: 5, lockMs: 5 * 60 * 1000 },
];
const LOGIN_ADMIN_LOCK_ATTEMPTS = 7;

function normalizeEmailKey(email) {
  return String(email).trim().toLowerCase();
}

function formatLockRemaining(ms) {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));
  if (totalSeconds <= 90) return `${totalSeconds} segundos`;
  return `${Math.ceil(totalSeconds / 60)} minutos`;
}

async function checkLoginLockout(ref) {
  const snap = await ref.get();
  if (!snap.exists) return { blocked: false };
  const data = snap.data();
  if (data.adminLocked) return { blocked: true, adminLocked: true };
  if (data.lockedUntil && data.lockedUntil.toMillis() > Date.now()) {
    return { blocked: true, remainingMs: data.lockedUntil.toMillis() - Date.now() };
  }
  return { blocked: false };
}

/** Registra un intento fallido de forma atómica y decide si toca
 * bloqueo temporal o bloqueo definitivo (admin). */
async function registerFailedLoginAttempt(ref) {
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const prev = snap.exists ? snap.data() : {};
    const failCount = (prev.failCount || 0) + 1;
    const update = { failCount, lastAttemptAt: admin.firestore.FieldValue.serverTimestamp() };

    if (failCount >= LOGIN_ADMIN_LOCK_ATTEMPTS) {
      update.adminLocked = true;
      update.lockedUntil = null;
      tx.set(ref, update, { merge: true });
      return { failCount, lockMs: 0, adminLocked: true };
    }

    const step = LOGIN_LOCKOUT_STEPS.find((s) => s.attempts === failCount);
    if (step) {
      update.lockedUntil = admin.firestore.Timestamp.fromMillis(Date.now() + step.lockMs);
    }
    tx.set(ref, update, { merge: true });
    return { failCount, lockMs: step ? step.lockMs : 0, adminLocked: false };
  });
}

async function notifyAdminAccountLocked(email) {
  await sendEmailViaDeomail({
    from: CONTACT_FROM_EMAIL,
    to: [CONTACT_TO_EMAIL],
    subject: `Cuenta bloqueada por seguridad: ${email}`,
    text:
      `La cuenta ${email} se bloqueó tras ${LOGIN_ADMIN_LOCK_ATTEMPTS} intentos fallidos de inicio de sesión seguidos.\n\n` +
      `Para revisarla: consola de Firebase → Firestore → colección "login_lockouts" → documento "${email}".\n` +
      `Si es un usuario legítimo que olvidó su contraseña, borra ese documento (o pon failCount a 0 y adminLocked a false) para desbloquearla.`,
  });
}

exports.loginWithPassword = onRequest(
  { secrets: [DEOMAIL_API_KEY], cors: true },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "Método no permitido." });
        return;
      }

      const email = String((req.body || {}).email || "").trim();
      const password = String((req.body || {}).password || "");
      if (!email || !password) {
        res.status(400).json({ error: "Faltan email o contraseña." });
        return;
      }

      const key = normalizeEmailKey(email);
      const ref = admin.firestore().collection("login_lockouts").doc(key);

      const lockStatus = await checkLoginLockout(ref);
      if (lockStatus.blocked) {
        if (lockStatus.adminLocked) {
          res.status(423).json({
            error: "Esta cuenta está bloqueada por seguridad tras demasiados intentos fallidos. Contacta con soporte (contacto@viajoo.es) para que la revisen.",
            adminLocked: true,
          });
        } else {
          res.status(429).json({
            error: `Demasiados intentos fallidos. Inténtalo de nuevo en ${formatLockRemaining(lockStatus.remainingMs)}.`,
          });
        }
        return;
      }

      let authResult = null;
      try {
        const resp = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
          }
        );
        const json = await resp.json();
        if (resp.ok) {
          authResult = json;
        } else {
          // Credenciales incorrectas (o cuenta inexistente): cuenta
          // como intento fallido más abajo. `authResult` se queda en
          // null, que es justo lo que distingue este caso del error
          // de red del catch de fuera.
        }
      } catch (networkErr) {
        console.error("Error verificando credenciales:", networkErr);
        res.status(503).json({ error: "No se pudo verificar el inicio de sesión. Inténtalo de nuevo." });
        return;
      }

      if (!authResult) {
        const { lockMs, adminLocked } = await registerFailedLoginAttempt(ref);

        if (adminLocked) {
          notifyAdminAccountLocked(key).catch((e) => console.error("Error avisando al admin:", e));
          res.status(423).json({
            error: "Esta cuenta ha sido bloqueada por seguridad tras demasiados intentos fallidos. Contacta con soporte (contacto@viajoo.es) para que la revisen.",
            adminLocked: true,
          });
          return;
        }
        if (lockMs > 0) {
          res.status(429).json({
            error: `Demasiados intentos fallidos. Inténtalo de nuevo en ${formatLockRemaining(lockMs)}.`,
          });
          return;
        }

        // No distinguimos "no existe esa cuenta" de "contraseña
        // incorrecta": así no se puede usar el login para averiguar
        // qué emails están registrados.
        res.status(401).json({ error: "Email o contraseña incorrectos." });
        return;
      }

      // Login correcto: reinicia el contador de fallos.
      await ref.set({ failCount: 0, lockedUntil: null }, { merge: true });

      const customToken = await admin.auth().createCustomToken(authResult.localId);
      res.status(200).json({ token: customToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error interno iniciando sesión." });
    }
  }
);

// ============================================================
// UNIRSE A UN VIAJE COMPARTIDO — antes esto lo hacía el cliente
// directamente contra Firestore (leer shared_trips/{code} y añadirse
// a "members"), lo que dejaba dos huecos: cualquier cuenta podía
// probar códigos de 6 caracteres sin ningún límite de intentos, y
// firestore.rules tenía que permitir leer el documento a cualquier
// usuario con sesión iniciada (aunque no fuera miembro todavía) para
// que ese flujo funcionara. Ahora el Admin SDK hace la lectura y la
// escritura aquí, con cupo diario por cuenta, y firestore.rules ya
// solo deja leer/escribir a quien ya es miembro — nadie puede
// "probar" códigos desde el cliente aunque tenga sesión iniciada.
// ============================================================
const JOIN_TRIP_DAILY_LIMIT = 2;

async function reserveJoinTripQuota(uid) {
  const today = todayUtcString();
  const ref = admin.firestore().collection("join_trip_quota").doc(`${uid}_${today}`);
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? snap.data().count || 0 : 0;
    if (count >= JOIN_TRIP_DAILY_LIMIT) return { allowed: false };
    tx.set(ref, { uid, date: today, count: count + 1 }, { merge: true });
    return { allowed: true };
  });
}

exports.joinSharedTrip = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Método no permitido." });
      return;
    }

    const authHeader = req.get("Authorization") || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) {
      res.status(401).json({ error: "Inicia sesión para unirte a un viaje compartido." });
      return;
    }
    const decoded = await admin.auth().verifyIdToken(idToken);

    const code = String((req.body || {}).code || "").trim().toUpperCase();
    if (!code) {
      res.status(400).json({ error: "Introduce un código." });
      return;
    }

    const quota = await reserveJoinTripQuota(decoded.uid);
    if (!quota.allowed) {
      res.status(429).json({ error: `Has alcanzado el límite de ${JOIN_TRIP_DAILY_LIMIT} intentos de hoy. Inténtalo mañana.` });
      return;
    }

    const ref = admin.firestore().collection("shared_trips").doc(code);
    const snap = await ref.get();
    if (!snap.exists) {
      res.status(404).json({ error: "No existe ningún viaje con ese código." });
      return;
    }

    await ref.update({ members: admin.firestore.FieldValue.arrayUnion(decoded.uid) });

    res.status(200).json({ payload: JSON.parse(snap.data().data) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno al unirse al viaje compartido." });
  }
});

// ============================================================
// CUPO DIARIO DE REGISTRO / RECUPERAR CONTRASEÑA — signUp y
// resetPassword llaman al SDK de Firebase Auth directamente desde el
// navegador (no hay contraseña que verificar aquí, así que no hace
// falta un proxy completo como loginWithPassword). Pero sin ningún
// tope, nada impide registrar cuentas en bucle o inundar el buzón de
// alguien con emails de "recuperar contraseña". Esta función solo
// comprueba y reserva cupo por email: el cliente la llama ANTES de
// pedirle a Firebase que registre la cuenta o mande el email.
// ============================================================
const EMAIL_ACTION_DAILY_LIMIT = 2;
const EMAIL_ACTIONS = ["signup", "reset_password"];

async function reserveEmailActionQuota(action, email) {
  const today = todayUtcString();
  const key = normalizeEmailKey(email);
  const ref = admin.firestore().collection("email_action_quota").doc(`${action}_${key}_${today}`);
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? snap.data().count || 0 : 0;
    if (count >= EMAIL_ACTION_DAILY_LIMIT) return { allowed: false };
    tx.set(ref, { email: key, action, date: today, count: count + 1 }, { merge: true });
    return { allowed: true };
  });
}

exports.checkEmailActionQuota = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Método no permitido." });
      return;
    }

    const email = String((req.body || {}).email || "").trim();
    const action = String((req.body || {}).action || "");
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: "El email no es válido." });
      return;
    }
    if (!EMAIL_ACTIONS.includes(action)) {
      res.status(400).json({ error: "Acción no reconocida." });
      return;
    }

    const quota = await reserveEmailActionQuota(action, email);
    if (!quota.allowed) {
      res.status(429).json({ error: `Has alcanzado el límite de ${EMAIL_ACTION_DAILY_LIMIT} intentos de hoy. Inténtalo mañana.` });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno comprobando el límite." });
  }
});
