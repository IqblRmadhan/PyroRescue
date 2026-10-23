function appendAnalogy(root, analogy) {
    if (!analogy) return;
    const card = document.createElement('section');
    card.className = 'guide-analogy';
    const title = document.createElement('strong');
    title.className = 'guide-analogy__title';
    title.textContent = `ANALOGI LAPANGAN · ${analogy.title ?? 'Cara berpikir'}`;
    const intro = document.createElement('p');
    intro.className = 'guide-analogy__intro';
    intro.textContent = analogy.intro;
    const rows = document.createElement('div');
    rows.className = 'guide-analogy__rows';
    for (const item of analogy.rows) {
        const row = document.createElement('div');
        row.className = `guide-analogy__row guide-analogy__row--${item.type}`;
        row.style.setProperty('--analogy-depth', item.depth ?? 0);
        const label = document.createElement('span');
        label.className = 'guide-analogy__label';
        label.textContent = item.label;
        const text = document.createElement('span');
        text.textContent = item.text;
        row.append(label, text);
        rows.append(row);
    }
    card.append(title, intro, rows);
    root.append(card);
}

export function tokenizeGuideMessage(message) {
    const pattern = /(?:\b(?:isi_air|air_pos|jumlah_semprot|status_bekantan)\s*\+?=\s*(?:\d+|isi_air(?:\s*\+\s*\d+)?|"[^"]*"))|(?:\b(?:if|else|for)\b)|(?:\b[a-z_]+\([^\n()]*\))|(?:\b(?:api_padam|hewan_terjebak|jalur_aman|isi_air|kebutuhan_air)\s*(?:>=|<=|==|>|<)\s*\w+)/g;
    const parts = [];
    let offset = 0;
    for (const match of String(message).matchAll(pattern)) {
        if (match.index > offset) parts.push({ type: 'text', text: message.slice(offset, match.index) });
        parts.push({ type: 'code', text: match[0] });
        offset = match.index + match[0].length;
    }
    if (offset < message.length) parts.push({ type: 'text', text: message.slice(offset) });
    return parts;
}

// Semua konten dimasukkan sebagai textContent, termasuk potongan kode pemain.
export function renderGuideMessage(root, message, code = '', analogy = null) {
    root.replaceChildren();
    const sentence = document.createElement('p');
    sentence.className = 'guide-message__sentence';
    for (const part of tokenizeGuideMessage(message)) {
        if (part.type === 'text') {
            sentence.append(document.createTextNode(part.text));
            continue;
        }
        const snippet = document.createElement('code');
        snippet.className = 'guide-code-chip';
        snippet.textContent = part.text;
        sentence.append(snippet);
    }
    root.append(sentence);
    appendAnalogy(root, analogy);
    if (code) {
        const panel = document.createElement('section');
        panel.className = 'guide-code-panel';
        const label = document.createElement('strong');
        label.className = 'guide-code-label';
        label.textContent = 'COBA DI PYROPAD · LENGKAPI BAGIAN ...';
        const pre = document.createElement('pre');
        const snippet = document.createElement('code');
        snippet.textContent = code;
        pre.append(snippet);
        panel.append(label, pre);
        root.append(panel);
    }
}
