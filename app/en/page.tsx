import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import DemoInteractiva from "@/components/DemoInteractiva";
import PainLayer from "@/components/PainLayer";
import ComoFunciona from "@/components/ComoFunciona";
import Capacidades from "@/components/Capacidades";
import Canales from "@/components/Canales";
import Pricing from "@/components/Pricing";
import CTAForm from "@/components/CTAForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lumen — AI-powered omnichannel customer service platform",
  description:
    "Lumen connects WhatsApp, voice, email and social media into an intelligent inbox that responds, queries your systems and escalates to the right human — in seconds.",
  alternates: {
    canonical: "https://lumenapp.ai/en",
    languages: { es: "https://lumenapp.ai" },
  },
};

export default function HomeEN() {
  return (
    <>
      <Navbar lang="en" />
      <Hero />
      <SocialProof />
      <DemoInteractiva />
      <PainLayer />
      <ComoFunciona />
      <Capacidades />
      <Canales />
      <Pricing />
      <CTAForm />
      <Footer />
    </>
  );
}
