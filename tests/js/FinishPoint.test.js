import test from 'node:test';
import assert from 'node:assert/strict';
import { getFinishFootprint } from '../../resources/js/game/FinishPoint.js';

test('FINISH stays inside its 40 pixel road tile instead of covering nearby trees', () => {
    const finish = getFinishFootprint(1580, 460);
    assert.ok(finish.left >= 1560);
    assert.ok(finish.top >= 440);
    assert.ok(finish.left + finish.width <= 1600);
    assert.ok(finish.top + finish.height <= 480);
    assert.equal(finish.left + finish.width / 2, 1580);
    assert.equal(finish.top + finish.height / 2, 460);
});
