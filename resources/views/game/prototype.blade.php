<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PyroRescue - Level 1: Tepi Sungai Terbakar</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="game-prototype" style="--icon-sheet: url('{{ asset('assets/ui/icons-sheet.png') }}'); --button-sheet: url('{{ asset('assets/ui/buttons-sheet.png') }}')">
    <div class="prototype-page">
        <header class="game-header" hidden>
            <div class="game-brand">
                <span class="asset-icon asset-icon--fire" aria-hidden="true"></span>
                <div>
                    <a href="{{ route('game.level1') }}" class="brand-title">PyroRescue</a>
                    <p>Kode Kecil, Hutan Lebih Aman</p>
                </div>
            </div>
            <div class="level-title">
                <span class="eyebrow">MISI PENYELAMATAN · LEVEL 01</span>
                <h1>Tepi Sungai Terbakar</h1>
            </div>
            <div class="forest-message">
                <span class="asset-icon asset-icon--leaf" aria-hidden="true"></span>
                <span>Hutan Lestari,<br>Masa Depan Kita</span>
            </div>
        </header>

        <main class="game-layout">
            <section class="game-area wood-frame" aria-label="Area game Level 1">
                <div class="area-heading" hidden>
                    <span>KALIMANTAN · TEPI SUNGAI</span>
                    <span class="area-badge">Materi Variabel</span>
                </div>
                <div id="game-container" role="img"
                     aria-label="Peta hutan Kalimantan berukuran 1600 kali 1200 dengan kamera yang mengikuti pemadam"
                     data-asset-base-url="{{ asset('assets') }}"></div>
                <div class="learning-note" hidden>
                    <span class="asset-icon asset-icon--book" aria-hidden="true"></span>
                    <div>
                        <h2>Kenali variabel</h2>
                        <p>Variabel menyimpan nilai. Berdiri di penanda merah dekat pompa, lalu ubah <code>jumlah_air</code> untuk mengisi air.</p>
                    </div>
                </div>
            </section>

            <aside class="game-panel wood-frame">
                <div class="panel-heading">
                    <span class="asset-icon asset-icon--book" aria-hidden="true"></span>
                    <h2>Misi pertamamu</h2>
                </div>
                <div class="panel-content">
                    <p class="mission-instruction">Api mulai menyala di tepi sungai. Berdiri di penanda merah untuk mengambil air dan menyemprot pohon.</p>
                    <div class="mission-target">
                        <span class="asset-icon asset-icon--water" aria-hidden="true"></span>
                        <span>Siapkan minimal <strong><span id="required-water">3</span> unit air</strong></span>
                    </div>
                    <label for="code-editor"><span>Kode Python</span><span class="editor-language">VARIABEL</span></label>
                    <div class="code-editor-wrapper">
                        <textarea id="code-editor" rows="18" spellcheck="false" autocapitalize="off" autocomplete="off"
                                  aria-autocomplete="list" aria-controls="code-suggestions" aria-expanded="false"
                                  aria-describedby="editor-help" placeholder="Tulis kode Python di sini..."></textarea>
                        <ul id="code-suggestions" role="listbox" aria-label="Saran kode" hidden></ul>
                    </div>
                    <p id="editor-help">
                        Mulai ketik <code>atas(angka)</code>, <code>kanan(angka)</code>, <code>bawah(angka)</code>, <code>kiri(angka)</code>, <code>jumlah_air</code>, atau <code>semprot</code>.
                        Pilih dengan <kbd>&uarr;</kbd> <kbd>&darr;</kbd> dan <kbd>Enter</kbd>. Tekan <kbd>Ctrl</kbd> + <kbd>Space</kbd> untuk melihat semua pilihan.
                    </p>

                    <div class="game-buttons">
                        <button id="run-code" class="sprite-button sprite-button--run" type="button" disabled>
                            <span class="sr-only">Run Code</span>
                        </button>
                        <button id="reset" class="sprite-button sprite-button--reset" type="button" disabled>
                            <span class="sr-only">Reset</span>
                        </button>
                    </div>
                    <button id="hint" class="hint-button" type="button" hidden>Butuh petunjuk? <strong>Hint</strong></button>
                    <p id="hint-text" aria-live="polite" hidden></p>
                    <div id="feedback" role="status" aria-live="polite" hidden>Memuat area game...</div>
                    <p class="run-note" hidden>Run melanjutkan dari posisi terakhir. Reset mengembalikan karakter ke titik awal dan mengosongkan kode.</p>
                </div>
            </aside>
        </main>

        <footer class="game-footer" hidden>
            <span>Python untuk Hutan yang Lebih Baik</span>
            <span>Kalimantan di Hati Kita <span aria-hidden="true">♥</span></span>
        </footer>
        <noscript>Aktifkan JavaScript untuk menampilkan area game.</noscript>
    </div>
</body>
</html>
