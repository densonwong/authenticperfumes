# Aksi Massal Produk, Saran Merek, dan Pengelolaan Ukuran

Tanggal: 2026-09-04

## Tujuan dan keputusan pengguna

Menambahkan tiga fitur pada situs Authentic Perfumes 8:

1. Aksi massal Delete, Set Best Seller, dan Set New Product pada dashboard Products.
2. Saran merek saat pelanggan mengetik pada kolom pencarian katalog.
3. Menu dashboard Ukuran Produk untuk mencari dan menghapus varian ukuran lintas merek.

Pengguna menyetujui aturan ukuran terakhir: tampilkan modal konfirmasi, bukan blokir penghapusan. Jika dikonfirmasi, hapus varian tersebut, simpan produk utamanya di dashboard, dan sembunyikan produk dari katalog sampai memiliki ukuran lagi.

## Pendekatan

Dipilih: perluas pengelola Products yang ada dan buat halaman Ukuran Produk tersendiri. Ini menggunakan pola pencarian, checkbox, pilih semua, dan feedback yang sudah dikenal pengguna; sekaligus memisahkan aksi menghapus seluruh produk dari menghapus ukuran.

Alternatif: gabungkan tabel produk dan ukuran dalam satu halaman dengan mode berbeda. Lebih sedikit menu, tetapi lebih mudah salah memilih target penghapusan. Tidak dipilih.

Tidak merombak tampilan situs atau mengganti sistem katalog. Bahasa dashboard mengikuti pola yang ada; teks baru pada storefront mengikuti locale Indonesia/Inggris. Nama merek, produk, dan ukuran tetap dalam bahasa/format sumber.

## 1. Aksi massal pada Products

- Pertahankan pencarian produk/merek, filter ketersediaan, checkbox per produk, pilih semua hasil yang cocok, Set Ready Stock, dan Set Pre Order.
- Tambahkan Delete Selected, Set Best Seller, dan Set New Product. New Product menggunakan penanda new_arrival yang sudah ada, bukan membuat produk baru.
- Best Seller dan New Product hanya mengaktifkan penanda masing-masing; tidak mengubah harga, ukuran, stok, ketersediaan, atau penanda lainnya. Penanda masih dapat dinonaktifkan melalui editor produk yang sudah ada. Tombol massal untuk menonaktifkan penanda tidak termasuk lingkup ini.
- Tampilkan penanda saat ini pada baris produk agar hasil aksi dapat diperiksa.
- Checkbox header memilih semua hasil filter, bukan seluruh katalog tanpa filter. Ketika filter/pencarian berubah, kosongkan pilihan agar tidak ada produk tersembunyi ikut terhapus.
- Modal penghapusan menyebutkan jumlah produk, daftar nama yang dapat digulir, dan bahwa seluruh ukuran produk tersebut juga dihapus. Tombol Batal menjadi fokus awal; tombol hapus jelas berbahaya.
- Delete menghapus record produk dan varian terkait sesuai hubungan database yang sudah ada. Tidak menghapus aset gambar dari penyimpanan eksternal atau record pelanggan secara massal.
- Nonaktifkan aksi/pengubahan seleksi saat permintaan berlangsung. Setelah sukses, perbarui daftar dan kosongkan pilihan; setelah gagal, tampilkan error tanpa mengklaim berhasil.

## 2. Saran merek pada pencarian katalog

- Saat kolom Cari berisi teks, tampilkan daftar merek dengan awalan yang cocok, tanpa membedakan huruf besar/kecil. Contoh c menampilkan merek berawalan C, berurutan A–Z.
- Gunakan daftar merek yang sudah tersedia pada halaman; tidak membutuhkan layanan pencarian tambahan.
- Daftar saran memiliki tinggi terbatas dan scroll sendiri, sehingga banyak hasil tidak memperpanjang seluruh sidebar.
- Memilih merek menyaring katalog ke merek tersebut, mengosongkan query bebas agar tidak menjadi filter ganda yang bertentangan, dan mempertahankan filter ukuran/kategori/ketersediaan lainnya.
- Jika tidak memilih saran, pencarian nama parfum melalui Enter/Terapkan Filter tetap berfungsi seperti sekarang. Enter memilih saran hanya ketika saran telah diaktifkan dengan keyboard.
- Dukung tombol panah, Enter, Escape, klik, dan sentuhan. Sediakan semantik combobox/listbox, label locale-aware, dan pesan bila merek tidak ditemukan.
- Pilihan merek pada dropdown yang sudah ada tetap sinkron dengan pencarian.

## 3. Menu Ukuran Produk

- Tambahkan item sidebar Ukuran Produk dan halaman admin yang dilindungi autentikasi.
- Daftar ukuran berasal dari varian nyata di database, termasuk ukuran custom. Tampilkan semua ukuran dan filter satu ukuran.
- Urutkan ukuran volume secara numerik kecil ke besar, mendukung koma/titik desimal dan spasi. Untuk filter, 1,5ml, 1.5 ml, dan 1,5 ml dianggap volume yang sama; label sumber pada tiap varian tidak ditulis ulang. Label non-volume dicocokkan dengan normalisasi spasi/huruf dan diletakkan setelah ukuran volume.
- Memilih 2 ml menampilkan seluruh varian 2 ml lintas merek. Tabel berisi checkbox, nama produk, merek, ukuran, status, stok, dan tautan Edit produk.
- Tambahkan pencarian produk/merek, checkbox per varian, dan pilih semua hasil filter. Pilihan direset saat filter berubah. Target aksi berupa ID varian, bukan nama ukuran global atau ID produk.
- Delete Selected Sizes hanya menghapus varian yang dicentang. Contoh: menghapus varian 1,5 ml milik Zoologist Lovebird mempertahankan ukuran 10 ml dan 60 ml.
- Modal biasa menyebutkan jumlah varian, ukuran, dan produk terkait. Sebelum menulis, server menghitung apakah pilihan menghapus seluruh varian milik suatu produk, termasuk jika beberapa varian terakhir dipilih bersama-sama.
- Jika produk menjadi tanpa ukuran, modal menegaskan: Ini adalah satu-satunya ukuran produk ini. Yakin ingin menghapusnya? Produk tetap tersimpan di dashboard, tetapi disembunyikan dari katalog sampai ukuran baru ditambahkan. Untuk pilihan massal, tampilkan seluruh nama produk yang akan menjadi tanpa ukuran.
- Tidak ada penghapusan ketika modal dibatalkan. Permintaan tanpa persetujuan eksplisit untuk produk yang kehilangan seluruh ukuran harus ditolak tanpa perubahan.
- Server memvalidasi ulang keadaan terbaru secara transaksional. Jika produk terdampak berbeda dari pratinjau modal karena perubahan bersamaan, minta konfirmasi ulang; jangan memperluas cakupan penghapusan diam-diam.

## 4. Produk tanpa ukuran dan pemulihan tampilan

- Produk tanpa varian tetap ada dan dapat dicari/diedit pada dashboard Products, dengan indikator Tanpa ukuran — tersembunyi dari katalog.
- Semua jalur katalog publik hanya menampilkan produk yang dipublikasikan dan memiliki setidaknya satu varian: shop, halaman merek, slider beranda, pre-order, produk terbaru, terlaris, detail produk, sitemap, dan hitungan produk merek.
- Tautan langsung detail produk tanpa ukuran tidak boleh merender panel pembelian yang rusak; perlakukan sebagai produk tidak tersedia di katalog.
- Visibilitas akibat ketiadaan ukuran merupakan kondisi turunan, bukan perubahan status Ready Stock/Pre Order atau pemaksaan published=true. Produk yang memang tidak dipublikasikan tidak boleh otomatis dipublikasikan.
- Menambahkan ukuran melalui editor produk membuat produk yang sebelumnya dipublikasikan kembali memenuhi syarat tampil. Pastikan editor dapat membuka produk dengan daftar varian kosong dan menambahkan varian pertama.
- Sinkronkan hitungan merek dan invalidasi cache untuk daftar serta detail terkait setelah perubahan. Jangan biarkan ukuran atau halaman produk lama tertinggal dalam cache setelah penghapusan.

## Batas modul dan keselamatan data

- Pisahkan logika seleksi/validasi aksi massal, pengelola daftar varian, normalisasi ukuran, dan saran merek agar setiap bagian dapat diuji sendiri.
- Gunakan endpoint admin terautentikasi dan validasi UUID, tipe aksi, ID duplikat, serta batas maksimal 2.000 target per operasi. Batas berlaku pada target produk atau varian sesuai endpoint.
- Aksi massal database bersifat atomik: seluruh target valid diproses bersama atau tidak ada yang berubah. Target yang sudah hilang menghasilkan permintaan refresh, bukan laporan sukses palsu.
- Penghapusan varian menggunakan operasi terarah pada ID varian; jangan membaca lalu mengganti semua varian produk karena bisa menimpa perubahan lain.
- Pertahankan proteksi akses database dan pola transaksi/RPC yang sudah ada. Jangan membuka mutasi untuk pengguna publik.
- Pengujian hapus menggunakan mock atau database pengujian. Permintaan fitur ini tidak mengizinkan menghapus data produksi nyata untuk demonstrasi.
- Tidak mencakup tempat sampah/undo, penghapusan gambar eksternal, atau perubahan produk live yang dipilih oleh pengembang. Modal harus menjelaskan bahwa record yang dihapus tidak memiliki fitur pemulihan langsung.

## Kriteria penerimaan dan verifikasi

- Products dapat memilih satu/banyak/seluruh hasil filter untuk ketiga aksi baru; penanda hanya berubah pada target pilihan.
- Pembatalan modal tidak memanggil mutasi. Aksi hapus menampilkan jumlah dan target yang tepat.
- Ketik c menampilkan merek berawalan C; pemilihan saran dan pencarian bebas bekerja dengan mouse maupun keyboard pada /id dan /en.
- Filter 2 ml pada Ukuran Produk mencakup semua merek dan variasi format volume yang setara, tanpa mengubah label data sumber.
- Menghapus satu varian mempertahankan varian lainnya. Menghapus varian terakhir memerlukan konfirmasi khusus, mempertahankan record produk, dan menghilangkannya dari seluruh katalog publik.
- Menambahkan varian pertama kembali memulihkan visibilitas hanya bagi produk yang memang dipublikasikan.
- Uji autentikasi, payload tidak valid, ID hilang, rollback transaksi, perubahan data setelah pratinjau, error jaringan, cache, hitungan merek, dan produk tanpa ukuran.
- Jalankan tes unit/komponen/integrasi yang relevan, seluruh tes regresi, build produksi, pemeriksaan tipe, dan uji tampilan desktop/mobile. Jangan menyatakan verifikasi produksi jika hanya diuji lokal.

## Checklist desain

- [x] Periksa konteks dashboard, filter, endpoint, model varian, dan publikasi.
- [x] Tetapkan tidak memerlukan pilihan visual baru; gunakan gaya situs yang ada.
- [x] Klarifikasi penghapusan ukuran terakhir dengan pengguna.
- [x] Bandingkan pendekatan menu terpisah dengan tabel gabungan.
- [x] Konfirmasi alur tiga fitur dan keputusan ukuran terakhir dalam percakapan.
- [x] Tulis spesifikasi dan tinjau konsistensi, batas lingkup, serta keselamatan penghapusan.
- [ ] Pengguna meninjau spesifikasi tertulis.
- [ ] Susun rencana implementasi setelah persetujuan spesifikasi.
