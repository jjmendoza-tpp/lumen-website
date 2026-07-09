// Analytics helpers for lead tracking.
//
// The site loads GA4 (gtag, G-BWZW45MGRG) and GTM (GTM-KZNM7JNM) in
// app/layout.tsx. GTM's container has no GA4 event tags configured, so
// plain `dataLayer.push({event: ...})` calls never reach GA4. These
// helpers send events through gtag directly (which GA4 always sees) AND
// mirror them as plain dataLayer pushes (so GTM triggers can also use
// them if configured later).
//
// Consent: gtag events are natively subject to Google Consent Mode — if a
// consent banner later sets `analytics_storage: denied` via
// gtag('consent', ...), GA4 handles these events per the consent state.
// Nothing here bypasses or overrides consent.

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sources that have already fired a deduplicated lead event this page load. */
const firedLeadSources = new Set<string>();

/**
 * Send a GA4 event via gtag and mirror it into the dataLayer for GTM.
 * Safe to call on the server (no-op).
 */
export function trackEvent(
  event: string,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  // GA4 direct — gtag is defined globally by the inline script in
  // app/layout.tsx. Guard anyway (ad blockers, script failures).
  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  // GTM mirror — plain-object pushes are ignored by gtag/GA4 (which only
  // reads `arguments`-style pushes), so this never double-counts in GA4.
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
