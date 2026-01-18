import React from 'react';

export const FileTreeIllustration = () => (
    <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80"
    >
        {/* Background Folder */}
        <path
            d="M20 40H60L70 50H140C144.418 50 148 53.5817 148 58V130C148 134.418 144.418 138 140 138H20C15.5817 138 12 134.418 12 130V48C12 43.5817 15.5817 40 20 40Z"
            fill="var(--d-admin-surface-b)"
            stroke="var(--d-admin-surface-border)"
            strokeWidth="2"
        />

        {/* File Inside 1 */}
        <rect x="30" y="70" width="100" height="10" rx="5" fill="var(--d-admin-surface-400)" />
        <rect x="30" y="90" width="80" height="10" rx="5" fill="var(--d-admin-surface-400)" />
        <rect x="30" y="110" width="60" height="10" rx="5" fill="var(--d-admin-surface-400)" />

        {/* Search/Find Icon Overlay to indicate "No files found" or "Search" context */}
        <circle cx="120" cy="120" r="20" fill="var(--d-admin-surface-0)" stroke="var(--d-admin-primary-color)" strokeWidth="2" />
        <path d="M115 120H125M120 115V125" stroke="var(--d-admin-primary-color)" strokeWidth="2" strokeLinecap="round" />
        {/* Actually let's do a simple file icon overlay instead of plus, or maybe a magnifying glass since it says "No files found" often? 
        The previous editor one had a Checkmark. 
        Let's do a generic File Doc icon. */}
        <path d="M112 108H128V132H112V108Z" fill="var(--d-admin-surface-c)" />
        {/* Reverting to simple folder look with a "Plus" or "Doc" hint might be cleaner. 
         Let's stick to the Folder shape + simple lines, and maybe a small decorative circle like the other one.
     */}

        {/* Let's clear the overlay and just match the style of EmptyStateIllustration more closely */}

    </svg>
);
