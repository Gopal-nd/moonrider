import { createFileRoute, useNavigate } from '@tanstack/react-router'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DollarSign,
  CreditCard,
  ThumbsUp,
  Users,
  Search,
  Bell,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar } from '@/components/SideBar'
import { MetricCard } from '@/components/MetricCard'
import { AddProfile } from '@/components/AddProfile'
import { ActivitiesChart } from '@/components/ActivitiesCard'
import { TopProducts } from '@/components/TopProducts'
import { useAuthStore } from '@/lib/store'
import { axiosInstance } from '@/lib/axios'
import toast from 'react-hot-toast'

// API configuration
const API_BASE_URL = 'https://api.example.com'

// API functions using fetch
const fetchDashboardMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/metrics`)
  if (!response.ok) throw new Error('Failed to fetch metrics')
  return response.json()
}

const fetchActivityData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/activities`)
  if (!response.ok) throw new Error('Failed to fetch activities')
  return response.json()
}

const fetchTopProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/top-products`)
  if (!response.ok) throw new Error('Failed to fetch top products')
  return response.json()
}

// Mock data for development
const mockMetrics = {
  totalRevenues: { value: 2129430, change: 2.5 },
  totalTransactions: { value: 1520, change: 1.7 },
  totalLikes: { value: 9721, change: 1.4 },
  totalUsers: { value: 9721, change: 4.2 },
}

const mockActivities = [
  { week: 'Week 1', guest: 400, user: 500 },
  { week: 'Week 2', guest: 450, user: 350 },
  { week: 'Week 3', guest: 300, user: 200 },
  { week: 'Week 4', guest: 350, user: 400 },
]

const mockTopProducts = [
  { name: 'Basic Tees', percentage: 55, color: '#10B981' },
  { name: 'Custom Short Pants', percentage: 31, color: '#F59E0B' },
  { name: 'Super Hoodies', percentage: 14, color: '#EF4444' },
]

// Main Dashboard Component
const Dashboard = () => {
  const naviagate = useNavigate()
  const { user, clearUser } = useAuthStore()
  if (!user?.email) {
    naviagate({ to: '/sign-in' })
  }
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // TanStack Query hooks
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardMetrics,
    initialData: mockMetrics, // Using mock data for demo
  })

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: fetchActivityData,
    initialData: mockActivities, // Using mock data for demo
  })

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: fetchTopProducts,
    initialData: mockTopProducts, // Using mock data for demo
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

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post('/api/auth/logout')
      clearUser()
      toast('logout successful')
      naviagate({ to: '/' })
    } catch (error) {
      console.log('logut error', error)
    }
  }
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
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>

              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>{user?.name[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{user?.name}</DropdownMenuItem>
                  <Button onClick={handleLogout}>Logout</Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

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
              <ActivitiesChart data={activities} />
              <AddProfile />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProducts products={topProducts} />
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
