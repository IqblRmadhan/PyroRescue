import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForStoryImages } from '../../resources/js/PageLoader.js';

test('story loading waits until every image can be decoded', async () => {
    let finishFirst;
    let finished = false;
    const first = { decode: () => new Promise(resolve => { finishFirst = resolve; }) };
    const second = { decode: () => Promise.resolve() };
    const waiting = waitForStoryImages({ querySelectorAll: () => [first, second] });
    waiting.then(() => { finished = true; });
    await Promise.resolve();
    assert.equal(finished, false);
    finishFirst();
    await waiting;
    assert.equal(finished, true);
});

test('story loading continues if an image is broken or stalls', async () => {
    const broken = { decode: () => Promise.reject(new Error('missing image')) };
    const stalled = { decode: () => new Promise(() => {}) };
    await waitForStoryImages({ querySelectorAll: () => [broken, stalled] }, 5);
});
