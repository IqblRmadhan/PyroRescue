const forbiddenCounters = new Set(('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield range semprot jumlah_semprot isi_air api_padam status_bekantan').split(' '));

// Hanya membaca subset modul. Percabangan tetap berupa data agar kondisi api
// diperiksa oleh scene SETELAH aksi sebelumnya selesai, bukan saat validasi.
export function validateLevel3(code, requiredCount, challengeNumber = 1) {
    const result = { syntaxValid: false, conceptValid: false, missionSuccess: false, message: '', actions: null };
    const fail = (message) => ({ ...result, message });
    const lines = code.replace(/\r\n?/g, '\n').split('\n')
        .map((line) => line.split('#')[0].trimEnd()).filter((line) => line.trim());
    const commands = [];
    const conditions = [];
    let quantity;
    let sprayCount = 0;
    let variableSprays = 0;
    let hasVariableLoop = false;
    let evaluationCountValid = false;
    let lastSprayIndex = -1;

    if (!lines.length) return fail('Tulis perintah gerak atau kode misi terlebih dahulu.');
    if (lines.length > 120) return fail('Gunakan maksimal 120 baris per Run.');

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (/^\s/.test(line)) return fail('Indentasi hanya dipakai di dalam blok for, if, atau else.');
        const movement = line.match(/^(atas|bawah|kanan|kiri)\s*\(\s*(0|[1-9]\d*)\s*\)$/);
        const assignment = line.match(/^(isi_air|jumlah_semprot)\s*=\s*(0|[1-9]\d*)$/);
        const loop = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\s*\(\s*(jumlah_semprot|0|[1-9]\d*)\s*\)\s*:$/);

        if (movement) {
            const count = Number(movement[2]);
            if (!Number.isSafeInteger(count) || count < 1 || commands.length + count > 120) return fail('Gunakan 1 sampai 120 langkah, maksimal 120 aksi per Run.');
            const direction = { atas: 'north', bawah: 'south', kanan: 'east', kiri: 'west' }[movement[1]];
            commands.push(...Array.from({ length: count }, () => ({ type: 'move', direction })));
        } else if (assignment) {
            const amount = Number(assignment[2]);
            if (!Number.isSafeInteger(amount) || amount > (assignment[1] === 'isi_air' ? 6 : 120)) {
                return fail(assignment[1] === 'isi_air' ? 'Kapasitas tangki maksimal 6 unit air.' : 'jumlah_semprot harus antara 0 dan 120.');
            }
            if (assignment[1] === 'isi_air') commands.push({ type: 'setWater', amount });
            else quantity = amount;
        } else if (loop) {
            if (forbiddenCounters.has(loop[1])) return fail('Gunakan nama penghitung seperti i atau j.');
            const usesVariable = loop[2] === 'jumlah_semprot';
            const count = usesVariable ? quantity : Number(loop[2]);
            if (count === undefined) return fail('Isi jumlah_semprot sebelum menggunakannya dalam range().');
            if (!Number.isSafeInteger(count) || count > 120) return fail('Gunakan maksimal 120 aksi per Run.');
            let bodyCount = 0;
            let indentation;
            while (index + 1 < lines.length && /^\s/.test(lines[index + 1])) {
                const body = lines[++index];
                const spaces = body.match(/^[ \t]+/)?.[0];
                indentation ??= spaces;
                if (spaces !== indentation || !/^[ \t]+semprot\s*\(\s*\)$/.test(body) || (spaces.includes(' ') && spaces.includes('\t'))) {
                    return fail('Blok for hanya berisi semprot() dengan indentasi konsisten.');
                }
                bodyCount += 1;
            }
            if (!bodyCount) return fail('Tulis semprot() menjorok ke kanan di bawah for.');
            const total = count * bodyCount;
            if (commands.length + total > 120) return fail('Gunakan maksimal 120 aksi per Run.');
            commands.push(...Array.from({ length: total }, () => ({ type: 'spray' })));
            sprayCount += total;
            if (usesVariable) {
                variableSprays += total;
                hasVariableLoop = true;
                evaluationCountValid ||= count === requiredCount && bodyCount === 1;
            }
            lastSprayIndex = commands.length - 1;
        } else if (/^semprot\s*\(\s*\)$/.test(line)) {
            commands.push({ type: 'spray' });
            sprayCount += 1;
            lastSprayIndex = commands.length - 1;
        } else if (/^if\s+api_padam\s*:$/.test(line)) {
            const readStatus = (body) => body?.match(/^([ \t]+)status_bekantan\s*=\s*(["'])(aman|selamat|tunggu)\2$/);
            const whenTrue = readStatus(lines[++index]);
            if (!whenTrue || (whenTrue[1].includes(' ') && whenTrue[1].includes('\t'))) return fail('Di bawah if, tulis status_bekantan = "aman", "selamat", atau "tunggu" dengan indentasi.');
            let whenFalse = null;
            if (/^else\s*:$/.test(lines[index + 1] ?? '')) {
                index += 1;
                whenFalse = readStatus(lines[++index]);
                if (!whenFalse || whenFalse[1] !== whenTrue[1]) return fail('Blok else memerlukan assignment status_bekantan dengan indentasi yang sama dengan blok if.');
            }
            const command = { type: 'conditional', whenTrue: whenTrue[3], whenFalse: whenFalse?.[3] ?? null };
            conditions.push({ ...command, index: commands.length });
            commands.push(command);
        } else if (/^api_padam\s*=/.test(line)) {
            return fail('api_padam diperbarui oleh game setelah penyemprotan. Periksa dengan if api_padam:, jangan mengganti nilainya sendiri.');
        } else {
            return fail('Periksa sintaks. Gunakan gerakan, isi_air, jumlah_semprot, for/range, dan if api_padam: dengan else: sesuai modul. Akhiri header dengan titik dua.');
        }
        if (commands.length > 120) return fail('Gunakan maksimal 120 aksi per Run.');
    }

    result.syntaxValid = true;
    const condition = conditions[0];
    let conceptValid = conditions.length <= 1;
    if (challengeNumber === 1) {
        conceptValid &&= !condition && (sprayCount === 0 || (hasVariableLoop && sprayCount === variableSprays));
    } else if (challengeNumber === 2) {
        conceptValid &&= !hasVariableLoop && sprayCount === 0 && (!condition || (condition.whenTrue === 'aman' && condition.whenFalse === null));
    } else if (challengeNumber === 3) {
        conceptValid &&= !hasVariableLoop && sprayCount === 0 && (!condition || (condition.whenTrue === 'selamat' && condition.whenFalse === 'tunggu'));
    } else if (hasVariableLoop || sprayCount > 0 || condition) {
        // Evaluasi menggabungkan loop dan percabangan dalam satu program.
        conceptValid &&= hasVariableLoop && sprayCount === variableSprays
            && Boolean(condition) && condition.index > lastSprayIndex
            && condition.whenTrue === 'selamat' && condition.whenFalse === 'tunggu';
    }
    result.conceptValid = conceptValid;
    if (challengeNumber === 4) {
        for (const command of commands) {
            if (command.type === 'conditional') command.evaluationCountValid = evaluationCountValid;
        }
    }
    result.actions = conceptValid ? { commands, sprayCount } : null;
    result.message = conceptValid ? 'Kode valid. Kondisi api diperiksa saat aksi percabangan dijalankan.'
        : challengeNumber === 1 ? 'Gunakan jumlah_semprot dan for i in range(jumlah_semprot): untuk memadamkan api habitat.'
            : challengeNumber === 2 ? 'Gunakan if api_padam: untuk mengisi status_bekantan = "aman".'
                : challengeNumber === 3 ? 'Gunakan if/else: "selamat" ketika api padam, "tunggu" ketika belum padam.'
                    : 'Evaluasi membutuhkan variabel, perulangan, lalu percabangan untuk kedua kondisi dalam satu program.';
    return result;
}

export function resolveBekantanStatus(command, fireOut, currentStatus) {
    return (fireOut ? command.whenTrue : command.whenFalse) ?? currentStatus;
}
