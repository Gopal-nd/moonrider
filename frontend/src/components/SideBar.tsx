import { createFileRoute } from '@tanstack/react-router'

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  DollarSign, 
  CreditCard, 
  ThumbsUp, 
  Users, 
  Search,
  Bell,
  Plus,
  Menu,
  Settings,
  Calendar,
  Tag,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// API configuration
const API_BASE_URL = 'https://api.example.com'; 

// API functions using fetch
const fetchDashboardMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/metrics`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

const fetchActivityData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/activities`);
  if (!response.ok) throw new Error('Failed to fetch activities');
  return response.json();
};

const fetchTopProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/top-products`);
  if (!response.ok) throw new Error('Failed to fetch top products');
  return response.json();
};

// Mock data for development
const mockMetrics = {
  totalRevenues: { value: 2129430, change: 2.5 },
  totalTransactions: { value: 1520, change: 1.7 },
  totalLikes: { value: 9721, change: 1.4 },
  totalUsers: { value: 9721, change: 4.2 }
};

const mockActivities = [
  { week: 'Week 1', guest: 400, user: 500 },
  { week: 'Week 2', guest: 450, user: 350 },
  { week: 'Week 3', guest: 300, user: 200 },
  { week: 'Week 4', guest: 350, user: 400 }
];

const mockTopProducts = [
  { name: 'Basic Tees', percentage: 55, color: '#10B981' },
  { name: 'Custom Short Pants', percentage: 31, color: '#F59E0B' },
  { name: 'Super Hoodies', percentage: 14, color: '#EF4444' }
];

// Sidebar Component
export const Sidebar = ({ isOpen, toggleSidebar }:{isOpen:boolean,toggleSidebar:()=>void}) => (
  <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed  inset-y-0 left-0 z-50 w-64 bg-blue-500 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0  rounded-2xl lg:static lg:inset-0`}>
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
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white">
        <BarChart className="w-5 h-5" />
        <span>Dashboard</span>
      </div>
      
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
        <Tag className="w-5 h-5" />
        <span>Transactions</span>
      </div>
      
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
        <Calendar className="w-5 h-5" />
        <span>Schedules</span>
      </div>
      
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
        <Users className="w-5 h-5" />
        <span>Users</span>
      </div>
      
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </div>
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

