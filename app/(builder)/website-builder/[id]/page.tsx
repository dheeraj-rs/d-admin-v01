'use client';

import { Chat } from '@/app/(builder)/website-builder/components/chat/Chat';
import { Workbench } from '@/app/(builder)/website-builder/components/workbench/Workbench.client';
import { PanelContainer } from '@/app/(builder)/website-builder/components/panels/PanelContainer';
import { useChatStore, useWorkbenchStore } from '@/app/(builder)/website-builder/lib/stores/zustand';
import LayoutIsolated from '@/core/layouts/LayoutIsolated';

export default function WebsiteBuilderChatPage() {
    const showChat = useChatStore(state => state.showChat);
    const showWorkbench = useWorkbenchStore(state => state.showWorkbench);

    return (
        <LayoutIsolated>
            <div className="flex flex-row h-screen w-full overflow-hidden">
                <PanelContainer
                    leftPanel={<Chat />}
                    rightPanel={<Workbench isStreaming={false} />}
                    showLeftPanel={showChat}
                    showRightPanel={showWorkbench}
                />
            </div>
        </LayoutIsolated>
    );
}
