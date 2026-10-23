const markerStarterCodes = {
    1: 'isi_air = ...',
    2: 'isi_air += ...',
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
        lessonTitle: '2. Operator gabungan dan nilai lama',
        example: 'isi_air += 2  # sama dengan isi_air = isi_air + 2',
        lesson: 'isi_air sudah bernilai 3 dari pompa. Operator += membaca nilai lama, menambahkan 2, lalu menyimpan 5 kembali ke isi_air. Jadi isi_air += 2 setara dengan isi_air = isi_air + 2. Ini berbeda dari isi_air = 2, yang mengganti nilainya menjadi 2. Variabel harus punya nilai lebih dulu sebelum memakai +=. Python juga punya -=, *=, /=, //=, dan %=, tetapi misi ini hanya memakai penambahan 2 unit.',
        effect: 'Di game: berdiri di penanda Pos 1 dan jalankan isi_air += 2. Bentuk panjang isi_air = isi_air + 2 juga diterima. Tangki berubah dari 3 menjadi 5; operator gabungan lain belum didukung PyroPad Level 1.',
        description: 'Bawa 3 unit air ke Pos 1. Tambah 2 unit melalui kode agar tangki berisi 5.',
        requiredWater: 5,
        targets: [{ key: 'location', label: 'Capai Pos 1 dengan 3 unit air' }, { key: 'water', label: 'Tambah 2 unit sehingga menjadi 5' }],
        hints: ['Bawa 3 unit dari pompa ke Pos 1. Di penanda merah, tambah nilai lama dengan isi_air += 2. Ini sama dengan isi_air = isi_air + 2.'],
        nextMessage: 'Penjumlahan berhasil. Antar 5 unit air ke Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        lessonTitle: '3. Menggunakan nilai variabel',
        example: 'air_pos = isi_air\nisi_air = 0',
        lesson: 'Tangki isi_air sekarang 5. air_pos = isi_air menyalin 5 ke catatan Pos 2; isi_air tetap 5 karena penyalinan tidak menghapus sumber. Kemudian isi_air = 0 mengosongkan tangki. Alternatif operator gabungan: mulai dengan air_pos = 0, jalankan air_pos += isi_air agar 0 + 5 menjadi 5, lalu isi_air = 0. Tanpa nilai awal, += tidak dapat dijalankan.',
        effect: 'Di game: berdiri di penanda Pos 2. Jalankan urutan penyalinan dua baris, atau urutan operator gabungan tiga baris, dalam satu Run. Pos 2 menerima 5 unit dan tangki menjadi 0. Lalu injak petak FINISH.',
        description: 'Bawa 5 unit ke Pos 2. Salin nilai tangki ke air_pos, lalu ubah isi_air menjadi 0.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke Pos 2' },
            { key: 'transfer', label: 'Salin 5 unit ke air_pos dan kosongkan tangki' },
        ],
        hints: [
            'Di Pos 2, salin air_pos = isi_air lalu isi_air = 0. Alternatif: air_pos = 0, air_pos += isi_air, lalu isi_air = 0. Tulis urutan pilihanmu dalam satu Run.',
        ],
        nextMessage: 'Tiga challenge selesai. Ikuti jalan ke kanan menuju FINISH untuk evaluasi hasil misi.',
    },
    4: {
        title: 'Evaluasi - Menuju FINISH',
        lessonTitle: '4. Periksa hasil dan capai FINISH',
        example: 'kanan(1)',
        lesson: 'Nilai isi_air dan air_pos sudah diubah pada tiga challenge sebelumnya. FINISH memeriksa hasil misi yang sudah tercatat; menulis assignment baru di sini tidak mengulang pengiriman air. Gunakan perintah gerak untuk menuju petak FINISH.',
        effect: 'Di game: ikuti jalan sampai FINISH. Nilai akhir mencerminkan aksi yang benar-benar berhasil di pompa, Pos 1, dan Pos 2.',
        description: 'Tiga challenge sudah selesai. Ikuti jalan ke petak FINISH untuk melihat nilai akhir. Tidak perlu membuat variabel air baru.',
        requiredWater: 5,
        targets: [
            { key: 'finish', label: 'Capai petak FINISH' },
        ],
        hints: ['Dari Pos 2, ikuti jalan ke kanan sampai petak FINISH.'],
    },
};
