export default class GameSettingsMenu {
    constructor({ toggleButton, menu, container, documentRoot, eventTarget = globalThis.window }) {
        this.toggleButton = toggleButton;
        this.menu = menu;
        this.container = container;
        this.documentRoot = documentRoot;
        this.eventTarget = eventTarget;

        this.toggle = this.toggle.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);

        this.menu.hidden = true;
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.toggleButton.addEventListener('click', this.toggle);
        this.documentRoot.addEventListener('pointerdown', this.handlePointerDown);
        this.eventTarget?.addEventListener('keydown', this.handleKeydown);
    }

    toggle() {
        this.menu.hidden ? this.open() : this.close();
    }

    open() {
        this.menu.hidden = false;
        this.toggleButton.setAttribute('aria-expanded', 'true');
    }

    close({ restoreFocus = false } = {}) {
        if (this.menu.hidden) return;

        this.menu.hidden = true;
        this.toggleButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) this.toggleButton.focus();
    }

    handlePointerDown(event) {
        if (!this.menu.hidden && !this.container.contains(event.target)) this.close();
    }

    handleKeydown(event) {
        if (event.key !== 'Escape' || this.menu.hidden) return;

        event.preventDefault();
        this.close({ restoreFocus: true });
    }
}

export function initGameSettingsMenu(documentRoot = document) {
    const toggleButton = documentRoot.getElementById('game-settings-toggle');
    const menu = documentRoot.getElementById('game-settings-menu');
    const container = toggleButton?.closest('.game-settings');

    if (!toggleButton || !menu || !container) return null;

    return new GameSettingsMenu({ toggleButton, menu, container, documentRoot });
}
