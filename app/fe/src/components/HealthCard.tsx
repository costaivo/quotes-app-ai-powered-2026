import type { HealthStatus } from "../types/api";

interface HealthCardProps {
  healthStatus: HealthStatus;
}

export function HealthCard({ healthStatus }: HealthCardProps) {
  return (
    <div className="card">
      <h3>System Health Status</h3>
      <p>
        <strong>Overall Status:</strong>
        <span
          style={{
            color: healthStatus.status === "healthy" ? "green" : "red",
            marginLeft: "8px",
          }}
        >
          {healthStatus.status.toUpperCase()}
        </span>
      </p>
      <p>
        <strong>Timestamp:</strong> {new Date(healthStatus.timestamp).toLocaleString()}
      </p>
      <p>
        <strong>Uptime:</strong> {Math.floor(healthStatus.uptime / 60)}m{" "}
        {healthStatus.uptime % 60}s
      </p>

      <h4>Health Checks:</h4>

      <div style={{ marginLeft: "20px" }}>
        <p>
          <strong>Database:</strong>
          <span
            style={{
              color: healthStatus.checks.database.status === "healthy" ? "green" : "red",
              marginLeft: "8px",
            }}
          >
            {healthStatus.checks.database.status.toUpperCase()}
          </span>
          {healthStatus.checks.database.message && (
            <span> - {healthStatus.checks.database.message}</span>
          )}
        </p>

        <p>
          <strong>Application:</strong>
          <span
            style={{
              color: healthStatus.checks.application.status === "healthy" ? "green" : "red",
              marginLeft: "8px",
            }}
          >
            {healthStatus.checks.application.status.toUpperCase()}
          </span>
          {healthStatus.checks.application.message && (
            <span> - {healthStatus.checks.application.message}</span>
          )}
        </p>

        <p>
          <strong>Memory:</strong>
          <span
            style={{
              color: healthStatus.checks.memory.status === "healthy" ? "green" : "red",
              marginLeft: "8px",
            }}
          >
            {healthStatus.checks.memory.status.toUpperCase()}
          </span>
          <span>
            {" "}
            - {healthStatus.checks.memory.used}MB / {healthStatus.checks.memory.total}MB (
            {healthStatus.checks.memory.percentage}%)
          </span>
        </p>
      </div>
    </div>
  );
}
