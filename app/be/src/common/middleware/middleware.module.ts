import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RateLimitMiddleware, RateLimitFactory } from './rate-limit.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply rate limiting to like/unlike endpoints
    consumer
      .apply(RateLimitFactory.forLikeEndpoints())
      .forRoutes('quotes/*/like', 'quotes/*/unlike');
  }
}
