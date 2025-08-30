import  { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  ResponsiveContainer
} from 'recharts';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityForm } from './ActivityForm';
import { dashboardApi } from '@/lib/dashboardApi';
import toast from 'react-hot-toast';

interface Activity {
  id: string;
  week: string;
  guest: number;
  userCount: number;
}

// Activities Chart Component
export const ActivitiesChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: dashboardApi.getActivities,
  });

  const createMutation = useMutation({
    mutationFn: dashboardApi.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setShowForm(false);
      toast.success('Activity created successfully');
    },
    onError: () => {
      toast.error('Failed to create activity');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      dashboardApi.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setEditingActivity(null);
      toast.success('Activity updated successfully');
    },
    onError: () => {
      toast.error('Failed to update activity');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dashboardApi.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete activity');
    },
  });

  const handleSave = (activity: any) => {
    if (editingActivity) {
      updateMutation.mutate({ id: editingActivity.id, data: activity });
    } else {
      createMutation.mutate(activity);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  if (showForm) {
    return (
      <ActivityForm
        activity={editingActivity || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        mode={editingActivity ? 'edit' : 'create'}
      />
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Activities</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">May - June 2021</span>
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
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
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading activities...</div>
          </div>
        ) : activities.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">No activities found. Add your first activity!</div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activities} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Bar dataKey="guest" fill="#F87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="userCount" fill="#4ADE80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Activity List */}
            <div className="mt-4 space-y-2">
              {activities.map((activity: Activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{activity.week}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      Guest: {activity.guest} | User: {activity.userCount}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

