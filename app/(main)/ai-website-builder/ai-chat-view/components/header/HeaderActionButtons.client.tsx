import { Icon } from '@iconify/react';
import { useChatStore, useWorkbenchStore } from '../../lib/stores/zustand';
import { classNames } from '../../utils/classNames';

interface HeaderActionButtonsProps {}

export function HeaderActionButtons({}: HeaderActionButtonsProps) {
  const showWorkbench = useWorkbenchStore((state) => state.showWorkbench);
  const showChat = useChatStore((state) => state.showChat);
  const setShowChat = useChatStore((state) => state.setShowChat);

  const canHideChat = showWorkbench || !showChat;

  return (
    <div className="flex">
      <div className="flex overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
        <Button
          active={showChat}
          disabled={!canHideChat}
          onClick={() => {
            const isMobile =
              typeof window !== 'undefined' && window.innerWidth < 768;
            const newShowChat = !showChat;

            if (canHideChat) {
              setShowChat(newShowChat);

              // On mobile, hide workbench when showing chat
              if (isMobile && newShowChat && showWorkbench) {
                useWorkbenchStore.getState().setShowWorkbench(false);
              }
            }
          }}
        >
          <Icon icon="ph:chat-circle-dots" className="text-sm" />
        </Button>

        <div className="w-[1px] bg-gray-200 dark:bg-gray-800" />
        <Button
          active={showWorkbench}
          onClick={() => {
            const isMobile =
              typeof window !== 'undefined' && window.innerWidth < 768;
            const newShowState = !showWorkbench;

            if (showWorkbench && !showChat) {
              setShowChat(true);
            }

            // On mobile, hide chat when showing workbench
            if (isMobile && newShowState && showChat) {
              setShowChat(false);
            }

            useWorkbenchStore.getState().setUserHidWorkbench(!newShowState);
            useWorkbenchStore.getState().setShowWorkbench(newShowState);
          }}
        >
          <Icon icon="ph:code-bold" />
        </Button>
      </div>
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
}

function Button({
  active = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={classNames('flex items-center p-1.5', {
        'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-100':
          !active && !disabled,
        'bg-blue-500/10 text-blue-500': active && !disabled,
        'cursor-not-allowed bg-transparent text-gray-300 dark:text-gray-700':
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
