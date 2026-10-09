export default class MaterialDialog {
    constructor({ openButton, dialog, page, body, eventTarget = globalThis.window }) {
        this.openButton = openButton;
        this.dialog = dialog;
        this.page = page;
        this.body = body;
        this.eventTarget = eventTarget;
        this.closeButtons = [...dialog.querySelectorAll('[data-material-close]')];

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleDialogClick = this.handleDialogClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);

        this.openButton.addEventListener('click', this.open);
        this.closeButtons.forEach((button) => button.addEventListener('click', this.close));
        this.dialog.addEventListener('click', this.handleDialogClick);
        this.eventTarget?.addEventListener('keydown', this.handleKeydown);
        this.openButton.setAttribute('aria-expanded', 'false');
    }

    open() {
        this.dialog.hidden = false;
        this.page.inert = true;
        this.body.classList.add('material-is-open');
        this.openButton.setAttribute('aria-expanded', 'true');
        this.closeButtons[0]?.focus();
    }

    close() {
        if (this.dialog.hidden) return;

        this.dialog.hidden = true;
        this.page.inert = false;
        this.body.classList.remove('material-is-open');
        this.openButton.setAttribute('aria-expanded', 'false');
        this.openButton.focus();
    }

    handleDialogClick(event) {
        if (event.target === this.dialog) this.close();
    }

    handleKeydown(event) {
        if (event.key !== 'Escape' || this.dialog.hidden) return;

        event.preventDefault();
        this.close();
    }
}

export function initMaterialDialog(documentRoot = document) {
    const openButton = documentRoot.getElementById('material-open');
    const dialog = documentRoot.getElementById('material-dialog');
    const page = documentRoot.getElementById('prototype-page');

    if (!openButton || !dialog || !page) return null;

    return new MaterialDialog({
        openButton,
        dialog,
        page,
        body: documentRoot.body,
    });
}
