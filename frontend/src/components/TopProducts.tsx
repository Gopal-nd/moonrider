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


// Top Products Component
export const TopProducts = ({ products }:any) => {
  const pieData = products.map((product:any, index:any) => ({
    name: product.name,
    value: product.percentage,
    color: product.color
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top products</span>
          <span className="text-sm text-muted-foreground">May - June 2021</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: product.color }}
                ></div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
