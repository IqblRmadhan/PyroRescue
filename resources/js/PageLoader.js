const transitionDuration = 700;

export function initPageLoader() {
    const overlay = document.createElement('div');
    overlay.className = 'page-loader';
    overlay.hidden = true;
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = `
        <div class="page-loader__content">
            <img src="/assets/ui/logo-pyrorescue.png" alt="PyroRescue" width="210" height="70">
            <div class="page-loader__track" aria-hidden="true"><span class="page-loader__runner"></span></div>
            <strong>Menyiapkan petualanganmu...</strong>
            <span class="page-loader__hint">Pemadam sedang menuju misi berikutnya</span>
            <div class="page-loader__progress" aria-hidden="true"><span></span></div>
        </div>`;
    document.body.append(overlay);

    let navigating = false;
    function show() {
        if (navigating) return false;
        navigating = true;
        overlay.hidden = false;
        document.body.classList.add('is-page-loading');
        return true;
    }
    function hide() {
        navigating = false;
        overlay.hidden = true;
        document.body.classList.remove('is-page-loading');
    }
    window.addEventListener('pageshow', hide);

    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest?.('a[href]');
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const destination = new URL(link.href, location.href);
        if (destination.origin !== location.origin || destination.protocol !== 'http:' && destination.protocol !== 'https:') return;
        if (destination.pathname === location.pathname && destination.search === location.search) return;
        event.preventDefault();
        if (show()) window.setTimeout(() => location.assign(destination.href), transitionDuration);
    });

    document.addEventListener('submit', event => {
        if (event.defaultPrevented || !event.target.matches('.auth-page form')) return;
        event.preventDefault();
        if (show()) window.setTimeout(() => HTMLFormElement.prototype.submit.call(event.target), transitionDuration);
    });
}
