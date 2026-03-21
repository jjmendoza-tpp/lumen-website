const logos = [
  "IMFOHSA",
  "CEMPRO",
  "CrediOpciones",
  "Impelsa",
  "GBM",
  "TPP eMarketing",
  "Bunker DB",
];

export default function SocialProof() {
  return (
    <section
      aria-label="Empresas que confían en Lumen"
      className="h-[180px] bg-[#0a0a0a] border-y border-white/[0.06] flex flex-col items-center justify-center gap-5 overflow-hidden"
    >
      {/* Label */}
      <p className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#7E8FA6]">
        Más de 10 empresas confían en Lumen
      </p>

      {/* Marquee track */}
      <div className="relative w-full overflow-hidden">
        {/* Edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Double array for seamless loop */}
        <div className="flex animate-marquee gap-16 w-max items-center">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="text-white/55 font-bold text-sm tracking-wide whitespace-nowrap hover:text-white/80 transition-colors duration-200 h-7 flex items-center"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
