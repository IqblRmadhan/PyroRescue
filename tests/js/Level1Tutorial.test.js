import test from 'node:test';
import assert from 'node:assert/strict';
import {
    level1SequenceTutorialSteps,
    level1TutorialSteps,
} from '../../resources/js/game/Level1Tutorial.js';

test('opening tutorial teaches movement sequences before the first mission', () => {
    assert.equal(level1SequenceTutorialSteps.length, 3);
    assert.equal(level1SequenceTutorialSteps[0].mapFocus, 'water');
    assert.equal(level1SequenceTutorialSteps[1].target, '#code-editor');
    assert.match(level1SequenceTutorialSteps[1].text, /atas\(\.\.\.\).*kanan\(\.\.\.\).*atas\(\.\.\.\)/s);
    assert.equal(level1SequenceTutorialSteps[2].target, '.game-buttons');
    assert.match(level1SequenceTutorialSteps[2].nextLabel, /coba/i);
});

test('full help remains available after onboarding', () => {
    assert.ok(level1TutorialSteps.length > level1SequenceTutorialSteps.length);
    assert.ok(level1TutorialSteps.some(step => step.target === '.game-hud'));
    assert.ok(level1TutorialSteps.some(step => step.mapFocus === 'finish'));
});
