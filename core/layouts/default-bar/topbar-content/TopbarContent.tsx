
import React, { forwardRef, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLayoutStore } from '@/core/store';
import { AppTopbarRef } from '@/core/types/admin-layout';
import AppTopbarMenu from './AppTopbarMenu';

const TopbarContent = forwardRef<AppTopbarRef>(() => {
    const layoutConfig = useLayoutStore((state) => state.layoutConfig);
    const topbarRef = useRef<HTMLDivElement>(null);
    const configMenuButtonRef = useRef<HTMLButtonElement>(null);
    const sidebarMenuButtonRef = useRef<HTMLButtonElement>(null);


    return (
        <section ref={topbarRef} className="layout-topbar">
            <div className="topbar-start">
                <Link href="/" className="logo-row">
                    <Image
                        src={`/icons/logo-${layoutConfig.colorScheme?.includes('dark') || layoutConfig.theme?.includes('dark') ? 'dark' : 'white'}.svg`}
                        width={40}
                        height={40}
                        alt="logo"
                        className="logo-img"
                        priority
                    />
                    <span className="logo-text">
                        {'D-Admin'.split('').map((letter: string, index: number) => (
                            <span key={index}>{letter}</span>
                        ))}
                    </span>
                </Link>
            </div>

            <div className="topbar-center">
            </div>

            <div className="topbar-end">
                <AppTopbarMenu
                    configMenuButtonRef={configMenuButtonRef}
                    sidebarMenuButtonRef={sidebarMenuButtonRef}
                />
            </div>
        </section>
    );
});

TopbarContent.displayName = 'TopbarContent';

export default TopbarContent;
