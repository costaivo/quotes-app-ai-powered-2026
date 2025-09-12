import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Quote } from '../entities/quote.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'quotes_app',
    entities: [Quote],
    synchronize: !isProduction, // Never synchronize in production
    logging: isDevelopment, // Only log in development
    migrations: ['dist/migrations/*.js'], // Production migrations path
    migrationsRun: isProduction, // Auto-run migrations in production
    ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL for production
    extra: {
      // Connection pool settings for production
      max: isProduction ? 20 : 10,
      idleTimeoutMillis: isProduction ? 30000 : 10000,
      connectionTimeoutMillis: isProduction ? 2000 : 1000,
    },
  };
};
