export function isDebugTeleportGesture(event = {}) {
    return Boolean(event.ctrlKey || event.metaKey) && event.button === 0;
}

export function isDebugInteractionTarget(levelNumber, challengeNumber, state = {}) {
    if (levelNumber === 1) {
        if (challengeNumber === 1) return Boolean(state.atPump);
        if (challengeNumber === 2) return Boolean(state.atPost1);
        if (challengeNumber === 3) return Boolean(state.atPost2);
        return Boolean(state.atFinish);
    }

    if (levelNumber === 2) {
        return Boolean(state.atPump || state.atFire || state.atFinish);
    }

    if (levelNumber === 3) {
        return Boolean(state.atObjective || state.reachedObjective);
    }

    return false;
}

function showTeleportNotice(scene, message, successful) {
    scene.debugTeleportMessage?.destroy();
    const notice = scene.add.text(scene.scale.width / 2, scene.scale.height - 34, message, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#fff',
        backgroundColor: successful ? '#17633fdd' : '#7a2e2edd',
        padding: { x: 12, y: 7 },
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(1000);

    scene.debugTeleportMessage = notice;
    scene.time.delayedCall(1800, () => {
        if (scene.debugTeleportMessage !== notice) return;
        notice.destroy();
        scene.debugTeleportMessage = null;
    });
}

export function enableDebugTeleport(scene, {
    worldToTile,
    isWalkable,
    teleport,
    onTeleport = () => {},
}) {
    function handlePointerDown(pointer) {
        const event = pointer.event;
        if (!isDebugTeleportGesture(event)) return;

        event.preventDefault();
        const worldPoint = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const tile = worldToTile(worldPoint.x, worldPoint.y);
        if (!isWalkable(tile.column, tile.row)) {
            showTeleportNotice(scene, `Petak (${tile.column}, ${tile.row}) tidak dapat diinjak`, false);
            return;
        }

        const result = teleport(tile.column, tile.row) ?? {};
        showTeleportNotice(scene, `Teleport uji ke petak (${tile.column}, ${tile.row})`, true);
        onTeleport({ column: tile.column, row: tile.row, ...result });
    }

    scene.input.on('pointerdown', handlePointerDown);
    scene.events.once('shutdown', () => scene.input.off('pointerdown', handlePointerDown));
}
