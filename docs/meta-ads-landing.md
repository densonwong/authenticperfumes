# Landing page traffic Meta Ads

Route: `/konsultasi-parfum` (Bahasa Indonesia, sengaja tidak memakai layout katalog).

## Lokasi source

- `src/app/(campaign)/layout.tsx`: root layout halaman kampanye dan Vercel Analytics.
- `src/app/(campaign)/konsultasi-parfum/page.tsx`: route Next.js, metadata noindex, dan pemuatan script form.
- `src/app/(campaign)/konsultasi-parfum/landing-content.ts`: seluruh copy dan markup versi landing page yang disetujui pemilik.
- `src/app/(campaign)/konsultasi-parfum/landing.css`: desain landing page.
- `public/landing/konsultasi-parfum/consultation.js`: form opsional yang menyiapkan pesan WhatsApp.
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

Belum ditambahkan Meta Pixel, CAPI, GA4, atau custom event klik WhatsApp. Form tidak menyimpan isian di server atau mengirimnya ke analytics. Semua tombol WhatsApp hanya menyiapkan percakapan; pelanggan tetap mengirim sendiri.

## Persetujuan

Perubahan ini disiapkan untuk review lokal. Jangan push atau deploy sebelum pemilik menyetujui.
