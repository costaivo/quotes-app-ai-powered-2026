import { Quote } from '../entities/quote.entity';

export const getCiDatabaseConfig = (): any => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'quotes_test',
    entities: [Quote],
    synchronize: true, // Allow schema synchronization for CI tests
    dropSchema: true, // Drop and recreate schema for clean test runs
    logging: false, // Disable logging for CI performance
    ssl: false, // No SSL for local CI environment
    extra: {
      // Connection pool settings optimized for CI
      max: 5, // Smaller pool for CI
      idleTimeoutMillis: 5000, // Shorter timeout for CI
      connectionTimeoutMillis: 2000, // Quick connection timeout
    },
  };
};
