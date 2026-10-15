<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Belajar Python melalui petualangan penyelamatan hutan Kalimantan di PyroRescue.">
    <title>PyroRescue — Belajar Python, Selamatkan Hutan</title>
    @include('partials.favicon')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="splash-page">
    <a class="splash-skip" href="#beranda">Lewati navigasi</a>
    <header class="splash-nav">
        <a href="#beranda" aria-label="PyroRescue, ke beranda"><img class="splash-brand" src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="220" height="62"></a>
        <nav aria-label="Navigasi utama"><a href="#tentang">Tentang</a><a href="#materi">Materi</a></nav>
        <a class="splash-login" href="{{ route('login') }}">Masuk <span aria-hidden="true">↗</span></a>
    </header>
    <main id="beranda">
        <section class="splash-hero" aria-labelledby="hero-title">
            <div class="splash-container splash-hero__grid">
                <div class="splash-hero__copy">
                    <span class="splash-kicker"><i aria-hidden="true"></i> MISI KECIL. PERUBAHAN BESAR.</span>
                    <h1 id="hero-title">Belajar Python.<br><em>Jadi pahlawan<br>hutan.</em></h1>
                    <p>Hutan Kalimantan membutuhkanmu. Jelajahi petanya, tulis kode pertamamu, dan bantu pemadam menyelesaikan misi penyelamatan.</p>
                    <div class="splash-actions"><a class="splash-button" href="{{ route('login') }}"><span aria-hidden="true">▶</span> Mulai Petualangan</a><a class="splash-text-link" href="#tentang">Kenali PyroRescue ↓</a></div>
                    <p class="splash-hero__note">Baru belajar coding? Mulai dari satu baris sederhana.</p>
                    <div class="splash-hero__tags"><span>Python untuk pemula</span><span>Misi interaktif</span><span>Nuansa Kalimantan</span></div>
                </div>
                <div class="splash-world home-art" aria-label="Logo PyroRescue dan karakter pemadam hutan">
                    <img class="home-art__logo" src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="580" height="180" fetchpriority="high">
                    <div class="home-art__stage" aria-hidden="true">
                        <div class="home-art__forest"></div>
                        <div class="home-art__glow"></div>
                        <span class="home-art__spark home-art__spark--one"></span>
                        <span class="home-art__spark home-art__spark--two"></span>
                        <span class="home-art__spark home-art__spark--three"></span>
                        <div class="home-mascot"><div class="home-mascot__sprite"></div></div>
                        <div class="home-art__ground"></div>
                    </div>
                    <p class="home-art__caption"><strong>Penjaga Hutan</strong><span>Siap beraksi bersama kode buatanmu</span></p>
                </div>
            </div>
            <div class="splash-hero__bottom splash-container"><span>SEBUAH PETUALANGAN BELAJAR PYTHON</span><a href="#tentang">Kenali PyroRescue ↓</a></div>
        </section>
        <section class="splash-about splash-container" id="tentang" aria-labelledby="about-title">
            <div><span class="splash-kicker">SELAMAT DATANG, PENJAGA HUTAN</span><h2 id="about-title">Kode yang kamu tulis.<br>Aksi yang kamu lihat.</h2></div>
            <div><p>PyroRescue mengajakmu belajar dasar Python melalui misi penyelamatan hutan. Kamu mengarahkan pemadam dengan kode, mengumpulkan air, dan menghadapi titik api.</p><p>Pelajari materinya, coba solusimu, lalu lihat hasilnya langsung di peta. Belum berhasil? Baca feedback dan coba lagi.</p></div>
        </section>
        <section class="splash-lessons splash-container" id="materi" aria-labelledby="lessons-title">
            <div class="splash-section-head"><div><span class="splash-kicker">BEKAL UNTUK MENYELAMATKAN HUTAN</span><h2 id="lessons-title">Mulai sederhana. Terus berkembang.</h2></div><p>Kenali konsep Python<br>melalui tantangan di dalam game.</p></div>
            <div class="splash-lessons__grid">
                <article><img src="{{ asset('assets/ui/concept-variable.png') }}" alt="" loading="lazy" width="80" height="80"><span>01 / VARIABEL</span><h3>Simpan bekalmu</h3><p>Kenali cara menyimpan, mengubah, dan menggunakan nilai untuk mengatur persediaan air.</p><code>isi_air = 3</code></article>
                <article><img src="{{ asset('assets/ui/concept-loop.png') }}" alt="" loading="lazy" width="80" height="80"><span>02 / PERULANGAN</span><h3>Ulangi aksimu</h3><p>Gunakan for dan range untuk menyemprot api beberapa kali dengan kode yang lebih ringkas.</p><code>for i in range(3):</code></article>
                <article><img src="{{ asset('assets/ui/concept-conditional.png') }}" alt="" loading="lazy" width="80" height="80"><span>03 / PERCABANGAN · SEGERA HADIR</span><h3>Tentukan pilihanmu</h3><p>Kenali if dan else untuk memilih tindakan berdasarkan kondisi yang kamu temui.</p><code>if isi_air &gt; 0:</code></article>
            </div>
        </section>
        <section class="splash-invite splash-container" aria-labelledby="invite-title"><div><span class="splash-kicker">GILIRANMU MENGAMBIL PERAN</span><h2 id="invite-title">Hutan menunggu pahlawan berikutnya.</h2><p>Mulai dari satu misi, satu baris kode, dan rasa ingin tahu.</p></div><a class="splash-button" href="{{ route('login') }}">Mulai Petualangan →</a></section>
    </main>
    <footer class="splash-footer splash-container"><a href="#beranda"><img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="155" height="44"></a><p>Belajar Python. Selamatkan hutan Kalimantan.</p><a href="#beranda">Kembali ke atas ↑</a></footer>
</body>
</html>
