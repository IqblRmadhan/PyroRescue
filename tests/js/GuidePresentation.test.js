import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeGuideMessage } from '../../resources/js/game/GuideMessage.js';
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

    assert.match(guide.analogy.title, /Penyemprot Otomatis/);
    assert.ok(guide.analogy.rows.length >= 3);
    assert.match(guide.code, /for i in range/);
});

test('evaluations provide an analogy without revealing a code scaffold', () => {
    for (const levelNumber of [1, 2, 3]) {
        const guide = getGuidePresentation({ levelNumber, challengeNumber: 4, state: {} });
        assert.ok(guide.analogy, `Level ${levelNumber} needs an evaluation analogy`);
        assert.equal(guide.code, '');
    }
});
