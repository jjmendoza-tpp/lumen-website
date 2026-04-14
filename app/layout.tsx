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
  metadataBase: new URL("https://lumenapp.ai"),
  openGraph: {
    title: "Lumen — Más velocidad, más control, mejores resultados.",
    description:
      "No necesitas más plataformas. Ni un equipo más grande. Necesitas una operación más inteligente.",
    url: "https://lumenapp.ai",
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
  const GTM_ID = "GTM-M293BG6J";

  return (
    <html lang="es" className={urbanist.variable}>
      <head>
        {/* Google Tag Manager — head script */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="bg-[#0a0a0a] text-white font-[family-name:var(--font-urbanist)] antialiased">
        {/* Google Tag Manager — noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Accessibility skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#6801FF] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Saltar al contenido principal
        </a>

        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
