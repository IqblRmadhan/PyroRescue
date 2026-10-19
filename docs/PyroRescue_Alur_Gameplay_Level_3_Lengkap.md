# PYRORESCUE — ALUR GAMEPLAY LEVEL 3 LENGKAP

**Tema:** Operasi Penyelamatan Satwa Kalimantan  
**Fokus pembelajaran:** Percabangan `if`, `else`, operator perbandingan, dan percabangan bersarang (*nested if*)  
**Materi pendukung:** Variabel (Level 1), perulangan `for` (Level 2), gerakan karakter, pengisian air, dan pemadaman api  
**Struktur:** Briefing → Tutorial Singkat → Challenge 1 → Challenge 2 → Challenge 3 → Evaluasi → Hasil Level

> **Catatan dokumen:** Ini merupakan rancangan alur gameplay Level 3 yang mengikuti peta pulau-pulau berhutan dan jembatan kayu milik PyroRescue. Tidak termasuk desain gambar, skrip dialog panjang, atau story cutscene. Jumlah petak dalam contoh perintah gerak harus disesuaikan dengan koordinat dan collision pada map yang diimplementasikan.

---

## 1. Konsep dan tujuan Level 3

Level 3 menjadi puncak pembelajaran PyroRescue. Pemain menjalankan misi penyelamatan bekantan di kawasan hutan yang terpisah menjadi beberapa pulau dan dihubungkan oleh jembatan. Untuk berhasil, pemain harus menjelajahi map, memilih jalur aman, mengisi air di pompa, memadamkan api, memeriksa kondisi satwa, dan mengantar satwa ke pos evakuasi.

Berbeda dari level sebelumnya, setiap tindakan penting harus diputuskan menggunakan kondisi dalam Python. Pemain tidak hanya menulis kode yang valid secara sintaks, tetapi juga harus membuat logika yang **benar untuk beberapa kemungkinan keadaan**.

### Tujuan pembelajaran

Setelah menyelesaikan Level 3, pemain diharapkan mampu:

1. Menjelaskan perbedaan cabang `if` dan `else`.
2. Memahami nilai kondisi `True` dan `False` dari lingkungan permainan.
3. Menggunakan operator perbandingan seperti `>=` untuk mengambil keputusan.
4. Menyusun percabangan bersarang untuk keputusan yang memerlukan lebih dari satu pemeriksaan.
5. Menggabungkan variabel, `for`, dan `if/else` dalam satu misi penyelamatan.
6. Memperbaiki kesalahan logika berdasarkan umpan balik hasil pengujian.

### Target misi keseluruhan

| Indikator | Target |
|---|---:|
| Titik api yang dipadamkan | 3 |
| Bekantan yang diselamatkan | 3 |
| Challenge utama | 3 |
| Evaluasi akhir | 1 |
| Kapasitas contoh tangki | 5 unit air |

Satu pemanggilan `semprot()` menggunakan satu unit air dan memberikan satu unit efek pemadaman pada api yang menjadi target.

---

## 2. Pembagian area sesuai map Level 3

| Area pada peta | Fungsi gameplay |
|---|---|
| Hutan besar sebelah kiri | Titik awal pemain |
| Pulau dengan pondok di bagian tengah-kiri | Pos penyelamatan, checkpoint, serta area pompa air (aset gameplay tambahan) |
| Persimpangan jembatan bagian tengah | Area pengambilan keputusan tentang jalur aman |
| Pulau berhutan sebelah kanan | Titik api pertama dan bekantan pertama |
| Pulau bawah dekat menara pengamatan | Titik api kedua dan bekantan kedua |
| Kawasan hutan bagian kanan atas | Habitat bekantan ketiga dan lokasi evaluasi terakhir |
| Pondok tengah-kiri | Lokasi penyerahan bekantan setelah dievakuasi |

Objek tambahan yang dapat ditempatkan di atas map tanpa mengubah susunan dasarnya adalah pompa air, efek api dan asap, titik tujuan merah berkedip, indikator pemeriksaan jalur, serta penanda checkpoint.

---

## 3. Alur umum Level 3

```text
MASUK LEVEL 3
    ↓
BRIEFING DI HUTAN SEBELAH KIRI
    ↓
TUTORIAL IF / ELSE
    ↓
CHALLENGE 1 — PATROLI DAN PENYELAMATAN PERTAMA
    ↓
CHECKPOINT 1
    ↓
CHALLENGE 2 — KRISIS AIR DAN EVAKUASI KEDUA
    ↓
CHECKPOINT 2
    ↓
CHALLENGE 3 — HABITAT TERISOLASI
    ↓
CHECKPOINT 3
    ↓
EVALUASI — OPERASI PENYELAMATAN TERAKHIR
    ↓
SELURUH SATWA AMAN
    ↓
GERBANG PENYELESAIAN TERBUKA
    ↓
HASIL LEVEL 3 / PYRORESCUE SELESAI
```

---

## 4. Briefing dan tutorial awal

### Lokasi awal

Pemain muncul di bagian hutan besar sebelah kiri map, dekat jalur jembatan menuju pulau-pulau lain.

### Instruksi komandan

> Beberapa bekantan masih terjebak di kawasan hutan. Sebagian jalur tertutup asap dan api mulai menyebar. Kita harus memadamkan titik berbahaya dan membawa satwa menuju tempat aman. Jangan mengambil tindakan sebelum memeriksa kondisinya.

### Tutorial konsep

Bentuk dasar percabangan:

```python
if kondisi:
    tindakan_jika_benar()
else:
    tindakan_jika_salah()
```

Penjelasan yang ditampilkan kepada pemain:

- `if` memeriksa apakah suatu kondisi bernilai benar (`True`).
- `else` menjalankan tindakan alternatif ketika kondisi pada `if` salah (`False`).
- Nilai kondisi ditentukan oleh keadaan permainan, misalnya keamanan jalur, jumlah air, atau kondisi api.
- Baris yang menjorok ke dalam (*indentasi*) menunjukkan perintah milik cabang tertentu.

Setelah contoh singkat, pemain masuk Challenge 1.

---

# 5. CHALLENGE 1 — PATROLI DAN PENYELAMATAN PERTAMA

**Lokasi:** Hutan kiri → pondok tengah-kiri → persimpangan jembatan tengah → pulau kanan → kembali ke pos.  
**Konsep:** `if/else` dasar, dengan pengulangan variabel dan `for`.  
**Jumlah submisi:** 6.

## Misi 1/6 — Menuju pos penyelamatan

**Tujuan:** Mencapai pondok tengah-kiri.

- Pemain berangkat dari hutan kiri dan melewati jembatan panjang.
- Marker merah berkedip menandai titik tujuan.
- Pemain menggunakan perintah gerak PyroPad (`maju`, `mundur`, `kanan`, `kiri`).
- Contoh jarak pergerakan di PyroPad harus disesuaikan dengan jumlah petak pada map.

**Syarat selesai:** Karakter masuk ke area marker pos.

## Misi 2/6 — Mengambil air di pompa

**Tujuan:** Mengisi tangki dengan 4 unit air.

Instruksi di PyroPad:

> Isi tangki dengan 4 unit air sebelum berangkat.

Kode contoh:

```python
isi_air = 4
```

**Respons game:** Pompa aktif, animasi air dimainkan, HUD berubah dari `0/5` menjadi `4/5`.

**Aturan:** Perintah pengisian hanya dapat dilakukan saat karakter berada pada area interaksi pompa.

## Misi 3/6 — Memilih jalur melalui jembatan

**Tujuan:** Memilih rute aman menuju titik kebakaran pertama.

**State dari game:** `jalur_aman` bernilai `True` atau `False`, tergantung status jalur yang sedang diperiksa.

Instruksi:

> Jika jalur utama aman, maju 3 petak. Jika jalur utama berasap, gunakan jalur kanan.

Kode contoh:

```python
if jalur_aman:
    maju(3)
else:
    kanan(2)
```

Game memeriksa kedua kasus:

| Kondisi | Tindakan benar |
|---|---|
| `jalur_aman = True` | `maju(3)` |
| `jalur_aman = False` | `kanan(2)` |

**Contoh kesalahan:**

```python
if jalur_aman:
    maju(3)
else:
    maju(3)
```

**Feedback:**

> Kode dapat dijalankan, tetapi pada kondisi jalur berasap kamu tetap menuju jalur utama. Periksa tindakan pada bagian `else`.

**Syarat selesai:** Kode menghasilkan tindakan benar pada kedua kondisi dan karakter mencapai checkpoint jalur aman.

## Misi 4/6 — Memadamkan api pertama

**Tujuan:** Memadamkan pohon yang terbakar dengan dua kali semprotan.

```python
for i in range(2):
    semprot()
```

**Respons game:**

```text
Air awal: 4
Semprotan 1 → Air 3, api mengecil
Semprotan 2 → Air 2, api padam
api_padam = True
```

**Syarat selesai:** Api pada titik pertama padam dan HUD memperbarui persediaan air.

## Misi 5/6 — Memeriksa dan menyelamatkan bekantan pertama

**Tujuan:** Menyelamatkan satwa hanya jika area sudah aman dari api.

Instruksi:

> Jika api sudah padam, selamatkan bekantan. Jika belum padam, mundur dari titik bahaya.

```python
if api_padam:
    selamatkan_hewan()
else:
    mundur(1)
```

**Respons game:**

- Jika `api_padam = True` dan karakter berada dalam jangkauan satwa, bekantan turun dari pohon dan mulai mengikuti pemain.
- Jika `api_padam = False`, karakter mundur dan satwa tetap di lokasi.
- Jika pemain mencoba menyelamatkan hewan ketika api masih menyala, game menampilkan kesalahan logika.

## Misi 6/6 — Mengantar bekantan ke pos

**Tujuan:** Membawa bekantan pertama ke pos penyelamatan tengah-kiri.

- Pemain kembali melalui jalur jembatan yang sudah aman.
- Bekantan mengikuti pemain menggunakan animasi berjalan atau melompat.
- Saat sampai di area pos, sistem mencatat penyelamatan pertama.

**Hasil Challenge 1:**

```text
Titik api padam      : 1/3
Bekantan diselamatkan: 1/3
Sisa air             : 2/5
Checkpoint 1         : tersimpan
```

---

# 6. CHALLENGE 2 — KRISIS AIR DAN EVAKUASI KEDUA

**Lokasi:** Pos tengah-kiri → menara pengamatan tengah-bawah → pulau bawah → kembali ke pos.  
**Konsep:** `if/else` dengan operator perbandingan `>=` serta pengenalan percabangan bersarang.  
**Jumlah submisi:** 6.

## Misi 1/6 — Menuju menara pengamatan

Pemain menuju menara di bagian tengah-bawah map. Di sana, pemain menemukan asap dari titik api kedua pada pulau bawah.

**Syarat selesai:** Karakter mencapai marker menara pengamatan.

## Misi 2/6 — Memeriksa kecukupan air

Informasi kondisi:

```text
isi_air      = 2
kebutuhan_air = 3
```

Instruksi:

> Jika air cukup, lakukan penyemprotan. Jika air kurang, mundur menuju arah pompa.

```python
if isi_air >= kebutuhan_air:
    for i in range(kebutuhan_air):
        semprot()
else:
    mundur(2)
```

Pada kondisi awal, `2 >= 3` adalah `False`, sehingga karakter harus mundur.

**Contoh salah secara logika:**

```python
if isi_air <= kebutuhan_air:
    for i in range(kebutuhan_air):
        semprot()
else:
    mundur(2)
```

**Feedback:**

> Pemeriksaan air belum tepat. Kamu mencoba melakukan penyemprotan meskipun persediaan tidak mencukupi. Periksa kembali operator perbandingan.

**Pengujian wajib:**

| Persediaan air | Kebutuhan | Cabang yang benar |
|---:|---:|---|
| 2 | 3 | `else` (mundur) |
| 3 | 3 | `if` (semprot) |
| 5 | 3 | `if` (semprot) |

Kasus `3 >= 3` penting untuk membedakan `>` dari `>=`.

## Misi 3/6 — Kembali ke pompa dan mengisi ulang

Pemain berjalan menuju pompa terdekat yang bisa diakses. Di area pompa, pemain menulis:

```python
isi_air = 5
```

HUD diperbarui menjadi `5/5` dan checkpoint submisi disimpan.

## Misi 4/6 — Memadamkan api kedua

Pemain kembali ke titik api dan menjalankan kode pemeriksaan air yang telah dibuat.

```text
isi_air       = 5
kebutuhan_air = 3
5 >= 3        = True
```

Saat cabang `if` dijalankan:

```text
Semprotan 1 → Air 4
Semprotan 2 → Air 3
Semprotan 3 → Air 2
Api kedua padam
api_padam = True
```

## Misi 5/6 — Memeriksa satwa kedua

Di area ini terdapat bekantan terancam dan satwa lain yang berada pada tempat aman. Game menyediakan kondisi `hewan_terjebak` dan `api_padam`.

Instruksi:

> Jika hewan terjebak dan api sudah padam, selamatkan. Jika api belum padam, mundur. Jika hewan tidak terjebak, lanjutkan patroli.

```python
if hewan_terjebak:
    if api_padam:
        selamatkan_hewan()
    else:
        mundur(1)
else:
    lanjut_patroli()
```

**Kondisi yang harus lulus:**

| `hewan_terjebak` | `api_padam` | Tindakan |
|---|---|---|
| `True` | `True` | Selamatkan hewan |
| `True` | `False` | Mundur |
| `False` | Apa pun | Lanjut patroli |

**Contoh kesalahan:**

```python
if hewan_terjebak:
    selamatkan_hewan()
else:
    lanjut_patroli()
```

**Feedback:**

> Kamu sudah memeriksa keadaan satwa, tetapi belum memeriksa api. Hewan yang terjebak belum boleh diselamatkan ketika api masih aktif.

## Misi 6/6 — Mengantar bekantan kedua ke pos

Bekantan yang berhasil dievakuasi mengikuti pemain kembali ke pondok tengah-kiri. Saat masuk area pos, progress diperbarui.

**Hasil Challenge 2:**

```text
Titik api padam      : 2/3
Bekantan diselamatkan: 2/3
Sisa air             : 2/5
Checkpoint 2         : tersimpan
```

---

# 7. CHALLENGE 3 — HABITAT TERISOLASI

**Lokasi:** Persimpangan tengah → jembatan utara → kawasan hutan kanan atas.  
**Konsep:** Percabangan bersarang dengan pemeriksaan keselamatan hewan, api, dan akses.  
**Jumlah submisi:** 6.

## Misi 1/6 — Menuju pengamatan utara

Pemain berangkat dari pos menuju jaringan jembatan di kawasan atas. Marker menunjukkan titik pengamatan yang dapat digunakan untuk melihat kawasan habitat terakhir.

## Misi 2/6 — Memeriksa keamanan jembatan

Pemain harus menentukan apakah jembatan yang akan dilewati aman.

```python
if jalur_aman:
    maju(3)
else:
    kanan(2)
```

**Catatan state:** `jalur_aman` menggambarkan jalur yang sedang diperiksa, bukan status seluruh map. Ketika pemain mencapai jalur berikutnya, game dapat memberikan kondisi baru.

## Misi 3/6 — Mengambil jalur alternatif

Jika jalur utama dinyatakan berbahaya, karakter harus berbelok dan mencapai marker jalur alternatif. Kesalahan pilihan tidak langsung membuat pemain *game over*; karakter berhenti sebelum memasuki wilayah berbahaya.

## Misi 4/6 — Memeriksa kondisi bekantan ketiga

Di habitat kanan atas, bekantan ketiga terlihat terjebak dekat api dan akses jalur sebagian terhalang.

Contoh keadaan:

```text
hewan_terjebak = True
api_padam      = False
jalur_aman     = False
```

Instruksi:

> Jika hewan terjebak, periksa apakah api sudah padam. Jika api padam, periksa apakah jalur aman sebelum menolong. Jika tidak aman, gunakan jalur alternatif. Jika api masih menyala, mundur.

```python
if hewan_terjebak:
    if api_padam:
        if jalur_aman:
            selamatkan_hewan()
        else:
            kiri(2)
    else:
        mundur(1)
else:
    lanjut_patroli()
```

**Contoh kesalahan logika:**

```python
if hewan_terjebak:
    selamatkan_hewan()
```

**Feedback:**

> Bekantan memang terjebak, tetapi api masih menyala. Pemeriksaan kondisi hewan saja belum cukup. Periksa api sebelum memulai penyelamatan.

**Kondisi yang harus dipahami:**

1. Hewan tidak terjebak → lanjut patroli.
2. Hewan terjebak, api menyala → mundur.
3. Hewan terjebak, api padam, jalur tidak aman → pilih jalur alternatif.
4. Hewan terjebak, api padam, jalur aman → selamatkan.

## Misi 5/6 — Menyiapkan air untuk operasi akhir

Pemain memperoleh informasi bahwa api terakhir membutuhkan 4 kali semprotan, sedangkan sisa air dari Challenge 2 tidak cukup.

Pemain kembali ke pompa atau sumber pengisian yang dapat dijangkau untuk mengisi tangki:

```python
isi_air = 5
```

Setelah berhasil, pemain kembali menuju checkpoint aman di dekat habitat terakhir.

## Misi 6/6 — Mencapai checkpoint evaluasi

Marker checkpoint berada di sisi aman sebelum titik api terakhir. Setelah marker dicapai, Challenge 3 selesai.

**Catatan penting:** Bekantan ketiga **belum dievakuasi pada Challenge 3**. Penyelamatannya menjadi sasaran Evaluasi Akhir.

**Hasil Challenge 3:**

```text
Titik api padam      : 2/3
Bekantan diselamatkan: 2/3
Isi air              : 5/5
Checkpoint 3         : tersimpan
Evaluasi             : terbuka
```

---

# 8. EVALUASI LEVEL 3 — OPERASI PENYELAMATAN TERAKHIR

**Lokasi:** Habitat kanan atas → jalur jembatan → pos penyelamatan tengah-kiri.  
**Konsep:** Variabel + `for` + operator perbandingan + `if/else` bersarang.

## 8.1 Kondisi awal evaluasi

```text
Lokasi         : Habitat kanan atas
isi_air        : 5
kebutuhan_air  : 4
api_padam      : False
hewan_terjebak : True
jalur_aman     : sesuai kondisi map
Bekantan       : terjebak
```

Instruksi komandan:

> Ini operasi terakhir. Api masih aktif di sekitar habitat. Gunakan semua yang telah kamu pelajari untuk mengambil keputusan dengan benar dan selamatkan bekantan tersebut.

## 8.2 Rangkaian misi evaluasi

1. Memilih jalur aman menuju titik penyelamatan.
2. Memeriksa apakah hewan benar-benar terjebak.
3. Memeriksa apakah api masih menyala.
4. Jika api masih menyala, memeriksa apakah air mencukupi.
5. Melakukan pemadaman dengan perulangan `for` bila kondisi memungkinkan.
6. Memeriksa kembali status api setelah penyemprotan.
7. Menyelamatkan bekantan hanya apabila kondisi aman.
8. Mengantar bekantan ketiga ke pos penyelamatan.

## 8.3 Contoh solusi referensi pengembang

> **Jangan langsung ditampilkan kepada pemain.** Pemain seharusnya menyusun logika sendiri berdasarkan objective, command catalog, dan hint bertahap.

```python
if jalur_aman:
    if hewan_terjebak:
        if api_padam:
            selamatkan_hewan()
        else:
            if isi_air >= kebutuhan_air:
                for i in range(kebutuhan_air):
                    semprot()

                if api_padam:
                    selamatkan_hewan()
                else:
                    mundur(1)
            else:
                mundur(1)
    else:
        lanjut_patroli()
else:
    kanan(2)
```

Kode tersebut menggambarkan penggunaan `if/else` bersarang, variabel, operator `>=`, dan `for`. Saat `semprot()` dijalankan, sistem langsung memperbarui jumlah air, kekuatan api, dan nilai `api_padam` agar pemeriksaan sesudah perulangan menggunakan kondisi terbaru.

## 8.4 Pengujian evaluasi

Game tidak langsung meluluskan pemain ketika kode hanya berhasil pada satu situasi. Sistem melakukan simulasi pada beberapa kondisi berikut:

| Kasus | Kondisi | Hasil benar |
|---|---|---|
| A | Jalur tidak aman | Ambil jalur alternatif |
| B | Tidak ada hewan terjebak | Lanjut patroli |
| C | Api menyala, air kurang | Mundur menuju posisi aman / pompa |
| D | Api menyala, air cukup | Semprot hingga padam, lalu selamatkan |
| E | Api sudah padam, hewan terjebak | Selamatkan hewan |

**Contoh:** Kode yang berhasil pada Kasus D tetapi gagal pada Kasus C belum dinyatakan lulus.

## 8.5 Jika pemain gagal

Feedback diberikan berdasarkan jenis masalah:

- **Kesalahan sintaks:** jelaskan bagian kode yang belum valid (misalnya titik dua atau indentasi).
- **Kesalahan perbandingan:** tunjukkan nilai yang dibandingkan serta cabang yang keliru.
- **Kesalahan keputusan:** tampilkan tindakan yang dilakukan dan mengapa tindakan itu tidak aman.
- **Kesalahan sumber daya:** informasikan bahwa semprotan tidak dapat dijalankan karena air kurang.
- **Kesalahan kondisi satwa:** jelaskan mengapa penyelamatan belum diperbolehkan.

Contoh:

```text
Evaluasi belum selesai.
Kasus C gagal: air tidak cukup, tetapi kode tetap melakukan penyemprotan.
Periksa kondisi pada if dan operator perbandingannya.
```

Setelah seluruh kasus simulasi benar, kode pemain dapat dieksekusi pada kondisi nyata di map.

## 8.6 Menyerahkan bekantan ketiga

Setelah api terakhir padam dan bekantan ketiga berhasil diselamatkan:

1. Bekantan mengikuti pemain.
2. Pemain kembali menyeberangi jembatan menuju pos tengah-kiri.
3. Saat memasuki marker evakuasi, hewan diserahkan ke pos.
4. Progress diperbarui menjadi tiga hewan diselamatkan dan tiga api dipadamkan.
5. Gerbang penyelesaian Level 3 terbuka.

---

## 9. Mekanik gameplay dan respons visual

| Aksi atau peristiwa | Respons visual / sistem |
|---|---|
| Mendekati pompa | Marker interaksi menyala |
| Mengisi air | Pompa aktif dan HUD air bertambah |
| Memilih jalur salah | Karakter berhenti sebelum area berbahaya |
| Cabang `if` dijalankan | Baris `if` pada PyroPad ditandai |
| Cabang `else` dijalankan | Baris `else` pada PyroPad ditandai |
| Menyemprot | Air keluar, api mengecil, isi air berkurang |
| Api padam | Api menghilang, asap menipis, `api_padam = True` |
| Menolong bekantan | Bekantan turun dari pohon dan mengikuti pemain |
| Tiba di pos | Hitungan hewan selamat bertambah |
| Submisi selesai | Marker berikutnya muncul dan checkpoint diperbarui |
| Semua misi selesai | Gerbang akhir terbuka dan hasil Level 3 muncul |

---

## 10. Ketentuan teknis penting untuk PyroPad

### 10.1 State dunia game

Nilai-nilai berikut berasal dari **kondisi permainan**, bukan ditentukan sewenang-wenang oleh pemain:

```python
api_padam
jalur_aman
hewan_terjebak
kebutuhan_air
```

Sebagai contoh, pemain tidak boleh menulis `api_padam = True` untuk langsung menganggap api telah padam. Nilai `api_padam` hanya menjadi `True` setelah kekuatan api mencapai nol akibat semprotan yang sah.

### 10.2 Pembatasan pengisian air

- `isi_air` tidak boleh melebihi kapasitas tangki 5 unit.
- Penambahan `isi_air` melalui kode hanya berlaku ketika pemain berada di pompa.
- Saat air kurang, tindakan `semprot()` harus ditolak atau dihentikan sesuai rule game.

### 10.3 Definisi command yang dipakai

| Command | Fungsi |
|---|---|
| `maju(n)` | Bergerak maju sebanyak `n` petak |
| `mundur(n)` | Bergerak mundur sebanyak `n` petak |
| `kanan(n)` | Bergerak ke kanan sebanyak `n` petak |
| `kiri(n)` | Bergerak ke kiri sebanyak `n` petak |
| `semprot()` | Menggunakan satu unit air dan memberikan satu kali efek pemadaman |
| `selamatkan_hewan()` | Melakukan penyelamatan jika karakter berada dekat hewan dan kondisi aman |
| `lanjut_patroli()` | Menandai bahwa hewan tidak memerlukan evakuasi dan melanjutkan misi |

Perintah `selamatkan_hewan()` dan `lanjut_patroli()` merupakan command khusus PyroRescue yang harus disediakan oleh validator dan game engine, bukan fungsi bawaan Python.

### 10.4 Validasi berbasis perilaku

Validator sebaiknya menilai **hasil eksekusi kode dalam berbagai kondisi**, bukan membandingkan teks kode dengan satu jawaban persis. Variasi indentasi yang valid, nama variabel loop yang berbeda, atau struktur kode setara dapat diterima selama memenuhi tujuan misi dan tetap menggunakan konsep yang diuji.

---

## 11. Checkpoint, Reset, Hint, dan progres

### 11.1 Checkpoint

Checkpoint diberikan setelah submisi atau challenge tertentu agar pemain tidak harus mengulang seluruh level saat gagal.

```text
Challenge 1 selesai → Checkpoint 1
Challenge 2 selesai → Checkpoint 2
Challenge 3 selesai → Checkpoint 3
Evaluasi selesai   → Level selesai
```

### 11.2 Reset

Ketika pemain menekan **Reset**, sistem mengembalikan:

- posisi karakter ke checkpoint submisi aktif;
- status api ke keadaan awal submisi;
- jumlah air ke keadaan awal submisi;
- status satwa ke keadaan awal submisi;
- objective serta animasi ke kondisi awal.

Hewan yang sudah diselamatkan dan tercatat pada checkpoint challenge sebelumnya tidak boleh hilang.

### 11.3 Hint bertahap

Contoh untuk pemeriksaan air:

**Hint 1:** “Bandingkan air yang tersedia dengan air yang dibutuhkan.”  
**Hint 2:** “Gunakan percabangan `if` dan `else` serta operator perbandingan.”  
**Hint 3:**

```python
if isi_air >= kebutuhan_air:
    ...
else:
    ...
```

Jangan menampilkan jawaban lengkap pada hint pertama.

### 11.4 Data progress

```text
level_id
challenge_id
submisi_aktif
submisi_selesai
jumlah_api_padam
jumlah_hewan_diselamatkan
checkpoint_aktif
jumlah_percobaan
hint_digunakan
evaluasi_lulus
level_selesai
```

---

## 12. Kondisi penyelesaian Level 3

Level 3 dinyatakan selesai apabila:

```text
api_padam_total          = 3/3
bekantan_diselamatkan    = 3/3
evaluasi_lulus           = True
bekantan_terakhir_di_pos = True
```

Setelah seluruh syarat terpenuhi:

1. Gerbang penyelesaian terbuka.
2. Pemain menuju gerbang dengan perintah gerak.
3. Animasi akhir level dimainkan.
4. Layar hasil Level 3 ditampilkan.
5. Progres permainan diperbarui menjadi selesai.

Contoh layar hasil:

```text
====================================
        LEVEL 3 SELESAI!
====================================
Titik api dipadamkan   : 3/3
Bekantan diselamatkan : 3/3
Challenge selesai     : 3/3
Evaluasi akhir        : LULUS

Materi yang dikuasai:
✓ Variabel
✓ Perulangan for
✓ Percabangan if/else
✓ Operator perbandingan
✓ Percabangan bersarang

      PYRORESCUE SELESAI
====================================
```

---

## 13. Ringkasan alur Level 3

```text
LEVEL 3
│
├── BRIEFING & TUTORIAL IF/ELSE
│
├── CHALLENGE 1 — PENYELAMATAN PERTAMA
│   ├── Menuju pondok
│   ├── Mengisi 4 unit air
│   ├── Memilih jembatan aman
│   ├── Memadamkan api pertama (2 semprotan)
│   ├── Memeriksa kondisi bekantan
│   └── Mengantar bekantan pertama ke pos
│
├── CHALLENGE 2 — KRISIS AIR
│   ├── Menuju menara pengamatan
│   ├── Menemukan api kedua
│   ├── Memeriksa air dengan if/else dan >=
│   ├── Kembali ke pompa
│   ├── Memadamkan api kedua (3 semprotan)
│   ├── Menyelamatkan bekantan kedua dengan if bersarang
│   └── Mengantar bekantan kedua ke pos
│
├── CHALLENGE 3 — HABITAT TERISOLASI
│   ├── Menuju jembatan utara
│   ├── Memeriksa keamanan jembatan
│   ├── Menentukan jalur alternatif
│   ├── Menemukan bekantan ketiga
│   ├── Memeriksa kondisi satwa, api, dan jalur
│   ├── Mengisi ulang air untuk operasi akhir
│   └── Mencapai checkpoint evaluasi
│
├── EVALUASI — PENYELAMATAN TERAKHIR
│   ├── Memilih jalur aman
│   ├── Memeriksa satwa
│   ├── Memeriksa kecukupan air
│   ├── Memadamkan api terakhir (4 semprotan)
│   ├── Memeriksa api kembali
│   ├── Menyelamatkan bekantan ketiga
│   └── Mengantarkan bekantan ke pos
│
└── GERBANG AKHIR → HASIL LEVEL 3
```

**Inti pembelajaran:** Level 3 harus terasa seperti operasi penyelamatan yang memiliki banyak misi nyata. Pemain dapat salah memilih jalur, keliru membandingkan air, mencoba menolong ketika api masih menyala, atau lupa menangani salah satu kondisi. Setiap kesalahan menjadi kesempatan untuk memeriksa dan memperbaiki logika `if/else` hingga benar pada semua kemungkinan keadaan.
