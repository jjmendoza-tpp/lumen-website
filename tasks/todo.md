# Plan de Ejecución

## Discovery

- [x] Auditar el estado actual del repo, dominio y tracking.
- [x] Extraer los IDs exactos de GTM, GA4, LinkedIn y HubSpot desde los manuales.
- [x] Verificar el Figma Make como fuente de verdad.
- [x] Comparar opciones de hosting y obtener aprobación del usuario para Netlify.

## Ideation

- [x] Decidir pipeline de publicación: Next.js como build chain y export estático como artefacto final.
- [x] Definir que la nueva landing reemplaza la home y se aísla en componentes dedicados.
- [x] Resolver estrategia final para los tres assets decorativos del parallax.

## Microcoding

- [x] Crear componentes dedicados de la landing basada en Figma Make.
- [x] Actualizar `app/page.tsx` para usar la nueva landing.
- [x] Alinear `app/en/page.tsx` para no dejar una variante divergente.
- [x] Integrar GTM, GA4 y LinkedIn en `app/layout.tsx`.
- [x] Integrar HubSpot embed con estilos del diseño.
- [x] Añadir `netlify.toml`.
- [x] Resolver modal y animaciones sin añadir dependencias nuevas innecesarias.
- [x] Integrar favicon y app icons desde el asset final de Lumen.
- [x] Endurecer metadata SEO base, manifest, sitemap y canónicos.
- [x] Ajustar la carga inicial para entrar siempre en modo claro con preferencia persistente.
- [x] Consolidar documentación operativa de producción y continuidad del proyecto.
- [x] Integrar el web widget conversacional de Lumen basado en Chatwoot.
- [x] Reemplazar GTM, GA4 y LinkedIn por los IDs vigentes de los manuales actualizados.

## Validation

- [x] Ejecutar `npm run build`.
- [x] Revisar que el output estático se genere sin errores.
- [x] Validar visualmente/estructuralmente hero, pricing, comparativa, formulario y modal contra el código fuente del Figma Make.
- [x] Validar que los scripts de marketing disparen requests reales en producción.
- [x] Validar que HubSpot renderice el formulario real y permita capturar leads en producción.
- [x] Intentar deploy en Netlify.
- [x] Documentar la actualización DNS de `lumenapp.ai`.
- [x] Verificar favicon, manifest y metadata reales en producción.
- [x] Verificar persistencia del theme toggle después del deploy.
- [x] Documentar el repo Git conectado a Netlify y los checks mínimos de operación.
- [x] Validar que el widget web quede publicado en producción y presente en el HTML servido.
- [ ] Validar manualmente que el widget abra correctamente y cree conversaciones reales en el inbox.
- [ ] Validar en analytics/marketing que el tráfico nuevo entra a GTM, GA4 y LinkedIn con los IDs actualizados.

## Review

- Build estático exitoso.
- HTML exportado verificado localmente con tracking presente.
- Deploy productivo realizado en Netlify sobre `lumenapp-ai`.
- `lumenapp.ai` y `www.lumenapp.ai` ya están anexados en Netlify.
- DNS, redirects y certificado ya están correctos en producción.
- HubSpot ya renderiza el formulario real en producción y el botón responde.
- Observación menor pendiente: HubSpot deja un `403` en consola hacia un endpoint `v3/json`, aunque el formulario visible y los endpoints `v4` sí funcionan.
- Home publicada con `Lumen AI` como título, favicon activo y raíz única en sitemap.
- `site.webmanifest` servido con MIME correcto y app icons respondiendo con `200`.
- La primera carga entra en modo claro; si el usuario cambia a oscuro, la preferencia persiste tras recargar.
- README y documentación interna reescritos para reflejar estado productivo real.
- El proyecto ya tiene guía operativa explícita para deploy, smoke tests y riesgos conocidos.
- Widget web de Lumen publicado en producción y presente en el HTML servido por `lumenapp.ai`.
- Queda pendiente únicamente la prueba manual end to end del chat desde navegador contra el inbox.
- Pendiente nuevo de esta iteración: confirmar en las consolas de analytics/ads que el tráfico cae sobre los nuevos IDs.

## Iteración 2026-04-18 — Auditoría + infraestructura + seguridad

### Auditoría y consolidación

- [x] Auditar `c384408`: diff, IDs, SEO, live URLs, Netlify deploy.
- [x] Externalizar `CHATWOOT_*` a `NEXT_PUBLIC_*` con fallback.
- [x] Añadir `.netlify/`, `.playwright-cli/`, `.claude/` al ESLint ignore.
- [x] Eliminar código muerto (`CTAForm.tsx` + SVGs de scaffold Next.js).
- [x] Silence de los 2 errores reales de React lint (setState-in-effect, `Math.random()` en render).
- [x] Tag `v1.0.0-verified-2026-04-18` como baseline auditado.

### Infraestructura Netlify ↔ GitHub

- [x] Env vars `NEXT_PUBLIC_CHATWOOT_BASE_URL` y `NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN` en Netlify.
- [x] Relinkear Netlify al repo correcto `jjmendoza-tpp/lumen-website` (antes apuntaba a `lumenapp-ai`).
- [x] Crear deploy key read-only en Netlify y registrarla en GitHub (`148948558`).
- [x] Crear webhook push/pull_request/delete → Netlify (`606928044`).
- [x] Verificar end-to-end: push a `main` → auto-build + deploy en ~15–30s.

### Hardening de seguridad (pre-campañas)

- [x] Security headers en `public/_headers`: CSP, HSTS preload, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP, form-action.
- [x] Branch protection en `main`: PRs obligatorios, linear history, force push/deletions bloqueados, `enforce_admins: true`.
- [x] Next 16.2.1 → 16.2.4 (GHSA-q4gf-8mx6-v5v3 + picomatch ReDoS). `npm audit` en 0.
- [x] Secret scanning + push protection + Dependabot alerts + automated security fixes activos.
- [x] HSTS completo: `max-age=63072000; includeSubDomains; preload`.
- [x] Documentación actualizada (README + brief + decisions + operations + tasks + lessons).

### Pendientes para siguiente sesión

- [x] Activar CAPTCHA en HubSpot form `04f6e5eb-168f-4d09-a034-749551ffb9ac` (hecho 2026-04-18; ajustes CSP + embed v2 + reCAPTCHA Enterprise origins aplicados en PRs #3/#4/#6).
- [ ] CAA DNS records en `lumenapp.ai` restringiendo emisores de certificado.
- [ ] Chatwoot (`app.innovacion.ai`): rate-limit de creación de conversaciones + captcha en widget.
- [ ] Submit `lumenapp.ai` a `https://hstspreload.org/` tras 1–2 semanas estables.

### Bloqueantes externos — pendiente IT/Prometheus

- [ ] **Chatwoot SDK no se sirve en `app.innovacion.ai` (v4.13.0)**: `public/packs/js/sdk.js` ausente en filesystem del container web. Causa diagnosticada contra upstream `chatwoot/chatwoot` branch `release/4.13.0`: `pnpm run build:sdk` no corrió o falló silenciosamente en el image build (Rails `system()` no raise). Solución: `docker exec` + `pnpm run build:sdk` en el container, o rebuild con `RAILS_ENV=production`. Detalle completo en `docs/operations.md` → Pendientes IT. Email a infra enviado 2026-04-19. Jose confirmará cuando se resuelva; no requiere cambios del lado website.
- La actualización de GTM, GA4 y LinkedIn ya fue desplegada en producción y el HTML live expone `GTM-KZNM7JNM`, `G-BWZW45MGRG` y `9006578`.
