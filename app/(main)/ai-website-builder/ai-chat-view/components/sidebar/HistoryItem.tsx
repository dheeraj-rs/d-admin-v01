import { Icon } from '@iconify/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { type ChatHistoryItem } from '../../lib/persistence';
import Link from 'next/link';

interface HistoryItemProps {
  item: ChatHistoryItem;
  onDelete?: (event: React.UIEvent) => void;
  onSelect?: () => void;
}

export function HistoryItem({ item, onDelete, onSelect }: HistoryItemProps) {
  const [hovering, setHovering] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    function mouseEnter() {
      setHovering(true);

      if (timeout) {
        clearTimeout(timeout);
      }
    }

    function mouseLeave() {
      setHovering(false);
    }

    hoverRef.current?.addEventListener('mouseenter', mouseEnter);
    hoverRef.current?.addEventListener('mouseleave', mouseLeave);

    return () => {
      hoverRef.current?.removeEventListener('mouseenter', mouseEnter);
      hoverRef.current?.removeEventListener('mouseleave', mouseLeave);
    };
  }, []);

  return (
    <div
      ref={hoverRef}
      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[var(--d-admin-surface-hover)] text-left group transition-all">
      <span className="bg-[var(--d-admin-surface-section)] p-1.5 rounded-md text-[var(--d-admin-text-color-secondary)] group-hover:text-[var(--d-admin-primary-color)] transition-colors">
        <Icon icon="ph:chat-circle-text" className="size-4" />
      </span>
      <div className="flex-1 min-w-0">
        <Link
          href={`/ai-website-builder/${item.urlId}`}
          className="flex w-full relative truncate block"
          onClick={() => onSelect?.()}
        >
          <div className="flex flex-col w-full min-w-0">
            <span className="truncate">{item.description}</span>
            <span className="text-xs truncate text-[var(--d-admin-text-color-secondary)]">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </span>
          </div>
          <div className="absolute right-0 z-1 top-0 bottom-0 w-10 flex justify-end group-hover:w-15 group-hover:from-45%">
            {hovering && (
              <div className="flex items-center p-1 text-gray-500 hover:text-red-500">
                <Dialog.Trigger asChild>
                  <button
                    className="scale-110"
                    onClick={(event) => {
                      event.preventDefault();
                      onDelete?.(event);
                    }}
                  >
                    <Icon icon="ph:trash" />
                  </button>
                </Dialog.Trigger>
              </div>
            )}
          </div>
        </Link>
      </div>

    </div>
  );
}
