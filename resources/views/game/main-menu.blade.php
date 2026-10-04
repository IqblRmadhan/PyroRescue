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

                <div class="adventure-carousel" data-level-carousel aria-label="Pilih level petualangan">
                    <button class="adventure-carousel__arrow adventure-carousel__arrow--previous" type="button"
                        data-carousel-previous aria-label="Lihat level sebelumnya">
                        <span aria-hidden="true">‹</span><small>Sebelumnya</small>
                    </button>

                    <div class="adventure-carousel__viewport">
                        <div class="adventure-islands" data-carousel-track>
                            <article class="adventure-level is-current" data-level="1" aria-labelledby="level-one-title">
                                <div class="adventure-level__image-wrap">
                                    <img src="{{ asset('assets/menu/level-1-island.webp') }}" alt="Pulau hutan dengan sungai, pos pemadam, dan titik api">
                                </div>
                                <div class="adventure-level__copy">
                                    <span class="adventure-level__number">LEVEL 01 · MISI TERSEDIA</span>
                                    <h2 id="level-one-title">Tepi Sungai Terbakar</h2>
                                    <p>Siapkan persediaan air dengan variabel Python.</p>
                                    <a class="adventure-play" href="{{ route('game.level1') }}">
                                        <span aria-hidden="true">▶</span> Mainkan Level 1
                                    </a>
                                    <span class="adventure-level__progress">Misi pertama menantimu</span>
                                </div>
                            </article>

                            <article class="adventure-level adventure-level--two is-next" data-level="2" aria-labelledby="level-two-title" aria-hidden="true" inert>
                                <div class="adventure-level__image-wrap">
                                    <img src="{{ asset('assets/menu/level-2-island.webp') }}" alt="Pulau hutan gambut berkabut">
                                </div>
                                <div class="adventure-level__copy">
                                    <span class="adventure-level__number">LEVEL 02 · MISI TERSEDIA</span>
                                    <h2 id="level-two-title">Hutan Gambut Berasap</h2>
                                    <p>Pelajari perulangan untuk menghadapi titik api.</p>
                                    <a class="adventure-play" href="{{ route('game.level2') }}">
                                        <span aria-hidden="true">▶</span> Mainkan Level 2
                                    </a>
                                </div>
                            </article>

                            <article class="adventure-level adventure-level--locked adventure-level--three is-previous" data-level="3" aria-labelledby="level-three-title" aria-hidden="true" inert>
                                <div class="adventure-level__image-wrap">
                                    <img src="{{ asset('assets/menu/level-3-island.webp') }}" alt="Pulau suaka bekantan dengan menara pengawas">
                                </div>
                                <div class="adventure-level__copy">
                                    <span class="adventure-level__number">LEVEL 03</span>
                                    <h2 id="level-three-title">Suaka Bekantan</h2>
                                    <p>Gunakan percabangan untuk membuka jalur penyelamatan.</p>
                                    <span class="adventure-level__lock">🔒 Belum tersedia</span>
                                </div>
                            </article>
                        </div>
                    </div>

                    <button class="adventure-carousel__arrow adventure-carousel__arrow--next" type="button"
                        data-carousel-next aria-label="Lihat level berikutnya">
                        <span aria-hidden="true">›</span><small>Berikutnya</small>
                    </button>

                    <div class="adventure-carousel__navigation" aria-label="Navigasi level">
                        <div class="adventure-carousel__steps">
                            <button class="is-current" type="button" data-carousel-step="0" aria-label="Tampilkan Level 1" aria-current="step">01</button>
                            <button type="button" data-carousel-step="1" aria-label="Tampilkan Level 2">02</button>
                            <button type="button" data-carousel-step="2" aria-label="Tampilkan Level 3">03</button>
                        </div>
                        <span class="adventure-carousel__status" data-carousel-status aria-live="polite">Level 1 dari 3 · Tepi Sungai Terbakar</span>
                    </div>
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
                            <div><dt>Misi Tersedia</dt><dd>2 / 3</dd></div>
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
