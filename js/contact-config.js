// ============================================================
// contact-config.js — Dirección de tu Cloud Function del
// formulario de contacto.
//
// A diferencia de flightStatus/generateItinerary, esta función NO
// necesita ninguna clave secreta para funcionar de entrada: guarda
// los mensajes en Firestore desde el primer despliegue. Para que
// además lleguen por email a contacto@viajoo.es, ver las
// instrucciones junto a "sendContactMessage" en functions/index.js.
//
//   https://us-central1-travel-planner-e16e1.cloudfunctions.net/sendContactMessage
//
// Mientras esto esté vacío, el formulario de contacto simplemente
// no aparece — no rompe el resto de la app.
// ============================================================

const CONTACT_ENDPOINT = "https://us-central1-travel-planner-e16e1.cloudfunctions.net/sendContactMessage";

export { CONTACT_ENDPOINT };
