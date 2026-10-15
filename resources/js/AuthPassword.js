export function initAuthPassword() {
    document.querySelectorAll('[data-password-toggle]').forEach(button => {
        const input = document.getElementById(button.dataset.passwordToggle);
        if (!input) return;
        button.addEventListener('click', () => {
            const revealing = input.type === 'password';
            input.type = revealing ? 'text' : 'password';
            button.textContent = revealing ? 'Sembunyikan' : 'Lihat';
            button.setAttribute('aria-pressed', String(revealing));
            button.setAttribute('aria-label', `${revealing ? 'Sembunyikan' : 'Lihat'} ${input.dataset.passwordLabel}`);
            input.focus({ preventScroll: true });
        });
    });
}
