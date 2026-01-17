import React from 'react';
import { Icon } from '@iconify/react';

export function Header() {
    return (
        <header className="flex shrink-0 select-none items-center pl-2 pr-3 h-[var(--header-height)] max-w-[var(--chat-min-width)]">
            <a href="/">
                <button className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-bolt-ds-brandHighlight bg-transparent enabled:hover:bg-bolt-ds-inverseSurface/7 text-bolt-ds-textPrimary text-sm px-2" type="button" data-state="closed">
                    <Icon icon="logos:bolt" className="size-6" />
                </button>
            </a>
            <span className="text-bolt-elements-textPrimary opacity-[.12] text-xl antialiased mx-1">/</span>
            <button className="flex items-center justify-center font-medium shrink-0 min-w-0 max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-bolt-ds-brandHighlight bg-transparent enabled:hover:bg-bolt-ds-inverseSurface/7 text-bolt-ds-textPrimary text-sm px-2 -mr-px" type="button" id="radix-:r2r:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                <div className="size-6 flex items-center justify-center shrink-0 bg-bolt-ds-surfaceTwo text-bolt-ds-textSecondary border overflow-hidden rounded-full border-bolt-ds-borderOutline">
                    <img className="w-full h-full object-cover" src="https://stackblitz.com/avatars/D/194.svg" alt="" />
                </div>
                <Icon icon="lucide:chevrons-up-down" className="size-4 opacity-30 ml-1 -mr-1" />
            </button>
            <span className="text-bolt-elements-textPrimary opacity-[.12] text-xl antialiased mx-1">/</span>
            <button className="flex items-center justify-center font-medium max-w-full rounded-md focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 h-9 focus-visible:outline-bolt-ds-brandHighlight bg-transparent enabled:hover:bg-bolt-ds-inverseSurface/7 text-bolt-ds-textPrimary text-sm px-2.5 transition-all duration-300 group shrink min-w-0" type="button" id="radix-:r2u:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                <span className="mt-px truncate sm:max-w-80">New Project Request</span>
                <Icon icon="heroicons:lock-closed" className="shrink-0 ml-0.5" />
                <Icon icon="lucide:chevron-down" className="size-4 opacity-0 transition-opacity duration-200 ml-1 -mr-1 shrink-0 group-hover:opacity-60" />
            </button>
        </header>
    );
}
