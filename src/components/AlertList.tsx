import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, CheckCircle, X, Bell } from "lucide-react";
import { useState } from "react";

export const AlertList = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "Glucose Level Alert",
      message: "Blood glucose trending upward for 3 consecutive readings",
      timestamp: "2 minutes ago",
      isRead: false,
      actionRequired: true
    },
    {
      id: 2,
      type: "warning",
      title: "Medication Reminder",
      message: "Evening metformin dose scheduled in 30 minutes",
      timestamp: "28 minutes ago",
      isRead: false,
      actionRequired: false
    },
    {
      id: 3,
      type: "info",
      title: "Weekly Report Ready",
      message: "Patient health summary for Emily Rodriguez is available",
      timestamp: "2 hours ago",
      isRead: true,
      actionRequired: false
    },
    {
      id: 4,
      type: "warning",
      title: "Missed Reading",
      message: "No glucose reading recorded for morning slot",
      timestamp: "4 hours ago",
      isRead: false,
      actionRequired: true
    },
    {
      id: 5,
      type: "success",
      title: "Target Achieved",
      message: "Blood pressure has been within target range for 7 days",
      timestamp: "1 day ago",
      isRead: true,
      actionRequired: false
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning": return <Clock className="h-4 w-4 text-warning" />;
      case "success": return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Bell className="h-4 w-4 text-info" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "border-l-destructive bg-destructive/5";
      case "warning": return "border-l-warning bg-warning/5";
      case "success": return "border-l-success bg-success/5";
      default: return "border-l-info bg-info/5";
    }
  };

  const dismissAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const markAsRead = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <Card className="medical-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
        <CardDescription>System notifications and health alerts</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-1 p-6 pt-0">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`relative p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)} 
                    ${!alert.isRead ? 'border-r border-t border-b border-border/50' : 'opacity-70'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-medium ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {alert.title}
                          </h4>
                          {alert.actionRequired && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground/80">{alert.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!alert.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-primary/10"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};