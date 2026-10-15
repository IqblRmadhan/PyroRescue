# Validasi Kode Python Sederhana

## Tujuan

Versi awal PyroRescue tidak perlu menjadi interpreter Python penuh.

Cukup dukung syntax yang digunakan dalam tiga level.

```text
ambil kode
→ rapikan baris
→ cari pola yang didukung
→ ambil nilai
→ cek konsep
→ kirim aksi ke Phaser
```

## Jangan lakukan ini di Laravel

```php
exec();
shell_exec();
system();
```

Jangan mengeksekusi kode pemain bebas di server.

## Contoh `CodeValidator.js`

```js
export default class CodeValidator {
    validateVariable(code, requiredWater) {
        const variablePattern = /isi_air\s*=\s*(\d+)/;

        const variableMatch = code.match(variablePattern);

        if (!variableMatch) {
            return {
                syntaxValid: false,
                conceptValid: false,
                missionSuccess: false,
                message: 'Buat variabel isi_air terlebih dahulu.'
            };
        }

        const water = Number(variableMatch[1]);

        return {
            syntaxValid: true,
            conceptValid: true,
            missionSuccess: water === requiredWater,
            message: water === requiredWater
                ? 'Variabel isi_air sudah tepat.'
                : 'Nilai isi_air belum sesuai.',
            actions: {
                water
            }
        };
    }
}
```

## Validator loop

```js
validateLoop(code, requiredCount) {
    const loopPattern =
        /for\s+\w+\s+in\s+range\(\s*(\d+)\s*\)\s*:\s*\n\s+semprot\(\)/;

    const match = code.match(loopPattern);

    if (!match) {
        return {
            syntaxValid: false,
            conceptValid: false,
            missionSuccess: false,
            message: 'Gunakan for dan range().'
        };
    }

    const count = Number(match[1]);

    return {
        syntaxValid: true,
        conceptValid: true,
        missionSuccess: count === requiredCount,
        message: count === requiredCount
            ? 'Jumlah perulangan tepat.'
            : 'Periksa jumlah perulangannya.',
        actions: {
            sprayCount: count
        }
    };
}
```

## Validator conditional Level 3

`CodeValidator.validateConditional()` memakai parser terbatas dalam
`Level3Validator.js`, sesuai BAB III modul. Parser menerima gerakan, assignment
`isi_air` / `jumlah_semprot`, `for ... in range(...)` berisi `semprot()`, dan:

```python
if api_padam:
    status_bekantan = "selamat"
else:
    status_bekantan = "tunggu"
```

C2 menerima if tanpa else dengan status `aman`. C3 dan evaluasi membutuhkan dua
cabang dengan `selamat` dan `tunggu`. Header dan indentasi diperiksa pada seluruh
program, termasuk cabang yang tidak dijalankan. Assignment `api_padam`, fungsi
bebas, import, nested block, dan ekspresi di luar subset ditolak. Maksimal 120
baris dan 120 aksi per Run; ekspansi loop diperiksa sebelum alokasi aksi.

Parser mengembalikan data aksi `conditional` dengan dua alternatif status.
Scene memeriksa kondisi api pada urutan eksekusinya, setelah animasi semprotan
sebelumnya selesai. Keberhasilan misi ditentukan dari keadaan scene, bukan hanya
hasil parser. Evaluasi memerlukan loop variabel lalu percabangan dalam satu Run;
kurang dari empat semprotan tetap memperlihatkan hasil cabang False.

## Keterbatasan

Regex hanya cocok untuk prototype.

Jika nanti perlu lebih fleksibel, validator bisa ditingkatkan ke parser atau AST. Jangan lakukan itu sebelum gameplay dasar selesai.
