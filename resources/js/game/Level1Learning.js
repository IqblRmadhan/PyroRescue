export const variableLessons = {
    1: {
        title: '1. Membuat variabel',
        code: 'isi_air = 3',
        explanation: 'isi_air adalah nama variabel. Angka 3 adalah nilai berupa bilangan bulat (integer). Baris ini menyimpan nilai 3 ke isi_air.',
        effect: 'Di game: berdiri di penanda pompa dahulu. Saat kode dijalankan, pompa mengisi tangki sampai 3 unit.',
    },
    2: {
        title: '2. Mengubah nilai variabel',
        code: 'isi_air = 5',
        explanation: 'Dari pompa kamu membawa 3 unit. Penjaga Pos 1 memberi 2 unit lagi, jadi 3 + 2 = 5 unit. Tulis isi_air = 5 untuk menyimpan jumlah akhir. Tanda = mengganti nilai lama 3 dengan 5; angka 5 bukan air tambahan.',
        effect: 'Di game: berdiri di penanda Pos 1 saat menjalankan isi_air = 5. Kamu akan melihat indikator tangki naik dari 3 ke 5.',
    },
    3: {
        title: '3. Menggunakan nilai variabel',
        code: 'air_pos = isi_air',
        explanation: 'Nilai isi_air sekarang 5, hasil 3 unit dari pompa + 2 unit dari Pos 1. Baris ini membaca nilai 5 dari isi_air dan menyimpannya ke air_pos.',
        effect: 'Di game: jalankan di penanda Pos 2 untuk menyerahkan air, lalu injak petak FINISH. Game mengosongkan isi_air setelah penyerahan; dalam Python biasa, assignment tidak mengosongkan variabel asal.',
    },
};

export default class Level1Learning {
    constructor(root, { lessons = variableLessons } = {}) {
        this.root = root;
        this.challengeNumber = 1;
        this.lessons = lessons;
    }

    setChallenge(challengeNumber) {
        this.challengeNumber = challengeNumber;
        const lesson = this.lessons[challengeNumber];
        this.root.querySelector('#lesson-title').textContent = lesson.title;
        this.root.querySelector('#lesson-code').textContent = lesson.code;
        this.root.querySelector('#lesson-explanation').textContent = lesson.explanation;
        this.root.querySelector('#lesson-effect').textContent = lesson.effect;
        for (const step of this.root.querySelectorAll('[data-lesson-step]')) {
            if (Number(step.dataset.lessonStep) === challengeNumber) {
                step.setAttribute('aria-current', 'step');
            } else {
                step.removeAttribute('aria-current');
            }
        }
    }
}
