# Decisiones

## 2026-04-14

### Hosting

- Decisión: usar Netlify como plataforma de publicación principal.
- Rationale: reduce la deuda del setup actual en Vercel, permite publicar un sitio estático puro y encaja con DNS externo en GoDaddy.

### Fuente de verdad del frontend

- Decisión: implementar la landing desde el código del Figma Make y no desde la versión previa del repo.
- Rationale: la versión actual del repo diverge del diseño aprobado y no incluye toda la instrumentación de marketing definida en los manuales.

### Pipeline técnico

- Decisión: conservar Next.js 16 como toolchain de construcción, pero publicar únicamente su output estático (`next export`).
- Rationale: maximiza fidelidad y velocidad de ejecución sin introducir backend en producción. La salida final sigue siendo HTML, CSS y JS estáticos.

### Alcance de la migración

- Decisión: aislar la nueva landing en componentes dedicados y minimizar cambios destructivos sobre componentes anteriores.
- Rationale: permite iterar rápido, reducir riesgo y mantener trazabilidad del experimento anterior mientras se sustituye la home por la nueva versión.

### Tracking

- Decisión: mover la integración de GTM, GA4 y LinkedIn al `app/layout.tsx` usando `next/script`, con `noscript` en `body`.
- Rationale: evita duplicados, respeta la semántica de los manuales y usa la API recomendada por Next.js 16 para scripts globales.

### Assets decorativos

- Decisión: recrear el parallax decorativo con shapes CSS en vez de bloquear la implementación por blobs PNG no localizados.
- Rationale: conserva la composición y el movimiento del Figma Make sin introducir un cuello de botella operativo por assets secundarios.

### Ruta inglesa

- Decisión: mantener `/en` como espejo funcional de la landing actual, marcado `noindex`, hasta que exista una versión traducida real.
- Rationale: evita una ruta rota en el export estático, preserva compatibilidad con enlaces existentes y no compite en SEO con el canon principal.

### Build reproducible

- Decisión: fijar `turbopack.root` al `cwd` del proyecto.
- Rationale: elimina la detección errónea del root por lockfiles múltiples y deja el build silencioso y determinista.

### SEO técnico y discovery

- Decisión: usar `https://lumenapp.ai` como único canon indexable, con `Lumen AI` como título del home, descripción en español para la raíz y metadata en inglés solo en `/en`, marcado `noindex`.
- Rationale: concentra equity SEO en una sola URL, evita duplicidad de idioma mientras no exista una traducción real y deja el sitio listo para campañas y Search Console.

### Favicon y manifest

- Decisión: generar `favicon.ico`, `icon-192.png`, `icon-512.png` y `apple-touch-icon.png` desde el asset provisto por el usuario, y forzar `application/manifest+json` para `site.webmanifest`.
- Rationale: asegura consistencia visual del brand en navegador, dispositivos y compartidos, y evita que Netlify sirva el manifest con un MIME genérico.

### Preferencia de tema

- Decisión: cargar siempre en modo claro en la primera visita y persistir la preferencia del usuario en `localStorage` cuando cambie a oscuro o vuelva a claro.
- Rationale: cumple el requerimiento de lanzamiento, evita sorpresas en discovery inicial y mantiene una experiencia consistente para usuarios recurrentes.

### Respaldo operativo

- Decisión: dejar Netlify conectado a un repo Git dedicado como copia segura operativa del proyecto.
- Rationale: reduce riesgo de pérdida de estado de producción y deja una vía estándar para continuidad del deploy fuera de este entorno local.

### Widget web conversacional

- Decisión: integrar el widget web de Lumen/Chatwoot globalmente en el layout del sitio usando el `websiteToken` público del inbox web.
- Rationale: permite que cualquier visita a la landing inicie conversación sin añadir backend ni duplicar puntos de integración por página.

### Validación de identidad del chat

- Decisión: no implementar por ahora la validación de identidad de usuario de Chatwoot en este sitio.
- Rationale: la landing es 100% estática y el valor de validación no puede exponerse en frontend; esa función solo es segura con backend o firma server-side.

## 2026-04-17

### Actualización de medición

- Decisión: reemplazar GTM, GA4 y LinkedIn por los IDs provistos en los manuales vigentes y mantener la misma arquitectura de carga global en `app/layout.tsx`.
- Rationale: el sitio debe medir con los contenedores y propiedades activos del negocio; cambiar solo los IDs reduce riesgo y evita reabrir una integración ya estable.

## 2026-04-18

### Repo productivo correcto

- Decisión: Netlify queda linkeado a `jjmendoza-tpp/lumen-website` (no `lumenapp-ai`).
- Rationale: `lumenapp-ai` había quedado abandonado el 14 de abril; `lumen-website` es el repo activo. Linkeo vía `PATCH /sites/:id` + deploy key read-only (`148948558`) + webhook push/pr/delete (`606928044`).

### Env vars para Chatwoot

- Decisión: `CHATWOOT_BASE_URL` y `CHATWOOT_WEBSITE_TOKEN` se leen de `process.env.NEXT_PUBLIC_CHATWOOT_*` con fallback a los valores productivos hardcodeados.
- Rationale: permite rotar el token desde Netlify sin redeploy manual ni tocar código, y no rompe builds si las env vars no existen.

### Hardening de seguridad antes de campañas

- Decisión: security headers completos en `public/_headers` (CSP allowlist, HSTS preload, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP, form-action restringido).
- Rationale: el sitio va a recibir tráfico pagado; atacantes motivados con LLMs van a probar XSS, clickjacking y SSL strip. Los headers eliminan la superficie trivial sin costo operativo.

### Branch protection en `main`

- Decisión: PRs obligatorios, linear history, force push/deletions bloqueados, `enforce_admins: true`, stale reviews auto-dismissed, conversation resolution required.
- Rationale: previene que un token comprometido defacee producción con un `git push --force`. `required_approving_review_count: 0` mantiene velocidad — la gate es el PR mismo, no la revisión humana.

### Upgrade Next 16.2.1 → 16.2.4

- Decisión: subir Next a la última patch dentro de 16.2.x.
- Rationale: parches de GHSA-q4gf-8mx6-v5v3 (DoS en Server Components) y GHSA-c2c7-rcm5-vvqj (picomatch ReDoS transitivo). `npm audit` en 0 tras el cambio.

### Pendientes de hardening diferidos

- Decisión: diferir a próxima sesión: CAPTCHA en HubSpot form, CAA DNS records, rate-limit + captcha en Chatwoot widget, submit a HSTS preload list.
- Rationale: requieren credenciales fuera del alcance de esta sesión (HubSpot admin, DNS provider, Chatwoot admin, tiempo de observación). No bloquean lanzamiento básico pero son necesarios antes de abrir el grifo de campañas agresivas.

### Baseline auditado

- Decisión: tag `v1.0.0-verified-2026-04-18` sobre `c384408` como baseline productivo auditado.
- Rationale: punto de retorno seguro si un cambio futuro introduce regresión.
