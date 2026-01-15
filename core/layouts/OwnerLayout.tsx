import React from 'react'
import LayoutWrapper from './owner-bar/LayoutWrapper'
import Sidebar from './owner-bar/Sidebar'
import ContentAreaWrapper from './owner-bar/ContentAreaWrapper'
import Topbar from './owner-bar/Topbar'
import ContentArea from './owner-bar/ContentArea'
import "@/core/styles/index.scss";

interface OwnerLayoutProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    topbarContent?: React.ReactNode;
    className?: string;
}

function OwnerLayout({ children, sidebarContent, topbarContent, className }: OwnerLayoutProps) {
    return (
        <LayoutWrapper className={className}>
            <Sidebar >
                {sidebarContent}
            </Sidebar>
            <ContentAreaWrapper>
                <Topbar >
                    {topbarContent}
                </Topbar>
                <ContentArea >
                    {children}
                </ContentArea>
            </ContentAreaWrapper>
        </LayoutWrapper>
    )
}

export default OwnerLayout