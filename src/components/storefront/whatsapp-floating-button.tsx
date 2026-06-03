import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WHATSAPP_MESSAGE =
  "Halo Authentic Perfumes, saya ingin konsultasi parfum dan cek stok terbaru.";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-ink/20 transition hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366]/70 focus:ring-offset-2 focus:ring-offset-paper"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Authentic Perfumes on WhatsApp"
    >
      <svg
        className="h-6 w-6"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.04 3.2A12.72 12.72 0 0 0 5.2 22.62L3.84 28.8l6.32-1.48A12.76 12.76 0 1 0 16.04 3.2Zm0 2.35a10.4 10.4 0 1 1-5.3 19.34l-.45-.27-3.34.78.72-3.27-.3-.48A10.4 10.4 0 0 1 16.04 5.55Zm-4.1 4.65c-.22 0-.58.08-.88.4-.3.33-1.15 1.13-1.15 2.75s1.18 3.18 1.35 3.4c.17.22 2.28 3.65 5.64 4.97 2.8 1.1 3.37.88 3.98.83.61-.05 1.97-.8 2.25-1.58.28-.78.28-1.45.2-1.58-.08-.13-.3-.22-.63-.38-.33-.17-1.97-.97-2.27-1.08-.3-.12-.53-.17-.75.16-.22.34-.86 1.08-1.05 1.3-.2.22-.39.25-.72.09-.33-.17-1.4-.52-2.66-1.65-.98-.88-1.65-1.96-1.84-2.3-.2-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.2.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.75-1.8-1.03-2.47-.27-.64-.54-.55-.75-.56l-.64-.01Z" />
      </svg>
    </a>
  );
}
