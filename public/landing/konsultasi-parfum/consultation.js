'use strict';
const form = document.getElementById('consult-form');
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
function selectedIntent() { return form.elements.intent.value; }
function updateMode() {
  const mode = modes[selectedIntent()];
  document.getElementById('intent-description').textContent = mode.description;
  document.getElementById('preference-label').textContent = mode.label;
  fields.preference.placeholder = mode.placeholder;
  document.getElementById('occasion-label').textContent = mode.occasionLabel;
  fields.occasion.placeholder = mode.occasionPlaceholder;
}
form.querySelectorAll('input[name="intent"]').forEach(input => input.addEventListener('change', updateMode));
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
  lines.push('Saya menghubungi dari /konsultasi-parfum AuthenticPerfumes8.');
  return lines.join('\n');
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));
  const url = 'https://wa.me/6282310001899?text=' + encodeURIComponent(buildMessage(selectedIntent(), values));
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
