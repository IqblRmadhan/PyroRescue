// Modul PyroRescue, BAB III, halaman 18–23.
const challenges = {
    1: {
        title: 'Challenge 1 - Memadamkan Api di Habitat',
        texture: 'fireC3', requiredWater: 3,
        description: 'Ambil 3 unit air di pompa, lalu padamkan api habitat dengan variabel dan perulangan.',
        targets: [
            { key: 'water', label: 'Siapkan 3 unit air di pompa' },
            { key: 'location', label: 'Datangi penanda api habitat' },
            { key: 'fire', label: 'Padamkan api dengan variabel + for: 3 semprotan' },
        ],
        example: 'jumlah_semprot = 3\nfor i in range(jumlah_semprot):\n    semprot()',
        lesson: 'Boolean hanya memiliki dua nilai: True dan False, tanpa tanda petik. Setelah 3 semprotan, sistem mengubah api_padam dari False menjadi True. Pemain tidak mengisi api_padam sendiri.',
        effect: 'Api mengecil hingga padam. HUD menampilkan api_padam = True.',
        hints: [
            'Pergi ke titik biru pompa di kanan tempat awal. Isi tangki dengan isi_air = 3, lalu datangi titik merah api di pulau tengah.',
            'Dari awal: kanan(4), isi_air = 3, bawah(1), kanan(10), atas(6). Di api, simpan jumlah_semprot = 3 lalu gunakan for i in range(jumlah_semprot): dengan semprot() berindentasi.',
        ],
    },
    2: {
        title: 'Challenge 2 - Memeriksa Kondisi Api dengan if',
        requiredWater: 3,
        description: 'Api habitat telah padam. Dekati bekantan dan periksa api_padam untuk menyatakan area aman.',
        targets: [
            { key: 'habitat', label: 'Datangi penanda bekantan' },
            { key: 'safe', label: 'Gunakan if untuk mengubah status menjadi aman' },
        ],
        example: 'if api_padam:\n    status_bekantan = "aman"',
        lesson: 'if memeriksa kondisi. Jika api_padam bernilai True, blok dijalankan. Jika False, blok dilewati. Assignment menyimpan nilai; if memeriksa nilai yang sudah ada.',
        effect: 'Saat kondisi benar, HUD menampilkan BEKANTAN: AMAN.',
        hints: [
            'Dari penanda api, gunakan bawah(2) untuk mendekati bekantan. Api yang padam pada Challenge 1 tetap padam.',
            'Tulis if api_padam: lalu empat spasi dan status_bekantan = "aman" di baris berikutnya.',
        ],
    },
    3: {
        title: 'Challenge 3 - Menentukan Tindakan dengan if/else',
        requiredWater: 3,
        description: 'Tentukan dua jalur: bekantan selamat jika api padam, atau tunggu jika api belum padam.',
        targets: [
            { key: 'habitat', label: 'Berdiri di penanda bekantan' },
            { key: 'rescued', label: 'Gunakan if/else: selamat atau tunggu' },
        ],
        example: 'if api_padam:\n    status_bekantan = "selamat"\nelse:\n    status_bekantan = "tunggu"',
        lesson: 'Hanya satu cabang dijalankan. True memilih if, False memilih else. Else adalah alternatif ketika if tidak terpenuhi, bukan kondisi baru.',
        effect: 'Bekantan bereaksi sesuai status. Penyelamatan hanya berhasil ketika api benar-benar padam.',
        hints: [
            'Tetap di penanda bekantan. Buat tindakan untuk kedua kemungkinan kondisi api.',
            'Isi blok if dengan status_bekantan = "selamat" dan blok else dengan status_bekantan = "tunggu". if dan else sejajar, isi masing-masing blok menjorok empat spasi.',
        ],
    },
    4: {
        title: 'Evaluasi Akhir - Misi Penyelamatan Lengkap',
        texture: 'fireEval', requiredWater: 4,
        description: 'Siapkan air di pompa pulau tengah. Di pulau bawah, padamkan api dengan 4 semprotan, tentukan status bekantan, lalu capai FINISH.',
        targets: [
            { key: 'water', label: 'Siapkan 4 unit air' },
            { key: 'fire', label: 'Padamkan api terakhir dengan 4 semprotan' },
            { key: 'rescued', label: 'Selamatkan bekantan dengan percabangan' },
            { key: 'finish', label: 'Capai petak FINISH' },
        ],
        example: '', lesson: '', effect: '', hints: [],
    },
};

export default challenges;
