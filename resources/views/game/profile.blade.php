<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Profil pemain, progres, pencapaian, dan pengaturan PyroRescue.">
    <title>Profil Pemain — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @include('partials.favicon')
</head>
<body class="profile-page">
    <header class="profile-topbar">
        <a href="{{ route('main-menu') }}" class="profile-brand"><img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="170" height="48"></a>
        <nav aria-label="Navigasi profil"><a href="{{ route('main-menu') }}">← Petualangan</a><a href="#progres">Progres</a><a href="#pencapaian">Pencapaian</a><a href="#pengaturan">Pengaturan</a></nav>
        <form method="POST" action="{{ route('logout') }}">@csrf<button type="submit">Keluar</button></form>
    </header>
    <main class="profile-main">
        @if(session('status'))<p class="profile-notice" role="status">{{ session('status') }}</p>@endif
        @if($errors->any())<div class="profile-errors" role="alert"><strong>Periksa kembali isianmu:</strong><ul>@foreach($errors->all() as $error)<li>{{ $error }}</li>@endforeach</ul></div>@endif
        <section class="profile-hero" aria-labelledby="profile-title">
            <div class="profile-avatar" aria-hidden="true">{{ mb_substr($player?->name ?? 'Pemain Tamu', 0, 1) }}</div>
            <div><span class="adventure-eyebrow">IDENTITAS PENJAGA HUTAN</span><h1 id="profile-title">{{ $player?->name ?? 'Pemain Tamu' }}</h1><p>{{ $player?->email ?? 'Mode tamu · progres hanya berlaku selama sesi ini' }}</p></div>
            <div class="profile-hero__stats"><span><strong>{{ $completedLevels }}</strong> / 3 level selesai</span><span><strong>{{ $earnedAchievements }}</strong> / {{ count($achievements) }} pencapaian</span><span><strong>{{ $totalStars }}</strong> / 9 bintang</span></div>
        </section>

        <section class="profile-section" id="progres" aria-labelledby="profile-progress-title">
            <div class="profile-section__heading"><span class="adventure-eyebrow">JEJAK PETUALANGAN</span><h2 id="profile-progress-title">Progres Level</h2><p>{{ $player ? 'Lanjutkan perjalanan dari level yang terbuka.' : 'Buat akun agar progres dan pencapaian tersimpan.' }}</p></div>
            <div class="profile-levels">
                @foreach([1 => 'Tepi Sungai Terbakar', 2 => 'Hutan Gambut Berasap', 3 => 'Suaka Bekantan'] as $number => $title)
                    @php $level = $levels[$number]; @endphp
                    <article class="profile-level">
                        <span class="profile-level__number">LEVEL 0{{ $number }}</span><span class="profile-level__state">{{ $level['completed'] ? 'SELESAI' : ($level['unlocked'] ? 'TERBUKA' : 'TERKUNCI') }}</span>
                        <h3>{{ $title }}</h3><p>{{ $level['challenges'] }} / {{ $level['total_challenges'] }} tahap selesai</p>
                        <div class="profile-level__track" role="progressbar" aria-label="Progres Level {{ $number }}" aria-valuemin="0" aria-valuemax="{{ $level['total_challenges'] }}" aria-valuenow="{{ $level['challenges'] }}"><span style="width: {{ $level['challenges'] / $level['total_challenges'] * 100 }}%"></span></div>
                        <small>{{ $level['completed'] ? 'Nilai terbaik '.$level['score'].'% · '.$level['stars'].' bintang' : ($level['unlocked'] ? 'Siap dimainkan' : 'Selesaikan level sebelumnya') }}</small>
                        @if($level['unlocked'])<a href="{{ route('game.level'.$number) }}" data-level-entry="{{ $number }}">{{ $level['completed'] ? 'Main lagi' : 'Mainkan level' }} →</a>@endif
                    </article>
                @endforeach
            </div>
        </section>

        <section class="profile-section" id="pencapaian" aria-labelledby="profile-achievements-title">
            <div class="profile-section__heading"><span class="adventure-eyebrow">KOLEKSI LENCANA</span><h2 id="profile-achievements-title">Pencapaian</h2><p>Lencana yang diraih mengikuti progres misi dan nilai terbaikmu.</p></div>
            <div class="menu-achievement-grid">
                @foreach($achievements as $achievement)
                    @php $badgeStyle = ['Emas' => 'gold', 'Perak' => 'silver', 'Perunggu' => 'bronze', 'Tuntas' => 'complete'][$achievement['tier'] ?? 'Emas']; @endphp
                    <article class="menu-achievement {{ $achievement['earned'] ? 'is-earned' : '' }} badge--{{ $badgeStyle }}">
                        <span class="menu-achievement__level">LEVEL {{ str_pad(intdiv($loop->index, 3) + 1, 2, '0', STR_PAD_LEFT) }}</span>
                        <div class="menu-achievement__medal">@include('game.partials.achievement-badge', ['kind' => $achievement['key'], 'badgeStyle' => $badgeStyle, 'locked' => !$achievement['earned']])</div>
                        <span class="menu-achievement__state">{{ $achievement['earned'] ? '✓ DIRAIH' : 'BELUM DIRAIH' }}</span><h3>{{ $achievement['title'] }}</h3><p>{{ $achievement['description'] }}</p>
                    </article>
                @endforeach
            </div>
        </section>

        <section class="profile-section" id="pengaturan" aria-labelledby="profile-settings-title">
            <div class="profile-section__heading"><span class="adventure-eyebrow">SESUAIKAN PETUALANGAN</span><h2 id="profile-settings-title">Pengaturan</h2><p>Preferensi audio dan tampilan tersimpan di perangkat ini.</p></div>
            <div class="profile-settings-grid">
                <div class="profile-card"><h3>Audio</h3><label class="profile-toggle"><span><strong>Musik</strong><small>Musik menu dan latar game</small></span><input type="checkbox" data-preference="music" checked></label><label class="profile-toggle"><span><strong>Efek suara</strong><small>Langkah, dialog, dan aksi misi</small></span><input type="checkbox" data-preference="effects" checked></label></div>
                <div class="profile-card"><h3>Tampilan &amp; Kenyamanan</h3><label class="profile-toggle"><span><strong>Kurangi animasi</strong><small>Batasi gerakan dan efek visual</small></span><input type="checkbox" data-preference="reducedMotion"></label><label class="profile-toggle"><span><strong>Teks lebih besar</strong><small>Memudahkan membaca petunjuk</small></span><input type="checkbox" data-preference="largeText"></label><label class="profile-toggle"><span><strong>Kontras tinggi</strong><small>Perjelas batas dan tulisan</small></span><input type="checkbox" data-preference="highContrast"></label></div>
            </div>
        </section>

        <section class="profile-section" aria-labelledby="profile-account-title"><div class="profile-section__heading"><span class="adventure-eyebrow">AKUN PEMAIN</span><h2 id="profile-account-title">Pengaturan Umum</h2></div>
            @if($player)
            <div class="profile-settings-grid">
                <form class="profile-card profile-form" method="POST" action="{{ route('profile.update') }}">@csrf @method('PATCH')<h3>Ubah profil</h3><label>Nama pemain<input name="name" value="{{ old('name', $player->name) }}" maxlength="100" required></label><label>Email<input type="email" name="email" value="{{ old('email', $player->email) }}" required></label><button type="submit">Simpan profil</button></form>
                <form class="profile-card profile-form" method="POST" action="{{ route('profile.password') }}">@csrf @method('PATCH')<h3>Ubah kata sandi</h3><label>Kata sandi saat ini<input type="password" name="current_password" autocomplete="current-password" required></label><label>Kata sandi baru<input type="password" name="password" autocomplete="new-password" minlength="8" required></label><label>Ulangi kata sandi baru<input type="password" name="password_confirmation" autocomplete="new-password" required></label><button type="submit">Simpan kata sandi</button></form>
            </div>
            <details class="profile-delete"><summary>Hapus akun</summary><p>Tindakan ini menghapus akun beserta progres level secara permanen.</p><form method="POST" action="{{ route('profile.destroy') }}">@csrf @method('DELETE')<label>Kata sandi saat ini<input type="password" name="password" autocomplete="current-password" required></label><label>Ketik HAPUS untuk konfirmasi<input name="confirmation" autocomplete="off" required></label><button type="submit">Hapus akun saya</button></form></details>
            @else
            <div class="profile-card"><h3>Simpan perjalananmu</h3><p>Mode tamu tidak menyimpan progres atau lencana. Daftar untuk membuat profil pemain.</p><a class="profile-primary-link" href="{{ route('register') }}">Buat Akun →</a></div>
            @endif
        </section>
    </main>
    <footer class="site-footer"><div><img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="165" height="48"><p>Belajar Python sambil menjaga hutan Kalimantan.</p></div><nav aria-label="Navigasi footer"><a href="{{ route('home') }}">Beranda</a><a href="{{ route('main-menu') }}">Petualangan</a><a href="#profile-title">Kembali ke atas ↑</a></nav><small>© {{ date('Y') }} PyroRescue · Iqbal &amp; Indra</small></footer>
</body>
</html>
