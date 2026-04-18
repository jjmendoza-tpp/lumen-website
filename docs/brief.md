# Brief del Producto

Fecha: 2026-04-14
Proyecto: Lumen Landing

## Problema / Job-to-be-done

Publicar una landing de adquisición para Lumen en `lumenapp.ai` con fidelidad alta al diseño de Figma, captura de leads en HubSpot y medición completa de marketing, sin depender de backend.

## Usuario objetivo

- Líderes de marketing, CX, operaciones y ventas en empresas de LatAm.
- Llegan desde campañas pagadas, tráfico orgánico o referidos y necesitan entender rápido qué hace Lumen, cuánto cuesta y cómo pedir una demo.

## Hipótesis de valor

Si la landing replica fielmente el diseño del Figma Make, conserva el formulario HubSpot y los scripts de GTM, GA4 y LinkedIn, entonces aumentará la confianza y la conversión a demo request sin introducir fricción técnica de despliegue.

## Métrica de éxito

- North Star: formularios válidos enviados a HubSpot.
- Leading indicator 1: CTR en CTAs principales (`Comenzar Ahora`, `Solicita una Demo`).
- Leading indicator 2: carga correcta de GTM, GA4, LinkedIn y HubSpot en producción.
- Leading indicator 3: homepage indexable con metadata, robots, sitemap e iconografía correctos para discovery.
- Leading indicator 4: widget web conversacional visible y cargando correctamente en la landing.

## Supuestos y riesgos

- El Figma Make `cwSlzDVqfesWkMabiozOru` es la fuente de verdad actual.
- El sitio ya está operativo en producción sobre Netlify y debe mantenerse sin degradar SEO, tracking ni captura de leads.
- El usuario conectó Netlify a un repo Git de respaldo para continuidad operativa:
  - `https://github.com/jjmendoza-tpp/lumenapp-ai`
- Los IDs vigentes según los manuales más recientes son:
  - GTM: `GTM-KZNM7JNM`
  - GA4: `G-BWZW45MGRG`
  - LinkedIn: `9006578`
  - HubSpot portal: `50799369`
  - HubSpot form: `04f6e5eb-168f-4d09-a034-749551ffb9ac`
- Riesgo principal: si HubSpot pierde la autorización del dominio productivo, el formulario puede renderizar pero bloquear envíos.
- Riesgo secundario: discovery deficiente si favicon, manifest, metadata o canonicals divergen del dominio final.
- Riesgo operativo: Netlify puede quedar conectado a un repo distinto del remoto histórico del workspace local si no se verifica antes de futuros pushes.
- Riesgo técnico: la validación de identidad de Chatwoot no debe implementarse en este frontend estático porque expondría un secreto operativo en cliente.

## Restricciones

- Sitio 100% frontend estático al publicar.
- Sin backend.
- Mantener scripts de marketing y formulario HubSpot.
- Respetar el diseño original del Figma.
- Evitar Vercel como solución principal.

## Alcance del microprototipo

Incluye:

- Landing estática exportable.
- Secciones principales del Figma Make.
- Modal demo, responsive y theme toggle.
- Integración de GTM, GA4, LinkedIn y HubSpot.
- Integración del widget web de Lumen basado en Chatwoot.
- Configuración de `netlify.toml` y build listo para deploy.
- Favicon, app icons, structured data, `robots.txt`, `sitemap.xml` y metadata base para SEO.
- Carga inicial en modo claro con persistencia de preferencia cuando el usuario elija modo oscuro.

No incluye:

- CMS.
- Internacionalización real.
- Backend, API routes o server actions.
- Replanteamiento de copy o pricing.
