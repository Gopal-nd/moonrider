import { createFileRoute, useNavigate } from '@tanstack/react-router'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DollarSign,
  CreditCard,
  ThumbsUp,
  Users,

} from 'lucide-react'

import { Sidebar } from '@/components/SideBar'
import { MetricCard } from '@/components/MetricCard'
import { AddProfile } from '@/components/AddProfile'
import { ActivitiesChart } from '@/components/ActivitiesCard'
import { TopProducts } from '@/components/TopProducts'
import { useAuthStore } from '@/lib/store'
import { dashboardApi } from '@/lib/dashboardApi'
import Header from '@/components/Header'

// Main Dashboard Component
const Dashboard = () => {
  const naviagate = useNavigate()
  const { user } = useAuthStore()
  if (!user?.email) {
    naviagate({ to: '/sign-in' })
  }
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // TanStack Query hooks for dynamic data
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardApi.getMetrics,
    initialData: {
      totalRevenues: { value: 0, change: 0 },
      totalTransactions: { value: 0, change: 0 },
      totalLikes: { value: 0, change: 0 },
      totalUsers: { value: 0, change: 0 }
    }
  })

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const metricCards = [
    {
      title: 'Total Revenues',
      value: metrics?.totalRevenues?.value || 0,
      change: metrics?.totalRevenues?.change || 0,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Transactions',
      value: metrics?.totalTransactions?.value || 0,
      change: metrics?.totalTransactions?.change || 0,
      icon: CreditCard,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Likes',
      value: metrics?.totalLikes?.value || 0,
      change: metrics?.totalLikes?.change || 0,
      icon: ThumbsUp,
      color: 'bg-pink-500',
    },
    {
      title: 'Total Users',
      value: metrics?.totalUsers?.value || 0,
      change: metrics?.totalUsers?.change || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
  ]


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
        
        <Header toggleSidebar={toggleSidebar} title="Dashboard" />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricCards.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ActivitiesChart />
              <AddProfile />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProducts />
              <div></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})
