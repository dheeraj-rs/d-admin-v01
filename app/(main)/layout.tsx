import React from 'react'
import Layout from '@/core/layouts/Layout'

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            {children}
        </Layout>
    )
}

export default MainLayout