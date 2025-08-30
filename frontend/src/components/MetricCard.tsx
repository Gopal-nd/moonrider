import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';

// Metric Card Component
export const MetricCard = ({ title, value, change, icon: Icon, color }:any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">
            {title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          <p className="text-xs text-green-600">+{change}%</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

