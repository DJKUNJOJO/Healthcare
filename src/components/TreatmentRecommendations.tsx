import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Pill, Clock, CheckCircle, AlertCircle, Target, Zap } from "lucide-react";
import { Treatment } from "@/hooks/useHealthModel";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TreatmentRecommendationsProps {
  onApplyTreatment: (treatment: Treatment) => void;
}

export const TreatmentRecommendations = ({ onApplyTreatment }: TreatmentRecommendationsProps) => {
  const { toast } = useToast();
  const [appliedTreatments, setAppliedTreatments] = useState<number[]>([]);
  const recommendations: Treatment[] = [
    {
      id: 1,
      name: "Reduce Metformin Dosage",
      type: "Medication Adjustment",
      implemented: false,
      expectedImpact: {
        glucose: -15,
        weight: 5
      },
      priority: "medium",
      confidence: 89,
      expectedOutcome: "Maintain glucose control with reduced side effects",
      timeline: "Next 2 weeks",
      evidence: "Based on 12-week glucose trends and kidney function",
      status: "pending",
      description: "Current glucose control is stable. Consider reducing from 1000mg to 850mg twice daily."
    },
    {
      id: 2,
      name: "Increase Physical Activity",
      type: "Lifestyle Intervention",
      implemented: false,
      expectedImpact: {
        glucose: -25,
        bloodPressure: -20,
        heartRate: -15,
        weight: -30,
        activity: 40
      },
      priority: "high",
      confidence: 94,
      expectedOutcome: "10-15% improvement in glucose variability",
      timeline: "Start immediately",
      evidence: "Personalized activity model + cardiovascular capacity",
      status: "recommended",
      description: "Add 15 minutes of moderate exercise 3x weekly to improve insulin sensitivity."
    },
    {
      id: 3,
      name: "Weekly Glucose Monitoring",
      type: "Monitoring Protocol",
      implemented: false,
      expectedImpact: {
        glucose: -10
      },
      priority: "high",
      confidence: 96,
      expectedOutcome: "Prevent hypoglycemic episodes",
      timeline: "Next 30 days",
      evidence: "Predictive model indicates 23% risk increase",
      status: "urgent",
      description: "Increase monitoring frequency to detect early signs of hypoglycemia."
    },
    {
      id: 4,
      name: "Carbohydrate Timing Optimization",
      type: "Nutritional Guidance",
      implemented: false,
      expectedImpact: {
        glucose: -20,
        weight: -10
      },
      priority: "low",
      confidence: 72,
      expectedOutcome: "Smoother post-meal glucose curves",
      timeline: "Next 4 weeks",
      evidence: "Continuous glucose monitor patterns",
      status: "suggested",
      description: "Adjust meal timing to align with medication peaks for better control."
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "recommended": return <Target className="h-4 w-4 text-primary" />;
      case "pending": return <Clock className="h-4 w-4 text-warning" />;
      case "suggested": return <Zap className="h-4 w-4 text-muted-foreground" />;
      default: return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Medication Adjustment": return <Pill className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleApplyTreatment = (treatment: Treatment) => {
    onApplyTreatment(treatment);
    setAppliedTreatments(prev => [...prev, treatment.id]);
    
    toast({
      title: "Treatment Applied",
      description: `${treatment.name} has been implemented. Check the trajectory model for impact.`,
      duration: 3000,
    });
  };

  const handleDeferTreatment = (treatmentName: string) => {
    toast({
      title: "Treatment Deferred",
      description: `${treatmentName} has been postponed for later review.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Treatment Recommendations
          </CardTitle>
          <CardDescription>AI-powered personalized treatment suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(rec.status)}
                    <h4 className="font-medium text-sm">{rec.name}</h4>
                    <Badge 
                      variant={getPriorityColor(rec.priority) as any}
                      className="text-xs"
                    >
                      {rec.priority}
                    </Badge>
                    {appliedTreatments.includes(rec.id) && (
                      <Badge variant="outline" className="text-xs animate-fade-in bg-success/10 border-success text-success">
                        Applied
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-foreground">Expected Outcome: </span>
                        <span className="text-muted-foreground">{rec.expectedOutcome}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Timeline: </span>
                        <span className="text-muted-foreground">{rec.timeline}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Confidence Level</span>
                        <span className="text-xs font-medium">{rec.confidence}%</span>
                      </div>
                      <Progress value={rec.confidence} className="h-2" />
                    </div>
                    
                    <details className="text-xs">
                      <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium">
                        View Evidence
                      </summary>
                      <p className="mt-2 text-muted-foreground border-l-2 border-primary/20 pl-3">
                        {rec.evidence}
                      </p>
                    </details>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button 
                    size="sm" 
                    variant={rec.status === "urgent" ? "default" : "outline"}
                    className="text-xs hover-scale"
                    onClick={() => handleApplyTreatment(rec)}
                    disabled={appliedTreatments.includes(rec.id)}
                  >
                    {appliedTreatments.includes(rec.id) ? "Applied" : rec.status === "urgent" ? "Implement" : "Apply"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs hover-scale"
                    onClick={() => handleDeferTreatment(rec.name)}
                  >
                    Defer
                  </Button>
                </div>
              </div>
              
              {index < recommendations.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};