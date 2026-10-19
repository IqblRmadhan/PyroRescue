import test from 'node:test';
import assert from 'node:assert/strict';
import {
    enableDebugTeleport,
    isDebugInteractionTarget,
    isDebugTeleportGesture,
} from '../../resources/js/game/DebugTeleport.js';

test('debug teleport accepts Ctrl or Command with the primary mouse button', () => {
    assert.equal(isDebugTeleportGesture({ ctrlKey: true, metaKey: false, button: 0 }), true);
    assert.equal(isDebugTeleportGesture({ ctrlKey: false, metaKey: true, button: 0 }), true);
});

test('debug teleport ignores ordinary clicks and non-primary buttons', () => {
    assert.equal(isDebugTeleportGesture({ ctrlKey: false, metaKey: false, button: 0 }), false);
    assert.equal(isDebugTeleportGesture({ ctrlKey: true, metaKey: false, button: 2 }), false);
});

test('debug teleport converts a Ctrl-click to a walkable tile without opening UI', () => {
    let pointerHandler;
    let teleportedTo = null;
    let reportedTile = null;
    const notice = {
        setOrigin() { return this; },
        setScrollFactor() { return this; },
        setDepth() { return this; },
        destroy() {},
    };
    const scene = {
        cameras: { main: { getWorldPoint: () => ({ x: 260, y: 820 }) } },
        input: {
            on(event, handler) { if (event === 'pointerdown') pointerHandler = handler; },
            off() {},
        },
        events: { once() {} },
        add: { text: () => notice },
        scale: { width: 800, height: 500 },
        time: { delayedCall() {} },
    };

    enableDebugTeleport(scene, {
        worldToTile: (x, y) => ({ column: Math.floor(x / 40), row: Math.floor(y / 40) }),
        isWalkable: (column, row) => column === 6 && row === 20,
        teleport: (column, row) => { teleportedTo = { column, row }; },
        onTeleport: tile => { reportedTile = tile; },
    });
    pointerHandler({
        x: 100,
        y: 100,
        event: { ctrlKey: true, metaKey: false, button: 0, preventDefault() {} },
    });

    assert.deepEqual(teleportedTo, { column: 6, row: 20 });
    assert.deepEqual(reportedTile, { column: 6, row: 20 });
});

test('teleport responds only when Level 1 lands on the active interaction point', () => {
    assert.equal(isDebugInteractionTarget(1, 2, { atPost1: true }), true);
    assert.equal(isDebugInteractionTarget(1, 2, { atPost1: false }), false);
    assert.equal(isDebugInteractionTarget(1, 3, { atPost2: true }), true);
});

test('teleport recognizes Level 2 pumps and active fires as interaction points', () => {
    assert.equal(isDebugInteractionTarget(2, 1, { atPump: true }), true);
    assert.equal(isDebugInteractionTarget(2, 2, { atFire: true }), true);
    assert.equal(isDebugInteractionTarget(2, 2, {}), false);
});
