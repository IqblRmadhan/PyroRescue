<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Daftar Akun — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="auth-page" style="--icon-sheet: url('{{ asset('assets/ui/icons.png') }}')">
    <main class="auth-layout">
        <div class="auth-landscape" aria-hidden="true"></div>

        <nav class="landing-nav auth-navbar wood-plank" aria-label="Navigasi utama">
            <a class="landing-brand" href="{{ route('home') }}" aria-label="PyroRescue, kembali ke beranda">
                <span class="page-logo" aria-hidden="true"></span>
                <span class="sr-only">PyroRescue</span>
            </a>
            <div class="landing-nav__links">
                <a href="{{ route('home') }}#tentang">Tentang</a>
                <a href="{{ route('home') }}#fitur">Fitur</a>
                <a href="mailto:pyrorescue@example.com">Kontak</a>
            </div>
            <a class="landing-login" href="{{ route('login') }}">Masuk</a>
        </nav>

        <section class="auth-card auth-card--register" aria-labelledby="register-title">
            <p class="auth-banner">🌳 Buat Akun, Simpan Progres Penyelamatanmu!</p>
            <div class="auth-card__content">
                <h1 id="register-title">Daftar Akun Baru</h1>
                <p class="auth-intro">Simpan perjalanan belajarmu menjaga hutan Kalimantan.</p>
                <form method="POST" action="{{ route('register.store') }}" class="auth-form">
                    @csrf
                    <label for="name">Nama pengguna</label>
                    <input id="name" name="name" value="{{ old('name') }}" autocomplete="username" required>
                    @error('name') <p class="auth-error">{{ $message }}</p> @enderror
                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" value="{{ old('email') }}" autocomplete="email" required>
                    @error('email') <p class="auth-error">{{ $message }}</p> @enderror
                    <label for="password">Kata sandi</label>
                    <input id="password" name="password" type="password" autocomplete="new-password" required>
                    @error('password') <p class="auth-error">{{ $message }}</p> @enderror
                    <label for="password_confirmation">Ulangi kata sandi</label>
                    <input id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" required>
                    <button class="auth-button auth-button--login" type="submit">Buat Akun</button>
                </form>
                <a class="auth-back" href="{{ route('login') }}">← Sudah punya akun? Masuk</a>
            </div>
        </section>
    </main>
</body>
</html>
