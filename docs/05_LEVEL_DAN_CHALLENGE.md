# Level dan Challenge PyroRescue

# Level 1 — Tepi Sungai Terbakar

## Materi
Variabel.

## Tujuan Pembelajaran
Pemain mampu membuat, mengubah, dan menggunakan variabel sederhana sesuai kebutuhan misi.

## Misi
Menyiapkan jumlah air dan memadamkan titik api pertama.

### Challenge 1 — Kenali Variabel

```python
jumlah_air = 3
```

Efek:

```text
Tangki air terisi 3 unit.
```

### Challenge 2 — Mengubah Nilai

```python
jumlah_air = 2
```

Efek:

```text
Indikator air berubah menjadi 2.
```

### Challenge 3 — Menggunakan Variabel

```python
jumlah_air = 2
semprot(jumlah_air)
```

### Evaluasi

Pemain diberi kondisi baru tanpa contoh lengkap.

Contoh:

```text
Api membutuhkan 4 unit air.
```

Pemain menyusun:

```python
jumlah_air = 4
semprot(jumlah_air)
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
