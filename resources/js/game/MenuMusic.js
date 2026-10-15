import {
    getAudioStorage,
    musicMutedKey,
    readAudioPreference,
    saveAudioPreference,
} from './AudioPreferences.js';

export class MenuMusic {
    constructor({ button, source, storage = getAudioStorage(), createAudio = url => new Audio(url) }) {
        this.button = button;
        this.storage = storage;
        this.muted = readAudioPreference(storage, musicMutedKey);
        this.audio = createAudio(source);
        this.audio.loop = true;
        this.audio.volume = 0.5;
        this.audio.preload = 'none';
        this.playing = false;
        this.starting = null;
        this.playRequest = 0;
        this.render();
    }

    render() {
        const label = this.muted ? 'Musik Mati' : this.playing ? 'Musik Hidup' : 'Putar Musik';
        this.button.querySelector('[data-menu-music-label]').textContent = label;
        this.button.setAttribute('aria-label', this.muted ? 'Nyalakan musik menu' : this.playing ? 'Matikan musik menu' : 'Putar musik menu');
        this.button.setAttribute('aria-pressed', String(this.playing));
        this.button.classList.toggle('is-playing', this.playing);
    }

    async start() {
        if (this.muted || this.playing) return false;
        if (this.starting) return this.starting;
        const request = ++this.playRequest;
        this.starting = (async () => {
            try {
                await this.audio.play();
                if (request !== this.playRequest || this.muted) {
                    this.audio.pause();
                    return false;
                }
                this.playing = true;
                this.render();
                return true;
            } catch {
                this.playing = false;
                this.render();
                return false;
            } finally {
                this.starting = null;
            }
        })();
        return this.starting;
    }

    toggle() {
        if (this.playing || this.starting) {
            this.muted = true;
            this.playRequest += 1;
            this.audio.pause();
            this.playing = false;
            saveAudioPreference(this.storage, musicMutedKey, true);
            this.render();
            return;
        }
        this.muted = false;
        saveAudioPreference(this.storage, musicMutedKey, false);
        this.render();
        void this.start();
    }

    pause() {
        this.playRequest += 1;
        this.audio.pause();
        this.playing = false;
        this.render();
    }
}

export function initMenuMusic(button) {
    if (!button) return null;
    const music = new MenuMusic({ button, source: button.dataset.musicUrl });
    button.addEventListener('click', () => music.toggle());
    const startAfterInteraction = event => {
        if (event.target?.closest?.('[data-menu-music-toggle]')) return;
        if (event.type === 'keydown' && !['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        void music.start();
    };
    document.addEventListener('pointerdown', startAfterInteraction);
    document.addEventListener('keydown', startAfterInteraction);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) music.pause();
        else void music.start();
    });
    window.addEventListener('pagehide', () => music.pause());
    void music.start();
    return music;
}
