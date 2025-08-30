import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Activity {
  id?: string;
  week: string;
  guest: number;
  userCount: number;
}

interface ActivityFormProps {
  activity?: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  activity,
  onSave,
  onCancel,
  mode
}) => {
  const [formData, setFormData] = useState<Activity>({
    week: '',
    guest: 0,
    userCount: 0
  });

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    }
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.week || formData.guest < 0 || formData.userCount < 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    onSave(formData);
  };

  const handleChange = (field: keyof Activity, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'guest' || field === 'userCount' ? Number(value) : value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {mode === 'create' ? 'Add New Activity' : 'Edit Activity'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="week">Week</Label>
            <Input
              id="week"
              type="text"
              placeholder="e.g., Week 1"
              value={formData.week}
              onChange={(e) => handleChange('week', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guest">Guest Count</Label>
            <Input
              id="guest"
              type="number"
              min="0"
              value={formData.guest}
              onChange={(e) => handleChange('guest', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userCount">User Count</Label>
            <Input
              id="userCount"
              type="number"
              min="0"
              value={formData.userCount}
              onChange={(e) => handleChange('userCount', e.target.value)}
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {mode === 'create' ? (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Activity
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
