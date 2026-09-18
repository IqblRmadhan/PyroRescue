# Aset visual PyroRescue

Gambar berikut disediakan pengguna dan disalin tanpa mengubah PNG aslinya.

| File sumber | Lokasi dalam project |
| --- | --- |
| `image-gen-1(3).png` | `public/assets/characters/firefighter-sheet.png` |
| `image-gen-2(3).png` | `public/assets/characters/wildlife-sheet.png` |
| `image-gen-3(2).png` | `public/assets/effects/effects-sheet.png` |
| `image-gen-4(2).png` | `public/assets/tiles/terrain-sheet.png` |
| `image-gen-5(2).png` | `public/assets/objects/forest-sheet.png` |
| `image-gen-6(2).png` | `public/assets/ui/buttons-sheet.png` |
| `image-gen-7(2).png` | `public/assets/ui/learning-sheet.png` |
| `image-gen-8(2).png` | `public/assets/ui/icons-sheet.png` |
| `image-gen-7(1).png` | `docs/design-references/level-result.png` |
| `image-gen-8(1).png` | `docs/design-references/mission-complete.png` |
| `ChatGPT Image Sep 12, 2026, 09_22_00 AM.png` | `public/assets/objects/forest-details-sheet.png` |
| `ChatGPT Image Sep 12, 2026, 09_21_34 AM.png` | `docs/design-references/path-map.png` |
| `air.png` | `public/assets/tiles/water-terrain-sheet.png` |
| `tanah.png` | `public/assets/tiles/ground-terrain-sheet.png` |
| `ChatGPT Image Sep 12, 2026, 10_02_10 AM.png` | `docs/design-references/level-1-map-reference.png` |

## Penggunaan pada Level 1

- `resources/js/game/Level1Assets.js` mendefinisikan area tiap sprite dengan `[x, y, lebar, tinggi]` dalam piksel.
- `Level1Scene.js` memuat sheet lalu menambahkan frame melalui `texture.add()` karena jarak antar-sprite tidak seragam.
- Karakter, api, air, sungai, tanah, pohon, pondok, properti, rangkong, dan ikon HUD memakai frame tersebut.
- Tombol Run Code dan Reset serta ikon halaman memakai area gambar melalui CSS di `resources/css/app.css`.
- Seluruh sheet berukuran 1672 × 941 piksel. Jika gambar sumber diganti, periksa kembali koordinat frame dan posisi CSS.
- Mode `pixelArt` Phaser dan CSS `image-rendering: pixelated` menjaga tampilan piksel saat diskalakan.
- `Level1Map.js` menyimpan titik jalur dan posisi awal/api. Grid tersebut hanya dipakai untuk logika dan tidak digambar di layar.
- Map terbaru memakai canvas 800 × 600, grid logika 20 × 15, dan petak 40 × 40. Tekstur diulang di dalam mask tanah/air agar bingkai kotak dari sheet tidak ikut ditampilkan.

## Referensi tampilan

`level-result.png` dan `mission-complete.png` dipakai sebagai acuan warna, kayu, dan suasana hutan. Teks dan tombol dalam gambar adalah isi desain, bukan spesifikasi fitur baru. Skor, bintang, perintah gerakan, halaman ending, dan level lain belum diimplementasikan.

Prototype tetap menggunakan assignment `jumlah_air` dan `semprot(jumlah_air)`. Api padam jika air tepat 2 unit; Reset mengembalikan kondisi awal. Validator tidak menjalankan Python bebas.

Dalam checkout ini belum ada halaman login atau desain khusus halaman login. Halaman game tersedia di `/game/1` dan `/game-test`.
