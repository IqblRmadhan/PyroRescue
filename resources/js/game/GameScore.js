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
