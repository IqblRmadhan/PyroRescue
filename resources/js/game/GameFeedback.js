export function getOutcomeFeedback(outcome = {}) {
    const isError = outcome.status === 'error'
        || (!outcome.status && outcome.missionSuccess === false);

    return {
        state: isError ? 'error' : 'info',
        playErrorCue: isError,
        visible: isError,
    };
}

export function shouldPlayTargetCue({
    isLevel2 = false,
    targetKey,
    suppressTargetAudio = false,
}) {
    if (suppressTargetAudio || targetKey === 'finish') return false;
    return !(isLevel2 && targetKey === 'fire');
}
