const markerStarterCodes = {
    1: 'isi_air = ...',
    2: 'isi_air = ...',
    3: 'air_pos = ...',
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
        lesson: 'isi_air adalah nama variabel. Angka 3 adalah nilai berupa bilangan bulat (integer). Baris ini menyimpan nilai 3 ke isi_air.',
        effect: 'Di game: berdiri di penanda pompa dahulu. Saat kode dijalankan, pompa mengisi tangki sampai 3 unit.',
        description: 'Pergi ke pompa di tepi sungai, lalu simpan 3 unit air ke dalam variabel isi_air.',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke pompa air' },
            { key: 'water', label: 'Ambil 3 unit air' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 1:\n1. Dari posisi awal, tulis atas(3), kanan(2), lalu atas(4) untuk menuju pompa.\n2. Tulis isi_air = 3 untuk mengambil air.\n3. Tekan Run Code.',
        ],
        nextMessage: 'Kamu membawa 3 unit air. Pos 1 menyediakan 2 unit lagi, jadi jumlah akhirnya 3 + 2 = 5 unit.',
    },
    2: {
        title: 'Challenge 2 - Mengubah Nilai',
        lessonTitle: '2. Mengubah nilai variabel',
        example: 'isi_air = 5',
        lesson: 'Dari pompa kamu membawa 3 unit. Penjaga Pos 1 memberi 2 unit lagi, jadi 3 + 2 = 5 unit. Tulis isi_air = 5 untuk menyimpan jumlah akhir. Tanda = mengganti nilai lama 3 dengan 5; angka 5 bukan air tambahan.',
        effect: 'Di game: berdiri di penanda Pos 1 saat menjalankan isi_air = 5. Kamu akan melihat indikator tangki naik dari 3 ke 5.',
        description: 'Kamu sudah membawa 3 unit. Di Pos 1, penjaga memberi 2 unit lagi: 3 + 2 = 5. Tulis isi_air = 5 untuk menyimpan jumlah akhir, bukan menambah 5 lagi.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Bawa 3 unit air ke Pos 1' },
            { key: 'water', label: 'Simpan jumlah akhir: isi_air = 5' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 2:\n1. Dari pompa, tulis atas(2), kanan(8), lalu bawah(1).\n2. Kamu membawa 3 unit; Pos 1 memberi 2 unit. Jumlah akhir 3 + 2 = 5.\n3. Tulis isi_air = 5 di penanda Pos 1, lalu tekan Run Code. Angka 5 menggantikan nilai lama 3.',
        ],
        nextMessage: 'Muatan 5 unit sudah siap. Antar seluruhnya kepada penjaga Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        lessonTitle: '3. Menggunakan nilai variabel',
        example: 'air_pos = isi_air',
        lesson: 'Nilai isi_air sekarang 5, hasil 3 unit dari pompa + 2 unit dari Pos 1. Baris ini membaca nilai 5 dari isi_air dan menyimpannya ke air_pos.',
        effect: 'Di game: jalankan di penanda Pos 2 untuk menyerahkan air, lalu injak petak FINISH. Game mengosongkan isi_air setelah penyerahan; dalam Python biasa, assignment tidak mengosongkan variabel asal.',
        description: 'Bawa 5 unit hasil 3 + 2 ke Pos 2. Tulis air_pos = isi_air untuk menyerahkan nilainya.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke Pos 2' },
            { key: 'transfer', label: 'Berikan 5 unit ke air_pos' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 3:\n1. Tulis bawah(1), kanan(6), atas(9), lalu kanan(4) untuk tiba di Pos 2.\n2. Tulis air_pos = isi_air untuk menyerahkan 5 unit air. Tekan Run Code.',
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
