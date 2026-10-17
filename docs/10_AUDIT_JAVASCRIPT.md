# Audit JavaScript PyroRescue

Tanggal: 17 Oktober 2026.

## Tindak lanjut implementasi

Penyederhanaan setelah audit sudah diterapkan:

- File JS aplikasi berkurang dari **40 menjadi 35**.
- `Level1Learning`, `Level2Learning`, dan `Level3Learning` diganti satu
  `LearningPanel`; data materi disimpan bersama `Level*Challenges`.
- `DamageFeedback` digabung ke `GameFeedback`, dan `FinishPoint` ke `MapMarkers`.
- Pengaturan tombol audio dipusatkan di `GameAudio`, sehingga `main.js` berfokus
  pada alur halaman game.
- Bootstrap Axios, dependency Axios, helper jarak yang tidak dipakai,
  flag kegagalan peta yang tidak dibaca, callback progres yang tidak digunakan,
  serta data pencapaian yang tidak dibaca frontend sudah dibersihkan.
- Empat masalah perilaku di bawah sudah diperbaiki: indentasi nonstandar,
  penggabungan token Level 1, batas aksi, dan penguncian reset/tutorial.
- Tes regresi validator ditambahkan. Tes browser `tests/browser/game-ui.mjs`
  mencakup reset/tutorial, feedback, materi, audio, dan penyelesaian semua level.

Hasil verifikasi: 140 tes JS lulus, 4 tes halaman Laravel lulus (134 assertion),
build Vite berhasil, dan ketiga level diselesaikan sampai FINISH dalam browser
mode tamu tanpa error JavaScript. Tes untuk helper feedback yang sudah tidak
digunakan dihapus; pengujian pesan error aktual tercakup oleh tes browser.

Bagian berikut mempertahankan hasil audit awal sebagai catatan masalah sebelum
perbaikan; nomor baris dan nama file lama di dalamnya mengacu ke keadaan saat audit.

## Cakupan dan kesimpulan

Audit mencakup inventaris dan hubungan import seluruh `resources/js`, peninjauan
validator, pengendali halaman game, scene, bantuan belajar, audio, dan progres.
Bagian yang dicurigai diuji langsung dengan Node.js dan browser lokal.
Ini bukan verifikasi menyeluruh setiap jalur gameplay atau audit backend.

- Ada **40 file JavaScript**, dengan **5.582 baris** termasuk komentar/baris kosong
  di dalam file, tanpa baris kosong pada akhir file.
- Seluruh 40 file dapat dicapai dari `app.js` melalui import statis/dinamis.
  Tidak ditemukan modul JavaScript yang sepenuhnya terlepas dari aplikasi.
- Jumlah file bukan masalah utama. Beban tanggung jawab terkonsentrasi pada
  `main.js`, sementara sebagian aturan/data yang sama tersebar di beberapa file.
- Semua **139 tes JavaScript yang ada lulus**, tetapi empat kasus di bawah belum
  terdeteksi oleh suite tersebut.
- Audit ini tidak mengubah implementasi JavaScript.

## Temuan perilaku yang dikonfirmasi

Semua temuan berikut berprioritas **P2**: perlu diperbaiki, tetapi bukan bukti
eksekusi kode Python bebas atau kegagalan seluruh aplikasi.

### 1. Level 2 dapat error tanpa umpan balik pada indentasi nonstandar

Lokasi: `resources/js/game/CodeValidator.js:70` dan `resources/js/game/main.js:565`.

Parser mengenali whitespace dengan `\s`, lalu membaca hasil
`body.match(/^[ \t]+/)[0]` tanpa memeriksa apakah hasilnya null.
Baris berindentasi empat non-breaking space (`\u00a0`), yang dapat muncul saat
menyalin kode, masuk ke blok tersebut dan melempar `TypeError`.

Reproduksi: `for i in range(1):\n\u00a0\u00a0\u00a0\u00a0semprot()`.
Browser mengeluarkan `Cannot read properties of null (reading '0')`, sementara
pesan kesalahan editor kosong dan HP tetap 100. Pemanggilan validator berada di
luar blok try/catch eksekusi aksi di `main.js`.

Perbaikan: periksa hasil pencocokan indentasi, tolak whitespace yang tidak
didukung dengan pesan pembelajaran, dan tambahkan tes input tersebut.

### 2. Level 1 menerima sintaks Python yang salah setelah menghapus semua spasi

Lokasi: `resources/js/game/CodeValidator.js:118` dan `:144`.

`line.replace(/[ \t]/g, '')` menggabungkan token yang seharusnya berbeda.
Hasil reproduksi langsung:

| Input | Hasil saat ini |
| --- | --- |
| `isi_ air = 3` | Syntax dan konsep valid, menghasilkan assignment 3 |
| `i s i _ a i r = 3` | Syntax dan konsep valid, menghasilkan assignment 3 |
| `isi_air = 1 2` | Syntax valid, menghasilkan assignment 12 |
| Empat spasi diikuti `isi_air = 3` | Diterima karena indentasi awal dihapus |

Ini dapat mengajarkan aturan sintaks yang salah dan berbeda dari validator
Level 2/3. Perbaikan: izinkan whitespace hanya di batas token yang sah;
jangan mengubah isi identifier atau bilangan sebelum validasi.

### 3. Batas 120 aksi Level 1 tidak mencakup assignment setelah gerakan

Lokasi: `resources/js/game/CodeValidator.js:164`, `:180`, dan `:193`.

`kanan(120)\nisi_air = 3` diterima dan menghasilkan **121 aksi**.
Pemeriksaan jumlah aksi dilakukan pada penambahan gerakan, tetapi assignment
dan transfer langsung ditambahkan lalu `continue`.

Perbaikan: terapkan pemeriksaan jumlah aksi pada setiap jenis command.
Uji batas 120/121 dengan urutan gerakan lalu assignment/transfer.
Temuan ini tentang kontrak validator; jalur peta tetap dapat menghentikan
gerakan sebelum semua aksi tersebut dijalankan.

### 4. Tutorial dapat membuka tombol saat reset masih berlangsung

Lokasi: `resources/js/game/main.js:244`, `:538`, dan `:665`.

`resetChallenge()` menonaktifkan tombol, tetapi tidak mencatat status operasi
yang diperiksa oleh tombol Cara Bermain. Penutupan tutorial memanggil
`setControlsDisabled(false)` meskipun reset belum selesai.

Reproduksi browser: tahan penyelesaian Promise reset, klik Ulangi, buka Cara
Bermain, lalu lewati tutorial. Hasil: reset masih pending, tetapi tombol Run
dan Ulangi sudah aktif. Penundaan hanya dipasang di browser untuk membuat
kondisi timing dapat diuji secara deterministik, tanpa mengedit sumber.

Perbaikan: gunakan status operasi bersama untuk Run dan Reset; penutupan
dialog/tutorial harus menghitung ulang kunci berdasarkan status tersebut.
Jangan menambah beberapa boolean yang saling bertentangan.

## Mengapa JavaScript terasa banyak

| Bagian | Kondisi | Saran |
| --- | --- | --- |
| `main.js` — 745 baris | DOM, audio, dialog, HP, badge, progres, target, dan eksekusi bercampur | Pertahankan alur challenge di sini; pindahkan presentasi dialog dan hasil ke dua modul berlingkup jelas jika refactor dilakukan |
| `Level1Scene.js` — 746 baris | Rendering, animasi, tutorial kamera, dan aksi misi berada dalam satu scene | Scene per level tetap sesuai proyek; ekstrak hanya operasi pemain yang terbukti sama dengan Level 2 |
| `CodeAutocomplete.js` — 426 baris | Data perintah tiga level dan interaksi editor berada bersama | Pisahkan data saran dari perilaku editor bila perlu; tidak perlu satu class untuk setiap jenis perintah |
| Tiga file `Level*Learning.js` | Level 2/3 hanya menyiapkan data untuk renderer Level 1 | Bisa menjadi satu renderer materi dengan data per level, tanpa inheritance Level 2/3 dari Level 1 |
| `Level2Scene` dipakai kembali oleh Level 3 | Penggunaan ulang sudah ada, tetapi rendering/gerakan tetap memakai ukuran literal dan `level2TileToWorld()` | Gunakan `this.map.width`, `height`, dan `tileSize`; jangan menambah kerangka scene generik besar |
| `MissionGuide.js` — 137 baris | Arahan posisi, penjelasan aksi, dan antrean dialog | Ukurannya masih wajar; angka kebutuhan misi sebaiknya membaca definisi challenge agar tidak berbeda dari aturan game |

Pemecahan berdasarkan fitur seperti `ProgressSync`, `GameAudio`, `StoryIntro`,
`MapCameraControls`, validator, serta data map/aset/challenge tetap berguna.
Menggabungkan semuanya demi menurunkan jumlah file akan memperbesar beban baca.

## Kandidat pembersihan kecil

Pencarian referensi pada sumber aplikasi dan tes menemukan:

- `bootstrap.js` memuat Axios untuk semua halaman, tetapi tidak ada pemanggilan
  Axios di aplikasi; pengiriman progres menggunakan `fetch`. Evaluasi penghapusan
  import/bootstrap serta dependency secara bersamaan, bukan menghapus file saja.
- `getOutcomeFeedback()` di `GameFeedback.js` hanya dipanggil tes, bukan alur game.
  Tes ini tidak membuktikan perilaku feedback aktual di `main.js`.
- `isWithinOneTile()` di `Level1Map.js` tidak ditemukan pemanggilnya;
  `isNextTo()` hanya dipakai tes. Hapus helper yang tidak diperlukan beserta
  tes khusus helper tersebut, atau hubungkan ke perilaku aplikasi yang nyata.
- `mapLoadFailed` di `Level1Scene` hanya ditulis. Fallback peta memakai
  `textures.exists('levelMap')`, sehingga flag itu tidak menentukan perilaku.
  Fallback itu sendiri masih terpakai dan bukan kandidat penghapusan otomatis.
- `ProgressSync.onSaved` tidak diberi callback oleh aplikasi saat ini.
- `data-earned-achievements` dirender Blade, tetapi tidak dibaca JavaScript.

Export yang hanya dipakai di dalam file sendiri dan oleh tes **tidak otomatis
merupakan kode mati**; contohnya helper autocomplete dan geometri label.

## Urutan perbaikan yang disarankan

1. Perbaiki empat masalah perilaku di atas, dengan tes regresi yang mereproduksi
   input dan urutan interaksi sebenarnya.
2. Bersihkan dependency/helper/data sisa yang sudah dibuktikan tidak terpakai.
3. Satukan renderer materi dan hilangkan duplikasi nilai aturan challenge.
4. Rapikan tanggung jawab `main.js` secara bertahap; jangan memindahkan semua
   fungsi menjadi file kecil atau menambah framework/package.
5. Ulangi tes JS dan pemeriksaan browser untuk Run, Reset, tutorial, transisi
   challenge, evaluasi, dan penyimpanan progres setelah refactor.

Targetnya adalah alur yang mudah ditelusuri mahasiswa, bukan angka jumlah file
tertentu. Perubahan besar pada sumber data level/challenge perlu dicocokkan
terlebih dahulu dengan dokumentasi Laravel dan implementasi yang sekarang.
