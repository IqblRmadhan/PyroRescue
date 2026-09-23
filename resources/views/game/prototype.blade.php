<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>PyroRescue - Level 1: Tepi Sungai Terbakar</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="game-prototype" style="--icon-sheet: url('{{ asset('assets/ui/icons.png') }}')">
    <section id="level-story" class="level-story" role="dialog" aria-modal="true" aria-labelledby="story-title" data-game-page="prototype-page">
        <h1 id="story-title" class="sr-only">Cerita pembuka Level 1</h1>

        <div class="story-stage">
            <button id="story-skip" class="story-skip" type="button">SKIP</button>

            <div class="story-progress" aria-hidden="true">
                <span class="is-active"></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <article class="story-slide is-active" data-story-slide>
                <img src="{{ asset('assets/story/level1/scene-1.png') }}" alt="Mobil pemadam PyroRescue tiba di pos kecil dekat hutan yang terbakar">
                <div class="story-dialogue">
                    <p>Mobil Tim PyroRescue berhenti di sebuah pos kecil dekat sungai.</p>
                </div>
            </article>

            <article class="story-slide" data-story-slide hidden>
                <img src="{{ asset('assets/story/level1/scene-2.png') }}" alt="Asap tebal, api hutan, dan burung-burung yang terbang menjauh">
                <div class="story-dialogue">
                    <p>Langit mulai tertutup asap, suara radio terdengar putus-putus, dan beberapa burung beterbangan keluar dari arah hutan.</p>
                </div>
            </article>

            <article class="story-slide story-slide--commander" data-story-slide hidden>
                <img src="{{ asset('assets/story/level1/scene-3.png') }}" alt="Komandan PyroRescue menyampaikan laporan melalui radio">
                <div class="story-dialogue story-dialogue--commander">
                    <strong class="story-speaker">KOMANDAN</strong>
                    <p>Asap semakin tebal. Tim pemantau menemukan jalur masuk menuju titik api pertama, tapi akses ke sana mulai tertutup.</p>
                </div>
            </article>

            <article class="story-slide" data-story-slide hidden>
                <img src="{{ asset('assets/story/level1/scene-4.png') }}" alt="Anggota PyroRescue berdiri di depan jalur hutan sambil memegang PyroPad">
                <div class="story-dialogue">
                    <p>Pemain turun dari mobil dan sudah memegang PyroPad. Ia bersiap untuk masuk ke jalur hutan.</p>
                </div>
            </article>

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
                <h1>Level 1 - Tepi Sungai Terbakar</h1>
            </div>

            <div class="forest-message wood-sign">
                <span>Hutan Lestari<br>Masa Depan Kita</span>
            </div>
        </header>

        <main class="game-layout">
            <section class="game-area wood-frame" aria-label="Area game Level 1">
                <div class="game-hud" aria-label="Status permainan">
                    <div class="hud-counter">
                        <span class="asset-icon asset-icon--water" aria-hidden="true"></span>
                        <strong><span id="water-count">0</span>/<span id="required-water">3</span></strong>
                    </div>
                    <div class="hud-counter">
                        <span class="asset-icon asset-icon--star" aria-hidden="true"></span>
                        <strong><span id="mission-stars">0</span>/<span id="mission-target-count">2</span></strong>
                    </div>
                    <div class="hud-counter hud-counter--post">
                        <small>POS 2</small>
                        <strong><span id="post-water-count">0</span></strong>
                    </div>
                </div>

                <div id="game-container" role="img"
                     aria-label="Peta hutan Kalimantan berukuran 1600 kali 1200 dengan kamera yang mengikuti pemadam"
                     data-asset-base-url="{{ asset('assets') }}"></div>

                <div id="feedback" class="game-dialog" role="status" aria-live="polite">
                    <p id="feedback-message"></p>
                    <button id="feedback-ok" type="button">OK</button>
                </div>
            </section>

            <aside class="game-panel wood-frame">
                <section class="mission-card mission-card--briefing" aria-labelledby="mission-title">
                    <span class="mission-card__icon" aria-hidden="true">🎯</span>
                    <div>
                        <h2 id="mission-title">Challenge 1 - Mengambil Air</h2>
                        <p id="mission-description">Pergi ke pompa di tepi sungai, lalu simpan 3 unit air ke dalam variabel <code>isi_air</code>.</p>
                    </div>
                </section>

                <section class="mission-card mission-card--targets" aria-labelledby="target-title">
                    <span class="asset-icon asset-icon--star" aria-hidden="true"></span>
                    <div>
                        <h2 id="target-title">Target</h2>
                        <ul id="target-list" class="target-list">
                            <li id="target-pump"><span class="target-check" aria-hidden="true"></span>Pergi ke pompa air</li>
                            <li id="target-water"><span class="target-check" aria-hidden="true"></span>Ambil 3 air</li>
                        </ul>
                    </div>
                </section>

                <div class="panel-content">
                    <label class="sr-only" for="code-editor">Kode Python untuk PyroPad</label>
                    <div class="code-editor-wrapper">
                        <textarea id="code-editor" rows="12" spellcheck="false" autocapitalize="off" autocomplete="off"
                                  aria-autocomplete="list" aria-controls="code-suggestions" aria-expanded="false"
                                  aria-describedby="editor-help" placeholder="Tulis kode Python di sini..."></textarea>
                        <ul id="code-suggestions" role="listbox" aria-label="Saran kode" hidden></ul>
                    </div>
                    <p id="editor-help" class="sr-only">
                        Mulai ketik <code>maju(angka)</code>, <code>mundur(angka)</code>, <code>kanan(angka)</code>, <code>kiri(angka)</code>, <code>isi_air</code>, atau <code>air_pos_2</code>.
                        Pilih dengan tombol panah dan Enter. Tekan Ctrl dan Space untuk melihat semua pilihan.
                    </p>

                    <div class="game-buttons">
                        <button id="run-code" class="sprite-button sprite-button--play" type="button" disabled>
                            <span class="sr-only">Run Code</span>
                        </button>
                        <button id="reset" class="sprite-button sprite-button--reset" type="button" disabled>
                            <span class="sr-only">Reset</span>
                        </button>
                    </div>

                    <div class="hint-strip">
                        <button id="hint" class="hint-button" type="button"><span aria-hidden="true">💡</span> Hint</button>
                        <p id="hint-text" aria-live="polite">Susun instruksi dari atas ke bawah.</p>
                    </div>
                </div>
            </aside>
        </main>

        <noscript>Aktifkan JavaScript untuk menampilkan area game.</noscript>
    </div>
</body>
</html>
