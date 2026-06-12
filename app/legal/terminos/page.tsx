import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Términos de Uso",
  description:
    "Términos de uso del sitio lumenapp.ai, producto Lumen AI de Prometheus.",
  robots: { index: false, follow: false },
};

export default function TerminosPage() {
  return (
    <LegalPage title="Términos de Uso" updated="12 de junio de 2026">
      <p className="legal-notice">
        ⚠️ Documento borrador V1 — pendiente de revisión legal externa. Aplica
        al sitio <strong>lumenapp.ai</strong> únicamente. Los términos de
        servicio del producto Lumen AI contratado se rigen por su propio
        contrato.
      </p>

      <h2>1. Aceptación</h2>
      <p>
        El acceso y uso del sitio <strong>lumenapp.ai</strong> (el
        &ldquo;Sitio&rdquo;) implica la aceptación de estos términos. Si no
        estás de acuerdo, te pedimos que no utilices el Sitio.
      </p>

      <h2>2. Identificación del titular</h2>
      <ul>
        <li>
          <strong>Razón social:</strong> Prometheus — Publicidad Digital, S.A.
        </li>
        <li>
          <strong>Domicilio:</strong> 7 avenida 12-23 Zona 9, Edificio ETISA,
          3er Nivel, Oficina 4-B2, 01009 Guatemala
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:info@innovacion.ai">info@innovacion.ai</a>
        </li>
      </ul>

      <h2>3. Propiedad intelectual</h2>
      <p>
        Todos los contenidos del Sitio (textos, imágenes, ilustraciones,
        diseños, la marca <strong>Lumen®</strong> y demás marcas del
        ecosistema Prometheus, código fuente) son propiedad de Prometheus o de
        sus licenciantes. Queda prohibida su reproducción, distribución,
        modificación o explotación comercial sin autorización escrita previa.
      </p>

      <h2>4. Uso permitido</h2>
      <p>El Sitio se ofrece con fines informativos y comerciales. Está prohibido:</p>
      <ul>
        <li>
          Acceder a áreas no públicas o intentar comprometer la seguridad del
          Sitio
        </li>
        <li>
          Interferir con su funcionamiento normal (ataques DoS, scraping
          abusivo, ingeniería inversa)
        </li>
        <li>Extraer contenido masivamente con fines comerciales propios</li>
        <li>Usar el contenido en violación de derechos de terceros</li>
        <li>
          Suplantar identidad de Prometheus, sus colaboradores, partners o
          clientes
        </li>
      </ul>

      <h2>5. Formularios y comunicaciones</h2>
      <p>
        Al completar formularios aceptás el tratamiento de tus datos según
        nuestra <a href="/legal/privacidad">Política de Privacidad</a>. Las
        comunicaciones comerciales se envían bajo base legítima de relación
        precontractual o consentimiento explícito.
      </p>

      <h2>6. Enlaces a terceros</h2>
      <p>
        El Sitio puede contener enlaces a sitios de terceros (innovacion.ai,
        redes sociales). Prometheus no controla ni se responsabiliza por su
        contenido, políticas o prácticas.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        El Sitio se ofrece &ldquo;tal cual&rdquo; y &ldquo;según
        disponibilidad&rdquo;. Prometheus no garantiza disponibilidad
        ininterrumpida, ausencia de errores, ni que los contenidos sean
        adecuados para un fin particular. En la máxima medida permitida por la
        ley, Prometheus no será responsable por daños indirectos, lucro
        cesante, pérdida de datos o cualquier daño consecuente derivado del
        uso del Sitio.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Prometheus puede actualizar estos términos en cualquier momento. La
        fecha de la última actualización aparece al inicio del documento. El
        uso continuado del Sitio tras la actualización implica aceptación de
        los nuevos términos.
      </p>

      <h2>9. Suspensión y terminación</h2>
      <p>
        Prometheus puede suspender o restringir el acceso al Sitio (total o
        parcial) sin previo aviso si se detecta uso indebido, sospecha de
        fraude, requerimiento legal, mantenimiento o cualquier otra causa
        razonable.
      </p>

      <h2>10. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Guatemala.
        Cualquier controversia se someterá a los tribunales competentes de la
        Ciudad de Guatemala, renunciando expresamente a cualquier otro fuero
        que pudiera corresponder.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Consultas sobre estos términos:{" "}
        <a href="mailto:info@innovacion.ai">info@innovacion.ai</a>.
      </p>
    </LegalPage>
  );
}
