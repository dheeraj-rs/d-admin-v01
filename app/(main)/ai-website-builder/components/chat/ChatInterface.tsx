import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
// =======
import type { Message } from 'ai';
import { type RefCallback } from 'react';
import { ClientOnly } from '../ui/ClientOnly';
import { IconButton } from '../ui/UiIconButton';
import { classNames } from '../../utils/classNames';
import { Messages } from './ChatMessageList.client';
import {
  ModelSelector,
  MODELS,
  type ModelProvider,
} from './ChatModelSelector';
import { SendButton } from './ChatSendButton.client';

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
  (
    {
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
      onProviderChange = () => {},
      onHistoryClick,
      buildError,
      onFixError,
    },
    ref,
  ) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const modelSelectorRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modelSelectorRef.current &&
          !modelSelectorRef.current.contains(event.target as Node)
        ) {
          setIsModelPickerOpen(false);
        }
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      };

      if (isModelPickerOpen || isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isModelPickerOpen, isMenuOpen]);

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
      <div
        className="relative z-9 flex h-full w-full flex-grow flex-col overflow-hidden"
        ref={ref}
      >
        <div className="flex h-full flex-col">
          <div
            className="relative h-full w-full overflow-y-auto scroll-smooth"
            ref={scrollRef}
          >
            {chatStarted ? (
              <ClientOnly>
                {() => {
                  return (
                    <Messages
                      ref={messageRef}
                      className="z-1 mx-auto flex w-full max-w-4xl flex-1 flex-col px-4"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  );
                }}
              </ClientOnly>
            ) : (
              <div
                id="intro"
                className="relative flex h-full flex-col items-center justify-center overflow-hidden px-4"
              >
                {/* Subtle background glow */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[var(--d-admin-primary-color)]/30 blur-3xl"></div>
                  <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-[var(--d-admin-primary-color)]/20 blur-3xl"></div>
                </div>

                {/* Main content */}
                <div className="relative z-10 w-full max-w-2xl">
                  {/* Title */}
                  <div className="mb-6 space-y-2 text-center">
                    <h1 className="animate-in fade-in slide-in-from-bottom-4 mb-2 text-4xl font-bold text-[var(--d-admin-text-color)] duration-700 md:text-5xl">
                      <span className="bg-gradient-to-r from-[var(--d-admin-primary-color)] to-[var(--d-admin-primary-600)] bg-clip-text text-transparent">
                        What will you build today?
                      </span>
                    </h1>
                    <p
                      className="animate-in fade-in slide-in-from-bottom-4 text-sm text-[var(--d-admin-text-color-secondary)] duration-700"
                      style={{ animationDelay: '100ms' }}
                    >
                      Create stunning apps & websites by chatting with AI.
                    </p>
                  </div>

                  {/* Scrollable Text List with Border */}
                  <div className="p-4">
                    <div className="scrollbar-thin scrollbar-thumb-[var(--d-admin-surface-border)] scrollbar-track-transparent max-h-[400px] overflow-y-auto px-2">
                      <div className="flex flex-col items-center gap-1">
                        {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
                          <button
                            key={index}
                            onClick={(event) =>
                              sendMessage?.(event, examplePrompt.text)
                            }
                            className="group animate-in fade-in slide-in-from-bottom-4 relative px-4 py-2 transition-all duration-300"
                            style={{
                              animationDelay: `${200 + index * 80}ms`,
                              animationFillMode: 'backwards',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {/* Text with gradient on hover */}
                              <span className="text-base font-medium text-[var(--d-admin-text-color)] transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[var(--d-admin-primary-color)] group-hover:to-[var(--d-admin-primary-600)] group-hover:bg-clip-text group-hover:text-transparent">
                                {examplePrompt.text}
                              </span>

                              {/* Arrow right next to text */}
                              <Icon
                                icon="ph:arrow-right"
                                className="text-lg text-[var(--d-admin-text-color-secondary)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--d-admin-primary-color)]"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
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

          <div className="z-20" data-chat-input>
            <div className="max-w-chat z-prompt mx-auto w-full p-3 pr-3 pb-3 md:pr-1">
              {/* <div className="absolute inset-y-0" style={{ left: 'var(--chat-padding)', right: 'var(--chat-padding)' }}></div> */}
              <div className="relative" style={{ height: '0px' }}>
                <div className="absolute -top-px left-2 flex w-[calc(100%-1rem)] flex-wrap justify-between truncate rounded-t-lg border border-b-0 border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] px-2 py-1 text-xs opacity-0 backdrop-blur transition-opacity duration-350">
                  <span>300K daily tokens remaining.</span>
                  <button className="mr-4 inline-block bg-transparent font-medium text-[var(--d-admin-blue-600)] hover:underline">
                    Switch to Pro for 33x more usage
                  </button>
                  <button className="absolute top-1 right-1 flex items-center rounded-md bg-transparent p-0.5 text-[var(--d-admin-text-color-secondary)] enabled:hover:bg-[var(--d-admin-surface-hover)] enabled:hover:text-[var(--d-admin-text-color)] disabled:cursor-not-allowed">
                    <Icon icon="ph:x" className="text-xs" />
                  </button>
                </div>
              </div>
              <div className="relative rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] p-[1px] shadow-xs">
                {/* <div className="absolute inset-0 bg-[var(--d-admin-surface-border)] -z-1"></div> */}

                {attachedImage && (
                  <div className="p-3">
                    <div className="group relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-card)]">
                      <img
                        src={attachedImage}
                        alt="Attached"
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => setAttachedImage(null)}
                        className="absolute top-1 right-1 flex items-center justify-center rounded-full border border-[var(--d-admin-surface-border)] bg-transparent p-1 text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                      >
                        <Icon icon="ph:x" className="size-3" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="rounded-lg dark:shadow-lg">
                  <div className="border-transparent" style={{ height: '0px' }}>
                    <div className="border-b-px relative right-0 left-0 h-full overflow-hidden rounded-t-[0.44rem] border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] opacity-0 transition-opacity duration-200">
                      <div className="flex px-2.5 py-2.5 text-xs font-medium">
                        <div className="flex w-full items-center justify-between gap-3">
                          <div className="flex items-center gap-2"></div>
                          <div className="flex items-center gap-2">
                            <button className="bg-transparent px-2 py-1.5 text-xs text-[var(--d-admin-blue-600)] hover:underline">
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="border-b-px border-transparent"
                    style={{ height: '0px' }}
                  >
                    <div className="border-b-px relative right-0 left-0 h-full overflow-hidden rounded-t-[0.44rem] border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] opacity-0 transition-opacity duration-200">
                      <div className="flex px-2.5 py-1.5 text-xs font-medium">
                        <div className="flex-grow"></div>
                        <button className="bg-transparent text-[var(--d-admin-blue-600)] hover:underline">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative select-none">
                    <textarea
                      ref={textareaRef}
                      onKeyDown={(event) => {
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
                      }}
                      aria-label="How can D Admin help you today?"
                      className="w-full resize-none bg-transparent pt-5 pr-16 pl-5 text-sm text-[var(--d-admin-text-color)] placeholder-[var(--d-admin-gray-600)] focus:outline-none"
                      placeholder="How can D Admin help you today?"
                      translate="no"
                      style={{
                        minHeight: '80px',
                        maxHeight: '400px',
                        height: '80px',
                        overflowY: 'hidden',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 pt-2 pb-3 text-sm">
                    <div className="flex min-w-0 flex-shrink items-center gap-1">
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                          aria-label="Prompt actions"
                          className={`group/button relative flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--d-admin-surface-hover)] text-base leading-none text-[var(--d-admin-text-color)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--d-admin-blue-600)] enabled:hover:bg-[var(--d-admin-surface-hover)] disabled:cursor-not-allowed ${isMenuOpen ? 'bg-[var(--d-admin-surface-hover)]' : ''}`}
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded={isMenuOpen}
                          data-state={isMenuOpen ? 'open' : 'closed'}
                        >
                          <div className="">
                            {isMenuOpen ? (
                              <Icon icon="ph:x" className="block size-4" />
                            ) : (
                              <Icon
                                icon="heroicons:plus"
                                className="block size-4 transition-transform duration-300 ease-out"
                              />
                            )}
                          </div>
                        </button>

                        {isMenuOpen && (
                          <div className="animate-in fade-in zoom-in-95 absolute bottom-full left-0 z-50 mb-2 w-56 origin-bottom-left overflow-hidden rounded-xl border border-[var(--d-admin-surface-border)] bg-[var(--d-admin-surface-section)] p-1 shadow-lg duration-100">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => {
                                  fileInputRef.current?.click();
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]"
                              >
                                <Icon
                                  icon="ph:file-plus"
                                  className="text-lg text-[var(--d-admin-text-color-secondary)]"
                                />
                                <span>Attach file</span>
                              </button>
                              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-[var(--d-admin-text-color)] transition-colors hover:bg-[var(--d-admin-surface-hover)]">
                                <Icon
                                  icon="ph:question"
                                  className="text-lg text-[var(--d-admin-text-color-secondary)]"
                                />
                                <span>Search Help Center</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex">
                        <div className="ml-1">
                          <div style={{ opacity: 1 }}>
                            <div className="relative" ref={modelSelectorRef}>
                              {(() => {
                                const model = MODELS.find(
                                  (m) => m.value === selectedProvider,
                                );
                                const label = model?.label || selectedProvider;
                                const icon = model?.icon || 'logos:claude';

                                return (
                                  <>
                                    <button
                                      onClick={() =>
                                        setIsModelPickerOpen(!isModelPickerOpen)
                                      }
                                      className="disabled:op-50 group/button relative flex h-9 max-w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded-full bg-transparent px-3 text-sm font-medium text-[var(--d-admin-text-color)] hover:text-[var(--d-admin-text-color)] focus-visible:outline-2 focus-visible:outline-[var(--d-admin-blue-600)] enabled:hover:bg-[var(--d-admin-surface-hover)] disabled:cursor-not-allowed dark:text-[var(--d-admin-text-color)]"
                                      type="button"
                                      aria-haspopup="menu"
                                      aria-expanded={isModelPickerOpen}
                                      data-state={
                                        isModelPickerOpen ? 'open' : 'closed'
                                      }
                                    >
                                      <Icon
                                        icon={icon}
                                        className="flex size-5 items-center justify-center text-lg leading-none"
                                      />
                                      <span className="truncate">
                                        <span className="ml-1">{label}</span>
                                      </span>
                                      <Icon
                                        icon="heroicons:chevron-up-down"
                                        className="flex size-4 items-center justify-center opacity-70 group-hover/button:opacity-100"
                                      />
                                    </button>

                                    {isModelPickerOpen && (
                                      <ClientOnly>
                                        {() => (
                                          <ModelSelector
                                            value={selectedProvider}
                                            handleSelectModel={(val) => {
                                              onProviderChange(val);
                                              setIsModelPickerOpen(false);
                                            }}
                                          />
                                        )}
                                      </ClientOnly>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden flex-1 sm:block"></div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <IconButton
                        title="Enhance prompt"
                        disabled={input.length === 0 || enhancingPrompt}
                        className={classNames({
                          'opacity-100!': enhancingPrompt,
                          'pr-1.5 text-blue-500! enabled:hover:bg-blue-500/10!':
                            promptEnhanced,
                        })}
                        onClick={() => enhancePrompt?.()}
                      >
                        {enhancingPrompt ? (
                          <>
                            <Icon
                              icon="svg-spinners:90-ring-with-bg"
                              className="text-xl text-blue-500"
                            />
                            <div className="ml-1.5">Enhancing prompt...</div>
                          </>
                        ) : (
                          <>
                            <Icon icon="ph:sparkle" className="text-xl" />
                            {promptEnhanced && (
                              <div className="ml-1.5">Prompt enhanced</div>
                            )}
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
                      <button
                        type="button"
                        className="flex h-7 items-center gap-1 rounded-full bg-transparent px-2 text-xs text-[var(--d-admin-gray-600)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
                        disabled
                        aria-pressed="false"
                      >
                        <Icon icon="ph:cursor-click" className="h-4 w-4" />
                        <span className="hidden sm:inline">Select</span>
                      </button>
                      <div className="z-prompt flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-7 items-center gap-1 rounded-full bg-transparent px-2 text-xs text-[var(--d-admin-gray-600)] hover:bg-[var(--d-admin-surface-hover)] hover:text-[var(--d-admin-text-color)]"
                          aria-pressed="false"
                        >
                          <Icon icon="ph:lightbulb" className="h-4 w-4" />
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
  },
);

export default ChatInterface;
