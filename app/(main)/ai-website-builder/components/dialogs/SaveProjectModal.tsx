import React, { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useProjectsStore } from '../../store/projects-store';
import { toast } from 'react-toastify';
import { classMixin } from '../../drag-drop-view/lib/classMixin';

interface SaveProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    getHtmlContent: () => string;
}

export function SaveProjectModal({ isOpen, onClose, getHtmlContent }: SaveProjectModalProps) {
    const [name, setName] = useState('');
    const { saveProject, setCurrentProject } = useProjectsStore();

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Please enter a project name');
            return;
        }

        const html = getHtmlContent();
        const id = generateId();

        let thumbnail = '';
        try {
            const editor = document.getElementById('editor');
            if (editor) {
                // Determine scale based on content width to avoid huge images
                // Using 0.5 scale for thumbnail quality vs size balance
                const canvas = await import('html2canvas').then(mod => mod.default(editor, {
                    scale: 0.25,
                    useCORS: true,
                    logging: false,
                    backgroundColor: null, // Transparent background if possible, or theme bg
                    // Only capture visible part if it's too tall, or full scroll?
                    // Usually we want the top part as preview
                    height: Math.min(editor.scrollHeight, 1200),
                    windowHeight: 1200
                }));
                thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            }
        } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            // Non-blocking error
        }

        saveProject({
            id,
            name,
            html,
            thumbnail,
            category: 'custom'
        });

        setCurrentProject(id);
        toast.success('Project saved successfully!');
        onClose();
        setName('');
    };

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0" />
                <DialogPrimitive.Content
                    className={classMixin(
                        'fixed z-50 shadow-xl bg-[var(--d-admin-surface-card)] rounded-lg p-6',
                        'w-[95vw] max-w-lg md:w-full',
                        'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                        'border border-[var(--d-admin-surface-border)]'
                    )}
                >
                    <div className="flex flex-col gap-4">
                        <div>
                            <DialogPrimitive.Title className="text-lg font-semibold text-[var(--d-admin-text-color)]">
                                Save Project
                            </DialogPrimitive.Title>
                            <DialogPrimitive.Description className="text-sm text-[var(--d-admin-text-color-secondary)] mt-1">
                                Give your project a name to save it to your gallery.
                            </DialogPrimitive.Description>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Awesome Landing Page"
                                className="w-full px-3 py-2 bg-[var(--d-admin-surface-ground)] border border-[var(--d-admin-surface-border)] rounded-md text-[var(--d-admin-text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--d-admin-primary-color)]"
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                className="px-3 py-2 text-sm font-semibold text-[var(--d-admin-text-color)] bg-transparent hover:bg-[var(--d-admin-surface-hover)] rounded-md transition-colors"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 text-sm font-semibold text-white bg-[var(--d-admin-primary-color)] hover:bg-[var(--d-admin-primary-color-hover)] rounded-md shadow-sm transition-colors"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>

                        <DialogPrimitive.Close
                            onClick={onClose}
                            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <XMarkIcon className="h-5 w-5 text-[var(--d-admin-text-color-secondary)] hover:text-[var(--d-admin-text-color)]" />
                            <span className="sr-only">Close</span>
                        </DialogPrimitive.Close>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
