// Kisi-kisi muncul di lokasi pengerjaan; titik-titik diisi sendiri oleh pemain.
export function getChallengeStarterCode(level, challenge, state = {}) {
    if (challenge === 4) return null;
    let code;
    let key = `${level}:${challenge}`;
    if (level === 1) {
        if (challenge === 2) return null;
        if (!state.atLocation) return null;
        code = challenge === 3 ? 'air_pos = ...' : 'isi_air = ...';
    } else if (level === 2) {
        if (state.atPump) {
            key += ':pump';
            code = 'isi_air = ...';
        } else if (state.atFire && !state.fireOut) {
            key += ':fire';
            code = challenge === 1 ? '...()\n...()'
                : challenge === 2 ? 'for i in range(...):\n    ...()'
                    : 'jumlah_semprot = ...\nfor i in range(...):\n    ...()';
        }
    } else if (level === 3) {
        const step = state.step;
        const filling = (challenge === 1 && step === 1)
            || (challenge === 2 && step === 2) || (challenge === 3 && step === 4);
        if (!(state.atObjective || (filling && state.atPump))) return null;
        key += `:${step}`;
        if (filling) code = 'isi_air = ...';
        else if ((challenge === 1 && step === 2) || (challenge === 3 && step === 1)) {
            code = 'if ...:\n    maju(...)\nelse:\n    kanan(...)';
        } else if (challenge === 1 && step === 3) {
            code = 'for i in range(...):\n    ...()';
        } else if (challenge === 1 && step === 4) {
            code = 'if ...:\n    ...()\nelse:\n    mundur(...)';
        } else if (challenge === 2 && [1, 3].includes(step)) {
            code = 'if isi_air ... kebutuhan_air:\n    for i in range(...):\n        ...()\nelse:\n    mundur(...)';
        } else if (challenge === 2 && step === 4) {
            code = 'if ...:\n    if ...:\n        ...()\n    else:\n        mundur(...)\nelse:\n    ...()';
        } else if (challenge === 3 && step === 3) {
            code = 'if ...:\n    if ...:\n        if ...:\n            ...()\n        else:\n            kiri(...)\n    else:\n        mundur(...)\nelse:\n    ...()';
        }
    }
    return code ? { key, code } : null;
}
