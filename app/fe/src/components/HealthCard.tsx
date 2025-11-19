import type { HealthStatus } from "../types/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, HardDrive, Activity } from "lucide-react";

interface HealthCardProps {
  healthStatus: HealthStatus;
}

const getStatusColor = (status: string) => {
  return status === "healthy"
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
};

const getStatusBgColor = (status: string) => {
  return status === "healthy" ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950";
};

const StatusIcon = ({ status }: { status: string }) => {
  return status === "healthy" ? (
    <CheckCircle2 className={`h-4 w-4 ${getStatusColor(status)}`} />
  ) : (
    <AlertCircle className={`h-4 w-4 ${getStatusColor(status)}`} />
  );
};

export function HealthCard({ healthStatus }: HealthCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            System Health Status
          </CardTitle>
          <span
            className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(healthStatus.status)}`}
          >
            <StatusIcon status={healthStatus.status} />
            {healthStatus.status.toUpperCase()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Timestamp</p>
            <p className="font-medium">{new Date(healthStatus.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Uptime</p>
            <p className="font-medium">
              {Math.floor(healthStatus.uptime / 60)}m {healthStatus.uptime % 60}s
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold text-sm">Health Checks</h4>

          <div
            className={`rounded-lg p-3 ${getStatusBgColor(healthStatus.checks.database.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="font-medium">Database</span>
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(healthStatus.checks.database.status)}`}
              >
                <StatusIcon status={healthStatus.checks.database.status} />
                {healthStatus.checks.database.status.toUpperCase()}
              </span>
            </div>
            {healthStatus.checks.database.message && (
              <p className="text-xs mt-1 text-muted-foreground">
                {healthStatus.checks.database.message}
              </p>
            )}
          </div>

          <div
            className={`rounded-lg p-3 ${getStatusBgColor(healthStatus.checks.application.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Application</span>
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(healthStatus.checks.application.status)}`}
              >
                <StatusIcon status={healthStatus.checks.application.status} />
                {healthStatus.checks.application.status.toUpperCase()}
              </span>
            </div>
            {healthStatus.checks.application.message && (
              <p className="text-xs mt-1 text-muted-foreground">
                {healthStatus.checks.application.message}
              </p>
            )}
          </div>

          <div className={`rounded-lg p-3 ${getStatusBgColor(healthStatus.checks.memory.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="font-medium">Memory</span>
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(healthStatus.checks.memory.status)}`}
              >
                <StatusIcon status={healthStatus.checks.memory.status} />
                {healthStatus.checks.memory.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              {healthStatus.checks.memory.used}MB / {healthStatus.checks.memory.total}MB (
              {healthStatus.checks.memory.percentage}%)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
