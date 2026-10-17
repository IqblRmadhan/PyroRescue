# Panduan membaca kode game

Mulai dari `resources/js/game/main.js`. File ini menghubungkan tombol pada
halaman dengan game. Bagian-bagiannya diberi komentar bernomor agar mudah diikuti.

## Alur saat pemain menekan Run Code

1. `runCode()` membaca teks dari editor.
2. `CodeValidator` memilih validasi variabel, perulangan, atau percabangan sesuai level.
3. Jika salah, `showCodeError()` menampilkan pesan di bawah editor dan HP berkurang. Game tidak bergerak.
4. Jika valid, `scene.runCommands()` menjalankan aksi secara berurutan.
5. Scene mengirim keadaan terbaru, seperti posisi dan jumlah air.
6. `renderMissionState()` memperbarui target dan panel belajar.
7. Jika misi berhasil, `advanceChallenge()` melanjutkan challenge.

Kode Python pemain tidak dijalankan langsung. Validator hanya menerjemahkan
perintah yang diizinkan menjadi aksi game.

## Letak kode yang ingin dibaca atau diubah

| Kebutuhan | File di `resources/js/game/` |
| --- | --- |
| Judul, target, hint, dan isi materi setiap level | `Level1Challenges.js`, `Level2Challenges.js`, `Level3Challenges.js` |
| Tombol Run, Ulangi, hint, dan pergantian challenge | `main.js` |
| Saran penulisan kode dan kamus perintah | `CodeAutocomplete.js` |
| Pemeriksaan kode Python yang didukung | `CodeValidator.js`, `Level3Validator.js` |
| Tampilan materi untuk semua level | `LearningPanel.js` |
| Arahan posisi dan penjelasan kode yang dijalankan | `MissionGuide.js` |
| Gerakan, animasi, dan kondisi dunia game | `scenes/Level1Scene.js`, `Level2Scene.js`, `Level3Scene.js` |
| Posisi jalan, pompa, dan pos | `Level*Map.js` |
| Gambar serta frame animasi | `Level*Assets.js` |
| Penanda pompa, challenge, dan ubin FINISH | `MapMarkers.js` |
| Efek kerusakan dan aturan suara target | `GameFeedback.js` |
| Musik, efek suara, serta tombol Musik/SFX | `GameAudio.js` |

Run dan Ulangi memakai satu status `operationInProgress` di `main.js`.
`areControlsLocked()` juga mempertimbangkan tutorial, dialog, kesiapan scene,
dan penyelesaian level. Semua pembaruan tombol melalui `updateControls()`.

Susunan halaman ada di `resources/views/game/prototype.blade.php`, sedangkan
warna, ukuran, font, dan tata letaknya ada di `resources/css/app.css`.

## Membaca autocomplete

- `createLevel1Suggestions()`: menyiapkan daftar perintah sesuai challenge.
- `getCompletionContext()`: menemukan baris tempat kursor berada.
- `getAutocompleteMatches()`: mencari perintah sesuai huruf yang diketik.
- `update()` dan `render()`: memperbarui daftar saran di layar.
- `handleKeydown()` dan `handlePointer()`: menangani keyboard, mouse, dan sentuhan.
- `highlightOption()`: menandai saran yang sedang dipilih.
- `renderDocumentation()`: menampilkan penjelasan perintah.
- `choose()`: memasukkan saran ke editor tanpa mengganti baris lain.

Nama `render` berarti memperbarui tampilan. `state` berarti keadaan game saat
ini. `event` berarti kejadian dari pengguna, misalnya klik atau pengetikan.
`async/await` membuat program menunggu aksi selesai sebelum melanjutkan langkah
berikutnya, tanpa membekukan halaman.

## Setelah mengubah kode

Jalankan `npm test` untuk memeriksa logika dan `npm run build` untuk memastikan
JavaScript serta CSS dapat dibangun. Lalu coba ketiga challenge di browser,
termasuk Run, Ulangi, hint, dan autocomplete dengan keyboard maupun sentuhan.

Pemeriksaan integrasi ketiga level tersedia di `tests/browser/game-ui.mjs`.
Dengan server Laravel aktif, jalankan `node tests/browser/game-ui.mjs` memakai
instalasi Playwright yang tersedia. Jika modul berada di luar proyek, isi
`PLAYWRIGHT_MODULE` dengan URL `file:///.../playwright/index.mjs`.
`GAME_URL` dapat mengganti alamat bawaan `http://127.0.0.1:8000`.
Tes menggunakan mode tamu, memeriksa penguncian reset/tutorial dan pesan
validator, lalu menjalankan ketiga level melalui editor sampai FINISH.
