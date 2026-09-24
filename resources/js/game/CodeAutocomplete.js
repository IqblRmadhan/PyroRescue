export function createLevel1Suggestions(requiredWater = 3, challengeNumber = 1) {
    // Empat arah memakai format yang sama; hanya nama dan contoh yang berbeda.
    const movements = [
        { direction: 'atas', exampleSteps: 3 },
        { direction: 'bawah', exampleSteps: 2 },
        { direction: 'kanan', exampleSteps: 4 },
        { direction: 'kiri', exampleSteps: 2 },
    ];
    const movementSuggestions = movements.map(({ direction, exampleSteps }) => ({
        label: `${direction}(angka)`,
        value: `${direction}(1)`,
        selectionStart: direction.length + 1, // Pilih angka di dalam kurung.
        selectionLength: 1,
        kind: 'Perintah gerak',
        description: `Menggerakkan pemadam ke ${direction} sebanyak jumlah petak yang ditentukan.`,
        example: `${direction}(${exampleSteps})`,
        parameter: 'angka',
        parameterDescription: 'Jumlah petak, berupa bilangan bulat minimal 1.',
    }));

    if (challengeNumber === 3) {
        return [
            ...movementSuggestions,
            {
                label: 'air_pos_2 = isi_air',
                value: 'air_pos_2 = isi_air',
                selectionStart: 19,
                selectionLength: 0,
                kind: 'Assignment variabel',
                description: 'Menyimpan nilai isi_air ke air_pos_2. Di penanda Pos 2, game menyerahkan air lalu mengosongkan tangki. Dalam Python biasa, assignment ini tidak mengubah isi_air.',
                example: 'air_pos_2 = isi_air',
                parameter: 'isi_air',
                parameterDescription: 'Variabel berisi jumlah air yang sedang dibawa pemain.',
            },
        ];
    }

    return [
        ...movementSuggestions,
        {
            label: 'isi_air = angka',
            value: `isi_air = ${requiredWater}`,
            selectionStart: 10,
            selectionLength: String(requiredWater).length,
            kind: 'Assignment variabel',
            description: challengeNumber === 1
                ? 'isi_air adalah nama variabel; tanda = menyimpan nilai angka di sebelah kanan. Di penanda pompa, kode ini mengisi tangki.'
                : 'Mengganti nilai isi_air dengan jumlah akhir. isi_air = 5 mengganti nilai 3 menjadi 5, bukan menambahkan 5. Jalankan di penanda Pos 1.',
            example: `isi_air = ${requiredWater}`,
            parameter: 'angka',
            parameterDescription: 'Jumlah air yang diminta pada challenge saat ini.',
        },
    ];
}

// Ambil baris tempat kursor berada, tanpa menghapus spasi di awal baris.
export function getCompletionContext(value, caretPosition) {
    const lineStart = value.lastIndexOf('\n', caretPosition - 1) + 1;
    const nextLineBreak = value.indexOf('\n', caretPosition);
    const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    const beforeCaret = value.slice(lineStart, caretPosition);
    const indentation = beforeCaret.match(/^\s*/)?.[0] ?? '';
    const query = beforeCaret.slice(indentation.length).trim().toLowerCase();

    return {
        query,
        lineStart,
        lineEnd,
        replacementStart: lineStart + indentation.length,
    };
}

export function getAutocompleteMatches(suggestions, query) {
    if (!/^[a-z_]*$/.test(query)) {
        return [];
    }

    return suggestions.filter((suggestion) => (
        suggestion.label.toLowerCase().startsWith(query)
    ));
}

// Ganti baris aktif saja. Baris sebelum dan sesudahnya tetap dipertahankan.
export function applyAutocompleteSuggestion(value, context, suggestion) {
    const nextValue = value.slice(0, context.replacementStart)
        + suggestion.value
        + value.slice(context.lineEnd);
    const selectionStart = context.replacementStart + suggestion.selectionStart;

    return {
        value: nextValue,
        selectionStart,
        selectionEnd: selectionStart + suggestion.selectionLength,
    };
}

export default class CodeAutocomplete {
    constructor(editor, list, suggestions, helpPanel = null, referenceList = null) {
        this.editor = editor;
        this.list = list;
        this.helpPanel = helpPanel;
        this.referenceList = referenceList;
        this.suggestions = suggestions;
        this.matches = [];
        this.activeIndex = 0;
        this.previewedIndex = -1;
        this.renderReference();
        this.bindEvents();
    }

    // Hubungkan interaksi pengguna dengan fungsi yang menanganinya.
    bindEvents() {
        this.editor.addEventListener('input', () => this.update());
        this.editor.addEventListener('click', () => this.update());
        this.editor.addEventListener('scroll', () => this.positionList());
        this.editor.addEventListener('blur', () => {
            window.setTimeout(() => this.hide(), 100);
        });
        this.editor.addEventListener('keydown', (event) => this.handleKeydown(event));
        this.list.addEventListener('pointerover', (event) => this.handlePointer(event));
        this.list.addEventListener('pointerdown', (event) => this.handlePointer(event));
    }

    handlePointer(event) {
        const isHover = event.type === 'pointerover';
        if (isHover && event.pointerType && event.pointerType !== 'mouse') return;
        if (!isHover) event.preventDefault(); // Jangan pindahkan fokus dari editor.

        const option = event.target.closest('[data-suggestion-index]');
        if (!option) return;

        const index = Number(option.dataset.suggestionIndex);
        // Layar sentuh: sentuhan pertama membuka penjelasan, kedua memasukkan kode.
        const isTouchPreview = event.pointerType !== 'mouse'
            && (this.previewedIndex !== index || this.helpPanel?.hidden);
        if (isHover || isTouchPreview) {
            this.preview(index);
        } else {
            this.choose(index);
        }
    }

    handleKeydown(event) {
        if (event.ctrlKey && event.code === 'Space') {
            event.preventDefault();
            this.update(true);
            return;
        }

        if (this.list.hidden) {
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            const nextIndex = (this.activeIndex + offset + this.matches.length) % this.matches.length;
            this.highlightOption(nextIndex);
            this.showDocumentation(this.activeIndex);
            return;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            this.choose(this.activeIndex);
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            this.hide();
        }
    }

    setSuggestions(suggestions) {
        this.suggestions = suggestions;
        this.hide();
        this.renderReference();
    }

    renderReference() {
        if (!this.referenceList) return;

        this.referenceList.replaceChildren(...this.suggestions.map((suggestion) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = suggestion.label;
            button.setAttribute('aria-controls', this.helpPanel.id);
            const show = () => this.renderDocumentation(suggestion);
            button.addEventListener('pointerenter', (event) => {
                if (event.pointerType === 'mouse') show();
            });
            button.addEventListener('focus', show);
            button.addEventListener('click', show);
            return button;
        }));
        this.renderDocumentation(this.suggestions.at(-1));
    }

    update(showAll = false) {
        const context = getCompletionContext(this.editor.value, this.editor.selectionStart);
        const query = showAll ? '' : context.query;

        if ((!query && !showAll) || this.editor.selectionStart !== this.editor.selectionEnd) {
            this.hide();
            return;
        }

        this.matches = getAutocompleteMatches(this.suggestions, query);
        this.activeIndex = 0;
        this.previewedIndex = -1;

        if (this.matches.length === 0) {
            this.hide();
            return;
        }

        this.render();
        this.list.hidden = false;
        this.editor.setAttribute('aria-expanded', 'true');
        this.positionList();
    }

    render() {
        this.list.replaceChildren(...this.matches.map((suggestion, index) => {
            const option = document.createElement('li');
            option.id = `code-suggestion-${index}`;
            option.dataset.suggestionIndex = index;
            option.setAttribute('role', 'option');

            const command = document.createElement('code');
            command.textContent = suggestion.label;
            option.append(command);

            return option;
        }));
        this.highlightOption(this.activeIndex);
    }

    positionList() {
        if (this.list.hidden) {
            return;
        }

        const style = window.getComputedStyle(this.editor);
        const lineHeight = Number.parseFloat(style.lineHeight);
        const paddingLeft = Number.parseFloat(style.paddingLeft);
        const paddingTop = Number.parseFloat(style.paddingTop);
        const beforeCaret = this.editor.value.slice(0, this.editor.selectionStart);
        const lines = beforeCaret.split('\n');
        const lineIndex = lines.length - 1;
        const column = lines.at(-1).length;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = style.font;
        const characterWidth = context.measureText('M').width;
        const desiredLeft = paddingLeft + column * characterWidth - this.editor.scrollLeft;
        const desiredTop = paddingTop + (lineIndex + 1) * lineHeight - this.editor.scrollTop + 4;
        const maximumLeft = Math.max(8, this.editor.clientWidth - this.list.offsetWidth - 8);
        let top = Math.max(8, desiredTop);

        if (top + this.list.offsetHeight > this.editor.clientHeight) {
            top = Math.max(8, desiredTop - this.list.offsetHeight - lineHeight - 8);
        }

        this.list.style.left = `${Math.max(8, Math.min(desiredLeft, maximumLeft))}px`;
        this.list.style.top = `${top}px`;
    }

    preview(index) {
        if (!this.matches[index]) {
            return;
        }

        if (this.activeIndex === index
            && this.previewedIndex === index
            && this.helpPanel
            && !this.helpPanel.hidden) {
            return;
        }

        this.highlightOption(index);
        this.showDocumentation(index);
        this.positionList();
    }

    // Dipakai bersama oleh mouse dan keyboard, tanpa mengganti elemen yang diklik.
    highlightOption(index) {
        this.activeIndex = index;
        for (const [optionIndex, option] of [...this.list.children].entries()) {
            option.classList.toggle('is-active', optionIndex === index);
            option.setAttribute('aria-selected', String(optionIndex === index));
            option.querySelector('span')?.remove();
            if (optionIndex === index) {
                const action = document.createElement('span');
                action.textContent = 'Enter';
                option.append(action);
            }
        }
        this.editor.setAttribute('aria-activedescendant', `code-suggestion-${index}`);
    }

    showDocumentation(index) {
        const suggestion = this.matches[index];

        this.renderDocumentation(suggestion);
        this.previewedIndex = index;
    }

    renderDocumentation(suggestion) {
        if (!suggestion || !this.helpPanel) {
            return;
        }

        this.helpPanel.querySelector('[data-help-command]').textContent = suggestion.label;
        this.helpPanel.querySelector('[data-help-kind]').textContent = suggestion.kind;
        this.helpPanel.querySelector('[data-help-description]').textContent = suggestion.description;
        this.helpPanel.querySelector('[data-help-example]').textContent = suggestion.example;
        this.helpPanel.querySelector('[data-help-parameter]').textContent = suggestion.parameter;
        this.helpPanel.querySelector('[data-help-parameter-description]').textContent = suggestion.parameterDescription;
        this.helpPanel.hidden = false;
        for (const button of this.referenceList?.children ?? []) {
            button.setAttribute('aria-pressed', String(button.textContent === suggestion.label));
        }
    }

    choose(index) {
        const suggestion = this.matches[index];

        if (!suggestion) {
            return;
        }

        const context = getCompletionContext(this.editor.value, this.editor.selectionStart);
        const completion = applyAutocompleteSuggestion(this.editor.value, context, suggestion);
        this.editor.value = completion.value;
        this.editor.focus();
        this.editor.setSelectionRange(completion.selectionStart, completion.selectionEnd);
        this.editor.dispatchEvent(new Event('input', { bubbles: true }));
        this.hide();
    }

    hide() {
        this.list.hidden = true;
        this.previewedIndex = -1;

        if (this.helpPanel && !this.referenceList) {
            this.helpPanel.hidden = true;
        }

        this.editor.setAttribute('aria-expanded', 'false');
        this.editor.removeAttribute('aria-activedescendant');
    }
}
