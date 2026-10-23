# Rancangan Story Level 3

## Tujuan

Menyamakan pembuka Level 3 dengan pola visual Level 1 dan Level 2: empat ilustrasi penuh dengan narasi singkat yang mengalir, tanpa potret karakter tambahan pada story.

## Ruang Lingkup

- Gunakan `public/assets/story/level3/1.png` sampai `4.png` secara berurutan.
- Ganti dialog bergantian Komandan/Pemain dengan narasi berikut:
  1. "Komandan menerima laporan bahwa kebakaran hutan semakin meluas dan mulai mengancam habitat bekantan."
  2. "Anggota PyroRescue segera menuju lokasi. Dari kejauhan, api terlihat menyebar di antara pepohonan dan menutup beberapa jalur."
  3. "Sejumlah bekantan terjebak di tengah kepungan api. Mereka harus segera diselamatkan sebelum keadaan semakin berbahaya."
  4. "Padamkan seluruh titik api, selamatkan para bekantan, lalu antar mereka ke Pos Evakuasi dengan aman. Operasi penyelamatan dimulai!"
- Tulis teks alternatif yang menggambarkan isi setiap ilustrasi.
- Hapus atribut speaker dan potret tambahan hanya dari story Level 3.
- Pertahankan dialog pemandu selama gameplay Level 3 dan seluruh story Level 1/2 tanpa perubahan.

## Pendekatan

- Dipilih: mengikuti struktur data story Level 1/2 di `prototype.blade.php`, karena perubahan kecil, konsisten, dan tidak memerlukan JavaScript atau komponen baru.
- Tidak dipilih: mempertahankan potret Komandan/Pemain di atas ilustrasi, karena bertentangan dengan permintaan tampilan gambar penuh seperti Level 1/2.
- Tidak dipilih: membuat view atau komponen story khusus Level 3, karena menambah abstraksi yang belum diperlukan.

## Batasan

- Tidak mengubah gameplay, validator, progres, tutorial, maupun aset.
- Tidak menambahkan package.
- Story tetap terdiri dari empat adegan dan memakai navigasi yang sudah ada.

