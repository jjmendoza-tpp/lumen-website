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
- La actualización de GTM, GA4 y LinkedIn ya fue desplegada en producción y el HTML live expone `GTM-KZNM7JNM`, `G-BWZW45MGRG` y `9006578`.
