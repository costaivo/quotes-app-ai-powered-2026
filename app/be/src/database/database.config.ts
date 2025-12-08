import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'quotes_app',
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],

    // Disable synchronize when using migrations to avoid conflicts
    // Let migrations handle schema updates instead
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: true,
  };

  // Log database connection details (redact password for security)
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Database Configuration:`);
    console.log(`  Host: ${config.host}`);
    console.log(`  Port: ${config.port}`);
    console.log(`  Username: ${config.username}`);
    console.log(`  Database: ${config.database}`);
  }

  return config;
};
