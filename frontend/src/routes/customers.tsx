import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { CustomerManagement } from '@/components/CustomerManagement'
import { Sidebar } from '@/components/SideBar'
import { useAuthStore } from '@/lib/store'
import { useNavigate } from '@tanstack/react-router'

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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={toggleSidebar}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold">Customer Management</h1>
            </div>
          </div>
        </header>

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
