import type { Metadata } from "next";
import LumenLanding from "@/components/landing/LumenLanding";

export const metadata: Metadata = {
  title: "Omnichannel AI platform for customer service",
  description:
    "Lumen AI helps marketing, sales and CX teams respond across WhatsApp, voice, email and social channels from a single conversational operation.",
  alternates: {
    canonical: "https://lumenapp.ai",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Lumen AI",
    description:
      "Lumen AI helps marketing, sales and CX teams respond across WhatsApp, voice, email and social channels from a single conversational operation.",
    url: "https://lumenapp.ai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Lumen AI",
    description:
      "Lumen AI helps marketing, sales and CX teams respond across WhatsApp, voice, email and social channels from a single conversational operation.",
  },
};

export default function HomeEN() {
  return <LumenLanding />;
}
