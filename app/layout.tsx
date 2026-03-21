import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumen — Plataforma omnicanal de IA para atención al cliente",
  description:
    "Lumen conecta WhatsApp, voz, email y redes sociales en una bandeja inteligente que responde, consulta tus sistemas y escala al humano correcto — en segundos.",
  metadataBase: new URL("https://ailumen.app"),
  openGraph: {
    title: "Lumen — Más velocidad, más control, mejores resultados.",
    description:
      "No necesitas más plataformas. Ni un equipo más grande. Necesitas una operación más inteligente.",
    url: "https://ailumen.app",
    siteName: "Lumen",
    locale: "es_GT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen — Plataforma omnicanal de IA",
    description: "Más velocidad, más control, mejores resultados.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={urbanist.variable}>
      <body className="bg-[#0a0a0a] text-white font-[family-name:var(--font-urbanist)] antialiased">
        {/* Accessibility skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#6801FF] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Saltar al contenido principal
        </a>

        {/* GA4 — Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-73FR28HRHP"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-73FR28HRHP');
          `}
        </Script>

        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
