# Lessons Learned

## 2026-04-14

- No asumir que el repo vigente coincide con el diseño aprobado. Primero hay que contrastarlo contra Figma.
- Para este proyecto, los manuales de tracking sí contienen información operativa crítica y no son opcionales.
- Aunque el sitio final sea estático, mantener una toolchain de build puede ser la vía más rápida y segura si el artefacto publicado no requiere servidor.
- Antes de prometer deploy, verificar credenciales reales del proveedor. En este entorno no había sesión activa de Netlify.
- TypeScript seguirá validando archivos heredados aunque ya no se rendericen; las declaraciones globales compartidas (`window.dataLayer`) deben mantenerse consistentes entre código nuevo y legado.
- Un servidor local básico como `python -m http.server` no representa el comportamiento de clean URLs de Netlify; para validar rutas exportadas conviene revisar también los archivos exactos generados (`index.html`, `en.html`).
- Si se crean sitios de prueba en paralelo con Netlify CLI, hay que verificar `.netlify/state.json`: el CLI puede quedar apuntando al site incorrecto aunque el deploy productivo se haya hecho al proyecto correcto.
- En HubSpot hay que alinear el tipo de embed con la API usada en el componente: el loader `forms/embed/developer/{portal}.js` no garantiza `window.hbspt.forms.create(...)`, y si se mezcla con el flujo legacy el contenedor queda vacío sin romper el resto de la página.
- En validaciones de dominio recién propagado conviene comprobar `http`, `https`, apex y `www` por separado y además hacer smoke test en navegador; un `dig` correcto no garantiza por sí solo que la experiencia productiva ya esté limpia.
- En este formulario de HubSpot, el criterio útil de QA no es “consola perfectamente limpia” sino “iframe visible + campos interactivos + endpoints `render-definition/visitor` exitosos”; existe un `403` residual al endpoint `v3/json` que no impide render ni interacción básica.
- Si HubSpot bloquea submits pero el formulario sí renderiza, revisar primero la autorización del dominio productivo en HubSpot antes de seguir depurando frontend.
- Si una ruta queda en `noindex`, también debe salir del `sitemap.xml`; de lo contrario se envían señales mixtas a motores de búsqueda.
- En Next.js App Router no conviene asumir que el `title.template` resolverá por sí solo la home; el título canónico del root debe validarse en el HTML exportado.
- El tema por defecto y la preferencia persistida deben aplicarse en dos fases: primero leer almacenamiento, luego escribir; si no, se puede sobrescribir la preferencia del usuario en el primer render.
- En Netlify, `.webmanifest` puede servirse como `application/octet-stream` si no se define un header explícito.
- Cuando producción queda conectada a un repo Git distinto del remoto histórico local, documentarlo de inmediato; si no, el siguiente cambio puede publicarse desde el repositorio equivocado.
- Un proyecto en producción no debe conservar un `README` de template. El repo necesita una capa mínima de documentación operativa dentro del propio código.
- En un sitio 100% estático, la validación de identidad de Chatwoot no debe montarse en frontend: cualquier secreto o firma expuesta en cliente compromete la seguridad del inbox.
- Cuando marketing comparte manuales nuevos, deben tratarse como la fuente de verdad operativa para GTM, GA4 y píxeles; no conviene reciclar IDs históricos aunque la implementación técnica no cambie.
