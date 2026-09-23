# Setup dan Roadmap Implementasi

## Setup Laravel 13

Buat project:

```bash
laravel new pyrorescue
cd pyrorescue
```

Install dependency frontend:

```bash
npm install
```

Install Phaser:

```bash
npm install phaser
```

## Database

Buat database di phpMyAdmin:

```text
pyrorescue_db
```

Contoh `.env`:

```env
APP_NAME=PyroRescue
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pyrorescue_db
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan username dan password MySQL kalian.

Jalankan migration:

```bash
php artisan migrate
```

## Menjalankan project

Cara ringkas:

```bash
composer run dev
```

Atau terpisah:

```bash
php artisan serve
```

dan:

```bash
npm run dev
```

## Import game ke Vite

Di `resources/js/app.js`:

```js
import './bootstrap';
import './game/main';
```

Di layout Blade:

```php
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

---

# Roadmap

## Tahap 1 — Project dasar

Checklist:

```text
[ ] Laravel berjalan
[ ] database terkoneksi
[ ] login/register berjalan
[ ] halaman /levels tampil
[ ] canvas Phaser tampil
```

## Tahap 2 — Prototype Level 1

Gunakan placeholder dulu.

Target:

```python
isi_air = 3
```

mengubah indikator game menjadi:

```text
Air: 3
```

Checklist:

```text
[ ] editor bekerja
[ ] Run Code bekerja
[ ] validator variabel bekerja
[ ] isi air berubah
[ ] challenge selesai setelah air berhasil diambil di pompa
```

## Tahap 3 — Challenge system

Tambahkan:

```text
[ ] challenge 1
[ ] challenge 2
[ ] challenge 3
[ ] starter code
[ ] hint
[ ] feedback
```

## Tahap 4 — Progress

Ketika Level 1 selesai:

```text
Level 1 → completed
Level 2 → unlocked
```

## Tahap 5 — Level 2

Checklist:

```text
[ ] for/range terbaca
[ ] jumlah iterasi terbaca
[ ] penyemprotan berulang
[ ] terlalu sedikit → api belum padam
[ ] solusi tanpa for → konsep belum terpenuhi
```

## Tahap 6 — Level 3

Tambahkan:

```text
if
else
variabel
loop
```

## Tahap 7 — Assessment

Setiap Run menghasilkan:

```text
syntax_valid
concept_valid
mission_success
```

## Tahap 8 — Tutorial

Cukup empat halaman:

```text
1. Area game
2. Editor kode
3. Run Code
4. Hint dan Feedback
```

## Tahap 9 — Aset final

Setelah logika stabil, baru tambahkan:

- sprite karakter;
- api;
- air;
- tile;
- bekantan;
- asap;
- animasi.

## Prioritas ketika waktu sempit

1. gameplay;
2. pembelajaran;
3. validasi kode;
4. progress;
5. tutorial;
6. UI;
7. animasi tambahan.
