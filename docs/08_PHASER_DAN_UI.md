# Phaser dan UI Sederhana

## Implementasi ruang belajar Level 1

Halaman game memakai peta di kiri serta daftar Misi, PyroPad, dan tombol aksi
di kanan. Tombol Baca Materi di bawah Run Code membuka popup materi dan kamus
perintah. Pada layar kecil, map dan PyroPad disusun vertikal.
Pemandu tampil sebagai dialog di bagian bawah layar, dengan karakter besar di
kiri dan balon teks di kanan. Latar game sedikit diredupkan selama dialog terbuka.

- `Level1Learning.js` mengganti materi sesuai challenge: membuat variabel,
  mengganti nilai, lalu memakai nilainya.
- Saat pemain pertama kali mencapai penanda merah challenge Level 1, kode gerakan
  diganti satu kali dengan `isi_air = ...` atau `air_pos = ...` sesuai challenge.
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
- Map Level 1 memakai `level1-map.png` berukuran 1600 × 1200.
  Grid mengikuti jalan baru; FINISH berada 15 petak ke kanan dari Pos 2.
- Petak FINISH Level 1 memakai ubin kecil bermotif kotak-kotak di jalan tanpa
  label dan marker merah. Pemain menginjak ubin setelah menyerahkan air untuk
  membuka hasil tiga bintang dan tautan Level 2.
- Label pompa, pos, dan kebakaran memakai bentuk papan, panah,
  tipografi, dan aturan zoom yang sama. Warna dibedakan berdasarkan fungsi.
- Tanda POS 1 dan POS 2 berada di atas tenda pada map. Tanda tujuan challenge
  yang sedang aktif tampil lebih terang agar arah perjalanan mudah dikenali.
  Titik biru di pompa serta titik merah di Pos 1 dan Pos 2 tetap terlihat pada
  setiap challenge tanpa garis kotak kuning di sekeliling petak.

## Implementasi Level 2

- `/game/2` memakai layout PyroPad yang sama, dengan materi `semprot()` dan
  `for/range`. Level tersedia dari menu utama dan hasil Level 1.
- `Level2Map.js` mengikuti jalan pada `level2-map.png` berukuran 1600 × 1200.
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
  Semua titik tetap terlihat dengan tingkat terang berbeda tanpa garis kotak
  kuning di sekeliling petak.
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
- Progress masih mengikuti prototype Level 1: state berada dalam halaman,
  belum disimpan ke database; memuat ulang halaman mengulang level.

## Audio game

- `GameAudio.js` memuat musik latar, ambience api berbasis jarak, dan efek
  suara WAV dari `public/assets/audio` melalui Web Audio API. Musik dan efek
  sintetis dapat dibuat ulang dengan `npm run audio:generate`, sedangkan
  `fire.wav` merupakan hasil konversi `fire.mp3`.
- Pada Level 2, `fire.wav` berulang hanya ketika pemain berada dalam area
  5 × 5 petak yang berpusat pada penanda interaksi api yang belum padam.
  Suara berhenti ketika pemain keluar dari area atau api tersebut padam.
- Audio baru aktif setelah klik atau tombol keyboard pertama agar mematuhi
  kebijakan autoplay browser.
- Cue tersedia untuk cerita pembuka, tombol UI, gerakan, jalan buntu, pompa,
  pengisian air, semprotan, api padam, kesalahan kode, target, challenge,
  dan penyelesaian level.
- Tombol **Suara/Bisu** tersedia di dalam game bersama Hint serta Ulangi, tetapi
  tidak ditampilkan di cerita pembuka. Pilihan mute disimpan di `localStorage` dengan kunci
  `pyrorescue.audioMuted` agar tetap berlaku saat halaman dimuat ulang.
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
