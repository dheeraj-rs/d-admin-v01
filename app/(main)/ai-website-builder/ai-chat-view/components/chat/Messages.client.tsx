import type { Message } from 'ai';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { classNames } from '../../utils/classNames';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
    id?: string;
    className?: string;
    isStreaming?: boolean;
    messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
    const { id, isStreaming = false, messages = [] } = props;
    const [bottomPadding, setBottomPadding] = useState('5rem');

    // Dynamically calculate bottom padding based on input area height
    useEffect(() => {
        const updatePadding = () => {
            const inputArea = document.querySelector('[data-chat-input]') as HTMLElement;
            if (inputArea) {
                const height = inputArea.getBoundingClientRect().height;
                // Add input height + 80px extra space for comfortable viewing
                setBottomPadding(`${height + 80}px`);
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
        <div id={id} ref={ref} className={props.className} style={{ paddingBottom: bottomPadding }}>
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
                                <div className="flex gap-3 items-start max-w-[85%] bg-surface-c px-4 py-3 rounded-2xl">
                                    <div className="flex-1 min-w-0">
                                        <UserMessage content={content} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3 items-start w-full">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-primary">D Admin</span>
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
                <div className="flex justify-start w-full mt-6">
                    <div className="flex gap-3 items-start w-full">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-primary">D Admin</span>
                            </div>
                            <div className="flex items-center">
                                <Icon icon="svg-spinners:3-dots-fade" className="text-2xl text-secondary" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

Messages.displayName = 'Messages';
