# Level 2 Guidance Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengurangi dialog Level 2 dengan menampilkan arahan singkat saat perjalanan, materi saat tiba di api, dan satu feedback setelah challenge.

**Architecture:** Pertahankan state challenge dan event perubahan posisi yang sudah ada. `MissionGuide` menentukan materi berdasarkan lokasi, sedangkan `main.js` mengosongkan editor sekali di pompa dan menggabungkan hasil challenge dengan arah berikutnya.

**Tech Stack:** Vanilla JavaScript, Phaser.js 3, Blade

**Spec:** `docs/superpowers/specs/2026-10-24-level-2-guidance-flow-design.md`

## Global Constraints

- Jangan mengubah peta, validator, kebutuhan air, atau penyimpanan progres.
- Jangan mengubah Level 1 dan Level 3.
- Jangan menambahkan package.
- Jangan menjalankan test atau push, sesuai instruksi pengguna.

## Review Focus

- Dialog pompa tidak menyebut sintaks dan PyroPad kosong agar pemain mengetik sendiri.
- Materi Challenge 1 tidak tampil sebelum pemain tiba di api dan memakai istilah aksi, bukan fungsi.
- Challenge 1-3 hanya menghasilkan satu feedback penyelesaian tanpa judul "Misi berhasil".
- Materi Challenge 2 membedah `for i in range(1):`, tanda `:`, indentasi, dan penggunaan Tab.
- Evaluasi tetap mandiri tanpa materi, kisi-kisi, atau hint.

---

### Task 1: Konten dan waktu kemunculan materi

**Files:**
- Modify: `resources/js/game/Level2Challenges.js`
- Modify: `resources/js/game/MissionGuide.js`
- Modify: `resources/js/game/CodeAutocomplete.js`

- [ ] Gunakan istilah aksi untuk `semprot()` dan bahasa Challenge 1-3 pada dialog.
- [ ] Jelaskan `range(1)`, tanda `:`, indentasi, dan Tab pada materi Challenge 2.
- [ ] Tampilkan analogi Level 2 hanya saat `atFire` dan hilangkan code panel dari dialog.
- [ ] Abaikan feedback assignment air khusus Level 2.

### Task 2: Editor pompa dan antrean dialog

**Files:**
- Modify: `resources/js/game/ChallengeStarterCode.js`
- Modify: `resources/js/game/main.js`

- [ ] Jangan menyediakan scaffold `isi_air = ...` di pompa Level 2.
- [ ] Kosongkan PyroPad satu kali ketika pemain pertama tiba di pompa Challenge 1.
- [ ] Gabungkan penjelasan hasil dan `nextMessage` pada Challenge 1-3.
- [ ] Jangan tambahkan pesan outcome berstatus `success` untuk Level 2.

### Task 3: Dokumentasi alur

**Files:**
- Modify: `docs/05_LEVEL_DAN_CHALLENGE.md`
- Modify: `docs/08_PHASER_DAN_UI.md`

- [ ] Jelaskan urutan pompa, editor kosong, materi di titik api, dan feedback gabungan.
- [ ] Tinjau diff dan whitespace tanpa menjalankan test.
