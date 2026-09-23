import test from 'node:test';
import assert from 'node:assert/strict';
import CodeValidator from '../../resources/js/game/CodeValidator.js';

const validator = new CodeValidator();

test('isi_air with the required amount completes the variable challenge', () => {
    const result = validator.validateVariable('isi_air = 3', 3);

    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    assert.equal(result.missionSuccess, true);
    assert.deepEqual(result.actions, {
        water: 3,
        commands: [{ type: 'setWater', amount: 3 }],
    });
});

test('isi_air must contain exactly the amount requested by Challenge 1', () => {
    for (const water of [0, 2, 4, 10]) {
        const result = validator.validateVariable(`isi_air = ${water}`, 3);

        assert.equal(result.syntaxValid, true);
        assert.equal(result.missionSuccess, false);
        assert.deepEqual(result.actions, {
            water,
            commands: [{ type: 'setWater', amount: water }],
        });
    }
});

test('Challenge 2 updates isi_air from 3 to exactly 5', () => {
    const result = validator.validateVariable('kanan(2)\nmaju(6)\nkanan(8)\nisi_air = 5', 5, 2);

    assert.equal(result.syntaxValid, true);
    assert.equal(result.missionSuccess, true);
    assert.deepEqual(result.actions.commands.at(-1), { type: 'setWater', amount: 5 });

    const wrongAmount = validator.validateVariable('isi_air = 3', 5, 2);
    assert.equal(wrongAmount.syntaxValid, true);
    assert.equal(wrongAmount.missionSuccess, false);
});

test('Challenge 3 transfers the existing isi_air value to Pos 2', () => {
    const result = validator.validateVariable(
        'mundur(2)\nkanan(6)\nmaju(9)\nkanan(4)\nair_pos_2 = isi_air',
        5,
        3,
    );

    assert.equal(result.syntaxValid, true);
    assert.equal(result.missionSuccess, true);
    assert.deepEqual(result.actions.commands.at(-1), { type: 'transferWater' });

    for (const invalidCode of [
        'isi_air = 5',
        'air_pos_2 = 5',
        'air_pos = isi_air',
        'air_pos_2 = isi_air\nair_pos_2 = isi_air',
    ]) {
        const invalidResult = validator.validateVariable(invalidCode, 5, 3);
        assert.equal(invalidResult.syntaxValid, false, invalidCode);
        assert.equal(invalidResult.actions, null, invalidCode);
    }
});

test('blank lines, Windows line endings, comments and spacing are supported', () => {
    const result = validator.validateVariable('# Isi air\r\nisi_air\t= 3 # unit\r\n\r\n', 3);

    assert.equal(result.missionSuccess, true);
});

test('invalid, unsafe, and fire-extinguishing commands return no actions', () => {
    const invalidCodes = [
        '',
        '# komentar saja',
        'semprot(isi_air)',
        'jumlah_air = 3',
        'air = 3',
        'isi_air == 3',
        'isi_air = -3',
        'isi_air = 3.5',
        'isi_air = 03',
        'isi_air = 9007199254740992',
        'isi_air = "3"',
        'isi_air = 1 + 2',
        'isi_air = 3; alert(1)',
        'isi_air = 3\nimport os',
        'isi_air = 3\nfor i in range(3):\n    semprot()',
        'isi_air = 3\nif isi_air == 3:\n    semprot(isi_air)',
    ];

    for (const code of invalidCodes) {
        const result = validator.validateVariable(code, 3);
        assert.equal(result.syntaxValid, false, code);
        assert.equal(result.missionSuccess, false, code);
        assert.equal(result.actions, null, code);
        assert.notEqual(result.message, '', code);
    }
});

test('movement sequence is returned in source order', () => {
    const code = [
        'maju(3)',
        'kiri(2)',
        'kanan(1)',
        'mundur(1)',
        'isi_air = 3',
    ].join('\n');
    const result = validator.validateVariable(code, 3);

    assert.equal(result.syntaxValid, true);
    assert.deepEqual(result.actions.commands, [
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'west' },
        { type: 'move', direction: 'west' },
        { type: 'move', direction: 'east' },
        { type: 'move', direction: 'south' },
        { type: 'setWater', amount: 3 },
    ]);
});

test('assignment keeps its source order so movement can reach the pump first', () => {
    const result = validator.validateVariable([
        'maju(3)',
        'isi_air = 3',
    ].join('\n'), 3);

    assert.equal(result.syntaxValid, true);
    assert.deepEqual(result.actions.commands, [
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'move', direction: 'north' },
        { type: 'setWater', amount: 3 },
    ]);
});

test('movement tutorial works without declaring isi_air', () => {
    const result = validator.validateVariable('kanan(2)', 3);

    assert.equal(result.syntaxValid, true);
    assert.equal(result.conceptValid, true);
    assert.equal(result.missionSuccess, false);
    assert.deepEqual(result.actions, {
        water: 0,
        commands: [
            { type: 'move', direction: 'east' },
            { type: 'move', direction: 'east' },
        ],
    });
});

test('unsupported movement and more than 120 commands are rejected', () => {
    const unsupported = validator.validateVariable('isi_air = 3\natas(1)', 3);
    const missingStepCount = validator.validateVariable('isi_air = 3\nkanan()', 3);
    const tooLong = validator.validateVariable('isi_air = 3\nmaju(121)', 3);

    assert.equal(unsupported.syntaxValid, false);
    assert.equal(unsupported.actions, null);
    assert.equal(missingStepCount.syntaxValid, false);
    assert.equal(missingStepCount.actions, null);
    assert.equal(tooLong.syntaxValid, false);
    assert.equal(tooLong.actions, null);
});
