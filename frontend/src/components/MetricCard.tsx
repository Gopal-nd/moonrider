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


// Metric Card Component
export const MetricCard = ({ title, value, change, icon: Icon, color }:any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">
            {title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          <p className="text-xs text-green-600">+{change}%</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

