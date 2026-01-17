'use client';

import React from 'react';
import './index.css';
import './LightRays.css';
import './chat.css';
import './root.css';

import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { Workbench } from './components/Workbench';
import { LightRaysBackground } from './components/LightRaysBackground';

export default function AiWebsiteBuilderPage() {
    return (
        <div className="w-full h-full bg-bolt-elements-background-depth-1 relative text-bolt-elements-textPrimary">
            <LightRaysBackground />
            <div className="flex flex-col h-full w-full relative z-10">
                <Header />
                <div className="_BaseChat_t1btp_1 relative flex h-full w-full overflow-hidden [--side-menu-width:0px] bg-bolt-elements-background-depth-1" data-chat-visible="true" style={{ '--chat-messages-gap': '1.5rem', '--workbench-top-offset': '1rem' } as React.CSSProperties}>
                    <div className="flex size-full overscroll-contain">
                        <ChatInterface />
                        <Workbench />
                    </div>
                </div>

            </div>
        </div>
    );
}