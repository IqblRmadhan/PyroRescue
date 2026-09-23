<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Progress Pemain — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="main-menu-page" style="--icon-sheet: url('{{ asset('assets/ui/icons.png') }}')">
    <main class="main-menu">
        <nav class="landing-nav main-menu-navbar wood-plank" aria-label="Navigasi utama">
            <a class="landing-brand" href="{{ route('home') }}" aria-label="PyroRescue, kembali ke beranda">
                <span class="page-logo" aria-hidden="true"></span>
                <span class="sr-only">PyroRescue</span>
            </a>
            <div class="landing-nav__links">
                <a href="{{ route('home') }}">Beranda</a>
                <a href="#petualangan">Petualangan</a>
                <a href="#progress">Progress</a>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button class="landing-login" type="submit">Keluar</button>
            </form>
        </nav>

        <header class="main-menu__header">
            <div class="main-menu__title wood-plank"><span aria-hidden="true">🌳</span><div><h1>Progress Pemain</h1><p>Terus belajar, selamatkan lebih banyak hutan!</p></div></div>
            <div class="main-menu__player"><span>{{ $playerName }}</span><small>Penjaga Hutan</small></div>
        </header>

        <div class="main-menu__content">
            <nav class="main-menu__nav wood-frame" aria-label="Menu utama">
                <a href="#petualangan"><span aria-hidden="true">🗺️</span>Petualangan</a>
                <a class="is-active" href="#progress"><span aria-hidden="true">📊</span>Progress</a>
                <a href="#konsep"><span aria-hidden="true">📖</span>Konsep</a>
                <a href="#pencapaian"><span aria-hidden="true">🏆</span>Pencapaian</a>
                <a href="#pengaturan"><img class="menu-link__icon" src="{{ asset('assets/ui/settings.png') }}" alt="" aria-hidden="true">Pengaturan</a>
            </nav>

            <section class="level-board wood-frame" id="progress" aria-labelledby="levels-title">
                <header class="board-heading"><span aria-hidden="true">🗺️</span><h2 id="levels-title">Pilih Petualanganmu</h2></header>
                <div class="level-cards" id="petualangan">
                    <a class="level-card level-card--one" href="{{ route('game.level1') }}">
                        <div class="level-card__art"><img class="level-card__fire" src="{{ asset('assets/ui/fire.png') }}" alt="" aria-hidden="true"></div>
                        <h3>Level 1</h3><p>Tepi Sungai Terbakar</p>
                        <div class="level-card__stars" aria-label="Belum ada bintang">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                        </div>
                        <div class="level-card__meter"><span style="width: 0%"></span></div>
                        <strong class="level-card__status">▶ Mulai Misi</strong>
                    </a>
                    <article class="level-card level-card--two is-locked" aria-label="Level 2 terkunci">
                        <div class="level-card__art"><span aria-hidden="true">🌫️</span></div>
                        <h3>Level 2</h3><p>Hutan Gambut Berasap</p>
                        <div class="level-card__stars" aria-label="Belum ada bintang">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                        </div>
                        <div class="level-card__meter"><span style="width: 0%"></span></div>
                        <strong class="level-card__status">🔒 Terkunci</strong>
                    </article>
                    <article class="level-card level-card--three is-locked" aria-label="Level 3 terkunci">
                        <div class="level-card__art"><span aria-hidden="true">🌋</span></div>
                        <h3>Level 3</h3><p>Suaka Bekantan</p>
                        <div class="level-card__stars" aria-label="Belum ada bintang">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                            <img src="{{ asset('assets/ui/star-empty.png') }}" alt="">
                        </div>
                        <div class="level-card__meter"><span style="width: 0%"></span></div>
                        <strong class="level-card__status">🔒 Terkunci</strong>
                    </article>
                </div>
                <div class="forest-cheer"><span aria-hidden="true">🧑‍🚒</span><p><strong>Setiap baris kode yang kamu pelajari membantu menyelamatkan hutan!</strong><br>Mulai misi pertamamu, pahlawan hutan.</p></div>
            </section>

            <aside class="main-menu__sidebar">
                <section class="progress-summary wood-frame">
                    <header class="board-heading"><span aria-hidden="true">📊</span><h2>Ringkasan Progress</h2></header>
                    <dl>
                        <div><dt>🌲 Level Diselesaikan</dt><dd>0 / 3</dd></div>
                        <div><dt>⭐ Total Bintang</dt><dd>0 / 15</dd></div>
                        <div><dt>📖 Konsep Terbuka</dt><dd>1 / 4</dd></div>
                        <div><dt>🏆 Pencapaian Diraih</dt><dd>0 / 8</dd></div>
                        <div><dt>🕒 Total Waktu Bermain</dt><dd>0 menit</dd></div>
                    </dl>
                </section>
                <section class="concept-panel wood-frame" id="konsep">
                    <header class="board-heading"><span aria-hidden="true">📘</span><h2>Konsep Python</h2></header>
                    <div class="concept-grid">
                        <div class="concept-card--asset is-open"><img class="concept-card__image" src="{{ asset('assets/ui/concept-variable.png') }}" alt="Konsep Variabel"><small>✓ Terbuka</small></div>
                        <div class="concept-card--asset is-locked"><img class="concept-card__image" src="{{ asset('assets/ui/concept-loop.png') }}" alt="Konsep Perulangan"><small>🔒 Terkunci</small></div>
                        <div class="concept-card--asset is-locked"><img class="concept-card__image" src="{{ asset('assets/ui/concept-conditional.png') }}" alt="Konsep Percabangan"><small>🔒 Terkunci</small></div>
                        <div class="is-locked"><span>🧩</span><strong>Integrasi</strong><small>🔒 Terkunci</small></div>
                    </div>
                </section>
            </aside>
        </div>

        <footer class="main-menu__footer">❧ Python untuk Hutan yang Lebih Baik ❧</footer>
    </main>
</body>
</html>
