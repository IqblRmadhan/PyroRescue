<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" focusable="false">
    @if($kind === 'water')
        <path d="M24 5C20 12 11 20 11 29a13 13 0 0 0 26 0C37 20 28 12 24 5Z"/><path d="M17 29a7 7 0 0 0 7 7"/>
    @elseif($kind === 'supply')
        <path d="m8 15 16-8 16 8v21l-16 8-16-8Z"/><path d="m8 15 16 8 16-8M24 23v21M16 11l16 8"/>
    @elseif($kind === 'loop')
        <path d="M39 20A16 16 0 0 0 12 12l-5 5M7 7v10h10M9 28a16 16 0 0 0 27 8l5-5M41 41V31H31"/><path d="m21 19-5 5 5 5m6-10 5 5-5 5"/>
    @else
        <path d="M24 5 8 11v13c0 10 16 19 16 19s16-9 16-19V11Z"/><path d="m17 24 5 5 10-11"/>
    @endif
</svg>
