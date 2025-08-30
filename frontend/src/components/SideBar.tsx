
import { 
  BarChart, 
  Settings,
  HelpCircle,
  MessageCircle,
  Users,
  ShoppingCart,
  FileText,
  Bell,
  User,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from '@tanstack/react-router';

// Sidebar Component
export const Sidebar = ({ isOpen, toggleSidebar }:{isOpen:boolean,toggleSidebar:()=>void}) => {
  const location = useLocation();
  
  const navItems = [
    { icon: BarChart, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-blue-500 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 rounded-2xl lg:static lg:inset-0`}>
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold">Board.</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden text-white hover:bg-blue-600"
          onClick={toggleSidebar}
        >
          ×
        </Button>
      </div>
      
      <nav className="mt-8 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              isActive(item.path) 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-blue-600 text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-8 left-4 space-y-4">
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg cursor-pointer">
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 rounded-lg cursor-pointer">
          <MessageCircle className="w-5 h-5" />
          <span>Contact Us</span>
        </div>
      </div>
    </div>
  );
};

