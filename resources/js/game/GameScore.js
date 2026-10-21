export const CODE_ERROR_PENALTY = 5;
export const COLLISION_PENALTY = 10;

export function deductScore(score, penalty) {
    return Math.max(0, Math.min(100, score - penalty));
}

export function starsForScore(score, evaluationComplete) {
    if (!evaluationComplete || score < 70) return 0;
    if (score < 85) return 1;
    if (score < 100) return 2;
    return 3;
}

export function starsForFinish(score, missionComplete) {
    const stars = starsForScore(score, true);
    return missionComplete ? stars : Math.min(2, stars);
}

export function badgeForScore(levelNumber, score) {
    const stars = starsForScore(score, true);
    return {
        title: { 1: 'Ahli Variabel', 2: 'Penjaga Hutan', 3: 'Sahabat Bekantan' }[levelNumber],
        tier: ['Tuntas', 'Perunggu', 'Perak', 'Emas'][stars],
        style: ['complete', 'bronze', 'silver', 'gold'][stars],
    };
}

export function getLevelCompletionMessage(levelNumber, score) {
    const tier = badgeForScore(levelNumber, score).tier;
    const outcome = levelNumber < 3 ? `Level ${levelNumber + 1} terbuka!` : 'Penyelamatan tuntas!';
    return `Semua challenge dan evaluasi selesai. ${outcome} Lencana ${tier} diraih; nilai hanya menentukan kualitas lencana.`;
}

export function canFinishLevel(completedChallenges, currentChallenge, outcome, levelNumber = 1) {
    const completedTraining = [1, 2, 3].every(number => completedChallenges.has(number)
        || (currentChallenge === number && outcome.missionSuccess));
    const evaluationReached = currentChallenge === 4 || (levelNumber === 1 && currentChallenge === 3);
    return completedTraining && evaluationReached && outcome.reachedFinish && outcome.missionSuccess;
}
