  // Helper for health animation
  const getHealthAnimation = (score: number) => {
    if (score > 20) return "animate-pulse-success";
    if (score < -20) return "animate-pulse-danger";
    return "animate-pulse-warning";
  };

  // Helper for trend icon
  const getTrendIcon = (trend: string, size = 16) => {
    switch (trend) {
      case 'improving': return <TrendingUp className={`h-${size/4} w-${size/4} text-success`} />;
      case 'declining': return <TrendingDown className={`h-${size/4} w-${size/4} text-destructive`} />;
      default: return <Minus className={`h-${size/4} w-${size/4} text-muted-foreground`} />;
    }
  };

  // Helper for progress color
  const getProgressColor = (score: number) => {
    if (score > 0) return "bg-success";
    if (score < 0) return "bg-destructive";
    return "bg-muted";
  };
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Minus, RotateCcw, Target, Download } from "lucide-react";
import { HealthMetric, Treatment } from "@/hooks/useHealthModel";
import React, { useState } from "react";
import { useGeminiAI } from "@/hooks/useGeminiAI";

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

  // Download handler
  const handleDownload = () => {
    let content = `Health Trajectory Model\n`;
    content += `Overall Health Score: ${overallHealth}\n`;
    content += `Status: ${overallHealth > 20 ? 'Improving' : overallHealth < -20 ? 'Declining' : 'Stable'}\n\n`;
    content += `Metric Trajectories:\n`;
    Object.entries(healthMetrics).forEach(([key, metric]) => {
      content += `- ${metric.name}: Current=${metric.current}, Target=${metric.target}, Baseline=${metric.baseline}, Impact=${metric.impactScore}, Trend=${metric.trend}\n`;
    });
    if (appliedTreatments && appliedTreatments.length > 0) {
      content += `\nActive Treatments:\n`;
      appliedTreatments.forEach((t) => {
        content += `- ${t.name} (${t.type}):\n`;
        Object.entries(t.expectedImpact).forEach(([metric, impact]) => {
          content += `    ${metric}: ${(typeof impact === 'number' && impact > 0 ? '+' : '') + impact}\n`;
        });
      });
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health_trajectory.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Gemini AI integration
  const { askGemini, loading, result, error } = useGeminiAI();
  const [apiKey, setApiKey] = useState("");
  const [showGemini, setShowGemini] = useState(false);

  // Prepare a prompt from health data
  const buildPrompt = () => {
    let prompt = `Patient Health Summary:\n`;
    prompt += `Overall Health Score: ${overallHealth}\n`;
    prompt += `Metrics:\n`;
    Object.entries(healthMetrics).forEach(([key, metric]) => {
      prompt += `- ${metric.name}: Current=${metric.current}, Target=${metric.target}, Baseline=${metric.baseline}, Impact=${metric.impactScore}, Trend=${metric.trend}\n`;
    });
    if (appliedTreatments && appliedTreatments.length > 0) {
      prompt += `\nActive Treatments:\n`;
      appliedTreatments.forEach((t) => {
        prompt += `- ${t.name} (${t.type}):\n`;
        Object.entries(t.expectedImpact).forEach(([metric, impact]) => {
          prompt += `    ${metric}: ${(typeof impact === 'number' && impact > 0 ? '+' : '') + impact}\n`;
        });
      });
    }
    prompt += `\nPlease provide a summary and any AI-driven recommendations for this patient.`;
    return prompt;
  };

  const handleAskGemini = () => {
    setShowGemini(true);
    askGemini(buildPrompt(), apiKey);
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Health Trajectory Model
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" title="Download" onClick={handleDownload}>
              <Download className="h-5 w-5" />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleAskGemini} disabled={loading || !apiKey} title="Ask Gemini AI">
              Ask Gemini
            </Button>
          </div>
        </div>
        <CardDescription>Real-time treatment impact visualization</CardDescription>
        {/* Gemini API Key input (for demo) */}
        <div className="mt-2 flex gap-2 items-center">
          <input
            type="password"
            placeholder="Gemini API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="border rounded px-2 py-1 text-xs w-48"
            autoComplete="off"
          />
          <span className="text-xs text-muted-foreground">(required)</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showGemini && (
          <div className="p-3 mb-2 rounded bg-muted/50 border animate-fade-in">
            {loading && <div className="text-xs text-muted-foreground">Gemini is thinking...</div>}
            {error && <div className="text-xs text-destructive">{error}</div>}
            {result && <div className="text-xs whitespace-pre-line">{result}</div>}
          </div>
        )}
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