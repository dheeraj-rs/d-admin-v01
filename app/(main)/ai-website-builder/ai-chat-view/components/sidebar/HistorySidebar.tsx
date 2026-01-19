import React from 'react';
import { Icon } from '@iconify/react';
import { useAiBuilderStore } from '../../../store/ai-builder-store';
import { workbenchStore } from '../../lib/stores/workbench';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '../ui/Dialog';
import { useChatStore } from '../../lib/stores/zustand';
import { getDb, deleteById, getAll, type ChatHistoryItem } from '../../lib/persistence';
import { logger } from '../../utils/logger';
import { HistoryItem } from './HistoryItem';
import { binDates } from './date-binning';
import Link from 'next/link';

type DialogContent = { type: 'delete'; item: ChatHistoryItem } | null;

interface MenuProps {
    onSelect?: () => void;
}


export function HistorySidebar({ onSelect }: MenuProps) {
    const { isHistoryOpen, setIsHistoryOpen } = useAiBuilderStore();

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

    const deleteItem = useCallback((event: React.UIEvent, item: ChatHistoryItem) => {
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
    }, []);

    const closeDialog = () => {
        setDialogContent(null);
    };

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    if (!isHistoryOpen) return null;

    return (
        <div className="absolute inset-y-0 left-0 z-50 flex h-full font-sans">
            <div className="flex h-full w-[280px] flex-col bg-[var(--d-admin-surface-ground)] border-r border-[var(--d-admin-surface-border)] shadow-2xl animate-in slide-in-from-left duration-300 ease-in-out">
                <div className="p-4 border-b border-[var(--d-admin-surface-border)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-[var(--d-admin-text-color)] flex items-center gap-2">
                            <Icon icon="ph:clock-counter-clockwise" className="size-5 text-[var(--d-admin-text-color-secondary)]" />
                            History
                        </h2>
                        <button
                            onClick={() => setIsHistoryOpen(false)}
                            className="p-1.5 hover:bg-[var(--d-admin-surface-hover)] rounded-md text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)] transition-colors"
                        >
                            <Icon icon="ph:x" className="size-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <Icon icon="ph:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--d-admin-text-color-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search history..."
                            className="w-full bg-[var(--d-admin-surface-section)] text-sm rounded-lg pl-9 pr-3 py-2 border border-[var(--d-admin-surface-border)] focus:outline-none focus:border-[var(--d-admin-blue-600)] transition-colors text-[var(--d-admin-text-color)] placeholder-[var(--d-admin-text-color-secondary)]"
                        />
                    </div>
                </div>
                <div className="p-4">
                    <Link
                        href="/ai-website-builder?new=true"
                        onClick={() => {
                            workbenchStore.reset();
                            setIsHistoryOpen(false);
                        }}
                        className="flex gap-2 items-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md p-2 transition-colors"
                    >
                        <Icon icon="ph:chat-circle-dots" className="text-lg" />
                        Start new chat
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-2">

                    {list.length === 0 && <div className="pl-2">No previous conversations</div>}
                    <DialogRoot open={dialogContent !== null}>
                        {binDates(list).map(({ category, items }) => (
                            <div key={category} className="flex flex-col gap-1">
                                <h3 className="text-xs font-semibold text-[var(--d-admin-text-color-secondary)] uppercase tracking-wider mb-2">{category}</h3>
                                {items.map((item) => (
                                    <HistoryItem key={item.id} item={item} onDelete={() => setDialogContent({ type: 'delete', item })} onSelect={onSelect} />
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
                                                You are about to delete <strong>{dialogContent.item.description}</strong>.
                                            </p>
                                            <p className="mt-1">Are you sure you want to delete this chat?</p>
                                        </div>
                                    </DialogDescription>
                                    <div className="px-5 pb-4 flex gap-2 justify-end">
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
            </div>
            {/* Backdrop */}
            <div
                className="w-[100vw] h-full bg-black/20 transition-opacity duration-300"
                onClick={() => setIsHistoryOpen(false)}
            ></div>
        </div>
    );
}
