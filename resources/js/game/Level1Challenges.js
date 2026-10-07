const markerStarterCodes = {
    1: 'isi_air = ...',
    2: 'isi_air = ...',
    3: 'air_pos = ...',
};

export function getLevel1MarkerStarterCode({
    challengeNumber,
    hasReachedMarker = false,
    isAtMarker = false,
}) {
    if (hasReachedMarker || !isAtMarker) return null;
    return markerStarterCodes[challengeNumber] ?? null;
}

// Isi misi dipisahkan dari tombol dan tampilan agar mudah ditemukan dan diedit.
export default {
    1: {
        title: 'Challenge 1 - Mengambil Air',
        description: 'Pergi ke pompa di tepi sungai, lalu simpan 3 unit air ke dalam variabel isi_air.',
        requiredWater: 3,
        targets: [
            { key: 'location', label: 'Pergi ke pompa air' },
            { key: 'water', label: 'Ambil 3 unit air' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 1:\n1. Tulis atas(3) untuk menuju pompa.\n2. Tulis isi_air = 3 untuk mengambil air.\n3. Tekan Run Code.',
        ],
        nextMessage: 'Kamu membawa 3 unit air. Pos 1 menyediakan 2 unit lagi, jadi jumlah akhirnya 3 + 2 = 5 unit.',
    },
    2: {
        title: 'Challenge 2 - Mengubah Nilai',
        description: 'Kamu sudah membawa 3 unit. Di Pos 1, penjaga memberi 2 unit lagi: 3 + 2 = 5. Tulis isi_air = 5 untuk menyimpan jumlah akhir, bukan menambah 5 lagi.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Bawa 3 unit air ke Pos 1' },
            { key: 'water', label: 'Simpan jumlah akhir: isi_air = 5' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 2:\n1. Tulis kanan(2), atas(6), kanan(8), lalu bawah(1).\n2. Kamu membawa 3 unit; Pos 1 memberi 2 unit. Jumlah akhir 3 + 2 = 5.\n3. Tulis isi_air = 5 di penanda Pos 1, lalu tekan Run Code. Angka 5 menggantikan nilai lama 3.',
        ],
        nextMessage: 'Muatan 5 unit sudah siap. Antar seluruhnya kepada penjaga Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        description: 'Bawa 5 unit hasil 3 + 2 ke Pos 2. Tulis air_pos = isi_air untuk menyerahkan nilainya, lalu ikuti jalan ke kanan menuju petak FINISH.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke Pos 2' },
            { key: 'transfer', label: 'Berikan 5 unit ke air_pos' },
            { key: 'finish', label: 'Capai petak FINISH di ujung jalan' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 3:\n1. Tulis bawah(1), kanan(6), atas(9), lalu kanan(4) untuk tiba di Pos 2.\n2. Tulis air_pos = isi_air untuk menyerahkan 5 unit air.\n3. Tulis kanan(15) untuk mencapai petak FINISH. Tekan Run Code. Kamu juga boleh menjalankan langkah terakhir secara terpisah.',
        ],
    },
};
