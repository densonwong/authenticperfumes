"use client";

import Script from "next/script";

declare global {
  interface Window {
    initializeFragranceConsultation?: () => void;
  }
}

export function ConsultationScript() {
  return (
    <Script
      id="fragrance-consultation-form"
      src="/landing/konsultasi-parfum/consultation.js"
      strategy="afterInteractive"
      onReady={() => window.initializeFragranceConsultation?.()}
    />
  );
}
