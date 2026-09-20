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
        const variablePattern = /jumlah_air\s*=\s*(\d+)/;
        const sprayPattern = /semprot\s*\(\s*jumlah_air\s*\)/;

        const variableMatch = code.match(variablePattern);

        if (!variableMatch) {
            return {
                syntaxValid: false,
                conceptValid: false,
                missionSuccess: false,
                message: 'Buat variabel jumlah_air terlebih dahulu.'
            };
        }

        const water = Number(variableMatch[1]);
        const usesVariable = sprayPattern.test(code);

        if (!usesVariable) {
            return {
                syntaxValid: true,
                conceptValid: false,
                missionSuccess: water >= requiredWater,
                message: 'Gunakan jumlah_air pada semprot().'
            };
        }

        return {
            syntaxValid: true,
            conceptValid: true,
            missionSuccess: water === requiredWater,
            message: water === requiredWater
                ? 'Jumlah air tepat.'
                : 'Jumlah air belum sesuai.',
            actions: {
                water,
                sprayCount: water
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

## Validator conditional

```js
validateConditional(code) {
    const hasIf = code.includes('if ukuran_api == "besar":');
    const hasElse = code.includes('else:');

    if (!hasIf || !hasElse) {
        return {
            syntaxValid: false,
            conceptValid: false,
            missionSuccess: false,
            message: 'Gunakan struktur if/else.'
        };
    }

    return {
        syntaxValid: true,
        conceptValid: true,
        missionSuccess: true,
        message: 'Percabangan berhasil digunakan.'
    };
}
```

## Keterbatasan

Regex hanya cocok untuk prototype.

Jika nanti perlu lebih fleksibel, validator bisa ditingkatkan ke parser atau AST. Jangan lakukan itu sebelum gameplay dasar selesai.
