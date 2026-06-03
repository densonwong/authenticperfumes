const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";

export function buildWhatsAppUrl(message: string, phone = DEFAULT_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(productName: string, url: string, size?: string) {
  const sizeText = size ? ` ukuran ${size}` : "";
  return `Halo Authentic Perfumes, saya tertarik dengan produk ${productName}${sizeText}. Mohon informasi stok dan harga terbaru. ${url}`;
}
