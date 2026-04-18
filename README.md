# Lumen Landing

Landing page productiva de Lumen publicada en `https://lumenapp.ai`.

## Estado actual

- Producción activa en Netlify.
- Dominio principal: `https://lumenapp.ai`
- Alias: `https://www.lumenapp.ai`
- Certificado TLS activo para ambos hosts.
- Sitio 100% estático en publicación, generado con Next.js App Router y `output: "export"`.

## Objetivo del proyecto

Servir una landing de adquisición fiel al Figma de Lumen, con:

- tracking de marketing activo
- formulario HubSpot funcional
- SEO técnico base listo para campañas y discovery
- opción de modo oscuro, pero carga inicial en modo claro

## Stack

- Next.js 16
- React 19
- TypeScript
- Export estático de Next.js
- Netlify como hosting productivo

## Producción

- Site ID Netlify: `d2bcf403-da7f-4785-8098-7b30435648c2`
- Proyecto Netlify: `lumenapp-ai`
- Dominio productivo: `lumenapp.ai`
- Repo Git conectado por el usuario en Netlify como respaldo operativo:
  - `https://github.com/jjmendoza-tpp/lumenapp-ai`

Nota operativa:

- Este workspace local todavía puede conservar referencias históricas a otro remoto Git. Antes de empujar cambios, verificar que el repo local y el repo conectado en Netlify sean el mismo destino esperado.

## Tracking y formularios

- GTM: `GTM-KZNM7JNM`
- GA4: `G-BWZW45MGRG`
- LinkedIn Insight: `9006578`
- HubSpot portal: `50799369`
- HubSpot form: `04f6e5eb-168f-4d09-a034-749551ffb9ac`

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

## Comandos útiles

```bash
npm install
npm run dev
npm run build
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
- la home debe responder en `https://lumenapp.ai`
- el formulario HubSpot debe renderizar
- el título y metadata del home deben seguir siendo canónicos
- favicon, manifest y sitemap deben responder con `200`
- el sitio debe cargar en modo claro para visitante nuevo
