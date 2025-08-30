import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/lib/store'
import { Link, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {

  Menu,
} from 'lucide-react'

export default function Header({ toggleSidebar,title='' }: { toggleSidebar: () => void,title: string }) {
  const { user, clearUser } = useAuthStore()
  const naviagate = useNavigate()
  if(!user?.email){
    naviagate({ to: '/sign-in' })
  }
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout')
      clearUser()
      toast('logout successful')
      naviagate({ to: '/' })
    } catch (error) {
      console.log('logut error', error)
    }
  }
  return (
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
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
        {user?.email ? (
               <div className="flex items-center gap-4">
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

        ) : (
          <Link
            to="/sign-in"
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Login
          </Link>
        )}
       </div>
        </header>
  )
}
