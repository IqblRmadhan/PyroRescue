<span class="achievement-badge achievement-badge--{{ $kind }} {{ isset($badgeStyle) ? 'badge--'.$badgeStyle : '' }} {{ ($locked ?? false) ? 'is-locked' : '' }}" aria-hidden="true">
    <svg class="achievement-badge__frame" viewBox="0 0 120 140" fill="none" focusable="false">
        <path d="m31 99-8 35 22-9 15 10 15-10 22 9-8-35Z" fill="var(--badge-ribbon, #286d69)" stroke="#092f3c" stroke-width="3"/>
        <path d="m36 106-5 18 14-6 15 9 15-9 14 6-5-18" stroke="#ffffff40" stroke-width="2"/>
        <path d="M60 5 105 22v43c0 27-20 43-45 53C35 108 15 92 15 65V22Z" fill="var(--badge-edge, #c08a29)" stroke="#092f3c" stroke-width="4"/>
        <path d="M60 11 99 26v39c0 23-17 37-39 47-22-10-39-24-39-47V26Z" fill="var(--badge-color, #ffe396)"/>
        <path d="M60 19 91 31v33c0 19-14 32-31 40-17-8-31-21-31-40V31Z" fill="var(--badge-face, #164f61)" stroke="#ffffff80" stroke-width="2"/>
        <path d="M25 34v30c0 21 16 36 35 44M95 34v30c0 21-16 36-35 44" stroke="#fff9df" stroke-opacity=".55" stroke-width="2"/>
        <path d="m10 51 4 7-7-1m2 11 7 5-8 1m5 10 8 2-6 5m8 7 8-1-4 7m87-53-4 7 7-1m-2 11-7 5 8 1m-5 10-8 2 6 5m-8 7-8-1 4 7" stroke="var(--badge-edge, #c08a29)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m60 23 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" fill="var(--badge-color, #ffe396)"/>
    </svg>
    <span class="achievement-badge__symbol">@include('game.partials.achievement-icon', ['kind' => $kind])</span>
    <span class="achievement-badge__rank">{{ ['water' => 'AIR', 'supply' => 'I', 'loop' => 'FOR', 'shield' => 'II', 'rescue' => 'III'][$kind] ?? '' }}</span>
</span>
