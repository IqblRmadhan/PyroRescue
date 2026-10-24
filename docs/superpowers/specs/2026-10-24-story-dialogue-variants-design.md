# Rancangan Variasi Dialog Story

## Tujuan

Menyamakan cara membedakan narasi, ucapan Komandan, dan ucapan Tim Pemadam pada story Level 1, 2, dan 3.

## Tampilan

- Narasi tidak memiliki label pembicara dan memakai kotak gelap netral.
- Komandan memiliki label `KOMANDAN`, kotak krem, dan aksen merah.
- Tim Pemadam memiliki label `TIM PEMADAM`, kotak biru gelap, dan aksen biru muda.
- Seluruh variasi tetap memakai ilustrasi penuh tanpa potret karakter tambahan.

## Isi Adegan

- Level 1 dan 2: dua adegan awal tetap narasi, adegan ketiga tetap Komandan, dan adegan keempat menjadi ucapan langsung Tim Pemadam.
- Level 3: adegan pertama dan keempat adalah Komandan, adegan kedua adalah Tim Pemadam, dan adegan ketiga tetap narasi.
- Teks pada adegan berlabel pembicara ditulis sebagai ucapan langsung, bukan narasi orang ketiga.

## Pendekatan

- Dipilih: field `speaker` menentukan modifier kelas bersama untuk `commander`, `team`, atau `narration` pada semua level.
- Tidak dipilih: CSS khusus tiap level karena akan menggandakan aturan dan membuat tampilan mudah berbeda.
- Tidak dipilih: menentukan jenis dialog dari isi teks karena rapuh dan sulit dibaca.

## Batasan

- Tidak mengubah gambar story atau dialog pemandu selama gameplay.
- Tidak menambahkan package atau komponen baru.
- Tidak menjalankan test, commit, atau push sesuai instruksi pengguna sebelumnya.
