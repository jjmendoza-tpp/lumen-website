# Experimentos

## 2026-04-14 · Verificación de Base Técnica

Objetivo:

- Confirmar si el repo y el entorno actual permiten una publicación estática limpia en Netlify.

Evidencia:

- `next.config.ts` ya usa `output: "export"`.
- El repo construye a estático con `npm run build`.
- El dominio `lumenapp.ai` actualmente apunta a Vercel y el certificado observado cubre `www.lumenapp.ai`, no el apex.
- No se detectaron credenciales activas de Netlify en `~/.netlify` ni variables `NETLIFY_*`.

Resultado:

- El build local es viable.
- El deploy automático final depende de autenticación Netlify o de que el usuario complete login cuando se solicite.

Próximo experimento:

- Reemplazar la home con la implementación fiel al Figma Make y validar:
  - build estático exitoso
  - scripts de marketing presentes
  - formulario HubSpot renderizado
  - responsive funcional

## 2026-04-14 · Validación de Export Estático

Objetivo:

- Confirmar que la nueva landing basada en Figma Make compila, exporta y conserva la instrumentación de marketing.

Evidencia:

- `npm run build` terminó exitosamente con rutas estáticas para `/` y `/en`.
- `out/index.html` contiene GTM `GTM-M293BG6J`, GA4 `G-Z5FPD3R2RX`, LinkedIn `8971250` y el embed HubSpot con portal `50799369` y form `04f6e5eb-168f-4d09-a034-749551ffb9ac`.
- El preview local con `python3 -m http.server 4321 -d out` sirve correctamente `index.html`; la ruta `/en/` muestra directory listing en ese servidor simple, pero `en.html` responde bien, por lo que no es un fallo del bundle sino una limitación del servidor local sin clean URLs.
- Se capturó una screenshot del home local con Playwright tras instalar Chromium, y el hero no muestra fallos obvios de composición, branding o layout inicial.
- `netlify status` responde `Not logged in`, así que el deploy final sigue bloqueado solo por autenticación.

Resultado:

- La landing quedó lista para publicación estática.
- La integración de marketing quedó empaquetada en el output final.
- El único bloqueo externo restante es iniciar sesión en Netlify y conectar el sitio al equipo correcto.

Siguiente paso:

- Ejecutar `netlify login` o usar un token `NETLIFY_AUTH_TOKEN`, desplegar `out/` y actualizar DNS de `lumenapp.ai` en GoDaddy según el site creado.

## 2026-04-14 · Deploy en Netlify

Objetivo:

- Publicar la landing estática en Netlify y dejar `lumenapp.ai` anexado al sitio correcto.

Evidencia:

- Se creó el sitio `lumenapp-ai` en la cuenta `Prometheus` con `site_id` `d2bcf403-da7f-4785-8098-7b30435648c2`.
- Se publicó el deploy productivo `69de9c014d2cebe7fcf9d94e`.
- El dominio por defecto `https://lumenapp-ai.netlify.app` responde correctamente y sirve el bundle final con GTM, GA4, LinkedIn y HubSpot.
- Netlify quedó configurado con `custom_domain = lumenapp.ai` y `domain_aliases = ["www.lumenapp.ai"]`.
- El DNS público aún apunta a Vercel:
  - `lumenapp.ai A -> 76.76.21.21`
  - `www.lumenapp.ai A -> 76.76.21.21`
  - nameservers actuales: `ns67.domaincontrol.com`, `ns68.domaincontrol.com`

Resultado:

- El sitio está publicado y listo en Netlify.
- El dominio custom quedó preparado del lado de Netlify.
- El último bloqueo para que `lumenapp.ai` sirva la nueva landing es cambiar DNS en GoDaddy.

Siguiente paso:

- En GoDaddy:
  - reemplazar el `A` del apex `@` por `75.2.60.5`
  - crear o reemplazar `CNAME` de `www` hacia `lumenapp-ai.netlify.app`
  - eliminar cualquier `AAAA` o `A` residual de Vercel para `@` y `www`

## 2026-04-14 · Validación Productiva Post-DNS

Objetivo:

- Confirmar que `lumenapp.ai` ya sirve la landing correcta con DNS, HTTPS, redirects y tracking listos para recibir tráfico real.

Evidencia:

- El DNS autoritativo y los resolvers públicos ya convergieron al setup esperado:
  - `lumenapp.ai A -> 75.2.60.5`
  - `www.lumenapp.ai CNAME -> lumenapp-ai.netlify.app`
- `curl` confirma comportamiento productivo correcto en dominio:
  - `http://lumenapp.ai` redirige a `https://lumenapp.ai/`
  - `https://lumenapp.ai` responde desde Netlify con `200`
  - `https://www.lumenapp.ai` redirige a `https://lumenapp.ai/`
- El certificado activo ya cubre ambos hosts:
  - SAN: `lumenapp.ai`, `www.lumenapp.ai`
  - issuer: Let's Encrypt
- Playwright en producción no detectó warnings ni errores en consola.
- Playwright confirmó requests reales de tracking:
  - GA4 `G-Z5FPD3R2RX` respondió `204`
  - LinkedIn `8971250` respondió `200/204`
- El HTML servido en `https://lumenapp.ai` contiene los IDs correctos de GTM, GA4, LinkedIn y HubSpot.
- Se detectó un bloqueo real en conversión:
  - el script cargado es `https://js.hsforms.net/forms/embed/developer/50799369.js`
  - en runtime `window.hbspt` permanece `undefined`
  - no se renderiza ningún `iframe` ni `form` de HubSpot
  - el contenedor queda vacío con clase `.hs-form-frame`
- El componente local espera la API legacy `window.hbspt.forms.create(...)`, pero el script cargado corresponde al embed `developer`, que usa otro flujo de inicialización.

Resultado:

- Infraestructura lista: DNS, TLS, redirects y tracking ya están correctos.
- El sitio todavía no está listo para campañas de adquisición porque el formulario de HubSpot no está capturando leads en producción.

Siguiente paso:

- Corregir la integración de HubSpot para usar un único modo compatible:
  - o el loader legacy que expone `window.hbspt.forms.create(...)`
  - o el flujo `developer embed` con placeholder compatible y sin inicialización manual duplicada
- Revalidar en navegador que el formulario renderiza y que el submit dispara el evento esperado.

## 2026-04-14 · Corrección Productiva de HubSpot

Objetivo:

- Restaurar la captura de leads en producción sin tocar el resto de la landing ni la instrumentación de marketing.

Evidencia:

- Se cambió el loader del formulario a `https://js.hsforms.net/forms/embed/v2.js`, compatible con `window.hbspt.forms.create(...)`.
- Se añadió detección directa del formulario/iframe en el DOM para marcar `formReady` aunque HubSpot no dispare el callback en el orden esperado.
- `npm run build` volvió a compilar correctamente después del ajuste.
- Se publicó el deploy productivo `69dea1e29e8368013a89e2a6` en Netlify sobre el sitio `lumenapp-ai`.
- En `https://lumenapp.ai` Playwright confirma:
  - `window.hbspt` presente
  - `iframeCount = 1`
  - el target `data-hubspot-form` queda en `display: block`
  - el iframe contiene el formulario con campos visibles y botón `Enviar`
- Se probó el click sobre `Enviar` sin rellenar campos para verificar interacción segura sin generar un lead de prueba.
- GA4 y LinkedIn continúan disparando requests reales en producción.
- Persiste un `403` en consola hacia `forms.hsforms.com/embed/v3/.../json`, pero HubSpot también responde `200` en `render-definition`, `visitor` y `feature-control`, y el formulario funcional sí se renderiza.

Resultado:

- La landing ya quedó operativa para recibir tráfico con captura de leads visible en producción.
- El `403` residual de HubSpot queda como observación de bajo impacto porque no bloquea el render ni la interacción básica del formulario.

Siguiente paso:

- Monitorear los primeros leads reales en HubSpot para confirmar recepción end to end sin introducir submissions artificiales desde QA.

## 2026-04-14 · Hardening SEO, Discovery y Preferencia Visual

Objetivo:

- Dejar la landing lista para discovery técnico y consistencia de marca sin tocar el core de conversión.

Evidencia:

- Se integró el favicon proporcionado por el usuario y se generaron variantes `favicon.ico`, `icon-192.png`, `icon-512.png` y `apple-touch-icon.png`.
- La home ahora publica `Lumen AI` como título, descripción en español, `canonical` al apex, JSON-LD de `Organization` + `WebSite`, `manifest`, keywords y robots indexables.
- `/en` mantiene descripción y social metadata en inglés, pero continúa en `noindex` y fuera del `sitemap.xml`.
- El `sitemap.xml` quedó reducido a la raíz canónica y `robots.txt` sigue anunciando ese sitemap.
- Se añadió `public/_headers` para que Netlify sirva `site.webmanifest` con `Content-Type: application/manifest+json`.
- Playwright confirmó en producción:
  - primera carga en `theme = light`
  - toggle con persistencia real en `localStorage`
  - recarga posterior manteniendo `theme = dark` cuando el usuario lo eligió
  - formulario HubSpot visible tras la recarga
- `curl` y `openssl` confirmaron en producción:
  - assets de iconos y manifest con `200`
  - TLS activo para `lumenapp.ai` y `www.lumenapp.ai`
  - `Strict-Transport-Security` presente

Resultado:

- La landing quedó endurecida para SEO técnico básico, branding de navegador y preferencia visual estable.
- El sitio ya está en una condición razonable para empujar tráfico pago y orgánico al dominio principal.

Siguiente paso:

- Conectar Search Console y monitorear indexación/cobertura una vez Google recrawlee la versión nueva.

## 2026-04-14 · Consolidación Operativa y Respaldo

Objetivo:

- Dejar el proyecto documentado como activo productivo, con trazabilidad suficiente para operarlo sin depender de este hilo.

Evidencia:

- Se reescribió `README.md` desde el template genérico a un resumen operacional del proyecto.
- Se creó `docs/operations.md` con:
  - estado productivo
  - hosting activo
  - repo Git conectado a Netlify
  - smoke test post-deploy
  - riesgos conocidos
  - archivos críticos
- El usuario confirmó que Netlify quedó conectado al repo `https://github.com/jjmendoza-tpp/lumenapp-ai`.
- En el workspace local todavía aparece un remoto histórico distinto, por lo que se documentó la necesidad de validar el destino Git antes de futuros pushes.

Resultado:

- El proyecto quedó documentado como sistema operativo en producción, no solo como experimento de implementación.
- La continuidad de mantenimiento, QA y deploy ya tiene una base explícita dentro del repo.

Siguiente paso:

- Si el repo local también migrará al repositorio productivo, alinear el remoto Git del workspace antes del próximo ciclo de cambios.

## 2026-04-16 · Integración de Web Widget Lumen

Objetivo:

- Integrar el widget web conversacional de Lumen en la landing productiva sin romper el carácter 100% estático del sitio.

Evidencia:

- Se añadió la configuración `window.chatwootSettings` con:
  - `position = right`
  - `type = expanded_bubble`
  - `launcherTitle = "Habla con Lumen"`
- Se integró el loader oficial de `sdk.js` desde `https://app.innovacion.ai`.
- Se inicializa `chatwootSDK.run(...)` con el `websiteToken` `66KFTkHdoCo8eNDNRMBGisct`.
- La integración se hizo en `app/layout.tsx`, por lo que aplica a toda la landing.
- La validación de identidad compartida por el usuario no se implementó porque el sitio no tiene backend y ese valor no debe exponerse en cliente.
- `npm run build` terminó exitosamente sin romper el export estático.
- Se publicó el deploy productivo `69e19751a1ba48a88c3573dd` en Netlify sobre `https://lumenapp.ai`.
- `curl` confirmó en producción:
  - `https://lumenapp.ai` responde `200`
  - el HTML servido contiene `chatwootSettings`
  - el loader apunta a `https://app.innovacion.ai/packs/js/sdk.js`
  - el `websiteToken` público del inbox está presente
  - el resto de metadata crítica (`title`, `canonical`, `robots`) sigue intacta

Resultado:

- El sitio queda listo para mostrar el widget web del inbox de Lumen en producción.
- La integración mantiene la arquitectura estática del proyecto.

Siguiente paso:

- Abrir `https://lumenapp.ai` y hacer una prueba manual del widget para confirmar:
  - render visual del launcher
  - apertura del panel
  - creación correcta de conversación en el inbox
  - coexistencia limpia con HubSpot

## 2026-04-17 · Actualización de Scripts de Marketing

Objetivo:

- Sustituir las integraciones de GTM, GA4 y LinkedIn por los IDs vigentes de los manuales nuevos sin alterar HubSpot, SEO ni el widget.

Evidencia:

- Los manuales nuevos indican:
  - GTM `GTM-KZNM7JNM`
  - GA4 `G-BWZW45MGRG`
  - LinkedIn `9006578`
- Se reemplazaron esos IDs en `app/layout.tsx`.
- La semántica de integración se mantuvo igual:
  - GTM en `head` + `noscript` en `body`
  - `gtag.js` para GA4
  - Insight Tag + pixel `noscript` para LinkedIn
- `npm run build` terminó correctamente con export estático para `/` y `/en`.
- Se publicó el deploy productivo `69e29ace6ebb4b6994138ddf` sobre `https://lumenapp.ai`.
- `curl` confirmó en producción:
  - `https://lumenapp.ai` responde `200`
  - el HTML servido contiene `GTM-KZNM7JNM`
  - el HTML servido contiene `G-BWZW45MGRG`
  - el HTML servido contiene `9006578`
  - ya no aparecen en la home servida los IDs previos `GTM-M293BG6J`, `G-Z5FPD3R2RX` y `8971250`
  - `canonical` y `robots` permanecen intactos

Resultado:

- El sitio ya publica tráfico y eventos hacia las propiedades vigentes de marketing y analytics a nivel de integración frontend.

Siguiente paso:

- Validar en GTM, GA4 y LinkedIn que las nuevas propiedades empiecen a registrar tráfico real.
