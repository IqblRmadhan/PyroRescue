import test from 'node:test';
import assert from 'node:assert/strict';
import { explainLevel1Code } from '../../resources/js/game/Level1Learning.js';

test('explanations keep source line numbers and describe arguments and comments', () => {
    const lines = explainLevel1Code('# menuju pompa\r\n\r\natas(3)\r\nisi_air = 3');
    assert.deepEqual(lines.map((line) => line.number), [1, 3, 4]);
    assert.match(lines[0].text, /Komentar/);
    assert.match(lines[1].text, /3 petak/);
    assert.match(lines[2].text, /bilangan bulat 3/);
});

test('invalid or unavailable commands never receive a valid action explanation', () => {
    for (const code of ['maju(2)', 'atas(0)', 'atas(121)', 'isi_air = -1', 'import os']) {
        assert.equal(explainLevel1Code(code)[0].invalid, true, code);
    }
    assert.equal(explainLevel1Code('air_pos_2 = isi_air', 1)[0].invalid, true);
    assert.equal(explainLevel1Code('isi_air = 5', 3)[0].invalid, true);
});

test('assignment explains replacement and separates Python assignment from game transfer', () => {
    assert.match(explainLevel1Code('isi_air = 5 # bantuan', 2)[0].text, /diganti.*bukan ditambah/);
    assert.match(explainLevel1Code('isi_air = 4', 2)[0].text, /Target challenge ini adalah 5/);
    const transfer = explainLevel1Code('air_pos_2 = isi_air', 3)[0];
    assert.equal(transfer.invalid, false);
    assert.match(transfer.text, /Pengosongan ini adalah aturan game/);
});
