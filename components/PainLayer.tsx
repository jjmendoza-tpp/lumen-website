"use client";

import { motion } from "framer-motion";
import {
  WarningCircle,
  Robot,
  ArrowsLeftRight,
  UsersThree,
} from "@phosphor-icons/react";

const stats = [
  {
    value: "67%",
    label: "abandona si no recibe respuesta en la primera hora",
  },
  {
    value: "3.2×",
    label: "más caro operar con canales fragmentados",
  },
  {
    value: "41%",
    label: "de conversaciones perdidas fuera del horario laboral",
  },
];

const painCards = [
  {
    icon: WarningCircle,
    title: "Sin visibilidad unificada",
    desc: "Cada canal vive en su propia isla. Nadie ve el panorama completo.",
  },
  {
    icon: Robot,
    title: "IA que solo responde",
    desc: "Responde preguntas pero no puede actualizar pedidos ni agendar citas.",
  },
  {
    icon: ArrowsLeftRight,
    title: "Handoff sin historial",
    desc: "El agente empieza desde cero. El cliente repite todo otra vez.",
  },
  {
    icon: UsersThree,
    title: "Escala = más personas",
    desc: "Cada punto de crecimiento requiere contratar más soporte.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function PainLayer() {
  return (
    <section
      id="pain"
      aria-label="El costo de operar sin una plataforma unificada"
      className="min-h-[85vh] bg-black py-28 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-16 items-start">

        {/* ── LEFT — Headline + KPIs ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.0] [text-wrap:balance] text-white"
          >
            ¿Cuánto te cuesta operar en el caos?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-white/65 max-w-[44ch] leading-relaxed [text-wrap:pretty]"
          >
            Las empresas en LatAm pierden ventas y clientes porque no pueden
            responder rápido, a toda hora, en todos los canales. Los números son
            brutales.
          </motion.p>

          {/* KPI stats */}
          <motion.div variants={stagger} className="mt-12 flex flex-col gap-8">
            {stats.map((s) => (
              <motion.div
                key={s.value}
                variants={fadeUp}
                className="border-l-2 border-[#00BFDD]/30 pl-5"
              >
                <div className="text-6xl md:text-7xl font-black text-[#00BFDD] tabular-nums leading-none tracking-tighter">
                  {s.value}
                </div>
                <p className="text-sm text-[#7E8FA6] mt-2 max-w-[28ch] leading-relaxed">
                  {s.label}
                </p>
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#7E8FA6]/40 mt-1">
                  Pendiente validación equipo comercial
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT — Pain cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 mt-4 md:mt-0"
        >
          {painCards.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="relative bg-[#FF6B35]/[0.04] border border-[#FF6B35]/[0.12] rounded-2xl p-6 flex flex-col gap-3 overflow-hidden hover:border-[#FF6B35]/25 transition-colors duration-300 group"
            >
              <Icon
                weight="duotone"
                size={22}
                className="text-[#FF6B35] shrink-0"
              />
              <h3 className="text-base font-semibold text-white leading-snug">
                {title}
              </h3>
              <p className="text-sm text-[#7E8FA6] leading-relaxed">{desc}</p>

              {/* Progress bar — "70% problema" */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.04]">
                <div className="h-full w-[70%] bg-[#FF6B35]/40 rounded-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
