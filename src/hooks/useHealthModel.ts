import { useState, useCallback } from 'react';

export interface HealthMetric {
  name: string;
  current: number;
  baseline: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
  impactScore: number; // -100 to +100
}

export interface Treatment {
  id: number;
  name: string;
  type: string;
  implemented: boolean;
  expectedImpact: Record<string, number>; // metric name -> impact score
  actualImpact?: Record<string, number>;
  timestamp?: Date;
  // Additional treatment recommendation properties
  priority?: string;
  confidence?: number;
  expectedOutcome?: string;
  timeline?: string;
  evidence?: string;
  status?: string;
  description?: string;
}

export const useHealthModel = () => {
  const [healthMetrics, setHealthMetrics] = useState<Record<string, HealthMetric>>({
    glucose: {
      name: 'Blood Glucose',
      current: 145,
      baseline: 145,
      target: 120,
      trend: 'stable',
      impactScore: 0
    },
    bloodPressure: {
      name: 'Blood Pressure',
      current: 128,
      baseline: 128,
      target: 120,
      trend: 'stable',
      impactScore: 0
    },
    heartRate: {
      name: 'Heart Rate',
      current: 78,
      baseline: 78,
      target: 70,
      trend: 'stable',
      impactScore: 0
    },
    weight: {
      name: 'Weight',
      current: 165,
      baseline: 165,
      target: 155,
      trend: 'stable',
      impactScore: 0
    },
    activity: {
      name: 'Activity Level',
      current: 45,
      baseline: 45,
      target: 70,
      trend: 'stable',
      impactScore: 0
    }
  });

  const [appliedTreatments, setAppliedTreatments] = useState<Treatment[]>([]);
  const [overallHealth, setOverallHealth] = useState(0);

  const applyTreatment = useCallback((treatment: Treatment) => {
    const newTreatment = {
      ...treatment,
      implemented: true,
      timestamp: new Date(),
      actualImpact: { ...treatment.expectedImpact }
    };

    setAppliedTreatments(prev => [...prev, newTreatment]);

    // Update health metrics based on treatment impact
    setHealthMetrics(prev => {
      const updated = { ...prev };
      
      Object.entries(treatment.expectedImpact).forEach(([metricKey, impact]) => {
        if (updated[metricKey]) {
          const metric = updated[metricKey];
          const newImpactScore = Math.max(-100, Math.min(100, metric.impactScore + impact));
          
          // Calculate new current value based on impact
          const impactFactor = newImpactScore / 100;
          const targetDiff = metric.target - metric.baseline;
          const newCurrent = metric.baseline + (targetDiff * impactFactor * 0.3); // 30% of target improvement
          
          updated[metricKey] = {
            ...metric,
            current: Math.round(newCurrent * 10) / 10,
            impactScore: newImpactScore,
            trend: newImpactScore > 10 ? 'improving' : newImpactScore < -10 ? 'declining' : 'stable'
          };
        }
      });
      
      return updated;
    });

    // Update overall health score
    setTimeout(() => {
      const avgImpact = Object.values(healthMetrics).reduce((sum, metric) => sum + metric.impactScore, 0) / Object.keys(healthMetrics).length;
      setOverallHealth(Math.round(avgImpact));
    }, 100);
  }, [healthMetrics]);

  const revertTreatment = useCallback((treatmentId: number) => {
    const treatment = appliedTreatments.find(t => t.id === treatmentId);
    if (!treatment) return;

    setAppliedTreatments(prev => prev.filter(t => t.id !== treatmentId));

    // Revert the impact of this treatment
    setHealthMetrics(prev => {
      const updated = { ...prev };
      
      Object.entries(treatment.expectedImpact).forEach(([metricKey, impact]) => {
        if (updated[metricKey]) {
          const metric = updated[metricKey];
          const newImpactScore = Math.max(-100, Math.min(100, metric.impactScore - impact));
          
          const impactFactor = newImpactScore / 100;
          const targetDiff = metric.target - metric.baseline;
          const newCurrent = metric.baseline + (targetDiff * impactFactor * 0.3);
          
          updated[metricKey] = {
            ...metric,
            current: Math.round(newCurrent * 10) / 10,
            impactScore: newImpactScore,
            trend: newImpactScore > 10 ? 'improving' : newImpactScore < -10 ? 'declining' : 'stable'
          };
        }
      });
      
      return updated;
    });

    setTimeout(() => {
      const avgImpact = Object.values(healthMetrics).reduce((sum, metric) => sum + metric.impactScore, 0) / Object.keys(healthMetrics).length;
      setOverallHealth(Math.round(avgImpact));
    }, 100);
  }, [appliedTreatments, healthMetrics]);

  return {
    healthMetrics,
    appliedTreatments,
    overallHealth,
    applyTreatment,
    revertTreatment
  };
};