import test from 'node:test';
import assert from 'node:assert/strict';
import * as MapMarkers from '../../resources/js/game/MapMarkers.js';

const { getChallengeMarkerStyle, getMarkerTexture } = MapMarkers;

test('every challenge keeps a red location marker without a yellow tile outline', () => {
    const active = getChallengeMarkerStyle(2, 2);
    const next = getChallengeMarkerStyle(3, 2);
    const completed = getChallengeMarkerStyle(1, 2);

    assert.equal(active.visible, true);
    assert.equal(next.visible, true);
    assert.equal(completed.visible, true);
    assert.equal(active.outline, false);
    assert.equal(next.outline, false);
    assert.ok(active.alpha > next.alpha);
    assert.ok(next.alpha > completed.alpha);
});

test('only water pump locations use the blue action marker', () => {
    assert.equal(getMarkerTexture?.('pump'), 'waterPumpAction');
    assert.equal(getMarkerTexture?.('fire'), 'actionMarker');
    assert.equal(getMarkerTexture?.('finish'), 'actionMarker');
    assert.equal(getMarkerTexture?.('post'), 'actionMarker');
});

test('water pump markers stay 30 percent smaller in every challenge state', () => {
    assert.equal(getChallengeMarkerStyle(2, 2, 'pump').size, 17);
    assert.equal(getChallengeMarkerStyle(3, 2, 'pump').size, 14);
    assert.equal(getChallengeMarkerStyle(1, 2, 'pump').size, 13);

    assert.equal(getChallengeMarkerStyle(2, 2, 'post').size, 24);
    assert.equal(getChallengeMarkerStyle(3, 2, 'post').size, 20);
    assert.equal(getChallengeMarkerStyle(1, 2, 'post').size, 18);
});
