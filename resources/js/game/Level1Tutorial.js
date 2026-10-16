export const level1TutorialSteps = [
    {
        target: '#game-container',
        eyebrow: '01 / PETA MISI',
        title: 'Lihat dan geser peta',
        text: 'Ini area tempat pemadam bergerak. Klik lalu seret untuk melihat bagian peta lain. Geser dua jari di touchpad untuk menggeser peta, atau cubit untuk zoom.',
        note: 'Logo PyroRescue di atas akan membawamu kembali ke menu.',
    },
    {
        target: '.game-hud',
        eyebrow: '02 / STATUS',
        title: 'Pantau air dan bintang',
        text: 'Angka di samping tetes air menunjukkan isi tangki. Bintang kecil menunjukkan target misi yang sudah selesai. Nilai persentase dimulai dari 100%.',
        note: 'Kode salah mengurangi 5%, tabrakan mengurangi 10%. Daftar Misi di kanan merinci target aktif.',
    },
    {
        target: '#code-editor',
        eyebrow: '03 / PYROPAD',
        title: 'Tulis perintah di sini',
        text: 'PyroPad adalah tempat menulis kode untuk mengendalikan pemadam. Perintah dijalankan dari baris paling atas ke bawah; saat mengetik, kamu bisa memilih saran perintah.',
        note: 'Kamu bisa menjalankan kode sedikit demi sedikit. Kesalahan akan dijelaskan oleh pemandu.',
    },
    {
        target: '.game-buttons',
        eyebrow: '04 / AKSI KODE',
        title: 'Jalankan atau bersihkan kode',
        text: 'Run Code menjalankan kode yang kamu tulis. Hapus membersihkan seluruh isi PyroPad supaya kamu bisa mulai mengetik ulang.',
        note: 'Periksa pesan pemandu setelah menjalankan kode untuk mengetahui hasilnya.',
    },
    {
        target: '.game-map-controls',
        eyebrow: '05 / KONTROL GAME',
        title: 'Atur suara dan bantuan',
        text: 'Musik dan SFX punya tombol terpisah. Ulangi mengembalikan challenge saat ini ke awal, sedangkan Hint memberi petunjuk ketika kamu buntu.',
        note: 'Tombol Ulangi juga mengembalikan posisi pemadam pada challenge aktif.',
    },
    {
        target: '#material-open',
        eyebrow: '06 / BELAJAR',
        title: 'Buka materi saat perlu',
        text: 'Baca Materi membuka penjelasan Python dan kamus perintah. Lihat juga daftar Misi di atas PyroPad; kotaknya tercentang otomatis ketika target selesai.',
        note: 'Cara Bermain bisa kamu buka kembali melalui tombol di bagian bawah halaman.',
    },
    {
        target: '#game-container',
        mapFocus: 'water',
        eyebrow: '07 / TITIK BIRU',
        title: 'Berdiri di titik biru',
        text: 'Kamera sekarang mengarah ke penanda biru dekat pompa. Gerakkan pemadam sampai berdiri tepat di atas titik itu. Di sana kamu dapat menjalankan kode untuk mengambil air.',
        note: 'Lingkaran yang berdenyut membantu menunjukkan petak yang harus dituju.',
    },
    {
        target: '#game-container',
        mapFocus: 'challenge',
        eyebrow: '08 / TITIK MERAH',
        title: 'Berdiri di titik merah',
        text: 'Kamera bergeser ke contoh penanda merah di Pos 1. Penanda merah menunjukkan tempat menyelesaikan challenge. Berdirilah tepat di atasnya, tulis kode di PyroPad, lalu tekan Run Code.',
        note: 'Ikuti penanda merah yang sesuai dengan challenge aktif.',
    },
    {
        target: '#game-container',
        mapFocus: 'finish',
        eyebrow: '09 / FINISH',
        title: 'Akhiri misi di FINISH',
        text: 'Kamera menuju petak FINISH di ujung jalan. Kamu boleh mencapainya kapan saja, tetapi Level 2 baru terbuka setelah tiga challenge dan evaluasi selesai dengan nilai minimal 70% (satu bintang).',
        note: 'Kode salah dan tabrakan mengurangi nilai. Kamera kembali ke pemadam setelah Cara Bermain ditutup.',
    },
];

export class Level1Tutorial {
    constructor(root) {
        this.root = root;
        this.spotlight = root.querySelector('.level1-tutorial__spotlight');
        this.card = root.querySelector('.level1-tutorial__card');
        this.eyebrow = root.querySelector('[data-tutorial-eyebrow]');
        this.title = root.querySelector('[data-tutorial-title]');
        this.text = root.querySelector('[data-tutorial-text]');
        this.note = root.querySelector('[data-tutorial-note]');
        this.progress = root.querySelector('[data-tutorial-progress]');
        this.back = root.querySelector('[data-tutorial-back]');
        this.next = root.querySelector('[data-tutorial-next]');
        this.skip = root.querySelector('[data-tutorial-skip]');
        this.page = document.getElementById('prototype-page');
        this.stepIndex = 0;
        this.opened = false;
        this.onClose = () => {};
        this.previousFocus = null;
        this.mapScene = null;

        this.back.addEventListener('click', () => this.showStep(this.stepIndex - 1));
        this.next.addEventListener('click', () => this.stepIndex === level1TutorialSteps.length - 1
            ? this.close() : this.showStep(this.stepIndex + 1));
        this.skip.addEventListener('click', () => this.close());
        this.root.addEventListener('keydown', (event) => this.handleKeydown(event));
        window.addEventListener('resize', () => this.updateSpotlight());
        window.addEventListener('scroll', () => this.updateSpotlight(), { passive: true });
    }

    setMapScene(scene) {
        this.mapScene = scene;
    }

    open(onClose = () => {}) {
        if (this.opened) return;
        this.opened = true;
        this.onClose = onClose;
        this.previousFocus = document.activeElement;
        this.root.hidden = false;
        this.page.inert = true;
        document.body.classList.add('level1-tutorial-is-open');
        this.showStep(0);
    }

    showStep(index) {
        this.stepIndex = Math.max(0, Math.min(index, level1TutorialSteps.length - 1));
        const step = level1TutorialSteps[this.stepIndex];
        const target = document.querySelector(step.target);
        if (step.mapFocus) this.mapScene?.focusTutorialMarker(step.mapFocus);
        else this.mapScene?.restoreTutorialCamera();
        this.eyebrow.textContent = step.eyebrow;
        this.title.textContent = step.title;
        this.text.textContent = step.text;
        this.note.textContent = step.note;
        this.progress.textContent = `${this.stepIndex + 1} / ${level1TutorialSteps.length}`;
        this.back.hidden = this.stepIndex === 0;
        this.next.textContent = this.stepIndex === level1TutorialSteps.length - 1 ? 'Mulai bermain' : 'Lanjut';
        this.card.classList.toggle('level1-tutorial__card--left',
            Boolean(target?.getBoundingClientRect().left > window.innerWidth / 2));
        if (window.innerWidth <= 700) target?.scrollIntoView({ block: 'start', behavior: 'instant' });
        this.updateSpotlight();
        requestAnimationFrame(() => this.updateSpotlight());
        this.next.focus({ preventScroll: true });
    }

    updateSpotlight() {
        if (!this.opened) return;
        const target = document.querySelector(level1TutorialSteps[this.stepIndex].target);
        if (!target) return;
        const bounds = target.getBoundingClientRect();
        this.card.classList.toggle('level1-tutorial__card--top',
            window.innerWidth <= 700 && bounds.top > window.innerHeight * 0.48);
        const padding = 7;
        this.spotlight.style.left = `${Math.max(4, bounds.left - padding)}px`;
        this.spotlight.style.top = `${Math.max(4, bounds.top - padding)}px`;
        this.spotlight.style.width = `${Math.max(0, Math.min(window.innerWidth - Math.max(4, bounds.left - padding) - 4, bounds.width + padding * 2))}px`;
        this.spotlight.style.height = `${Math.max(0, Math.min(window.innerHeight - Math.max(4, bounds.top - padding) - 4, bounds.height + padding * 2))}px`;
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.close();
        }
        if (event.key !== 'Tab') return;
        const buttons = [this.skip, this.back, this.next].filter(button => !button.hidden);
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    close() {
        if (!this.opened) return;
        this.opened = false;
        this.root.hidden = true;
        this.page.inert = false;
        document.body.classList.remove('level1-tutorial-is-open');
        this.mapScene?.restoreTutorialCamera();
        this.previousFocus?.focus?.({ preventScroll: true });
        this.onClose();
    }
}
