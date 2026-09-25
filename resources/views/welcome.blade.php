<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Belajar Python melalui petualangan penyelamatan hutan Kalimantan di PyroRescue.">
    <title>PyroRescue — Belajar Python, Selamatkan Hutan</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="landing-page">
    <header class="adventure-topbar home-topbar">
        <a class="adventure-brand" href="#beranda" aria-label="PyroRescue, ke awal halaman">
            <img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue">
        </a>

        <nav class="adventure-topbar__links" aria-label="Navigasi utama">
            <a href="#tentang">Tentang</a>
            <a href="#cara-main">Cara Bermain</a>
        </nav>

        <a class="home-login" href="{{ route('login') }}">Masuk <span aria-hidden="true">↗</span></a>
    </header>

    <main id="beranda">
        <section class="home-stage" id="tentang" aria-labelledby="home-heading">
            <div class="home-stage__inner">
                <div class="home-copy">
                    <span class="adventure-eyebrow">PETUALANGAN KODE DIMULAI DI SINI</span>
                    <h1 id="home-heading">Belajar Python.<br><em>Selamatkan Hutan.</em></h1>
                    <p>Jelajahi hutan Kalimantan, tulis kode untuk menyelesaikan misi, dan lihat setiap baris Python membawa perubahan.</p>
                    <div class="home-actions">
                        <a class="adventure-play home-start" href="{{ route('login') }}"><span aria-hidden="true">▶</span> Mulai Petualangan</a>
                        <a class="home-secondary" href="#cara-main">Lihat cara bermain <span aria-hidden="true">↓</span></a>
                    </div>
                    <div class="home-highlights" aria-label="Isi petualangan">
                        <span><strong>03</strong> Level</span>
                        <span><strong>01</strong> Hutan Kalimantan</span>
                        <span><strong>∞</strong> Rasa ingin tahu</span>
                    </div>
                </div>

                <div class="home-art" aria-label="Logo PyroRescue dan karakter pemadam hutan">
                    <img class="home-art__logo" src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue">
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
            <a class="home-scroll" href="#cara-main">Jelajahi cara bermain <span aria-hidden="true">↓</span></a>
        </section>

        <section class="home-how" id="cara-main" aria-labelledby="how-heading">
            <div class="home-how__heading">
                <span class="adventure-eyebrow">BELAJAR SAMBIL BERPETUALANG</span>
                <h2 id="how-heading">Kode kecil, dampak besar.</h2>
                <p>Setiap tantangan mengubah kode Python menjadi aksi nyata di dalam game.</p>
            </div>
            <div class="home-steps">
                <article>
                    <span class="home-steps__number">01</span>
                    <h3>Terima misi</h3>
                    <p>Temukan masalah di hutan dan pahami apa yang perlu dilakukan.</p>
                </article>
                <article>
                    <span class="home-steps__number">02</span>
                    <h3>Tulis kode</h3>
                    <p>Gunakan variabel, perulangan, dan percabangan Python.</p>
                </article>
                <article>
                    <span class="home-steps__number">03</span>
                    <h3>Lihat hasilnya</h3>
                    <p>Jalankan kode dan saksikan perubahan di dunia PyroRescue.</p>
                </article>
            </div>
            <a class="home-how__link" href="{{ route('login') }}">Siap menjelajah? Mulai sekarang <span aria-hidden="true">→</span></a>
        </section>
    </main>

    <footer class="adventure-footer">PyroRescue · Belajar Python, selamatkan hutan Kalimantan</footer>
</body>
</html>
