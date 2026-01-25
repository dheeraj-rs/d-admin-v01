'use client';

import { Icon } from '@iconify/react';
import { useChatStore } from '../../lib/stores/zustand';

import { classNames } from '../../utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';

export function Header() {
  const showChat = useChatStore((state) => state.showChat);
  const started = useChatStore((state) => state.started);
  const chatDescription = useChatStore((state) => state.description);

  return (
    <header
      className={classNames(
        'bg-surface-b key-border-b fixed top-0 right-0 left-0 z-30 flex h-[var(--header-height)] w-full items-center border-b p-5',
        {
          'border-transparent': !showChat,
          'border-surface': showChat,
        },
      )}
    >
      <div className="flex items-center gap-2">
        <Icon
          icon="ph:sidebar-simple-duotone"
          className="text-xl text-gray-500"
        />
      </div>

      {started && (
        <>
          <span className="text-primary flex-1 truncate px-4 text-center">
            {chatDescription}
          </span>
          <HeaderActionButtons />
        </>
      )}
    </header>
  );
}
