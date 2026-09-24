import CodeValidator from './CodeValidator.js';

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
        explanation: 'Nama variabelnya tetap isi_air, tetapi nilai lama 3 diganti menjadi 5. Assignment ini menetapkan jumlah akhir, bukan menambahkan 5.',
        effect: 'Di game: Pos 1 memberikan 2 unit bantuan. Muatan 3 unit menjadi 5 unit. Jalankan assignment di penanda Pos 1.',
    },
    3: {
        title: '3. Menggunakan nilai variabel',
        code: 'air_pos_2 = isi_air',
        explanation: 'Baca nilai isi_air di sebelah kanan, lalu simpan nilai itu ke air_pos_2. Jika isi_air bernilai 5, air_pos_2 menerima nilai 5.',
        effect: 'Di game: jalankan di penanda Pos 2 untuk menyerahkan air. Setelah penyerahan, game mengosongkan isi_air menjadi 0. Dalam Python biasa, assignment saja tidak mengosongkan variabel asal.',
    },
};

const validator = new CodeValidator();

// Hanya menjelaskan teks; validasi dan eksekusi misi tetap dilakukan oleh game.
export function explainLevel1Code(code, challengeNumber = 1) {
    const requiredWater = challengeNumber === 1 ? 3 : 5;
    return code.replace(/\r\n?/g, '\n').split('\n').flatMap((source, index) => {
        const trimmed = source.trim();
        if (!trimmed) return [];

        const line = { number: index + 1, code: source, text: '', invalid: false };
        if (trimmed.startsWith('#')) {
            line.text = 'Komentar: catatan untuk pembaca kode. Baris ini tidak menjalankan aksi.';
            return [line];
        }

        const validation = validator.validateVariable(source, requiredWater, challengeNumber);
        if (!validation.syntaxValid) {
            line.text = validation.message;
            line.invalid = true;
            return [line];
        }

        const normalized = source.split('#')[0].replace(/[ \t]/g, '');
        const movement = normalized.match(/^(atas|bawah|kanan|kiri)\((\d+)\)$/);
        if (movement) {
            line.text = `Memanggil perintah ${movement[1]} dengan argumen ${movement[2]}: pemadam berjalan ke ${movement[1]} sebanyak ${movement[2]} petak mengikuti jalan. Perintah ini disediakan oleh PyroRescue.`;
        } else if (normalized === 'air_pos_2=isi_air') {
            line.text = 'Membaca nilai isi_air dan menyimpannya ke air_pos_2. Di penanda Pos 2, game menyerahkan air, lalu mengosongkan tangki pemain. Pengosongan ini adalah aturan game.';
        } else {
            const amount = validation.actions.water;
            line.text = `Menyimpan bilangan bulat ${amount} ke variabel isi_air. ${challengeNumber === 1 ? 'Di penanda pompa, tangki diisi sampai jumlah tersebut.' : 'Di penanda Pos 1, nilai sebelumnya diganti dengan jumlah ini, bukan ditambah.'}`;
            if (amount !== requiredWater) {
                line.text += ` Target challenge ini adalah ${requiredWater} unit.`;
            }
        }
        return [line];
    });
}

export default class Level1Learning {
    constructor(editor, root) {
        this.editor = editor;
        this.root = root;
        this.challengeNumber = 1;
        editor.addEventListener('input', () => this.renderCode());
    }

    setChallenge(challengeNumber) {
        this.challengeNumber = challengeNumber;
        const lesson = variableLessons[challengeNumber];
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
        this.renderCode();
    }

    renderState(state) {
        if (Number.isFinite(state.water)) {
            this.root.querySelector('#learning-water').textContent = state.water;
        }
        this.root.querySelector('#learning-water-note').textContent = state.postWater > 0
            ? `${state.postWater} unit telah diserahkan ke Pos 2. Tangki dikosongkan oleh aturan misi.`
            : 'Nilai ini mengikuti isi tangki di game, bukan sekadar angka yang sedang diketik.';
    }

    renderCode() {
        const lines = explainLevel1Code(this.editor.value, this.challengeNumber);
        const items = lines.map((line) => {
            const item = document.createElement('li');
            item.value = line.number;
            item.classList.toggle('has-error', line.invalid);
            const code = document.createElement('code');
            code.textContent = line.code;
            const text = document.createElement('p');
            text.textContent = line.text;
            item.append(code, text);
            return item;
        });
        this.root.querySelector('#code-explanations').replaceChildren(...items);
        this.root.querySelector('#code-explanations-empty').hidden = items.length > 0;
    }
}
