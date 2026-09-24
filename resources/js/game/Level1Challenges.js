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
        nextMessage: 'Pos 1 memiliki 2 unit air bantuan untuk Pos 2. Bawa 3 unitmu ke sana agar muatan menjadi 5.',
    },
    2: {
        title: 'Challenge 2 - Mengubah Nilai',
        description: 'Pos 1 menyiapkan 2 unit air tambahan untuk Pos 2. Bawa 3 unitmu ke sana, lalu perbarui isi_air menjadi 5 unit.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Bawa 3 unit air ke Pos 1' },
            { key: 'water', label: 'Tambah muatan isi_air menjadi 5' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 2:\n1. Tulis kanan(2), atas(6), kanan(8), lalu bawah(1).\n2. Tulis isi_air = 5 untuk menerima tambahan air.\n3. Tekan Run Code.',
        ],
        nextMessage: 'Muatan 5 unit sudah siap. Antar seluruhnya kepada penjaga Pos 2.',
    },
    3: {
        title: 'Challenge 3 - Pasok Air ke Pos 2',
        description: 'Pergi ke Pos 2 dan serahkan seluruh 5 unit air kepada penjaga menggunakan nilai isi_air.',
        requiredWater: 5,
        targets: [
            { key: 'location', label: 'Pergi ke Pos 2' },
            { key: 'transfer', label: 'Berikan 5 unit ke air_pos_2' },
        ],
        hints: [
            'Cara menyelesaikan Challenge 3:\n1. Tulis bawah(1), kanan(6), atas(9), lalu kanan(4).\n2. Tulis air_pos_2 = isi_air untuk menyerahkan air.\n3. Tekan Run Code.',
        ],
    },
};
