import { useState, useEffect } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

interface VersionInfo {
  name: string;
  version: string;
  description: string;
}

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: "healthy" | "unhealthy";
      message?: string;
    };
    application: {
      status: "healthy" | "unhealthy";
      message?: string;
    };
    memory: {
      status: "healthy" | "unhealthy";
      used: number;
      total: number;
      percentage: number;
    };
  };
}

function App() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch version and health data in parallel
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const [versionResponse, healthResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/version`),
          fetch(`${apiBaseUrl}/api/health`),
        ]);

        if (!versionResponse.ok) {
          throw new Error(`Version API error: ${versionResponse.status}`);
        }
        if (!healthResponse.ok) {
          throw new Error(`Health API error: ${healthResponse.status}`);
        }

        const versionData: VersionInfo = await versionResponse.json();
        const healthData: HealthStatus = await healthResponse.json();

        setVersionInfo(versionData);
        setHealthStatus(healthData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Quotes App - AI Powered 2026</h1>

      {loading && <p>Loading application data...</p>}

      {error && (
        <div className="card" style={{ backgroundColor: "#ffe6e6" }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {versionInfo && (
        <div className="card">
          <h3>Application Version</h3>
          <p>
            <strong>Name:</strong> {versionInfo.name}
          </p>
          <p>
            <strong>Version:</strong> {versionInfo.version}
          </p>
          <p>
            <strong>Description:</strong> {versionInfo.description}
          </p>
        </div>
      )}

      {healthStatus && (
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
      )}

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
