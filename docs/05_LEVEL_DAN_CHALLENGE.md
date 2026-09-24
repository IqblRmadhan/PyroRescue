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

### Challenge 3 — Memasok Air ke Pos 2

Pemain pergi ke Pos 2 dan memberikan seluruh muatan kepada penjaga pos.

```python
air_pos_2 = isi_air
```

Efek:

```text
Nilai isi_air diberikan ke persediaan Pos 2. Setelah berhasil, isi_air pemain menjadi 0 dan Level 1 selesai.
```

---

# Level 2 — Hutan Gambut Berasap

## Materi
Perulangan `for`.

## Tujuan Pembelajaran
Pemain mampu menggunakan `for` dan `range()` untuk menjalankan aksi berulang sesuai kebutuhan misi.

## Misi
Memadamkan beberapa titik api dengan jumlah penyemprotan sesuai kebutuhan.

### Challenge 1 — Kenali Perulangan

```python
for i in range(3):
    semprot()
```

### Challenge 2 — Menentukan Jumlah Iterasi

```python
for i in range(2):
    semprot()
```

### Challenge 3 — Variabel + Perulangan

```python
jumlah_semprot = 3

for i in range(jumlah_semprot):
    semprot()
```

### Evaluasi

Pemain menghadapi titik api baru dan menentukan jumlah iterasi sendiri.

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
