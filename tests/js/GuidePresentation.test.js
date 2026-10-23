import test from 'node:test';
import assert from 'node:assert/strict';
import { splitGuideMission, tokenizeGuideMessage } from '../../resources/js/game/GuideMessage.js';
import { getGuidePresentation } from '../../resources/js/game/MissionGuide.js';

test('instruction code stays inline instead of becoming separate full-width blocks', () => {
    const parts = tokenizeGuideMessage('Gunakan for dan range() untuk mengulang semprot().');
    assert.deepEqual(parts.filter(part => part.type === 'code').map(part => part.text), [
        'for', 'range()', 'semprot()',
    ]);
});

test('Pos 1 arithmetic assignment stays together as one readable code snippet', () => {
    const parts = tokenizeGuideMessage('Di Pos 1 tulis isi_air = isi_air + 2 untuk menambah air.');
    assert.deepEqual(parts.filter(part => part.type === 'code').map(part => part.text), ['isi_air = isi_air + 2']);
});

test('mission text is separated from the dialogue explanation', () => {
    assert.deepEqual(
        splitGuideMission('semprot() menjalankan satu aksi. Misi: lakukan dua kali penyemprotan.'),
        {
            explanation: 'semprot() menjalankan satu aksi.',
            mission: 'lakukan dua kali penyemprotan.',
        },
    );
    assert.deepEqual(splitGuideMission('Pergi ke pompa.'), {
        explanation: 'Pergi ke pompa.',
        mission: '',
    });
});

test('Level 1 challenges receive field analogies and marker scaffolds', () => {
    const variable = getGuidePresentation({
        levelNumber: 1, challengeNumber: 1, state: { atPump: true, water: 0 },
    });
    assert.match(variable.analogy.title, /Tangki/);
    assert.equal(variable.code, 'isi_air = ...');

    const addition = getGuidePresentation({
        levelNumber: 1, challengeNumber: 2, state: { atPost1: true, water: 3 },
    });
    assert.match(addition.analogy.title, /Pertambahan/);
    assert.equal(addition.code, 'isi_air = isi_air + ...');
});

test('Level 2 loop challenges explain repetition with boxed steps', () => {
    const guide = getGuidePresentation({
        levelNumber: 2,
        challengeNumber: 2,
        state: { atFire: true, water: 4, sprays: 0 },
    });

    assert.match(guide.analogy.title, /Membedah for dan range/);
    assert.deepEqual(guide.analogy.rows.map(row => row.label), [
        'for', 'i', 'range(1)', 'Tanda :', 'Indentasi',
    ]);
    assert.equal(guide.code, '');
});

test('Level 2 travel instructions do not show lesson details before the fire marker', () => {
    const guide = getGuidePresentation({
        levelNumber: 2,
        challengeNumber: 1,
        state: { atPump: true, atFire: false, water: 0, sprays: 0 },
    });

    assert.equal(guide.analogy, null);
    assert.equal(guide.code, '');
});

test('evaluations provide an analogy without revealing a code scaffold', () => {
    for (const levelNumber of [1, 2, 3]) {
        const guide = getGuidePresentation({ levelNumber, challengeNumber: 4, state: {} });
        if (levelNumber === 2) assert.equal(guide.analogy, null);
        else assert.ok(guide.analogy, `Level ${levelNumber} needs an evaluation analogy`);
        assert.equal(guide.code, '');
    }
});
