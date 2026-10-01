// Nomor challenge mengikuti area: tengah, kanan atas, lalu kanan bawah.
// Kekuatan aset: LEVEL2-C1 = 2 semprotan, LEVEL2-C2 = 3, LEVEL2-C3 = 1.
const challenges = {
    1: {
        title: 'Challenge 1 - Mengenal Semprotan',
        description: 'Pergi ke penanda di area tengah. Api membutuhkan 2 kali semprot().',
        texture: 'fireC1',
        requiredWater: 2,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api tengah' },
            { key: 'fire', label: 'Padamkan api dengan 2 semprotan' },
        ],
        example: 'semprot()\nsemprot()',
        lesson: 'semprot() adalah perintah game tanpa argumen. Satu panggilan menjalankan satu aksi penyemprotan. Panggil dua kali untuk memadamkan api ini.',
        hints: [
            'Ikuti jalan dari kiri menuju cabang yang mengarah ke area tengah. Jalankan semprot() dua kali saat berdiri di penanda merah.',
            'Dari awal challenge: kanan(17), bawah(3), kanan(2). Tulis setiap perintah di baris terpisah, lalu tulis semprot() pada dua baris berikutnya.',
        ],
        nextMessage: 'Lanjutkan ke api di kanan atas dan gunakan perulangan untuk menyemprot tiga kali.',
    },
    2: {
        title: 'Challenge 2 - Mengulang Semprotan',
        description: 'Pergi ke penanda di kanan atas. Gunakan for dan range() untuk menjalankan 3 semprotan.',
        texture: 'fireC2',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api kanan atas' },
            { key: 'fire', label: 'Padamkan api dengan for/range: 3 semprotan' },
        ],
        example: 'for i in range(3):\n    semprot()',
        lesson: 'range(3) membuat blok berjalan tiga kali. Empat spasi sebelum semprot() menunjukkan bahwa aksi ini berada di dalam for.',
        hints: [
            'Kembali ke jalan utama, lalu ikuti jalan atas ke kanan. Gunakan for/range agar semprot() diulang tiga kali.',
            'Dari awal challenge: kiri(2), atas(6), kanan(13), bawah(2), kanan(4), bawah(2). Lalu tulis for i in range(3): dan semprot() dengan empat spasi di baris berikutnya.',
        ],
        nextMessage: 'Api terakhir berada di kanan bawah. Simpan jumlah iterasinya dalam jumlah_semprot.',
    },
    3: {
        title: 'Challenge 3 - Variabel dalam Perulangan',
        description: 'Pergi ke api kanan bawah. Simpan jumlah_semprot = 1, pakai dalam range(), lalu ikuti jalan sampai FINISH.',
        texture: 'fireC3',
        requiredWater: 1,
        targets: [
            { key: 'location', label: 'Pergi ke penanda api kanan bawah' },
            { key: 'fire', label: 'Padamkan api dengan variabel + for: 1 semprotan' },
            { key: 'finish', label: 'Capai petak FINISH' },
        ],
        example: 'jumlah_semprot = 1\nfor i in range(jumlah_semprot):\n    semprot()',
        lesson: 'Variabel menyimpan jumlah iterasi. range(jumlah_semprot) membaca nilai itu. Karena nilainya 1, semprot() dijalankan satu kali.',
        hints: [
            'Ikuti jalan ke kanan lalu turun. Setelah api padam, teruskan jalan ke bawah, lewati jembatan ke kiri, lalu turun ke FINISH.',
            'Dari awal challenge: kanan(4), bawah(12). Tulis jumlah_semprot = 1, lalu for i in range(jumlah_semprot): dengan semprot() berindentasi. Setelah padam: bawah(5), kiri(17), bawah(6).',
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

export default challenges;
