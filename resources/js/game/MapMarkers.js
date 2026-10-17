// Titik merah yang selesai disembunyikan; pompa biru tetap tersedia untuk isi ulang.
export function getMarkerTexture(markerType) {
    return markerType === 'pump' ? 'waterPumpAction' : 'actionMarker';
}

export function getChallengeMarkerStyle(markerChallenge, currentChallenge, markerType = 'action') {
    const markerScale = markerType === 'pump' ? 0.7 : 1;
    const scaledSize = (size) => Math.round(size * markerScale);

    if (markerChallenge === currentChallenge) {
        return { visible: true, alpha: 1, size: scaledSize(24), outline: false };
    }

    if (markerChallenge < currentChallenge) {
        return { visible: markerType === 'pump', alpha: 0.45, size: scaledSize(18), outline: false };
    }

    return { visible: true, alpha: 0.68, size: scaledSize(20), outline: false };
}

export function showChallengeMarker(marker, outline, markerChallenge, currentChallenge, markerType = 'action') {
    const style = getChallengeMarkerStyle(markerChallenge, currentChallenge, markerType);
    marker.setVisible(style.visible).setAlpha(style.alpha).setDisplaySize(style.size, style.size);
    outline?.setVisible(style.outline);
}

export function getFinishFootprint(x, y) {
    return { left: x - 18, top: y - 18, width: 36, height: 36 };
}

// Ubin kecil berada tepat di jalan dan tetap bisa diinjak karakter.
export function addFinishTile(scene, x, y) {
    const tile = scene.add.graphics().setPosition(x, y).setDepth(6);
    tile.fillStyle(0x123b32, 0.86).fillRect(-18, -18, 36, 36);
    tile.lineStyle(2, 0xf1cf79).strokeRect(-17, -17, 34, 34);
    for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 4; column += 1) {
            tile.fillStyle((row + column) % 2 === 0 ? 0xfff3d3 : 0x254238);
            tile.fillRect(-10 + column * 5, -10 + row * 5, 5, 5);
        }
    }
    return tile;
}
