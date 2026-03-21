import {
  ChatCircle,
  PaperPlaneTilt,
  FacebookLogo,
  InstagramLogo,
  Browsers,
  EnvelopeSimple,
  ChatText,
  Phone,
  ShareNetwork,
  DeviceMobile,
} from "@phosphor-icons/react/dist/ssr";

const channels = [
  { icon: ChatCircle, name: "WhatsApp" },
  { icon: PaperPlaneTilt, name: "Telegram" },
  { icon: FacebookLogo, name: "Messenger" },
  { icon: InstagramLogo, name: "Instagram DM" },
  { icon: Browsers, name: "Web Widget" },
  { icon: EnvelopeSimple, name: "Email" },
  { icon: ChatText, name: "SMS" },
  { icon: Phone, name: "Voz (Twilio)" },
  { icon: DeviceMobile, name: "LINE" },
  { icon: ShareNetwork, name: "Redes Sociales" },
];

export default function Canales() {
  return (
    <section
      id="canales"
      aria-label="Canales de comunicación soportados por Lumen"
      className="min-h-[65vh] bg-[#0a0a0a] py-28 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight [text-wrap:balance]">
            Donde están tus clientes
          </h2>
          <p className="mt-4 text-lg text-[#7E8FA6] max-w-[40ch] mx-auto leading-relaxed">
            Un asistente. Todos los canales. Una sola configuración.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {channels.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="h-[110px] flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#00BFDD]/30 hover:bg-[#00BFDD]/[0.03] transition-all duration-200 cursor-default group"
            >
              <Icon
                weight="duotone"
                size={28}
                className="text-[#7E8FA6] group-hover:text-[#00BFDD] transition-colors duration-200"
              />
              <span className="text-xs font-medium text-[#7E8FA6] group-hover:text-white/80 transition-colors duration-200 text-center px-2">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
