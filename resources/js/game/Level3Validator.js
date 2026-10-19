// Parser subset Python: seluruh cabang dibaca tanpa menjalankan kode pemain.
const LIMIT = 120;
const WORLD = ['isi_air', 'kebutuhan_air', 'api_padam', 'hewan_terjebak', 'jalur_aman'];
const BOOLEANS = WORLD.slice(2);
const RESERVED = new Set('False True None and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield range semprot selamatkan_hewan lanjut_patroli maju mundur atas bawah kanan kiri'.split(' '));
const DIRECTIONS = { maju: 'north', atas: 'north', mundur: 'south', bawah: 'south', kanan: 'east', kiri: 'west' };
const fail = (message) => { throw new Error(message); };
const integer = (value, maximum = LIMIT) => {
    if (!Number.isSafeInteger(value) || value < 0 || value > maximum) fail(`Gunakan bilangan bulat 0 sampai ${maximum}.`);
    return value;
};
function localName(name) {
    if (WORLD.includes(name) || RESERVED.has(name) || name.startsWith('__')) fail(`Variabel ${name} tidak boleh diubah.`);
}

export function validateLevel3(code, requiredCount, challengeNumber = 1) {
    const result = { syntaxValid: false, conceptValid: false, missionSuccess: false, actions: null, message: '' };
    try {
        if (typeof code !== 'string' || code.length > 20000) fail('Kode terlalu panjang.');
        const raw = code.replace(/\r\n?/g, '\n').split('\n');
        if (raw.length > LIMIT) fail('Gunakan maksimal 120 baris per Run.');
        const lines = raw.map((text, index) => ({ text: text.split('#')[0].trimEnd(), line: index + 1 }))
            .filter(({ text }) => text.trim()).map(({ text, line }) => {
                if (/\t/.test(text)) fail(`Baris ${line}: gunakan spasi untuk indentasi.`);
                return { text: text.trim(), indent: text.length - text.trimStart().length, line };
            });
        if (!lines.length) fail('Tulis kode misi terlebih dahulu.');
        let cursor = 0;
        const bounds = new Map([['isi_air', 5], ['kebutuhan_air', 5]]);
        function value(token) {
            if (/^(0|[1-9]\d*)$/.test(token)) return integer(Number(token));
            if (!bounds.has(token)) fail(`Variabel ${token} belum berisi bilangan bulat.`);
            return token;
        }
        const bound = (token) => typeof token === 'number' ? token : bounds.get(token);
        function condition(text) {
            if (BOOLEANS.includes(text)) return { left: text };
            const match = text.match(/^(\w+)\s*(>=|<=|==|!=|>|<)\s*(\w+)$/);
            if (!match) fail('Gunakan kondisi permainan atau perbandingan bilangan pada if.');
            const operand = (token) => token === 'True' ? true : token === 'False' ? false : BOOLEANS.includes(token) ? token : value(token);
            return { left: operand(match[1]), operator: match[2], right: operand(match[3]) };
        }
        function block(indent, depth = 0) {
            if (depth > 8) fail('Maksimal 8 tingkat blok bersarang.');
            const nodes = [];
            let cost = 0;
            while (cursor < lines.length && lines[cursor].indent >= indent) {
                const entry = lines[cursor];
                if (entry.indent !== indent) fail(`Baris ${entry.line}: indentasi tidak sejajar.`);
                if (entry.text === 'else:') break;
                cursor += 1;
                const child = () => {
                    if (!lines[cursor] || lines[cursor].indent <= indent) fail(`Baris ${entry.line}: blok membutuhkan perintah berindentasi.`);
                    return block(lines[cursor].indent, depth + 1);
                };
                let match;
                let node;
                let nodeCost = 1;
                if ((match = entry.text.match(/^if\s+(.+)\s*:\s*$/))) {
                    const check = condition(match[1].trim());
                    const yes = child();
                    let no = { nodes: [], cost: 0 };
                    let elseLine = null;
                    if (lines[cursor]?.indent === indent && lines[cursor].text === 'else:') {
                        elseLine = lines[cursor++].line;
                        no = child();
                    }
                    node = { type: 'if', condition: check, conditionText: match[1].trim(), body: yes.nodes, otherwise: no.nodes, elseLine };
                    nodeCost = Math.max(yes.cost, no.cost);
                } else if ((match = entry.text.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\s*\(\s*(\w+)\s*\)\s*:\s*$/))) {
                    localName(match[1]);
                    const count = value(match[2]);
                    const maximum = bound(count);
                    bounds.set(match[1], Math.max(0, maximum - 1));
                    const body = child();
                    node = { type: 'for', variable: match[1], count, body: body.nodes };
                    nodeCost = maximum * Math.max(1, body.cost);
                } else if ((match = entry.text.match(/^([A-Za-z_]\w*)\s*=\s*(\w+)$/))) {
                    if (match[1] !== 'isi_air') localName(match[1]);
                    const amount = value(match[2]);
                    if (match[1] === 'isi_air') integer(bound(amount), 5);
                    else bounds.set(match[1], Math.max(bounds.get(match[1]) ?? 0, bound(amount)));
                    node = { type: 'assign', variable: match[1], value: amount };
                } else if ((match = entry.text.match(/^(maju|mundur|atas|bawah|kanan|kiri)\s*\(\s*(\w+)\s*\)$/))) {
                    const count = value(match[2]);
                    if (bound(count) < 1) fail('Gerakan membutuhkan minimal satu petak.');
                    node = { type: 'move', direction: DIRECTIONS[match[1]], count };
                    nodeCost = bound(count);
                } else if ((match = entry.text.match(/^(semprot|selamatkan_hewan|lanjut_patroli)\s*\(\s*\)$/))) {
                    node = { type: { semprot: 'spray', selamatkan_hewan: 'rescue', lanjut_patroli: 'patrol' }[match[1]] };
                } else fail(`Baris ${entry.line}: perintah tidak dikenal; periksa sintaks dan tanda titik dua.`);
                nodes.push({ ...node, line: entry.line });
                cost += nodeCost;
                if (cost > LIMIT) fail('Maksimal 120 aksi per Run, termasuk perulangan.');
            }
            return { nodes, cost };
        }
        if (lines[0].indent !== 0) fail('Baris pertama tidak boleh berindentasi.');
        const commands = block(0).nodes;
        if (cursor !== lines.length) fail(`Baris ${lines[cursor].line}: else atau indentasi tidak memiliki pasangan.`);
        return { ...result, syntaxValid: true, conceptValid: true, actions: { commands }, features: getLevel3Features(commands), message: 'Kode siap dijalankan.' };
    } catch (error) { return { ...result, message: error.message }; }
}

export function getLevel3Features(commands) {
    const features = { hasLoop: false, hasIf: false, hasElse: false, maxIfDepth: 0 };
    function visit(nodes, depth) {
        for (const node of nodes) {
            if (node.type === 'for') { features.hasLoop = true; visit(node.body, depth); }
            if (node.type === 'if') {
                features.hasIf = true;
                features.hasElse ||= node.otherwise.length > 0;
                features.maxIfDepth = Math.max(features.maxIfDepth, depth + 1);
                visit(node.body, depth + 1);
                visit(node.otherwise, depth + 1);
            }
        }
    }
    visit(commands, 0);
    return features;
}

// Generator berbagi logika antara simulasi sinkron dan animasi scene asinkron.
function* program(commands, state) {
    const locals = new Map();
    let actions = 0;
    let instructions = 0;
    const read = (token) => {
        if (typeof token !== 'string') return token;
        if (WORLD.includes(token)) return state[token];
        if (!locals.has(token)) fail(`Variabel ${token} belum diisi pada cabang ini.`);
        return locals.get(token);
    };
    const number = (token) => integer(read(token));
    const compare = (condition) => {
        const left = read(condition.left);
        const right = read(condition.right);
        switch (condition.operator) {
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '>': return left > right;
            case '<': return left < right;
            case '==': return left === right;
            case '!=': return left !== right;
            default: return left === true;
        }
    };
    function* emit(action) {
        if (++actions > LIMIT) fail('Maksimal 120 aksi per Run.');
        yield action;
    }
    function* visit(nodes, depth = 0) {
        if (depth > 8) fail('Maksimal 8 tingkat blok.');
        for (const node of nodes) {
            if (++instructions > 1000) fail('Program terlalu banyak perulangan.');
            if (node.type === 'if') {
                const result = compare(node.condition);
                yield { type: 'branch', line: result ? node.line : (node.elseLine ?? node.line), condition: node.conditionText, result };
                yield* visit(result ? node.body : node.otherwise, depth + 1);
            } else if (node.type === 'for') {
                const count = number(node.count);
                for (let index = 0; index < count; index++) {
                    locals.set(node.variable, index);
                    yield* visit(node.body, depth + 1);
                }
            } else if (node.type === 'assign') {
                const amount = number(node.value);
                if (node.variable === 'isi_air') yield* emit({ type: 'setWater', amount: integer(amount, 5) });
                else locals.set(node.variable, amount);
            } else if (node.type === 'move') {
                const count = number(node.count);
                if (count < 1) fail('Gerakan membutuhkan minimal satu petak.');
                for (let index = 0; index < count; index++) yield* emit({ type: 'move', direction: node.direction });
            } else yield* emit({ type: node.type });
        }
    }
    yield* visit(commands);
}
function simulateAction(action, state) {
    if (action.type === 'setWater') state.isi_air = action.amount;
    if (action.type === 'spray') {
        if (state.isi_air < 1) fail('Air tidak cukup untuk semprot.');
        if (state.api_padam) fail('Api sudah padam; semprotan berlebih.');
        state.isi_air -= 1;
        state.sisa_api = (state.sisa_api ?? state.kebutuhan_air) - 1;
        state.api_padam = state.sisa_api <= 0;
    }
}

// Callback scene wajib memperbarui state sesudah animasi dan melempar error jika aksi gagal.
// Tanpa callback, interpreter menjalankan simulasi air/api untuk pengujian.
export async function executeLevel3Program(commands, state, onAction) {
    for (const action of program(commands, state)) {
        if (onAction) {
            const outcome = await onAction(action);
            if (outcome === false) fail('Aksi dihentikan oleh keadaan permainan.');
        } else simulateAction(action, state);
    }
    return state;
}

export function validateLevel3Behavior(commands, kind) {
    const features = getLevel3Features(commands);
    if (!features.hasIf || !features.hasElse) return { valid: false, message: 'Gunakan if dan else untuk memeriksa kedua keadaan.' };
    if (['nested', 'habitat', 'evaluation'].includes(kind) && features.maxIfDepth < 2) return { valid: false, message: 'Gunakan percabangan bersarang untuk memeriksa keselamatan.' };
    if (kind === 'evaluation' && !features.hasLoop) return { valid: false, message: 'Gunakan for untuk pemadaman pada evaluasi.' };
    const move = (direction, count) => Array.from({ length: count }, () => `move:${direction}`);
    const scenarios = [];
    for (const jalur_aman of [false, true]) for (const hewan_terjebak of [false, true]) for (const api_padam of [false, true]) {
        for (const isi_air of [2, 4, 5]) {
            const state = { jalur_aman, hewan_terjebak, api_padam, isi_air, kebutuhan_air: 4 };
            let expected;
            let label = '';
            switch (kind) {
                case 'route': expected = jalur_aman ? move('north', 3) : move('east', 2); break;
                case 'water':
                    state.api_padam = false;
                    state.kebutuhan_air = 3;
                    state.isi_air = isi_air === 4 ? 3 : isi_air;
                    expected = state.isi_air >= 3 ? Array(3).fill('spray') : move('south', 1); break;
                case 'rescue': expected = api_padam ? ['rescue'] : move('south', 1); break;
                case 'nested': expected = !hewan_terjebak ? ['patrol'] : api_padam ? ['rescue'] : move('south', 1); break;
                case 'habitat': expected = !hewan_terjebak ? ['patrol'] : !api_padam ? move('south', 1) : jalur_aman ? ['rescue'] : move('west', 2); break;
                case 'evaluation':
                    label = !jalur_aman ? 'A' : !hewan_terjebak ? 'B' : api_padam ? 'E' : isi_air < 4 ? 'C' : 'D';
                    expected = !jalur_aman ? move('east', 2) : !hewan_terjebak ? ['patrol'] : api_padam ? ['rescue'] : isi_air < 4 ? move('south', 1) : [...Array(4).fill('spray'), 'rescue']; break;
                default: return { valid: false, message: 'Jenis pengujian tidak dikenal.' };
            }
            scenarios.push({ state, expected, label });
        }
    }
    for (const { state, expected, label } of scenarios) {
        const description = `jalur_aman=${state.jalur_aman}, hewan_terjebak=${state.hewan_terjebak}, api_padam=${state.api_padam}, air=${state.isi_air}/${state.kebutuhan_air}`;
        try {
            const actual = [];
            for (const action of program(commands, state)) {
                if (action.type === 'branch') continue;
                actual.push(action.type === 'move' ? `move:${action.direction}` : action.type);
                simulateAction(action, state);
            }
            if (actual.join(',') !== expected.join(',')) fail(`Tindakan belum tepat. Harapan: ${expected.join(', ')}.`);
        } catch (error) {
            return { valid: false, message: `Kasus ${label || kind} gagal (${description}): ${error.message}` };
        }
    }
    return { valid: true, message: 'Seluruh kondisi pengujian berhasil.' };
}
