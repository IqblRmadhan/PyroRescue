import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDisplayPreferences, saveDisplayPreference } from '../../resources/js/game/PlayerPreferences.js';

test('display preferences persist and apply to every page root', () => {
    const values = new Map();
    const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const classes = new Set();
    const root = { classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) } };
    saveDisplayPreference(storage, 'reducedMotion', true);
    saveDisplayPreference(storage, 'largeText', true);
    applyDisplayPreferences(storage, root);
    assert.equal(classes.has('pref-reduced-motion'), true);
    assert.equal(classes.has('pref-large-text'), true);
    assert.equal(classes.has('pref-high-contrast'), false);
});
