import { DataSource } from 'typeorm';
import { getCiDatabaseConfig } from '../../src/config/database.ci.config';
import { Quote } from '../../src/entities/quote.entity';

export class DatabaseTestUtils {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      ...getCiDatabaseConfig(),
      entities: [Quote],
    });
  }

  async setup(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log('✅ Database connection established');
      
      // Drop and recreate schema for clean test runs
      if (this.dataSource.options.synchronize) {
        await this.dataSource.synchronize();
        console.log('✅ Database schema synchronized');
      }
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      throw error;
    }
  }

  async teardown(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        console.log('✅ Database connection closed');
      }
    } catch (error) {
      console.error('❌ Database teardown failed:', error);
      throw error;
    }
  }

  async clearData(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        // Clear all data from quotes table
        await this.dataSource.getRepository(Quote).clear();
        console.log('✅ Database data cleared');
      }
    } catch (error) {
      console.error('❌ Database clear failed:', error);
      throw error;
    }
  }

  async resetSchema(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        // Drop and recreate schema
        await this.dataSource.dropDatabase();
        await this.dataSource.synchronize();
        console.log('✅ Database schema reset');
      }
    } catch (error) {
      console.error('❌ Database schema reset failed:', error);
      throw error;
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async isConnected(): Promise<boolean> {
    try {
      return this.dataSource.isInitialized;
    } catch {
      return false;
    }
  }

  async waitForConnection(timeoutMs: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (await this.isConnected()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Database connection timeout after ${timeoutMs}ms`);
  }
}

// Global instance for shared use across tests
export const dbTestUtils = new DatabaseTestUtils();
