import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getChallengeBridge,
    getGuideInstruction,
    explainExecutedCommands,
    GuideDialogue,
} from '../../resources/js/game/MissionGuide.js';

test('challenge conversations connect the previous technique to the next concept', () => {
    const loopBridge = getChallengeBridge(2, 1);
    assert.match(loopBridge.message, /100/);
    assert.match(loopBridge.message, /semprot\(\).*100 kali/s);
    assert.match(loopBridge.message, /for.*range\(\)/s);
    assert.deepEqual(loopBridge.analogy.rows.map(row => row.label), [
        'Baru dilakukan', 'Masalah', 'Solusi berikutnya',
    ]);

    for (const levelNumber of [1, 2, 3]) {
        for (const challengeNumber of [1, 2, 3]) {
            assert.ok(getChallengeBridge(levelNumber, challengeNumber));
        }
        assert.equal(getChallengeBridge(levelNumber, 4), null);
    }
});

test('Level 1 guidance follows the current location and delivered water', () => {
    const instruction = (challengeNumber, state) => getGuideInstruction({ levelNumber: 1, challengeNumber, state });
    assert.match(instruction(1, {}), /Pergi ke pompa/);
    assert.match(instruction(1, { atPump: true }), /isi_air = 3/);
    assert.match(instruction(2, { water: 3 }), /Pergi ke Pos 1/);
    assert.match(instruction(2, { water: 3, atPost1: true }), /isi_air = isi_air \+ 2/);
    assert.match(instruction(2, { water: 5, atPost1: true }), /Penjumlahan selesai/);
    assert.match(instruction(3, { water: 5 }), /Pergi ke Pos 2/);
    assert.match(instruction(3, { water: 5, atPost2: true }), /air_pos = isi_air/);
    assert.match(instruction(3, { water: 0, postWater: 5, hasDeliveredWater: true }), /FINISH/);
    // Visiting a marker earlier must not imply the player is still there.
    assert.match(instruction(2, { water: 3, atPost1: false }), /Pergi ke Pos 1/);
});

test('Level 2 guides pumping, approaching fires, and the remaining sprays', () => {
    const instruction = (challengeNumber, state) => getGuideInstruction({ levelNumber: 2, challengeNumber, state });
    assert.match(instruction(1, { water: 0 }), /pompa/);
    assert.match(instruction(1, { water: 0, atPump: true }), /isi_air = 6/);
    assert.match(instruction(1, { water: 6 }), /api tengah/);
    assert.match(instruction(1, { water: 5, sprays: 1, atFire: true }), /1 semprotan/);
    assert.match(instruction(2, { water: 4, atFire: true }), /for/);
    assert.match(instruction(3, { water: 3, atFire: true }), /jumlah_semprot/);
    assert.match(instruction(3, { water: 0 }), /pompa/);
});

test('evaluation dialogue gives objectives without code answers or teaching feedback', () => {
    for (const state of [{}, { atPump: true }, { water: 3 }, { water: 3, atFire: true }, { fireOut: true }]) {
        const message = getGuideInstruction({ levelNumber: 2, challengeNumber: 4, state });
        assert.doesNotMatch(message, /isi_air|jumlah_semprot|range\(|semprot\(/);
    }
    assert.match(getGuideInstruction({ levelNumber: 2, challengeNumber: 4, state: { fireOut: true } }), /FINISH/);
    assert.deepEqual(explainExecutedCommands({ levelNumber: 2, challengeNumber: 4, commands: [{ type: 'spray' }] }), []);
});

test('completed movement does not create popup feedback', () => {
    const messages = explainExecutedCommands({
        levelNumber: 1, challengeNumber: 1, initialWater: 0,
        code: 'atas(3)\nisi_air = 3',
        commands: [{ type: 'move', direction: 'north' }, { type: 'move', direction: 'north' }],
    });
    assert.deepEqual(messages, []);
});

test('addition and transfer explain value changes in source order', () => {
    const messages = explainExecutedCommands({
        levelNumber: 1, challengeNumber: 2, initialWater: 3,
        commands: [{ type: 'addWater', amount: 2 }],
    });
    assert.match(messages[0], /isi_air = isi_air \+ 2/);
    assert.match(messages[0], /3 \+ 2 = 5/);
    const transfer = explainExecutedCommands({
        levelNumber: 1, challengeNumber: 3, initialWater: 5,
        commands: [{ type: 'transferWater' }, { type: 'clearWater' }],
    });
    assert.match(transfer[0], /menyalin nilai 5/);
    assert.match(transfer[0], /isi_air masih 5/);
    assert.match(transfer[1], /isi_air = 0/);
});

test('loop feedback uses the submitted code and actual executed spray count', () => {
    const messages = explainExecutedCommands({
        levelNumber: 2, challengeNumber: 3, initialWater: 3,
        code: 'jumlah_semprot = 3\nfor i in range(jumlah_semprot):\n    semprot()',
        commands: [{ type: 'spray' }, { type: 'spray' }],
    });
    assert.match(messages[0], /jumlah_semprot/);
    assert.match(messages[0], /2 semprotan berhasil/);
    assert.match(messages[0], /3 menjadi 1/);
});

test('dialogue waits for every explanation before advancing the challenge', () => {
    const dialogue = new GuideDialogue();
    let advanced = 0;
    dialogue.start([{ message: 'Bergerak' }, { message: 'Mengisi air' }], () => { advanced += 1; });
    assert.equal(dialogue.current.message, 'Bergerak');
    dialogue.next();
    assert.equal(dialogue.current.message, 'Mengisi air');
    assert.equal(advanced, 0);
    dialogue.next();
    assert.equal(dialogue.current, null);
    assert.equal(advanced, 1);
    dialogue.next();
    assert.equal(advanced, 1);
});

test('empty dialogue completes immediately without requesting a popup', () => {
    const dialogue = new GuideDialogue();
    let completed = false;

    const shouldOpen = dialogue.start([], () => { completed = true; });

    assert.equal(shouldOpen, false);
    assert.equal(completed, true);
    assert.equal(dialogue.current, null);
});

test('arriving at a target requests the updated instruction popup', () => {
    const dialogue = new GuideDialogue();

    const shouldOpen = dialogue.start([], () => {}, {
        instructionBefore: 'Pergi ke pompa air.',
        instructionAfter: 'Kamu sudah di pompa! Tulis isi_air = 3.',
    });

    assert.equal(shouldOpen, true);
    assert.equal(dialogue.current, null);
});

test('reset discards pending explanations and prevents a stale challenge advance', () => {
    const dialogue = new GuideDialogue();
    let advanced = false;
    dialogue.start([{ message: 'Selesai' }], () => { advanced = true; });
    dialogue.reset();
    dialogue.next();
    assert.equal(dialogue.current, null);
    assert.equal(advanced, false);
});
