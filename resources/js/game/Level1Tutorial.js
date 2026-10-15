const storageKey = 'pyrorescue.level1TutorialSeen';

export const level1TutorialSteps = [
    {
        target: '#game-container',
        eyebrow: '01 / PETA MISI',
        title: 'Kenali area penyelamatan',
        text: 'Karakter pemadam berada di peta sebelah kiri. Ikuti jalan menuju pompa air. Titik biru menandai tempat mengambil air, sedangkan titik merah menunjukkan lokasi tugas berikutnya.',
        note: 'Seret peta untuk melihat area lain. Cubit touchpad untuk mengatur zoom.',
    },
    {
        target: '#code-editor',
        eyebrow: '02 / URUTAN PERINTAH',
        title: 'Arahkan pemadam lewat kode',
        text: 'Tulis perintah gerak di PyroPad. Game membaca baris dari atas ke bawah. Angka dalam kurung berarti jumlah petak yang ditempuh.',
        code: 'atas(1)\nkanan(2)',
        note: 'Gunakan atas(n), bawah(n), kanan(n), atau kiri(n). Karakter bergerak saat kode dijalankan.',
    },
    {
        target: '#run-code',
        eyebrow: '03 / JALANKAN',
        title: 'Lihat akibat dari kodenya',
        text: 'Tekan Run Code setelah menulis perintah. Karakter akan mengikuti urutan kode yang valid. Jika jalur atau penulisannya keliru, baca pesan pemandu lalu perbaiki kodenya.',
        note: 'Kamu boleh menjalankan beberapa langkah sekaligus atau satu per satu.',
    },
    {
        target: '.mission-card--targets',
        eyebrow: '04 / TARGET MISI',
        title: 'Periksa tujuanmu',
        text: 'Daftar Misi di kanan menunjukkan tugas yang harus diselesaikan. Pada Challenge pertama, capai penanda di dekat pompa, lalu isi tangki dengan tiga unit air.',
        note: 'Kotak target tercentang otomatis ketika tindakanmu berhasil.',
    },
    {
        target: '#code-editor',
        eyebrow: '05 / VARIABEL PYTHON',
        title: 'Simpan air di PyroPad',
        text: 'Setelah sampai di pompa, tulis kode berikut dan jalankan. isi_air adalah nama variabel, sedangkan 3 adalah nilai yang disimpan untuk tangki.',
        code: 'isi_air = 3',
        note: 'Tanda = menyimpan nilai. Nanti kamu akan mengubah dan memakai lagi nilai ini di pos berikutnya.',
    },
    {
        target: '#hint',
        eyebrow: '06 / BANTUAN',
        title: 'Bantuan selalu tersedia',
        text: 'Gunakan Hint saat buntu, Baca Materi untuk melihat penjelasan Python, Hapus untuk membersihkan PyroPad, dan Ulangi untuk mengembalikan challenge saat ini.',
        note: 'Tutorial ini bisa dibuka kembali lewat tombol Cara Bermain pada panel misi.',
    },
];

export function shouldShowLevel1Tutorial(storage = window.sessionStorage) {
    try {
        return storage.getItem(storageKey) !== '1';
    } catch {
        return true;
    }
}

export class Level1Tutorial {
    constructor(root) {
        this.root = root;
        this.spotlight = root.querySelector('.level1-tutorial__spotlight');
        this.card = root.querySelector('.level1-tutorial__card');
        this.eyebrow = root.querySelector('[data-tutorial-eyebrow]');
        this.title = root.querySelector('[data-tutorial-title]');
        this.text = root.querySelector('[data-tutorial-text]');
        this.code = root.querySelector('[data-tutorial-code]');
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

        this.back.addEventListener('click', () => this.showStep(this.stepIndex - 1));
        this.next.addEventListener('click', () => this.stepIndex === level1TutorialSteps.length - 1
            ? this.close() : this.showStep(this.stepIndex + 1));
        this.skip.addEventListener('click', () => this.close());
        this.root.addEventListener('keydown', (event) => this.handleKeydown(event));
        window.addEventListener('resize', () => this.updateSpotlight());
        window.addEventListener('scroll', () => this.updateSpotlight(), { passive: true });
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
        this.eyebrow.textContent = step.eyebrow;
        this.title.textContent = step.title;
        this.text.textContent = step.text;
        this.note.textContent = step.note;
        this.code.hidden = !step.code;
        this.code.textContent = step.code ?? '';
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
        try {
            window.sessionStorage.setItem(storageKey, '1');
        } catch { /* Permainan tetap bisa dilanjutkan saat penyimpanan browser diblokir. */ }
        this.previousFocus?.focus?.({ preventScroll: true });
        this.onClose();
    }
}
