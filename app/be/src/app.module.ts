import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { VersionModule } from './version/version.module';
import { QuotesModule } from './quotes/quotes.module';

@Module({
  imports: [DatabaseModule, VersionModule, HealthModule, QuotesModule],
})
export class AppModule {}
