"use client";

// Reabre el CookieBanner (escucha lumen:cookie-prefs-open en CookieBanner).
export default function CookiePrefsButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("lumen:cookie-prefs-open"))
      }
      className="rounded-lg border border-[#6801FF]/35 bg-[#6801FF]/10 px-4 py-3 text-sm font-medium text-[#6801FF] transition hover:bg-[#6801FF] hover:text-white"
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}
