import test from 'node:test';
import assert from 'node:assert/strict';
import { getLevelImageAction } from '../../resources/js/game/LevelCarousel.js';

test('clicking a side island selects it without opening the level', () => {
    assert.deepEqual(getLevelImageAction({ isCurrent: false, href: '/game/2', index: 1 }), {
        type: 'select', index: 1,
    });
});

test('clicking the current playable island opens its level', () => {
    assert.deepEqual(getLevelImageAction({ isCurrent: true, href: '/game/1', index: 0 }), {
        type: 'navigate', href: '/game/1',
    });
});

test('clicking a current locked island does nothing', () => {
    assert.deepEqual(getLevelImageAction({ isCurrent: true, href: '', index: 2 }), { type: 'none' });
});
