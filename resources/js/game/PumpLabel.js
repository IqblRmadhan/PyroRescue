// Penanda yang sama dipakai di kedua level agar pompa mudah dikenali.
export function addPumpLabel(scene, x, y) {
    const board = scene.add.graphics();
    board.fillStyle(0x102d35, 0.94).fillRoundedRect(-54, -13, 108, 26, 5);
    board.lineStyle(2, 0xf4c66d).strokeRoundedRect(-54, -13, 108, 26, 5);
    board.fillStyle(0xf4c66d).fillTriangle(-5, 13, 5, 13, 0, 20);

    const title = scene.add.text(0, 0, 'POMPA AIR', {
        fontFamily: 'PixelFont, monospace',
        fontSize: '14px',
        color: '#fff8df',
        stroke: '#102d35',
        strokeThickness: 2,
    }).setOrigin(0.5);

    return scene.add.container(x, y - 62, [board, title]).setDepth(12);
}
