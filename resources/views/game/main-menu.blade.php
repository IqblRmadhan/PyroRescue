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
                <a href="#progress">Progres</a>
                <a href="#pencapaian">Pencapaian</a>
                <a href="#modul">Modul</a>
            </nav>
            <div class="adventure-account">
                <button class="menu-music-toggle" type="button" data-menu-music-toggle data-music-url="{{ asset('assets/audio/menu-action-loop.wav') }}" aria-label="Putar musik menu" aria-pressed="false"><span class="menu-music-toggle__icon" aria-hidden="true">♫</span><span data-menu-music-label>Putar Musik</span></button>
                <div class="menu-player"><span class="menu-player__avatar" aria-hidden="true">{{ mb_substr($playerName, 0, 1) }}</span><div><span class="adventure-account__name" title="{{ $playerName }}">{{ $playerName }}</span><small>{{ $isGuest ? 'Mode tamu' : 'Akun pemain' }}</small></div></div>
                <form method="POST" action="{{ route('logout') }}">@csrf<button type="submit">Keluar</button></form>
            </div>
        </header>
        <main>
            @if(session('status'))<p class="menu-flash" role="status">{{ session('status') }}</p>@endif
            <section class="adventure-world" id="petualangan" aria-labelledby="adventure-heading">
                <div class="adventure-world__intro"><span class="adventure-eyebrow">PETA PETUALANGAN</span><h1 id="adventure-heading">Pilih Misi Penyelamatanmu</h1><p>Tulis kode Python, jelajahi Kalimantan, dan bantu jaga hutannya.</p></div>
                <div class="adventure-world__counter" aria-label="Status perjalanan"><span aria-hidden="true">✦</span><strong>{{ $isGuest ? 'Mode Bebas' : $completedLevels.' / 3' }}</strong><small>{{ $isGuest ? 'Tanpa simpan progres' : 'Level selesai' }}</small></div>
                <div class="adventure-carousel" data-level-carousel data-initial-level="{{ $selectedLevel }}" aria-label="Pilih level petualangan">
                    <button class="adventure-carousel__arrow adventure-carousel__arrow--previous" type="button" data-carousel-previous aria-label="Lihat level sebelumnya"><span aria-hidden="true">‹</span><small>Sebelumnya</small></button>
                    <div class="adventure-carousel__viewport"><div class="adventure-islands" data-carousel-track>
                        @foreach($cards as $number => $card)
                            @php $level = $levels[$number]; $position = ($number - $selectedLevel + 3) % 3; @endphp
                            <article class="adventure-level {{ !$level['unlocked'] ? 'adventure-level--locked' : '' }} {{ $number === 2 ? 'adventure-level--two' : ($number === 3 ? 'adventure-level--three' : '') }} {{ $position === 0 ? 'is-current' : ($position === 1 ? 'is-next' : 'is-previous') }}" data-level="{{ $number }}" aria-labelledby="level-{{ $number }}-title" @if($position !== 0) aria-hidden="true" @endif>
                                <button class="adventure-level__image-wrap" type="button" data-level-image
                                        data-level-title="Level {{ $number }}: {{ $card['title'] }}"
                                        data-level-href="{{ $level['unlocked'] && $level['playable'] ? route('game.level'.$number) : '' }}"
                                        aria-label="{{ $position === 0 ? ($level['unlocked'] && $level['playable'] ? 'Mainkan Level '.$number : 'Level '.$number.' belum dapat dimainkan') : 'Pilih Level '.$number }}"
                                        @if($position !== 0) tabindex="-1" @endif>
                                    <img src="{{ asset('assets/menu/'.$card['image']) }}" alt="">
                                </button>
                                <div class="adventure-level__copy">
                                    <span class="adventure-level__number">LEVEL 0{{ $number }} · {{ !$level['unlocked'] ? 'TERKUNCI' : ($level['completed'] ? 'SELESAI' : ($level['playable'] ? 'MISI TERSEDIA' : 'SEGERA HADIR')) }}</span>
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
                <section class="menu-journey" id="progress" aria-labelledby="progress-heading">
                    <div class="menu-section-heading menu-section-heading--journey">
                        <div>
                            <span class="adventure-eyebrow">POS KOMANDO / PROGRES</span>
                            <h2 id="progress-heading">Jejak Penyelamatan</h2>
                            <p>{{ $isGuest ? 'Jelajahi tiap misi dan kenali jalur penyelamatan.' : 'Lihat posisi timmu, lalu lanjutkan dari misi terakhir.' }}</p>
                        </div>
                        <span class="menu-status-pill"><span class="menu-status-pill__dot" aria-hidden="true"></span>{{ $isGuest ? 'Mode tamu · tanpa simpan progres' : 'Progres tersimpan di akunmu' }}</span>
                    </div>
                    @if($isGuest)
                        <div class="menu-guest-banner">
                            <div class="menu-guest-banner__art" aria-hidden="true" style="background-image: url('{{ asset('assets/characters/firefighter-idle.png') }}')"></div>
                            <div><span class="menu-guest-banner__eyebrow">MODE BEBAS</span><strong>Jelajahi dulu, pilih misimu.</strong><p>Level 1 dan 2 terbuka untuk tamu. Buat akun saat ingin menyimpan hasil dan mengumpulkan lencana.</p></div>
                            <a class="menu-button" href="{{ route('register') }}">Buat Akun <span aria-hidden="true">↗</span></a>
                        </div>
                    @else
                        <div class="journey-board">
                            <div class="journey-board__top">
                                <div class="journey-board__mission">
                                    <span class="journey-board__signal"><span aria-hidden="true"></span>{{ $nextMission ? 'MISI SIAP DILANJUTKAN' : 'SEMUA MISI TERSEDIA SELESAI' }}</span>
                                    @if($nextMission)
                                        <h3><small>LEVEL 0{{ $nextMission }}</small>{{ $cards[$nextMission]['title'] }}</h3>
                                        <p>{{ $levels[$nextMission]['challenges'] >= $levels[$nextMission]['total_challenges'] ? 'Seluruh misi sudah selesai. Ulangi untuk meningkatkan kualitas badge.' : ($levels[$nextMission]['challenges'] > 0 ? 'Checkpoint '.$levels[$nextMission]['challenges'].' dari '.$levels[$nextMission]['total_challenges'].' sudah selesai. Lanjutkan dari tantangan berikutnya.' : 'Misi ini siap dimainkan. Masuk ke peta untuk memulai tantangan pertama.') }}</p>
                                        <a class="journey-board__action" href="{{ route('game.level'.$nextMission) }}" data-level-entry="{{ $nextMission }}">{{ $levels[$nextMission]['challenges'] >= $levels[$nextMission]['total_challenges'] ? 'Ulangi misi' : ($levels[$nextMission]['challenges'] > 0 ? 'Lanjutkan misi' : 'Mulai misi') }} <span aria-hidden="true">↗</span></a>
                                    @else
                                        <h3><small>TIM PYRORESCUE</small>Operasi tuntas!</h3>
                                        <p>Ketiga level telah kamu selesaikan. Lihat badge yang sudah kamu kumpulkan.</p>
                                        <a class="journey-board__action" href="#pencapaian">Lihat pencapaian <span aria-hidden="true">↗</span></a>
                                    @endif
                                </div>
                                <div class="journey-board__mascot" aria-hidden="true" style="background-image: url('{{ asset('assets/characters/firefighter-idle.png') }}')"></div>
                                <dl class="journey-board__metrics" aria-label="Ringkasan progres pemain">
                                    <div><dt>LEVEL SELESAI</dt><dd><strong>{{ $completedLevels }}</strong><span>/ 3</span></dd></div>
                                    <div><dt>BINTANG</dt><dd><strong>{{ $totalStars }}</strong><span>/ 9</span></dd></div>
                                    <div><dt>LENCANA</dt><dd><strong>{{ $earnedAchievements }}</strong><span>/ {{ count($achievements) }}</span></dd></div>
                                </dl>
                            </div>
                            <ol class="journey-route" aria-label="Jalur progres level">
                                @foreach($cards as $number => $card)
                                    @php $level = $levels[$number]; @endphp
                                    <li class="journey-route__stop {{ $level['completed'] ? 'is-complete' : ($nextMission === $number ? 'is-active' : (!$level['unlocked'] ? 'is-locked' : 'is-upcoming')) }}" @if($nextMission === $number) aria-current="step" @endif>
                                        <span class="journey-route__point" aria-hidden="true">{{ $level['completed'] ? '✓' : '0'.$number }}</span>
                                        <div class="journey-route__copy">
                                            <div class="journey-route__meta"><span>LEVEL 0{{ $number }}</span><span>{{ $level['completed'] ? 'SELESAI' : (!$level['unlocked'] ? 'TERKUNCI' : (!$level['playable'] ? 'SEGERA HADIR' : ($level['challenges'] > 0 ? 'LANJUTKAN' : 'SIAP DIMULAI'))) }}</span></div>
                                            <h4>@if($level['unlocked'] && $level['playable'])<a href="{{ route('game.level'.$number) }}" data-level-entry="{{ $number }}">{{ $card['title'] }}</a>@else{{ $card['title'] }}@endif</h4>
                                            <p>{{ $level['completed'] ? 'FINISH · '.$level['score'].'% · '.$level['stars'].' bintang' : (!$level['unlocked'] ? 'Selesaikan semua misi di level sebelumnya' : (!$level['playable'] ? 'Game segera hadir' : ($level['challenges'] >= $level['total_challenges'] ? 'FINISH · '.$level['score'].'% · ulangi misi' : $level['challenges'].' / '.$level['total_challenges'].' tantangan selesai'))) }}</p>
                                            <div class="journey-route__track" role="progressbar" aria-label="Progres Level {{ $number }}" aria-valuemin="0" aria-valuemax="{{ $level['total_challenges'] }}" aria-valuenow="{{ $level['challenges'] }}"><span style="width: {{ $level['challenges'] / $level['total_challenges'] * 100 }}%"></span></div>
                                        </div>
                                    </li>
                                @endforeach
                            </ol>
                        </div>
                    @endif
                </section>
                <section class="menu-achievements" id="pencapaian" aria-labelledby="achievement-heading"><div class="menu-section-heading"><div><span class="adventure-eyebrow">JEJAK PENYELAMATAN</span><h2 id="achievement-heading">Koleksi Pencapaian</h2><p>{{ $isGuest ? 'Masuk dengan akun untuk mendapatkan dan menyimpan lencana ini.' : 'Tuntaskan tugasnya. Raih lencananya. Lanjutkan petualanganmu.' }}</p></div><span class="menu-status-pill">{{ $isGuest ? 'Khusus akun pemain' : $earnedAchievements.' / '.count($achievements).' diraih' }}</span></div>
                    <div class="menu-achievement-grid">
                        @foreach($achievements as $achievement)
                            @php
                                $badgeStyle = ['Emas' => 'gold', 'Perak' => 'silver', 'Perunggu' => 'bronze', 'Tuntas' => 'complete'][$achievement['tier'] ?? 'Emas'];
                                $achievementLevel = intdiv($loop->index, 3) + 1;
                            @endphp
                            <article class="menu-achievement {{ $achievement['earned'] ? 'is-earned' : '' }} badge--{{ $badgeStyle }}">
                                <span class="menu-achievement__number" aria-hidden="true">{{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                                <span class="menu-achievement__level">LEVEL {{ str_pad($achievementLevel, 2, '0', STR_PAD_LEFT) }}</span>
                                <div class="menu-achievement__medal">
                                    @include('game.partials.achievement-badge', ['kind' => $achievement['key'], 'badgeStyle' => $badgeStyle, 'locked' => !$achievement['earned']])
                                </div>
                                <span class="menu-achievement__state">{{ $achievement['earned'] ? '✓ DIRAIH' : ($isGuest ? 'AKUN DIPERLUKAN' : 'BELUM DIRAIH') }}</span>
                                <h3>{{ $achievement['title'] }}</h3>
                                @if($achievement['earned'] && isset($achievement['tier']))<strong class="menu-achievement__tier">{{ $achievement['tier'] }}</strong>@endif
                                <p>{{ $achievement['description'] }}</p>
                            </article>
                        @endforeach
                    </div>
                </section>
                <section class="menu-resources" id="modul" aria-labelledby="module-heading"><div><span class="adventure-eyebrow">BEKAL BELAJARMU</span><h2 id="module-heading">Butuh panduan sebelum beraksi?</h2><p>Pelajari variabel, perulangan, dan percabangan dalam modul PyroRescue. Buka lagi kapan pun kamu membutuhkan penjelasan.</p></div><a class="menu-button" href="{{ route('module.download') }}" download>↓ Unduh Modul PDF</a></section>
            </div>
        </main>
        <footer class="menu-footer"><a href="#petualangan"><img src="{{ asset('assets/ui/logo-pyrorescue.png') }}" alt="PyroRescue" width="160" height="45"></a><p>Belajar Python. Selamatkan hutan Kalimantan.</p><a href="#petualangan">Kembali ke misi ↑</a></footer>
    </div>
</body>
</html>
