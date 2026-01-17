import React from 'react'
import Layout from '@/core/layouts/Layout'
import LayoutIsolated from '@/core/layouts/LayoutIsolated'

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            <LayoutIsolated>
                {children}
            </LayoutIsolated>
        </Layout>
    )
}

export default MainLayout