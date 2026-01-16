import React from 'react'
import Layout from '@/core/layouts/Layout'
import WebsiteBuilderTopbar from './website-builder/WebsiteBuilderTopbar'

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout topbarContent={<WebsiteBuilderTopbar />}>
            {children}
        </Layout>
    )
}

export default MainLayout