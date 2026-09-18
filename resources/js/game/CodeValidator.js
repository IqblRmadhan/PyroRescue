export default class CodeValidator {
    validateVariable(code, requiredWater) {
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
            result.message = 'Tulis perintah seperti kanan(2), kiri(2), atas(2), atau bawah(2).';
            return result;
        }

        if (lines.length > 120) {
            result.message = 'Terlalu banyak perintah. Gunakan maksimal 120 perintah dalam satu kali Run.';
            return result;
        }

        const movementDirections = {
            atas: 'north',
            kanan: 'east',
            bawah: 'south',
            kiri: 'west',
        };
        const commands = [];
        let hasWaterVariable = false;
        let water = 0;
        let shouldSpray = false;

        for (const [index, line] of lines.entries()) {
            const normalizedLine = line.replace(/[ \t]/g, '');
            const assignment = normalizedLine.match(/^jumlah_air=(0|[1-9][0-9]*)$/);
            const movementMatch = normalizedLine.match(/^(atas|kanan|bawah|kiri)\((0|[1-9][0-9]*)\)$/);

            if (assignment) {
                water = Number(assignment[1]);

                if (!Number.isSafeInteger(water)) {
                    result.message = 'Jumlah air terlalu besar. Gunakan bilangan bulat yang lebih kecil.';
                    return result;
                }

                hasWaterVariable = true;
                commands.push({ type: 'setWater', amount: water });
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

            if (normalizedLine !== 'semprot(jumlah_air)') {
                result.message = 'Gunakan hanya atas(angka), kanan(angka), bawah(angka), kiri(angka), dan semprot(jumlah_air).';
                return result;
            }

            if (!hasWaterVariable) {
                result.message = 'Buat jumlah_air = angka sebelum menggunakan semprot(jumlah_air).';
                return result;
            }

            if (index !== lines.length - 1) {
                result.message = 'Gunakan semprot(jumlah_air) satu kali pada akhir sequence.';
                return result;
            }

            shouldSpray = true;
            commands.push({ type: 'spray' });

            if (commands.length > 120) {
                result.message = 'Terlalu banyak gerakan. Gunakan maksimal 120 langkah dalam satu kali Run.';
                return result;
            }
        }

        result.syntaxValid = true;
        result.conceptValid = true;
        result.missionSuccess = hasWaterVariable && shouldSpray && water >= requiredWater;
        result.actions = { water, shouldSpray, commands };

        if (!shouldSpray) {
            result.message = hasWaterVariable
                ? 'Kode valid. Jumlah air akan berubah jika pemadam sudah berada di dekat pompa.'
                : 'Kode valid. Pemadam menjalankan urutan gerakanmu.';
        } else if (result.missionSuccess) {
            result.message = 'Kode valid. Pemadam menjalankan urutan perintahmu.';
        } else {
            result.message = `Jumlah air kurang. Api membutuhkan minimal ${requiredWater} unit air.`;
        }

        return result;
    }
}
