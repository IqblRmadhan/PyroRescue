# Aset visual PyroRescue

Gambar berikut disediakan pengguna dan disalin tanpa mengubah PNG aslinya.

| File sumber | Lokasi dalam project |
| --- | --- |
| `image-gen-6(2).png` | `public/assets/ui/buttons.png` |
| `image-gen-8(2).png` | `public/assets/ui/icons.png` |
| `image-gen-7(1).png` | `docs/design-references/level-result.png` |
| `image-gen-8(1).png` | `docs/design-references/mission-complete.png` |
| `ChatGPT Image Sep 12, 2026, 09_21_34 AM.png` | `docs/design-references/path-map.png` |
| `air.png` | `public/assets/tiles/water.png` |
| `tanah.png` | `public/assets/tiles/ground.png` |
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

Challenge 1 menggunakan assignment `isi_air` setelah pemain mencapai pompa. Belum ada aksi memadamkan api pada tahap ini; Reset mengembalikan kondisi awal. Validator tidak menjalankan Python bebas.

Dalam checkout ini belum ada halaman login atau desain khusus halaman login. Halaman game tersedia di `/game/1` dan `/game-test`.
