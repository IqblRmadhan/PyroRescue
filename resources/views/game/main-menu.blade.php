@php
    $cards = [
        1 => ['title' => 'Tepi Sungai Terbakar', 'image' => 'level-1-island.webp', 'description' => 'Siapkan persediaan air dengan variabel Python.'],
        2 => ['title' => 'Hutan Gambut Berasap', 'image' => 'level-2-island.webp', 'description' => 'Pelajari perulangan untuk menghadapi titik api.'],
        3 => ['title' => 'Suaka Bekantan', 'image' => 'level-3-island.webp', 'description' => 'Periksa kondisi api dan selamatkan bekantan dengan if/else.'],
    ];
    $nextMission = null;
    foreach ($levels as $number => $level) {
        if ($level['unlocked'] && $level['playable'] && !$level['completed']) { $nextMission = $number; break; }
    }
    $selectedLevel = $nextMission ?? 1;
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Pilih petualangan PyroRescue dan belajar Python sambil menjaga hutan Kalimantan.">
    <title>Peta Petualangan — PyroRescue</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @include('partials.favicon')
</head>
<body class="main-menu-page">
    <div class="main-menu">
        <header class="adventure-topbar">
            <a class="adventure-brand" href="{{ route('home') }}" aria-label="PyroRescue, ke beranda"><img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue"></a>
            <nav class="adventure-topbar__links" aria-label="Navigasi utama">
                <a class="is-current" href="#petualangan">Petualangan</a>
                <a href="{{ route($isGuest ? 'register' : 'profile') }}" @if($isGuest) aria-label="Profil pemain terkunci, buat akun" @endif>Profil pemain @if($isGuest)<span class="menu-profile-lock" aria-hidden="true">🔒</span>@endif</a>
                <a href="#modul">Modul</a>
            </nav>
            <div class="adventure-account">
                <button class="menu-music-toggle" type="button" data-menu-music-toggle data-music-url="{{ asset('assets/audio/menu-action-loop.wav') }}" aria-label="Putar musik menu" aria-pressed="false"><span class="menu-music-toggle__icon" aria-hidden="true">♫</span><span data-menu-music-label>Putar Musik</span></button>
                <a class="menu-player" href="{{ route($isGuest ? 'register' : 'profile') }}" aria-label="{{ $isGuest ? 'Profil pemain terkunci, buat akun' : 'Profil '.$playerName }}"><span class="menu-player__avatar" aria-hidden="true">{{ mb_substr($playerName, 0, 1) }}</span><span><span class="adventure-account__name" title="{{ $playerName }}">{{ $playerName }}</span><small>{{ $isGuest ? 'Profil terkunci' : 'Profil pemain' }}</small></span></a>
                <form method="POST" action="{{ route('logout') }}">@csrf<button type="submit">Keluar</button></form>
            </div>
        </header>
        <main>
            @if(session('status'))<p class="menu-flash" role="status">{{ session('status') }}</p>@endif
            <section class="adventure-world" id="petualangan" aria-labelledby="adventure-heading">
                <div class="adventure-world__intro"><span class="adventure-eyebrow">PETA PETUALANGAN</span><h1 id="adventure-heading">Pilih Misi Penyelamatanmu</h1><p>Tulis kode Python, jelajahi Kalimantan, dan bantu jaga hutannya.</p></div>
                <div class="adventure-carousel" data-level-carousel data-initial-level="{{ $selectedLevel }}" aria-label="Pilih level petualangan">
                    <button class="adventure-carousel__arrow adventure-carousel__arrow--previous" type="button" data-carousel-previous aria-label="Lihat level sebelumnya"><span aria-hidden="true">‹</span><small>Sebelumnya</small></button>
                    <div class="adventure-carousel__viewport"><div class="adventure-islands" data-carousel-track>
                        @foreach($cards as $number => $card)
                            @php
                                $level = $levels[$number];
                                $position = ($number - $selectedLevel + 3) % 3;
                                $levelStatus = '';
                                if (!$level['unlocked']) $levelStatus = 'TERKUNCI';
                                elseif ($level['completed']) $levelStatus = 'SELESAI';
                                elseif (!$level['playable']) $levelStatus = 'SEGERA HADIR';
                                elseif ($isGuest) $levelStatus = 'MISI TERSEDIA';
                            @endphp
                            <article class="adventure-level {{ !$level['unlocked'] ? 'adventure-level--locked' : '' }} {{ $number === 2 ? 'adventure-level--two' : ($number === 3 ? 'adventure-level--three' : '') }} {{ $position === 0 ? 'is-current' : ($position === 1 ? 'is-next' : 'is-previous') }}" data-level="{{ $number }}" aria-labelledby="level-{{ $number }}-title" @if($position !== 0) aria-hidden="true" @endif>
                                <button class="adventure-level__image-wrap" type="button" data-level-image
                                        data-level-title="Level {{ $number }}: {{ $card['title'] }}"
                                        data-level-href="{{ $level['unlocked'] && $level['playable'] ? route('game.level'.$number) : '' }}"
                                        aria-label="{{ $position === 0 ? ($level['unlocked'] && $level['playable'] ? 'Mainkan Level '.$number : 'Level '.$number.' belum dapat dimainkan') : 'Pilih Level '.$number }}"
                                        @if($position !== 0) tabindex="-1" @endif>
                                    <img src="{{ asset('assets/menu/'.$card['image']) }}" alt="">
                                    @if(!$isGuest && !$level['unlocked'])
                                        <span class="adventure-level__lock-icon" aria-hidden="true">
                                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 20v-6a10 10 0 0 1 20 0v6" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><rect x="9" y="20" width="30" height="23" rx="4" fill="currentColor"/><circle cx="24" cy="30" r="3" fill="#143442"/><path d="M24 32v5" stroke="#143442" stroke-width="3" stroke-linecap="round"/></svg>
                                        </span>
                                    @endif
                                </button>
                                <div class="adventure-level__copy">
                                    <span class="adventure-level__number">LEVEL 0{{ $number }}{{ $levelStatus ? ' · '.$levelStatus : '' }}</span>
                                    <h2 id="level-{{ $number }}-title">{{ $card['title'] }}</h2><p>{{ $card['description'] }}</p>
                                    @if(!$level['unlocked'])
                                        <span class="adventure-level__lock">🔒 Selesaikan semua misi di Level {{ $number - 1 }}</span>
                                    @elseif($level['playable'])
                                        <a class="adventure-play" href="{{ route('game.level'.$number) }}" data-level-entry="{{ $number }}"><span aria-hidden="true">▶</span> {{ $level['completed'] || $level['challenges'] >= $level['total_challenges'] ? 'Ulangi Level '.$number : ($level['challenges'] > 0 ? 'Lanjutkan Level '.$number : 'Mainkan Level '.$number) }}</a>
                                    @else
                                        <span class="adventure-level__lock menu-coming-soon">Akses terbuka · Game segera hadir</span>
                                    @endif
                                </div>
                            </article>
                        @endforeach
                    </div></div>
                    <button class="adventure-carousel__arrow adventure-carousel__arrow--next" type="button" data-carousel-next aria-label="Lihat level berikutnya"><span aria-hidden="true">›</span><small>Berikutnya</small></button>
                    <span class="sr-only" data-carousel-status aria-live="polite"></span>
                </div>
            </section>
            <div class="menu-dashboard">
                <section class="menu-resources" id="modul" aria-labelledby="module-heading"><div><span class="adventure-eyebrow">BEKAL BELAJARMU</span><h2 id="module-heading">Butuh panduan sebelum beraksi?</h2><p>Pelajari variabel, perulangan, dan percabangan dalam modul PyroRescue. Buka lagi kapan pun kamu membutuhkan penjelasan.</p></div><a class="menu-button" href="{{ route('module.download') }}" download>↓ Unduh Modul PDF</a></section>
            </div>
        </main>
        <footer class="site-footer"><div><a href="{{ route('home') }}"><img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="165" height="48"></a><p>Belajar Python sambil menjaga hutan Kalimantan.</p></div><nav aria-label="Navigasi footer"><a href="{{ route('home') }}#tentang">Tentang</a><a href="#modul">Modul</a><a href="#petualangan">Kembali ke atas ↑</a></nav><small>© {{ date('Y') }} PyroRescue · Iqbal &amp; Indra</small></footer>
    </div>
</body>
</html>
