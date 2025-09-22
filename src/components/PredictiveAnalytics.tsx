import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Brain, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

interface PredictiveAnalyticsProps {
  expanded?: boolean;
}

export const PredictiveAnalytics = ({ expanded = false }: PredictiveAnalyticsProps) => {
  const predictions = [
    {
      title: "Hypoglycemic Event Risk",
      probability: 23,
      timeframe: "Next 24 hours",
      confidence: 87,
      recommendation: "Adjust insulin dosage",
      severity: "medium"
    },
    {
      title: "Hospital Readmission Risk",
      probability: 8,
      timeframe: "Next 30 days",
      confidence: 94,
      recommendation: "Continue current plan",
      severity: "low"
    },
    {
      title: "Medication Adherence",
      probability: 78,
      timeframe: "Next 7 days",
      confidence: 91,
      recommendation: "Schedule follow-up",
      severity: "high"
    }
  ];

  const riskTrend = [
    { month: "Oct", overall: 15, cardiovascular: 8, metabolic: 22 },
    { month: "Nov", overall: 18, cardiovascular: 12, metabolic: 25 },
    { month: "Dec", overall: 14, cardiovascular: 9, metabolic: 19 },
    { month: "Jan", overall: 12, cardiovascular: 7, metabolic: 17 },
    { month: "Feb", overall: 16, cardiovascular: 11, metabolic: 21 },
    { month: "Mar", overall: 13, cardiovascular: 8, metabolic: 18 },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 border-destructive/20";
      case "medium": return "bg-warning/10 border-warning/20";
      case "low": return "bg-success/10 border-success/20";
      default: return "bg-secondary/10 border-secondary/20";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>AI-powered health risk assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {predictions.map((prediction, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getSeverityBg(prediction.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{prediction.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {prediction.timeframe}
                  </p>
                </div>
                <Badge 
                  variant={getSeverityColor(prediction.severity) as any}
                  className="text-xs"
                >
                  {prediction.probability}% risk
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{prediction.confidence}%</span>
                </div>
                <Progress value={prediction.confidence} className="h-2" />
              </div>
              
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-foreground">
                  <span className="font-medium">Recommendation:</span> {prediction.recommendation}
                </p>
              </div>
            </div>
          ))}

          {expanded && (
            <div className="space-y-4">
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Risk Trend Analysis
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="overall" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Overall Risk"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cardiovascular" 
                        stroke="hsl(var(--success))" 
                        strokeWidth={2}
                        name="Cardiovascular"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="metabolic" 
                        stroke="hsl(var(--warning))" 
                        strokeWidth={2}
                        name="Metabolic"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};