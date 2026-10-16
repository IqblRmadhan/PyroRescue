# Level dan Challenge PyroRescue

# Level 1 — Variabel Persediaan Air

## Materi
Variabel.

## Tujuan Pembelajaran
Pemain mampu membuat, mengubah, dan menggunakan nilai variabel sederhana melalui persediaan air.

## Misi
Menyiapkan persediaan air untuk pos pemadam. Level 1 belum memiliki aksi memadamkan api.

### Tutorial Gerak

Pemain mempelajari perintah gerak dasar:

```python
atas(1)
bawah(1)
kanan(1)
kiri(1)
```

### Challenge 1 — Mengambil Air

Pemain menuju pompa, lalu menyimpan tiga unit air ke dalam variabel:

```python
isi_air = 3
```

Efek:

```text
Pompa bergerak dan tangki pemain terisi 3 unit.
```

### Challenge 2 — Mengubah Nilai di Pos 1

Pemain membawa 3 unit air dari pompa. Penjaga Pos 1 memberikan 2 unit tambahan untuk dikirim ke Pos 2, sehingga muatan pemain menjadi 5 unit.

```python
isi_air = 5
```

Efek:

```text
Indikator air berubah dari 3 menjadi 5 setelah pemain menerima 2 unit bantuan dari Pos 1.
```

Penjelasan untuk pemain: `isi_air = 3` adalah muatan dari pompa. Pos 1 memberi
2 unit lagi, sehingga `3 + 2 = 5`. Karena assignment mengganti nilai variabel,
`isi_air = 5` menyimpan **jumlah akhir**, bukan menambahkan 5 unit baru.

### Challenge 3 — Memasok Air ke Pos 2

Pemain pergi ke Pos 2 dan memberikan seluruh muatan kepada penjaga pos.

```python
air_pos = isi_air
```

Efek:

```text
Nilai isi_air diberikan ke persediaan Pos 2. Setelah berhasil, isi_air pemain menjadi 0.
```

Pemain kemudian mengikuti jalan ke kanan sampai petak **FINISH** di ujung map.
Ini menjadi tahap evaluasi akhir setelah ketiga challenge selesai. Hasil
badge ditentukan oleh persentase permainan. Semua challenge dan evaluasi yang
selesai membuka Level 2 tanpa batas nilai minimum.
Pengosongan `isi_air` adalah aturan game saat air
diserahkan; assignment Python biasa hanya menyalin nilai.

---

# Level 2 — Hutan Gambut Berasap

## Materi
Perulangan `for`.

## Tujuan Pembelajaran
Pemain mampu menggunakan `for` dan `range()` untuk menjalankan aksi berulang sesuai kebutuhan misi.

## Misi
Memadamkan beberapa titik api dengan jumlah penyemprotan sesuai kebutuhan.
Dekat jalan setelah jembatan terdapat pompa air tanpa lapisan latar tambahan
di atas gambar peta. Di penanda bawah pompa, pemain mengulang
materi Level 1 dengan menulis `isi_air = 6`.
Enam unit dipakai untuk dua semprotan di C1, satu di C2, dan tiga di C3.
Setiap `semprot()` mengurangi `isi_air` satu unit menurut aturan game.
Pompa menerima assignment sebagian sampai kapasitas enam unit. Contohnya,
`isi_air = 3` menghasilkan `3/6`; menjalankan nilai yang sama lagi tetap `3/6`
karena assignment mengganti nilai. Nilai lebih dari enam ditolak.

### Challenge 1 — Mengenal Semprotan (area tengah)

```python
semprot()
semprot()
```

Api membutuhkan **2 semprotan**. Gunakan sprite `LEVEL2-C1.png`.
Sebelum menuju C1, pemain harus mengisi tangki di pompa.

### Challenge 2 — Mengulang Semprotan (kanan atas)

```python
for i in range(1):
    semprot()
```

Api membutuhkan **1 semprotan**, dengan `for/range`. Gunakan sprite `LEVEL2-C2.png`.

### Challenge 3 — Variabel + Perulangan (kanan bawah)

```python
jumlah_semprot = 3

for i in range(jumlah_semprot):
    semprot()
```

### Evaluasi

Api ketiga membutuhkan **3 semprotan** dan memakai sprite `LEVEL2-C3.png`.
Setelah tiga api latihan padam, pemain mengikuti jalan bawah ke area evaluasi.
Di sana tersedia pompa kedua dan satu api terakhir dengan sprite
`LEVEL2-EVAL.png`. Pompa kedua berada di rumput sebelah kiri jalan bawah dan
tetap memakai kapasitas tangki enam unit. Pemain mengambil minimal 3 unit air,
memakai variabel `jumlah_semprot` bersama `for/range()` untuk memadamkannya,
lalu menuju petak FINISH. Panel materi, kamus, autocomplete, dan tombol Hint
disembunyikan selama evaluasi. Nilai dan bintang dihitung setelah FINISH dicapai.

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

# Level 3 — Suaka Bekantan

Implementasi mengikuti **Modul-PyroRescue.pdf, BAB III, halaman 18–23**.
Rancangan lama berdasarkan `ukuran_api` diganti dengan Boolean `api_padam`.

## Misi dan kondisi

Pemain memadamkan api habitat, memeriksa keselamatan bekantan, lalu menentukan
status dengan `if/else`. Sistem game memperbarui `api_padam` setelah semprotan;
pemain tidak dapat mengisi variabel kondisi ini sendiri.

Map sementara menggunakan `level3-map.png` dan `shadow_level3.png` (1600 × 1200).
Pohon terbakar, pompa, karakter, marker, serta animasi dipakai kembali dari Level 2.
Pose bekantan dibaca dari `objects/Bekantan.png`. Story Level 2 dipakai sementara
sesuai permintaan; pembelajaran dan misi di PyroPad tetap materi Level 3.

### Challenge 1 — Memadamkan Api di Habitat

Di titik biru pompa, ambil 3 unit melalui `isi_air = 3`. Kapasitas tangki 6 unit.
Datangi titik merah api di pulau tengah dan gunakan:

```python
jumlah_semprot = 3
for i in range(jumlah_semprot):
    semprot()
```

Setiap semprotan memakai satu unit air. Setelah 3 semprotan, sistem mengubah
`api_padam` menjadi `True`. Semprotan kurang dapat dilanjutkan pada Run berikutnya.
Semprotan berlebih ditolak sebelum aksi dijalankan.

### Challenge 2 — Memeriksa Kondisi dengan if

Api dari C1 tetap padam. Dari penanda api, turun dua petak ke penanda bekantan.

```python
if api_padam:
    status_bekantan = "aman"
```

HUD menampilkan `BEKANTAN: AMAN`. Jika kondisi False, blok if dilewati.

### Challenge 3 — Dua Jalur dengan if/else

Tetap di penanda bekantan dan tentukan tindakan untuk kedua keadaan:

```python
if api_padam:
    status_bekantan = "selamat"
else:
    status_bekantan = "tunggu"
```

Kedua cabang divalidasi, tetapi hanya cabang sesuai kondisi aktual yang dijalankan.
C1–C3 memakai habitat yang sama; api tidak dinyalakan ulang saat pindah challenge.

### Evaluasi — Penyelamatan Lengkap

Ikuti jembatan ke pompa di pulau tengah, lalu turun ke pulau bawah. Siapkan 4 unit
air. Api terakhir membutuhkan 4 semprotan. Di titik merah evaluasi, tulis satu
program dengan variabel `jumlah_semprot`, `for/range(jumlah_semprot)`, dan
`if/else` setelah perulangan. Program yang berhasil menjalankan empat semprotan
dan menghasilkan status `selamat`. Pemain kemudian turun satu petak ke FINISH.

Jika semprotan kurang, percabangan membaca False dan menghasilkan `tunggu`.
Gunakan Ulangi untuk memperbaiki program lengkap dari checkpoint evaluasi.
Gerakan serta pengisian pompa boleh dijalankan terpisah. Selama evaluasi, materi,
kamus, autocomplete, dan Hint tidak tersedia.

## Checkpoint dan hasil

- C1: posisi awal, tangki kosong, api habitat menyala.
- C2: penanda api habitat, api padam, status tunggu.
- C3: penanda bekantan, api padam, status aman.
- Evaluasi: penanda pompa kedua, tangki kosong, api evaluasi menyala.

Reset hanya mengulang challenge aktif. Akun menyimpan empat tahap secara
berurutan; bintang diberikan menurut nilai setelah evaluasi dan FINISH. Tamu tidak
menyimpan progres. Level 3 terbuka setelah Level 2 selesai untuk akun dan selalu
tersedia dalam mode tamu. Hasil akhir menampilkan penyelesaian ketiga level.
