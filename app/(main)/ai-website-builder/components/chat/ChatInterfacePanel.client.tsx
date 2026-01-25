import { Icon } from '@iconify/react';
import type { Message } from 'ai';
import { useChat } from 'ai/react';
import { useAnimate } from 'framer-motion';
import { memo, useEffect, useRef, useState } from 'react';
import { cssTransition, toast, ToastContainer } from 'react-toastify';
import {
  useMessageParser,
  usePromptEnhancer,
  useShortcuts,
  useSnapScroll,
} from '../../hooks';
import {
  useChatStore,
  useWorkbenchStore,
  useTerminalStore,
} from '../../stores/zustand';
import { workbenchStore } from '../../stores/workbench';
import { fileModificationsToHTML } from '../../utils/diff';
import { cubicEasingFn } from '../../utils/easings';
import { createScopedLogger, renderLogger } from '../../utils/logger';
import type { ModelProvider } from './ChatModelSelector';
import { useChatHistory } from '../../lib/persistence';
import ChatInterface from './ChatInterface';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

const logger = createScopedLogger('Chat');

export function ChatInterfacePanel() {
  renderLogger.trace('Chat');

  const { ready, initialMessages, storeMessageHistory } = useChatHistory();
  const chatId = useChatStore((state) => state.chatId);

  return (
    <>
      {ready && (
        <ChatImpl
          initialMessages={initialMessages}
          storeMessageHistory={storeMessageHistory}
        />
      )}
      <ToastContainer
        closeButton={({ closeToast }) => {
          return (
            <button className="Toastify__close-button" onClick={closeToast}>
              <Icon icon="ph:x" className="text-lg" />
            </button>
          );
        }}
        icon={({ type }) => {
          /**
           * @todo Handle more types if we need them. This may require extra color palettes.
           */
          switch (type) {
            case 'success': {
              return (
                <Icon
                  icon="ph:check-bold"
                  className="text-2xl text-green-500"
                />
              );
            }
            case 'error': {
              return (
                <Icon
                  icon="ph:warning-circle-bold"
                  className="text-2xl text-red-500"
                />
              );
            }
          }

          return undefined;
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
      />
    </>
  );
}

interface ChatProps {
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
}

export const ChatImpl = memo(
  ({ initialMessages, storeMessageHistory }: ChatProps) => {
    useShortcuts();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);

    const showChat = useChatStore((state) => state.showChat);
    const selectedProvider = useChatStore((state) => state.selectedProvider);
    const setStarted = useChatStore((state) => state.setStarted);
    const setAborted = useChatStore((state) => state.setAborted);
    const setSelectedProvider = useChatStore(
      (state) => state.setSelectedProvider,
    );
    const setShowHistory = useChatStore((state) => state.setShowHistory);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('selected_ai_provider_v2');
        if (saved) {
          setSelectedProvider(saved as ModelProvider);
        }
      }
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selected_ai_provider_v2', selectedProvider);
      }
    }, [selectedProvider]);

    const [animationScope, animate] = useAnimate();

    const {
      messages,
      isLoading,
      input,
      handleInputChange,
      setInput,
      stop,
      append,
      setMessages,
    } = useChat({
      api: '/api/chat',
      body: {
        provider: selectedProvider,
      },
      onError: (error) => {
        logger.error('Request failed\n\n', error);
        toast.error('There was an error processing your request');
      },
      onFinish: () => {
        logger.debug('Finished streaming');
      },
      initialMessages,
    });

    const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } =
      usePromptEnhancer();
    const { parsedMessages, parseMessages } = useMessageParser();

    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    const chatId = useChatStore((state) => state.chatId);

    useEffect(() => {
      // If we have initial messages (loading from history), simply show them.
      if (initialMessages.length > 0) {
        setStarted(true);
        setChatStarted(true);
        return;
      }
      
      // If we have no initial messages AND no chatId, it means we are in "New Chat" mode.
      // We must force a reset of the local state.
      if (!chatId) {
        setStarted(false);
        setChatStarted(false);
        setMessages([]);
        setInput('');
        stop();
      }
    }, [initialMessages, chatId, setStarted, setMessages, setInput, stop]);

    useEffect(() => {
      parseMessages(messages, isLoading);

      if (messages.length > initialMessages.length) {
        storeMessageHistory(messages).catch((error) =>
          toast.error(error.message),
        );
      }
    }, [messages, isLoading, parseMessages]);

    const scrollTextArea = () => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    };

    const abort = () => {
      stop();
      setAborted(true);
      workbenchStore.abortAllActions();
    };

    useEffect(() => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.style.height = 'auto';

        const scrollHeight = textarea.scrollHeight;

        textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
        textarea.style.overflowY =
          scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
      }
    }, [input, textareaRef]);

    const runAnimation = async () => {
      if (chatStarted) {
        return;
      }

      await animate(
        '#intro',
        { opacity: 0, flex: 1 },
        { duration: 0.2, ease: cubicEasingFn },
      );

      setStarted(true);

      setChatStarted(true);
    };

    const sendMessage = async (
      _event: React.UIEvent,
      messageInput?: string,
    ) => {
      const _input = messageInput || input;

      if (_input.length === 0 || isLoading) {
        return;
      }

      /**
       * @note (delm) Usually saving files shouldn't take long but it may take longer if there
       * many unsaved files. In that case we need to block user input and show an indicator
       * of some kind so the user is aware that something is happening. But I consider the
       * happy case to be no unsaved files and I would expect users to save their changes
       * before they send another message.
       */
      await workbenchStore.saveAllFiles();

      const fileModifications = workbenchStore.getFileModifcations();

      setAborted(false);

      runAnimation();

      if (fileModifications !== undefined) {
        const diff = fileModificationsToHTML(fileModifications);

        /**
         * If we have file modifications we append a new user message manually since we have to prefix
         * the user input with the file modifications and we don't want the new user input to appear
         * in the prompt. Using `append` is almost the same as `handleSubmit` except that we have to
         * manually reset the input and we'd have to manually pass in file attachments. However, those
         * aren't relevant here.
         */
        append({ role: 'user', content: `${diff}\n\n${_input}` });

        /**
         * After sending a new message we reset all modifications since the model
         * should now be aware of all the changes.
         */
        workbenchStore.resetAllFileModifications();
      } else {
        append({ role: 'user', content: _input });
      }

      setInput('');

      resetEnhancer();

      textareaRef.current?.blur();
    };

    const [messageRef, scrollRef] = useSnapScroll();

    // Handle external fix requests (e.g. from Artifact UI)
    const pendingFix = useChatStore((state) => state.pendingFix);
    const pendingErrorLog = useChatStore((state) => state.pendingErrorLog);
    const setPendingFix = useChatStore((state) => state.setPendingFix);
    const setPendingErrorLog = useChatStore(
      (state) => state.setPendingErrorLog,
    );

    useEffect(() => {
      if (pendingFix) {
        // Use captured log if available, otherwise get specific terminal output
        const logContent =
          pendingErrorLog || useTerminalStore.getState().getOutput();

        append({
          role: 'user',
          content: `I noticed a build error in the terminal. Here is the terminal output:\n\n${logContent}\n\nPlease deeply analyze the code and the error, and provide a comprehensive fix.`,
        });
        useWorkbenchStore.getState().setBuildError(false);
        setPendingFix(false);
        setPendingErrorLog(undefined);
      }
    }, [
      pendingFix,
      pendingErrorLog,
      append,
      setPendingFix,
      setPendingErrorLog,
    ]);

    return (
      <ChatInterface
        ref={animationScope}
        textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
        input={input}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isLoading}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        sendMessage={sendMessage}
        messageRef={messageRef}
        scrollRef={scrollRef}
        handleInputChange={handleInputChange}
        handleStop={abort}
        messages={messages.map((message, i) => {
          if (message.role === 'user') {
            return message;
          }

          return {
            ...message,
            content: parsedMessages[i] || '',
          };
        })}
        enhancePrompt={() => {
          enhancePrompt(
            input,
            (input: string) => {
              setInput(input);
              scrollTextArea();
            },
            selectedProvider,
          );
        }}
        selectedProvider={selectedProvider}
        onProviderChange={(provider) => setSelectedProvider(provider)}
        onHistoryClick={() => setShowHistory(true)}
        buildError={useWorkbenchStore((state) => state.buildError)}
        onFixError={() => {
          const terminalOutput = useTerminalStore.getState().getOutput();
          append({
            role: 'user',
            content: `I noticed a build error in the terminal. Here is the terminal output:\n\n${terminalOutput}\n\nPlease deeply analyze the code and the error, and provide a comprehensive fix.`,
          });
          useWorkbenchStore.getState().setBuildError(false);
        }}
      />
    );
  },
);

ChatImpl.displayName = 'ChatImpl';
