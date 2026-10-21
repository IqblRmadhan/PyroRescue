const markerStarterCodes = {
    1: 'isi_air = ...',
    2: 'isi_air = isi_air + ...',
    3: 'air_pos = ...\nisi_air = ...',
};

export function getLevel1MarkerStarterCode({
    challengeNumber,
    hasShownStarterCode = false,
    isAtMarker = false,
}) {
    if (hasShownStarterCode || !isAtMarker) return null;
    return markerStarterCodes[challengeNumber] ?? null;
}

// Isi misi dipisahkan dari tombol dan tampilan agar mudah ditemukan dan diedit.
export default {
    1: {
        title: 'Challenge 1 - Mengambil Air',
        lessonTitle: '1. Membuat variabel',
        example: 'isi_air = 3',
        lesson: 'isi_air adalah nama variabel. Angka 3 adalah bilangan bulat (integer). Tanda = menyimpan nilai di sebelah kanan ke nama di sebelah kiri. Mula-mula tangki menyimpan 3 unit.',
        effect: 'Di game: berdiri di penanda pompa, lalu jalankan isi_air = 3 untuk mengisi tangki. Di Pos 1 kamu akan belajar menambahkan 2 unit.',
        description: 'Pergi ke pompa di tepi sungai, lalu simpan 3 unit air dalam isi_air.',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke pompa air' },
            { key: 'water', label: 'Ambil 3 unit air' },
        ],
        hints: [
            'Dari posisi awal, susun perintah gerak menuju pompa. Di penanda biru, isi isi_air dengan 3. Tekan Run Code untuk menjalankannya.',
        ],
        nextMessage: 'Kamu membawa 3 unit air. Pergi ke Pos 1 untuk menambah persediaan.',
    },
    2: {
        title: 'Challenge 2 - Tambah Air di Pos 1',
        lessonTitle: '2. Menambah dan mengubah nilai',
        example: 'isi_air = isi_air + 2',
        lesson: 'Variabel isi_air masih menyimpan 3 unit dari pompa. Python membaca nilai lama di sebelah kanan: 3 + 2 = 5. Tanda = lalu menyimpan hasil 5 kembali ke isi_air. Operator bilangan lain: - mengurangi, * mengalikan, / membagi (hasil desimal), // membagi bulat, dan % mencari sisa bagi. Di misi ini hanya + 2 yang dijalankan.',
        effect: 'Di game: berdiri di penanda Pos 1, lalu jalankan isi_air = isi_air + 2. Tangki bertambah dari 3 menjadi 5 unit. Operator lain hanya contoh materi dan belum didukung PyroPad Level 1.',
        description: 'Bawa 3 unit air ke Pos 1. Tambah 2 unit melalui kode agar tangki berisi 5.',
        requiredWater: 5,
        targets: [{ key: 'location', label: 'Capai Pos 1 dengan 3 unit air' }, { key: 'water', label: 'Tambah 2 unit sehingga menjadi 5' }],
        hints: ['Bawa 3 unit dari pompa ke Pos 1. Di penanda merah, baca nilai isi_air yang lama lalu tambah 2: isi_air = isi_air + 2.'],
        nextMessage: 'Penjumlahan berhasil. Antar 5 unit air ke Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        lessonTitle: '3. Menggunakan nilai variabel',
        example: 'air_pos = isi_air\nisi_air = 0',
        lesson: 'Tangki isi_air sekarang 5 karena ditambah di Pos 1. Baris pertama membaca 5 dari isi_air dan menyalinnya ke air_pos. Menyalin tidak menghapus nilai asal: pada Python biasa, isi_air masih 5. Baris kedua mengubah isi_air menjadi 0 untuk menandai tangki kosong.',
        effect: 'Di game: berdiri di penanda Pos 2. Jalankan kedua baris berurutan dalam satu Run; Pos 2 menerima 5 unit, tangki menjadi 0. Lalu injak petak FINISH.',
        description: 'Bawa 5 unit ke Pos 2. Salin nilai tangki ke air_pos, lalu ubah isi_air menjadi 0.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke Pos 2' },
            { key: 'transfer', label: 'Salin 5 unit ke air_pos dan kosongkan tangki' },
        ],
        hints: [
            'Di Pos 2, susun dua assignment dalam satu Run: air_pos = isi_air untuk menyalin 5, lalu isi_air = 0 untuk mengubah isi tangki. Urutan baris penting.',
        ],
        nextMessage: 'Tiga challenge selesai. Ikuti jalan ke kanan menuju FINISH untuk evaluasi hasil misi.',
    },
    4: {
        title: 'Evaluasi - Menuju FINISH',
        description: 'Tiga challenge sudah selesai. Ikuti jalan ke petak FINISH untuk melihat nilai akhir.',
        requiredWater: 5,
        targets: [
            { key: 'finish', label: 'Capai petak FINISH' },
        ],
        hints: ['Dari Pos 2, ikuti jalan ke kanan sampai petak FINISH.'],
    },
};
