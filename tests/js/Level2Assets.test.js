import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import * as Level2Assets from '../../resources/js/game/Level2Assets.js';
import { level2Assets } from '../../resources/js/game/Level2Assets.js';

test('Level 2 uses final map filenames without a version suffix', () => {
    assert.equal(Level2Assets.level2MapImage, 'maps/level2-map.webp');
    assert.equal(Level2Assets.level2MapForegroundImage, 'maps/level2-maps.webp');
    assert.equal(Level2Assets.level2MapShadowImage, 'maps/shadow_level2.webp');
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level2-map.webp')), true);
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level2-maps.webp')), true);
    assert.ok(statSync(path.join(process.cwd(), 'public/assets/maps/level2-map.webp')).size < 2_000_000);
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level2-map.png')), false);
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level2-maps.png')), false);
});

test('Level 2 map shadow fills the map with one layer like Level 1', () => {
    const layers = [];
    const scene = {
        add: {
            image(x, y, texture) {
                const state = { x, y, texture };
                layers.push(state);
                return {
                    setOrigin(value) {
                        state.origin = value;
                        return this;
                    },
                    setDisplaySize(width, height) {
                        state.width = width;
                        state.height = height;
                        return this;
                    },
                    setDepth(value) {
                        state.depth = value;
                        return this;
                    },
                    setAlpha(value) {
                        state.alpha = value;
                        return this;
                    },
                };
            },
        },
    };

    assert.equal(typeof Level2Assets.addLevel2MapShadow, 'function');
    Level2Assets.addLevel2MapShadow(scene, 1600, 1200);

    assert.deepEqual(layers, [
        {
            x: 0,
            y: 0,
            texture: 'level2Shadow',
            origin: 0,
            width: 1600,
            height: 1200,
            depth: 0,
        },
    ]);
});

test('Level 2 foreground covers fire sprites without covering markers or the player', () => {
    const layers = [];
    const scene = {
        add: {
            image(x, y, texture) {
                const state = { x, y, texture };
                layers.push(state);
                return {
                    setOrigin(value) {
                        state.origin = value;
                        return this;
                    },
                    setDisplaySize(width, height) {
                        state.width = width;
                        state.height = height;
                        return this;
                    },
                    setDepth(value) {
                        state.depth = value;
                        return this;
                    },
                };
            },
        },
    };

    Level2Assets.addLevel2MapForeground?.(scene, 1600, 1200);

    assert.deepEqual(layers, [{
        x: 0,
        y: 0,
        texture: 'level2Foreground',
        origin: 0,
        width: 1600,
        height: 1200,
        depth: 6,
    }]);
});

test('Level 2 foreground is excluded when Level 3 reuses the scene', () => {
    assert.equal(
        Level2Assets.getLevel2MapForegroundImage?.('Level2Scene'),
        'maps/level2-maps.webp',
    );
    assert.equal(Level2Assets.getLevel2MapForegroundImage?.('Level3Scene'), null);
});

test('all Level 2 fires use five horizontal 200 pixel frames', () => {
    const expectedFrames = {
        fire1: [0, 0, 200, 200],
        fire2: [200, 0, 200, 200],
        fire3: [400, 0, 200, 200],
        fire4: [600, 0, 200, 200],
        extinguished: [800, 0, 200, 200],
    };

    for (const key of ['fireC1', 'fireC2', 'fireC3', 'fireEval']) {
        assert.deepEqual(level2Assets[key].frames, expectedFrames);
    }

    assert.equal(level2Assets.fireEval.file, 'objects/LEVEL2-EVAL.png');
});
