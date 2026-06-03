import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WHATSAPP_MESSAGE =
  "Halo Authentic Perfumes, saya ingin konsultasi parfum dan cek stok terbaru.";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-xl shadow-ink/20 transition hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-paper"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Authentic Perfumes on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
