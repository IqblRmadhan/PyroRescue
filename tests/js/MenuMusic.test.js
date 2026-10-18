import test from 'node:test';
import assert from 'node:assert/strict';
import { MenuMusic } from '../../resources/js/game/MenuMusic.js';

function createMenu({ values = {}, play = async () => {} } = {}) {
    const saved = new Map(Object.entries(values));
    const label = { textContent: '' };
    const attributes = {};
    let paused = 0;
    const music = new MenuMusic({
        button: {
            querySelector() { return label; },
            setAttribute(name, value) { attributes[name] = value; },
            classList: { toggle() {} },
        },
        source: '/assets/audio/menu-action-loop.wav',
        storage: {
            getItem(key) { return saved.get(key) ?? null; },
            setItem(key, value) { saved.set(key, String(value)); },
        },
        createAudio() {
            return { play, pause() { paused += 1; } };
        },
    });
    return { music, saved, label, attributes, get paused() { return paused; } };
}

test('menu music can start after autoplay rejection and remembers the choice for the game', async () => {
    let allowed = false;
    const menu = createMenu({ play: async () => {
        if (!allowed) throw new Error('autoplay denied');
    } });

    assert.equal(await menu.music.start(), false);
    assert.equal(menu.label.textContent, 'Putar Musik');
    assert.equal(menu.music.audio.autoplay, true);
    allowed = true;
    assert.equal(await menu.music.start(), true);
    assert.equal(menu.attributes['aria-pressed'], 'true');
    menu.music.toggle();
    assert.equal(menu.saved.get('pyrorescue.musicMuted'), 'true');
    assert.equal(menu.label.textContent, 'Musik Mati');
    assert.equal(menu.paused, 1);
});

test('menu music respects the preference set in the game', async () => {
    const menu = createMenu({ values: { 'pyrorescue.musicMuted': 'true' } });
    assert.equal(await menu.music.start(), false);
    assert.equal(menu.label.textContent, 'Musik Mati');
    menu.music.toggle();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(menu.saved.get('pyrorescue.musicMuted'), 'false');
    assert.equal(menu.attributes['aria-pressed'], 'true');
});
