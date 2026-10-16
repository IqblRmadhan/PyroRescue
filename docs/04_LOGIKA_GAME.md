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
2. mengosongkan editor kode;
3. menghapus feedback aktif.

Pada Level 1, editor otomatis mengganti kode gerakan dengan placeholder assignment
satu kali setelah seluruh gerakan dalam Run selesai dan pemain berhenti tepat
di penanda biru atau merah challenge aktif. Melewati penanda tidak mengganti kode.

Tidak perlu reload seluruh halaman.

## Level selesai jika

```text
challenge 1 selesai
AND challenge 2 selesai
AND challenge 3 selesai
AND evaluasi selesai
```

Pada Level 1, evaluasi akhir dimulai setelah air sampai di Pos 2. Pemain menuju
FINISH untuk memeriksa hasil tiga challenge. Jika challenge atau evaluasi belum
selesai, pemandu meminta pemain menyelesaikan semua misi; permainan tetap aktif.
HP awal 100; kode tidak valid atau aksi salah mengurangi 5, tabrakan mengurangi 10.
Keduanya membuat karakter memerah, kamera bergetar, dan tepi peta memerah singkat.
Saat HP habis, level aktif diulang dari Challenge 1 dengan HP 100; pencapaian
terbaik akun tetap tersimpan. Tombol Ulangi tetap mengulang challenge aktif.
Seluruh challenge dan evaluasi wajib terpenuhi untuk menyelesaikan level dan
membuka level berikutnya. Persentase hanya menentukan kualitas badge:
Tuntas di bawah 70%, Perunggu 70–84%, Perak 85–99%, dan Emas 100%.
Badge penyelesaian muncul dari kanan layar, termasuk pada mode tamu tanpa simpan.
