'use client'

import { useEffect, useRef, useState, type ReactNode } from "react";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    hbspt?: {
      forms: {
        create: (options: Record<string, unknown>) => void;
      };
    };
  }
}

const PORTAL_ID = "50799369";
const FORM_ID = "04f6e5eb-168f-4d09-a034-749551ffb9ac";
const REGION = "na1";
const SCRIPT_SRC = "https://js.hsforms.net/forms/embed/v2.js";

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M3 10L17 3L10 17L9 11L3 10Z"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.6" />
    <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconRocket = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2C10 2 14 4 14 10C14 13 12 15 10 16C8 15 6 13 6 10C6 4 10 2 10 2Z"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="9" r="1.5" fill="white" />
    <path d="M7 14L5 17M13 14L15 17" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8L6.5 11.5L13 4.5"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SkeletonBar = ({
  width,
  height = 14,
  isDark,
}: {
  width: string;
  height?: number;
  isDark: boolean;
}) => (
  <div
    style={{
      width,
      height: `${height}px`,
      borderRadius: "6px",
      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(13,13,26,0.07)",
      animation: "shimmer 1.6s ease-in-out infinite",
    }}
  />
);

const ProcessStep = ({
  num,
  icon,
  title,
  desc,
  color,
  textMain,
  text,
  isLast,
  isDark,
}: {
  num: number;
  icon: ReactNode;
  title: string;
  desc: string;
  color: string;
  textMain: string;
  text: string;
  isLast: boolean;
  isDark: boolean;
}) => (
  <div style={{ display: "flex", gap: "16px", position: "relative" }}>
    {!isLast ? (
      <div
        style={{
          position: "absolute",
          left: "19px",
          top: "44px",
          width: "2px",
          height: "calc(100% + 4px)",
          background: isDark
            ? "linear-gradient(to bottom, rgba(142,0,255,0.3), transparent)"
            : "linear-gradient(to bottom, rgba(45,0,255,0.15), transparent)",
        }}
      />
    ) : null}
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 16px ${color}44`,
        position: "relative",
        zIndex: 1,
      }}
    >
      {icon}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : "20px" }}>
      <div style={{ marginBottom: "4px" }}>
        <span
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 800,
            fontSize: "11px",
            letterSpacing: "0.08em",
            color,
            opacity: 0.7,
          }}
        >
          PASO {num}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          color: textMain,
          marginBottom: "4px",
        }}
      >
        {title}
      </div>
      <p
        style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 400,
          fontSize: "13px",
          color: text,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </div>
  </div>
);

interface LumenHubSpotFormProps {
  isDark: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

export function LumenHubSpotForm({ isDark, isMobile, isTablet }: LumenHubSpotFormProps) {
  const isCompact = isMobile || isTablet;
  const sectionRef = useRef<HTMLDivElement>(null);
  const formTargetRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const formCreated = useRef(false);
  const formReadyTracked = useRef(false);

  const textMain = isDark ? "#FFFFFF" : "#0D0D1A";
  const text = isDark ? "rgba(255,255,255,0.65)" : "rgba(13,13,26,0.72)";
  const textFaint = isDark ? "rgba(255,255,255,0.40)" : "rgba(13,13,26,0.50)";
  const badgeBg = isDark ? "rgba(142,0,255,0.1)" : "rgba(142,0,255,0.07)";
  const badgeBorder = isDark ? "rgba(142,0,255,0.3)" : "rgba(142,0,255,0.25)";
  const badgeText = isDark ? "rgba(255,255,255,0.8)" : "rgba(13,13,26,0.7)";
  const cardBg = isDark ? "#050508" : "#FFFFFF";
  const cardGlow = isDark
    ? "0 0 0 1px rgba(142,0,255,0.12), 0 32px 80px rgba(45,0,255,0.18), 0 0 120px rgba(142,0,255,0.06)"
    : "0 0 0 1px rgba(45,0,255,0.08), 0 20px 60px rgba(45,0,255,0.08)";
  const inputBg = isDark ? "#0C0C0F" : "rgba(45,0,255,0.025)";
  const inputBorder = isDark ? "rgba(142,0,255,0.28)" : "rgba(45,0,255,0.14)";
  const labelColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(13,13,26,0.65)";
  const placeholderColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(13,13,26,0.25)";
  const inputColor = isDark ? "#FFFFFF" : "#0D0D1A";
  const formBodyBg = isDark ? "#050508" : "#FFFFFF";
  const px = isMobile ? "20px" : isTablet ? "40px" : "72px";

  const markFormReady = () => {
    if (formReadyTracked.current) {
      return;
    }

    formReadyTracked.current = true;
    setFormReady(true);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "hubspot_form_ready", formId: FORM_ID });
  };

  const hubspotInlineCSS = `
    body, form, fieldset {
      background: ${formBodyBg} !important;
      font-family: 'Urbanist', sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      max-width: 100% !important;
    }
    label, .hs-form-field > label {
      font-family: 'Urbanist', sans-serif !important;
      font-weight: 600 !important;
      font-size: 11px !important;
      color: ${labelColor} !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      margin-bottom: 7px !important;
      display: block !important;
      background: transparent !important;
    }
    input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, select {
      width: 100% !important;
      background: ${inputBg} !important;
      background-color: ${inputBg} !important;
      border: 1.5px solid ${inputBorder} !important;
      border-radius: 14px !important;
      padding: 13px 16px !important;
      font-family: 'Urbanist', sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      color: ${inputColor} !important;
      outline: none !important;
      box-shadow: none !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      box-sizing: border-box !important;
      transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
    }
    input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus, input[type="number"]:focus, textarea:focus, select:focus {
      border-color: #2D00FF !important;
      box-shadow: 0 0 0 4px rgba(45,0,255,0.12) !important;
      background: ${isDark ? "#0F0F14" : "rgba(45,0,255,0.04)"} !important;
    }
    input::placeholder, textarea::placeholder {
      color: ${placeholderColor} !important;
      font-weight: 400 !important;
    }
    textarea {
      min-height: 100px !important;
      resize: vertical !important;
    }
    .hs-form-field {
      margin-bottom: 16px !important;
    }
    .hs-form-field .input {
      background: transparent !important;
    }
    .form-columns-2 {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 14px !important;
    }
    .form-columns-1 {
      margin-bottom: 0 !important;
    }
    input[type="submit"], .hs-button {
      width: 100% !important;
      background: linear-gradient(135deg, #2D00FF 0%, #6200CC 50%, #8E00FF 100%) !important;
      background-color: #2D00FF !important;
      color: #FFFFFF !important;
      border: none !important;
      border-radius: 14px !important;
      padding: 15px 32px !important;
      font-family: 'Urbanist', sans-serif !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      letter-spacing: 0.02em !important;
      cursor: pointer !important;
      box-shadow: 0 4px 24px rgba(45,0,255,0.40) !important;
      transition: box-shadow 0.25s ease, transform 0.2s ease !important;
      margin-top: 8px !important;
    }
    input[type="submit"]:hover, .hs-button:hover {
      box-shadow: 0 6px 40px rgba(142,0,255,0.55) !important;
      transform: translateY(-1px) !important;
    }
    .hs-error-msgs, .hs-error-msg {
      list-style: none !important;
      padding: 0 !important;
      margin: 6px 0 0 !important;
      font-size: 11px !important;
      color: #FF5C5C !important;
      font-weight: 500 !important;
    }
    .hs-input.invalid.error {
      border-color: #FF5C5C !important;
      box-shadow: 0 0 0 3px rgba(255,92,92,0.12) !important;
    }
    .submitted-message {
      font-family: 'Urbanist', sans-serif !important;
      font-size: 17px !important;
      font-weight: 600 !important;
      color: ${isDark ? "#FFFFFF" : "#0D0D1A"} !important;
      text-align: center !important;
      padding: 40px 20px !important;
      background: ${isDark ? "rgba(45,0,255,0.08)" : "rgba(45,0,255,0.04)"} !important;
      border-radius: 16px !important;
      border: 1px solid rgba(45,0,255,0.22) !important;
    }
    .hs-richtext, .legal-consent-container, .hs-richtext p, .legal-consent-container p {
      font-size: 11px !important;
      line-height: 1.6 !important;
      color: ${isDark ? "rgba(255,255,255,0.35)" : "rgba(13,13,26,0.45)"} !important;
      background: transparent !important;
    }
    .hs-richtext a, .legal-consent-container a {
      color: #8E00FF !important;
      text-decoration: underline !important;
    }
    .inputs-list {
      list-style: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .inputs-list label {
      display: flex !important;
      align-items: flex-start !important;
      gap: 10px !important;
      cursor: pointer !important;
      text-transform: none !important;
      font-size: 12px !important;
      letter-spacing: 0 !important;
      font-weight: 400 !important;
    }
    .inputs-list input[type="checkbox"] {
      width: 16px !important;
      height: 16px !important;
      min-width: 16px !important;
      border-radius: 5px !important;
      margin-top: 1px !important;
      accent-color: #2D00FF !important;
    }
    .hs-form-boilerplate, .hs-form-boilerplate * {
      display: none !important;
    }
    * {
      box-sizing: border-box !important;
    }
  `;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.06 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (formCreated.current) {
      return;
    }

    const renderForm = () => {
      if (!window.hbspt || !formTargetRef.current) {
        return;
      }

      try {
        formCreated.current = true;
        window.hbspt.forms.create({
          region: REGION,
          portalId: PORTAL_ID,
          formId: FORM_ID,
          target: `#${formTargetRef.current.id}`,
          css: hubspotInlineCSS,
          onFormReady: () => {
            setTimeout(() => markFormReady(), 300);
          },
          onFormSubmitted: () => {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: "hubspot_form_submit", formId: FORM_ID });
          },
        });
      } catch (error) {
        formCreated.current = false;
        console.error("Error rendering HubSpot form:", error);
      }
    };

    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);

    if (existing && window.hbspt) {
      renderForm();
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => renderForm();
    script.onerror = () => {
      console.error("Failed to load HubSpot form script");
    };
    document.head.appendChild(script);
  }, [hubspotInlineCSS]);

  useEffect(() => {
    const target = formTargetRef.current;

    if (!target || formReadyTracked.current) {
      return;
    }

    const detectRenderedForm = () => {
      if (
        target.querySelector("iframe") ||
        target.querySelector(".hbspt-form") ||
        target.querySelector("form") ||
        target.querySelector(".submitted-message")
      ) {
        markFormReady();
        return true;
      }

      return false;
    };

    if (detectRenderedForm()) {
      return;
    }

    // HubSpot can insert the iframe before firing callbacks; watch the target directly.
    const observer = new MutationObserver(() => {
      if (detectRenderedForm()) {
        observer.disconnect();
      }
    });

    observer.observe(target, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [formReady]);

  const pageStyles = `
    @keyframes shimmer {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes lumen-pulse {
      0%, 100% { box-shadow: 0 0 8px rgba(45,0,255,0.5); }
      50% { box-shadow: 0 0 18px rgba(142,0,255,0.8); }
    }
    .hs-form-shell {
      border: none !important;
      width: 100% !important;
      overflow: hidden !important;
    }
    .hs-form-shell iframe {
      width: 100% !important;
      border: none !important;
      background: transparent !important;
    }
    @media (max-width: 720px) {
      .form-columns-2 {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  const steps = [
    {
      icon: <IconSend />,
      title: "Envía tu información",
      desc: "Completa el formulario con los datos de tu empresa y el desafío que quieres resolver.",
      color: "#2D00FF",
    },
    {
      icon: <IconSearch />,
      title: "Evaluamos tu caso",
      desc: "Un especialista LUMEN analiza tu operación y prepara una propuesta personalizada.",
      color: "#6200CC",
    },
    {
      icon: <IconRocket />,
      title: "Activamos LUMEN",
      desc: "Configuramos tu motor conversacional y lanzamos en producción en tiempo récord.",
      color: "#8E00FF",
    },
  ];

  const guarantees = [
    "Respuesta garantizada en menos de 24 h hábiles",
    "Sin compromiso ni costo inicial",
    "Equipo especialista en LatAm",
  ];

  return (
    <section
      ref={sectionRef}
      id="contacto-general"
      style={{
        padding: `${isMobile ? "40px" : "80px"} ${px} ${isMobile ? "60px" : "100px"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{pageStyles}</style>

      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-60px",
          width: "700px",
          height: "700px",
          pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse at 70% 30%, rgba(45,0,255,0.10) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 70% 30%, rgba(45,0,255,0.06) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-60px",
          width: "600px",
          height: "600px",
          pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse at 30% 70%, rgba(142,0,255,0.08) 0%, transparent 65%)"
            : "radial-gradient(ellipse at 30% 70%, rgba(142,0,255,0.04) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "40px" : "64px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
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
              padding: "6px 16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                animation: "lumen-pulse 2.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "12px",
                color: badgeText,
                letterSpacing: "0.07em",
              }}
            >
              CONTACTO DIRECTO
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? "30px" : "clamp(34px, 4vw, 52px)",
              color: textMain,
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}
          >
            Hablemos de{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #2D00FF 0%, #8E00FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              tu operación
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "14px" : "17px",
              color: text,
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            {isMobile
              ? "Te mostramos en 24 h cómo LUMEN transforma tu operación."
              : "Cuéntanos tu reto y te mostraremos en 24 h cómo LUMEN puede transformar tu operación conversacional."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isCompact ? "1fr" : "5fr 7fr",
            gap: isCompact ? "40px" : "56px",
            alignItems: "start",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(36px)",
            transition: "opacity 0.8s ease 0.18s, transform 0.8s ease 0.18s",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <div>
              <p
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(13,13,26,0.35)",
                  textTransform: "uppercase",
                  margin: "0 0 24px",
                }}
              >
                CÓMO FUNCIONA
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {steps.map((step, index) => (
                  <ProcessStep
                    key={step.title}
                    num={index + 1}
                    icon={step.icon}
                    title={step.title}
                    desc={step.desc}
                    color={step.color}
                    textMain={textMain}
                    text={text}
                    isLast={index === steps.length - 1}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                padding: "20px 24px",
                background: isDark ? "rgba(45,0,255,0.06)" : "rgba(45,0,255,0.03)",
                border: `1px solid ${isDark ? "rgba(45,0,255,0.18)" : "rgba(45,0,255,0.10)"}`,
                borderRadius: "20px",
                backdropFilter: "blur(12px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.06em",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(13,13,26,0.38)",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                NUESTRAS GARANTÍAS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {guarantees.map((guarantee) => (
                  <div key={guarantee} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconCheck />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: text,
                      }}
                    >
                      {guarantee}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1.5px",
              borderRadius: "28px",
              background: isDark
                ? "linear-gradient(135deg, rgba(45,0,255,0.5), rgba(142,0,255,0.3), rgba(45,0,255,0.1))"
                : "linear-gradient(135deg, rgba(45,0,255,0.2), rgba(142,0,255,0.12), rgba(45,0,255,0.06))",
              boxShadow: cardGlow,
            }}
          >
            <div style={{ borderRadius: "27px", background: cardBg, overflow: "hidden" }}>
              <div
                style={{
                  padding: isMobile ? "16px 20px" : "20px 32px",
                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(45,0,255,0.07)"}`,
                  background: isDark
                    ? "linear-gradient(135deg, rgba(45,0,255,0.07) 0%, rgba(142,0,255,0.04) 100%)"
                    : "linear-gradient(135deg, rgba(45,0,255,0.03) 0%, rgba(142,0,255,0.02) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 12px rgba(45,0,255,0.45)",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 4h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path d="M2 6l8 6 8-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Urbanist', sans-serif",
                        fontWeight: 700,
                        fontSize: "13px",
                        color: textMain,
                      }}
                    >
                      Contacto Directo
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
                      LUMEN Motor Conversacional
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: isDark ? "rgba(45,0,255,0.12)" : "rgba(45,0,255,0.06)",
                    border: `1px solid ${isDark ? "rgba(45,0,255,0.25)" : "rgba(45,0,255,0.12)"}`,
                    borderRadius: "100px",
                    padding: "5px 10px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#22C55E",
                      boxShadow: "0 0 6px rgba(34,197,94,0.8)",
                      animation: "shimmer 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "0.05em",
                      color: isDark ? "rgba(255,255,255,0.5)" : "rgba(13,13,26,0.45)",
                    }}
                  >
                    EN LÍNEA
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? "24px 20px 28px" : "32px 36px 36px",
                  background: cardBg,
                }}
              >
                {!formReady ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
                        gap: "14px",
                      }}
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <SkeletonBar width="60%" height={10} isDark={isDark} />
                          <SkeletonBar width="100%" height={44} isDark={isDark} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <SkeletonBar width="40%" height={10} isDark={isDark} />
                      <SkeletonBar width="100%" height={44} isDark={isDark} />
                    </div>
                    <SkeletonBar width="100%" height={48} isDark={isDark} />
                  </div>
                ) : null}

                <div
                  id="hubspot-form-lumen"
                  className="hs-form-shell"
                  data-hubspot-form="true"
                  data-region={REGION}
                  data-form-id={FORM_ID}
                  data-portal-id={PORTAL_ID}
                  ref={formTargetRef}
                  style={{
                    display: formReady ? "block" : "none",
                    background: "transparent",
                    minHeight: formReady ? "auto" : "400px",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "14px 36px 20px",
                  borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(45,0,255,0.06)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L4 4V8C4 11.3 6.5 14 8 14.5C9.5 14 12 11.3 12 8V4L8 1Z"
                    stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(13,13,26,0.3)"}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 500,
                    fontSize: "11px",
                    color: isDark ? "rgba(255,255,255,0.28)" : "rgba(13,13,26,0.30)",
                  }}
                >
                  Tus datos están protegidos · 256-bit SSL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
