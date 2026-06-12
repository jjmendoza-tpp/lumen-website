import Link from "next/link";

// Layout compartido de páginas legales (V1 borrador, pendiente revisión
// legal externa). Tema claro, consistente con la landing.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#0d0d1a]/10">
        <div className="mx-auto flex max-w-[820px] items-center justify-between px-6 py-5">
          <Link href="/" aria-label="Volver al inicio">
            <img
              src="/logos/lumen-logo-dark.png"
              alt="Lumen"
              width={110}
              height={30}
              className="h-7 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#6801FF] hover:underline"
          >
            ← Volver al sitio
          </Link>
        </div>
      </header>

      <article className="legal mx-auto max-w-[820px] px-6 pb-24 pt-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6801FF]">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#0d0d1a] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-[#0d0d1a]/60">
          Última actualización: {updated}. Borrador V1 — pendiente de revisión
          legal externa.
        </p>
        <div className="legal-body mt-10">{children}</div>
      </article>
    </div>
  );
}
