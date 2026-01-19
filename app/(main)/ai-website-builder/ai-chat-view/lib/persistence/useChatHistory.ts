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
  const isNewChat = searchParams?.get('new') === 'true';

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
      } else if (!isNewChat) {
        // No ID in URL and not explicitly a new chat - load most recent chat
        getAll(dbInstance)
          .then((allChats) => {
            if (allChats && allChats.length > 0) {
              // Sort by timestamp to get most recent
              const sortedChats = allChats.sort((a: ChatHistoryItem, b: ChatHistoryItem) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              );
              const mostRecent = sortedChats[0];

              setInitialMessages(mostRecent.messages);
              setUrlId(mostRecent.urlId);
              useChatStore.getState().setDescription(mostRecent.description);
              useChatStore.getState().setChatId(mostRecent.id);

              // Update URL to include the chat ID
              if (mostRecent.urlId) {
                navigateChat(mostRecent.urlId);
              } else {
                navigateChat(mostRecent.id);
              }
            }
            setReady(true);
          })
          .catch((error: Error) => {
            toast.error(error.message);
            setReady(true);
          });
      } else {
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

      if (!urlId && firstArtifact?.id) {
        const urlId = await getUrlId(dbInstance, firstArtifact.id);

        navigateChat(urlId);
        setUrlId(urlId);
      }

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
  url.pathname = `/website-builder/${nextId}`;

  window.history.replaceState({}, '', url);
}
