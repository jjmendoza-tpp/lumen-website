"use client";

import { motion } from "framer-motion";
import { CheckCircle, CaretDown } from "@phosphor-icons/react";

const tiers = [
  {
    name: "SPARK",
    price: "$349",
    conv: "2,000 conversaciones/mes",
    features: [
      "Asistente IA básico",
      "2 canales de comunicación",
      "Base de conocimiento (10 docs)",
      "Panel de métricas básico",
      "Soporte por email",
    ],
    cta: "Empezar",
    ctaStyle: "secondary" as const,
    featured: false,
  },
  {
    name: "CORE",
    price: "$749",
    conv: "7,000 conversaciones/mes",
    features: [
      "IA Multi-proveedor",
      "5 canales de comunicación",
      "Function Calling",
      "Base de conocimiento ilimitada",
      "Handoff inteligente al humano",
      "Soporte prioritario",
    ],
    cta: "Empezar — Más popular",
    ctaStyle: "primary" as const,
    featured: true,
  },
  {
    name: "SCALE",
    price: "$1,499",
    conv: "25,000 conversaciones/mes",
    features: [
      "Todo lo de Core",
      "Agente de voz en tiempo real",
      "Analítica operativa avanzada",
      "Integraciones personalizadas",
      "Manager de cuenta dedicado",
    ],
    cta: "Empezar",
    ctaStyle: "secondary" as const,
    featured: false,
  },
  {
    name: "ENTERPRISE",
    price: "$3,000+",
    conv: "Conversaciones ilimitadas",
    features: [
      "Todo lo de Scale",
      "Infraestructura dedicada",
      "SLA 99.9% garantizado",
      "Implementación asistida",
      "Contrato flexible",
      "Soporte 24/7",
    ],
    cta: "Contactar ventas",
    ctaStyle: "ghost" as const,
    featured: false,
  },
];

const addons = [
  { name: "Conversaciones extra", desc: "$0.18 por conversación adicional" },
  { name: "Canal adicional", desc: "$99/mes por canal extra" },
  { name: "Pack de consultoría", desc: "4h $220 · 10h $550 · 20h $1,100" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Precios de Lumen"
      className="min-h-[90vh] bg-black py-28 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight [text-wrap:balance]"
          >
            Precios claros. Sin sorpresas.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-[#7E8FA6] max-w-[44ch] mx-auto leading-relaxed"
          >
            Elige el plan que se adapta al volumen de tu operación.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-3">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] tracking-[0.12em] uppercase font-medium bg-[#6801FF]/10 border border-[#6801FF]/20 text-[#7E8FA6]">
              Vigente desde Abril 2026 · Precios en USD
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={`relative rounded-[2rem] p-8 flex flex-col gap-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ${
                tier.featured
                  ? "bg-[#6801FF]/[0.04] border border-[#6801FF] lg:scale-[1.02]"
                  : "bg-[#0a0a0a] border border-white/[0.08]"
              }`}
            >
              {/* Featured badge */}
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-[#6801FF] text-white text-xs font-bold whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                    Más popular
                  </span>
                </div>
              )}

              {/* Tier name */}
              <p className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#7E8FA6]">
                {tier.name}
              </p>

              {/* Price */}
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-[#00BFDD] tabular-nums tracking-tighter leading-none">
                  {tier.price}
                </span>
                <span className="text-base text-[#7E8FA6] mb-0.5">/mes</span>
              </div>

              {/* Conversations */}
              <p className="text-sm text-white/70">{tier.conv}</p>

              <hr className="border-white/[0.06]" />

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle
                      weight="duotone"
                      size={16}
                      className="text-[#6801FF] mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-white/80">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#cta-form"
                className={`w-full py-3 rounded-lg text-sm font-bold text-center transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF] ${
                  tier.ctaStyle === "primary"
                    ? "bg-[#6801FF] hover:bg-[#0078DF] text-white"
                    : tier.ctaStyle === "secondary"
                    ? "bg-transparent border border-[#6801FF]/50 text-[#6801FF] hover:bg-[#6801FF]/10"
                    : "bg-transparent text-[#7E8FA6] hover:text-white border border-white/[0.08] hover:border-white/20"
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Add-ons collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="mt-12"
        >
          <details className="group">
            <summary className="flex items-center justify-center gap-2 text-sm font-medium text-[#7E8FA6] hover:text-white cursor-pointer transition-colors duration-200 select-none">
              <CaretDown
                weight="duotone"
                size={16}
                className="group-open:rotate-180 transition-transform duration-200"
              />
              Ver add-ons disponibles
            </summary>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {addons.map((a) => (
                <div
                  key={a.name}
                  className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <h4 className="text-sm font-semibold text-white">{a.name}</h4>
                  <p className="text-sm text-[#7E8FA6] mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </details>
        </motion.div>
      </div>
    </section>
  );
}
