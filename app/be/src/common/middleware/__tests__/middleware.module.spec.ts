import { Test, TestingModule } from '@nestjs/testing';
import { MiddlewareConsumer } from '@nestjs/common';
import { MiddlewareModule } from '../middleware.module';
import { RateLimitFactory } from '../rate-limit.middleware';

// Custom mock for MiddlewareConsumer to support chaining
const mockMiddlewareConsumer = {
  apply: jest.fn().mockReturnThis(),
  forRoutes: jest.fn().mockReturnThis(),
};

describe('MiddlewareModule', () => {
  let module: MiddlewareModule;
  let consumer: MiddlewareConsumer;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        MiddlewareModule,
        {
          provide: 'MiddlewareConsumer',
          useValue: mockMiddlewareConsumer,
        },
      ],
    }).compile();

    module = testingModule.get<MiddlewareModule>(MiddlewareModule);
    consumer = mockMiddlewareConsumer as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should configure rate limiting for like endpoints', () => {
    module.configure(consumer);

    // Verify that apply was called with a function (the middleware)
    expect(mockMiddlewareConsumer.apply).toHaveBeenCalledWith(expect.any(Function));

    // Verify that forRoutes was called with the correct routes
    expect(mockMiddlewareConsumer.forRoutes).toHaveBeenCalledWith(
      'quotes/*/like',
      'quotes/*/unlike',
    );
  });

  it('should use RateLimitFactory.forLikeEndpoints()', () => {
    const forLikeEndpointsSpy = jest.spyOn(
      RateLimitFactory,
      'forLikeEndpoints',
    );
    
    module.configure(consumer);

    // Verify that RateLimitFactory.forLikeEndpoints was called
    expect(forLikeEndpointsSpy).toHaveBeenCalled();
  });
});
