import test from 'node:test';
import assert from 'node:assert/strict';
import CodeValidator from '../../resources/js/game/CodeValidator.js';

const validator = new CodeValidator();

test('evaluation accepts a fresh water variable and a variable controlled loop', () => {
    const water = validator.validateLoop('isi_air = 2', 2, 4);
    assert.deepEqual(water.actions.commands, [{ type: 'setWater', amount: 2 }]);
    const fire = validator.validateLoop('jumlah_semprot = 2\nfor i in range(jumlah_semprot):\n    semprot()', 2, 4);
    assert.equal(fire.missionSuccess, true);
    assert.equal(validator.validateLoop('isi_air = 6', 2, 4).syntaxValid, false);
    assert.equal(validator.validateLoop('for i in range(2):\n    semprot()', 2, 4).conceptValid, false);
});

test('Level 2 fills six units at the pump before spraying C1', () => {
    const result = validator.validateLoop(
        'kanan(17)\nbawah(2)\nisi_air = 6\nbawah(1)\nkanan(2)\nsemprot()\nsemprot()', 2, 1,
    );
    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    assert.equal(result.actions.commands[19].type, 'setWater');
    assert.equal(result.actions.commands[19].amount, 6);
    assert.deepEqual(result.actions.commands.slice(-2), [{ type: 'spray' }, { type: 'spray' }]);
    assert.match(validator.validateLoop('isi_air = 5', 2, 1).message, /2 untuk C1, 3 untuk C2, dan 1 untuk C3/);
});

test('Level 2 preserves movement order and expands a loop into individual sprays', () => {
    const result = validator.validateLoop('kanan(2)\nfor i in range(3):\n    semprot()', 3, 2);
    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    assert.equal(result.missionSuccess, true);
    assert.deepEqual(result.actions.commands, [
        { type: 'move', direction: 'east' }, { type: 'move', direction: 'east' },
        { type: 'spray' }, { type: 'spray' }, { type: 'spray' },
    ]);
});

test('Level 2 accepts direct sprays in the introduction and checks the exact count', () => {
    const enough = validator.validateLoop('semprot()\nsemprot()', 2, 1);
    assert.equal(enough.conceptValid, true);
    assert.equal(enough.missionSuccess, true);
    assert.equal(validator.validateLoop('semprot()', 2, 1).missionSuccess, false);
    assert.equal(validator.validateLoop('for i in range(4):\n    semprot()', 3, 2).missionSuccess, false);
});

test('later challenges require the requested learning concept', () => {
    assert.equal(validator.validateLoop('semprot()\nsemprot()\nsemprot()', 3, 2).conceptValid, false);
    assert.equal(validator.validateLoop('for i in range(1):\n    semprot()', 1, 3).conceptValid, false);
    const result = validator.validateLoop('jumlah_semprot = 1\nfor i in range(jumlah_semprot):\n    semprot()', 1, 3);
    assert.equal(result.conceptValid, true);
    assert.equal(result.missionSuccess, true);
    assert.equal(result.actions.sprayCount, 1);
});

test('movement alone remains valid so the player can approach a fire over multiple runs', () => {
    const result = validator.validateLoop('atas(3)', 3, 3);
    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    assert.equal(result.missionSuccess, false);
});

test('comments and CRLF preserve loop indentation', () => {
    const result = validator.validateLoop('# latihan\r\nfor i in range(2): # ulangi\r\n    # aksi\r\n    semprot()\r\n', 2, 2);
    assert.equal(result.missionSuccess, true);
    assert.equal(result.actions.sprayCount, 2);
});

test('unsupported Python and malformed loops never produce executable actions', () => {
    for (const code of [
        'import os', 'semprot(3)', 'for i in range(3)\n    semprot()',
        'for i in range(3):\nsemprot()', '    semprot()',
        'for i in range(jumlah_semprot):\n    semprot()',
        'for i in range(3):\n    kanan(1)', 'while True:\n    semprot()',
        'for i in range(3):\n    semprot()\n      semprot()',
        'jumlah_semprot = -1', 'for i in range(999999999):\n    semprot()',
        'kanan(121)', 'sem prot()', 'jumlah_ semprot = 2',
        'for pass in range(3):\n    semprot()', 'for None in range(3):\n    semprot()',
    ]) {
        const result = validator.validateLoop(code, 3, 2);
        assert.equal(result.syntaxValid, false, code);
        assert.equal(result.actions, null, code);
    }
});

test('the total expanded action budget includes all loops and movements', () => {
    const code = 'for i in range(60):\n    semprot()\nfor j in range(61):\n    semprot()';
    assert.equal(validator.validateLoop(code, 3, 2).syntaxValid, false);
});
