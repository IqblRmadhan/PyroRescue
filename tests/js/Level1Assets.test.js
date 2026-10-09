import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as Level1Assets from '../../resources/js/game/Level1Assets.js';
import {
    firefighterAnimations,
    level1Assets,
    level1MapImage,
    level1MapShadowImage,
    npcAnimations,
} from '../../resources/js/game/Level1Assets.js';

test('Level 1 uses the final map filename without a version suffix', () => {
    assert.equal(level1MapImage, 'maps/level1-map.png');
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level1-map.png')), true);
    assert.equal(existsSync(path.join(process.cwd(), 'public/assets/maps/level1-map-v2.png')), false);
});

test('level map shadow uses the dedicated Level 1 image', () => {
    assert.equal(level1MapShadowImage, 'maps/shadow_level1.png');
});

test('level map shadow fills the complete 1600 by 1200 map', () => {
    const state = {};
    const shadow = {
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
    const scene = {
        add: {
            image(x, y, texture) {
                Object.assign(state, { x, y, texture });
                return shadow;
            },
        },
    };

    assert.equal(typeof Level1Assets.addLevel1MapShadow, 'function');
    Level1Assets.addLevel1MapShadow(scene, 1600, 1200);

    assert.deepEqual(state, {
        x: 0,
        y: 0,
        texture: 'levelMapShadow',
        origin: 0,
        width: 1600,
        height: 1200,
        depth: 0,
    });
});

test('every Level 1 preload asset exists in the public asset directory', () => {
    for (const asset of Object.values(level1Assets)) {
        const assetPath = path.join(process.cwd(), 'public', 'assets', asset.file);
        assert.equal(existsSync(assetPath), true, asset.file);
    }
});

test('updated water pump uses all six 80 pixel source frames', () => {
    assert.deepEqual(level1Assets.waterPump.frames, {
        idle: [0, 0, 80, 80],
        start: [80, 0, 80, 80],
        stream: [160, 0, 80, 80],
        flow: [0, 80, 80, 80],
        slow: [80, 80, 80, 80],
        drop: [160, 80, 80, 80],
    });
});

test('action marker uses all six pulse frames from the new sheet', () => {
    assert.deepEqual(level1Assets.actionMarker.frames, {
        pulse1: [58, 249, 246, 246],
        pulse2: [420, 249, 246, 246],
        pulse3: [782, 249, 246, 246],
        pulse4: [1144, 249, 246, 246],
        pulse5: [1506, 249, 246, 246],
        pulse6: [1868, 249, 246, 246],
    });
});

test('water pump marker uses the blue sheet with the same pulse frames', () => {
    assert.equal(level1Assets.waterPumpAction?.file, 'effects/water-pump-action.png');
    assert.deepEqual(
        level1Assets.waterPumpAction?.frames,
        level1Assets.actionMarker.frames,
    );
});

test('all firefighter animations provide six frames', () => {
    for (const animation of Object.values(firefighterAnimations)) {
        assert.equal(animation.frames.length, 6);
    }

    assert.deepEqual(level1Assets.firefighterWalk.frames['walk-south-1'], [0, 190, 181, 260]);
    assert.deepEqual(level1Assets.firefighterWalk.frames['walk-north-1'], [0, 725, 181, 260]);
    assert.deepEqual(level1Assets.firefighterIdle.frames['idle-south-1'], [0, 190, 181, 260]);
    assert.deepEqual(level1Assets.firefighterIdle.frames['idle-west-6'], [905, 990, 181, 260]);
    assert.deepEqual(level1Assets.firefighterSpray.frames['spray-north-1'], [0, 0, 181, 181]);
    assert.deepEqual(level1Assets.firefighterSpray.frames['spray-north-east-1'], [0, 181, 181, 180]);
    assert.deepEqual(level1Assets.firefighterSpray.frames['spray-east-1'], [0, 361, 181, 160]);
    assert.deepEqual(level1Assets.firefighterSpray.frames['spray-north-west-6'], [905, 1180, 181, 175]);
    assert.deepEqual(level1Assets.firefighterSpray.pivots['spray-north-1'], [0.619, 0.972]);
    assert.deepEqual(level1Assets.firefighterSpray.pivots['spray-north-6'], [0.392, 0.972]);
    assert.deepEqual(level1Assets.firefighterSpray.pivots['spray-south-1'], [0.572, 0.611]);
    assert.deepEqual(level1Assets.firefighterRespawn.frames['reset-1'], [0, 180, 256, 310]);
    assert.deepEqual(level1Assets.firefighterRespawn.frames['spawn-6'], [1280, 540, 256, 340]);

    assert.equal(firefighterAnimations['walk-east'].texture, 'firefighterWalk');
    assert.equal(firefighterAnimations['idle-north'].texture, 'firefighterIdle');
    assert.equal(firefighterAnimations['spray-west'].texture, 'firefighterSpray');
    assert.equal(firefighterAnimations['spray-south-east'].texture, 'firefighterSpray');
    assert.deepEqual(firefighterAnimations.reset.frames, [
        'reset-6',
        'reset-5',
        'reset-4',
        'reset-3',
        'reset-2',
        'reset-1',
    ]);
    assert.equal(firefighterAnimations.spawn.texture, 'firefighterRespawn');
});

test('both post NPC sheets provide idle and water action animations', () => {
    assert.deepEqual(level1Assets.npcPost1.frames['idle-1'], [0, 0, 200, 200]);
    assert.deepEqual(level1Assets.npcPost1.frames['give-water-6'], [1000, 200, 200, 200]);
    assert.deepEqual(level1Assets.npcPost1.pivots['idle-1'], [0.478, 0.925]);
    assert.equal(level1Assets.npcPost1.pivots['idle-4'], undefined);
    assert.deepEqual(level1Assets.npcPost1.pivots['give-water-1'], [0.613, 0.935]);
    assert.deepEqual(level1Assets.npcPost1.pivots['give-water-6'], [0.61, 0.92]);
    assert.deepEqual(level1Assets.npcPost2.frames['idle-1'], [0, 0, 200, 200]);
    assert.deepEqual(level1Assets.npcPost2.frames['receive-water-4'], [600, 200, 200, 200]);
    assert.deepEqual(level1Assets.npcPost2.pivots['idle-1'], [0.47, 0.93]);
    assert.equal(level1Assets.npcPost2.pivots['idle-4'], undefined);
    assert.deepEqual(level1Assets.npcPost2.pivots['receive-water-1'], [0.433, 0.93]);
    assert.deepEqual(level1Assets.npcPost2.pivots['receive-water-4'], [0.445, 0.93]);
    assert.equal(npcAnimations['post1-give-water'].texture, 'npcPost1');
    assert.equal(npcAnimations['post2-receive-water'].texture, 'npcPost2');
    assert.equal(npcAnimations['post1-idle'].repeat, -1);
    assert.deepEqual(npcAnimations['post1-idle'].frames, ['idle-1', 'idle-2', 'idle-3']);
    assert.equal(npcAnimations['post1-idle'].frameRate, 5);
    assert.equal(npcAnimations['post1-give-water'].frameRate, 8);
    assert.equal(npcAnimations['post2-idle'].repeat, -1);
    assert.deepEqual(npcAnimations['post2-idle'].frames, ['idle-1', 'idle-2', 'idle-3']);
    assert.deepEqual(npcAnimations['post2-receive-water'].frames, [
        'receive-water-1',
        'receive-water-2',
        'receive-water-3',
        'receive-water-4',
    ]);
    assert.equal(npcAnimations['post2-idle'].frameRate, 5);
    assert.equal(npcAnimations['post2-receive-water'].frameRate, 8);
});
