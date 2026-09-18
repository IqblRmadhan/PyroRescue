# Struktur Folder PyroRescue

```text
pyrorescue/
│
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── GameController.php
│   │       └── ProgressController.php
│   └── Models/
│       ├── Level.php
│       ├── Challenge.php
│       └── UserLevelProgress.php
│
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── LevelSeeder.php
│       └── ChallengeSeeder.php
│
├── public/
│   └── assets/
│       ├── characters/
│       ├── tiles/
│       ├── effects/
│       └── ui/
│
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.js
│   │   └── game/
│   │       ├── main.js
│   │       ├── CodeValidator.js
│   │       ├── MissionManager.js
│   │       └── scenes/
│   │           ├── Level1Scene.js
│   │           ├── Level2Scene.js
│   │           └── Level3Scene.js
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── dashboard.blade.php
│       ├── level-select.blade.php
│       ├── progress.blade.php
│       └── game/
│           ├── play.blade.php
│           └── tutorial.blade.php
│
├── routes/
│   └── web.php
│
├── .env
├── package.json
└── vite.config.js
```

## Folder penting

### `resources/js/game`

Semua kode gameplay disimpan di sini.

### `resources/js/game/scenes`

Gunakan satu scene per level agar mudah dipahami.

### `public/assets`

Contoh:

```text
public/assets/characters/firefighter.png
public/assets/effects/fire.png
public/assets/effects/water.png
public/assets/tiles/grass.png
```

## Jangan dibuat dulu

- repository pattern;
- service layer terlalu banyak;
- websocket;
- microservice;
- admin panel;
- React/Vue SPA;
- multiplayer.

Tambahkan hanya jika benar-benar dibutuhkan.
