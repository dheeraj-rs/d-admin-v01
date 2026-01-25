'use client';

import { Icon } from '@iconify/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogButton,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '../ui/UiDialog';
import { ThemeSwitch } from '../ui/UiThemeSwitch';
import { useChatStore } from '../../stores/zustand';
import {
  getDb,
  deleteById,
  getAll,
  type ChatHistoryItem,
} from '../../lib/persistence';
import { logger } from '../../utils/logger';
import { HistoryItem } from './HistoryItem';
import { binDates } from './HistoryDateBinning';

type DialogContent = { type: 'delete'; item: ChatHistoryItem } | null;

interface MenuProps {
  onSelect?: () => void;
}

export function Menu({ onSelect }: MenuProps) {
  const [list, setList] = useState<ChatHistoryItem[]>([]);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);

  const loadEntries = useCallback(() => {
    getDb().then((db) => {
      if (db) {
        getAll(db)
          .then((list) => list.filter((item) => item.urlId && item.description))
          .then(setList)
          .catch((error) => toast.error(error.message));
      }
    });
  }, []);

  const deleteItem = useCallback(
    (event: React.UIEvent, item: ChatHistoryItem) => {
      event.preventDefault();

      getDb().then((db) => {
        if (db) {
          deleteById(db, item.id)
            .then(() => {
              loadEntries();

              if (useChatStore.getState().chatId === item.id) {
                // hard page navigation to clear the stores
                window.location.pathname = '/website-builder';
              }
            })
            .catch((error) => {
              toast.error('Failed to delete conversation');
              logger.error(error);
            });
        }
      });
    },
    [],
  );

  const closeDialog = () => {
    setDialogContent(null);
  };

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <div className="p-4">
          <a
            href="/website-builder"
            className="flex items-center gap-2 rounded-md bg-blue-500/10 p-2 text-blue-500 transition-colors hover:bg-blue-500/20"
          >
            <Icon icon="ph:chat-circle-dots" className="text-lg" />
            Start new chat
          </a>
        </div>
        <div className="my-2 pr-5 pl-6 font-medium">Your Chats</div>
        <div className="flex-1 overflow-scroll pr-5 pb-5 pl-4">
          {list.length === 0 && (
            <div className="pl-2">No previous conversations</div>
          )}
          <DialogRoot open={dialogContent !== null}>
            {binDates(list).map(({ category, items }) => (
              <div key={category} className="flex flex-col gap-1">
                <div className="sticky top-0 z-1 pt-2 pb-1 pl-2">
                  {category}
                </div>
                {items.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onDelete={() => setDialogContent({ type: 'delete', item })}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            ))}
            <Dialog onBackdrop={closeDialog} onClose={closeDialog}>
              {dialogContent?.type === 'delete' && (
                <>
                  <DialogTitle>Delete Chat?</DialogTitle>
                  <DialogDescription asChild>
                    <div>
                      <p>
                        You are about to delete{' '}
                        <strong>{dialogContent.item.description}</strong>.
                      </p>
                      <p className="mt-1">
                        Are you sure you want to delete this chat?
                      </p>
                    </div>
                  </DialogDescription>
                  <div className="flex justify-end gap-2 px-5 pb-4">
                    <DialogButton type="secondary" onClick={closeDialog}>
                      Cancel
                    </DialogButton>
                    <DialogButton
                      type="danger"
                      onClick={(event) => {
                        deleteItem(event, dialogContent.item);
                        closeDialog();
                      }}
                    >
                      Delete
                    </DialogButton>
                  </div>
                </>
              )}
            </Dialog>
          </DialogRoot>
        </div>
        <div className="flex items-center p-4">
          <ThemeSwitch className="ml-auto" />
        </div>
      </div>
    </div>
  );
}
