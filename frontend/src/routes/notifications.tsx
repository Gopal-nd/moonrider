import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Sidebar } from '@/components/SideBar'
import { useAuthStore } from '@/lib/store'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Trash2,
  Eye,

} from 'lucide-react'
import { dashboardApi } from '@/lib/dashboardApi'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

const Notifications = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info'
  })
  const queryClient = useQueryClient()

  if (!user?.email) {
    navigate({ to: '/sign-in' })
    return null
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => dashboardApi.getNotifications(),
  });

  const { data: notificationCount } = useQuery({
    queryKey: ['notification-count'],
    queryFn: () => dashboardApi.getNotificationCount(),
  });

  const createNotificationMutation = useMutation({
    mutationFn: dashboardApi.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-count'] });
      setShowCreateForm(false);
      setNewNotification({ title: '', message: '', type: 'info' });
      toast.success('Notification created successfully!');
    },
    onError: () => {
      toast.error('Failed to create notification');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: dashboardApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-count'] });
      toast.success('Notification marked as read');
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });



  const deleteNotificationMutation = useMutation({
    mutationFn: dashboardApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-count'] });
      toast.success('Notification deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in all fields');
      return;
    }
    createNotificationMutation.mutate(newNotification);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };
  

  return (
    <div className="flex h-screen p-2 bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
     
        <Header toggleSidebar={toggleSidebar} title="Notifications" />


        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Notification Stats */}
            {notificationCount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Notifications</p>
                        <p className="text-2xl font-bold">{notificationCount.totalCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Unread Notifications</p>
                        <p className="text-2xl font-bold">{notificationCount.unreadCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Create Notification Form */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Create New Notification</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter notification title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Input
                      id="message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter notification message"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={newNotification.type}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateNotification}
                      disabled={createNotificationMutation.isPending}
                      className="flex-1"
                    >
                      {createNotificationMutation.isPending ? 'Creating...' : 'Create Notification'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  All Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading notifications...</div>
                ) : notifications.notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.notifications && notifications.notifications?.map((notification: any) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type)} ${
                          notification.isRead ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/notifications')({
  component: Notifications,
})
