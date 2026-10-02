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
air_pos_2 = isi_air
```

Efek:

```text
Nilai isi_air diberikan ke persediaan Pos 2. Setelah berhasil, isi_air pemain menjadi 0.
```

Pemain kemudian mengikuti jalan ke kanan sampai petak **FINISH** di ujung map.
Setelah ketiga challenge selesai dan petak itu dicapai, layar hasil Level 1
menampilkan tiga bintang. Pengosongan `isi_air` adalah aturan game saat air
diserahkan; assignment Python biasa hanya menyalin nilai.

---

# Level 2 — Hutan Gambut Berasap

## Materi
Perulangan `for`.

## Tujuan Pembelajaran
Pemain mampu menggunakan `for` dan `range()` untuk menjalankan aksi berulang sesuai kebutuhan misi.

## Misi
Memadamkan beberapa titik api dengan jumlah penyemprotan sesuai kebutuhan.
Dua pohon di atas jalan dekat jembatan digantikan pompa air, sedangkan dua
pohon di bawah jalan tetap terlihat. Di penanda bawah pompa, pemain mengulang
materi Level 1 dengan menulis `isi_air = 6`.
Enam unit dipakai untuk dua semprotan di C1, tiga di C2, dan satu di C3.
Setiap `semprot()` mengurangi `isi_air` satu unit menurut aturan game.

### Challenge 1 — Mengenal Semprotan (area tengah)

```python
semprot()
semprot()
```

Api membutuhkan **2 semprotan**. Gunakan sprite `LEVEL2-C1.png`.
Sebelum menuju C1, pemain harus mengisi tangki di pompa.

### Challenge 2 — Mengulang Semprotan (kanan atas)

```python
for i in range(3):
    semprot()
```

Api membutuhkan **3 semprotan**, dengan `for/range`. Gunakan sprite `LEVEL2-C2.png`.

### Challenge 3 — Variabel + Perulangan (kanan bawah)

```python
jumlah_semprot = 1

for i in range(jumlah_semprot):
    semprot()
```

### Evaluasi

Api ketiga membutuhkan **1 semprotan** dan memakai sprite `LEVEL2-C3.png`.
Setelah ketiga api padam, pemain mengikuti jalan bawah sampai petak FINISH
untuk menerima hasil tiga bintang. Belum ada titik api evaluasi keempat.

Nomor file sprite mengikuti urutan challenge: C1 di tengah = 2 semprotan,
C2 di kanan atas = 3 semprotan, dan C3 di kanan bawah = 1 semprotan.

Gerakan memakai `atas(n)`, `bawah(n)`, `kanan(n)`, dan `kiri(n)` seperti Level 1.
Semprotan hanya bekerja pada penanda api aktif. Semprotan yang kurang tetap
mengurangi kebutuhan api; Run berikutnya melanjutkan dari keadaan itu. Jumlah
semprotan yang melebihi sisa kebutuhan ditolak sebelum aksi berjalan. Reset
mengembalikan posisi dan api challenge aktif ke checkpoint, sementara api
challenge sebelumnya tetap padam. C2 harus memakai loop, sedangkan C3 harus
memakai `jumlah_semprot` dalam `range()` pada setiap Run yang menyemprot.
Checkpoint C2 mengembalikan empat unit air, dan checkpoint C3 satu unit air.

---

# Level 3 — Suaka Bekantan

## Materi
Percabangan `if/else`.

## Tujuan Pembelajaran
Pemain mampu menentukan tindakan berdasarkan kondisi serta menggabungkan variabel dan perulangan.

## Misi
Menentukan tindakan berdasarkan ukuran api untuk membuka jalur menuju bekantan.

### Challenge 1 — Kenali Kondisi

```python
if ukuran_api == "besar":
    semprot(3)
```

### Challenge 2 — If/Else

```python
if ukuran_api == "besar":
    semprot(3)
else:
    semprot(1)
```

### Challenge 3 — Integrasi

```python
if ukuran_api == "besar":
    jumlah_semprot = 3
else:
    jumlah_semprot = 1

for i in range(jumlah_semprot):
    semprot()
```

### Evaluasi Akhir

Pemain menggunakan:

```text
variabel
+
perulangan
+
percabangan
```

dengan bantuan minimal untuk menyelesaikan misi penyelamatan.
