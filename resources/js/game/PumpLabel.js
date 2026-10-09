const labelThemes = {
    pump: {
        backgroundColor: 0x123d50,
        borderColor: 0xf4c66d,
        textColor: '#fff8df',
        strokeColor: '#082633',
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
    },
    post: {
        backgroundColor: 0x24523f,
        borderColor: 0xd9c06f,
        textColor: '#fff8df',
        strokeColor: '#0c2c20',
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
    },
    fire: {
        backgroundColor: 0x8c3028,
        borderColor: 0xffb071,
        textColor: '#fff8ed',
        strokeColor: '#3b1512',
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
    },
    fireInactive: {
        backgroundColor: 0x542722,
        borderColor: 0xd88a68,
        textColor: '#ffe9dc',
        strokeColor: '#2c1210',
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
    },
    completed: {
        backgroundColor: 0x205d42,
        borderColor: 0xa8e6b5,
        textColor: '#effff1',
        strokeColor: '#0c2c20',
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
    },
};

export function getMapLabelTheme(name) {
    return labelThemes[name] ?? labelThemes.pump;
}

// Label membesar secukupnya saat zoom keluar agar tinggi teks di layar tidak terlalu kecil.
export function getMapLabelScale(zoom) {
    if (!Number.isFinite(zoom) || zoom <= 0) return 1;

    return Math.max(1, 1 / zoom);
}

export function getPointerLabelGeometry(textWidth, placement = 'above') {
    const width = Math.max(108, Math.ceil(textWidth) + 22);
    const isBelowTarget = placement === 'below';

    return {
        board: { x: -width / 2, y: isBelowTarget ? 8 : -38, width, height: 30 },
        pointer: [-7, isBelowTarget ? 8 : -8, 7, isBelowTarget ? 8 : -8, 0, 0],
        textY: isBelowTarget ? 23 : -23,
    };
}

function addPointerLabel(scene, x, y, text, initialTheme, placement = 'above') {
    const board = scene.add.graphics();
    const title = scene.add.text(0, -23, text, {
        fontFamily: labelThemes.pump.fontFamily,
        fontSize: '15px',
        fontStyle: 'bold',
        color: labelThemes.pump.textColor,
        stroke: labelThemes.pump.strokeColor,
        strokeThickness: 2,
        resolution: 2,
    }).setOrigin(0.5);
    const container = scene.add.container(x, y, [board, title]).setDepth(12);
    let themeName = initialTheme;

    function redraw() {
        const theme = getMapLabelTheme(themeName);
        const geometry = getPointerLabelGeometry(title.width, placement);

        board.clear();
        board.fillStyle(theme.backgroundColor, 0.96)
            .fillRoundedRect(
                geometry.board.x,
                geometry.board.y,
                geometry.board.width,
                geometry.board.height,
                6,
            );
        board.lineStyle(2, theme.borderColor)
            .strokeRoundedRect(
                geometry.board.x,
                geometry.board.y,
                geometry.board.width,
                geometry.board.height,
                6,
            );
        board.fillStyle(theme.borderColor).fillTriangle(...geometry.pointer);
        title.setY(geometry.textY).setColor(theme.textColor).setStroke(theme.strokeColor, 2);
    }

    const label = {
        container,
        setText(nextText) {
            title.setText(nextText);
            redraw();
            return label;
        },
        setTheme(nextTheme) {
            themeName = nextTheme;
            redraw();
            return label;
        },
        setZoom(zoom) {
            container.setScale(getMapLabelScale(zoom));
            return label;
        },
    };

    redraw();
    return label;
}

// Ujung panah tetap berada di titik target ketika papan membesar saat zoom keluar.
export function getPumpLabelPosition(x, y) {
    return { x, y: y - 42 };
}

export function addPumpLabel(scene, x, y) {
    const position = getPumpLabelPosition(x, y);

    return addPointerLabel(scene, position.x, position.y, 'POMPA AIR', 'pump');
}

export function addFireLabel(scene, x, y, text = '', placement = 'above') {
    return addPointerLabel(scene, x, y, text, 'fire', placement);
}

export function addPostLabel(scene, x, y, text) {
    return addPointerLabel(scene, x, y, text, 'post');
}
