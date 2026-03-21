"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const avatars = [
  { initials: "IM", from: "#6801FF", to: "#0078DF" },
  { initials: "CE", from: "#0078DF", to: "#00BFDD" },
  { initials: "CR", from: "#00BFDD", to: "#6801FF" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const shapeY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Lumen — Plataforma omnicanal con IA"
      className="relative min-h-[100dvh] bg-[#0D0D1A] overflow-hidden"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        suppressHydrationWarning
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A]/50 via-transparent to-[#0D0D1A] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_top_right,rgba(104,1,255,0.07)_0%,transparent_65%)] pointer-events-none" />

      {/* Main grid */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 min-h-[100dvh] grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-12 items-center pt-28 pb-16">

        {/* ── LEFT COLUMN ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00BFDD]/10 border border-[#00BFDD]/25">
              <span className="w-2 h-2 rounded-full bg-[#00BFDD] animate-pulse-dot shrink-0" />
              <span className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#00BFDD]">
                Plataforma Omnicanal con IA
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-5xl md:text-[72px] font-black tracking-tighter leading-[0.95] [text-wrap:balance]"
          >
            <span className="text-white">
              Una sola plataforma.
              <br />
              Todos tus canales.
            </span>
            <br />
            <span className="text-[#6801FF]">IA que actúa.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-white/65 max-w-[52ch] leading-relaxed [text-wrap:pretty]"
          >
            Lumen conecta WhatsApp, voz, email y redes sociales en una bandeja
            inteligente que responde, consulta tus sistemas y escala al humano
            correcto — en segundos.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 mt-8"
          >
            <a
              href="#cta-form"
              className="bg-[#6801FF] hover:bg-[#0078DF] text-white font-bold px-8 py-3.5 rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D1A] text-center"
            >
              Solicitar demo
            </a>
            <a
              href="#demo"
              className="bg-transparent border border-[#6801FF]/50 text-[#6801FF] font-bold px-8 py-3.5 rounded-lg hover:bg-[#6801FF]/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D1A] text-center"
            >
              Ver la plataforma →
            </a>
          </motion.div>

          {/* Micro social proof */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mt-6"
          >
            <div className="flex -space-x-2">
              {avatars.map((a) => (
                <div
                  key={a.initials}
                  className="w-7 h-7 rounded-full border-2 border-[#0D0D1A] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/50">
              Más de 10 empresas ya operan con Lumen
            </span>
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN ── */}
        <div className="relative flex items-center justify-center mt-12 md:mt-0">
          {/* Crystalline organic shape */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
            }}
            className="absolute top-[-10%] right-[-8%] w-[380px] h-[380px] pointer-events-none"
            style={{
              background: "rgba(104,1,255,0.12)",
              borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
              backdropFilter: "blur(32px) saturate(150%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          />

          {/* Mockup placeholder */}
          <motion.div
            style={{ y: mockupY }}
            className="relative z-10 w-full max-w-[560px]"
          >
            <div
              className="w-full aspect-[680/460] bg-[#111118] border border-white/[0.08] rounded-[20px] overflow-hidden flex items-center justify-center"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#6801FF]/20 border border-[#6801FF]/30 flex items-center justify-center mx-auto mb-3">
                  <div className="w-5 h-5 rounded bg-[#6801FF]/50" />
                </div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#7E8FA6]">
                  MOCKUP HERO
                </p>
                <p className="text-[10px] text-[#7E8FA6]/50 mt-1">
                  PNG @2x · 1200×800 · sin fondo
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
