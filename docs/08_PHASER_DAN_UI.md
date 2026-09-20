# Phaser dan UI Sederhana

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
