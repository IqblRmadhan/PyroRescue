import { level3Map as map } from './Level3Map.js';

// Submisi berurutan; jarak gerak disesuaikan dengan grid map.
const step = (label, instruction, target, behavior = null, hud = []) => ({ label, instruction, target, behavior, hud });
const challenges = {
    1: {
        title: 'Challenge 1 - Patroli dan Penyelamatan Pertama', texture: 'fireC1', requiredWater: 2,
        description: 'Isi air, periksa jalur, padamkan api, lalu antar bekantan pertama ke pos.',
        steps: [
            step('Menuju pos penyelamatan', 'Ikuti jembatan dari hutan kiri ke pondok tengah-kiri. Capai penanda POS.', map.post),
            step('Mengambil 4 unit air', 'Datangi titik biru di pompa persimpangan tengah. Simpan 4 unit dalam isi_air. Kapasitas tangki 5 unit.', map.pump.action, null, ['water']),
            step('Memilih jembatan aman', 'Datangi persimpangan bawah. Periksa jalur_aman: jika benar, maju 3 petak; jika salah, kanan 2 petak. Kode harus benar pada kedua keadaan.', map.crossing, 'route', ['route']),
            step('Memadamkan api pertama', 'Datangi penanda api di pulau kanan. Gunakan for untuk 2 kali semprot().', map.fires[1].action, null, ['water', 'fire']),
            step('Memeriksa bekantan pertama', 'Di penanda habitat, periksa api_padam. Jika padam, selamatkan_hewan(); jika belum, mundur(1).', map.fires[1].action, 'rescue', ['fire', 'animal']),
            step('Mengantar bekantan pertama', 'Bekantan mengikuti kamu. Bawa kembali ke penanda POS di pondok tengah-kiri.', map.post, null, ['animal']),
        ],
        example: 'if api_padam:\n    selamatkan_hewan()\nelse:\n    mundur(1)',
        lesson: 'if memilih tindakan ketika kondisi True. else memilih alternatif ketika False. Indentasi menandai isi blok. Kondisi api_padam berasal dari game. maju bergerak ke atas peta, mundur ke bawah; atas/bawah juga dapat dipakai.',
        effect: 'Setelah api padam, bekantan mengikuti pemain. Hitungan selamat bertambah ketika tiba di pos.',
        hints: ['Perhatikan penanda merah dan tujuan submisi. Kondisi pada HUD berasal dari dunia game.', 'Bandingkan keadaan aman dan berbahaya. Gunakan if serta else agar keduanya tertangani.', 'Susun if kondisi: lalu tindakan berindentasi; sejajarkan else: dengan if. Gunakan kamus untuk memilih tindakan.'],
    },
    2: {
        title: 'Challenge 2 - Krisis Air dan Evakuasi Kedua', texture: 'fireC3', requiredWater: 3,
        description: 'Bandingkan persediaan air dan periksa keselamatan satwa dengan if bersarang.',
        steps: [
            step('Menuju menara pengamatan', 'Ikuti jalan ke menara di pulau tengah-bawah. Cari bekantan kedua di pulau bawah.', map.tower),
            step('Memeriksa kecukupan air', 'Datangi api kedua. Jika isi_air >= kebutuhan_air, ulangi semprot() sesuai kebutuhan; jika kurang, mundur(1) ke petak aman. Uji juga jumlah yang tepat sama.', map.fires[2].action, 'water', ['water', 'fire']),
            step('Mengisi ulang tangki', 'Kembali ke pompa persimpangan tengah dan isi tangki menjadi 5 unit.', map.evaluationPump.action, null, ['water']),
            step('Memadamkan api kedua', 'Kembali ke api kedua. Jalankan percabangan pemeriksaan air dengan perulangan. Api membutuhkan 3 semprotan.', map.fires[2].action, 'water', ['water', 'fire']),
            step('Memeriksa satwa kedua', 'Jika hewan_terjebak, periksa api_padam sebelum selamatkan_hewan(). Jika api aktif, mundur(1). Jika tidak terjebak, lanjut_patroli().', map.fires[2].action, 'nested', ['fire', 'animal']),
            step('Mengantar bekantan kedua', 'Antar bekantan kedua ke penanda POS. Dua bekantan harus tercatat selamat sebelum operasi utara.', map.post, null, ['animal']),
        ],
        example: 'if isi_air >= kebutuhan_air:\n    for i in range(kebutuhan_air):\n        semprot()\nelse:\n    mundur(1)',
        lesson: '>= berarti lebih besar atau sama dengan. Air yang tepat sama dengan kebutuhan juga cukup. if dapat berada di dalam if lain: periksa hewan terlebih dahulu, lalu keadaan api. Nilai hewan_terjebak, api_padam, dan kebutuhan_air disediakan game.',
        effect: 'Air kurang membuat pemain mundur. Air cukup dapat memadamkan api; penyelamatan menunggu kondisi aman.',
        hints: ['Periksa isi_air dan kebutuhan_air sebelum memutuskan tindakan.', 'Air yang sama banyak dengan kebutuhan harus diterima. Pisahkan pemeriksaan hewan dari pemeriksaan api.', 'Gunakan if isi_air >= kebutuhan_air: dengan for di dalamnya. Untuk satwa, tempatkan if api_padam: di dalam if hewan_terjebak:.'],
    },
    3: {
        title: 'Challenge 3 - Habitat Terisolasi', requiredWater: 4,
        description: 'Periksa jalur utara dan kondisi satwa, kemudian siapkan operasi terakhir.',
        steps: [
            step('Menuju pengamatan utara', 'Capai persimpangan jembatan tengah untuk mengamati jalur utara.', map.northWatch, null, ['route']),
            step('Memeriksa jembatan', 'Jalur utara sedang berasap. Periksa jalur_aman: maju(3) jika aman, kanan(2) jika berbahaya. Karakter berhenti sebelum memasuki bahaya.', map.northWatch, 'route', ['route']),
            step('Mencapai jalur alternatif', 'Capai penanda alternatif di kanan persimpangan. Setelah pemeriksaan, akses utara dapat dilalui.', map.alternative, null, ['route']),
            step('Memeriksa bekantan ketiga', 'Datangi habitat di pulau kiri atas. Jika terjebak, periksa api lalu jalur: selamatkan jika aman; kiri(2) jika jalur tidak aman; mundur(1) jika api aktif. Jika tidak terjebak, lanjut patroli.', map.fires[4].action, 'habitat', ['fire', 'animal', 'route']),
            step('Menyiapkan air operasi akhir', 'Bekantan ketiga belum dievakuasi. Kembali ke pompa dan isi 5 unit untuk api terakhir yang membutuhkan 4 semprotan.', map.evaluationPump.action, null, ['water']),
            step('Mencapai checkpoint evaluasi', 'Kembali ke penanda aman di sebelah habitat pulau kiri atas. Bawa tangki penuh untuk evaluasi.', map.evaluationStart, null, ['water']),
        ],
        example: 'if hewan_terjebak:\n    if api_padam:\n        if jalur_aman:\n            selamatkan_hewan()\n        else:\n            kiri(2)\n    else:\n        mundur(1)\nelse:\n    lanjut_patroli()',
        lesson: 'Percabangan bersarang memeriksa syarat berurutan. Hewan terjebak belum tentu aman ditolong. Periksa api dan akses terlebih dahulu. jalur_aman hanya menggambarkan jalur yang sedang diperiksa.',
        effect: 'Pemeriksaan menghentikan penyelamatan berbahaya. Bekantan ketiga diselamatkan pada evaluasi.',
        hints: ['Mulai dari kondisi hewan, lalu periksa bahaya api dan akses.', 'Ada empat hasil: patroli, mundur, jalur alternatif, atau penyelamatan.', 'Gunakan tiga tingkat if: hewan_terjebak, api_padam, lalu jalur_aman. Sejajarkan setiap else dengan if pasangannya.'],
    },
    4: {
        title: 'Evaluasi - Operasi Penyelamatan Terakhir', texture: 'fireEval', requiredWater: 4,
        description: 'Gunakan semua konsep untuk memadamkan api terakhir dan mengantar bekantan ke pos.',
        steps: [
            step('Menuju habitat terakhir', 'Dekati penanda habitat di pulau kiri atas dari checkpoint aman.', map.fires[4].action, null, ['water', 'fire', 'animal', 'route']),
            step('Operasi penyelamatan terakhir', 'Susun program yang menangani jalur berbahaya, satwa bebas, api padam, serta air kurang dan cukup. Padamkan api dengan perulangan dan periksa kembali sebelum menolong.', map.fires[4].action, 'evaluation', ['water', 'fire', 'animal', 'route']),
            step('Menyerahkan bekantan ketiga', 'Antar bekantan yang mengikuti kamu ke pos penyelamatan tengah-kiri.', map.post, null, ['animal']),
            step('Mencapai gerbang akhir', 'Ketiga api padam dan ketiga bekantan di pos. Capai FINISH di ujung jembatan kanan, dekat pulau timur.', map.finish),
        ],
        example: '', lesson: '', effect: '', hints: [],
    },
};
for (const definition of Object.values(challenges)) {
    definition.targets = definition.steps.map((mission, index) => ({ key: `step-${index}`, label: mission.label }));
}
export default challenges;
