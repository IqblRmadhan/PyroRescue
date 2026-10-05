@php
    $levelNumber = $levelNumber ?? 1;
    $isLevel2 = $levelNumber === 2;
    $levelTitle = $isLevel2 ? 'Hutan Gambut Berasap' : 'Tepi Sungai Terbakar';
    $storyScenes = $isLevel2
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
    <title>PyroRescue - Level {{ $levelNumber }}: {{ $levelTitle }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="game-prototype game-workspace" data-audio-base-url="{{ asset('assets/audio') }}" style="--icon-sheet: url('{{ asset('assets/ui/icons.png') }}')">
    <section id="level-story" class="level-story" role="dialog" aria-modal="true" aria-labelledby="story-title"
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
                <strong>Python · {{ $isLevel2 ? 'Perulangan' : 'Variabel' }}</strong>
            </div>
        </header>

        <main class="game-layout">
            <section class="game-area wood-frame" aria-label="Area game Level {{ $levelNumber }}">
                <div class="game-hud" aria-label="Status permainan">
                    <div class="hud-counter" aria-label="{{ $isLevel2 ? 'Isi tangki dan kapasitas air' : 'Isi air dan target' }}" title="{{ $isLevel2 ? 'Isi tangki / kapasitas 6 unit' : 'Isi air / target' }}">
                        <span class="asset-icon asset-icon--water" aria-hidden="true"></span>
                        <strong><span id="water-count">0</span>/<span id="required-water">{{ $isLevel2 ? '6' : '3' }}</span></strong>
                    </div>
                    <div class="hud-counter">
                        <span class="asset-icon asset-icon--star" aria-hidden="true"></span>
                        <strong><span id="mission-stars">0</span>/<span id="mission-target-count">{{ $isLevel2 ? '3' : '2' }}</span></strong>
                    </div>
                </div>

                <div id="game-container" role="img"
                     aria-label="Peta hutan Kalimantan. Cubit touchpad untuk zoom, geser dua jari atau klik dan seret untuk menggeser peta. Kamera mengikuti pemadam saat kode dijalankan."
                     data-level="{{ $levelNumber }}" data-asset-base-url="{{ asset('assets') }}"></div>

                <div class="game-map-controls" aria-label="Kontrol suara, bantuan, dan pengulangan misi">
                    <button id="audio-toggle" class="hint-button hint-button--audio" type="button" aria-label="Suara game" aria-pressed="true">
                        <span class="hint-button__icon" aria-hidden="true">&#128266;</span>
                        <span class="hint-button__label">Suara</span>
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

                <div id="feedback" class="game-dialog" role="status" aria-live="polite">
                    <span class="feedback-icon" aria-hidden="true"></span>
                    <div class="feedback-copy">
                        <strong class="feedback-title" aria-hidden="true"></strong>
                        <p id="feedback-message"></p>
                    </div>
                    <button id="feedback-ok" type="button">OK</button>
                </div>
            </section>

            <aside class="game-panel wood-frame" aria-label="Misi dan editor PyroPad">
                <section class="mission-card mission-card--briefing" aria-labelledby="mission-title">
                    <span class="mission-card__icon" aria-hidden="true">🎯</span>
                    <div>
                        <h2 id="mission-title">{{ $isLevel2 ? 'Challenge 1 - Mengenal Semprotan' : 'Challenge 1 - Mengambil Air' }}</h2>
                        <p id="mission-description">{{ $isLevel2 ? 'Isi isi_air = 6 di pompa, lalu gunakan 2 semprotan untuk api C1.' : 'Pergi ke pompa di tepi sungai, lalu simpan 3 unit air ke dalam variabel isi_air.' }}</p>
                    </div>
                </section>

                <section class="mission-card mission-card--targets" aria-labelledby="target-title">
                    <span class="asset-icon asset-icon--star" aria-hidden="true"></span>
                    <div>
                        <h2 id="target-title">Target</h2>
                        <ul id="target-list" class="target-list">
                            <li id="target-pump"><span class="target-check" aria-hidden="true"></span>{{ $isLevel2 ? 'Ambil 6 unit air di pompa' : 'Pergi ke pompa air' }}</li>
                            @if($isLevel2)
                            <li><span class="target-check" aria-hidden="true"></span>Pergi ke penanda C1</li>
                            @endif
                            <li id="target-water"><span class="target-check" aria-hidden="true"></span>{{ $isLevel2 ? 'Padamkan api' : 'Ambil 3 air' }}</li>
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
                        @if($isLevel2) <code>isi_air = 6</code>, <code>semprot()</code>, <code>for</code>, atau <code>jumlah_semprot</code>.
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
                    <p id="editor-action-status" class="sr-only" role="status"></p>

                    <a class="game-guide-link" href="#learning-panel">Baca materi &amp; tips bermain <span aria-hidden="true">↓</span></a>

                </div>
            </aside>

            <section id="learning-panel" class="learning-panel game-study wood-frame" aria-labelledby="study-title">
                <header class="game-study__heading">
                    <div>
                        <span class="game-study__eyebrow">BACA, COBA, LALU AMATI</span>
                        <h2 id="study-title">Panduan belajar &amp; bermain</h2>
                        <p>Pelajari materinya di sini, lalu terapkan di PyroPad. Penjelasan mengikuti challenge yang sedang kamu mainkan.</p>
                    </div>
                    <a href="#code-editor" class="game-study__return">Kembali ke PyroPad ↑</a>
                </header>
                <ol class="game-study__flow" aria-label="Cara memainkan misi">
                    <li><span>01</span><div><strong>Amati map dan target</strong><p>Temukan penanda merah dan hitung petak jalan menuju tujuan.</p></div></li>
                    <li><span>02</span><div><strong>Susun kode di PyroPad</strong><p>{{ $isLevel2 ? 'Isi isi_air di pompa, lalu gunakan semprot() atau for/range sesuai misi.' : 'Tulis perintah gerak berurutan, lalu kode variabel sesuai misi.' }}</p></div></li>
                    <li><span>03</span><div><strong>Jalankan dan periksa</strong><p>{{ $isLevel2 ? 'Tekan Run Code, amati setiap semprotan dan api yang padam.' : 'Tekan Run Code, amati gerakan, isi tangki, dan target yang tercentang.' }}</p></div></li>
                </ol>
                <section class="learning-card">
                    <span class="learning-eyebrow">BELAJAR SAMBIL MENYELAMATKAN</span>
                    @if($isLevel2)
                    <h2>Semprotan &amp; perulangan</h2>
                    <p>Di pompa, <code>isi_air = 6</code> mengisi tangki untuk enam semprotan. Setiap <code>semprot()</code> memakai satu unit. Gunakan <code>for</code> dan <code>range()</code> untuk mengulang aksi sesuai kebutuhan api.</p>
                    @else
                    <h2>Variabel &amp; persediaan air</h2>
                    <p>Variabel adalah nama untuk menyimpan nilai. Bayangkan label pada tangki: <code>isi_air</code> menyimpan jumlah air yang dibawa pemadam.</p>
                    @endif
                    <ol class="learning-steps" aria-label="Tahapan materi">
                        <li data-lesson-step="1">1. {{ $isLevel2 ? 'Semprot' : 'Simpan' }}</li>
                        <li data-lesson-step="2">2. {{ $isLevel2 ? 'Ulangi' : 'Ubah' }}</li>
                        <li data-lesson-step="3">3. {{ $isLevel2 ? 'Variabel + for' : 'Gunakan' }}</li>
                    </ol>
                    <h3 id="lesson-title"></h3>
                    <code id="lesson-code" class="lesson-code"></code>
                    <p id="lesson-explanation"></p>
                    <p id="lesson-effect" class="lesson-effect"></p>
                    <p class="learning-note">@if($isLevel2) Tanda <code>=</code> menyimpan nilai air; berkurangnya air saat <code>semprot()</code> adalah aturan game. Akhiri header <code>for</code> dengan <code>:</code> dan beri empat spasi sebelum <code>semprot()</code>. @else Tanda <code>=</code> berarti menyimpan nilai di sebelah kanan ke nama di sebelah kiri. Ini bukan tanda perbandingan. @endif</p>
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

                <section class="learning-card variable-watch" aria-labelledby="variable-watch-title">
                    <h3 id="variable-watch-title">{{ $isLevel2 ? 'Semprotan pada api aktif' : 'Isi tangki sekarang' }}</h3>
                    <div class="variable-readout"><code>{{ $isLevel2 ? 'semprot()' : 'isi_air' }}</code><span>{{ $isLevel2 ? '×' : '=' }}</span><output id="learning-water">0</output><small>{{ $isLevel2 ? 'kali' : 'unit air' }}</small></div>
                    <p id="learning-water-note">Amati nilainya setelah menjalankan kode.</p>
                </section>

                <section class="learning-card" aria-labelledby="code-explanation-title">
                    <h3 id="code-explanation-title">Arti kode kamu</h3>
                    <p>Penjelasan mengikuti kode yang kamu ketik. Aksi game terjadi setelah Run Code.</p>
                    <ol id="code-explanations" class="code-explanations"></ol>
                    <p id="code-explanations-empty">Mulai dengan perintah gerak, misalnya <code>atas(1)</code>. Angka dalam kurung menentukan jumlah petak.</p>
                </section>
                <section class="learning-card game-study__tips" aria-labelledby="study-tips-title">
                    <h3 id="study-tips-title">Tips agar misi lebih mudah</h3>
                    <ul>
                        <li><strong>Gerak lewat jalan tanah.</strong> Angka pada <code>atas(2)</code> berarti bergerak dua petak ke atas.</li>
                        <li><strong>Datangi penanda dahulu.</strong> {{ $isLevel2 ? 'Isi air di penanda pompa; jalankan semprot() setelah sampai di penanda api aktif.' : 'Jalankan kode variabel setelah pemadam sampai di lokasi yang diminta.' }}</li>
                        <li><strong>Baca hasil setiap percobaan.</strong> Perhatikan pesan di map. Gunakan Hint saat membutuhkan petunjuk berikutnya.</li>
                    </ul>
                </section>
            </section>
        </main>

        <noscript>Aktifkan JavaScript untuk menampilkan area game.</noscript>
    </div>

    <section id="level-result" class="level-result" role="dialog" aria-modal="true" aria-labelledby="result-title" hidden>
        <div class="level-result__card">
            <span class="level-result__eyebrow">MISI SELESAI</span>
            <h2 id="result-title">Level {{ $levelNumber }} Berhasil!</h2>
            <p class="level-result__subtitle">{{ $isLevel2 ? 'Ketiga api padam dan kamu mencapai petak FINISH.' : 'Air sampai di Pos 2 dan kamu mencapai petak FINISH.' }}</p>
            <div class="level-result__stars" aria-hidden="true">
                <span></span><span></span><span></span>
            </div>
            <strong id="result-stars" class="level-result__score">3 / 3 bintang</strong>
            <p class="level-result__recap">@if($isLevel2) Kamu memakai <code>semprot()</code>, mengulang aksi dengan <code>for/range</code>, lalu menentukan iterasi melalui <code>jumlah_semprot</code>. @else Kamu menyimpan <code>isi_air = 3</code>, memperbaruinya menjadi <code>isi_air = 5</code> setelah mendapat 2 unit bantuan, lalu memakai nilainya di Pos 2. @endif</p>
            <div class="level-result__actions">
                <button id="result-replay" type="button">Main Lagi</button>
                @unless($isLevel2)<a href="{{ route('game.level2') }}">Lanjut Level 2</a>@endunless
                <a href="{{ route('main-menu') }}">Menu Utama</a>
            </div>
        </div>
    </section>
</body>
</html>
