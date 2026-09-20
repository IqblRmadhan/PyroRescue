<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="PyroRescue, game edukasi untuk belajar Python sambil menyelamatkan hutan Kalimantan.">
    <title>PyroRescue — Belajar Python, Selamatkan Hutan</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="landing-page" style="--icon-sheet: url('{{ asset('assets/ui/icons-sheet.png') }}')">
    <main class="landing-hero" id="beranda">
        <div class="landing-world" aria-hidden="true"></div>
        <div class="landing-sun" aria-hidden="true"></div>
        <div class="landing-mist landing-mist--one" aria-hidden="true"></div>
        <div class="landing-mist landing-mist--two" aria-hidden="true"></div>

        <nav class="landing-nav wood-plank" aria-label="Navigasi utama">
            <a class="landing-brand" href="#beranda" aria-label="PyroRescue, kembali ke beranda">
                <span class="brand-flame" aria-hidden="true">🔥</span>
                <span>
                    <strong>PyroRescue</strong>
                    <small>Kode Kecil, Hutan Lebih Aman</small>
                </span>
            </a>

            <div class="landing-nav__links">
                <a href="#tentang">Tentang</a>
                <a href="#fitur">Fitur</a>
                <a href="mailto:pyrorescue@example.com">Kontak</a>
            </div>

            <a class="landing-login" href="{{ route('login') }}">Masuk</a>
        </nav>

        <aside class="forest-sign forest-sign--left" aria-label="Pesan pelestarian hutan">
            <span>Hutan Kalimantan</span>
            <strong>Rumah Kita<br>Bersama</strong>
            <i aria-hidden="true">♥</i>
        </aside>

        <section class="landing-copy" id="tentang">
            <p class="rescue-kicker">Misi Penyelamatan Hutan</p>
            <h1><span class="hero-flame" aria-hidden="true">🔥</span>PyroRescue</h1>
            <p class="hero-tagline">Belajar Python, Selamatkan Hutan</p>
            <p class="hero-description">
                Game edukasi yang mengajak kamu belajar pemrograman Python sambil
                melakukan misi penyelamatan hutan dan satwa Indonesia.
            </p>
            <a class="start-game-button" href="{{ route('login') }}">
                <span aria-hidden="true">▶</span>
                Mulai Belajar
            </a>
        </section>

        <aside class="forest-sign forest-sign--right" aria-label="Pesan pelestarian alam">
            <span>Alam Terjaga</span>
            <strong>Kita Semua<br>Bisa Bahagia</strong>
            <i aria-hidden="true">♥</i>
        </aside>

        <div class="landing-foreground" aria-hidden="true">
            <div class="foreground-tree foreground-tree--left"></div>
            <div class="foreground-tree foreground-tree--right"></div>
            <div class="hero-firefighter"></div>
            <div class="hero-orangutan"></div>
            <div class="hero-toucan"></div>
        </div>

        <section class="landing-features parchment-panel" id="fitur" aria-label="Keunggulan PyroRescue">
            <article>
                <span class="asset-icon asset-icon--book" aria-hidden="true"></span>
                <p>Belajar Python<br><strong>dengan mudah</strong></p>
            </article>
            <article>
                <span class="feature-emoji" aria-hidden="true">🎮</span>
                <p>Misi seru<br><strong>di dunia nyata</strong></p>
            </article>
            <article>
                <span class="asset-icon asset-icon--leaf" aria-hidden="true"></span>
                <p>Bersama menjaga<br><strong>hutan Indonesia</strong></p>
            </article>
            <article>
                <span class="feature-emoji" aria-hidden="true">🐾</span>
                <p>Kode kecil,<br><strong>dampak besar untuk alam kita</strong></p>
            </article>
        </section>

        <p class="landing-quote"><span aria-hidden="true">❧</span> “Satu Baris Kode, Sejuta Harapan untuk Hutan Kalimantan” <span aria-hidden="true">❧</span></p>
    </main>
</body>
</html>
