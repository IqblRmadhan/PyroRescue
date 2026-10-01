import test from 'node:test';
import assert from 'node:assert/strict';
import challenges, * as level2Config from '../../resources/js/game/Level2Challenges.js';

test('fire presentation distinguishes active, upcoming, and extinguished fires', () => {
    assert.equal(typeof level2Config.getFirePresentation, 'function');

    assert.deepEqual(level2Config.getFirePresentation(1, 1, 0, challenges), {
        completed: false,
        label: 'C1 • 2× SEMPROT',
        markerState: 'visible',
    });
    assert.deepEqual(level2Config.getFirePresentation(2, 1, 0, challenges), {
        completed: false,
        label: 'C2 • 3× SEMPROT',
        markerState: 'visible',
    });
    assert.deepEqual(level2Config.getFirePresentation(1, 2, 0, challenges), {
        completed: true,
        label: 'C1 • PADAM',
        markerState: 'completed',
    });
});

test('active fire label shows the remaining sprays', () => {
    assert.equal(typeof level2Config.getFirePresentation, 'function');
    assert.equal(level2Config.getFirePresentation(2, 2, 1, challenges).label, 'C2 • SISA 2 SEMPROT');
});
