# Operación de Producción

Fecha de consolidación: 2026-04-14
Proyecto: Lumen Landing

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
  - `https://github.com/jjmendoza-tpp/lumenapp-ai`

## Flujo de publicación recomendado

1. Hacer cambios en este proyecto.
2. Ejecutar `npm run build`.
3. Verificar localmente el export en `out/`.
4. Confirmar que metadata, formulario y tema no hayan regresado.
5. Publicar vía Netlify o por el flujo Git conectado al repo productivo.
6. Validar `https://lumenapp.ai` con smoke test real.

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
- HubSpot portal: `50799369`
- HubSpot form: `04f6e5eb-168f-4d09-a034-749551ffb9ac`
- Chat widget base URL: `https://app.innovacion.ai`
- Chat widget website token: `66KFTkHdoCo8eNDNRMBGisct`

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

## Archivos clave

- `app/layout.tsx`: metadata global, scripts de tracking, JSON-LD
- `app/page.tsx`: metadata de la home
- `app/en/page.tsx`: metadata de la ruta inglesa
- `components/landing/LumenLanding.tsx`: theme provider, layout principal y toggle
- `components/landing/LumenHubSpotForm.tsx`: embed y callbacks de HubSpot
- `public/robots.txt`
- `public/sitemap.xml`
- `public/site.webmanifest`
- `public/_headers`

## Qué no romper

- el `canonical` del home
- el `noindex` de `/en`
- los IDs de GTM, GA4, LinkedIn y HubSpot
- la carga inicial en modo claro
- la persistencia de `lumen-theme`
- el MIME correcto del manifest en Netlify
- la carga del widget web de Lumen/Chatwoot
