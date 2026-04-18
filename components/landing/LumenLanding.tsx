'use client'

import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LumenDemoModal } from "@/components/landing/LumenDemoModal";
import { LumenHubSpotForm } from "@/components/landing/LumenHubSpotForm";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

const LOGO_DARK = "/logos/lumen-logo-dark.png";
const LOGO_LIGHT = "/logos/lumen-logo-white.png";
const THEME_STORAGE_KEY = "lumen-theme";

function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

function useBreakpoint() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    isSmallMobile: width < 400,
  };
}

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => undefined,
  isDark: false,
});

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      }
    } catch {
      // Ignore storage access errors and keep the default light theme.
    } finally {
      setThemeReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!themeReady || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors to avoid blocking theme changes.
    }
  }, [theme, themeReady]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      trackEvent("theme_toggle", { theme: next });
      return next;
    });
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const GlobalStyles = () => (
  <style>{`
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.3); }
    }
    @keyframes crmpulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 6px #25D366; }
      50% { opacity: 0.7; box-shadow: 0 0 12px #25D366; }
    }
    @keyframes phoneGlow {
      0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(142,0,255,0.2); }
      50% { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(45,0,255,0.35); }
    }
    @keyframes lumenFloatA {
      0%   { transform: translateY(0px) rotate(0deg); }
      33%  { transform: translateY(-22px) rotate(1.5deg); }
      66%  { transform: translateY(10px) rotate(-1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes lumenFloatB {
      0%   { transform: translateY(0px) rotate(0deg); }
      40%  { transform: translateY(-28px) rotate(-2deg); }
      70%  { transform: translateY(12px) rotate(1.2deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes lumenFloatC {
      0%   { transform: translateY(0px) rotate(0deg); }
      30%  { transform: translateY(-18px) rotate(2deg); }
      65%  { transform: translateY(16px) rotate(-1.5deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes fadeBadgeIn {
      0% { opacity: 0; transform: translateY(15px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeInComparison {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;
      -webkit-tap-highlight-color: transparent;
      -webkit-text-size-adjust: 100%;
    }
    html { scroll-padding-top: 72px; }
    body { overflow-x: hidden; }
    button {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    a {
      transition: color 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
  `}</style>
);

const SectionDivider = () => {
  const { isDark } = useTheme();
  const { isMobile } = useBreakpoint();

  return (
    <div
      style={{
        height: "1px",
        margin: isMobile ? "0 20px" : "0 64px",
        background: isDark
          ? "linear-gradient(to right, transparent, rgba(142,0,255,0.2), rgba(45,0,255,0.15), transparent)"
          : "linear-gradient(to right, transparent, rgba(45,0,255,0.1), rgba(0,194,255,0.08), transparent)",
      }}
    />
  );
};

function TorusShape({ size }: { size: number }) {
  const border = Math.max(18, Math.round(size * 0.15));
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${border}px solid rgba(255,255,255,0.55)`,
        boxShadow: "0 0 45px rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.06)",
        filter: "blur(1px)",
      }}
    />
  );
}

function CrescentShape({ size }: { size: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.58)",
        filter: "blur(1px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "12%",
          left: "36%",
          background: "#000000",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

function TeardropShape({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: Math.round(size * 1.16),
        background: "rgba(255,255,255,0.58)",
        borderRadius: "58% 58% 64% 64% / 74% 74% 44% 44%",
        transform: "rotate(25deg)",
        filter: "blur(6px)",
        boxShadow: "0 0 35px rgba(255,255,255,0.08)",
      }}
    />
  );
}

const GRAIN_SVG =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27320%27%3E%3Cfilter id=%27g%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.82%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27320%27 height=%27320%27 filter=%27url(%23g)%27 opacity=%271%27/%3E%3C/svg%3E")';

const LumenParallax = () => {
  const { isDark } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const torusSize = isMobile ? 182 : 364;
  const crescentSize = isMobile ? 130 : 259;
  const teardropSize = isMobile ? 109 : 217;
  const torusPos = isMobile ? { top: "-20px", right: "-30px" } : { top: "-50px", right: "-80px" };
  const crescentPos = isMobile ? { top: "28vh", left: "-20px" } : { top: "30vh", left: "-70px" };
  const teardropPos = isMobile ? { top: "65vh", right: "-10px" } : { top: "66vh", right: "-40px" };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          background: isDark ? "#000000" : "#FFFFFF",
          transition: "background 0.4s ease",
        }}
      />

      {isDark ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            backgroundImage: GRAIN_SVG,
            backgroundRepeat: "repeat",
            backgroundSize: "320px 320px",
            opacity: 0.045,
            pointerEvents: "none",
          }}
        />
      ) : (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-120px",
              width: "700px",
              height: "700px",
              background:
                "radial-gradient(ellipse, rgba(0,194,255,0.07) 0%, rgba(45,0,255,0.05) 45%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30vh",
              left: "-160px",
              width: "500px",
              height: "500px",
              background: "radial-gradient(ellipse, rgba(142,0,255,0.05) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "800px",
              height: "400px",
              background: "radial-gradient(ellipse, rgba(45,0,255,0.04) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      {isDark ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", ...torusPos }}>
            <div style={{ transform: `translateY(${scrollY * 0.09}px)` }}>
              <div style={{ animation: "lumenFloatA 9s ease-in-out infinite" }}>
                <div
                  style={{
                    opacity: 0.52,
                    transform: "rotate(-18deg)",
                    mixBlendMode: "screen",
                  }}
                >
                  <TorusShape size={torusSize} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "absolute", ...crescentPos }}>
            <div style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
              <div style={{ animation: "lumenFloatB 12s ease-in-out infinite" }}>
                <div
                  style={{
                    opacity: 0.48,
                    transform: "rotate(14deg)",
                    mixBlendMode: "screen",
                  }}
                >
                  <CrescentShape size={crescentSize} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "absolute", ...teardropPos }}>
            <div style={{ transform: `translateY(${scrollY * 0.48}px)` }}>
              <div style={{ animation: "lumenFloatC 10s ease-in-out infinite" }}>
                <div
                  style={{
                    opacity: 0.55,
                    transform: "rotate(-22deg)",
                    mixBlendMode: "screen",
                  }}
                >
                  <TeardropShape size={teardropSize} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8.5 1V2.5M8.5 14.5V16M1 8.5H2.5M14.5 8.5H16M3.1 3.1L4.16 4.16M12.84 12.84L13.9 13.9M13.9 3.1L12.84 4.16M4.16 12.84L3.1 13.9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.5 9.5C12.5 11.8 10.2 13.5 7.5 13.5C4 13.5 1.5 11 1.5 7.5C1.5 4.8 3.2 2.5 5.5 1.5C3.7 3.5 3.5 6.8 5.7 9C7.9 11.2 11.2 11 13.5 9.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    {open ? (
      <>
        <path d="M5 5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M3 6H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 11H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 16H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const navLinks = [
  { label: "Producto", href: "#capacidades" },
  { label: "Soluciones", href: "#por-que-lumen" },
  { label: "Casos de Uso", href: "#por-que-lumen" },
  { label: "Precios", href: "#precios" },
];

const LumenNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();
  const isCompact = isMobile || isTablet;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!isCompact) {
      setMenuOpen(false);
    }
  }, [isCompact]);

  const navBg = isDark
    ? scrolled
      ? "rgba(5,5,14,0.96)"
      : "rgba(5,5,14,0.7)"
    : scrolled
      ? "rgba(255,255,255,0.97)"
      : "rgba(255,255,255,0.85)";
  const borderColor = isDark
    ? "rgba(142,0,255,0.14)"
    : scrolled
      ? "rgba(0,0,0,0.07)"
      : "rgba(45,0,255,0.1)";
  const linkColor = isDark ? "rgba(255,255,255,0.78)" : "rgba(13,13,26,0.68)";
  const linkHover = isDark ? "#FFFFFF" : "#0D0D1A";
  const toggleColor = isDark ? "rgba(255,255,255,0.78)" : "rgba(13,13,26,0.68)";
  const toggleBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(13,13,26,0.06)";
  const toggleBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(13,13,26,0.14)";
  const menuBg = isDark ? "rgba(5,5,14,0.98)" : "rgba(255,255,255,0.99)";

  return (
    <>
      <LumenDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

      <nav
        ref={menuRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? "0 20px" : "0 48px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${borderColor}`,
          transition: "background 0.3s ease, border-color 0.3s ease",
          boxShadow: !isDark && scrolled ? "0 1px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <img
          src={isDark ? LOGO_LIGHT : LOGO_DARK}
          alt="LUMEN"
          style={{ height: isMobile ? "40px" : "49px", width: "auto", objectFit: "contain" }}
        />

        {!isCompact ? (
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: linkColor,
                  textDecoration: "none",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 500,
                  fontSize: "15px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = linkHover;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = linkColor;
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: toggleBg,
              border: `1px solid ${toggleBorder}`,
              color: toggleColor,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {!isCompact ? (
            <button
              type="button"
              onClick={() => {
                trackEvent("cta_click", { label: "navbar_demo" });
                setDemoOpen(true);
              }}
              style={{
                background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: isDark
                  ? "0 0 24px rgba(45,0,255,0.35)"
                  : "0 4px 20px rgba(45,0,255,0.28)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Solicita una Demo
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: toggleBg,
                border: `1px solid ${toggleBorder}`,
                color: toggleColor,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          )}
        </div>
      </nav>

      {isCompact ? (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 99,
            background: menuBg,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: `1px solid ${borderColor}`,
            overflow: "hidden",
            maxHeight: menuOpen ? "400px" : "0",
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "all" : "none",
            boxShadow: menuOpen ? "0 20px 60px rgba(0,0,0,0.18)" : "none",
          }}
        >
          <div style={{ padding: "12px 20px 20px" }}>
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 0",
                  color: linkColor,
                  textDecoration: "none",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  fontSize: "17px",
                  borderBottom:
                    index < navLinks.length - 1
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`
                      : "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = linkHover;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = linkColor;
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                trackEvent("cta_click", { label: "mobile_menu_demo" });
                setMenuOpen(false);
                setDemoOpen(true);
              }}
              style={{
                width: "100%",
                marginTop: "16px",
                background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "14px 20px",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(45,0,255,0.35)",
              }}
            >
              Solicita una Demo
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

const stats = [
  { value: "< 2s", label: "Respuesta" },
  { value: "24/7", label: "Disponible" },
  { value: "100%", label: "Cobertura" },
  { value: "3→1", label: "Canales" },
];

const channels = [
  { label: "WhatsApp", color: "#25D366", bg: "rgba(37,211,102,0.12)", border: "rgba(37,211,102,0.3)" },
  { label: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)", border: "rgba(225,48,108,0.3)" },
  { label: "Web Chat", color: "#2D00FF", bg: "rgba(45,0,255,0.12)", border: "rgba(45,0,255,0.3)" },
  { label: "Voz IA", color: "#8E00FF", bg: "rgba(142,0,255,0.12)", border: "rgba(142,0,255,0.3)" },
];

const LumenHero = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isDark } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const textSub = isDark ? "rgba(255,255,255,0.72)" : "rgba(13,13,26,0.80)";
  const statLabel = isDark ? "rgba(255,255,255,0.50)" : "rgba(13,13,26,0.65)";
  const badgeBg = isDark ? "rgba(45,0,255,0.10)" : "rgba(45,0,255,0.06)";
  const badgeBorder = isDark ? "rgba(45,0,255,0.40)" : "rgba(45,0,255,0.25)";
  const badgeText = isDark ? "rgba(255,255,255,0.9)" : "rgba(13,13,26,0.75)";
  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(45,0,255,0.08)";
  const headlineGradient = isDark
    ? "linear-gradient(135deg, #FFFFFF 0%, #C4A8FF 40%, #8E00FF 75%, #2D00FF 100%)"
    : "linear-gradient(135deg, #00C2FF 0%, #2D00FF 50%, #8E00FF 100%)";
  const fontSize = isMobile ? "34px" : isTablet ? "50px" : "clamp(48px, 6.5vw, 84px)";

  return (
    <>
      <LumenDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <section
        style={{
          minHeight: isMobile ? "100svh" : "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "80px 20px 20px" : isTablet ? "100px 40px 60px" : "120px 64px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: isMobile ? "320px" : "700px",
            height: isMobile ? "320px" : "700px",
            background: isDark
              ? "radial-gradient(ellipse, rgba(45,0,255,0.2) 0%, transparent 65%)"
              : "radial-gradient(ellipse, rgba(0,194,255,0.10) 0%, rgba(45,0,255,0.07) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {!isMobile ? (
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "15%",
              width: "400px",
              height: "400px",
              background: isDark
                ? "radial-gradient(ellipse, rgba(142,0,255,0.1) 0%, transparent 65%)"
                : "radial-gradient(ellipse, rgba(142,0,255,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        ) : null}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1100px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? "18px" : "26px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: badgeBg,
              border: `1px solid ${badgeBorder}`,
              borderRadius: "100px",
              padding: "6px 14px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00C2FF, #2D00FF)",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(45,0,255,0.7)",
                animation: "pulse 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 600,
                fontSize: isMobile ? "12px" : "14px",
                color: badgeText,
                letterSpacing: "0.03em",
              }}
            >
              Plataforma de IA Conversacional
            </span>
          </div>

          <img
            src={isDark ? LOGO_LIGHT : LOGO_DARK}
            alt="LUMEN"
            style={{
              height: isMobile ? "58px" : "90px",
              width: "auto",
              objectFit: "contain",
              filter: isDark
                ? "drop-shadow(0 0 20px rgba(142,0,255,0.55))"
                : "drop-shadow(0 4px 14px rgba(45,0,255,0.14))",
              transition: "filter 0.3s ease",
            }}
          />

          <h1
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize,
              lineHeight: isMobile ? 1.15 : 1.1,
              margin: 0,
              backgroundImage: headlineGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              maxWidth: "900px",
            }}
          >
            La IA que convierte conversaciones en clientes
          </h1>

          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "15px" : "18px",
              color: textSub,
              maxWidth: "680px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {isMobile
              ? "Respuestas inteligentes en WhatsApp, Instagram y Web. CRM automático en menos de 2 segundos."
              : "Un mensaje llega por WhatsApp, Instagram o Web. LUMEN lo entiende, responde y registra el contacto en tu CRM automáticamente. Todo en menos de 2 segundos."}
          </p>

          <div
            style={{
              display: "flex",
              gap: isMobile ? "6px" : "8px",
              flexWrap: "nowrap",
              justifyContent: "center",
              width: "100%",
              maxWidth: "fit-content",
            }}
          >
            {channels.map((channel) => (
              <span
                key={channel.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: channel.bg,
                  border: `1px solid ${channel.border}`,
                  borderRadius: "100px",
                  padding: isMobile ? "5px 10px" : "5px 12px",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  fontSize: isMobile ? "11px" : "12px",
                  color: channel.color,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: isMobile ? 12 : 14,
                    height: isMobile ? 12 : 14,
                    borderRadius: "50%",
                    background: channel.color,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: isMobile ? 7 : 8,
                    fontWeight: 800,
                  }}
                >
                  {channel.label === "Web Chat" ? "W" : channel.label[0]}
                </span>
                {channel.label}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              width: isMobile ? "100%" : "auto",
              marginTop: "4px",
            }}
          >
            <a href="#contacto-general" style={{ textDecoration: "none", width: isMobile ? "100%" : "auto" }}>
              <button
                type="button"
                onClick={() => trackEvent("cta_click", { label: "hero_primary" })}
                style={{
                  background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  padding: isMobile ? "16px 24px" : "14px 32px",
                  width: "100%",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: isMobile ? "16px" : "17px",
                  cursor: "pointer",
                  boxShadow: isDark
                    ? "0 0 36px rgba(45,0,255,0.45), 0 0 72px rgba(142,0,255,0.2)"
                    : "0 8px 32px rgba(45,0,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "box-shadow 0.25s ease, transform 0.2s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Comenzar Ahora
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L8 3M13 8L8 13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </a>

            <button
              type="button"
              onClick={() => {
                trackEvent("cta_click", { label: "hero_demo" });
                setDemoOpen(true);
              }}
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
                color: isDark ? "rgba(255,255,255,0.9)" : "#0D0D1A",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                padding: isMobile ? "14px 20px" : "12px 24px",
                width: isMobile ? "100%" : "auto",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 600,
                fontSize: isMobile ? "15px" : "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.2s ease",
                boxShadow: isDark
                  ? "0 2px 8px rgba(0,0,0,0.2)"
                  : "0 2px 12px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-1px)";
                event.currentTarget.style.boxShadow = isDark
                  ? "0 4px 16px rgba(0,0,0,0.3)"
                  : "0 4px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = isDark
                  ? "0 2px 8px rgba(0,0,0,0.2)"
                  : "0 2px 12px rgba(0,0,0,0.06)";
              }}
            >
              <img
                src={isDark ? LOGO_LIGHT : LOGO_DARK}
                alt="LUMEN"
                style={{ height: "20px", width: "auto", objectFit: "contain" }}
              />
              Ver Demo
            </button>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: isMobile ? "100%" : "560px",
              marginTop: isMobile ? "4px" : "8px",
              borderRadius: "16px",
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(45,0,255,0.04)",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(45,0,255,0.1)",
              overflow: "hidden",
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  padding: isMobile ? "12px 8px" : "14px 12px",
                  textAlign: "center",
                  borderRight: index < stats.length - 1 ? `1px solid ${dividerColor}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 800,
                    fontSize: isMobile ? "18px" : "22px",
                    backgroundImage: isDark
                      ? "linear-gradient(135deg, #2D00FF, #8E00FF)"
                      : "linear-gradient(135deg, #00C2FF, #2D00FF, #8E00FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 500,
                    fontSize: isMobile ? "10px" : "11px",
                    color: statLabel,
                    marginTop: "4px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const WA_COLOR = "#25D366";
const IG_START = "#E1306C";
const IG_END = "#833AB4";
const WEB_COLOR = "#2D00FF";
const LUMEN_GRADIENT = "linear-gradient(135deg, #2D00FF, #8E00FF)";

interface ChatBubbleProps {
  color: string;
  isGradient?: boolean;
  gradientEnd?: string;
  align: "left" | "right";
  text: string;
  platform: string;
  delay: number;
  animatedIn: boolean;
}

const ChatBubble = ({
  color,
  isGradient,
  gradientEnd,
  align,
  text,
  platform,
  delay,
  animatedIn,
}: ChatBubbleProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (animatedIn) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [animatedIn, delay]);

  const background = isGradient ? `linear-gradient(135deg, ${color}, ${gradientEnd})` : color;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: align === "left" ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: "6px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "8px", color: "white", fontWeight: 700 }}>
          {platform === "WA" ? "W" : platform === "IG" ? "I" : "↗"}
        </span>
      </div>
      <div
        style={{
          background,
          color: "white",
          padding: "7px 11px",
          borderRadius: align === "left" ? "12px 12px 12px 3px" : "12px 12px 3px 12px",
          fontSize: "10px",
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 500,
          maxWidth: "130px",
          lineHeight: 1.4,
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontSize: "8px",
            opacity: 0.75,
            marginBottom: "2px",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {platform}
        </div>
        {text}
      </div>
    </div>
  );
};

const ChannelCard = ({
  label,
  icon,
  color,
  isGradient,
  gradientEnd,
  description,
  isDark,
}: {
  label: string;
  icon: ReactNode;
  color: string;
  isGradient?: boolean;
  gradientEnd?: string;
  description: string;
  isDark: boolean;
}) => {
  const background = isGradient ? `linear-gradient(135deg, ${color}, ${gradientEnd})` : color;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
        border: `1.5px solid ${isDark ? `${color}40` : `${color}30`}`,
        borderRadius: "14px",
        padding: "12px 16px",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        maxWidth: "100%",
        boxSizing: "border-box",
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          minWidth: "40px",
          borderRadius: "10px",
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 0 16px ${color}66`,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 800,
            fontSize: "14px",
            color: isDark ? "#FFFFFF" : "#1A1A2E",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 500,
            fontSize: "11px",
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,26,46,0.65)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const FlowDot = ({
  color,
  duration,
  delay,
  pathId,
}: {
  color: string;
  duration: number;
  delay: number;
  pathId: string;
}) => (
  <circle r="4" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
    <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`}>
      <mpath xlinkHref={`#${pathId}`} />
    </animateMotion>
    <animate
      attributeName="opacity"
      values="0;1;1;0"
      dur={`${duration}s`}
      repeatCount="indefinite"
      begin={`${delay}s`}
    />
  </circle>
);

const LumenOmnichannelMockup = () => {
  const [animatedIn, setAnimatedIn] = useState(false);
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);
  const { isDark } = useTheme();
  const breakpoint = useBreakpoint();

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedIn(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (breakpoint.isMobile) {
      const interval = setInterval(() => {
        setActiveChannelIndex((prev) => (prev + 1) % 3);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [breakpoint.isMobile]);

  const channelItems = [
    {
      label: "WhatsApp",
      color: WA_COLOR,
      description: "Chat · Audio · GPS",
      icon: <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>W</span>,
    },
    {
      label: "Instagram",
      color: IG_START,
      isGradient: true,
      gradientEnd: IG_END,
      description: "DM · Stories · Comentarios",
      icon: <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>I</span>,
    },
    {
      label: "Web Chat",
      color: WEB_COLOR,
      description: "Widget · API · SDK",
      icon: <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>W</span>,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: breakpoint.isMobile ? "600px" : "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: breakpoint.isMobile ? "flex-start" : "center",
        paddingTop: breakpoint.isMobile ? "16px" : "0",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "320px",
          height: "320px",
          background: "radial-gradient(ellipse, rgba(142,0,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {!breakpoint.isMobile ? (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="waLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={WA_COLOR} stopOpacity="0.8" />
              <stop offset="100%" stopColor={WA_COLOR} stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="igLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={IG_START} stopOpacity="0.8" />
              <stop offset="100%" stopColor={IG_END} stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="webLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={WEB_COLOR} stopOpacity="0.8" />
              <stop offset="100%" stopColor={WEB_COLOR} stopOpacity="0.2" />
            </linearGradient>
            <path id="waPath" d="M 88 138 C 160 138, 210 175, 258 185" />
            <path id="igPath" d="M 88 255 C 160 255, 210 248, 258 248" />
            <path id="webPath" d="M 88 372 C 160 372, 210 315, 258 312" />
          </defs>

          <use xlinkHref="#waPath" fill="none" stroke="url(#waLineGrad)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <use xlinkHref="#igPath" fill="none" stroke="url(#igLineGrad)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <use xlinkHref="#webPath" fill="none" stroke="url(#webLineGrad)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

          <FlowDot color={WA_COLOR} duration={2.2} delay={0} pathId="waPath" />
          <FlowDot color={WA_COLOR} duration={2.2} delay={1.1} pathId="waPath" />
          <FlowDot color={IG_START} duration={2.5} delay={0.4} pathId="igPath" />
          <FlowDot color={IG_END} duration={2.5} delay={1.6} pathId="igPath" />
          <FlowDot color={WEB_COLOR} duration={2.8} delay={0.8} pathId="webPath" />
          <FlowDot color={WEB_COLOR} duration={2.8} delay={2.0} pathId="webPath" />
        </svg>
      ) : null}

      <div
        style={{
          position: breakpoint.isMobile ? "relative" : "absolute",
          left: breakpoint.isMobile ? "auto" : "0px",
          top: breakpoint.isMobile ? "0" : "50%",
          transform: breakpoint.isMobile ? "none" : "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: breakpoint.isMobile ? "12px" : "22px",
          width: breakpoint.isMobile ? "100%" : "auto",
          padding: breakpoint.isMobile ? "0 16px" : "0",
          marginBottom: breakpoint.isMobile ? "20px" : "0",
          zIndex: 10,
          alignItems: breakpoint.isMobile ? "center" : "flex-start",
        }}
      >
        {breakpoint.isMobile ? (
          <div style={{ width: "100%", maxWidth: "320px" }}>
            <div
              key={activeChannelIndex}
              style={{
                animation: "fadeBadgeIn 0.6s ease-out forwards",
              }}
            >
              <ChannelCard
                label={channelItems[activeChannelIndex].label}
                color={channelItems[activeChannelIndex].color}
                isGradient={channelItems[activeChannelIndex].isGradient}
                gradientEnd={channelItems[activeChannelIndex].gradientEnd}
                description={channelItems[activeChannelIndex].description}
                icon={channelItems[activeChannelIndex].icon}
                isDark={isDark}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
              {channelItems.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveChannelIndex(index)}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    border: "none",
                    background:
                      index === activeChannelIndex
                        ? channelItems[activeChannelIndex].color
                        : isDark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s ease",
                    boxShadow:
                      index === activeChannelIndex
                        ? `0 0 8px ${channelItems[activeChannelIndex].color}`
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          channelItems.map((channel) => (
            <ChannelCard
              key={channel.label}
              label={channel.label}
              color={channel.color}
              isGradient={channel.isGradient}
              gradientEnd={channel.gradientEnd}
              description={channel.description}
              icon={channel.icon}
              isDark={isDark}
            />
          ))
        )}
      </div>

      <div
        style={{
          position: breakpoint.isMobile ? "relative" : "absolute",
          right: breakpoint.isMobile ? "auto" : "24px",
          top: breakpoint.isMobile ? "auto" : "50%",
          transform: breakpoint.isMobile ? "none" : "translateY(-50%)",
        }}
      >
        <div
          style={{
            width: "210px",
            height: "420px",
            background: isDark ? "linear-gradient(180deg, #1A1A2E, #12121F)" : "linear-gradient(180deg, #FAFAFA, #FFFFFF)",
            borderRadius: "44px",
            border: isDark ? "6px solid #2A2A40" : "6px solid #E5E5E5",
            boxShadow: isDark
              ? "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(142,0,255,0.2)"
              : "0 0 0 1px rgba(0,0,0,0.08), 0 30px 80px rgba(0,0,0,0.15), 0 0 40px rgba(142,0,255,0.15)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            animation: "phoneGlow 4s ease-in-out infinite",
          }}
        >
          <div
            style={{
              height: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: isDark ? "#12121F" : "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "90px",
                height: "20px",
                background: isDark ? "#0A0A18" : "#1A1A2E",
                borderRadius: "0 0 16px 16px",
              }}
            />
          </div>

          <div
            style={{
              background: isDark ? "#141425" : "#FAFAFA",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: isDark ? "1px solid rgba(45,0,255,0.2)" : "1px solid rgba(45,0,255,0.15)",
              flexShrink: 0,
            }}
          >
            <img src={LOGO_LIGHT} alt="LUMEN" style={{ height: "20px", width: "auto", objectFit: "contain" }} />
            <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#25D366",
                  boxShadow: "0 0 5px #25D366",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "hidden",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: isDark ? "#0E0E1C" : "#FFFFFF",
            }}
          >
            <ChatBubble
              color={WA_COLOR}
              align="left"
              text="Necesito cotizar instalación solar."
              platform="WA"
              delay={200}
              animatedIn={animatedIn}
            />
            <ChatBubble
              color={IG_START}
              isGradient
              gradientEnd={IG_END}
              align="right"
              text="Tienen servicio en CDMX?"
              platform="IG"
              delay={700}
              animatedIn={animatedIn}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "6px",
                opacity: animatedIn ? 1 : 0,
                transform: animatedIn ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.4s ease 1.1s, transform 0.4s ease 1.1s",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: LUMEN_GRADIENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 0 8px rgba(45,0,255,0.6)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                  <path d="M12 2L4 11H9.5L8 19L17 10H11.5L13 2Z" fill="white" />
                </svg>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                  color: "white",
                  padding: "7px 11px",
                  borderRadius: "12px 12px 12px 3px",
                  fontSize: "10px",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 500,
                  maxWidth: "130px",
                  lineHeight: 1.4,
                  boxShadow: "0 0 16px rgba(45,0,255,0.4)",
                }}
              >
                <div style={{ fontSize: "8px", opacity: 0.75, marginBottom: "2px", fontWeight: 700 }}>
                  LUMEN · 1.8s
                </div>
                Claro. Te envío la cotización ahora mismo.
              </div>
            </div>

            <ChatBubble
              color={WEB_COLOR}
              align="right"
              text="Need pricing info ASAP"
              platform="WEB"
              delay={1600}
              animatedIn={animatedIn}
            />

            <ChatBubble
              color={WA_COLOR}
              align="left"
              text="Audio recibido. Procesando..."
              platform="WA"
              delay={2100}
              animatedIn={animatedIn}
            />
          </div>

          <div
            style={{
              background: isDark ? "#141425" : "#FAFAFA",
              borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                flex: 1,
                background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                borderRadius: "20px",
                padding: "6px 12px",
                fontSize: "10px",
                color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                fontFamily: "'Urbanist', sans-serif",
              }}
            >
              Responde en todos los canales...
            </div>
            <div
              style={{
                width: "26px",
                height: "26px",
                background: LUMEN_GRADIENT,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(45,0,255,0.4)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 9H15M15 9L9.5 3.5M15 9L9.5 14.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div
            style={{
              height: "20px",
              background: isDark ? "#12121F" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "60px",
                height: "4px",
                background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "-16px",
            background: "rgba(13, 13, 26, 0.95)",
            border: "1px solid rgba(142,0,255,0.35)",
            borderRadius: "10px",
            padding: "8px 12px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: "9px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
              marginBottom: "2px",
            }}
          >
            REGISTRO CRM
          </div>
          <div
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#25D366",
                display: "inline-block",
                animation: "crmpulse 1.5s ease-in-out infinite",
              }}
            />
            Lead · 1.8s
          </div>
        </div>
      </div>
    </div>
  );
};

const LumenCapacidades = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { isDark } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();
  const isCompact = isMobile || isTablet;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  const textMain = isDark ? "#FFFFFF" : "#0D0D1A";
  const text = isDark ? "rgba(255,255,255,0.78)" : "rgba(13,13,26,0.87)";
  const textFaint = isDark ? "rgba(255,255,255,0.60)" : "rgba(13,13,26,0.68)";
  const cardBg = isDark
    ? "linear-gradient(135deg, rgba(13,13,26,0.72) 0%, rgba(8,8,18,0.78) 100%)"
    : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,247,255,0.98) 100%)";
  const cardBorder = isDark ? "rgba(142,0,255,0.22)" : "rgba(45,0,255,0.15)";
  const cardShadow = isDark
    ? "0 0 0 1px rgba(45,0,255,0.08), 0 40px 100px rgba(0,0,0,0.5)"
    : "0 0 0 1px rgba(45,0,255,0.06), 0 20px 60px rgba(45,0,255,0.06)";
  const topBarBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(45,0,255,0.03)";
  const topBarBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(45,0,255,0.1)";
  const colDivider = isDark ? "rgba(255,255,255,0.05)" : "rgba(45,0,255,0.08)";
  const smallCardBg = isDark ? "rgba(13,13,26,0.55)" : "rgba(255,255,255,0.95)";
  const smallCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(45,0,255,0.1)";
  const badgeBg = isDark ? "rgba(142,0,255,0.1)" : "rgba(142,0,255,0.07)";
  const badgeBorder = isDark ? "rgba(142,0,255,0.3)" : "rgba(142,0,255,0.25)";
  const badgeText = isDark ? "rgba(255,255,255,0.8)" : "rgba(13,13,26,0.7)";
  const statusBadgeBg = isDark ? "rgba(45,0,255,0.1)" : "rgba(45,0,255,0.07)";
  const statusBadgeBorder = isDark ? "rgba(45,0,255,0.25)" : "rgba(45,0,255,0.2)";
  const timeBadgeBg = isDark ? "rgba(45,0,255,0.1)" : "rgba(45,0,255,0.07)";
  const comingSoonBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(45,0,255,0.06)";
  const comingSoonText = isDark ? "rgba(255,255,255,0.3)" : "rgba(45,0,255,0.5)";
  const px = isMobile ? "16px" : isTablet ? "32px" : "64px";

  const steps = [
    {
      num: 1,
      label: "ENTRADA",
      title: "LLEGA",
      desc: "Recibe mensajes de todos tus canales.",
      color: "#2D00FF",
      bgColor: "rgba(45,0,255,0.06)",
      borderColor: "rgba(45,0,255,0.25)",
      icon: "M20 12L4 12M20 12L15 7M20 12L15 17",
    },
    {
      num: 2,
      label: "PROC.",
      title: "ENTIENDE",
      desc: "La IA identifica intención: compra, soporte o consulta.",
      color: "#6B00E0",
      bgColor: "rgba(107,0,224,0.06)",
      borderColor: "rgba(107,0,224,0.25)",
      icon: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 3v2M12 19v2M3 12h2M19 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42",
    },
    {
      num: 3,
      label: "SALIDA",
      title: "RESPONDE Y REGISTRA",
      desc: "Respuesta personalizada + lead en CRM.",
      color: "#8E00FF",
      bgColor: "rgba(142,0,255,0.06)",
      borderColor: "rgba(142,0,255,0.25)",
      icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="capacidades"
      style={{
        padding: `${isMobile ? "40px" : "80px"} ${px}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "600px",
          height: "600px",
          background: isDark
            ? "radial-gradient(ellipse, rgba(45,0,255,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(45,0,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "500px",
          height: "500px",
          background: isDark
            ? "radial-gradient(ellipse, rgba(142,0,255,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(142,0,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "24px" : "40px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: badgeBg,
              border: `1px solid ${badgeBorder}`,
              borderRadius: "100px",
              padding: "7px 18px",
              marginBottom: "20px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="#8E00FF" />
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="#2D00FF" />
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="#2D00FF" />
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="#8E00FF" />
            </svg>
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: badgeText,
                letterSpacing: "0.05em",
              }}
            >
              CAPACIDADES CRÍTICAS
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? "28px" : "clamp(32px, 4vw, 48px)",
              color: textMain,
              margin: "0 0 12px",
              lineHeight: 1.15,
            }}
          >
            Así funciona LUMEN en la vida real
          </h2>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "15px" : "18px",
              color: textFaint,
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {isMobile
              ? "LUMEN centraliza, responde al instante y no pierde ningún lead."
              : "Un mensaje llega por WhatsApp, Instagram o Web. LUMEN lo entiende, responde y registra el contacto en tu CRM. Todo en menos de 2 segundos."}
          </p>
        </div>

        <div
          style={{
            borderRadius: isMobile ? "18px" : "28px",
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            overflow: "hidden",
            boxShadow: cardShadow,
            backdropFilter: "blur(24px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          <div
            style={{
              padding: isMobile ? "14px 20px" : "18px 32px",
              borderBottom: `1px solid ${topBarBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: topBarBg,
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {[
                { label: "WA", color: "#25D366", bg: "rgba(37,211,102,0.12)" },
                { label: "IG", color: "#E1306C", bg: "rgba(225,48,108,0.12)" },
                { label: "WEB", color: "#2D00FF", bg: "rgba(45,0,255,0.12)" },
              ].map((channel) => (
                <span
                  key={channel.label}
                  style={{
                    background: channel.bg,
                    border: `1px solid ${channel.color}40`,
                    borderRadius: "6px",
                    padding: "4px 10px",
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    color: channel.color,
                    letterSpacing: "0.05em",
                  }}
                >
                  {channel.label}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: statusBadgeBg,
                border: `1px solid ${statusBadgeBorder}`,
                borderRadius: "8px",
                padding: "6px 12px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#25D366",
                  display: "inline-block",
                  boxShadow: "0 0 6px #25D366",
                  animation: "crmpulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: textFaint,
                }}
              >
                Motor activo · Procesando
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
              minHeight: isCompact ? "auto" : "460px",
            }}
          >
            <div
              style={{
                position: "relative",
                borderRight: isCompact ? "none" : `1px solid ${colDivider}`,
                borderBottom: isCompact ? `1px solid ${colDivider}` : "none",
                padding: isMobile ? "20px 16px" : "24px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <LumenOmnichannelMockup />
            </div>

            <div
              style={{
                padding: isMobile ? "20px 16px" : isTablet ? "28px 24px" : "40px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: isMobile ? "12px" : "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "10px",
                  color: "#8E00FF",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Blueprint #01 — El Conciliador Omnicanal
              </div>

              <h3
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 800,
                  fontSize: isMobile ? "18px" : "24px",
                  color: textMain,
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Un solo cerebro{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  para todos tus canales.
                </span>
              </h3>

              <p
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 400,
                  fontSize: isMobile ? "12px" : "14px",
                  color: text,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {isMobile
                  ? "LUMEN centraliza, responde y registra todo al instante."
                  : "No importa si escriben por WhatsApp a las 3am o por Instagram un domingo. LUMEN centraliza todo, responde al instante y no pierde ningún lead."}
              </p>

              <div
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(45,0,255,0.08) 0%, rgba(142,0,255,0.05) 100%)"
                    : "linear-gradient(135deg, rgba(45,0,255,0.04) 0%, rgba(142,0,255,0.03) 100%)",
                  border: `1.5px solid ${isDark ? "rgba(142,0,255,0.2)" : "rgba(45,0,255,0.12)"}`,
                  borderRadius: isMobile ? "16px" : "20px",
                  padding: isMobile ? "20px 16px" : "24px 20px",
                  marginTop: isMobile ? "8px" : "12px",
                  boxShadow: isDark
                    ? "0 8px 32px rgba(45,0,255,0.12), 0 0 0 1px rgba(142,0,255,0.06) inset"
                    : "0 4px 24px rgba(45,0,255,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isMobile ? "16px" : "20px",
                    paddingBottom: isMobile ? "12px" : "14px",
                    borderBottom: `1px solid ${isDark ? "rgba(142,0,255,0.15)" : "rgba(45,0,255,0.10)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(45,0,255,0.4)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M3 10h14M10 3v14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Urbanist', sans-serif",
                          fontWeight: 800,
                          fontSize: isMobile ? "13px" : "15px",
                          color: textMain,
                        }}
                      >
                        Flujo de Procesamiento
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: isMobile ? "10px" : "11px",
                      color: "#8E00FF",
                      background: isDark ? "rgba(142,0,255,0.15)" : "rgba(142,0,255,0.10)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${isDark ? "rgba(142,0,255,0.3)" : "rgba(142,0,255,0.2)"}`,
                    }}
                  >
                    {"< 2s"}
                  </div>
                </div>

                {!isMobile ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto 1fr auto 1fr",
                      alignItems: "start",
                      gap: "12px",
                    }}
                  >
                    {steps.map((step, index) => (
                      <Fragment key={step.num}>
                        <div
                          style={{
                            background: isDark ? step.bgColor : step.bgColor.replace("0.06", "0.03"),
                            border: `1.5px solid ${isDark ? step.borderColor : step.borderColor.replace("0.25", "0.15")}`,
                            borderRadius: "14px",
                            padding: "16px",
                            transition: "all 0.3s ease",
                            cursor: "default",
                            minHeight: "140px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.transform = "translateY(-4px)";
                            event.currentTarget.style.boxShadow = isDark
                              ? `0 8px 24px ${step.color}40`
                              : `0 4px 16px ${step.color}26`;
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.transform = "translateY(0)";
                            event.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${step.color}, ${step.color}DD)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: `0 4px 16px ${step.color}66`,
                                position: "relative",
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d={step.icon} />
                              </svg>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-3px",
                                  right: "-3px",
                                  width: "14px",
                                  height: "14px",
                                  borderRadius: "50%",
                                  background: step.color,
                                  border: "2px solid white",
                                  fontSize: "8px",
                                  fontWeight: 800,
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "'Urbanist', sans-serif",
                                }}
                              >
                                {step.num}
                              </div>
                            </div>
                            <div
                              style={{
                                fontFamily: "'Urbanist', sans-serif",
                                fontWeight: 800,
                                fontSize: "10px",
                                color: step.color,
                                letterSpacing: "0.08em",
                                background: isDark ? `${step.color}26` : `${step.color}1A`,
                                padding: "3px 8px",
                                borderRadius: "5px",
                                border: `1px solid ${step.color}4D`,
                              }}
                            >
                              {step.label}
                            </div>
                          </div>
                          <div
                            style={{
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 700,
                              fontSize: "14px",
                              color: textMain,
                              marginBottom: "6px",
                            }}
                          >
                            {step.title}
                          </div>
                          <p
                            style={{
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 400,
                              fontSize: "12px",
                              color: text,
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            {step.desc}
                          </p>
                        </div>
                        {index < 2 ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "50px" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M5 12h14m-6-6l6 6-6 6"
                                stroke={isDark ? "rgba(142,0,255,0.5)" : "rgba(45,0,255,0.4)"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        background: isDark
                          ? steps[activeStep].bgColor
                          : steps[activeStep].bgColor.replace("0.06", "0.03"),
                        border: `1.5px solid ${isDark ? steps[activeStep].borderColor : steps[activeStep].borderColor.replace("0.25", "0.15")}`,
                        borderRadius: "14px",
                        padding: "20px",
                        minHeight: "160px",
                        transition: "all 0.5s ease",
                      }}
                    >
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: `linear-gradient(135deg, ${steps[activeStep].color}, ${steps[activeStep].color}DD)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: `0 6px 20px ${steps[activeStep].color}66`,
                            position: "relative",
                          }}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d={steps[activeStep].icon} />
                          </svg>
                          <div
                            style={{
                              position: "absolute",
                              top: "-4px",
                              right: "-4px",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background: steps[activeStep].color,
                              border: "2px solid white",
                              fontSize: "8px",
                              fontWeight: 800,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'Urbanist', sans-serif",
                            }}
                          >
                            {steps[activeStep].num}
                          </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span
                              style={{
                                fontFamily: "'Urbanist', sans-serif",
                                fontWeight: 800,
                                fontSize: "10px",
                                color: steps[activeStep].color,
                                letterSpacing: "0.08em",
                                background: isDark ? `${steps[activeStep].color}26` : `${steps[activeStep].color}1A`,
                                padding: "4px 10px",
                                borderRadius: "5px",
                                border: `1px solid ${steps[activeStep].color}4D`,
                              }}
                            >
                              {steps[activeStep].label}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 700,
                              fontSize: "15px",
                              color: textMain,
                              marginBottom: "6px",
                            }}
                          >
                            {steps[activeStep].title}
                          </div>
                          <p
                            style={{
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 400,
                              fontSize: "12px",
                              color: text,
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            {steps[activeStep].desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                      {steps.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveStep(index)}
                          style={{
                            width: activeStep === index ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "4px",
                            background:
                              activeStep === index
                                ? "linear-gradient(135deg, #2D00FF, #8E00FF)"
                                : isDark
                                  ? "rgba(255,255,255,0.2)"
                                  : "rgba(45,0,255,0.2)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: activeStep === index ? "0 2px 8px rgba(45,0,255,0.4)" : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: timeBadgeBg,
                  border: `1px solid ${statusBadgeBorder}`,
                  borderRadius: "10px",
                  padding: isMobile ? "10px 14px" : "10px 16px",
                  alignSelf: "flex-start",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 12px rgba(45,0,255,0.4)",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M12 2L4 11H9.5L8 19L17 10H11.5L13 2Z" fill="white" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 800,
                      fontSize: isMobile ? "16px" : "18px",
                      color: textMain,
                      lineHeight: 1,
                    }}
                  >
                    {"< 2 segundos"}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 500,
                      fontSize: "10px",
                      color: text,
                      marginTop: "2px",
                    }}
                  >
                    Tiempo de respuesta
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isCompact ? "1fr" : "repeat(2, 1fr)",
            gap: "12px",
            marginTop: "12px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
          }}
        >
          {[
            {
              num: "#02",
              title: "Sabe quién va a comprar",
              color: "#2D00FF",
              desc: "LUMEN analiza cada conversación y te dice qué leads tienen más probabilidad de cerrar. Enfoca tu equipo donde importa.",
            },
            {
              num: "#03",
              title: "Si la IA no puede, te pasa la llamada",
              color: "#8E00FF",
              desc: "Cuando una conversación necesita toque humano, LUMEN lo detecta y transfiere al agente correcto al instante.",
            },
          ].map((card) => (
            <div
              key={card.num}
              style={{
                borderRadius: "20px",
                background: smallCardBg,
                border: `1px solid ${smallCardBorder}`,
                padding: isMobile ? "24px 20px 60px 20px" : "32px 36px 70px 36px",
                backdropFilter: "blur(16px)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 800,
                  fontSize: "11px",
                  color: card.color,
                  letterSpacing: "0.08em",
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}30`,
                  borderRadius: "6px",
                  padding: "4px 8px",
                  alignSelf: "flex-start",
                }}
              >
                {card.num}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? "19px" : "21px",
                    color: textMain,
                    marginBottom: "12px",
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 400,
                    fontSize: isMobile ? "14px" : "15px",
                    color: text,
                    margin: 0,
                    lineHeight: 1.7,
                    maxWidth: "95%",
                  }}
                >
                  {card.desc}
                </p>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? "20px" : "28px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: comingSoonBg,
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: comingSoonText,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                Próximamente
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
    <circle cx="7.5" cy="7.5" r="7" fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
    <path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    style={{ transition: "transform 0.3s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
  >
    <path d="M4.5 7L9 11.5L13.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="6" y="2" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 9c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="15" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6.5" y1="17" x2="11.5" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChannelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="2.5" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="15.5" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="2.5" cy="13" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="15.5" cy="13" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6.5 7.5L4.2 6.2M11.5 7.5L13.8 6.2M6.5 10.5L4.2 11.8M11.5 10.5L13.8 11.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const DatabaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <ellipse cx="9" cy="5" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 5v4c0 1.38 2.686 2.5 6 2.5S15 10.38 15 9V5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 9v4c0 1.38 2.686 2.5 6 2.5S15 14.38 15 13V9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 3.5A1.5 1.5 0 013.5 2h11A1.5 1.5 0 0116 3.5v8A1.5 1.5 0 0114.5 13H10l-3.5 3V13H3.5A1.5 1.5 0 012 11.5v-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const BrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 3c-2.2 0-4 1.567-4 3.5 0 .483.1.942.277 1.358C4.504 8.25 3.5 9.524 3.5 11c0 1.657 1.343 3 3 3 .266 0 .524-.034.77-.097C7.665 14.54 8.3 15 9 15s1.335-.46 1.73-1.097c.246.063.504.097.77.097 1.657 0 3-1.343 3-3 0-1.476-1.004-2.75-1.777-3.142C12.9 7.442 13 6.983 13 6.5 13 4.567 11.2 3 9 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9 3v2M9 13v2M5.5 8H7M11 8h1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2s4 2.5 4 8l-4 5-4-5c0-5.5 4-8 4-8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="9" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6 13.5L4 16M12 13.5L14 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const plans = [
  {
    id: "spark",
    name: "Spark",
    price: "$349",
    period: "/ mes",
    label: null,
    desc: "Para empezar con IA conversacional sin complejidad.",
    color: "#2D00FF",
    highlighted: false,
    features: [
      "2,000 conversaciones IA / mes",
      "WhatsApp + 1 canal",
      "3 agentes humanos (Chatwoot)",
      "1 asistente IA",
      "1 base RAG (20 docs)",
      "Modelo GPT-4o-mini",
      "Soporte por email",
    ],
    cta: "Comenzar",
  },
  {
    id: "core",
    name: "Core",
    price: "$749",
    period: "/ mes",
    label: null,
    desc: "Todos los canales de mensajería en un solo motor.",
    color: "#5B00E8",
    highlighted: false,
    features: [
      "7,000 conversaciones IA / mes",
      "Todos los canales de mensajería",
      "8 agentes humanos (Chatwoot)",
      "3 asistentes IA",
      "3 bases RAG (50 docs c/u)",
      "Modelo GPT-4o-mini",
      "Soporte email + chat",
    ],
    cta: "Comenzar",
  },
  {
    id: "scale",
    name: "Scale",
    price: "$1,499",
    period: "/ mes",
    label: "Recomendado",
    desc: "Mensajería + voz con IA. Sin límites de asistentes.",
    color: "#8E00FF",
    highlighted: true,
    features: [
      "25,000 conversaciones IA / mes",
      "Todos los canales + Voz",
      "20 agentes humanos (Chatwoot)",
      "Asistentes IA ilimitados",
      "Bases RAG ilimitadas",
      "GPT-4o-mini / GPT-4o",
      "Voice Bridge: 600 min incluidos",
      "Chat prioritario",
    ],
    cta: "Comenzar",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Desde $3,000",
    period: "/ mes",
    label: null,
    desc: "Infraestructura dedicada, Multi-LLM y soporte directo.",
    color: "#C400FF",
    highlighted: false,
    features: [
      "Conversaciones ilimitadas",
      "Todos los canales incluidos",
      "Agentes humanos ilimitados",
      "Asistentes IA ilimitados",
      "Bases RAG ilimitadas",
      "Multi-LLM (OpenAI · Anthropic · Google)",
      "Voice Bridge incluido",
      "Instancia Chatwoot dedicada",
      "Soporte dedicado",
    ],
    cta: "Hablar con ventas",
  },
];

const addons = [
  { Icon: MicIcon, name: "Voice Bridge", sub: "Spark / Core", price: "$149/mes", detail: "+ $0.50/min", color: "#2D00FF" },
  { Icon: ChannelIcon, name: "Canal adicional", sub: "Solo plan Spark", price: "$39/mes", detail: "por canal extra", color: "#5B00E8" },
  { Icon: DatabaseIcon, name: "Base RAG adicional", sub: "Docs propios", price: "$69/mes", detail: "por base", color: "#8E00FF" },
  { Icon: ChatIcon, name: "Pack conversaciones", sub: "Prepago flexible", price: "$49", detail: "/ 1,000 conv", color: "#A400FF" },
  { Icon: BrainIcon, name: "GPT-4o Premium", sub: "Razonamiento avanzado", price: "+$0.04", detail: "/ conversación", color: "#C400FF" },
  { Icon: RocketIcon, name: "Onboarding Prometheus", sub: "Configuración asistida", price: "$1,500", detail: "fee único", color: "#2D00FF" },
];

const MobilePlanCard = ({
  plan,
  isOpen,
  onToggle,
  isDark,
  textMain,
  text,
  textFaint,
  cardBg,
  cardBorder,
}: {
  plan: (typeof plans)[number];
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
  textMain: string;
  text: string;
  textFaint: string;
  cardBg: string;
  cardBorder: string;
}) => (
  <div
    style={{
      borderRadius: "20px",
      background: plan.highlighted
        ? isDark
          ? "linear-gradient(160deg, rgba(45,0,255,0.2) 0%, rgba(142,0,255,0.15) 100%)"
          : "linear-gradient(160deg, rgba(45,0,255,0.08) 0%, rgba(142,0,255,0.06) 100%)"
        : cardBg,
      border: plan.highlighted ? "1.5px solid rgba(142,0,255,0.5)" : `1px solid ${cardBorder}`,
      overflow: "hidden",
      boxShadow: plan.highlighted
        ? isDark
          ? "0 0 40px rgba(142,0,255,0.15)"
          : "0 8px 40px rgba(45,0,255,0.1)"
        : "none",
      backdropFilter: "blur(16px)",
      position: "relative",
      transition: "box-shadow 0.3s ease",
    }}
  >
    {plan.label ? (
      <div
        style={{
          background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
          padding: "6px 0",
          textAlign: "center",
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          color: "white",
          letterSpacing: "0.08em",
        }}
      >
        RECOMENDADO
      </div>
    ) : null}

    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            flexShrink: 0,
            background: `${plan.color}18`,
            border: `1.5px solid ${plan.color}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: plan.color,
              boxShadow: `0 0 8px ${plan.color}80`,
            }}
          />
        </div>
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: "11px",
              color: plan.color,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "2px",
            }}
          >
            {plan.name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 900,
                fontSize: plan.id === "enterprise" ? "20px" : "24px",
                color: textMain,
              }}
            >
              {plan.price}
            </span>
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                color: textFaint,
              }}
            >
              {plan.period}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(13,13,26,0.4)", flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(13,13,26,0.35)",
          }}
        >
          {isOpen ? "Ocultar" : "Ver plan"}
        </span>
        <ChevronIcon open={isOpen} />
      </div>
    </button>

    <div
      style={{
        maxHeight: isOpen ? "800px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            height: "1px",
            marginBottom: "16px",
            background: isDark
              ? "linear-gradient(to right, rgba(255,255,255,0.08), transparent)"
              : "linear-gradient(to right, rgba(45,0,255,0.12), transparent)",
          }}
        />

        <p
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            color: text,
            lineHeight: 1.55,
            margin: "0 0 16px",
          }}
        >
          {plan.desc}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {plan.features.map((feature) => (
            <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckIcon color={plan.color} />
              <span
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: text,
                  lineHeight: 1.45,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        <a href="#contacto-general" style={{ textDecoration: "none", width: "100%" }}>
          <button
            type="button"
            onClick={() => trackEvent("cta_click", { label: `pricing_${plan.id}` })}
            style={{
              width: "100%",
              background: plan.highlighted ? "linear-gradient(135deg, #2D00FF, #8E00FF)" : "transparent",
              color: plan.highlighted ? "white" : plan.color,
              border: plan.highlighted ? "none" : `1.5px solid ${plan.color}60`,
              borderRadius: "12px",
              padding: "14px 20px",
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: plan.highlighted ? "0 0 28px rgba(142,0,255,0.4)" : "none",
            }}
          >
            {plan.cta} →
          </button>
        </a>
      </div>
    </div>
  </div>
);

const MobileAddonItem = ({
  addon,
  isDark,
  textMain,
  textFaint,
}: {
  addon: (typeof addons)[number];
  isDark: boolean;
  textMain: string;
  textFaint: string;
}) => {
  const Icon = addon.Icon;

  return (
    <div
      style={{
        borderRadius: "14px",
        background: isDark ? "rgba(13,13,26,0.6)" : "rgba(255,255,255,0.95)",
        border: isDark ? `1px solid ${addon.color}25` : `1px solid ${addon.color}20`,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "11px",
          flexShrink: 0,
          background: isDark ? `${addon.color}20` : `${addon.color}10`,
          border: `1px solid ${addon.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: addon.color,
          boxShadow: isDark ? `0 0 12px ${addon.color}20` : "none",
        }}
      >
        <Icon />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            fontSize: "13px",
            color: textMain,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {addon.name}
        </div>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 400,
            fontSize: "11px",
            color: textFaint,
            marginTop: "1px",
          }}
        >
          {addon.sub}
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 800,
            fontSize: "15px",
            backgroundImage: `linear-gradient(135deg, ${addon.color}, #8E00FF)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {addon.price}
        </div>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 400,
            fontSize: "10px",
            color: textFaint,
          }}
        >
          {addon.detail}
        </div>
      </div>
    </div>
  );
};

const LumenPricing = () => {
  const { isDark } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string>("scale");
  const [addonsOpen, setAddonsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const text = isDark ? "rgba(255,255,255,0.78)" : "rgba(13,13,26,0.87)";
  const textFaint = isDark ? "rgba(255,255,255,0.42)" : "rgba(13,13,26,0.57)";
  const textMain = isDark ? "#FFFFFF" : "#0D0D1A";
  const cardBg = isDark ? "rgba(13,13,26,0.6)" : "rgba(255,255,255,0.95)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(45,0,255,0.12)";
  const planCols = isTablet ? "1fr 1fr" : "repeat(4, 1fr)";
  const addonCols = isTablet ? "1fr 1fr" : "repeat(3, 1fr)";
  const px = isMobile ? "16px" : isTablet ? "32px" : "64px";

  return (
    <section
      ref={sectionRef}
      id="precios"
      style={{
        padding: `${isMobile ? "40px" : "80px"} ${px}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "500px",
          background: isDark
            ? "radial-gradient(ellipse, rgba(45,0,255,0.1) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(45,0,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "24px" : "40px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: isDark ? "rgba(45,0,255,0.1)" : "rgba(45,0,255,0.07)",
              border: "1px solid rgba(45,0,255,0.3)",
              borderRadius: "100px",
              padding: "7px 18px",
              marginBottom: "14px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L10 8.5L11.5 13L7 10.5L2.5 13L4 8.5L0.5 5.5H5L7 1Z" fill="#2D00FF" />
            </svg>
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: isDark ? "rgba(255,255,255,0.96)" : "#2D00FF",
                letterSpacing: "0.05em",
              }}
            >
              PLANES Y PRECIOS
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? "26px" : "clamp(32px, 4vw, 52px)",
              color: textMain,
              margin: "0 0 10px",
              lineHeight: 1.15,
            }}
          >
            Empieza en 1–2 semanas.{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Escala sin límites.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "14px" : "17px",
              color: text,
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Facturación mensual · Descuento 15% anual · Precios en USD
          </p>
        </div>

        {isMobile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "24px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
            }}
          >
            {plans.map((plan) => (
              <MobilePlanCard
                key={plan.id}
                plan={plan}
                isOpen={expandedPlan === plan.id}
                onToggle={() => setExpandedPlan(expandedPlan === plan.id ? "" : plan.id)}
                isDark={isDark}
                textMain={textMain}
                text={text}
                textFaint={textFaint}
                cardBg={cardBg}
                cardBorder={cardBorder}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: planCols,
              gap: "16px",
              marginBottom: "28px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
            }}
          >
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  borderRadius: "24px",
                  background: plan.highlighted
                    ? isDark
                      ? "linear-gradient(160deg, rgba(45,0,255,0.18) 0%, rgba(142,0,255,0.14) 100%)"
                      : "linear-gradient(160deg, rgba(45,0,255,0.07) 0%, rgba(142,0,255,0.05) 100%)"
                    : cardBg,
                  border: plan.highlighted ? "1.5px solid rgba(142,0,255,0.5)" : `1px solid ${cardBorder}`,
                  padding: "32px 26px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: plan.highlighted
                    ? isDark
                      ? "0 0 0 1px rgba(142,0,255,0.2), 0 30px 80px rgba(142,0,255,0.12)"
                      : "0 0 0 1px rgba(142,0,255,0.15), 0 20px 60px rgba(45,0,255,0.08)"
                    : "none",
                  backdropFilter: "blur(16px)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {plan.label ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                      borderRadius: "100px",
                      padding: "5px 14px",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      color: "white",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                      boxShadow: "0 0 20px rgba(142,0,255,0.5)",
                    }}
                  >
                    RECOMENDADO
                  </div>
                ) : null}
                <div
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 800,
                    fontSize: "12px",
                    color: plan.color,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 900,
                      fontSize: plan.id === "enterprise" ? "24px" : "32px",
                      color: textMain,
                      lineHeight: 1.1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      color: textFaint,
                    }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: text,
                    lineHeight: 1.55,
                    margin: "0 0 18px",
                  }}
                >
                  {plan.desc}
                </p>
                <div
                  style={{
                    height: "1px",
                    marginBottom: "16px",
                    background: isDark
                      ? "linear-gradient(to right, rgba(255,255,255,0.08), transparent)"
                      : "linear-gradient(to right, rgba(45,0,255,0.12), transparent)",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
                  {plan.features.map((feature) => (
                    <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <CheckIcon color={plan.color} />
                      <span
                        style={{
                          fontFamily: "'Urbanist', sans-serif",
                          fontWeight: 400,
                          fontSize: "13px",
                          color: text,
                          lineHeight: 1.45,
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <a href="#contacto-general" style={{ textDecoration: "none", marginTop: "22px", display: "block" }}>
                  <button
                    type="button"
                    onClick={() => trackEvent("cta_click", { label: `pricing_${plan.id}` })}
                    style={{
                      width: "100%",
                      background: plan.highlighted ? "linear-gradient(135deg, #2D00FF, #8E00FF)" : "transparent",
                      color: plan.highlighted ? "white" : plan.color,
                      border: plan.highlighted ? "none" : `1.5px solid ${plan.color}55`,
                      borderRadius: "12px",
                      padding: "12px 20px",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow: plan.highlighted ? "0 0 24px rgba(142,0,255,0.35)" : "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(event) => {
                      if (!plan.highlighted) {
                        event.currentTarget.style.background = `${plan.color}12`;
                      } else {
                        event.currentTarget.style.boxShadow = "0 0 36px rgba(142,0,255,0.55)";
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (!plan.highlighted) {
                        event.currentTarget.style.background = "transparent";
                      } else {
                        event.currentTarget.style.boxShadow = "0 0 24px rgba(142,0,255,0.35)";
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </a>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
          }}
        >
          {isMobile ? (
            <div
              style={{
                borderRadius: "18px",
                background: isDark ? "rgba(13,13,26,0.5)" : "rgba(255,255,255,0.9)",
                border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(45,0,255,0.1)",
                overflow: "hidden",
                backdropFilter: "blur(16px)",
              }}
            >
              <button
                type="button"
                onClick={() => setAddonsOpen((prev) => !prev)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                      borderRadius: "9px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: textMain,
                    }}
                  >
                    Add-ons disponibles
                  </span>
                  <span
                    style={{
                      background: isDark ? "rgba(45,0,255,0.2)" : "rgba(45,0,255,0.1)",
                      color: "#2D00FF",
                      borderRadius: "100px",
                      padding: "2px 8px",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                    }}
                  >
                    {addons.length}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: textFaint }}>
                  <span
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: isDark ? "rgba(255,255,255,0.4)" : "rgba(13,13,26,0.35)",
                    }}
                  >
                    {addonsOpen ? "Cerrar" : "Ver todos"}
                  </span>
                  <ChevronIcon open={addonsOpen} />
                </div>
              </button>

              <div
                style={{
                  maxHeight: addonsOpen ? "600px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {addons.map((addon) => (
                    <MobileAddonItem
                      key={addon.name}
                      addon={addon}
                      isDark={isDark}
                      textMain={textMain}
                      textFaint={textFaint}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: textMain,
                  }}
                >
                  Add-ons disponibles
                </span>
                <span
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: textFaint,
                  }}
                >
                  — Amplía cualquier plan con lo que necesitas
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: addonCols, gap: "12px" }}>
                {addons.map((addon) => {
                  const Icon = addon.Icon;

                  return (
                    <div
                      key={addon.name}
                      style={{
                        borderRadius: "16px",
                        background: isDark ? "rgba(13,13,26,0.55)" : "rgba(255,255,255,0.95)",
                        border: isDark ? `1px solid ${addon.color}22` : `1px solid ${addon.color}20`,
                        padding: "18px 20px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                        backdropFilter: "blur(16px)",
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      }}
                      onMouseEnter={(event) => {
                        const element = event.currentTarget;
                        element.style.transform = "translateY(-3px)";
                        element.style.borderColor = `${addon.color}50`;
                        element.style.boxShadow = isDark
                          ? `0 12px 36px rgba(0,0,0,0.3), 0 0 0 1px ${addon.color}30`
                          : `0 8px 28px rgba(45,0,255,0.09), 0 0 0 1px ${addon.color}25`;
                      }}
                      onMouseLeave={(event) => {
                        const element = event.currentTarget;
                        element.style.transform = "translateY(0)";
                        element.style.borderColor = isDark ? `${addon.color}22` : `${addon.color}20`;
                        element.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "90px",
                          height: "100%",
                          background: `linear-gradient(135deg, ${addon.color}18, transparent)`,
                          opacity: isDark ? 1 : 0.5,
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          background: isDark ? `${addon.color}20` : `${addon.color}10`,
                          border: `1px solid ${addon.color}35`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: addon.color,
                          flexShrink: 0,
                          position: "relative",
                          zIndex: 1,
                          boxShadow: isDark ? `0 0 14px ${addon.color}25` : "none",
                        }}
                      >
                        <Icon />
                      </div>
                      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                        <div
                          style={{
                            fontFamily: "'Urbanist', sans-serif",
                            fontWeight: 700,
                            fontSize: "14px",
                            color: textMain,
                            marginBottom: "2px",
                          }}
                        >
                          {addon.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Urbanist', sans-serif",
                            fontWeight: 400,
                            fontSize: "12px",
                            color: textFaint,
                            marginBottom: "8px",
                          }}
                        >
                          {addon.sub}
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                          <span
                            style={{
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 800,
                              fontSize: "18px",
                              backgroundImage: `linear-gradient(135deg, ${addon.color}, #8E00FF)`,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {addon.price}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 400,
                              fontSize: "11px",
                              color: textFaint,
                            }}
                          >
                            {addon.detail}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <p
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: textFaint,
            textAlign: "center",
            marginTop: "16px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.45s",
          }}
        >
          Precios en USD · Facturación mensual · Contrato anual con 15% de descuento · Vigentes a marzo 2026
        </p>
      </div>
    </section>
  );
};

const YesIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="9" fill="rgba(45,0,255,0.15)" stroke="#2D00FF" strokeOpacity="0.5" strokeWidth="1" />
    <path d="M6 10L8.5 12.5L14 7.5" stroke="#2D00FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NoIcon = ({ isDark, size = 20 }: { isDark: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle
      cx="10"
      cy="10"
      r="9"
      fill={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}
      stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}
      strokeWidth="1"
    />
    <path
      d="M13 7L7 13M7 7L13 13"
      stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const comparisons = [
  { dimension: "Integración con sistemas propios", lumen: "Nativa vía Flamerly Workflows", others: "Solo Zapier / Make" },
  { dimension: "Voz en tiempo real", lumen: "Incluida en Scale y Enterprise", others: "Raro o inexistente" },
  { dimension: "Multi-LLM", lumen: "OpenAI · Anthropic · Google", others: "Solo OpenAI" },
  { dimension: "Privacidad de datos", lumen: "Datos en tu propio stack", others: "Datos en servidores del proveedor" },
  { dimension: "Soporte regional LatAm", lumen: "Equipo dedicado en Guatemala", others: "Soporte global genérico" },
];

const useCases = [
  { icon: "🏦", title: "Seguros y Banca", desc: "Consulta de póliza y estado de reclamo en WhatsApp, sin esperar en línea.", color: "#2D00FF" },
  { icon: "📅", title: "Agendamiento de Citas", desc: "Disponibilidad y confirmación en tiempo real vía API. Sin intermediarios.", color: "#5B00E8" },
  { icon: "🛒", title: "E-commerce", desc: "Búsqueda de productos, estado de pedido y seguimiento postventa.", color: "#8E00FF" },
  { icon: "📞", title: "Call Center con IA", desc: "Voice Bridge + resumen automático post-llamada + handoff a agente humano.", color: "#A400FF" },
  { icon: "🎯", title: "Captura de Leads", desc: "Registro automático en CRM vía workflow. Ningún lead sin capturar.", color: "#C400FF" },
];

const LumenComparativa = () => {
  const { isDark } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();
  const isCompact = isMobile || isTablet;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeComparisonIndex, setActiveComparisonIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setActiveComparisonIndex((prev) => (prev + 1) % comparisons.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const textMain = isDark ? "#FFFFFF" : "#0D0D1A";
  const text = isDark ? "rgba(255,255,255,0.72)" : "rgba(13,13,26,0.87)";
  const textFaint = isDark ? "rgba(255,255,255,0.42)" : "rgba(13,13,26,0.57)";
  const rowEvenBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(45,0,255,0.025)";
  const tableBg = isDark ? "rgba(13,13,26,0.55)" : "rgba(255,255,255,0.95)";
  const tableBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(45,0,255,0.1)";
  const thBg = isDark ? "rgba(45,0,255,0.12)" : "rgba(45,0,255,0.06)";
  const cardBg = isDark ? "rgba(13,13,26,0.55)" : "rgba(255,255,255,0.95)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(45,0,255,0.12)";
  const px = isMobile ? "16px" : isTablet ? "32px" : "64px";

  return (
    <section
      ref={sectionRef}
      id="por-que-lumen"
      style={{
        padding: `${isMobile ? "40px" : "80px"} ${px}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: 0,
          width: "600px",
          height: "600px",
          background: isDark
            ? "radial-gradient(ellipse, rgba(142,0,255,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(142,0,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "500px",
          height: "500px",
          background: isDark
            ? "radial-gradient(ellipse, rgba(45,0,255,0.07) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(45,0,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "24px" : "44px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: isDark ? "rgba(142,0,255,0.1)" : "rgba(142,0,255,0.07)",
              border: "1px solid rgba(142,0,255,0.3)",
              borderRadius: "100px",
              padding: "7px 18px",
              marginBottom: "14px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="none" stroke="#8E00FF" strokeWidth="1.5" />
              <circle cx="7" cy="7" r="2.5" fill="#8E00FF" />
            </svg>
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: isDark ? "rgba(255,255,255,0.8)" : "#8E00FF",
                letterSpacing: "0.05em",
              }}
            >
              POR QUÉ LUMEN
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? "26px" : "clamp(32px, 4vw, 52px)",
              color: textMain,
              margin: "0 0 10px",
              lineHeight: 1.15,
            }}
          >
            Construido para LatAm.{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Diferente por diseño.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "14px" : "18px",
              color: text,
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Las herramientas genéricas no se conectan a tus sistemas reales. LUMEN sí.
          </p>
        </div>

        <div
          style={{
            marginBottom: "20px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {isMobile ? (
            <div>
              <div
                key={activeComparisonIndex}
                style={{
                  borderRadius: "16px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  overflow: "hidden",
                  backdropFilter: "blur(16px)",
                  animation: "fadeInComparison 0.5s ease-out",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    background: thBg,
                    borderBottom: `1px solid ${tableBorder}`,
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: textMain,
                    letterSpacing: "0.02em",
                    minHeight: "52px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {comparisons[activeComparisonIndex].dimension}
                </div>

                <div
                  style={{
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    borderBottom: `1px solid ${tableBorder}`,
                  }}
                >
                  <YesIcon size={20} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        color: "#2D00FF",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      LUMEN
                    </div>
                    <div
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: text,
                        lineHeight: 1.5,
                      }}
                    >
                      {comparisons[activeComparisonIndex].lumen}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  <NoIcon isDark={isDark} size={20} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        color: textFaint,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      Competencia
                    </div>
                    <div
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: textFaint,
                        lineHeight: 1.5,
                      }}
                    >
                      {comparisons[activeComparisonIndex].others}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                {comparisons.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveComparisonIndex(index)}
                    style={{
                      width: activeComparisonIndex === index ? "28px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background:
                        activeComparisonIndex === index
                          ? "linear-gradient(135deg, #2D00FF, #8E00FF)"
                          : isDark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(45,0,255,0.2)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: 0,
                      boxShadow: activeComparisonIndex === index ? "0 2px 12px rgba(45,0,255,0.5)" : "none",
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "12px",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: textFaint,
                }}
              >
                {activeComparisonIndex + 1} / {comparisons.length}
              </div>
            </div>
          ) : (
            <div
              style={{
                borderRadius: "20px",
                background: tableBg,
                border: `1px solid ${tableBorder}`,
                overflow: "hidden",
                backdropFilter: "blur(20px)",
                boxShadow: isDark
                  ? "0 40px 100px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "0 20px 60px rgba(45,0,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.8fr 1.8fr",
                  background: thBg,
                  borderBottom: `1px solid ${tableBorder}`,
                }}
              >
                {["Capacidad", "LUMEN", "ManyChat · Tidio · Intercom"].map((heading, index) => (
                  <div
                    key={heading}
                    style={{
                      padding: "18px 28px",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "12px",
                      color: index === 1 ? "#8E00FF" : isDark ? "rgba(255,255,255,0.5)" : "rgba(13,13,26,0.45)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      borderLeft: index > 0 ? `1px solid ${tableBorder}` : "none",
                    }}
                  >
                    {heading}
                  </div>
                ))}
              </div>
              {comparisons.map((row, index) => (
                <div
                  key={row.dimension}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.8fr 1.8fr",
                    background: index % 2 === 0 ? rowEvenBg : "transparent",
                    borderBottom: index < comparisons.length - 1 ? `1px solid ${tableBorder}` : "none",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 28px",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: textMain,
                    }}
                  >
                    {row.dimension}
                  </div>
                  <div
                    style={{
                      padding: "18px 28px",
                      borderLeft: `1px solid ${tableBorder}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <YesIcon />
                    <span
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 400,
                        fontSize: "13.5px",
                        color: text,
                      }}
                    >
                      {row.lumen}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "18px 28px",
                      borderLeft: `1px solid ${tableBorder}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <NoIcon isDark={isDark} />
                    <span
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 400,
                        fontSize: "13.5px",
                        color: textFaint,
                      }}
                    >
                      {row.others}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isCompact ? "1fr" : "1fr 2fr",
            gap: "16px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
          }}
        >
          <div
            style={{
              borderRadius: "20px",
              background: isDark
                ? "linear-gradient(160deg, rgba(45,0,255,0.18) 0%, rgba(142,0,255,0.12) 100%)"
                : "linear-gradient(160deg, rgba(45,0,255,0.07) 0%, rgba(142,0,255,0.05) 100%)",
              border: "1px solid rgba(142,0,255,0.3)",
              padding: isMobile ? "24px 20px" : "36px 32px",
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              alignItems: isMobile ? "center" : "flex-start",
              gap: isMobile ? "16px" : "20px",
              boxShadow: isDark ? "0 0 0 1px rgba(45,0,255,0.1), 0 20px 60px rgba(45,0,255,0.08)" : "none",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                flexShrink: 0,
                background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(45,0,255,0.45)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
                <path d="M12 7V12L15 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 900,
                    fontSize: isMobile ? "36px" : "52px",
                    lineHeight: 1,
                    backgroundImage: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  1–2
                </span>
                <span
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? "16px" : "20px",
                    color: textMain,
                  }}
                >
                  semanas
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: text,
                  margin: "8px 0 0",
                  lineHeight: 1.55,
                }}
              >
                De firma a asistente funcional. El time-to-live más rápido del mercado.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr",
              gap: "10px",
            }}
          >
            {useCases.map((useCase, index) => (
              <div
                key={useCase.title}
                style={{
                  borderRadius: "14px",
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  padding: isMobile ? "14px" : "18px 20px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  backdropFilter: "blur(16px)",
                  gridColumn: index === 4 ? "1 / -1" : "auto",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-2px)";
                  event.currentTarget.style.boxShadow = isDark
                    ? `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${useCase.color}30`
                    : `0 8px 30px rgba(45,0,255,0.08), 0 0 0 1px ${useCase.color}25`;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: isMobile ? "34px" : "38px",
                    height: isMobile ? "34px" : "38px",
                    flexShrink: 0,
                    background: `${useCase.color}15`,
                    border: `1px solid ${useCase.color}30`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? "16px" : "20px",
                  }}
                >
                  {useCase.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: isMobile ? "13px" : "15px",
                      color: textMain,
                      marginBottom: "3px",
                    }}
                  >
                    {useCase.title}
                  </div>
                  {!isMobile ? (
                    <p
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        color: text,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {useCase.desc}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: isMobile ? "28px" : "48px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 0.45s",
          }}
        >
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? "18px" : "22px",
              color: textMain,
              margin: "0 0 6px",
            }}
          >
            Demo en 30 minutos.
          </p>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "14px" : "16px",
              color: text,
              margin: "0 0 22px",
            }}
          >
            Un caso real de tu industria, en vivo.
          </p>
          <a href="#contacto-general" style={{ textDecoration: "none", display: "inline-block", width: isMobile ? "100%" : "auto" }}>
            <button
              type="button"
              onClick={() => trackEvent("cta_click", { label: "comparativa_demo" })}
              style={{
                background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: isMobile ? "16px 0" : "14px 40px",
                width: isMobile ? "100%" : "auto",
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? "16px" : "17px",
                cursor: "pointer",
                boxShadow: "0 0 36px rgba(45,0,255,0.4), 0 0 72px rgba(142,0,255,0.2)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-2px)";
                event.currentTarget.style.boxShadow = "0 0 48px rgba(45,0,255,0.6)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = "0 0 36px rgba(45,0,255,0.4)";
              }}
            >
              Solicita tu Demo →
            </button>
          </a>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              color: textFaint,
              margin: "12px 0 0",
            }}
          >
            Equipo Prometheus · Grupo Digital de Guatemala
          </p>
        </div>
      </div>
    </section>
  );
};

const LandingInner = () => {
  const { isDark } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();
  const footerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";
  const footerText = isDark ? "rgba(255,255,255,0.42)" : "rgba(13,13,26,0.57)";
  const footerCopy = isDark ? "rgba(255,255,255,0.36)" : "rgba(13,13,26,0.45)";
  const px = isMobile ? "20px" : isTablet ? "32px" : "64px";

  return (
    <>
      <GlobalStyles />
      <LumenParallax />
      <div
        style={{
          fontFamily: "'Urbanist', sans-serif",
          color: isDark ? "#FFFFFF" : "#0D0D1A",
          minHeight: "100vh",
          overflowX: "hidden",
          position: "relative",
          zIndex: 0,
          background: "transparent",
          transition: "color 0.3s ease",
        }}
      >
        <LumenNavbar />
        <LumenHero />
        <SectionDivider />
        <LumenCapacidades />
        <SectionDivider />
        <LumenPricing />
        <SectionDivider />
        <LumenComparativa />
        <SectionDivider />
        <LumenHubSpotForm isDark={isDark} isMobile={isMobile} isTablet={isTablet} />

        <footer
          style={{
            borderTop: `1px solid ${footerBorder}`,
            padding: `32px ${px}`,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={isDark ? LOGO_LIGHT : LOGO_DARK}
              alt="LUMEN"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                color: footerText,
              }}
            >
              El Motor Conversacional · Prometheus
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: footerCopy,
              margin: 0,
            }}
          >
            © 2026 LUMEN. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
};

export default function LumenLanding() {
  return (
    <ThemeProvider>
      <LandingInner />
    </ThemeProvider>
  );
}
