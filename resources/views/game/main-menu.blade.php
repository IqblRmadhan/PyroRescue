<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Pilih petualangan PyroRescue dan belajar Python sambil menjaga hutan Kalimantan.">
    <title>Peta Petualangan — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="main-menu-page">
    <div class="main-menu">
        <header class="adventure-topbar">
            <a class="adventure-brand" href="{{ route('home') }}" aria-label="PyroRescue, ke beranda">
                <img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue">
            </a>

            <nav class="adventure-topbar__links" aria-label="Navigasi utama">
                <a class="is-current" href="#petualangan" aria-current="page">Petualangan</a>
                <a href="#progress">Progress</a>
                <a href="{{ route('module.download') }}">Download Modul</a>
            </nav>

            <div class="adventure-account">
                <span class="adventure-account__name" title="{{ $playerName }}">{{ $playerName }}</span>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit">Keluar</button>
                </form>
            </div>
        </header>

        <main>
            <section class="adventure-world" id="petualangan" aria-labelledby="adventure-heading">
                <div class="adventure-world__intro">
                    <span class="adventure-eyebrow">PETA PETUALANGAN</span>
                    <h1 id="adventure-heading">Pilih Misi Penyelamatanmu</h1>
                    <p>Tulis kode Python, jelajahi Kalimantan, dan bantu jaga hutannya.</p>
                </div>

                <div class="adventure-world__counter" aria-label="Progress level">
                    <span aria-hidden="true">✦</span>
                    <strong>0 / 3</strong>
                    <small>Level selesai</small>
                </div>

                <div class="adventure-islands">
                    <article class="adventure-level adventure-level--locked adventure-level--two" aria-labelledby="level-two-title">
                        <div class="adventure-level__image-wrap">
                            <img src="{{ asset('assets/menu/level-2-island.webp') }}" alt="Pulau hutan gambut berkabut" loading="lazy">
                        </div>
                        <div class="adventure-level__copy">
                            <span class="adventure-level__number">LEVEL 02</span>
                            <h2 id="level-two-title">Hutan Gambut Berasap</h2>
                            <span class="adventure-level__lock">🔒 Terkunci</span>
                            <p>Pelajari perulangan untuk menghadapi titik api.</p>
                        </div>
                    </article>

                    <article class="adventure-level adventure-level--active" aria-labelledby="level-one-title">
                        <div class="adventure-level__image-wrap">
                            <img src="{{ asset('assets/menu/level-1-island.webp') }}" alt="Pulau hutan dengan sungai, pos pemadam, dan titik api">
                        </div>
                        <div class="adventure-level__copy">
                            <span class="adventure-level__number">LEVEL 01 · MISI TERSEDIA</span>
                            <h2 id="level-one-title">Tepi Sungai Terbakar</h2>
                            <p>Siapkan persediaan air dengan variabel Python.</p>
                            <a class="adventure-play" href="{{ route('game.level1') }}">
                                <span aria-hidden="true">▶</span> Mainkan
                            </a>
                            <span class="adventure-level__progress">Misi pertama menantimu</span>
                        </div>
                    </article>

                    <article class="adventure-level adventure-level--locked adventure-level--three" aria-labelledby="level-three-title">
                        <div class="adventure-level__image-wrap">
                            <img src="{{ asset('assets/menu/level-3-island.webp') }}" alt="Pulau suaka bekantan dengan menara pengawas" loading="lazy">
                        </div>
                        <div class="adventure-level__copy">
                            <span class="adventure-level__number">LEVEL 03</span>
                            <h2 id="level-three-title">Suaka Bekantan</h2>
                            <span class="adventure-level__lock">🔒 Terkunci</span>
                            <p>Gunakan percabangan untuk membuka jalur penyelamatan.</p>
                        </div>
                    </article>
                </div>

                <a class="adventure-scroll" href="#progress">Lihat perjalananmu <span aria-hidden="true">↓</span></a>
            </section>

            <section class="adventure-details" id="progress" aria-labelledby="progress-heading">
                <div class="adventure-details__heading">
                    <span class="adventure-eyebrow">PERJALANANMU</span>
                    <h2 id="progress-heading">Progress Pemain</h2>
                    <p>Setiap baris kode membantumu menjaga hutan.</p>
                </div>
                <div class="adventure-details__grid">
                    <div class="adventure-detail-panel">
                        <h3>Ringkasan Progress</h3>
                        <dl class="adventure-stats">
                            <div><dt>Level Diselesaikan</dt><dd>0 / 3</dd></div>
                            <div><dt>Total Bintang</dt><dd>0 / 15</dd></div>
                            <div><dt>Misi Tersedia</dt><dd>1 / 3</dd></div>
                        </dl>
                    </div>
                    <div class="adventure-detail-panel adventure-module">
                        <div class="adventure-module__icon" aria-hidden="true">PDF</div>
                        <div class="adventure-module__content">
                            <h3>Download Modul</h3>
                            <p>Materi pendamping petualangan PyroRescue tersedia dalam satu file PDF.</p>
                            <a class="adventure-module__button" href="{{ route('module.download') }}">Unduh Modul <span aria-hidden="true">↓</span></a>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="adventure-footer">PyroRescue · Belajar Python, selamatkan hutan Kalimantan</footer>
    </div>
</body>
</html>
