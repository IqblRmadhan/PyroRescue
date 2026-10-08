import Level1Learning from './Level1Learning.js';
import challenges from './Level2Challenges.js';

export function explainLevel2Code(code) {
    return code.split('\n').flatMap((source, index) => {
        const text = source.trim();
        if (!text) return [];
        let explanation = 'Gunakan perintah gerak, isi_air, jumlah_semprot, for/range, dan semprot().';
        if (text.startsWith('#')) explanation = 'Komentar untuk pembaca; tidak menjalankan aksi.';
        else if (/^(atas|bawah|kiri|kanan)\s*\(/.test(text)) explanation = 'Bergerak mengikuti jalan sebanyak angka di dalam kurung.';
        else if (text.startsWith('isi_air')) explanation = 'Di penanda pompa, assignment isi_air mengganti isi tangki hingga kapasitas enam unit. Menjalankan isi_air = 3 lagi tetap menghasilkan 3/6, bukan 6/6.';
        else if (text.startsWith('jumlah_semprot')) explanation = 'Menyimpan jumlah pengulangan. Assignment ini belum menyemprotkan air.';
        else if (text.startsWith('for ')) explanation = 'Mengulang blok di bawahnya sebanyak nilai range(). Akhiri dengan titik dua dan beri indentasi pada blok.';
        else if (text.startsWith('semprot')) explanation = 'Satu panggilan semprot() menghasilkan satu semprotan. Di dalam for, aksi ini diulang setiap iterasi.';
        return [{ number: index + 1, code: source, text: explanation, invalid: false }];
    });
}

export default class Level2Learning extends Level1Learning {
    constructor(editor, root) {
        const lessons = Object.fromEntries(Object.entries(challenges).map(([number, challenge]) => [number, {
            title: challenge.title,
            code: challenge.example,
            explanation: challenge.lesson,
            effect: `Di game: ${number === '1' ? 'isi_air = 6 dijalankan di pompa sebelum berangkat. ' : ''}Datangi penanda C${number}, lalu padamkan api dengan ${challenge.requiredWater} kali semprotan.`,
        }]));
        super(editor, root, { lessons, explainCode: explainLevel2Code });
    }

    renderState(state) {
        this.root.querySelector('#learning-water').textContent = state.sprays ?? 0;
        this.root.querySelector('#learning-water-note').textContent = state.fireOut
            ? `Api padam. Tangki isi_air masih berisi ${state.water ?? 0} unit untuk misi berikutnya.`
            : `Tangki isi_air: ${state.water ?? 0}/6 unit. Api ini membutuhkan ${challenges[this.challengeNumber].requiredWater} semprotan; setiap semprot() memakai 1 unit.`;
    }
}
