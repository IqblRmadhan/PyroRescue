// Semua lokasi tetap terlihat; lokasi challenge aktif lebih mudah ditemukan.
export function getChallengeMarkerStyle(markerChallenge, currentChallenge) {
    if (markerChallenge === currentChallenge) {
        return { visible: true, alpha: 1, size: 24, outline: false };
    }

    if (markerChallenge < currentChallenge) {
        return { visible: true, alpha: 0.45, size: 18, outline: false };
    }

    return { visible: true, alpha: 0.68, size: 20, outline: false };
}

export function showChallengeMarker(marker, outline, markerChallenge, currentChallenge) {
    const style = getChallengeMarkerStyle(markerChallenge, currentChallenge);
    marker.setVisible(style.visible).setAlpha(style.alpha).setDisplaySize(style.size, style.size);
    outline?.setVisible(style.outline);
}
