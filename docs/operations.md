# Operación de Producción

Fecha de consolidación: 2026-04-14
Última actualización: 2026-04-18 (auditoría + hardening de seguridad)
Proyecto: Lumen Landing
Baseline auditado: tag `v1.0.0-verified-2026-04-18`

## Estado operativo

- Sitio productivo: `https://lumenapp.ai`
- Alias público: `https://www.lumenapp.ai`
- Hosting: Netlify
- Site ID: `d2bcf403-da7f-4785-8098-7b30435648c2`
- Proyecto Netlify: `lumenapp-ai`
- TLS: activo para `lumenapp.ai` y `www.lumenapp.ai`

## Fuente de verdad

- Diseño aprobado: Figma Make de Lumen
- Design system de apoyo: LUMEN-DESIGN
- Código productivo: este proyecto
- Repo conectado en Netlify por el usuario:
  - `https://github.com/jjmendoza-tpp/lumen-website`

## Flujo de publicación (auto-deploy activo)

1. Crear branch desde `main` actualizado.
2. Cambios locales. Validar con `npm run build` y `npm audit`.
3. Push de la branch, abrir PR contra `main` (obligatorio — branch protegida).
4. Squash-merge con linear history.
5. Netlify detecta el push vía webhook (`https://api.netlify.com/hooks/github`, hook GitHub id `606928044`, deploy key id `148948558`) y compila en ~15–30s.
6. Smoke test contra `https://lumenapp.ai`.

Deploy manual de emergencia (bypass Git, solo si auto-deploy falla):

```bash
NETLIFY_AUTH_TOKEN=<token> npx netlify-cli deploy --prod \
  --dir=out --site=d2bcf403-da7f-4785-8098-7b30435648c2
```

## Smoke test mínimo post-deploy

- `https://lumenapp.ai` responde `200`
- `https://www.lumenapp.ai` redirige al apex
- TLS vigente para apex y `www`
- título del home: `Lumen AI`
- `canonical`: `https://lumenapp.ai`
- `robots.txt` responde con referencia a `sitemap.xml`
- `sitemap.xml` contiene solo la raíz canónica
- `site.webmanifest` responde con MIME correcto
- favicon e iconos responden con `200`
- primer render entra en modo claro
- al cambiar a oscuro, la preferencia persiste al recargar
- HubSpot renderiza el formulario visible
- el launcher del widget web de Lumen/Chatwoot aparece en la página
- el widget abre sin romper el resto de la experiencia

## Configuración de marketing activa

- GTM: `GTM-KZNM7JNM`
- GA4: `G-BWZW45MGRG`
- LinkedIn Insight: `9006578`
- Meta Pixel: `1972992626291725` (PageView automático en `<head>`. Conversions API access token vive en Netlify env var `META_CAPI_ACCESS_TOKEN` — server-side only, jamás en cliente.)
- HubSpot portal: `50799369`
- HubSpot form: `04f6e5eb-168f-4d09-a034-749551ffb9ac`
- Chat widget base URL: `https://app.innovacion.ai` (env `NEXT_PUBLIC_CHATWOOT_BASE_URL`)
- Chat widget website token: `66KFTkHdoCo8eNDNRMBGisct` (env `NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN`)

Env vars viven en Netlify (Site configuration → Environment variables), contexts `all`, scopes `builds` + `runtime`. Si la env var no existe, `app/layout.tsx` usa fallback hardcodeado.

## Seguridad operativa

Headers en `public/_headers` (verificables con `curl -sI https://lumenapp.ai/`):

- `Content-Security-Policy` allowlist: GTM, GA4, LinkedIn, Meta Pixel, HubSpot, Chatwoot.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- `X-Frame-Options: DENY` + `frame-ancestors 'none'`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` denegando camera/mic/geo/payment/usb/sensores/FLoC.
- `Cross-Origin-Opener-Policy: same-origin`.
- `form-action` restringido a self + endpoints HubSpot.

GitHub:

- Branch protection en `main`: PRs obligatorios, linear history, force push/deletions bloqueados, `enforce_admins: true`.
- Secret scanning + push protection activos.
- Dependabot alerts + automated security fixes activos.
- Deploy key read-only (`148948558`), webhook push/pr/delete (`606928044`).

Rollback de branch protection (solo si hace falta deshacer urgentemente):

```bash
gh api -X DELETE repos/jjmendoza-tpp/lumen-website/branches/main/protection
# ... hacer el push correctivo ...
gh api -X PUT repos/jjmendoza-tpp/lumen-website/branches/main/protection \
  --input /tmp/branch-protection.json  # config guardada en decisions
```

## SEO y discovery esperados

- Home indexable con branding `Lumen AI`
- Descripción principal en español para la raíz
- `/en` funcional pero en `noindex`
- sitemap reducido a la URL principal
- structured data básico de organización y website
- favicon y manifest activos

## Riesgos conocidos

- HubSpot puede emitir un `403` residual hacia un endpoint `v3/json` en consola. Mientras el iframe/form renderice y los envíos reales funcionen, no se considera bloqueo productivo.
- Si HubSpot vuelve a bloquear envíos, revisar primero la autorización del dominio `lumenapp.ai` dentro de HubSpot.
- El repo Git conectado en Netlify y el remoto Git del workspace local deben revisarse antes de empujar cambios, para no publicar en un repositorio equivocado.

## Pendientes de seguridad para próxima sesión

- ~~CAPTCHA en HubSpot form `04f6e5eb-168f-4d09-a034-749551ffb9ac`~~ ✅ activado 2026-04-18.
- DNS CAA records para `lumenapp.ai` restringiendo emisores de certificado (Let's Encrypt + el CA del correo, si aplica).
- Chatwoot instancia `app.innovacion.ai`: rate-limit de creación de conversaciones + captcha en widget.
- Submit `lumenapp.ai` a `https://hstspreload.org/` tras 1–2 semanas estables.

## Pendientes IT — Chatwoot server-side (bloqueante para widget)

**Problema**: el widget de Chatwoot no carga en `https://lumenapp.ai/` porque el SDK no está siendo servido por la instancia `https://app.innovacion.ai`.

- `GET https://app.innovacion.ai/packs/js/sdk.js` → 404 (archivo físicamente ausente, nginx responde sin pasar por Rails).
- `GET https://app.innovacion.ai/app/sdk.js` → 200 con `Content-Length: 0` (Rails SPA catch-all).
- Chatwoot corriendo: v4.13.0 (confirmado en `/api`). `data_services: failing` reportado por el mismo endpoint — posible señal de salud de infra también.

**Causa raíz diagnosticada** (contra el repo upstream `chatwoot/chatwoot` branch `release/4.13.0`):

- El SDK se compila desde `app/javascript/entrypoints/sdk.js` con `pnpm run build:sdk` (modo library de Vite, formato IIFE, output `public/packs/js/sdk.js`).
- Ese build está conectado al hook `before_assets_precompile` en `lib/tasks/build.rake`.
- En `docker/Dockerfile` línea 85, `bundle exec rake assets:precompile` solo se ejecuta si `RAILS_ENV=production` al image build time.
- Los assets del dashboard (`/vite/assets/...`) sí están presentes → el build general de Vite sí corrió. Lo que no corrió o falló silenciosamente fue `pnpm run build:sdk` (el `system()` del rake task no raise en fallo).

**Estado código Lumen**: el snippet en `app/layout.tsx` sigue apuntando a `/packs/js/sdk.js` que es la ruta oficial de Chatwoot admin UI. Una vez IT resuelva, el widget aparecerá en producción sin cambios nuestros ni redeploy — es 100% client-side.

**Fix sugerido a IT** (detalles en el email enviado a infra Lumen/Prometheus el 2026-04-19):

1. Opción rápida (validación sin rebuild): `docker exec` al contenedor web y correr `cd /app && pnpm install --frozen-lockfile && pnpm run build:sdk`. Nginx sirve desde volumen, sin restart.
2. Opción correcta: rebuild de imagen con `RAILS_ENV=production` al build time y validar que los logs muestren `-------------- Building SDK for Production --------------` seguido del output Vite.

**Validación post-fix**:

```bash
curl -sI https://app.innovacion.ai/packs/js/sdk.js
# Esperado: HTTP/1.1 200, Content-Type: application/javascript, Content-Length ~40000
```

**Responsable**: equipo IT/infra Prometheus. Jose confirmará cuando esté implementado.

## Archivos clave

- `app/layout.tsx`: metadata global, scripts de tracking, JSON-LD
- `app/page.tsx`: metadata de la home
- `app/en/page.tsx`: metadata de la ruta inglesa
- `components/landing/LumenLanding.tsx`: theme provider, layout principal y toggle
- `components/landing/LumenHubSpotForm.tsx`: embed y callbacks de HubSpot
- `public/robots.txt`
- `public/sitemap.xml`
- `public/site.webmanifest`
- `public/_headers` (security headers + MIME override del manifest)
- `netlify.toml` (build command + Node version)
- `eslint.config.mjs` (ignora `.netlify/`, `.playwright-cli/`, `.claude/`)

## Qué no romper

- el `canonical` del home
- el `noindex` de `/en`
- los IDs de GTM, GA4, LinkedIn y HubSpot
- la carga inicial en modo claro
- la persistencia de `lumen-theme`
- el MIME correcto del manifest en Netlify
- la carga del widget web de Lumen/Chatwoot
