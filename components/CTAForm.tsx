"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";

type FormState = "idle" | "loading" | "success" | "error";

const fields = [
  { id: "firstname", label: "Nombre", type: "text", placeholder: "Tu nombre completo", required: true },
  { id: "company", label: "Empresa", type: "text", placeholder: "Nombre de tu empresa", required: true },
  { id: "jobtitle", label: "Cargo", type: "text", placeholder: "Tu cargo actual", required: true },
  { id: "email", label: "Email", type: "email", placeholder: "tu@empresa.com", required: true },
  { id: "phone", label: "Teléfono", type: "tel", placeholder: "+502 0000 0000", required: true },
] as const;

const benefits = [
  "Implementación en menos de 2 semanas",
  "Sin cambiar tu stack tecnológico",
  "Soporte dedicado durante el arranque",
];

export default function CTAForm() {
  const [state, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Basic validation
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !data[f.id]) {
        newErrors[f.id] = "Este campo es requerido";
      }
    });
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
      newErrors.email = "Ingresa un email válido";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("server error");

      // Fire GA4 event
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({ event: "lead_form_submit" });
      }

      setFormState("success");
    } catch {
      setFormState("error");
      setGlobalError("Error al enviar. Verifica los datos e intenta de nuevo.");
    }
  }

  return (
    <section
      id="cta-form"
      aria-label="Solicitar evaluación gratuita de Lumen"
      className="relative min-h-[70vh] py-28 md:py-36 overflow-hidden"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        suppressHydrationWarning
      >
        <source src="/videos/cta-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/82" />
      {/* Gradient radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(104,1,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* ── LEFT — Copy ── */}
        <div className="flex flex-col">
          <h2 className="text-4xl md:text-5xl font-black text-white [text-wrap:balance] leading-[1.05]">
            ¿Listo para una operación más inteligente?
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-[40ch] leading-relaxed [text-wrap:pretty]">
            Habla con un especialista de Prometheus y descubre cómo Lumen puede
            transformar tu operación en semanas.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <CheckCircle
                  weight="duotone"
                  size={20}
                  className="text-[#00BFDD] shrink-0"
                />
                <span className="text-white/80 text-base">{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs tracking-[0.1em] uppercase text-[#7E8FA6]/60">
            Powered by{" "}
            <span className="text-[#FF5C00] font-semibold">PROMETHEUS</span>
          </p>
        </div>

        {/* ── RIGHT — Form ── */}
        <div>
          {state === "success" ? (
            /* Success state */
            <div className="flex flex-col items-center text-center gap-5 py-16">
              <CheckCircle
                weight="duotone"
                size={52}
                className="text-[#00BFDD]"
              />
              <h3 className="text-2xl font-bold text-white">
                Solicitud recibida
              </h3>
              <p className="text-[#7E8FA6] max-w-[32ch] leading-relaxed">
                El equipo de Prometheus se comunicará contigo en las próximas
                24 horas hábiles.
              </p>
            </div>
          ) : state === "loading" ? (
            /* Loading skeleton */
            <div className="flex flex-col gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="h-4 w-24 rounded animate-shimmer" />
                  <div className="h-[50px] rounded-lg animate-shimmer" />
                </div>
              ))}
              <div className="h-[52px] rounded-lg animate-shimmer mt-2" />
            </div>
          ) : (
            /* Idle / error form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {fields.map((f) => (
                <div key={f.id} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={f.id}
                    className="text-sm font-medium text-[#7E8FA6]"
                  >
                    {f.label}
                    {f.required && (
                      <span className="text-[#FF6B35] ml-0.5">*</span>
                    )}
                  </label>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    className={`bg-white/[0.05] border rounded-lg px-4 py-3 text-white text-base placeholder:text-white/25 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors[f.id]
                        ? "border-[#FF6B35]/60 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                        : "border-[#6801FF]/30 focus:border-[#6801FF] focus:ring-[#6801FF]"
                    }`}
                  />
                  {errors[f.id] && (
                    <p className="text-xs text-[#FF6B35]">{errors[f.id]}</p>
                  )}
                </div>
              ))}

              {/* Message textarea */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-[#7E8FA6]"
                >
                  Mensaje{" "}
                  <span className="text-[#7E8FA6]/50 font-normal">
                    (opcional)
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="¿En qué podemos ayudarte?"
                  className="bg-white/[0.05] border border-[#6801FF]/30 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/25 focus:outline-none focus:border-[#6801FF] focus:ring-1 focus:ring-[#6801FF] transition-all duration-200 resize-none"
                />
              </div>

              {/* Global error */}
              {state === "error" && globalError && (
                <div className="p-3 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20">
                  <p className="text-sm text-[#FF6B35]">{globalError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#6801FF] hover:bg-[#0078DF] text-white font-bold py-4 rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black mt-1"
              >
                Solicitar evaluación gratuita
              </button>

              <p className="text-xs text-[#7E8FA6]/50 text-center">
                Sin compromiso. Respuesta en menos de 24 horas.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Extend window for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
