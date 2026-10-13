// ============================================================
// legal-texts.js — Textos legales de la web de Viajoo.
//
// Son una COPIA literal de los que muestra la app en Ajustes → Legal
// (constantes *_TEXT de js/app.js), para que la web y la app digan
// exactamente lo mismo. Si cambias uno de esos textos en la app,
// copia el cambio aquí también.
//
// El DNI/NIF del titular se omite a propósito, por protección de
// datos personales — ver el comentario equivalente en js/app.js.
// ============================================================

const YEAR = new Date().getFullYear();

export const LEGAL_DOCS = [
  {
    id: "aviso-legal",
    title: "Aviso legal (LSSI)",
    text: `Última actualización: ${YEAR}

1. Identificación del titular
En cumplimiento del deber de información de la Ley 34/2002, de 11 de
julio, de Servicios de la Sociedad de la Información y de Comercio
Electrónico (LSSI-CE), se informa de que Viajoo es un proyecto
personal cuyo titular es:

Titular: Sebastián Fernández
Domicilio: Aguilar de Campoo, Palencia, España
Correo de contacto: contacto@viajoo.es

Por ahora Viajoo es una aplicación personal gratuita, sin
actividad económica real. Si eso cambia, este aviso se actualizará
con los datos de actividad económica que correspondan.

2. Objeto
Viajoo es una aplicación web (PWA), también distribuible como app de
Android, para organizar viajes: itinerario, vuelos, hoteles, gastos,
documentos y contenido relacionado, guardado principalmente en el
propio dispositivo de quien la usa.

3. Alojamiento (hosting)
La aplicación web se aloja en GitHub Pages (GitHub, Inc. / Microsoft).
La cuenta, la copia en la nube y las funciones
de servidor (Cloud Functions) se alojan en Firebase/Google Cloud
Platform (Google Ireland Limited). Ver el detalle de cada proveedor en
la Política de Privacidad.

4. Condiciones de acceso y uso
El acceso a Viajoo es gratuito. Usar la aplicación implica aceptar
este Aviso Legal, los Términos y Condiciones de Uso, y la Política de
Privacidad. Si no estás de acuerdo con alguno de estos documentos, no
debes usar la aplicación.

5. Normativa aplicable
Este aviso, y el resto de documentos legales de Viajoo, se redactan
conforme a la Ley 34/2002 (LSSI-CE), el Reglamento (UE) 2016/679
(RGPD), la Ley Orgánica 3/2018 (LOPDGDD) y el Texto Refundido de la
Ley General para la Defensa de los Consumidores y Usuarios (Real
Decreto Legislativo 1/2007).

6. Legislación aplicable y fuero
Estas condiciones se rigen por la legislación española. Para
cualquier controversia que no se resuelva por el canal de contacto y
reclamaciones, y cuando la persona usuaria tenga la condición de
consumidora, se estará a lo dispuesto por la normativa de protección
de consumidores en cuanto a juzgados y tribunales competentes — que,
por defecto, son los del domicilio de la persona consumidora, no los
del titular de la app. Esta cláusula no puede usarse para obligar a
un consumidor a litigar en un fuero distinto al que le corresponde
por ley.

7. Modificaciones de este aviso
Este aviso puede actualizarse para reflejar cambios legales o de la
propia app. La fecha de "Última actualización" de arriba indica la
versión vigente.`,
  },
  {
    id: "privacidad",
    title: "Privacidad y protección de datos",
    text: `Última actualización: ${YEAR}

Responsable del tratamiento
Sebastián Fernández, con domicilio en Aguilar de Campoo, Palencia,
España, es quien responde de los datos que trata esta aplicación.
Puedes escribir a contacto@viajoo.es para cualquier duda sobre esta
política o para ejercer tus derechos.

1. Qué datos guarda Viajoo
Los datos de tus viajes (vuelos, hoteles, itinerario, transporte, reservas,
gastos y checklist) se guardan en tu propio dispositivo, en el
almacenamiento local del navegador (IndexedDB). No se envían a ningún
servidor salvo que actives voluntariamente la copia en la nube.

2. Cuenta y copia en la nube
Si creas una cuenta (con email y contraseña, o con tu cuenta de Google),
tus datos se guardan también en Firebase (Google) bajo tu usuario, para
poder recuperarlos en otro dispositivo. Puedes cerrar sesión y eliminar tu
cuenta cuando quieras. Las funciones básicas siguen funcionando sin
cuenta, de forma 100% local; algunas funciones concretas (conversor de
moneda, ordenar ruta, exportar a PDF), en cambio, sí piden tener una
cuenta creada — gratuita, sin ningún cobro.

3. Servicios externos que puede consultar la app
Para mostrar mapas, calcular rutas, encontrar fotos e imágenes reales de
tus vuelos, hoteles, actividades y transportes, descubrir lugares cercanos,
o convertir monedas, la app envía consultas puntuales (por ejemplo, un
nombre de lugar, unas coordenadas, o los códigos de dos monedas) a
servicios públicos de terceros: OpenStreetMap/Nominatim, OSRM y Overpass
(mapas, rutas y lugares cercanos), Wikipedia/Wikimedia Commons/Openverse
(fotos y descripciones), y Frankfurter/open.er-api (tipos de cambio).
Estas consultas no incluyen tu identidad ni el resto de tus datos, solo el
texto necesario para la búsqueda. Además, a diferencia de esas consultas
puntuales, en cada visita el navegador carga las tipografías de la app
(Plus Jakarta Sans, Inter e IBM Plex Mono) desde Google Fonts
(fonts.googleapis.com); esa carga, como la de cualquier recurso externo,
revela tu dirección IP a Google mientras descarga la fuente (ver también
Cookies y almacenamiento local).

4. Encargados del tratamiento (a quién recurrimos para operar Viajoo)
Cuando usas una función que lo requiere, estos proveedores tratan datos
por cuenta nuestra, bajo contrato de encargo del tratamiento (art. 28
RGPD) o como responsables independientes de su propio servicio público:
- Google Ireland Limited (Firebase/Google Cloud): cuenta, copia en la
  nube, funciones de servidor, Google Analytics y Google Fonts.
- GitHub, Inc. / Microsoft: alojamiento de la aplicación web (GitHub
  Pages).
- Deomail: envío de emails transaccionales (formulario de contacto,
  avisos de seguridad de tu cuenta).
- OpenStreetMap/Nominatim, OSRM, Overpass, Wikipedia/Wikimedia
  Commons/Openverse, Frankfurter/open.er-api: servicios públicos de
  mapas, lugares, fotos y tipos de cambio (ver punto 3).
Ninguno de estos proveedores puede usar tus datos para fines propios
distintos de prestarnos su servicio, salvo lo que sus propias
condiciones indiquen para los servicios públicos gratuitos del último
grupo (mapas, fotos, tipos de cambio), que reciben solo el texto puntual
de la consulta, nunca tu identidad.

5. Notificaciones
Si activas los avisos, se generan en tu propio dispositivo a partir de tus
datos guardados localmente. No implican el envío de información a
servidores externos.

6. Exportar a PDF o al calendario del dispositivo
El PDF del itinerario y el archivo .ics para el calendario se generan
enteramente en tu dispositivo, a partir de tus datos guardados, y solo
cuando tú pulsas el botón correspondiente — nunca en automático ni en
segundo plano. El archivo .ics no se sincroniza con nada por su cuenta:
tienes que abrirlo tú mismo con tu app de calendario (Google Calendar,
Apple Calendar...) para decidir qué añadir.

7. PIN y desbloqueo biométrico
El PIN es opcional y, si lo activas, se guarda cifrado (hash) únicamente en
tu dispositivo. Si además activas Face ID/huella como atajo, la
verificación la hace tu propio sistema operativo: la app nunca recibe ni
guarda tu huella o tu cara, solo la confirmación de que el gesto se
completó. Nadie más que tú puede ver ni recuperar tu PIN.

8. Estadísticas de uso y publicidad
Dentro de la app (esta PWA y la app de Android) no se muestra
publicidad. Sí incluye Google Analytics para medir el uso (qué
pantallas se abren, qué funciones se usan, tipo de dispositivo), activo
de forma continua para poder mejorar la aplicación — ver la base legal
en el punto 10 y cómo impedirlo en Cookies y almacenamiento local.
Nunca incluye tus viajes, gastos ni nada de lo que guardas dentro de
la app. La web de viajoo.es (fuera de la app, para quien todavía no
tiene una cuenta) puede mostrar anuncios de Google AdSense: ver el
punto correspondiente en Cookies y almacenamiento local para cómo
funcionan y cómo decidir si los permites.

9. Seguridad y prevención de abusos
Para proteger tu cuenta y el servicio, tratamos de forma limitada datos
técnicos (intentos de inicio de sesión, de registro y de recuperar
contraseña) con el único fin de detectar y frenar patrones de abuso
(fuerza bruta, registro o sincronización masiva). Esta base es nuestro
interés legítimo en mantener el servicio seguro (art. 6.1.f RGPD),
ponderado para no afectar a tu privacidad más de lo necesario: estos
datos solo se usan para ese fin, con un límite de conservación corto,
y son accesibles únicamente desde nuestras funciones de servidor.

10. Base legal y conservación de tus datos
Tratamos tus datos: (a) para prestarte el servicio que pides —
organizar tus viajes—, lo que es necesario para ejecutar el contrato
de uso que aceptas al usar la app; (b) con tu consentimiento expreso,
para funciones opcionales concretas (copia en la nube, PIN, biometría,
notificaciones), consentimiento que puedes retirar en cualquier
momento sin que afecte a lo ya hecho antes de retirarlo; y (c) por
interés legítimo, para la seguridad descrita en el punto 9 y para las
estadísticas de uso del punto 8 — en este último caso, limitando el
dato a lo mínimo necesario para entender el uso agregado de la app,
nunca tu identidad ni tu actividad concreta, y permitiendo que lo
bloquees desde tu navegador en cualquier momento (ver Cookies y
almacenamiento local). Tus datos se conservan mientras mantengas la
app instalada y, si tienes cuenta, hasta que la elimines o nos pidas
que la borremos; los datos técnicos de seguridad del punto 9 se
conservan solo el tiempo necesario para ese fin.

11. Tus derechos
Tienes derecho a acceder, rectificar, suprimir, limitar y oponerte al
tratamiento de tus datos, y a la portabilidad de los mismos. Como la
mayoría de tus datos viven solo en tu dispositivo, ya ejerces varios de
estos derechos tú mismo desde Ajustes → Copiar / restaurar datos
(exportar o borrar) y Ajustes → Mi cuenta (eliminar la cuenta). Para lo
que no puedas hacer directamente, escríbenos a contacto@viajoo.es;
respondemos en el plazo de un mes que marca el RGPD (ampliable dos
meses más en solicitudes complejas, avisándote del motivo). Si
consideras que no hemos atendido bien tu solicitud, puedes reclamar ante
la Agencia Española de Protección de Datos (www.aepd.es).

12. Transferencias internacionales
Google (Firebase) puede tratar datos en servidores fuera del Espacio
Económico Europeo (por ejemplo, en Estados Unidos). Estas
transferencias se acogen a las garantías que exige el capítulo V del
RGPD: las Cláusulas Contractuales Tipo de la Comisión Europea y la
adhesión de Google al EU-U.S. Data Privacy Framework. Puedes pedirnos
una copia de las garantías aplicables escribiendo a contacto@viajoo.es.

13. Brechas de seguridad
Si se produjera una violación de seguridad de tus datos personales que
suponga un riesgo para tus derechos, lo notificaremos a la Agencia
Española de Protección de Datos en el plazo de 72 horas desde que
tengamos constancia (art. 33 RGPD) y te avisaremos directamente si el
riesgo es alto (art. 34 RGPD).

14. Menores de edad
Viajoo no está dirigida a menores de 14 años. Si eres menor de
edad, necesitas el consentimiento de tus padres o tutores para crear
una cuenta o activar funciones que impliquen guardar datos en la nube.

15. Contacto
Si tienes dudas sobre tus datos o esta política, puedes escribirnos a
contacto@viajoo.es.`,
  },
  {
    id: "terminos",
    title: "Términos y condiciones de uso",
    text: `Última actualización: ${YEAR}

1. Objeto y aceptación
Estas condiciones regulan el uso de Viajoo, una aplicación para
organizar viajes. Al usarla, aceptas estas condiciones, el Aviso Legal
y la Política de Privacidad. Si no estás de acuerdo, no uses la
aplicación.

2. Quién puede usarla
Viajoo no está dirigida a menores de 14 años. Si eres menor de
edad, necesitas el consentimiento de tus padres o tutores para crear
una cuenta.

3. Tu cuenta
Crear una cuenta es opcional. Si lo haces, eres responsable de
mantener segura tu contraseña y de la actividad que ocurra con tu
cuenta. Avísanos en contacto@viajoo.es si sospechas un uso no
autorizado.

4. Uso aceptable
Te comprometes a usar Viajoo de forma lícita, sin:
- Intentar acceder a datos de otras personas usuarias sin autorización.
- Interferir con el funcionamiento de la app o de los servicios de
  terceros que consulta (mapas, tipos de cambio...), incluyendo
  intentar saltarte los límites de uso del punto 5.
- Usar la app con fines fraudulentos o para dañar a terceros.

5. Uso justo de las funciones con límite
Algunas funciones (registro de cuenta, recuperar contraseña) tienen un
límite diario de intentos por cuenta o por email, aplicado en el
servidor para que sea real y no se pueda esquivar. Estos límites
existen para mantener el servicio disponible y evitar abusos (por
ejemplo, probar contraseñas al azar); podemos ajustarlos sin previo
aviso si es necesario para proteger la app.

6. Contenido que introduces tú
Los datos de tus viajes (destinos, notas, fotos que subas si lo haces...)
son tuyos. Nos das permiso únicamente para procesarlos y mostrártelos a
ti, nunca para usarlos con otro fin. Ver también Propiedad intelectual.
Eres el único responsable del contenido que introduces, y de que no
infrinja derechos de terceros ni la ley — ver también el punto 10
(indemnización).

7. Disponibilidad del servicio
Viajoo depende en parte de servicios externos gratuitos (mapas,
tipos de cambio, geocodificación...) que pueden fallar o dejar de
estar disponibles sin previo aviso; la app está pensada para seguir
funcionando con lo que ya tengas guardado localmente aunque eso pase.
No garantizamos que el servicio esté disponible de forma
ininterrumpida, ni que esté libre de errores.

8. Cambios en la app y en estas condiciones
Podemos añadir, cambiar o retirar funciones, y actualizar estas
condiciones. Si el cambio es importante, avisaremos dentro de la app
con antelación razonable. Seguir usando Viajoo después de un cambio
implica que lo aceptas; si no lo aceptas, debes dejar de usar la app.

9. Limitación de responsabilidad
Viajoo se ofrece "tal cual" y "según disponibilidad", sin garantías de
que sea ininterrumpida o esté libre de errores. Dentro de lo que
permite la ley, no respondemos de: decisiones de viaje que tomes
basándote en datos de la app (tipos de cambio, horarios, distancias...);
fallos, indisponibilidad o cambios en los servicios externos que
consulta; ni de daños indirectos, lucro cesante o pérdida de datos no
imputable a dolo o negligencia grave por nuestra parte. Nada en esta
cláusula excluye ni limita la responsabilidad por dolo, negligencia
grave, muerte o lesiones personales, ni ningún derecho que la
normativa de consumidores te reconozca de forma imperativa: donde la
ley no permita limitar la responsabilidad, esta cláusula se aplica
solo hasta donde la ley sí lo permite. Revisa siempre la información
importante (horarios de vuelo, tipos de cambio, reservas) con la
fuente oficial antes de viajar.

10. Indemnización
Si tu incumplimiento de estas condiciones (por ejemplo, introducir
contenido ilegal o infractor, o un uso fraudulento de la app) nos causa
un daño o da lugar a una reclamación de terceros, te comprometes a
responder de ello en la medida que corresponda según la ley, sin que
esto afecte a los derechos que tengas como persona consumidora.

11. Contenido ilícito y retirada
Si crees que algún contenido de la app infringe tus derechos, o es por
otro motivo ilícito, escríbenos a contacto@viajoo.es con el detalle.
Revisaremos la notificación y, si procede, retiraremos el contenido o
suspenderemos el acceso de quien lo introdujo, sin perjuicio de las
acciones legales que correspondan.

12. Fuerza mayor
No responderemos de incumplimientos causados por circunstancias fuera
de nuestro control razonable (caídas de proveedores externos, cortes de
red o de suministro, catástrofes, actos de autoridad, etc.).

13. Terminación
Puedes dejar de usar la app y borrar tus datos cuando quieras (Ajustes
→ Copiar / restaurar datos, o eliminar tu cuenta). Podemos suspender el
acceso a quien incumpla gravemente estas condiciones (por ejemplo,
abusando de los límites de uso).

14. Resolución de conflictos
Antes de acudir a la vía judicial, intenta resolver cualquier
desacuerdo escribiendo a contacto@viajoo.es (ver Contacto y
reclamaciones) — la mayoría de incidencias se resuelven así. Como
alternativa voluntaria y gratuita a un juicio, si eres consumidor
puedes acudir a las Juntas Arbitrales de Consumo de tu comunidad
autónoma.

15. Divisibilidad y acuerdo completo
Si algún tribunal declara inválida o inaplicable alguna cláusula de
estas condiciones, el resto sigue en vigor; la cláusula inválida se
sustituye por otra que refleje su intención original dentro de lo que
permite la ley. Estas condiciones, junto con el Aviso Legal y la
Política de Privacidad, son el acuerdo completo entre tú y Viajoo
sobre su uso. Que no apliquemos una cláusula en un caso concreto no
significa que renunciemos a ella.

16. Legislación aplicable
Estas condiciones se rigen por la ley española (ver también Aviso
Legal, punto 6, sobre el fuero aplicable).`,
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual",
    text: `Última actualización: ${YEAR}

1. Titularidad
El código, el diseño, la marca "Viajoo" y los contenidos propios
de la aplicación (textos, iconos e interfaz) son propiedad de
Sebastián Fernández, salvo el software de terceros con licencia propia
(ver Licencias).

2. Uso permitido
Puedes usar Viajoo para organizar tus propios viajes. No está
permitido copiar, modificar, distribuir o hacer ingeniería inversa de
la aplicación sin permiso, salvo lo que permita la ley o la licencia
del software de terceros que incluye.

3. Tus contenidos
Los datos y contenidos que introduces (notas, fotos que subas si lo
haces, nombres de tus viajes...) siguen siendo tuyos. Al introducirlos,
nos das una licencia limitada, no exclusiva y revocable (se extingue si
borras el contenido o tu cuenta) para almacenarlos y mostrártelos a ti
únicamente con el fin de prestarte el servicio. Ver también la sección
"Contenido que introduces tú" de los Términos y Condiciones.

4. Contenido de terceros mostrado en la app
Algunas fotos, descripciones y datos de mapas que se muestran vienen de
fuentes de terceros con su propia licencia:
- Fotos e imágenes: Wikipedia, Wikimedia Commons y Openverse, bajo las
  licencias abiertas que indique cada imagen (mayoritariamente
  Creative Commons).
- Datos de mapas: © colaboradores de OpenStreetMap, licencia Open
  Database License (ODbL).
Estas fuentes se consultan solo para mostrarte información útil sobre
tu destino; no se reclama ninguna propiedad sobre ese contenido.

5. Marcas de terceros
Los nombres de aerolíneas, hoteles, monedas o cualquier otra marca que
escribas, o que aparezca a través de un servicio de terceros
consultado, son propiedad de sus respectivos titulares y se muestran
únicamente porque tú los has introducido o porque provienen de ese
servicio.

6. Reclamaciones de propiedad intelectual
Si crees que algo en la app infringe tus derechos de propiedad
intelectual, escríbenos a contacto@viajoo.es con el detalle para poder
revisarlo. Igual que con cualquier otro contenido ilícito (ver el punto
11 de los Términos y Condiciones de Uso), revisaremos la notificación
y retiraremos el contenido si procede.`,
  },
  {
    id: "cookies",
    title: "Cookies y almacenamiento local",
    text: `Última actualización: ${YEAR}

1. Dentro de la app, Viajoo no usa cookies de rastreo ni publicitarias
Esta aplicación (la PWA y la app de Android) no coloca cookies propias
ni de terceros con fines de publicidad o seguimiento entre sitios.

2. Publicidad en la web (Google AdSense)
La web de viajoo.es — las páginas públicas fuera de la propia app,
pensadas para quien todavía no la usa — puede mostrar anuncios de
Google AdSense. Para eso, Google puede colocar cookies y usar
identificadores del dispositivo con el fin de mostrar anuncios, medir
su rendimiento y, si lo permites, personalizarlos según tu actividad
en otros sitios. Al entrar en esas páginas verás un aviso para elegir
si permites anuncios personalizados o no; sin tu permiso, no se piden
anuncios personalizados. Puedes cambiar tu elección cuando quieras
desde el enlace "Preferencias de cookies" al final de esas páginas.
Puedes consultar cómo trata Google estos datos en
https://policies.google.com/technologies/ads. Esto no afecta a la app
en sí (PWA ni Android), donde nunca hay anuncios.

3. Qué guarda tu navegador entonces (dentro de la app)
En vez de cookies, Viajoo guarda tus datos en dos almacenes
propios del navegador, que solo esta app puede leer y que nunca se
envían a ningún sitio salvo que actives tú la copia en la nube:
- IndexedDB: tus viajes, vuelos, hoteles, gastos, itinerario, y el
  resto de contenido que creas dentro de la app.
- localStorage: ajustes sueltos (por ejemplo, el tema claro/oscuro, y
  tu elección sobre anuncios si la has hecho en la web).
Puedes borrar todo esto en cualquier momento desde los ajustes de tu
navegador ("borrar datos del sitio"), o desde Ajustes → Copiar /
restaurar datos dentro de la app.

4. Estadísticas de uso (Google Analytics)
Viajoo manda a Google Analytics datos de uso (qué pantallas se abren,
qué funciones se usan, tipo de dispositivo) para saber qué mejorar.
Esto funciona de forma continua, sin un interruptor dentro de la app
para desactivarlo. Nunca incluye tus viajes, gastos ni nada de lo que
guardas dentro de la app. Si quieres impedirlo, puedes bloquear el
dominio de Google Analytics (google-analytics.com, googletagmanager.com)
con un bloqueador de contenido en tu navegador.

5. Fuentes de Google Fonts
Para mostrar su tipografía, la app carga las fuentes Plus Jakarta Sans,
Inter e IBM Plex Mono desde fonts.googleapis.com. Esta petición ocurre
en cada visita (no depende de que actives nada) y, como cualquier
carga desde un servidor externo, revela tu dirección IP a Google
mientras se descarga la fuente. No se usa para publicidad ni para
identificarte.

6. Firebase (si inicias sesión)
Si creas una cuenta o inicias sesión con Google, el SDK de Firebase
puede usar almacenamiento local del navegador (no necesariamente
cookies) para mantener tu sesión iniciada entre visitas. Esto solo
ocurre si decides iniciar sesión.

7. Cómo desactivarlo
Puedes bloquear el almacenamiento local desde los ajustes de tu
navegador, pero ten en cuenta que Viajoo necesita IndexedDB
para guardar tus viajes: si lo bloqueas por completo, la app no podrá
funcionar. Las cookies de publicidad de la web (punto 2) se controlan
aparte, desde el aviso al entrar o "Preferencias de cookies".`,
  },
  {
    id: "contacto",
    title: "Contacto y reclamaciones",
    text: `Última actualización: ${YEAR}

1. Contacto
Para cualquier duda, incidencia o solicitud sobre tus datos, escribe a
contacto@viajoo.es.

2. Reclamaciones
Si no estás satisfecho con la respuesta, o quieres presentar una
reclamación formal, puedes:
- Pedir la hoja de reclamaciones escribiendo a contacto@viajoo.es.
- Si eres consumidor, acudir a las Juntas Arbitrales de Consumo de tu
  comunidad autónoma (arbitraje de consumo: gratuito, voluntario para
  ambas partes y más rápido que un juicio).
- Si la reclamación es sobre el tratamiento de tus datos personales,
  puedes acudir a la Agencia Española de Protección de Datos
  (www.aepd.es).
Nada de lo anterior te impide acudir directamente a la vía judicial si
lo prefieres.

3. Tiempo de respuesta
Al ser un proyecto personal, procuramos responder en un plazo
razonable, aunque no podemos garantizar un tiempo fijo mientras no
haya un equipo de soporte dedicado.`,
  },
  {
    id: "licencias",
    title: "Licencias de terceros",
    text: `Última actualización: ${YEAR}

Viajoo usa las siguientes librerías de código abierto y fuentes
de terceros. Se listan aquí en cumplimiento de sus propias licencias,
que exigen dar crédito a su autoría:

- Leaflet — mapa interactivo. Licencia BSD de 2 cláusulas.
  © Vladimir Agafonkin y colaboradores.
- SortableJS — arrastrar y soltar para reordenar listas. Licencia MIT.
  © colaboradores de SortableJS.
- jsPDF — generación del PDF del mapa y del itinerario en el propio
  dispositivo. Licencia MIT. © autores de jsPDF.
- Firebase JS SDK — cuenta y copia en la nube (Google). Licencia
  Apache 2.0.
- Datos de mapas de OpenStreetMap — © colaboradores de OpenStreetMap,
  licencia Open Database License (ODbL) 1.0.
- Tipografías Plus Jakarta Sans, Inter e IBM Plex Mono — Google Fonts,
  licencia SIL Open Font License 1.1.

El texto completo de cada licencia está disponible en el repositorio
del proyecto o en la web de cada proyecto correspondiente.`,
  },
];
