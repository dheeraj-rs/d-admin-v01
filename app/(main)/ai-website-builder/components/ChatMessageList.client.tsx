import type { Message } from 'ai';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { classNames } from '../utils/classNames';
import { AssistantMessage } from './ChatAssistantMessage';
import { UserMessage } from './ChatUserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>(
  (props: MessagesProps, ref) => {
    const { id, isStreaming = false, messages = [] } = props;
    const [bottomPadding, setBottomPadding] = useState('5rem');

    // Dynamically calculate bottom padding based on input area height
    useEffect(() => {
      const updatePadding = () => {
        const inputArea = document.querySelector(
          '[data-chat-input]',
        ) as HTMLElement;
        if (inputArea) {
          const height = inputArea.getBoundingClientRect().height;
          // Add input height + 20px for comfortable viewing (reduced from 80px)
          setBottomPadding(`${height}px`);
        }
      };

      // Initial calculation
      updatePadding();

      // Update on window resize
      window.addEventListener('resize', updatePadding);

      // Use ResizeObserver to detect input area height changes (e.g., when textarea expands)
      const inputArea = document.querySelector('[data-chat-input]');
      let resizeObserver: ResizeObserver | null = null;

      if (inputArea) {
        resizeObserver = new ResizeObserver(updatePadding);
        resizeObserver.observe(inputArea);
      }

      return () => {
        window.removeEventListener('resize', updatePadding);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }, []);

    return (
      <div
        id={id}
        ref={ref}
        className={props.className}
        style={{ paddingBottom: bottomPadding }}
      >
        {messages.length > 0
          ? messages.map((message, index) => {
              const { role, content } = message;
              const isUserMessage = role === 'user';
              const isFirst = index === 0;

              return (
                <div
                  key={index}
                  className={classNames('flex w-full', {
                    'mt-6': !isFirst,
                    'justify-end': isUserMessage,
                    'justify-start': !isUserMessage,
                  })}
                >
                  {isUserMessage ? (
                    <div className="bg-surface-c flex max-w-[85%] items-start gap-3 rounded-2xl px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <UserMessage content={content} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-primary text-sm font-semibold">
                            D Admin
                          </span>
                        </div>
                        <div>
                          <AssistantMessage content={content} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          : null}
        {isStreaming && (
          <div className="mt-6 flex w-full justify-start">
            <div className="flex w-full items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-primary text-sm font-semibold">
                    D Admin
                  </span>
                </div>
                <div className="flex items-center">
                  <Icon
                    icon="svg-spinners:3-dots-fade"
                    className="text-secondary text-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

Messages.displayName = 'Messages';
