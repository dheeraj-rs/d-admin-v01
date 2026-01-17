import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export function ChatInterface() {
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

    return (
        <div className="_Chat_t1btp_5 selection-accent flex flex-col flex-grow relative z-9 overflow-auto w-[var(--chat-min-width)]">
            <div className="flex flex-col h-full">
                <section aria-label="Chat" className="flex flex-col gap-[--chat-messages-gap] w-full flex-1 max-w-chat py-[--chat-padding] mx-auto z-1 text-sm pl-1">
                    <div className="relative flex flex-col overflow-hidden mx-[var(--chat-padding)] bg-bolt-elements-messages-background px-4 py-3 rounded-lg self-end" data-message-id="ob7bfUjX9XEU52AF">
                        <div className="grid grid-col-1 w-full">
                            <div className="overflow-hidden">
                                <div className="_MarkdownContent_19116_1">
                                    <p>hi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex flex-col overflow-hidden mx-[var(--chat-padding)]" data-message-id="6WgN99BeD4Z9nCG6">
                        <div className="grid grid-col-1 w-full">
                            <div className="grid [&>*]:[grid-area:1/1/2/2]">
                                <div className="pointer-events-none" style={{
                                    height: `calc(
                    100vh
                    - var(--header-height)
                    - var(--computed-last-user-message-height)
                    - var(--computed-prompt-box-height)
                    - var(--chat-messages-gap)
                    - var(--chat-padding)
                    - var(--workbench-top-offset)
                  )`
                                }}></div>
                                <div className="flex flex-col gap-3 overflow-hidden w-full">
                                    <div className="flex items-center min-h-6.5 select-none justify-between">
                                        <Icon icon="logos:bolt" className="w-[40px] -translate-x-3px" />
                                        <button className="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-1 focus:outline-none" type="button" id="radix-:r4j:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                                            <Icon icon="ph:dots-three-outline-fill" className="text-sm" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="_MarkdownContent_19116_1">
                                            <p>Hi! How can I help you today?</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 whitespace-nowrap" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none', transformOrigin: '0% 50% 0px' }}>
                                            <div className="inline-block min-w-[240px]">
                                                <div className="relative h-16 flex items-center justify-between p-3 py-2 rounded-lg border transition-colors mt-2 mb-6 max-w-[360px] bg-bolt-ds-brand/5 dark:bg-bolt-ds-brand/7 border-bolt-ds-brand/20">
                                                    <div className="flex-col min-w-0 pr-0">
                                                        <div className="flex items-center gap-1">
                                                            <div className="font-medium text-sm text-bolt-ds-textPrimary truncate" title="Add initial greeting" style={{ maxWidth: '300px' }}>Add initial greeting</div>
                                                            <button aria-label="Bookmark" className="flex items-center justify-center shrink-0 group/button text-base leading-none disabled:cursor-not-allowed focus-visible:ring-2 outline-none relative size-6 rounded text-bolt-ds-brand focus-visible:ring-bolt-ds-brandHighlight bg-transparent enabled:hover:bg-bolt-ds-brand/10" data-state="closed">
                                                                <div className=""><Icon icon="heroicons:bookmark" className="block size-4" /></div>
                                                            </button>
                                                        </div>
                                                        <div className="text-xs text-bolt-ds-textSecondary opacity-70 pt-1">Version 1</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="sticky h-0 z-scroller flex justify-center w-full" style={{ bottom: '203.5px', opacity: 0, visibility: 'hidden', transform: 'translateY(32px) translateZ(0px)' }}>
                    <button className="flex items-center justify-center size-8 rounded-full shadow shadow-bolt-elements-messages-scroller-shadow bg-bolt-elements-messages-scroller-background text-bolt-elements-messages-scroller-icon">
                        <Icon icon="ph:arrow-down" className="size-4.5" />
                    </button>
                </div>

                <div className="z-20 sticky bottom-0">
                    <div className="px-[var(--chat-padding)] w-full max-w-chat mx-auto z-prompt sticky bottom-0 bg-bolt-elements-background-depth-1">
                        <div className="absolute inset-y-0" style={{ left: 'var(--chat-padding)', right: 'var(--chat-padding)' }}></div>
                        <div className="relative" style={{ height: '0px' }}>
                            <div className="flex flex-wrap justify-between py-1 px-2 -top-px absolute transition-opacity duration-350 rounded-t-lg text-xs truncate border left-2 w-[calc(100%-1rem)] border-b-0 border-bolt-elements-borderColor bg-bolt-elements-prompt-subscribeButton-background backdrop-blur opacity-0">
                                <span>300K daily tokens remaining.</span>
                                <button className="bg-transparent font-medium inline-block text-bolt-elements-link hover:underline mr-4">Switch to Pro for 33x more usage</button>
                                <button className="flex items-center text-bolt-elements-item-contentDefault bg-transparent rounded-md disabled:cursor-not-allowed enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive p-0.5 absolute top-1 right-1">
                                    <Icon icon="ph:x" className="text-xs" />
                                </button>
                            </div>
                        </div>
                        <div className="relative shadow-xs p-[1px] rounded-lg">
                            <div className="absolute inset-0 bg-bolt-elements-prompt-border -z-1"></div>
                            <div className="bg-bolt-elements-prompt-background rounded-lg dark:shadow-lg">
                                <div className="border-transparent" style={{ height: '0px' }}>
                                    <div className="overflow-hidden h-full border-bolt-elements-borderColor relative bg-bolt-elements-background-depth-2 transition-opacity duration-200 rounded-t-[0.44rem] border-b-px left-0 right-0 opacity-0">
                                        <div className="flex py-2.5 px-2.5 font-medium text-xs">
                                            <div className="flex justify-between items-center w-full gap-3">
                                                <div className="flex items-center gap-2"></div>
                                                <div className="flex gap-2 items-center">
                                                    <button className="bg-transparent text-bolt-elements-link hover:underline px-2 py-1.5 text-xs">Clear</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-px border-transparent" style={{ height: '0px' }}>
                                    <div className="overflow-hidden h-full border-bolt-elements-borderColor relative bg-bolt-elements-background-depth-2 transition-opacity duration-200 rounded-t-[0.44rem] border-b-px left-0 right-0 opacity-0">
                                        <div className="flex text-xs py-1.5 px-2.5 font-medium">
                                            <div className="flex-grow"></div>
                                            <button className="bg-transparent text-bolt-elements-link hover:underline">Update</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative select-none">
                                    {attachedImage && (
                                        <div className="px-5 pt-4 pb-0">
                                            <div className="relative group w-20 h-20 bg-bolt-elements-background-depth-3 rounded-lg overflow-hidden border border-bolt-elements-borderColor">
                                                <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setAttachedImage(null)}
                                                    className="absolute top-1 right-1 p-1 bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textPrimary rounded-full transition-colors border border-bolt-elements-borderColor flex items-center justify-center"
                                                >
                                                    <Icon icon="ph:x" className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <textarea aria-label="How can Bolt help you today? (or /command)" className="w-full pl-5 pt-5 pr-16 focus:outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm" placeholder="How can Bolt help you today? (or /command)" translate="no" style={{ minHeight: '80px', maxHeight: '400px', height: '80px', overflowY: 'hidden' }}></textarea>
                                </div>
                                <div className="flex justify-between items-center text-sm px-3 pb-3 pt-2 gap-2">
                                    <div className="flex gap-1 items-center min-w-0 flex-shrink">
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                aria-label="Prompt actions"
                                                className={`flex items-center justify-center shrink-0 group/button text-base leading-none disabled:cursor-not-allowed focus-visible:ring-2 outline-none relative size-7 text-bolt-ds-iconPrimary focus-visible:ring-bolt-ds-brandHighlight bg-bolt-ds-inverseSurface/10 enabled:hover:bg-bolt-ds-inverseSurface/15 rounded-full transition-all ${isMenuOpen ? 'bg-bolt-ds-inverseSurface/15' : ''}`}
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
                                                <div className="absolute bottom-full left-0 mb-2 w-56 p-1 rounded-xl border border-bolt-elements-borderColor bg-[#1E1E21] shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => {
                                                                fileInputRef.current?.click();
                                                            }}
                                                            className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors"
                                                        >
                                                            <Icon icon="ph:file-plus" className="text-lg text-bolt-elements-textSecondary" />
                                                            <span>Attach file</span>
                                                        </button>
                                                        <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors">
                                                            <Icon icon="ph:notebook" className="text-lg text-bolt-elements-textSecondary" />
                                                            <span>Open Prompt Library</span>
                                                        </button>
                                                        <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors">
                                                            <Icon icon="ph:sparkle" className="text-lg text-bolt-elements-textSecondary" />
                                                            <span className="text-bolt-elements-textTertiary">Enhance prompt</span>
                                                        </button>
                                                        <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors">
                                                            <Icon icon="ph:question" className="text-lg text-bolt-elements-textSecondary" />
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
                                                            className="flex items-center justify-center shrink-0 min-w-0 max-w-full focus-visible:outline-2 disabled:op-50 relative disabled:cursor-not-allowed gap-1 text-xs px-2 h-7 focus-visible:outline-bolt-ds-brandHighlight bg-transparent enabled:hover:bg-bolt-ds-inverseSurface/7 rounded-full group/button font-normal text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary hover:text-bolt-elements-textPrimary"
                                                            type="button"
                                                            aria-haspopup="menu"
                                                            aria-expanded={isModelPickerOpen}
                                                            data-state={isModelPickerOpen ? 'open' : 'closed'}
                                                        >
                                                            <Icon icon="logos:claude" className="[--agent-color:#D97757] size-4 group-hover/button:text-[--agent-color] flex items-center justify-center h-4 text-base leading-4" />
                                                            <span className="truncate"><span className="ml-1 text-xs">Sonnet 4.5</span></span>
                                                            <Icon icon="heroicons:chevron-up-down" className="size-3 opacity-70 group-hover/button:opacity-100 flex items-center justify-center h-4 text-base leading-4" />
                                                        </button>

                                                        {isModelPickerOpen && (
                                                            <div className="absolute bottom-full left-0 mb-2 w-64 p-1 rounded-xl border border-bolt-elements-borderColor bg-[#1E1E21] shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <div className="px-2 py-1.5 text-xs font-medium text-bolt-elements-textTertiary">Model</div>
                                                                    <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors bg-bolt-elements-item-backgroundActive/50">
                                                                        <Icon icon="logos:claude" className="text-lg" />
                                                                        <div className="flex flex-col">
                                                                            <span>Claude 3.5 Sonnet</span>
                                                                            <span className="text-[10px] text-bolt-elements-textTertiary">Most intelligent model</span>
                                                                        </div>
                                                                        <Icon icon="ph:check" className="ml-auto text-bolt-elements-textSecondary" />
                                                                    </button>
                                                                    <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors">
                                                                        <Icon icon="logos:openai-icon" className="text-lg" />
                                                                        <div className="flex flex-col">
                                                                            <span>GPT-4o</span>
                                                                            <span className="text-[10px] text-bolt-elements-textTertiary">High intelligence and speed</span>
                                                                        </div>
                                                                    </button>
                                                                    <button className="flex items-center gap-2 px-2 py-1.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive rounded-lg w-full text-left transition-colors">
                                                                        <Icon icon="logos:google-gemini" className="text-lg" />
                                                                        <div className="flex flex-col">
                                                                            <span>Gemini 1.5 Pro</span>
                                                                            <span className="text-[10px] text-bolt-elements-textTertiary">Great for large contexts</span>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 hidden sm:block"></div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button type="button" className="rounded-full px-2 h-7 flex items-center gap-1 text-xs bg-bolt-elements-item-backgroundDefault text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive" disabled aria-pressed="false">
                                            <Icon icon="ph:cursor-click" className="w-4 h-4" />
                                            <span className="hidden sm:inline">Select</span>
                                        </button>
                                        <div className="flex items-center gap-2 z-prompt">
                                            <button type="button" className="rounded-full px-2 h-7 flex items-center gap-1 text-xs bg-bolt-elements-item-backgroundDefault text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive" aria-pressed="false">
                                                <Icon icon="ph:lightbulb" className="w-4 h-4" />
                                                <span className="hidden sm:inline">Plan</span>
                                            </button>
                                        </div>
                                        <button className="flex justify-center bg-accent-500 enabled:hover:brightness-94 text-white rounded-full transition-theme disabled:cursor-not-allowed disabled:opacity-50 shrink-0 overflow-hidden items-center p-1 size-7" disabled aria-label="Send message">
                                            <Icon icon="heroicons-outline:arrow-up" className="size-4" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none' }} />
                                        </button>
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
                        <div className="pb-[var(--chat-padding)]"></div>
                        <div className="absolute inset-0 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
