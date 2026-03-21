"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Microphone,
  Function as FunctionIcon,
  BookOpen,
  ArrowsLeftRight,
  ChartLine,
} from "@phosphor-icons/react";

const caps = [
  {
    icon: Brain,
    title: "IA Multi-proveedor",
    desc: "Elige entre OpenAI, Google Gemini y Anthropic según cada caso de uso.",
    span: "md:col-span-2",
  },
  {
    icon: Microphone,
    title: "Voz en Tiempo Real",
    desc: "Llamadas con voz natural. Latencia menor a 300ms.",
    span: "md:col-span-1",
  },
  {
    icon: FunctionIcon,
    title: "Function Calling",
    desc: "La IA ejecuta acciones reales: actualiza CRM, agenda citas, consulta inventario.",
    span: "md:col-span-1",
  },
  {
    icon: BookOpen,
    title: "Base de Conocimiento RAG",
    desc: "Responde con tus documentos, manuales y políticas — siempre actualizados.",
    span: "md:col-span-2",
  },
  {
    icon: ArrowsLeftRight,
    title: "Handoff Inteligente",
    desc: "Transición perfecta al agente humano con todo el contexto preservado.",
    span: "md:col-span-1",
  },
  {
    icon: ChartLine,
    title: "Analítica Operativa",
    desc: "Métricas de resolución, satisfacción y carga por canal en tiempo real.",
    span: "md:col-span-1",
  },
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

export default function Capacidades() {
  return (
    <section
      id="capacidades"
      aria-label="Capacidades clave de Lumen"
      className="min-h-[80vh] bg-black py-28 md:py-36"
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
            Todo lo que necesitas. En una sola plataforma.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-[#7E8FA6] max-w-[44ch] mx-auto leading-relaxed"
          >
            Desde la respuesta automática hasta la acción dentro de tu negocio.
          </motion.p>
        </motion.div>

        {/* Bento grid — variable col-spans */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {caps.map(({ icon: Icon, title, desc, span }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={`${span} bg-[#111118] border border-white/[0.08] rounded-[2rem] p-8 flex flex-col gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[#6801FF]/40 transition-colors duration-300 group cursor-default`}
            >
              <Icon
                weight="duotone"
                size={24}
                className="text-[#00BFDD] group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-[#7E8FA6] leading-relaxed max-w-[40ch]">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
