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
  FileText, 
  TrendingUp, 
  Users, 
  Package, 
  Download,

  BarChart3,

} from 'lucide-react'
import { dashboardApi } from '@/lib/dashboardApi'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

const Reports = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string>('')
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })
  const queryClient = useQueryClient()

  if (!user?.email) {
    navigate({ to: '/sign-in' })
    return null
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => dashboardApi.getReports(),
  });

  const generateReportMutation = useMutation({
    mutationFn: (data: any) => {
      switch (selectedReportType) {
        case 'sales':
          return dashboardApi.generateSalesReport(data);
        case 'inventory':
          return dashboardApi.generateInventoryReport(data);
        case 'customer':
          return dashboardApi.generateCustomerReport(data);
        default:
          throw new Error('Invalid report type');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success(`${selectedReportType} report generated successfully!`);
      console.log('Generated report data:', data);
    },
    onError: () => {
      toast.error('Failed to generate report');
    },
  });

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      toast.error('Please select a report type');
      return;
    }

    const reportData = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      filters: {}
    };

    generateReportMutation.mutate(reportData);
  };

  const reportTypes = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp, description: 'Revenue, orders, and product performance' },
    { id: 'inventory', label: 'Inventory Report', icon: Package, description: 'Stock levels, low stock alerts, and value' },
    { id: 'customer', label: 'Customer Report', icon: Users, description: 'Customer segments, behavior, and analytics' },
  ];

  // console.log(reports)

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
        <Header toggleSidebar={toggleSidebar} title="Reports & Analytics" />


        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate New Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <select
                      id="reportType"
                      value={selectedReportType}
                      onChange={(e) => setSelectedReportType(e.target.value)}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="">Select Report Type</option>
                      {reportTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateReport}
                  disabled={!selectedReportType || generateReportMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {generateReportMutation.isPending ? 'Generating...' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>

            {/* Report Types Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportTypes.map((type) => (
                <Card key={type.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <type.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg">{type.label}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedReportType(type.id)}
                    >
                      Generate {type.label}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports?.reports?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reports generated yet. Generate your first report above!
                  </div>
                ) : (
                  <div className="space-y-3">
                    
                    {reports?.reports?.slice(0, 5).map((report: any) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {report.type} • {new Date(report.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
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

export const Route = createFileRoute('/reports')({
  component: Reports,
})
