# AGENTS.md

## Project
PyroRescue adalah game edukasi Python berbasis web dengan konteks kebakaran hutan Kalimantan.

## Technology
- Laravel 13
- Blade
- Vanilla JavaScript
- Phaser.js 3
- MySQL / MariaDB
- phpMyAdmin
- Vite

## Main References
Sebelum mengimplementasikan fitur, baca dokumentasi berikut:
- docs/00_README.md
- docs/01_ARSITEKTUR_SISTEM.md
- docs/02_STRUKTUR_FOLDER.md
- docs/03_DATABASE.md
- docs/04_LOGIKA_GAME.md
- docs/05_LEVEL_DAN_CHALLENGE.md
- docs/06_VALIDASI_KODE_PYTHON.md
- docs/07_ROUTE_CONTROLLER_MODEL.md
- docs/08_PHASER_DAN_UI.md
- docs/09_SETUP_DAN_ROADMAP.md

## Coding Rules
- Gunakan kode yang sederhana dan mudah dibaca mahasiswa.
- Jangan membuat arsitektur berlebihan.
- Jangan gunakan React atau Vue.
- Gunakan Blade dan JavaScript biasa.
- Jangan membuat admin panel.
- Jangan menggunakan microservice.
- Jangan menambahkan package jika tidak diperlukan.
- Gunakan fitur bawaan Laravel sebisa mungkin.
- Setiap class dan method harus memiliki tanggung jawab yang jelas.
- Nama variabel harus mudah dipahami.
- Hindari abstraction yang belum diperlukan.

## Game Architecture
Laravel menangani:
- authentication
- level data
- challenge data
- progress pemain
- database

JavaScript menangani:
- editor kode
- tombol Run, Hint, Reset
- validator kode
- komunikasi dengan Phaser

Phaser menangani:
- game scene
- karakter
- api
- air
- aksi visual
- kondisi misi

## Python Code Safety
Jangan pernah menjalankan arbitrary Python dari pemain menggunakan:
- exec()
- shell_exec()
- system()
- command shell langsung

Versi awal hanya mendukung subset Python yang dibutuhkan oleh challenge:
- variable assignment
- semprot(...)
- for ... in range(...)
- if / else

## Development Approach
Kerjakan fitur secara bertahap.
Jangan mengimplementasikan seluruh game sekaligus.

Urutan:
1. database
2. authentication
3. level select
4. prototype game page
5. Phaser prototype
6. Level 1
7. progress
8. Level 2
9. Level 3
10. tutorial
11. polish UI

## Important
Jika dokumentasi dan implementasi bertentangan, jangan menebak.
Jelaskan konflik terlebih dahulu sebelum membuat perubahan besar.