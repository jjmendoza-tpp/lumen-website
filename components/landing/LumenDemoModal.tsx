'use client'

import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Channel = "whatsapp" | "instagram" | "telegram" | "email" | "sms";

interface ConversationItem {
  id: number;
  name: string;
  preview: string;
  time: string;
  channel: Channel;
  unread: number;
  avatar: string;
}

interface Message {
  id: number;
  role: "customer" | "agent";
  text: string;
  time: string;
}

const CloseIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoreIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1.8" fill={color} />
    <circle cx="12" cy="12" r="1.8" fill={color} />
    <circle cx="12" cy="19" r="1.8" fill={color} />
  </svg>
);

const SendIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11.5L20 3L13 20L10.5 13.5L3 11.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DoubleCheckIcon = ({
  size = 11,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path
      d="M2.5 10L6 13.5L13 6.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 10L11 13.5L18 6.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ZapIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path
      d="M10.5 2L4.5 11H9L8.5 18L15.5 8.5H11.5L10.5 2Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      fill="currentColor"
    />
    <path
      d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.09-1.34A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.72 0-3.32-.49-4.67-1.33l-.33-.2-3.02.79.81-2.95-.22-.35A8 8 0 1 1 12 20z"
      fill="currentColor"
    />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
  </svg>
);

const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"
      fill="currentColor"
    />
  </svg>
);

const EmailIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SMSIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="11" r="1" fill="currentColor" />
    <circle cx="12" cy="11" r="1" fill="currentColor" />
    <circle cx="16" cy="11" r="1" fill="currentColor" />
  </svg>
);

const CHANNEL_CONFIG: Record<
  Channel,
  { color: string; label: string; Icon: ComponentType<{ size?: number }> }
> = {
  whatsapp: { color: "#25D366", label: "WhatsApp", Icon: WhatsAppIcon },
  instagram: { color: "#E1306C", label: "Instagram", Icon: InstagramIcon },
  telegram: { color: "#0088CC", label: "Telegram", Icon: TelegramIcon },
  email: { color: "#4285F4", label: "Email", Icon: EmailIcon },
  sms: { color: "#FF6B35", label: "SMS", Icon: SMSIcon },
};

const CONVERSATIONS: ConversationItem[] = [
  {
    id: 1,
    name: "María García",
    preview: "¿Puedo cambiar la dirección?",
    time: "Ahora",
    channel: "whatsapp",
    unread: 2,
    avatar: "MG",
  },
  {
    id: 2,
    name: "Carlos Mendez",
    preview: "Vi tu promo en stories",
    time: "2 min",
    channel: "instagram",
    unread: 1,
    avatar: "CM",
  },
  {
    id: 3,
    name: "Ana Torres",
    preview: "Confirma tu cita del lunes",
    time: "5 min",
    channel: "telegram",
    unread: 0,
    avatar: "AT",
  },
  {
    id: 4,
    name: "ops@techco.mx",
    preview: "Re: Factura #2034 adjunta",
    time: "12 min",
    channel: "email",
    unread: 0,
    avatar: "TC",
  },
  {
    id: 5,
    name: "+52 55 1234 5678",
    preview: "Código de verificación: 8821",
    time: "18 min",
    channel: "sms",
    unread: 0,
    avatar: "+",
  },
];

const MESSAGE_SEQUENCE: (Message | "typing")[] = [
  {
    id: 1,
    role: "customer",
    text: "Hola. Quisiera saber el estado de mi pedido #4521.",
    time: "14:22",
  },
  "typing",
  {
    id: 2,
    role: "agent",
    text: "Hola, María. Tu pedido #4521 está en camino. Llegará el 18 de marzo entre 10am y 2pm.",
    time: "14:22",
  },
  "typing",
  {
    id: 3,
    role: "agent",
    text: "También te enviaré el link de rastreo en un momento.",
    time: "14:22",
  },
  {
    id: 4,
    role: "customer",
    text: "Gracias. Y puedo cambiarlo de dirección todavía?",
    time: "14:23",
  },
  "typing",
  {
    id: 5,
    role: "agent",
    text: "Sí. Aún tienes 2 horas para modificarlo. ¿A qué dirección te gustaría redirigir el envío?",
    time: "14:23",
  },
];

const ChannelBadge = ({ channel, size = 16 }: { channel: Channel; size?: number }) => {
  const { color, Icon } = CHANNEL_CONFIG[channel];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + 8,
        height: size + 8,
        borderRadius: "50%",
        background: `${color}22`,
        color,
        flexShrink: 0,
      }}
    >
      <Icon size={size} />
    </span>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 6 }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "10px 14px",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "16px 16px 16px 4px",
      width: "fit-content",
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
          display: "block",
        }}
      />
    ))}
  </motion.div>
);

function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 980);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isCompact;
}

interface LumenDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LumenDemoModal({ isOpen, onClose }: LumenDemoModalProps) {
  const [activeConv, setActiveConv] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0);
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({ 1: 2, 2: 1 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompact = useIsCompact();

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setShowTyping(false);
      setSeqIndex(0);
      return;
    }

    setMessages([]);
    setShowTyping(false);
    setSeqIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || seqIndex >= MESSAGE_SEQUENCE.length) {
      return;
    }

    const step = MESSAGE_SEQUENCE[seqIndex];

    if (step === "typing") {
      setShowTyping(true);
      timerRef.current = setTimeout(() => {
        setShowTyping(false);
        setSeqIndex((prev) => prev + 1);
      }, 1400);
    } else {
      timerRef.current = setTimeout(() => {
        setMessages((prev) => [...prev, step]);
        setSeqIndex((prev) => prev + 1);
      }, seqIndex === 0 ? 600 : 200);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, seqIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSelectConv = (idx: number, id: number) => {
    setActiveConv(idx);
    setUnreadMap((prev) => ({ ...prev, [id]: 0 }));
  };

  const unreadCount = Object.values(unreadMap).reduce((total, current) => total + current, 0);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(8px)",
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                pointerEvents: "all",
                width: "min(960px, 95vw)",
                height: "min(620px, 90vh)",
                background: "#1A1D29",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.03)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 14px rgba(45,0,255,0.5)",
                    }}
                  >
                    <ZapIcon size={16} color="white" />
                  </div>
                  <span
                    style={{
                      color: "white",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                    }}
                  >
                    LUMEN
                  </span>
                  <span
                    style={{
                      background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                      color: "white",
                      fontSize: "10px",
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    DEMO INTERACTIVA
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#25D366",
                        display: "block",
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "'Urbanist', sans-serif",
                        fontSize: "12px",
                      }}
                    >
                      En vivo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "none",
                      borderRadius: "8px",
                      width: 30,
                      height: 30,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.6)",
                      transition: "background 0.2s ease",
                      marginLeft: "8px",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background = "rgba(255,255,255,0.14)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flex: 1,
                  overflow: "hidden",
                  flexDirection: isCompact ? "column" : "row",
                }}
              >
                <div
                  style={{
                    width: isCompact ? "100%" : "260px",
                    maxHeight: isCompact ? "210px" : "none",
                    flexShrink: 0,
                    borderRight: isCompact ? "none" : "1px solid rgba(255,255,255,0.07)",
                    borderBottom: isCompact ? "1px solid rgba(255,255,255,0.07)" : "none",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px 10px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontFamily: "'Urbanist', sans-serif",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        Bandeja Unificada
                      </span>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                          color: "white",
                          fontSize: "10px",
                          fontFamily: "'Urbanist', sans-serif",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "10px",
                        }}
                      >
                        {unreadCount} nuevos
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {(["whatsapp", "instagram", "telegram", "email", "sms"] as Channel[]).map(
                        (channel) => {
                          const { color, Icon } = CHANNEL_CONFIG[channel];

                          return (
                            <span
                              key={channel}
                              title={CHANNEL_CONFIG[channel].label}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 26,
                                height: 26,
                                borderRadius: "8px",
                                background: `${color}18`,
                                color,
                                cursor: "pointer",
                                border: `1px solid ${color}33`,
                              }}
                            >
                              <Icon size={13} />
                            </span>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {CONVERSATIONS.map((conversation, index) => {
                      const isActive = index === activeConv;
                      const unread = unreadMap[conversation.id] ?? 0;

                      return (
                        <motion.div
                          key={conversation.id}
                          onClick={() => handleSelectConv(index, conversation.id)}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            cursor: "pointer",
                            background: isActive ? "rgba(45,0,255,0.12)" : "transparent",
                            borderLeft: isActive ? "2px solid #2D00FF" : "2px solid transparent",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, rgba(45,0,255,0.3), rgba(142,0,255,0.3))",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "rgba(255,255,255,0.8)",
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 700,
                              fontSize: "12px",
                              flexShrink: 0,
                            }}
                          >
                            {conversation.avatar}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "4px",
                              }}
                            >
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.9)",
                                  fontFamily: "'Urbanist', sans-serif",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {conversation.name}
                              </span>
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.3)",
                                  fontSize: "10px",
                                  fontFamily: "'Urbanist', sans-serif",
                                  flexShrink: 0,
                                }}
                              >
                                {conversation.time}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                marginTop: "2px",
                              }}
                            >
                              <ChannelBadge channel={conversation.channel} size={10} />
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.4)",
                                  fontSize: "11px",
                                  fontFamily: "'Urbanist', sans-serif",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {conversation.preview}
                              </span>
                            </div>
                          </div>

                          {unread > 0 ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{
                                background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                                color: "white",
                                fontSize: "10px",
                                fontFamily: "'Urbanist', sans-serif",
                                fontWeight: 700,
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {unread}
                            </motion.span>
                          ) : null}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 18px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, rgba(45,0,255,0.3), rgba(142,0,255,0.3))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: "'Urbanist', sans-serif",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          {CONVERSATIONS[activeConv].avatar}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                              style={{
                                color: "white",
                                fontFamily: "'Urbanist', sans-serif",
                                fontWeight: 700,
                                fontSize: "14px",
                              }}
                            >
                              {CONVERSATIONS[activeConv].name}
                            </span>
                            <ChannelBadge channel={CONVERSATIONS[activeConv].channel} size={12} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              marginTop: "1px",
                            }}
                          >
                            <motion.span
                              animate={{ opacity: [1, 0.4, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#25D366",
                                display: "block",
                              }}
                            />
                            <span
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: "11px",
                                fontFamily: "'Urbanist', sans-serif",
                              }}
                            >
                              En línea vía {CHANNEL_CONFIG[CONVERSATIONS[activeConv].channel].label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(45,0,255,0.12)",
                            border: "1px solid rgba(45,0,255,0.3)",
                            borderRadius: "8px",
                            padding: "4px 10px",
                          }}
                        >
                          <ZapIcon size={11} color="#8E00FF" />
                          <span
                            style={{
                              color: "#8E00FF",
                              fontSize: "11px",
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 700,
                            }}
                          >
                            LUMEN AI activo
                          </span>
                        </div>
                        <MoreIcon size={16} color="rgba(255,255,255,0.3)" />
                      </div>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px 18px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ textAlign: "center", marginBottom: "4px" }}>
                        <span
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "10px",
                            fontFamily: "'Urbanist', sans-serif",
                            padding: "3px 10px",
                            borderRadius: "20px",
                          }}
                        >
                          Hoy · 14:22
                        </span>
                      </div>

                      {activeConv === 0 ? (
                        <>
                          <AnimatePresence>
                            {messages.map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    message.role === "customer" ? "flex-start" : "flex-end",
                                }}
                              >
                                <div
                                  style={{
                                    maxWidth: "72%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3px",
                                    alignItems:
                                      message.role === "customer" ? "flex-start" : "flex-end",
                                  }}
                                >
                                  {message.role === "agent" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      <ZapIcon size={10} color="#8E00FF" />
                                      <span
                                        style={{
                                          color: "#8E00FF",
                                          fontSize: "10px",
                                          fontFamily: "'Urbanist', sans-serif",
                                          fontWeight: 700,
                                        }}
                                      >
                                        LUMEN AI
                                      </span>
                                    </div>
                                  ) : null}
                                  <div
                                    style={{
                                      padding: "9px 13px",
                                      borderRadius:
                                        message.role === "customer"
                                          ? "16px 16px 16px 4px"
                                          : "16px 16px 4px 16px",
                                      background:
                                        message.role === "customer"
                                          ? "rgba(255,255,255,0.07)"
                                          : "linear-gradient(135deg, rgba(45,0,255,0.35), rgba(142,0,255,0.35))",
                                      border:
                                        message.role === "agent"
                                          ? "1px solid rgba(142,0,255,0.25)"
                                          : "1px solid rgba(255,255,255,0.08)",
                                      color: "rgba(255,255,255,0.9)",
                                      fontSize: "13px",
                                      fontFamily: "'Urbanist', sans-serif",
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {message.text}
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <span
                                      style={{
                                        color: "rgba(255,255,255,0.25)",
                                        fontSize: "10px",
                                        fontFamily: "'Urbanist', sans-serif",
                                      }}
                                    >
                                      {message.time}
                                    </span>
                                    {message.role === "agent" ? (
                                      <DoubleCheckIcon size={11} color="#2D00FF" />
                                    ) : null}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          <AnimatePresence>
                            {showTyping ? (
                              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "3px",
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <ZapIcon size={10} color="#8E00FF" />
                                    <span
                                      style={{
                                        color: "#8E00FF",
                                        fontSize: "10px",
                                        fontFamily: "'Urbanist', sans-serif",
                                        fontWeight: 700,
                                      }}
                                    >
                                      LUMEN AI
                                    </span>
                                  </div>
                                  <TypingIndicator />
                                </div>
                              </div>
                            ) : null}
                          </AnimatePresence>
                        </>
                      ) : (
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "8px",
                            paddingTop: "40px",
                          }}
                        >
                          <ChannelBadge channel={CONVERSATIONS[activeConv].channel} size={28} />
                          <span
                            style={{
                              color: "rgba(255,255,255,0.3)",
                              fontFamily: "'Urbanist', sans-serif",
                              fontSize: "13px",
                            }}
                          >
                            Conversación vía {CHANNEL_CONFIG[CONVERSATIONS[activeConv].channel].label}
                          </span>
                          <span
                            style={{
                              color: "rgba(255,255,255,0.15)",
                              fontSize: "11px",
                              fontFamily: "'Urbanist', sans-serif",
                            }}
                          >
                            LUMEN unifica todos tus canales aquí
                          </span>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    <div
                      style={{
                        padding: "12px 18px",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          padding: "9px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <ZapIcon size={13} color="#8E00FF" />
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontFamily: "'Urbanist', sans-serif",
                            fontSize: "13px",
                          }}
                        >
                          LUMEN AI está respondiendo automáticamente...
                        </span>
                      </div>
                      <button
                        type="button"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #2D00FF, #8E00FF)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 16px rgba(45,0,255,0.4)",
                        }}
                      >
                        <SendIcon size={14} color="white" />
                      </button>
                    </div>
                  </div>

                  {isCompact ? null : (
                    <div
                      style={{
                        width: "200px",
                        flexShrink: 0,
                        borderLeft: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        padding: "14px",
                        gap: "16px",
                        overflowY: "auto",
                        backgroundColor: "#00000026",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: "#ffffff4d",
                            fontSize: "10px",
                            fontFamily: "'Urbanist', sans-serif",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Cliente
                        </span>
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              color: "#ffffffd9",
                              fontFamily: "'Urbanist', sans-serif",
                              fontWeight: 700,
                              fontSize: "13px",
                            }}
                          >
                            {CONVERSATIONS[activeConv].name}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <ChannelBadge channel={CONVERSATIONS[activeConv].channel} size={11} />
                            <span
                              style={{
                                color: "#ffffff59",
                                fontSize: "11px",
                                fontFamily: "'Urbanist', sans-serif",
                              }}
                            >
                              {CHANNEL_CONFIG[CONVERSATIONS[activeConv].channel].label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span
                          style={{
                            color: "#ffffff4d",
                            fontSize: "10px",
                            fontFamily: "'Urbanist', sans-serif",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Sesión actual
                        </span>
                        {[
                          { label: "Tiempo respuesta", value: "1.2 s" },
                          { label: "Mensajes IA", value: "3 / 3" },
                          { label: "Resolución", value: "Automática" },
                          { label: "CSAT estimado", value: "4.9" },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span
                              style={{
                                color: "#ffffff47",
                                fontSize: "10px",
                                fontFamily: "'Urbanist', sans-serif",
                              }}
                            >
                              {label}
                            </span>
                            <span
                              style={{
                                color: "#ffffffcc",
                                fontFamily: "'Urbanist', sans-serif",
                                fontWeight: 700,
                                fontSize: "12px",
                              }}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span
                          style={{
                            color: "#ffffff4d",
                            fontSize: "10px",
                            fontFamily: "'Urbanist', sans-serif",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Canales activos
                        </span>
                        {(["whatsapp", "instagram", "telegram", "email", "sms"] as Channel[]).map(
                          (channel) => {
                            const { color, label, Icon } = CHANNEL_CONFIG[channel];

                            return (
                              <div
                                key={channel}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span style={{ color, display: "flex" }}>
                                    <Icon size={12} />
                                  </span>
                                  <span
                                    style={{
                                      color: "#ffffff66",
                                      fontSize: "11px",
                                      fontFamily: "'Urbanist', sans-serif",
                                    }}
                                  >
                                    {label}
                                  </span>
                                </div>
                                <motion.span
                                  animate={{ opacity: [1, 0.4, 1] }}
                                  // eslint-disable-next-line react-hooks/purity
                                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 1.5 }}
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: color,
                                    display: "block",
                                  }}
                                />
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
