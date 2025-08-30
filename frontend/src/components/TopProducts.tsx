import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductForm } from './ProductForm';
import { dashboardApi } from '@/lib/dashboardApi';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  percentage: number;
  color: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
  imageUrl?: string;
}

// Top Products Component
export const TopProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: dashboardApi.getProducts,
  });

  const createMutation = useMutation({
    mutationFn: dashboardApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowForm(false);
      toast.success('Product created successfully');
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dashboardApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      toast.success('Product updated successfully');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dashboardApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const handleSave = (product: any) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: product });
    } else {
      createMutation.mutate(product);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        mode={editingProduct ? 'edit' : 'create'}
      />
    );
  }

  const pieData = products.map((product: Product) => ({
    name: product.name,
    value: product.percentage,
    color: product.color
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Top products</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">May - June 2021</span>
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-muted-foreground">No products found. Add your first product!</div>
          </div>
        ) : (
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
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: product.color }}
                    ></div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.percentage}%</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
