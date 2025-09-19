import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionController } from './controllers/version.controller';
import { QuotesController } from './controllers/quotes.controller';
import { VersionService } from './services/version.service';
import { QuoteRepository } from './repositories/quote.repository';
import { QuoteService } from './services/quote.service';
import { getDatabaseConfig } from './config/database.config';
import { Quote } from './entities/quote.entity';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { MiddlewareModule } from './common/middleware/middleware.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([Quote]),
    MiddlewareModule,
  ],
  controllers: [VersionController, QuotesController],
  providers: [
    VersionService,
    QuoteRepository,
    QuoteService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}