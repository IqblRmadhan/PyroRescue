# Rancangan Alur Pemandu Level 2

## Tujuan

Mengurangi jumlah dialog Level 2 agar pemain lebih banyak bergerak dan mencoba kode, sementara materi hanya muncul tepat ketika dibutuhkan.

## Alur yang Dipilih

### Challenge 1

1. Saat mulai, pemandu hanya menyuruh pemain menuju pompa.
2. Saat tiba di pompa, pemandu menyuruh pemain mengisi tangki dengan 6 unit air tanpa menampilkan sintaks atau materi.
3. PyroPad dikosongkan satu kali di pompa agar pemain mengetik sendiri kode pengisian air.
4. Setelah air terisi, pemandu langsung mengarahkan pemain menuju titik kebakaran Challenge 1.
5. Saat tiba, materi menjelaskan bahwa `semprot()` adalah aksi game dan misi membutuhkan dua penyemprotan.
6. Setelah kode dijalankan, satu feedback menjelaskan hasil pemadaman dan pengurangan air otomatis, sekaligus mengarahkan pemain menuju Challenge 2.
7. Tidak ada dialog terpisah berjudul "Misi berhasil".

### Challenge 2

1. Pemain langsung menuju titik kebakaran Challenge 2 berdasarkan feedback sebelumnya.
2. Saat menginjak titik merah, pemandu membuka materi "Barusan kita menulis `semprot()` dua kali. Bagaimana kalau...".
3. Materi membedah `for`, variabel penghitung `i`, `range(1)`, tanda `:`, dan indentasi pada baris berikutnya menggunakan Tab.
4. Misinya adalah menjalankan satu penyemprotan melalui `for i in range(1):`.
5. Setelah berhasil, satu feedback menjelaskan hasil perulangan sekaligus mengarahkan pemain menuju Challenge 3.

### Challenge 3

1. Pemain langsung menuju titik kebakaran Challenge 3.
2. Materi baru muncul saat tiba dan menjelaskan variabel `jumlah_semprot`, `range(jumlah_semprot)`, serta banyaknya perulangan.
3. Setelah berhasil, satu feedback menjelaskan hasil kode sekaligus mengarahkan pemain menuju evaluasi.

### Challenge 4

Evaluasi tetap mandiri tanpa materi, kisi-kisi, atau hint. Arahan hanya menyebut tujuan lapangan: siapkan air, padamkan api evaluasi, lalu capai FINISH.

## Aturan Dialog

- Satu kejadian hanya menghasilkan satu halaman dialog yang relevan.
- Feedback hasil kode dan arah ke challenge berikutnya digabung.
- Kotak "COBA DI PYROPAD - LENGKAPI BAGIAN ..." tidak ditampilkan pada dialog Level 2.
- Editor tetap kosong di pompa Challenge 1; kerangka kode hanya masuk saat pemain tiba di titik api.
- Dialog error tetap dipertahankan karena dibutuhkan untuk memperbaiki kode.
- Label peta tetap memakai C1, C2, dan C3; dialog memakai Challenge 1, Challenge 2, dan Challenge 3.

## Pendekatan

- Dipilih: memakai event posisi dan penyelesaian challenge yang sudah ada, lalu menyederhanakan isi antrean dialog Level 2.
- Tidak dipilih: membangun state machine baru seperti Level 3 karena alur Level 2 tetap linear dan tidak memerlukannya.
- Tidak dipilih: menghapus seluruh feedback karena pemain masih membutuhkan penjelasan hubungan kode dengan aksi game.

## Batasan

- Tidak mengubah peta, posisi pompa/api, kebutuhan air, validator, atau mekanisme penyimpanan progres.
- Tidak mengubah alur Level 1 dan Level 3.
- Tidak menambahkan package.
