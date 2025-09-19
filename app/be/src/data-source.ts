import { DataSource } from 'typeorm';
import { Quote } from './entities/quote.entity';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'quotes_app',
  entities: [Quote],
  migrations: isProduction ? ['dist/migrations/*.js'] : ['src/migrations/CreateQuotesTable1680000000000.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always use migrations
  logging: isDevelopment,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: {
    max: isProduction ? 20 : 10,
    idleTimeoutMillis: isProduction ? 30000 : 10000,
    connectionTimeoutMillis: isProduction ? 2000 : 1000,
  },
});
