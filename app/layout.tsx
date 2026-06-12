import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const SITE_URL = "https://lumenapp.ai";
const SITE_NAME = "Lumen AI";
const DEFAULT_DESCRIPTION_ES =
  "Lumen AI centraliza WhatsApp, voz, email y redes sociales para responder, calificar leads y escalar conversaciones al agente correcto en segundos.";
const DEFAULT_DESCRIPTION_EN =
  "Lumen AI centralizes WhatsApp, voice, email and social channels to reply, qualify leads and route conversations to the right agent in seconds.";
const GTM_ID = "GTM-KZNM7JNM";
const GA_ID = "G-BWZW45MGRG";
const LINKEDIN_PARTNER_ID = "9006578";
const META_PIXEL_ID = "982145840992357";
const CHATWOOT_BASE_URL =
  process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL ?? "https://app.innovacion.ai";
const CHATWOOT_WEBSITE_TOKEN =
  process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN ?? "66KFTkHdoCo8eNDNRMBGisct";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: "%s | Lumen AI",
  },
  description: DEFAULT_DESCRIPTION_ES,
  referrer: "origin-when-cross-origin",
  keywords: [
    "Lumen AI",
    "omnichannel AI",
    "AI customer service",
    "lead capture",
    "WhatsApp automation",
    "voice AI",
    "marketing automation",
    "customer support AI",
  ],
  category: "marketing technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION_ES,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_GT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION_ES,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/icon-512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION_EN,
      inLanguage: ["es-GT", "en"],
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={urbanist.variable}>
      <head>
        {/* Consent Mode v2 — default-deny + replay. DEBE ejecutarse ANTES del
            loader de GTM (script plano para garantizar orden de ejecución en
            el parse del HTML). wait_for_update: 500 da margen para que el
            replay desde localStorage ocurra antes de que los tags evalúen
            consent. NO mover ni convertir a next/script. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage:              'denied',
    ad_user_data:            'denied',
    ad_personalization:      'denied',
    personalization_storage: 'denied',
    analytics_storage:       'denied',
    functionality_storage:   'granted',
    security_storage:        'granted',
    wait_for_update: 500
  });

  try {
    var raw = localStorage.getItem('lumen:consent:v1');
    if (raw) {
      var d = JSON.parse(raw);
      if (d && d.v === 1) {
        gtag('consent', 'update', {
          analytics_storage:       d.analytics ? 'granted' : 'denied',
          ad_storage:              d.marketing ? 'granted' : 'denied',
          ad_user_data:            d.marketing ? 'granted' : 'denied',
          ad_personalization:      d.marketing ? 'granted' : 'denied',
          personalization_storage: d.marketing ? 'granted' : 'denied'
        });
      }
    }
  } catch (e) {}
})();`,
          }}
        />
        <meta
          name="facebook-domain-verification"
          content="q9pbenuvjxiskf2v7ossys0vg8ndws"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
        {/* Loaders consent-gated (Consent Mode v2) — LinkedIn Insight y Meta
            Pixel son scripts sin consent built-in, así que se inyectan SOLO
            con consentimiento de marketing; Chatwoot (cookies + WebSocket)
            requiere analítica + marketing, igual que en prometheus-website.
            Los snippets internos son los oficiales verbatim de cada vendor.
            Script plano en <head> (no next/script) para garantizar que
            getElementsByTagName("script")[0] tenga un parentNode válido al
            ejecutarse cada IIFE. Chatwoot: el sdk.js en /packs/js/sdk.js
            sigue pendiente de fix server-side en app.innovacion.ai. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  var loadedMarketing = false;
  var loadedChatwoot = false;

  function loadMarketing() {
    if (loadedMarketing) return;
    loadedMarketing = true;

    window._linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '${META_PIXEL_ID}');
    window.fbq('track', 'PageView');
  }

  function loadChatwoot() {
    if (loadedChatwoot) return;
    loadedChatwoot = true;

    window.chatwootSettings = {
      position: "right",
      type: "expanded_bubble",
      launcherTitle: "Habla con Lumen"
    };
    (function(d,t) {
      var BASE_URL="${CHATWOOT_BASE_URL}";
      var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
      g.src=BASE_URL+"/packs/js/sdk.js";
      g.async=true;
      s.parentNode.insertBefore(g,s);
      g.onload=function(){
        window.chatwootSDK.run({
          websiteToken: "${CHATWOOT_WEBSITE_TOKEN}",
          baseUrl: BASE_URL
        });
      };
    })(document,"script");
  }

  function apply(analytics, marketing) {
    if (marketing) loadMarketing();
    if (analytics && marketing) loadChatwoot();
  }

  try {
    var raw = localStorage.getItem('lumen:consent:v1');
    if (raw) {
      var d = JSON.parse(raw);
      if (d && d.v === 1) apply(!!d.analytics, !!d.marketing);
    }
  } catch (e) {}

  window.addEventListener('lumen:consent-updated', function (e) {
    var det = (e && e.detail) || {};
    apply(!!det.analytics, !!det.marketing);
  });
})();`,
          }}
        />
      </head>
      <body className="bg-transparent font-[family-name:var(--font-urbanist)] text-[#0d0d1a] antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Los beacons <noscript> de Meta y LinkedIn se removieron: disparan
            incondicionalmente y no pueden respetar Consent Mode v2. El iframe
            de GTM se mantiene porque GTM sí evalúa consent server-side. */}

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-[#6801FF] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Saltar al contenido principal
        </a>

        <main id="main-content">{children}</main>
        <CookieBanner />
      </body>
    </html>
  );
}
