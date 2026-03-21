"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";

const tabs = ["WhatsApp", "Voz", "Chat Web"] as const;
type Tab = (typeof tabs)[number];

const bullets = [
  "Respuesta instantánea 24/7",
  "Acciones reales en tu negocio",
  "Voz natural por teléfono",
  "Handoff perfecto al humano",
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

export default function DemoInteractiva() {
  const [activeTab, setActiveTab] = useState<Tab>("WhatsApp");
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="demo"
      aria-label="Demo interactiva de la plataforma Lumen"
      className="min-h-[90vh] bg-[#0D0D1A] py-28 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-16 items-center">

        {/* ── LEFT — Panel ── */}
        <motion.div ref={panelRef} style={{ y: panelY }}>
          <div className="bg-[#111118] border border-[#6801FF]/20 rounded-2xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {/* Tabs bar */}
            <div className="flex border-b border-white/[0.06] px-6 pt-4 gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 mr-8 text-sm font-medium transition-all duration-200 border-b-2 focus-visible:outline-none ${
                    activeTab === tab
                      ? "text-[#6801FF] border-[#6801FF]"
                      : "text-[#7E8FA6] border-transparent hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Mockup area */}
            <div className="w-full aspect-[800/520] bg-[#0D0D1A]/60 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#6801FF]/15 border border-[#6801FF]/25 flex items-center justify-center mx-auto mb-4">
                  <div className="w-7 h-7 rounded bg-[#6801FF]/50" />
                </div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#7E8FA6]">
                  MOCKUP {activeTab.toUpperCase()}
                </p>
                <p className="text-[10px] text-[#7E8FA6]/50 mt-1">
                  PNG @2x · 800×520 · sin fondo
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT — Copy ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.0] [text-wrap:balance] text-white"
          >
            Todo tu negocio. Una sola conversación.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-white/70 max-w-[42ch] leading-relaxed [text-wrap:pretty]"
          >
            La IA no solo responde. Consulta tu CRM, actualiza pedidos y agenda
            citas — sin que el cliente note la diferencia.
          </motion.p>

          {/* Bullets */}
          <motion.ul variants={stagger} className="mt-8 flex flex-col gap-4">
            {bullets.map((b) => (
              <motion.li
                key={b}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <CheckCircle
                  weight="duotone"
                  size={20}
                  className="text-[#00BFDD] mt-0.5 shrink-0"
                />
                <span className="text-white/80 text-base">{b}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3">
            <a
              href="#cta-form"
              className="inline-flex items-center justify-center bg-[#6801FF] hover:bg-[#0078DF] text-white font-bold px-8 py-3.5 rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF] w-fit"
            >
              Ver demo en vivo
            </a>
            <a
              href="#como-funciona"
              className="text-sm text-[#7E8FA6] hover:text-white transition-colors duration-200 w-fit"
            >
              Ver video de 2 minutos →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
