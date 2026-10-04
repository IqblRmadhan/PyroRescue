import test from 'node:test';
import assert from 'node:assert/strict';
import * as mapLabels from '../../resources/js/game/PumpLabel.js';

test('map labels stay readable when the camera zooms out', () => {
    assert.equal(typeof mapLabels.getMapLabelScale, 'function');
    assert.equal(mapLabels.getMapLabelScale(1.15), 1);
    assert.equal(mapLabels.getMapLabelScale(0.5), 2);
    assert.equal(mapLabels.getMapLabelScale(0.4), 2.5);
    assert.equal(mapLabels.getMapLabelScale(0.2), 5);
});

test('pump and fire labels use distinct non-pixel themes', () => {
    assert.equal(typeof mapLabels.getMapLabelTheme, 'function');

    const pump = mapLabels.getMapLabelTheme('pump');
    const fire = mapLabels.getMapLabelTheme('fire');

    assert.notEqual(pump.backgroundColor, fire.backgroundColor);
    assert.notEqual(pump.borderColor, fire.borderColor);
    assert.doesNotMatch(pump.fontFamily, /PixelFont/i);
    assert.equal(pump.fontFamily, fire.fontFamily);
});

test('label board geometry ends in a centered downward pointer', () => {
    assert.equal(typeof mapLabels.getPointerLabelGeometry, 'function');

    const geometry = mapLabels.getPointerLabelGeometry(100);

    assert.deepEqual(geometry.board, { x: -61, y: -38, width: 122, height: 30 });
    assert.deepEqual(geometry.pointer, [-7, -8, 7, -8, 0, 0]);
    assert.equal(geometry.textY, -23);
});

test('top-edge label can sit below its target with an upward pointer', () => {
    const geometry = mapLabels.getPointerLabelGeometry(100, 'below');

    assert.deepEqual(geometry.board, { x: -61, y: 8, width: 122, height: 30 });
    assert.deepEqual(geometry.pointer, [-7, 8, 7, 8, 0, 0]);
    assert.equal(geometry.textY, 23);
});

test('pump label points to the visual center of the pump body', () => {
    assert.equal(typeof mapLabels.getPumpLabelPosition, 'function');
    assert.deepEqual(
        mapLabels.getPumpLabelPosition(620, 180),
        { x: 620, y: 138 },
    );
});
