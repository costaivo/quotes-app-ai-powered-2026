import { useState, useEffect } from 'react';
import type { VersionInfo, HealthStatus } from '../types/api';

export function useAppData() {
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
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
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
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    versionInfo,
    healthStatus,
    loading,
    error,
  };
}
