import test from 'node:test';
import assert from 'node:assert/strict';
import * as challengeModule from '../../resources/js/game/Level1Challenges.js';

test('reaching a Level 1 marker replaces movement code with the challenge placeholder once', () => {
    assert.equal(typeof challengeModule.getLevel1MarkerStarterCode, 'function');

    const getStarterCode = challengeModule.getLevel1MarkerStarterCode;

    assert.equal(getStarterCode({ challengeNumber: 1, hasReachedMarker: false, isAtMarker: true }), 'isi_air = ...');
    assert.equal(getStarterCode({ challengeNumber: 2, hasReachedMarker: false, isAtMarker: true }), 'isi_air = ...');
    assert.equal(getStarterCode({ challengeNumber: 3, hasReachedMarker: false, isAtMarker: true }), 'air_pos = ...');
    assert.equal(getStarterCode({ challengeNumber: 1, hasReachedMarker: true, isAtMarker: true }), null);
    assert.equal(getStarterCode({ challengeNumber: 1, hasReachedMarker: true, isAtMarker: false }), null);
    assert.equal(getStarterCode({ challengeNumber: 1, hasReachedMarker: false, isAtMarker: false }), null);
});
