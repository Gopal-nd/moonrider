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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Settings, 
  Bell, 
  Eye, 
  EyeOff,
  Save,
  Edit,
  Palette,
  Globe,
  Shield,
  Package,
  ShoppingCart,
  DollarSign,
  Menu
} from 'lucide-react'
import { dashboardApi } from '@/lib/dashboardApi'
import toast from 'react-hot-toast'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || ''
  })
  const [settingsData, setSettingsData] = useState({
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true
  })
  const queryClient = useQueryClient()

  if (!user?.email) {
    navigate({ to: '/sign-in' })
    return null
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: dashboardApi.getUserProfile,
  });

  const { data: userSettings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: dashboardApi.getUserSettings,
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-statistics'],
    queryFn: dashboardApi.getUserStatistics,
  });

  const updateProfileMutation = useMutation({
    mutationFn: dashboardApi.updateUserProfile,
    onSuccess: (data) => {
      updateUser(data);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: dashboardApi.updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      setIsEditingSettings(false);
      toast.success('Settings updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const resetSettingsMutation = useMutation({
    mutationFn: dashboardApi.resetUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast.success('Settings reset to defaults!');
    },
    onError: () => {
      toast.error('Failed to reset settings');
    },
  });

  const handleProfileSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleSettingsSave = () => {
    updateSettingsMutation.mutate(settingsData);
  };

  const handleProfileEdit = () => {
    setProfileData({
      name: user?.name || '',
      avatar: user?.avatar || ''
    });
    setIsEditingProfile(true);
  };

  const handleSettingsEdit = () => {
    if (userSettings) {
      setSettingsData({
        theme: userSettings.theme,
        language: userSettings.language,
        emailNotifications: userSettings.emailNotifications,
        pushNotifications: userSettings.pushNotifications
      });
    }
    setIsEditingSettings(true);
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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold">Profile & Settings</h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </span>
                  {!isEditingProfile && (
                    <Button variant="outline" size="sm" onClick={handleProfileEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar || user?.avatar} />
                    <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditingProfile ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={profileData.avatar}
                            onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                            placeholder="Enter image URL"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleProfileSave} disabled={updateProfileMutation.isPending}>
                            <Save className="h-4 w-4 mr-2" />
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold">{user?.name}</h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Statistics */}
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Products</p>
                        <p className="text-2xl font-bold">{userStats.totalProducts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{userStats.totalCustomers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{userStats.totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${userStats.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    User Settings
                  </span>
                  {!isEditingSettings && (
                    <Button variant="outline" size="sm" onClick={handleSettingsEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingSettings ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="theme" className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Theme
                        </Label>
                        <select
                          id="theme"
                          value={settingsData.theme}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, theme: e.target.value }))}
                          className="w-full p-2 border rounded-md mt-1"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="language" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Language
                        </Label>
                        <select
                          id="language"
                          value={settingsData.language}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full p-2 border rounded-md mt-1"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Email Notifications
                        </Label>
                        <input
                          id="emailNotifications"
                          type="checkbox"
                          checked={settingsData.emailNotifications}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                          className="w-4 h-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications" className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Push Notifications
                        </Label>
                        <input
                          id="pushNotifications"
                          type="checkbox"
                          checked={settingsData.pushNotifications}
                          onChange={(e) => setSettingsData(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSettingsSave} disabled={updateSettingsMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingSettings(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Theme
                      </span>
                      <span className="capitalize">{userSettings?.theme || 'light'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Language
                      </span>
                      <span className="uppercase">{userSettings?.language || 'en'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Email Notifications
                      </span>
                      <span>{userSettings?.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Push Notifications
                      </span>
                      <span>{userSettings?.pushNotifications ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                )}
                
                {!isEditingSettings && (
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => resetSettingsMutation.mutate()}>
                      Reset to Defaults
                    </Button>
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

export const Route = createFileRoute('/profile')({
  component: Profile,
})
