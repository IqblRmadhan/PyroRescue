# Arsitektur Sistem PyroRescue

## Pembagian tanggung jawab

```text
Laravel
├── autentikasi
├── data level
├── progress pemain
└── database

JavaScript
├── editor kode
├── validator kode
├── tombol Run / Hint / Reset
└── penghubung Laravel dengan Phaser

Phaser.js
├── karakter
├── map
├── api
├── air
├── animasi
└── perubahan kondisi misi
```

## Alur data

```text
Laravel Blade
↓
Halaman game ditampilkan
↓
Pemain menulis kode
↓
JavaScript membaca kode
↓
CodeValidator memeriksa kode
↓
Jika valid, hasil dikirim ke Phaser
↓
Phaser menjalankan aksi visual
↓
Jika challenge selesai, progress dikirim ke Laravel
↓
Laravel menyimpan ke MySQL
```

## Laravel menangani

- login / register / logout;
- daftar level;
- data challenge;
- progress pemain;
- halaman menu;
- halaman progress;
- penyimpanan hasil level.

Laravel **tidak perlu** mengatur gerakan karakter setiap frame.

## Phaser menangani

- render area game;
- karakter;
- api;
- air;
- collision sederhana;
- animasi semprot;
- kondisi berhasil / gagal secara visual.

## Validator kode menangani

1. Syntax sederhana.
2. Nilai yang dimasukkan pemain.
3. Apakah konsep target digunakan.
4. Aksi yang harus dikirim ke Phaser.

Contoh hasil validator:

```js
{
    syntaxValid: true,
    conceptValid: true,
    missionSuccess: true,
    message: 'Api berhasil dipadamkan.',
    actions: {
        water: 3,
        sprayCount: 3
    }
}
```

## Kenapa struktur ini dipilih?

Kelebihan:

- mudah dipelajari;
- kode tidak terlalu bercampur;
- Laravel fokus pada aplikasi web;
- Phaser fokus pada game;
- cukup untuk proyek tiga level;
- lebih aman daripada menjalankan kode bebas di server.

Kekurangan:

- validator belum menjadi interpreter Python penuh;
- solusi pemain masih dibatasi pada pola yang didukung.

Untuk proyek PPL, pembatasan ini masih masuk akal selama dijelaskan dengan jelas.
