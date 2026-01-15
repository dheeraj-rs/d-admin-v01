'use client';

import { useStore } from '@nanostores/react';
import LayoutIsolated from "@/core/layouts/LayoutIsolated";
import { Chat } from '@/app/(main)/website-builder/components/chat/Chat';
import { Workbench } from '@/app/(main)/website-builder/components/workbench/Workbench.client';
import { PanelContainer } from '@/app/(main)/website-builder/components/panels/PanelContainer';
import { chatStore } from '@/app/(main)/website-builder/lib/stores/chat';
import { workbenchStore } from '@/app/(main)/website-builder/lib/stores/workbench';

export default function WebsiteBuilderPage() {
    const { showChat } = useStore(chatStore);
    const showWorkbench = useStore(workbenchStore.showWorkbench);

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