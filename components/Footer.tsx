import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

const colProducto = ["Capacidades", "Integraciones", "Precios", "Changelog", "Status"];
const colEmpresa = ["Sobre Prometheus", "Partners", "Blog", "Casos de éxito", "Contacto"];
const colLegal = ["Términos de uso", "Privacidad", "Cookies"];

export default function Footer() {
  return (
    <footer id="footer" aria-label="Footer de Lumen">
      {/* Gradient top border */}
      <div className="h-[2px] bg-gradient-to-r from-[#6801FF] via-[#0078DF] to-[#00BFDD]" />

      <div className="bg-black py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Top grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Col 1 — Brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              <div className="w-[140px] h-[32px] bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center justify-center">
                <span className="text-[9px] tracking-[0.18em] uppercase text-[#7E8FA6]">
                  LOGO LUMEN
                </span>
              </div>
              <p className="text-sm text-[#7E8FA6] leading-relaxed max-w-[22ch]">
                La claridad en movimiento.
              </p>
              <a
                href="https://www.linkedin.com/company/prometheus-gt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Prometheus"
                className="text-[#7E8FA6] hover:text-[#00BFDD] transition-colors duration-200 w-fit"
              >
                <LinkedinLogo weight="duotone" size={20} />
              </a>
            </div>

            {/* Col 2 — Producto */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#7E8FA6]/60">
                Producto
              </p>
              <ul className="flex flex-col gap-2.5">
                {colProducto.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[#7E8FA6] hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Empresa */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#7E8FA6]/60">
                Empresa
              </p>
              <ul className="flex flex-col gap-2.5">
                {colEmpresa.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[#7E8FA6] hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Legal */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#7E8FA6]/60">
                Legal
              </p>
              <ul className="flex flex-col gap-2.5">
                {colLegal.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[#7E8FA6] hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-white/[0.06] my-10" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#7E8FA6]/60">
              © 2026 Prometheus · Grupo Digital de Guatemala
            </p>
            <p className="text-xs text-[#7E8FA6]/60">
              Powered by Prometheus AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
