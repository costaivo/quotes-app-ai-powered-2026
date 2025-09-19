import { Test, TestingModule } from '@nestjs/testing';
import { MiddlewareConsumer } from '@nestjs/common';
import { MiddlewareModule } from '../middleware.module';
import { RateLimitFactory } from '../rate-limit.middleware';

describe('MiddlewareModule', () => {
  let module: MiddlewareModule;
  let mockConsumer: jest.Mocked<MiddlewareConsumer>;

  beforeEach(async () => {
    mockConsumer = {
      apply: jest.fn().mockReturnThis(),
      forRoutes: jest.fn().mockReturnThis(),
    } as any;

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [MiddlewareModule],
    }).compile();

    module = testingModule.get<MiddlewareModule>(MiddlewareModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should configure rate limiting for like endpoints', () => {
    // Mock the configure method
    const configureSpy = jest.spyOn(module, 'configure');
    configureSpy.mockImplementation((consumer: MiddlewareConsumer) => {
      consumer.apply(RateLimitFactory.forLikeEndpoints()).forRoutes('quotes/*/like', 'quotes/*/unlike');
    });

    // Call configure
    module.configure(mockConsumer);

    // Verify that apply was called with the correct middleware
    expect(mockConsumer.apply).toHaveBeenCalledWith(expect.any(Object));
    
    // Verify that forRoutes was called with the correct routes
    expect(mockConsumer.forRoutes).toHaveBeenCalledWith('quotes/*/like', 'quotes/*/unlike');
  });

  it('should use RateLimitFactory.forLikeEndpoints()', () => {
    const forLikeEndpointsSpy = jest.spyOn(RateLimitFactory, 'forLikeEndpoints');
    
    // Mock the configure method
    const configureSpy = jest.spyOn(module, 'configure');
    configureSpy.mockImplementation((consumer: MiddlewareConsumer) => {
      consumer.apply(RateLimitFactory.forLikeEndpoints()).forRoutes('quotes/*/like', 'quotes/*/unlike');
    });

    // Call configure
    module.configure(mockConsumer);

    // Verify that RateLimitFactory.forLikeEndpoints was called
    expect(forLikeEndpointsSpy).toHaveBeenCalled();
  });
});
