import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PatientOverview } from "@/components/PatientOverview";
import { HealthMetrics } from "@/components/HealthMetrics";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { TreatmentRecommendations } from "@/components/TreatmentRecommendations";
import { AlertList } from "@/components/AlertList";
import { HealthTrajectoryModel } from "@/components/HealthTrajectoryModel";
import { useHealthModel } from "@/hooks/useHealthModel";
import { Activity, Brain, Heart, User, AlertTriangle, TrendingUp } from "lucide-react";

const Index = () => {
  const [selectedPatient, setSelectedPatient] = useState("patient-001");
  const { healthMetrics, appliedTreatments, overallHealth, applyTreatment, revertTreatment } = useHealthModel();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">MedTwin Pro</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                Digital Health Twin Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Dr. Sarah Chen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Patient & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <PatientOverview patientId={selectedPatient} />
            <AlertList />
          </div>
          
          {/* Right Sidebar - Health Trajectory Model */}
          <div className="lg:col-span-1 lg:order-last">
            <HealthTrajectoryModel 
              healthMetrics={healthMetrics}
              appliedTreatments={appliedTreatments}
              overallHealth={overallHealth}
              onRevertTreatment={revertTreatment}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 hover-scale">
                  <Activity className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="metrics" className="flex items-center gap-2 hover-scale">
                  <Heart className="h-4 w-4" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="predictions" className="flex items-center gap-2 hover-scale">
                  <Brain className="h-4 w-4" />
                  Predictions
                </TabsTrigger>
                <TabsTrigger value="treatments" className="flex items-center gap-2 hover-scale">
                  <AlertTriangle className="h-4 w-4" />
                  Treatments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HealthMetrics healthMetrics={healthMetrics} />
                  <PredictiveAnalytics />
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6 animate-fade-in">
                <HealthMetrics healthMetrics={healthMetrics} expanded />
              </TabsContent>

              <TabsContent value="predictions" className="space-y-6 animate-fade-in">
                <PredictiveAnalytics expanded />
              </TabsContent>

              <TabsContent value="treatments" className="space-y-6 animate-fade-in">
                <TreatmentRecommendations onApplyTreatment={applyTreatment} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;