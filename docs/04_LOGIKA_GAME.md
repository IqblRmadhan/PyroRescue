# Logika Game PyroRescue

## Prinsip utama

PyroRescue jangan dibuat seperti:

```text
baca materi
→ jawab soal
→ lanjut game
```

Yang diinginkan:

```text
masalah muncul di dunia game
→ pemain membutuhkan konsep Python
→ pemain menulis kode
→ kode mengubah kondisi game
→ pemain melihat akibatnya
```

## Flow umum

```text
Login
↓
Menu Utama
↓
Pilih Level
↓
Briefing
↓
Challenge
↓
Tulis Kode
↓
Run Code
↓
Validasi
├── syntax salah → feedback
├── konsep belum terpenuhi → feedback pembelajaran
├── hasil misi salah → kondisi game gagal
└── benar → aksi Phaser
↓
Challenge berikutnya
↓
Evaluasi
↓
Level selesai
↓
Unlock level berikutnya
```

## Tiga jenis pemeriksaan

### 1. Syntax Valid

Contoh salah:

```python
for i in range(3)
    semprot()
```

Feedback:

```text
Perulangan membutuhkan tanda ":" setelah range().
```

### 2. Concept Valid

Contoh Level 2:

```python
semprot()
semprot()
semprot()
```

Api bisa saja padam, tetapi target pembelajaran adalah perulangan.

Status:

```text
Misi: berhasil
Konsep perulangan: belum terpenuhi
```

### 3. Mission Success

Contoh:

```python
for i in range(1):
    semprot()
```

Syntax benar dan konsep benar, tetapi api membutuhkan tiga semprotan.

Feedback:

```text
Perulangannya sudah benar, tetapi jumlah penyemprotan masih kurang.
```

## Format hasil validator

```js
{
    syntaxValid: true,
    conceptValid: true,
    missionSuccess: false,
    message: 'Jumlah penyemprotan masih kurang.',
    actions: {
        sprayCount: 1
    }
}
```

## Hint bertahap

Hint 1:

```text
Gunakan perulangan agar perintah semprot tidak perlu ditulis berulang.
```

Hint 2:

```python
for i in range(...):
    semprot()
```

Jangan langsung memberikan jawaban lengkap pada hint pertama.

## Reset

Reset hanya:

1. mengembalikan kondisi misi;
2. mengembalikan starter code;
3. menghapus feedback aktif.

Tidak perlu reload seluruh halaman.

## Level selesai jika

```text
challenge 1 selesai
AND challenge 2 selesai
AND challenge 3 selesai
AND evaluasi selesai
```
