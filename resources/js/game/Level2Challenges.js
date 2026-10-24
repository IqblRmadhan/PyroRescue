import { level2Map } from './Level2Map.js';

// Nomor challenge mengikuti area: tengah, kanan atas, kanan bawah, lalu evaluasi.
// Kekuatan aset: LEVEL2-C1 = 2 semprotan, LEVEL2-C2 = 1, LEVEL2-C3 = 3,
// dan LEVEL2-EVAL = 3 semprotan.
const challenges = {
    1: {
        title: 'Challenge 1 - Mengenal Semprotan',
        effect: 'semprot() memanggil satu aksi menyemprot. Dua aksi penyemprotan memadamkan api Challenge 1 dan air di tangki berkurang otomatis.',
        description: 'Isi tangki dengan 6 unit air, lanjutkan ke Challenge 1, lalu jalankan semprot() dua kali untuk memadamkan api.',
        texture: 'fireC1',
        requiredWater: 2,
        targets: [
            { key: 'water', label: 'Ambil 6 unit air di pompa' },
            { key: 'location', label: 'Pergi ke penanda api tengah' },
            { key: 'fire', label: 'Padamkan api dengan 2 semprotan' },
        ],
        example: 'semprot()\nsemprot()',
        lesson: 'semprot() adalah aksi penyemprotan dalam game. Karena api Challenge 1 membutuhkan dua semprotan, tulis aksi yang sama pada dua baris. Setiap aksi mengurangi 1 unit air dalam tangki secara otomatis.',
        hints: [
            'Datangi penanda biru di sebelah pompa dan isi tangki dengan 6 unit air, lalu lanjut ke api Challenge 1.',
            'Dari awal challenge: kanan(15), isi tangki dengan 6 unit air, kanan(2), bawah(3), kanan(2), lalu semprot() pada dua baris. Jalankan tiap perintah sesuai urutan.',
        ],
        nextMessage: 'Empat unit air tersisa. Sekarang langsung menuju titik api Challenge 2 di kanan atas.',
    },
    2: {
        title: 'Challenge 2 - Mengulang Semprotan',
        effect: 'Di game: datangi penanda Challenge 2, lalu padamkan api dengan 1 kali semprotan.',
        description: 'Pergi ke Challenge 2 dan gunakan for i in range(1): untuk menjalankan satu semprotan melalui perulangan.',
        texture: 'fireC2',
        requiredWater: 1,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api kanan atas' },
            { key: 'fire', label: 'Padamkan api dengan for/range: 1 semprotan' },
        ],
        example: 'for i in range(1):\n    semprot()',
        lesson: 'for memulai perulangan, i mencatat putaran yang sedang berjalan, dan range(1) melakukan 1 kali perulangan. Setelah tanda (:), baris berikutnya harus memakai indentasi. Tekan Tab untuk membuat indentasi sebelum semprot().',
        hints: [
            'Kembali ke jalan utama, lalu ikuti jalan atas ke kanan. Gunakan for/range agar semprot() dijalankan satu kali.',
            'Dari awal challenge: kiri(2), atas(6), kanan(13), bawah(2), kanan(4). Lalu tulis for i in range(1): dan tekan Tab untuk memberi indentasi pada semprot() di baris berikutnya.',
        ],
        nextMessage: 'Tiga unit air tersisa. Sekarang langsung menuju titik api Challenge 3 di kanan bawah.',
    },
    3: {
        title: 'Challenge 3 - Variabel dalam Perulangan',
        effect: 'Di game: datangi penanda Challenge 3, lalu padamkan api dengan 3 kali semprotan.',
        description: 'Gunakan sisa 3 unit air di api kanan bawah. Simpan jumlah_semprot = 3, lalu gunakan nilainya dalam range().',
        texture: 'fireC3',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api kanan bawah' },
            { key: 'fire', label: 'Padamkan api dengan variabel + for: 3 semprotan' },
        ],
        example: 'jumlah_semprot = 3\nfor i in range(jumlah_semprot):\n    semprot()',
        lesson: 'isi_air menyimpan tiga unit air yang tersisa. Variabel jumlah_semprot menyimpan banyaknya iterasi. range(jumlah_semprot) membaca nilai 3, jadi semprot() dijalankan tiga kali.',
        hints: [
            'Ikuti jalan ke kanan lalu turun ke penanda api kanan bawah.',
            'Dari awal challenge: bawah(2), kanan(4), bawah(11). Tulis jumlah_semprot = 3, lalu for i in range(jumlah_semprot): dengan semprot() berindentasi.',
        ],
        nextMessage: 'Tiga area latihan selesai. Lanjutkan ke area evaluasi dan selesaikan misi terakhir secara mandiri.',
    },
    4: {
        title: 'Evaluasi Akhir - Padamkan Api',
        description: 'Di area terakhir, siapkan 3 unit air, padamkan api dengan 3 semprotan, lalu capai FINISH. Gunakan kembali konsep yang telah dipelajari.',
        texture: 'fireEval',
        requiredWater: 3,
        targets: [
            { key: 'water', label: 'Siapkan pasokan air' },
            { key: 'location', label: 'Temukan petak semprot terakhir' },
            { key: 'fire', label: 'Padamkan api evaluasi dengan 3 semprotan' },
            { key: 'finish', label: 'Capai petak FINISH' },
        ],
        example: '',
        lesson: '',
        hints: [],
    },
};

export function getLevel2WaterTarget(challengeNumber, definitions = challenges) {
    return Number(challengeNumber) === 4 ? definitions[4].requiredWater : 6;
}

export function getLevel2WaterCapacity() {
    return 6;
}

export function isLevel2WaterTargetComplete(challengeNumber, water, definitions = challenges) {
    const target = getLevel2WaterTarget(challengeNumber, definitions);

    return Number(challengeNumber) === 4 ? water >= target : water === target;
}

export function getPumpAnimationCycleCount(amount, currentWater = 0) {
    return Number.isSafeInteger(amount) && amount > 0 ? Math.max(0, amount - currentWater) : 0;
}

export function getFirePresentation(number, challengeNumber, sprays, definitions = challenges) {
    const fireNumber = Number(number);
    const requiredSprays = definitions[fireNumber].requiredWater;
    const isActive = fireNumber === challengeNumber;
    const completed = fireNumber < challengeNumber || (isActive && sprays >= requiredSprays);

    if (completed) {
        return {
            completed: true,
            label: fireNumber === 4 ? 'EVALUASI • PADAM' : `C${fireNumber} • PADAM`,
            markerState: 'completed',
        };
    }

    if (fireNumber === 4) {
        return { completed: false, label: 'EVALUASI', markerState: 'visible' };
    }

    const remaining = isActive ? requiredSprays - sprays : requiredSprays;
    const label = isActive && sprays > 0
        ? `C${fireNumber} • SISA ${remaining} SEMPROT`
        : `C${fireNumber} • ${remaining}× SEMPROT`;

    return { completed: false, label, markerState: 'visible' };
}

export function isPlayerNearBurningFire(
    { column, row, challengeNumber, sprays },
    definitions = challenges,
    map = level2Map,
) {
    const radius = 2;

    return Object.entries(map.fires).some(([number, fire]) => {
        const presentation = getFirePresentation(number, challengeNumber, sprays, definitions);
        if (presentation.completed) return false;

        return Math.abs(column - fire.action.column) <= radius
            && Math.abs(row - fire.action.row) <= radius;
    });
}

export default challenges;
