import test from 'node:test';
import assert from 'node:assert/strict';
import LearningPanel from '../../resources/js/game/LearningPanel.js';
import level1Challenges from '../../resources/js/game/Level1Challenges.js';
import level2Challenges from '../../resources/js/game/Level2Challenges.js';

function renderLesson(challenges, challengeNumber) {
    const fields = new Map();
    const root = {
        querySelector(selector) {
            if (!fields.has(selector)) fields.set(selector, { textContent: '' });
            return fields.get(selector);
        },
        querySelectorAll() { return []; },
    };
    new LearningPanel(root, challenges).setChallenge(challengeNumber);
    return Object.fromEntries([...fields].map(([key, field]) => [key, field.textContent]));
}

test('Level 1 evaluation shows its own FINISH explanation', () => {
    const lesson = renderLesson(level1Challenges, 4);
    assert.match(lesson['#lesson-title'], /FINISH/);
    assert.match(lesson['#lesson-explanation'], /perintah gerak/);
});

test('other evaluations keep the previous learning material when no evaluation lesson exists', () => {
    const lesson = renderLesson(level2Challenges, 4);
    assert.equal(lesson['#lesson-explanation'], level2Challenges[3].lesson);
    assert.equal(lesson['#lesson-code'], level2Challenges[3].example);
});
