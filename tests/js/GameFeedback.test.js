import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPlayTargetCue } from '../../resources/js/game/GameFeedback.js';

test('dedicated completion sounds replace overlapping generic target cues', () => {
    assert.equal(shouldPlayTargetCue({ targetKey: 'finish' }), false);
    assert.equal(shouldPlayTargetCue({ isLevel2: true, targetKey: 'fire' }), false);
    assert.equal(shouldPlayTargetCue({ targetKey: 'water', suppressTargetAudio: true }), false);
    assert.equal(shouldPlayTargetCue({ targetKey: 'location' }), true);
});
