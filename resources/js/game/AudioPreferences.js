export const musicMutedKey = 'pyrorescue.musicMuted';
export const effectsMutedKey = 'pyrorescue.effectsMuted';
const oldMutedKey = 'pyrorescue.audioMuted';

export function getAudioStorage() {
    try {
        return globalThis.window?.localStorage ?? null;
    } catch {
        return null;
    }
}

export function readAudioPreference(storage, key) {
    try {
        const saved = storage?.getItem(key);
        if (saved !== null && saved !== undefined) return saved === 'true';
        return storage?.getItem(oldMutedKey) === 'true';
    } catch {
        return false;
    }
}

export function saveAudioPreference(storage, key, muted) {
    try {
        storage?.setItem(key, String(muted));
    } catch {
        // Browser dapat menolak localStorage dalam mode privasi.
    }
}
