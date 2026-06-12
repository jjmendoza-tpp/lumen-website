"use client";

import { useEffect, useState } from "react";

// Consent Mode v2 — UI de consentimiento. El default-deny y el replay desde
// localStorage viven como script inline en app/layout.tsx (deben ejecutarse
// ANTES del loader de GTM); este componente solo captura la decisión del
// usuario y la propaga a gtag/dataLayer y al evento `lumen:consent-updated`
// que escuchan los loaders gateados (Meta, LinkedIn, Chatwoot).
const STORAGE_KEY = "lumen:consent:v1";
const CONSENT_EVENT = "lumen:consent-updated";

type Decision = {
  v: 1;
  analytics: boolean;
  marketing: boolean;
  ts: string;
};

declare global {
  interface Window {
    // Mismos modificadores que LumenLanding.tsx/LumenHubSpotForm.tsx (TS
    // exige declaraciones idénticas del mismo global).
    dataLayer: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

function readDecision(): Decision | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return d && d.v === 1 ? (d as Decision) : null;
  } catch {
    return null;
  }
}

function applyConsent(analytics: boolean, marketing: boolean) {
  const decision: Decision = {
    v: 1,
    analytics,
    marketing,
    ts: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decision));
  } catch {
    // localStorage no disponible (modo privado restrictivo): aplicamos la
    // decisión solo para esta página.
  }

  // Consent Mode v2 update — los tags de Google del container usan el
  // consent built-in (modo avanzado): denied = pings cookieless (gcs=G100),
  // granted = medición completa (gcs=G111).
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    personalization_storage: marketing ? "granted" : "denied",
  });

  // Trigger custom para los tags Custom HTML hard-gateados en GTM.
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push({ event: "consent_update", analytics, marketing });

  // Loaders consent-gated en layout.tsx (Meta Pixel, LinkedIn, Chatwoot).
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { analytics, marketing } })
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    let t: number | undefined;
    if (!readDecision()) {
      t = window.setTimeout(() => setVisible(true), 1200);
    }
    // Reapertura desde /legal/cookies ("Cambiar mis preferencias"):
    // prefill con la decisión guardada y abrir directo en modo granular.
    const reopen = () => {
      const d = readDecision();
      if (d) {
        setAnalytics(d.analytics);
        setMarketing(d.marketing);
      }
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener("lumen:cookie-prefs-open", reopen);
    return () => {
      if (t) window.clearTimeout(t);
      window.removeEventListener("lumen:cookie-prefs-open", reopen);
    };
  }, []);

  if (!visible) return null;

  const decide = (a: boolean, m: boolean) => {
    applyConsent(a, m);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-4 bottom-4 z-[9990] mx-auto max-w-3xl rounded-2xl border border-[#0d0d1a]/10 bg-white p-5 shadow-2xl sm:p-6"
    >
      <p className="text-sm font-semibold text-[#0d0d1a]">
        Tu privacidad importa
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[#0d0d1a]/70">
        Usamos cookies para medir el uso del sitio (analítica) y mejorar
        nuestras campañas (marketing). Puedes aceptar todas, rechazarlas o
        elegir por categoría. Las cookies esenciales siempre están activas.{" "}
        <a
          href="/legal/cookies"
          className="font-medium text-[#6801FF] underline-offset-2 hover:underline"
        >
          Más detalle
        </a>
      </p>

      {customizing && (
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked
              disabled
              className="mt-0.5 h-4 w-4 accent-[#6801FF]"
            />
            <span className="text-sm text-[#0d0d1a]/70">
              <span className="font-medium text-[#0d0d1a]">Esenciales</span>{" "}
              — seguridad y funcionamiento básico (siempre activas).
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#6801FF]"
            />
            <span className="text-sm text-[#0d0d1a]/70">
              <span className="font-medium text-[#0d0d1a]">Analítica</span> —
              nos ayuda a entender cómo se usa el sitio (Google Analytics,
              HubSpot).
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#6801FF]"
            />
            <span className="text-sm text-[#0d0d1a]/70">
              <span className="font-medium text-[#0d0d1a]">Marketing</span> —
              personaliza anuncios y habilita el chat (Meta, LinkedIn,
              Chatwoot).
            </span>
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {customizing ? (
          <button
            type="button"
            onClick={() => decide(analytics, marketing)}
            className="rounded-lg bg-[#6801FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5601d6]"
          >
            Guardar preferencias
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => decide(true, true)}
              className="rounded-lg bg-[#6801FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5601d6]"
            >
              Aceptar todas
            </button>
            <button
              type="button"
              onClick={() => decide(false, false)}
              className="rounded-lg border border-[#0d0d1a]/15 px-4 py-2 text-sm font-semibold text-[#0d0d1a] transition hover:bg-[#0d0d1a]/5"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="px-2 py-2 text-sm font-medium text-[#0d0d1a]/60 underline-offset-2 transition hover:text-[#0d0d1a] hover:underline"
            >
              Personalizar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
