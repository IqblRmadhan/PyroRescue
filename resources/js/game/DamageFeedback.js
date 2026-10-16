// Efek hanya menyentuh karakter dan kamera peta, bukan editor atau HUD.
export function playCollisionFeedback(scene, overlay, reducedMotion = false) {
    const player = scene.player;
    player.setTint(0xff5555);

    if (!reducedMotion) scene.cameras.main.shake(220, 0.004, true);
    const flash = overlay.animate(
        [{ opacity: 0 }, { opacity: reducedMotion ? 0.25 : 0.7, offset: 0.15 }, { opacity: 0 }],
        { duration: 360, easing: 'ease-out' },
    );

    return new Promise((resolve) => {
        const timer = scene.time.delayedCall(360, finish);

        function finish() {
            timer.remove();
            flash.cancel();
            if (player.active) player.clearTint();
            scene.events.off('shutdown', finish);
            resolve();
        }

        scene.events.once('shutdown', finish);
    });
}
