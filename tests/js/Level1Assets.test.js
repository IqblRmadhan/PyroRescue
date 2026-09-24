import test from 'node:test';
import assert from 'node:assert/strict';
import {
    burningTreeFramesByWater,
    firefighterAnimations,
    level1Assets,
    level1MapShadowImage,
    npcAnimations,
} from '../../resources/js/game/Level1Assets.js';

test('level map shadow uses the dedicated Level 1 image', () => {
    assert.equal(level1MapShadowImage, 'maps/shadow_level1.png');
});

test('healthy tree is row 1 column 1 and is excluded from small fire frames', () => {
    assert.deepEqual(level1Assets.burningTree.frames.healthy, [0, 0, 40, 40]);
    assert.deepEqual(burningTreeFramesByWater[1], ['small1', 'small2', 'small3']);
    assert.equal(burningTreeFramesByWater[1].includes('healthy'), false);
});

test('tree fire rows match the required water amount', () => {
    assert.deepEqual(burningTreeFramesByWater[2], ['medium1', 'medium2', 'medium3', 'medium4']);
    assert.deepEqual(burningTreeFramesByWater[3], ['large1', 'large2', 'large3', 'large4']);

    for (const frame of burningTreeFramesByWater[2]) {
        assert.equal(level1Assets.burningTree.frames[frame][1], 40);
    }

    for (const frame of burningTreeFramesByWater[3]) {
        assert.equal(level1Assets.burningTree.frames[frame][1], 80);
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
    assert.deepEqual(level1Assets.npcPost2.frames['idle-1'], [0, 0, 296, 444]);
    assert.deepEqual(level1Assets.npcPost2.frames['receive-water-6'], [1478, 444, 296, 443]);
    assert.equal(npcAnimations['post1-give-water'].texture, 'npcPost1');
    assert.equal(npcAnimations['post2-receive-water'].texture, 'npcPost2');
    assert.equal(npcAnimations['post1-idle'].repeat, -1);
    assert.deepEqual(npcAnimations['post1-idle'].frames, ['idle-1', 'idle-2', 'idle-3']);
    assert.equal(npcAnimations['post1-idle'].frameRate, 5);
    assert.equal(npcAnimations['post1-give-water'].frameRate, 8);
    assert.equal(npcAnimations['post2-idle'].repeat, -1);
});
