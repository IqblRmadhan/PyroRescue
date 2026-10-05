import test from 'node:test';
import assert from 'node:assert/strict';
import { getMinimumMapZoom } from '../../resources/js/game/MapCameraControls.js';

test('zoom-out limit keeps a wide map filling the game viewport', () => {
    const zoom = getMinimumMapZoom(1050, 760, 1360, 1200);

    assert.equal(zoom, 0.82);
    assert.ok(1360 * zoom >= 1050);
    assert.ok(1200 * zoom >= 760);
});

test('zoom-out limit covers a tall viewport and scales up only as needed', () => {
    assert.equal(getMinimumMapZoom(500, 900, 1360, 1200), 0.82);
    assert.equal(getMinimumMapZoom(1500, 760, 1360, 1200), 1500 / 1360);
});
