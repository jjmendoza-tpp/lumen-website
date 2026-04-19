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

## 2026-04-18

- Cuando un site de Netlify muestra `deploy_source: api` y `commit_ref: null`, no está enlazado a auto-deploy Git. La señal real de repo-linkeo es `build_settings.deploy_key_id != null` + webhook vivo en el repo. Verificar ambos antes de asumir CI/CD.
- Un repo GitHub puede quedar linkeado en Netlify a un remoto viejo aunque el equipo ya migró al nuevo; el webhook sigue disparando pero al repo equivocado, así que pushes al repo correcto pasan desapercibidos. Revisar `build_settings.repo_path` vs `git remote -v` cuando los pushes "no hacen nada".
- Linkear un repo nuevo a Netlify vía token personal (sin el GitHub App de Netlify) requiere 3 pasos: crear deploy key (`POST /deploy_keys`), registrar la public key read-only en GitHub (`gh api repos/.../keys`), crear webhook `push` apuntando a `https://api.netlify.com/hooks/github`. Luego `PATCH /sites/:id` con `{repo: {...}}` completa el binding.
- Activar `enforce_admins: true` en branch protection invalida el `git push` directo incluso para el owner. Todo cambio pasa a requerir PR + squash. Documentar el comando de rollback (`gh api -X DELETE .../protection`) antes de activarlo para no quedar atrapado.
- `gh` CLI con múltiples cuentas activa la última por default. Si el repo pertenece a otra cuenta, hacer `gh auth switch --user <owner>` antes de configurar security features; si no, todo devuelve `404 Not Found` con error engañoso.
- El git credential helper de macOS cachea el primer token que funcionó. Con multi-cuenta GitHub, un `git push` puede enviar el token equivocado aunque `gh auth switch` haya cambiado la cuenta activa. Workaround: `git push "https://<user>:$TOKEN@github.com/..."` explícito para el push crítico.
- Para una landing estática servida por CDN, la única superficie real de XSS son los scripts externos (GTM, GA4, LinkedIn, HubSpot, Chatwoot). CSP con allowlist estricto + `'unsafe-inline'` para scripts inline de Next es el compromiso mínimo viable; SRI no aplica a scripts cargados dinámicamente.
- En marketing sites con tráfico pagado inminente, el mayor riesgo no es el exploit sofisticado sino el spam-bot masivo contra el form. CAPTCHA server-side en HubSpot mueve más la aguja que cualquier security header.
- El connector MCP de Netlify expone read + env vars + repo config pero no `trigger-build`/`create-deploy`. Para disparar deploy manual el fallback es `netlify-cli` con `NETLIFY_AUTH_TOKEN` — pedir el token al usuario explícitamente, nunca asumir.

## 2026-04-19

- HubSpot reCAPTCHA Enterprise carga scripts desde `google.com` (sin www) y `recaptcha.net` (no solo `www.google.com`). Cuando actives reCAPTCHA en un form, añade los 4 orígenes al CSP (script-src, connect-src, frame-src): `https://google.com`, `https://www.google.com`, `https://recaptcha.net`, `https://www.recaptcha.net`.
- El embed v2 de HubSpot (`https://js.hsforms.net/forms/embed/{portal}.js`) renderiza el form dentro de un iframe hosted en `js.hsforms.net` y carga CSS/JS/fonts compartidos desde `static.hsappstatic.net`. Ambos orígenes deben estar en `frame-src`, `script-src`, `style-src`, `font-src`, `connect-src`. Si falta alguno, el form se ve vacío pero el loader script sí carga — lo cual hace confuso el debug (parece "todo OK pero no aparece el form").
- Cuando un site estático de Netlify tiene Vercel también conectado al mismo GitHub repo, cada push dispara builds en ambos y Vercel falla con `routes-manifest.json not found` si el proyecto está configurado para Next.js full-stack pero el repo ahora hace static export. Desconectar Vercel desde Project → Settings → Git evita el email de error en cada push.
- Para diagnosticar issues con Chatwoot hosted: `GET /api` devuelve `{version, queue_services, data_services}` sin autenticación — útil para confirmar versión running y detectar si backend services están en estado failing antes de asumir que es un bug del frontend.
- En Chatwoot ≥4.x el widget SDK se genera vía `pnpm run build:sdk` (modo library Vite IIFE) y se coloca en `public/packs/js/sdk.js`. Este build está enganchado al hook rake `before_assets_precompile` en `lib/tasks/build.rake`, pero ese hook usa Ruby `system()` que no raise en fallo — si `pnpm run build:sdk` falla, el `assets:precompile` completa "exitoso" y la imagen Docker queda sin el SDK. Los logs del build hay que revisarlos aisladamente para atrapar el error real.
- Cuando Chatwoot sirve `/app/*` con status 200 pero `Content-Length: 0`, es Rails SPA catch-all devolviendo HTML vacío — indicador de que el archivo estático no existe en filesystem. Distinto al 404 que devuelve nginx cuando falla antes de Rails. Ambos comportamientos pueden coexistir en el mismo server según cómo esté el `try_files` de nginx.
- El tool `promrepo` permite bajar repos upstream de Prometheus (Azure DevOps para productos oficiales + GitHub para Chatwoot base) con `fetch-product lumen`. Antes de escribir un email a IT por un bug de infra, clonar el código relevante y encontrar la causa raíz exacta produce un reporte 10× más accionable que "no funciona, revísenlo".
