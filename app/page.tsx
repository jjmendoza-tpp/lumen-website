import type { Metadata } from "next";
import LumenLanding from "@/components/landing/LumenLanding";

export const metadata: Metadata = {
  description:
    "Lumen AI ayuda a equipos de marketing, ventas y CX a responder por WhatsApp, voz, email y redes sociales desde una sola operación conversacional.",
  alternates: {
    canonical: "https://lumenapp.ai",
  },
  openGraph: {
    title: "Lumen AI",
    description:
      "Lumen AI ayuda a equipos de marketing, ventas y CX a responder por WhatsApp, voz, email y redes sociales desde una sola operación conversacional.",
    url: "https://lumenapp.ai",
    locale: "es_GT",
    type: "website",
  },
};

export default function Home() {
  return <LumenLanding />;
}
