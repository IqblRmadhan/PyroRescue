import test from 'node:test';
import assert from 'node:assert/strict';
import { getChallengeMarkerStyle } from '../../resources/js/game/MapMarkers.js';

test('every challenge keeps a red location marker while the active petak is emphasized', () => {
    const active = getChallengeMarkerStyle(2, 2);
    const next = getChallengeMarkerStyle(3, 2);
    const completed = getChallengeMarkerStyle(1, 2);

    assert.equal(active.visible, true);
    assert.equal(next.visible, true);
    assert.equal(completed.visible, true);
    assert.equal(active.outline, true);
    assert.equal(next.outline, false);
    assert.ok(active.alpha > next.alpha);
    assert.ok(next.alpha > completed.alpha);
});
