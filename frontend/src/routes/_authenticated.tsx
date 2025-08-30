import { useAuthStore } from '@/lib/store'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const naviagate = useNavigate()
    const { user } = useAuthStore()
    if (!user?.email) {
      naviagate({ to: '/sign-in' })
    }
  },
  component: () => <Outlet />,
})
