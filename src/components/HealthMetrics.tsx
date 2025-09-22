import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Activity, Heart, Droplets } from "lucide-react";
import { HealthMetric } from "@/hooks/useHealthModel";

interface HealthMetricsProps {
  expanded?: boolean;
  healthMetrics?: Record<string, HealthMetric>;
}

export const HealthMetrics = ({ expanded = false, healthMetrics }: HealthMetricsProps) => {
  // Use provided healthMetrics or fall back to static data
  const getMetricsData = () => {
    if (healthMetrics) {
      return [
        {
          name: healthMetrics.glucose?.name || "Blood Glucose",
          current: Math.round(healthMetrics.glucose?.current || 145),
          target: "70-140",
          unit: "mg/dL",
          trend: healthMetrics.glucose?.trend || "stable",
          change: healthMetrics.glucose?.impactScore ? `${healthMetrics.glucose.impactScore > 0 ? '+' : ''}${healthMetrics.glucose.impactScore}%` : "0%",
          status: healthMetrics.glucose?.trend === "improving" ? "success" : healthMetrics.glucose?.trend === "declining" ? "warning" : "success",
          icon: Droplets,
          data: [
            { time: "6AM", value: 110 },
            { time: "9AM", value: 165 },
            { time: "12PM", value: Math.round(healthMetrics.glucose?.current || 145) },
            { time: "3PM", value: 135 },
            { time: "6PM", value: 155 },
            { time: "9PM", value: Math.round(healthMetrics.glucose?.current || 145) },
          ]
        },
        {
          name: healthMetrics.bloodPressure?.name || "Blood Pressure",
          current: `${Math.round(healthMetrics.bloodPressure?.current || 128)}/82`,
          target: "<120/80",
          unit: "mmHg",
          trend: healthMetrics.bloodPressure?.trend || "stable",
          change: healthMetrics.bloodPressure?.impactScore ? `${healthMetrics.bloodPressure.impactScore > 0 ? '+' : ''}${healthMetrics.bloodPressure.impactScore}%` : "0%",
          status: healthMetrics.bloodPressure?.trend === "improving" ? "success" : healthMetrics.bloodPressure?.trend === "declining" ? "warning" : "success",
          icon: Heart,
          data: [
            { time: "Mon", systolic: 132, diastolic: 85 },
            { time: "Tue", systolic: 129, diastolic: 83 },
            { time: "Wed", systolic: 131, diastolic: 84 },
            { time: "Thu", systolic: Math.round(healthMetrics.bloodPressure?.current || 128), diastolic: 82 },
            { time: "Fri", systolic: 126, diastolic: 80 },
            { time: "Sat", systolic: Math.round(healthMetrics.bloodPressure?.current || 128), diastolic: 82 },
          ]
        },
        {
          name: healthMetrics.heartRate?.name || "Heart Rate",
          current: Math.round(healthMetrics.heartRate?.current || 78),
          target: "60-100",
          unit: "bpm",
          trend: healthMetrics.heartRate?.trend || "stable",
          change: healthMetrics.heartRate?.impactScore ? `${healthMetrics.heartRate.impactScore > 0 ? '+' : ''}${healthMetrics.heartRate.impactScore}%` : "0%",
          status: healthMetrics.heartRate?.trend === "improving" ? "success" : healthMetrics.heartRate?.trend === "declining" ? "warning" : "success",
          icon: Activity,
          data: [
            { time: "12AM", value: 65 },
            { time: "4AM", value: 62 },
            { time: "8AM", value: 72 },
            { time: "12PM", value: Math.round(healthMetrics.heartRate?.current || 78) },
            { time: "4PM", value: 75 },
            { time: "8PM", value: 70 },
          ]
        }
      ];
    }
    
    // Fallback static data
    return [
      {
        name: "Blood Glucose",
        current: 145,
        target: "70-140",
        unit: "mg/dL",
        trend: "up",
        change: "+8%",
        status: "warning",
        icon: Droplets,
        data: [
          { time: "6AM", value: 110 },
          { time: "9AM", value: 165 },
          { time: "12PM", value: 145 },
          { time: "3PM", value: 135 },
          { time: "6PM", value: 155 },
          { time: "9PM", value: 145 },
        ]
      },
      {
        name: "Blood Pressure",
        current: "128/82",
        target: "<120/80",
        unit: "mmHg",
        trend: "down",
        change: "-3%",
        status: "success",
        icon: Heart,
        data: [
          { time: "Mon", systolic: 132, diastolic: 85 },
          { time: "Tue", systolic: 129, diastolic: 83 },
          { time: "Wed", systolic: 131, diastolic: 84 },
          { time: "Thu", systolic: 128, diastolic: 82 },
          { time: "Fri", systolic: 126, diastolic: 80 },
          { time: "Sat", systolic: 128, diastolic: 82 },
        ]
      },
      {
        name: "Heart Rate",
        current: 78,
        target: "60-100",
        unit: "bpm",
        trend: "stable",
        change: "0%",
        status: "success",
        icon: Activity,
        data: [
          { time: "12AM", value: 65 },
          { time: "4AM", value: 62 },
          { time: "8AM", value: 72 },
          { time: "12PM", value: 78 },
          { time: "4PM", value: 75 },
          { time: "8PM", value: 70 },
        ]
      }
    ];
  };

  const metrics = getMetricsData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning": return "text-warning";
      case "success": return "text-success";
      case "danger": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-warning" />;
      case "down": return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Health Metrics
          </CardTitle>
          <CardDescription>Real-time physiological monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="space-y-3 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{metric.name}</h4>
                      <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`metric-value text-lg ${getStatusColor(metric.status)} transition-all duration-300`}>
                        {metric.current}
                      </span>
                      <span className="text-xs text-muted-foreground">{metric.unit}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <span className={`${getStatusColor(metric.status)} transition-colors duration-300`}>{metric.change}</span>
                      <span className="text-muted-foreground">impact score</span>
                    </div>
                  </div>
                </div>
                
                {expanded && (
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metric.data}>
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                            fontSize: '12px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill={`url(#gradient-${index})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};