# Lumen Landing

Landing page productiva de Lumen publicada en `https://lumenapp.ai`.

## Estado actual

- Producción activa en Netlify.
- Dominio principal: `https://lumenapp.ai`
- Alias: `https://www.lumenapp.ai`
- Certificado TLS activo para ambos hosts.
- Sitio 100% estático en publicación, generado con Next.js App Router y `output: "export"`.
- Baseline auditado: tag `v1.0.0-verified-2026-04-18`.

## Objetivo del proyecto

Servir una landing de adquisición fiel al Figma de Lumen, con:

- tracking de marketing activo
- formulario HubSpot funcional
- SEO técnico base listo para campañas y discovery
- opción de modo oscuro, pero carga inicial en modo claro

## Stack

- Next.js 16.2.4+ (≥16.2.4 requerido por GHSA-q4gf-8mx6-v5v3)
- React 19
- TypeScript
- Export estático de Next.js
- Netlify como hosting productivo

## Producción

- Site ID Netlify: `d2bcf403-da7f-4785-8098-7b30435648c2`
- Proyecto Netlify: `lumenapp-ai`
- Dominio productivo: `lumenapp.ai`
- Repo Git conectado a Netlify vía deploy key + webhook: `https://github.com/jjmendoza-tpp/lumen-website`
- Auto-deploy activo: cada push a `main` dispara build en Netlify (~15–30s) y publica.
- Branch `main` protegido: PRs obligatorios, linear history, force push y deletions bloqueados, `enforce_admins: true`.

## Tracking y formularios

- GTM: `GTM-KZNM7JNM`
- GA4: `G-BWZW45MGRG`
- LinkedIn Insight: `9006578`
- HubSpot portal: `50799369`
- HubSpot form: `04f6e5eb-168f-4d09-a034-749551ffb9ac`
- Chatwoot base URL: `https://app.innovacion.ai` (env `NEXT_PUBLIC_CHATWOOT_BASE_URL`)
- Chatwoot website token: env `NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN` (con fallback hardcodeado)

Env vars viven en Netlify (Site configuration → Environment variables), contexts `all`, scopes `builds` + `runtime`.

## Seguridad

Headers activos en `public/_headers` (verificables con `curl -sI https://lumenapp.ai/`):

- `Content-Security-Policy` con allowlist estricto (GTM, GA4, LinkedIn, HubSpot, Chatwoot).
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- `X-Frame-Options: DENY` + `frame-ancestors 'none'` (anti-clickjacking).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` denegando camera/mic/geo/payment/usb/sensores/FLoC.
- `Cross-Origin-Opener-Policy: same-origin`.
- `form-action` restringido a self + endpoints HubSpot.

GitHub repo:

- Secret scanning + push protection activos.
- Dependabot alerts + automated security fixes activos.
- Branch protection en `main`: PRs obligatorios, linear history, force push/deletions bloqueados.

Pendientes de hardening (próxima sesión):

- Activar CAPTCHA en HubSpot form `04f6e5eb-168f-4d09-a034-749551ffb9ac`.
- DNS CAA records para `lumenapp.ai` restringiendo emisores de certificado.
- Chatwoot widget: rate-limit de conversaciones + captcha en widget.
- Submit del dominio a `https://hstspreload.org/` tras 1–2 semanas en producción.

## SEO técnico configurado

- `Lumen AI` como título del home
- descripción principal en español en `/`
- metadata en inglés en `/en`
- `/en` en `noindex`
- `canonical` único a `https://lumenapp.ai`
- `robots.txt` activo
- `sitemap.xml` con solo la raíz canónica
- favicon, apple touch icon y app icons
- `site.webmanifest` con MIME correcto
- JSON-LD base de `Organization` y `WebSite`

## Tema visual

- La primera visita entra en modo claro.
- Si el usuario cambia a oscuro o vuelve a claro, la preferencia se guarda en `localStorage` con la clave `lumen-theme`.

## Flujo de publicación

1. Crear branch a partir de `main` actualizado.
2. Editar, commit, push.
3. Abrir PR contra `main` (obligatorio por branch protection).
4. Squash-merge con linear history.
5. Netlify detecta vía webhook y compila automáticamente en 15–30s.
6. Verificar `https://lumenapp.ai` y headers con `curl -sI`.

Para deploy manual de emergencia (bypass Git): `NETLIFY_AUTH_TOKEN=... npx netlify-cli deploy --prod --dir=out --site=d2bcf403-da7f-4785-8098-7b30435648c2`.

## Comandos útiles

```bash
npm install
npm run dev
npm run build
npm audit
python3 -m http.server 4321 -d out
```

## Estructura documental

- `docs/brief.md`: brief del producto y alcance
- `docs/decisions.md`: decisiones técnicas y de producto
- `docs/experiments.md`: evidencia y validaciones
- `tasks/todo.md`: plan ejecutado y checklist
- `tasks/lessons.md`: aprendizajes preventivos
- `docs/operations.md`: guía operativa de producción

## Criterio de release

Antes de considerar un cambio listo:

- `npm run build` debe pasar
- `npm audit` en 0 vulnerabilidades
- la home debe responder en `https://lumenapp.ai`
- el formulario HubSpot debe renderizar
- el título y metadata del home deben seguir siendo canónicos
- favicon, manifest y sitemap deben responder con `200`
- security headers siguen activos (ver sección Seguridad)
- el sitio debe cargar en modo claro para visitante nuevo
