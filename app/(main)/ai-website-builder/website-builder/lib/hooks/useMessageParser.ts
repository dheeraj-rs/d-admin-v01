import type { Message } from 'ai';
import { useCallback, useState } from 'react';
import { StreamingMessageParser } from '../runtime/message-parser';
import { workbenchStore } from '../stores/workbench';
import { useWorkbenchStore } from '../stores/zustand';
import { createScopedLogger } from '../../utils/logger';

const logger = createScopedLogger('useMessageParser');

const messageParser = new StreamingMessageParser({
  callbacks: {
    onArtifactOpen: (data) => {
      logger.trace('onArtifactOpen', data);

      useWorkbenchStore.getState().setShowWorkbench(true);
      workbenchStore.addArtifact(data);
    },
    onArtifactClose: (data) => {
      logger.trace('onArtifactClose');

      workbenchStore.updateArtifact(data, { closed: true });
    },
    onActionOpen: (data) => {
      logger.trace('onActionOpen', data.action);

      // Show workbench when file actions are created, but only if user hasn't manually hidden it
      if (data.action.type === 'file') {
        const userHid = useWorkbenchStore.getState().userHidWorkbench;
        if (!userHid) {
          useWorkbenchStore.getState().setShowWorkbench(true);
        }
      }

      // we only add shell actions when when the close tag got parsed because only then we have the content
      if (data.action.type !== 'shell') {
        workbenchStore.addAction(data);
      }
    },
    onActionClose: (data) => {
      logger.trace('onActionClose', data.action);

      if (data.action.type === 'shell') {
        workbenchStore.addAction(data);
      }

      workbenchStore.runAction(data);
    },
  },
});

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{
    [key: number]: string;
  }>({});

  const parseMessages = useCallback(
    (messages: Message[], isLoading: boolean) => {
      let reset = false;

      if (process.env.NODE_ENV === 'development' && !isLoading) {
        reset = true;
        messageParser.reset();
      }

      for (const [index, message] of messages.entries()) {
        if (message.role === 'assistant') {
          const newParsedContent = messageParser.parse(
            message.id,
            (message as any).content
          );

          setParsedMessages((prevParsed) => ({
            ...prevParsed,
            [index]: !reset
              ? (prevParsed[index] || '') + newParsedContent
              : newParsedContent,
          }));
        }
      }
    },
    []
  );

  return { parsedMessages, parseMessages };
}
