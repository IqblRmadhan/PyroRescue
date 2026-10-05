// Satu gerbang FINISH dipakai di kedua level agar tujuan akhir mudah dikenali.
export function addFinishGate(scene, x, y) {
    const shadow = scene.add.ellipse(0, -20, 90, 12, 0x0b3028, 0.32);
    const gate = scene.add.image(0, 0, 'finishGate')
        .setOrigin(0.5, 1)
        .setDisplaySize(120, 120);
    const leftLantern = scene.add.circle(-24, -65, 5, 0xffcd68, 0.2);
    const rightLantern = scene.add.circle(24, -65, 5, 0xffcd68, 0.2);

    const board = scene.add.graphics();
    board.fillStyle(0x123b3b, 0.96).fillRoundedRect(-48, -135, 96, 29, 5);
    board.lineStyle(2, 0xf5cf79).strokeRoundedRect(-48, -135, 96, 29, 5);
    board.fillStyle(0xf5cf79).fillTriangle(-6, -106, 6, -106, 0, -99);
    const label = scene.add.text(0, -120, 'FINISH', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#fffbea',
        stroke: '#0a2931',
        strokeThickness: 2,
        resolution: 2,
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: [leftLantern, rightLantern],
        alpha: 0.55,
        duration: 1200,
        yoyo: true,
        repeat: -1,
    });

    return scene.add.container(x, y, [shadow, gate, leftLantern, rightLantern, board, label])
        .setDepth(8.5);
}
