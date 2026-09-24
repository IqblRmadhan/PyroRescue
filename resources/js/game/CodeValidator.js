export default class CodeValidator {
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
