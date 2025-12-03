import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';

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

@Injectable()
export class HealthService {
  private readonly startTime: number;

  constructor(
    @InjectDataSource()
    private readonly _dataSource: DataSource,
  ) {
    this.startTime = Date.now();
  }

  async checkDatabase(): Promise<{ status: 'healthy' | 'unhealthy'; message?: string }> {
    try {
      if (!this._dataSource.isInitialized) {
        return {
          status: 'unhealthy',
          message: 'Database connection not initialized',
        };
      }

      await this._dataSource.query('SELECT 1');
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Database check failed',
      };
    }
  }

  checkApplication(): { status: 'healthy' | 'unhealthy'; message?: string } {
    try {
      const uptime = Date.now() - this.startTime;
      if (uptime < 0) {
        return {
          status: 'unhealthy',
          message: 'Invalid uptime calculation',
        };
      }
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Application check failed',
      };
    }
  }

  checkMemory(): {
    status: 'healthy' | 'unhealthy';
    used: number;
    total: number;
    percentage: number;
  } {
    const usage = process.memoryUsage();
    const used = usage.heapUsed;
    const total = usage.heapTotal;
    const percentage = (used / total) * 100;

    // Consider memory unhealthy if usage exceeds 90%
    const status: 'healthy' | 'unhealthy' = percentage > 90 ? 'unhealthy' : 'healthy';

    return {
      status,
      used: Math.round(used / 1024 / 1024), // Convert to MB
      total: Math.round(total / 1024 / 1024), // Convert to MB
      percentage: Math.round(percentage * 100) / 100,
    };
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const [databaseCheck, applicationCheck] = await Promise.all([
      this.checkDatabase(),
      Promise.resolve(this.checkApplication()),
    ]);

    const memoryCheck = this.checkMemory();

    const overallStatus: 'healthy' | 'unhealthy' =
      databaseCheck.status === 'healthy' &&
      applicationCheck.status === 'healthy' &&
      memoryCheck.status === 'healthy'
        ? 'healthy'
        : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.round((Date.now() - this.startTime) / 1000), // Uptime in seconds
      checks: {
        database: databaseCheck,
        application: applicationCheck,
        memory: memoryCheck,
      },
    };
  }
}
