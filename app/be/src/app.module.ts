import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { QuoteRepository } from './repositories/quote.repository';
import { QuoteService } from './services/quote.service';
import { getDatabaseConfig } from './config/database.config';
import { Quote } from './entities/quote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([Quote]),
  ],
  controllers: [VersionController],
  providers: [VersionService, QuoteRepository, QuoteService],
})
export class AppModule {}