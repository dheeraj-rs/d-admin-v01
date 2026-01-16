'use client';

import { useStore } from '@nanostores/react';
import { Icon } from '@iconify/react';
import { useChatStore } from '@/app/(builder)/website-builder/lib/stores/zustand';
import { description } from '@/app/(builder)/website-builder/lib/persistence/useChatHistory';
import { classNames } from '@/app/(builder)/website-builder/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';

export function Header() {
  const showChat = useChatStore(state => state.showChat);
  const started = useChatStore(state => state.started);
  const chatDescription = useStore(description);

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 w-full z-30 flex items-center bg-surface-b key-border-b h-[var(--header-height)] p-5 border-b',
        {
          'border-transparent': !showChat,
          'border-surface': showChat,
        },
      )}
    >
      <div className="flex items-center gap-2">
        <Icon icon="ph:sidebar-simple-duotone" className="text-xl text-gray-500" />
      </div>

      {started && (
        <>
          <span className="flex-1 px-4 truncate text-center text-primary">
            {chatDescription}
          </span>
          <HeaderActionButtons />
        </>
      )}
    </header>
  );
}
