"use client";

import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import Link from "next/link";

const navLinks = [
  { label: "Producto", href: "#demo" },
  { label: "Industrias", href: "#pain" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precios", href: "#pricing" },
  { label: "Recursos", href: "#footer" },
];

export default function Navbar({ lang = "es" }: { lang?: "es" | "en" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md border-b border-[#6801FF]/15"
            : "bg-black/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Lumen — Ir al inicio">
            <div className="w-[160px] h-[36px] bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <span className="text-[10px] tracking-[0.18em] uppercase text-[#7E8FA6] font-medium">
                LOGO LUMEN
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-[#00BFDD] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop right zone */}
          <div className="hidden md:flex items-center gap-5">
            {/* Language toggle */}
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className={`text-xs font-medium px-2 py-1 rounded transition-colors duration-200 ${
                  lang === "es" ? "text-white" : "text-[#7E8FA6] hover:text-white"
                }`}
              >
                ES
              </Link>
              <span className="text-white/20 text-xs">/</span>
              <Link
                href="/en"
                className={`text-xs font-medium px-2 py-1 rounded transition-colors duration-200 ${
                  lang === "en" ? "text-white" : "text-[#7E8FA6] hover:text-white"
                }`}
              >
                EN
              </Link>
            </div>

            {/* CTA */}
            <a
              href="#cta-form"
              className="bg-[#6801FF] hover:bg-[#0078DF] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6801FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Solicitar demo
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <List weight="duotone" size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
            <div className="w-[140px] h-[32px] bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center justify-center">
              <span className="text-[9px] tracking-[0.18em] uppercase text-[#7E8FA6]">
                LOGO LUMEN
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Cerrar menú"
            >
              <X weight="duotone" size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-6 pt-8 pb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="px-6 pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white/60 hover:text-white transition-colors">ES</Link>
              <span className="text-white/20">/</span>
              <Link href="/en" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white/60 hover:text-white transition-colors">EN</Link>
            </div>
            <a
              href="#cta-form"
              onClick={() => setMobileOpen(false)}
              className="w-full bg-[#6801FF] hover:bg-[#0078DF] text-white text-base font-bold py-3.5 rounded-lg text-center transition-all duration-200 active:scale-[0.98]"
            >
              Solicitar demo
            </a>
          </div>
        </div>
      )}
    </>
  );
}
