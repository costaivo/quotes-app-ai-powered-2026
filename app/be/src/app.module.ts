import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
  ],
  controllers: [VersionController],
  providers: [VersionService],
})
export class AppModule {}
