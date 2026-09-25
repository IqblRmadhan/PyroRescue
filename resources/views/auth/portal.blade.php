<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $initialMode === 'register' ? 'Daftar Akun' : 'Masuk' }} — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="auth-page">
    <header class="adventure-topbar auth-topbar">
        <a class="adventure-brand" href="{{ route('home') }}" aria-label="PyroRescue, ke beranda">
            <img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue">
        </a>
        <nav class="adventure-topbar__links" aria-label="Navigasi utama">
            <a href="{{ route('home') }}">Beranda</a>
            <a href="{{ route('home') }}#cara-main">Cara Bermain</a>
        </nav>
        <a class="home-login auth-topbar__switch" href="{{ $initialMode === 'register' ? route('login') : route('register') }}" data-auth-switch>
            <span class="auth-topbar__switch-label">{{ $initialMode === 'register' ? 'Masuk' : 'Daftar' }}</span> <span aria-hidden="true">↗</span>
        </a>
    </header>

    <main class="auth-screen">
        <div class="auth-stage" data-auth-stage data-mode="{{ $initialMode }}">
            <section class="auth-form-panel auth-form-panel--login" aria-labelledby="login-title" @if ($initialMode === 'register') aria-hidden="true" inert @endif>
                <div class="auth-form-content">
                    <span class="auth-form-eyebrow">SELAMAT DATANG KEMBALI</span>
                    <h1 id="login-title" tabindex="-1">Masuk ke petualangan.</h1>
                    <p class="auth-form-intro">Lanjutkan misi dan pelajaran Pythonmu.</p>

                    @if (session('status'))
                        <p class="auth-notice" role="status">{{ session('status') }}</p>
                    @endif

                    <form method="POST" action="{{ route('login.store') }}" class="auth-fields">
                        @csrf
                        <div class="auth-field">
                            <label for="login-email">Email</label>
                            <input id="login-email" name="email" type="email" value="{{ $initialMode === 'login' ? old('email') : '' }}" autocomplete="email" placeholder="nama@email.com" required>
                            @if ($initialMode === 'login') @error('email') <p class="auth-error" role="alert">{{ $message }}</p> @enderror @endif
                        </div>
                        <div class="auth-field">
                            <label for="login-password">Kata sandi</label>
                            <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Masukkan kata sandi" required>
                            @if ($initialMode === 'login') @error('password') <p class="auth-error" role="alert">{{ $message }}</p> @enderror @endif
                        </div>
                        <button class="auth-submit" type="submit">Masuk <span aria-hidden="true">→</span></button>
                    </form>

                    <div class="auth-separator"><span>atau</span></div>
                    <form method="POST" action="{{ route('login.guest') }}">
                        @csrf
                        <button class="auth-guest" type="submit">Main sebagai Tamu</button>
                    </form>
                    <p class="auth-guest-note">Mode tamu tidak menyimpan progres permainan.</p>
                    <p class="auth-switch">Belum punya akun? <a href="{{ route('register') }}" data-auth-switch>Daftar sekarang</a></p>
                </div>
            </section>

            <section class="auth-form-panel auth-form-panel--register" aria-labelledby="register-title" @if ($initialMode === 'login') aria-hidden="true" inert @endif>
                <div class="auth-form-content">
                    <span class="auth-form-eyebrow">JADI PENJAGA HUTAN</span>
                    <h1 id="register-title" tabindex="-1">Buat akun baru.</h1>
                    <p class="auth-form-intro">Simpan progres belajarmu dan mulai misi penyelamatan.</p>

                    <form method="POST" action="{{ route('register.store') }}" class="auth-fields">
                        @csrf
                        <div class="auth-field">
                            <label for="register-name">Nama pengguna</label>
                            <input id="register-name" name="name" type="text" value="{{ $initialMode === 'register' ? old('name') : '' }}" autocomplete="username" placeholder="Nama panggilanmu" required>
                            @if ($initialMode === 'register') @error('name') <p class="auth-error" role="alert">{{ $message }}</p> @enderror @endif
                        </div>
                        <div class="auth-field">
                            <label for="register-email">Email</label>
                            <input id="register-email" name="email" type="email" value="{{ $initialMode === 'register' ? old('email') : '' }}" autocomplete="email" placeholder="nama@email.com" required>
                            @if ($initialMode === 'register') @error('email') <p class="auth-error" role="alert">{{ $message }}</p> @enderror @endif
                        </div>
                        <div class="auth-field">
                            <label for="register-password">Kata sandi</label>
                            <input id="register-password" name="password" type="password" autocomplete="new-password" placeholder="Minimal 8 karakter" required>
                            @if ($initialMode === 'register') @error('password') <p class="auth-error" role="alert">{{ $message }}</p> @enderror @endif
                        </div>
                        <div class="auth-field">
                            <label for="register-password-confirmation">Ulangi kata sandi</label>
                            <input id="register-password-confirmation" name="password_confirmation" type="password" autocomplete="new-password" placeholder="Ulangi kata sandimu" required>
                        </div>
                        <button class="auth-submit" type="submit">Buat Akun <span aria-hidden="true">→</span></button>
                    </form>
                    <p class="auth-switch">Sudah punya akun? <a href="{{ route('login') }}" data-auth-switch>Masuk di sini</a></p>
                </div>
            </section>

            <section class="auth-scene" aria-label="Ilustrasi hutan dan rawa Kalimantan">
                <div class="auth-scene__light" aria-hidden="true"></div>
                <div class="auth-scene__mascot" aria-hidden="true"></div>
                <div class="auth-scene__copy auth-scene__copy--register" @if ($initialMode === 'login') aria-hidden="true" inert @endif>
                    <span class="auth-scene__eyebrow">PYRORESCUE</span>
                    <h2>Sudah siap kembali?</h2>
                    <p>Petualangan menjaga hutan dan rawa Kalimantan menantimu.</p>
                    <a class="auth-scene__button" href="{{ route('login') }}" data-auth-switch>Masuk <span aria-hidden="true">→</span></a>
                </div>
                <div class="auth-scene__copy auth-scene__copy--login" @if ($initialMode === 'register') aria-hidden="true" inert @endif>
                    <span class="auth-scene__eyebrow">PYRORESCUE</span>
                    <h2>Mulai kisahmu di sini.</h2>
                    <p>Jadilah penjaga hutan dan belajar Python lewat misi seru.</p>
                    <a class="auth-scene__button" href="{{ route('register') }}" data-auth-switch>Buat Akun <span aria-hidden="true">→</span></a>
                </div>
            </section>
        </div>
    </main>

    <script>
        (() => {
            const stage = document.querySelector('[data-auth-stage]');
            const loginUrl = @json(route('login'));
            const registerUrl = @json(route('register'));
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            const panels = {
                login: stage.querySelector('.auth-form-panel--login'),
                register: stage.querySelector('.auth-form-panel--register'),
            };
            const sceneCopies = {
                login: stage.querySelector('.auth-scene__copy--login'),
                register: stage.querySelector('.auth-scene__copy--register'),
            };
            let focusTimer;

            function showMode(mode, updateHistory = true) {
                if (mode === stage.dataset.mode) return;

                stage.dataset.mode = mode;
                for (const name of ['login', 'register']) {
                    const inactive = name !== mode;
                    panels[name].inert = inactive;
                    panels[name].setAttribute('aria-hidden', String(inactive));
                    sceneCopies[name].inert = inactive;
                    sceneCopies[name].setAttribute('aria-hidden', String(inactive));
                }

                const otherMode = mode === 'login' ? 'register' : 'login';
                const topbarSwitch = document.querySelector('.auth-topbar__switch');
                topbarSwitch.href = otherMode === 'login' ? loginUrl : registerUrl;
                topbarSwitch.querySelector('.auth-topbar__switch-label').textContent = otherMode === 'login' ? 'Masuk' : 'Daftar';
                document.title = `${mode === 'login' ? 'Masuk' : 'Daftar Akun'} — PyroRescue`;

                if (updateHistory) history.pushState({ authMode: mode }, '', mode === 'login' ? loginUrl : registerUrl);
                window.clearTimeout(focusTimer);
                focusTimer = window.setTimeout(() => panels[mode].querySelector('h1').focus({ preventScroll: true }), reducedMotion.matches ? 0 : 430);
            }

            document.querySelectorAll('[data-auth-switch]').forEach((link) => {
                link.addEventListener('click', (event) => {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    showMode(new URL(link.href).pathname === new URL(loginUrl).pathname ? 'login' : 'register');
                });
            });

            window.addEventListener('popstate', () => {
                showMode(location.pathname === new URL(registerUrl).pathname ? 'register' : 'login', false);
            });
        })();
    </script>
</body>
</html>
