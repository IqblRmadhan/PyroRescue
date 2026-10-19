const markerStarterCodes = {
    1: 'isi_air = ...',
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
        example: 'isi_air = 5',
        lesson: 'isi_air adalah nama variabel. Angka 5 adalah nilai berupa bilangan bulat (integer). Baris ini menyimpan nilai 5 ke isi_air.',
        effect: 'Di game: berdiri di penanda pompa dahulu. Saat kode dijalankan, pompa mengisi tangki sampai 5 unit.',
        description: 'Pergi ke pompa di tepi sungai, lalu simpan 5 unit air ke dalam variabel isi_air.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke pompa air' },
            { key: 'water', label: 'Ambil 5 unit air' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 1:\n1. Dari posisi awal, tulis atas(3), kanan(2), lalu atas(4) untuk menuju pompa.\n2. Tulis isi_air = 5 untuk mengambil air.\n3. Tekan Run Code.',
        ],
        nextMessage: 'Kamu membawa 5 unit air. Pergi ke Pos 1 untuk melapor sebelum meneruskan pengiriman.',
    },
    2: {
        title: 'Challenge 2 - Melapor di Pos 1',
        lessonTitle: '2. Menjaga nilai variabel',
        example: '# isi_air tetap 5 selama perjalanan',
        lesson: 'Nilai variabel tetap tersimpan selama perjalanan. Lima unit sudah diambil di pompa; tidak perlu mengisi ulang atau menulis assignment lagi di Pos 1.',
        effect: 'Saat tiba di penanda Pos 1, pemeriksaan selesai. Persediaan tetap 5 unit untuk Pos 2.',
        description: 'Bawa 5 unit dari pompa ke Pos 1. Cukup capai penandanya untuk melapor.',
        requiredWater: 5,
        targets: [{ key: 'location', label: 'Capai Pos 1 dengan membawa 5 unit air' }],
        hints: ['Dari pompa, ikuti jalan ke Pos 1: atas(2), kanan(8), lalu bawah(1). Air tetap tersimpan; tidak perlu assignment lagi.'],
        nextMessage: 'Pemeriksaan Pos 1 selesai. Antar 5 unit air ke Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        lessonTitle: '3. Menggunakan nilai variabel',
        example: 'air_pos = isi_air',
        lesson: 'Nilai isi_air tetap 5 sejak pengisian di pompa. Baris ini membaca nilai 5 dari isi_air dan menyimpannya ke air_pos.',
        effect: 'Di game: jalankan di penanda Pos 2 untuk menyerahkan air, lalu injak petak FINISH. Game mengosongkan isi_air setelah penyerahan; dalam Python biasa, assignment tidak mengosongkan variabel asal.',
        description: 'Bawa 5 unit dari pompa ke Pos 2. Tulis air_pos = isi_air untuk menyerahkan nilainya.',
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
