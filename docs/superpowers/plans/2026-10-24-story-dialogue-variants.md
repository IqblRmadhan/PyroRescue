# Story Dialogue Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membedakan narasi, Komandan, dan Tim Pemadam secara konsisten pada story Level 1, 2, dan 3.

**Architecture:** Data adegan tetap berada di Blade dan field opsional `speaker` dipetakan ke tipe `commander`, `team`, atau `narration`. Modifier kelas pada slide, kotak dialog, dan label pembicara memakai CSS bersama untuk seluruh level.

**Tech Stack:** Laravel 13, Blade, CSS

**Spec:** `docs/superpowers/specs/2026-10-24-story-dialogue-variants-design.md`

## Global Constraints

- Gunakan Blade dan CSS yang sudah ada tanpa package baru.
- Jangan mengubah gambar story atau dialog gameplay.
- Jangan menjalankan test, commit, atau push.

## Review Focus

- Adegan tanpa `speaker` harus tetap tanpa label dan memakai gaya narasi.
- `KOMANDAN` harus mendapat varian krem/merah pada semua level.
- `TIM PEMADAM` harus mendapat varian biru pada semua level.
- Teks dengan label pembicara harus berupa ucapan langsung.
- Tata letak mobile dan typewriter harus tetap memakai aturan bersama.

---

### Task 1: Data dan tipe pembicara story

**Files:**
- Modify: `resources/views/game/prototype.blade.php`
- Modify: `tests/Feature/Level3PageTest.php`

**Interfaces:**
- Consumes: field opsional `$scene['speaker']`.
- Produces: tipe `commander`, `team`, atau `narration` dan kelas modifier yang sesuai.

- [ ] Tambahkan `TIM PEMADAM` pada adegan keempat Level 1 dan 2 serta ubah teksnya menjadi ucapan langsung.
- [ ] Ubah teks berlabel pembicara Level 3 menjadi ucapan langsung.
- [ ] Petakan nilai `speaker` ke modifier kelas pada slide, dialog, dan label.
- [ ] Selaraskan assertion teks Level 3 tanpa menjalankan test.

### Task 2: Gaya Tim Pemadam

**Files:**
- Modify: `resources/css/app.css`

**Interfaces:**
- Consumes: kelas `story-slide--team`, `story-dialogue--team`, dan `story-speaker--team`.
- Produces: kotak dialog dan label biru yang berbeda dari Komandan serta narasi.

- [ ] Pisahkan warna label Komandan dari struktur dasar label.
- [ ] Tambahkan warna kotak, label, dan caret Tim Pemadam.
- [ ] Tinjau diff dan whitespace tanpa menjalankan test.
