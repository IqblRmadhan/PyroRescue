@php
    $levelNumber = $levelNumber ?? 1;
    $isLevel2 = $levelNumber === 2;
    $isLevel3 = $levelNumber === 3;
    $hasEvaluation = $levelNumber > 1;
    $levelTitle = $isLevel3 ? 'Suaka Bekantan' : ($isLevel2 ? 'Hutan Gambut Berasap' : 'Tepi Sungai Terbakar');
    // Story Level 2 dipakai sementara untuk Level 3.
    $storyScenes = $hasEvaluation
        ? [
            [
                'image' => 'assets/story/level2/1.png',
                'alt' => 'Anggota PyroRescue tiba di jembatan menuju hutan gambut yang terbakar',
                'text' => 'Setelah menuntaskan misi pertama, anggota PyroRescue tiba di jembatan menuju hutan gambut. Di seberang sungai, tanah mulai hangus dan asap muncul dari beberapa arah.',
            ],
            [
                'image' => 'assets/story/level2/2.png',
                'alt' => 'Kebakaran menyebar di antara pepohonan setelah jembatan',
                'text' => 'Kebakaran kali ini lebih parah. Api telah menyebar ke beberapa titik, menghitamkan pepohonan, dan memenuhi udara dengan asap yang lebih tebal daripada sebelumnya.',
            ],
            [
                'image' => 'assets/story/level2/3.png',
                'alt' => 'Komandan PyroRescue memberi briefing melalui radio dari pos',
                'speaker' => 'KOMANDAN',
                'text' => 'Api sudah menyebar ke beberapa titik. Satu kali semprotan tidak cukup. Gunakan perulangan untuk memadamkan api secara efektif.',
            ],
            [
                'image' => 'assets/story/level2/4.png',
                'alt' => 'Anggota PyroRescue memegang PyroPad sebelum memasuki area operasi',
                'text' => 'Dengan PyroPad di tangan, anggota PyroRescue bersiap menyeberangi jembatan, mengisi tangki di pompa, lalu memadamkan tiga titik api satu per satu.',
            ],
        ]
        : [
            [
                'image' => 'assets/story/level1/scene-1.png',
                'alt' => 'Mobil pemadam PyroRescue tiba di pos kecil dekat hutan yang terbakar',
                'text' => 'Mobil Tim PyroRescue berhenti di sebuah pos kecil dekat sungai.',
            ],
            [
                'image' => 'assets/story/level1/scene-2.png',
                'alt' => 'Asap tebal, api hutan, dan burung-burung yang terbang menjauh',
                'text' => 'Langit mulai tertutup asap, suara radio terdengar putus-putus, dan beberapa burung beterbangan keluar dari arah hutan.',
            ],
            [
                'image' => 'assets/story/level1/scene-3.png',
                'alt' => 'Komandan PyroRescue menyampaikan laporan melalui radio',
                'speaker' => 'KOMANDAN',
                'text' => 'Asap semakin tebal. Tim pemantau menemukan jalur masuk menuju titik api pertama, tapi akses ke sana mulai tertutup.',
            ],
            [
                'image' => 'assets/story/level1/scene-4.png',
                'alt' => 'Anggota PyroRescue berdiri di depan jalur hutan sambil memegang PyroPad',
                'text' => 'Pemain turun dari mobil dan sudah memegang PyroPad. Ia bersiap untuk masuk ke jalur hutan.',
            ],
        ];
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>PyroRescue - Level {{ $levelNumber }}: {{ $levelTitle }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @include('partials.favicon')
</head>
<body class="game-prototype game-workspace game-scale-80 is-page-loading" data-audio-base-url="{{ asset('assets/audio') }}" style="--icon-sheet: url('{{ asset('assets/ui/icons.png') }}')">
    @include('partials.page-loader')
    <section id="level-story" class="level-story" role="dialog" aria-modal="true" aria-labelledby="story-title" inert
             data-game-page="prototype-page" data-level-number="{{ $levelNumber }}">
        <h1 id="story-title" class="sr-only">Cerita pembuka Level {{ $levelNumber }}</h1>

        <div class="story-stage">
            <button id="story-skip" class="story-skip" type="button">LEWATI CERITA</button>

            <div class="story-progress" aria-hidden="true">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            @foreach($storyScenes as $scene)
            <article class="story-slide{{ $loop->first ? ' is-active' : '' }}{{ isset($scene['speaker']) ? ' story-slide--commander' : '' }}"
                     data-story-slide @unless($loop->first) hidden @endunless>
                <img src="{{ asset($scene['image']) }}" alt="{{ $scene['alt'] }}">
                <div class="story-dialogue{{ isset($scene['speaker']) ? ' story-dialogue--commander' : '' }}">
                    @isset($scene['speaker'])
                    <strong class="story-speaker">{{ $scene['speaker'] }}</strong>
                    @endisset
                    <p>{{ $scene['text'] }}</p>
                </div>
            </article>
            @endforeach

            <button id="story-next" class="story-next" type="button" aria-label="Lanjut ke adegan berikutnya">
                <span class="story-next__label">LANJUT</span>
                <span class="story-next__arrow" aria-hidden="true"></span>
            </button>

            <p id="story-status" class="sr-only" aria-live="polite">Adegan 1 dari 4</p>
        </div>
    </section>

    <div id="prototype-page" class="prototype-page" inert>
        <header class="game-header">
            <a href="{{ route('main-menu') }}" class="game-brand-logo" aria-label="Kembali ke menu utama PyroRescue"></a>

            <div class="level-title wood-sign">
                <span class="level-title__eyebrow">MISI PENYELAMATAN · LEVEL 0{{ $levelNumber }}</span>
                <h1>{{ $levelTitle }}</h1>
            </div>

            <div class="forest-message wood-sign">
                <span class="forest-message__label">MODUL BELAJAR</span>
                <strong>Python · {{ $isLevel3 ? 'If / Else' : ($isLevel2 ? 'Perulangan' : 'Variabel') }}</strong>
            </div>
        </header>

        <main class="game-layout">
            <section class="game-area wood-frame" aria-label="Area game Level {{ $levelNumber }}">
                <div class="game-hud" aria-label="Status permainan">
                    <div class="hud-counter" aria-label="{{ $hasEvaluation ? 'Isi tangki dan kapasitas air' : 'Isi air dan target' }}" title="{{ $hasEvaluation ? 'Isi tangki / kapasitas 6 unit' : 'Isi air / target' }}">
                        <span class="asset-icon asset-icon--water" aria-hidden="true"></span>
                        <strong><span id="water-count">0</span>/<span id="required-water">{{ $hasEvaluation ? '6' : '3' }}</span></strong>
                    </div>
                    <div class="hud-health" title="HP menentukan kualitas badge. Kode salah: -5 HP. Tabrakan: -10 HP.">
                        <span class="hud-health__icon" aria-hidden="true">&#9829;</span>
                        <div id="health-bar" class="hud-health__track" role="progressbar" aria-label="HP / nilai permainan"
                             aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
                            <span id="health-fill" class="hud-health__fill"></span>
                            <strong class="hud-health__value" aria-hidden="true"><span id="score-value">100</span> / 100</strong>
                        </div>
                    </div>
                    @if($isLevel3)
                    <div class="hud-counter hud-counter--condition" aria-live="polite">
                        <strong>api_padam = <span id="fire-condition">False</span></strong>
                    </div>
                    <div class="hud-counter hud-counter--bekantan" aria-live="polite">
                        <strong>BEKANTAN: <span id="bekantan-status">TUNGGU</span></strong>
                    </div>
                    @endif
                </div>

                <div id="game-container" role="img"
                     aria-label="Peta hutan Kalimantan. Cubit touchpad untuk zoom, geser dua jari atau klik dan seret untuk menggeser peta. Kamera mengikuti pemadam saat kode dijalankan."
                     data-level="{{ $levelNumber }}" data-asset-base-url="{{ asset('assets') }}"
                     data-progress-url="{{ ($saveProgress ?? false) ? route('progress.challenge') : '' }}"
                     data-earned-achievements="{{ json_encode($earnedAchievementKeys ?? []) }}"
                     data-resume-challenge="{{ $resumeChallenge ?? 1 }}"></div>

                <div id="damage-overlay" class="game-damage-overlay" aria-hidden="true"></div>

                <div class="game-map-controls" aria-label="Kontrol musik, efek suara, bantuan, dan pengulangan misi">
                    <button id="music-toggle" class="hint-button hint-button--music" type="button" aria-label="Matikan musik game" aria-pressed="true">
                        <span class="hint-button__icon" aria-hidden="true">&#127925;</span>
                        <span class="hint-button__label">Musik</span>
                    </button>
                    <button id="audio-toggle" class="hint-button hint-button--audio" type="button" aria-label="Matikan efek suara dan karakter" aria-pressed="true">
                        <span class="hint-button__icon" aria-hidden="true">&#128266;</span>
                        <span class="hint-button__label">SFX</span>
                    </button>
                    <button id="reset" class="hint-button hint-button--reset" type="button" aria-label="Ulangi challenge saat ini" disabled>
                        <span class="hint-button__icon" aria-hidden="true">&#8635;</span>
                        <span class="hint-button__label">Ulangi</span>
                    </button>
                    <div id="game-hint" class="game-hint">
                        <button id="hint" class="hint-button hint-button--help" type="button" aria-label="Buka hint" aria-expanded="false" aria-controls="hint-text">
                            <span class="hint-button__icon" aria-hidden="true">&#128161;</span>
                            <span class="hint-button__label">Hint</span>
                        </button>
                        <p id="hint-text" aria-live="polite" hidden>Susun instruksi dari atas ke bawah.</p>
                    </div>
                </div>

            </section>

            <aside class="game-panel wood-frame" aria-label="Challenge dan editor PyroPad">
                <section class="mission-card mission-card--briefing" aria-labelledby="mission-title">
                    <span class="mission-card__icon" aria-hidden="true">🎯</span>
                    <div>
                        <h2 id="mission-title">{{ $isLevel3 ? 'Challenge 1 - Memadamkan Api di Habitat' : ($isLevel2 ? 'Challenge 1 - Mengenal Semprotan' : 'Challenge 1 - Mengambil Air') }}</h2>
                        <ul id="target-list" class="target-list" aria-label="Target challenge">
                            <li id="target-pump"><span class="target-check" aria-hidden="true"></span>{{ $isLevel3 ? 'Siapkan 3 unit air di pompa' : ($isLevel2 ? 'Ambil 6 unit air di pompa' : 'Pergi ke pompa air') }}</li>
                            @if($hasEvaluation)
                            <li><span class="target-check" aria-hidden="true"></span>Pergi ke penanda C1</li>
                            @endif
                            <li id="target-water"><span class="target-check" aria-hidden="true"></span>{{ $hasEvaluation ? 'Padamkan api' : 'Ambil 3 air' }}</li>
                        </ul>
                    </div>
                </section>

                <div class="panel-content">
                    <label class="sr-only" for="code-editor">Kode Python untuk PyroPad</label>
                    <div class="code-editor-wrapper">
                        <div class="code-editor-screen">
                            <div class="code-line-numbers" aria-hidden="true">
                                <div id="code-line-numbers-content">1.</div>
                            </div>
                            <div class="code-editor-input">
                                <textarea id="code-editor" rows="12" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off"
                                          aria-autocomplete="list" aria-controls="code-suggestions" aria-expanded="false"
                                          aria-describedby="editor-help" placeholder="Tulis kode Python di sini..."></textarea>
                                <ul id="code-suggestions" role="listbox" aria-label="Saran kode" hidden></ul>
                            </div>
                        </div>
                    </div>
                    <p id="editor-help" class="sr-only">
                        Mulai ketik <code>atas(angka)</code>, <code>bawah(angka)</code>, <code>kanan(angka)</code>, <code>kiri(angka)</code>,
                        @if($isLevel3) <code>isi_air</code>, <code>jumlah_semprot</code>, <code>for</code>, <code>if api_padam:</code>, atau <code>else:</code>.
                        @elseif($isLevel2) <code>isi_air = 6</code>, <code>semprot()</code>, <code>for</code>, atau <code>jumlah_semprot</code>.
                        @else <code>isi_air</code>, atau <code>air_pos</code>. @endif
                        Pilih dengan tombol panah dan Enter. Tekan Ctrl dan Space untuk melihat semua pilihan.
                    </p>

                    <div class="game-buttons">
                        <button id="run-code" class="game-action-button game-action-button--run" type="button" disabled>
                            <span aria-hidden="true">&#9654;</span>
                            Run Code
                        </button>
                        <button id="clear-code" class="game-action-button game-action-button--clear" type="button" aria-label="Hapus semua kode di PyroPad" disabled>
                            <span aria-hidden="true">&#128465;</span>
                            Hapus
                        </button>
                    </div>
                    <button id="material-open" class="game-guide-button" type="button"
                            aria-controls="material-dialog" aria-expanded="false">
                        <span aria-hidden="true">&#128214;</span>
                        Baca Materi
                    </button>
                    <p id="code-error" class="code-error" role="alert" hidden></p>
                    <p id="editor-action-status" class="sr-only" role="status"></p>
                </div>
            </aside>
        </main>

        @if($levelNumber === 1)
        <footer class="game-tutorial-footer">
            <button id="tutorial-open" class="game-tutorial-open" type="button" aria-controls="level1-tutorial">
                <span aria-hidden="true">?</span> Cara Bermain
            </button>
        </footer>
        @endif

        <noscript>Aktifkan JavaScript untuk menampilkan area game.</noscript>
    </div>

    @if($levelNumber === 1)
    <div id="level1-tutorial" class="level1-tutorial" role="dialog" aria-modal="true" aria-labelledby="level1-tutorial-title" hidden>
        <div class="level1-tutorial__spotlight" aria-hidden="true"></div>
        <div class="level1-tutorial__card">
            <div class="level1-tutorial__topline"><span>CARA BERMAIN</span><button type="button" data-tutorial-skip aria-label="Lewati cara bermain">Lewati ×</button></div>
            <div class="level1-tutorial__heading"><span class="level1-tutorial__mascot" aria-hidden="true"></span><div><span data-tutorial-eyebrow></span><h2 id="level1-tutorial-title" data-tutorial-title></h2></div></div>
            <p data-tutorial-text></p>
            <div class="level1-tutorial__note"><span aria-hidden="true">✦</span><span data-tutorial-note></span></div>
            <div class="level1-tutorial__footer"><span data-tutorial-progress></span><div><button type="button" data-tutorial-back>Sebelumnya</button><button type="button" data-tutorial-next>Lanjut</button></div></div>
        </div>
    </div>
    @endif

    <dialog id="feedback" class="mission-guide" data-state="instruction"
            aria-labelledby="guide-title" aria-describedby="feedback-message">
        <div class="mission-guide__stage">
            <div class="mission-guide__portrait" aria-hidden="true">
                <img src="{{ asset('assets/characters/mission-guide.png') }}" alt="" width="887" height="1774">
            </div>
            <div class="mission-guide__bubble">
                <div class="mission-guide__heading">
                    <span class="mission-guide__name"><span class="mission-guide__badge" aria-hidden="true">&#10022;</span> TIM PYRORESCUE</span>
                    <span class="mission-guide__role">PEMANDU MISI</span>
                </div>
                <div class="mission-guide__copy" role="status" aria-live="polite" aria-atomic="true">
                    <strong id="guide-title">Langkah berikutnya</strong>
                    <p id="feedback-message"></p>
                </div>
                <div class="mission-guide__actions">
                    <small id="guide-progress"></small>
                    <button id="feedback-ok" type="button" autofocus>
                        <span id="guide-next-label">Mengerti</span>
                        <span class="mission-guide__arrow" aria-hidden="true">&#10140;</span>
                    </button>
                </div>
            </div>
        </div>
    </dialog>

    <section id="material-dialog" class="material-dialog" role="dialog" aria-modal="true"
             aria-labelledby="material-dialog-title" hidden>
        <div class="material-dialog__card">
            <header class="material-dialog__header">
                <div>
                    <span class="learning-eyebrow">MODUL BELAJAR</span>
                    <h2 id="material-dialog-title">Materi Python</h2>
                </div>
                <button class="material-dialog__close" type="button" data-material-close aria-label="Tutup materi">&times;</button>
            </header>

            <section id="learning-panel" class="learning-panel game-study" aria-label="Materi dan kamus perintah">
                <section class="learning-card">
                    <span class="learning-eyebrow">BELAJAR SAMBIL MENYELAMATKAN</span>
                    @if($isLevel3)
                    <h2>Boolean &amp; penyelamatan bekantan</h2>
                    <p><code>api_padam</code> bernilai <code>True</code> jika api padam dan <code>False</code> jika masih menyala. Sistem memperbarui kondisi setelah penyemprotan. Gunakan <code>if</code> untuk memeriksanya dan <code>else</code> sebagai alternatif.</p>
                    @elseif($isLevel2)
                    <h2>Semprotan &amp; perulangan</h2>
                    <p>Di pompa, <code>isi_air = 6</code> mengisi tangki untuk enam semprotan. Setiap <code>semprot()</code> memakai satu unit. Gunakan <code>for</code> dan <code>range()</code> untuk mengulang aksi sesuai kebutuhan api.</p>
                    @else
                    <h2>Variabel &amp; persediaan air</h2>
                    <p>Variabel adalah nama untuk menyimpan nilai. Bayangkan label pada tangki: <code>isi_air</code> menyimpan jumlah air yang dibawa pemadam.</p>
                    @endif
                    <ol class="learning-steps" aria-label="Tahapan materi">
                        <li data-lesson-step="1">1. {{ $isLevel3 ? 'Boolean' : ($isLevel2 ? 'Semprot' : 'Simpan') }}</li>
                        <li data-lesson-step="2">2. {{ $isLevel3 ? 'if' : ($isLevel2 ? 'Ulangi' : 'Ubah') }}</li>
                        <li data-lesson-step="3">3. {{ $isLevel3 ? 'if / else' : ($isLevel2 ? 'Variabel + for' : 'Gunakan') }}</li>
                    </ol>
                    <h3 id="lesson-title"></h3>
                    <code id="lesson-code" class="lesson-code"></code>
                    <p id="lesson-explanation"></p>
                    <p id="lesson-effect" class="lesson-effect"></p>
                    <p class="learning-note">@if($isLevel3) <code>True</code> dan <code>False</code> ditulis tanpa tanda petik. Header <code>if</code> dan <code>else</code> diakhiri <code>:</code>; bloknya menjorok dengan indentasi konsisten. Gunakan <code>status_bekantan = "aman"</code> pada C2, lalu <code>"selamat"</code> atau <code>"tunggu"</code> pada C3. @elseif($isLevel2) Tanda <code>=</code> menyimpan nilai air; berkurangnya air saat <code>semprot()</code> adalah aturan game. Akhiri header <code>for</code> dengan <code>:</code> dan beri empat spasi sebelum <code>semprot()</code>. @else Tanda <code>=</code> berarti menyimpan nilai di sebelah kanan ke nama di sebelah kiri. Ini bukan tanda perbandingan. @endif</p>
                </section>

                <section class="command-reference learning-card" aria-labelledby="command-reference-title">
                    <h3 id="command-reference-title">Kamus perintah</h3>
                    <p>Klik tombol perintah untuk membaca penjelasannya.</p>
                    <div id="command-reference-list" class="command-reference-list"></div>
                <aside id="code-suggestion-help" class="code-suggestion-help" aria-label="Penjelasan perintah" aria-live="polite" hidden>
                    <div class="code-suggestion-help__heading">
                        <code data-help-command></code>
                        <span data-help-kind></span>
                    </div>
                    <p data-help-description></p>
                    <div class="code-suggestion-help__example">
                        <strong>Contoh</strong>
                        <code data-help-example></code>
                    </div>
                    <div class="code-suggestion-help__parameter">
                        <strong>Parameter</strong>
                        <p><code data-help-parameter></code> <span data-help-parameter-description></span></p>
                    </div>
                    <small>Contoh dibaca dari atas ke bawah. Tulis satu perintah di setiap baris PyroPad.</small>
                </aside>
                </section>

            </section>

            <footer class="material-dialog__footer">
                <button type="button" data-material-close>Tutup</button>
            </footer>
        </div>
    </section>

    <button id="game-sync-warning" class="game-sync-warning" type="button" hidden>Progres belum tersimpan. Klik untuk mencoba lagi.</button>
    <div id="achievement-icon-library" hidden>
        @foreach($achievements ?? [] as $achievement)
            <span data-achievement-key="{{ $achievement['key'] }}">
                @include('game.partials.achievement-badge', ['kind' => $achievement['key']])
            </span>
        @endforeach
    </div>
    <section id="level-result" class="level-result" role="dialog" aria-modal="true" aria-labelledby="result-title" hidden>
        <div class="level-result__card">
            <span id="result-eyebrow" class="level-result__eyebrow">HASIL PERMAINAN</span>
            <h2 id="result-title" tabindex="-1">Level {{ $levelNumber }} Berhasil!</h2>
            <p id="result-subtitle" class="level-result__subtitle">Hasil evaluasi penyelamatanmu.</p>
            <div id="result-stars" class="level-result__stars" role="img" aria-label="0 dari 3 bintang">
                <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
            </div>
            <div class="level-result__score"><span>NILAI MISI</span><strong id="result-score">100%</strong><span id="result-star-count">3 / 3 bintang</span></div>
            <div id="result-reward" class="level-result__reward">
                <div id="result-badge" class="level-result__badge">
                    @include('game.partials.achievement-badge', ['kind' => [1 => 'supply', 2 => 'shield', 3 => 'rescue'][$levelNumber]])
                </div>
                <div><span class="level-result__reward-label">BADGE DIRAIH</span><strong id="result-rating"></strong><span id="result-tier" class="level-result__tier"></span></div>
            </div>
            <details class="level-result__learning"><summary>Bekal yang kamu kuasai</summary>
            <p id="result-recap" class="level-result__recap">@if($isLevel3) Kamu menggabungkan variabel, <code>for/range</code>, dan <code>if/else</code> untuk memadamkan api serta menyelamatkan bekantan. Tiga level PyroRescue selesai! @elseif($isLevel2) Kamu memakai <code>semprot()</code>, mengulang aksi dengan <code>for/range</code>, lalu menentukan iterasi melalui <code>jumlah_semprot</code>. @else Kamu menyimpan <code>isi_air = 3</code>, memperbaruinya menjadi <code>isi_air = 5</code> setelah mendapat 2 unit bantuan, lalu memakai nilainya di Pos 2. @endif</p>
            </details>
            <p id="progress-sync-status" class="progress-sync-status" role="status">{{ ($saveProgress ?? false) ? 'Hasil akan tersimpan di akunmu.' : 'Mode tamu: hasil dan pencapaian tidak disimpan.' }}</p>
            <button id="progress-sync-retry" class="progress-sync-retry" type="button" hidden>Coba simpan lagi</button>
            <div class="level-result__actions">
                <button id="result-replay" type="button">Main Lagi</button>
                @if($levelNumber < 3)<a id="next-level-link" href="{{ route('game.level'.($levelNumber + 1)) }}" data-level-entry="{{ $levelNumber + 1 }}" data-requires-save>Lanjut Level {{ $levelNumber + 1 }}</a>@endif
                <a href="{{ route('main-menu') }}">Menu Utama</a>
            </div>
        </div>
    </section>
</body>
</html>
