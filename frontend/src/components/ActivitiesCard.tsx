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


// Activities Chart Component
export const ActivitiesChart = ({ data }:any) => (
  <Card className="col-span-1 lg:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Activities</span>
        <span className="text-sm text-muted-foreground">May - June 2021</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-sm text-muted-foreground">Guest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm text-muted-foreground">User</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Bar dataKey="guest" fill="#F87171" radius={[4, 4, 0, 0]} />
          <Bar dataKey="user" fill="#4ADE80" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

