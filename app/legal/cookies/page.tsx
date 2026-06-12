import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import CookiePrefsButton from "@/components/legal/CookiePrefsButton";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Política de cookies de lumenapp.ai. Categorías, finalidades y opciones de gestión.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies" updated="12 de junio de 2026">
      <p className="legal-notice">
        ⚠️ Documento borrador V1 — pendiente de revisión legal externa. El
        banner de gestión de cookies aparece la primera vez que visitás el
        Sitio y podés cambiar tus preferencias en cualquier momento desde el
        botón de abajo.
      </p>

      <p>
        <CookiePrefsButton />
      </p>

      <h2>1. Qué son las cookies</h2>
      <p>
        Las cookies son archivos pequeños que un sitio guarda en tu dispositivo
        al visitarlo. Permiten recordar preferencias, medir uso del sitio y
        entregar contenido relevante. Tecnologías similares incluyen píxeles,
        web beacons, almacenamiento local del navegador y SDKs.
      </p>

      <h2>2. Categorías que utilizamos</h2>
      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Finalidad</th>
            <th>Consentimiento</th>
            <th>Vida útil típica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Necesarias</strong>
            </td>
            <td>
              Funcionamiento básico del sitio: tema claro/oscuro, prevenir
              abuso, recordar tu decisión sobre cookies.
            </td>
            <td>No requiere</td>
            <td>Sesión a 12 meses</td>
          </tr>
          <tr>
            <td>
              <strong>Analíticas</strong>
            </td>
            <td>
              Google Analytics 4 y HubSpot — medición agregada de páginas
              vistas, eventos y conversiones.
            </td>
            <td>Requiere consentimiento</td>
            <td>Hasta 14 meses</td>
          </tr>
          <tr>
            <td>
              <strong>Marketing</strong>
            </td>
            <td>
              Meta Pixel, LinkedIn Insight Tag y widget de chat (Chatwoot) —
              atribución de campañas, remarketing y conversación en vivo.
            </td>
            <td>Requiere consentimiento</td>
            <td>Hasta 24 meses</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Cookies y claves específicas que usamos</h2>
      <h3>3.1 Necesarias</h3>
      <ul>
        <li>
          <code>lumen:consent:v1</code> — guarda tu decisión sobre las
          categorías. Local storage.
        </li>
        <li>
          <code>lumen-theme</code> — recuerda el tema claro/oscuro
          seleccionado. Local storage.
        </li>
      </ul>
      <h3>3.2 Analíticas (solo con consentimiento)</h3>
      <ul>
        <li>
          <code>_ga</code>, <code>_ga_*</code> — Google Analytics 4,
          identificadores anónimos.
        </li>
        <li>
          <code>__hssrc</code>, <code>__hssc</code>, <code>__hstc</code>,{" "}
          <code>hubspotutk</code> — HubSpot, sesión y atribución del visitante.
        </li>
      </ul>
      <h3>3.3 Marketing (solo con consentimiento)</h3>
      <ul>
        <li>
          <code>_fbp</code> — Meta Pixel, atribución y remarketing.
        </li>
        <li>
          <code>li_*</code>, <code>bcookie</code> — LinkedIn Insight Tag,
          atribución de campañas B2B.
        </li>
        <li>
          <code>cw_*</code> — Chatwoot, sesión del widget de chat.
        </li>
      </ul>

      <h2>4. Google Consent Mode v2</h2>
      <p>
        Aplicamos <strong>Google Consent Mode v2</strong> con default{" "}
        <em>deny</em>. Hasta que aceptés, las siguientes señales de
        consentimiento están en <code>denied</code>:{" "}
        <code>analytics_storage</code>, <code>ad_storage</code>,{" "}
        <code>ad_user_data</code>, <code>ad_personalization</code>,{" "}
        <code>personalization_storage</code>. Mientras tanto, los tags de
        Google operan en modo avanzado sin cookies (pings anónimos) y las
        cookies de marketing y analítica no se cargan hasta que cambiés tu
        preferencia.
      </p>

      <h2>5. Cómo modificar tus preferencias</h2>
      <ol>
        <li>
          Hacer click en <strong>&ldquo;Cambiar mis preferencias de
          cookies&rdquo;</strong> al inicio de esta página.
        </li>
        <li>
          Borrar el almacenamiento local del navegador para lumenapp.ai — el
          banner volverá a aparecer.
        </li>
        <li>
          Bloquear cookies desde la configuración del navegador (afectará a
          otros sitios también).
        </li>
      </ol>

      <h2>6. Terceros</h2>
      <p>
        Los proveedores que pueden establecer cookies a través del Sitio
        incluyen Google (Analytics, Tag Manager), Meta (Pixel), LinkedIn
        (Insight Tag) y HubSpot. Cada uno opera bajo sus propias políticas:
      </p>
      <ul>
        <li>
          Google:{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener"
          >
            policies.google.com/privacy
          </a>
        </li>
        <li>
          Meta:{" "}
          <a
            href="https://www.facebook.com/policies/cookies/"
            target="_blank"
            rel="noopener"
          >
            facebook.com/policies/cookies
          </a>
        </li>
        <li>
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/legal/cookie-policy"
            target="_blank"
            rel="noopener"
          >
            linkedin.com/legal/cookie-policy
          </a>
        </li>
        <li>
          HubSpot:{" "}
          <a
            href="https://legal.hubspot.com/cookie-policy"
            target="_blank"
            rel="noopener"
          >
            legal.hubspot.com/cookie-policy
          </a>
        </li>
      </ul>

      <h2>7. Cambios</h2>
      <p>
        Podemos actualizar esta Política para reflejar cambios en las
        tecnologías que usamos. La fecha de última actualización aparece al
        inicio.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Consultas sobre cookies:{" "}
        <a href="mailto:info@innovacion.ai">info@innovacion.ai</a>.
      </p>
    </LegalPage>
  );
}
