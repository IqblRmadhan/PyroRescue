import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { playCollisionFeedback } from '../../resources/js/game/DamageFeedback.js';

function createScene() {
    const state = { tint: null, shakes: 0, cancelled: false, timerRemoved: false };
    const scene = {
        player: {
            active: true,
            setTint(color) { state.tint = color; },
            clearTint() { state.tint = null; },
        },
        cameras: { main: { shake() { state.shakes += 1; } } },
        time: {
            delayedCall(delay, callback) {
                state.finish = callback;
                return { remove() { state.timerRemoved = true; } };
            },
        },
        events: new EventEmitter(),
    };
    const overlay = {
        animate(frames) {
            state.opacity = frames[1].opacity;
            return { cancel() { state.cancelled = true; } };
        },
    };
    return { scene, overlay, state };
}

test('damage briefly tints the player and shakes the map, then clears all effects', async () => {
    const { scene, overlay, state } = createScene();
    const done = playCollisionFeedback(scene, overlay);
    assert.equal(state.tint, 0xff5555);
    assert.equal(state.shakes, 1);
    state.finish();
    await done;
    assert.equal(state.tint, null);
    assert.equal(state.cancelled, true);
    assert.equal(state.timerRemoved, true);
    assert.equal(scene.events.listenerCount('shutdown'), 0);
});

test('reduced motion disables shaking and softens the red overlay', async () => {
    const { scene, overlay, state } = createScene();
    const done = playCollisionFeedback(scene, overlay, true);
    assert.equal(state.shakes, 0);
    assert.equal(state.opacity, 0.25);
    state.finish();
    await done;
});

test('scene shutdown cancels pending damage without leaving the Run waiting', async () => {
    const { scene, overlay, state } = createScene();
    const done = playCollisionFeedback(scene, overlay);
    scene.player.active = false;
    scene.events.emit('shutdown');
    await done;
    assert.equal(state.cancelled, true);
    assert.equal(state.timerRemoved, true);
    assert.equal(scene.events.listenerCount('shutdown'), 0);
});
