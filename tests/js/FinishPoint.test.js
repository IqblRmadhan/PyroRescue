import test from 'node:test';
import assert from 'node:assert/strict';
import * as FinishPoint from '../../resources/js/game/FinishPoint.js';
import { getFinishFootprint } from '../../resources/js/game/FinishPoint.js';

test('finish tile can be drawn without creating a label', () => {
    const state = { rectangles: [] };
    const graphics = {
        setPosition(x, y) {
            state.position = [x, y];
            return this;
        },
        setDepth(depth) {
            state.depth = depth;
            return this;
        },
        fillStyle(color) {
            state.color = color;
            return this;
        },
        fillRect(x, y, width, height) {
            state.rectangles.push({ color: state.color, x, y, width, height });
            return this;
        },
        lineStyle() {
            return this;
        },
        strokeRect() {
            return this;
        },
    };
    const scene = {
        add: {
            graphics: () => graphics,
            text: () => assert.fail('tile-only finish must not create text'),
            container: () => assert.fail('tile-only finish must not create a label container'),
        },
    };

    assert.equal(typeof FinishPoint.addFinishTile, 'function');
    const tile = FinishPoint.addFinishTile(scene, 1580, 460);

    assert.equal(tile, graphics);
    assert.deepEqual(state.position, [1580, 460]);
    assert.equal(state.depth, 6);
    assert.equal(state.rectangles.length, 17);
});

test('FINISH stays inside its 40 pixel road tile instead of covering nearby trees', () => {
    const finish = getFinishFootprint(1580, 460);
    assert.ok(finish.left >= 1560);
    assert.ok(finish.top >= 440);
    assert.ok(finish.left + finish.width <= 1600);
    assert.ok(finish.top + finish.height <= 480);
    assert.equal(finish.left + finish.width / 2, 1580);
    assert.equal(finish.top + finish.height / 2, 460);
});
