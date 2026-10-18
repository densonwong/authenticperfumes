(function () {
'use strict';
function getConsultationTracking() {
  const key = '__authenticPerfumesConsultationTracking';
  if (window[key]) return window[key];

  // Only these fixed values may be sent to Meta, never form text or WA URLs.
  const ctas = {
    hero_consultation: { placement: 'hero', intent: 'rekomendasi' },
    hero_catalog: { placement: 'hero', intent: 'katalog' },
    solution_recommendation: { placement: 'solusi', intent: 'rekomendasi' },
    solution_rare: { placement: 'solusi', intent: 'rare' },
    solution_installments: { placement: 'solusi', intent: 'cicilan' },
    testimonial_availability: { placement: 'testimoni', intent: 'incaran' },
    faq_catalog: { placement: 'faq', intent: 'katalog' },
    closing_availability: { placement: 'penutup', intent: 'incaran' },
    footer_catalog: { placement: 'footer', intent: 'katalog' },
    footer_whatsapp: { placement: 'footer', intent: 'konsultasi' },
    floating_whatsapp: { placement: 'floating', intent: 'konsultasi' },
    consultation_form: { placement: 'form', intent: 'rekomendasi' }
  };
  const formIntents = ['rekomendasi', 'incaran', 'rare'];
  const pending = [];

  function deliver(entry) {
    try {
      window.fbq('trackCustom', entry.name, entry.parameters);
    } catch (_) {
      // A blocked or failed tracker must never stop a WhatsApp request.
    }
  }
  function flush() {
    if (typeof window.fbq !== 'function') return;
    pending.splice(0).forEach(deliver);
  }
  function emit(name, parameters) {
    const entry = { name, parameters: { page: 'konsultasi-parfum', ...parameters } };
    if (typeof window.fbq !== 'function') {
      if (pending.length < 20) pending.push(entry);
      return;
    }
    flush();
    deliver(entry);
  }
  function whatsapp(ctaId, intent) {
    if (!Object.prototype.hasOwnProperty.call(ctas, ctaId)) return;
    const cta = ctas[ctaId];
    emit('WhatsAppClick', {
      cta_id: ctaId,
      placement: cta.placement,
      intent: ctaId === 'consultation_form' && formIntents.includes(intent) ? intent : cta.intent,
      method: ctaId === 'consultation_form' ? 'form' : 'link'
    });
  }
  function formEvent(name, intent) {
    if (!['ConsultationFormStart', 'ConsultationFormSubmit'].includes(name)) return;
    emit(name, {
      cta_id: 'consultation_form',
      placement: 'form',
      intent: formIntents.includes(intent) ? intent : 'rekomendasi',
      method: 'form'
    });
  }
  function trackLink(event) {
    if (event.defaultPrevented) return;
    if (event.type === 'auxclick' ? event.button !== 1 : event.button > 0) return;
    const element = event.target.nodeType === 1 ? event.target : event.target.parentElement;
    const link = element && element.closest('a[data-wa-cta]');
    if (!link || link.closest('noscript')) return;
    let destination;
    try { destination = new URL(link.href); } catch (_) { return; }
    if (destination.origin !== 'https://wa.me' || destination.pathname !== '/6282310001899') return;
    whatsapp(link.dataset.waCta);
  }
  document.addEventListener('click', trackLink);
  document.addEventListener('auxclick', trackLink);
  window.addEventListener('consultation-pixel-ready', flush);
  window[key] = { whatsapp, formEvent };
  return window[key];
}

function initializeFragranceConsultation() {
const form = document.getElementById('consult-form');
if (!form) return;
const tracking = getConsultationTracking();
if (form.dataset.consultationReady === 'true') return;
form.dataset.consultationReady = 'true';

const fields = {
  preference: document.getElementById('preference'),
  occasion: document.getElementById('occasion'),
  notes: document.getElementById('notes')
};
const modes = {
  rekomendasi: {
    description: 'Belum tahu namanya? Nama parfum boleh kosong. Ceritakan aroma yang disukai di catatan tambahan.',
    label: 'Nama parfum',
    placeholder: 'Sebutkan parfum yang disukai, jika sudah tahu',
    occasionLabel: 'Ukuran atau varian (opsional)',
    occasionPlaceholder: 'Contoh: 50 ml atau eau de parfum',
    opening: 'Halo AuthenticPerfumes8, saya ingin dibantu memilih parfum.'
  },
  incaran: {
    description: 'Sudah punya incaran? Kirim detailnya untuk cek harga dan ketersediaan.',
    label: 'Nama parfum',
    placeholder: 'Sebutkan brand dan nama parfumnya',
    occasionLabel: 'Ukuran atau varian (opsional)',
    occasionPlaceholder: 'Contoh: 50 ml atau eau de parfum',
    opening: 'Halo AuthenticPerfumes8, saya ingin cek harga dan ketersediaan parfum.'
  },
  rare: {
    description: 'Sulit menemukan parfum tertentu? Kami bantu cek kemungkinan pengadaannya.',
    label: 'Nama parfum',
    placeholder: 'Sebutkan brand, nama, atau edisinya',
    occasionLabel: 'Ukuran atau varian (opsional)',
    occasionPlaceholder: 'Contoh: 100 ml atau edisi tertentu',
    opening: 'Halo AuthenticPerfumes8, saya ingin menanyakan ketersediaan atau pengadaan parfum rare.'
  }
};
function selectedIntent() {
  const value = form.elements.intent.value;
  return Object.prototype.hasOwnProperty.call(modes, value) ? value : 'rekomendasi';
}
function updateMode() {
  const mode = modes[selectedIntent()];
  document.getElementById('intent-description').textContent = mode.description;
  document.getElementById('preference-label').textContent = mode.label;
  fields.preference.placeholder = mode.placeholder;
  document.getElementById('occasion-label').textContent = mode.occasionLabel;
  fields.occasion.placeholder = mode.occasionPlaceholder;
}
form.querySelectorAll('input[name="intent"]').forEach(input => input.addEventListener('change', updateMode));
let formStarted = false;
function trackFormStart() {
  if (formStarted) return;
  formStarted = true;
  tracking.formEvent('ConsultationFormStart', selectedIntent());
}
form.addEventListener('input', trackFormStart);
form.addEventListener('change', trackFormStart);
document.querySelectorAll('[data-select], [data-product]').forEach(link => {
  link.addEventListener('click', () => {
    const intent = link.dataset.product ? 'incaran' : link.dataset.select;
    const radio = form.querySelector('input[value="' + intent + '"]');
    if (radio) radio.checked = true;
    updateMode();
    if (link.dataset.product) fields.preference.value = link.dataset.product;
  });
});
function buildMessage(intent, values) {
  const mode = modes[intent];
  const lines = [mode.opening];
  if (values.preference) lines.push('Nama parfum: ' + values.preference);
  if (values.occasion) lines.push('Ukuran/varian: ' + values.occasion);
  if (values.notes) lines.push('Catatan: ' + values.notes);
  lines.push('(LG)');
  return lines.join('\n');
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.checkValidity()) return;
  const values = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));
  const url = 'https://wa.me/6282310001899?text=' + encodeURIComponent(buildMessage(selectedIntent(), values));
  trackFormStart();
  tracking.formEvent('ConsultationFormSubmit', selectedIntent());
  tracking.whatsapp('consultation_form', selectedIntent());
  window.open(url, '_blank', 'noopener,noreferrer');
});
updateMode();

// On small screens, one visible contact button is enough.
function initContactVisibility() {
  if (!('IntersectionObserver' in window)) return;
  const visibleButtons = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleButtons.add(entry.target);
      else visibleButtons.delete(entry.target);
    });
    document.body.classList.toggle('inline-contact-visible', visibleButtons.size > 0);
  }, { threshold: 0.5 });
  document.querySelectorAll('.button-wa:not(.floating-whatsapp)').forEach(button => observer.observe(button));
}
initContactVisibility();

// Keep the content visible when motion is disabled or the observer is unavailable.
function initLandingMotion() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const elements = document.querySelectorAll(
    '.hero-copy > *, .hero-photo, .service-strip, .section > .eyebrow, ' +
    '.section > h2, .solution-card, .testimonial-card, .faq-list > details, .closing > :not(details)'
  );
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  elements.forEach((element, index) => {
    element.classList.add('scroll-reveal', 'reveal-pending');
    element.style.setProperty('--reveal-delay', (index % 3) * 70 + 'ms');
    observer.observe(element);
  });

  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    elements.forEach(element => element.classList.remove('reveal-pending'));
  });
}
initLandingMotion();
}
window.initializeFragranceConsultation = initializeFragranceConsultation;
initializeFragranceConsultation();
})();
