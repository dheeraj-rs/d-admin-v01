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
              useChatStore.getState().setDescription(storedMessages.description);
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
        // No ID in URL - always start new chat (empty)
        setInitialMessages([]);
        setUrlId(undefined);
        useChatStore.getState().setDescription(undefined);
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

      if (!useChatStore.getState().description && firstArtifact?.title) {
        useChatStore.getState().setDescription(firstArtifact?.title);
      }

      if (initialMessages.length === 0 && !useChatStore.getState().chatId) {
        const nextId = await getNextId(dbInstance);

        useChatStore.getState().setChatId(nextId);

        if (!urlId) {
          navigateChat(nextId);
        }
      }

      await setMessages(
        dbInstance,
        useChatStore.getState().chatId as string,
        messages,
        urlId,
        useChatStore.getState().description
      );
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
