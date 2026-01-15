import React from 'react'
import OwnerLayout from '@/core/layouts/OwnerLayout'

function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <OwnerLayout>
            {children}
        </OwnerLayout>
    )
}

export default OwnerDashboardLayout