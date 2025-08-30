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
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Palette,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Edit
} from 'lucide-react'
import { dashboardApi } from '@/lib/dashboardApi'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [settingsData, setSettingsData] = useState({
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    dashboardLayout: 'default'
  })
  const queryClient = useQueryClient()

  if (!user?.email) {
    navigate({ to: '/sign-in' })
    return null
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const { data: userSettings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: dashboardApi.getUserSettings,
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

  const handleSettingsSave = () => {
    updateSettingsMutation.mutate(settingsData);
  };

  const handleSettingsEdit = () => {
    if (userSettings) {
      setSettingsData({
        theme: userSettings.theme,
        language: userSettings.language,
        emailNotifications: userSettings.emailNotifications,
        pushNotifications: userSettings.pushNotifications,
        dashboardLayout: 'default'
      });
    }
    setIsEditingSettings(true);
  };

  const systemStatus = {
    database: 'Connected',
    api: 'Healthy',
    notifications: 'Active',
    security: 'Enabled'
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
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={toggleSidebar}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold">System Settings</h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(systemStatus).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex items-center gap-2 capitalize">
                        {key === 'database' && <Database className="h-4 w-4" />}
                        {key === 'api' && <CheckCircle className="h-4 w-4" />}
                        {key === 'notifications' && <Bell className="h-4 w-4" />}
                        {key === 'security' && <Shield className="h-4 w-4" />}
                        {key}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'Connected' || status === 'Healthy' || status === 'Active' || status === 'Enabled'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    User Preferences
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
                          <option value="auto">Auto (System)</option>
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
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="dashboardLayout" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Dashboard Layout
                      </Label>
                      <select
                        id="dashboardLayout"
                        value={settingsData.dashboardLayout}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, dashboardLayout: e.target.value }))}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="default">Default</option>
                        <option value="compact">Compact</option>
                        <option value="spacious">Spacious</option>
                        <option value="custom">Custom</option>
                      </select>
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
                        {updateSettingsMutation.isPending ? 'Saving...' : 'Save Preferences'}
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
                        <Settings className="h-4 w-4" />
                        Dashboard Layout
                      </span>
                      <span className="capitalize">Default</span>
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
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Two-Factor Authentication
                    </span>
                    <span className="text-muted-foreground">Not enabled</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Login Notifications
                    </span>
                    <span className="text-green-600">Enabled</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Session Management
                    </span>
                    <span className="text-green-600">Active</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Data Export</span>
                    <Button size="sm" variant="outline">
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Data Deletion</span>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      Delete Account
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Your data is protected and never shared with third parties. 
                    You can export your data or delete your account at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})
