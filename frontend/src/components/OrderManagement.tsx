import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { dashboardApi } from '@/lib/dashboardApi';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  orderItems: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    total: number;
  }>;
  _count: {
    orderItems: number;
  };
}

interface OrderFormData {
  customerId: string;
  orderItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  paymentMethod: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'processing':
      return <Package className="h-4 w-4 text-blue-500" />;
    case 'shipped':
      return <Truck className="h-4 w-4 text-purple-500" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'cancelled':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const OrderManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['orders', currentPage, statusFilter],
    queryFn: () => dashboardApi.getOrders(currentPage, statusFilter),
  });

  const { data: analytics } = useQuery({
    queryKey: ['order-analytics'],
    queryFn: dashboardApi.getOrderAnalytics,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dashboardApi.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-analytics'] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dashboardApi.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-analytics'] });
      toast.success('Order deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete order');
    },
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    const updateData: any = { status: newStatus };
    if (newStatus === 'delivered') {
      updateData.deliveryDate = new Date().toISOString();
    }
    updateStatusMutation.mutate({ id: orderId, data: updateData });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Order Details - {selectedOrder.orderNumber}</CardTitle>
          <Button variant="outline" onClick={closeDetails}>
            Close
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Header */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-semibold">{selectedOrder.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-semibold">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-semibold text-lg">${selectedOrder.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedOrder.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedOrder.customer.email}</p>
              </div>
            </div>
            {selectedOrder.shippingAddress && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Shipping Address</p>
                <p className="font-medium">{selectedOrder.shippingAddress}</p>
              </div>
            )}
            {selectedOrder.paymentMethod && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{selectedOrder.paymentMethod}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {selectedOrder.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ${item.product.price}
                    </p>
                  </div>
                  <p className="font-semibold">${item.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Update Status</h3>
            <div className="flex gap-2">
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={selectedOrder.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                  disabled={updateStatusMutation.isPending}
                >
                  {getStatusIcon(status)}
                  <span className="ml-1 capitalize">{status}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold">{analytics.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed Orders</p>
                  <p className="text-2xl font-bold">{analytics.completedOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="status">Status Filter</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orderData?.orders?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {orderData?.orders?.map((order: Order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {order.orderNumber.slice(-2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {order._count.orderItems} items
                      </span>
                    </div>
                    <p className="font-semibold">${order.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order)}
                    >
                      View
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {orderData?.pagination && orderData.pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              
              {Array.from({ length: orderData.pagination.pages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === orderData.pagination.pages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
