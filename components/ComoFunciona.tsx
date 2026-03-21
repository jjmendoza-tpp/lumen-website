"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "1",
    title: "Conecta tus canales",
    desc: "WhatsApp, voz, email y más en minutos, sin tocar código.",
  },
  {
    n: "2",
    title: "Configura tu asistente",
    desc: "Define flujos, base de conocimiento y el tono de tu marca.",
  },
  {
    n: "3",
    title: "La IA empieza a trabajar",
    desc: "Responde, consulta sistemas y actúa al instante, 24/7.",
  },
  {
    n: "4",
    title: "Tu equipo interviene cuando importa",
    desc: "Handoff perfecto con todo el contexto preservado.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      aria-label="Cómo funciona Lumen"
      className="min-h-[75vh] bg-[#0a0a0a] py-28 md:py-36"
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
            Empieza en días, no en meses
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-[#7E8FA6] max-w-[44ch] mx-auto leading-relaxed"
          >
            De la configuración al primer cliente atendido por IA en menos de 2 semanas.
          </motion.p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-10 relative"
        >
          {/* Connector lines — desktop only */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="hidden md:block absolute top-9 h-px bg-gradient-to-r from-[#00BFDD]/40 to-[#00BFDD]/10"
              style={{
                left: `calc(${(i + 1) * 25}% - 24px)`,
                width: "calc(25% - 16px)",
              }}
            />
          ))}

          {steps.map((step) => (
            <motion.div
              key={step.n}
              variants={fadeUp}
              className="flex flex-col items-center text-center gap-4"
            >
              {/* Circle */}
              <div
                className="w-[72px] h-[72px] rounded-full bg-[#6801FF] flex items-center justify-center shrink-0 relative z-10"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}
              >
                <span className="text-2xl font-black text-white">{step.n}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[#7E8FA6] leading-relaxed max-w-[22ch]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a
            href="#cta-form"
            className="inline-flex items-center justify-center bg-[#6801FF] hover:bg-[#0078DF] text-white font-bold px-10 py-4 rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF]"
          >
            Solicitar evaluación gratuita
          </a>
        </motion.div>
      </div>
    </section>
  );
}
