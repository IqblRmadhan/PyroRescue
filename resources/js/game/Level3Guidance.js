import challenges from './Level3Challenges.js';
import { getChallengeStarterCode } from './ChallengeStarterCode.js';

const travel = {
    1: [
        'Pergi ke pondok tengah-kiri untuk melapor di pos penyelamatan.',
        'Pergi ke titik biru pompa di persimpangan tengah untuk menyiapkan air pemadaman pertama.',
        'Pergi ke penanda merah persimpangan bawah untuk memeriksa keamanan jembatan.',
        'Pergi ke penanda merah api pertama di pulau kanan. Di sana kita akan memadamkan api.',
        'Dekati penanda merah bekantan pertama untuk memeriksa apakah penyelamatan sudah aman.',
        'Antar bekantan yang mengikuti kamu kembali ke pos penyelamatan tengah-kiri.',
    ],
    2: [
        'Pergi ke penanda menara pengamatan di pulau tengah-bawah untuk menemukan kebakaran kedua.',
        'Pergi ke penanda merah api kedua di pulau bawah. Di sana kita akan memeriksa apakah air masih cukup.',
        'Kembali ke titik biru pompa. Tambahkan air yang kurang untuk persiapan pemadaman kedua.',
        'Kembali ke penanda merah api kedua untuk memadamkannya dengan persediaan yang sudah cukup.',
        'Dekati penanda merah bekantan kedua untuk memeriksa kondisi satwa dan api.',
        'Antar bekantan kedua ke pos penyelamatan tengah-kiri.',
    ],
    3: [
        'Pergi ke persimpangan jembatan tengah untuk mengamati jalur utara.',
        'Capai penanda merah pemeriksaan jembatan. Kita perlu memilih akses yang aman.',
        'Ikuti jalur alternatif ke penanda merah di kanan persimpangan.',
        'Pergi ke penanda merah di lahan cokelat pulau kiri atas. Periksa keselamatan bekantan ketiga di sana.',
        'Kembali ke pompa untuk melengkapi air bagi operasi terakhir.',
        'Pergi ke checkpoint aman di sebelah habitat pulau kiri atas. Bawa persediaan air untuk evaluasi.',
    ],
};

const decisionAnalogies = {
    route: {
        intro: 'Bayangkan kamu sedang berdiri di persimpangan dan harus membaca satu rambu sebelum memilih jalan.',
        rows: [
            { label: 'Pertanyaan', text: 'Apakah jalur utama aman?', type: 'question' },
            { label: 'Jika YA (if)', text: 'Maju 3 petak.', type: 'yes' },
            { label: 'Jika TIDAK (else)', text: 'Belok kanan 2 petak.', type: 'no' },
        ],
    },
    water: {
        intro: 'Anggap persediaan air seperti isi botol yang harus dibandingkan dengan garis kebutuhan.',
        rows: [
            { label: 'Pertanyaan', text: 'Apakah air sama dengan atau lebih banyak dari kebutuhan?', type: 'question' },
            { label: 'Jika YA (if)', text: 'Semprot sebanyak jumlah yang dibutuhkan.', type: 'yes' },
            { label: 'Jika TIDAK (else)', text: 'Mundur 1 petak untuk mencari air.', type: 'no' },
        ],
    },
    rescue: {
        intro: 'Bayangkan kamu berhenti di gerbang keselamatan sebelum mendekati bekantan.',
        rows: [
            { label: 'Pertanyaan', text: 'Apakah api sudah padam?', type: 'question' },
            { label: 'Jika YA (if)', text: 'Selamatkan bekantan.', type: 'yes' },
            { label: 'Jika TIDAK (else)', text: 'Mundur 1 petak.', type: 'no' },
        ],
    },
    nested: {
        intro: 'Seperti pemeriksaan dua pintu: pintu kedua baru diperiksa setelah jawaban pintu pertama adalah YA.',
        rows: [
            { label: 'Pertanyaan 1', text: 'Apakah bekantan terjebak?', type: 'question' },
            { label: 'Jika YA', text: 'Lanjut ke pertanyaan 2.', type: 'yes' },
            { label: 'Pertanyaan 2', text: 'Apakah api sudah padam?', type: 'question', depth: 1 },
            { label: 'Jika YA (if)', text: 'Selamatkan bekantan.', type: 'yes', depth: 1 },
            { label: 'Jika TIDAK (else)', text: 'Mundur 1 petak.', type: 'no', depth: 1 },
            { label: 'Jika TIDAK di pertanyaan 1', text: 'Lanjutkan patroli.', type: 'no' },
        ],
    },
    habitat: {
        intro: 'Anggap ini seperti melewati tiga pos pemeriksaan. Lanjut ke pos berikutnya hanya jika jawabannya YA.',
        rows: [
            { label: 'Pos 1', text: 'Apakah bekantan terjebak?', type: 'question' },
            { label: 'Jika YA', text: 'Lanjut ke Pos 2.', type: 'yes' },
            { label: 'Jika TIDAK', text: 'Lanjutkan patroli.', type: 'no' },
            { label: 'Pos 2', text: 'Apakah api sudah padam?', type: 'question', depth: 1 },
            { label: 'Jika YA', text: 'Lanjut ke Pos 3.', type: 'yes', depth: 1 },
            { label: 'Jika TIDAK', text: 'Mundur 1 petak.', type: 'no', depth: 1 },
            { label: 'Pos 3', text: 'Apakah jalur aman?', type: 'question', depth: 2 },
            { label: 'Jika YA (if)', text: 'Selamatkan bekantan.', type: 'yes', depth: 2 },
            { label: 'Jika TIDAK (else)', text: 'Pilih kiri 2 petak.', type: 'no', depth: 2 },
        ],
    },
    loop: {
        intro: 'Bayangkan perulangan seperti petugas yang membunyikan bel dengan aturan yang sama beberapa kali.',
        rows: [
            { label: 'Berapa kali?', text: '2 kali.', type: 'question' },
            { label: 'Apa yang diulang?', text: 'Perintah semprot.', type: 'yes' },
        ],
    },
};

const evaluationAnalogy = {
    title: 'Papan Operasi Penyelamatan',
    intro: 'Bayangkan komandan memberikan papan kondisi. Periksa setiap kondisi sebelum memilih tindakan, tanpa contoh jawaban kode.',
    rows: [
        { label: 'Persediaan', text: 'Apakah air cukup untuk memadamkan api?', type: 'question' },
        { label: 'Bahaya', text: 'Apakah api sudah padam dan jalur aman?', type: 'question' },
        { label: 'Satwa', text: 'Apakah bekantan masih terjebak?', type: 'question' },
        { label: 'Tujuan', text: 'Padamkan, selamatkan, antar ke pos, lalu capai FINISH.', type: 'yes' },
    ],
};

function getFillingAnalogy(target, water) {
    return {
        intro: 'Anggap angka pada variabel sebagai garis penunjuk isi tangki setelah pengisian selesai.',
        rows: [
            { label: 'Isi sekarang', text: `${water} unit.`, type: 'question' },
            { label: 'Tujuan akhir', text: `${target} unit.`, type: 'yes' },
            { label: 'Angka yang ditulis', text: `${target}, yaitu jumlah akhir di dalam tangki.`, type: 'answer' },
        ],
    };
}

export function getLevel3Guidance(challenge, state = {}) {
    if (challenge === 4) return {
        message: state.instruction ?? challenges[4].description,
        code: '',
        analogy: evaluationAnalogy,
    };
    const index = state.step ?? 0;
    const mission = challenges[challenge].steps[index];
    if (!mission) return { message: 'Challenge selesai. Bersiap untuk operasi berikutnya.', code: '', analogy: null };
    const starter = getChallengeStarterCode(3, challenge, state);
    if (!state.atObjective && !starter) return { message: travel[challenge][index], code: '', analogy: null };
    const filling = starter?.code === 'isi_air = ...';
    let message = mission.instruction;
    let analogy = null;
    if (filling) {
        const target = challenge === 1 ? 4 : 5;
        const water = state.water ?? 0;
        message = `Kamu sudah di pompa. Tangki perlu diisi dari ${water} menjadi ${target} unit.`;
        analogy = getFillingAnalogy(target, water);
    } else if (starter) {
        const instructions = {
            route: 'Kamu sudah di penanda pemeriksaan jalur. Susun keputusan untuk memilih jalan.',
            water: 'Kamu sudah di penanda api kedua. Susun keputusan berdasarkan kecukupan air.',
            rescue: 'Kamu sudah dekat bekantan. Lakukan pemeriksaan keselamatan sebelum menyelamatkannya.',
            nested: 'Kamu sudah dekat bekantan kedua. Lakukan pemeriksaan bertahap sebelum bertindak.',
            habitat: 'Kamu sudah dekat bekantan ketiga. Lakukan tiga pemeriksaan keselamatan secara berurutan.',
        };
        message = instructions[mission.behavior] ?? 'Kamu sudah di penanda api pertama. Susun perulangan untuk memadamkannya.';
        analogy = decisionAnalogies[mission.behavior] ?? decisionAnalogies.loop;
    }
    return { message, code: starter?.code ?? '', analogy };
}
