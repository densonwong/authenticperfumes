# Landing page traffic Meta Ads

Route: `/konsultasi-parfum` (Bahasa Indonesia, sengaja tidak memakai layout katalog).

## Lokasi source

- `src/app/(campaign)/layout.tsx`: root layout halaman kampanye dan Vercel Analytics.
- `src/app/(campaign)/konsultasi-parfum/page.tsx`: route Next.js, metadata noindex, Meta Pixel, dan pemuatan script form.
- `src/app/(campaign)/konsultasi-parfum/consultation-script.tsx`: pemuatan dan inisialisasi ulang form saat kembali melalui navigasi client Next.js.
- `src/app/(campaign)/konsultasi-parfum/landing-content.ts`: seluruh copy dan markup versi landing page yang disetujui pemilik.
- `src/app/(campaign)/konsultasi-parfum/landing.css`: desain landing page.
- `public/landing/konsultasi-parfum/consultation.js`: form opsional, pelacakan aksi konsultasi, dan interaksi landing page.
- `public/landing/konsultasi-parfum/assets/`: satu foto koleksi dan lima testimoni asli.

Tidak ada tautan menuju route ini dari menu, footer, katalog, atau halaman website lain. Route tidak ditambahkan ke sitemap. Metadata `noindex, nofollow` mengurangi penemuan lewat mesin pencari; URL tetap bisa diakses dan dibagikan siapa saja.

## Preview lokal

```sh
npm install
npm run dev -- --port 3000
```

Buka `http://localhost:3000/konsultasi-parfum`.
Katalog dapat berjalan memakai seed data tanpa kredensial layanan eksternal.

## URL iklan dan pengukuran

Setelah mendapat persetujuan pemilik dan diterbitkan, gunakan:

```text
https://www.authenticperfumes8.com/konsultasi-parfum?utm_source=meta&utm_medium=paid_social&utm_campaign=nama_kampanye&utm_content=nama_iklan
```

Gunakan nama kampanye dan iklan yang konsisten. Vercel Analytics dipasang pada layout ini seperti layout katalog; aktifkan Web Analytics di project Vercel jika belum aktif. Filter berdasarkan path `/konsultasi-parfum` untuk melihat pengunjung dan page views. Pengiriman analytics produksi belum diuji di localhost.

Jumlah kunjungan path tidak sama dengan jumlah chat atau pesanan. Tidak adanya internal link tidak menjamin seluruh kunjungan berasal dari iklan (tautan bisa dibagikan, dibuka langsung, atau dibaca bot). Gunakan UTM untuk atribusi dengan alat analitik yang mendukungnya; cek juga landing page views di Meta Ads Manager.

Meta Pixel `28899681473026029` memakai kode dasar yang diberikan pemilik dan hanya dipasang pada `/konsultasi-parfum`. Script dimuat setelah halaman interaktif dan mengirim `PageView` sekali saat dokumen dibuka; navigasi anchor seperti `#solusi` tidak mengirim kunjungan tambahan. Beacon `<noscript>` memakai ID dan event yang sama untuk browser tanpa JavaScript. Pemilik sudah mengonfirmasi `PageView` diterima dari Browser dengan status **Diproses** melalui Uji peristiwa setelah pemasangan awal.

### Event konsultasi

| Event | Waktu pencatatan | Arti |
| --- | --- | --- |
| `PageView` | Halaman dibuka | Kunjungan ke landing page. |
| `WhatsAppClick` | Salah satu dari 11 link WA diaktifkan, atau form yang valid disubmit | Pengunjung meminta membuka WhatsApp. |
| `ConsultationFormStart` | Input/perubahan pertama pada form, atau submit pertama tanpa mengisi field opsional | Mulai memakai form; satu kali untuk setiap instance form. |
| `ConsultationFormSubmit` | Form yang valid disubmit | Permintaan menyiapkan pesan WhatsApp dari form. |

Ketiga custom event memakai parameter statis `page`, `cta_id`, `placement`, `intent`, dan `method`. Posisi tombol meliputi hero, solusi, testimoni, FAQ, penutup, footer, dan floating. `intent` membedakan rekomendasi, incaran, rare, cicilan, katalog, dan konsultasi umum. `method` membedakan link langsung dan form. Semua 11 link aktif memiliki `data-wa-cta` yang unik; fallback `<noscript>` tetap berfungsi tetapi tidak dapat mengirim custom event JavaScript.

Setiap aktivasi link menghasilkan satu `WhatsAppClick`; klik kiri, keyboard, Ctrl/Cmd+klik, dan klik tengah didukung. Klik kanan dan aksi yang sudah dibatalkan tidak dicatat. Submit form menghasilkan satu `ConsultationFormSubmit` dan satu `WhatsAppClick`; keduanya adalah dua ukuran untuk tindakan yang sama, sehingga jumlahnya tidak boleh dijumlahkan sebagai jumlah calon pembeli. Pengulangan script pada form yang sama tidak memasang handler ganda.

Event menunggu di antrean memori (maksimal 20) jika bootstrap Pixel belum siap, kemudian dikirim setelah sinyal `consultation-pixel-ready`. Jika library Meta masih mengunduh, antrean bawaan Meta dipakai. Kegagalan pelacakan tidak menunda atau membatalkan pembukaan WhatsApp. Ad blocker, JavaScript nonaktif, dan pemblokiran jaringan tetap dapat menyebabkan event tidak diterima; tidak ada jalur tambahan untuk melewati pemblokiran itu.

Isian nama parfum, ukuran, catatan bebas, nomor telepon, dan URL pesan WhatsApp tidak ditambahkan ke parameter event. Form tetap menyiapkan pesan di browser dan tidak menyimpan isian di server. Meta Pixel tetap memakai perilaku pengumpulan data dasar bawaannya, termasuk konteks halaman.

### Verifikasi sebelum dan setelah publikasi

- Jalankan tes campaign Pixel, landing, dan tracking. Pastikan `PageView` tidak ganda dan setiap tombol/form menghasilkan event yang sesuai tanpa mengirim isi form.
- Setelah pemilik menyetujui push/deploy, buka **Uji peristiwa** untuk Pixel tersebut. Buka landing page dari alat uji, klik WA satu kali, lalu pastikan satu `WhatsAppClick` diterima dengan `cta_id` dan `intent` yang benar.
- Uji masing-masing pilihan form. Periksa `ConsultationFormStart`, `ConsultationFormSubmit`, dan `WhatsAppClick`; pesan di WhatsApp tetap harus dikirim sendiri oleh pelanggan.
- Penerimaan custom event di produksi harus diverifikasi setelah perubahan ini diterbitkan. Pembuatan custom conversion serta pemilihan event di kampanye iklan dilakukan terpisah di akun Meta.

### Chat masuk dan pembelian

Pemilik memakai WhatsApp biasa. Landing page menerima informasi klik menuju WhatsApp, tetapi tidak menerima isi percakapan, status pesan terkirim, atau pembayaran dari WhatsApp. Repo juga belum memiliki checkout, pencatatan order berbayar, CRM, atau webhook WhatsApp. Karena itu `Lead`, chat diterima, dan `Purchase` tidak dikirim otomatis dari klik atau submit form.

Untuk mengukur hasil nyata saat ini, catat chat dan pesanan yang benar-benar diterima secara terpisah, lalu cocokkan dengan penanda `(LG)` pada pesan dari landing page. Otomatisasi chat masuk memerlukan integrasi WhatsApp Business Platform/CRM dan webhook; `Purchase` memerlukan data pesanan dengan konfirmasi pembayaran, ID order unik, nilai, dan mata uang, lalu integrasi server yang mencegah duplikasi. CAPI dan GA4 belum dipasang.

## Persetujuan

Perubahan ini disiapkan untuk review lokal. Jangan push atau deploy sebelum pemilik menyetujui.
