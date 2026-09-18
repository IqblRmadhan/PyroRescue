import test from 'node:test';
import assert from 'node:assert/strict';
import CodeValidator from '../../resources/js/game/CodeValidator.js';

const validator = new CodeValidator();

test('assignment fills water without extinguishing the fire', () => {
    for (const water of [0, 2, 3]) {
        const result = validator.validateVariable(`jumlah_air = ${water}`, 2);
        assert.equal(result.syntaxValid, true);
        assert.equal(result.conceptValid, true);
        assert.equal(result.missionSuccess, false);
        assert.deepEqual(result.actions, {
            water,
            shouldSpray: false,
            commands: [{ type: 'setWater', amount: water }],
        });
    }
});

test('spraying exactly the required water succeeds', () => {
    const result = validator.validateVariable('jumlah_air = 2\nsemprot(jumlah_air)', 2);
    assert.equal(result.syntaxValid, true);
    assert.equal(result.missionSuccess, true);
    assert.deepEqual(result.actions, {
        water: 2,
        shouldSpray: true,
        commands: [{ type: 'setWater', amount: 2 }, { type: 'spray' }],
    });
});

test('insufficient water does not extinguish the fire', () => {
    for (const water of [0, 1]) {
        const result = validator.validateVariable(`jumlah_air = ${water}\nsemprot(jumlah_air)`, 2);
        assert.equal(result.syntaxValid, true);
        assert.equal(result.missionSuccess, false);
        assert.deepEqual(result.actions, {
            water,
            shouldSpray: true,
            commands: [{ type: 'setWater', amount: water }, { type: 'spray' }],
        });
    }
});

test('excess water is allowed and remains available after spraying', () => {
    for (const water of [3, 10]) {
        const result = validator.validateVariable(`jumlah_air = ${water}\nsemprot(jumlah_air)`, 2);
        assert.equal(result.syntaxValid, true);
        assert.equal(result.missionSuccess, true);
        assert.deepEqual(result.actions, {
            water,
            shouldSpray: true,
            commands: [{ type: 'setWater', amount: water }, { type: 'spray' }],
        });
    }
});

test('blank lines, Windows line endings, comments and spacing are supported', () => {
    const result = validator.validateVariable('# Isi air\r\njumlah_air\t= 2 # unit\r\n\r\nsemprot ( jumlah_air )\r\n', 2);
    assert.equal(result.missionSuccess, true);
});

test('invalid or unsupported code returns no actions, even after a valid prefix', () => {
    const invalidCodes = [
        '',
        '# komentar saja',
        'semprot(jumlah_air)',
        'semprot(jumlah_air)\njumlah_air = 2',
        'air = 2',
        'jumlah_air == 2',
        'jumlah_air = -2',
        'jumlah_air = 2.5',
        'jumlah_air = 02',
        'jumlah_air = 9007199254740992',
        'jumlah_air = "2"',
        'jumlah_air = 1 + 1',
        'jumlah_air = 2; alert(1)',
        'jumlah_air = 2\nsemprot(2)',
        'jumlah_air = 2\nsemprot(air)',
        'jumlah_air = 2\nsemprot(jumlah_air)\nimport os',
        'jumlah_air = 2\nsemprot(jumlah_air)\nsemprot(jumlah_air)',
        'jumlah_air = 2\nfor i in range(2):\n    semprot()',
        'jumlah_air = 2\nif jumlah_air == 2:\n    semprot(jumlah_air)',
    ];

    for (const code of invalidCodes) {
        const result = validator.validateVariable(code, 2);
        assert.equal(result.syntaxValid, false, code);
        assert.equal(result.missionSuccess, false, code);
        assert.equal(result.actions, null, code);
        assert.notEqual(result.message, '', code);
    }
});

test('a previous run does not supply variables to a later run', () => {
    validator.validateVariable('jumlah_air = 2\nsemprot(jumlah_air)', 2);
    const result = validator.validateVariable('semprot(jumlah_air)', 2);
    assert.equal(result.syntaxValid, false);
    assert.equal(result.actions, null);
});

test('movement sequence is returned in source order', () => {
    const code = [
        'jumlah_air = 2',
        'atas(3)',
        'kiri(2)',
        'kanan(1)',
        'bawah(1)',
        'semprot(jumlah_air)',
    ].join('\n');
    const result = validator.validateVariable(code, 2);

    assert.equal(result.syntaxValid, true);
    assert.deepEqual(result.actions.commands, [
        { type: 'setWater', amount: 2 },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'west' },
        { type: 'move', direction: 'west' },
        { type: 'move', direction: 'east' },
        { type: 'move', direction: 'south' },
        { type: 'spray' },
    ]);
});

test('assignment keeps its source order so movement can reach the pump first', () => {
    const result = validator.validateVariable([
        'atas(3)',
        'jumlah_air = 2',
    ].join('\n'), 2);

    assert.equal(result.syntaxValid, true);
    assert.deepEqual(result.actions.commands, [
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'setWater', amount: 2 },
    ]);
});

test('absolute movement works without declaring jumlah air', () => {
    const result = validator.validateVariable('kanan(2)', 2);

    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    assert.equal(result.missionSuccess, false);
    assert.deepEqual(result.actions, {
        water: 0,
        shouldSpray: false,
        commands: [
            { type: 'move', direction: 'east' },
            { type: 'move', direction: 'east' },
        ],
    });
});

test('unsupported movement and more than 120 commands are rejected', () => {
    const unsupported = validator.validateVariable('jumlah_air = 2\nmundur()', 2);
    const missingStepCount = validator.validateVariable('jumlah_air = 2\nkanan()', 2);
    const tooLong = validator.validateVariable('jumlah_air = 2\natas(121)', 2);

    assert.equal(unsupported.syntaxValid, false);
    assert.equal(unsupported.actions, null);
    assert.equal(missingStepCount.syntaxValid, false);
    assert.equal(missingStepCount.actions, null);
    assert.equal(tooLong.syntaxValid, false);
    assert.equal(tooLong.actions, null);
});
