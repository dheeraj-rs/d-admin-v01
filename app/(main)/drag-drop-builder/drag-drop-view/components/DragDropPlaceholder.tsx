import React from 'react';

export function DragDropPlaceholder() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-[var(--d-admin-text-color-secondary)] select-none">
      {/* Illustration */}
      <div className="relative mb-8">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background glow */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="var(--d-admin-primary-color)"
            opacity="0.1"
          />

          {/* Main layout icon */}
          <rect
            x="50"
            y="50"
            width="100"
            height="100"
            rx="8"
            stroke="var(--d-admin-primary-color)"
            strokeWidth="3"
            strokeDasharray="8 4"
            fill="none"
            opacity="0.6"
          />

          {/* Inner boxes representing components */}
          <rect
            x="60"
            y="60"
            width="80"
            height="20"
            rx="4"
            fill="var(--d-admin-primary-color)"
            opacity="0.3"
          />
          <rect
            x="60"
            y="90"
            width="80"
            height="20"
            rx="4"
            fill="var(--d-admin-primary-color)"
            opacity="0.3"
          />
          <rect
            x="60"
            y="120"
            width="80"
            height="20"
            rx="4"
            fill="var(--d-admin-primary-color)"
            opacity="0.3"
          />

          {/* Drag cursor indicator */}
          <g transform="translate(150, 40)">
            <path
              d="M0 0 L0 16 L4 12 L7 18 L9 17 L6 11 L11 11 Z"
              fill="var(--d-admin-text-color)"
              opacity="0.5"
            />
          </g>

          {/* Plus icon */}
          <circle
            cx="170"
            cy="130"
            r="15"
            fill="var(--d-admin-primary-color)"
            opacity="0.8"
          />
          <path
            d="M170 122 L170 138 M162 130 L178 130"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text */}
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-[var(--d-admin-text-color)]">
        Start Building
      </h2>
      <p className="mb-8 max-w-sm text-center opacity-70">
        Drag and drop components from the sidebar
        <br />
        to start creating your website.
      </p>

      {/* Action hints */}
      <div className="flex gap-6 text-sm opacity-50">
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 9l5 12 1.8-5.2L21 14Z" />
            <path d="M7.2 2.2 8 5.1" />
          </svg>
          <span>Select</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="5 9 2 12 5 15" />
            <polyline points="9 5 12 2 15 5" />
            <polyline points="15 19 12 22 9 19" />
            <polyline points="19 9 22 12 19 15" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          <span>Drag</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit</span>
        </div>
      </div>
    </div>
  );
}
