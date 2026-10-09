import level1Challenges from './Level1Challenges.js';
import level2Challenges from './Level2Challenges.js';

// Arahan memakai posisi terkini, bukan hanya checklist yang pernah dicentang.
export function getGuideInstruction({ levelNumber, challengeNumber, state = {} }) {
    if (levelNumber === 1) {
        if (challengeNumber === 1) {
            return state.atPump
                ? 'Kamu sudah di pompa! Tulis isi_air = 3 untuk menyimpan 3 unit air di tangki.'
                : 'Pergi ke pompa air di tepi sungai. Gunakan perintah gerak untuk mencapai penandanya.';
        }
        if (challengeNumber === 2) {
            return state.atPost1
                ? 'Pos 1 memberi 2 unit tambahan. Tulis isi_air = 5 untuk menyimpan jumlah akhir: 3 + 2 = 5.'
                : 'Pergi ke Pos 1 sambil membawa 3 unit air. Penjaga menyiapkan 2 unit tambahan untukmu.';
        }
        if (state.postWater === level1Challenges[3].requiredWater) {
            return 'Air sudah diterima Pos 2! Ikuti jalan ke kanan sampai petak FINISH.';
        }
        return state.atPost2
            ? 'Kamu tiba di Pos 2. Tulis air_pos = isi_air untuk memasok air dari tangkimu.'
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

// commands hanya memuat aksi yang dilaporkan selesai oleh scene.
// Kode asli disimpan sebelum editor bisa berubah saat mencapai penanda.
export function explainExecutedCommands({ levelNumber, challengeNumber, commands, code = '', initialWater = 0 }) {
    if (levelNumber === 2 && challengeNumber === 4) return [];

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
        } else if (command.type === 'transferWater') {
            messages.push(`air_pos = isi_air menyalin nilai ${water} dari isi_air ke air_pos. Di game, Pos 2 menerima air dan tangkimu dikosongkan. Pengosongan tangki adalah aturan game; assignment Python biasa tidak mengosongkan variabel asal.`);
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
