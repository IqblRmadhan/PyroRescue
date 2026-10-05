import { level2Map } from './Level2Map.js';

// Nomor challenge mengikuti area: tengah, kanan atas, lalu kanan bawah.
// Kekuatan aset: LEVEL2-C1 = 2 semprotan, LEVEL2-C2 = 3, LEVEL2-C3 = 1.
const challenges = {
    1: {
        title: 'Challenge 1 - Mengenal Semprotan',
        description: 'Datangi pompa di atas jalan dekat jembatan dan tulis isi_air = 6. Gunakan 2 unit untuk memadamkan api C1 dengan semprot() dua kali.',
        texture: 'fireC1',
        requiredWater: 2,
        targets: [
            { key: 'water', label: 'Ambil 6 unit air di pompa' },
            { key: 'location', label: 'Pergi ke penanda api tengah' },
            { key: 'fire', label: 'Padamkan api dengan 2 semprotan' },
        ],
        example: 'isi_air = 6\nsemprot()\nsemprot()',
        lesson: 'Ulangi materi variabel: di pompa, isi_air = 6 menyimpan enam unit air. C1 butuh dua semprotan, C2 tiga, dan C3 satu. Tiap semprot() memakai satu unit, sehingga setelah C1 masih ada empat.',
        hints: [
            'Datangi penanda merah di sebelah pompa. Tulis isi_air = 6 untuk mengisi tangki, lalu lanjut ke api C1.',
            'Dari awal challenge: kanan(15), isi_air = 6, kanan(2), bawah(3), kanan(2), lalu semprot() pada dua baris. Jalankan tiap perintah sesuai urutan.',
        ],
        nextMessage: 'Empat unit air tersisa. Lanjutkan ke api kanan atas dan gunakan perulangan untuk menyemprot tiga kali.',
    },
    2: {
        title: 'Challenge 2 - Mengulang Semprotan',
        description: 'Empat unit air tersisa dari pompa. Pergi ke C2 dan gunakan for serta range() untuk menjalankan 3 semprotan.',
        texture: 'fireC2',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api kanan atas' },
            { key: 'fire', label: 'Padamkan api dengan for/range: 3 semprotan' },
        ],
        example: 'for i in range(3):\n    semprot()',
        lesson: 'Dari isi_air = 6, dua unit dipakai di C1 sehingga tersisa empat. range(3) mengulang semprot() tiga kali di C2; satu unit air akan tersisa untuk C3.',
        hints: [
            'Kembali ke jalan utama, lalu ikuti jalan atas ke kanan. Gunakan for/range agar semprot() diulang tiga kali.',
            'Dari awal challenge: kiri(2), atas(6), kanan(13), bawah(2), kanan(4). Lalu tulis for i in range(3): dan semprot() dengan empat spasi di baris berikutnya.',
        ],
        nextMessage: 'Satu unit air tersisa untuk api terakhir. Simpan jumlah iterasinya dalam jumlah_semprot.',
    },
    3: {
        title: 'Challenge 3 - Variabel dalam Perulangan',
        description: 'Gunakan sisa 1 unit air di api kanan bawah. Simpan jumlah_semprot = 1, pakai dalam range(), lalu menuju FINISH.',
        texture: 'fireC3',
        requiredWater: 1,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api kanan bawah' },
            { key: 'fire', label: 'Padamkan api dengan variabel + for: 1 semprotan' },
            { key: 'finish', label: 'Capai petak FINISH' },
        ],
        example: 'jumlah_semprot = 1\nfor i in range(jumlah_semprot):\n    semprot()',
        lesson: 'isi_air menyimpan satu unit air yang tersisa. Variabel jumlah_semprot menyimpan banyaknya iterasi. range(jumlah_semprot) membaca nilai 1, jadi semprot() memakai unit terakhir sekali.',
        hints: [
            'Ikuti jalan ke kanan lalu turun. Setelah api padam, teruskan jalan ke bawah, lewati jembatan ke kiri, lalu turun ke FINISH.',
            'Dari awal challenge: bawah(2), kanan(4), bawah(11). Tulis jumlah_semprot = 1, lalu for i in range(jumlah_semprot): dengan semprot() berindentasi. Setelah padam: bawah(6), kiri(17), bawah(6).',
        ],
    },
};

export function getFirePresentation(number, challengeNumber, sprays, definitions = challenges) {
    const fireNumber = Number(number);
    const requiredSprays = definitions[fireNumber].requiredWater;
    const isActive = fireNumber === challengeNumber;
    const completed = fireNumber < challengeNumber || (isActive && sprays >= requiredSprays);

    if (completed) {
        return { completed: true, label: `C${fireNumber} • PADAM`, markerState: 'completed' };
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
