# Phaser dan UI Sederhana

## Splash / halaman awal

- `welcome.blade.php` menampilkan logo dan karakter pemadam PyroRescue,
  pengenalan game, materi, serta ajakan memulai petualangan. Navbar mengarah
  ke Tentang dan Materi; tombol Masuk menuju portal login.
- `splash.css` membatasi gaya pada kelas splash agar tampilan game tidak berubah.
- `PageLoader.js` menampilkan karakter pemadam berlari selama perpindahan
  halaman dari splash dan portal login/register. Aset animasi memakai frame
  berjalan milik game. Pindah mode login/register tetap memakai animasi geser
  di halaman yang sama.
- Portal login/register mempertahankan palet dan animasi gesernya. Tombol
  Lihat/Sembunyikan membantu pemeriksaan kata sandi tanpa mengubah data formulir.
- Logo pada tab browser dipasang melalui partial `partials.favicon` pada splash,
  portal, menu utama, dan halaman game.
- Animasi karakter dan latar mengikuti preferensi `prefers-reduced-motion`.

## Menu, progres, dan pencapaian

- Navbar menu mengarah ke Petualangan, Progres, Pencapaian, dan Modul.
  Carousel tetap memakai ketiga gambar pulau semula dan tombol panahnya;
  navigasi angka di bawah carousel dihapus.
- Akun baru memulai dari Level 1. Level berikutnya terbuka setelah seluruh
  challenge dan evaluasi level sebelumnya selesai, tanpa syarat nilai minimum.
  Tamu tidak memiliki kunci prasyarat.
- `PlayerProgress` menghitung status level, bintang, dan lima pencapaian dari
  `user_level_progress`. Kolom `completed_challenges` menyimpan checkpoint
  terakhir; `score` menyimpan nilai terbaik dan `stars` menyimpan rating 0–3
  untuk kualitas badge, bukan syarat kelulusan.
- `POST /progress/challenge` menerima nomor level dan challenge, memakai identitas
  akun dari sesi, menolak lompatan urutan, dan tidak menulis data tamu. Penyimpanan
  berulang tidak menurunkan progres atau menggandakan bintang.
- `ProgressSync.js` mengantrekan penyimpanan setelah misi berhasil. Gagal menyimpan
  ditampilkan pada layar hasil beserta tombol coba lagi; tautan level berikutnya
  menunggu keberhasilan penyimpanan. Saat game dibuka kembali, checkpoint
  challenge dimuat dari server. Level yang sudah selesai dapat dimainkan ulang.
- Pencapaian Pasokan Pertama, Ahli Variabel, Aksi Berulang, dan Penjaga Hutan
  mengikuti penyelesaian tugas terkait, tanpa tabel atau sistem inventori baru.

## Implementasi ruang belajar Level 1

Halaman game memakai peta di kiri serta daftar Misi, PyroPad, dan tombol aksi
di kanan. Tombol Baca Materi di bawah Run Code membuka popup materi dan kamus
perintah. Pada layar kecil, map dan PyroPad disusun vertikal.
Pemandu tampil sebagai dialog di bagian bawah layar, dengan karakter besar di
kiri dan balon teks di kanan. Latar game sedikit diredupkan selama dialog terbuka.

- `Level1Learning.js` mengganti materi sesuai challenge: membuat variabel,
  mengganti nilai, lalu memakai nilainya.
- Setelah Run gerakan selesai tepat di penanda challenge Level 1, kode gerakan
  diganti satu kali dengan `isi_air = ...` atau `air_pos = ...` sesuai challenge.
  Melewati penanda biru atau merah tidak mengganti kode. Isian juga tidak menimpa
  kode baru yang sedang diketik pemain selama gerakan berjalan.
- Kamus perintah tersedia di popup Baca Materi. Klik tombol
  perintah untuk mengganti penjelasan, termasuk dengan Enter atau Spasi lewat keyboard.
- `atas()`, `bawah()`, `kanan()`, dan `kiri()` merupakan perintah yang disediakan
  game. Materi membedakannya dari assignment Python.
- `air_pos = isi_air` menyalin nilai. Pengosongan tangki setelah penyerahan
  adalah aturan game, bukan perilaku assignment Python.
- Tombol Hint biru, Ulangi merah, dan Suara hijau berada di kanan atas peta.
  Tombol Hapus di samping Run Code mengosongkan editor tanpa mengulang misi.
- `MissionGuide.js` menentukan arahan menurut posisi dan keadaan misi terkini:
  menuju pompa, mengisi air, menuju Pos 1, menuju Pos 2, lalu FINISH.
- Setelah Run, pemandu menjelaskan aksi yang benar-benar selesai. Scene melaporkan
  tiap aksi berhasil melalui callback `onCommandComplete`; aksi yang gagal atau
  belum dijalankan tidak disebut berhasil. Teks kode disalin sebelum Run sehingga
  pergantian isian editor di penanda tidak mengubah penjelasan.
- Tombol Lanjut/Mengerti membaca penjelasan berurutan, kemudian menampilkan
  instruksi berikutnya. Perpindahan challenge dan layar hasil menunggu penjelasan
  terakhir dibaca. Run, Ulangi, dan Hapus dikunci selama rangkaian feedback.
- Dialog menggunakan elemen HTML `dialog` di luar layout game agar tetap di
  bawah viewport dan tidak ikut zoom workspace. Fokus keyboard berada di dalam
  dialog; setelah instruksi ditutup, fokus kembali ke editor dan game aktif lagi.
- Panel masuk dengan animasi naik, karakter bergerak pelan, dan pergantian pesan
  memakai transisi geser/fade. Klik berulang dikunci selama transisi. Preferensi
  `prefers-reduced-motion` mematikan animasi. Escape melakukan aksi yang sama
  dengan tombol Lanjut/Mengerti tanpa melewati antrean penjelasan.
- Potret pemandu memakai `assets/characters/mission-guide.png`, dengan gambar
  asli tetap utuh dan ditampilkan sebagai potret melalui CSS.
- Cubit touchpad (atau Ctrl + scroll) di peta untuk zoom. Geser dua jari atau
  klik dan seret untuk menggeser kamera tanpa tombol tambahan. Zoom keluar
  dibatasi agar map tetap memenuhi area game dan tidak terlalu kecil; zoom masuk
  maksimal 2,5 kali.
- Navigasi manual menghentikan kamera mengikuti pemain. Run atau Reset
  mengaktifkan kembali kamera mengikuti pemain, dengan zoom pilihan pengguna.
- Awan bergerak di atas map dengan bayangan yang tampak di tanah. Awan digambar
  di belakang karakter serta penanda misi agar tidak menutupinya.
- Map Level 1 memakai `level1-map.webp` berukuran 1600 × 1200 di browser.
  `level1-map.png` tetap disimpan sebagai gambar sumber asli.
  Grid mengikuti jalan baru; FINISH berada 15 petak ke kanan dari Pos 2.
- Petak FINISH Level 1 memakai ubin kecil bermotif kotak-kotak di jalan tanpa
  label dan marker merah. Pemain menginjak ubin setelah menyerahkan air untuk
  membuka hasil nilai, badge, dan tautan Level 2 setelah seluruh misi selesai.
- Label pompa, pos, dan kebakaran memakai bentuk papan, panah,
  tipografi, dan aturan zoom yang sama. Warna dibedakan berdasarkan fungsi.
- Tanda POS 1 dan POS 2 berada di atas tenda pada map. Tanda tujuan challenge
  yang sedang aktif tampil lebih terang agar arah perjalanan mudah dikenali.
  Titik biru di pompa tetap terlihat untuk isi ulang. Titik merah challenge yang
  selesai menghilang; titik challenge aktif dan berikutnya tetap terlihat.

## Implementasi Level 2

- `/game/2` memakai layout PyroPad yang sama, dengan materi `semprot()` dan
  `for/range`. Level tersedia dari menu utama dan hasil Level 1.
- `Level2Map.js` mengikuti jalan pada `level2-map.webp` berukuran 1600 × 1200.
  `level2-map.png` tetap disimpan sebagai gambar sumber asli.
  Tiga titik latihan berada di tengah, kanan atas, dan kanan bawah. Titik
  evaluasi berada dekat FINISH di bagian bawah peta.
- Pompa Phaser ditempatkan di dekat jalan setelah jembatan tanpa bidang rumput
  atau lapisan latar tambahan. Sprite pompa Level 1 digunakan ulang;
  pemain mengambil enam unit dengan `isi_air = 6` di penanda bawah pompa.
  HUD menampilkan sisa isi tangki, dan setiap `semprot()` memakai satu unit.
- `Level2Assets.js` membaca setiap sprite api sebagai lima frame 200 × 200:
  empat frame animasi api dan satu frame padam. PNG asli tidak diubah.
- `Level2Challenges.js` menyimpan jumlah semprotan, sprite, materi, dan hint.
  Sprite C1 untuk area tengah (2 semprotan), C2 kanan atas (1 semprotan),
  dan C3 kanan bawah (3 semprotan). Evaluasi memakai `LEVEL2-EVAL.png`
  (3 semprotan).
- Marker evaluasi berada pada petak jalan `(24,27)`, dua petak di atas FINISH.
  Label EVALUASI berada pada posisi `(1100,1080)`.
- Setiap pompa memiliki titik biru, sedangkan api memiliki titik merah pada
  petak interaksinya. FINISH Level 2 memakai ubin kotak-kotak yang sama dengan
  Level 1 tanpa label dan marker merah.
  Titik merah yang selesai menghilang, sedangkan titik biru pompa tetap tersedia.
  Label status berada di atas api dan menampilkan kebutuhan, sisa semprotan,
  atau status padam.
- `Level2Scene.js` menjalankan gerakan dan semprotan secara berurutan. Pompa
  kedua berada di rumput sebelah kiri jalan bawah dengan kapasitas 6 unit;
  evaluasi membutuhkan 3 unit. Ubin FINISH menyelesaikan
  level setelah api evaluasi padam. Selama evaluasi, Hint, materi, kamus,
  dan autocomplete disembunyikan.
- Pemandu Level 2 menjelaskan pengisian air, semprotan, serta perulangan pada tiga
  challenge latihan. Pada evaluasi, dialog hanya memberi tujuan umum dan hasil;
  penjelasan kode dan contoh jawaban tidak ditampilkan.
- Assignment `isi_air` pada pompa mengganti isi tangki dan boleh berada di
  bawah kapasitas. Nilai yang melebihi kapasitas ditolak. Animasi pompa
  diputar satu siklus untuk setiap unit air yang diambil.
- Validator mendukung satu tingkat loop berisi `semprot()`, dengan maksimal
  120 aksi per Run. Python pemain tidak dieksekusi oleh server atau shell.
- Akun menyimpan checkpoint tiap challenge dan memuatnya kembali saat level dibuka.
  Posisi langkah di dalam challenge tidak disimpan. Tamu mengulang dari awal
  ketika halaman dimuat ulang, tanpa penulisan progres ke database.

## Implementasi Level 3

- `/game/3` memakai layout PyroPad, dengan status `api_padam` dan bekantan di HUD.
- `Level3Map.js` memisahkan jalur dan posisi objek dari gambar map sementara.
  Grid 40 px mengikuti daratan dan jembatan; air tidak dapat dilalui.
- `Level3Scene` memakai kembali rendering, gerakan, pompa, dan animasi
  `Level2Scene` melalui konfigurasi map/aset. Keadaan misi, percabangan,
  checkpoint, dan bekantan ditangani oleh scene Level 3.
- Api latihan memakai sprite C3 Level 2 (3 semprotan); api evaluasi memakai
  sprite EVAL Level 2 tetapi membutuhkan 4 semprotan sesuai modul.
- `Level3Assets.js` membaca 10 frame bekantan saat runtime; PNG sumber tidak diubah.
  Lima frame baris pertama berulang saat status `tunggu`, lalu lima frame baris kedua
  berulang saat status `aman` atau `selamat`, dengan kecepatan 4 fps. Skala tetap memakai
  acuan 56 px agar bekantan lebih kecil dari pemadam dan tidak berubah proporsi.
- Story Level 2 digunakan sementara. Materi, autocomplete, hint, dan pemandu
  memakai `Level3Challenges.js` sesuai BAB III PDF. Evaluasi menghilangkan bantuan.
- C2 dan C3 mempertahankan api latihan yang telah padam. Kondisi diperiksa pada
  saat command conditional dijalankan, sehingga loop di atasnya dapat mengubah
  hasil kondisi dalam Run yang sama.
- Akun menyimpan 4 tahap dan mendapat 1–3 bintang sesuai nilai setelah FINISH. Tamu tidak
  menyimpan progres. Hasil Level 2 menyediakan tombol menuju Level 3.

## Umpan balik tabrakan dan bar HP

- HUD memakai bar HP 0–100 sebagai tampilan nilai permainan. Kode atau aksi
  salah mengurangi 5 HP; tabrakan dengan petak terlarang atau batas peta
  mengurangi 10 HP satu kali, lalu menghentikan Run pada petak terakhir yang valid.
- Saat tabrakan atau kode salah, karakter memerah selama 360 ms, kamera bergetar ringan selama
  220 ms, dan tepi peta memerah singkat. Dialog pemandu tidak dibuka.
  Preferensi reduced motion mematikan getaran dan mengurangi efek merah.
- Kesalahan kode dan aksi selain tabrakan ditampilkan sebagai pesan kecil di
  bawah editor, tanpa dialog dan tanpa mengulang nilai dalam pesan.
- HP nol mengulang level aktif dari Challenge 1 dengan HP penuh. Ulangi challenge
  tidak memulihkan HP. Pencapaian terbaik akun tetap tersimpan.
- FINISH yang dicapai sebelum seluruh misi selesai menampilkan pengingat tanpa
  mengakhiri permainan. Kelulusan tidak bergantung pada persentase.
- HUD bintang dihapus. Setiap level selesai memberikan badge yang masuk dari
  kanan layar; kualitasnya Tuntas (<70), Perunggu (70–84), Perak (85–99),
  atau Emas (100). Badge Level 3 adalah Sahabat Bekantan. Tamu melihat badge
  sesi ini tanpa menulis progres ke database.
- Layar kemenangan tetap menampilkan tiga slot bintang: 100% mendapat 3,
  85–99% mendapat 2, 70–84% mendapat 1, dan di bawah 70% mendapat 0.
  Badge menggunakan lambang SVG yang sama pada hasil, notifikasi kanan,
  dan koleksi menu; warna bingkai mengikuti peringkat. Ringkasan belajar
  dapat dibuka lewat "Bekal yang kamu kuasai".

## Tutorial Level 1

Sesudah cerita pembuka dan peta siap, awal Challenge 1 Level 1 menampilkan tur
**Cara Bermain**. Tur menjelaskan peta, status air dan HP, PyroPad,
tombol Run Code dan Hapus, kontrol suara, Ulangi, Hint, serta Baca Materi.
Kamera kemudian bergeser ke penanda biru di pompa, penanda merah di Pos 1,
dan FINISH, masing-masing dengan lingkaran penunjuk. Penanda biru adalah petak
mengambil air; penanda merah adalah petak menjalankan kode untuk challenge.
Tur tidak memberi jawaban kode. Pemain bisa maju, kembali, atau melewatinya.
Tombol **Cara Bermain** di footer game membuka tur lagi selama game aktif.
Ketika tur ditutup, kamera kembali mengikuti pemadam dan pemandu misi memberi
arahan sesuai posisi pemain. Tur tidak mengubah challenge atau progres akun.

## Audio game

- `GameAudio.js` memuat musik latar, ambience api berbasis jarak, dan efek
  suara WAV dari `public/assets/audio` melalui Web Audio API. Musik dan efek
  sintetis dapat dibuat ulang dengan `npm run audio:generate`, sedangkan
  `fire.wav` merupakan hasil konversi `fire.mp3`.
- Menu memakai lagu aksi pixel orisinal `menu-action-loop.wav` yang dibuat oleh
  `node scripts/generate-menu-music.mjs`. Tombol Musik di navbar menu dapat
  memutar atau menghentikannya. Browser mulai memainkan lagu setelah interaksi
  pertama jika autoplay belum diizinkan.
- Pada Level 2, `fire.wav` berulang hanya ketika pemain berada dalam area
  5 × 5 petak yang berpusat pada penanda interaksi api yang belum padam.
  Suara berhenti ketika pemain keluar dari area atau api tersebut padam.
- Audio baru aktif setelah klik atau tombol keyboard pertama agar mematuhi
  kebijakan autoplay browser.
- Cue tersedia untuk cerita pembuka, tombol UI, gerakan, jalan buntu, pompa,
  pengisian air, semprotan, api padam, kesalahan kode, target, challenge,
  dan penyelesaian level.
- Tombol **Musik** dan **SFX** tersedia terpisah di dalam game bersama Hint dan
  Ulangi. SFX mencakup langkah, karakter, pompa, semprotan, api, dan UI.
  Pilihan disimpan dengan kunci `pyrorescue.musicMuted` dan
  `pyrorescue.effectsMuted`. Pilihan mute lama dibaca saat pertama kali
  membuka versi baru agar pengaturan pemain sebelumnya tetap berlaku.
- Scene hanya mengirim nama cue melalui callback `onAudio`; pembuatan dan
  pengaturan suara tetap menjadi tanggung jawab `GameAudio.js`.

Contoh prototype awal di bawah tetap menjadi referensi dasar integrasi Phaser.

## Instalasi Phaser

```bash
npm install phaser
```

## `resources/js/game/main.js`

```js
import Phaser from 'phaser';
import Level1Scene from './scenes/Level1Scene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    parent: 'game-container',

    physics: {
        default: 'arcade'
    },

    scene: [
        Level1Scene
    ]
};

window.pyroGame = new Phaser.Game(config);
```

## `Level1Scene.js`

```js
import Phaser from 'phaser';

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.load.image(
            'player',
            '/assets/characters/firefighter.png'
        );

        this.load.image(
            'fire',
            '/assets/effects/fire.png'
        );
    }

    create() {
        this.player = this.add.image(200, 300, 'player');
        this.fire = this.add.image(550, 300, 'fire');

        this.water = 0;

        this.waterText = this.add.text(
            20,
            20,
            'Air: 0',
            {
                fontSize: '22px',
                color: '#ffffff'
            }
        );
    }

    setWater(amount) {
        this.water = amount;
        this.waterText.setText(`Air: ${amount}`);
    }

    spray(amount) {
        this.setWater(amount);

        if (amount >= 2) {
            this.fire.setVisible(false);
        }
    }
}
```

Untuk prototype, logika di atas sudah cukup.

Belum perlu:

- tilemap kompleks;
- particle;
- kamera;
- AI;
- banyak animasi.

Pastikan dulu hubungan ini berjalan:

```text
kode → validator → fungsi Phaser → perubahan visual
```

---

# Layout UI

```text
┌──────────────────────────┬─────────────────────────┐
│                          │ Misi                    │
│                          │                         │
│       AREA GAME          │ Editor Kode            │
│       PHASER             │                         │
│                          │ [Run] [Hint] [Reset]    │
│                          │                         │
│                          │ Feedback                │
└──────────────────────────┴─────────────────────────┘
```

## Blade sederhana

```html
<div class="game-layout">
    <div id="game-container"></div>

    <aside class="game-panel">
        <h2 id="mission-title">Misi</h2>

        <p id="mission-text">
            Siapkan air untuk memadamkan api.
        </p>

        <textarea id="code-editor"></textarea>

        <div class="buttons">
            <button id="run-code">Run Code</button>
            <button id="hint">Hint</button>
            <button id="reset">Reset</button>
        </div>

        <div id="feedback"></div>
    </aside>
</div>
```

## CSS sederhana

```css
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f4f4f4;
}

.game-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    min-height: 100vh;
}

#game-container {
    background: #222;
    display: flex;
    justify-content: center;
    align-items: center;
}

.game-panel {
    padding: 24px;
    background: white;
    border-left: 1px solid #ddd;
}

#code-editor {
    width: 100%;
    min-height: 220px;
    box-sizing: border-box;
    padding: 12px;
    font-family: monospace;
    font-size: 16px;
}

.buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

button {
    padding: 10px 16px;
    cursor: pointer;
}

#feedback {
    margin-top: 16px;
    padding: 12px;
    background: #f1f1f1;
}
```

## Halaman MVP

```text
/login
/register
/levels
/game/1
/game/2
/game/3
/progress
```

Jangan buat admin panel, leaderboard, shop, atau kustomisasi avatar dulu.
