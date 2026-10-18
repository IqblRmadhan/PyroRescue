<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" focusable="false">
    @if($kind === 'water')
        <path d="M24 5C20 12 11 20 11 29a13 13 0 0 0 26 0C37 20 28 12 24 5Z"/><path d="M17 29a7 7 0 0 0 7 7"/>
    @elseif($kind === 'post')
        <path d="M8 39h32M13 39V17l11-8 11 8v22M18 39V27h12v12M13 20h22M24 14v7M21 18h6"/>
    @elseif($kind === 'spark')
        <path d="M24 5c3 8 10 12 10 21a10 10 0 0 1-20 0c0-5 3-10 8-14 0 5 1 8 2 9 3-5 2-10 0-16Z"/><path d="m9 38 30-30"/>
    @elseif($kind === 'supply')
        <path d="m8 15 16-8 16 8v21l-16 8-16-8Z"/><path d="m8 15 16 8 16-8M24 23v21M16 11l16 8"/>
    @elseif($kind === 'loop')
        <path d="M39 20A16 16 0 0 0 12 12l-5 5M7 7v10h10M9 28a16 16 0 0 0 27 8l5-5M41 41V31H31"/><path d="m21 19-5 5 5 5m6-10 5 5-5 5"/>
    @elseif($kind === 'rescue')
        <path d="M13 18c-9-5-11 11-3 13m25-13c9-5 11 11 3 13" fill="currentColor" fill-opacity=".15"/>
        <path d="M11 23C11 11 17 7 24 7s13 4 13 16v8c0 9-7 13-13 13S11 40 11 31Z" fill="currentColor" fill-opacity=".12"/>
        <path d="M17 20h1m12 0h1M22 20c-1 5-5 12-3 15 2 3 8 3 10 0 2-3-2-10-3-15M18 39c4 2 8 2 12 0"/>
    @elseif($kind === 'habitat')
        <path d="M8 39h32M24 39V20M24 29 13 18M24 25l11-12M11 24c-5-8 1-17 9-17 4 0 7 2 8 5M32 9c7 0 11 7 8 13-2 4-5 6-9 6"/>
    @elseif($kind === 'branch')
        <path d="M9 9h11v8H9zM28 9h11v8H28zM19 31h11v8H19zM14 17v8h10v6m10-14v8H24"/>
    @else
        <path d="M24 5 8 11v13c0 10 16 19 16 19s16-9 16-19V11Z"/><path d="m17 24 5 5 10-11"/>
    @endif
</svg>
