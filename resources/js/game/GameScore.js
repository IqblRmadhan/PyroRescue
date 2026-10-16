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

export function badgeForScore(levelNumber, score) {
    const stars = starsForScore(score, true);
    return {
        title: { 1: 'Ahli Variabel', 2: 'Penjaga Hutan', 3: 'Sahabat Bekantan' }[levelNumber],
        tier: ['Tuntas', 'Perunggu', 'Perak', 'Emas'][stars],
        style: ['complete', 'bronze', 'silver', 'gold'][stars],
    };
}

export function canFinishLevel(completedChallenges, currentChallenge, outcome) {
    const completedTraining = [1, 2, 3].every(number => completedChallenges.has(number)
        || (currentChallenge === number && outcome.missionSuccess));
    return completedTraining && outcome.reachedFinish && outcome.missionSuccess;
}
