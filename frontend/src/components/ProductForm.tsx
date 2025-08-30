import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id?: string;
  name: string;
  percentage: number;
  color: string;
}

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
  mode
}) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    percentage: 0,
    color: '#10B981'
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.percentage < 0 || formData.percentage > 100) {
      toast.error('Please fill all fields correctly. Percentage must be between 0-100.');
      return;
    }

    onSave(formData);
  };

  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'percentage' ? Number(value) : value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Basic Tees"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage</Label>
            <Input
              id="percentage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.percentage}
              onChange={(e) => handleChange('percentage', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="#10B981"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {mode === 'create' ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
