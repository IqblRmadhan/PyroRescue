# PyroRescue — Dokumentasi Teknis Awal

Dokumentasi ini dibuat sebagai panduan implementasi awal **PyroRescue** dengan struktur yang sederhana dan mudah dibaca.

## Stack

- Backend: Laravel 13
- Frontend: Blade + JavaScript
- Game 2D: Phaser.js 3
- Build tool: Vite
- Database: MySQL / MariaDB
- Database manager: phpMyAdmin
- UI: CSS sederhana terlebih dahulu

## Fokus MVP

1. Login / register.
2. Menu utama.
3. Pemilihan 3 level.
4. Editor kode sederhana.
5. Tombol `Run Code`, `Hint`, dan `Reset`.
6. Kode memengaruhi aksi game.
7. Feedback kesalahan.
8. Progress level tersimpan.
9. Ending setelah Level 3.

## Prinsip utama

```text
Masalah misi
↓
Pemain menulis kode Python
↓
Kode divalidasi
↓
Hasil kode diterjemahkan menjadi aksi game
↓
Phaser menampilkan aksi
↓
Misi berhasil / gagal
↓
Feedback diberikan
```

## Materi

- Level 1: Variabel
- Level 2: Perulangan `for`
- Level 3: `if/else` + integrasi materi sebelumnya

## Catatan keamanan

Untuk versi awal, jangan mengeksekusi kode Python bebas langsung di server Laravel. Gunakan **validator terbatas** yang hanya menerima pola Python yang memang dibutuhkan pada tiga level.

Contoh pola:

```python
isi_air = 3
```

```python
for i in range(3):
    semprot()
```

```python
if ukuran_api == "besar":
    semprot(3)
else:
    semprot(1)
```

Pendekatan ini lebih sederhana dan cukup untuk prototype PPL.

## Urutan baca

1. `01_ARSITEKTUR_SISTEM.md`
2. `02_STRUKTUR_FOLDER.md`
3. `03_DATABASE.md`
4. `04_LOGIKA_GAME.md`
5. `05_LEVEL_DAN_CHALLENGE.md`
6. `06_VALIDASI_KODE_PYTHON.md`
7. `07_ROUTE_CONTROLLER_MODEL.md`
8. `08_PHASER_DAN_UI.md`
9. `09_SETUP_DAN_ROADMAP.md`
