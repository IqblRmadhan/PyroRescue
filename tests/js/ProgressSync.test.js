import test from 'node:test';
import assert from 'node:assert/strict';
import ProgressSync from '../../resources/js/game/ProgressSync.js';

test('progress sends challenges in order even when a second completion arrives during saving', async t => {
    let release;
    const barrier = new Promise(resolve => { release = resolve; });
    const sent = [];
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        const payload = JSON.parse(options.body);
        sent.push(payload);
        if (payload.challenge === 1) await barrier;
        return { ok: true, json: async () => ({ saved: true }) };
    });
    const sync = new ProgressSync({ url: '/progress/challenge', token: 'test', level: 1, onStatus() {} });
    const first = sync.save(1);
    const second = sync.save(2);
    release();
    assert.equal(await first, true);
    assert.equal(await second, true);
    assert.deepEqual(sent, [{ level: 1, challenge: 1 }, { level: 1, challenge: 2 }]);
});

test('failed saves keep pending challenges for retry without reporting success', async t => {
    const statuses = [];
    let failing = true;
    t.mock.method(globalThis, 'fetch', async () => ({ ok: !failing, json: async () => ({ saved: true }) }));
    const sync = new ProgressSync({ url: '/progress/challenge', token: 'test', level: 1, onStatus: state => statuses.push(state) });
    assert.equal(await sync.save(1), false);
    assert.equal(sync.pending.has(1), true);
    failing = false;
    assert.equal(await sync.flush(), true);
    assert.equal(sync.pending.size, 0);
    assert.deepEqual(statuses, ['saving', 'error', 'saving', 'saved']);
});

test('final evaluation sends the percentage with the fourth challenge', async t => {
    let sent;
    t.mock.method(globalThis, 'fetch', async (_url, options) => {
        sent = JSON.parse(options.body);
        return { ok: true, json: async () => ({ saved: true }) };
    });
    const sync = new ProgressSync({ url: '/progress/challenge', token: 'test', level: 1, onStatus() {} });
    assert.equal(await sync.save(4, 85), true);
    assert.deepEqual(sent, { level: 1, challenge: 4, score: 85 });
});
