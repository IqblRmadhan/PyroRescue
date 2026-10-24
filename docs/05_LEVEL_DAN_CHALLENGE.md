# Level dan Challenge PyroRescue

# Level 1 - Variabel Persediaan Air

Level 1 mengajarkan assignment, operator gabungan `+=`, pertambahan, penyalinan, dan perubahan nilai variabel. Kapasitas tangki 5 unit. Semua kode diperiksa oleh validator terbatas, tanpa menjalankan Python bebas.

### Challenge 1 - Mengambil Air

Datangi pompa dan isi tiga unit dengan kode berikut:

```python
isi_air = 3
```

Kisi-kisi PyroPad menampilkan isi_air = ... untuk dilengkapi pemain.

### Challenge 2 - Menambah Air di Pos 1

Bawa tiga unit ke penanda Pos 1, lalu jalankan:

```python
isi_air += 2
```

`+=` membaca nilai lama 3, menambah 2, kemudian menyimpan hasil 5 kembali. Bentuk `isi_air = isi_air + 2` setara dan tetap diterima. Ini berbeda dari `isi_air = 2`, yang mengganti nilainya menjadi 2. Variabel harus berisi nilai sebelum `+=` digunakan. Operator gabungan Python lain seperti `-=`, `*=`, `/=`, `//=`, dan `%=` dijelaskan sebagai perluasan materi, tetapi PyroPad Level 1 hanya menerima penambahan 2 unit di Pos 1. Kedatangan di Pos 1 saja belum menyelesaikan challenge.

### Challenge 3 - Pasok Air ke Pos 2

Bawa lima unit ke penanda Pos 2 dan jalankan kedua baris berurutan dalam satu Run:

```python
air_pos = isi_air
isi_air = 0
```

Baris pertama menyalin nilai 5 ke `air_pos`; nilai `isi_air` masih 5. Baris kedua mengubah `isi_air` menjadi 0. Sebagai alternatif yang mempraktikkan operator gabungan, pemain dapat menjalankan urutan berikut dalam satu Run:

```python
air_pos = 0
air_pos += isi_air
isi_air = 0
```

`air_pos += isi_air` menambahkan 5 ke nilai awal 0, menghasilkan 5. Tanpa `air_pos = 0` terlebih dahulu, operator `+=` tidak memiliki nilai lama untuk dibaca. Pos 2 menerima lima unit setelah salah satu urutan berhasil.

### Evaluasi

Capai FINISH setelah tiga challenge selesai. Evaluasi memeriksa hasil aksi sebelumnya, sehingga pemain memakai perintah gerak dan tidak menulis ulang assignment air di FINISH. Tidak ada kisi-kisi pada evaluasi.
Checkpoint C2 membawa 3 unit dari pompa; checkpoint C3 membawa 5 unit dari Pos 1.

# Level 2 — Hutan Gambut Berasap

## Materi
Perulangan `for`.

## Tujuan Pembelajaran
Pemain mampu menggunakan `for` dan `range()` untuk menjalankan aksi berulang sesuai kebutuhan misi.

## Misi
Memadamkan beberapa titik api dengan jumlah penyemprotan sesuai kebutuhan.
Dekat jalan setelah jembatan terdapat pompa air tanpa lapisan latar tambahan
di atas gambar peta. Di penanda bawah pompa, pemain diminta mengisi tangki
dengan enam unit air. Editor dibiarkan kosong agar pemain mengetik kodenya sendiri.
Enam unit dipakai untuk dua semprotan di C1, satu di C2, dan tiga di C3.
Setiap `semprot()` mengurangi `isi_air` satu unit menurut aturan game.
Pompa menerima assignment sebagian sampai kapasitas enam unit. Contohnya,
`isi_air = 3` menghasilkan `3/6`; menjalankan nilai yang sama lagi tetap `3/6`
karena assignment mengganti nilai. Nilai lebih dari enam ditolak.

Pemandu hanya memberi arahan perjalanan saat pemain belum tiba di lokasi.
Materi challenge baru muncul setelah pemain menginjak penanda merah api.
Setelah C1–C3 selesai, satu feedback menjelaskan hasil kode sekaligus
mengarahkan pemain ke titik berikutnya; tidak ada dialog sukses terpisah.
Kotak kisi-kisi di dalam dialog tidak ditampilkan. Editor tetap kosong di pompa,
sedangkan kerangka kode pemadaman diisikan saat pemain tiba di titik api.

### Challenge 1 — Mengenal Semprotan (area tengah)

```python
semprot()
semprot()
```

Api membutuhkan **2 semprotan**. Gunakan sprite `LEVEL2-C1.png`.
Sebelum menuju C1, pemain harus mengisi tangki di pompa. Materi C1 membahas
bahwa satu `semprot()` memanggil satu aksi dan air berkurang otomatis.

### Challenge 2 — Mengulang Semprotan (kanan atas)

```python
for i in range(1):
    semprot()
```

Api membutuhkan **1 semprotan**, dengan `for/range`. Materi yang muncul di C2
membedah `for`, penghitung `i`, `range(1)`, tanda `:`, dan indentasi blok.
Pemain dapat menekan Tab untuk membuat indentasi pada baris setelah tanda `:`.
Gunakan sprite `LEVEL2-C2.png`.

### Challenge 3 — Variabel + Perulangan (kanan bawah)

```python
jumlah_semprot = 3

for i in range(jumlah_semprot):
    semprot()
```

Materi yang muncul di C3 menjelaskan bahwa `jumlah_semprot` menyimpan angka
yang kemudian dibaca oleh `range()` untuk menentukan banyaknya perulangan.

### Evaluasi

Api ketiga membutuhkan **3 semprotan** dan memakai sprite `LEVEL2-C3.png`.
Setelah tiga api latihan padam, pemain mengikuti jalan bawah ke area evaluasi.
Di sana tersedia pompa kedua dan satu api terakhir dengan sprite
`LEVEL2-EVAL.png`. Pompa kedua berada di rumput sebelah kiri jalan bawah dan
tetap memakai kapasitas tangki enam unit. Pemain mengambil minimal 3 unit air,
memakai variabel `jumlah_semprot` bersama `for/range()` untuk memadamkannya,
lalu menuju petak FINISH. Panel materi, kamus, dan tombol Hint disembunyikan
selama evaluasi. Rekomendasi Ctrl+Space tetap tersedia, tetapi hanya berisi
urutan gerak `atas`, `bawah`, `kanan`, dan `kiri`. Nilai dan bintang dihitung
setelah FINISH dicapai.

Nomor file sprite mengikuti urutan challenge: C1 di tengah = 2 semprotan,
C2 di kanan atas = 1 semprotan, C3 di kanan bawah = 3 semprotan, dan
`LEVEL2-EVAL.png` untuk evaluasi = 3 semprotan.

Gerakan memakai `atas(n)`, `bawah(n)`, `kanan(n)`, dan `kiri(n)` seperti Level 1.
Semprotan hanya bekerja pada penanda api aktif. Semprotan yang kurang tetap
mengurangi kebutuhan api; Run berikutnya melanjutkan dari keadaan itu. Jumlah
semprotan yang melebihi sisa kebutuhan ditolak sebelum aksi berjalan. Reset
mengembalikan posisi dan api challenge aktif ke checkpoint, sementara api
challenge sebelumnya tetap padam. C2 harus memakai loop, sedangkan C3 harus
memakai `jumlah_semprot` dalam `range()` pada setiap Run yang menyemprot.
Checkpoint C2 mengembalikan empat unit air, checkpoint C3 tiga unit air,
dan checkpoint evaluasi memulai dengan tangki kosong di jalan sebelah pompa
kedua.

---

# Level 3 - Operasi Penyelamatan Satwa

Acuan aktif: [Alur Gameplay Level 3 Lengkap](PyroRescue_Alur_Gameplay_Level_3_Lengkap.md).
Dokumen ini menggantikan alur lama satu habitat dan assignment status_bekantan.

- Kapasitas tangki 5. C1 mengambil 4, api pertama memakai 2; C2 isi ulang 5,
  api kedua memakai 3; C3 isi ulang 5 untuk evaluasi dengan 4 semprotan.
- Semua pengisian Level 3 memakai satu pompa di persimpangan tengah. Pompa
  dekat rumah evakuasi tidak digunakan atau ditampilkan. Petak pompa (22,18)
  bertanda biru dan petak keputusan persimpangan (24,18) bertanda merah.
- C1: pos, pompa, keputusan jalur, pemadaman, keputusan penyelamatan, antar ke pos.
- C2: menara, pemeriksaan air kurang/cukup/sama, isi ulang, pemadaman dengan
  percabangan dan for, if bersarang untuk satwa, antar ke pos.
- C3: pengamatan utara, keputusan jembatan, jalur alternatif, pemeriksaan
  hewan/api/jalur bersarang, isi ulang, checkpoint evaluasi. Bekantan ketiga belum dievakuasi.
- Evaluasi: uji jalur berbahaya, satwa bebas, air kurang, air cukup, dan api
  sudah padam. Seluruh kasus wajib lolos sebelum kode mengubah map.
- Bekantan mengikuti pemain, tetapi baru dihitung selamat saat tiba di pos.
  FINISH hanya menyelesaikan level ketika tiga api padam, tiga satwa di pos,
  dan evaluasi lulus.

Gerakan maju/atas berarti utara peta; mundur/bawah berarti selatan. Contoh
mundur(2) pada pemeriksaan air di dokumen sumber disesuaikan menjadi mundur(1)
karena hanya satu petak aman tersedia di selatan api kedua. Konsep keputusan
serta pengujian batas air sama dengan kebutuhan tetap dipertahankan.

Checkpoint disimpan ketika submisi berganti. Reset memulihkan posisi, air,
api, dan satwa dari checkpoint submisi, termasuk satwa yang sudah diantar.
Akun menyimpan snapshot JSON melalui /progress/level3-checkpoint; tamu hanya
menyimpan state sesi. Penyelesaian challenge tetap memakai endpoint progres
lama. Nilai percobaan/hint ikut snapshot; HP habis mengulang Level 3 dari awal.

Story dan dialog Level 3 memakai komandan.png di kanan dan mission-guide.png
sebagai karakter pemain di kiri. Bantuan evaluasi tidak memuat solusi lengkap.

Pembaruan penanda: START Level 3 di (7,18), FINISH di (34,18), sesuai gambar pengguna. Penanda merah api yang belum padam tetap tampak; tujuan aktif lebih terang. Kamera semua level menyorot tujuan setelah challenge selesai, dan Level 3 setelah submisi selesai, lalu kembali mengikuti pemain setelah sekitar dua detik. Potret dialog ditampilkan setengah badan.

Habitat terakhir: lahan cokelat di pulau kiri atas, titik coding (20,4), checkpoint (19,4).
