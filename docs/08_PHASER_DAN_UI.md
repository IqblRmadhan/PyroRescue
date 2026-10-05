# Phaser dan UI Sederhana

## Implementasi ruang belajar Level 1

Halaman game memakai peta di kiri serta target misi, PyroPad, dan tombol aksi
di kanan. Materi, kamus perintah, penjelasan kode, dan tips berada dalam area
lebar di bawah kedua panel. Halaman digulir secara utuh agar materi tidak
terpotong dalam panel sempit. Pada layar kecil, map, PyroPad, dan panduan
disusun vertikal. Tautan di bawah tombol aksi menuju panduan; tautan di panduan
mengembalikan fokus ke PyroPad.

- `Level1Learning.js` menjelaskan setiap baris di PyroPad tanpa menjalankan kode.
  Materi mengikuti challenge: membuat variabel, mengganti nilai, lalu memakai nilainya.
- Nilai `isi_air` pada panel belajar mengikuti state Phaser setelah aksi berlangsung.
- Kamus perintah tersedia di area panduan di bawah map dan PyroPad. Klik tombol
  perintah untuk mengganti penjelasan, termasuk dengan Enter atau Spasi lewat keyboard.
- `atas()`, `bawah()`, `kanan()`, dan `kiri()` merupakan perintah yang disediakan
  game. Materi membedakannya dari assignment Python.
- `air_pos_2 = isi_air` menyalin nilai. Pengosongan tangki setelah penyerahan
  adalah aturan game, bukan perilaku assignment Python.
- Tombol Hint biru, Ulangi merah, dan Suara hijau berada di kanan atas peta.
  Tombol Hapus di samping Run Code mengosongkan editor tanpa mengulang misi.
- Cubit touchpad (atau Ctrl + scroll) di peta untuk zoom. Geser dua jari atau
  klik dan seret untuk menggeser kamera tanpa tombol tambahan. Zoom keluar
  dibatasi agar map tetap memenuhi area game dan tidak terlalu kecil; zoom masuk
  maksimal 2,5 kali.
- Navigasi manual menghentikan kamera mengikuti pemain. Run atau Reset
  mengaktifkan kembali kamera mengikuti pemain, dengan zoom pilihan pengguna.
- Awan bergerak di atas map dengan bayangan yang tampak di tanah. Awan digambar
  di belakang karakter serta penanda misi agar tidak menutupinya.
- Map Level 1 berakhir pada petak FINISH setelah Pos 2. Gerbang berhias lentera
  dipasang sebelum petak akhir, memakai gambar transparan dan label FINISH.
  Gerbang tampak sejak awal dan menyala terang setelah air diserahkan. Pemain
  berjalan melewatinya untuk membuka layar hasil tiga bintang dan tautan Level 2.
- Tanda POS 1 dan POS 2 berada di atas tenda pada map. Tanda tujuan challenge
  yang sedang aktif tampil lebih terang agar arah perjalanan mudah dikenali.

## Implementasi Level 2

- `/game/2` memakai layout PyroPad yang sama, dengan materi `semprot()` dan
  `for/range`. Level tersedia dari menu utama dan hasil Level 1.
- `Level2Map.js` mengikuti jalan pada `level2-map.png` berukuran 1600 × 1200.
  Tiga titik kebakaran berada di tengah, kanan atas, dan kanan bawah.
- Dua pohon di atas jalan dekat jembatan ditutup rumput dan diganti pompa Phaser;
  dua pohon di bawah jalan tetap tampak. Sprite pompa Level 1 digunakan ulang;
  pemain mengambil enam unit dengan `isi_air = 6` di penanda bawah pompa.
  HUD menampilkan sisa isi tangki, dan setiap `semprot()` memakai satu unit.
- `Level2Assets.js` membaca setiap sprite api sebagai lima frame 150 × 150:
  empat frame animasi api dan satu frame padam. PNG asli tidak diubah.
- `Level2Challenges.js` menyimpan jumlah semprotan, sprite, materi, dan hint.
  Sprite C1 untuk area tengah (2 semprotan), C2 kanan atas (3 semprotan),
  dan C3 kanan bawah (1 semprotan).
- Setiap api memiliki penanda titik semprot berukuran 20 × 20 piksel seperti
  Level 1. Semua penanda yang belum selesai tampil sama; penanda challenge
  yang selesai disembunyikan.
  Label status berada di atas api dan menampilkan kebutuhan, sisa semprotan,
  atau status padam.
- `Level2Scene.js` menjalankan gerakan dan semprotan secara berurutan. HUD
  menampilkan jumlah semprotan pada api aktif. Gerbang FINISH memakai gambar
  yang sama dengan Level 1 dan menyelesaikan level hanya setelah api ketiga padam.
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
- Tombol **Suara/Bisu** tersedia di cerita pembuka dan di dalam game bersama
  Hint serta Ulangi. Pilihan mute disimpan di `localStorage` dengan kunci
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
