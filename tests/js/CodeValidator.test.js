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

test('Challenge 2 only travels to Pos 1 without reassigning water', () => {
    const movement = validator.validateVariable('atas(2)\nkanan(8)\nbawah(1)', 5, 2);
    assert.equal(movement.syntaxValid, true);
    assert.equal(movement.conceptValid, true);
    assert.ok(movement.actions.commands.every(command => command.type === 'move'));
    for (const amount of [3, 5]) {
        const result = validator.validateVariable('isi_air = ' + amount, 5, 2);
        assert.equal(result.actions, null);
        assert.match(result.message, /Tidak perlu mengubah/);
    }
});

test('Challenge 3 transfers the existing isi_air value to Pos 2', () => {
    const result = validator.validateVariable(
        'kanan(6)\natas(7)\nkanan(4)\nair_pos = isi_air',
        5,
        3,
    );

    assert.equal(result.syntaxValid, true);
    assert.equal(result.missionSuccess, true);
    assert.deepEqual(result.actions.commands.at(-1), { type: 'transferWater' });

    for (const invalidCode of [
        'isi_air = 5',
        'air_pos = 5',
        'air_pos_2 = isi_air',
        'air_pos = isi_air\nair_pos = isi_air',
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
        'atas(3)',
        'kiri(2)',
        'kanan(1)',
        'bawah(1)',
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
        'atas(3)',
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
    const unsupported = validator.validateVariable('isi_air = 3\nmaju(1)', 3);
    const oldBackwardCommand = validator.validateVariable('isi_air = 3\nmundur(1)', 3);
    const missingStepCount = validator.validateVariable('isi_air = 3\nkanan()', 3);
    const tooLong = validator.validateVariable('isi_air = 3\natas(121)', 3);

    assert.equal(unsupported.syntaxValid, false);
    assert.equal(unsupported.actions, null);
    assert.equal(oldBackwardCommand.syntaxValid, false);
    assert.equal(oldBackwardCommand.actions, null);
    assert.equal(missingStepCount.syntaxValid, false);
    assert.equal(missingStepCount.actions, null);
    assert.equal(tooLong.syntaxValid, false);
    assert.equal(tooLong.actions, null);
});

test('Level 1 evaluation accepts movement to FINISH and rejects new assignments', () => {
    const movement = validator.validateVariable('kanan(15)', 5, 4);
    assert.equal(movement.syntaxValid, true);
    assert.equal(movement.conceptValid, true);
    assert.equal(movement.actions.commands.length, 15);
    assert.equal(validator.validateVariable('isi_air = 5', 5, 4).syntaxValid, false);
});

test('Level 1 rejects split identifiers, split numbers, and unexpected indentation', () => {
    for (const code of ['isi_ air = 3', 'i s i _ a i r = 3', 'isi_air = 1 2',
        'ka nan(1)', 'kanan(1 2)', '    isi_air = 3', '\tkanan(1)']) {
        const result = validator.validateVariable(code, 3);
        assert.equal(result.syntaxValid, false, code);
        assert.equal(result.actions, null, code);
        assert.ok(result.message, code);
    }
    assert.equal(validator.validateVariable('kanan ( 2 )\nisi_air\t=\t3', 3).missionSuccess, true);
    assert.equal(validator.validateVariable('air_ pos = isi_air', 5, 3).syntaxValid, false);
    assert.equal(validator.validateVariable('air_pos = isi_ air', 5, 3).syntaxValid, false);
});

test('Level 1 action limit includes assignment and transfer in either order', () => {
    for (const [assignment, challenge] of [['isi_air = 3', 1], ['air_pos = isi_air', 3]]) {
        for (const steps of [119, 120]) {
            for (const code of [`kanan(${steps})\n${assignment}`, `${assignment}\nkanan(${steps})`]) {
                const result = validator.validateVariable(code, 3, challenge);
                assert.equal(result.syntaxValid, steps === 119, code);
                if (steps === 119) assert.equal(result.actions.commands.length, 120);
                else assert.equal(result.actions, null);
            }
        }
    }
});
