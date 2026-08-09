// Analytics helpers for lead tracking.
//
// SINGLE SOURCE OF TRUTH: dataLayer → GTM (GTM-KZNM7JNM). El contenedor tiene
// desde Sprint 3 el tag "Google Tag" (G-BWZW45MGRG, All Pages) + tags GA4 de
// evento (`generate_lead`, `hubspot_form_submit`, …) + píxeles de Meta. Estos
// helpers SOLO hacen `dataLayer.push({event: ...})`; el contenedor decide qué
// destinos reciben cada evento.
//
// ⚠️ Historia (Review 2 marketing system, 2026-08-08): la versión anterior
// además llamaba `gtag('event', …)` directo, y layout.tsx cargaba gtag.js con
// su propia config del MISMO measurement ID. Resultado: cada submit mandaba
// `generate_lead` 3-4× a GA4 (gtag directo + config duplicada + tag GTM sobre
// el espejo), inflando la conversión importada en Google Ads. NO reintroducir
// gtag directo mientras GTM tenga tags GA4 para estos eventos.

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

/** Sources that have already fired a deduplicated lead event this page load. */
const firedLeadSources = new Set<string>();

/**
 * Push one event into the dataLayer; GTM fans it out (GA4, píxeles, etc.).
 * Exactly ONE push per call — never also gtag() — so one submit = one ping
 * per destination. Safe to call on the server (no-op).
 */
export function trackEvent(
  event: string,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

/**
 * Emit a `generate_lead` GA4 event for a lead action.
 *
 * `generate_lead` is a GA4 recommended event; mark it as a key event in
 * GA4 (property 533544003) and import it into Google Ads as a conversion.
 *
 * Deduplicated: fires at most once per `source` per page load, so double
 * clicks / repeated callbacks produce a single lead event.
 */
export function trackLead(
  source: string,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (firedLeadSources.has(source)) {
    return;
  }
  firedLeadSources.add(source);

  trackEvent("generate_lead", { lead_source: source, ...payload });
}
