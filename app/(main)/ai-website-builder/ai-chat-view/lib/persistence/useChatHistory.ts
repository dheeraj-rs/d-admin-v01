'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { workbenchStore } from '../stores/workbench';
import { useChatStore } from '../stores/zustand';
import {
  getAll,
  getMessages,
  getNextId,
  getUrlId,
  openDatabase,
  setMessages,
} from './db';

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

const persistenceEnabled =
  typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_DISABLE_PERSISTENCE;

let dbPromise: Promise<IDBDatabase | undefined> | undefined;

export const getDb = async () => {
  if (!persistenceEnabled) {
    return undefined;
  }
  if (!dbPromise) {
    dbPromise = openDatabase();
  }
  return dbPromise;
};

export function useChatHistory() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const mixedId = params?.id as string | undefined;

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();

  useEffect(() => {
    const init = async () => {
      const dbInstance = await getDb();
      if (!dbInstance) {
        setReady(true);

        if (persistenceEnabled) {
          toast.error(`Chat persistence is unavailable`);
        }

        return;
      }

      if (mixedId) {
        getMessages(dbInstance, mixedId)
          .then((storedMessages) => {
            if (storedMessages && storedMessages.messages.length > 0) {
              setInitialMessages(storedMessages.messages);
              setUrlId(storedMessages.urlId);
              useChatStore
                .getState()
                .setDescription(storedMessages.description);
              useChatStore.getState().setChatId(storedMessages.id);
            } else {
              router.replace('/');
            }

            setReady(true);
          })
          .catch((error) => {
            toast.error(error.message);
            setReady(true);
          });
      } else {
        // No ID in URL - always start new chat (empty) with a new array reference
        setInitialMessages([]);
        setUrlId(undefined);
        useChatStore.getState().setDescription(undefined);
        // Important: clearing the chatId in store triggers the UI reset
        useChatStore.getState().setChatId(undefined);
        setReady(true);
      }
    };
    init();
  }, [mixedId]);

  return {
    ready: !mixedId || ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      const dbInstance = await getDb();
      if (!dbInstance || messages.length === 0) {
        return;
      }

      const { firstArtifact } = workbenchStore;
      let description = useChatStore.getState().description;

      if (!description && firstArtifact?.title) {
        description = firstArtifact?.title;
        useChatStore.getState().setDescription(description);
      } else if (!description && messages.length > 0) {
        // Fallback: use the first user message as description
        const firstUserMessage = messages.find((m) => m.role === 'user');
        if (firstUserMessage) {
          description = firstUserMessage.content.slice(0, 100);
          useChatStore.getState().setDescription(description);
        }
      }

      if (initialMessages.length === 0 && !useChatStore.getState().chatId) {
        const nextId = await getNextId(dbInstance);

        useChatStore.getState().setChatId(nextId);

        if (!urlId) {
            // Generate a URL ID if one doesn't exist
            const newUrlId = await getUrlId(dbInstance, nextId);
            setUrlId(newUrlId);
            navigateChat(newUrlId);
        }
      }

      await setMessages(
        dbInstance,
        useChatStore.getState().chatId as string,
        messages,
        urlId,
        description,
      );
      
      // Trigger a history reload so the sidebar updates immediately
      useChatStore.getState().triggerHistoryReload();
    },
  };
}

function navigateChat(nextId: string) {
  /**
   * We use window.history.replaceState to verify strictly we are only changing the URL parameter
   * without triggering a full router navigation that might re-mount components unnecessarily.
   */
  const url = new URL(window.location.href);
  url.pathname = `/ai-website-builder/${nextId}`;

  window.history.replaceState({}, '', url);
}
