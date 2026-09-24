# Panduan membaca kode game

Mulai dari `resources/js/game/main.js`. File ini menghubungkan tombol pada
halaman dengan game. Bagian-bagiannya diberi komentar bernomor agar mudah diikuti.

## Alur saat pemain menekan Run Code

1. `runCode()` membaca teks dari editor.
2. `CodeValidator.validateVariable()` memeriksa apakah perintah didukung.
3. Jika salah, `showFeedback()` menampilkan pesan. Game tidak bergerak.
4. Jika valid, `scene.runCommands()` menjalankan aksi secara berurutan.
5. Scene mengirim keadaan terbaru, seperti posisi dan jumlah air.
6. `renderMissionState()` memperbarui target dan panel belajar.
7. Jika misi berhasil, `advanceChallenge()` melanjutkan challenge.

Kode Python pemain tidak dijalankan langsung. Validator hanya menerjemahkan
perintah yang diizinkan menjadi aksi game.

## Letak kode yang ingin dibaca atau diubah

| Kebutuhan | File di `resources/js/game/` |
| --- | --- |
| Judul, target, dan hint challenge | `Level1Challenges.js` |
| Tombol Run, Ulangi, hint, dan pergantian challenge | `main.js` |
| Saran penulisan kode dan kamus perintah | `CodeAutocomplete.js` |
| Pemeriksaan kode Python yang didukung | `CodeValidator.js` |
| Materi variabel dan penjelasan setiap baris | `Level1Learning.js` |
| Gerakan, animasi, dan kondisi dunia game | `scenes/Level1Scene.js` |
| Posisi jalan, pompa, dan pos | `Level1Map.js` |
| Gambar serta frame animasi | `Level1Assets.js` |

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
