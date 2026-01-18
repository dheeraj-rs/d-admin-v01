import React, { useState } from 'react';
import { Icon } from '@iconify/react';
// =======
import type { Message } from 'ai';
import { type RefCallback } from 'react';
import { ClientOnly } from './components/ClientOnly';
import { IconButton } from './components/ui/IconButton';
import { classNames } from './utils/classNames';
import { Messages } from './components/chat/Messages.client';
import { ModelSelector, type ModelProvider } from './components/chat/ModelSelector';
import { SendButton } from './components/chat/SendButton.client';


interface BaseChatProps {
    textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
    messageRef?: RefCallback<HTMLDivElement> | undefined;
    scrollRef?: RefCallback<HTMLDivElement> | undefined;
    showChat?: boolean;
    chatStarted?: boolean;
    isStreaming?: boolean;
    messages?: Message[];
    enhancingPrompt?: boolean;
    promptEnhanced?: boolean;
    input?: string;
    handleStop?: () => void;
    sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
    handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    enhancePrompt?: () => void;
    selectedProvider?: ModelProvider;
    onProviderChange?: (provider: ModelProvider) => void;
    onHistoryClick?: () => void;
    buildError?: boolean;
    onFixError?: () => void;
}

const EXAMPLE_PROMPTS = [
    { text: 'Build a todo app in React using Tailwind' },
    { text: 'Build a simple blog using Astro' },
    { text: 'Create a cookie consent form using Material UI' },
    { text: 'Make a space invaders game' },
    { text: 'How do I center a div?' },
];

export const ChatInterface = React.forwardRef<HTMLDivElement, BaseChatProps>(
    ({
        textareaRef,
        messageRef,
        scrollRef,
        showChat = true,
        chatStarted = false,
        isStreaming = false,
        enhancingPrompt = false,
        promptEnhanced = false,
        messages,
        input = '',
        sendMessage,
        handleInputChange,
        enhancePrompt,
        handleStop,
        selectedProvider = 'google',
        onProviderChange = () => { },
        onHistoryClick,
        buildError,
        onFixError,
    },
        ref,) => {


        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
        const [attachedImage, setAttachedImage] = useState<string | null>(null);
        const fileInputRef = React.useRef<HTMLInputElement>(null);

        const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    setAttachedImage(event.target?.result as string);
                    setIsMenuOpen(false);
                };
                reader.readAsDataURL(file);
            }
        };
        // ============

        return (
            <div className="flex flex-col flex-grow relative z-9 overflow-hidden w-full h-full" ref={ref}>
                <div className="flex flex-col h-full" ref={scrollRef}>
                    <div className="overflow-y-auto w-full h-full relative">
                        {chatStarted ? (
                            <ClientOnly>
                                {() => {
                                    return (
                                        <Messages
                                            ref={messageRef}
                                            className="flex flex-col w-full flex-1 max-w-4xl px-4 mx-auto z-1"
                                            messages={messages}
                                            isStreaming={isStreaming}
                                        />
                                    );
                                }}
                            </ClientOnly>
                        ) : (
                            <div id="intro" className="h-full flex flex-col items-center justify-center">
                                <h1 className="text-5xl text-center font-bold text-primary mb-2">
                                    What will you build today?
                                </h1>
                                <p className="mb-4 text-center text-secondary">
                                    Create stunning apps & websites by chatting with AI.
                                </p>

                                {/* Example prompts in the center */}
                                <div id="examples-center" className="flex flex-col gap-2">
                                    {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
                                        <button
                                            key={index}
                                            onClick={(event) => sendMessage?.(event, examplePrompt.text)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                                        >
                                            {examplePrompt.text}
                                            <Icon icon="ph:arrow-right" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* <section aria-label="Chat" className="h-full bg-red-500 flex flex-col w-full flex-1 max-w-chat py-[1rem] mx-auto z-1 text-sm pl-1"> */}
                        {/* <div className="relative flex flex-col overflow-hidden mx-[1rem] bg-[var(--d-admin-surface-ground)] px-4 py-3 rounded-lg self-end" data-message-id="ob7bfUjX9XEU52AF">
                            <div className="grid grid-col-1 w-full">
                                <div className="overflow-hidden">
                                    <div className="markdown-content">
                                        <p>hi</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="relative flex flex-col overflow-hidden mx-[1rem]" data-message-id="6WgN99BeD4Z9nCG6">
                            <div className="grid grid-col-1 w-full">
                                <div className="grid [&>*]:[grid-area:1/1/2/2]">
                                    <div className="flex flex-col gap-3 overflow-hidden w-full">
                                        <div className="flex items-center min-h-6.5 select-none justify-between">
                                            <Icon icon="logos:bolt" className="w-[40px] -translate-x-3px" />
                                            <button className="flex items-center text-[var(--d-admin-text-color-secondary)] bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-[var(--d-admin-text-color)] enabled:hover:bg-[var(--d-admin-surface-hover)] p-1 focus:outline-none" type="button" id="radix-:r4j:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                                                <Icon icon="ph:dots-three-outline-fill" className="text-sm" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="markdown-content">
                                                <p>Hi! How can I help you today?</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 whitespace-nowrap" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none', transformOrigin: '0% 50% 0px' }}>
                                                <div className="inline-block min-w-[240px]">
                                                    <div className="relative h-16 flex items-center justify-between p-3 py-2 rounded-lg border transition-colors mt-2 mb-6 max-w-[360px] bg-[var(--d-admin-blue-600)]/5 dark:bg-[var(--d-admin-blue-600)]/7 border-[var(--d-admin-blue-600)]/20">
                                                        <div className="flex-col min-w-0 pr-0">
                                                            <div className="flex items-center gap-1">
                                                                <div className="font-medium text-sm text-[var(--d-admin-text-color)] truncate" title="Add initial greeting" style={{ maxWidth: '300px' }}>Add initial greeting</div>
                                                                <button aria-label="Bookmark" className="flex items-center justify-center shrink-0 group/button text-base leading-none disabled:cursor-not-allowed focus-visible:ring-2 outline-none relative size-6 rounded text-[var(--d-admin-blue-600)] focus-visible:ring-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-blue-600)]/10" data-state="closed">
                                                                    <div className=""><Icon icon="heroicons:bookmark" className="block size-4" /></div>
                                                                </button>
                                                            </div>
                                                            <div className="text-xs text-[var(--d-admin-text-color-secondary)] opacity-70 pt-1">Version 1</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* </section> */}

                        {/* <div className="sticky h-0 z-scroller flex justify-center w-full" style={{ bottom: '203.5px', opacity: 0, visibility: 'hidden', transform: 'translateY(32px) translateZ(0px)' }}>
                        <button className="flex items-center justify-center size-8 rounded-full shadow shadow-md bg-[var(--d-admin-surface-section)] text-[var(--d-admin-text-color)]">
                            <Icon icon="ph:arrow-down" className="size-4.5" />
                        </button>
                    </div> */}
                    </div>

                    <div className="z-20">
                        <div className="p-3 pr-3 pb-3 md:pr-1 w-full max-w-chat mx-auto z-prompt">
                            {/* <div className="absolute inset-y-0" style={{ left: 'var(--chat-padding)', right: 'var(--chat-padding)' }}></div> */}
                            <div className="relative" style={{ height: '0px' }}>
                                <div className="flex flex-wrap justify-between py-1 px-2 -top-px absolute transition-opacity duration-350 rounded-t-lg text-xs truncate border left-2 w-[calc(100%-1rem)] border-b-0 border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] backdrop-blur opacity-0">
                                    <span>300K daily tokens remaining.</span>
                                    <button className="bg-transparent font-medium inline-block text-[var(--d-admin-blue-600)] hover:underline mr-4">Switch to Pro for 33x more usage</button>
                                    <button className="flex items-center text-[var(--d-admin-text-color-secondary)] bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-[var(--d-admin-text-color)] enabled:hover:bg-[var(--d-admin-surface-hover)] p-0.5 absolute top-1 right-1">
                                        <Icon icon="ph:x" className="text-xs" />
                                    </button>
                                </div>
                            </div>
                            <div className="relative shadow-xs p-[1px] rounded-lg">
                                {/* <div className="absolute inset-0 bg-[var(--d-admin-surface-border)] -z-1"></div> */}
                                <div className="bg-[var(--d-admin-surface-card)] rounded-lg dark:shadow-lg">
                                    <div className="border-transparent" style={{ height: '0px' }}>
                                        <div className="overflow-hidden h-full border-[var(--d-admin-surface-border)] relative bg-[var(--d-admin-surface-section)] transition-opacity duration-200 rounded-t-[0.44rem] border-b-px left-0 right-0 opacity-0">
                                            <div className="flex py-2.5 px-2.5 font-medium text-xs">
                                                <div className="flex justify-between items-center w-full gap-3">
                                                    <div className="flex items-center gap-2"></div>
                                                    <div className="flex gap-2 items-center">
                                                        <button className="bg-transparent text-[var(--d-admin-blue-600)] hover:underline px-2 py-1.5 text-xs">Clear</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b-px border-transparent" style={{ height: '0px' }}>
                                        <div className="overflow-hidden h-full border-[var(--d-admin-surface-border)] relative bg-[var(--d-admin-surface-section)] transition-opacity duration-200 rounded-t-[0.44rem] border-b-px left-0 right-0 opacity-0">
                                            <div className="flex text-xs py-1.5 px-2.5 font-medium">
                                                <div className="flex-grow"></div>
                                                <button className="bg-transparent text-[var(--d-admin-blue-600)] hover:underline">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative select-none">
                                        {attachedImage && (
                                            <div className="px-5 pt-4 pb-0">
                                                <div className="relative group w-20 h-20 bg-[var(--d-admin-surface-card)] rounded-lg overflow-hidden border border-[var(--d-admin-surface-border)]">
                                                    <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => setAttachedImage(null)}
                                                        className="absolute top-1 right-1 p-1 bg-transparent hover:bg-[var(--d-admin-surface-hover)] text-[var(--d-admin-text-color)] rounded-full transition-colors border border-[var(--d-admin-surface-border)] flex items-center justify-center"
                                                    >
                                                        <Icon icon="ph:x" className="size-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <textarea ref={textareaRef} onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                if (event.shiftKey) {
                                                    return;
                                                }
                                                event.preventDefault();
                                                sendMessage?.(event);
                                            }
                                        }}
                                            value={input}
                                            onChange={(event) => {
                                                handleInputChange?.(event);
                                            }} aria-label="How can Bolt help you today? (or /command)" className="w-full pl-5 pt-5 pr-16 focus:outline-none resize-none text-[var(--d-admin-text-color)] placeholder-[var(--d-admin-gray-600)] bg-transparent text-sm" placeholder="How can Bolt help you today? (or /command)" translate="no" style={{ minHeight: '80px', maxHeight: '400px', height: '80px', overflowY: 'hidden' }} />
                                    </div>
                                    <div className="flex justify-between items-center text-sm px-3 pb-3 pt-2 gap-2">
                                        <div className="flex gap-1 items-center min-w-0 flex-shrink">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                    aria-label="Prompt actions"
                                                    className={`flex items-center justify-center shrink-0 group/button text-base leading-none disabled:cursor-not-allowed focus-visible:ring-2 outline-none relative size-7 text-[var(--d-admin-text-color)] focus-visible:ring-[var(--d-admin-blue-600)] bg-[var(--d-admin-surface-hover)] enabled:hover:bg-[var(--d-admin-surface-hover)] rounded-full transition-all ${isMenuOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                                                    type="button"
                                                    aria-haspopup="menu"
                                                    aria-expanded={isMenuOpen}
                                                    data-state={isMenuOpen ? 'open' : 'closed'}
                                                >
                                                    <div className="">
                                                        {isMenuOpen ? (
                                                            <Icon icon="ph:x" className="block size-4" />
                                                        ) : (
                                                            <Icon icon="heroicons:plus" className="block size-4 transition-transform duration-300 ease-out" />
                                                        )}
                                                    </div>
                                                </button>

                                                {isMenuOpen && (
                                                    <div className="absolute bottom-full left-0 mb-2 w-56 p-1 rounded-xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
                                                        <div className="flex flex-col gap-0.5">
                                                            <button
                                                                onClick={() => {
                                                                    fileInputRef.current?.click();
                                                                }}
                                                                className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] rounded-lg w-full text-left transition-colors"
                                                            >
                                                                <Icon icon="ph:file-plus" className="text-lg text-[var(--d-admin-text-color-secondary)]" />
                                                                <span>Attach file</span>
                                                            </button>
                                                            <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] rounded-lg w-full text-left transition-colors">
                                                                <Icon icon="ph:notebook" className="text-lg text-[var(--d-admin-text-color-secondary)]" />
                                                                <span>Open Prompt Library</span>
                                                            </button>
                                                            <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] rounded-lg w-full text-left transition-colors">
                                                                <Icon icon="ph:sparkle" className="text-lg text-[var(--d-admin-text-color-secondary)]" />
                                                                <span className="text-[var(--d-admin-gray-600)]">Enhance prompt</span>
                                                            </button>
                                                            <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)] rounded-lg w-full text-left transition-colors">
                                                                <Icon icon="ph:question" className="text-lg text-[var(--d-admin-text-color-secondary)]" />
                                                                <span>Search Help Center</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex">
                                                <div className="ml-1">
                                                    <div style={{ opacity: 1 }}>
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
                                                                className="flex items-center justify-center shrink-0 min-w-0 max-w-full focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 text-xs px-2 h-7 focus-visible:outline-[var(--d-admin-blue-600)] bg-transparent enabled:hover:bg-[var(--d-admin-surface-hover)] rounded-full group/button font-normal text-[var(--d-admin-text-color)] dark:text-[var(--d-admin-text-color)] hover:text-[var(--d-admin-text-color)]"
                                                                type="button"
                                                                aria-haspopup="menu"
                                                                aria-expanded={isModelPickerOpen}
                                                                data-state={isModelPickerOpen ? 'open' : 'closed'}
                                                            >
                                                                <Icon icon="logos:claude" className="[--agent-color:#D97757] size-4 group-hover/button:text-[--agent-color] flex items-center justify-center h-4 text-base leading-4" />
                                                                <span className="truncate"><span className="ml-1 text-xs">{selectedProvider}</span></span>
                                                                <Icon icon="heroicons:chevron-up-down" className="size-3 opacity-70 group-hover/button:opacity-100 flex items-center justify-center h-4 text-base leading-4" />
                                                            </button>

                                                            {isModelPickerOpen && (
                                                                <ClientOnly>
                                                                    {() => (
                                                                        <ModelSelector value={selectedProvider} handleSelectModel={onProviderChange} />
                                                                    )}
                                                                </ClientOnly>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 hidden sm:block"></div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <IconButton
                                                title="Enhance prompt"
                                                disabled={input.length === 0 || enhancingPrompt}
                                                className={classNames({
                                                    'opacity-100!': enhancingPrompt,
                                                    'text-blue-500! pr-1.5 enabled:hover:bg-blue-500/10!':
                                                        promptEnhanced,
                                                })}
                                                onClick={() => enhancePrompt?.()}
                                            >
                                                {enhancingPrompt ? (
                                                    <>
                                                        <Icon icon="svg-spinners:90-ring-with-bg" className="text-blue-500 text-xl" />
                                                        <div className="ml-1.5">Enhancing prompt...</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon icon="ph:sparkle" className="text-xl" />
                                                        {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
                                                    </>
                                                )}
                                            </IconButton>
                                            {buildError && (
                                                <IconButton
                                                    title="Fix Build Error"
                                                    className="text-red-500! hover:bg-red-500/10!"
                                                    onClick={() => onFixError?.()}
                                                >
                                                    <Icon icon="ph:wrench-duotone" className="text-xl" />
                                                    <div className="ml-1.5">Fix Build Error</div>
                                                </IconButton>
                                            )}
                                            <button type="button" className="rounded-full px-2 h-7 flex items-center gap-1 text-xs bg-transparent text-[var(--d-admin-gray-600)] hover:text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)]" disabled aria-pressed="false">
                                                <Icon icon="ph:cursor-click" className="w-4 h-4" />
                                                <span className="hidden sm:inline">Select</span>
                                            </button>
                                            <div className="flex items-center gap-2 z-prompt">
                                                <button type="button" className="rounded-full px-2 h-7 flex items-center gap-1 text-xs bg-transparent text-[var(--d-admin-gray-600)] hover:text-[var(--d-admin-text-color)] hover:bg-[var(--d-admin-surface-hover)]" aria-pressed="false">
                                                    <Icon icon="ph:lightbulb" className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Plan</span>
                                                </button>
                                            </div>
                                            <ClientOnly>
                                                {() => (
                                                    <SendButton
                                                        show={true}
                                                        isStreaming={isStreaming}
                                                        onClick={(event) => {
                                                            if (isStreaming) {
                                                                handleStop?.();
                                                                return;
                                                            }
                                                            sendMessage?.(event);
                                                        }}
                                                    />
                                                )}
                                            </ClientOnly>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelection}
                                            aria-hidden="true"
                                            tabIndex={-1}
                                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.txt,.doc,.docx,.py,.ipynb,.js,.mjs,.cjs,.jsx,.html,.css,.scss,.sass,.ts,.tsx,.java,.cs,.php,.c,.cc,.cpp,.cxx,.h,.hh,.hpp,.rs,.swift,.go,.rb,.kt,.kts,.scala,.sh,.bash,.zsh,.bat,.csv,.log,.ini,.cfg,.config,.json,.yaml,.yml,.toml,.lua,.sql,.md,.tex,.latex,.asm,.ino,.s"
                                            multiple
                                            style={{ display: 'none', visibility: 'hidden' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Chat /> */}
            </div>
        );
    });


export default ChatInterface;