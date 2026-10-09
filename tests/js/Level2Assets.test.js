import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as Level2Assets from '../../resources/js/game/Level2Assets.js';
import { level2Assets } from '../../resources/js/game/Level2Assets.js';

test('Level 2 uses final map filenames without a version suffix', () => {
    assert.equal(Level2Assets.level2MapImage, 'maps/level2-map.png');
    assert.equal(Level2Assets.level2MapShadowImage, 'maps/shadow_level2.png');
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level2-map.png')), true);
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level2-map-v2.png')), false);
});

test('Level 2 map shadow fills the map and adds a darker overlay', () => {
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
        {
            x: 0,
            y: 0,
            texture: 'level2Shadow',
            origin: 0,
            width: 1600,
            height: 1200,
            depth: 0,
            alpha: 0.8,
        },
    ]);
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
