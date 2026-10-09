// Semua lokasi tetap terlihat; lokasi challenge aktif lebih mudah ditemukan.
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
        return { visible: true, alpha: 0.45, size: scaledSize(18), outline: false };
    }

    return { visible: true, alpha: 0.68, size: scaledSize(20), outline: false };
}

export function showChallengeMarker(marker, outline, markerChallenge, currentChallenge, markerType = 'action') {
    const style = getChallengeMarkerStyle(markerChallenge, currentChallenge, markerType);
    marker.setVisible(style.visible).setAlpha(style.alpha).setDisplaySize(style.size, style.size);
    outline?.setVisible(style.outline);
}
