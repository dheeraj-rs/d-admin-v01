'use client';

import React from 'react';
import './ai-builder.scss';

import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { Workbench } from './components/Workbench';
import { LightRaysBackground } from '@/core/components/not-found/LightRaysBackground';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function AiWebsiteBuilderPage() {
    return (
        <div className="w-full h-full bg-[var(--d-admin-surface-ground)] relative text-[var(--d-admin-text-color)]">
            <LightRaysBackground />
            <div className="flex flex-col h-full w-full relative z-10">
                <Header />
                <div className="ai-builder-layout relative flex h-full w-full overflow-hidden [--side-menu-width:0px]" data-chat-visible="true" style={{ '--chat-messages-gap': '1.5rem', '--workbench-top-offset': '1rem' } as React.CSSProperties}>
                    <div className="flex size-full overscroll-contain">
                        <PanelGroup direction="horizontal">
                            <Panel defaultSize={30} minSize={25} maxSize={50} className="bg-surface-0">
                                <ChatInterface />

                            </Panel>

                            <PanelResizeHandle className="w-2 bg-transparent hover:bg-transparent relative group flex justify-center items-center" />
                            <Panel defaultSize={70} minSize={50} className="bg-surface-1">
                                <Workbench />
                            </Panel>
                        </PanelGroup>
                    </div>
                </div>

            </div>
        </div>
    );
}