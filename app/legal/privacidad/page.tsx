import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de lumenapp.ai. Tratamiento de datos personales del sitio de Lumen AI.",
  robots: { index: false, follow: false },
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" updated="12 de junio de 2026">
      <p className="legal-notice">
        ⚠️ Documento borrador V1, adaptado de la política institucional de
        Prometheus (innovacion.ai) para el sitio de producto{" "}
        <strong>lumenapp.ai</strong>. La versión final será revisada por un
        asesor legal.
      </p>

      <h2>1. Introducción</h2>
      <p>
        Esta Política de Privacidad describe cómo Prometheus — Publicidad
        Digital, S.A. (en adelante, <strong>&ldquo;Prometheus&rdquo;</strong>,{" "}
        <strong>&ldquo;nosotros&rdquo;</strong>), titular del producto{" "}
        <strong>Lumen AI</strong>, recolecta, usa y comparte tu información
        cuando visitás <strong>lumenapp.ai</strong> (el{" "}
        <strong>&ldquo;Sitio&rdquo;</strong>), completás un formulario o
        solicitás una demo.
      </p>
      <p>
        Al utilizar el Sitio aceptás esta Política. Si no estás de acuerdo, te
        pedimos que no lo utilices.
      </p>

      <h2>2. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Razón social:</strong> Prometheus — Publicidad Digital, S.A.
        </li>
        <li>
          <strong>Domicilio:</strong> 7 avenida 12-23 Zona 9, Edificio ETISA,
          3er Nivel, Oficina 4-B2, 01009 Guatemala
        </li>
        <li>
          <strong>Contacto en privacidad:</strong>{" "}
          <a href="mailto:info@innovacion.ai">info@innovacion.ai</a>
        </li>
      </ul>

      <h2>3. Datos que recolectamos</h2>
      <h3>3.1 Datos que vos nos proporcionás</h3>
      <p>Al completar el formulario de demo o contacto podemos pedirte:</p>
      <ul>
        <li>Nombre y apellido</li>
        <li>Email corporativo</li>
        <li>Teléfono / WhatsApp (opcional)</li>
        <li>Empresa y cargo</li>
        <li>Mensaje o consulta</li>
      </ul>
      <h3>3.2 Datos recolectados automáticamente</h3>
      <ul>
        <li>Dirección IP</li>
        <li>Tipo y versión de navegador, sistema operativo, idioma</li>
        <li>
          Páginas visitadas, tiempo en cada página, fuente de tráfico (UTMs,
          referrer)
        </li>
        <li>
          Identificadores de cookies — <em>solo con tu consentimiento</em>{" "}
          (ver §6)
        </li>
      </ul>

      <h2>4. Finalidades y base legal</h2>
      <table>
        <thead>
          <tr>
            <th>Finalidad</th>
            <th>Base legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responder tus consultas comerciales y agendar demos</td>
            <td>Ejecución de medidas precontractuales</td>
          </tr>
          <tr>
            <td>Comunicaciones de seguimiento comercial</td>
            <td>Consentimiento / relación precontractual</td>
          </tr>
          <tr>
            <td>Medición de uso del Sitio y atribución de campañas</td>
            <td>Consentimiento (banner de cookies)</td>
          </tr>
          <tr>
            <td>Mejorar el rendimiento y la seguridad del Sitio</td>
            <td>Interés legítimo</td>
          </tr>
          <tr>
            <td>Cumplir obligaciones legales aplicables</td>
            <td>Obligación legal</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Encargados de tratamiento</h2>
      <p>
        Compartimos tus datos con los siguientes proveedores, que actúan como
        encargados de tratamiento bajo contrato:
      </p>
      <ul>
        <li>
          <strong>HubSpot, Inc.</strong> — CRM, formularios y atribución
          comercial. Datos transferidos a EE. UU. bajo cláusulas contractuales
          tipo.
        </li>
        <li>
          <strong>Google LLC</strong> — Google Analytics 4 y Tag Manager para
          medición agregada (sujeto a consentimiento).
        </li>
        <li>
          <strong>Meta Platforms Inc.</strong> — Meta Pixel para atribución de
          campañas (sujeto a consentimiento).
        </li>
        <li>
          <strong>LinkedIn Corporation</strong> — Insight Tag para atribución
          de campañas B2B (sujeto a consentimiento).
        </li>
        <li>
          <strong>Netlify, Inc.</strong> — hosting estático del Sitio.
        </li>
        <li>
          <strong>Chatwoot (autohospedado por Prometheus)</strong> — widget de
          chat del Sitio, operado en infraestructura propia
          (app.innovacion.ai), sujeto a consentimiento.
        </li>
      </ul>
      <p>
        No vendemos ni cedemos tus datos personales a terceros con fines
        comerciales propios.
      </p>

      <h2>6. Cookies y tecnologías similares</h2>
      <p>
        Aplicamos <strong>Google Consent Mode v2</strong> con default{" "}
        <em>deny</em>: hasta que des tu consentimiento, no se cargan cookies de
        analítica ni de marketing. El detalle de categorías y cómo modificar
        tus preferencias está en la{" "}
        <a href="/legal/cookies">Política de Cookies</a>.
      </p>

      <h2>7. Conservación</h2>
      <p>
        Conservamos tus datos durante el tiempo necesario para cumplir las
        finalidades descritas y posteriormente bloqueados durante los plazos
        legales aplicables. Los datos de uso se conservan agregados con
        retención típica de 14 meses (Google Analytics).
      </p>

      <h2>8. Tus derechos</h2>
      <p>Tenés derecho a:</p>
      <ul>
        <li>
          <strong>Acceder</strong> a tus datos personales que tenemos
        </li>
        <li>
          <strong>Rectificar</strong> datos incorrectos o desactualizados
        </li>
        <li>
          <strong>Suprimir</strong> tus datos (derecho al olvido)
        </li>
        <li>
          <strong>Oponerte</strong> al tratamiento basado en interés legítimo
        </li>
        <li>
          <strong>Limitar</strong> el tratamiento
        </li>
        <li>
          <strong>Portabilidad</strong> de los datos en formato estructurado
        </li>
        <li>
          <strong>Retirar el consentimiento</strong> en cualquier momento, sin
          afectar la licitud del tratamiento previo
        </li>
      </ul>
      <p>
        Para ejercer estos derechos escribinos a{" "}
        <a href="mailto:info@innovacion.ai">info@innovacion.ai</a>. Respondemos
        en un máximo de 30 días naturales.
      </p>

      <h2>9. Transferencias internacionales</h2>
      <p>
        Algunos encargados (HubSpot, Google, Meta, LinkedIn, Netlify) tratan
        datos en EE. UU. y otros países. Estas transferencias se realizan bajo
        cláusulas contractuales tipo, certificaciones equivalentes (Data
        Privacy Framework) u otros mecanismos legales adecuados.
      </p>

      <h2>10. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus
        datos: cifrado en tránsito (HTTPS/TLS), controles de acceso, monitoreo
        de seguridad y procesos de respuesta a incidentes. Ningún sistema es
        100&nbsp;% seguro y no podemos garantizar seguridad absoluta.
      </p>

      <h2>11. Privacidad de menores</h2>
      <p>
        El Sitio no está dirigido a menores de 13 años y no recolectamos
        conscientemente sus datos. Si sos padre/madre/tutor y creés que tu
        hijo/a nos ha proporcionado datos, contactanos y los eliminaremos.
      </p>

      <h2>12. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta Política. La fecha de última actualización
        aparece al inicio. Cambios materiales se notificarán vía aviso
        destacado en el Sitio.
      </p>

      <h2>13. Marco legal y autoridad de control</h2>
      <p>
        Esta Política se alinea con el GDPR (UE), la LFPDPPP (México) y el
        principio de Habeas Data (Guatemala). Si considerás que el tratamiento
        no se ajusta a la normativa, podés presentar una reclamación ante la
        autoridad de protección de datos competente en tu jurisdicción.
      </p>

      <h2>14. Contacto</h2>
      <p>
        Para cualquier consulta sobre privacidad:{" "}
        <a href="mailto:info@innovacion.ai">info@innovacion.ai</a>.
      </p>
    </LegalPage>
  );
}
