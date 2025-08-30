import { axiosInstance } from './axios';

// Dashboard Metrics API
export const dashboardApi = {
  // Get dashboard metrics

  getMetrics: async () => {
    const response = await axiosInstance.get('/api/dashboard/metrics');
    return response.data;
  },

  // Create or update metric
  upsertMetric: async (data: { type: string; value: number; change: number }) => {
    const response = await axiosInstance.post('/api/dashboard/metrics', data);
    return response.data;
  },

  // Get activities
  getActivities: async () => {
    const response = await axiosInstance.get('/api/dashboard/activities');
    return response.data;
  },

  // Create activity
  createActivity: async (data: { week: string; guest: number; userCount: number }) => {
    const response = await axiosInstance.post('/api/dashboard/activities', data);
    return response.data;
  },

  // Update activity
  updateActivity: async (id: string, data: { week: string; guest: number; userCount: number }) => {
    const response = await axiosInstance.put(`/api/dashboard/activities/${id}`, data);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id: string) => {
    const response = await axiosInstance.delete(`/api/dashboard/activities/${id}`);
    return response.data;
  },

  // Get products
  getProducts: async () => {
    const response = await axiosInstance.get('/api/dashboard/products');
    return response.data;
  },

  // Create product
  createProduct: async (data: { 
    name: string; 
    percentage: number; 
    color: string;
    price?: number;
    stock?: number;
    category?: string;
    description?: string;
    imageUrl?: string;
  }) => {
    const response = await axiosInstance.post('/api/dashboard/products', data);
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, data: { 
    name: string; 
    percentage: number; 
    color: string;
    price?: number;
    stock?: number;
    category?: string;
    description?: string;
    imageUrl?: string;
  }) => {
    const response = await axiosInstance.put(`/api/dashboard/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/api/dashboard/products/${id}`);
    return response.data;
  },

  // Customer Management
  getCustomers: async (page: number = 1, search: string = '', status: string = '') => {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    
    const response = await axiosInstance.get(`/api/customers?${params.toString()}`);
    return response.data;
  },

  getCustomerById: async (id: string) => {
    const response = await axiosInstance.get(`/api/customers/${id}`);
    return response.data;
  },

  createCustomer: async (data: any) => {
    const response = await axiosInstance.post('/api/customers', data);
    return response.data;
  },

  updateCustomer: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: string) => {
    const response = await axiosInstance.delete(`/api/customers/${id}`);
    return response.data;
  },

  getCustomerAnalytics: async () => {
    const response = await axiosInstance.get('/api/customers/analytics');
    return response.data;
  },

  // Order Management
  getOrders: async (page: number = 1, status: string = '', customerId: string = '') => {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    if (status) params.append('status', status);
    if (customerId) params.append('customerId', customerId);
    
    const response = await axiosInstance.get(`/api/orders?${params.toString()}`);
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await axiosInstance.get(`/api/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: any) => {
    const response = await axiosInstance.post('/api/orders', data);
    return response.data;
  },

  updateOrderStatus: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/api/orders/${id}/status`, data);
    return response.data;
  },

  deleteOrder: async (id: string) => {
    const response = await axiosInstance.delete(`/api/orders/${id}`);
    return response.data;
  },

  getOrderAnalytics: async () => {
    const response = await axiosInstance.get('/api/orders/analytics');
    return response.data;
  },

  // Report Management
  getReports: async (page: number = 1, type: string = '') => {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    if (type) params.append('type', type);
    
    const response = await axiosInstance.get(`/api/reports?${params.toString()}`);
    return response.data;
  },

  getReportById: async (id: string) => {
    const response = await axiosInstance.get(`/api/reports/${id}`);
    return response.data;
  },

  generateSalesReport: async (data: any) => {
    const response = await axiosInstance.post('/api/reports/sales', data);
    return response.data;
  },

  generateInventoryReport: async (data: any) => {
    const response = await axiosInstance.post('/api/reports/inventory', data);
    return response.data;
  },

  generateCustomerReport: async (data: any) => {
    const response = await axiosInstance.post('/api/reports/customer', data);
    return response.data;
  },

  deleteReport: async (id: string) => {
    const response = await axiosInstance.delete(`/api/reports/${id}`);
    return response.data;
  },

  // Notification Management
  getNotifications: async (page: number = 1, unreadOnly: boolean = false) => {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    if (unreadOnly) params.append('unreadOnly', 'true');
    
    const response = await axiosInstance.get(`/api/notifications?${params.toString()}`);
    return response.data;
  },

  getNotificationCount: async () => {
    const response = await axiosInstance.get('/api/notifications/count');
    return response.data;
  },

  createNotification: async (data: any) => {
    const response = await axiosInstance.post('/api/notifications', data);
    return response.data;
  },

  markNotificationAsRead: async (id: string) => {
    const response = await axiosInstance.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await axiosInstance.put('/api/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await axiosInstance.delete(`/api/notifications/${id}`);
    return response.data;
  },

  // User Management
  getUserProfile: async () => {
    const response = await axiosInstance.get('/api/user/profile');
    return response.data;
  },

  updateUserProfile: async (data: any) => {
    const response = await axiosInstance.put('/api/user/profile', data);
    return response.data;
  },

  getUserSettings: async () => {
    const response = await axiosInstance.get('/api/user/settings');
    return response.data;
  },

  updateUserSettings: async (data: any) => {
    const response = await axiosInstance.put('/api/user/settings', data);
    return response.data;
  },

  resetUserSettings: async () => {
    const response = await axiosInstance.post('/api/user/settings/reset');
    return response.data;
  },

  getUserStatistics: async () => {
    const response = await axiosInstance.get('/api/user/statistics');
    return response.data;
  },
};
