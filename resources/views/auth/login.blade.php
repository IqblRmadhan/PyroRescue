<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Masuk — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="auth-page" style="--icon-sheet: url('{{ asset('assets/ui/icons-sheet.png') }}')">
    <main class="auth-layout">
        <div class="auth-landscape" aria-hidden="true"></div>
        <a class="auth-brand" href="{{ route('home') }}" aria-label="Kembali ke beranda PyroRescue">
            <span aria-hidden="true">🔥</span>
            <span><strong>PyroRescue</strong><small>Kode Kecil, Hutan Lebih Aman</small></span>
        </a>

        <section class="auth-card" aria-labelledby="login-title">
            <p class="auth-banner">🌳 Selamatkan Hutan Kalimantan, Mulai dari Satu Langkah!</p>
            <div class="auth-card__content">
                <h1 id="login-title">Selamat Datang di PyroRescue!</h1>
                <p class="auth-intro">Belajar Python sambil menyelamatkan<br>hutan Kalimantan.</p>

                @if (session('status'))
                    <p class="auth-notice" role="status">{{ session('status') }}</p>
                @endif

                <form method="POST" action="{{ route('login.store') }}" class="auth-form">
                    @csrf
                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" placeholder="nama@email.com" required>
                    @error('email') <p class="auth-error">{{ $message }}</p> @enderror

                    <label for="password">Kata sandi</label>
                    <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Masukkan kata sandi" required>

                    <button class="auth-button auth-button--login" type="submit"><span aria-hidden="true">▶</span> Login</button>
                </form>

                <a class="auth-button auth-button--register" href="{{ route('register') }}">Daftar Akun Baru</a>

                <div class="auth-divider"><span>atau</span></div>

                <form method="POST" action="{{ route('login.guest') }}">
                    @csrf
                    <button class="auth-button auth-button--guest" type="submit"><span aria-hidden="true">🎮</span> Main sebagai Tamu</button>
                </form>
                <p class="auth-guest-note">Mode tamu tidak menyimpan progres permainan.</p>
            </div>
            <p class="auth-footer"><span aria-hidden="true">🐍</span> Python untuk Hutan yang Lebih Baik <span aria-hidden="true">🍃</span></p>
        </section>
    </main>
</body>
</html>
