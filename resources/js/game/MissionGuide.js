import level1Challenges from './Level1Challenges.js';
import level2Challenges from './Level2Challenges.js';
import { getLevel3Guidance } from './Level3Guidance.js';
import { getChallengeStarterCode } from './ChallengeStarterCode.js';

const guideAnalogies = {
    1: {
        1: {
            title: 'Tangki Berlabel',
            intro: 'Bayangkan variabel sebagai tangki yang diberi nama agar isinya dapat dikenali.',
            rows: [
                { label: 'Nama tangki', text: 'isi_air', type: 'question' },
                { label: 'Nilai yang disimpan', text: '3 unit air', type: 'answer' },
                { label: 'Hasil', text: 'Nama isi_air sekarang mewakili angka 3.', type: 'yes' },
            ],
        },
        2: {
            title: 'Pertambahan Persediaan',
            intro: 'Nilai lama dibaca lebih dulu, lalu hasil pertambahan disimpan kembali.',
            rows: [
                { label: 'Nilai lama', text: 'isi_air berisi 3 unit.', type: 'question' },
                { label: 'Hitung', text: '3 + 2 menghasilkan 5.', type: 'answer' },
                { label: 'Simpan ulang', text: 'isi_air sekarang bernilai 5.', type: 'yes' },
            ],
        },
        3: {
            title: 'Catatan Penyerahan Air',
            intro: 'Bayangkan petugas membaca angka pada tangki lalu menyalinnya ke catatan milik pos.',
            rows: [
                { label: 'Baca', text: 'Lihat nilai yang tersimpan dalam isi_air.', type: 'question' },
                { label: 'Salin', text: 'Catat nilai yang sama ke air_pos.', type: 'answer' },
                { label: 'Ubah sumber', text: 'Tulis isi_air = 0 untuk mengosongkan tangki.', type: 'yes' },
            ],
        },
        4: {
            title: 'Gerbang Pemeriksaan Akhir',
            intro: 'Seperti petugas yang baru boleh pulang setelah memastikan seluruh tugas lapangan selesai.',
            rows: [
                { label: 'Periksa', text: 'Air sudah diterima Pos 2.', type: 'question' },
                { label: 'Tujuan', text: 'Ikuti jalan sampai petak FINISH.', type: 'answer' },
                { label: 'Selesai jika', text: 'Semua challenge telah tercatat.', type: 'yes' },
            ],
        },
    },
    2: {
        1: {
            title: 'Tombol Selang Pemadam',
            intro: 'Satu pemanggilan fungsi sama seperti menekan tombol alat satu kali.',
            rows: [
                { label: 'Satu tekan', text: 'semprot() dijalankan sekali.', type: 'question' },
                { label: 'Dua semprotan', text: 'Jalankan perintah yang sama dua kali.', type: 'answer' },
                { label: 'Biaya', text: 'Setiap semprotan memakai 1 unit air.', type: 'yes' },
            ],
        },
        2: {
            title: 'Penyemprot Otomatis',
            intro: 'Seperti mengatur mesin agar mengulangi tindakan yang sama sesuai angka pada penghitung.',
            rows: [
                { label: 'Atur pengulangan', text: 'range() menentukan berapa kali.', type: 'question' },
                { label: 'Pilih tindakan', text: 'semprot() diletakkan di dalam for.', type: 'answer' },
                { label: 'Mesin bekerja', text: 'Perintah dijalankan dari hitungan awal sampai selesai.', type: 'yes' },
            ],
        },
        3: {
            title: 'Panel Penghitung Semprotan',
            intro: 'Angka pengulangan disimpan pada panel bernama jumlah_semprot, lalu dibaca oleh mesin.',
            rows: [
                { label: 'Simpan angka', text: 'jumlah_semprot menyimpan jumlah yang diperlukan.', type: 'question' },
                { label: 'Baca angka', text: 'range(jumlah_semprot) memakai nilai tersebut.', type: 'answer' },
                { label: 'Ulangi', text: 'for menjalankan semprot() sebanyak nilai itu.', type: 'yes' },
            ],
        },
        4: {
            title: 'Papan Operasi Mandiri',
            intro: 'Seperti daftar pemeriksaan petugas sebelum meninggalkan area kebakaran.',
            rows: [
                { label: 'Persediaan', text: 'Siapkan air yang cukup.', type: 'question' },
                { label: 'Pemadaman', text: 'Gunakan konsep pengulangan yang sudah dipelajari.', type: 'answer' },
                { label: 'Tujuan akhir', text: 'Pastikan api padam lalu capai FINISH.', type: 'yes' },
            ],
        },
    },
};

function bridge(title, message, previous, problem, next) {
    return {
        message,
        analogy: {
            title,
            intro: 'Materi berikutnya tumbuh dari langkah yang baru saja kamu selesaikan.',
            rows: [
                { label: 'Baru dilakukan', text: previous, type: 'yes' },
                { label: 'Masalah', text: problem, type: 'question' },
                { label: 'Solusi berikutnya', text: next, type: 'answer' },
            ],
        },
    };
}

const challengeBridges = {
    1: {
        1: bridge(
            'Tambahkan Persediaan',
            'Tangki menyimpan 3 unit dalam isi_air. Di Pos 1, tulis isi_air += 2. Python membaca 3, menghitung 3 + 2 = 5, lalu menyimpan 5 kembali. Ini setara dengan isi_air = isi_air + 2; variabel harus berisi nilai sebelum memakai +=.',
            'Menyimpan 3 unit air ke variabel isi_air.',
            'Bagaimana menambah 2 unit tanpa melupakan nilai lama?',
            'Baca isi_air, tambah 2, lalu simpan hasilnya ke isi_air.',
        ),
        2: bridge(
            'Gunakan Nilai yang Sudah Ada',
            'Hasil penjumlahan 5 tersimpan dalam isi_air. Di Pos 2, air_pos = isi_air menyalin nilai itu; isi_air tetap 5 karena penyalinan tidak menghapus sumber. Lalu isi_air = 0 mengubah isi tangki. Jalankan kedua baris berurutan.',
            'Menambah isi_air dari 3 menjadi 5.',
            'Bagaimana Pos 2 menerima 5 unit sambil mengosongkan tangki?',
            'Salin ke air_pos, kemudian ubah isi_air menjadi 0.',
        ),
        3: bridge(
            'Pemeriksaan Misi',
            'Air sudah disimpan, dibawa, lalu diserahkan dengan variabel. Sekarang ikuti jalan menuju FINISH agar seluruh rangkaian misi diperiksa.',
            'Menyimpan 5 unit dari isi_air ke air_pos lalu mengubah isi_air menjadi 0.',
            'Apakah seluruh urutan pengiriman sudah selesai?',
            'Capai FINISH untuk menjalankan evaluasi akhir.',
        ),
    },
    2: {
        1: bridge(
            'Dari Pengulangan Manual ke for',
            'Barusan kita menulis semprot() dua kali. Bagaimana kalau api membutuhkan 100 semprotan? Tidak mungkin kita menulis semprot() 100 kali. Agar lebih ringkas, gunakan for dan range() untuk mengulang perintah secara otomatis.',
            'Menjalankan semprot() pada dua baris terpisah.',
            'Semakin banyak semprotan, semakin banyak baris yang harus disalin.',
            'for dan range() mengulang semprot() dengan satu pola.',
        ),
        2: bridge(
            'Jumlah Pengulangan Bisa Disimpan',
            'Kita sudah memakai range() untuk mengulang semprot(). Jika kebutuhan api berubah-ubah, akan lebih mudah menyimpan jumlahnya dalam variabel jumlah_semprot lalu meminta range() membaca variabel tersebut.',
            'Menuliskan angka pengulangan langsung di dalam range().',
            'Angka harus dicari dan diganti setiap kali kebutuhan berubah.',
            'Simpan angka pada jumlah_semprot dan gunakan di dalam range().',
        ),
        3: bridge(
            'Gabungkan Semua Bekal',
            'Sekarang kamu sudah mengenal fungsi, perulangan, dan variabel pengatur jumlah. Pada evaluasi, tentukan sendiri cara menggabungkan ketiganya untuk menyiapkan air, memadamkan api, lalu mencapai FINISH.',
            'Mengatur jumlah pengulangan melalui variabel.',
            'Misi berikutnya tidak menyediakan kisi-kisi kode.',
            'Baca keadaan misi lalu susun program lengkap secara mandiri.',
        ),
    },
    3: {
        1: bridge(
            'Dari Satu Keputusan ke Beberapa Syarat',
            'Kita sudah memakai if dan else untuk memilih tindakan berdasarkan satu keadaan. Krisis berikutnya membutuhkan pemeriksaan air sekaligus keselamatan satwa, jadi keputusan harus disusun lebih bertahap.',
            'Memilih satu dari dua tindakan dengan if dan else.',
            'Satu pemeriksaan belum cukup untuk menjamin penyelamatan aman.',
            'Bandingkan air dan susun pemeriksaan keselamatan bertingkat.',
        ),
        2: bridge(
            'Pemeriksaan Bertingkat',
            'Dua kondisi sudah berhasil diperiksa secara berurutan. Di habitat berikutnya ada tambahan kondisi jalur, sehingga setiap gerbang keselamatan harus diperiksa sebelum penyelamatan dilakukan.',
            'Memeriksa kondisi satwa lalu keadaan api.',
            'Jalur yang berbahaya masih dapat menggagalkan penyelamatan.',
            'Tambahkan pemeriksaan jalur di dalam keputusan yang sudah ada.',
        ),
        3: bridge(
            'Operasi Mandiri Terakhir',
            'Kamu sudah berlatih memeriksa air, api, satwa, dan jalur. Evaluasi terakhir meminta semua cara berpikir itu dipakai bersama tanpa kisi-kisi kode.',
            'Menyusun tiga tingkat pemeriksaan keselamatan.',
            'Semua kondisi dapat berubah dalam satu operasi terakhir.',
            'Susun keputusan lengkap, padamkan api, lalu selamatkan bekantan.',
        ),
    },
};

export function getChallengeBridge(levelNumber, completedChallenge) {
    return challengeBridges[levelNumber]?.[completedChallenge] ?? null;
}

// Arahan memakai posisi terkini, bukan hanya checklist yang pernah dicentang.
export function getGuideInstruction({ levelNumber, challengeNumber, state = {} }) {
    if (levelNumber === 3) {
        return getLevel3Guidance(challengeNumber, state).message;
    }
    if (levelNumber === 1) {
        if (challengeNumber === 4) {
            return 'Tiga challenge selesai. Ikuti jalan ke kanan sampai petak FINISH untuk evaluasi hasil misi.';
        }
        if (challengeNumber === 1) {
            return state.atPump
                ? 'Kamu sudah di pompa! Tulis isi_air = 3 untuk menyimpan 3 unit air di tangki.'
                : 'Pergi ke pompa air di tepi sungai. Gunakan perintah gerak untuk mencapai penandanya.';
        }
        if (challengeNumber === 2) {
            if (state.water === 5) return 'Penjumlahan selesai. isi_air sekarang 5; lanjutkan pengiriman ke Pos 2.';
            return state.atPost1
                ? 'Di Pos 1, baca 3 unit dalam isi_air lalu tambah 2: isi_air += 2.'
                : 'Pergi ke Pos 1 sambil membawa 3 unit air dari pompa. Di sana kamu akan menambah 2 unit.';
        }
        if (state.hasDeliveredWater) return 'Air diterima Pos 2, tangki kosong. Lanjutkan evaluasi dengan menuju FINISH.';
        return state.atPost2
            ? 'Di Pos 2, salin air_pos = isi_air lalu isi_air = 0; atau tulis air_pos = 0, air_pos += isi_air, isi_air = 0. Jalankan satu urutan lengkap.'
            : 'Pergi ke Pos 2. Bawa 5 unit air untuk diserahkan kepada penjaga pos.';
    }

    if (challengeNumber === 4) {
        return state.fireOut
            ? 'Api evaluasi sudah padam! Pergi ke petak FINISH untuk menyelesaikan misi.'
            : 'Saatnya bekerja mandiri: siapkan pasokan air, padamkan api evaluasi, lalu capai FINISH. Gunakan konsep yang sudah kamu pelajari.';
    }
    const remaining = level2Challenges[challengeNumber].requiredWater - (state.sprays ?? 0);
    const needsWater = (state.water ?? 0) < remaining
        || (challengeNumber === 1 && !state.sprays && (state.water ?? 0) < 6);
    if (needsWater) {
        return state.atPump
            ? 'Kamu sudah di pompa! Tulis isi_air = 6 untuk mengisi tangki sampai kapasitas 6 unit.'
            : 'Pergi ke penanda pompa untuk mengambil air sebelum mendekati api.';
    }
    if (!state.atFire) {
        const location = { 1: 'tengah', 2: 'kanan atas', 3: 'kanan bawah' }[challengeNumber];
        return `Pergi ke penanda api ${location}. Bawa air untuk ${remaining} semprotan yang masih dibutuhkan.`;
    }
    if (challengeNumber === 1) return `Kamu sudah dekat api. Jalankan semprot() untuk ${remaining} semprotan lagi; setiap semprotan memakai 1 unit air.`;
    if (challengeNumber === 2) return `Gunakan for dan range() untuk mengulang semprot(). Api ini membutuhkan ${remaining} semprotan lagi.`;
    return `Simpan ${remaining} dalam jumlah_semprot, lalu pakai range(jumlah_semprot) untuk mengulang semprot().`;
}

export function getGuidePresentation({ levelNumber, challengeNumber, state = {} }) {
    if (levelNumber === 3) return getLevel3Guidance(challengeNumber, state);

    const atLocation = challengeNumber === 1 ? state.atPump
        : challengeNumber === 2 ? state.atPost1 : state.atPost2;
    const starter = getChallengeStarterCode(levelNumber, challengeNumber, {
        ...state,
        atLocation,
    });

    return {
        message: getGuideInstruction({ levelNumber, challengeNumber, state }),
        code: starter?.code ?? '',
        analogy: guideAnalogies[levelNumber]?.[challengeNumber] ?? null,
    };
}

// commands hanya memuat aksi yang dilaporkan selesai oleh scene.
// Kode asli disimpan sebelum editor bisa berubah saat mencapai penanda.
export function explainExecutedCommands({ levelNumber, challengeNumber, commands, code = '', initialWater = 0 }) {
    if (levelNumber > 1 && challengeNumber === 4) return [];

    const messages = [];
    const source = code.split(/\r?\n/).map((line) => line.split('#')[0]).join('\n');
    let water = initialWater;

    for (let index = 0; index < commands.length; index += 1) {
        const command = commands[index];
        if (command.type === 'move') {
            continue;
        } else if (command.type === 'setWater') {
            messages.push(`isi_air = ${command.amount} menyimpan nilai ${command.amount} ke variabel isi_air, mengganti nilai ${water} menjadi ${command.amount}. Tanda = menyimpan nilai, bukan menambahkannya. Di game, jumlah ini menjadi isi tangkimu.`);
            water = command.amount;
        } else if (command.type === 'branch') {
            messages.push('Saya memeriksa ' + command.condition + ': hasilnya ' + (command.result ? 'True, cabang if dijalankan.' : 'False, cabang else dijalankan.'));
        } else if (command.type === 'rescue') {
            messages.push('Kondisi aman. Bekantan mengikuti saya; saya harus mengantarnya ke pos sebelum dihitung selamat.');
        } else if (command.type === 'patrol') {
            messages.push('Satwa tidak terjebak. Saya melanjutkan patroli.');
        } else if (command.type === 'conditional') {
            const branch = command.fireOut ? 'if' : command.whenFalse === null ? 'tidak ada blok' : 'else';
            messages.push(`api_padam bernilai ${command.fireOut ? 'True' : 'False'}, sehingga ${branch} dijalankan. Status bekantan sekarang "${command.status}". if memeriksa kondisi; assignment di dalam blok menyimpan status.`);
        } else if (command.type === 'transferWater') {
            messages.push(`air_pos = isi_air menyalin nilai ${water} ke air_pos. isi_air masih ${water}; assignment Python tidak menghapus variabel asal.`);
        } else if (command.type === 'initializePostWater') {
            messages.push('air_pos = 0 membuat nilai awal pada catatan Pos 2. Sekarang air_pos dapat ditambah memakai +=.');
        } else if (command.type === 'addPostWater') {
            messages.push(`air_pos += isi_air membaca air_pos yang semula 0, menambahkan ${water} dari isi_air, lalu menyimpan ${water} ke air_pos. isi_air masih ${water}.`);
        } else if (command.type === 'addWater') {
            const operator = /^isi_air[ \t]*\+=[ \t]*2[ \t]*$/m.test(source)
                ? `isi_air += ${command.amount}` : `isi_air = isi_air + ${command.amount}`;
            messages.push(`${operator} membaca nilai lama ${water}, menghitung ${water} + ${command.amount} = ${water + command.amount}, lalu menyimpan hasilnya kembali ke isi_air.`);
            water += command.amount;
        } else if (command.type === 'clearWater') {
            messages.push(`isi_air = 0 mengganti nilai ${water} menjadi 0. air_pos tetap menyimpan ${water} unit yang diserahkan ke Pos 2.`);
            water = 0;
        } else if (command.type === 'spray') {
            let count = 1;
            while (commands[index + 1]?.type === 'spray') {
                count += 1;
                index += 1;
            }
            let concept = 'semprot() memanggil aksi menyemprot satu kali.';
            if (/range\s*\(\s*jumlah_semprot\s*\)/.test(source)) {
                concept = 'jumlah_semprot menyimpan banyaknya pengulangan. range(jumlah_semprot) membaca nilai itu, dan for mengulang blok semprot() sebanyak nilai tersebut.';
            } else if (/^\s*for\s+/m.test(source)) {
                concept = 'for mengulang blok di bawahnya. range(angka) menentukan banyaknya pengulangan; tiap semprot() dalam blok dijalankan pada setiap pengulangan.';
            }
            messages.push(`${concept} Pada Run ini, ${count} semprotan berhasil di bagian ini. Setiap semprotan memakai 1 unit air menurut aturan game, sehingga air berubah dari ${water} menjadi ${water - count}.`);
            water -= count;
        }
    }
    return messages;
}

// Tahan perpindahan challenge/layar hasil sampai semua penjelasan dibaca.
export class GuideDialogue {
    constructor() {
        this.reset();
    }

    get current() {
        return this.messages[0] ?? null;
    }

    start(messages, onComplete = () => {}, { instructionBefore = '', instructionAfter = '' } = {}) {
        const instructionChanged = instructionBefore !== instructionAfter;
        this.messages = [...messages];
        this.onComplete = onComplete;
        if (!this.current) this.next();
        return Boolean(this.current) || instructionChanged;
    }

    next() {
        this.messages.shift();
        if (this.current) return;
        const onComplete = this.onComplete;
        this.reset();
        onComplete?.();
    }

    reset() {
        this.messages = [];
        this.onComplete = null;
    }
}
