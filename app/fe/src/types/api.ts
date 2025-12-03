export interface VersionInfo {
  name: string;
  version: string;
  description: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      message?: string;
    };
    application: {
      status: 'healthy' | 'unhealthy';
      message?: string;
    };
    memory: {
      status: 'healthy' | 'unhealthy';
      used: number;
      total: number;
      percentage: number;
    };
  };
}
