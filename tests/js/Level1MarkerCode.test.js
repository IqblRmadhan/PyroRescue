import test from 'node:test';
import assert from 'node:assert/strict';
import * as challengeModule from '../../resources/js/game/Level1Challenges.js';

test('stopping on a Level 1 marker offers its placeholder only once per challenge', () => {
    assert.equal(typeof challengeModule.getLevel1MarkerStarterCode, 'function');

    const getStarterCode = challengeModule.getLevel1MarkerStarterCode;

    assert.equal(getStarterCode({ challengeNumber: 1, hasShownStarterCode: false, isAtMarker: true }), 'isi_air = ...');
    assert.equal(getStarterCode({ challengeNumber: 2, hasShownStarterCode: false, isAtMarker: true }), null);
    assert.equal(getStarterCode({ challengeNumber: 3, hasShownStarterCode: false, isAtMarker: true }), 'air_pos = ...');
    assert.equal(getStarterCode({ challengeNumber: 1, hasShownStarterCode: true, isAtMarker: true }), null);
    assert.equal(getStarterCode({ challengeNumber: 1, hasShownStarterCode: true, isAtMarker: false }), null);
    assert.equal(getStarterCode({ challengeNumber: 1, hasShownStarterCode: false, isAtMarker: false }), null);
});
