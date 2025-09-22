import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Minus, RotateCcw, Target } from "lucide-react";
import { HealthMetric, Treatment } from "@/hooks/useHealthModel";

interface HealthTrajectoryModelProps {
  healthMetrics: Record<string, HealthMetric>;
  appliedTreatments: Treatment[];
  overallHealth: number;
  onRevertTreatment: (treatmentId: number) => void;
}

export const HealthTrajectoryModel = ({ 
  healthMetrics, 
  appliedTreatments, 
  overallHealth,
  onRevertTreatment 
}: HealthTrajectoryModelProps) => {
  const getHealthColor = (score: number) => {
    if (score > 20) return "success";
    if (score < -20) return "destructive";
    return "warning";
  };

  const getHealthAnimation = (score: number) => {
    if (score > 20) return "animate-pulse-success";
    if (score < -20) return "animate-pulse-danger";
    return "animate-pulse-warning";
  };

  const getTrendIcon = (trend: string, size = 16) => {
    switch (trend) {
      case 'improving': return <TrendingUp className={`h-${size/4} w-${size/4} text-success`} />;
      case 'declining': return <TrendingDown className={`h-${size/4} w-${size/4} text-destructive`} />;
      default: return <Minus className={`h-${size/4} w-${size/4} text-muted-foreground`} />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score > 0) return "bg-success";
    if (score < 0) return "bg-destructive";
    return "bg-muted";
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Health Trajectory Model
        </CardTitle>
        <CardDescription>Real-time treatment impact visualization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="text-center space-y-3">
          <div className={`relative inline-flex items-center justify-center w-24 h-24 rounded-full border-4 
            ${overallHealth > 20 ? 'border-success' : overallHealth < -20 ? 'border-destructive' : 'border-warning'}
            ${getHealthAnimation(overallHealth)}`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                overallHealth > 20 ? 'text-success' : overallHealth < -20 ? 'text-destructive' : 'text-warning'
              }`}>
                {overallHealth > 0 ? '+' : ''}{overallHealth}
              </div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </div>
          </div>
          
          <Badge 
            variant={getHealthColor(overallHealth) as any}
            className="animate-fade-in"
          >
            {overallHealth > 20 ? 'Improving' : overallHealth < -20 ? 'Declining' : 'Stable'}
          </Badge>
        </div>

        <Separator />

        {/* Individual Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Metric Trajectories</h4>
          {Object.entries(healthMetrics).map(([key, metric]) => (
            <div key={key} className="space-y-2 animate-scale-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {metric.current}
                    {metric.impactScore !== 0 && (
                      <span className={`ml-1 text-xs ${
                        metric.impactScore > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        ({metric.impactScore > 0 ? '+' : ''}{metric.impactScore})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Target: {metric.target}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={Math.abs(metric.impactScore)} 
                  className={`h-2 ${getProgressColor(metric.impactScore)}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Baseline</span>
                  <span>{metric.baseline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {appliedTreatments.length > 0 && (
          <>
            <Separator />
            
            {/* Applied Treatments */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                Active Treatments
                <Badge variant="outline" className="text-xs">
                  {appliedTreatments.length}
                </Badge>
              </h4>
              
              {appliedTreatments.map((treatment) => (
                <div key={treatment.id} className="p-3 bg-muted/30 rounded-lg border animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-medium">{treatment.name}</h5>
                      <p className="text-xs text-muted-foreground">{treatment.type}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover-scale"
                      onClick={() => onRevertTreatment(treatment.id)}
                    >
                      <RotateCcw className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  
                  {treatment.timestamp && (
                    <p className="text-xs text-muted-foreground">
                      Applied: {treatment.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(treatment.expectedImpact).map(([metric, impact]) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="capitalize">{metric}:</span>
                        <span className={impact > 0 ? 'text-success' : 'text-destructive'}>
                          {impact > 0 ? '+' : ''}{impact}
                        </span>
                      </div>
                    ))}
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