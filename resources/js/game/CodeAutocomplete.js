export function createLevel1Suggestions(requiredWater = 3, challengeNumber = 1) {
    const movementSuggestions = [
        { label: 'atas(angka)', value: 'atas(1)', selectionStart: 5, selectionLength: 1 },
        { label: 'bawah(angka)', value: 'bawah(1)', selectionStart: 6, selectionLength: 1 },
        { label: 'kanan(angka)', value: 'kanan(1)', selectionStart: 6, selectionLength: 1 },
        { label: 'kiri(angka)', value: 'kiri(1)', selectionStart: 5, selectionLength: 1 },
    ];

    if (challengeNumber === 3) {
        return [
            ...movementSuggestions,
            {
                label: 'air_pos_2 = isi_air',
                value: 'air_pos_2 = isi_air',
                selectionStart: 19,
                selectionLength: 0,
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
        },
    ];
}

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
    constructor(editor, list, suggestions) {
        this.editor = editor;
        this.list = list;
        this.suggestions = suggestions;
        this.matches = [];
        this.activeIndex = 0;

        this.editor.addEventListener('input', () => this.update());
        this.editor.addEventListener('click', () => this.update());
        this.editor.addEventListener('scroll', () => this.positionList());
        this.editor.addEventListener('blur', () => {
            window.setTimeout(() => this.hide(), 100);
        });
        this.editor.addEventListener('keydown', (event) => this.handleKeydown(event));
        this.list.addEventListener('mousedown', (event) => {
            event.preventDefault();
            const option = event.target.closest('[data-suggestion-index]');

            if (option) {
                this.choose(Number(option.dataset.suggestionIndex));
            }
        });
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
            this.activeIndex = (this.activeIndex + offset + this.matches.length) % this.matches.length;
            this.render();
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
            option.setAttribute('aria-selected', String(index === this.activeIndex));
            option.className = index === this.activeIndex ? 'is-active' : '';

            const command = document.createElement('code');
            command.textContent = suggestion.label;
            option.append(command);

            if (index === this.activeIndex) {
                const action = document.createElement('span');
                action.textContent = 'Enter';
                option.append(action);
                this.editor.setAttribute('aria-activedescendant', option.id);
            }

            return option;
        }));
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
        this.editor.setAttribute('aria-expanded', 'false');
        this.editor.removeAttribute('aria-activedescendant');
    }
}
