import {
    effectsMutedKey,
    getAudioStorage,
    musicMutedKey,
    readAudioPreference,
    saveAudioPreference,
} from './AudioPreferences.js';

const displayPreferences = {
    reducedMotion: ['pyrorescue.reducedMotion', 'pref-reduced-motion'],
    largeText: ['pyrorescue.largeText', 'pref-large-text'],
    highContrast: ['pyrorescue.highContrast', 'pref-high-contrast'],
};

export function saveDisplayPreference(storage, preference, enabled) {
    const key = displayPreferences[preference]?.[0];
    if (!key) return;
    try { storage?.setItem(key, String(enabled)); } catch { /* Penyimpanan browser bisa dibatasi. */ }
}

export function applyDisplayPreferences(storage, root) {
    for (const [key, className] of Object.values(displayPreferences)) {
        let enabled = false;
        try { enabled = storage?.getItem(key) === 'true'; } catch { /* Gunakan tampilan awal. */ }
        root.classList.toggle(className, enabled);
    }
}

export function initPlayerPreferences(documentRoot = document) {
    const storage = getAudioStorage();
    applyDisplayPreferences(storage, documentRoot.documentElement);
    const keys = { music: musicMutedKey, effects: effectsMutedKey };
    for (const input of documentRoot.querySelectorAll('[data-preference]')) {
        const preference = input.dataset.preference;
        const audioKey = keys[preference];
        input.checked = audioKey ? !readAudioPreference(storage, audioKey) : (() => {
            try { return storage?.getItem(displayPreferences[preference][0]) === 'true'; } catch { return false; }
        })();
        input.addEventListener('change', () => {
            if (audioKey) saveAudioPreference(storage, audioKey, !input.checked);
            else {
                saveDisplayPreference(storage, preference, input.checked);
                applyDisplayPreferences(storage, documentRoot.documentElement);
            }
        });
    }
}
