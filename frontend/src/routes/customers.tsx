import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { CustomerManagement } from '@/components/CustomerManagement'
import { Sidebar } from '@/components/SideBar'
import { useAuthStore } from '@/lib/store'
import { useNavigate } from '@tanstack/react-router'

import Header from '@/components/Header'

const Customers = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  if (!user?.email) {
    navigate({ to: '/sign-in' })
    return null
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen p-2 bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} title="Customer Management" />


        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <CustomerManagement />
        </main>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/customers')({
  component: Customers,
})
