# Level 3 Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti story pembuka Level 3 dengan empat ilustrasi khusus dan narasi yang telah disetujui, mengikuti tampilan Level 1 dan 2.

**Architecture:** Data empat adegan tetap didefinisikan di Blade yang sama. Markup story dibuat generik untuk semua level dengan menghapus cabang potret khusus Level 3; dialog pemandu gameplay tetap tidak berubah.

**Tech Stack:** Laravel 13, Blade, PHPUnit

**Spec:** `docs/superpowers/specs/2026-10-23-level-3-story-design.md`

## Global Constraints

- Gunakan Blade dan JavaScript biasa; jangan menambahkan framework atau package.
- Jangan mengubah gameplay, validator, progres, tutorial, atau aset.
- Pertahankan empat adegan dan navigasi story yang sudah ada.
- Jangan mengubah story Level 1 dan Level 2.

## Review Focus

- Keempat gambar Level 3 harus tampil berurutan dari `1.png` sampai `4.png`.
- Keempat narasi yang disetujui harus muncul tanpa teks briefing lama.
- Story Level 3 tidak boleh lagi merender `story-portrait` atau `data-speaker`.
- Potret dan metadata dialog pemandu gameplay Level 3 harus tetap tersedia.
- Story Level 1 dan Level 2 harus tetap memakai aset dan teksnya saat ini.

---

### Task 1: Story pembuka Level 3

**Files:**
- Modify: `tests/Feature/Level3PageTest.php`
- Modify: `resources/views/game/prototype.blade.php`

**Interfaces:**
- Consumes: `$isLevel3`, `$storyScenes`, dan komponen navigasi story yang sudah ada.
- Produces: HTML story Level 3 berisi empat gambar `assets/story/level3/{1..4}.png` dan empat narasi yang disetujui tanpa markup potret story.

- [ ] **Step 1: Ubah pengujian story Level 3 agar menggambarkan hasil yang diinginkan**

  Pada `test_guest_can_open_level_three_with_rescue_briefing_and_no_saved_progress`, periksa empat path gambar dan empat narasi baru. Pastikan respons tidak memuat `story-portrait--commander`, `story-portrait--player`, atribut `data-speaker` pada story, path peta lama sebagai gambar story, atau kalimat briefing lama. Tetap periksa `data-guide-portrait` dan aset karakter untuk dialog gameplay.

- [ ] **Step 2: Jalankan pengujian untuk memastikan perubahan belum diterapkan**

  Run: `php artisan test tests/Feature/Level3PageTest.php --filter=test_guest_can_open_level_three_with_rescue_briefing_and_no_saved_progress`

  Expected: FAIL karena view masih memakai peta berulang, teks lama, dan potret story.

- [ ] **Step 3: Perbarui data empat adegan Level 3**

  Di `resources/views/game/prototype.blade.php`, gunakan `assets/story/level3/1.png` sampai `4.png`, narasi persis dari spec, dan teks alternatif yang menggambarkan Komandan di pos, anggota tiba di jalur hutan, bekantan terkepung api, serta Komandan memulai operasi.

- [ ] **Step 4: Hapus presentasi speaker khusus dari story Level 3**

  Hapus `side`/`speaker` dari data Level 3, atribut `data-speaker` khusus story, serta blok `<img class="story-portrait ...">`. Jangan mengubah markup `mission-guide` di bagian gameplay.

- [ ] **Step 5: Jalankan pengujian terfokus**

  Run: `php artisan test tests/Feature/Level3PageTest.php`

  Expected: seluruh pengujian pada file tersebut PASS.

- [ ] **Step 6: Jalankan regresi halaman Level 1 dan 2**

  Run: `php artisan test tests/Feature/Level1PageTest.php tests/Feature/Level2PageTest.php`

  Expected: seluruh pengujian PASS dan story kedua level tidak berubah.

- [ ] **Step 7: Jalankan suite lengkap**

  Run: `php artisan test`

  Expected: seluruh suite PASS.

- [ ] **Step 8: Commit perubahan**

  ```bash
  git add docs/superpowers/specs/2026-10-23-level-3-story-design.md docs/superpowers/plans/2026-10-23-level-3-story.md tests/Feature/Level3PageTest.php resources/views/game/prototype.blade.php
  git commit -m "feat: refresh level 3 opening story"
  ```
