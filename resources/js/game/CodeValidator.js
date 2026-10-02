const reservedLoopNames = new Set((
    'False None True and as assert async await break class continue def del elif else except finally '
    + 'for from global if import in is lambda nonlocal not or pass raise return try while with yield '
    + 'range semprot jumlah_semprot isi_air'
).split(' '));

export default class CodeValidator {
    // Parser terbatas: gerakan, isi_air, jumlah_semprot, semprot(), dan satu tingkat for.
    // Kode pemain diterjemahkan menjadi data aksi, tidak pernah dieksekusi sebagai Python.
    validateLoop(code, requiredCount, challengeNumber = 1) {
        const result = { syntaxValid: false, conceptValid: false, missionSuccess: false, message: '', actions: null };
        const fail = (message) => ({ ...result, message });
        const lines = code.replace(/\r\n?/g, '\n').split('\n')
            .map((line) => line.split('#')[0].trimEnd())
            .filter((line) => line.trim() !== '');
        const commands = [];
        const directions = { atas: 'north', bawah: 'south', kanan: 'east', kiri: 'west' };
        let jumlahSemprot;
        let loopSprays = 0;
        let variableLoopSprays = 0;
        let sprayCount = 0;

        if (!lines.length) return fail('Tulis perintah gerak atau semprot() terlebih dahulu.');
        if (lines.length > 120) return fail('Gunakan maksimal 120 baris perintah dalam satu Run.');

        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index];
            if (/^\s/.test(line)) return fail('Indentasi hanya digunakan untuk semprot() di dalam for.');
            const movement = line.match(/^(atas|bawah|kanan|kiri)\s*\(\s*(0|[1-9]\d*)\s*\)$/);
            const assignment = line.match(/^jumlah_semprot\s*=\s*(0|[1-9]\d*)$/);
            const waterAssignment = line.match(/^isi_air\s*=\s*(0|[1-9]\d*)$/);
            const loop = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\s*\(\s*(jumlah_semprot|0|[1-9]\d*)\s*\)\s*:$/);

            if (movement) {
                const count = Number(movement[2]);
                if (!Number.isSafeInteger(count) || count < 1 || commands.length + count > 120) {
                    return fail('Jumlah langkah minimal 1, dengan maksimal 120 aksi dalam satu Run.');
                }
                commands.push(...Array.from({ length: count }, () => ({ type: 'move', direction: directions[movement[1]] })));
            } else if (assignment) {
                jumlahSemprot = Number(assignment[1]);
                if (!Number.isSafeInteger(jumlahSemprot) || jumlahSemprot > 120) {
                    return fail('jumlah_semprot harus berupa bilangan bulat dari 0 sampai 120.');
                }
            } else if (waterAssignment) {
                if (Number(waterAssignment[1]) !== 6) {
                    return fail('Pompa Level 2 menyiapkan 6 unit: 2 untuk C1, 3 untuk C2, dan 1 untuk C3. Tulis isi_air = 6.');
                }
                commands.push({ type: 'setWater', amount: 6 });
            } else if (loop) {
                if (reservedLoopNames.has(loop[1])) {
                    return fail('Gunakan nama penghitung sederhana seperti i atau j.');
                }
                const usesVariable = loop[2] === 'jumlah_semprot';
                const count = usesVariable ? jumlahSemprot : Number(loop[2]);
                if (count === undefined) return fail('Isi jumlah_semprot sebelum menggunakannya di range().');
                if (!Number.isSafeInteger(count) || count > 120) return fail('Gunakan maksimal 120 aksi dalam satu Run.');
                let bodyCount = 0;
                let indentation;
                while (index + 1 < lines.length && /^\s/.test(lines[index + 1])) {
                    const body = lines[++index];
                    const spaces = body.match(/^[ \t]+/)[0];
                    indentation ??= spaces;
                    if (spaces !== indentation || !/^[ \t]+semprot\s*\(\s*\)$/.test(body)) {
                        return fail('Blok for hanya berisi semprot() dengan indentasi yang sama.');
                    }
                    bodyCount += 1;
                }
                if (!bodyCount) return fail('Letakkan semprot() menjorok ke kanan di bawah for.');
                const total = count * bodyCount;
                if (commands.length + total > 120) return fail('Gunakan maksimal 120 aksi dalam satu Run.');
                commands.push(...Array.from({ length: total }, () => ({ type: 'spray' })));
                sprayCount += total;
                loopSprays += total;
                if (usesVariable) variableLoopSprays += total;
            } else if (/^semprot\s*\(\s*\)$/.test(line)) {
                commands.push({ type: 'spray' });
                sprayCount += 1;
            } else {
                return fail('Gunakan perintah gerak, isi_air = 6, semprot(), jumlah_semprot = angka, atau for i in range(...): dengan titik dua.');
            }
            if (commands.length > 120) return fail('Gunakan maksimal 120 aksi dalam satu Run.');
        }

        result.syntaxValid = true;
        result.conceptValid = sprayCount === 0 || challengeNumber === 1
            || (challengeNumber === 2 ? loopSprays === sprayCount : variableLoopSprays === sprayCount);
        result.missionSuccess = result.conceptValid && sprayCount === requiredCount;
        result.actions = { commands, sprayCount };
        result.message = !result.conceptValid
            ? challengeNumber === 2
                ? 'Gunakan for dan range() untuk mengulang semprot(), bukan menulisnya satu per satu.'
                : 'Simpan jumlah_semprot, lalu gunakan for i in range(jumlah_semprot):.'
            : 'Kode valid. Pemadam akan menjalankan gerakan dan semprotan sesuai urutan.';
        return result;
    }

    validateVariable(code, requiredWater, challengeNumber = 1) {
        const result = {
            syntaxValid: false,
            conceptValid: false,
            missionSuccess: false,
            message: '',
            actions: null,
        };
        const lines = code.replace(/\r\n?/g, '\n').split('\n')
            .map((line) => line.split('#')[0].trim())
            .filter((line) => line !== '');

        if (lines.length === 0) {
            result.message = 'Tulis perintah seperti atas(2), kanan(2), atau assignment variabel yang diminta.';
            return result;
        }

        if (lines.length > 120) {
            result.message = 'Terlalu banyak perintah. Gunakan maksimal 120 perintah dalam satu kali Run.';
            return result;
        }

        const movementDirections = {
            atas: 'north',
            bawah: 'south',
            kanan: 'east',
            kiri: 'west',
        };
        const commands = [];
        let hasWaterAssignment = false;
        let hasPostAssignment = false;
        let water = 0;

        for (const line of lines) {
            const normalizedLine = line.replace(/[ \t]/g, '');
            const waterAssignment = normalizedLine.match(/^isi_air=(0|[1-9][0-9]*)$/);
            const movementMatch = normalizedLine.match(/^(atas|bawah|kanan|kiri)\((0|[1-9][0-9]*)\)$/);

            if (waterAssignment) {
                if (challengeNumber === 3) {
                    result.message = 'Pada Challenge 3, gunakan nilai isi_air yang sudah disiapkan di Challenge 2.';
                    return result;
                }

                water = Number(waterAssignment[1]);

                if (!Number.isSafeInteger(water)) {
                    result.message = 'Jumlah air terlalu besar. Gunakan bilangan bulat yang lebih kecil.';
                    return result;
                }

                hasWaterAssignment = true;
                commands.push({ type: 'setWater', amount: water });
                continue;
            }

            if (normalizedLine === 'air_pos_2=isi_air') {
                if (challengeNumber !== 3) {
                    result.message = 'air_pos_2 = isi_air baru digunakan pada Challenge 3.';
                    return result;
                }

                if (hasPostAssignment) {
                    result.message = 'Cukup tulis air_pos_2 = isi_air satu kali.';
                    return result;
                }

                hasPostAssignment = true;
                commands.push({ type: 'transferWater' });
                continue;
            }

            if (movementMatch) {
                const direction = movementDirections[movementMatch[1]];
                const stepCount = Number(movementMatch[2]);

                if (!Number.isSafeInteger(stepCount) || stepCount < 1) {
                    result.message = 'Jumlah langkah harus berupa bilangan bulat minimal 1.';
                    return result;
                }

                if (commands.length + stepCount > 120) {
                    result.message = 'Terlalu banyak gerakan. Gunakan maksimal 120 langkah dalam satu kali Run.';
                    return result;
                }

                commands.push(...Array.from(
                    { length: stepCount },
                    () => ({ type: 'move', direction }),
                ));
                continue;
            }

            result.message = challengeNumber === 3
                ? 'Gunakan hanya perintah gerak dan air_pos_2 = isi_air.'
                : 'Gunakan hanya perintah gerak dan isi_air = angka.';
            return result;
        }

        result.syntaxValid = true;
        result.conceptValid = true;
        result.missionSuccess = challengeNumber === 3
            ? hasPostAssignment
            : hasWaterAssignment && water === requiredWater;
        result.actions = { water, commands };

        if (challengeNumber === 3) {
            result.message = hasPostAssignment
                ? 'Kode valid. Persediaan isi_air akan diberikan ke Pos 2.'
                : 'Kode valid. Bergeraklah ke Pos 2, lalu tulis air_pos_2 = isi_air.';
        } else if (!hasWaterAssignment) {
            result.message = 'Kode valid. Pemadam menjalankan urutan gerakanmu.';
        } else if (result.missionSuccess) {
            result.message = `Kode valid. Nilai isi_air akan diubah menjadi ${requiredWater}.`;
        } else {
            result.message = `Isi variabel isi_air dengan tepat ${requiredWater} unit.`;
        }

        return result;
    }
}
