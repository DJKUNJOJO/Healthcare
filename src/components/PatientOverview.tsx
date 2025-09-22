import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Phone, Mail } from "lucide-react";

interface PatientOverviewProps {
  patientId: string;
}

export const PatientOverview = ({ patientId }: PatientOverviewProps) => {
  // Mock patient data - in real implementation, this would come from API
  const patient = {
    id: "P-001",
    name: "Emily Rodriguez",
    age: 67,
    gender: "Female",
    condition: "Type 2 Diabetes",
    riskLevel: "Medium",
    lastVisit: "2024-01-15",
    nextVisit: "2024-02-15",
    phone: "(555) 123-4567",
    email: "emily.r@email.com",
    location: "Boston, MA",
    avatar: "/api/placeholder/64/64"
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Patient Overview</CardTitle>
        <CardDescription>Current patient information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">{patient.age} years old • {patient.gender}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Condition</span>
            <span className="text-sm font-medium">{patient.condition}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Level</span>
            <Badge 
              variant={getRiskColor(patient.riskLevel) as any}
              className="text-xs"
            >
              {patient.riskLevel}
            </Badge>
          </div>

          <div className="pt-2 border-t border-border/50 space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-2" />
              Last visit: {patient.lastVisit}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-2" />
              Next visit: {patient.nextVisit}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-2" />
              {patient.location}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};